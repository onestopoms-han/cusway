import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

def test_yogurt_bites():
    db = SessionLocal()
    cases = [
        "Alor Freeze Dried Yogurt Bites Mixed Berries",
        "Alor Freeze Dried Yogurt Bites Chocochips",
        "Alor Freeze Dried Yogurt Bites Strawberry",
        "Alor Freeze Dried Yogurt Bites Blueberry",
        "Alor Freeze Dried Yogurt Bites Pineapple"
    ]
    
    print("=" * 80)
    print("              ALOR FREEZE DRIED YOGURT BITES CLASSIFICATION TEST")
    print("=" * 80)
    for c in cases:
        res = AICustomsClassificationProcessor.run_classification_pipeline(c, "", "식품", db)
        hsk = res.get("recommendedHsCode")
        heading = res.get("headingName")
        print(f"{c:<45} => {hsk} | {heading}")
    print("=" * 80)

if __name__ == "__main__":
    test_yogurt_bites()
