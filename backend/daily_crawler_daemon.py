# -*- coding: utf-8 -*-
import os
import sys
import time
import threading
import subprocess
from datetime import datetime, timedelta

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PYTHON_EXE = sys.executable

# 1일 10회 정시 관세청 및 무역정보 수집 스케줄러 (KST 기준)
SCHEDULED_SLOTS = [
    {"hour": 8, "minute": 0, "label": "08:00 - 조간 관세 고시/지침 개정 수집"},
    {"hour": 9, "minute": 30, "label": "09:30 - 관세청 개청 및 1차 보도자료 수집"},
    {"hour": 11, "minute": 0, "label": "11:00 - 오전 관세/통관 동향 및 환율 고시 수집"},
    {"hour": 12, "minute": 30, "label": "12:30 - 점심 시간대 관세 행정 공시 수집"},
    {"hour": 14, "minute": 0, "label": "14:00 - 오후 업무 개시 및 통관 심사 지침 수집"},
    {"hour": 15, "minute": 30, "label": "15:30 - 품목분류(HS) 및 FTA 긴급 공지 수집"},
    {"hour": 17, "minute": 0, "label": "17:00 - 관세청 석간 보도 및 세관장확인 개정 수집"},
    {"hour": 18, "minute": 30, "label": "18:30 - 당일 통관 행정/단속 종합 브리핑 수집"},
    {"hour": 20, "minute": 0, "label": "20:00 - 야간 관세 평가 및 결정례 수집"},
    {"hour": 22, "minute": 0, "label": "22:00 - 일일 관세/무역 최종 결산 종합 수집"}
]

# Runtime tracking state
SCHEDULER_STATE = {
    "is_running": False,
    "last_run_time": None,
    "last_status": "Idle",
    "last_slot_label": None,
    "next_run_slot": None,
    "history": []
}

def get_next_scheduled_slot():
    """Calculates the next upcoming scheduled slot based on current local time."""
    now = datetime.now()
    today_str = now.strftime("%Y-%m-%d")
    tomorrow_str = (now + timedelta(days=1)).strftime("%Y-%m-%d")

    for slot in SCHEDULED_SLOTS:
        slot_time = now.replace(hour=slot["hour"], minute=slot["minute"], second=0, microsecond=0)
        if slot_time > now:
            return {
                "target_datetime": f"{today_str} {slot['hour']:02d}:{slot['minute']:02d}:00",
                "time_str": f"{slot['hour']:02d}:{slot['minute']:02d}",
                "label": slot["label"]
            }
    
    # If passed all today, next is first slot tomorrow
    first_slot = SCHEDULED_SLOTS[0]
    return {
        "target_datetime": f"{tomorrow_str} {first_slot['hour']:02d}:{first_slot['minute']:02d}:00",
        "time_str": f"{first_slot['hour']:02d}:{first_slot['minute']:02d}",
        "label": first_slot["label"]
    }

def run_daily_crawler_task(slot_label: str = "수동/정시 동기화"):
    """Executes the master daily crawler script."""
    global SCHEDULER_STATE
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n[DAEMON 10x CRAWLER] ⏰ Triggered: [{slot_label}] at {now_str}")
    
    SCHEDULER_STATE["is_running"] = True
    SCHEDULER_STATE["last_run_time"] = now_str
    SCHEDULER_STATE["last_status"] = "Running"
    SCHEDULER_STATE["last_slot_label"] = slot_label

    script_path = os.path.join(WORKSPACE_ROOT, "tools", "clean_and_crawl_real_news.py")
    try:
        res = subprocess.run([PYTHON_EXE, script_path], cwd=WORKSPACE_ROOT, capture_output=True, text=True, timeout=120)
        if res.returncode == 0:
            SCHEDULER_STATE["last_status"] = "Success"
            print(f"[DAEMON 10x CRAWLER] ✅ Completed successfully for [{slot_label}].")
        else:
            SCHEDULER_STATE["last_status"] = f"Warning (code {res.returncode})"
            print(f"[DAEMON 10x CRAWLER] ⚠️ Finished with warning: {res.stderr[:200]}")
    except Exception as e:
        SCHEDULER_STATE["last_status"] = f"Error: {str(e)}"
        print(f"[DAEMON 10x CRAWLER ERROR] {e}")
    finally:
        SCHEDULER_STATE["is_running"] = False
        next_slot = get_next_scheduled_slot()
        SCHEDULER_STATE["next_run_slot"] = next_slot

        # Record in history (keep last 20)
        SCHEDULER_STATE["history"].insert(0, {
            "timestamp": now_str,
            "slot": slot_label,
            "status": SCHEDULER_STATE["last_status"]
        })
        if len(SCHEDULER_STATE["history"]) > 20:
            SCHEDULER_STATE["history"] = SCHEDULER_STATE["history"][:20]

def start_10x_daily_scheduler_loop():
    """
    Background daemon loop that monitors and triggers all 10 scheduled daily checkpoints.
    Runs a precision check every 20 seconds.
    """
    print("[DAEMON STARTED] 🚀 CUSWAY 10-Times Daily Crawler Scheduler is ACTIVE.")
    print("  -> Scheduled Checkpoints: " + ", ".join([f"{s['hour']:02d}:{s['minute']:02d}" for s in SCHEDULED_SLOTS]))
    
    # 1. Initial quick crawl upon server startup
    time.sleep(3)
    run_daily_crawler_task("서버 기동 즉시 초기 동기화")
    
    last_triggered_date_slot = None
    
    while True:
        try:
            now = datetime.now()
            today_str = now.strftime("%Y-%m-%d")
            hour = now.hour
            minute = now.minute
            
            # Find matching slot within +- 2 minutes
            current_matched_slot = None
            for slot in SCHEDULED_SLOTS:
                if slot["hour"] == hour and abs(slot["minute"] - minute) <= 1:
                    current_matched_slot = slot
                    break
            
            if current_matched_slot:
                slot_id = f"{today_str}_{current_matched_slot['hour']:02d}{current_matched_slot['minute']:02d}"
                if slot_id != last_triggered_date_slot:
                    last_triggered_date_slot = slot_id
                    print(f"[SCHEDULER 10x] 🎯 Target checkpoint reached: {current_matched_slot['label']}")
                    run_daily_crawler_task(current_matched_slot["label"])
            
            # Update next run slot calculation
            SCHEDULER_STATE["next_run_slot"] = get_next_scheduled_slot()
                
        except Exception as e:
            print(f"[SCHEDULER 10x ERROR] {e}")
            
        time.sleep(20)

def init_background_scheduler():
    """Starts the 10x daily scheduler thread."""
    t = threading.Thread(target=start_10x_daily_scheduler_loop, daemon=True)
    t.start()
    return t

if __name__ == "__main__":
    run_daily_crawler_task("CLI 테스트 실행")
