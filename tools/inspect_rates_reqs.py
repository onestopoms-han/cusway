import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

codes = ['0813402000', '0902100000', '0207141010', '0803900000', '0703101010', '0910111000', '0306179091', '0406300000', '0406901000']
for code in codes:
    print(f"\n=== Code: {code} ===")
    cur.execute("SELECT country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, duty_type FROM hs_rate_master WHERE replace(replace(hs_code, '.', ''), '-', '') = ?", (code,))
    rows = cur.fetchall()
    print(f"  Rates count: {len(rows)}")
    for r in rows[:4]:
        print(f"    {r}")
    cur.execute("SELECT law_name, agency_name, check_type FROM hs_requirements WHERE replace(replace(hs_code, '.', ''), '-', '') = ?", (code,))
    reqs = cur.fetchall()
    print(f"  Reqs count: {len(reqs)}")
    for req in reqs:
        print(f"    {req}")

conn.close()
