import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath('.'))

from backend.models import Base
from backend.rag.classification_processor import AICustomsClassificationProcessor, detect_query_domain

DB_PATH = "cusway.db"
engine = create_engine(f"sqlite:///{DB_PATH}")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_detect_query_domain():
    d1, ch1 = detect_query_domain("냉동 블루베리")
    assert d1 == "FOOD_AGRI"
    assert "08" in ch1

    d2, ch2 = detect_query_domain("자동차 충격센서")
    assert d2 == "SENSOR_INSTRUMENT"
    assert "90" in ch2

    d3, ch3 = detect_query_domain("영구자석 동기모터")
    assert d3 == "MACHINERY_ELEC"
    assert "85" in ch3

def test_5_kakaotalk_failure_cases():
    db = SessionLocal()
    try:
        cases = [
            # 1. 냉동 혼합 과일 (Screenshot 1: Previously failed to 2920909900)
            {
                "prod": "냉동 혼합 과일",
                "mat": "블루베리 51%, 라즈베리 20%, 블랙베리 29%",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["2920", "2009", "1106", "8306"]
            },
            # 2. 과일 (Screenshot 2: Previously failed to 2009.90-9000)
            {
                "prod": "과일",
                "mat": "블루베리 51%, 라즈베리 20%, 블랙베리 29%",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["2009", "2920"]
            },
            # 3. 냉동블루베리 (Screenshot 3: Previously failed to 8306302000)
            {
                "prod": "냉동블루베리",
                "mat": "블루베리",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["8306", "0811.90-2000"]
            },
            # 4. FROZEN BLUEBERRY (Screenshot 4: Previously failed to 1106.30-0000)
            {
                "prod": "FROZEN BLUEBERRY",
                "mat": "BLUEBERRY",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["1106"]
            },
            # 5. BLUEBERRY (Screenshot 5: Previously failed to 1106.30-0000)
            {
                "prod": "신선 블루베리",
                "mat": "BLUEBERRY",
                "func": "식품",
                "expected": "0810.40-0000",
                "forbidden": ["1106"]
            },
            # 6. Anti-Poisoning Test: Frozen blueberry with sugar and jam use (Must STAY 0811.90-9000)
            {
                "prod": "냉동 블루베리",
                "mat": "블루베리 90%, 설탕 10%",
                "func": "잼 제조 가공용 원료",
                "expected": "0811.90-9000",
                "forbidden": ["2007", "1704", "2008"]
            },
            # 7. Anti-Poisoning Test: Frozen blueberry with juice application (Must STAY 0811.90-9000)
            {
                "prod": "냉동 블루베리",
                "mat": "블루베리 100%",
                "func": "과실 음료 및 주스 베이스 가공용",
                "expected": "0811.90-9000",
                "forbidden": ["2009", "2202"]
            }
        ]

        print("\n=== RUNNING 2-PASS DECOUPLED CLASSIFICATION TESTS ===")
        for i, c in enumerate(cases, 1):
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                c["prod"], c["mat"], c["func"], db
            )
            hs = res.get("recommendedHsCode", "")
            print(f"[{i}] {c['prod']} | Mat: {c['mat'][:20]} | Func: {c['func'][:20]} -> Result: {hs} (Expected: {c['expected']})")
            
            assert hs == c["expected"], f"Case {i} failed: got {hs}, expected {c['expected']}"
            for forb in c["forbidden"]:
                assert forb not in hs, f"Case {i} contaminated: {hs} contains forbidden {forb}"
        print("=== ALL 7 DECOUPLED ARCHITECTURE TESTS PASSED 100% ===")
    finally:
        db.close()

if __name__ == "__main__":
    test_detect_query_domain()
    test_5_kakaotalk_failure_cases()
