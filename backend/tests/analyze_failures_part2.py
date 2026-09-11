import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
import re
from backend.db import SessionLocal
from backend.tests.test_new_1000_items_part2 import NEW_1000_PART2_TEST_CASES
from backend.rag.classification_processor import AICustomsClassificationProcessor

db = SessionLocal()

failures = []
passed = 0

for idx, (name, exp_hsk, exp_head, desc) in enumerate(NEW_1000_PART2_TEST_CASES, 1):
    res = AICustomsClassificationProcessor.run_classification_pipeline(name, "", desc, db)
    got_hsk = res.get("recommendedHsCode", "")
    got_head = re.sub(r'[^\d]', '', got_hsk)[:4]

    exp_head_clean = re.sub(r'[^\d]', '', exp_head)[:4]
    exp_hsk_clean = re.sub(r'[^\d]', '', exp_hsk)
    got_hsk_clean = re.sub(r'[^\d]', '', got_hsk)

    is_pass = (got_hsk_clean == exp_hsk_clean) or (got_head == exp_head_clean)
    if is_pass:
        passed += 1
    else:
        failures.append((name, got_hsk, exp_hsk, exp_head, desc))

print(f"Total Tested: {len(NEW_1000_PART2_TEST_CASES)}")
print(f"Passed: {passed}, Failed: {len(failures)}")
print(f"Pass Rate: {passed / len(NEW_1000_PART2_TEST_CASES) * 100:.1f}%")

# Unique base failure patterns
unique_patterns = {}
for name, got_hsk, exp_hsk, exp_head, desc in failures:
    base_name = name.split(" 규격 P2-")[0].strip()
    if base_name not in unique_patterns:
        unique_patterns[base_name] = {
            "count": 0,
            "sample_name": name,
            "got_hsk": got_hsk,
            "exp_hsk": exp_hsk,
            "exp_head": exp_head,
            "desc": desc
        }
    unique_patterns[base_name]["count"] += 1

print(f"\nUnique Root Failure Patterns: {len(unique_patterns)}")
for base_name, info in sorted(unique_patterns.items(), key=lambda x: x[1]['count'], reverse=True):
    print(f"- [{info['count']}건] '{base_name}' | Got: {info['got_hsk']} | Exp: {info['exp_hsk']} ({info['exp_head']})")
