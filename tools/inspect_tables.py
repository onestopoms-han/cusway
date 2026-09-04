import sqlite3
import os

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

cur.execute("SELECT name, type FROM sqlite_master WHERE type IN ('table', 'index')")
for r in cur.fetchall():
    if r[1] == 'table':
        cnt = cur.execute(f"SELECT COUNT(*) FROM {r[0]}").fetchone()[0]
        print(f"Table: {r[0]:<25} | Rows: {cnt}")

conn.close()
