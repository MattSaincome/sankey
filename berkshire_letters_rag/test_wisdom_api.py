import requests

API_URL = "http://localhost:8000/search_wisdom"

query = "What does Warren Buffett say about book value per share?"

try:
    resp = requests.post(API_URL, json={"query": query})
    print(f"Status: {resp.status_code}")
    print("Response:")
    try:
        print(resp.json())
    except Exception as e:
        print(f"[ERROR] Could not decode JSON: {e}")
        print("Raw response:")
        print(resp.text)
except Exception as e:
    print(f"[ERROR] Request failed: {e}")
