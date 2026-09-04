# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 8 Iterative 50 New Diverse Representative Products Benchmark
Runs automated classification and validates accuracy against WCO / Korea Customs Service tariff standards.
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

# 50 Completely New Curated Diverse Customs Items (Set 8)
SET8_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "냉동 닭 가슴살 절단육 (Frozen Chicken Breast Fillet)",
        "material": "가금육 닭 가슴살 100% (뼈 제거 후 급속 냉동, 무염, 비소매 벌크 포장)",
        "function": "식용 가금육 조리용 냉동 식재료",
        "expected_chapter": "02",
        "expected_heading": "0207"
    },
    {
        "id": 2,
        "name": "양식 신선 무지개송어 (Fresh Rainbow Trout)",
        "material": "천연 담수 무지개송어 100% (내장 제거 후 얼음 냉장 보관)",
        "function": "식용 신선 냉장 어류",
        "expected_chapter": "03",
        "expected_heading": "0302"
    },
    {
        "id": 3,
        "name": "멸균 저온살균 원유 (Pasteurized Milk)",
        "material": "생유 100% (지방분 3.5%, 무가당 멸균 살균 처리, 액상)",
        "function": "직접 음용 및 식품 가공용 액상 우유",
        "expected_chapter": "04",
        "expected_heading": "0401"
    },
    {
        "id": 4,
        "name": "공업용 천연 가공 생 돼지 털 (Pig Bristles)",
        "material": "돼지 강모 100% (세척, 열소독, 건조 정렬 처리)",
        "function": "페인트 붓 및 공업용 브러시 제조용 원모",
        "expected_chapter": "05",
        "expected_heading": "0502"
    },
    {
        "id": 5,
        "name": "신선 파프리카 (Fresh Bell Pepper)",
        "material": "단고추 100% (신선 상태 온실 재배 채소)",
        "function": "식용 신선 채소",
        "expected_chapter": "07",
        "expected_heading": "0709"
    },
    {
        "id": 6,
        "name": "천연 건조 크랜베리 (Dried Cranberries)",
        "material": "크랜베리 85%, 설탕 14%, 해바라기유 1% (건조 조제품)",
        "function": "스낵용 및 제과 제빵용 건조 과실 조제품",
        "expected_chapter": "20",
        "expected_heading": ["2008", "0813"]
    },
    {
        "id": 7,
        "name": "통 정향 향신료 (Whole Cloves)",
        "material": "정향나무 꽃봉오리 건조물 100% (비분쇄 원형)",
        "function": "음식 조리 및 육가공용 천연 건조 향신료",
        "expected_chapter": "09",
        "expected_heading": "0907"
    },
    {
        "id": 8,
        "name": "제분용 연질 적색 밀 (Soft Red Winter Wheat)",
        "material": "밀 100% (제분용 비종자 곡물 낟알)",
        "function": "밀가루 제분용 식용 곡물",
        "expected_chapter": "10",
        "expected_heading": "1001"
    },
    {
        "id": 9,
        "name": "식용 옥수수 전분 (Corn Starch)",
        "material": "옥수수 배유 추출 분말 전분 100% (무변성 순수 전분)",
        "function": "식품 조리 증점제 및 제과용 전분 원료",
        "expected_chapter": "11",
        "expected_heading": "1108"
    },
    {
        "id": 10,
        "name": "탈각 식용 해바라기씨 (Shelled Sunflower Seeds)",
        "material": "해바라기씨 100% (껍질 제거 생 종자, 볶지 않은 것)",
        "function": "식용 견과류 및 제빵 토핑용 채종유 종자",
        "expected_chapter": "12",
        "expected_heading": "1206"
    },
    {
        "id": 11,
        "name": "공업용 정제 피마자유 (Refined Castor Oil)",
        "material": "피마자유 100% (화학적 변성이 없는 정제 식물성 고정유)",
        "function": "공업용 윤활유 및 화장품 원료용 식물성 유지",
        "expected_chapter": "15",
        "expected_heading": "1515"
    },
    {
        "id": 12,
        "name": "게살 풍미 냉동 연육 어묵 맛살 (Surimi Sticks)",
        "material": "어육 연육 60%, 전분 15%, 난백, 게향 착향료 (성형 냉동 조제품)",
        "function": "즉석 섭취 및 요리용 어육 가공 조제품",
        "expected_chapter": "16",
        "expected_heading": "1604"
    },
    {
        "id": 13,
        "name": "천연 벌꿀 함유 하드 캔디 (Honey Hard Candy)",
        "material": "설탕 60%, 물엿 30%, 천연 벌꿀 10% (사탕 수지)",
        "function": "직접 섭취용 설탕과자 당류 조제품",
        "expected_chapter": "17",
        "expected_heading": "1704"
    },
    {
        "id": 14,
        "name": "베이킹용 순수 무가당 코코아 분말 (Pure Cocoa Powder)",
        "material": "코코아 케이크 분쇄 분말 100% (설탕 및 감미료 무첨가, 탈지 12%)",
        "function": "제과 제빵 및 음료 베이스용 순수 코코아 가루",
        "expected_chapter": "18",
        "expected_heading": "1805"
    },
    {
        "id": 15,
        "name": "기름에 튀기지 않은 건면 라면 (Non-Fried Dry Ramen Noodles)",
        "material": "소맥분 90%, 전분, 식염 (증숙 후 열풍 건조한 파스타형 라면)",
        "function": "조리용 인스턴트 건면 파스타 조제품",
        "expected_chapter": "19",
        "expected_heading": "1902"
    },
    {
        "id": 16,
        "name": "식초 침지 오이 피클 (Cucumber Pickles in Vinegar)",
        "material": "오이 65%, 양조식초 25%, 정제수, 식염, 향신료 (초산 침지 밀폐병 포장)",
        "function": "식초에 담가 저장 처리한 채소 조제품",
        "expected_chapter": "20",
        "expected_heading": "2001"
    },
    {
        "id": 17,
        "name": "소고기 맛 분말 복합 조미료 (Seasoning Powder)",
        "material": "식염 40%, L-글루탐산나트륨 25%, 소고기 엑기스 분말 15%, 포도당",
        "function": "국물 및 찌개 조리용 혼합 조미료",
        "expected_chapter": "21",
        "expected_heading": "2103"
    },
    {
        "id": 18,
        "name": "스파클링 천연 탄산 광천수 (Sparkling Mineral Water)",
        "material": "천연 암반수 99.9%, 탄산가스 0.1% (무가당, 무착향 병입 음용수)",
        "function": "직접 음용용 천연 광천 탄산수",
        "expected_chapter": "22",
        "expected_heading": "2201"
    },
    {
        "id": 19,
        "name": "가축 사료용 비트펄프 펠릿 (Beet Pulp Pellets)",
        "material": "사탕무 당분 추출 후 남은 부산물 섬유질 100% (건조 펠릿화)",
        "function": "반추가축용 섬유질 농축 사료 원료",
        "expected_chapter": "23",
        "expected_heading": "2303"
    },
    {
        "id": 20,
        "name": "필터 장착 일반 연초 궐련 담배 (Cigarettes)",
        "material": "가공 연초 잎 담배 70%, 아세테이트 필터 20%, 궐련지 10%",
        "function": "연소 흡연용 일반 필터 담배 완제품",
        "expected_chapter": "24",
        "expected_heading": "2402"
    },

    # 2. 광물 및 화학제품군 (Ch 25 - 38)
    {
        "id": 21,
        "name": "고순도 주물용 천연 규사 분말 (Silica Sand)",
        "material": "이산화규소(SiO2) 99.5% (천연 규석 채굴 분쇄 모래)",
        "function": "유리 제조 및 주조용 몰드 제작용 천연 규사",
        "expected_chapter": "25",
        "expected_heading": "2505"
    },
    {
        "id": 22,
        "name": "반도체 에칭용 육불화황(SF6) 고순도 특수가스",
        "material": "육불화황(Sulfur Hexafluoride) 99.999% (압축 액화 가스)",
        "function": "반도체 챔버 식각 및 절연 가스용 무기 불화물",
        "expected_chapter": "28",
        "expected_heading": "2812"
    },
    {
        "id": 23,
        "name": "수술용 라텍스 멸균 검진 장갑 (Surgical Latex Gloves)",
        "material": "천연 가황 고무 라텍스 98%, 표면 윤활 파우더 2%",
        "function": "의료 수술 및 임상 진료용 멸균 고무 장갑 완제품",
        "expected_chapter": "40",
        "expected_heading": "4015"
    },
    {
        "id": 24,
        "name": "소피 스웨이드 갑피 여성용 앵클부츠",
        "material": "갑피: 천연 소가죽 스웨이드 100%, 창: 합성고무창 (발목 덮는 부츠)",
        "function": "여성용 일상 착용 가죽 신발 완제품",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 25,
        "name": "100% 견직물 실크 날염 스카프 (Silk Scarf)",
        "material": "천연 견사(Silk) 100% 직물 (날염 인쇄, 가장자리 손바느질 마감)",
        "function": "여성 패션 코디용 견직물 스카프 완제품",
        "expected_chapter": "62",
        "expected_heading": "6214"
    },
    {
        "id": 26,
        "name": "산업용 비수성 에폭시 수지 도료 (Epoxy Paint)",
        "material": "에폭시 수지 45%, 유기용제(자일렌 등) 35%, 방청안료 20%",
        "function": "철골 구조물 및 플랜트 방청 도장용 페인트",
        "expected_chapter": "32",
        "expected_heading": "3208"
    },
    {
        "id": 27,
        "name": "세탁용 액상 섬유 유연제 (Fabric Softener)",
        "material": "양이온 계면활성제(Esterquat) 10%, 향료 2%, 정제수 88%",
        "function": "의류 세탁 후 정전기 방지 및 유연 처리제 조제품",
        "expected_chapter": "34",
        "expected_heading": "3402"
    },
    {
        "id": 28,
        "name": "생수병 블로우 성형용 폴리에틸렌 테레프탈레이트(PET) 펠릿",
        "material": "PET 수지 100% (고유점도 0.80dl/g 일차제품 펠릿)",
        "function": "음료용 페트병 사출 및 블로우 성형용 플라스틱 원료",
        "expected_chapter": "39",
        "expected_heading": "3907"
    },
    {
        "id": 29,
        "name": "리튬이온 배터리 분리막용 미세 다공성 폴리에틸렌(PE) 필름",
        "material": "초고분자량 폴리에틸렌(UHMWPE) 100% (두께 9㎛ 다공성 비점착 필름)",
        "function": "이차전지 양극/음극 절연 분리막 필름",
        "expected_chapter": "39",
        "expected_heading": "3920"
    },
    {
        "id": 30,
        "name": "고주파 연성회로기판용 2층 폴리이미드 무접착 동박적층판 (2L-FCCL)",
        "material": "동박(두께 12㎛) 60%, 폴리이미드 필름 40% (압연 적층판)",
        "function": "스마트폰 FPCB 회로 형성용 동박 적층 원판",
        "expected_chapter": "74",
        "expected_heading": "7410"
    },

    # 3. 철강 및 금속/유리 제품군 (Ch 68 - 83)
    {
        "id": 31,
        "name": "건축 외장용 알루미늄 복합 패널 (Aluminium Composite Panel)",
        "material": "알루미늄 판 2매(두께 0.5mm) 사이에 무기질 난연 코어 3mm 샌드위치 접합",
        "function": "건물 외벽 마감 및 커튼월 시공용 건축 패널",
        "expected_chapter": "76",
        "expected_heading": ["7606", "7610"]
    },
    {
        "id": 32,
        "name": "폴더블 스마트폰용 초박형 강화 유리 커버 윈도우 (UTG)",
        "material": "두께 30㎛ 초박형 알루미노실리케이트 화학강화 유리 100%",
        "function": "폴더블 디스플레이 표면 보호용 화학강화 유리판",
        "expected_chapter": "70",
        "expected_heading": "7007"
    },
    {
        "id": 33,
        "name": "스테인리스강 제조용 고탄소 페로크롬 합금철 (Ferro-chromium)",
        "material": "크롬 65%, 탄소 6~8%, 잔부 철(Fe) (괴상 덩어리 합금)",
        "function": "제강 공정에서 스테인리스강 부식 방지 성분 첨가용 합금철",
        "expected_chapter": "72",
        "expected_heading": "7202"
    },
    {
        "id": 34,
        "name": "건설 중장비 유압 구동용 액시얼 피스톤 펌프 (Axial Piston Pump)",
        "material": "주철 바디, 합금강 피스톤 및 실린더 블록 (가변용량형 유압 펌프)",
        "function": "굴착기 붐 및 주행 모터에 고압 유압유를 공급하는 펌프",
        "expected_chapter": "84",
        "expected_heading": "8413"
    },
    {
        "id": 35,
        "name": "금형 가공용 5축 고정밀 수직형 머시닝 센터 (CNC Machining Center)",
        "material": "주물 베드, 24,000RPM 빌트인 스핀들, 30개 공구 매거진 결합 공작기계",
        "function": "금속 부품의 밀링, 드릴링, 보링 자동 공구교환 일관 가공",
        "expected_chapter": "84",
        "expected_heading": "8457"
    },

    # 4. 첨단 기계 및 반도체/전자제품군 (Ch 84 - 85)
    {
        "id": 36,
        "name": "반도체 포토마스크 제조용 고해상도 레이저 직접 묘화 노광 장비",
        "material": "자외선 레이저 광원, 정밀 간섭계 스테이지, 진공 광학계 결합 장비",
        "function": "반도체 회로 원판 포토마스크 패턴 형성용 노광 기기",
        "expected_chapter": "84",
        "expected_heading": "8486"
    },
    {
        "id": 37,
        "name": "전기차 구동용 150kW 고전압 영구자석 동기모터 (PMSM Drive Motor)",
        "material": "규소강판 스테이터 코어, 네오디뮴 영구자석 로터, 구리 코일 권선 결합",
        "function": "순수 전기차(EV) 바퀴 구동용 3상 교류 전동기",
        "expected_chapter": "85",
        "expected_heading": "8501"
    },
    {
        "id": 38,
        "name": "송배전 전력망용 154kV 유입식 3상 초고압 전력용 변압기",
        "material": "방향성 규소강판 코어, 절연유 침지 탱크, 부싱, 냉각기 결합 변압기",
        "function": "발전소 생산 전력을 송전 전압으로 승압/강압하는 대용량 변압기",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 39,
        "name": "자율주행 차량용 5G 텔레매틱스 무선통신 제어 모듈 (TCU)",
        "material": "5G 모뎀 칩셋, GNSS GPS 수신기, 안테나, eCall 비상통신 프로세서 기판",
        "function": "차량과 외부 관제서버 간 V2X 데이터 송수신 통신장치",
        "expected_chapter": "85",
        "expected_heading": "8517"
    },
    {
        "id": 40,
        "name": "스마트폰용 512GB UFS 4.0 3D 낸드 플래시 메모리 반도체 칩",
        "material": "적층형 3D V-NAND 플래시 메모리 다이 및 컨트롤러 집적 BGA 패키지",
        "function": "모바일 전자기기 데이터 영구 저장용 전자집적회로 메모리",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 41,
        "name": "산업용 로봇 관절 모터 정밀 구동용 서보 드라이브 인버터",
        "material": "IGBT 전력 반도체 모듈, DSP 제어 기판, 방열판 일체형 전력변환기",
        "function": "서보모터의 위치, 속도, 토크를 정밀 제어하는 전력변환 인버터",
        "expected_chapter": "85",
        "expected_heading": ["8504", "8537"]
    },
    {
        "id": 42,
        "name": "롤투롤 광폭 필름 그라비아 인쇄기 (Gravure Printing Machine)",
        "material": "언와인더, 8도 그라비아 인쇄 유닛, 열풍 건조 터널, 리와인더 결합 라인",
        "function": "포장용 플라스틱 필름 표면에 다색 연속 롤 인쇄를 수행하는 기계",
        "expected_chapter": "84",
        "expected_heading": "8443"
    },
    {
        "id": 43,
        "name": "우주 발사체 로켓 엔진용 재생냉각 연소실 어셈블리",
        "material": "구리 합금 내벽(인코넬 브레이징 접합), 냉각 채널, 인젝터 헤드 결합체",
        "function": "액체 로켓 추진기관에서 산화제와 연료를 연소시키는 반력추진엔진 부분품",
        "expected_chapter": "84",
        "expected_heading": "8412"
    },

    # 5. 수송, 의료, 정밀광학, 악기/가구/레저 (Ch 87 - 97)
    {
        "id": 44,
        "name": "해상 화물 운송용 24,000 TEU 초대형 컨테이너 운반선",
        "material": "고장력 강판 선체(길이 400m), 디젤 주기관, 화물창 셀가이드 결합 선박",
        "function": "국제 해상 컨테이너 화물 운송용 상선",
        "expected_chapter": "89",
        "expected_heading": "8901"
    },
    {
        "id": 45,
        "name": "병원 수술실용 전동 유압식 다기능 수술대 (Operating Table)",
        "material": "스테인리스 베이스, 전동 유압 틸팅 기구, X-ray 투과성 매트리스 상판",
        "function": "외과 수술 시 환자의 체위를 전동으로 조절하는 의료용 수술대",
        "expected_chapter": "94",
        "expected_heading": "9402"
    },
    {
        "id": 46,
        "name": "치과 보철용 맞춤형 지르코니아 올세라믹 인공치아 크라운",
        "material": "이산화지르코늄(ZrO2) 95%, 산화이트륨 5% (환자 치아 형상 밀링 소결체)",
        "function": "손상된 치아를 대체하여 구강 내 영구 장착하는 치과용 인공치아 보철물",
        "expected_chapter": "90",
        "expected_heading": "9021"
    },
    {
        "id": 47,
        "name": "자율주행차 주변 환경 감지용 3차원 고체형 라이다(Solid-State LiDAR) 센서",
        "material": "905nm 레이저 다이오드 어레이, SPAD 광수신기, ToF 연산 프로세서 모듈",
        "function": "레이저 펄스를 방출하여 3D 정밀 거리 및 공간 형상을 측정하는 광학기기",
        "expected_chapter": "90",
        "expected_heading": ["9031", "9015"]
    },
    {
        "id": 48,
        "name": "무대 및 콘서트장 연출용 DMX 제어 고출력 LED 무빙헤드 조명기구",
        "material": "1000W 백색 LED 엔진, 회전 모터 요크, 컬러 휠, 프리즘 렌즈 결합 등기구",
        "function": "공연장 및 방송국에서 회전하며 빛과 패턴을 투사하는 무대 조명기구",
        "expected_chapter": "94",
        "expected_heading": "9405"
    },
    {
        "id": 49,
        "name": "골프용 고탄성 탄소섬유 복합재료 골프채 샤프트 (Carbon Graphite Shaft)",
        "material": "카본 파이버 프리프레그 90%, 에폭시 수지 10% (관형 테이퍼 성형품)",
        "function": "골프 클럽 헤드와 그립을 연결하는 골프용품 부분품",
        "expected_chapter": "95",
        "expected_heading": "9506"
    },
    {
        "id": 50,
        "name": "스위스산 기계식 수동 와인딩 크로노그래프 고급 손목시계",
        "material": "케이스: 18K 로즈골드, 무브먼트: 33석 기계식 칼럼휠 크로노그래프, 가죽밴드",
        "function": "시간 표시 및 스톱워치 계시 기능을 갖춘 귀금속 케이스 기계식 손목시계",
        "expected_chapter": "91",
        "expected_heading": ["9101", "9102"]
    }
]

def run_set8_benchmark():
    print("=" * 80, flush=True)
    print("🚀 [START] CUSWAY 2026 AI Engine - SET 8 (50 New Items Benchmark)", flush=True)
    print("=" * 80, flush=True)

    db = SessionLocal()

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET8_50_ITEMS, 1):
        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=item["name"],
                material=item["material"],
                function_use=item["function"],
                db=db
            )

            rec_code = res.get("recommendedHsCode", "").replace(".", "").replace("-", "").strip()
            heading_4 = rec_code[:4] if len(rec_code) >= 4 else ""
            chapter_2 = rec_code[:2] if len(rec_code) >= 2 else ""

            exp_heads = item["expected_heading"]
            if isinstance(exp_heads, str):
                expected_heads = [exp_heads]
            else:
                expected_heads = exp_heads

            exp_chaps = item.get("expected_chapter")
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
    acc = (passed_count / len(SET8_50_ITEMS)) * 100.0
    err_rate = 100.0 - acc

    print("\n" + "=" * 80, flush=True)
    print(f"📊 [SET 8 BENCHMARK SUMMARY]", flush=True)
    print(f"Total Evaluated: {len(SET8_50_ITEMS)}", flush=True)
    print(f"Passed: {passed_count} / {len(SET8_50_ITEMS)}", flush=True)
    print(f"Failed: {len(failed_items)} / {len(SET8_50_ITEMS)}", flush=True)
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

    return passed_count, len(SET8_50_ITEMS), failed_items

if __name__ == "__main__":
    run_set8_benchmark()
