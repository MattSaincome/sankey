import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import argparse

# Directories
EMBEDDING_DIR = "berkshire_letters_rag/embeddings"
PROCESSED_DIR = "berkshire_letters_rag/processed_letters"

class BerkshireRAG:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        """Initialize the RAG system with the specified model."""
        print(f"Initializing BerkshireRAG with model: {model_name}")
        
        # Load model
        self.model = SentenceTransformer(model_name)
        
        # Load chunks
        self.chunks = self._load_chunks()
        
        # Load embeddings
        self._load_embeddings()
        
        print(f"Loaded {len(self.chunks)} chunks with embeddings")
    
    def _load_chunks(self):
        """Load chunk metadata from disk."""
        chunks_path = os.path.join(EMBEDDING_DIR, "chunks.json")
        
        with open(chunks_path, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
            
        return chunks
    
    def _load_embeddings(self):
        """Load embeddings for all chunks."""
        for chunk in self.chunks:
            embedding_path = os.path.join(EMBEDDING_DIR, chunk["embedding_file"])
            chunk["embedding"] = np.load(embedding_path)
    
    def query(self, query_text, top_k=5):
        """Query the RAG system with the given text, return top_k results."""
        # Create query embedding
        query_embedding = self.model.encode(query_text)
        
        # Calculate similarity with all chunks
        similarities = []
        for i, chunk in enumerate(self.chunks):
            sim = cosine_similarity([query_embedding], [chunk["embedding"]])[0][0]
            similarities.append((sim, i))
        
        # Sort by similarity (descending)
        similarities.sort(reverse=True)
        
        # Return top k results
        results = []
        for sim, idx in similarities[:top_k]:
            chunk = self.chunks[idx]
            result = {
                "text": chunk["text"],
                "metadata": chunk["metadata"],
                "similarity": float(sim)
            }
            results.append(result)
        
        return results
    
    def get_context(self, query_text, top_k=5, format_output=True):
        """Get context for a query and optionally format it nicely."""
        results = self.query(query_text, top_k=top_k)
        
        if not format_output:
            return results
        
        # Format the output for easier reading
        formatted_output = f"Query: {query_text}\n\n"
        formatted_output += f"Top {len(results)} results:\n\n"
        
        for i, result in enumerate(results):
            formatted_output += f"RESULT {i+1} [Year: {result['metadata']['year']}, Similarity: {result['similarity']:.4f}]\n"
            formatted_output += "=" * 80 + "\n"
            formatted_output += result["text"] + "\n\n"
        
        return formatted_output

def main():
    parser = argparse.ArgumentParser(description="Query the Berkshire Hathaway RAG system")
    parser.add_argument("query", help="The query text to search for")
    parser.add_argument("--top_k", type=int, default=3, help="Number of top results to return")
    args = parser.parse_args()
    
    rag = BerkshireRAG()
    formatted_results = rag.get_context(args.query, top_k=args.top_k)
    print(formatted_results)

if __name__ == "__main__":
    main()
