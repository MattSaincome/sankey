import requests
import json

# Test what wisdom quotes would be retrieved for MSFT query
response = requests.post('http://localhost:8001/search_wisdom', 
                        json={'query': 'Microsoft MSFT technology software', 'top_k': 15})

if response.status_code == 200:
    results = response.json()['results']
    print(f"Found {len(results)} wisdom chunks for MSFT query:")
    print("\nRelevant wisdom for this question:")
    
    for i, chunk in enumerate(results):
        source = chunk.get('source_file', 'unknown')
        year = chunk.get('year', 'unknown')
        text = chunk['chunk_text'].strip()
        print(f"{i+1}. \"{text[:300]}...\" — [Source: {source}, {year}]")
        print()
else:
    print(f"Error: {response.status_code}")
    print(response.text)
