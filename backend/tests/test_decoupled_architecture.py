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

def test_cranberry_family_cases():
    db = SessionLocal()
    try:
        cranberry_cases = [
            # 1. 냉동크랜베리 (Frozen Cranberries - 표준 표기)
            {
                "prod": "냉동크랜베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000", "2106"]
            },
            # 1-a. 냉동크렌베리 (Frozen Cranberries - '렌' 모음 변이)
            {
                "prod": "냉동크렌베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000", "2106"]
            },
            # 1-b. 크렌베리 단독 질의 ('렌' 모음 변이)
            {
                "prod": "크렌베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 1-c. 그랜베리 단독 질의 (ㄱ/ㅋ 자음 음운 변이)
            {
                "prod": "그랜베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 1-d. 냉동그랜베리 (ㄱ/ㅋ 자음 음운 변이)
            {
                "prod": "냉동그랜베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 1-e. 냉동 그랜베리 (띄어쓰기 + ㄱ/ㅋ 자음 음운 변이)
            {
                "prod": "냉동 그랜베리",
                "mat": "그랜베리 100%",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 1-f. 그렌베리 / 냉동그렌베리 (ㄱ/ㅋ + ㅐ/ㅔ 복합 변이)
            {
                "prod": "그렌베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            {
                "prod": "냉동그렌베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 2. 냉동 크랜베리 (띄어쓰기)
            {
                "prod": "냉동 크랜베리",
                "mat": "크랜베리 100%",
                "func": "식품",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            },
            # 3. 신선 크랜베리 / 신선 그랜베리 (Fresh Cranberries)
            {
                "prod": "신선 크랜베리",
                "mat": "크랜베리 생과",
                "func": "생식용",
                "expected": "0810.40-0000",
                "forbidden": ["0811"]
            },
            {
                "prod": "신선 그랜베리",
                "mat": "그랜베리 생과",
                "func": "생식용",
                "expected": "0810.40-0000",
                "forbidden": ["0811"]
            },
            # 4. 건조 크랜베리 / 조제 크랜베리 / 건조 그랜베리
            {
                "prod": "건조 크랜베리",
                "mat": "크랜베리 80%, 설탕 20%",
                "func": "제과용",
                "expected": "2008.93-0000",
                "forbidden": ["0811"]
            },
            {
                "prod": "건조 그랜베리",
                "mat": "그랜베리 80%, 설탕 20%",
                "func": "제과용",
                "expected": "2008.93-0000",
                "forbidden": ["0811"]
            },
            # 5. 크랜베리 주스 / 그랜베리 주스
            {
                "prod": "크랜베리 주스",
                "mat": "크랜베리 착즙액 100%",
                "func": "음료",
                "expected": "2009.81-0000",
                "forbidden": ["2202"]
            },
            {
                "prod": "그랜베리 주스",
                "mat": "그랜베리 착즙액 100%",
                "func": "음료",
                "expected": "2009.81-0000",
                "forbidden": ["2202"]
            },
            # 6. 크랜베리 단독 질의
            {
                "prod": "크랜베리",
                "mat": "",
                "func": "",
                "expected": "0811.90-9000",
                "forbidden": ["0000.00-0000"]
            }
        ]

        print("\n=== RUNNING CRANBERRY FAMILY TESTS ===")
        for i, c in enumerate(cranberry_cases, 1):
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                c["prod"], c["mat"], c["func"], db
            )
            hs = res.get("recommendedHsCode", "")
            print(f"[Cranberry {i}] {c['prod']} | Result: {hs} (Expected: {c['expected']})")
            assert hs == c["expected"], f"Cranberry Case {i} failed: got {hs}, expected {c['expected']}"
            for forb in c["forbidden"]:
                assert forb not in hs, f"Cranberry Case {i} contaminated: {hs} contains {forb}"
        print("=== ALL CRANBERRY TESTS PASSED 100% ===")
    finally:
        db.close()

def test_latte_family_cases():
    db = SessionLocal()
    try:
        latte_cases = [
            ("라떼파우더", "", "", "2101.12-1000"),
            ("라떼 파우더", "커피 추출물, 분유, 당류", "음료용", "2101.12-1000"),
            ("카페라떼 파우더", "커피 15%, 분유 30%, 설탕 55%", "카페 음료 제조", "2101.12-1000"),
            ("바닐라라떼 파우더", "인스턴트 커피, 바닐라향, 크리머", "음료 베이스", "2101.12-1000"),
            ("녹차라떼 파우더", "말차 분말, 분유, 설탕", "녹차 음료 제조", "2101.20-1000"),
            ("말차 라떼 파우더", "말차 가루, 크리머", "티 음료", "2101.20-1000")
        ]
        print("\n=== RUNNING LATTE FAMILY TESTS ===")
        for prod, mat, func, expected in latte_cases:
            res = AICustomsClassificationProcessor.run_classification_pipeline(prod, mat, func, db)
            hs = res.get("recommendedHsCode", "")
            print(f"[Latte] {prod} -> {hs} (Expected: {expected})")
            assert hs == expected, f"Latte '{prod}' failed: got {hs}, expected {expected}"
        print("=== ALL LATTE TESTS PASSED 100% ===")
    finally:
        db.close()

def test_bakery_bread_family_cases():
    db = SessionLocal()
    try:
        bakery_cases = [
            ("치아바타", "", "", "1905.90-1010"),
            ("치아바타 빵", "소맥분, 효모, 올리브유", "식용", "1905.90-1010"),
            ("냉동 치아바타", "밀가루, 이스트, 소금", "샌드위치용", "1905.90-1010"),
            ("바게트", "밀가루, 효모, 물", "베이커리", "1905.90-1010"),
            ("사워도우", "호밀가루, 발효종", "식용 빵", "1905.90-1010"),
            ("포카치아", "밀가루, 올리브유, 허브", "식용 빵", "1905.90-1010"),
            ("크루아상", "밀가루, 버터, 설탕", "베이커리", "1905.90-1030"),
            ("초코칩 쿠키", "밀가루, 버터, 초콜릿칩", "과자용", "1905.90-1040"),
            ("냉동 치아바타 생지", "밀가루 반죽", "제빵용 생지", "1901.20-9000")
        ]
        print("\n=== RUNNING BAKERY / BREAD FAMILY TESTS ===")
        for prod, mat, func, expected in bakery_cases:
            res = AICustomsClassificationProcessor.run_classification_pipeline(prod, mat, func, db)
            hs = res.get("recommendedHsCode", "")
            print(f"[Bakery] {prod} -> {hs} (Expected: {expected})")
            assert hs == expected, f"Bakery '{prod}' failed: got {hs}, expected {expected}"
            assert not hs.startswith("8306"), f"Bakery '{prod}' contaminated with metal statuette 8306!"
        print("=== ALL BAKERY TESTS PASSED 100% ===")
    finally:
        db.close()

if __name__ == "__main__":
    test_detect_query_domain()
    test_5_kakaotalk_failure_cases()
    test_cranberry_family_cases()
    test_latte_family_cases()
    test_bakery_bread_family_cases()
