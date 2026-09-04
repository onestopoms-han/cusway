# -*- coding: utf-8 -*-
import os
import sys
import time
import threading
import subprocess
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PYTHON_EXE = sys.executable

# Track last execution timestamps
LAST_RUN_INFO = {
    "last_run_time": None,
    "last_status": "Idle",
    "last_result": None
}

def run_daily_crawler_task():
    """Executes the master daily crawler script."""
    global LAST_RUN_INFO
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[DAEMON CRAWLER] ⏰ Scheduled Daily Crawler Triggered at {now_str}")
    LAST_RUN_INFO["last_run_time"] = now_str
    LAST_RUN_INFO["last_status"] = "Running"
    
    script_path = os.path.join(WORKSPACE_ROOT, "tools", "run_daily_crawler.py")
    try:
        res = subprocess.run([PYTHON_EXE, script_path], cwd=WORKSPACE_ROOT, capture_output=True, text=True, timeout=300)
        if res.returncode == 0:
            LAST_RUN_INFO["last_status"] = "Success"
            print(f"[DAEMON CRAWLER] ✅ Daily crawl cycle completed successfully.")
        else:
            LAST_RUN_INFO["last_status"] = f"Failed (code {res.returncode})"
            print(f"[DAEMON CRAWLER] ⚠️ Daily crawl finished with warnings: {res.stderr[:200]}")
    except Exception as e:
        LAST_RUN_INFO["last_status"] = f"Error: {str(e)}"
        print(f"[DAEMON CRAWLER ERROR] {e}")

def start_dual_daily_scheduler_loop():
    """
    Background daemon loop that runs twice daily (KST 09:00 and 18:00).
    Also performs a quick check every minute.
    """
    print("[DAEMON STARTED] CUSWAY Dual Daily Crawler Scheduler is active (Target: 09:00 & 18:00 KST).")
    
    # 1. First run a sync upon startup if needed
    time.sleep(5)
    run_daily_crawler_task()
    
    last_triggered_date_slot = None
    
    while True:
        try:
            now = datetime.now()
            today_str = now.strftime("%Y-%m-%d")
            hour = now.hour
            minute = now.minute
            
            # Slot 1: Morning 09:00 ~ 09:05
            # Slot 2: Evening 18:00 ~ 18:05
            current_slot = None
            if hour == 9 and minute < 10:
                current_slot = f"{today_str}_morning"
            elif hour == 18 and minute < 10:
                current_slot = f"{today_str}_evening"
                
            if current_slot and current_slot != last_triggered_date_slot:
                print(f"[SCHEDULER] Triggering scheduled crawl for slot: {current_slot}")
                last_triggered_date_slot = current_slot
                run_daily_crawler_task()
                
        except Exception as e:
            print(f"[SCHEDULER ERROR] {e}")
            
        # Sleep for 60 seconds before next check
        time.sleep(60)

def init_background_scheduler():
    """Starts the scheduler thread."""
    t = threading.Thread(target=start_dual_daily_scheduler_loop, daemon=True)
    t.start()
    return t

if __name__ == "__main__":
    run_daily_crawler_task()
