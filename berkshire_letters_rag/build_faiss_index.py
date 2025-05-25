import os
import re
import json
import numpy as np
from tqdm import tqdm
import openai
import faiss
from dotenv import load_dotenv

# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), 'processed_letters')
INDEX_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_index.faiss')
META_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_metadata.json')
EMBED_MODEL = "text-embedding-3-small"
CHUNK_SIZE = 400
CHUNK_OVERLAP = 50


def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i+chunk_size])
        if chunk:
            print(f"[PREVIEW CHUNK] {chunk[:300]}\n---")
            chunks.append(chunk)
    return chunks

def extract_metadata(fname, chunk, chunk_index):
    year = 0
    year_match = re.match(r'(\d{4})', fname)
    if year_match:
        year = int(year_match.group(1))
    return {
        'source_file': fname,
        'year': year,
        'chunk_index': chunk_index,
        'word_count': len(chunk.split()),
    }

def main():
    files = [f for f in os.listdir(PROCESSED_DIR) if f.endswith('.txt')]
    print(f"Found {len(files)} processed letter files.")
    all_chunks = []
    all_metadatas = []
    for fname in tqdm(files, desc="Chunking letters"):
        path = os.path.join(PROCESSED_DIR, fname)
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            text = f.read()
        chunks = chunk_text(text)
        for idx, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            meta = extract_metadata(fname, chunk, idx)
            meta['chunk_text'] = chunk
            all_metadatas.append(meta)
    print(f"Total chunks to embed: {len(all_chunks)}")
    # Embed chunks
    embeddings = []
    for i in tqdm(range(0, len(all_chunks), 100), desc="Embedding chunks"):
        batch = all_chunks[i:i+100]
        resp = openai.embeddings.create(model=EMBED_MODEL, input=batch)
        for d in resp.data:
            embeddings.append(d.embedding)
    arr = np.array(embeddings).astype('float32')
    index = faiss.IndexFlatL2(arr.shape[1])
    index.add(arr)
    faiss.write_index(index, INDEX_FILE)
    print(f"[SAVED] FAISS index: {INDEX_FILE}")
    with open(META_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_metadatas, f, ensure_ascii=False, indent=2)
    print(f"[SAVED] Metadata: {META_FILE}")

if __name__ == '__main__':
    main()
