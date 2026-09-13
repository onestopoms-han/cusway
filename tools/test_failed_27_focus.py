# -*- coding: utf-8 -*-
"""
Focused Benchmark on the 27 previously failed items to verify slot-decoupling and WCO classification fixes.
"""
import sys
import os
import time
import json

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.models import HSCodeMaster
from backend.rag.classification_processor import AICustomsClassificationProcessor
from tools.run_100_items_benchmark import NEW_FUTURE_100

FAILED_IDS = [9, 15, 16, 23, 24, 28, 32, 34, 41, 42, 44, 45, 49, 51, 53, 54, 62, 64, 71, 78, 81, 82, 84, 89, 91, 96, 100]

def test_failed_focus():
    print("=" * 110, flush=True)
    print(">> [CUSWAY] 기존 오류 발생 27대 핵심 품목 집중 검증 테스트 시작", flush=True)
    print("=" * 110, flush=True)

    db = SessionLocal()
    target_items = [it for it in NEW_FUTURE_100 if it["id"] in FAILED_IDS]
    
    passed = 0
    total = len(target_items)
    results = []

    for idx, item in enumerate(target_items, 1):
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_chapters = item["expected_chapter"]
        expected_headings = item["expected_heading"]

        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=name,
            material=material,
            function_use=func,
            db=db
        )

        rec_code = res.get("recommendedHsCode", "0000.00-0000")
        clean_code = rec_code.replace('.', '').replace('-', '').strip()
        rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
        rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

        is_pass = (rec_chapter in expected_chapters) or (rec_heading in expected_headings)
        if is_pass:
            passed += 1
            status = "✅ PASS"
        else:
            status = f"❌ FAIL (추천: {rec_heading} vs 예상: {expected_headings})"

        print(f"[{idx:02d}/{total:02d}] #{item['id']:03d} {name[:30]:<30} ➔ 추천: {rec_code:<12} | {status}", flush=True)
        results.append({
            "id": item["id"],
            "name": name,
            "recommended": rec_code,
            "rec_heading": rec_heading,
            "expected_headings": expected_headings,
            "passed": is_pass
        })

    acc = (passed / total) * 100
    err = 100.0 - acc
    print("=" * 110, flush=True)
    print(f"🎯 [집중 검증 결과] 통과: {passed}/{total} ({acc:.1f}%) | 오류율: {err:.1f}%")
    print("=" * 110, flush=True)
    db.close()

if __name__ == "__main__":
    test_failed_focus()
