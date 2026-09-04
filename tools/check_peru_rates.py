import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 페루 주요 수입 품목군
PERU_ITEMS = [
    ("0804400000", "아보카도"),
    ("0804502000", "망고"),
    ("0806100000", "신선 포도"),
    ("0709200000", "아스파라거스"),
    ("0901110000", "커피(생두)"),
    ("0307430000", "냉동 오징어"),
    ("2603000000", "구리광(동광)"),
    ("5102110000", "알파카 털/사"),
    ("1207400000", "참깨"),
    ("0701900000", "감자"),
    ("1006300000", "쌀(백미)"),
]

print("=== 페루(PE) 주요 수입품목 한-페루 FTA 관세율 점검 ===")
cur.execute("SELECT COUNT(*) FROM hs_rate_master WHERE country_code = 'PE'")
print("hs_rate_master 내 PE 레코드 수:", cur.fetchone()[0])

for code, name in PERU_ITEMS:
    clean = code.replace(".", "")
    cur.execute("SELECT base_rate, wto_rate FROM hs_rate_master WHERE hs_code = ? AND (country_code IS NULL OR country_code = '' OR country_code = 'KR' OR country_code = 'WTO') LIMIT 1", (clean,))
    base_info = cur.fetchone()
    if not base_info:
        cur.execute("SELECT base_rate, wto_rate FROM hs_rate_master WHERE hs_code LIKE ? LIMIT 1", (f"{clean[:6]}%",))
        base_info = cur.fetchone()
    b_rate = base_info[0] if base_info else "N/A"
    
    cur.execute("SELECT fta_rate, fta_name, duty_formula FROM hs_rate_master WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code = 'PE' LIMIT 1", (clean, f"{clean[:6]}%"))
    r = cur.fetchone()
    if r and r[0] is not None:
        print(f"[{code}] {name:<12} | 기본세율: {b_rate}% | 한-페루 FTA: {r[0]}% ({r[1]})")
    else:
        print(f"[{code}] {name:<12} | 기본세율: {b_rate}% | 한-페루 FTA: 양허제외(N/A)")

conn.close()
