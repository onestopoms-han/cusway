import sqlite3
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def check_hsk(prefix):
    conn = sqlite3.connect('cusway.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT hs_code, hscode_length, name_ko, name_en 
        FROM hs_code_master 
        WHERE hs_code LIKE ? AND hs_code LIKE '%.%'
        ORDER BY hs_code
    """, (f"{prefix}%",))
    rows = cursor.fetchall()
    print(f"\n=== SIBLINGS FOR PREFIX {prefix} (Total: {len(rows)}) ===")
    for r in rows:
        print(f"Code: {r[0]:<15} | Len: {r[1]} | Name: {r[2]} | En: {r[3]}")

if __name__ == "__main__":
    check_hsk("2008.19")
    check_hsk("2008.11")
    check_hsk("1207.40")
    check_hsk("1208.90")
    check_hsk("0902")
    check_hsk("2106.90")
