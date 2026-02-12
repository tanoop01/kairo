from fastapi import FastAPI
from pydantic import BaseModel
from agentic_rag import appgraph   # your compiled LangGraph

app = FastAPI()


class Question(BaseModel):
    question: str

@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/ask")
def ask_question(data: Question):
    result = appgraph.invoke({
        "question": data.question,
        "expanded_queries": [],
        "vector_docs": [],
        "metadata": [],
        "merged_docs": [],
        "reranked_docs": [],
        "draft_answer": "",
        "final_answer": ""
    })

    return {
        "answer": result["final_answer"]
    }
