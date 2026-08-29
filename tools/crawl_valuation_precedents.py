import requests
from bs4 import BeautifulSoup
import re
import sqlite3
import time
import random
import sys
import argparse

# Force stdout encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"
LOGIN_URL = "https://www.clhs.co.kr/login/loginok.asp?u_id=onestopcus&u_pass=*ONESTOP*&u_autoid=chk&u_autopass=chk"

def get_clhs_session():
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    print("[CLHS] Accessing login page...")
    session.get("https://www.clhs.co.kr/login/login.asp")
    
    print("[CLHS] Submitting login credentials...")
    resp = session.get(LOGIN_URL)
    if resp.status_code == 200:
        print("[CLHS] Login response success.")
        return session
    else:
        raise Exception(f"CLHS login failed with status code: {resp.status_code}")

def parse_detail_page(html):
    soup = BeautifulSoup(html, "html.parser")
    content_table = soup.find("table", id="AutoNumber3")
    if not content_table:
        return None
        
    text = content_table.get_text()
    
    # 1. 제목 및 구분 파싱
    title = ""
    category_raw = ""
    
    # 제목 영역 찾기
    title_td = content_table.find(lambda tag: tag.name == "td" and "제" in tag.text and "목" in tag.text)
    if title_td:
        # 제목 td 바로 다음 형제 td를 찾음
        title_val_td = title_td.find_next_sibling("td")
        if title_val_td:
            title = title_val_td.text.strip()
            
    # 구분 영역 찾기
    gubun_td = content_table.find(lambda tag: tag.name == "td" and "구" in tag.text and "분" in tag.text)
    if gubun_td:
        gubun_val_td = gubun_td.find_next_sibling("td")
        if gubun_val_td:
            category_raw = gubun_val_td.text.strip()
            
    # 날짜, 사건번호, 결정기관 파싱
    date_str = None
    case_number = ""
    authority = "관세청"
    
    date_match = re.search(r"결정일자\s*:\s*(\d{4}-\d{2}-\d{2})", category_raw)
    if date_match:
        date_str = date_match.group(1)
        
    # 날짜와 공백을 뺀 사건번호 문자열 추출
    clean_category = re.sub(r"\(결정일자\s*:\s*\d{4}-\d{2}-\d{2}\)", "", category_raw).strip()
    case_number = re.sub(r"\s+", " ", clean_category)
    
    if "조심" in case_number or "국심" in case_number or "심판" in case_number:
        authority = "조세심판원"
    elif "대법원" in case_number:
        authority = "대법원"
    elif "서울행법" in case_number or "고등법원" in case_number or "지방법원" in case_number or "판결" in case_number:
        authority = "법원"
    elif "관세청" in case_number:
        authority = "관세청"
        
    # 2. 내용 파싱
    content_td = content_table.find(lambda tag: tag.name == "td" and "내" in tag.text and "용" in tag.text)
    full_content = ""
    if content_td:
        content_val_td = content_td.find_next_sibling("td")
        if content_val_td:
            full_content = content_val_td.get_text().strip()
            
    if not full_content:
        full_content = text
        
    # 정규식 패턴을 이용해 각 필드 분할 시도
    key_issue = ""
    factual_background = ""
    holding_ko = ""
    customs_argument = ""
    importer_argument = ""
    reasoning_snippet = ""
    
    # 쟁점/결정요지
    issue_match = re.search(r"\[(?:결정요지|판시사항|쟁점|요지)\](.*?)(?=\[|\n\d+\.\s*처분개요|\n\d+\.\s*이유|\Z)", full_content, re.DOTALL)
    if issue_match:
        key_issue = issue_match.group(1).strip()
        holding_ko = key_issue  # 결정요지를 판결결과로 매핑
        
    # 처분개요/사실관계
    facts_match = re.search(r"\[(?:처분개요|사실관계)\](.*?)(?=\[|\n\d+\.\s*이유|\Z)", full_content, re.DOTALL)
    if not facts_match:
        # 1. 처분개요 형태
        facts_match = re.search(r"\d+\.\s*(?:처분개요|사실관계)(.*?)(?=\n\d+\.\s*(?:이유|주장)|\Z)", full_content, re.DOTALL)
    if facts_match:
        factual_background = facts_match.group(1).strip()
        
    # 처분청 의견 / 청구법인 주장 분할 시도
    customs_match = re.search(r"(?:처분청|세관장)\s*(?:의견|주장)(.*?)(?=(?:청구인|청구법인)\s*(?:의견|주장)|\Z)", full_content, re.DOTALL)
    if customs_match:
        customs_argument = customs_match.group(1).strip()
    importer_match = re.search(r"(?:청구인|청구법인)\s*(?:의견|주장)(.*?)(?=(?:판단|이유)|\Z)", full_content, re.DOTALL)
    if importer_match:
        importer_argument = importer_match.group(1).strip()
        
    # 이유/판단
    reasoning_match = re.search(r"\[(?:이유|판단)\](.*?)(?=\Z)", full_content, re.DOTALL)
    if not reasoning_match:
        reasoning_match = re.search(r"\d+\.\s*(?:이유|판단)(.*?)(?=\Z)", full_content, re.DOTALL)
    if reasoning_match:
        reasoning_snippet = reasoning_match.group(1).strip()
        
    # 만약 정밀 분할에 모두 실패한 경우 hold_ko에 전체 본문을 백업
    if not holding_ko and not reasoning_snippet:
        holding_ko = full_content
        
    # 카테고리 결정
    category = "valuation"
    category_ko = "관세평가"
    
    check_text = (title + " " + key_issue).lower()
    if "로열티" in check_text or "권리사용료" in check_text or "royalty" in check_text:
        category = "royalty"
        category_ko = "권리사용료 (로열티)"
    elif "특수관계" in check_text or "이전가격" in check_text or "transfer" in check_text:
        category = "transfer-pricing"
        category_ko = "특수관계자 거래 (이전가격)"
    elif "가산" in check_text or "수수료" in check_text:
        category = "additions"
        category_ko = "가산요소 (수수료 등)"
        
    return {
        "category": category,
        "category_ko": category_ko,
        "case_number": case_number,
        "title": title,
        "authority": authority,
        "date": date_str if date_str else "",
        "key_issue": key_issue if key_issue else title,
        "factual_background": factual_background if factual_background else "",
        "holding_ko": holding_ko if holding_ko else "",
        "customs_argument": customs_argument if customs_argument else "",
        "importer_argument": importer_argument if importer_argument else "",
        "reasoning_snippet": reasoning_snippet if reasoning_snippet else "",
        "implication_ko": "CLHS 수집 판례 기초 분석 데이터"
    }

def main():
    parser = argparse.ArgumentParser(description="Crawl CLHS Valuation Precedents")
    parser.add_argument("--limit", type=int, default=1000, help="Max number of precedents to crawl")
    args = parser.parse_args()
    
    try:
        session = get_clhs_session()
    except Exception as e:
        print(f"Login failed: {e}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    page = 1
    total_saved = 0
    
    print("[START] Crawling valuation precedents...")
    while total_saved < args.limit:
        list_url = f"https://www.clhs.co.kr/Cuslist.asp?pageno={page}"
        print(f"\n[PAGE {page}] Fetching list: {list_url}")
        
        try:
            resp = session.get(list_url, timeout=15)
            if resp.status_code != 200:
                print(f"Page {page} return status {resp.status_code}. Stopping.")
                break
                
            resp.encoding = "euc-kr"
            soup = BeautifulSoup(resp.text, "html.parser")
            links = soup.find_all("a", href=re.compile(r"cusread\.asp"))
            
            if not links:
                print("No precedent links found on this page. Finished.")
                break
                
            # 중복 링크 제거 (id 기반 고유화)
            unique_links = []
            seen_ids = set()
            for l in links:
                href = l.get("href")
                id_match = re.search(r"id=(\d+)", href)
                if id_match:
                    cid = id_match.group(1)
                    if cid not in seen_ids:
                        seen_ids.add(cid)
                        unique_links.append((cid, href))
            
            print(f"Found {len(unique_links)} unique precedents on page {page}.")
            
            for cid, href in unique_links:
                if total_saved >= args.limit:
                    break
                    
                val_id = f"VAL-CLHS-{cid}"
                
                # 중복 수집 방지 (Incremental crawling)
                cursor.execute("SELECT id FROM precedents WHERE id=?", (val_id,))
                if cursor.fetchone():
                    print(f"   [SKIP] Already exists: {val_id}")
                    continue
                    
                print(f"   [CRAWL] Fetching {val_id} (url: {href})...")
                
                # 방화벽 우회 딜레이
                time.sleep(random.uniform(0.5, 1.0))
                
                detail_url = "https://www.clhs.co.kr/" + href
                det_resp = session.get(detail_url, timeout=15)
                if det_resp.status_code == 200:
                    det_resp.encoding = "euc-kr"
                    data = parse_detail_page(det_resp.text)
                    if data:
                        cursor.execute("""
                            INSERT OR REPLACE INTO precedents (
                                id, category, category_ko, case_number, title, authority, date,
                                key_issue, factual_background, holding_ko, customs_argument,
                                importer_argument, reasoning_snippet, implication_ko
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        """, (
                            val_id,
                            data["category"],
                            data["category_ko"],
                            data["case_number"],
                            data["title"],
                            data["authority"],
                            data["date"],
                            data["key_issue"],
                            data["factual_background"],
                            data["holding_ko"],
                            data["customs_argument"],
                            data["importer_argument"],
                            data["reasoning_snippet"],
                            data["implication_ko"]
                        ))
                        conn.commit()
                        total_saved += 1
                        print(f"   [SUCCESS] Saved {val_id} | {data['case_number'][:30]}")
                    else:
                        print(f"   [WARN] Parsing failed for {val_id}")
                else:
                    print(f"   [WARN] Failed to fetch {val_id}: status {det_resp.status_code}")
                    
            page += 1
            
        except Exception as e:
            print(f"Error processing page {page}: {e}")
            break
            
    conn.close()
    print(f"\n[FINISHED] Process completed. Saved {total_saved} valuation precedents.")

if __name__ == "__main__":
    main()
