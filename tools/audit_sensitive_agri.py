import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 주요 민감 및 초민감 농축산물 대표 품목군 정의
SENSITIVE_ITEMS = [
    # 07류 채소류
    {"code": "0701900000", "name": "감자(신선/냉장)", "chapter": "07류"},
    {"code": "0702000000", "name": "토마토", "chapter": "07류"},
    {"code": "0703101000", "name": "양파", "chapter": "07류"},
    {"code": "0703201000", "name": "마늘(통마늘)", "chapter": "07류"},
    {"code": "0703209000", "name": "마늘(깐마늘/기타)", "chapter": "07류"},
    {"code": "0709601000", "name": "신선 고추", "chapter": "07류"},
    {"code": "0712340000", "name": "건조 표고버섯", "chapter": "07류"},
    {"code": "0713310000", "name": "팥/녹두(영두)", "chapter": "07류"},
    {"code": "0713320000", "name": "붉은 팥", "chapter": "07류"},
    
    # 08류 과실 및 견과류
    {"code": "0802410000", "name": "탈각하지 않은 밤", "chapter": "08류"},
    {"code": "0802310000", "name": "탈각하지 않은 호두", "chapter": "08류"},
    {"code": "0805100000", "name": "오렌지", "chapter": "08류"},
    {"code": "0805210000", "name": "만다린/감귤", "chapter": "08류"},
    {"code": "0806100000", "name": "신선 포도", "chapter": "08류"},
    {"code": "0808100000", "name": "사과", "chapter": "08류"},
    {"code": "0808300000", "name": "배", "chapter": "08류"},
    {"code": "0813401000", "name": "곶감", "chapter": "08류"},
    {"code": "0813402000", "name": "대추", "chapter": "08류"},
    
    # 09류 향신료
    {"code": "0904210000", "name": "건조 고추", "chapter": "09류"},
    {"code": "0904220000", "name": "고춧가루/분쇄고추", "chapter": "09류"},
    {"code": "0910110000", "name": "신선/건조 생강", "chapter": "09류"},
    
    # 10류 곡물
    {"code": "1001990000", "name": "밀", "chapter": "10류"},
    {"code": "1005900000", "name": "옥수수", "chapter": "10류"},
    {"code": "1006100000", "name": "벼(쌀)", "chapter": "10류"},
    {"code": "1006200000", "name": "현미", "chapter": "10류"},
    {"code": "1006300000", "name": "백미(정미)", "chapter": "10류"},
    {"code": "1006400000", "name": "쇄미", "chapter": "10류"},
    {"code": "1008100000", "name": "메밀", "chapter": "10류"},
    
    # 11류 제분/전분
    {"code": "1101000000", "name": "밀가루", "chapter": "11류"},
    {"code": "1108120000", "name": "옥수수 전분", "chapter": "11류"},
    {"code": "1108130000", "name": "감자 전분", "chapter": "11류"},
    {"code": "1108140000", "name": "매니옥(타피오카) 전분", "chapter": "11류"},
    
    # 12류 채유종자/특작
    {"code": "1201901000", "name": "식용 대두", "chapter": "12류"},
    {"code": "1201909000", "name": "채유용/기타 대두", "chapter": "12류"},
    {"code": "1202410000", "name": "탈각하지 않은 땅콩", "chapter": "12류"},
    {"code": "1202420000", "name": "탈각한 땅콩", "chapter": "12류"},
    {"code": "1207400000", "name": "참깨", "chapter": "12류"},
    {"code": "1207990000", "name": "들깨", "chapter": "12류"},
    {"code": "1211201000", "name": "수삼", "chapter": "12류"},
    {"code": "1211202000", "name": "홍삼", "chapter": "12류"},
    {"code": "1211209000", "name": "백삼/기타 인삼", "chapter": "12류"},
    
    # 02/04류 축산/낙농
    {"code": "0201300000", "name": "쇠고기(냉장 본리스)", "chapter": "02류"},
    {"code": "0202300000", "name": "쇠고기(냉동 본리스)", "chapter": "02류"},
    {"code": "0203299000", "name": "돼지고기 삼겹살(냉동)", "chapter": "02류"},
    {"code": "0402100000", "name": "탈지분유", "chapter": "04류"},
    {"code": "0402210000", "name": "전지분유", "chapter": "04류"},
    {"code": "0406900000", "name": "치즈(기타)", "chapter": "04류"},
    
    # 21류 조제품
    {"code": "2103901030", "name": "고추장", "chapter": "21류"},
    {"code": "2103901010", "name": "된장", "chapter": "21류"},
    {"code": "2103901020", "name": "간장", "chapter": "21류"},
]

COUNTRIES = [
    ("US", "미국 (한-미 FTA)"),
    ("CN", "중국 (한-중 FTA)"),
    ("EU", "EU (한-EU FTA)"),
    ("VN", "베트남 (한-베/한-아세안)"),
    ("AU", "호주 (한-호주 FTA)"),
    ("CL", "칠레 (한-칠레 FTA)"),
    ("CA", "캐나다 (한-캐나다 FTA)"),
    ("JP", "일본 (RCEP)"),
    ("NZ", "뉴질랜드 (한-뉴 FTA)"),
    ("GB", "영국 (한-영 FTA)"),
]

print("="*100)
print(f"{'HS Code':<12} | {'품목명':<16} | {'기본(A)':<7} | {'WTO(C)':<7} | {'원산지':<4} | {'FTA 협정명':<22} | {'FTA세율':<12} | {'선택세/산식'}")
print("="*100)

issues_found = []

for item in SENSITIVE_ITEMS:
    code = item["code"]
    clean = code.replace(".", "").replace("-", "")
    
    # 기본/WTO 조회
    cur.execute("SELECT base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE hs_code = ? AND (country_code IS NULL OR country_code = '' OR country_code = 'KR' OR country_code = 'WTO') LIMIT 1", (clean,))
    base_row = cur.fetchone()
    if not base_row:
        cur.execute("SELECT base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE hs_code LIKE ? LIMIT 1", (f"{clean[:6]}%",))
        base_row = cur.fetchone()
        
    base_rate = base_row[0] if base_row else "N/A"
    wto_rate = base_row[1] if base_row else "N/A"
    
    for c_code, c_desc in COUNTRIES:
        # FTA 레코드 조회
        cur.execute("SELECT fta_rate, fta_name, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code = ? ORDER BY fta_rate ASC LIMIT 1", (clean, f"{clean[:6]}%", c_code))
        fta_row = cur.fetchone()
        
        fta_rate_str = f"{fta_row[0]}%" if (fta_row and fta_row[0] is not None) else "양허제외(NULL)"
        fta_name_str = fta_row[1] if (fta_row and fta_row[1]) else c_desc
        formula_str = fta_row[5] if (fta_row and fta_row[5]) else ""
        
        # 검증 로직: 만약 중국(CN)이나 일본(JP/RCEP)인데 쌀, 마늘, 양파, 고추, 사과, 배, 곶감, 대추, 참깨 등에 0.0%가 들어가 있는 경우
        if c_code in ["CN", "JP"] and fta_row and fta_row[0] == 0.0:
            if clean.startswith(("1006", "0703", "0904", "0808", "0813", "120740")):
                issues_found.append(f"[오류 발견] {c_code} {code} ({item['name']}): FTA세율이 0.0%로 잘못 저장되어 있음 -> 양허제외(NULL) 처리 필요")
                
        # 쌀(1006)의 경우 모든 FTA에서 양허제외여야 함
        if clean.startswith("1006") and fta_row and fta_row[0] is not None and fta_row[0] < 50.0:
            issues_found.append(f"[오류 발견] {c_code} 쌀({code}): FTA세율 {fta_row[0]}% 등록됨 -> 전 FTA 양허제외 필요")

        # 출력 (요약 표)
        if c_code in ["US", "CN", "EU", "AU"]:
            print(f"{code:<12} | {item['name'][:14]:<16} | {str(base_rate):<7} | {str(wto_rate):<7} | {c_code:<4} | {fta_name_str[:20]:<22} | {fta_rate_str:<12} | {formula_str}")

print("\n" + "="*100)
print(f"총 검사 품목 수: {len(SENSITIVE_ITEMS)}개 품목군")
print(f"발견된 DB 불일치 이슈: {len(issues_found)}건")
for issue in issues_found:
    print(" - " + issue)
print("="*100)

conn.close()
