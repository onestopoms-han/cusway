import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

test_cases = [
    ("0804.40-0000", "아보카도"),
    ("0804.50-2000", "망고"),
    ("0806.10-0000", "신선 포도"),
    ("0307.43-0000", "냉동 오징어"),
    ("0709.20-0000", "아스파라거스"),
    ("0901.11-0000", "커피 생두"),
    ("2603.00-0000", "구리광"),
    ("1006.30-0000", "쌀(백미)"),
    ("1207.40-0000", "참깨"),
]

print("=== 페루(PE) API 산출 로직 최종 테스트 ===")
for hs, name in test_cases:
    clean = hs.replace(".", "").replace("-", "")
    
    # Base
    cur.execute("SELECT base_rate, wto_rate FROM hs_rate_master WHERE hs_code = ? AND (country_code IS NULL OR country_code = '' OR country_code = 'KR' OR country_code = 'WTO') LIMIT 1", (clean,))
    base_row = cur.fetchone()
    b_rate = base_row[0] if base_row else 8.0
    
    # PE FTA
    cur.execute("SELECT fta_rate, fta_name FROM hs_rate_master WHERE hs_code = ? AND country_code = 'PE' LIMIT 1", (clean,))
    fta_row = cur.fetchone()
    
    fta_rate = fta_row[0] if fta_row else None
    fta_name = fta_row[1] if fta_row else "한-페루 FTA"
    
    rec_rate = min([r for r in [b_rate, fta_rate] if r is not None])
    
    print(f"[{hs}] {name:<10} | 기본세율: {b_rate}% | 한-페루 FTA세율: {fta_rate if fta_rate is not None else '양허제외'} | 추천세율: {rec_rate}%")

conn.close()
