import fitz  # PyMuPDF
import os

TRANSCRIPT_PATH = r"C:\Users\matt\OneDrive\Desktop\letters\Berkshire Meeting Transcripts - 1994 - 2022.pdf"
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), 'processed_letters', 'berkshire_meeting_transcripts_1994_2022.txt')

with fitz.open(TRANSCRIPT_PATH) as doc:
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as out:
        for page in doc:
            out.write(page.get_text())

print(f"Extracted all transcript text to {OUTPUT_PATH}")
