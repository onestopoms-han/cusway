import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 주요 품목별 확인
ITEMS = [
    ("1207400000", "참깨"),
    ("1207990000", "들깨"),
    ("1201901000", "대두(식용)"),
    ("0701900000", "감자(신선)"),
    ("0703101000", "양파"),
    ("0703201000", "마늘(통마늘)"),
    ("0703209000", "마늘(깐마늘)"),
    ("0712340000", "건조 표고버섯"),
    ("0904210000", "건조 고추"),
    ("0904220000", "고춧가루"),
    ("0910110000", "생강"),
    ("1006100000", "벼(쌀)"),
    ("1006300000", "백미"),
    ("0808100000", "사과"),
    ("0808300000", "배"),
    ("0813401000", "곶감"),
    ("0813402000", "대추"),
    ("1211201000", "수삼"),
    ("0713310000", "녹두"),
    ("0713320000", "팥"),
    ("0802410000", "밤"),
    ("0802310000", "호두"),
    ("0402100000", "탈지분유"),
    ("0201300000", "쇠고기(냉장)"),
    ("0203299000", "돼지고기(삼겹살)")
]

COUNTRY_LIST = [
    ("US", "한-미 FTA"),
    ("CN", "한-중 FTA"),
    ("EU", "한-EU FTA"),
    ("VN", "한-베트남 FTA"),
    ("AU", "한-호주 FTA"),
    ("CL", "한-칠레 FTA"),
    ("CA", "한-캐나다 FTA"),
    ("JP", "RCEP(일본)"),
    ("NZ", "한-뉴질랜드 FTA"),
    ("GB", "한-영 FTA"),
    ("IN", "한-인도 CEPA"),
    ("PE", "한-페루 FTA"),
    ("TH", "한-아세안(태국)"),
]

print("=== 민감 농산물 전체 FTA 협정별 세율 전수조사 ===")
for code, name in ITEMS:
    clean = code.replace(".", "")
    print(f"\n[{name} - {code}]")
    
    # 기본/WTO
    cur.execute("SELECT base_rate, wto_rate FROM hs_rate_master WHERE hs_code = ? AND (country_code IS NULL OR country_code = '' OR country_code = 'KR' OR country_code = 'WTO') LIMIT 1", (clean,))
    base_info = cur.fetchone()
    if not base_info:
        cur.execute("SELECT base_rate, wto_rate FROM hs_rate_master WHERE hs_code LIKE ? LIMIT 1", (f"{clean[:6]}%",))
        base_info = cur.fetchone()
    b_rate = base_info[0] if base_info else "N/A"
    w_rate = base_info[1] if base_info else "N/A"
    print(f" -> 기본세율(A): {b_rate}%, WTO협정세율(C): {w_rate}%")
    
    for c_code, c_name in COUNTRY_LIST:
        cur.execute("SELECT fta_rate, fta_name, duty_formula FROM hs_rate_master WHERE (hs_code = ? OR hs_code LIKE ?) AND country_code = ? AND fta_rate IS NOT NULL ORDER BY fta_rate ASC LIMIT 1", (clean, f"{clean[:6]}%", c_code))
        r = cur.fetchone()
        if r:
            rate_val = f"{r[0]}%"
            formula = f" ({r[2]})" if r[2] else ""
            print(f"    * {c_code:<2} ({c_name:<12}): {rate_val:<8}{formula}")
        else:
            print(f"    * {c_code:<2} ({c_name:<12}): 양허제외(N/A / 기본 또는 양허세율 적용)")

conn.close()
