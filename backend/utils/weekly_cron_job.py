# -*- coding: utf-8 -*-
import subprocess
import os
import sys

def run_weekly_crawlers():
    print("[CRON] Starting weekly incremental crawl job for Customs Precedents...")
    
    # 1. Run Tax Tribunal Crawler for latest 30 cases
    print("[CRON] 1. Crawling latest Tax Tribunal precedents...")
    try:
        res = subprocess.run(
            ["python", "backend/utils/crawl_tax_tribunal.py", "30"],
            capture_output=True,
            text=True,
            check=True
        )
        print(res.stdout)
    except Exception as e:
        print(f"[CRON-ERROR] Tax Tribunal crawl failed: {e}", file=sys.stderr)
        
    # 2. Run Customs Analysis Crawler for latest 30 cases
    print("[CRON] 2. Crawling latest Customs Chemical Analysis precedents...")
    try:
        res = subprocess.run(
            ["python", "backend/utils/crawl_customs_analysis.py", "30"],
            capture_output=True,
            text=True,
            check=True
        )
        print(res.stdout)
    except Exception as e:
        print(f"[CRON-ERROR] Customs analysis crawl failed: {e}", file=sys.stderr)
        
    print("[CRON] Weekly incremental crawl job completed successfully.")

if __name__ == '__main__':
    run_weekly_crawlers()
