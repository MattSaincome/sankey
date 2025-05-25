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

# Load FAISS index and metadata at startup
index = faiss.read_index(INDEX_FILE)
with open(META_FILE, 'r', encoding='utf-8') as f:
    metadatas = json.load(f)

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
    return {"results": results}
