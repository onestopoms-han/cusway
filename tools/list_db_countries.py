import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

cur.execute("SELECT country_code, COUNT(*) FROM hs_rate_master GROUP BY country_code")
for r in cur.fetchall():
    print(r)

conn.close()
