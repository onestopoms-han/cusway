# -*- coding: utf-8 -*-
"""
CUSWAY Experiment: Product Name ONLY Benchmark (No Material, No Function)
Tests how the AI performs on the exact same 3rd batch of 100 items
when ONLY the product name is provided (Slot 2 = '', Slot 3 = '').
"""
import sys
import os
import time

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.models import HSCodeMaster, CustomsPrecedent
from backend.rag.classification_processor import AICustomsClassificationProcessor
from tools.test_fresh_100_real_customs import FRESH_100_REAL_ITEMS

def run_name_only_benchmark():
    db = SessionLocal()
    total_count = len(FRESH_100_REAL_ITEMS)
    
    print("=" * 115)
    print(f"🧪 [실험 검증] 재질과 용도를 완전히 빼고 '완제품명(Product Name Only)'만 입력했을 때의 실측 테스트")
    print(f"   테스트 대상: 동일한 신규 100대 실무 품목 (Material='', Function='')")
    print("=" * 115)

    start_time = time.time()
    heading_pass = 0
    failed_items = []
    improved_items = [] # 재질/용도 뺐을 때 맞춘 품목
    worsened_items = [] # 재질/용도가 없어서 틀린 품목

    for idx, item in enumerate(FRESH_100_REAL_ITEMS, start=1):
        item_id = item["id"]
        cat = item["category"]
        name = item["name"]
        expected_headings = item["expected_heading"]
        expected_chapters = item["expected_chapter"]

        # 재질과 용도를 완전히 공백('')으로 입력
        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=name,
            material="",
            function_use="",
            db=db
        )

        rec_code = res.get("recommendedHsCode", "")
        clean_code = rec_code.replace(".", "").replace("-", "").replace(" ", "").strip()
        rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
        rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

        # Heading match check
        heading_matched = False
        if (rec_heading in expected_headings) or (rec_chapter in expected_chapters and any(rec_heading.startswith(h[:2]) for h in expected_headings)):
            heading_matched = True
            heading_pass += 1
            status_icon = "✅ PASS"
        else:
            status_icon = "❌ FAIL"
            failed_items.append({
                "id": item_id,
                "name": name,
                "category": cat,
                "rec_code": rec_code,
                "rec_heading": rec_heading,
                "expected_headings": expected_headings,
                "reasoning": res.get("legalReasoning", "")[:100]
            })

        print(f"[{idx:03d}/100] [{cat:^8s}] {name[:28]:<28} ➔ HS: {rec_code:<12} | {status_icon}")

    elapsed = time.time() - start_time
    db.close()

    print("\n" + "=" * 115)
    print("📊 [실험 결과 요약: 완제품명만 단독 입력 시]")
    print(f" - 전체 테스트 품목: {total_count}개")
    print(f" - 호(Heading) 분류 성공: {heading_pass}개 ({heading_pass/total_count*100:.1f}%)")
    print(f" - 호(Heading) 분류 실패: {len(failed_items)}개 ({len(failed_items)/total_count*100:.1f}%)")
    print(f" - 총 소요시간: {elapsed:.2f}초 (건당 {elapsed/total_count:.2f}초)")
    print("=" * 115)

    if failed_items:
        print("\n⚠️ [완제품명만 넣었을 때 실패한 품목 사례 분석 (상위 10건)]")
        for f in failed_items[:10]:
            print(f" - [ID {f['id']:03d}] {f['name']} ({f['category']})")
            print(f"   * 판정: {f['rec_code']} (호: {f['rec_heading']}) vs 기대 호: {f['expected_headings']}")
            print(f"   * 소명: {f['reasoning']}...")
            print("-" * 75)

if __name__ == "__main__":
    run_name_only_benchmark()
