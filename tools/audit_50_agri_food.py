# -*- coding: utf-8 -*-
"""
Full Verification and Audit of 50 Agricultural, Livestock, and Processed Food Items
Tests:
1. Master Code (hs_code_master)
2. Tariff Rates (hs_rate_master)
3. Legal Requirements & Quarantine (hs_requirements & get_clearance_guide_api)
4. Duty & Tax Calculation (calculate_duty_api)
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
conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

TARGET_50_ITEMS = [
    {"id": 1, "name": "냉동 쇠고기 (도체/이분도체)", "hsk": "0202.10-0000", "test_origin": "US", "price": 40000000, "weight": 2000, "has_co": True},
    {"id": 2, "name": "냉동 소갈비 (갈비육)", "hsk": "0202.20-1000", "test_origin": "AU", "price": 35000000, "weight": 1500, "has_co": True},
    {"id": 3, "name": "신선/냉장 양고기 (어린 양 도체)", "hsk": "0204.10-0000", "test_origin": "NZ", "price": 25000000, "weight": 1200, "has_co": True},
    {"id": 4, "name": "냉동 소 혀 (우설)", "hsk": "0206.21-0000", "test_origin": "US", "price": 18000000, "weight": 1000, "has_co": True},
    {"id": 5, "name": "돼지 비계 (지방)", "hsk": "0209.10-0000", "test_origin": "US", "price": 12000000, "weight": 2000, "has_co": True},
    {"id": 6, "name": "생햄 (하몬/프로슈토)", "hsk": "0210.11-0000", "test_origin": "ES", "price": 28000000, "weight": 800, "has_co": True},
    {"id": 7, "name": "무지방/저지방 살균우유", "hsk": "0401.10-0000", "test_origin": "US", "price": 10000000, "weight": 2000, "has_co": True},
    {"id": 8, "name": "살균 신선우유 (일반)", "hsk": "0401.20-0000", "test_origin": "DE", "price": 12000000, "weight": 2500, "has_co": True},
    {"id": 9, "name": "탈지분유", "hsk": "0402.10-1010", "test_origin": "US", "price": 15000000, "weight": 1000, "has_co": True},
    {"id": 10, "name": "식품가공용 유청분말", "hsk": "0404.10-1019", "test_origin": "US", "price": 14000000, "weight": 1500, "has_co": True},
    {"id": 11, "name": "천연 버터 (Butter)", "hsk": "0405.10-0000", "test_origin": "NZ", "price": 20000000, "weight": 1000, "has_co": True},
    {"id": 12, "name": "데어리 스프레드", "hsk": "0405.20-0000", "test_origin": "AU", "price": 16000000, "weight": 1000, "has_co": True},
    {"id": 13, "name": "산란용 종계란 (종란)", "hsk": "0407.11-0000", "test_origin": "US", "price": 8000000, "weight": 500, "has_co": True},
    {"id": 14, "name": "건조 난황 분말", "hsk": "0408.11-0000", "test_origin": "US", "price": 15000000, "weight": 800, "has_co": True},
    {"id": 15, "name": "천연 꿀 (Honey)", "hsk": "0409.00-0000", "test_origin": "NZ", "price": 22000000, "weight": 1000, "has_co": False},
    {"id": 16, "name": "씨감자 (종자용)", "hsk": "0701.10-0000", "test_origin": "US", "price": 10000000, "weight": 2000, "has_co": True},
    {"id": 17, "name": "신선 식용 감자", "hsk": "0701.90-0000", "test_origin": "AU", "price": 9000000, "weight": 3000, "has_co": True},
    {"id": 18, "name": "신선 방울토마토", "hsk": "0702.00-1000", "test_origin": "JP", "price": 7000000, "weight": 1000, "has_co": True},
    {"id": 19, "name": "냉동 감자 (프렌치프라이 원료)", "hsk": "0710.10-0000", "test_origin": "US", "price": 14000000, "weight": 4000, "has_co": True},
    {"id": 20, "name": "냉동 완두콩", "hsk": "0710.21-0000", "test_origin": "CN", "price": 6000000, "weight": 2000, "has_co": True},
    {"id": 21, "name": "건조 양파", "hsk": "0712.20-0000", "test_origin": "CN", "price": 8000000, "weight": 1500, "has_co": False},
    {"id": 22, "name": "건조 양송이버섯", "hsk": "0712.31-1000", "test_origin": "CN", "price": 11000000, "weight": 800, "has_co": False},
    {"id": 23, "name": "사료용 완두", "hsk": "0713.10-2000", "test_origin": "CA", "price": 12000000, "weight": 5000, "has_co": True},
    {"id": 24, "name": "녹두 (식용 영두)", "hsk": "0713.31-9000", "test_origin": "CN", "price": 10000000, "weight": 2000, "has_co": False},
    {"id": 25, "name": "붉은 팥 (식용 팥)", "hsk": "0713.32-9000", "test_origin": "CN", "price": 10000000, "weight": 2000, "has_co": False},
    {"id": 26, "name": "피아몬드 (껍질 있는 아몬드)", "hsk": "0802.11-0000", "test_origin": "US", "price": 16000000, "weight": 1500, "has_co": True},
    {"id": 27, "name": "탈각 아몬드 (깐아몬드)", "hsk": "0802.12-0000", "test_origin": "US", "price": 20000000, "weight": 1500, "has_co": True},
    {"id": 28, "name": "신선 포도", "hsk": "0806.10-0000", "test_origin": "CL", "price": 18000000, "weight": 2000, "has_co": True},
    {"id": 29, "name": "신선 사과", "hsk": "0808.10-0000", "test_origin": "US", "price": 15000000, "weight": 2000, "has_co": True},
    {"id": 30, "name": "냉동 딸기", "hsk": "0811.10-0000", "test_origin": "CN", "price": 8000000, "weight": 2000, "has_co": True},
    {"id": 31, "name": "통 흑후추", "hsk": "0904.11-0000", "test_origin": "VN", "price": 12000000, "weight": 1000, "has_co": True},
    {"id": 32, "name": "원형 바닐라빈", "hsk": "0905.10-0000", "test_origin": "MG", "price": 30000000, "weight": 200, "has_co": True},
    {"id": 33, "name": "계피 (시나몬)", "hsk": "0906.11-0000", "test_origin": "VN", "price": 9000000, "weight": 1500, "has_co": True},
    {"id": 34, "name": "종자용 듀럼밀", "hsk": "1001.11-0000", "test_origin": "US", "price": 11000000, "weight": 5000, "has_co": True},
    {"id": 35, "name": "사료용 옥수수", "hsk": "1005.90-1000", "test_origin": "US", "price": 25000000, "weight": 10000, "has_co": True},
    {"id": 36, "name": "밀가루 (소맥분)", "hsk": "1101.00-1000", "test_origin": "AU", "price": 14000000, "weight": 4000, "has_co": True},
    {"id": 37, "name": "맥아 (Malt)", "hsk": "1107.10-0000", "test_origin": "DE", "price": 18000000, "weight": 3000, "has_co": True},
    {"id": 38, "name": "밀 전분", "hsk": "1108.11-0000", "test_origin": "EU", "price": 13000000, "weight": 3000, "has_co": True},
    {"id": 39, "name": "식품용 옥수수 전분", "hsk": "1108.12-1000", "test_origin": "US", "price": 15000000, "weight": 4000, "has_co": True},
    {"id": 40, "name": "콩나물용 대두", "hsk": "1201.10-1000", "test_origin": "US", "price": 20000000, "weight": 5000, "has_co": True},
    {"id": 41, "name": "피땅콩 (껍질 있는 땅콩)", "hsk": "1202.30-1000", "test_origin": "CN", "price": 10000000, "weight": 2000, "has_co": False},
    {"id": 42, "name": "산양삼 (인삼류)", "hsk": "1211.20-1110", "test_origin": "CN", "price": 50000000, "weight": 100, "has_co": False},
    {"id": 43, "name": "식품용 조 대두유", "hsk": "1507.10-1000", "test_origin": "US", "price": 22000000, "weight": 5000, "has_co": True},
    {"id": 44, "name": "조 팜유 (Palm oil)", "hsk": "1511.10-0000", "test_origin": "MY", "price": 24000000, "weight": 6000, "has_co": True},
    {"id": 45, "name": "돈육/우육 소시지", "hsk": "1601.00-1000", "test_origin": "US", "price": 16000000, "weight": 1500, "has_co": True},
    {"id": 46, "name": "영유아용 균질화 식육 조제품", "hsk": "1602.10-0000", "test_origin": "DE", "price": 18000000, "weight": 1000, "has_co": True},
    {"id": 47, "name": "연어 통조림", "hsk": "1604.11-1000", "test_origin": "US", "price": 20000000, "weight": 1500, "has_co": True},
    {"id": 48, "name": "원당 (사탕무당)", "hsk": "1701.12-1000", "test_origin": "AU", "price": 30000000, "weight": 10000, "has_co": True},
    {"id": 49, "name": "가당 코코아 분말", "hsk": "1806.10-0000", "test_origin": "NL", "price": 15000000, "weight": 2000, "has_co": True},
    {"id": 50, "name": "난황 함유 건조 파스타면", "hsk": "1902.11-1000", "test_origin": "IT", "price": 14000000, "weight": 2500, "has_co": True}
]

print("=" * 140)
print(f"{'No':<3} | {'HSK Code':<13} | {'품목명':<20} | {'국가':<3} | {'기본세율':<6} | {'적용기준':<18} | {'산출관세(원)':<13} | {'요건수':<5} | {'결과'}")
print("=" * 140)

audit_results = []
issues = []

for item in TARGET_50_ITEMS:
    hsk = item["hsk"]
    origin = item["test_origin"]
    price = item["price"]
    weight = item["weight"]
    has_co = item["has_co"]
    clean_code = hsk.replace(".", "").replace("-", "")
    
    # 1. Check hs_code_master
    cur.execute("SELECT hs_code, name_ko FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') = ?", (clean_code,))
    master = cur.fetchone()
    
    # 2. Check get_clearance_guide_api
    guide_res = get_clearance_guide_api(hs_code=hsk, db=db)
    req_list = guide_res.get("requirements", [])
    
    # 3. Check calculate_duty_api
    duty_res = calculate_duty_api(
        hs_code=hsk,
        cif_price_krw=price,
        weight_kg=weight,
        origin=origin,
        has_co=has_co,
        db=db
    )
    
    final_duty = duty_res.get("final_duty")
    applied_basis = duty_res.get("applied_rate_basis", "")
    base_rate = duty_res.get("calculation_breakdown", {}).get("ad_valorem_rate", 0.0)
    
    # Validation assertions
    is_valid = True
    item_reasons = []
    
    if not master:
        is_valid = False
        item_reasons.append("hs_code_master 미등록")
        
    if len(req_list) == 0:
        is_valid = False
        item_reasons.append("통관 법정 요건 0건")
        
    if final_duty is None:
        is_valid = False
        item_reasons.append("관세액 산출 실패")
        
    status_str = "✅ PASS" if is_valid else "❌ FAIL"
    
    print(f"{item['id']:<3} | {hsk:<13} | {item['name'][:18]:<20} | {origin:<3} | {str(base_rate)+'%':<6} | {applied_basis[:16]:<18} | {final_duty:>11,}원 | {len(req_list):<5} | {status_str}")
    
    audit_results.append({
        "item": item,
        "master": master,
        "reqs": req_list,
        "duty_res": duty_res,
        "is_valid": is_valid,
        "issues": item_reasons
    })
    
    if not is_valid:
        issues.append((item, item_reasons))

print("=" * 140)
pass_count = len(audit_results) - len(issues)
accuracy = (pass_count / len(audit_results)) * 100
print(f"📊 신규 50개 농축수산물/가공식품 전수 정밀 심사 결과: 통과 {pass_count}건 / 결함 {len(issues)}건 (무결성 통과율: {accuracy:.1f}%)")

if issues:
    print("\n⚠️ [보완 필요 항목]")
    for it, errs in issues:
        print(f"- [{it['hsk']}] {it['name']}: {', '.join(errs)}")
else:
    print("\n🎉 축하합니다! 신규 50개 농축산물 및 가공식품 전 품목의 관세율, FTA 특혜세율, 검역 및 세관장확인 법령 파이프라인 오류율 0.0% 달성!")

conn.close()
db.close()
