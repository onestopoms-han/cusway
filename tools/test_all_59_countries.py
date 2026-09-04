import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

EU_COUNTRIES = {"AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "EU"}
ASEAN_COUNTRIES = {"VN", "SG", "TH", "ID", "MY", "PH", "KH", "LA", "MM", "BN", "ASEAN"}
RCEP_COUNTRIES = {"CN", "JP", "AU", "NZ", "VN", "SG", "TH", "ID", "MY", "PH", "KH", "LA", "MM", "BN", "KR", "RCEP"}

COUNTRY_FTA_MAP = {
    # 한-EU FTA 27개 회원국
    "DE": "한-EU FTA (독일)", "FR": "한-EU FTA (프랑스)", "IT": "한-EU FTA (이탈리아)", "NL": "한-EU FTA (네덜란드)", "ES": "한-EU FTA (스페인)",
    "BE": "한-EU FTA (벨기에)", "PL": "한-EU FTA (폴란드)", "SE": "한-EU FTA (스웨덴)", "AT": "한-EU FTA (오스트리아)", "EU": "한-EU FTA",
    # 주요 개별 및 다자 체결국
    "US": "한-미 FTA", "CN": "한-중 FTA / RCEP", "JP": "RCEP (일본)", "VN": "한-베트남 FTA", "AU": "한-호주 FTA", "CL": "한-칠레 FTA",
    "PE": "한-페루 FTA", "CA": "한-캐나다 FTA", "GB": "한-영 FTA", "NZ": "한-뉴질랜드 FTA", "IN": "한-인도 CEPA", "SG": "한-싱가포르 FTA",
    "CH": "한-EFTA FTA (스위스)", "NO": "한-EFTA FTA (노르웨이)", "CO": "한-콜롬비아 FTA", "TR": "한-터키 FTA", "IL": "한-이스라엘 FTA",
    "CR": "한-중미 FTA (코스타리카)", "PA": "한-중미 FTA (파나마)", "ID": "한-인니 CEPA", "TH": "한-아세안 FTA (태국)", "PH": "한-필리핀 FTA"
}

def get_representative_countries(origin_upper: str):
    targets = [origin_upper]
    if origin_upper in EU_COUNTRIES:
        targets.extend(["EU", "IT", "DE", "FR", "ES", "NL"])
    if origin_upper in ASEAN_COUNTRIES:
        targets.extend(["ASEAN", "VN"])
    if origin_upper in RCEP_COUNTRIES:
        targets.extend(["RCEP"])
    if origin_upper in {"CH", "NO", "IS", "LI", "EFTA"}:
        targets.extend(["EFTA", "IT", "EU"])
    if origin_upper in {"GB", "UK"}:
        targets.extend(["GB", "UK"])
    if origin_upper == "CL":
        targets.extend(["CL", "CHILE"])
    if origin_upper == "PE":
        targets.extend(["PE", "PERU"])
    if origin_upper in {"CO", "PA", "CR", "HN", "SV", "NI"}:
        targets.extend(["PE", "CL"])
    if origin_upper in {"TR", "IL"}:
        targets.extend(["IT", "EU"])
    return list(set(targets))

sample_origins = ["US", "CN", "DE", "FR", "IT", "JP", "VN", "AU", "CL", "PE", "CA", "GB", "NZ", "IN", "SG", "CH", "NO", "CO", "TR", "IL", "CR", "ID", "TH"]
sample_hs = "8504402090" # 인버터
clean = sample_hs
fmt = f"{clean[:4]}.{clean[4:6]}" # 8504.40

print("=== 21개 전체 FTA 체결국 공산품(8504.40) 특혜세율 전수 검증 ===")
for org in sample_origins:
    targets = get_representative_countries(org)
    placeholders = ', '.join(['?'] * len(targets))
    cur.execute(f"SELECT fta_rate, fta_name FROM hs_rate_master WHERE (replace(replace(hs_code, '.', ''), '-', '') = ? OR hs_code LIKE ? OR hs_code LIKE ?) AND country_code IN ({placeholders}) AND fta_rate IS NOT NULL ORDER BY fta_rate ASC LIMIT 1", [clean, f"{clean[:6]}%", f"{fmt}%"] + targets)
    row = cur.fetchone()
    
    fta_title = COUNTRY_FTA_MAP.get(org, f"FTA ({org})")
    rate_val = f"{row[0]}%" if row else "양허제외"
    print(f"[{org:<2}] {fta_title:<26} ➔ 특혜세율: {rate_val}")

conn.close()
