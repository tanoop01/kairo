import os
import faiss
import pickle
import numpy as np
from typing import TypedDict, List
from groq import Groq
from sentence_transformers import SentenceTransformer
from langgraph.graph import StateGraph, END
from duckduckgo_search import DDGS
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

# ---------- State Definition ----------

class RAGState(TypedDict):
    question: str
    expanded_queries: List[str]
    vector_docs: List[str]
    web_docs: List[str]        # new
    metadata: List[str]
    merged_docs: List[str]
    reranked_docs: List[str]
    draft_answer: str
    final_answer: str


# ---------- Initialize Models ----------

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index("vector.index")

with open("chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

with open("metadata.pkl", "rb") as f:
    metadata = pickle.load(f)


# ---------- Agents ----------
def web_search_agent(state: RAGState) -> RAGState:
    query = state["question"]
    results = []

    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=5):
                results.append(r["body"])
    except:
        pass

    state["web_docs"] = results
    return state






def query_expander_agent(state: RAGState) -> RAGState:
    question = state["question"]

    prompt = f"""
Generate 4 short retrieval queries for this legal question.

Rules:
- Keep under 10 words
- Use legal keywords
- No explanations

Question:
{question}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    lines = response.choices[0].message.content.split("\n")
    queries = [question]

    for line in lines:
        if "." in line:
            q = line.split(".", 1)[1].strip()
            if q:
                queries.append(q)

    state["expanded_queries"] = queries[:5]
    return state


def vector_retriever_agent(state: RAGState) -> RAGState:
    queries = state["expanded_queries"]
    all_indices = {}

    for q in queries:
        vec = embed_model.encode([q])
        vec = np.array(vec).astype("float32")
        faiss.normalize_L2(vec)

        distances, indices = index.search(vec, 12)

        for dist, idx in zip(distances[0], indices[0]):
            if idx not in all_indices or dist > all_indices[idx]:
                all_indices[idx] = dist

    sorted_indices = sorted(all_indices.items(), key=lambda x: x[1], reverse=True)

    docs = []
    sources = []

    for i in sorted_indices[:12]:
        idx = i[0]
        docs.append(chunks[idx])
        sources.append(metadata[idx]["source"])

    state["vector_docs"] = docs
    state["metadata"] = sources
    return state


def merge_agent(state: RAGState) -> RAGState:
    merged = []

    merged.extend(state.get("vector_docs", []))
    merged.extend(state.get("web_docs", []))

    state["merged_docs"] = merged
    return state


def relevance_filter_agent(state: RAGState) -> RAGState:
    question = state["question"]
    docs = state["vector_docs"]
    sources = state["metadata"]

    filtered_docs = []
    filtered_sources = []

    for doc, src in zip(docs, sources):
        prompt = f"""
You are a legal relevance checker.

Question:
{question}

Document:
{doc}

Is this document directly relevant to answering the question?

Answer only:
YES
or
NO
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        decision = response.choices[0].message.content.strip().upper()

        if "YES" in decision:
            filtered_docs.append(doc)
            filtered_sources.append(src)

    # fallback if nothing passes
    if not filtered_docs:
        filtered_docs = docs[:3]
        filtered_sources = sources[:3]

    state["vector_docs"] = filtered_docs
    state["metadata"] = filtered_sources
    return state


def rerank_agent(state: RAGState) -> RAGState:
    question = state["question"]
    docs = state["merged_docs"][:10]

    context = "\n\n".join(docs)

    prompt = f"""
Select the most relevant legal passages for this question.

Question:
{question}

Context:
{context}

Return only the most relevant parts.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    state["reranked_docs"] = [response.choices[0].message.content]
    return state


def answer_generator_agent(state: RAGState) -> RAGState:
    question = state["question"]
    context = "\n\n".join(state["reranked_docs"])

    prompt = f"""
You are a legal assistant.

Rules:
- Use ONLY the provided context.
- Do not invent laws.
- Provide a detailed answer.

Context:
{context}

Question:
{question}

Answer:
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    state["draft_answer"] = response.choices[0].message.content
    return state


def answer_refiner_agent(state: RAGState) -> RAGState:
    question = state["question"]
    context = "\n\n".join(state["reranked_docs"])
    draft = state["draft_answer"]
    sources = ", ".join(set(state["metadata"]))

    prompt = f"""
You are a legal answer verifier.

Your job:
- Compare the draft answer with the provided context.
- Remove any irrelevant, incorrect, or unsupported information.
- you can add new information if you didnt find in the text give importance to web search result.
- Keep only what is directly supported by the context.
- If multiple laws are mixed incorrectly, keep only the relevant one.
- eloborate on key points with more details from the context.
- dont mention that web search in being used but give more importance to it if you find relevant information in it.

Context:
{context}

Draft Answer:
{draft}

Question:
{question}

Return a cleaned and accurate final answer.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    final = response.choices[0].message.content
    final += f"\n\nSources: {sources}"

    state["final_answer"] = final
    return state



# ---------- Build Graph ----------

graph = StateGraph(RAGState)

# Nodes
graph.add_node("expander", query_expander_agent)
graph.add_node("retriever", vector_retriever_agent)
graph.add_node("web", web_search_agent)
graph.add_node("filter", relevance_filter_agent)
graph.add_node("merge", merge_agent)
graph.add_node("rerank", rerank_agent)
graph.add_node("generator", answer_generator_agent)
graph.add_node("refiner", answer_refiner_agent)

# Entry point
graph.set_entry_point("expander")

# Edges (flow)
graph.add_edge("expander", "retriever")
graph.add_edge("retriever", "web")
graph.add_edge("web", "filter")
graph.add_edge("filter", "merge")
graph.add_edge("merge", "rerank")
graph.add_edge("rerank", "generator")
graph.add_edge("generator", "refiner")
graph.add_edge("refiner", END)

# Compile graph
appgraph = graph.compile()


# ---------- Run ----------

if __name__ == "__main__":
    while True:
        question = input("\nAsk a legal question: ")

        result = app.invoke({
            "question": question,
            "expanded_queries": [],
            "vector_docs": [],
            "web_docs": [],        # required for web agent
            "metadata": [],
            "merged_docs": [],
            "reranked_docs": [],
            "draft_answer": "",
            "final_answer": ""
        })

        print("\nAnswer:")
        print(result["final_answer"])
