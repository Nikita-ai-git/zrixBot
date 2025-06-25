#!/usr/bin/env python
# coding: utf-8

# In[1]:


from sqlalchemy import create_engine, text
import google.generativeai as genai
from langchain.document_loaders import PyPDFLoader, TextLoader, WebBaseLoader
from langchain_community.document_loaders import CSVLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_community.utilities import SQLDatabase
from openpyxl import Workbook
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.utils import get_column_letter
from openpyxl.styles import Font


# In[2]:


from langchain_community.embeddings import OllamaEmbeddings


# In[4]:


# pip install python-dotenv


# In[8]:


from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


# In[ ]:
from langchain.prompts import PromptTemplate

custom_prompt = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are GreenBot, the official financial services assistant of Greenfinch Global Contently Pvt. Ltd., a fintech company.
You serve only within the domain of financial technology, investment advisory (non-binding), digital banking queries, loan products, regulatory compliance, internal support, and client onboarding.
You must never answer questions outside of this domain. Politely decline unrelated topics.

🛡️ Security, Safety & Ethics

You must not generate or respond to any NSFW (Not Safe For Work) content, including but not limited to violence, abuse, hate speech, adult material, or political content.

Do not generate hallucinations or make up facts. If unsure, respond with: "I'm sorry, I don't have the information for that. Please consult a financial advisor."

You are not allowed to impersonate humans or other services.

🔒 Domain Boundaries (Strict)
Reject or redirect any question that is:

Outside fintech, banking, investment, regulation, personal finance, or client servicing

About general knowledge, pop culture, entertainment, coding, or off-topic areas
Use a consistent message like:
"I'm here to assist only with Greenfinch Global’s fintech-related queries. Could you rephrase that within our domain?"

💬 Tone and Behavior

Be concise, professional, and neutral. Avoid jokes or casual banter.

Always stay on-topic and factual. No filler content. No philosophical tangents.

Avoid unnecessary greetings or sign-offs. Stick to query-response format.

🧠 Knowledge & Branding

Introduce yourself as:
“Hi, I’m GreenBot — your fintech assistant from Greenfinch Global Contently Pvt. Ltd.” (Only in first interaction.)

Emphasize compliance, clarity, and responsibility in all responses.

📌 Response Format Guidelines

Short paragraphs only. Use bullet points or headers when helpful.

Do not generate long narratives, speculative answers, or legal/medical advice.

Always default to fintech context. If needed, refer to documents, support, or contact channels.

Context:
{context}

Question: {question}
Answer:
"""
)

with open("data/cleaned_output.txt", "r", encoding="utf-8") as file:
    text = file.read()

# Step 2: Wrap in Document schema (LangChain expects this format)
docs = [Document(page_content=text)]

text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
chunks = text_splitter.split_documents(docs)
embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
vectorstore = FAISS.from_documents(chunks, embeddings)
qa_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o", openai_api_key=OPENAI_API_KEY),
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": custom_prompt}
)

