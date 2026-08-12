import re
from sqlalchemy.orm import Session
from backend.models import ExplanatoryNote

# Common Korean customs query stopwords
STOPWORDS = {
    "재질", "용도", "기능", "구성", "성분", "물품", "제품", "수입", "대상", 
    "분류", "추천", "기계", "장치", "기구", "사용", "제조", "제작", "부품", "도면"
}

def retrieve_relevant_notes(query: str, db: Session):
    """
    Analyzes the query and performs a keyword match across ExplanatoryNote database table.
    Prioritizes HS Heading codes, filters out stopwords, and applies a multi-factor score.
    """
    if not query:
        return []

    # 1. HS Code / Heading detection (e.g. 8483, 85, 3920.10)
    # Extract digit sequences of length 2 to 4 representing chapter or heading
    numeric_keywords = re.findall(r'\b\d{2,4}\b', query)
    
    # Clean query and parse standard text keywords
    raw_keywords = [kw.strip() for kw in re.split(r'[\s,\.\-\(\)]+', query) if len(kw.strip()) >= 2]
    keywords = [kw for kw in raw_keywords if kw not in STOPWORDS]
    
    # If standard keywords are empty due to filtering, revert to raw keywords to avoid empty search
    if not keywords:
        keywords = raw_keywords
    
    if not keywords and not numeric_keywords:
        return []

    from sqlalchemy import or_
    filters = []
    
    # Boost search by numeric heading queries
    for num_kw in numeric_keywords:
        # Match as prefix or exact heading string format (e.g. 84.83 or 84)
        formatted_num = num_kw if len(num_kw) == 2 else f"{num_kw[:2]}.{num_kw[2:]}"
        filters.append(ExplanatoryNote.heading.like(f"%{formatted_num}%"))
        
    # Also add standard text matching filters
    for kw in keywords[:4]: # Limit to top 4 text keywords to avoid complex SQL execution
        filters.append(ExplanatoryNote.content_ko.like(f"%{kw}%"))
        filters.append(ExplanatoryNote.heading.like(f"%{kw}%"))
        
    if not filters:
        return []
        
    # Query matching candidate notes
    notes = db.query(ExplanatoryNote).filter(or_(*filters)).limit(60).all()
    
    matches = []
    for note in notes:
        score = 0
        content_lower = note.content_ko.lower()
        heading_clean = note.heading.replace('.', '')
        heading_raw = note.heading
        
        # Factor A: Exact/partial heading code matching (highest priority)
        for num_kw in numeric_keywords:
            if num_kw == heading_clean:
                score += 800  # Exact heading number match (e.g. "8483" -> "84.83")
            elif num_kw in heading_clean:
                score += 300  # Chapter or sub-part number match
        
        # Factor B: Keyword match in heading title/code
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower == heading_clean or kw_lower in heading_raw:
                score += 150
                
            # Factor C: Frequency score in description content
            occurrences = content_lower.count(kw_lower)
            if occurrences > 0:
                # Add score proportional to occurrence frequency
                score += (occurrences * 8)
                # Small bonus for uniqueness/distinct match
                score += 20
                
        if score > 0:
            matches.append((note, score))

    # Sort matches by calculated score in descending order
    matches.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in matches[:3]]


