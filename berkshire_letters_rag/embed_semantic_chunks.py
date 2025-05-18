import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
import time

# Directories
CHUNKS_DIR = "berkshire_letters_rag/semantic_chunks"
EMBEDDING_DIR = "berkshire_letters_rag/semantic_embeddings"
os.makedirs(EMBEDDING_DIR, exist_ok=True)

# Model settings
MODEL_NAME = "all-MiniLM-L6-v2"  # Lightweight model for embeddings

def load_chunks() -> List[Dict[str, Any]]:
    """Load all semantic chunks."""
    chunks_file = os.path.join(CHUNKS_DIR, "all_chunks.json")
    
    if not os.path.exists(chunks_file):
        print(f"Chunks file not found at {chunks_file}. Run semantic_chunking.py first.")
        return []
    
    try:
        with open(chunks_file, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
        return chunks
    except Exception as e:
        print(f"Error loading chunks: {e}")
        return []

def create_embeddings(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create embeddings for each chunk using Sentence Transformers."""
    if not chunks:
        print("No chunks to embed.")
        return []
    
    print(f"Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    
    # Extract texts from chunks
    texts = [chunk["text"] for chunk in chunks]
    
    print(f"Generating embeddings for {len(texts)} chunks...")
    start_time = time.time()
    embeddings = model.encode(texts, show_progress_bar=True)
    elapsed_time = time.time() - start_time
    print(f"Embedding generation completed in {elapsed_time:.2f} seconds")
    
    # Add embeddings to chunks
    for i, embedding in enumerate(embeddings):
        chunks[i]["embedding"] = embedding.tolist()
    
    return chunks

def save_embeddings(chunks: List[Dict[str, Any]]):
    """Save chunks and embeddings to files."""
    if not chunks:
        print("No embeddings to save.")
        return
    
    # Save all chunks in one file but without embeddings (to keep file size reasonable)
    chunks_path = os.path.join(EMBEDDING_DIR, "chunks_metadata.json")
    
    # Create a serializable version (remove numpy arrays)
    serializable_chunks = []
    for i, chunk in enumerate(chunks):
        # Make a copy without the embedding
        s_chunk = {k: v for k, v in chunk.items() if k != "embedding"}
        s_chunk["embedding_file"] = f"embedding_{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}.npy"
        serializable_chunks.append(s_chunk)
        
        # Save individual embedding as numpy file
        embedding_path = os.path.join(EMBEDDING_DIR, s_chunk["embedding_file"])
        np.save(embedding_path, np.array(chunk["embedding"]))
    
    # Save chunks metadata
    with open(chunks_path, 'w', encoding='utf-8') as f:
        json.dump(serializable_chunks, f, indent=2)
    
    # Create a vector store lookup for faster querying
    vector_lookup = {
        f"{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}": {
            "embedding_file": f"embedding_{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}.npy",
            "year": chunk['metadata']['year'],
            "topic": chunk.get('topic', 'general'),
            "chunk_index": chunk['metadata']['chunk_index']
        }
        for chunk in chunks
    }
    
    with open(os.path.join(EMBEDDING_DIR, "vector_lookup.json"), 'w') as f:
        json.dump(vector_lookup, f, indent=2)
    
    # Save a summary of embeddings by topic and year
    by_topic = {}
    by_year = {}
    
    for chunk in chunks:
        topic = chunk.get('topic', 'general')
        year = chunk['metadata']['year']
        
        if topic not in by_topic:
            by_topic[topic] = []
        by_topic[topic].append(f"{year}_{chunk['metadata']['chunk_index']}")
        
        if year not in by_year:
            by_year[year] = []
        by_year[year].append(f"{year}_{chunk['metadata']['chunk_index']}")
    
    summary = {
        "total_embeddings": len(chunks),
        "model_used": MODEL_NAME,
        "embedding_dimension": len(chunks[0]["embedding"]),
        "by_topic": {topic: len(ids) for topic, ids in by_topic.items()},
        "by_year": {year: len(ids) for year, ids in by_year.items()}
    }
    
    with open(os.path.join(EMBEDDING_DIR, "embeddings_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nEmbedding storage complete!")
    print(f"Created embeddings for {len(chunks)} chunks")
    print(f"Embeddings saved to: {os.path.abspath(EMBEDDING_DIR)}")
    print(f"Summary saved to: {os.path.join(EMBEDDING_DIR, 'embeddings_summary.json')}")

def main():
    # Load semantic chunks
    chunks = load_chunks()
    if not chunks:
        return
    
    print(f"Loaded {len(chunks)} semantic chunks")
    
    # Create embeddings
    chunks_with_embeddings = create_embeddings(chunks)
    
    # Save embeddings
    save_embeddings(chunks_with_embeddings)

if __name__ == "__main__":
    main()
