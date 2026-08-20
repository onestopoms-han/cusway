import requests
from bs4 import BeautifulSoup
import re
import sqlite3
import time
import random
import sys

# 표준 출력 인코딩을 UTF-8로 강제 설정 (Windows 콘솔 한글 깨짐 방지)
sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

# CLHS Login 정보
LOGIN_URL = "https://www.clhs.co.kr/login/loginok.asp?u_id=onestopcus&u_pass=*ONESTOP*&u_autoid=chk&u_autopass=chk"
ANSWER_BASE_URL = "https://www.clhs.co.kr/Y2026/answer.asp"

# FTA 국가 코드 매핑 규칙
FTA_MAPPING = {
    "미국": "US",
    "EU": "IT",  # EU 대표로 이탈리아(IT) 사용 (기존 seed 데이터와 동일하게 매핑)
    "유럽": "IT",
    "중국": "CN",
    "베트남": "VN",
    "칠레": "CL",
    "일본": "JP",
    "인도": "IN",
    "호주": "AU",
    "아세안": "VN",  # 아세안 대표로 베트남(VN) 매핑
}

# 요건 검색용 법령 목록 및 매핑
KNOWN_LAWS = {
    "전파법": ("전파법", "국립전파연구원"),
    "식품위생법": ("수입식품안전관리 특별법", "식품의약품안전처"),
    "수입식품": ("수입식품안전관리 특별법", "식품의약품안전처"),
    "식품안전": ("수입식품안전관리 특별법", "식품의약품안전처"),
    "가축전염병": ("가축전염병 예방법", "농림축산검역본부"),
    "식물방역": ("식물방역법", "농림축산검역본부"),
    "수산물방역": ("수산물방역법", "국립수산물품질관리원"),
    "수산생물": ("수산물방역법", "국립수산물품질관리원"),
    "화장품법": ("화장품법", "식품의약품안전처"),
    "전기용품": ("전기용품 및 생활용품 안전관리법", "국가기술표준원"),
    "어린이제품": ("어린이제품 안전 특별법", "국가기술표준원"),
}

def clean_code(hs_code):
    return re.sub(r'\D', '', hs_code)

def format_code(clean):
    if len(clean) == 10:
        return f"{clean[:4]}.{clean[4:6]}-{clean[6:]}"
    return clean

def parse_clhs_page(html):
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()
    
    # 1. 관세율 파싱
    base_rate = 8.0  # 기본값
    wto_rate = 8.0   # 기본값
    fta_rates = []   # (국가코드, 세율%, fta_name) list
    
    # 기본관세 찾기
    base_match = re.search(r"기본관세\(A\):\s*([\d\.]+)%", text)
    if base_match:
        base_rate = float(base_match.group(1))
        
    # WTO관세 찾기
    wto_match = re.search(r"WTO협정관세\(C\):\s*([\d\.]+)%", text)
    if wto_match:
        wto_rate = float(wto_match.group(1))
        
    # FTA관세 찾기 (예: 중국(FCN1): 0%, 미국(FUS1): 0% 등)
    # 정규식: 국가명(FTA기호): 세율%
    fta_matches = re.finditer(r"([가-힣A-Z]+)\([A-Z0-9]+\):\s*([\d\.]+)%", text)
    for m in fta_matches:
        country_name = m.group(1)
        rate_val = float(m.group(2))
        
        # FTA_MAPPING에 속한 국가명인 경우 추가
        for k, code in FTA_MAPPING.items():
            if k in country_name:
                fta_rates.append({
                    "country_code": code,
                    "fta_rate": rate_val,
                    "fta_name": f"한-{k} FTA" if "RCEP" not in country_name else "RCEP"
                })
                break
                
    # 2. 수입 요건(세관장확인, 통합공고) 파싱
    requirements = []
    
    # 통합공고 및 세관장확인 텍스트가 시작되는 위치 찾기
    req_sections = ["수입요건", "통합공고", "세관장확인"]
    
    # 간편 파싱: 전체 텍스트에서 알려진 법률명이 존재하는지 검사
    for law_keyword, (law_name, agency) in KNOWN_LAWS.items():
        # HTML 텍스트 내에서 해당 키워드가 요건 관련 문맥에 등장하는지 확인
        if law_keyword in text:
            # 주변 텍스트(요건 설명) 추출
            # 법률명 주변 100자 가량을 추출하여 요건 설명으로 활용
            idx = text.find(law_keyword)
            start = max(0, idx - 10)
            end = min(len(text), idx + 120)
            snippet = text[start:end].replace("\n", " ").strip()
            
            # check_type 결정 (세관장확인 고시 내용이나 통합공고 인접 여부로 판단)
            check_type = "세관장확인"
            # 만약 법률 주변 50자 내에 '통합공고'가 먼저 나오거나 세관장확인이 없으면 통합공고로 처리
            sub_text = text[max(0, idx-50):idx+50]
            if "통합공고" in sub_text and "세관장확인" not in sub_text:
                check_type = "통합공고"
                
            requirements.append({
                "law_name": law_name,
                "agency_name": agency,
                "check_type": check_type,
                "description": f"{law_name}에 의거 수입 시 소관 기관 요건 확인 필수. ({snippet[:120]}...)"
            })
            
    return {
        "base_rate": base_rate,
        "wto_rate": wto_rate,
        "fta_rates": fta_rates,
        "requirements": requirements
    }

def main(limit=50):
    session = requests.Session()
    
    print("[1] Logging into CLHS...")
    try:
        login_resp = session.get(LOGIN_URL, timeout=10)
        if login_resp.status_code != 200:
            print("Login failed with status code:", login_resp.status_code)
            return
    except Exception as e:
        print("Login connection error:", e)
        return
        
    print("[2] Fetching HS Code list from DB...")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 전체 10자리 HSK 세번을 타겟으로 설정
    cursor.execute("""
        SELECT DISTINCT hs_code 
        FROM hs_code_master 
        WHERE length(replace(replace(hs_code, '.', ''), '-', '')) = 10
    """)
    all_codes = [r[0] for r in cursor.fetchall()]
    
    # 이미 구동된 세율 데이터가 있는 HSK는 건너뜀 (Incremental Crawling)
    cursor.execute("SELECT DISTINCT hs_code FROM hs_rate_master")
    existing_rates = set(r[0] for r in cursor.fetchall())
    
    codes_to_fetch = [c for c in all_codes if c not in existing_rates]
    print(f"Total target codes: {len(all_codes)} | Remaining to fetch: {len(codes_to_fetch)}")
    
    # Limit 적용
    codes_to_fetch = codes_to_fetch[:limit]
    print(f"Starting crawl for {len(codes_to_fetch)} codes...")
    
    success_count = 0
    for idx, raw_code in enumerate(codes_to_fetch):
        clean = clean_code(raw_code)
        formatted = format_code(clean)
        
        print(f"[{idx+1}/{len(codes_to_fetch)}] Fetching {formatted} (clean: {clean})...")
        
        try:
            resp = session.get(f"{ANSWER_BASE_URL}?strHS={clean}", timeout=10)
            if resp.status_code == 200:
                # Euc-KR 인코딩 보정
                resp.encoding = "euc-kr"
                data = parse_clhs_page(resp.text)
                
                # DB 저장 - HSRateMaster
                # 기본 WTO 데이터 저장 (국가코드는 대표적으로 US/CN/IT 등으로 복제 매핑해서 저장)
                default_countries = ["US", "CN", "IT"]
                # 1) FTA 매핑에 매치된 것이 있으면 그 정보 기반 저장
                saved_countries = set()
                for fta in data["fta_rates"]:
                    cursor.execute("""
                        INSERT OR REPLACE INTO hs_rate_master 
                        (hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    """, (
                        formatted,
                        fta["country_code"],
                        data["base_rate"],
                        data["wto_rate"],
                        fta["fta_rate"],
                        fta["fta_name"],
                        min(data["base_rate"], data["wto_rate"], fta["fta_rate"])
                    ))
                    saved_countries.add(fta["country_code"])
                    
                # 2) 수집 안 된 기본 국가들은 기본/WTO 세율로 채움
                for c in default_countries:
                    if c not in saved_countries:
                        cursor.execute("""
                            INSERT OR REPLACE INTO hs_rate_master 
                            (hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate)
                            VALUES (?, ?, ?, ?, ?, ?, ?)
                        """, (
                            formatted,
                            c,
                            data["base_rate"],
                            data["wto_rate"],
                            None,
                            "미협정국",
                            min(data["base_rate"], data["wto_rate"])
                        ))
                
                # DB 저장 - HSRequirement
                for req in data["requirements"]:
                    cursor.execute("""
                        INSERT OR REPLACE INTO hs_requirements 
                        (hs_code, law_name, agency_name, check_type, description)
                        VALUES (?, ?, ?, ?, ?)
                    """, (
                        formatted,
                        req["law_name"],
                        req["agency_name"],
                        req["check_type"],
                        req["description"]
                    ))
                    
                conn.commit()
                success_count += 1
                
            else:
                print(f"Failed to fetch {formatted} - status {resp.status_code}")
                
        except Exception as e:
            print(f"Error crawling {formatted}: {e}")
            
        # 방화벽 차단 방지용 지연 (0.5초 ~ 1.0초 랜덤)
        time.sleep(random.uniform(0.5, 1.0))
        
    conn.close()
    print(f"Crawl completed. Successfully updated {success_count} codes.")

if __name__ == "__main__":
    # 기본적으로 1차 검증용 50개 세번 테스트 수행
    limit_val = 50
    if len(sys.argv) > 1:
        try:
            limit_val = int(sys.argv[1])
        except ValueError:
            pass
    main(limit_val)
