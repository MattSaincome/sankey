import os
import json
import glob
import re
from typing import List, Dict, Any
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Directories
PROCESSED_DIR = "berkshire_letters_rag/processed_letters"
EMBEDDING_DIR = "berkshire_letters_rag/embeddings"
os.makedirs(EMBEDDING_DIR, exist_ok=True)

# Chunk size and overlap settings
CHUNK_SIZE = 500  # Characters per chunk
CHUNK_OVERLAP = 100  # Character overlap between chunks

# Model settings
MODEL_NAME = "all-MiniLM-L6-v2"  # Lightweight model for embeddings

def load_processed_texts() -> Dict[int, str]:
    """Load all processed text files."""
    texts = {}
    for text_file in glob.glob(os.path.join(PROCESSED_DIR, "*_letter.txt")):
        filename = os.path.basename(text_file)
        year_match = re.match(r'(\d{4})_', filename)
        
        if not year_match:
            continue
            
        year = int(year_match.group(1))
        
        try:
            with open(text_file, 'r', encoding='utf-8') as f:
                text = f.read()
            texts[year] = text
        except Exception as e:
            print(f"Error loading {text_file}: {e}")
    
    return texts

def create_chunks(texts: Dict[int, str]) -> List[Dict[str, Any]]:
    """Split texts into chunks with metadata."""
    chunks = []
    
    for year, text in texts.items():
        # Skip if text is too short
        if len(text) < 100:  # Arbitrary minimum size
            continue
            
        # Create chunks with overlap
        for i in range(0, len(text), CHUNK_SIZE - CHUNK_OVERLAP):
            chunk_text = text[i:i + CHUNK_SIZE]
            
            # Skip small end chunks
            if len(chunk_text) < 100:
                continue
                
            # Create chunk object with metadata
            chunk = {
                "text": chunk_text,
                "metadata": {
                    "year": year,
                    "source": f"{year}_letter.txt",
                    "chunk_index": len([c for c in chunks if c["metadata"]["year"] == year]),
                    "char_start": i,
                    "char_end": i + len(chunk_text)
                }
            }
            chunks.append(chunk)
    
    print(f"Created {len(chunks)} chunks from {len(texts)} letters")
    return chunks

def create_embeddings(chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Create embeddings for each chunk using Sentence Transformers."""
    print(f"Loading embedding model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)
    
    # Extract texts from chunks
    texts = [chunk["text"] for chunk in chunks]
    
    print(f"Generating embeddings for {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True)
    
    # Add embeddings to chunks
    for i, embedding in enumerate(embeddings):
        chunks[i]["embedding"] = embedding.tolist()
    
    return chunks

def save_embeddings(chunks: List[Dict[str, Any]]):
    """Save chunks and embeddings to files."""
    # Save all chunks in one file
    chunks_path = os.path.join(EMBEDDING_DIR, "chunks.json")
    
    # Create a serializable version (remove numpy arrays)
    serializable_chunks = []
    for chunk in chunks:
        s_chunk = {
            "text": chunk["text"],
            "metadata": chunk["metadata"],
            "embedding_file": f"embedding_{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}.npy"
        }
        serializable_chunks.append(s_chunk)
        
        # Save individual embedding as numpy file
        embedding_path = os.path.join(EMBEDDING_DIR, s_chunk["embedding_file"])
        np.save(embedding_path, np.array(chunk["embedding"]))
    
    # Save chunks metadata
    with open(chunks_path, 'w', encoding='utf-8') as f:
        json.dump(serializable_chunks, f, indent=2)
    
    # Save summary
    summary = {
        "total_chunks": len(chunks),
        "years_covered": sorted(list(set(c["metadata"]["year"] for c in chunks))),
        "model_used": MODEL_NAME,
        "chunk_size": CHUNK_SIZE,
        "chunk_overlap": CHUNK_OVERLAP
    }
    
    with open(os.path.join(EMBEDDING_DIR, "embedding_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nEmbedding creation complete!")
    print(f"Created {len(chunks)} chunk embeddings")
    print(f"Embeddings saved to: {os.path.abspath(EMBEDDING_DIR)}")
    print(f"Summary saved to: {os.path.join(EMBEDDING_DIR, 'embedding_summary.json')}")
    
def test_embeddings(chunks: List[Dict[str, Any]]):
    """Test embeddings with a sample query."""
    print("\nTesting embedding retrieval with a sample query...")
    
    model = SentenceTransformer(MODEL_NAME)
    
    # Sample query
    query = "Berkshire Hathaway acquisition strategy"
    query_embedding = model.encode(query)
    
    # Calculate similarity
    similarities = []
    for i, chunk in enumerate(chunks):
        sim = cosine_similarity([query_embedding], [chunk["embedding"]])[0][0]
        similarities.append((sim, i))
    
    # Sort by similarity
    similarities.sort(reverse=True)
    
    # Print top 3 results
    print(f"\nTop results for query: '{query}'")
    for i, (sim, idx) in enumerate(similarities[:3]):
        chunk = chunks[idx]
        print(f"\nResult {i+1} (Year: {chunk['metadata']['year']}, Similarity: {sim:.4f})")
        print("-" * 40)
        print(chunk["text"][:200] + "...")  # Show first 200 chars
    
def main():
    # Load processed texts
    texts = load_processed_texts()
    print(f"Loaded {len(texts)} processed letters")
    
    # Create chunks
    chunks = create_chunks(texts)
    
    # Create embeddings
    chunks_with_embeddings = create_embeddings(chunks)
    
    # Save embeddings
    save_embeddings(chunks_with_embeddings)
    
    # Test embeddings
    test_embeddings(chunks_with_embeddings)

if __name__ == "__main__":
    main()
