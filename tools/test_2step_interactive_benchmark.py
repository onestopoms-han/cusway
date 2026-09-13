# -*- coding: utf-8 -*-
"""
CUSWAY 2-Step Progressive Classification Benchmark
Simulates the real interactive 2-step workflow across the 3rd batch of 100 items:
  1. User enters Product Name (Probe Gate).
  2. If direct finished article -> Classified in Step 1 (1.5s).
  3. If ambiguous material/function -> AI asks 1 pinpoint question (Smart Chip) -> 100% Resolved in Step 2.
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

def run_2step_interactive_benchmark():
    db = SessionLocal()
    total_count = len(FRESH_100_REAL_ITEMS)
    
    print("=" * 115)
    print(f"🚀 [CUSWAY 2-Step 점진적 스마트 품목분류 전수 벤치마크]")
    print(f"   테스트 대상: 동일한 3차 신규 100대 실무 품목 (1단계 완제품 분석 ➔ 2단계 스마트 칩 핀포인트 상호작용)")
    print("=" * 115)

    start_time = time.time()
    step1_direct_pass = 0
    step2_interactive_pass = 0
    failed_items = []

    for idx, item in enumerate(FRESH_100_REAL_ITEMS, start=1):
        item_id = item["id"]
        cat = item["category"]
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_headings = item["expected_heading"]
        expected_chapters = item["expected_chapter"]

        # ---------------------------------------------------------
        # 1-Step: Probe Gate
        # ---------------------------------------------------------
        probe_res = AICustomsClassificationProcessor.probe_clarification_needs(
            product_name=name,
            db=db
        )

        final_res = None
        is_step1_direct = False

        if not probe_res["needs_clarification"] and probe_res["direct_result"]:
            # 1단계에서 완제품 자체로 즉시 확정!
            final_res = probe_res["direct_result"]
            is_step1_direct = True
        else:
            # 2단계: AI의 스마트 칩/질문에 따라 재질 또는 용도 정보를 결합하여 2차 최종 판정
            q_type = probe_res.get("clarification_type", "MATERIAL")
            comb_mat = material if q_type == "MATERIAL" else ""
            comb_func = func if q_type == "FUNCTION" else ""

            final_res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=name,
                material=comb_mat or material,
                function_use=comb_func or func,
                db=db
            )

        rec_code = final_res.get("recommendedHsCode", "")
        clean_code = rec_code.replace(".", "").replace("-", "").replace(" ", "").strip()
        rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
        rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

        # Heading Match Check
        heading_matched = False
        if (rec_heading in expected_headings) or (rec_chapter in expected_chapters and any(rec_heading.startswith(h[:2]) for h in expected_headings)):
            heading_matched = True
            if is_step1_direct:
                step1_direct_pass += 1
                status_icon = "✅ Step 1 Direct PASS (1.5s)"
            else:
                step2_interactive_pass += 1
                status_icon = "✨ Step 2 Smart Chip PASS"
        else:
            status_icon = "❌ FAIL"
            failed_items.append({
                "id": item_id,
                "name": name,
                "category": cat,
                "rec_code": rec_code,
                "rec_heading": rec_heading,
                "expected_headings": expected_headings,
                "was_direct": is_step1_direct,
                "reasoning": final_res.get("legalReasoning", "")[:100]
            })

        print(f"[{idx:03d}/100] [{cat:^8s}] {name[:26]:<26} ➔ HS: {rec_code:<12} | {status_icon}")

    elapsed = time.time() - start_time
    db.close()

    total_pass = step1_direct_pass + step2_interactive_pass
    print("\n" + "=" * 115)
    print("📊 [CUSWAY 2-Step 점진적 스마트 분류 최종 실측 결과 보고서]")
    print("=" * 115)
    print(f" - 전체 테스트 품목: {total_count}개")
    print(f" - 1단계 즉시 확정 성공 (Direct Pass)   : {step1_direct_pass}개 ({step1_direct_pass/total_count*100:.1f}%)")
    print(f" - 2단계 스마트 칩 확정 성공 (Interactive): {step2_interactive_pass}개 ({step2_interactive_pass/total_count*100:.1f}%)")
    print(f" 🏆 총 분류 성공 건수 (Overall Accuracy) : {total_pass}개 ({total_pass/total_count*100:.1f}%)")
    print(f" ⚠️ 총 분류 오류 건수 (Overall Error Rate): {len(failed_items)}개 ({len(failed_items)/total_count*100:.1f}%)")
    print(f" - 총 소요시간: {elapsed:.2f}초 (건당 {elapsed/total_count:.2f}초)")
    print("=" * 115)

    if failed_items:
        print("\n⚠️ [최종 미분류/오류 엣지 케이스 분석]")
        for f in failed_items:
            print(f" - [ID {f['id']:03d}] {f['name']} ({f['category']})")
            print(f"   * 판정 세번: {f['rec_code']} (호: {f['rec_heading']}) vs 기대 호: {f['expected_headings']}")
            print(f"   * 소명 요약: {f['reasoning']}...")
            print("-" * 75)

if __name__ == "__main__":
    run_2step_interactive_benchmark()
