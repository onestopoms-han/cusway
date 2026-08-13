import re
from sqlalchemy.orm import Session
from backend.models import ExplanatoryNote, CustomsPrecedent

# Common Korean customs query stopwords
STOPWORDS = {
    "재질", "용도", "기능", "구성", "성분", "물품", "제품", "수입", "대상", 
    "분류", "추천", "기계", "장치", "기구", "사용", "제조", "제작", "부품", "도면",
    "속에", "속에는", "대신", "대신해주고", "할수", "할수있는", "있는", "있고", "탑제된", 
    "탑재된", "인간의", "일을", "하고", "하는", "으로", "에서", "은", "는", "이", "가", "외형"
}

# Core customs terms heavy boosts to guarantee accurate chapter RAG anchoring
CORE_KEYWORDS = {
    "인형": 800, "로봇": 800, "로보트": 800, "완구": 800, "장난감": 800, 
    "반도체": 600, "전동기": 500, "모터": 500, "유리": 400, "텀블러": 400, 
    "파스타": 500, "국수": 500, "발전기": 500, "스마트폰": 600, "전화기": 500
}

def normalize_korean_keyword(kw: str) -> str:
    """
    Cleans Korean particles (조사) and removes standard material/device suffixes 
    to extract pure search stems.
    """
    kw = kw.strip().lower()
    suffixes = ["은", "는", "이", "가", "을", "를", "의", "에", "와", "과", "로", "으로", "에서", "한", "된", "용", "제"]
    for s in suffixes:
        if len(kw) > len(s) + 1 and kw.endswith(s):
            kw = kw[:-len(s)]
            break
            
    if len(kw) > 3:
        for kw_end in ["재질", "성분", "제품", "장치", "기구", "로보트"]:
            if kw.endswith(kw_end):
                if kw_end == "로보트":
                    kw = kw[:-3] + "로봇"
                else:
                    kw = kw[:-len(kw_end)]
                break
    return kw

def retrieve_relevant_notes(query: str, db: Session):
    """
    Analyzes the query and performs a keyword match across ExplanatoryNote database table.
    Prioritizes HS Heading codes, filters out stopwords, and applies a multi-factor score.
    """
    if not query:
        return []

    # 1. HS Code / Heading detection (e.g. 8483, 85, 3920.10)
    numeric_keywords = re.findall(r'\b\d{2,4}\b', query)
    
    # Clean query and parse/normalize text keywords
    raw_keywords = [kw.strip() for kw in re.split(r'[\s,\.\-\(\)]+', query) if len(kw.strip()) >= 2]
    
    normalized = []
    for rk in raw_keywords:
        nk = normalize_korean_keyword(rk)
        if len(nk) >= 2 and nk not in STOPWORDS:
            normalized.append(nk)
            
    # De-duplicate keywords while preserving order
    keywords = []
    for k in normalized:
        if k not in keywords:
            keywords.append(k)
            
    if not keywords:
        keywords = [normalize_korean_keyword(rk) for rk in raw_keywords]
    
    if not keywords and not numeric_keywords:
        return []

    from sqlalchemy import or_
    filters = []
    
    # Boost search by numeric heading queries
    for num_kw in numeric_keywords:
        formatted_num = num_kw if len(num_kw) == 2 else f"{num_kw[:2]}.{num_kw[2:]}"
        filters.append(ExplanatoryNote.heading.like(f"%{formatted_num}%"))
        
    # Also add standard text matching filters (searching by normalized nouns)
    for kw in keywords[:5]: # Limit to top 5 keywords
        filters.append(ExplanatoryNote.content_ko.like(f"%{kw}%"))
        filters.append(ExplanatoryNote.heading.like(f"%{kw}%"))
        
    if not filters:
        return []
        
    # Query matching candidate notes
    notes = db.query(ExplanatoryNote).filter(or_(*filters)).limit(80).all()
    
    matches = []
    for note in notes:
        score = 0
        content_lower = note.content_ko.lower()
        heading_clean = note.heading.replace('.', '')
        heading_raw = note.heading
        
        # Factor A: Exact/partial heading code matching
        for num_kw in numeric_keywords:
            if num_kw == heading_clean:
                score += 1500  # Elevated exact code weight
            elif num_kw in heading_clean:
                score += 500
        
        # Factor B: Keyword match in heading title/code
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower == heading_clean or kw_lower in heading_raw:
                score += 250
                
            # Factor C: Frequency score in description content
            occurrences = content_lower.count(kw_lower)
            if occurrences > 0:
                score += (occurrences * 12)
                score += 30
                
            # Factor D: Core keyword heavy boost to prevent irrelevant heading takeovers
            if kw_lower in CORE_KEYWORDS:
                if kw_lower in content_lower or kw_lower in heading_raw:
                    score += CORE_KEYWORDS[kw_lower]
                
        if score > 0:
            matches.append((note, score))

    # Sort matches by calculated score in descending order
    matches.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in matches[:3]]


def retrieve_relevant_precedents(query: str, db: Session):
    """
    Retrieves matching official customs precedents from the database.
    """
    if not query:
        return []

    # Clean query and parse keywords
    raw_keywords = [kw.strip() for kw in re.split(r'[\s,\.\-\(\)]+', query) if len(kw.strip()) >= 2]
    keywords = [kw for kw in raw_keywords if kw not in STOPWORDS]
    if not keywords:
        keywords = raw_keywords

    numeric_keywords = re.findall(r'\b\d{2,4}\b', query)

    from sqlalchemy import or_
    filters = []
    
    # 1. Match by HS Code prefix/exact (highest priority)
    for num in numeric_keywords:
        filters.append(CustomsPrecedent.hs_code.like(f"%{num}%"))
        
    # 2. Match by keyword in product name, material, function
    for kw in keywords[:4]:
        filters.append(CustomsPrecedent.product_name.like(f"%{kw}%"))
        filters.append(CustomsPrecedent.material.like(f"%{kw}%"))
        filters.append(CustomsPrecedent.function_use.like(f"%{kw}%"))
        
    if not filters:
        return []
        
    precedents = db.query(CustomsPrecedent).filter(or_(*filters)).limit(20).all()
    
    matches = []
    for prec in precedents:
        score = 0
        hscode_clean = prec.hs_code.replace('.', '').replace('-', '')
        
        # Numeric match boost
        for num in numeric_keywords:
            if num in hscode_clean:
                score += 500
                
        # Keyword match boosts
        for kw in keywords:
            kw_lower = kw.lower()
            if kw_lower in prec.product_name.lower():
                score += 150
            if prec.material and kw_lower in prec.material.lower():
                score += 80
            if prec.function_use and kw_lower in prec.function_use.lower():
                score += 80
                
        if score > 0:
            matches.append((prec, score))
            
    matches.sort(key=lambda x: x[1], reverse=True)
    return [item[0] for item in matches[:2]]



