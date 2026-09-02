import sqlite3
import urllib.request
import urllib.parse
import re
import time
import random
import sys
from bs4 import BeautifulSoup

# Set encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def search_dem_no(keyword):
    """
    Search case number keyword on tt.go.kr and return the dem_no (internal ID)
    """
    url = 'https://www.tt.go.kr/mUser/search/searchList.do'
    params = urllib.parse.urlencode({
        'txtKeyword': keyword,
        'taxDivs': 'doc',
        'selectViewCnt': '3'
    }).encode('utf-8')
    
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, data=params, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8')
            
            soup = BeautifulSoup(html, 'html.parser')
            box = soup.find(class_='result-box')
            if not box:
                return None
            
            # 1. Check onclick attribute for popups
            a_tag = box.find('a', onclick=True)
            if a_tag:
                onclick_text = a_tag['onclick']
                dem_match = re.search(r'dem_no=(\d+)', onclick_text)
                if dem_match:
                    return dem_match.group(1)
                    
            # 2. Check href attribute
            a_tag_href = box.find('a', href=True)
            if a_tag_href:
                href_text = a_tag_href['href']
                dem_match = re.search(r'dem_no=(\d+)', href_text)
                if dem_match:
                    return dem_match.group(1)
            
            return None
        except Exception as e:
            if attempt == 0:
                time.sleep(2)
            else:
                print(f"   [WARN] Error searching {keyword}: {e}")
                return None
    return None

def fetch_decision_text(dem_no):
    """
    Fetch full text document from XML viewer using dem_no
    """
    url = f'https://www.tt.go.kr/mUser/common/xmlViewer.do?dem_no={dem_no}&db=s'
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            with urllib.request.urlopen(req, timeout=15) as response:
                html = response.read().decode('utf-8')
                
            soup = BeautifulSoup(html, 'html.parser')
            xml_data = soup.find(id='xmlData')
            if not xml_data:
                return None
                
            text = xml_data.get_text()
            return text.strip()
        except Exception as e:
            if attempt == 0:
                time.sleep(2)
            else:
                print(f"   [WARN] Error fetching text for dem_no {dem_no}: {e}")
                return None
    return None

def parse_reasoning_parts(raw_text):
    """
    Utility parser to break raw decision text into structured database fields
    """
    factual_background = ""
    reasoning_snippet = ""
    holding_ko = ""
    
    # 1. Order / Holding (주문)
    order_match = re.search(r'\[주\s*문\](.*?)(?=\[이\s*유\]|1\.\s*처분개요|\Z)', raw_text, re.DOTALL)
    if order_match:
        holding_ko = order_match.group(1).strip()
        
    # 2. Factual Background (처분개요 / 사실관계)
    facts_match = re.search(r'1\.\s*처분개요(.*?)(?=2\.\s*청구법인|2\.\s*청구인|\Z)', raw_text, re.DOTALL)
    if facts_match:
        factual_background = "【처분개요】\n" + facts_match.group(1).strip()
    else:
        # Fallback to general slice
        factual_background = raw_text[:1200]
        
    # 3. Reasoning (판단이유)
    reasoning_match = re.search(r'3\.\s*심리\s*및\s*판단(.*?)(?=4\.\s*결론|\Z)', raw_text, re.DOTALL)
    if not reasoning_match:
        reasoning_match = re.search(r'판단(.*?)(?=결론|\Z)', raw_text, re.DOTALL)
        
    if reasoning_match:
        reasoning_snippet = "【심리 및 판단】\n" + reasoning_match.group(1).strip()
    else:
        reasoning_snippet = raw_text
        
    return factual_background, holding_ko, reasoning_snippet

def extract_search_keyword(case_number):
    """
    Extract a search keyword like '2021관0074' from various case number formats
    """
    if not case_number:
        return None, None
        
    # Pattern: 4-digit year + '관' + digits
    match = re.search(r'(\d{4})[^\d]*관[^\d]*(\d+)', case_number)
    if match:
        year = match.group(1)
        num = match.group(2)
        keyword = f"{year}관{num}"
        formatted = f"조심 {year}관{num}"
        return keyword, formatted
        
    return None, None

def run_master_recovery():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Target all precedents that have short/empty reasoning snippets and contain a case number
    cursor.execute("""
        SELECT id, case_number, title 
        FROM precedents 
        WHERE (reasoning_snippet IS NULL OR length(reasoning_snippet) <= 100 OR reasoning_snippet LIKE '%닫기%')
          AND case_number IS NOT NULL 
          AND case_number != ''
    """)
    records = cursor.fetchall()
    
    total_targets = len(records)
    print(f"=== [MASTER RECOVERY START] Target records: {total_targets} ===")
    
    success_count = 0
    failed_count = 0
    skip_count = 0
    
    for idx, (rid, raw_case_number, title) in enumerate(records, 1):
        keyword, formatted_case_no = extract_search_keyword(raw_case_number)
        
        if not keyword:
            skip_count += 1
            continue
            
        print(f"[{idx}/{total_targets}] Processing {rid} | Target: {keyword}...")
        
        # Step 1: Search dem_no
        dem_no = search_dem_no(keyword)
        if not dem_no:
            print(f"   [MISS] Could not find dem_no for: {keyword}")
            failed_count += 1
            time.sleep(0.3)
            continue
            
        # Step 2: Fetch decision full text
        raw_text = fetch_decision_text(dem_no)
        if not raw_text or len(raw_text) < 100:
            print(f"   [MISS] Empty text returned for dem_no: {dem_no}")
            failed_count += 1
            time.sleep(0.3)
            continue
            
        # Step 3: Parse contents
        factual, holding, reasoning = parse_reasoning_parts(raw_text)
        
        # Step 4: Update Database
        cursor.execute("""
            UPDATE precedents
            SET case_number = ?,
                factual_background = ?,
                holding_ko = ?,
                reasoning_snippet = ?
            WHERE id = ?
        """, (
            formatted_case_no,
            factual,
            holding if holding else "기각 또는 인용",
            reasoning,
            rid
        ))
        
        conn.commit()
        success_count += 1
        print(f"   [SUCCESS] Updated {rid} with {len(raw_text)} chars of authentic text!")
        
        # Polite delay to protect server
        time.sleep(random.uniform(0.6, 1.2))
        
    conn.close()
    print(f"\n=== [MASTER RECOVERY COMPLETED] ===")
    print(f"Total processed: {total_targets}")
    print(f"Successfully restored: {success_count}")
    print(f"Failed to find: {failed_count}")
    print(f"Skipped non-tribunal cases: {skip_count}")

if __name__ == "__main__":
    run_master_recovery()
