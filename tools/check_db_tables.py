import sqlite3

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()

print("=== CUSWAY.DB TABLE COUNTS ===")
for t in tables:
    name = t[0]
    count = cur.execute(f'SELECT count(*) FROM "{name}"').fetchone()[0]
    print(f"{name:30} : {count:,} rows")

cur.execute("SELECT count(*) FROM precedents WHERE authority LIKE '%조세심판%' OR case_number LIKE '%조심%' OR case_number LIKE '%국심%' OR title LIKE '%심판%'")
print(f"Precedents (심판원 관련): {cur.fetchone()[0]:,} rows")

cur.execute("SELECT count(*) FROM customs_precedents")
print(f"Customs Precedents (품목분류 결정례): {cur.fetchone()[0]:,} rows")

conn.close()
