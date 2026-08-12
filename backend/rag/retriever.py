import re
from sqlalchemy.orm import Session
from backend.models import ExplanatoryNote

def retrieve_relevant_notes(query: str, db: Session):
    """
    Analyzes the query and performs a keyword match across ExplanatoryNote database table.
    Returns a list of matching notes sorted by simple relevance heuristic.
    """
    if not query:
        return []

    # Clean query and parse keywords
    keywords = [kw.strip() for kw in re.split(r'[\s,\.\-\(\)]+', query) if len(kw.strip()) >= 2]
    if not keywords:
        return []

    # Query with filter to avoid full DB load in memory (prevents serverless crash)
    from sqlalchemy import or_
    filters = []
    for kw in keywords[:3]: # Limit to first 3 keywords to avoid complex SQL
        filters.append(ExplanatoryNote.content_ko.like(f"%{kw}%"))
        filters.append(ExplanatoryNote.heading.like(f"%{kw}%"))
        
    notes = db.query(ExplanatoryNote).filter(or_(*filters)).limit(50).all()
    
    matches = []
    for note in notes:
        score = 0
        content_lower = note.content_ko.lower()
        heading_clean = note.heading.replace('.', '')

        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower == heading_clean or kw_lower in note.heading:
                score += 50
            
            occurrences = content_lower.count(kw_lower)
            if occurrences > 0:
                score += (occurrences * 5)
        
        if score > 0:
            matches.append((note, score))

    matches.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in matches[:3]]

