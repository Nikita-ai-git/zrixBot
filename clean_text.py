from docx import Document
import re
import os

def load_and_clean_docx(path):
    """Load a Word doc, clean up the text, and return a list of clean paragraphs"""
    doc = Document(path)
    raw_lines = [p.text.strip() for p in doc.paragraphs if p.text.strip()]

    cleaned = []
    for line in raw_lines:
        # Normalize whitespace and remove junk
        line = re.sub(r'\s+', ' ', line)                   # Collapse multiple spaces
        line = re.sub(r'[^\x00-\x7F]+', ' ', line)         # Remove non-ASCII chars (optional)
        line = re.sub(r'http\S+|www\.\S+', '', line)       # Remove URLs
        line = re.sub(r'[“”"\'`]', '', line)               # Remove quotes
        line = line.strip(" .:-—")                         # Strip trailing punctuation

        if len(line) > 3:                                 # Keep only meaningful lines
            cleaned.append(line)

    return cleaned

def save_cleaned_text(text_lines, output_path="cleaned_output.txt"):
    """Save cleaned text lines to a .txt file"""
    with open(output_path, "w", encoding="utf-8") as f:
        for line in text_lines:
            f.write(line + "\n")
    print(f"✅ Cleaned text saved to: {output_path}")

# === RUN ===
docx_path = "output/scraped_content.docx"  # Change if your file is elsewhere
cleaned_text = load_and_clean_docx(docx_path)
save_cleaned_text(cleaned_text)
