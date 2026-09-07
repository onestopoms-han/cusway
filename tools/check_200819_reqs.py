# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()
cur.execute("SELECT hs_code, law_name, agency_name, check_type FROM hs_requirements WHERE hs_code LIKE ? OR hs_code LIKE ?", ('%2008.19%', '%200819%'))
rows = cur.fetchall()
print(f"Total requirements for 2008.19: {len(rows)}")
for r in rows:
    print(r)
conn.close()
