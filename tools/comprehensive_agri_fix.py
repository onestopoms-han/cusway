import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 1. 쌀(1006호 전체)은 대한민국 모든 FTA 협정에서 예외없이 양허제외 -> fta_rate = NULL
print("1. Updating Rice (1006) across all FTAs to 양허제외...")
cur.execute("UPDATE hs_rate_master SET fta_rate = NULL, fta_name = fta_name || ' (양허제외)' WHERE hs_code LIKE '1006%' AND fta_rate IS NOT NULL AND NOT (fta_name LIKE '%양허제외%')")

# 2. 중국산(CN) 및 일본/RCEP(JP) 초민감 품목 중 DB에 잘못 0% 또는 저율로 들어간 레코드 NULL 처리
# (참깨 120740, 고추 0904, 마늘 070320, 양파 070310, 팥/녹두 0713, 인삼 121120, 사과/배 0808, 곶감/대추 081340, 생강 091011, 밤/잣 0802)
sensitive_cn_prefixes = [
    '120740', '120799', '090421', '090422', '090420', '070960', '071080',
    '070310', '070320', '071234', '071239', '071331', '071332', '071333',
    '121120', '080810', '080830', '081340', '091011', '091012', '080241', '080242', '080290'
]

print("2. Cleaning CN/JP sensitive agricultural records in hs_rate_master...")
for pref in sensitive_cn_prefixes:
    # CN
    cur.execute("UPDATE hs_rate_master SET fta_rate = NULL, fta_name = '한-중 FTA (양허제외)' WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code = 'CN' AND (fta_rate = 0.0 OR fta_rate < 10.0)", (pref, f"{pref}%"))
    # JP
    cur.execute("UPDATE hs_rate_master SET fta_rate = NULL, fta_name = 'RCEP (양허제외)' WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code IN ('JP', 'RCEP') AND (fta_rate = 0.0 OR fta_rate < 10.0)", (pref, f"{pref}%"))

conn.commit()
print("Database updates committed successfully.")
conn.close()
