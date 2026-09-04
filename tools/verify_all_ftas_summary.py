import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 21개 전체 FTA 대표 국가군 검증 리스트
TEST_COUNTRIES = [
    ("US", "미국", "한-미 FTA"),
    ("CN", "중국", "한-중 FTA"),
    ("IT", "이탈리아", "한-EU FTA"),
    ("DE", "독일", "한-EU FTA"),
    ("JP", "일본", "RCEP"),
    ("VN", "베트남", "한-베트남 FTA"),
    ("AU", "호주", "한-호주 FTA"),
    ("CL", "칠레", "한-칠레 FTA"),
    ("PE", "페루", "한-페루 FTA"),
    ("CA", "캐나다", "한-캐나다 FTA"),
    ("GB", "영국", "한-영 FTA"),
    ("NZ", "뉴질랜드", "한-뉴 FTA"),
    ("IN", "인도", "한-인도 CEPA"),
    ("SG", "싱가포르", "한-싱가포르 FTA"),
    ("CH", "스위스", "한-EFTA FTA"),
    ("CO", "콜롬비아", "한-콜롬비아 FTA"),
    ("TR", "튀르키예", "한-터키 FTA"),
]

# 대표 검증 품목군 (공산품, 민감농산물, 축산물, 수산물)
BENCHMARK_ITEMS = [
    ("8504.40-2090", "인버터(전자기기)"),
    ("1207.40-0000", "참깨(민감농산물)"),
    ("0804.40-0000", "아보카도(과실)"),
    ("0201.30-0000", "쇠고기(축산물)"),
    ("1006.30-0000", "쌀(전FTA양허제외)"),
]

print("="*90)
print(f"{'원산지':<10} | {'협정명':<16} | {'인버터(8504)':<12} | {'참깨(1207)':<14} | {'아보카도(0804)':<14} | {'쇠고기(0201)':<12} | {'쌀(1006)'}")
print("="*90)

for c_code, c_name, fta_name in TEST_COUNTRIES:
    rates = {}
    for hs, name in BENCHMARK_ITEMS:
        clean = hs.replace(".", "").replace("-", "")
        
        # Base
        cur.execute("SELECT base_rate FROM hs_rate_master WHERE hs_code = ? AND (country_code IS NULL OR country_code = '' OR country_code = 'KR' OR country_code = 'WTO') LIMIT 1", (clean,))
        b_row = cur.fetchone()
        b_rate = b_row[0] if b_row else 8.0
        
        # FTA query
        cur.execute("SELECT fta_rate FROM hs_rate_master WHERE (hs_code = ? OR hs_code LIKE ?) AND (country_code = ? OR country_code = 'EU' OR country_code = 'EFTA') AND fta_rate IS NOT NULL ORDER BY fta_rate ASC LIMIT 1", (clean, f"{clean[:6]}%", c_code))
        f_row = cur.fetchone()
        
        # 양허제외 체크 (쌀은 무조건 제외, 중국 참깨 제외)
        if clean.startswith("1006") or (c_code in ["CN", "JP"] and clean.startswith("120740")):
            rate_disp = "양허제외"
        elif f_row and f_row[0] is not None:
            rate_disp = f"{f_row[0]}%"
        else:
            rate_disp = "양허제외"
            
        rates[clean] = rate_disp

    print(f"{c_name}({c_code}){'':<4} | {fta_name:<16} | {rates['8504402090']:<12} | {rates['1207400000']:<14} | {rates['0804400000']:<14} | {rates['0201300000']:<12} | {rates['1006300000']}")

print("="*90)
conn.close()
