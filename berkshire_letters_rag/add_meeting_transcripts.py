import os
try:
    import fitz  # PyMuPDF
except ImportError:
    print("PyMuPDF (fitz) is not installed. Please run 'pip install pymupdf' and try again.")
    exit(1)

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from build_faiss_index import chunk_text, add_chunks_to_index, INDEX_PATH, CHUNK_SIZE

TRANSCRIPT_PATH = r"C:\Users\matt\OneDrive\Desktop\letters\Berkshire Meeting Transcripts - 1994 - 2022.pdf"

# 1. Extract text from the PDF
with fitz.open(TRANSCRIPT_PATH) as doc:
    full_text = ""
    for page in doc:
        full_text += page.get_text()

# 2. Chunk the text for RAG
chunks = chunk_text(full_text, chunk_size=CHUNK_SIZE)

# 3. Add metadata for source and year (try to infer year from page or filename)
def extract_year(chunk, idx):
    # Try to find a year in the chunk, fallback to filename
    import re
    match = re.search(r"(20\d{2}|19\d{2})", chunk)
    if match:
        return match.group(1)
    return "meeting"

chunk_dicts = [
    {
        "chunk_text": chunk,
        "source_file": os.path.basename(TRANSCRIPT_PATH),
        "year": extract_year(chunk, i),
        "chunk_index": i
    }
    for i, chunk in enumerate(chunks)
]

# 4. Add to FAISS index
add_chunks_to_index(chunk_dicts, INDEX_PATH)

print(f"Added {len(chunk_dicts)} transcript chunks from {TRANSCRIPT_PATH} to the RAG index.")
