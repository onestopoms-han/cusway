# -*- coding: utf-8 -*-
import sys
import os

sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.index import ClassifyReq, hs_classify_api

def test_api_classify_direct():
    test_cases = [
        ("들깨가루", "2008.19-9000"),
        ("볶은 들깨가루", "2008.19-9000"),
        ("들깨 분말", "1208.90-9000"),
        ("생들깨가루", "1208.90-9000"),
        ("생들깨", "1207.99-1000"),
        ("들깨", "1207.99-1000"),
        ("볶은 들깨", "2008.19-9000"),
        ("참깨가루", "2008.19-3000"),
        ("볶은 참깨가루", "2008.19-3000"),
        ("참깨 분말", "1208.90-9000"),
        ("깨가루", "2008.19-3000"),
        ("생참깨가루", "1208.90-9000"),
        ("생참깨", "1207.40-0000"),
        ("참깨", "1207.40-0000"),
        ("볶은 참깨", "2008.19-9000"),
    ]

    all_passed = True
    print("=== Testing Serverless api/index.py hs_classify_api ===")
    for prod, expected in test_cases:
        req = ClassifyReq(product_name=prod, material="", function_use="")
        res = hs_classify_api(req)
        rec_hs = res.get("recommendedHsCode")
        conf = res.get("confidence")
        if rec_hs == expected:
            print(f"✅ PASS: '{prod}' -> {rec_hs} (Conf: {conf}%)")
        else:
            print(f"❌ FAIL: '{prod}' -> Expected {expected}, got {rec_hs}")
            all_passed = False

    if all_passed:
        print("\n🎉 ALL SERVERLESS API INDEX TESTS PASSED 100%!")
    else:
        print("\n⚠️ SOME API TESTS FAILED")
        sys.exit(1)

if __name__ == "__main__":
    test_api_classify_direct()
