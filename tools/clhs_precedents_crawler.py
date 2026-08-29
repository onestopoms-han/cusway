import requests
from bs4 import BeautifulSoup
import re
import sqlite3
import time
import random
import sys
import os

# Set standard output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

# CLHS Login Details
LOGIN_URL = "https://www.clhs.co.kr/login/loginok.asp?u_id=onestopcus&u_pass=*ONESTOP*&u_autoid=chk&u_autopass=chk"
PRECEDENT_LIST_URL = "https://www.clhs.co.kr/userHSlist.asp"

def clean_hsk(hs_code):
    return re.sub(r'\D', '', hs_code)

def format_hsk(clean):
    if len(clean) == 10:
        return f"{clean[:4]}.{clean[4:6]}-{clean[6:]}"
    return clean

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

def crawl_precedents_for_hsk(session, hs_code):
    clean = clean_hsk(hs_code)
    formatted = format_hsk(clean)
    
    print(f"\n🔍 [CRAWL] Searching precedents for: {formatted} (clean: {clean})")
    
    # Query precedents with searchselect=1 (HSK search) and strDes = HSK
    payload = {
        "searchselect": "1",
        "strDes": clean
    }
    
    try:
        resp = session.post(PRECEDENT_LIST_URL, data=payload, timeout=15)
        if resp.status_code != 200:
            print(f"   [WARN] Query failed for HSK {formatted}: status {resp.status_code}")
            return []
            
        resp.encoding = "euc-kr"
        soup = BeautifulSoup(resp.text, "html.parser")
        
        rows = soup.find_all("tr")
        precedents = []
        
        for r in rows:
            cells = r.find_all("td")
            if len(cells) >= 4:
                link = cells[0].find("a")
                if link and "userHSread.asp" in link.get("href", ""):
                    hsk_code = link.text.strip()
                    
                    prod_link = cells[1].find("a")
                    prod_name = prod_link.text.strip() if prod_link else ""
                    
                    case_id_link = cells[2].find("a")
                    case_id = case_id_link.text.strip() if case_id_link else ""
                    
                    date_str = cells[3].text.strip()
                    
                    # Fetch detailed page
                    read_href = link.get("href")
                    read_url = "https://www.clhs.co.kr/" + read_href
                    
                    # Prevent aggressive crawling
                    time.sleep(random.uniform(0.3, 0.7))
                    
                    detail_resp = session.get(read_url, timeout=15)
                    if detail_resp.status_code == 200:
                        detail_resp.encoding = "euc-kr"
                        detail_soup = BeautifulSoup(detail_resp.text, "html.parser")
                        
                        # Extract the table cell containing 물품설명 & 결정사유
                        # It is typically a cell with text '물품설명' inside or the cell next to it
                        detail_cells = detail_soup.find_all("td")
                        decision_reason = "상세 분류이유 내용을 파싱할 수 없습니다."
                        
                        for dc in detail_cells:
                            dc_text = dc.get_text()
                            if "물품설명" in dc_text and "결정사유" in dc_text:
                                # Clean and format text
                                clean_lines = []
                                for line in dc_text.split('\n'):
                                    stripped = line.strip()
                                    if stripped:
                                        clean_lines.append(stripped)
                                decision_reason = "\n".join(clean_lines)
                                break
                        
                        precedents.append({
                            "case_number": case_id,
                            "hs_code": hsk_code,
                            "product_name": prod_name,
                            "decision_reason": decision_reason,
                            "date": date_str
                        })
                        print(f"   [SUCCESS] Crawled: {case_id} | {prod_name} | Reason length: {len(decision_reason)}")
                        
        return precedents
        
    except Exception as e:
        print(f"   [ERROR] Failed querying {formatted}: {e}")
        return []

def save_precedents_to_db(precedents):
    if not precedents:
        return
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    count = 0
    for p in precedents:
        # Avoid saving placeholders or failed parsing records
        if "파싱할 수 없습니다" in p["decision_reason"]:
            continue
            
        cursor.execute("""
            INSERT OR REPLACE INTO customs_precedents 
            (case_number, hs_code, product_name, decision_reason, issuing_body, date) 
            VALUES (?, ?, ?, ?, '관세평가분류원', ?)
        """, (
            p["case_number"],
            p["hs_code"],
            p["product_name"],
            p["decision_reason"],
            p["date"]
        ))
        count += 1
        
    conn.commit()
    conn.close()
    print(f"💾 [DB] Successfully saved {count} precedents to customs_precedents table.")

if __name__ == "__main__":
    # If HSK codes are passed as arguments, crawl them. Otherwise, crawl a test HSK.
    hsk_targets = sys.argv[1:] if len(sys.argv) > 1 else ["8517.62-9030"]
    
    try:
        session = get_clhs_session()
        
        all_precedents = []
        for hsk in hsk_targets:
            precedents = crawl_precedents_for_hsk(session, hsk)
            all_precedents.extend(precedents)
            time.sleep(random.uniform(0.5, 1.0))
            
        save_precedents_to_db(all_precedents)
        print("\n🎉 [CRAWL_FINISHED] Precedents update complete.")
        
    except Exception as e:
        print(f"Fatal error during CLHS precedents crawl: {e}")
