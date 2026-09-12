import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.db import SessionLocal
from backend.rag.llm_chain import run_local_fallback_match
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_mango_mangosteen():
    db = SessionLocal()
    processor = AICustomsClassificationProcessor()

    test_cases = [
        ("Alor Freeze Dried Mango 50g", "0804.50-2000"),
        ("Alor Freeze Dried Mangosteen 50g", "0804.50-3000"),
        ("Alor Freeze Dried Guava 50g", "0804.50-1000"),
        ("신선 완숙 망고", "0804.50-2000"),
        ("생 망고스틴 과실", "0804.50-3000"),
        ("건조 무화과", "0804.20-0000"),
        ("동결건조 파인애플 슬라이스", "0804.30-0000"),
        ("동결건조 생두리안 과육", "0810.60-0000"),
    ]

    all_pass = True
    print("=" * 80)
    print("       MANGO / MANGOSTEEN / TROPICAL FRUITS VERIFICATION TEST")
    print("=" * 80)
    for name, exp in test_cases:
        res = run_local_fallback_match(name, "", "", db)
        got = res.get("recommendedHsCode", "")
        is_pass = (got == exp)
        status = "[PASS]" if is_pass else "[FAIL]"
        if not is_pass:
            all_pass = False
        print(f"{status} {name:<35} -> Got: {got:<15} | Expected: {exp}")
    
    print("=" * 80)
    return all_pass

if __name__ == "__main__":
    success = test_mango_mangosteen()
    sys.exit(0 if success else 1)
