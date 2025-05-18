import os
import json
import glob
import re
import numpy as np
from typing import List, Dict, Any
from collections import defaultdict

# Directories
ENHANCED_DIR = "berkshire_letters_rag/enhanced_letters"
CHUNKS_DIR = "berkshire_letters_rag/semantic_chunks"
os.makedirs(CHUNKS_DIR, exist_ok=True)

# Chunking settings
MAX_CHUNK_SIZE = 1000  # Characters per chunk (max)
MIN_CHUNK_SIZE = 200   # Minimum chunk size
OVERLAP_SIZE = 50      # Characters of overlap

def load_letter_paragraphs(year: int) -> List[str]:
    """Load paragraphs for a given year."""
    para_file = os.path.join(ENHANCED_DIR, f"{year}_paragraphs.json")
    
    if not os.path.exists(para_file):
        return []
    
    try:
        with open(para_file, 'r', encoding='utf-8') as f:
            paragraphs = json.load(f)
        return paragraphs
    except Exception as e:
        print(f"Error loading paragraphs for {year}: {e}")
        return []

def load_letter_metadata(year: int) -> Dict:
    """Load metadata for a given year."""
    meta_file = os.path.join(ENHANCED_DIR, f"{year}_metadata.json")
    
    if not os.path.exists(meta_file):
        return {}
    
    try:
        with open(meta_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        return metadata
    except Exception as e:
        print(f"Error loading metadata for {year}: {e}")
        return {}

def get_all_processed_years() -> List[int]:
    """Get a list of all years that have been processed."""
    summary_file = os.path.join(ENHANCED_DIR, "enhanced_summary.json")
    
    if not os.path.exists(summary_file):
        print("Enhanced summary file not found. Run enhanced_process_letters.py first.")
        return []
    
    try:
        with open(summary_file, 'r', encoding='utf-8') as f:
            summary = json.load(f)
        return [int(year) for year in summary.get("years", [])]
    except Exception as e:
        print(f"Error loading summary: {e}")
        return []

def detect_paragraph_topics(paragraphs: List[str]) -> List[str]:
    """Detect the main topic of each paragraph using rule-based approach."""
    topics = []
    
    topic_keywords = {
        "financial_results": ["earnings", "income", "profit", "loss", "financial results", "revenue"],
        "business_performance": ["performance", "operations", "businesses", "operating"],
        "investments": ["stocks", "investment", "portfolio", "securities", "equity"],
        "acquisitions": ["acquisition", "purchase", "merger", "bought", "buying"],
        "insurance": ["insurance", "float", "premium", "underwriting", "risk"],
        "manufacturing": ["manufacturing", "industrial", "factory", "production"],
        "utilities": ["utility", "utilities", "energy", "power", "BHE"],
        "management": ["management", "CEO", "executive", "leadership", "board"],
        "valuation": ["valuation", "intrinsic value", "book value", "price"],
        "strategy": ["strategy", "long-term", "goals", "objective", "plan"],
        "governance": ["governance", "corporate", "shareholders", "ownership"],
        "outlook": ["outlook", "future", "expect", "forecast", "anticipate"]
    }
    
    for paragraph in paragraphs:
        paragraph_lower = paragraph.lower()
        topic_scores = defaultdict(int)
        
        for topic, keywords in topic_keywords.items():
            for keyword in keywords:
                count = paragraph_lower.count(keyword)
                topic_scores[topic] += count
        
        if not topic_scores or max(topic_scores.values()) == 0:
            topics.append("general")
        else:
            top_topic = max(topic_scores.items(), key=lambda x: x[1])[0]
            topics.append(top_topic)
    
    return topics

def create_semantic_chunks(year: int, paragraphs: List[str], metadata: Dict) -> List[Dict]:
    """Create semantic chunks from paragraphs based on topics and semantic coherence."""
    if not paragraphs:
        return []
    
    # Detect topics for each paragraph
    topics = detect_paragraph_topics(paragraphs)
    
    # Group paragraphs by topic
    topic_groups = []
    current_topic = topics[0]
    current_group = [paragraphs[0]]
    
    for i in range(1, len(paragraphs)):
        if topics[i] == current_topic and len('\n'.join(current_group + [paragraphs[i]])) <= MAX_CHUNK_SIZE:
            # Extend the current group if same topic and under size limit
            current_group.append(paragraphs[i])
        else:
            # Save the current group and start a new one
            topic_groups.append((current_topic, current_group))
            current_topic = topics[i]
            current_group = [paragraphs[i]]
    
    # Add the last group
    if current_group:
        topic_groups.append((current_topic, current_group))
    
    # Create chunks from topic groups, ensuring minimum size
    chunks = []
    buffer = []
    buffer_topic = None
    buffer_size = 0
    
    for topic, group in topic_groups:
        group_text = '\n'.join(group)
        group_size = len(group_text)
        
        # If buffer is empty, start a new buffer
        if not buffer:
            buffer = group
            buffer_topic = topic
            buffer_size = group_size
        # If adding to buffer keeps it under max size, add to buffer
        elif buffer_size + group_size <= MAX_CHUNK_SIZE:
            buffer.extend(group)
            buffer_size += group_size
        # If buffer is already at min size, create chunk and start new buffer
        elif buffer_size >= MIN_CHUNK_SIZE:
            chunk_text = '\n'.join(buffer)
            chunks.append({
                "text": chunk_text,
                "topic": buffer_topic,
                "metadata": {
                    "year": year,
                    "topic": buffer_topic,
                    "source": f"{year}_letter.txt",
                    "chunk_index": len(chunks),
                    "char_length": len(chunk_text),
                    "paragraph_count": len(buffer)
                }
            })
            buffer = group
            buffer_topic = topic
            buffer_size = group_size
        # If buffer is too small, add to it even if it exceeds max size
        else:
            buffer.extend(group)
            buffer_size += group_size
    
    # Add the final buffer if it's not empty
    if buffer:
        chunk_text = '\n'.join(buffer)
        chunks.append({
            "text": chunk_text,
            "topic": buffer_topic,
            "metadata": {
                "year": year,
                "topic": buffer_topic,
                "source": f"{year}_letter.txt",
                "chunk_index": len(chunks),
                "char_length": len(chunk_text),
                "paragraph_count": len(buffer)
            }
        })
    
    # Add additional metadata from the letter
    for chunk in chunks:
        chunk["metadata"]["letter_metadata"] = {
            "year": year,
            "original_filename": metadata.get("filename", f"{year}_letter.txt"),
            "word_count": metadata.get("word_count", 0)
        }
    
    return chunks

def process_all_letters():
    """Process all letters to create semantic chunks."""
    # Get all years
    years = get_all_processed_years()
    if not years:
        print("No processed years found. Run enhanced_process_letters.py first.")
        return
    
    all_chunks = []
    year_chunks = {}
    
    # Process each year
    for year in years:
        print(f"Creating semantic chunks for {year}...")
        paragraphs = load_letter_paragraphs(year)
        metadata = load_letter_metadata(year)
        
        if not paragraphs:
            print(f"No paragraphs found for {year}, skipping.")
            continue
        
        chunks = create_semantic_chunks(year, paragraphs, metadata)
        if not chunks:
            print(f"Failed to create chunks for {year}.")
            continue
        
        year_chunks[year] = chunks
        all_chunks.extend(chunks)
        
        # Save year chunks separately
        year_file = os.path.join(CHUNKS_DIR, f"{year}_chunks.json")
        with open(year_file, 'w', encoding='utf-8') as f:
            json.dump(chunks, f, indent=2)
        
        print(f"Created {len(chunks)} semantic chunks for {year}")
    
    # Save all chunks in one file
    all_chunks_file = os.path.join(CHUNKS_DIR, "all_chunks.json")
    with open(all_chunks_file, 'w', encoding='utf-8') as f:
        json.dump(all_chunks, f, indent=2)
    
    # Create a summary file
    topic_counts = defaultdict(int)
    for chunk in all_chunks:
        topic_counts[chunk["topic"]] += 1
    
    summary = {
        "total_chunks": len(all_chunks),
        "years_covered": sorted(list(year_chunks.keys())),
        "chunks_per_year": {year: len(chunks) for year, chunks in year_chunks.items()},
        "topics": dict(topic_counts),
        "config": {
            "max_chunk_size": MAX_CHUNK_SIZE,
            "min_chunk_size": MIN_CHUNK_SIZE,
            "overlap_size": OVERLAP_SIZE
        }
    }
    
    with open(os.path.join(CHUNKS_DIR, "semantic_chunks_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nSemantic chunking complete!")
    print(f"Created {len(all_chunks)} semantic chunks across {len(year_chunks)} years")
    print(f"Chunks saved to: {os.path.abspath(CHUNKS_DIR)}")
    print(f"Summary saved to: {os.path.join(CHUNKS_DIR, 'semantic_chunks_summary.json')}")
    print("\nTopic distribution:")
    for topic, count in sorted(topic_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {topic}: {count} chunks")

if __name__ == "__main__":
    process_all_letters()
