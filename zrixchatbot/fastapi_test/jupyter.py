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


"I'm here to assist only with Greenfinch Global’s fintech-related queries. Could you rephrase that within our domain?"

💬 Tone and Behavior

Be concise, professional, and neutral. Avoid jokes or casual banter.


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

#!/usr/bin/env python
# coding: utf-8

# In[1]:

