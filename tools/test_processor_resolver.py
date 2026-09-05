import sys
import os

# Set path
sys.path.insert(0, os.path.abspath('.'))
sys.stdout.reconfigure(encoding='utf-8')

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_pipeline():
    db = SessionLocal()
    try:
        print("Testing resolve_deterministic_hsk10 directly...")
        # 1. Test 볶은참깨가루
        resolved_hs, resolved_name, structs = AICustomsClassificationProcessor.resolve_deterministic_hsk10(
            raw_hs="2008.19-1000",
            product_name="볶은참깨가루",
            material="참깨 100%",
            function_use="식용 및 조미용",
            db=db
        )
        print(f"[TEST 1] Input: 2008.19-1000 | Product: 볶은참깨가루")
        print(f"         Resolved: {resolved_hs} ({resolved_name})")
        assert resolved_hs == "2008.19-3000", f"Expected 2008.19-3000, got {resolved_hs}"

        # 2. Test 맛밤
        resolved_hs, resolved_name, structs = AICustomsClassificationProcessor.resolve_deterministic_hsk10(
            raw_hs="2008.19-3000",
            product_name="맛밤 (조리된 밤)",
            material="밤 100%",
            function_use="간식용",
            db=db
        )
        print(f"[TEST 2] Input: 2008.19-3000 | Product: 맛밤")
        print(f"         Resolved: {resolved_hs} ({resolved_name})")
        assert resolved_hs == "2008.19-1000", f"Expected 2008.19-1000, got {resolved_hs}"

        # 3. Test 건조 코코넛
        resolved_hs, resolved_name, structs = AICustomsClassificationProcessor.resolve_deterministic_hsk10(
            raw_hs="2008.19-1000",
            product_name="건조 코코넛 조제품",
            material="코코넛 95%",
            function_use="제과용",
            db=db
        )
        print(f"[TEST 3] Input: 2008.19-1000 | Product: 건조 코코넛")
        print(f"         Resolved: {resolved_hs} ({resolved_name})")
        assert resolved_hs == "2008.19-2000", f"Expected 2008.19-2000, got {resolved_hs}"

        # 4. Test 도토리 가루
        resolved_hs, resolved_name, structs = AICustomsClassificationProcessor.resolve_deterministic_hsk10(
            raw_hs="2106.90-9099",
            product_name="도토리 가루",
            material="도토리 전분 100%",
            function_use="묵 제조용",
            db=db
        )
        print(f"[TEST 4] Input: 2106.90-9099 | Product: 도토리 가루")
        print(f"         Resolved: {resolved_hs} ({resolved_name})")
        assert resolved_hs == "2106.90-9060", f"Expected 2106.90-9060, got {resolved_hs}"

        print("\nALL PIPELINE RESOLUTION TESTS PASSED 100%!")
    finally:
        db.close()

if __name__ == "__main__":
    test_pipeline()
