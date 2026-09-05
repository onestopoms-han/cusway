import sqlite3
import json

def analyze_agricultural_trq_items():
    conn = sqlite3.connect('cusway.db')
    cur = conn.cursor()
    
    print("=" * 100)
    print("           [전국 관세율표 DB 기반 농림축산물 TRQ 및 특혜/선택세 전수 분석]")
    print("=" * 100)
    
    cur.execute("""
        SELECT hs_code, country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, specific_unit, duty_type, duty_formula
        FROM hs_rate_master
        WHERE hs_code LIKE '01%' OR hs_code LIKE '02%' OR hs_code LIKE '04%' OR hs_code LIKE '07%' 
           OR hs_code LIKE '08%' OR hs_code LIKE '09%' OR hs_code LIKE '10%' OR hs_code LIKE '11%' 
           OR hs_code LIKE '12%' OR hs_code LIKE '15%' OR hs_code LIKE '17%' OR hs_code LIKE '19%' 
           OR hs_code LIKE '20%' OR hs_code LIKE '21%'
        ORDER BY hs_code, country_code
    """)
    rows = cur.fetchall()
    
    items_by_prefix = {}
    for r in rows:
        hs, country, fta, base, wto, fta_r, spec_r, spec_u, d_type, d_formula = r
        clean_hs = hs.replace(".", "").replace("-", "")
        p4 = clean_hs[:4]
        if p4 not in items_by_prefix:
            items_by_prefix[p4] = []
        items_by_prefix[p4].append(r)
        
    print(f"총 {len(items_by_prefix)}개 4단위 호(Heading)에서 농수산물 세율 데이터 적재 확인됨.\n")
    
    target_headings = {
        "0402": "밀크/크림/분유 (전지분유, 탈지분유 등)",
        "0405": "버터 및 유제품 유지",
        "0406": "치즈류",
        "0409": "천연 꿀",
        "0701": "감자 (신선/냉장)",
        "0703": "양파, 마늘, 파, 리크",
        "0709": "기타 채소 (신선 버섯류 등)",
        "0712": "건조 채소 (건조 마늘, 건조 표고버섯, 건조 양파 등)",
        "0713": "건조 채두류 (팥, 녹두, 동부, 완두 등)",
        "0805": "감귤류 과실 (오렌지, 만다린, 레몬 등 - 계절관세)",
        "0806": "포도 (신선 포도 - 계절관세)",
        "0904": "고추 및 후추속 과실 (건조고추, 고춧가루)",
        "0910": "생강, 샤프란, 심황 등",
        "1005": "옥수수 (사료용, 가공용)",
        "1006": "쌀 (벼, 현미, 백미, 쇄미)",
        "1107": "맥아 (Malt - 맥주 양조용 원료)",
        "1108": "전분 (감자전분, 고구마전분, 옥수수전분)",
        "1201": "대두(콩) (채유용, 식용, 종자용)",
        "1202": "땅콩 (탈각, 미탈각)",
        "1207": "기타 기름을 함유한 종자 (참깨 1207.40, 들깨 1207.99)",
        "1211": "인삼, 홍삼 등 약용/한약재 식물",
        "1515": "참기름(1515.50), 들기름(1515.90)",
        "2005": "조제/보존처리 채소 (조제마늘 등)",
        "2008": "과실/견과류 조제품 (조제땅콩 등)",
        "2106": "홍삼 농축액/조제품, 기타 조제식료품"
    }
    
    print("[주요 초민감 농산물 TRQ & FTA 현황 요약]:\n")
    for p4, name in target_headings.items():
        sample_rows = items_by_prefix.get(p4, [])
        print(f"▶ [{p4}] {name} (등록된 국가별 레코드 수: {len(sample_rows)})")
        for sr in sample_rows[:6]:
            hs, cntry, fta, base, wto, fta_r, spec_r, spec_u, d_type, d_form = sr
            print(f"   - 국가: {cntry:<4} | 협정: {fta or '기본/WTO':<15} | 기본: {base}% | WTO: {wto}% | FTA: {fta_r}% | 종량: {spec_r}{spec_u if spec_r else ''} | 산식: {d_form}")
        print()

    conn.close()

if __name__ == "__main__":
    analyze_agricultural_trq_items()
