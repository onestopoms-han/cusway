# -*- coding: utf-8 -*-
import sys
import os

sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_all_sesame_variations():
    db = SessionLocal()
    try:
        items = [
            ("참깨가루", "100% 참깨", "식용 조미용", "2008.19-3000"),
            ("참깨 분말", "참깨 100%", "식품 가공용", "2008.19-3000"),
            ("볶은 참깨가루", "100% 볶은 참깨", "식용", "2008.19-3000"),
            ("깨가루", "깨 100%", "식용", "2008.19-3000"),
            ("볶은 참깨", "볶은 참깨 100% (원형 낟알)", "식용", "2008.19-3000"),
            ("생참깨", "생참깨 100%", "착유용", "1207.40-0000"),
            ("들깨가루", "볶은 들깨 100%", "식용 조미용", "2008.19-9000"),
            ("생들깨", "생들깨 100%", "착유용", "1207.99-1000"),
        ]
        
        all_passed = True
        for name, mat, func, expected_hs in items:
            print(f"\n==========================================")
            print(f"Testing: '{name}' (Expected: {expected_hs})")
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=name,
                material=mat,
                function_use=func,
                db=db,
                custom_key=None
            )
            rec_hs = res.get('recommendedHsCode')
            confidence = res.get('confidence')
            consistency = res.get('consistency_score')
            print(f"-> Result: {rec_hs} | Conf: {confidence}% | Consist: {consistency}")
            
            if rec_hs != expected_hs:
                print(f"❌ FAIL: Expected {expected_hs}, got {rec_hs}")
                all_passed = False
            else:
                print(f"✅ PASS: Matched {expected_hs}")
                
        if all_passed:
            print("\n🎉 ALL SESAME & PERILLA VARIATION TESTS PASSED 100%!")
        else:
            print("\n⚠️ SOME TESTS FAILED")
            sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    test_all_sesame_variations()
