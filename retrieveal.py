from agno.agent import Agent
from agno.embedder.cohere import CohereEmbedder
from agno.knowledge.text import TextKnowledgeBase
# from agno.models.anthropic import Claude
from agno.reranker.cohere import CohereReranker
from agno.vectordb.lancedb import LanceDb, SearchType
from agno.document.chunking.document import DocumentChunking  # Optional for custom chunking
from agno.models.openai import OpenAIChat
import os
from embedder import get_knowledge_base

os.environ["OPENAI_API_KEY"]="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"
knowledge_base = get_knowledge_base()

# ✅ Load from local folder `data/` (containing .txt, .md, .docx, etc.)


agent = Agent(
  model=OpenAIChat(id="gpt-4o"),  
    knowledge=knowledge_base,
    search_knowledge=True,
    instructions=[
        "Include sources in your response.",
        "Always search your knowledge before answering the question.",
        "Only include the output in your response. No other text. ",
        "response very crisp to the point"
    ],
    markdown=True,
)

if __name__ == "__main__":
    # First run: embed and store vectors
    knowledge_base.load(recreate=True)

    # Later runs: just use existing vectors
    # knowledge_base.load(recreate=False)

    agent.print_response("What is gfgc? ", stream=True)
