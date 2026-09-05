import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

prefixes = ['120740', '120799', '120241', '120242', '120190', '151550', '151590', '1507']

print("=" * 100)
print("       [카테고리 1: 유지작물 및 식물성 유지 DB 전수 조회 결과]")
print("=" * 100)

for p in prefixes:
    print(f"\n▶ Prefix [{p}]")
    cur.execute("""
        SELECT id, hs_code, country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, specific_unit, duty_type, duty_formula, has_seasonal_rate
        FROM hs_rate_master
        WHERE replace(replace(hs_code, '.', ''), '-', '') LIKE ?
        ORDER BY hs_code, country_code
    """, (f"{p}%",))
    rows = cur.fetchall()
    print(f"  총 {len(rows)}개 레코드 발견:")
    for r in rows:
        print(f"    - ID: {r[0]:<6} | HSK: {r[1]:<12} | 국가: {r[2]:<4} | 협정: {r[3] or '기본/WTO':<18} | 기본: {r[4]}% | WTO: {r[5]}% | FTA: {r[6]}% | 종량: {r[7]}{r[8] or ''} | 형태: {r[9]} | 산식: {r[10]}")

conn.close()
