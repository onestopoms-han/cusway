"""
CUSWAY.kr Live End-to-End Classification Engine Benchmark (300 Test Cases).
Tests the exact live production pipeline (AICustomsClassificationProcessor.run_classification_pipeline).
Target: 0% Error Rate (100.0% Pass Rate).
"""

import sys
import io
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
db = SessionLocal()

from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.tests.test_new_500_items import NEW_500_TEST_CASES

# 300 items
ADDITIONAL_300_CASES = NEW_500_TEST_CASES[200:500]

def run_cusway_live_benchmark():
    print("=" * 105)
    print("       CUSWAY.KR LIVE PRODUCTION PIPELINE BENCHMARK (300 REAL-WORLD CASES)")
    print("                  Target: 0.0% Error Rate (100.0% Pass Rate)")
    print("=" * 105)

    total_passed = 0
    total_count = len(ADDITIONAL_300_CASES)
    failures = []

    for idx, (name, exp_hsk, exp_head, desc) in enumerate(ADDITIONAL_300_CASES, 1):
        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=name,
                material="",
                function_use=desc,
                db=db
            )
            got_hsk = res.get("recommendedHsCode", "")
            got_head = re.sub(r'[^\d]', '', got_hsk)[:4]

            exp_head_clean = re.sub(r'[^\d]', '', exp_head)[:4]
            exp_hsk_clean = re.sub(r'[^\d]', '', exp_hsk)
            got_hsk_clean = re.sub(r'[^\d]', '', got_hsk)

            is_pass = (got_hsk_clean == exp_hsk_clean) or (got_head == exp_head_clean)

            if is_pass:
                total_passed += 1
                status = "[PASS]"
            else:
                status = "[FAIL]"
                failures.append((idx, name, desc, exp_hsk, got_hsk, res.get("headingName", "")))

            print(f"[{idx:03d}/{total_count}] {status} {name:42} -> HSK: {got_hsk:13} (Exp: {exp_hsk}) | {res.get('headingName', '')[:35]}", flush=True)

        except Exception as e:
            failures.append((idx, name, desc, exp_hsk, f"EXCEPTION: {str(e)}", ""))
            print(f"[{idx:03d}/{total_count}] [ERROR] {name:42} -> {str(e)}", flush=True)

    print("\n" + "=" * 105)
    print("                        CUSWAY.KR LIVE PIPELINE SCORE SUMMARY")
    print("=" * 105)
    pass_rate = (total_passed / total_count) * 100.0
    err_rate = ((total_count - total_passed) / total_count) * 100.0
    print(f"TOTAL EVALUATED : {total_count} Cases")
    print(f"PASSED          : {total_passed}/{total_count} ({pass_rate:.1f}%)")
    print(f"FAILED          : {len(failures)}/{total_count}")
    print(f"ERROR RATE      : {err_rate:.1f}% (Target: 0.0%)")
    print("=" * 105)

    if failures:
        print("\n[FAILED TEST CASES DETAILS]:")
        for f in failures:
            print(f"  #{f[0]} {f[1]} | Expected: {f[3]} | Got: {f[4]} | Heading: {f[5]}")
        return False
    else:
        print("\n>>> ALL 300 TEST CASES PASSED WITH 0.0% ERROR RATE ON CUSWAY.KR LIVE PIPELINE! <<<")
        return True

if __name__ == "__main__":
    success = run_cusway_live_benchmark()
    sys.exit(0 if success else 1)
