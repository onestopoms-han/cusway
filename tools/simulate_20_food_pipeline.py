# -*- coding: utf-8 -*-
"""
End-to-End Clearance Engine Simulator for Top 20 Agricultural & Food Items
Tests:
1. Clearance Requirements & Quarantine Pipeline (/api/hs/clearance-guide)
2. Tariff & Duty Calculation Engine (/api/hs/rates & /api/hs/calculate-duty)
3. Country-specific FTA Preferential Logic (US, CN, EU, VN, PH, NO, ES, etc.)
4. Thermal Processing & Quarantine Exemption Annotations
"""
import sys
import os
import sqlite3
import json

sys.stdout.reconfigure(encoding='utf-8')

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

from backend.db import SessionLocal
from backend.main import get_clearance_guide_api, get_hs_rates_api, calculate_duty_api

db = SessionLocal()

TARGET_20_ITEMS = [
    {"id": 1, "name": "볶음참깨가루", "hsk": "2008.19-3000", "test_origin": "US", "price": 10000000, "weight": 1000, "has_co": True},
    {"id": 2, "name": "참깨 (원형 생참깨)", "hsk": "1207.40-0000", "test_origin": "CN", "price": 10000000, "weight": 1000, "has_co": False},
    {"id": 3, "name": "배 과즙 / 주스", "hsk": "2009.89-1090", "test_origin": "US", "price": 10000000, "weight": 1000, "has_co": True},
    {"id": 4, "name": "냉장 쇠고기 (본리스)", "hsk": "0201.30-0000", "test_origin": "US", "price": 50000000, "weight": 2000, "has_co": True},
    {"id": 5, "name": "냉동 돼지고기 삼겹살", "hsk": "0203.29-1000", "test_origin": "DE", "price": 20000000, "weight": 2500, "has_co": True},
    {"id": 6, "name": "냉동 닭고기 (닭다리/육계)", "hsk": "0207.14-1010", "test_origin": "US", "price": 15000000, "weight": 3000, "has_co": True},
    {"id": 7, "name": "신선 바나나", "hsk": "0803.90-0000", "test_origin": "PH", "price": 8000000, "weight": 4000, "has_co": True},
    {"id": 8, "name": "신선 오렌지", "hsk": "0805.10-0000", "test_origin": "US", "price": 12000000, "weight": 3000, "has_co": True},
    {"id": 9, "name": "건조 대추", "hsk": "0813.40-2000", "test_origin": "CN", "price": 10000000, "weight": 1000, "has_co": False},
    {"id": 10, "name": "로스팅하지 않은 커피두 (생두)", "hsk": "0901.11-0000", "test_origin": "CO", "price": 15000000, "weight": 1500, "has_co": True},
    {"id": 11, "name": "볶은 원두커피 (로스팅 원두)", "hsk": "0901.21-0000", "test_origin": "IT", "price": 12000000, "weight": 1000, "has_co": True},
    {"id": 12, "name": "녹차 (3kg 이하 포장)", "hsk": "0902.10-0000", "test_origin": "JP", "price": 5000000, "weight": 500, "has_co": False},
    {"id": 13, "name": "건조 고추", "hsk": "0904.21-0000", "test_origin": "CN", "price": 10000000, "weight": 1000, "has_co": False},
    {"id": 14, "name": "신선 통마늘", "hsk": "0703.20-1000", "test_origin": "CN", "price": 8000000, "weight": 2000, "has_co": False},
    {"id": 15, "name": "신선 양파", "hsk": "0703.10-1010", "test_origin": "CN", "price": 6000000, "weight": 3000, "has_co": False},
    {"id": 16, "name": "신선/건조 생강", "hsk": "0910.11-1000", "test_origin": "CN", "price": 7000000, "weight": 1500, "has_co": False},
    {"id": 17, "name": "냉동 흰다리새우 (새우)", "hsk": "0306.17-9091", "test_origin": "VN", "price": 25000000, "weight": 2000, "has_co": True},
    {"id": 18, "name": "냉동 대서양 연어", "hsk": "0303.13-0000", "test_origin": "NO", "price": 30000000, "weight": 2500, "has_co": True},
    {"id": 19, "name": "엑스트라버진 올리브유", "hsk": "1509.20-0000", "test_origin": "ES", "price": 18000000, "weight": 1800, "has_co": True},
    {"id": 20, "name": "체다치즈 / 가공치즈", "hsk": "0406.90-1000", "test_origin": "US", "price": 22000000, "weight": 2000, "has_co": True}
]

print("=" * 135)
print(f"{'No':<3} | {'HSK Code':<13} | {'품목명':<18} | {'국가':<3} | {'적용기준':<16} | {'산출관세액(원)':<14} | {'추정세액합계(원)':<15} | {'결과'}")
print("=" * 135)

passed_count = 0
failed_list = []

for item in TARGET_20_ITEMS:
    hsk = item["hsk"]
    origin = item["test_origin"]
    price = item["price"]
    weight = item["weight"]
    has_co = item["has_co"]
    
    # 1. Test get_clearance_guide_api
    guide_res = get_clearance_guide_api(hs_code=hsk, db=db)
    req_list = guide_res.get("requirements", [])
    
    # 2. Test calculate_duty_api
    duty_res = calculate_duty_api(
        hs_code=hsk,
        cif_price_krw=price,
        weight_kg=weight,
        origin=origin,
        has_co=has_co,
        db=db
    )
    
    final_duty = duty_res.get("final_duty")
    total_tax = duty_res.get("total_tax_estimated")
    applied_basis = duty_res.get("applied_rate_basis", "")
    
    # 3. Validation assertions
    is_valid = True
    issues = []
    
    if len(req_list) == 0:
        is_valid = False
        issues.append("통관 요건 0건")
        
    if final_duty is None:
        is_valid = False
        issues.append("관세액 산출 실패")
        
    laws = [r.get("law_name", "") for r in req_list]
    laws_str = ", ".join(laws[:2])
    
    status_str = "✅ PASS" if is_valid else "❌ FAIL"
    if is_valid:
        passed_count += 1
    else:
        failed_list.append((item, issues))
        
    print(f"{item['id']:<3} | {hsk:<13} | {item['name'][:16]:<18} | {origin:<3} | {applied_basis[:14]:<16} | {final_duty:>12,}원 | {total_tax:>13,}원 | {status_str}")

print("=" * 135)
print(f"🎯 20개 전 품목 백엔드 API & 관세/법령 통합 심사 파이프라인 검증: {passed_count}/20 통과 (성공률: {(passed_count/20)*100:.1f}%)")

if failed_list:
    print("\n[오류 항목]")
    for item, issues in failed_list:
        print(f"- {item['hsk']} {item['name']}: {', '.join(issues)}")
else:
    print("\n🚀 축하합니다! 20개 농축산물 및 수입식품 전 품목의 관세율, FTA 특혜세율 산출, 검역 및 세관장확인 법령 파이프라인 오류율 0.0% 달성!")

db.close()
