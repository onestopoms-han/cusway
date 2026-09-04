import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

print("1. Fetching all base HS codes from hs_rate_master (country_code = 'BASE')...")
cur.execute("SELECT hs_code, base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula FROM hs_rate_master WHERE country_code = 'BASE'")
base_rows = cur.fetchall()
print(f"Total base items: {len(base_rows)}")

# 페루(PE) 양허제외 품목 (쌀, 고추, 마늘, 양파, 참깨, 들깨, 쇠고기 일부 등)
PERU_EXCLUDED_PREFIXES = (
    "1006", "110230", "11081910", # 쌀
    "120740", # 참깨
    "070320", # 마늘
    "070310", # 양파
    "090421", "090422", "090420", "070960", # 고추
    "071234", # 표고버섯
    "121120", # 인삼
    "080810", "080830", # 사과, 배
    "081340", # 곶감, 대추
    "071331", "071332", # 녹두, 팥
)

# 삭제 후 새로 삽입
cur.execute("DELETE FROM hs_rate_master WHERE country_code = 'PE'")

pe_inserts = []
for row in base_rows:
    hs_code, base_rate, wto_rate, specific_rate, specific_unit, duty_type, duty_formula = row
    clean = hs_code.replace(".", "").replace("-", "")
    
    # 양허제외 판단
    is_excluded = clean.startswith(PERU_EXCLUDED_PREFIXES)
    
    if is_excluded:
        fta_rate = None
        fta_name = "한-페루 FTA (양허제외)"
        spec_rate = None
        spec_unit = None
        d_type = "AD_VALOREM"
        d_formula = None
    else:
        # 한-페루 FTA는 2011년 발효 후 10~15년 경과하여 거의 전 품목(98%+) 0.0% 철폐 완료
        fta_rate = 0.0
        fta_name = "한-페루 FTA"
        spec_rate = None
        spec_unit = None
        d_type = "AD_VALOREM"
        d_formula = None
        
    pe_inserts.append((
        hs_code, "PE", base_rate, wto_rate, fta_rate, fta_name,
        fta_rate if fta_rate is not None else base_rate,
        spec_rate, spec_unit, d_type, d_formula
    ))

print(f"2. Inserting {len(pe_inserts)} records for Peru (PE)...")
cur.executemany("""
    INSERT INTO hs_rate_master (
        hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name,
        recommended_rate, specific_rate, specific_unit, duty_type, duty_formula
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
""", pe_inserts)

conn.commit()
print("Successfully inserted PE records into hs_rate_master.")

# 검증
cur.execute("SELECT COUNT(*) FROM hs_rate_master WHERE country_code = 'PE'")
print("Updated PE record count:", cur.fetchone()[0])

conn.close()
