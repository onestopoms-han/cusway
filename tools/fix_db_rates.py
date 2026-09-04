import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# Update DB to fix the erroneous 0.0 fta_rate for CN 참깨 (1207400000)
# Under Korea-China FTA and RCEP, 1207400000 is 양허제외 (concession excluded), so fta_rate should be NULL
cur.execute("UPDATE hs_rate_master SET fta_rate = NULL, fta_name = '한-중 FTA (양허제외)' WHERE hs_code = '1207400000' AND country_code = 'CN'")

# Check other sensitive agricultural items for CN where fta_rate might be wrongly 0.0
sensitive_codes = ['1207400000', '0703200000', '0703100000', '0904200000', '0904210000', '0904220000', '1006100000', '1006200000', '1006300000', '1006400000', '0808100000', '0808300000']
for code in sensitive_codes:
    cur.execute("SELECT id, hs_code, country_code, fta_name, fta_rate FROM hs_rate_master WHERE hs_code = ? AND country_code = 'CN'", (code,))
    rows = cur.fetchall()
    print(f"CN {code}: {rows}")

conn.commit()
conn.close()
print("DB fix applied.")
