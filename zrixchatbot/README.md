

## 📁 Project Workflow

### 1. Web Scraping
- **Script**: `web_scrap.py`
- Scrapes relevant financial content from the [GFGC website](https://www.gfgc.kar.nic.in).
- Output is saved in:  
  ✅ `scrap_output.txt`

### 2. Data Cleaning
- **Script**: `clean.py`
- Cleans raw scraped text (removes noise, irrelevant symbols, etc.)
- Output is saved in:  
  ✅ `cleaned_output.txt`



---

## 🚀 Running the Application

### 1. Install Requirements

```bash
pip install -r requirements.txt

2. Start the FastAPI Server

uvicorn main:app --reload
3. API Endpoints
Method	Endpoint	Description
GET	/	Health check ("API is working")
POST	/chat	Chatbot query via JSON body
GET	/chat?query=...	Query via URL param '''