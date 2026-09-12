import sys
import os

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_coated_vs_bites():
    db = SessionLocal()
    cases = [
        ("Alor Freeze Dried Yogurt Bites Strawberry", "0403.20-9000"),
        ("Yogurt Coated Strawberry", "2008.80-0000"),
        ("요거트 코팅 크랜베리", "2008.93-0000"),
        ("요구르트 코팅 건포도", "2008.99-9000"),
    ]
    
    print("=" * 80)
    print("         YOGURT BITES vs YOGURT COATED FRUITS EXPERT TEST")
    print("=" * 80)
    for c, exp in cases:
        res = AICustomsClassificationProcessor.run_classification_pipeline(c, "", "식품", db)
        got = res.get("recommendedHsCode")
        print(f"품목: {c}")
        print(f" -> HSK: {got} (Exp: {exp})")
        print(f" -> 제외/주의규정: {res.get('exclusionNote', '')[:100]}...")
        comp = res.get('competingHsCodes', [])
        print(f" -> 경합세번 안내: {comp}")
        print("-" * 80)

if __name__ == "__main__":
    test_coated_vs_bites()
