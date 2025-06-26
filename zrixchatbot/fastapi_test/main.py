

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from jupyter import qa_chain  # ✅ Ensure this file correctly defines qa_chain

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify ["http://localhost:3000"] for frontend security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Health check or home route
@app.get("/")
def hello_world():
    return "Api is working"

# 🔹 POST: Accept JSON { "query": "..." }
class QueryRequest(BaseModel):
    query: Optional[str] = None

@app.post("/chat")
async def chat_post(request: QueryRequest):
    query = request.query.strip() if request.query else "hello"
    answer = qa_chain.run(query)
    return {"answer": answer}

# 🔹 GET: Accept query string /chat?query=...
@app.get("/chat")
def chat_get(query: Optional[str] = "hello"):
    answer = qa_chain.run(query)
    return {"answer": answer}
#