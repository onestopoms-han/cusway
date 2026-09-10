"""
CUSWAY Additional 300 Benchmark Suite (Test Cases 201 to 500).
Target: 0% Error Rate (100% Pass Rate across all 300 Items).
Spans 6 Major Real-World Industrial Sectors:
1. Chemicals, Polymers, Petrochemicals, Pharma & Cosmetics (60 items)
2. Precision Instruments, Optical, Medical Devices & Measuring (70 items)
3. Automotive, Electric Mobility, Aerospace, Rail, Marine & Logistics (60 items)
4. Base Metals, Advanced Alloys, Ores, Glass & Structural Articles (50 items)
5. Food, Agriculture, Seafood, Beverages, Commodities & Feeds (45 items)
6. Textiles, Apparel, Leather, Footwear, Furniture, Sports & Toys (35 items)
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

# Database Setup
from backend.db import SessionLocal
db = SessionLocal()

from backend.rag.llm_chain import run_local_fallback_match
from backend.tests.test_new_500_items import NEW_500_TEST_CASES

# Extract the 300 additional test cases (items 201 to 500)
ADDITIONAL_300_CASES = NEW_500_TEST_CASES[200:500]

def run_additional_300_benchmark():
    print("=" * 105)
    print("        CUSWAY AI HS CLASSIFICATION BENCHMARK: 300 ADDITIONAL TEST SUITE (EXTENDED BATCH)")
    print("              Target: 0.0% Error Rate (100.0% Pass Rate across all 300 Items)")
    print("=" * 105)

    total_passed = 0
    total_count = len(ADDITIONAL_300_CASES)
    failures = []

    for idx, (name, exp_hsk, exp_head, desc) in enumerate(ADDITIONAL_300_CASES, 1):
        try:
            res = run_local_fallback_match(name, "", desc, db)
            got_hsk = res.get("recommendedHsCode", "")
            got_head = re.sub(r'[^\d]', '', got_hsk)[:4]

            exp_head_clean = re.sub(r'[^\d]', '', exp_head)[:4]
            exp_hsk_clean = re.sub(r'[^\d]', '', exp_hsk)
            got_hsk_clean = re.sub(r'[^\d]', '', got_hsk)

            # Check match: Exact 10-digit match OR 4-digit heading match
            is_pass = (got_hsk_clean == exp_hsk_clean) or (got_head == exp_head_clean)

            if is_pass:
                total_passed += 1
                status = "[PASS]"
                info = f"-> HSK: {got_hsk:<13} (Exp: {exp_hsk}) | {res.get('headingName', '')[:45]}"
            else:
                status = "[FAIL]"
                info = f"-> Got: {got_hsk:<13} (Exp: {exp_hsk})"
                failures.append((name, got_hsk, exp_hsk))

            print(f"[{idx:03d}/300] {status} {name:<40} {info}")
        except Exception as e:
            print(f"[{idx:03d}/300] [ERROR] {name:<40} -> Exception: {e}")
            failures.append((name, f"Exception: {e}", exp_hsk))

    print("\n" + "=" * 105)
    print("                             FINAL BENCHMARK SCORE SUMMARY")
    print("=" * 105)
    pass_rate = (total_passed / total_count) * 100
    err_rate = 100.0 - pass_rate
    print(f"TOTAL SCORE     : {total_passed}/{total_count} ({pass_rate:.1f}%)")
    print(f"ERROR RATE      : {err_rate:.1f}% (Target: 0.0%)")
    print("=" * 105)

    if failures:
        print(f"\n[FAILURES TO RESOLVE] ({len(failures)} items):")
        for f in failures:
            print(f"  - {f[0]} | Got: {f[1]} | Expected: {f[2]}")
        return False
    else:
        print("\n>>> ALL 300 ADDITIONAL TEST CASES PASSED WITH 0.0% ERROR RATE (100% PRECISION)! <<<")
        return True

if __name__ == "__main__":
    success = run_additional_300_benchmark()
    sys.exit(0 if success else 1)
