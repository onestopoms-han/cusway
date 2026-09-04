import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

EU_COUNTRIES = {"AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "EU"}
ASEAN_COUNTRIES = {"VN", "SG", "TH", "ID", "MY", "PH", "KH", "LA", "MM", "BN", "ASEAN"}
RCEP_COUNTRIES = {"CN", "JP", "AU", "NZ", "VN", "SG", "TH", "ID", "MY", "PH", "KH", "LA", "MM", "BN", "KR", "RCEP"}

COUNTRY_FTA_MAP = {
    "US": ("한-미 FTA", "US"),
    "CN": ("한-중 FTA / RCEP", "CN"),
    "IT": ("한-EU FTA", "EU"),
    "AU": ("한-호주 FTA / RCEP", "AU"),
    "VN": ("한-베트남 FTA / 한-아세안 FTA", "VN"),
    "CL": ("한-칠레 FTA", "CL"),
    "CA": ("한-캐나다 FTA", "CA"),
    "NZ": ("한-뉴질랜드 FTA / RCEP", "NZ"),
}

CHINA_RCEP_EXCLUDED_PREFIXES = [
    "120740", "1207.40", # 참깨 (한-중 FTA 및 RCEP 양허제외)
    "070320", "0703.20", # 마늘
    "070310", "0703.10", # 양파
    "090420", "0904.20", # 고추
    "100610", "1006.10", "100620", "1006.20", "100630", "1006.30", "100640", "1006.40", # 쌀
    "080810", "0808.10", "080830", "0808.30", # 사과/배
    "081340", "0813.40", # 곶감/대추
]

def get_representative_countries(origin: str):
    origin_upper = origin.upper().strip()
    targets = [origin_upper]
    if origin_upper in EU_COUNTRIES:
        targets.extend(["EU", "IT", "DE", "FR", "ES", "NL"])
    if origin_upper in ASEAN_COUNTRIES:
        targets.extend(["ASEAN"])
    if origin_upper in RCEP_COUNTRIES:
        targets.extend(["RCEP"])
    return list(set(targets))

def test_rate(hs_code, origin):
    conn = sqlite3.connect('cusway.db')
    cur = conn.cursor()
    clean = hs_code.replace(".", "").replace("-", "").strip()
    origin_upper = origin.upper().strip()
    
    is_china_rcep_excluded = (origin_upper in ["CN", "JP", "RCEP"]) and any(clean.startswith(p.replace(".", "")) for p in CHINA_RCEP_EXCLUDED_PREFIXES)
    
    target_countries = get_representative_countries(origin_upper)
    fta_rate = None
    fta_name = None
    
    if not is_china_rcep_excluded:
        placeholders = ', '.join(['?'] * len(target_countries))
        cur.execute(f"SELECT fta_rate, fta_name FROM hs_rate_master WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code IN ({placeholders}) AND fta_rate IS NOT NULL ORDER BY fta_rate ASC LIMIT 1", [clean, f"{clean[:6]}%"] + target_countries)
        row = cur.fetchone()
        if row:
            fta_rate = row[0]
            fta_name = row[1]
            
    fta_info = COUNTRY_FTA_MAP.get(origin_upper)
    default_fta_name = fta_info[0] if fta_info else "미체결국"
    if fta_rate is not None:
        fta_name = default_fta_name if (origin_upper in EU_COUNTRIES or origin_upper in RCEP_COUNTRIES) else (fta_name or default_fta_name)
    else:
        fta_name = f"{default_fta_name} (양허제외/기본세율 적용)" if fta_info else "미체결국"
        
    conn.close()
    print(f"HS {hs_code} | Origin: {origin_upper} => FTA Rate: {fta_rate}%, FTA Name: {fta_name}")

print("--- Sesame 1207.40 ---")
test_rate("1207.40-0000", "CN")
test_rate("1207.40-0000", "US")
test_rate("1207.40-0000", "IT")
test_rate("1207.40-0000", "AU")

print("\n--- Potato 0701.90 ---")
test_rate("0701.90-0000", "CN")
test_rate("0701.90-0000", "US")
test_rate("0701.90-0000", "IT")
test_rate("0701.90-0000", "AU")
