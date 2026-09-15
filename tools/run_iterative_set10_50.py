# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 10 Iterative 50 Brand-New Diverse Products Benchmark
Runs automated classification and validates accuracy against WCO / Korea Customs Service tariff standards.
100% Constitution Compliant: Zero Hallucination, Zero Keyword Hijacking, Real DB.
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

# 50 Brand-New Diverse Customs Items (Set 10)
SET10_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24) [10 items]
    {
        "id": 1,
        "name": "신선 냉장 돼지 삼겹살 (Fresh Chilled Pork Belly)",
        "material": "신선 돼지 삼겹살육 100% (냉장 0~4도 보관, 무양념, 뼈 미포함 생육)",
        "function": "식용 신선 정육 구이 및 조리용 식재료",
        "expected_chapter": "02",
        "expected_heading": "0203"
    },
    {
        "id": 2,
        "name": "활(산) 바지락 조개 (Live Manila Clams)",
        "material": "살아있는 신선 바지락 조개 (패류) 100% (해수 포장, 비동결)",
        "function": "식용 활 패류 탕 및 찜 조리용 식재료",
        "expected_chapter": "03",
        "expected_heading": "0307"
    },
    {
        "id": 3,
        "name": "버진 코코넛 오일 (Virgin Coconut Oil)",
        "material": "코코넛 배유 저온 압착 식물성 유지 100% (화학적 정제 및 수소화 없음)",
        "function": "식용 조리유 및 제과용 식물성 오일",
        "expected_chapter": "15",
        "expected_heading": "1513"
    },
    {
        "id": 4,
        "name": "천연 건조 녹차 잎 (Dried Green Tea Leaves)",
        "material": "Camellia sinensis 찻잎 건조물 100% (발효되지 않은 것, 소매용 3kg 초과 포장)",
        "function": "음용 차 침출 추출용 식재료",
        "expected_chapter": "09",
        "expected_heading": "0902"
    },
    {
        "id": 5,
        "name": "탈각하지 않은 신선 호두 (In-shell Fresh Walnuts)",
        "material": "단단한 겉껍질을 까지 않은 신선 호두 100%",
        "function": "식용 견과류 직접 섭취 및 가공용",
        "expected_chapter": "08",
        "expected_heading": "0802"
    },
    {
        "id": 6,
        "name": "순수 감자 전분 (Pure Potato Starch)",
        "material": "감자 괴경에서 추출 침전 분리한 순수 전분 분말 100% (변성 처리 없음)",
        "function": "식품 조리용 점증제 및 튀김 가공용 전분",
        "expected_chapter": "11",
        "expected_heading": "1108"
    },
    {
        "id": 7,
        "name": "로스팅 볶은 커피 원두 (Roasted Coffee Beans)",
        "material": "볶은 아라비카종 커피 원두 100% (카페인을 제거하지 않은 통 원두)",
        "function": "원두커피 및 에스프레소 추출용 식재료",
        "expected_chapter": "09",
        "expected_heading": "0901"
    },
    {
        "id": 8,
        "name": "정제 백설탕 (Refined Cane Sugar)",
        "material": "사탕수수 유래 고순도 자당(Sucrose) 결정 99.5% 이상 (착색료/향미료 무첨가)",
        "function": "식품 감미료 및 조리용 설탕",
        "expected_chapter": "17",
        "expected_heading": "1701"
    },
    {
        "id": 9,
        "name": "병입 보리 맥아 맥주 (Bottled Malt Beer)",
        "material": "보리 맥아, 홉, 효모, 음용수를 발효 양조한 알코올 음료 (알코올 도수 5.0% vol, 330ml 유리병입)",
        "function": "식용 주류 음용",
        "expected_chapter": "22",
        "expected_heading": "2203"
    },
    {
        "id": 10,
        "name": "전통 발효 고추장 (Fermented Red Pepper Paste)",
        "material": "고춧가루, 찹쌀, 쌀엿, 대두 메줏가루, 식염을 혼합 발효한 전통 장류",
        "function": "한식 요리 조미용 복합 소스",
        "expected_chapter": "21",
        "expected_heading": "2103"
    },

    # 2. 화학·의약·화장품·고무 (Ch 28 - 40) [7 items]
    {
        "id": 11,
        "name": "결정성 무수 구연산 (Citric Acid Anhydrous)",
        "material": "시트르산 (C6H8O7, 순도 99.8% 이상 백색 결정성 분말 화학물질)",
        "function": "식품용 산도조절제 및 제약 원료",
        "expected_chapter": "29",
        "expected_heading": "2918"
    },
    {
        "id": 12,
        "name": "인간용 인플루엔자 백신 주사제 (Influenza Vaccines for Human Medicine)",
        "material": "정제 약독화 인플루엔자 바이러스 항원 함유 주사액 (프리필드시린지 앰플 포장)",
        "function": "인체 독감 바이러스 감염 예방 백신",
        "expected_chapter": "30",
        "expected_heading": "3002"
    },
    {
        "id": 13,
        "name": "아세트아미노펜 정제 완제의약품 (Paracetamol 500mg Tablets)",
        "material": "아세트아미노펜 500mg, 부형제 (소매용 PTP 블리스터 포장 완제의약품)",
        "function": "발열 및 두통 완화용 해열 진통 완제의약품",
        "expected_chapter": "30",
        "expected_heading": "3004"
    },
    {
        "id": 14,
        "name": "스틱형 메이크업 립스틱 (Stick Makeup Lipstick)",
        "material": "식물성 왁스, 에스터 오일, 유기 색소, 비타민E를 배합 성형한 입술 화장품",
        "function": "입술 발색 및 미용 메이크업",
        "expected_chapter": "33",
        "expected_heading": "3304"
    },
    {
        "id": 15,
        "name": "소매용 액상 손세정제 비누 (Liquid Hand Soap Dispenser)",
        "material": "지방산 칼륨염 계면활성제 15%, 글리세린, 향료, 정제수 (소매용 펌프 디스펜서 용기 포장)",
        "function": "손 피부 세정 및 살균용 비누 액제",
        "expected_chapter": "34",
        "expected_heading": "3401"
    },
    {
        "id": 16,
        "name": "천연 고무 라텍스 액 (Natural Rubber Latex)",
        "material": "헤베아 수액 천연 고무 라텍스 액 (암모니아 보존 안정화, 고형분 함량 60% 이상)",
        "function": "고무장갑 및 발포 고무 스펀지 제조용 원료",
        "expected_chapter": "40",
        "expected_heading": "4001"
    },
    {
        "id": 17,
        "name": "승용차용 신품 고무제 공기타이어 (New Radial Pneumatic Tyres for Passenger Cars)",
        "material": "가황 합성/천연고무 복합체 및 스틸 코드 벨트 (미사용 신품 레이디얼 타이어)",
        "function": "승용 자동차 주행 휠 장착용 공기타이어",
        "expected_chapter": "40",
        "expected_heading": "4011"
    },

    # 3. 피혁·목재·지류·직물·의류 (Ch 41 - 64) [10 items]
    {
        "id": 18,
        "name": "천연 소가죽제 신사화 구두 (Men's Leather Dress Shoes)",
        "material": "갑피(Upper): 천연 소가죽 은면가죽 100%, 바닥창(Sole): 고무창 (신사용 정장 구두)",
        "function": "신사용 정장 보행용 외출 신발",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 19,
        "name": "천연 소가죽제 라이더 자켓 (Men's Genuine Leather Jacket)",
        "material": "겉감: 천연 소가죽 100%, 안감: 폴리에스터 100% (지퍼 및 스냅버튼 장착)",
        "function": "남성용 방풍 및 방한용 가죽 외투 의류",
        "expected_chapter": "42",
        "expected_heading": "4203"
    },
    {
        "id": 20,
        "name": "소나무 침엽수 제재목 (Coniferous Sawn Pine Wood)",
        "material": "소나무 원목을 세로 방향으로 절단 켠 제재목 (두께 50mm, 폭 150mm, 길이 3600mm, 방부처리 없음)",
        "function": "건축물 목조 골조 및 인테리어 구조용 목재",
        "expected_chapter": "44",
        "expected_heading": "4407"
    },
    {
        "id": 21,
        "name": "표백 활엽수 크라프트 화학목재펄프 (Bleached Hardwood Kraft Pulp)",
        "material": "활엽수 섬유를 황산염/가성소다로 증해 표백한 화학펄프 (용해용 아님, 건조 시트상)",
        "function": "인쇄용지 및 화장지 제조용 제지 원료",
        "expected_chapter": "47",
        "expected_heading": "4703"
    },
    {
        "id": 22,
        "name": "골판지제 물류 포장용 상자 (Corrugated Paper Shipping Boxes)",
        "material": "골판지(표면 라이너 및 골심지 결합 3층 골판지) 100% (인쇄 및 슬롯 가공 접이식)",
        "function": "수출입 화물 물류 및 완제품 수송용 포장 상자",
        "expected_chapter": "48",
        "expected_heading": "4819"
    },
    {
        "id": 23,
        "name": "방적용 코마 공정 면사 (Combed Cotton Yarn)",
        "material": "코마(Combed) 공정을 거친 단사 면 100% (면 함유량 85% 이상, 소매용 아님)",
        "function": "고급 직물 및 편물 제직용 방적 실",
        "expected_chapter": "52",
        "expected_heading": "5205"
    },
    {
        "id": 24,
        "name": "폴리에스터 필라멘트 직물 원단 (Woven Polyester Filament Fabric)",
        "material": "폴리에스터 100% 합성 필라멘트사로 짠 평직 직물 (염색 가공, 폭 150cm 롤 형태 원단)",
        "function": "의류 및 가구 커버링 제조용 직물 원단",
        "expected_chapter": "54",
        "expected_heading": "5407"
    },
    {
        "id": 25,
        "name": "남성용 면 편물 반팔 티셔츠 (Men's Knitted Cotton T-Shirt)",
        "material": "면 100% 싱글 저지 메리야스 편물(Knitted fabric)",
        "function": "남성용 일상 착용 캐주얼 상의 의류",
        "expected_chapter": "61",
        "expected_heading": "6109"
    },
    {
        "id": 26,
        "name": "여성용 견직물 긴소매 블라우스 (Women's Woven Silk Blouse)",
        "material": "실크(견) 100% 평직 직물(Woven fabric, 편물 아님, 앞단추 여밈 방식)",
        "function": "여성용 정장 긴소매 상의 의류",
        "expected_chapter": "62",
        "expected_heading": "6206"
    },
    {
        "id": 27,
        "name": "나일론 직물제 여행용 백팩 (Woven Nylon Travel Backpack)",
        "material": "외부 표면: 600D 방수 코팅 나일론 직물 100%, 지퍼, 어깨 스트랩 장착",
        "function": "개인 휴대품 보관 및 등산/여행용 운반 배낭",
        "expected_chapter": "42",
        "expected_heading": "4202"
    },

    # 4. 유리·비금속·금속 (Ch 70 - 81) [6 items]
    {
        "id": 28,
        "name": "건축용 판유리 강화 안전유리 (Toughened Safety Glass Sheet)",
        "material": "열처리 강화 가공 평판유리 (두께 8mm, 규격 1200x2400mm, 모서리 면취 가공)",
        "function": "건물 외벽 커튼월 및 실내 파티션용 안전유리",
        "expected_chapter": "70",
        "expected_heading": "7007"
    },
    {
        "id": 29,
        "name": "열간압연 비합금강 H형강 (Hot-rolled Non-alloy Steel H-Beam)",
        "material": "비합금강 열간압연 형강 (H형 단면, 플랜지 폭 200mm, 높이 200mm, 웨브 두께 8mm)",
        "function": "건축물 및 토목 교량 골조용 구조 강재",
        "expected_chapter": "72",
        "expected_heading": "7216"
    },
    {
        "id": 30,
        "name": "스테인리스강 무계목 원형 강관 (Seamless Stainless Steel Pipe)",
        "material": "오스테나이트계 STS304 스테인리스강 원형 무계목 관 (외경 50mm, 두께 3mm)",
        "function": "석유화학 플랜트 및 고압 유체 이송용 배관",
        "expected_chapter": "73",
        "expected_heading": "7304"
    },
    {
        "id": 31,
        "name": "정제 순동 무계목 공조용 파이프 (Refined Copper Seamless Tubes)",
        "material": "전기동 순도 99.9% 이상 순동 원형 무계목 관 (외경 15.88mm, 두께 1.0mm, 코일형)",
        "function": "냉난방 에어컨 및 냉동기 냉매 순환 배관",
        "expected_chapter": "74",
        "expected_heading": "7411"
    },
    {
        "id": 32,
        "name": "종이 뒷면을 보강한 알루미늄박 (Aluminium Foil backed with paper)",
        "material": "알루미늄박(두께 0.009mm)에 크라프트지를 접착제로 합지한 복합박 (롤 형태)",
        "function": "담배 및 식품 방습 차단 포장재",
        "expected_chapter": "76",
        "expected_heading": "7607"
    },
    {
        "id": 33,
        "name": "티타늄 합금 원형 봉 (Titanium Alloy Bars and Rods)",
        "material": "Ti-6Al-4V 티타늄 합금 압출 및 단조 원형 봉재 (직경 50mm, 길이 2000mm)",
        "function": "항공우주 부품 및 인체 삽입용 정형외과 임플란트 절삭 가공 소재",
        "expected_chapter": "81",
        "expected_heading": "8108"
    },

    # 5. 기계 및 전자 장비 (Ch 84 - 85) [9 items]
    {
        "id": 34,
        "name": "중장비용 유압식 피스톤 펌프 (Hydraulic Axial Piston Pump)",
        "material": "합금강 하우징, 로터 및 피스톤 어셈블리 (오일 압력 구동 용적식 피스톤 펌프)",
        "function": "굴착기 등 건설중장비 액추에이터 구동용 고압 유압 공급",
        "expected_chapter": "84",
        "expected_heading": "8413"
    },
    {
        "id": 35,
        "name": "가정용 분리형 인버터 에어컨 (Split Inverter Room Air Conditioner)",
        "material": "모터 구동 압축기, 열교환기(증발기/응축기), 송풍팬 일체형 실내외기 세트 (냉방능력 3.5kW)",
        "function": "가정 실내 공간 냉난방 및 습도 조절",
        "expected_chapter": "84",
        "expected_heading": "8415"
    },
    {
        "id": 36,
        "name": "산업용 로터리 스크루 공기압축기 (Industrial Rotary Screw Air Compressor)",
        "material": "전동 모터, 트윈 스크루 압축 모듈, 오일 세퍼레이터 및 냉각팬 내장 패키지형",
        "function": "공장 자동화 라인용 압축 공기 지속 생산",
        "expected_chapter": "84",
        "expected_heading": "8414"
    },
    {
        "id": 37,
        "name": "CNC 파이버 레이저 절단 가공기 (CNC Fiber Laser Cutting Machine)",
        "material": "4kW 파이버 레이저 발진기, CNC 서보 갠트리 프레임, 오토포커스 절단 헤드",
        "function": "강판 및 알루미늄 판재 2차원 고정밀 레이저 절단 가공",
        "expected_chapter": "84",
        "expected_heading": "8456"
    },
    {
        "id": 38,
        "name": "플라스틱 수지 사출 성형기 (Hydraulic Plastic Injection Molding Machine)",
        "material": "가열 실린더 배럴, 유압식 형체 유닛, 스크루 사출 장치 및 제어반 일체형",
        "function": "열가소성 플라스틱 원료를 가열 용융하여 금형에 고압 주입 성형",
        "expected_chapter": "84",
        "expected_heading": "8477"
    },
    {
        "id": 39,
        "name": "고압 배전용 몰드 변압기 (High Voltage Dry-type Transformer 500kVA)",
        "material": "규소강판 철심, 에폭시 수지로 몰딩 절연된 동 권선 (정격용량 500kVA, 교류 강압용)",
        "function": "22.9kV 특고압 전력을 380V 산업용 저전압으로 변환 공급",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 40,
        "name": "전기차용 리튬이온 이차전지 셀 (Lithium-ion Battery Cell for EV)",
        "material": "삼원계(NCM) 양극, 흑연 음극, 비수전해액, 알루미늄 각형 캔 밀폐 구조 (3.7V, 100Ah)",
        "function": "전기자동차 배터리 팩 모듈 조립용 충방전 에너지 저장 셀",
        "expected_chapter": "85",
        "expected_heading": "8507"
    },
    {
        "id": 41,
        "name": "DRAM 반도체 집적회로 칩 (DRAM Semiconductor Integrated Circuit)",
        "material": "단결정 실리콘 웨이퍼 회로 형성, BGA 기판 및 에폭시 몰딩 패키지 (DDR5 16Gb 메모리)",
        "function": "컴퓨터 및 스마트폰 주기억장치용 휘발성 데이터 저장",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 42,
        "name": "통신용 광섬유 케이블 (Optical Fibre Cables)",
        "material": "유리 광섬유 코어, 아라미드 보강 섬유, LSZH 난연 플라스틱 외피 (개별 피복 광섬유 다심)",
        "function": "기간 통신망 및 데이터센터 초고속 광신호 유선 전송",
        "expected_chapter": "85",
        "expected_heading": "8544"
    },

    # 6. 수송·광학·계측·악기·가구·완구 (Ch 87 - 95) [8 items]
    {
        "id": 43,
        "name": "순수 배터리 전기 승용차 (Battery Electric Passenger Vehicle)",
        "material": "전기 모터 2기(AWD), 80kWh 리튬 배터리팩, 강판 차체 (운전자 포함 5인승 승용 세단)",
        "function": "도로 상 여객 수송용 순수 전기 모터 구동 승용차",
        "expected_chapter": "87",
        "expected_heading": "8703"
    },
    {
        "id": 44,
        "name": "촬영용 쿼드콥터 무인항공기 드론 (Commercial Quadcopter Drone with Camera)",
        "material": "탄소섬유 프레임, 4축 브러시리스 모터, 4K 카메라 짐벌, 비행 제어기 (자체 중량 1.5kg)",
        "function": "공중 영상 촬영 및 항공 측량용 원격 무인비행체",
        "expected_chapter": "88",
        "expected_heading": "8806"
    },
    {
        "id": 45,
        "name": "편광 렌즈 자외선 차단 선글라스 (Polarized UV-cut Sunglasses)",
        "material": "TAC 편광 수지 렌즈, 티타늄 합금 프레임(안경테)",
        "function": "자외선 차단 및 눈부심 방지용 보안경",
        "expected_chapter": "90",
        "expected_heading": "9004"
    },
    {
        "id": 46,
        "name": "디스플레이 색차계 및 분광측색계 (Spectrophotometer Optical Analyzer)",
        "material": "회절격자 분광 센서, 광학 렌즈계, 데이터 연산 마이크로프로세서 (광학식 분광 분석기)",
        "function": "디스플레이 패널 및 광원의 파장별 분광 반사율, 투과율 및 색도 정밀 분석",
        "expected_chapter": "90",
        "expected_heading": "9027"
    },
    {
        "id": 47,
        "name": "스마트 터치 손목시계 (Smart Wristwatch with Touch Display)",
        "material": "AMOLED 디스플레이 터치스크린, 광학 심박센서, BLE 무선모듈, 알루미늄 케이스 (충전식 배터리 내장)",
        "function": "손목 착용 시계 표시 및 스마트폰 데이터 송수신, 건강 모니터링",
        "expected_chapter": ["85", "91"],
        "expected_heading": ["8517", "9102"]
    },
    {
        "id": 48,
        "name": "어쿠스틱 통기타 (Acoustic Folk Wooden Guitar)",
        "material": "전판: 스프루스 원목, 측후판: 마호가니 목재, 스틸 기타현 6줄 (전자 픽업 없음)",
        "function": "현을 손가락으로 퉁겨 음향을 내는 통기타 발현 악기",
        "expected_chapter": "92",
        "expected_heading": "9202"
    },
    {
        "id": 49,
        "name": "목제 사무용 업무 책상 (Wooden Office Work Desk)",
        "material": "천연 오크 무늬목 및 파티클보드, 서랍장 일체형 (가로 160cm x 세로 80cm)",
        "function": "사무실 업무 및 작업용 목제 실내 가구",
        "expected_chapter": "94",
        "expected_heading": "9403"
    },
    {
        "id": 50,
        "name": "조립식 플라스틱 블록 완구 세트 (Interlocking Plastic Toy Bricks Set)",
        "material": "ABS 플라스틱 사출 성형 조립식 블록 500피스 및 미니 피규어 완구 세트",
        "function": "어린이 조립 놀이 및 지능 발달용 완구",
        "expected_chapter": "95",
        "expected_heading": "9503"
    }
]

def run_set10_benchmark():
    print("=" * 80)
    print("🚀 [STARTING CUSWAY 2026 SET 10 ITERATIVE 50 BENCHMARK]")
    print(f"Total Test Items: {len(SET10_50_ITEMS)}")
    print("Constitutional Standard: 100% Zero Hardcoding, WCO GRI 1~6 Legal Reasoning")
    print("=" * 80)

    db = SessionLocal()
    passed_count = 0
    failed_items = []
    start_time = time.time()

    for idx, item in enumerate(SET10_50_ITEMS, 1):
        print(f"\n[{idx:02d}/50] Evaluating: '{item['name']}'...", flush=True)
        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=item["name"],
                material=item["material"],
                function_use=item["function"],
                db=db
            )
            raw_code = res.get("recommendedHsCode", "")
            rec_code = raw_code.replace(".", "").replace("-", "").strip()
            heading_4 = rec_code[:4]
            chapter_2 = rec_code[:2]

            exp_heads = item.get("expected_heading")
            exp_chaps = item.get("expected_chapter")

            if isinstance(exp_heads, str):
                expected_heads = [exp_heads]
            elif isinstance(exp_heads, list):
                expected_heads = exp_heads
            else:
                expected_heads = []

            if isinstance(exp_chaps, str):
                expected_chaps = [exp_chaps]
            elif isinstance(exp_chaps, list):
                expected_chaps = exp_chaps
            else:
                expected_chaps = [h[:2] for h in expected_heads]

            is_pass = (heading_4 in expected_heads) or (chapter_2 in expected_chaps and any(rec_code.startswith(h) for h in expected_heads))

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
    acc = (passed_count / len(SET10_50_ITEMS)) * 100.0
    err_rate = 100.0 - acc

    print("\n" + "=" * 80, flush=True)
    print(f"📊 [SET 10 BENCHMARK SUMMARY]", flush=True)
    print(f"Total Evaluated: {len(SET10_50_ITEMS)}", flush=True)
    print(f"Passed: {passed_count} / {len(SET10_50_ITEMS)}", flush=True)
    print(f"Failed: {len(failed_items)} / {len(SET10_50_ITEMS)}", flush=True)
    print(f"Accuracy Rate: {acc:.2f}% | Error Rate: {err_rate:.2f}%", flush=True)
    print(f"Elapsed Time: {elapsed:.2f}s", flush=True)
    print("=" * 80, flush=True)

    if failed_items:
        print("\n🔍 [FAILED ITEMS DETAILS]", flush=True)
        for f in failed_items:
            print(f"- ID {f.get('id')}: {f.get('name')}", flush=True)
            print(f"  Predicted: {f.get('predicted_heading')} (Full: {f.get('predicted')})", flush=True)
            print(f"  Expected : {f.get('expected_headings')}", flush=True)
            if 'reasoning' in f:
                print(f"  Snippet  : {f.get('reasoning')}", flush=True)
            if 'error' in f:
                print(f"  Error    : {f.get('error')}", flush=True)
            print("-" * 80, flush=True)

    # Save output to JSON artifact
    result_json_path = os.path.join(workspace_root, "benchmark_set10_results.json")
    with open(result_json_path, "w", encoding="utf-8") as f_out:
        json.dump({
            "total": len(SET10_50_ITEMS),
            "passed": passed_count,
            "failed": len(failed_items),
            "accuracy": acc,
            "error_rate": err_rate,
            "failed_details": failed_items,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }, f_out, ensure_ascii=False, indent=2)
    print(f"Saved results to: {result_json_path}")

    return passed_count, len(SET10_50_ITEMS), failed_items

if __name__ == "__main__":
    run_set10_benchmark()
