import sys
import os
import json

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from tools.audit_food_50_classification import FOOD_50_TEST_CASES
from backend.rag.food50_rules import find_food_backend_rule

def run_fast_check():
    print("=" * 100)
    print(" CUSWAY AI 50대 핵심 식품류 HS Code 품목분류 전수 정밀 검증 벤치마크")
    print("=" * 100)

    pass_cnt = 0
    fail_cnt = 0
    results = []

    for item in FOOD_50_TEST_CASES:
        rule = find_food_backend_rule(item["name"], item["material"], item["function"])
        rec_code = rule["recommendedHsCode"] if rule else "미판정"
        exp_code = item["expected_hs"]

        clean_rec = rec_code.replace('.', '').replace('-', '').strip()
        clean_exp = exp_code.replace('.', '').replace('-', '').strip()

        is_pass = (clean_rec == clean_exp) or (len(clean_rec) >= 6 and len(clean_exp) >= 6 and clean_rec[:6] == clean_exp[:6])
        if is_pass:
            pass_cnt += 1
            status = "PASS"
        else:
            fail_cnt += 1
            status = "FAIL"

        print(f"[{item['id']:02d}/50] [{status}] | {item['name']:<24} | 결과: {rec_code:<14} | 정답: {exp_code:<14} | {item['category']}")
        results.append({
            "id": item["id"],
            "name": item["name"],
            "material": item["material"],
            "category": item["category"],
            "expected_hs": exp_code,
            "rec_hs": rec_code,
            "is_pass": is_pass,
            "headingName": rule.get("headingName", "") if rule else "",
            "legalReasoning": rule.get("legalReasoning", "") if rule else ""
        })

    print("=" * 100)
    print(f" 검증 결과 요약: 총 50개 품목 중 일치 {pass_cnt}건, 불일치 {fail_cnt}건 (정확도: {pass_cnt/50*100:.1f}%)")
    print("=" * 100)

    with open("tools/food_50_test_results.json", "w", encoding="utf-8") as f:
        json.dump({"summary": {"total": 50, "pass": pass_cnt, "fail": fail_cnt, "accuracy": pass_cnt/50*100}, "results": results}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    run_fast_check()
