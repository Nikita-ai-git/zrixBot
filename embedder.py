from agno.embedder.ollama import OllamaEmbedder
from agno.vectordb.chroma import ChromaDb
from agno.knowledge.text import TextKnowledgeBase
from agno.document.chunking.document import DocumentChunking
from agno.agent import Agent
from agno.models.ollama import Ollama

# ✅ Initialize embedder
def get_knowledge_base():

  embedder = OllamaEmbedder(id="openhermes")

# ✅ Set up Chroma vector DB
  vector_db = ChromaDb(
    collection="ollama_embeddings",
    path="vector_store/",
    persistent_client=True,
    embedder=embedder,)

# ✅ Set up knowledge base from data folder
  knowledge_base = TextKnowledgeBase(
    path="data/",  # Folder should contain your text/doc files
    vector_db=vector_db,
    chunking_strategy=DocumentChunking()
)
 
# ✅ Load and embed your files
# print("📚 Loading and embedding files from 'data/'...")
  knowledge_base.load(recreate=False)
  return knowledge_base

print("✅ Files embedded and stored.")

# done till here. ollama_embeddings helped create vector embeddings now need a retriever.

