# from fastapi import FastAPI
# from pydantic import BaseModel
# from jupyter import qa_chain  # Ensure this file defines and exposes `qa_chain`
# from typing import Optional

# app = FastAPI()

# # 🔹 Basic Hello World POST endpoint
# @app.get("/")
# def hello_world():
#     return "Hello World"
# class QueryRequest(BaseModel):
#     query: Optional[str] = None

    
# # @app.post("/chat")
# # async def chat_query(request: QueryRequest):
# #     query = request.query.strip() if request.query else "hello"  # Default to 'hello'


# #     answer = qa_chain.run(query)
# #     return {"query": query, "answer": answer}

# @app.get("/chat")
# def chat_get(query: Optional[str] = "hello"):
#     answer = qa_chain.run(query)
#     return {"query": query, "answer": answer}


from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from jupyter import qa_chain  # ✅ Ensure this file correctly defines qa_chain

app = FastAPI()

# 🔹 Health check or home route
@app.get("/")
def hello_world():
    return "Hello World"

# 🔹 POST: Accept JSON { "query": "..." }
class QueryRequest(BaseModel):
    query: Optional[str] = None

@app.post("/chat")
async def chat_post(request: QueryRequest):
    query = request.query.strip() if request.query else "hello"
    answer = qa_chain.run(query)
    return {"query": query, "answer": answer}

# 🔹 GET: Accept query string /chat?query=...
@app.get("/chat")
def chat_get(query: Optional[str] = "hello"):
    answer = qa_chain.run(query)
    return {"query": query, "answer": answer}
