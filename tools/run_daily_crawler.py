# -*- coding: utf-8 -*-
import os
import sys
import time
import subprocess
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PYTHON_EXE = sys.executable

def log_msg(msg: str):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{now}] {msg}", flush=True)

def run_step(step_name: str, script_path: str, args: list = None):
    log_msg(f"=== [STEP START] {step_name} ===")
    full_path = os.path.join(WORKSPACE_ROOT, script_path)
    if not os.path.exists(full_path):
        log_msg(f"⚠️ Script not found: {full_path}. Skipping.")
        return False
    
    cmd = [PYTHON_EXE, full_path] + (args or [])
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=WORKSPACE_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding='utf-8',
            errors='replace'
        )
        for line in proc.stdout:
            print(f"   | {line.strip()}", flush=True)
        proc.wait(timeout=120)
        
        if proc.returncode == 0:
            log_msg(f"✅ [SUCCESS] {step_name} completed.")
            return True
        else:
            log_msg(f"❌ [FAILED] {step_name} exited with code {proc.returncode}.")
            return False
    except subprocess.TimeoutExpired:
        proc.kill()
        log_msg(f"⚠️ [TIMEOUT] {step_name} exceeded timeout and was stopped.")
        return False
    except Exception as e:
        log_msg(f"⚠️ [ERROR] Exception during {step_name}: {e}")
        return False

def execute_daily_crawler():
    log_msg("=================================================================")
    log_msg("     🚀 CUSWAY DAILY DUAL CRAWLER PIPELINE EXECUTION")
    log_msg("=================================================================")
    
    results = {}
    
    # 1. 관세청 실시간 고시/통관/법령 뉴스 수집
    results["customs_news"] = run_step(
        "1. 관세청 실시간 고시/지침 및 통관 뉴스 동기화",
        "tools/crawl_customs_news.py"
    )
    
    # 2. 조세심판원 결정례 증분 수집 (최신 10건)
    results["tax_tribunal"] = run_step(
        "2. 조세심판원 관세 최신 결정례 증분 수집",
        "backend/utils/crawl_tax_tribunal.py",
        ["10"]
    )
    
    # 3. 관세평가 최신 결정례 수집 (증분)
    results["valuation_precedents"] = run_step(
        "3. 관세평가 최신 결정례 증분 수집",
        "tools/crawl_valuation_precedents.py",
        ["--limit", "10"]
    )
    
    # 4. DB 무결성 검증
    results["audit_master"] = run_step(
        "4. HS 마스터 데이터 무결성 검증",
        "tools/audit_hs_master.py"
    )
    
    log_msg("=================================================================")
    log_msg(f"     📊 DAILY CRAWLER SUMMARY: {sum(1 for v in results.values() if v)}/{len(results)} Steps Passed")
    log_msg("=================================================================")
    return results

if __name__ == "__main__":
    execute_daily_crawler()
