import sqlite3
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

GENERIC_STOPWORDS = {
    "제조용", "조제품", "함량", "중량", "초과", "이하", "한정한다", "제외하며", 
    "물질", "기본", "재료", "것으로서", "내용물", "무게가", "킬로그램", "직접", 
    "접하여", "포장된", "것으로", "그", "밖의", "포함한다", "전", "용량"
}

def resolve_deterministic_hsk10(raw_hs: str, product_name: str, material: str = "", function_use: str = "", db_conn=None):
    """
    Deterministically resolves and validates a 10-digit HSK code against official DB siblings.
    Calculates token and semantic overlap between the query text and sibling HSK candidate names.
    Returns: (resolved_hs_code, resolved_name_ko, candidate_structures)
    """
    if not raw_hs or raw_hs == "0000.00-0000":
        return raw_hs, "", []
        
    clean_digits = re.sub(r'[^\d]', '', raw_hs)
    if len(clean_digits) < 4:
        return raw_hs, "", []

    prefix_6 = clean_digits[:6]
    prefix_4 = clean_digits[:4]
    
    close_conn = False
    if db_conn is None:
        db_conn = sqlite3.connect('cusway.db')
        close_conn = True
        
    cursor = db_conn.cursor()
    
    # 1. Query all 10-digit candidates under 6-digit prefix
    cursor.execute("""
        SELECT hs_code, hscode_length, name_ko, name_en 
        FROM hs_code_master 
        WHERE (hs_code LIKE ? OR hs_code LIKE ?) AND hscode_length = 10
        ORDER BY hs_code
    """, (f"{prefix_6}%", f"{prefix_4}.{prefix_6[4:6]}%"))
    
    candidates = cursor.fetchall()
    
    # If no 10-digit candidates under 6-digit, try 4-digit prefix
    if not candidates:
        cursor.execute("""
            SELECT hs_code, hscode_length, name_ko, name_en 
            FROM hs_code_master 
            WHERE (hs_code LIKE ? OR hs_code LIKE ?) AND hscode_length = 10
            ORDER BY hs_code
        """, (f"{prefix_4}%", f"{prefix_4[:2]}.{prefix_4[2:]}%"))
        candidates = cursor.fetchall()

    if not candidates:
        if close_conn:
            db_conn.close()
        return raw_hs, "", []

    # Prepare query tokens and text
    full_text = f"{product_name} {material} {function_use}".lower()
    text_words = [w for w in re.findall(r'[\w가-힣]+', full_text) if w not in GENERIC_STOPWORDS]
    
    # Extract key morphemes / subwords for Korean (e.g., 참깨가루 -> 참깨, 가루, 볶은참깨 -> 볶은, 참깨)
    expanded_words = set(text_words)
    for w in list(text_words):
        if len(w) >= 3:
            for sub_len in range(2, len(w)):
                for i in range(len(w) - sub_len + 1):
                    sub_w = w[i:i+sub_len]
                    if sub_w not in GENERIC_STOPWORDS:
                        expanded_words.add(sub_w)
                    
    scored_candidates = []
    seen_clean_codes = set()
    
    for cand_code, cand_len, cand_name_ko, cand_name_en in candidates:
        clean_cand = re.sub(r'[^\d]', '', cand_code)
        if clean_cand in seen_clean_codes:
            continue
        seen_clean_codes.add(clean_cand)

        formatted_code = f"{clean_cand[:4]}.{clean_cand[4:6]}-{clean_cand[6:]}" if len(clean_cand) == 10 else cand_code
            
        cand_name_ko = cand_name_ko or ""
        cand_name_en = cand_name_en or ""
        cand_lower = f"{cand_name_ko} {cand_name_en}".lower()
        
        score = 0.0
        match_reasons = []
        
        # Exact clean match baseline
        if clean_cand == clean_digits:
            score += 5.0
            match_reasons.append("기존 제안 세번 기본점수")
            
        # 1. Exact phrase / word match (excluding generic stopwords)
        for w in set(text_words):
            if len(w) >= 2 and w in cand_lower:
                score += 80.0 * len(w)
                match_reasons.append(f"핵심어 일치: '{w}'")
                
        # 2. Sub-token matching from expanded morphemes
        for sw in expanded_words:
            if len(sw) >= 2 and sw in cand_lower:
                score += 30.0 * len(sw)
                
        # 3. High-weight domain keywords matching
        keyword_boosts = [
            ("가루", ["가루", "분말", "세말", "조말", "flour", "powder", "meal"]),
            ("분말", ["가루", "분말", "세말", "조말", "flour", "powder", "meal"]),
            ("참깨", ["참깨", "깨", "sesamum", "sesame"]),
            ("볶은", ["볶은", "구운", "roasted"]),
            ("밤", ["밤", "chestnut"]),
            ("코코넛", ["코코넛", "coconut"]),
            ("땅콩", ["땅콩", "피넛", "peanut", "ground-nut"]),
            ("버터", ["버터", "butter", "paste"]),
            ("도토리", ["도토리", "acorn"]),
            ("인삼", ["인삼", "ginseng"]),
            ("홍삼", ["홍삼", "red ginseng"]),
            ("커피", ["커피", "coffee"]),
            ("크림", ["크리머", "크림", "creamer"]),
            ("녹차", ["녹차", "green tea"]),
            ("홍차", ["홍차", "black tea"]),
            ("콜라", ["콜라", "cola"]),
            ("알로에", ["알로에", "aloe"]),
            ("효모", ["효모", "yeast"]),
            ("벌꿀", ["벌꿀", "꿀", "honey"]),
            ("로열젤리", ["로열젤리", "royal jelly"]),
        ]
        
        for input_kw, target_terms in keyword_boosts:
            input_has_kw = input_kw in full_text
            cand_has_kw = any(t in cand_lower for t in target_terms)
            
            if input_has_kw and cand_has_kw:
                score += 300.0
                match_reasons.append(f"특화 품목 키워드 적합: '{input_kw}'")
            elif not input_has_kw and cand_has_kw:
                # Penalty if candidate is specific to another item not mentioned in input
                if input_kw in ["밤", "코코넛", "도토리", "인삼", "홍삼", "피넛", "콜라", "알로에", "효모", "벌꿀", "로열젤리", "녹차", "홍차"]:
                    score -= 300.0
                    match_reasons.append(f"타 품목 전용 세번 감점: '{input_kw}' 미포함")

        # 4. Fallback "기타 (Other)" penalty or default base score
        if "기타" in cand_name_ko or "other" in cand_lower:
            score += 1.0
            
        scored_candidates.append({
            "code": formatted_code,
            "name_ko": cand_name_ko,
            "name_en": cand_name_en,
            "score": score,
            "reasons": match_reasons
        })
        
    # Sort candidates by score descending
    scored_candidates.sort(key=lambda x: x["score"], reverse=True)
    best = scored_candidates[0]
    
    if close_conn:
        db_conn.close()
        
    return best["code"], best["name_ko"], scored_candidates

if __name__ == "__main__":
    test_cases = [
        ("2008.19-1000", "볶은참깨가루", "참깨 100%", "식용 및 조미용"),
        ("2008.19-3000", "맛밤 (조리된 밤)", "밤 100%", "간식용"),
        ("2008.19-1000", "건조 코코넛 조제품", "코코넛 95%", "제과용"),
        ("2008.19-1000", "볶은 참깨 (원형 낟알)", "참깨 100%", "식용"),
        ("2008.11-9000", "피넛 버터 (땅콩 스프레드)", "땅콩 90%", "잼/스프레드"),
        ("2106.90-9099", "도토리 가루 조제품", "도토리 전분 100%", "묵 제조용"),
        ("2106.90-9099", "홍삼차 분말", "홍삼 농축액", "음용"),
        ("2106.90-9099", "커피크리머", "식물성 유지", "커피 첨가용")
    ]
    
    print("=" * 70)
    print("RUNNING DETERMINISTIC HSK 10-DIGIT RESOLVER TEST (OPTIMIZED)")
    print("=" * 70)
    
    for raw_hs, prod, mat, func in test_cases:
        res_code, res_name, structs = resolve_deterministic_hsk10(raw_hs, prod, mat, func)
        print(f"\n[QUERY] '{prod}' (Input HS: {raw_hs})")
        print(f"  👉 RESOLVED TO: {res_code} ({res_name})")
        print("  📊 SIBLING RANKING:")
        for s in structs[:4]:
            print(f"     - {s['code']:<15} (Score: {s['score']:>6.1f}) : {s['name_ko']}")
