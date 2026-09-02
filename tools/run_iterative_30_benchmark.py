# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: 30 New Future Products Benchmark Simulator
Iterative testing until 0% error rate (100% accuracy) is achieved.
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

NEW_FUTURE_30 = [
    {
        "id": 1,
        "name": "휴대용 수소 발생 전동 킥보드 충전팩",
        "material": "금속수소화물(Metal Hydride) 합금 카트리지, 압력 조절기, 충전 커넥터",
        "function": "수소를 저장했다가 방출하여 연료전지 모빌리티를 급속 충전하는 휴대용 수소 저장 충전 장치",
        "expected_chapter": ["28", "85", "84"],
        "expected_heading": ["2850", "8504", "8479"]
    },
    {
        "id": 2,
        "name": "생체 흡수성 마그네슘 합금 정형외과 골절 나사",
        "material": "고순도 마그네슘-아연-칼슘(Mg-Zn-Ca) 합금 100%",
        "function": "골절 부위를 고정한 후 1~2년에 걸쳐 체내에서 서서히 분해 흡수되어 제거 수술이 필요 없는 의료용 정형외과 스크루",
        "expected_chapter": ["90"],
        "expected_heading": ["9021", "9018"]
    },
    {
        "id": 3,
        "name": "인공지능 딥러닝 NPU 가속기 PCIe 연산 카드",
        "material": "4nm NPU 신경망처리장치 프로세서, GDDR6 메모리, PCIe 인터페이스 기판, 알루미늄 방열판",
        "function": "서버 및 워크스테이션 메인보드에 장착되어 거대 AI 언어모델의 추론과 학습 연산을 고속 처리하는 가속기 카드",
        "expected_chapter": ["84", "85"],
        "expected_heading": ["8471", "8542", "8473"]
    },
    {
        "id": 4,
        "name": "우주 방사선 차폐용 보론 나노튜브(BNNT) 복합 시트",
        "material": "질화붕소 나노튜브(BNNT) 섬유 60%, 탄화규소(SiC) 매트릭스 40%",
        "function": "우주선 및 우주복 외벽에 장착되어 고에너지 우주 중성자선과 감마선을 흡수 차단하는 초경량 차폐 시트",
        "expected_chapter": ["28", "68", "38", "56"],
        "expected_heading": ["2850", "6815", "3824", "2838", "5603"]
    },
    {
        "id": 5,
        "name": "초소형 인공위성 자세제어용 전기추진 홀 추력기",
        "material": "제논 가스 이온화 방전 챔버, 환형 양극 링, 사마륨-코발트 자석, 세라믹 절연체",
        "function": "제논 가스를 플라즈마로 이온화하여 초고속 분사함으로써 우주 궤도에서 큐브위성의 자세와 궤도를 미세 제어하는 로켓 추진 엔진",
        "expected_chapter": ["84"],
        "expected_heading": ["8412"]
    },
    {
        "id": 6,
        "name": "OLED 청색 인광 발광 도판트 분말",
        "material": "이리듐 유기금속 배위착물(Iridium Complex) 고순도 결정 분말 99.9%",
        "function": "차세대 프리미엄 OLED 디스플레이의 발광층에 도핑되어 청색 발광 효율을 극대화하는 전자용 유기 발광 재료",
        "expected_chapter": ["29", "28", "32"],
        "expected_heading": ["2934", "2843", "3204"]
    },
    {
        "id": 7,
        "name": "eVTOL 도심항공교통 틸트로터 모터 액추에이터",
        "material": "네오디뮴 영구자석 동기모터(PMSM), 티타늄 유성감속기, 엔코더, 알루미늄 하우징",
        "function": "플라잉카 프로펠러의 각도를 수직(이착륙)에서 수평(순항)으로 정밀 회전 구동시키는 항공기용 전기 모터 액추에이터",
        "expected_chapter": ["85", "88"],
        "expected_heading": ["8501", "8807"]
    },
    {
        "id": 8,
        "name": "스마트 건축용 광촉매 자가세정 코팅 판유리",
        "material": "이산화티타늄(TiO2) 나노박막 코팅 플로트 판유리",
        "function": "태양광을 받으면 유기물 오염물질을 광분해하고 빗물에 씻겨 내려가도록 표면을 친수화 처리한 건축 외장용 유리",
        "expected_chapter": ["70"],
        "expected_heading": ["7005", "7007"]
    },
    {
        "id": 9,
        "name": "연속 젖산(Lactate) 측정 마이크로니들 패치",
        "material": "젖산 산화효소 고정화 다공성 마이크로니들, 신호 증폭 금 전극, 무선 송신 칩",
        "function": "피부 표면에 부착하여 통증 없이 세포간질액의 젖산 농도를 연속 모니터링해 운동선수의 근피로도를 측정하는 진단 센서",
        "expected_chapter": ["90"],
        "expected_heading": ["9018", "9027"]
    },
    {
        "id": 10,
        "name": "초임계 수열합성 리튬인산철(LFP) 양극재 분말",
        "material": "나노 결정성 리튬인산철(LiFePO4) 탄소 코팅 분말 100%",
        "function": "전기차 및 에너지저장장치(ESS)용 2차전지 배터리 셀의 양극 극판을 제조하는 핵심 무기 활물질 원료",
        "expected_chapter": ["28", "38"],
        "expected_heading": ["2842", "3824", "2835"]
    },
    {
        "id": 11,
        "name": "반도체 극자외선(EUV) 노광용 탄소나노튜브 펠리클",
        "material": "초박막 탄소나노튜브(CNT) 자립 멤브레인, 실리콘 지지 프레임",
        "function": "EUV 초미세 반도체 노광 공정 시 고가의 포토마스크에 공기 중 먼지가 안착하지 못하도록 보호하는 광학 보호막",
        "expected_chapter": ["84", "90"],
        "expected_heading": ["8486", "9010", "9002"]
    },
    {
        "id": 12,
        "name": "스마트 콘크리트용 균열 자가치유 박테리아 캡슐",
        "material": "탄산칼슘 형성 바실러스 포자, 젖산칼슘 영양제, 고분자 멜라민 마이크로캡슐",
        "function": "콘크리트 배합 시 첨가되어 미세 균열 발생 시 수분과 반응해 석회석(CaCO3)을 침전시켜 균열을 스스로 메우는 건설 혼화제",
        "expected_chapter": ["38", "30"],
        "expected_heading": ["3824", "3002"]
    },
    {
        "id": 13,
        "name": "수소연료전지차용 탄소섬유 고압 수소저장용기",
        "material": "탄소섬유 와인딩 에폭시 복합재료, 폴리아미드(PA) 고분자 라이너, 알루미늄 보스",
        "function": "수소 전기차에 탑재되어 700bar(기압)의 초고압 압축 수소 가스를 안전하게 충전 보관하는 초경량 연료탱크",
        "expected_chapter": ["76", "73", "39"],
        "expected_heading": ["7613", "7311", "3923", "3926"]
    },
    {
        "id": 14,
        "name": "인체 장기 칩(Organ-on-a-Chip) 신약 스크리닝 플랫폼",
        "material": "PDMS 미세유체 채널 칩 기판, 다공성 배양막, 세포 배양액 주입 챔버",
        "function": "동물 실험 없이 미세 칩 위에서 인간의 간·신장 세포를 배양해 신약 후보물질의 효능과 독성을 스크리닝하는 시험 기기",
        "expected_chapter": ["38", "90"],
        "expected_heading": ["3822", "9027"]
    },
    {
        "id": 15,
        "name": "해상 풍력발전 블레이드용 탄소섬유 인발성형 판재",
        "material": "에폭시 수지 함침 고강도 탄소섬유(Carbon Fiber) 연속 인발성형 판재 100%",
        "function": "100미터급 대형 해상 풍력터빈 회전 날개(블레이드)의 중심부 뼈대로 삽입되어 굽힘 하중을 지지하는 구조재",
        "expected_chapter": ["68", "70"],
        "expected_heading": ["6815", "7019"]
    },
    {
        "id": 16,
        "name": "스마트 렌즈용 초소형 고체 마이크로 배터리",
        "material": "박막 리튬인산화질소(LiPON) 고체 전해질, 코발트산리튬 양극박막, 구리 집전체",
        "function": "스마트 콘택트렌즈 및 인체 삽입형 초소형 전자기기에 전력을 공급하는 두께 0.1mm 이하의 초소형 2차전지",
        "expected_chapter": ["85"],
        "expected_heading": ["8507"]
    },
    {
        "id": 17,
        "name": "무인 잠수정(UUV) 수중 음향 무선 통신 모뎀",
        "material": "압전 세라믹 초음파 트랜스듀서, 수중 신호처리 DSP 보드, 티타늄 내압 방수 하우징",
        "function": "전파가 통하지 않는 심해에서 초음파 음향 신호로 무인 잠수정과 모선 간 데이터를 무선 송수신하는 해양 통신 장비",
        "expected_chapter": ["85", "90"],
        "expected_heading": ["8517", "9014"]
    },
    {
        "id": 18,
        "name": "메타물질 음향 스텔스 미세 공진 흡음 패널",
        "material": "서브파장 미세 슬릿 공진 격자 구조 알루미늄 합금 압출 패널",
        "function": "특정 저주파수 소음 및 소나(Sonar) 음파를 내부에서 상쇄 간섭시켜 반사를 없애는 메타구조 흡음 방음 패널",
        "expected_chapter": ["76", "68"],
        "expected_heading": ["7610", "7616", "6806"]
    },
    {
        "id": 19,
        "name": "유전자 재조합 VLP 바이러스 유사입자 백신 원액",
        "material": "재조합 곤충세포 발현 바이러스 외피 단백질 조립 나노입자, 인산염 완충액",
        "function": "유전물질(RNA/DNA) 없이 껍질 단백질 구조만 모사하여 감염력 없이 면역 반응만 유도하는 차세대 감염병 예방 백신 원액",
        "expected_chapter": ["30"],
        "expected_heading": ["3002"]
    },
    {
        "id": 20,
        "name": "스마트 농업용 생분해성 토양 수분 비료 하이드로겔",
        "material": "가교 폴리아크릴산 나트륨(SAP), 키토산, 부식산(Humic Acid), 질소/칼륨 복합비료",
        "function": "토양에 묻어두면 빗물을 자기 무게의 500배 흡수했다가 건조 시 서서히 방출하여 가뭄을 방지하는 스마트 고흡수성 겔",
        "expected_chapter": ["38", "39", "31"],
        "expected_heading": ["3824", "3906", "3105"]
    },
    {
        "id": 21,
        "name": "페로브스카이트-실리콘 탠덤 태양광 셀",
        "material": "유무기 하이브리드 페로브스카이트 광흡수층, n형 단결정 실리콘 웨이퍼, ITO 투명전극",
        "function": "단파장과 장파장 태양광을 위아래에서 이중 흡수하여 발전 효율 30% 이상을 달성하는 차세대 탠덤 태양전지 셀",
        "expected_chapter": ["85"],
        "expected_heading": ["8541"]
    },
    {
        "id": 22,
        "name": "AI 협동 로봇용 3차원 광학식 촉각 센서 (Tactile Sensor)",
        "material": "투명 실리콘 탄성 겔, 내장 마이크로 카메라, 다채색 RGB LED, 알루미늄 케이스",
        "function": "로봇 손가락 끝에 장착되어 물체 접촉 시 변형되는 겔 표면 패턴을 카메라로 인식해 파지력과 물체 형상을 감지하는 센서",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9031", "8543", "8479"]
    },
    {
        "id": 23,
        "name": "자가발전 마찰대전(TENG) 스마트 보행 깔창",
        "material": "나노 패턴 PTFE 박막, 구리 전극, 전도성 직물, EVA 폼 쿠션",
        "function": "사람이 걸을 때 발바닥의 압력과 마찰로 전기를 자체 생산하고 보행 패턴을 스마트폰으로 전송하는 스마트 신발 인솔",
        "expected_chapter": ["85", "64", "90"],
        "expected_heading": ["8543", "6406", "9031"]
    },
    {
        "id": 24,
        "name": "암 치료용 붕소 중성자 포획 치료(BNCT) 표적 화합물",
        "material": "붕소-10(B-10) 동위원소 농축 보로노페닐알라닌(BPA) 고순도 결정 99%",
        "function": "암 환자에게 주입하면 암세포에만 선택적으로 침투한 후 외부 중성자선을 쪼여 정상세포 파괴 없이 암세포만 소멸시키는 의약품 원료",
        "expected_chapter": ["28", "29", "30"],
        "expected_heading": ["2845", "2922", "3004"]
    },
    {
        "id": 25,
        "name": "우주복 외피용 에어로겔 초단열 복합 직물",
        "material": "실리카 에어로겔(Silica Aerogel) 함침 파라계 아라미드(Kevlar) 부직포, 알루미늄 증착 필름",
        "function": "영하 150도에서 영상 120도에 이르는 극한의 우주 환경에서 체온을 보호하는 우주복용 초단열 기능성 섬유 원단",
        "expected_chapter": ["56", "68", "59"],
        "expected_heading": ["5603", "6806", "5903"]
    },
    {
        "id": 26,
        "name": "산업 배출가스 일산화탄소 포집 발효 무수 에탄올",
        "material": "제철소 부생가스(CO/CO2) 미생물 혐기성 가스발효 정제 무수에틸알코올(99.5% vol)",
        "function": "화석연료 없이 제철소 굴뚝 가스를 미생물로 전환하여 친환경 항공유(SAF) 및 화학원료로 사용하는 바이오 에탄올",
        "expected_chapter": ["22", "29"],
        "expected_heading": ["2207", "2905"]
    },
    {
        "id": 27,
        "name": "홀로그래픽 자동차 HUD 광학 광도파로 필름",
        "material": "홀로그램 감광성 포토폴리머 박막, 광학용 무연신 PET 보호 필름",
        "function": "차량 전면 유리에 부착되어 운전자 시야 정면에 AR 주행 정보를 허상으로 띄워주는 홀로그램 광학 필름",
        "expected_chapter": ["37", "90", "39"],
        "expected_heading": ["3701", "9002", "3920"]
    },
    {
        "id": 28,
        "name": "생체흡수성 약물방출 관상동맥 스텐트(BRS)",
        "material": "폴리락트산(PLLA) 생분해성 고분자 스캐폴드, 에베로리무스(Everolimus) 면역억제 약물 코팅",
        "function": "막힌 심장 혈관을 확장해 혈류를 확보한 후 약물을 방출해 재협착을 막고 2~3년 후 체내에서 완전 분해되는 혈관 치료용 기구",
        "expected_chapter": ["90"],
        "expected_heading": ["9021"]
    },
    {
        "id": 29,
        "name": "반도체 패키징용 TGV 글래스 코어 기판",
        "material": "초평탄 무알칼리 붕규산 유리 패널, 레이저 유도 관통전극(TGV) 구리 도금 배선",
        "function": "플라스틱 기판을 대체하여 차세대 AI 반도체의 열변형을 막고 초고속 신호 전송을 가능하게 하는 유리 인터포저 기판",
        "expected_chapter": ["70", "85"],
        "expected_heading": ["7006", "8534"]
    },
    {
        "id": 30,
        "name": "전기차 급속 충전용 액침 냉각 절연유",
        "material": "고순도 합성 탄화수소 폴리알파올레핀(PAO) 유전체 절연 오일 100%",
        "function": "배터리 팩과 충전기를 오일에 직접 담가 열을 고속 흡수하고 화재를 차단하는 고성능 비전도성 액침 냉각액",
        "expected_chapter": ["27", "34", "38"],
        "expected_heading": ["2710", "3403", "3819"]
    }
]

def run_30_test():
    db = SessionLocal()
    print("=" * 100, flush=True)
    print(">> [CUSWAY] 신규 미래 혁신 30대 품목 AI RAG 품목분류 정밀 검증 시작", flush=True)
    print("=" * 100, flush=True)
    
    passed = 0
    failed = 0
    results = []
    
    start_time = time.time()
    
    for item in NEW_FUTURE_30:
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
            print(f"[{item_id:02d}/30] {name:<38} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | ✅ PASS (예상: 제{'/'.join(exp_hds)}호)", flush=True)
        else:
            failed += 1
            status_str = "FAIL"
            print(f"[{item_id:02d}/30] {name:<38} ➔ 추천: {pred_code} (신뢰도: {confidence}%) | ❌ FAIL (예상: 제{'/'.join(exp_hds)}호)", flush=True)
            
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
    elapsed = time.time() - start_time
    acc = (passed / len(NEW_FUTURE_30)) * 100.0
    err_rate = (failed / len(NEW_FUTURE_30)) * 100.0
    
    print("-" * 100, flush=True)
    print(f"📊 [결과 요약] 통과: {passed}/{len(NEW_FUTURE_30)}건 | 정확도: {acc:.1f}% | 오류율: {err_rate:.1f}% | 소요시간: {elapsed:.2f}초", flush=True)
    print("=" * 100, flush=True)
    return results, passed, failed, err_rate

if __name__ == "__main__":
    run_30_test()
