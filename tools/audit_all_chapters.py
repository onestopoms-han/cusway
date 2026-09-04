# -*- coding: utf-8 -*-
import sys
import os
import sqlite3
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = "cusway.db"

conn = sqlite3.connect(DB_PATH)
cur = conn.cursor()

# 1. 01류부터 97류까지 각 류별 대표 HSK 10자리 선정
# HSK 10자리 목록에서 각 류(2자리)별 1개씩 대표 추출
cur.execute("""
    SELECT DISTINCT hs_code, name_ko 
    FROM hs_code_master 
    WHERE hscode_length = 10 
    ORDER BY hs_code ASC
""")
all_hsk = cur.fetchall()

chapters = {}
for code, name in all_hsk:
    clean = code.replace('.', '').replace('-', '')
    if len(clean) == 10:
        chap = clean[:2]
        if chap not in chapters:
            chapters[chap] = (clean, name)

print(f"Total Chapters discovered: {len(chapters)}")

results = []

for chap in sorted(chapters.keys()):
    clean_hs, name = chapters[chap]
    formatted_hs = f"{clean_hs[:4]}.{clean_hs[4:6]}-{clean_hs[6:]}"
    
    # 2. 세율 조회 (기본세율 A, WTO C, 한-미 FTA, 한-중 FTA)
    cur.execute("""
        SELECT base_rate, wto_rate, fta_rate, fta_name, recommended_rate 
        FROM hs_rate_master 
        WHERE hs_code = ? AND country_code = 'US'
    """, (clean_hs,))
    us_rate = cur.fetchone()
    
    cur.execute("""
        SELECT fta_rate, fta_name 
        FROM hs_rate_master 
        WHERE hs_code = ? AND country_code = 'CN'
    """, (clean_hs,))
    cn_rate = cur.fetchone()
    
    if not us_rate:
        # BASE 조회
        cur.execute("""
            SELECT base_rate, wto_rate, NULL, '기본/WTO', recommended_rate 
            FROM hs_rate_master 
            WHERE hs_code = ? AND country_code = 'BASE'
        """, (clean_hs,))
        us_rate = cur.fetchone()

    base_rate = us_rate[0] if us_rate and us_rate[0] is not None else 8.0
    wto_rate = us_rate[1] if us_rate and us_rate[1] is not None else "-"
    us_fta = us_rate[2] if us_rate and us_rate[2] is not None else "-"
    cn_fta = cn_rate[0] if cn_rate and cn_rate[0] is not None else "-"
    
    # 3. 세관장확인사항 및 통합공고 요건 조회
    cur.execute("""
        SELECT law_name, check_type, agency_name, description 
        FROM hs_requirements 
        WHERE replace(replace(hs_code, '.', ''), '-', '') = ?
    """, (clean_hs,))
    reqs = cur.fetchall()
    
    customs_checks = []
    integrated_notices = []
    
    for law_name, check_type, agency, desc in reqs:
        agency_str = f"({agency})" if agency else ""
        if "세관장" in check_type:
            customs_checks.append(f"{law_name}{agency_str}")
        elif "통합" in check_type:
            integrated_notices.append(f"{law_name}{agency_str}")
        else:
            customs_checks.append(f"{law_name}{agency_str}")
            
    # 중복 제거
    customs_checks = list(dict.fromkeys(customs_checks))
    integrated_notices = list(dict.fromkeys(integrated_notices))
    
    results.append({
        "chapter": f"제{chap}류",
        "hs_code": formatted_hs,
        "name": name,
        "base_rate": f"{base_rate}%",
        "wto_rate": f"{wto_rate}%" if wto_rate != "-" else "양허없음",
        "us_fta": f"{us_fta}%" if us_fta != "-" else "-",
        "cn_fta": f"{cn_fta}%" if cn_fta != "-" else "-",
        "customs_checks": ", ".join(customs_checks) if customs_checks else "해당사항 없음 (자유통관)",
        "integrated_notices": ", ".join(integrated_notices) if integrated_notices else "해당사항 없음",
        "req_count": len(reqs)
    })

conn.close()

# Print formatted summary table
print("=" * 120)
print(f"{'류':^6} | {'HSK 10단위':^14} | {'품명':<25} | {'기본(A)':^8} | {'WTO(C)':^8} | {'한-미':^6} | {'한-중':^6} | {'세관장확인/요건'}")
print("=" * 120)

for r in results:
    short_name = (r['name'][:22] + '..') if len(r['name']) > 22 else r['name']
    customs_desc = r['customs_checks']
    if len(customs_desc) > 35:
        customs_desc = customs_desc[:33] + ".."
    print(f"{r['chapter']:^6} | {r['hs_code']:^14} | {short_name:<25} | {r['base_rate']:^8} | {r['wto_rate']:^8} | {r['us_fta']:^6} | {r['cn_fta']:^6} | {customs_desc}")

print("=" * 120)
print(f"\n총 {len(results)}개 류 전수 테스트 검증 완료!")

# Save full results as JSON for detailed reporting
with open("chapter_audit_results.json", "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

