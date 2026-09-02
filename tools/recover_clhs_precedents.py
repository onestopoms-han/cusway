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

def search_dem_no(case_number):
    """
    Search case number on tt.go.kr and return the dem_no (internal ID)
    """
    match = re.search(r'(\d{4}\s*관\s*\d+)', case_number)
    if not match:
        return None
    keyword = match.group(1).replace(' ', '')
    
    url = 'https://www.tt.go.kr/mUser/search/searchList.do'
    params = urllib.parse.urlencode({
        'txtKeyword': keyword,
        'taxDivs': 'doc',
        'selectViewCnt': '3'
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(url, data=params, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8')
        
        soup = BeautifulSoup(html, 'html.parser')
        box = soup.find(class_='result-box')
        if not box:
            return None
        
        # Check onclick attribute for popups
        a_tag = box.find('a', onclick=True)
        if a_tag:
            onclick_text = a_tag['onclick']
            dem_match = re.search(r'dem_no=(\d+)', onclick_text)
            if dem_match:
                return dem_match.group(1)
                
        # Fallback to href if any
        a_tag_href = box.find('a', href=True)
        if a_tag_href:
            href_text = a_tag_href['href']
            dem_match = re.search(r'dem_no=(\d+)', href_text)
            if dem_match:
                return dem_match.group(1)
        
        return None
    except Exception as e:
        print(f"Error searching {case_number}: {e}")
        return None

def fetch_decision_text(dem_no):
    """
    Fetch full text document from XML viewer using dem_no
    """
    url = f'https://www.tt.go.kr/mUser/common/xmlViewer.do?dem_no={dem_no}&db=s'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as response:
            html = response.read().decode('utf-8')
            
        soup = BeautifulSoup(html, 'html.parser')
        xml_data = soup.find(id='xmlData')
        if not xml_data:
            return None
            
        text = xml_data.get_text()
        return text.strip()
    except Exception as e:
        print(f"Error fetching text for dem_no {dem_no}: {e}")
        return None

def parse_reasoning_parts(raw_text):
    """
    Utility parser to break raw decision text into structured database fields
    """
    factual_background = ""
    reasoning_snippet = ""
    holding_ko = ""
    
    order_match = re.search(r'\[주\s*문\](.*?)(?=\[이\s*유\]|1\.\s*처분개요|\Z)', raw_text, re.DOTALL)
    if order_match:
        holding_ko = order_match.group(1).strip()
        
    facts_match = re.search(r'1\.\s*처분개요(.*?)(?=2\.\s*청구법인|2\.\s*청구인|\Z)', raw_text, re.DOTALL)
    if facts_match:
        factual_background = "【처분개요】\n" + facts_match.group(1).strip()
        
    reasoning_match = re.search(r'3\.\s*심리\s*및\s*판단(.*?)(?=4\.\s*결론|\Z)', raw_text, re.DOTALL)
    if not reasoning_match:
        reasoning_match = re.search(r'판단(.*?)(?=결론|\Z)', raw_text, re.DOTALL)
        
    if reasoning_match:
        reasoning_snippet = "【심리 및 판단】\n" + reasoning_match.group(1).strip()
    else:
        reasoning_snippet = raw_text
        
    return factual_background, holding_ko, reasoning_snippet

def run_recovery_clhs():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Select VAL-CLHS rows that have no reasoning snippet but contain a decodable case number
    cursor.execute("""
        SELECT id, case_number, title 
        FROM precedents 
        WHERE id LIKE 'VAL-CLHS-%' 
          AND (reasoning_snippet IS NULL OR reasoning_snippet = '')
          AND case_number LIKE '%관%'
    """)
    records = cursor.fetchall()
    
    print(f"Starting CLHS empty reasoning recovery for {len(records)} records...")
    
    success_count = 0
    
    for rid, case_number, title in records:
        print(f"\nProcessing {rid} ({case_number})...")
        
        # Clean case number format (e.g., '조심2024관0129')
        match = re.search(r'(조심\s*\d{4}\s*관\s*\d+)', case_number)
        if match:
            cleaned_case_number = match.group(1).replace(' ', '')
        else:
            # Try parsing double encoded text
            try:
                # Re-extract with regex after proper UTF-8 handling
                # Since sqlite returns str directly, case_number is already a unicode string.
                # If there are raw bytes hidden in string form, we try matching numbers and '관'
                sub_match = re.search(r'(\d{4})[^\d]*관[^\d]*(\d+)', case_number)
                if sub_match:
                    cleaned_case_number = f"조심{sub_match.group(1)}관{sub_match.group(2)}"
                else:
                    print(f"   [SKIP] Could not extract case number pattern from: {repr(case_number)}")
                    continue
            except Exception as ex:
                print(f"   [SKIP] Error parsing case number {repr(case_number)}: {ex}")
                continue
                
        print(f"   Cleaned Case Number: {cleaned_case_number}")
        
        # Search dem_no
        dem_no = search_dem_no(cleaned_case_number)
        if not dem_no:
            print(f"   [FAILED] Could not find dem_no for: {cleaned_case_number}")
            continue
            
        print(f"   Found dem_no: {dem_no}")
        
        # Fetch text
        raw_text = fetch_decision_text(dem_no)
        if not raw_text:
            print(f"   [FAILED] Could not fetch XML text for: {dem_no}")
            continue
            
        print(f"   Successfully fetched full text ({len(raw_text)} chars).")
        
        # Parse contents
        factual, holding, reasoning = parse_reasoning_parts(raw_text)
        
        # Update DB
        cursor.execute("""
            UPDATE precedents
            SET case_number = ?,
                factual_background = ?,
                holding_ko = ?,
                reasoning_snippet = ?
            WHERE id = ?
        """, (cleaned_case_number, factual if factual else raw_text[:1000], holding if holding else "기각 또는 인용", reasoning, rid))
        
        conn.commit()
        success_count += 1
        print(f"   [SUCCESS] Updated DB for {rid}!")
        
        # Random sleep to prevent server strain
        time.sleep(random.uniform(1.0, 2.0))
        
    conn.close()
    print(f"\nRecovery completed. Successfully restored {success_count} / {len(records)} CLHS records.")

if __name__ == "__main__":
    run_recovery_clhs()
