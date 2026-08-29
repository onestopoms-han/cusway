import sqlite3
import os
import json

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

# 모사 함수 (main.py의 get_clearance_guide_api 로직과 동일하게 구현하여 테스트)
def simulate_get_clearance_guide(hs_code):
    clean_code = hs_code.replace(".", "").replace("-", "")
    formatted_codes = [
        hs_code,
        f"{clean_code[:4]}.{clean_code[4:6]}-{clean_code[6:]}" if len(clean_code) == 10 else hs_code,
        clean_code
    ]
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. 요건 내역 조회
    placeholders = ",".join("?" for _ in formatted_codes)
    cursor.execute(f"SELECT law_name, agency_name, check_type, description FROM hs_requirements WHERE hs_code IN ({placeholders})", formatted_codes)
    reqs = cursor.fetchall()
    
    unique_reqs = {}
    for r_law_name, r_agency_name, r_check_type, r_description in reqs:
        key = r_law_name
        # 중복 병합
        if key in unique_reqs:
            existing = unique_reqs[key]
            if r_check_type and r_check_type not in existing["check_type"]:
                existing["check_type"] = f"{existing['check_type']}/{r_check_type}"
        else:
            unique_reqs[key] = {
                "law_name": r_law_name,
                "agency_name": r_agency_name,
                "check_type": r_check_type,
                "description": r_description
            }
            
    conn.close()
    return list(unique_reqs.values())

def test_items():
    # 테스트할 대표 품목 리스트
    test_cases = [
        ("아답터", "8504.40-3010"),
        ("스마트폰", "8517.13-0000"),
        ("유선전화기", "8517.11-0000"),
        ("컴퓨터", "8471.30-0000"),
        ("모니터", "8528.52-9000")
    ]
    
    print("=== Clearance Guide Deduplication API Test ===")
    for name, hs in test_cases:
        results = simulate_get_clearance_guide(hs)
        print(f"\n[품목: {name} ({hs})]")
        if not results:
            print(" -> 요건이 없습니다 (무규제/무신고 품목)")
        else:
            for idx, r in enumerate(results):
                print(f"  {idx+1}. 법령명: {r['law_name']} | 기관: {r['agency_name']} | 구분: {r['check_type']}")
                
if __name__ == "__main__":
    test_items()
