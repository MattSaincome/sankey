import os
import glob
import re
import json
from bs4 import BeautifulSoup
import PyPDF2
from typing import Dict, List, Tuple

# Directories
INPUT_DIR = "berkshire_letters_rag/letters_raw"
OUTPUT_DIR = "berkshire_letters_rag/processed_letters"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_text_from_html(file_path: str) -> str:
    """Extract text content from HTML files."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            html_content = f.read()
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(['script', 'style']):
            script.extract()
        
        # Get text content
        text = soup.get_text(separator=' ', strip=True)
        
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n+', '\n', text)
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from HTML {file_path}: {e}")
        return ""

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text content from PDF files."""
    try:
        text = ""
        with open(file_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n"
        
        # Clean up whitespace
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n+', '\n', text)
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF {file_path}: {e}")
        return ""

def process_file(file_path: str) -> Tuple[int, str]:
    """Process a file and extract its text based on file type."""
    filename = os.path.basename(file_path)
    file_ext = os.path.splitext(filename)[1].lower()
    
    # Extract year from filename (format: YYYY_...)
    year_match = re.match(r'(\d{4})_', filename)
    if year_match:
        year = int(year_match.group(1))
    else:
        year = 0  # Default if no year found
    
    print(f"Processing {filename} from {year}...")
    
    # Extract text based on file type
    if file_ext in ['.html', '.htm']:
        text = extract_text_from_html(file_path)
    elif file_ext == '.pdf':
        text = extract_text_from_pdf(file_path)
    else:
        print(f"Unsupported file type: {file_ext} for {filename}")
        return year, ""
    
    return year, text

def save_processed_text(year: int, text: str) -> str:
    """Save processed text to output directory."""
    if not text:
        return ""
    
    output_file = os.path.join(OUTPUT_DIR, f"{year}_letter.txt")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    return output_file

def process_all_letters():
    """Process all letters in the input directory."""
    # Get all files except the inventory file
    all_files = [f for f in glob.glob(os.path.join(INPUT_DIR, "*.*")) 
                if not f.endswith("_inventory.txt") and not f.endswith(".json")]
    
    # Dictionary to track processed files by year
    processed_files = {}
    
    # Process each file
    for file_path in all_files:
        year, text = process_file(file_path)
        
        if not text:
            continue
        
        # If we already have a letter for this year, choose the one with more content
        if year in processed_files:
            existing_text = processed_files[year]['text']
            if len(text) > len(existing_text):
                processed_files[year] = {
                    'file': file_path,
                    'text': text
                }
        else:
            processed_files[year] = {
                'file': file_path,
                'text': text
            }
    
    # Save processed texts
    for year, data in processed_files.items():
        output_file = save_processed_text(year, data['text'])
        if output_file:
            print(f"Saved processed text for {year} to {output_file}")
    
    # Create a summary file
    summary = {
        "total_letters": len(processed_files),
        "years": sorted(list(processed_files.keys())),
        "letter_details": {year: {
            "source_file": os.path.basename(data["file"]),
            "text_length": len(data["text"]),
            "processed_file": f"{year}_letter.txt"
        } for year, data in processed_files.items()}
    }
    
    with open(os.path.join(OUTPUT_DIR, "processed_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nProcessing complete! Processed {len(processed_files)} letters.")
    print(f"Processed letters saved to: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Summary saved to: {os.path.join(OUTPUT_DIR, 'processed_summary.json')}")

if __name__ == "__main__":
    process_all_letters()
