import os
import glob
import re
import json
import fitz  # PyMuPDF
from bs4 import BeautifulSoup
from PIL import Image
import io
import PyPDF2
from typing import Dict, List, Tuple, Optional
import nltk
from nltk.tokenize import sent_tokenize
from collections import defaultdict

# Make pytesseract optional
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    TESSERACT_AVAILABLE = False
    print("Note: pytesseract not available. OCR for images in PDFs will be skipped.")

# Download NLTK data for better sentence tokenization
try:
    nltk.download('punkt')
except Exception as e:
    print(f"Warning: Could not download NLTK punkt data: {e}")
    print("Using simplified sentence detection instead.")

# Directories
INPUT_DIR = "berkshire_letters_rag/letters_raw"
OUTPUT_DIR = "berkshire_letters_rag/enhanced_letters"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def extract_text_from_html(file_path: str) -> str:
    """Extract text content from HTML files with improved cleaning."""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
            html_content = f.read()
        
        # Parse HTML with BeautifulSoup
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove script, style elements, and hidden elements
        for element in soup(['script', 'style', 'meta', 'noscript', 'header', 'footer']):
            element.extract()
        
        # Handle tables better - convert to structured text
        for table in soup.find_all('table'):
            table_text = []
            for row in table.find_all('tr'):
                cells = row.find_all(['td', 'th'])
                row_text = ' | '.join(cell.get_text(strip=True) for cell in cells)
                table_text.append(row_text)
            
            # Replace table with its text representation
            table_str = '\n'.join(table_text)
            table.replace_with(soup.new_string(f"\nTABLE:\n{table_str}\n"))
        
        # Get text content
        text = soup.get_text(separator=' ', strip=True)
        
        # Clean up whitespace and normalize
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r' +', ' ', text)
        
        # Clean up common OCR and encoding artifacts
        text = re.sub(r'[^\x00-\x7F]+', ' ', text)  # Remove non-ASCII
        
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from HTML {file_path}: {e}")
        return ""

def extract_text_from_pdf_with_pymupdf(file_path: str) -> str:
    """Extract text and handle images from PDF using PyMuPDF (better quality)."""
    try:
        text_pages = []
        
        # Open PDF with PyMuPDF
        doc = fitz.open(file_path)
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Extract text from the page
            page_text = page.get_text("text")
            
            # Check if the page might be scanned (little or no text)
            if len(page_text.strip()) < 100:
                # Extract images and use OCR as fallback
                images = page.get_images(full=True)
                
                if images:
                    for img_index, img_info in enumerate(images):
                        xref = img_info[0]
                        base_image = doc.extract_image(xref)
                        image_bytes = base_image["image"]
                        
                        # Use PIL and pytesseract for OCR if available
                        image = Image.open(io.BytesIO(image_bytes))
                        if TESSERACT_AVAILABLE:
                            try:
                                image_text = pytesseract.image_to_string(image)
                                if image_text.strip():
                                    page_text += f"\n{image_text}\n"
                            except Exception as ocr_err:
                                print(f"OCR error on image in {file_path}, page {page_num}: {ocr_err}")
                        else:
                            # Skip OCR if not available
                            pass
            
            text_pages.append(page_text)
        
        # Combine all pages
        full_text = "\n".join(text_pages)
        
        # Clean up text
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = re.sub(r'\n+', '\n', full_text)
        
        return full_text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF with PyMuPDF {file_path}: {e}")
        # Fall back to PyPDF2 if PyMuPDF fails
        return extract_text_from_pdf_with_pypdf2(file_path)

def extract_text_from_pdf_with_pypdf2(file_path: str) -> str:
    """Extract text from PDF using PyPDF2 (fallback method)."""
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
        print(f"Error extracting text from PDF with PyPDF2 {file_path}: {e}")
        return ""

def simple_sent_tokenize(text: str) -> List[str]:
    """Simple sentence tokenizer as fallback if NLTK fails."""
    # Basic sentence-ending punctuation followed by space and uppercase letter
    return re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)

def clean_and_normalize_text(text: str) -> str:
    """Perform deep cleaning and normalization of extracted text."""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = re.sub(r'\s+', ' ', text)
    
    # Fix common OCR errors
    text = re.sub(r'(\d),(\d)', r'\1\2', text)  # Fix comma in numbers
    
    # Handle special characters and normalize quotes
    text = text.replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    
    # Normalize newlines
    text = re.sub(r'\n+', '\n', text)
    
    # Fix sentence boundaries
    try:
        sentences = sent_tokenize(text)
    except Exception:
        # Fallback to simple tokenization if NLTK fails
        sentences = simple_sent_tokenize(text)
        
    text = ' '.join(sentences)
    
    return text.strip()

def extract_tables_from_text(text: str) -> Tuple[str, List[Dict]]:
    """Extract potential tables from text based on patterns."""
    table_patterns = [
        r'((?:\d+\s*\|\s*){2,}(?:\d+))',  # Number tables with pipe separators
        r'(\$[\d,]+\s+\$[\d,]+\s+\$[\d,]+)'  # Dollar amount tables
    ]
    
    extracted_tables = []
    cleaned_text = text
    
    for pattern in table_patterns:
        matches = re.finditer(pattern, text)
        for i, match in enumerate(matches):
            table_text = match.group(0)
            table_dict = {
                "id": f"table_{i+1}",
                "content": table_text,
                "start_pos": match.start(),
                "end_pos": match.end()
            }
            extracted_tables.append(table_dict)
            
            # Mark the table location in the text
            marker = f"\n[TABLE {i+1}]\n"
            cleaned_text = cleaned_text.replace(table_text, marker)
    
    return cleaned_text, extracted_tables

def classify_letter_section(text_chunk: str) -> Optional[str]:
    """Attempt to classify a section of the letter."""
    section_keywords = {
        "introduction": ["dear shareholders", "to the shareholders", "warren", "chairman"],
        "financial_performance": ["earnings", "income", "revenue", "profit", "loss", "financial results"],
        "investments": ["investment", "stock", "portfolio", "holdings", "equity"],
        "acquisitions": ["acquisition", "purchase", "bought", "buying", "takeover"],
        "operations": ["insurance", "operations", "manufacturing", "retail", "energy"],
        "outlook": ["future", "outlook", "expect", "anticipate", "forward"],
        "conclusion": ["sincerely", "regards", "thank you", "conclusion"]
    }
    
    # Convert text to lowercase for case-insensitive matching
    lower_text = text_chunk.lower()
    
    # Count keyword occurrences for each section
    section_scores = defaultdict(int)
    for section, keywords in section_keywords.items():
        for keyword in keywords:
            count = lower_text.count(keyword)
            section_scores[section] += count
    
    # Return the section with the highest score, if any
    if section_scores:
        best_section = max(section_scores.items(), key=lambda x: x[1])
        if best_section[1] > 0:
            return best_section[0]
    
    return None

def process_file(file_path: str) -> Tuple[int, Dict]:
    """Process a file and extract its text with enhanced metadata."""
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
        # Try with PyMuPDF first (better quality)
        text = extract_text_from_pdf_with_pymupdf(file_path)
    else:
        print(f"Unsupported file type: {file_ext} for {filename}")
        return year, {}
    
    # If extraction failed, return empty
    if not text:
        print(f"Failed to extract text from {filename}")
        return year, {}
    
    # Clean and normalize the text
    text = clean_and_normalize_text(text)
    
    # Extract tables
    cleaned_text, tables = extract_tables_from_text(text)
    
    # Split into paragraphs
    paragraphs = [p.strip() for p in cleaned_text.split('\n') if p.strip()]
    
    # Classify sections
    sections = []
    for i, para in enumerate(paragraphs):
        section_type = classify_letter_section(para)
        if section_type:
            sections.append({
                "index": i,
                "type": section_type,
                "text": para[:100] + "..."  # Preview for identification
            })
    
    # Create metadata
    metadata = {
        "year": year,
        "filename": filename,
        "file_path": file_path,
        "word_count": len(text.split()),
        "character_count": len(text),
        "paragraph_count": len(paragraphs),
        "has_tables": len(tables) > 0,
        "tables": tables,
        "identified_sections": sections
    }
    
    # Create result object
    result = {
        "text": text,
        "paragraphs": paragraphs,
        "metadata": metadata
    }
    
    return year, result

def save_processed_text(year: int, result: Dict) -> str:
    """Save processed text and metadata to output directory."""
    if not result:
        return ""
    
    # Save text
    text_file = os.path.join(OUTPUT_DIR, f"{year}_letter.txt")
    with open(text_file, 'w', encoding='utf-8') as f:
        f.write(result["text"])
    
    # Save metadata separately
    meta_file = os.path.join(OUTPUT_DIR, f"{year}_metadata.json")
    with open(meta_file, 'w', encoding='utf-8') as f:
        # Remove the full text from metadata to avoid duplication
        metadata_copy = result["metadata"].copy()
        json.dump(metadata_copy, f, indent=2)
    
    # Save paragraphs separately
    para_file = os.path.join(OUTPUT_DIR, f"{year}_paragraphs.json")
    with open(para_file, 'w', encoding='utf-8') as f:
        json.dump(result["paragraphs"], f, indent=2)
    
    return text_file

def process_all_letters():
    """Process all letters in the input directory with enhanced extraction."""
    # Get all files except inventory files
    all_files = [f for f in glob.glob(os.path.join(INPUT_DIR, "*.*")) 
                if not f.endswith("_inventory.txt") and not f.endswith(".json")]
    
    # Dictionary to track processed files by year
    processed_files = {}
    
    # Process each file
    for file_path in all_files:
        year, result = process_file(file_path)
        
        if not result:
            continue
        
        # If we already have a letter for this year, choose the one with more content
        if year in processed_files:
            existing_result = processed_files[year]
            if len(result["text"]) > len(existing_result["text"]):
                processed_files[year] = result
        else:
            processed_files[year] = result
    
    # Save processed texts
    saved_files = []
    for year, result in processed_files.items():
        output_file = save_processed_text(year, result)
        if output_file:
            print(f"Saved processed text for {year} to {output_file}")
            saved_files.append((year, output_file))
    
    # Create a summary file
    summary = {
        "total_letters": len(processed_files),
        "years": sorted(list(processed_files.keys())),
        "letter_details": {year: {
            "source_file": os.path.basename(processed_files[year]["metadata"]["file_path"]),
            "word_count": processed_files[year]["metadata"]["word_count"],
            "has_tables": processed_files[year]["metadata"]["has_tables"],
            "table_count": len(processed_files[year]["metadata"]["tables"]),
            "processed_files": {
                "text": f"{year}_letter.txt",
                "metadata": f"{year}_metadata.json",
                "paragraphs": f"{year}_paragraphs.json"
            }
        } for year in processed_files.keys()}
    }
    
    with open(os.path.join(OUTPUT_DIR, "enhanced_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nEnhanced processing complete! Processed {len(processed_files)} letters.")
    print(f"Letters saved to: {os.path.abspath(OUTPUT_DIR)}")
    print(f"Summary saved to: {os.path.join(OUTPUT_DIR, 'enhanced_summary.json')}")

if __name__ == "__main__":
    process_all_letters()
