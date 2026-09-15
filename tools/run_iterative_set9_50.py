# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 9 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 9)
SET9_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24) [15 items]
    {
        "id": 1,
        "name": "신선 냉장 소 갈비 (Fresh Chilled Beef Short Ribs)",
        "material": "신선 소 갈비육 100% (뼈 포함, 냉장 0~2도 보관, 무양념)",
        "function": "식용 신선 정육 조리용 식재료",
        "expected_chapter": "02",
        "expected_heading": "0201"
    },
    {
        "id": 2,
        "name": "동결건조 껍질 벗긴 흰다리새우 (Freeze-Dried Peeled Shrimp)",
        "material": "수산물 새우살 100% (껍질 제거 후 동결건조 처리, 수분 5% 이하)",
        "function": "식용 가공 새우 식재료 (라면 스프 및 국물 조리용)",
        "expected_chapter": "03",
        "expected_heading": "0306"
    },
    {
        "id": 3,
        "name": "천연 숙성 아카시아 생꿀 (Raw Natural Acacia Honey)",
        "material": "벌꿀 100% (설탕 등 첨가물 없음, 비열처리 천연 여과액)",
        "function": "직접 섭취 및 제과제빵용 천연 감미료",
        "expected_chapter": "04",
        "expected_heading": "0409"
    },
    {
        "id": 4,
        "name": "온실 재배 신선 절화 장미 (Fresh Cut Greenhouse Roses)",
        "material": "생화 장미 100% (꽃과 줄기 상태, 건조/가공되지 않은 신선 꽃)",
        "function": "화훼 장식 및 선물용 생화",
        "expected_chapter": "06",
        "expected_heading": "0603"
    },
    {
        "id": 5,
        "name": "외피를 벗긴 신선 통마늘 (Peeled Fresh Garlic Cloves)",
        "material": "통마늘 100% (외피 탈피, 냉장 보관, 건조나 조리되지 않음)",
        "function": "식용 양념 채소 식재료",
        "expected_chapter": "07",
        "expected_heading": "0703"
    },
    {
        "id": 6,
        "name": "껍질을 벗긴 미국산 탈각 호두 (Shelled Walnuts)",
        "material": "호두 과육 100% (외각 제거 건조 상태, 볶지 않음, 무염)",
        "function": "직접 섭취 및 제과용 견과류",
        "expected_chapter": "08",
        "expected_heading": "0802"
    },
    {
        "id": 7,
        "name": "볶지 않은 콜롬비아산 아라비카 생두 (Raw Green Arabica Coffee Beans)",
        "material": "커피콩 100% (수확 후 수세 건조 생두, 카페인 미제거, 볶지 않음)",
        "function": "커피 로스팅 및 원두 가공용 원료",
        "expected_chapter": "09",
        "expected_heading": "0901"
    },
    {
        "id": 8,
        "name": "단립종 정제 도정 백미 (Milled White Rice, Short Grain)",
        "material": "쌀 100% (도정 완료된 정백미, 낟알 형태, 쇄미율 5% 이하)",
        "function": "주식용 밥 짓기 식재료",
        "expected_chapter": "10",
        "expected_heading": "1006"
    },
    {
        "id": 9,
        "name": "제조용 액상 맥아 추출물 (Malt Extract Liquid)",
        "material": "보리 맥아 추출 고형분 80%, 수분 20% (효소 분해 농축액)",
        "function": "제빵, 음료 제조 및 맥주 양조용 원료",
        "expected_chapter": "19",
        "expected_heading": "1901"
    },
    {
        "id": 10,
        "name": "착유용 건조 황대두 (Dried Yellow Soybeans)",
        "material": "대두(콩) 100% (원형 낟알, 볶지 않음, 파쇄되지 않음)",
        "function": "대두유 착유 및 장류/두부 제조용 원료",
        "expected_chapter": "12",
        "expected_heading": "1201"
    },
    {
        "id": 11,
        "name": "스페인산 엑스트라 버진 올리브유 (Extra Virgin Olive Oil)",
        "material": "올리브유 100% (물리적 압착 착유, 산도 0.8% 이하, 미정제)",
        "function": "식용 샐러드 드레싱 및 요리용 식물성 유지",
        "expected_chapter": "15",
        "expected_heading": "1509"
    },
    {
        "id": 12,
        "name": "식물성 기름에 담근 가다랑어 참치 통조림 (Canned Tuna in Vegetable Oil)",
        "material": "가다랑어 어육 70%, 대두유 20%, 정제수 및 야채즙 10% (밀봉 가열 멸균)",
        "function": "즉석 섭취용 조제 수산물 통조림",
        "expected_chapter": "16",
        "expected_heading": "1604"
    },
    {
        "id": 13,
        "name": "토마토 페이스트 베이스 테이블 토마토 케첩 (Tomato Ketchup)",
        "material": "토마토 페이스트 40%, 식초 20%, 설탕 15%, 정제염 및 향신료",
        "function": "육류 및 튀김 요리용 소스 조미료",
        "expected_chapter": "21",
        "expected_heading": "2103"
    },
    {
        "id": 14,
        "name": "브라질산 냉동 오렌지 농축 과즙 (Frozen Concentrated Orange Juice, FCOJ)",
        "material": "오렌지 과즙 100% (당도 Brix 65 농축, 무가당, 냉동)",
        "function": "환원 오렌지 주스 음료 제조용 원료",
        "expected_chapter": "20",
        "expected_heading": "2009"
    },
    {
        "id": 15,
        "name": "전통 발효 양조간장 (Naturally Brewed Soy Sauce)",
        "material": "탈지대두 40%, 소맥(밀) 30%, 천일염 및 정제수 (미생물 발효액)",
        "function": "음식 조리 및 조미용 액상 장류 소스",
        "expected_chapter": "21",
        "expected_heading": "2103"
    },

    # 2. 화학, 의약, 화장품, 플라스틱 및 고무군 (Ch 28 - 40) [10 items]
    {
        "id": 16,
        "name": "공업용 고순도 탄산나트륨 분말 (Sodium Carbonate Dense 99.5%)",
        "material": "무기화합물 탄산나트륨(Na2CO3) 99.5% (백색 결정성 분말)",
        "function": "유리 제조, 세제 합성 및 화학 공업용 원료",
        "expected_chapter": "28",
        "expected_heading": "2836"
    },
    {
        "id": 17,
        "name": "공업용 무수 에탄올 (Undenatured Ethyl Alcohol 99.9% vol)",
        "material": "변성되지 않은 에틸알코올 99.9% (알코올 도수 80% 이상 고농도)",
        "function": "용제, 화학 시약 및 소독제 제조용 알코올",
        "expected_chapter": "22",
        "expected_heading": "2207"
    },
    {
        "id": 18,
        "name": "의약품 제조용 순수 비타민 C 아스코르브산 (Pure L-Ascorbic Acid API)",
        "material": "단일 화학물질 비타민 C 99.8% (백색 결정 가루, 단일 화합물)",
        "function": "의약품 및 건강식품 정제 제조용 원료 활성성분",
        "expected_chapter": "29",
        "expected_heading": "2936"
    },
    {
        "id": 19,
        "name": "아목시실린 500mg 항생제 경구용 캡슐 (Amoxicillin Capsules, Finished Medicine)",
        "material": "아목시실린 수화물 500mg, 부형제 젤라틴 캡슐 (소매 포장 완성품)",
        "function": "세균성 감염증 치료용 전문의약품",
        "expected_chapter": "30",
        "expected_heading": "3004"
    },
    {
        "id": 20,
        "name": "상업용 오프셋 인쇄기용 유성 안료 흑색 잉크 (Black Offset Printing Ink)",
        "material": "카본블랙 안료 25%, 합성수지 바인더 45%, 식물성유 30%",
        "function": "상업 서적 및 신문 오프셋 인쇄용 잉크",
        "expected_chapter": "32",
        "expected_heading": "3215"
    },
    {
        "id": 21,
        "name": "두발 세정용 액상 샴푸 (Liquid Hair Cleansing Shampoo)",
        "material": "음이온 계면활성제, 정제수, 향료, 컨디셔닝제 (소매용 병 포장)",
        "function": "머리털 및 두피 세정용 두발 제품",
        "expected_chapter": "33",
        "expected_heading": "3305"
    },
    {
        "id": 22,
        "name": "가정용 세탁기용 농축 액체 세제 (Liquid Laundry Detergent)",
        "material": "비이온/음이온 계면활성제 25%, 효소제, 정제수, 형광증백제",
        "function": "의류 및 직물 세탁용 계면활성제 세정 조제품",
        "expected_chapter": "34",
        "expected_heading": "3402"
    },
    {
        "id": 23,
        "name": "사출성형용 폴리프로필렌 호모폴리머 펠릿 (Polypropylene Pellets)",
        "material": "폴리프로필렌(PP) 100% (원통형 알갱이 펠릿, 1차 제품 형태)",
        "function": "자동차 내장재 및 가전 부품 플라스틱 사출 원료",
        "expected_chapter": "39",
        "expected_heading": "3902"
    },
    {
        "id": 24,
        "name": "식품 포장용 2축 연신 폴리프로필렌 투명 필름 (BOPP Film Roll)",
        "material": "폴리프로필렌 수지 (두께 20um, 무인쇄, 비보강 비적층 롤 형태)",
        "function": "과자 및 빵 포장용 플라스틱 포장 필름",
        "expected_chapter": "39",
        "expected_heading": "3920"
    },
    {
        "id": 25,
        "name": "승용차용 레이디얼 구조 천연/합성고무 타이어 (Pneumatic Passenger Car Tire)",
        "material": "가황고무 본체, 강선 벨트, 직물제 플라이 코드 (미사용 신품)",
        "function": "승용차 휠 장착 도로 주행용 공기타이어",
        "expected_chapter": "40",
        "expected_heading": "4011"
    },

    # 3. 가죽, 목재, 지류, 섬유 및 의류군 (Ch 41 - 65) [10 items]
    {
        "id": 26,
        "name": "가구용 표면 가공 소가죽 완제품 (Finished Bovine Upholstery Leather)",
        "material": "소 가죽 100% (크롬 무두질 후 염색 및 표면 도장 가공, 원형 전면)",
        "function": "고급 소파 및 가구 표면 덮개용 가죽",
        "expected_chapter": "41",
        "expected_heading": "4107"
    },
    {
        "id": 27,
        "name": "건축 구조용 미송 침엽수 규격 제재목 (Sawn Douglas Fir Timber)",
        "material": "침엽수 더글라스퍼 목재 (두께 50mm, 폭 150mm, 길이 3.6m 각재, 대패질 마감)",
        "function": "목조 주택 기둥 및 보 골조용 건축 자재",
        "expected_chapter": "44",
        "expected_heading": "4407"
    },
    {
        "id": 28,
        "name": "인쇄 출판용 백상지 롤 (Woodfree Uncoated Printing Paper in Rolls)",
        "material": "화학목재펄프 100% (평량 80g/m2, 무도포, 롤 너비 1,000mm)",
        "function": "단행본 도서 및 노트 인쇄 출판용 용지",
        "expected_chapter": "48",
        "expected_heading": "4802"
    },
    {
        "id": 29,
        "name": "방적용 코마 100% 면사 실 (Combed Single Cotton Yarn)",
        "material": "천연 면 섬유 100% (단사, 번수 40수, 소매용 아님, 콘 권취)",
        "function": "고급 직물 및 메리야스 니트 편직용 방적사",
        "expected_chapter": "52",
        "expected_heading": "5205"
    },
    {
        "id": 30,
        "name": "여성 의류용 100% 실크 견직물 원단 (Woven Mulberry Silk Fabric)",
        "material": "천연 견(실크) 100% (평직 직조, 염색 가공 완료, 폭 110cm)",
        "function": "여성용 실크 드레스 및 블라우스 봉제용 원단",
        "expected_chapter": "50",
        "expected_heading": "5007"
    },
    {
        "id": 31,
        "name": "스포츠웨어용 폴리에스터 신축 니트 원단 (Knitted Polyester Fabric)",
        "material": "폴리에스터 88%, 폴리우레탄 스판덱스 12% (환편 니트 조직, 염색)",
        "function": "레깅스 및 기능성 운동복 제조용 편물 원단",
        "expected_chapter": "60",
        "expected_heading": "6006"
    },
    {
        "id": 32,
        "name": "남성용 면직물 긴소매 드레스 셔츠 (Men's Woven Cotton Dress Shirt)",
        "material": "면 100% 직물 (칼라, 전면 단추 여밈, 손목 커프스 구비, 직조품)",
        "function": "남성 정장용 상의 의류",
        "expected_chapter": "62",
        "expected_heading": "6205"
    },
    {
        "id": 33,
        "name": "여성용 울 니트 풀오버 스웨터 (Women's Knitted Wool Sweater)",
        "material": "메리노 울 100% 편물 (라운드넥, 긴소매, 기계 편직)",
        "function": "여성용 보온 캐주얼 상의 의류",
        "expected_chapter": "61",
        "expected_heading": "6110"
    },
    {
        "id": 34,
        "name": "발목 보호형 방수 가죽 등산화 (Leather Upper Waterproof Hiking Boots)",
        "material": "갑피 천연 소가죽 및 방수 멤브레인, 창 합성고무",
        "function": "산악 등반 및 트레킹용 신발",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 35,
        "name": "자수 로고 장식 직물제 야구모자 (Woven Fabric Baseball Cap)",
        "material": "면 트윌 직물 100%, 플라스틱 바이저 챙 심재, 뒷면 조절 끈",
        "function": "햇빛 차단 및 패션용 머리 장식 모자",
        "expected_chapter": "65",
        "expected_heading": "6505"
    },

    # 4. 석재, 유리, 금속 및 금속제품군 (Ch 68 - 83) [5 items]
    {
        "id": 36,
        "name": "건축 바닥용 연마 가공 천연 화강암 판석 (Polished Natural Granite Slabs)",
        "material": "천연 화강암 100% (표면 다이아몬드 연마 광택, 600x600x20mm 직사각형)",
        "function": "빌딩 로비 및 주택 바닥 벽체 마감용 석재",
        "expected_chapter": "68",
        "expected_heading": "6802"
    },
    {
        "id": 37,
        "name": "자동차 전면 장착용 곡면 접합 안전유리 (Laminated Safety Glass for Vehicles)",
        "material": "플로트 판유리 2장 사이에 PVB 플라스틱 필름 고온 열접합",
        "function": "승용차 전면 윈드실드 충격 보호용 안전유리",
        "expected_chapter": "70",
        "expected_heading": "7007"
    },
    {
        "id": 38,
        "name": "오스테나이트계 냉간압연 스테인리스 스틸 코일 (Cold-Rolled SUS304 Coil)",
        "material": "스테인리스강 SUS304 (두께 1.5mm, 폭 1,219mm, 롤 형태, 탄소 0.08% 이하)",
        "function": "주방 식기 및 화학 반응기 가공용 철강 판재",
        "expected_chapter": "72",
        "expected_heading": "7219"
    },
    {
        "id": 39,
        "name": "공업용 원형 단면 알루미늄 합금 압출관 (Extruded Aluminium Alloy Tube)",
        "material": "알루미늄 합금 6061 (외경 50mm, 두께 3mm, 이음매 없는 심리스 관)",
        "function": "자전거 프레임 및 경량 구조물 제조용 배관재",
        "expected_chapter": "76",
        "expected_heading": "7608"
    },
    {
        "id": 40,
        "name": "기계 조립용 육각머리 스테인리스 볼트 (Stainless Steel Hexagon Bolts)",
        "material": "스테인리스강 316 (M10 규격 나사산 형성, 인장강도 A4-70)",
        "function": "배관 및 기계 부품 조립 체결용 화스너 나사",
        "expected_chapter": "73",
        "expected_heading": "7318"
    },

    # 5. 기계, 전자, 운송, 정밀 및 잡품군 (Ch 84 - 96) [10 items]
    {
        "id": 41,
        "name": "금속 절삭 가공용 5축 수치제어 머시닝센터 (5-Axis CNC Machining Center)",
        "material": "주철 베드, 고속 스핀들, 서보 모터, 자동 공구 교환장치(ATC)",
        "function": "항공 및 금형용 금속 부품 정밀 절삭 가공 공작기계",
        "expected_chapter": "84",
        "expected_heading": "8457"
    },
    {
        "id": 42,
        "name": "가정용 전자동 드럼 세탁기 (Fully-Automatic Front-Loading Washing Machine)",
        "material": "인버터 DD 모터, 스테인리스 드럼 세탁조, 플라스틱 외장 캐비닛 (건조용량 12kg)",
        "function": "가정 내 의류 세탁 및 탈수용 전기 가전제품",
        "expected_chapter": "84",
        "expected_heading": "8450"
    },
    {
        "id": 43,
        "name": "전기차 탑재용 리튬이온 2차전지 배터리 모듈 (Lithium-ion Battery Module)",
        "material": "NCM 양극재 리튬 파우치 셀 12개 직렬 연결, BMS 제어 회로 및 알루미늄 하우징",
        "function": "전기자동차 구동용 전원 공급 축전지",
        "expected_chapter": "85",
        "expected_heading": "8507"
    },
    {
        "id": 44,
        "name": "스마트폰용 터치 일체형 유기발광다이오드(OLED) 디스플레이 패널 모듈",
        "material": "플렉서블 OLED 기판, 터치센서 필름, DDI 구동칩, 연성회로기판(FPCB)",
        "function": "휴대전화 화면 출력 및 터치 입력용 디스플레이 모듈",
        "expected_chapter": "85",
        "expected_heading": "8524"
    },
    {
        "id": 45,
        "name": "모바일 스마트폰용 옥타코어 애플리케이션 프로세서 (Mobile AP Chip)",
        "material": "단일 실리콘 반도체 웨이퍼 가공 모놀리식 집적회로 (4nm 공정, BGA 패키지)",
        "function": "스마트폰 중앙 연산 및 그래픽 처리용 마이크로프로세서 칩",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 46,
        "name": "순수 배터리 전기 구동 5인승 승용 자동차 (Pure Electric Passenger Vehicle)",
        "material": "고전압 리튬 배터리 팩, 영구자석 동기 전기모터, 차체 샤시 및 실내 내장재",
        "function": "승객 수송용 친환경 도로 주행 승용차",
        "expected_chapter": "87",
        "expected_heading": "8703"
    },
    {
        "id": 47,
        "name": "풀프레임 센서 탑재 디지털 미러리스 카메라 (Digital Mirrorless Camera Body)",
        "material": "3,300만 화소 CMOS 이미지 센서, 마그네슘 합금 바디, 전자식 뷰파인더",
        "function": "고해상도 정지 사진 및 4K 동영상 디지털 촬영 장비",
        "expected_chapter": "85",
        "expected_heading": "8525"
    },
    {
        "id": 48,
        "name": "병원 진단용 128채널 전신 컴퓨터 단층촬영장치 (Medical CT Scanner)",
        "material": "고출력 엑스선 튜브, 검출기 갠트리, 환자 이동식 침대, 영상 재구성 워크스테이션",
        "function": "인체 내부 단면 엑스선 단층 촬영을 통한 질병 진단 의료기기",
        "expected_chapter": "90",
        "expected_heading": "9022"
    },
    {
        "id": 49,
        "name": "사무용 전동 높이 조절 스탠딩 데스크 (Height-Adjustable Electric Office Desk)",
        "material": "스틸 듀얼 모터 리프팅 칼럼 다리, 친환경 MDF 목재 상판 (1600x800mm)",
        "function": "사무실 및 서재 업무용 높낮이 조절 가구",
        "expected_chapter": "94",
        "expected_heading": "9403"
    },
    {
        "id": 50,
        "name": "어린이 지능 개발용 플라스틱 조립식 블록 완구 (Plastic Construction Toy Bricks)",
        "material": "ABS 플라스틱 성형 블록 500피스 (다양한 색상의 결합식 브릭 세트)",
        "function": "아동용 창작 조립 및 놀이용 완구",
        "expected_chapter": "95",
        "expected_heading": "9503"
    }
]

def run_set9_benchmark():
    db = SessionLocal()
    passed_count = 0
    failed_items = []
    start_time = time.time()

    print("=" * 80, flush=True)
    print("🚀 [START] CUSWAY 2026 AI Engine: Set 9 (50 Items) Pure Benchmark", flush=True)
    print("Zero-Hallucination & Zero-Keyword Interceptor | 100% Real Master DB", flush=True)
    print("=" * 80, flush=True)

    for idx, item in enumerate(SET9_50_ITEMS, start=1):
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
    acc = (passed_count / len(SET9_50_ITEMS)) * 100.0
    err_rate = 100.0 - acc

    print("\n" + "=" * 80, flush=True)
    print(f"📊 [SET 9 BENCHMARK SUMMARY]", flush=True)
    print(f"Total Evaluated: {len(SET9_50_ITEMS)}", flush=True)
    print(f"Passed: {passed_count} / {len(SET9_50_ITEMS)}", flush=True)
    print(f"Failed: {len(failed_items)} / {len(SET9_50_ITEMS)}", flush=True)
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

    return passed_count, len(SET9_50_ITEMS), failed_items

if __name__ == "__main__":
    run_set9_benchmark()
