import os
import faiss
import numpy as np
import pickle
from sentence_transformers import SentenceTransformer

DATA_FOLDER = "data"
CHUNK_SIZE = 200
OVERLAP = 50

model = SentenceTransformer("all-MiniLM-L6-v2")


def load_all_documents(root_folder):
    documents = []

    for root, _, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".txt"):
                path = os.path.join(root, file)

                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()

                documents.append({
                    "source": file,
                    "text": text
                })

    return documents


def chunk_text(text, chunk_size=200, overlap=100):
    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = words[start:end]
        chunks.append(" ".join(chunk))
        start += chunk_size - overlap

    return chunks


def main():
    print("Loading legal documents...")
    docs = load_all_documents(DATA_FOLDER)

    all_chunks = []
    metadata = []

    print("Chunking...")
    for doc in docs:
        chunks = chunk_text(doc["text"], CHUNK_SIZE, OVERLAP)

        for chunk in chunks:
            all_chunks.append(chunk)
            metadata.append({
                "source": doc["source"]
            })

    print(f"Total chunks: {len(all_chunks)}")

    print("Generating embeddings...")
    embeddings = model.encode(all_chunks, show_progress_bar=True)
    embeddings = np.array(embeddings).astype("float32")

    # normalize for cosine similarity
    faiss.normalize_L2(embeddings)

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatIP(dimension)

    index.add(embeddings)

    print("Saving index...")
    faiss.write_index(index, "vector.index")

    with open("chunks.pkl", "wb") as f:
        pickle.dump(all_chunks, f)

    with open("metadata.pkl", "wb") as f:
        pickle.dump(metadata, f)

    print("Index built successfully!")


if __name__ == "__main__":
    main()
