# -*- coding: utf-8 -*-
"""
Test smart clarification probing & 3-stage cascading resolution.
100% Constitution Compliant.
"""
import sys
import os
import json

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_smart_clarification():
    db = SessionLocal()
    
    print("=" * 80)
    print("🧪 [TESTING SMART CLARIFICATION & 3-STAGE CASCADING RESOLUTION]")
    print("=" * 80)

    # Test Case 1: Unambiguous specific item (Direct Resolution, needs_clarification=False)
    print("\n1. Testing Direct Item: '신선 냉장 돼지 삼겹살'...")
    res1 = AICustomsClassificationProcessor.run_classification_pipeline(
        product_name="신선 냉장 돼지 삼겹살",
        material="신선 돼지고기 100% (냉장, 무양념 생육)",
        function_use="식용 정육 구이용",
        db=db
    )
    print(f"   -> Result HS Code: {res1.get('recommendedHsCode')}")
    print(f"   -> Stage: {res1.get('hsk_resolution_stage')}")
    print(f"   -> Needs Clarification: {res1.get('needs_clarification')}")
    print(f"   -> Question: {res1.get('clarification_question')}")
    
    # Test Case 2: Spec-ambiguous item (e.g. 녹차 without packaging weight specified)
    print("\n2. Testing Ambiguous Item: '유기농 건조 녹차' (포장 규격 미지정)...")
    res2 = AICustomsClassificationProcessor.run_classification_pipeline(
        product_name="유기농 건조 녹차",
        material="찻잎 100% (Camellia sinensis 미발효)",
        function_use="침출 음용차",
        db=db
    )
    print(f"   -> Result HS Code: {res2.get('recommendedHsCode')}")
    print(f"   -> Stage: {res2.get('hsk_resolution_stage')}")
    print(f"   -> Needs Clarification: {res2.get('needs_clarification')}")
    print(f"   -> Question: {res2.get('clarification_question')}")
    print(f"   -> Options: {json.dumps(res2.get('clarification_options'), ensure_ascii=False, indent=2)}")

    db.close()

if __name__ == "__main__":
    test_smart_clarification()
