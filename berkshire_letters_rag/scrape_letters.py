import os
import requests
import time
import json
from datetime import datetime

# Base URLs and formats
BASE_URL = "https://www.berkshirehathaway.com/letters/"
OUTPUT_DIR = "berkshire_letters_rag/letters_raw"
STATUS_FILE = os.path.join(OUTPUT_DIR, "download_status.json")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_letter_urls():
    """Generate URLs for Berkshire Hathaway letters from 1977 to current year."""
    urls = []
    
    # Years to try - Berkshire letters typically go from 1977 to current year
    start_year = 1977
    end_year = 2023
    
    # Try both HTML and PDF formats for each year
    for year in range(start_year, end_year + 1):
        # Format 1: Year.html (most common for older letters)
        urls.append((year, f"{BASE_URL}{year}.html"))
        
        # Format 2: Year.pdf (used for some years)
        urls.append((year, f"{BASE_URL}{year}.pdf"))
        
        # Format 3: Year linked letters (used for some newer years)
        urls.append((year, f"{BASE_URL}{year}ltr.pdf"))
    
    return urls

def load_status():
    """Load download status from file."""
    if os.path.exists(STATUS_FILE):
        try:
            with open(STATUS_FILE, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {'downloaded': [], 'last_update': None, 'total_downloads': 0}
    return {'downloaded': [], 'last_update': None, 'total_downloads': 0}

def save_status(status):
    """Save download status to file."""
    status['last_update'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(STATUS_FILE, 'w') as f:
        json.dump(status, f, indent=2)

def download_letter(year, url, status):
    """Download a letter from a URL and save it to the output directory."""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}
    
    # Create filename based on year and file extension
    file_extension = url.split('.')[-1].lower()
    filename = f"{year}_{os.path.basename(url)}"
    out_path = os.path.join(OUTPUT_DIR, filename)
    
    # Skip if already downloaded (either file exists or in status)
    if os.path.exists(out_path) or url in status['downloaded']:
        print(f".")
        return False
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        # Check if the request was successful
        if response.status_code == 200:
            # Check if this is an actual letter by validating content
            content_type = response.headers.get('Content-Type', '').lower()
            
            # PDF check
            if 'pdf' in content_type or (file_extension == 'pdf' and response.content.startswith(b'%PDF')):
                with open(out_path, "wb") as f:
                    f.write(response.content)
                print(f"✓ {year} PDF: {filename}")
                status['downloaded'].append(url)
                status['total_downloads'] += 1
                save_status(status)
                return True
            
            # HTML check
            elif 'html' in content_type or file_extension in ['html', 'htm']:
                with open(out_path, "wb") as f:
                    f.write(response.content)
                print(f"✓ {year} HTML: {filename}")
                status['downloaded'].append(url)
                status['total_downloads'] += 1
                save_status(status)
                return True
            else:
                return False
        else:
            return False
    except Exception:
        return False

def main():
    """Main function to generate URLs and download letters."""
    print("Starting Berkshire Hathaway Letter Download")
    urls = generate_letter_urls()
    status = load_status()
    
    print(f"Found {len(urls)} potential URLs, {status['total_downloads']} already downloaded")
    
    year_data = {}
    for year, url in urls:
        if download_letter(year, url, status):
            # Track which years we have letters for
            if year not in year_data:
                year_data[year] = []
            year_data[year].append(os.path.basename(url))
        time.sleep(0.5)  # Be nice to the server
    
    # Generate a summary file
    with open(os.path.join(OUTPUT_DIR, "letter_inventory.txt"), "w") as f:
        f.write("BERKSHIRE HATHAWAY SHAREHOLDER LETTERS INVENTORY\n")
        f.write("=================================================\n\n")
        f.write(f"Total letters downloaded: {status['total_downloads']}\n\n")
        f.write("Letters by year:\n\n")
        
        for year in sorted(year_data.keys()):
            f.write(f"{year}: {', '.join(year_data[year])}\n")
    
    print(f"\nDownload complete! {status['total_downloads']} letters downloaded.")
    print(f"Check summary at: {os.path.join(OUTPUT_DIR, 'letter_inventory.txt')}")

if __name__ == "__main__":
    main()
