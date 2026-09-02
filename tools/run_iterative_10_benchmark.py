# -*- coding: utf-8 -*-
"""
CUSWAY 2026 Iterative Benchmark: 10 New Future Products per Batch
Automatically tests until 0% error rate (100% accuracy) is achieved.
"""
import sys
import os
import time
import json

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

# Batch 1: 10 New Future Advanced Tech Products
BATCH_1_ITEMS = [
    {
        "id": 1,
        "name": "양자 암호 통신(QKD) 단일 광자 송수신 모듈",
        "material": "단일 광자 아발란치 포토다이오드(SPAD), 광 도파로 간섭계, 레이저 다이오드",
        "function": "양자 얽힘 및 단일 광자 상태를 이용해 도청이 불가능한 암호키를 생성·전송하는 유무선 통신 장비 부품",
        "expected_chapter": ["85", "90"],
        "expected_heading": ["8517", "9013", "8541"]
    },
    {
        "id": 2,
        "name": "웨어러블 뇌파(EEG) 수면 유도 스마트 아이패치",
        "material": "은(Ag) 나노선 전극 센서, 미세전류(tES) 자극 칩, 실리콘 패치, 블루투스 모듈",
        "function": "수면 중 뇌파를 실시간 측정하고 미세전류 전기 자극을 가해 깊은 수면을 유도하는 의료·헬스케어 기기",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9018", "8543", "9019"]
    },
    {
        "id": 3,
        "name": "전고체 배터리용 황화물계 고체 전해질 분말",
        "material": "아지로다이트(Argyrodite) 구조 리튬-황-인-염소(Li6PS5Cl) 고순도 결정 분말 100%",
        "function": "차세대 전기차용 전고체 리튬이온 2차전지 내부의 액체 전해액을 대체하는 무기 고체 이온 전도체",
        "expected_chapter": ["28", "38"],
        "expected_heading": ["2842", "2853", "3824", "2830"]
    },
    {
        "id": 4,
        "name": "미생물 정밀발효 친환경 천연 인디고 염료",
        "material": "유전자재조합 대장균 포도당 발효 인디칸(Indican) 효소 분해 청색 색소 98%",
        "function": "석유화학 합성 염료 대신 미생물 생합성으로 제조하여 데님 청바지 원단을 염색하는 식물·생물 유래 염료",
        "expected_chapter": ["32"],
        "expected_heading": ["3203", "3204"]
    },
    {
        "id": 5,
        "name": "자율주행 선박용 위성·라이다 복합 항법 돔",
        "material": "솔리드스테이트 라이다, 광학 카메라, 관성항법장치(IMU), 위성통신 평판 안테나, 레이돔 하우징",
        "function": "무인 자율운항 선박의 마스트에 장착하여 해상 장애물을 탐지하고 최적 항로를 위성으로 계산하는 항해용 복합 센서 시스템",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9014", "8526", "9031"]
    },
    {
        "id": 6,
        "name": "세포 배양 배지용 재조합 인간 혈청 알부민(rHSA)",
        "material": "형질전환 쌀 배아 발현 고순도 재조합 인간 알부민 단백질 분말 99%",
        "function": "인간 혈액 유래 알부민 대신 바이오 의약품 및 줄기세포 배양 시 동물 무혈청 배지 첨가제로 사용하는 알부민 단백질",
        "expected_chapter": ["35", "38", "30"],
        "expected_heading": ["3502", "3821", "3002"]
    },
    {
        "id": 7,
        "name": "초경량 탄소나노튜브(CNT) 전기차 면상 발열 시트",
        "material": "다중벽 탄소나노튜브(MWCNT) 박막, 폴리이미드(PI) 절연 필름, 전극 단자",
        "function": "전기차 시트 및 도어 트림 내부에 내장되어 전기를 가하면 열을 방출하는 초경량 면상 전기 발열체",
        "expected_chapter": ["85"],
        "expected_heading": ["8516", "8545"]
    },
    {
        "id": 8,
        "name": "스마트 온실용 광학 파장 변환 차광 도료",
        "material": "희토류 형광 양자점, 아크릴 에멀션 수지, 자외선 흡수제, 정제수",
        "function": "비닐하우스나 유리온실 외벽에 도포하여 유해 자외선(UV)을 식물 광합성에 유용한 적색광으로 변환시키는 특수 수성 도료",
        "expected_chapter": ["32", "38"],
        "expected_heading": ["3208", "3209", "3824"]
    },
    {
        "id": 9,
        "name": "미세 유체(Microfluidic) 암 조기 진단 랩온어칩",
        "material": "PDMS 실리콘 미세유체 채널 기판, 금 나노입자 고정화 단클론 항체, 시약 챔버",
        "function": "환자의 혈액 한 방울을 투입하면 순환 종양 세포(CTC)를 미세 유로로 포집하여 암을 조기 진단하는 체외 진단용 키트",
        "expected_chapter": ["38", "90"],
        "expected_heading": ["3822", "9027"]
    },
    {
        "id": 10,
        "name": "초임계 CO2 추출 고순도 식물성 CBD 대마 오일",
        "material": "산업용 헴프 잎/꽃 초임계 CO2 추출 칸나비디올(CBD) 99%, MCT 코코넛 오일",
        "function": "THC 환각 성분을 완전히 제거하고 진정 및 항염 효능을 위해 섭취 또는 도포하는 고순도 칸나비디올 식물 추출물",
        "expected_chapter": ["13", "29", "21", "30"],
        "expected_heading": ["1302", "2907", "2106", "3004"]
    }
]

def run_test(items):
    db = SessionLocal()
    print("=" * 100, flush=True)
    print(">> [CUSWAY] 신규 미래 10대 품목 AI RAG 품목분류 정밀 검증 시작", flush=True)
    print("=" * 100, flush=True)
    
    passed = 0
    failed = 0
    results = []
    
    for item in items:
        item_id = item["id"]
        name = item["name"]
        mat = item["material"]
        func = item["function"]
        exp_chs = item["expected_chapter"]
        exp_hds = item["expected_heading"]
        
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
        
        clean_code = pred_code.replace('.', '').replace('-', '')
        pred_ch = clean_code[:2]
        pred_hd = clean_code[:4]
        
        is_pass = (pred_hd in exp_hds) or (pred_ch in exp_chs)
        
        if is_pass:
            passed += 1
            status_str = "PASS"
            print(f"[{item_id:02d}/10] {name:<36} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | ✅ PASS (예상: 제{'/'.join(exp_hds)}호)", flush=True)
        else:
            failed += 1
            status_str = "FAIL"
            print(f"[{item_id:02d}/10] {name:<36} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | ❌ FAIL (예상: 제{'/'.join(exp_hds)}호)", flush=True)
            
        results.append({
            "id": item_id,
            "name": name,
            "material": mat,
            "function": func,
            "predicted_code": pred_code,
            "heading_name": heading_name,
            "confidence": confidence,
            "legal_reasoning": legal_reasoning,
            "status": status_str,
            "expected_headings": "/".join(exp_hds),
            "expected_chapters": "/".join(exp_chs),
            "is_pass": is_pass
        })
        
    db.close()
    acc = (passed / len(items)) * 100.0
    err_rate = (failed / len(items)) * 100.0
    print("-" * 100, flush=True)
    print(f"📊 [결과 요약] 통과: {passed}/{len(items)}건 | 정확도: {acc:.1f}% | 오류율: {err_rate:.1f}%", flush=True)
    print("=" * 100, flush=True)
    return results, passed, failed, err_rate

if __name__ == "__main__":
    run_test(BATCH_1_ITEMS)
