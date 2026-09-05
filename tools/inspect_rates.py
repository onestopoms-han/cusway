import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

print("=== 1207.40 (Sesame) ===")
cur.execute("SELECT id, hs_code, country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE hs_code LIKE '120740%'")
for r in cur.fetchall():
    print(r)

print("\n=== 0701.90 (Potato) ===")
cur.execute("SELECT id, hs_code, country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE hs_code LIKE '070190%'")
for r in cur.fetchall():
    print(r)

print("\n=== 0712.39 (Shiitake) ===")
cur.execute("SELECT id, hs_code, country_code, fta_name, base_rate, wto_rate, fta_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE hs_code LIKE '%071239%' OR hs_code LIKE '%0712.39%'")
for r in cur.fetchall():
    print(r)

conn.close()
