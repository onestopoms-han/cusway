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

    # Simple matching query logic
    # Find all ExplanatoryNote entries containing at least one keyword in their heading or content_ko
    notes = db.query(ExplanatoryNote).all()
    
    matches = []
    for note in notes:
        score = 0
        content_lower = note.content_ko.lower()
        heading_clean = note.heading.replace('.', '')

        for kw in keywords:
            kw_lower = kw.lower()
            # If keyword matches the heading code directly (e.g. '8483' or '2526')
            if kw_lower == heading_clean or kw_lower in note.heading:
                score += 50
            
            # Count occurrences in Korean content
            occurrences = content_lower.count(kw_lower)
            if occurrences > 0:
                score += (occurrences * 5)
        
        if score > 0:
            matches.append((note, score))

    # Sort matches by relevance score desc
    matches.sort(key=lambda x: x[1], reverse=True)
    
    # Return top 3 matched ExplanatoryNote models
    return [item[0] for item in matches[:3]]
