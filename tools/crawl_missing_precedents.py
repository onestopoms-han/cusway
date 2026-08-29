import sqlite3
import sys
import time
import random
import argparse
from clhs_precedents_crawler import get_clhs_session, crawl_precedents_for_hsk, save_precedents_to_db

# Force stdout encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def get_missing_hsk_list():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # decision_reason이 비어있거나 실패한 record가 있는 hs_code의 고유 목록
    cursor.execute("""
        SELECT DISTINCT hs_code FROM customs_precedents 
        WHERE decision_reason IS NULL 
           OR decision_reason = '' 
           OR decision_reason LIKE '%상세 분류이유 내용을 파싱할 수 없습니다%'
    """)
    hsk_list = [r[0] for r in cursor.fetchall()]
    conn.close()
    return hsk_list

def main():
    parser = argparse.ArgumentParser(description="Crawl missing CLHS precedents")
    parser.add_argument("--limit", type=int, default=10, help="Max number of HSK codes to crawl in this batch")
    args = parser.parse_args()
    
    hsk_targets = get_missing_hsk_list()
    total_missing = len(hsk_targets)
    print(f"[CRAWLER] Total unique HSKs missing precedents decision_reason: {total_missing}")
    
    if not hsk_targets:
        print("[CRAWLER] No missing precedents to crawl.")
        return
        
    targets = hsk_targets[:args.limit]
    print(f"[CRAWLER] Starting crawl for batch of {len(targets)} HSKs (limit={args.limit})...")
    
    try:
        session = get_clhs_session()
    except Exception as e:
        print(f"[CRAWLER] Login failed: {e}")
        return
        
    success_count = 0
    for idx, hsk in enumerate(targets):
        print(f"\n[BATCH {idx+1}/{len(targets)}] Targeting HSK: {hsk}")
        precedents = crawl_precedents_for_hsk(session, hsk)
        
        if precedents:
            # 겹치는 건들은 OR REPLACE 문으로 정리되어 들어감
            save_precedents_to_db(precedents)
            success_count += len(precedents)
        else:
            print(f"   [INFO] No precedents returned or query failed for {hsk}")
            
        # 방화벽 차단 방지 지연
        delay = random.uniform(1.0, 2.5)
        print(f"   [DELAY] Sleeping for {delay:.2f}s...")
        time.sleep(delay)
        
    print(f"\n[FINISHED] Crawled & updated {success_count} precedents for {len(targets)} HSKs.")

if __name__ == "__main__":
    main()
