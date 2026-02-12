import faiss
import pickle
import numpy as np
import os
from rag_utils import embed_texts
from groq import Groq

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# Load vector index
index = faiss.read_index("vector.index")

# Load chunks
with open("chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

def expand_query(query):
    prompt = f"""
Generate 3 short alternative search queries for retrieval.

Rules:
- Keep them under 10 words.
- Focus on keywords.
- Do not repeat the original question.
- Do not add explanations.

Question:
{query}

Return only the queries as a numbered list.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    text = response.choices[0].message.content
    lines = text.split("\n")

    queries = [query]

    for line in lines:
        if "." in line:
            q = line.split(".", 1)[1].strip()
            if q:
                queries.append(q)

    return queries[:4]



def retrieve(query, k=15):
    expanded_queries = expand_query(query)

    # build flat list of all queries
    queries = []

    for q in expanded_queries:
        queries.append(q)
        queries.append(f"{q} news")
        queries.append(f"{q} update")
        queries.append(f"{q} announcement")

    all_indices = {}
    
    for q in queries:
        query_vec = embed_texts([q])
        query_vec = np.array(query_vec).astype("float32")
        faiss.normalize_L2(query_vec)

        distances, indices = index.search(query_vec, k)

        for dist, idx in zip(distances[0], indices[0]):
            # keep best score per chunk
            if idx not in all_indices or dist < all_indices[idx]:
                all_indices[idx] = dist

    # sort by distance (better ranking)
    sorted_indices = sorted(all_indices.items(), key=lambda x: x[1])

    results = [chunks[i[0]] for i in sorted_indices[:k]]
    return results


def generate_answer(context, question):
    prompt = f"""
You are a factual assistant.

Rules:
- Use ONLY the provided context.
- Do not invent information.
- If unsure, say: "Not found in documents."

Instructions:
- Provide a detailed answer.
- Combine information from multiple parts of the context.
- Mention key facts clearly.

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.1  # lower = more factual
    )

    return response.choices[0].message.content


def main():
    while True:
        question = input("\nAsk a question: ")

        retrieved = retrieve(question)
        context = "\n\n".join(retrieved)

        answer = generate_answer(context, question)

        print("\nAnswer:")
        print(answer)


if __name__ == "__main__":
    main()
