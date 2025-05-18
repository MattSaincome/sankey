import os
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
from typing import List, Dict, Any, Tuple, Optional

# Directories
EMBEDDING_DIR = "berkshire_letters_rag/semantic_embeddings"
CHUNKS_DIR = "berkshire_letters_rag/semantic_chunks"

class BerkshireKnowledge:
    """
    A knowledge retrieval system for Berkshire Hathaway shareholder letters.
    This class can be imported and used by the investor AI chatbot to retrieve 
    relevant knowledge, quotes, and context from Berkshire's letters.
    """
    
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        """Initialize the knowledge system with the specified embedding model."""
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        
        # Load chunks metadata (without embeddings)
        self.chunks = self._load_chunks_metadata()
        
        # Vector lookup for faster retrieval
        self.vector_lookup = self._load_vector_lookup()
        
        # Cache for embeddings to avoid loading the same embeddings repeatedly
        self.embedding_cache = {}
        
        print(f"Berkshire Knowledge System initialized with {len(self.chunks)} chunks")
    
    def _load_chunks_metadata(self) -> List[Dict]:
        """Load chunk metadata from disk."""
        chunks_path = os.path.join(EMBEDDING_DIR, "chunks_metadata.json")
        
        if not os.path.exists(chunks_path):
            raise FileNotFoundError(f"Chunks metadata file not found at {chunks_path}")
            
        with open(chunks_path, 'r', encoding='utf-8') as f:
            chunks = json.load(f)
            
        return chunks
    
    def _load_vector_lookup(self) -> Dict:
        """Load vector lookup table for faster retrieval."""
        lookup_path = os.path.join(EMBEDDING_DIR, "vector_lookup.json")
        
        if not os.path.exists(lookup_path):
            return {}
            
        with open(lookup_path, 'r', encoding='utf-8') as f:
            lookup = json.load(f)
            
        return lookup
    
    def _get_embedding(self, chunk_id: str) -> np.ndarray:
        """Get embedding for a chunk by ID, using cache if available."""
        if chunk_id in self.embedding_cache:
            return self.embedding_cache[chunk_id]
            
        if chunk_id not in self.vector_lookup:
            raise ValueError(f"Chunk ID {chunk_id} not found in vector lookup")
            
        embedding_file = os.path.join(EMBEDDING_DIR, self.vector_lookup[chunk_id]["embedding_file"])
        
        if not os.path.exists(embedding_file):
            raise FileNotFoundError(f"Embedding file not found: {embedding_file}")
            
        embedding = np.load(embedding_file)
        self.embedding_cache[chunk_id] = embedding
        
        return embedding
    
    def _get_chunk_by_id(self, chunk_id: str) -> Optional[Dict]:
        """Get a chunk by its ID (year_index)."""
        for chunk in self.chunks:
            current_id = f"{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}"
            if current_id == chunk_id:
                return chunk
        return None
    
    def query(self, query_text: str, top_k: int = 3, filters: Dict = None) -> List[Dict]:
        """
        Query the knowledge base with the given text and return top_k results.
        
        Parameters:
        - query_text: The query text
        - top_k: Number of top results to return
        - filters: Optional filters to apply, e.g. {"year": 2008} or {"topic": "investments"}
        
        Returns:
        - List of relevant chunks with metadata and similarity scores
        """
        # Create query embedding
        query_embedding = self.model.encode(query_text)
        
        # Apply filters if specified
        filtered_chunks = self.chunks
        if filters:
            filtered_chunks = []
            for chunk in self.chunks:
                include = True
                for key, value in filters.items():
                    if key == "year":
                        if chunk["metadata"]["year"] != value:
                            include = False
                            break
                    elif key == "topic":
                        if chunk.get("topic", "general") != value:
                            include = False
                            break
                    elif key == "years":
                        if chunk["metadata"]["year"] not in value:
                            include = False
                            break
                    elif key == "topics":
                        if chunk.get("topic", "general") not in value:
                            include = False
                            break
                
                if include:
                    filtered_chunks.append(chunk)
        
        # Calculate similarity with all chunks
        similarities = []
        for chunk in filtered_chunks:
            chunk_id = f"{chunk['metadata']['year']}_{chunk['metadata']['chunk_index']}"
            try:
                chunk_embedding = self._get_embedding(chunk_id)
                sim = cosine_similarity([query_embedding], [chunk_embedding])[0][0]
                similarities.append((sim, chunk_id))
            except (FileNotFoundError, ValueError) as e:
                print(f"Error loading embedding for {chunk_id}: {e}")
        
        # Sort by similarity (descending)
        similarities.sort(reverse=True)
        
        # Return top k results
        results = []
        for sim, chunk_id in similarities[:top_k]:
            chunk = self._get_chunk_by_id(chunk_id)
            if chunk:
                result = {
                    "text": chunk["text"],
                    "metadata": chunk["metadata"],
                    "topic": chunk.get("topic", "general"),
                    "similarity": float(sim),
                    "chunk_id": chunk_id
                }
                results.append(result)
        
        return results
    
    def extract_quotes(self, text: str, max_quotes: int = 3, min_length: int = 50, max_length: int = 200) -> List[str]:
        """
        Extract meaningful quotes from a chunk of text.
        
        Parameters:
        - text: The text to extract quotes from
        - max_quotes: Maximum number of quotes to extract
        - min_length: Minimum length of a quote
        - max_length: Maximum length of a quote
        
        Returns:
        - List of quotes
        """
        # Split text into sentences
        sentences = re.split(r'(?<=[.!?])\s+', text)
        
        # Group sentences into potential quotes
        quotes = []
        current_quote = ""
        
        for sentence in sentences:
            # Skip very short sentences
            if len(sentence) < 15:
                continue
                
            if len(current_quote) + len(sentence) <= max_length:
                if current_quote:
                    current_quote += " " + sentence
                else:
                    current_quote = sentence
            else:
                if len(current_quote) >= min_length:
                    quotes.append(current_quote.strip())
                current_quote = sentence
        
        # Add the last quote if it's long enough
        if current_quote and len(current_quote) >= min_length:
            quotes.append(current_quote.strip())
        
        # Take the most meaningful quotes (for now, just take the first few)
        return quotes[:max_quotes]
    
    def get_buffett_wisdom(self, query: str, top_k: int = 3, filters: Dict = None) -> Dict:
        """
        High-level method to get relevant Buffett wisdom for a query.
        This is the main method that the chatbot should call.
        
        Parameters:
        - query: The user's question or topic
        - top_k: Number of chunks to retrieve
        - filters: Optional filters (year, topic, etc.)
        
        Returns:
        - Dictionary with context, quotes, and metadata that can be used by the chatbot
        """
        # Query for relevant chunks
        results = self.query(query, top_k=top_k, filters=filters)
        
        if not results:
            return {
                "found": False,
                "message": "No relevant information found in Berkshire letters."
            }
        
        # Extract quotes from the top results
        all_quotes = []
        contexts = []
        years_referenced = set()
        
        for result in results:
            quotes = self.extract_quotes(result["text"])
            if quotes:
                for quote in quotes:
                    all_quotes.append({
                        "text": quote,
                        "year": result["metadata"]["year"],
                        "topic": result.get("topic", "general"),
                        "similarity": result["similarity"]
                    })
            
            # Add the context
            contexts.append({
                "text": result["text"][:500] + "..." if len(result["text"]) > 500 else result["text"],
                "year": result["metadata"]["year"],
                "topic": result.get("topic", "general"),
                "similarity": result["similarity"]
            })
            
            years_referenced.add(result["metadata"]["year"])
        
        # Sort quotes by similarity
        all_quotes.sort(key=lambda x: x["similarity"], reverse=True)
        
        return {
            "found": True,
            "quotes": all_quotes[:5],  # Limit to top 5 quotes
            "contexts": contexts,
            "years_referenced": sorted(list(years_referenced)),
            "query": query
        }
    
    def get_investment_principles(self) -> List[Dict]:
        """
        Return a curated list of Buffett's key investment principles
        based on the shareholder letters.
        """
        # Query specifically for investment principles
        investment_queries = [
            "Buffett's investment principles",
            "value investing approach",
            "long-term investing philosophy",
            "intrinsic value calculation",
            "margin of safety principle"
        ]
        
        principles = []
        for query in investment_queries:
            results = self.query(query, top_k=2)
            for result in results:
                quotes = self.extract_quotes(result["text"], max_quotes=1)
                if quotes:
                    principles.append({
                        "principle": query.replace("Buffett's ", "").replace(" principle", ""),
                        "quote": quotes[0],
                        "year": result["metadata"]["year"]
                    })
        
        # Remove duplicates based on quotes
        unique_principles = []
        quote_set = set()
        
        for principle in principles:
            if principle["quote"] not in quote_set:
                quote_set.add(principle["quote"])
                unique_principles.append(principle)
        
        return unique_principles

    def generate_response_with_berkshire_wisdom(self, user_query: str, base_response: str) -> str:
        """
        Enhance a chatbot's base response with relevant Berkshire wisdom.
        
        Parameters:
        - user_query: The user's original question
        - base_response: The chatbot's initial response without Berkshire knowledge
        
        Returns:
        - Enhanced response with relevant Buffett wisdom incorporated
        """
        buffett_wisdom = self.get_buffett_wisdom(user_query)
        
        if not buffett_wisdom["found"] or not buffett_wisdom["quotes"]:
            return base_response
        
        # Get the top quote to incorporate
        top_quote = buffett_wisdom["quotes"][0]
        
        # Add the Berkshire wisdom to the response
        enhanced_response = base_response + "\n\n"
        enhanced_response += f"Warren Buffett addressed this in his {top_quote['year']} letter to shareholders:\n\n"
        enhanced_response += f"\"{top_quote['text']}\"\n\n"
        
        # If there are more quotes, add one more
        if len(buffett_wisdom["quotes"]) > 1:
            second_quote = buffett_wisdom["quotes"][1]
            if second_quote["year"] != top_quote["year"]:  # Avoid quoting the same year twice
                enhanced_response += f"And in {second_quote['year']}, he noted:\n\n"
                enhanced_response += f"\"{second_quote['text']}\"\n"
        
        return enhanced_response

# Example usage
if __name__ == "__main__":
    # Initialize the knowledge system
    knowledge = BerkshireKnowledge()
    
    # Example query
    query = "What is Buffett's approach to intrinsic value?"
    print(f"Query: {query}")
    
    # Get Buffett wisdom
    wisdom = knowledge.get_buffett_wisdom(query)
    
    if wisdom["found"]:
        print("\nTop quotes from Berkshire letters:")
        for i, quote in enumerate(wisdom["quotes"]):
            print(f"\n{i+1}. From {quote['year']} letter ({quote['topic']}):")
            print(f"\"{quote['text']}\"")
    else:
        print(wisdom["message"])
    
    # Example of enhancing a chatbot response
    base_response = "Intrinsic value is an estimate of the actual value of a company, regardless of market price. It's calculated by projecting future cash flows and discounting them to present value."
    
    enhanced_response = knowledge.generate_response_with_berkshire_wisdom(query, base_response)
    
    print("\nEnhanced chatbot response:")
    print(enhanced_response)
