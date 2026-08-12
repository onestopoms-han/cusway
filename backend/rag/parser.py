import re
import os

def parse_explanatory_notes(filepath: str):
    """
    Parses raw_explanatory_notes.txt and structures it into Heading blocks.
    Returns a list of dicts: [{'heading': '01.02', 'content_ko': '...', 'content_en': '...'}]
    """
    if not os.path.exists(filepath):
        print(f"Explanatory notes file not found: {filepath}")
        return []

    with open(filepath, 'r', encoding='utf-8') as f:
        full_text = f.read()

    blocks = full_text.split("--------------------------------------------------")
    
    parsed_items = {}
    current_chapter = ""
    current_section = ""

    ko_headings = {}
    en_headings = {}

    heading_pattern = re.compile(r"^(\d{2}\.\d{2})\s*-\s*(.+)$")

    for block in blocks:
        block = block.strip()
        if not block:
            continue
        
        lines = block.split('\n')
        first_line = lines[0].strip()

        # Check if block is an English version note
        is_english = "[ENGLISH VERSION" in first_line or "ENGLISH VERSION" in block[:100]

        # Detect heading numbers like "01.02 - 살아 있는 소" or "01.02 Live bovine animals"
        found_heading = None
        for line in lines[:5]:
            line_clean = line.strip()
            m = heading_pattern.match(line_clean)
            if m:
                found_heading = m.group(1)
                break
            
            if re.match(r"^\d{2}\.\d{2}$", line_clean):
                found_heading = line_clean
                break

            en_m = re.match(r"^(\d{2}\.\d{2})\s+[A-Za-z]+", line_clean)
            if en_m:
                found_heading = en_m.group(1)
                break

        if found_heading:
            if is_english:
                en_headings[found_heading] = block
            else:
                ko_headings[found_heading] = block
            continue

        if "제" in first_line and "부" in first_line:
            current_section = first_line
        elif "제" in first_line and "류" in first_line:
            current_chapter = first_line

    all_codes = set(list(ko_headings.keys()) + list(en_headings.keys()))
    
    results = []
    for code in sorted(all_codes):
        results.append({
            "heading": code,
            "content_ko": ko_headings.get(code, ""),
            "content_en": en_headings.get(code, ""),
            "section": current_section,
            "chapter": current_chapter
        })

    return results
