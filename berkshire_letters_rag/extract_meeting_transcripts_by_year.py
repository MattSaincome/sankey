import fitz  # PyMuPDF
import os
import re

TRANSCRIPT_PATH = r"C:\Users\matt\OneDrive\Desktop\letters\Berkshire Meeting Transcripts - 1994 - 2022.pdf"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'processed_letters')

# Regex to match years (1994-2022)
year_pattern = re.compile(r"(19[9][4-9]|20[0-2][0-9]|2022)")

with fitz.open(TRANSCRIPT_PATH) as doc:
    current_year = None
    buffer = []
    for page in doc:
        text = page.get_text()
        # Try to find a year marker in the first 200 chars of the page
        match = year_pattern.search(text[:200])
        if match:
            # Save previous year's buffer if exists
            if current_year and buffer:
                out_path = os.path.join(OUTPUT_DIR, f'berkshire_meeting_{current_year}.txt')
                with open(out_path, 'w', encoding='utf-8') as out:
                    out.write(''.join(buffer))
                print(f"Saved {out_path}")
                buffer = []
            current_year = match.group(1)
        buffer.append(text)
    # Save last buffer
    if current_year and buffer:
        out_path = os.path.join(OUTPUT_DIR, f'berkshire_meeting_{current_year}.txt')
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write(''.join(buffer))
        print(f"Saved {out_path}")

print("Done extracting transcripts by year.")
