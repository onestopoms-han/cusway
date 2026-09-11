import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.tests.test_new_2000_items import TEST_2000_ITEMS

processor = AICustomsClassificationProcessor()

failures = {}

for p, exp_hsk, exp_heading, desc in TEST_2000_ITEMS:
    res = processor.run_classification_pipeline(p, "", "", None)
    got_hsk = res.get("recommendedHsCode", "")
    
    is_pass = False
    if got_hsk == exp_hsk or got_hsk.split("-")[0] == exp_hsk.split("-")[0] or got_hsk[:4] == exp_heading:
        is_pass = True
        
    if not is_pass:
        base_title = p.split("규격")[0].strip()
        if base_title not in failures:
            failures[base_title] = (got_hsk, exp_hsk, exp_heading, res.get("headingName", ""))

print(f"Total Unique Base Failures: {len(failures)}")
for title, (got, exp, exp_h, hname) in failures.items():
    print(f"- '{title}' | Got: {got} | Exp: {exp} ({exp_h}) | Matched: {hname[:40]}")
