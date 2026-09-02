# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Future Food Top 20 Benchmark Simulator
Testing 20 Future Innovative Food Concepts against Unified RAG Pipeline
"""
import sys
import os
import time
import json
import sqlite3

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

# 20 Future Innovative Food Items Dataset
FUTURE_FOOD_20 = [
    {
        "id": 1,
        "name": "세포 배양 소고기 안심 스테이크",
        "material": "소 근육 줄기세포 배양 단백질 70%, 식물성 지질 15%, 아미노산 배양액 15%",
        "function": "도축 과정 없이 바이오리액터 세포 증식 기술로 생산한 식용 배양육 스테이크",
        "expected_chapter": ["21", "16"],
        "expected_heading": ["2106", "1602"]
    },
    {
        "id": 2,
        "name": "정밀 발효 인공 우유 (Animal-Free Milk)",
        "material": "미생물 정밀발효 유청 단백질, 식물성 지방, 칼슘, 정제수",
        "function": "젖소 없이 미생물 발효로 카제인/유청 단백질을 합성한 동물 무첨가 우유 대체 음료",
        "expected_chapter": ["22", "21", "04"],
        "expected_heading": ["2202", "2106", "0404"]
    },
    {
        "id": 3,
        "name": "미세조류(스피루리나) 고단백 분말",
        "material": "건조 단세포 미세조류(Spirulina) 분말 100%",
        "function": "단백질과 엽록소가 풍부한 미래형 식용 영양 보충용 조제 원료 분말",
        "expected_chapter": ["21", "12"],
        "expected_heading": ["2106", "1212"]
    },
    {
        "id": 4,
        "name": "버섯 균사체(Mycelium) 대체 베이컨",
        "material": "식용 버섯 균사체 섬유 85%, 훈제 식물성 오일, 천연 효모 추출물",
        "function": "버섯 뿌리 균사체를 고밀도 배양하여 돼지고기 베이컨의 식감과 향을 재현한 식물성 대체육",
        "expected_chapter": ["21", "07"],
        "expected_heading": ["2106", "0712"]
    },
    {
        "id": 5,
        "name": "3D 맞춤형 영양 인쇄 식품 캡슐",
        "material": "곡물 전분, 비타민 복합체, 식물성 겔화제, 농축 과채 퓨레",
        "function": "개인 유전자/건강 데이터에 맞추어 영양소를 3D 푸드 프린터로 정밀 적층 성형한 맞춤형 영양식",
        "expected_chapter": ["19", "21"],
        "expected_heading": ["1904", "2106"]
    },
    {
        "id": 6,
        "name": "공기 단백질(Air Protein) 파우더",
        "material": "수소산화 미생물이 공기 중 탄소/질소를 흡수하여 합성한 단백질 90%",
        "function": "토지와 물 없이 공기 중 원소를 포집 발효하여 만든 초친환경 단백질 식자재",
        "expected_chapter": ["21", "35"],
        "expected_heading": ["2106", "3504"]
    },
    {
        "id": 7,
        "name": "세포 배양 참치 뱃살(Toro) 사시미",
        "material": "참다랑어 근육/지방 세포 배양물 80%, 해조류 지질 20%",
        "function": "해양 오염 및 남획 없이 바이오 배양기로 만든 식용 세포 배양 참치 횟감",
        "expected_chapter": ["21", "16", "03"],
        "expected_heading": ["2106", "1604", "0304"]
    },
    {
        "id": 8,
        "name": "식물성 액상 인공 달걀 (Plant-Based Liquid Egg)",
        "material": "녹두 단백질 분리물, 카놀라유, 강황 색소, 겔란검",
        "function": "가열하면 실제 달걀 스크램블처럼 응고되는 식물성 대체 계란 액상물",
        "expected_chapter": ["21", "04"],
        "expected_heading": ["2106", "0408"]
    },
    {
        "id": 9,
        "name": "갈색거저리(밀웜) 곤충 단백질 에너지바",
        "material": "갈색거저리 유충 건조 분말 35%, 귀리, 대추야자 시럽, 아몬드",
        "function": "고단백 식용 곤충 분말을 배합하여 운동 전후 영양을 공급하는 기능성 식품 바",
        "expected_chapter": ["19", "21"],
        "expected_heading": ["1904", "2106"]
    },
    {
        "id": 10,
        "name": "나노 캡슐화 프로바이오틱스 스마트 음료",
        "material": "지질 나노 캡슐 유산균, 프리바이오틱스 올리고당, 사과 농축 과즙, 정제수",
        "function": "위산에서 파괴되지 않고 장까지 살아서 도달하도록 나노 코팅한 유산균 건강 기능성 음료",
        "expected_chapter": ["22", "20", "21"],
        "expected_heading": ["2202", "2009", "2106"]
    },
    {
        "id": 11,
        "name": "해조류 알지네이트 식용 캡슐 워터 (Ooho)",
        "material": "갈조류 추출 알긴산 나트륨, 젖산 칼슘 피막, 미네랄 워터",
        "function": "플라스틱 생수병 없이 껍질째 통째로 입에 넣고 터뜨려 마시는 생분해 식용 구체 음용수",
        "expected_chapter": ["22", "21"],
        "expected_heading": ["2201", "2202", "2106"]
    },
    {
        "id": 12,
        "name": "유전자교정 저아밀로스 무글루텐 밀가루",
        "material": "CRISPR 유전자 교정 무글루텐 밀 제분 가루 100%",
        "function": "셀리악병이나 소화 장애를 유발하지 않도록 알레르기 유발 글루텐 단백질을 제거한 가공 제과제빵용 곡물가루",
        "expected_chapter": ["11", "19"],
        "expected_heading": ["1101", "1901"]
    },
    {
        "id": 13,
        "name": "산삼 식물 줄기세포 배양 기능성 시럽",
        "material": "산삼 캘러스 식물 줄기세포 배양 추출액 40%, 이소말토올리고당, 감초 농축액",
        "function": "면역력 강화 및 항피로 효능을 위해 섭취하는 고농축 액상 기능성 건강식품",
        "expected_chapter": ["21", "17"],
        "expected_heading": ["2106", "1702"]
    },
    {
        "id": 14,
        "name": "무세포 합성 카제인 단백질 파우더",
        "material": "합성 생물학 효모 발효 베타카제인 단백질 분말 95%",
        "function": "치즈 제조 시 신축성과 점성을 부여하는 동물 비의존성 순수 카제인 가공 원료",
        "expected_chapter": ["35", "21", "04"],
        "expected_heading": ["3501", "2106", "0404"]
    },
    {
        "id": 15,
        "name": "미세조류 추출 고순도 비건 오메가3 오일",
        "material": "쉬조키트리움(Schizochytrium) 미세조류 추출 EPA/DHA 지질 100%",
        "function": "어유(생선 기름) 대신 해조류를 정제하여 중금속 걱정 없이 섭취하는 식물성 오메가3 오일",
        "expected_chapter": ["15", "21"],
        "expected_heading": ["1515", "1517", "2106"]
    },
    {
        "id": 16,
        "name": "천연 기능성 펩타이드 발효 감칠맛 소스",
        "material": "발효 대두 펩타이드 농축액 50%, 발효 효모 추출물, 천일염, 정제수",
        "function": "인공 MSG 화학조미료 없이 글루탐산 펩타이드로 깊은 감칠맛을 내는 액상 조미 소스",
        "expected_chapter": ["21"],
        "expected_heading": ["2103", "2106"]
    },
    {
        "id": 17,
        "name": "덱스트린 기반 스마트 수화 젤리",
        "material": "난소화성 말토덱스트린, 전해질 미네랄(나트륨, 칼륨), 펙틴, 구연산",
        "function": "연하 곤란(삼킴 장애) 환자 및 마라톤 선수가 기도 흡인 없이 즉각 수분을 보충하는 연질 젤리",
        "expected_chapter": ["21", "17"],
        "expected_heading": ["2106", "1704"]
    },
    {
        "id": 18,
        "name": "식물성 동결건조 인공 새우 살",
        "material": "곤약 분말 50%, 완두콩 단백질 30%, 파프리카 천연 색소, 식물성 새우 향료",
        "function": "갑각류 알레르기 환자도 섭취할 수 있도록 해산물 새우의 탄력과 풍미를 구현한 식물성 대체 수산물",
        "expected_chapter": ["21", "16"],
        "expected_heading": ["2106", "1605"]
    },
    {
        "id": 19,
        "name": "인체 락토페린 함유 배양 초유 단백질 셰이크",
        "material": "정밀발효 재조합 인간 락토페린 단백질 30%, 식물성 귀리 분말, 바닐라 추출물",
        "function": "모유 초유의 핵심 면역 성분인 락토페린을 미생물로 합성하여 면역 강화를 돕는 분말 음료",
        "expected_chapter": ["21", "19", "04"],
        "expected_heading": ["2106", "1901", "0404"]
    },
    {
        "id": 20,
        "name": "당알코올 대체 제로칼로리 알룰로스 결정 감미료",
        "material": "효소 변환 D-알룰로오스(Psicose) 고순도 결정 99.9%",
        "function": "체내에 흡수되지 않고 배출되어 혈당을 올리지 않는 무칼로리 설탕 대체 천연 감미료",
        "expected_chapter": ["29", "17", "21"],
        "expected_heading": ["2940", "1702", "2106"]
    }
]

def run_future_food_benchmark():
    db = SessionLocal()
    print("=" * 100, flush=True)
    print(">> [CUSWAY] 미래 혁신 식품 Top 20 AI RAG 품목분류 정밀 벤치마크 시작", flush=True)
    print("=" * 100, flush=True)
    
    passed = 0
    failed = 0
    results = []
    
    start_time = time.time()
    
    for item in FUTURE_FOOD_20:
        item_id = item["id"]
        name = item["name"]
        mat = item["material"]
        func = item["function"]
        exp_chs = item["expected_chapter"]
        exp_hds = item["expected_heading"]
        
        # Run actual AI Customs RAG classification pipeline
        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=name,
            material=mat,
            function_use=func,
            db=db
        )
        
        pred_code = res.get("recommendedHsCode", "0000.00-0000")
        heading_name = res.get("headingName", "")
        confidence = res.get("confidence", 0)
        legal_reasoning = res.get("legalReasoning", "")
        competing = res.get("competingHsCodes", [])
        
        clean_code = pred_code.replace('.', '').replace('-', '')
        pred_ch = clean_code[:2]
        pred_hd = clean_code[:4]
        
        is_pass = (pred_hd in exp_hds) or (pred_ch in exp_chs)
        
        if is_pass:
            passed += 1
            status_str = "PASS"
            print(f"[{item_id:02d}/20] {name:<35} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | PASS (예상: 제{'/'.join(exp_hds)}호)", flush=True)
        else:
            failed += 1
            status_str = "FAIL"
            print(f"[{item_id:02d}/20] {name:<35} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | ❌ FAIL (예상: 제{'/'.join(exp_hds)}호)", flush=True)
            
        results.append({
            "id": item_id,
            "name": name,
            "material": mat,
            "function": func,
            "predicted_code": pred_code,
            "heading_name": heading_name,
            "confidence": confidence,
            "legal_reasoning": legal_reasoning[:120] + "...",
            "status": status_str,
            "expected_headings": "/".join(exp_hds),
            "expected_chapters": "/".join(exp_chs)
        })
        
    db.close()
    elapsed = time.time() - start_time
    acc = (passed / 20.0) * 100.0
    
    print("-" * 100)
    print(f"📊 [벤치마크 결과] 20개 미래 식품 중 {passed}개 품목 분류 통과 (정확도: {acc:.1f}%) | 소요 시간: {elapsed:.2f}초")
    print("=" * 100)
    
    return results, passed, failed

if __name__ == "__main__":
    run_future_food_benchmark()
