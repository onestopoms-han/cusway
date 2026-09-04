# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 7 New 50 High-Complexity Customs Items Benchmark
Automated iterative testing until 0% error rate (100% accuracy) is achieved.
"""
import sys
import os
import time

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

SET7_50_ITEMS = [
    # 1-10: Bio, Agri, Foods, Nature Tech
    {
        "id": 1,
        "name": "식용 개구리 다리 (냉동)",
        "material": "식용 황소개구리 뒷다리육 100%",
        "function": "식용으로 도축하여 가공 및 급속 냉동한 개구리 뒷다리육",
        "expected_chapter": ["02"],
        "expected_heading": ["0208"]
    },
    {
        "id": 2,
        "name": "훈제 장어 필레 (냉동 포장)",
        "material": "뱀장어육 95%, 훈연향 3%, 소금 2%",
        "function": "내장과 뼈를 제거하고 훈제 가공한 냉동 장어 살코기",
        "expected_chapter": ["03", "16"],
        "expected_heading": ["0305", "1604"]
    },
    {
        "id": 3,
        "name": "동결건조 천연 로열젤리 분말",
        "material": "생로열젤리 100% 동결건조 분말",
        "function": "꿀벌의 분비물인 로열젤리를 동결건조하여 영양 식품 원료로 제조한 천연물",
        "expected_chapter": ["04"],
        "expected_heading": ["0410"]
    },
    {
        "id": 4,
        "name": "의약품 가공용 동결건조 녹용 절편",
        "material": "사슴의 뿔(녹용) 100%",
        "function": "한약재 및 건강보조 원료용으로 건조 및 절편 가공된 사슴뿔",
        "expected_chapter": ["05"],
        "expected_heading": ["0507"]
    },
    {
        "id": 5,
        "name": "프리저브드 보존화 장미꽃 (보존액 처리 생화)",
        "material": "생화 장미 85%, 글리세린 보존액 15%",
        "function": "생화의 수분을 글리세린 유기물로 치환하여 장기 보존 가능하게 가공한 절화",
        "expected_chapter": ["06"],
        "expected_heading": ["0603"]
    },
    {
        "id": 6,
        "name": "건조 송로버섯(블랙 트러플) 슬라이스",
        "material": "자연산 블랙 트러플(Tuber melanosporum) 100%",
        "function": "고급 식재료용으로 얇게 썰어 건조한 천연 송로버섯",
        "expected_chapter": ["07", "20"],
        "expected_heading": ["0712", "2003"]
    },
    {
        "id": 7,
        "name": "유기농 천연 바닐라빈 파우더",
        "material": "건조 바닐라 꼬투리 분쇄물 100%",
        "function": "제과제빵 및 식품 조미용 천연 바닐라 열매 분말",
        "expected_chapter": ["09"],
        "expected_heading": ["0905"]
    },
    {
        "id": 8,
        "name": "식품 제조용 퀴노아 곡물 가루",
        "material": "탈곡 및 세척된 퀴노아(Quinoa) 분말 100%",
        "function": "글루텐프리 빵 및 식품 가공 원료용 곡분",
        "expected_chapter": ["10", "11"],
        "expected_heading": ["1102", "1104", "1008"]
    },
    {
        "id": 9,
        "name": "식용 치아시드 (Chia Seed)",
        "material": "천연 치아(Salvia hispanica) 종자 100%",
        "function": "식품용 및 오일 압착용 치아 씨앗",
        "expected_chapter": ["12"],
        "expected_heading": ["1207"]
    },
    {
        "id": 10,
        "name": "곤약 글루코만난 추출 정제 검 (Konjac Gum)",
        "material": "구약감자 추출 글루코만난 95%, 수분 5%",
        "function": "식품 증점제 및 젤화제로 사용하는 식물성 식물성 액즙과 엑스",
        "expected_chapter": ["13"],
        "expected_heading": ["1302"]
    },

    # 11-20: Oils, Prepared Foods, Bio & Drinks
    {
        "id": 11,
        "name": "천연 식물성 수세미 가공 세척 패드",
        "material": "건조 천연 수세미(Luffa cylindrica) 식물 섬유 100%",
        "function": "주방 세척 및 목욕용으로 절단 및 봉제 가공된 천연 식물성 섬유 물품",
        "expected_chapter": ["14", "46"],
        "expected_heading": ["1404", "4602"]
    },
    {
        "id": 12,
        "name": "엑스트라 버진 아보카도 오일 (비변성)",
        "material": "저온 압착 아보카도유 100%",
        "function": "화학적 변성 없이 기계적 냉압착으로 추출한 식용 고순도 아보카도 기름",
        "expected_chapter": ["15"],
        "expected_heading": ["1515"]
    },
    {
        "id": 13,
        "name": "식물성 기름 침지 훈제 연어 통조림",
        "material": "훈제 연어육 75%, 올리브유 24%, 식염 1%",
        "function": "밀폐 용기에 담아 멸균 처리한 즉석 섭취용 연어 조제품",
        "expected_chapter": ["16"],
        "expected_heading": ["1604"]
    },
    {
        "id": 14,
        "name": "천연 단풍나무 수액 메이플 시럽",
        "material": "단풍나무 수액 농축액 (당도 66 Brix) 100%",
        "function": "향료나 착색료 첨가 없이 단풍나무 수액을 졸여 만든 천연 당 시럽",
        "expected_chapter": ["17"],
        "expected_heading": ["1702"]
    },
    {
        "id": 15,
        "name": "제과용 순수 코코아 버터 펠릿",
        "material": "카카오빈 압착 지방(코코아 버터) 100%",
        "function": "초콜릿 및 고급 제과 제조용 비알칼리화 천연 코코아 유지",
        "expected_chapter": ["18"],
        "expected_heading": ["1804"]
    },
    {
        "id": 16,
        "name": "글루텐프리 쌀 파스타 건면 (스파게티형)",
        "material": "쌀가루 90%, 타피오카 전분 10%",
        "function": "밀가루 없이 쌀가루를 압출 성형하여 건조한 글루텐프리 파스타 조제품",
        "expected_chapter": ["19"],
        "expected_heading": ["1902"]
    },
    {
        "id": 17,
        "name": "설탕 첨가 냉동 망고 퓨레",
        "material": "망고 과육 85%, 설탕 15%",
        "function": "망고를 갈아 설탕을 혼합하여 음료/제과 베이스용으로 냉동한 과실 조제품",
        "expected_chapter": ["20"],
        "expected_heading": ["2007", "2008"]
    },
    {
        "id": 18,
        "name": "김치 유래 유산균 복합 발효 분말",
        "material": "Leuconostoc mesenteroides 유산균체 분말 70%, 덱스트린 30%",
        "function": "장 건강 기능성 건강기능식품 제조용 유산균 혼합 조제품",
        "expected_chapter": ["21"],
        "expected_heading": ["2106"]
    },
    {
        "id": 19,
        "name": "블루베리 과실 발효주 (알코올 14% vol)",
        "material": "블루베리 발효 원액 100% (알코올 14도)",
        "function": "포도 이외의 신선 과실을 발효시켜 제조한 기타 발효주",
        "expected_chapter": ["22"],
        "expected_heading": ["2206"]
    },
    {
        "id": 20,
        "name": "사료용 건조 맥주박 (Brewers' Spent Grains)",
        "material": "맥주 양조 후 남은 맥아 찌꺼기 건조물 100%",
        "function": "양조 부산물로 단백질과 섬유질이 풍부한 가축 사료용 원료",
        "expected_chapter": ["23"],
        "expected_heading": ["2303"]
    },

    # 21-30: Chemicals, Minerals, Pharma, Catalysts
    {
        "id": 21,
        "name": "멘톨 향 캡슐 내장형 궐련형 전자담배 스틱",
        "material": "재구성 담배 시트 75%, 멘톨 향 캡슐 필터 25%",
        "function": "가열식 전자담배 디바이스에 삽입하여 흡입하는 연초 함유 전자담배용 스틱",
        "expected_chapter": ["24"],
        "expected_heading": ["2404"]
    },
    {
        "id": 22,
        "name": "화장품 및 의약품용 고순도 정제 탤크 (활석 분말)",
        "material": "천연 천연 함수 규산마그네슘(Talc) 99.8%",
        "function": "미분쇄하여 살균 및 불순물 제거 처리한 천연 광물 활석 파우더",
        "expected_chapter": ["25"],
        "expected_heading": ["2526"]
    },
    {
        "id": 23,
        "name": "이차전지 음극재용 인조 흑연 분말",
        "material": "석유계 코크스 흑연화 인조 흑연 99.9%",
        "function": "고온 열처리로 인공 합성하여 리튬이온 배터리 음극 활물질로 사용하는 인조 흑연",
        "expected_chapter": ["38"],
        "expected_heading": ["3801"]
    },
    {
        "id": 24,
        "name": "반도체 세정용 초고순도 과산화수소수 (31 wt%)",
        "material": "과산화수소(H2O2) 31%, 초순수 69% (금속 불순물 1ppb 이하)",
        "function": "반도체 실리콘 웨이퍼 표면의 유기물 및 파티클을 산화 세정하는 고순도 무기화합물",
        "expected_chapter": ["28"],
        "expected_heading": ["2847"]
    },
    {
        "id": 25,
        "name": "원료의약품 L-아스코르브산 (비타민 C)",
        "material": "L-Ascorbic Acid 순도 99.5% 이상 원말",
        "function": "의약품 정제 및 앰플 제조용으로 합성된 순수 비타민 C 단일 성분",
        "expected_chapter": ["29"],
        "expected_heading": ["2936"]
    },
    {
        "id": 26,
        "name": "인플루엔자(독감) 예방 4가 백신 주사제",
        "material": "불활화 인플루엔자 바이러스 항원액 0.5ml 프리필드시린지",
        "function": "사람의 인플루엔자 감염 예방을 위한 면역학적 백신 의약품",
        "expected_chapter": ["30"],
        "expected_heading": ["3002"]
    },
    {
        "id": 27,
        "name": "원예용 완전 수용성 NPK 복합 비료 (20-20-20)",
        "material": "질산칼륨 35%, 인산이수소칼륨 35%, 요소 30%",
        "function": "질소, 인산, 칼륨의 3대 비료 요소를 모두 함유하여 관주 시비하는 복합 광물질 비료",
        "expected_chapter": ["31"],
        "expected_heading": ["3105"]
    },
    {
        "id": 28,
        "name": "세라믹 타일 잉크젯 인쇄용 무기 착색 잉크",
        "material": "코발트 알루미네이트 무기 안료 40%, 유기 분산용제 60%",
        "function": "도자기 및 세라믹 타일 표면에 고온 소성 인쇄를 위해 조제된 특수 무기 액상 잉크",
        "expected_chapter": ["32"],
        "expected_heading": ["3207"]
    },
    {
        "id": 29,
        "name": "천연 라벤더 에센셜 오일 (수증기 증류)",
        "material": "라벤더 꽃 수증기 증류 정유 100%",
        "function": "테르펜을 제거하지 않은 아로마 테라피 및 화장품 향료용 천연 정유",
        "expected_chapter": ["33"],
        "expected_heading": ["3301"]
    },
    {
        "id": 30,
        "name": "자동차 도장면 보호용 실리콘 액상 광택제",
        "material": "폴리디메틸실록산 20%, 왁스 5%, 용제 및 유화제 75%",
        "function": "자동차 차체 도장면의 광택 및 오염 방지를 위해 조제된 광택용 페이스트 및 액제",
        "expected_chapter": ["34"],
        "expected_heading": ["3405"]
    },

    # 31-40: High Polymers, Semiconductors, Woods, Textiles
    {
        "id": 31,
        "name": "수술용 생체 흡수성 피브린 실란트 지혈 접착제",
        "material": "인간 유래 피브리노겐 및 트롬빈 동결건조 분말 킷트",
        "function": "외과 수술 시 출혈 부위에 도포하여 즉시 혈액을 응고시키는 의약품형 생체 접착제",
        "expected_chapter": ["30"],
        "expected_heading": ["3006"]
    },
    {
        "id": 32,
        "name": "자동차 에어백용 고체 가스발생제 정제 (Gas Generant)",
        "material": "질산구아니딘 50%, 질산염 40%, 바인더 10%",
        "function": "차량 충돌 시 점화되어 급속도로 질소 가스를 발생시켜 에어백 쿠션을 팽창시키는 조제 화약",
        "expected_chapter": ["36"],
        "expected_heading": ["3602"]
    },
    {
        "id": 33,
        "name": "EUV 반도체 노광용 화학증폭형 포토레지스트",
        "material": "감광성 고분자 수지 15%, 광산발생제(PAG) 5%, PGMEA 유기용제 80%",
        "function": "극자외선(EUV) 노광 공정에서 실리콘 웨이퍼 표면에 미세 회로 패턴을 형성하는 액상 감광제",
        "expected_chapter": ["37"],
        "expected_heading": ["3707"]
    },
    {
        "id": 34,
        "name": "반도체 웨이퍼 화학기계연마(CMP)용 콜로이달 실리카 슬러리",
        "material": "나노 콜로이달 실리카 입자 20%, 산화제 및 pH 조절제 5%, 초순수 75%",
        "function": "반도체 층간 절연막 및 금속 배선을 나노 단위로 평탄화 연마하는 조제 화학품",
        "expected_chapter": ["38"],
        "expected_heading": ["3824"]
    },
    {
        "id": 35,
        "name": "생분해성 폴리유산(PLA) 플라스틱 원료 펠릿",
        "material": "폴리락트산(Polylactic Acid) 100% 펠릿",
        "function": "옥수수 전분에서 발효 합성된 친환경 생분해성 열가소성 폴리에스테르 일차제품 수지",
        "expected_chapter": ["39"],
        "expected_heading": ["3907"]
    },
    {
        "id": 36,
        "name": "반도체 플라즈마 식각 챔버용 불소고무(FFKM) O-링",
        "material": "퍼플루오로엘라스토머(FFKM) 가황 고무 100%",
        "function": "고온 및 부식성 플라즈마 가스 환경에서 챔버의 진공 기밀을 유지하는 고기능성 고무 패킹",
        "expected_chapter": ["40"],
        "expected_heading": ["4016"]
    },
    {
        "id": 37,
        "name": "천연 소가죽 외피 캐디백 (골프백)",
        "material": "외면 천연 우피 가죽 90%, 금속 지퍼 및 내부 폴리에스테르 안감 10%",
        "function": "골프 클럽 및 용품을 수납하여 휴대 및 이동하는 가죽제 스포츠 용품 가방",
        "expected_chapter": ["42"],
        "expected_heading": ["4202"]
    },
    {
        "id": 38,
        "name": "3중 구조 엔지니어링 원목마루 바닥재 패널",
        "material": "상판 오크 원목(3mm), 중간 침엽수 코어재(9mm), 하판 합판(2mm)",
        "function": "실내 건축 바닥 마감용으로 혀-홈(Tongue and Groove) 가공된 다층 조립식 마루판",
        "expected_chapter": ["44"],
        "expected_heading": ["4418"]
    },
    {
        "id": 39,
        "name": "친환경 다층 코팅 종이 빨대",
        "material": "천연 펄프 크라프트지 95%, 수용성 수지 바인더 5%",
        "function": "음료를 섭취할 때 사용하는 나선형으로 권취 성형된 일회용 종이 스트로",
        "expected_chapter": ["48"],
        "expected_heading": ["4823"]
    },
    {
        "id": 40,
        "name": "방탄복 제조용 파라계 아라미드(케블라) 평직 직물",
        "material": "파라-아라미드 고강력 합성필라멘트사 100%",
        "function": "총탄 및 파편 방호를 위한 방탄조끼 내장재용 초고강도 합성섬유 직물",
        "expected_chapter": ["54"],
        "expected_heading": ["5407"]
    },

    # 41-50: Heavy Industry, Optics, Electronics, Machinery
    {
        "id": 41,
        "name": "고어텍스 방수 투습 멤브레인 내장 등산화",
        "material": "갑피 천연 소가죽 60% 및 나일론 직물 20%, ePTFE 방수막 10%, 고무창 10%",
        "function": "발목을 보호하고 방수 및 땀 배출 기능을 갖춘 아웃도어용 트레킹 부츠",
        "expected_chapter": ["64"],
        "expected_heading": ["6403"]
    },
    {
        "id": 42,
        "name": "스마트폰 카메라 모듈용 광학 유리 프리즘 블랭크 (비광학 가공)",
        "material": "광학용 고굴절 란탄 플린트 유리 100%",
        "function": "잠망경 폴디드 줌 카메라 렌즈용으로 거칠게 몰딩 성형된 미연마 유리 블랭크",
        "expected_chapter": ["70"],
        "expected_heading": ["7014", "7015"]
    },
    {
        "id": 43,
        "name": "반도체 전극 스퍼터링용 고순도 백금 타겟 (Platinum Target)",
        "material": "백금(Pt) 순도 99.99% 원형 금속 디스크",
        "function": "진공 증착 챔버에서 아르곤 이온 충돌을 통해 실리콘 웨이퍼에 백금 박막을 형성하는 타겟재",
        "expected_chapter": ["71"],
        "expected_heading": ["7110"]
    },
    {
        "id": 44,
        "name": "원자력 발전소용 오스테나이트계 스테인리스 스틸 무계목 정밀관 (Seamless Tube)",
        "material": "SUS316L 스테인리스강 100%",
        "function": "용접 이음매 없이 냉간 인발 가공되어 고압 유체를 이송하는 배관용 강관",
        "expected_chapter": ["73"],
        "expected_heading": ["7304"]
    },
    {
        "id": 45,
        "name": "초임계 CO2 유체 웨이퍼 건조 및 미세패턴 세정장비",
        "material": "고압 챔버, 가스 공급 매니폴드, 온도/압력 정밀 제어기 결합 장치",
        "function": "반도체 3D 낸드플래시 공정에서 초임계 이산화탄소를 이용해 패턴 쓰러짐 없이 웨이퍼를 세정 및 건조하는 기계",
        "expected_chapter": ["84"],
        "expected_heading": ["8486"]
    },
    {
        "id": 46,
        "name": "스마트폰용 2억 화소 CMOS 이미지 센서 (CIS) 모듈",
        "material": "실리콘 포토다이오드 어레이 칩, 컬러필터, 마이크로렌즈가 집적된 패키징 칩",
        "function": "렌즈를 통해 들어온 빛 신호를 디지털 전기 신호로 변환하여 출력하는 반도체 집적회로 센서",
        "expected_chapter": ["85"],
        "expected_heading": ["8542", "8525"]
    },
    {
        "id": 47,
        "name": "도심 항공 모빌리티(UAM)용 4인승 자율비행 전기 수직이착륙기 (eVTOL)",
        "material": "탄소섬유 복합재 동체, 8개 분산 전기 모터 및 로터, 리튬메탈 배터리팩",
        "function": "조종사 없이 도심 상공을 수직 이착륙하여 승객 4인을 자동 운송하는 전동식 비행체 (자체중량 1,800kg)",
        "expected_chapter": ["88"],
        "expected_heading": ["8802", "8806"]
    },
    {
        "id": 48,
        "name": "병원 진단용 3.0 테슬라(T) 초전도 자기공명영상장치 (MRI)",
        "material": "액체 헬륨 냉각 초전도 마그넷, RF 코일, 경사자계 코일, 환자용 침대 및 제어 콘솔",
        "function": "초전도 자기장과 고주파 신호를 인체에 조사하여 체내 조직의 단면을 정밀 영상화하는 의료용 기기",
        "expected_chapter": ["90"],
        "expected_heading": ["9018"]
    },
    {
        "id": 49,
        "name": "인체공학적 높낮이 조절 3D 메쉬 사무용 회전의자",
        "material": "알루미늄 다이캐스팅 오발 다리, 나일론 메쉬 등받이 및 좌판, 가스 리프트 실린더",
        "function": "사무실에서 착석하여 회전 및 틸팅, 높낮이 조절이 가능한 가구용 의자",
        "expected_chapter": ["94"],
        "expected_heading": ["9401"]
    },
    {
        "id": 50,
        "name": "가상현실(VR) 인터랙티브 모션 시뮬레이터 아케이드 게임기",
        "material": "3축 전동 모션 플랫폼, VR 헤드셋, 핸들 및 페달 컨트롤러, 결제 코인기 일체형",
        "function": "오락실 및 테마파크에서 사용자가 탑승하여 요금을 투입하고 모션 체감형 VR 레이싱 게임을 플레이하는 유기 기구",
        "expected_chapter": ["95"],
        "expected_heading": ["9504"]
    }
]

def run_benchmark():
    db = SessionLocal()
    print("================================================================================")
    print("🚀 [START] CUSWAY 2026 AI Engine - SET 7 NEW 50 ITEMS BENCHMARK TEST")
    print(f"Total Test Items: {len(SET7_50_ITEMS)} items across Chapters 01 to 96")
    print("Target Accuracy: 100.0% (0.0% Error Rate)")
    print("================================================================================")

    passed_count = 0
    failed_items = []
    start_time = time.time()

    for idx, item in enumerate(SET7_50_ITEMS, 1):
        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=item["name"],
                material=item["material"],
                function_use=item["function"],
                db=db
            )
            rec_code = res.get("recommendedHsCode", "").replace(".", "").replace("-", "").strip()
            heading_4 = rec_code[:4]
            chapter_2 = rec_code[:2]

            expected_heads = item["expected_heading"]
            expected_chaps = item["expected_chapter"]

            is_pass = (heading_4 in expected_heads) or (chapter_2 in expected_chaps and len(expected_heads) == 0)

            if is_pass:
                passed_count += 1
                print(f"[{idx:02d}/50] [PASS] {item['name']} ➡️ Result: {rec_code[:4]}.{rec_code[4:6]} (Expected: {expected_heads})", flush=True)
            else:
                failed_items.append({
                    "id": item["id"],
                    "name": item["name"],
                    "material": item["material"],
                    "function": item["function"],
                    "predicted": rec_code,
                    "predicted_heading": heading_4,
                    "expected_headings": expected_heads,
                    "expected_chapters": expected_chaps,
                    "reasoning": res.get("legalReasoning", "")[:120]
                })
                print(f"[{idx:02d}/50] [FAIL] {item['name']} ➡️ Predicted: {rec_code} vs Expected: {expected_heads}", flush=True)

        except Exception as e:
            failed_items.append({
                "id": item["id"],
                "name": item["name"],
                "error": str(e)
            })
            print(f"[{idx:02d}/50] [ERROR] {item['name']} ➡️ Exception: {e}", flush=True)

    elapsed = time.time() - start_time
    acc = (passed_count / len(SET7_50_ITEMS)) * 100.0
    err_rate = 100.0 - acc

    print("\n================================================================================")
    print(f"📊 [SET 7 BENCHMARK SUMMARY]")
    print(f"Total Evaluated: {len(SET7_50_ITEMS)}")
    print(f"Passed: {passed_count} / {len(SET7_50_ITEMS)}")
    print(f"Failed: {len(failed_items)} / {len(SET7_50_ITEMS)}")
    print(f"Accuracy Rate: {acc:.2f}% | Error Rate: {err_rate:.2f}%")
    print(f"Elapsed Time: {elapsed:.2f}s")
    print("================================================================================")

    if failed_items:
        print("\n🔍 [FAILED ITEMS DETAILS]")
        for f in failed_items:
            print(f"- ID {f['id']}: {f['name']}")
            print(f"  Predicted: {f.get('predicted_heading')} (Full: {f.get('predicted')})")
            print(f"  Expected : {f.get('expected_headings')}")
            print(f"  Snippet  : {f.get('reasoning')}")
            print("--------------------------------------------------------------------------------")

    return passed_count, failed_items

if __name__ == "__main__":
    run_benchmark()
