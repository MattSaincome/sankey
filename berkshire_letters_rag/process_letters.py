import os
import sys
import re
import string
from bs4 import BeautifulSoup
import pdfplumber

def extract_text_from_html(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        soup = BeautifulSoup(f, 'html.parser')
        text = soup.get_text(separator=' ', strip=True)
    return text

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ''
    return text

def process_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == '.html':
        return extract_text_from_html(file_path)
    elif ext == '.pdf':
        return extract_text_from_pdf(file_path)
    else:
        return None

def save_text(text, out_dir, original_filename):
    # Clean filename
    safe_name = re.sub(r'[^\w\-_\. ]', '_', original_filename)
    out_path = os.path.join(out_dir, safe_name + '.txt')
    with open(out_path, 'w', encoding='utf-8', errors='replace') as f:
        f.write(text)
    print(f"[SAVED] {out_path}")
    print(f"[PREVIEW] {text[:300]}\n---")

def main():
    if len(sys.argv) > 1:
        input_dir = sys.argv[1]
    else:
        input_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'OneDrive', 'Desktop', 'letters')
    input_dir = os.path.abspath(input_dir)
    out_dir = os.path.join(os.path.dirname(__file__), 'processed_letters')
    os.makedirs(out_dir, exist_ok=True)
    files = [f for f in os.listdir(input_dir) if f.lower().endswith(('.html', '.pdf'))]
    print(f"Processing {len(files)} files from {input_dir}")
    for fname in files:
        path = os.path.join(input_dir, fname)
        print(f"[PROCESS] {path}")
        try:
            text = process_file(path)
            if text and len(text.strip()) > 0:
                save_text(text, out_dir, fname)
            else:
                print(f"[SKIP] No text extracted from {fname}")
        except Exception as e:
            print(f"[ERROR] {fname}: {e}")

if __name__ == '__main__':
    main()
