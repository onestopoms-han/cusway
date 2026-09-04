import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

cur.execute("SELECT hs_code, base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE country_code = 'BASE'")
base_rows = cur.fetchall()

ALL_EXCLUDED_PREFIXES = ("1006", "110230", "11081910")

ADDITIONAL_COUNTRIES = [
    ("SG", "한-싱가포르 FTA", ()),
    ("CO", "한-콜롬비아 FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
    ("EFTA", "한-EFTA FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
    ("TR", "한-터키 FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
    ("PA", "한-중미 FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
    ("CR", "한-중미 FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
    ("HN", "한-중미 FTA", ("120740", "070320", "070310", "090421", "090422", "071234", "121120")),
]

for c_code, fta_title, excluded_sub in ADDITIONAL_COUNTRIES:
    cur.execute("DELETE FROM hs_rate_master WHERE country_code = ?", (c_code,))
    c_inserts = []
    for row in base_rows:
        hs_code, base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula = row
        clean = hs_code.replace(".", "").replace("-", "")
        
        is_ex = clean.startswith(ALL_EXCLUDED_PREFIXES) or (len(excluded_sub) > 0 and clean.startswith(excluded_sub))
        
        if is_ex:
            fta_rate = None
            fta_name = f"{fta_title} (양허제외)"
        else:
            fta_rate = 0.0
            fta_name = fta_title
            
        c_inserts.append((
            hs_code, c_code, base_rate, wto_rate, fta_rate, fta_name,
            fta_rate if fta_rate is not None else base_rate,
            None, None, "AD_VALOREM", None
        ))
    
    cur.executemany("""
        INSERT INTO hs_rate_master (
            hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name,
            recommended_rate, specific_rate, specific_unit, duty_type, duty_formula
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, c_inserts)
    print(f"Inserted {len(c_inserts)} records for {c_code} ({fta_title}).")

conn.commit()
print("All additional countries successfully populated.")
conn.close()
