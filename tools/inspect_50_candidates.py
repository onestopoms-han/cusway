import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

prefixes = [
    "0202", "0204", "0206", "0209", "0210",
    "0401", "0402", "0404", "0405", "0407", "0408", "0409",
    "0701", "0702", "0710", "0712", "0713",
    "0802", "0806", "0808", "0811",
    "0904", "0905", "0906",
    "1001", "1005",
    "1101", "1107", "1108",
    "1201", "1202", "1211",
    "1507", "1511",
    "1601", "1602", "1604",
    "1701", "1806", "1902", "1905", "2005", "2103", "2202", "2309"
]

print("=== CHECKING 10-DIGIT CODES FOR 50 CANDIDATES ===")
for p in prefixes:
    cur.execute("SELECT hs_code, name_ko FROM hs_code_master WHERE hs_code LIKE ? AND hscode_length = 10 LIMIT 3", (f"{p}%",))
    rows = cur.fetchall()
    print(f"\n▶ Prefix {p}: {len(rows)} samples")
    for r in rows:
        print(f"   {r[0]} : {r[1]}")

conn.close()
