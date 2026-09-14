# -*- coding: utf-8 -*-
"""
CUSWAY 10 Representative Real-World Items Benchmark for Market Launch Assessment
Tests 10 key commercial items spanning diverse industries:
  1. Food / Beverage: 말차라떼 파우더 (음료용 조제분말)
  2. Agricultural: 냉동 아보카도 다이스 (급속동결 과실)
  3. Cosmetics: 세안용 효소 클렌징 파우더 (파파인 효소 세안제)
  4. Chemical/Raw Material: 고순도 에탄올/IPA (단일 유기화합물)
  5. Fashion/Textile: 남성용 메리노 울 100% 니트 스웨터 (편직 상의)
  6. Metal/Hardware: 스테인리스 스틸 볼트 및 너트 세트 (체결용 패스너)
  7. Industrial Machinery: 원심식 다단 스테인리스 수중 펌프 (액체 펌프)
  8. Electronics/Audio: 노이즈 캔슬링 무선 블루투스 헤드폰 (음향기기)
  9. Vehicle/Mobility: 자전거용 유압 디스크 브레이크 세트 (자전거 부품)
  10. Furniture/Living: 전동 높이조절 스탠딩 데스크 (모터 구동 책상)
"""
import sys
import os
import json
import time

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.models import HSCodeMaster, CustomsPrecedent
from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.main import get_hs_rates_api, get_clearance_guide_api

TEST_10_ITEMS = [
    {
        "id": 1,
        "cat": "식품/조제",
        "name": "말차라떼 파우더 (가당 탈지분유 배합 음료용 조제분말)",
        "mat": "말차 분말 15%, 탈지분유 30%, 설탕 55%",
        "func": "우유나 물에 타서 마시는 음료용 조제분말",
        "origin": "JP",
        "exp_ch": ["19", "21"],
        "exp_hd": ["1901", "2106"]
    },
    {
        "id": 2,
        "cat": "과실/냉동",
        "name": "냉동 아보카도 다이스 (단순 절단 급속동결)",
        "mat": "생과 아보카도 100%",
        "func": "비가열 급속 동결 식용 과실",
        "origin": "PE",
        "exp_ch": ["08"],
        "exp_hd": ["0811"]
    },
    {
        "id": 3,
        "cat": "화장품",
        "name": "세안용 효소 클렌징 파우더 (파파인 효소 함유 세안제)",
        "mat": "파파인 효소, 아미노산 계면활성제, 옥수수전분",
        "func": "얼굴 세안 및 각질 정돈용 기초 세안 화장품",
        "origin": "JP",
        "exp_ch": ["33", "34"],
        "exp_hd": ["3304", "3401"]
    },
    {
        "id": 4,
        "cat": "유기화합물",
        "name": "반도체 세정용 초고순도 이소프로필알코올 (IPA 99.999%)",
        "mat": "2-Propanol (단일 유기화합물) 99.999%",
        "func": "반도체 웨이퍼 세정 및 건조용 정밀 용제",
        "origin": "US",
        "exp_ch": ["29"],
        "exp_hd": ["2905"]
    },
    {
        "id": 5,
        "cat": "편직의류",
        "name": "남성용 메리노 울 100% 니트 스웨터 (편직 긴소매 상의)",
        "mat": "방적 모사(Merino Wool) 100%",
        "func": "보온용 남성 편직 니트 스웨터",
        "origin": "IT",
        "exp_ch": ["61"],
        "exp_hd": ["6110"]
    },
    {
        "id": 6,
        "cat": "나사/패스너",
        "name": "고장력 육각 볼트 및 너트 세트 (아연도금 합금강 볼트 M12)",
        "mat": "열처리 합금강 (강도 10.9), 아연도금 표면",
        "func": "건축 철골 구조물 및 기계 프레임 체결용 나사 세트",
        "origin": "CN",
        "exp_ch": ["73"],
        "exp_hd": ["7318"]
    },
    {
        "id": 7,
        "cat": "액체펌프",
        "name": "원심식 다단 스테인리스 수중 펌프 (삼상 5.5kW 배수 펌프)",
        "mat": "STS304 임펠러 및 디퓨저, 밀폐형 수중 모터, 메카니컬 씰",
        "func": "지하수 및 산업용수를 양수 가압 이송하는 액체 펌프",
        "origin": "DE",
        "exp_ch": ["84"],
        "exp_hd": ["8413"]
    },
    {
        "id": 8,
        "cat": "음향기기",
        "name": "액티브 노이즈 캔슬링 블루투스 무선 헤드폰",
        "mat": "다이내믹 드라이버, 블루투스 5.3 칩셋, 리튬이온 배터리, 플라스틱 하우징",
        "func": "무선 오디오 재생 및 핸즈프리 음성 통화",
        "origin": "VN",
        "exp_ch": ["85"],
        "exp_hd": ["8518", "8517"]
    },
    {
        "id": 9,
        "cat": "가구류",
        "name": "전동 높이조절 스탠딩 데스크 (듀얼모터 책상)",
        "mat": "스틸 프레임, 친환경 MDF 상판, 듀얼 리프팅 모터, 디지털 컨트롤러",
        "func": "사무실 및 가정용 높이 조절 사무용 가구(책상)",
        "origin": "CN",
        "exp_ch": ["94"],
        "exp_hd": ["9403"]
    },
    {
        "id": 10,
        "cat": "안전장구",
        "name": "오토바이용 풀페이스 카본 헬멧 (ECE 22.06 안전인증)",
        "mat": "탄소섬유(Carbon Fiber) 쉘, EPS 충격흡수 폼, 폴리카보네이트 실드",
        "func": "이륜차 운전자 두부 보호용 안전모",
        "origin": "JP",
        "exp_ch": ["65"],
        "exp_hd": ["6506"]
    }
]

def run_market_readiness_test():
    db = SessionLocal()
    print("=" * 80)
    print("        CUSWAY 10 REPRESENTATIVE ITEMS MARKET READINESS TEST")
    print("=" * 80)
    
    results = []
    
    for item in TEST_10_ITEMS:
        item_id = item["id"]
        cat = item["cat"]
        p_name = item["name"]
        p_mat = item["mat"]
        p_func = item["func"]
        p_origin = item["origin"]
        exp_ch = item["exp_ch"]
        exp_hd = item["exp_hd"]
        
        print(f"\n[{item_id:02d}/10] Testing: {p_name} (Origin: {p_origin})")
        
        # 1. Classification
        cls_res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=p_name,
            material=p_mat,
            function_use=p_func,
            db=db
        )
        
        resolved_hsk = cls_res.get("recommendedHsCode", "0000.00-0000")
        heading_name = cls_res.get("headingName", "")
        reasoning = cls_res.get("legalReasoning", "")
        precedents = cls_res.get("precedents", [])
        
        clean_hsk = resolved_hsk.replace('.', '').replace('-', '').strip()
        ch2 = clean_hsk[:2]
        hd4 = clean_hsk[:4]
        
        is_pass = (ch2 in exp_ch) and (hd4 in exp_hd)
        status_str = "✅ PASS" if is_pass else "❌ FAIL (경합/오분류)"
        
        # 2. Tariff & FTA
        rates_res = get_hs_rates_api(resolved_hsk, origin=p_origin, db=db)
        rates_data = rates_res.get("rates", {}) if rates_res else {}
        base_rate = rates_data.get("base_rate")
        wto_rate = rates_data.get("wto_rate")
        fta_rate = rates_data.get("fta_rate")
        fta_name = rates_data.get("fta_name")
        rec_rate = rates_data.get("recommended_rate")
        
        # 3. Clearance Laws
        guide_res = get_clearance_guide_api(resolved_hsk, db=db)
        reqs = guide_res.get("requirements", []) if guide_res else []
        req_laws = [r.get("law_name") for r in reqs]
        
        print(f"  • 도출 HSK: {resolved_hsk} ({heading_name[:30]}) -> {status_str}")
        print(f"  • 세율 분석: 기본 {base_rate}% / WTO {wto_rate}% / {fta_name or 'FTA'} {fta_rate}% -> 최적적용: {rec_rate}%")
        print(f"  • 수입 요건: {', '.join(req_laws) if req_laws else '해당 없음 (일반 품목)'}")
        print(f"  • 실존 판례: {len(precedents)}건 인용됨")
        
        results.append({
            "id": item_id,
            "name": p_name,
            "cat": cat,
            "hsk": resolved_hsk,
            "is_pass": is_pass,
            "base_rate": base_rate,
            "fta_rate": fta_rate,
            "rec_rate": rec_rate,
            "req_laws": req_laws,
            "precedents_count": len(precedents)
        })
        
    db.close()
    
    # Summary
    pass_count = sum(1 for r in results if r["is_pass"])
    print("\n" + "=" * 80)
    print(f" ★ 10개 대표 품목 테스트 결과: {pass_count}/10 PASS (정확도: {pass_count * 10}%)")
    print("=" * 80)

if __name__ == "__main__":
    run_market_readiness_test()
