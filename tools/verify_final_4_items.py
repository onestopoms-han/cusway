# -*- coding: utf-8 -*-
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
from backend.rag.classification_processor import AICustomsClassificationProcessor
from tools.run_50_release_benchmark import NEW_50_RELEASE_ITEMS

FINAL_4_IDS = [15, 19, 23, 26]
FINAL_4 = [item for item in NEW_50_RELEASE_ITEMS if item["id"] in FINAL_4_IDS]

def verify_final_4():
    db = SessionLocal()
    print("=" * 80)
    print(f"🔬 최종 잔여 4개 품목 정밀 검증 시작 (총 {len(FINAL_4)}건)")
    print("=" * 80)
    
    passed = 0
    failed = []
    
    for item in FINAL_4:
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_headings = item["expected_heading"]
        expected_chapters = item["expected_chapter"]
        
        try:
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
                status = f"❌ FAIL (예상: {' / '.join(expected_headings)})"
                failed.append({
                    "item": item,
                    "recommended": rec_code,
                    "reasoning": res.get("legalReasoning", "")
                })
                
            print(f"[#{item['id']:02d}] {name:<40} -> {rec_code} | {status}", flush=True)
        except Exception as e:
            print(f"[#{item['id']:02d}] {name:<40} -> ⚠️ ERROR: {e}", flush=True)
            failed.append({"item": item, "error": str(e)})
            
    print("=" * 80)
    print(f"📊 최종 4개 검증 결과: 통과 {passed}/{len(FINAL_4)}건 ({passed/len(FINAL_4)*100:.1f}%)")
    print("=" * 80)
    db.close()
    return passed, len(FINAL_4), failed

if __name__ == "__main__":
    verify_final_4()
