import os
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def load_documents(folder="data"):
    documents = []
    for filename in os.listdir(folder):
        path = os.path.join(folder, filename)
        with open(path, "r", encoding="utf-8") as f:
            documents.append(f.read())
    return documents


def chunk_text(text, chunk_size=250, overlap=75):
    words = text.split()
    chunks = []

    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = words[start:end]
        chunks.append(" ".join(chunk))
        start += chunk_size - overlap

    return chunks


def embed_texts(texts):
    return model.encode(texts)
