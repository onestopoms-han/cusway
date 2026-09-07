# -*- coding: utf-8 -*-
import sqlite3

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

cur.execute("""
SELECT hs_code, name_ko, name_en 
FROM hs_code_master 
WHERE hs_code IN ('1207.40-0000', '1207.99-1000', '1208.90-9000', '2008.19-3000', '2008.19-9000', '1207400000', '1207991000', '1208909000', '2008193000', '2008199000')
ORDER BY hs_code
""")

print("=== Official HSK Master Entries for Sesame & Perilla ===")
for r in cur.fetchall():
    print(f"HSK {r[0]:<14} | KO: {r[1]:<30} | EN: {r[2]}")

conn.close()
