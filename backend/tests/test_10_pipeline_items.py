import sys
import os
import json

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.main import get_hs_rates_api, get_clearance_guide_api

test_items = [
    {
        "name": "Alor Freeze Dried Yogurt Bites Blueberry",
        "material": "동결건조 요구르트 80%, 건블루베리 20%",
        "function_use": "소매용 요거트 과실 스낵",
        "origin": "MY"  # 말레이시아 (한-아세안/RCEP)
    },
    {
        "name": "냉동 훈제 연어 슬라이스 (Smoked Salmon)",
        "material": "대서양 연어(Salmon Salar), 정제염, 훈연향",
        "function_use": "식품 조리용 및 횟감용",
        "origin": "NO"  # 노르웨이 (한-EFTA)
    },
    {
        "name": "엑스트라 버진 올리브유 (Extra Virgin Olive Oil)",
        "material": "냉압착 올리브유 100% (산도 0.8% 이하, 500ml 유리병)",
        "function_use": "식용 샐러드 드레싱 및 조리용",
        "origin": "IT"  # 이탈리아 (한-EU)
    },
    {
        "name": "스마트 무선 블루투스 이어폰 (TWS Earbuds)",
        "material": "플라스틱 하우징, 블루투스 송수신 모듈, 리튬폴리머 배터리",
        "function_use": "스마트폰 무선 음향 송수신 및 통화",
        "origin": "CN"  # 중국 (한-중/RCEP)
    },
    {
        "name": "휴대용 선풍기가 내장된 쿨링 작업 조끼 (Fan Vest)",
        "material": "폴리에스테르 100% 직물 조끼 + 탈착식 소형 팬 2개 + 배터리",
        "function_use": "여름철 건설현장 작업자 체온 냉각용 작업복",
        "origin": "CN"  # 중국
    },
    {
        "name": "페달 보조형 전기자전거 (E-Bike, 250W)",
        "material": "알루미늄 프레임, 250W 브러시리스 모터, 36V 리튬 배터리",
        "function_use": "도심 출퇴근 및 레저용 페달 보조 주행",
        "origin": "CN"  # 중국
    },
    {
        "name": "히알루론산 수분 앰플 에센스 (Hyaluronic Ampoule)",
        "material": "정제수, 히알루론산(1%), 글리세린, 병풀추출물 (30ml 유리병)",
        "function_use": "피부 보습 및 영양 공급용 기초 화장품",
        "origin": "FR"  # 프랑스 (한-EU)
    },
    {
        "name": "디스플레이 표면 보호용 자가점착성 PET 필름 (롤 형태)",
        "material": "폴리에틸렌 테레프탈레이트(PET) 필름 + 아크릴계 점착제 도포 (폭 1,200mm)",
        "function_use": "스마트폰 및 디스플레이 패널 제조공정 표면 스크래치 방지",
        "origin": "JP"  # 일본 (RCEP)
    },
    {
        "name": "반도체 웨이퍼 세정용 고속 원심분리기",
        "material": "스테인리스 스틸, 초고속 회전 드럼, PLC 컨트롤러",
        "function_use": "반도체 8인치/12인치 웨이퍼 세정액 탈수 및 분리",
        "origin": "US"  # 미국 (한-미 FTA)
    },
    {
        "name": "유아용 원목 블록 조립 완구 세트",
        "material": "친환경 너도밤나무 원목, 무독성 수성 페인트 착색",
        "function_use": "3세 이상 유아 지능 발달 및 쌓기 놀이용 완구",
        "origin": "DE"  # 독일 (한-EU)
    }
]

def run_10_pipeline_tests():
    db = SessionLocal()
    results = []
    
    print("=" * 100)
    print("      CUSWAY 4단계 원스톱 수입통관 파이프라인 신규 10개 품목 전수 실증 테스트")
    print("=" * 100)
    
    for idx, item in enumerate(test_items, 1):
        print(f"\n[{idx}/10] 품목명: {item['name']} (원산지: {item['origin']})")
        print("-" * 100)
        
        # Step 1: AI HS Code Classification & Legal Reasoning
        step1 = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=item["name"],
            material=item["material"],
            function_use=item["function_use"],
            db=db
        )
        hsk = step1.get("recommendedHsCode", "")
        heading = step1.get("headingName", "")
        gris = step1.get("appliedGris", [])
        precedents = step1.get("precedents", [])
        competing = step1.get("competingHsCodes", [])
        
        print(f"▶ [1단계: HS 품목분류 & 법적 근거]")
        print(f"  • 추천 HSK: {hsk} ({heading})")
        print(f"  • 적용 통칙: {', '.join(gris)}")
        print(f"  • 실존 결정례 매칭: {len(precedents)}건 (가짜 ID 여부: {'무' if all(not p.get('id', '').startswith('사전심사-2026') for p in precedents) else '유'})")
        if competing:
            print(f"  • 경합 세번: {[c.get('hsCode') for c in competing]}")
            
        # Step 2: Tariff Rates & FTA Optimization
        step2 = get_hs_rates_api(hs_code=hsk, origin=item["origin"], db=db)
        rates = step2.get("rates", {})
        base_r = rates.get("base_rate")
        wto_r = rates.get("wto_rate")
        fta_r = rates.get("fta_rate")
        fta_n = rates.get("fta_name")
        rec_r = rates.get("recommended_rate")
        insight = rates.get("expert_insight", "")
        
        print(f"▶ [2단계: 관세율 및 FTA 협정세율 비교]")
        print(f"  • 기본세율(A): {base_r}% | WTO 협정(C): {wto_r}% | {fta_n}: {fta_r}%")
        print(f"  • 최종 최적 추천세율: {rec_r}%")
        print(f"  • 브리핑: {insight}")
        
        # Step 3 & 4: Regulatory Requirements & Action Documents
        step34 = get_clearance_guide_api(hs_code=hsk, db=db)
        reqs = step34.get("requirements", [])
        is_restricted = step34.get("is_restricted", False)
        
        print(f"▶ [3단계: 수입통관 요건 및 세관장 확인 법령]")
        if reqs:
            for r in reqs:
                print(f"  • 법령: [{r['law_name']}] ({r.get('agency_name', '')} - {r.get('check_type', '')})")
                print(f"    - 내용: {r.get('description', '')[:120]}...")
        else:
            print(f"  • 세관장 확인 대상 요건 없음 (자유 수입 품목)")
            
        print(f"▶ [4단계: 필수 행정 서류 & 통관 액션 플랜]")
        doc_list = ["선하증권(B/L)", "상업송장(Commercial Invoice)", "포장명세서(Packing List)"]
        if fta_r is not None and rec_r == fta_r and rec_r < (wto_r if wto_r is not None else base_r):
            doc_list.append(f"{fta_n} 원산지증명서(C/O)")
        for r in reqs:
            if r.get("guide") and r["guide"].get("documents"):
                doc_list.extend(r["guide"]["documents"])
        doc_list = list(dict.fromkeys(doc_list)) # dedup
        print(f"  • 필수 구비서류: {', '.join(doc_list)}")
        
        results.append({
            "item": item,
            "step1": step1,
            "step2": step2,
            "step34": step34,
            "doc_list": doc_list
        })
        
    print("\n" + "=" * 100)
    print("                      10개 품목 4단계 파이프라인 전수 테스트 완료")
    print("=" * 100)

if __name__ == "__main__":
    run_10_pipeline_tests()
