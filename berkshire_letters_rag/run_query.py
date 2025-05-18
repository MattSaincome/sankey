import os
import sys
from query_rag import BerkshireRAG

# Create output directory
OUTPUT_DIR = "berkshire_letters_rag/query_results"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_query_results(query, top_k=5):
    """Run a query and save results to a file."""
    # Initialize RAG system
    rag = BerkshireRAG()
    
    # Get formatted results
    results = rag.get_context(query, top_k=top_k)
    
    # Create a filename based on the query
    safe_query = "".join(c if c.isalnum() else "_" for c in query)
    safe_query = safe_query[:30]  # Limit filename length
    output_file = os.path.join(OUTPUT_DIR, f"query_{safe_query}.txt")
    
    # Save results to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(results)
    
    print(f"Query: {query}")
    print(f"Results saved to: {output_file}")
    return output_file

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python run_query.py \"Your query text here\" [--top_k N]")
        sys.exit(1)
    
    # Parse arguments
    query = sys.argv[1]
    top_k = 5  # Default
    
    if len(sys.argv) > 3 and sys.argv[2] == "--top_k":
        try:
            top_k = int(sys.argv[3])
        except ValueError:
            print("Error: top_k must be an integer")
            sys.exit(1)
    
    # Run query and save results
    output_file = save_query_results(query, top_k)
    
    # Display the first few lines of results as a preview
    with open(output_file, 'r', encoding='utf-8') as f:
        preview = f.readlines()[:20]  # First 20 lines
        print("\nPreview of results:")
        print("".join(preview))
        print("...\n")
    
    print(f"See the full results in: {output_file}")
