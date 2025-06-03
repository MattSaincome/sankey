import os
import numpy as np
import faiss
import openai
import json
from fastapi import FastAPI, Request
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load API key
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

INDEX_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_index.faiss')
META_FILE = os.path.join(os.path.dirname(__file__), 'wisdom_metadata.json')
EMBED_MODEL = "text-embedding-3-small"

print(f"Starting Wisdom Search API...")
print(f"INDEX_FILE: {INDEX_FILE}")
print(f"META_FILE: {META_FILE}")
print(f"Files exist - Index: {os.path.exists(INDEX_FILE)}, Meta: {os.path.exists(META_FILE)}")

# Load FAISS index and metadata at startup
try:
    index = faiss.read_index(INDEX_FILE)
    print(f"Loaded FAISS index with {index.ntotal} vectors")
    
    with open(META_FILE, 'r', encoding='utf-8') as f:
        metadatas = json.load(f)
    print(f"Loaded {len(metadatas)} metadata entries")
except Exception as e:
    print(f"Error loading index/metadata: {e}")
    raise

app = FastAPI()

# Allow all CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

@app.post("/search_wisdom")
async def search_wisdom(req: SearchRequest):
    try:
        print(f"Received wisdom search request: query='{req.query}', top_k={req.top_k}")
        
        # Embed query
        resp = openai.embeddings.create(model=EMBED_MODEL, input=[req.query])
        emb = np.array(resp.data[0].embedding, dtype=np.float32)
        D, I = index.search(np.array([emb]), req.top_k)
        
        results = []
        for idx, score in zip(I[0], D[0]):
            meta = metadatas[idx]
            results.append({
                "score": float(score),
                "chunk_text": meta.get("chunk_text", "[chunk text unavailable]"),
                "source_file": meta.get("source_file", "unknown"),
                "year": meta.get("year", None),
                "chunk_index": meta.get("chunk_index", None)
            })
        
        print(f"Found {len(results)} wisdom results")
        for i, result in enumerate(results[:3]):  # Log first 3 results
            print(f"Result {i+1}: {result['chunk_text'][:100]}... (Source: {result['source_file']})")
            
        return {"results": results}
    except Exception as e:
        print(f"Error in search_wisdom: {e}")
        raise
