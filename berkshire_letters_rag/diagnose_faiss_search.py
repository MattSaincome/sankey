import os
import numpy as np
import openai
import faiss
import json
from dotenv import load_dotenv

# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

INDEX_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_index.faiss')
META_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_metadata.json')
EMBED_MODEL = "text-embedding-3-small"

# Load FAISS index and metadata
index = faiss.read_index(INDEX_FILE)
with open(META_FILE, 'r', encoding='utf-8') as f:
    metadatas = json.load(f)

# Embed a test query
query = "book value per share"
resp = openai.embeddings.create(model=EMBED_MODEL, input=[query])
emb = np.array(resp.data[0].embedding, dtype=np.float32)

# Search FAISS
D, I = index.search(np.array([emb]), 5)
print("\n=== FAISS Direct Search Results ===")
for rank, (idx, score) in enumerate(zip(I[0], D[0]), 1):
    meta = metadatas[idx]
    chunk_text = meta.get('chunk_text', '[chunk text unavailable]')
    print(f"[{rank}] Score: {score:.6f}")
    print(f"Chunk: {chunk_text}\n---")
    print(f"Source: {meta['source_file']}")
    print()
