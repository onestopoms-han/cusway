# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 4 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 4)
SET4_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "냉동 명태 연육 (수리미)",
        "material": "명태 어육 살 100% (세척, 마쇄 및 냉동 블록화, 당류 무첨가)",
        "function": "어묵 및 크래미 맛살 제조용 냉동 어육 원료",
        "expected_chapter": "03",
        "expected_heading": "0304"
    },
    {
        "id": 2,
        "name": "천연 벌꿀 벌집 콤허니 (Comb Honey)",
        "material": "천연 벌꿀 및 천연 밀랍 벌집 100% (비가공 소매포장)",
        "function": "천연 감미 식용 벌꿀",
        "expected_chapter": "04",
        "expected_heading": "0409"
    },
    {
        "id": 3,
        "name": "급속 개별 냉동(IQF) 야생 블루베리 과실",
        "material": "블루베리 과실 100% (설탕 무첨가 급속 냉동)",
        "function": "제과 및 식용 가공용 냉동 과실",
        "expected_chapter": "08",
        "expected_heading": "0811"
    },
    {
        "id": 4,
        "name": "저온 압착 엑스트라 버진 생들기름",
        "material": "들깨 100% 비가열 저온 물리적 압착유",
        "function": "조리 및 샐러드용 식용 식물성 고정유",
        "expected_chapter": "15",
        "expected_heading": "1515"
    },
    {
        "id": 5,
        "name": "슬라이스 가공 치즈 블록",
        "material": "자연치즈 70%, 유화제, 식염, 버터 (가열 용융 가공)",
        "function": "샌드위치 및 햄버거용 가공 유제품 치즈",
        "expected_chapter": "04",
        "expected_heading": "0406"
    },
    {
        "id": 6,
        "name": "맥주 양조 건조 맥주박 부산물",
        "material": "맥아 맥주 발효 추출 찌꺼기 100% (건조 펠릿)",
        "function": "가축 사료 제조용 양조 부산물",
        "expected_chapter": "23",
        "expected_heading": "2303"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "공업용 고순도 산화아연(Zinc Oxide) 분말",
        "material": "화학 합성 산화아연 (ZnO 99.8% 이상 무기화합물)",
        "function": "고무 가황 촉진제 및 세라믹 유약용 화학 원료",
        "expected_chapter": "28",
        "expected_heading": "2817"
    },
    {
        "id": 8,
        "name": "보툴리눔 톡신 A형 치료용 주사제 (100단위)",
        "material": "클로스트리디움 보툴리눔 독소 단백질 분말 (바이알 포장)",
        "function": "근육 경직 및 안면 주름 치료용 미생물 독소 의약품",
        "expected_chapter": "30",
        "expected_heading": "3002"
    },
    {
        "id": 9,
        "name": "건축 실내용 친환경 수성 아크릴 에멀젼 페인트 도료",
        "material": "아크릴 공중합체 수지, 안료, 물(수성 매질)",
        "function": "벽면 및 콘크리트 마감용 수성 페인트 도료",
        "expected_chapter": "32",
        "expected_heading": "3209"
    },
    {
        "id": 10,
        "name": "자동차 광택용 카나우바 왁스 조제품",
        "material": "천연 카나우바 왁스 40%, 합성 왁스, 실리콘 오일 (소매용 캔)",
        "function": "차량 도장면 광택 및 발수 코팅용 조제 왁스",
        "expected_chapter": "34",
        "expected_heading": "3405"
    },
    {
        "id": 11,
        "name": "사출용 열가소성 폴리우레탄(TPU) 수지 펠릿",
        "material": "폴리우레탄 수지 100% (1차제품 펠릿)",
        "function": "신발 밑창 및 스마트폰 케이스 성형용 탄성 플라스틱 원료",
        "expected_chapter": "39",
        "expected_heading": "3909"
    },
    {
        "id": 12,
        "name": "산업 기계용 가황 합성고무제 V-벨트",
        "material": "폴리에스테르 심선 보강 가황 에틸렌프로필렌(EPDM) 고무",
        "function": "전동기 모터 동력 전달용 무단 가황고무 전동 벨트",
        "expected_chapter": "40",
        "expected_heading": "4010"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "식물성 유연 크러스트 돼지 가죽 (돈피)",
        "material": "돼지 원피 털 제거 후 베지터블 탄닝 크러스트 가죽",
        "function": "신발 안감 및 핸드백 제조용 원단 피혁",
        "expected_chapter": "41",
        "expected_heading": "4106"
    },
    {
        "id": 14,
        "name": "휴대용 천연 소가죽 명함 및 카드 지갑",
        "material": "천연 소가죽 외피, 폴리에스테르 안감 (포켓용)",
        "function": "카드 및 명함 보관 휴대용 가죽 소품",
        "expected_chapter": "42",
        "expected_heading": "4202"
    },
    {
        "id": 15,
        "name": "와인병 밀봉용 천연 압착 코르크 마개",
        "material": "천연 코르크 나무 껍질 압착 가공품",
        "function": "유리 와인병 입구 밀폐용 코르크 마개",
        "expected_chapter": "45",
        "expected_heading": "4503"
    },
    {
        "id": 16,
        "name": "포장용 자착성 크라프트 종이 점착 테이프",
        "material": "미표백 크라프트지, 천연고무계 점착제 도포 (롤 형태 폭 50mm)",
        "function": "골판지 상자 포장 밀봉용 종이 점착 테이프",
        "expected_chapter": "48",
        "expected_heading": "4811"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "여름 의류용 100% 천연 아마(Linen) 직포 직물",
        "material": "아마(Flax/Linen) 방적사 100% 평직 직물 원단",
        "function": "셔츠 및 원피스 제조용 마직물 원단",
        "expected_chapter": "53",
        "expected_heading": "5309"
    },
    {
        "id": 18,
        "name": "남성 신사 정장용 100% 면 평직 드레스 셔츠",
        "material": "면 100% 직물(Woven cotton fabric), 긴소매, 단추 여밈",
        "function": "남성 정장용 직물제 셔츠 의류",
        "expected_chapter": "62",
        "expected_heading": "6205"
    },
    {
        "id": 19,
        "name": "유아용 순면 100% 편물 바디수트 우주복",
        "material": "면 100% 싱글 저지 편물(Knitted fabric), 스냅 단추",
        "function": "신생아 및 유아 착용용 편물제 유아복",
        "expected_chapter": "61",
        "expected_heading": "6111"
    },
    {
        "id": 20,
        "name": "고어텍스 방수 투습 가죽 갑피 아웃도어 등산화",
        "material": "소가죽 갑피(Nubuck leather), PTFE 방수 멤브레인, 비브람 고무 밑창",
        "function": "산악 등반용 가죽 갑피 전문 등산화 부츠",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 21,
        "name": "남성용 토끼털 펠트 신사 중절모(Fedora)",
        "material": "토끼 모피 모 섬유 펠트(Fur felt) 성형품, 실크 리본",
        "function": "남성 외출 착용용 펠트제 모자",
        "expected_chapter": "65",
        "expected_heading": "6505"
    },
    {
        "id": 22,
        "name": "수영장 및 해변용 여성용 나일론 스판덱스 투피스 비키니 수영복",
        "material": "나일론 80%, 폴리우레탄(Elastane) 20% 편물(Knitted fabric)",
        "function": "여성용 수상 스포츠 및 물놀이 편물제 수영복",
        "expected_chapter": "61",
        "expected_heading": "6112"
    },

    # 5. 유리, 도자, 금속 및 공구군 (Ch 69 - 83)
    {
        "id": 23,
        "name": "반도체 단결정 잉곳 성장용 고순도 석영 유리 도가니",
        "material": "용융 실리카 석영 유리(Fused quartz glass, SiO2 99.99%)",
        "function": "실리콘 잉곳 인상 공정용 초고온 반도체 공정용 유리 용기",
        "expected_chapter": ["70", "84"],
        "expected_heading": ["7020", "8480"]
    },
    {
        "id": 24,
        "name": "선박 해양 배관용 백동(Cu-Ni 90/10) 합금 이음매 없는 관",
        "material": "구리 90%, 니켈 10% 합금 심리스 파이프 (내경 50mm)",
        "function": "해수 냉각수 이송용 내식성 동합금 배관 관",
        "expected_chapter": "74",
        "expected_heading": "7411"
    },
    {
        "id": 25,
        "name": "항공기 및 터빈용 니켈기 초내열합금(Inconel 718) 단조 봉",
        "material": "니켈 53%, 크롬 19%, 몰리브덴 등 초합금 환봉(Round bar)",
        "function": "고온 고압 터빈 부품 가공용 니켈 합금 단조 봉재",
        "expected_chapter": "75",
        "expected_heading": "7505"
    },
    {
        "id": 26,
        "name": "고중량 화물 인양용 철강 와이어 로프 슬링",
        "material": "탄소강 와이어로프 꼬임선, 양단 알루미늄 압착 심블 아이",
        "function": "크레인 하역 및 크레인 인양용 와이어로프 결합 완제품",
        "expected_chapter": "73",
        "expected_heading": "7312"
    },
    {
        "id": 27,
        "name": "건축 도어용 스테인리스 스틸 베어링 버트 경첩(Hinge)",
        "material": "SUS304 스테인리스 강판 프레스 가공, 볼베어링 핀 결합",
        "function": "방화문 및 건물 출입문 회전 지지용 건축용 철물 취부구",
        "expected_chapter": "83",
        "expected_heading": "8302"
    },
    {
        "id": 28,
        "name": "CNC 밀링용 초미립자 초경합금 4날 스퀘어 엔드밀",
        "material": "초경합금(WC 90%, Co 10%), TiAlN PVD 코팅",
        "function": "금형 및 금속 절삭 가공용 회전식 밀링 절삭공구",
        "expected_chapter": "82",
        "expected_heading": "8207"
    },
    {
        "id": 29,
        "name": "가정용 단조 알루미늄 테플론 코팅 프라이팬",
        "material": "알루미늄 합금 바디, 불소수지 논스틱 코팅, 스테인리스 손잡이",
        "function": "음식물 조리 및 가열용 가정용 알루미늄 주방용기",
        "expected_chapter": "76",
        "expected_heading": "7615"
    },
    {
        "id": 30,
        "name": "전기 배선 연결용 절연 슬리브 압착 단자(Terminal Lug)",
        "material": "주석도금 무산소동(Copper), PVC 절연 슬리브",
        "function": "전선 끝단에 압착하여 배전반 단자에 결속하는 접속용 단자 기구",
        "expected_chapter": "85",
        "expected_heading": "8536"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "2차전지 리튬이온 양극재 전극 슬러리 롤 투 롤 코팅 장비",
        "material": "정밀 슬롯다이 헤드, 열풍 건조 챔버, 롤러 장력 제어 구동계",
        "function": "알루미늄 박 위에 활물질 슬러리를 정밀 연속 도포 건조하는 2차전지 제조기계",
        "expected_chapter": "84",
        "expected_heading": "8479"
    },
    {
        "id": 32,
        "name": "금형 정밀 가공용 CNC 와이어 방전가공기(EDM)",
        "material": "황동 와이어 전극 공급 장치, 탈이온수 절연액 유닛, 서보 구동계",
        "function": "전기 스파크 방전 에너지로 초경합금 및 강재를 미세 정밀 가공하는 공작기계",
        "expected_chapter": "84",
        "expected_heading": "8456"
    },
    {
        "id": 33,
        "name": "물류 창고용 4방향 전동 좌승식 지게차",
        "material": "전동 주행 모터, 48V 납축전지 팩, 유압 승강 마스트, 포크",
        "function": "창고 내 파렛트 화물을 4방향으로 이동 적재 운반하는 작업용 트럭",
        "expected_chapter": "84",
        "expected_heading": "8427"
    },
    {
        "id": 34,
        "name": "중대형 냉동 공조용 반밀폐형 트윈 스크루 냉매 압축기",
        "material": "주철 압력 하우징, 암수 트윈 스크루 로터, 빌트인 전동기",
        "function": "냉동 사이클 냉매 기체를 고압 압축 순환시키는 기체 압축기",
        "expected_chapter": "84",
        "expected_heading": "8414"
    },
    {
        "id": 35,
        "name": "공장 자동화 라인용 모터 구동 롤러 체인 컨베이어",
        "material": "강철 롤러 체인, 스테인리스 프레임, 0.75kW 감속 전동기",
        "function": "조립 부품 및 상자를 수평으로 연속 이동 운반하는 운반기계",
        "expected_chapter": "84",
        "expected_heading": "8428"
    },
    {
        "id": 36,
        "name": "히트펌프 공조기용 전자식 냉매 팽창 밸브(EEV)",
        "material": "황동 밸브 바디, 스텝 모터 액추에이터, 니들 밸브 기구",
        "function": "냉매 유량을 전자적으로 정밀 감압 조절 제어하는 밸브",
        "expected_chapter": "84",
        "expected_heading": "8481"
    },

    # 7. 전기, 전자, 통신 및 센서 (Ch 85)
    {
        "id": 37,
        "name": "전기차 구동용 150kW 영구자석 동기모터(PMSM)",
        "material": "네오디뮴 영구자석 매입형 로터, 구리 권선 고정자 코어, 수냉 하우징",
        "function": "배터리 전원을 회전 역학적 구동 에너지로 변환하는 출력 150kW 전기 모터",
        "expected_chapter": "85",
        "expected_heading": "8501"
    },
    {
        "id": 38,
        "name": "스마트폰용 자기공명/유도식 무선 충전 수신 코일 모듈",
        "material": "FPCB 연성회로기판, 극박 구리 코일 패턴, 페라이트 자기차폐 시트",
        "function": "무선 전자기 유도 신호를 수신하여 전류를 유도하는 무선충전 수신 안테나/코일 부품",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 39,
        "name": "데이터센터 광인터커넥트용 실리콘 포토닉스 광 송수신 집적회로 칩",
        "material": "실리콘 온 인슐레이터(SOI) 기판, 광도파로, 변조기 일체화 모놀리식 칩",
        "function": "광신호 변복조 및 고속 연산을 단일 실리콘 칩으로 처리하는 전자집적회로",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 40,
        "name": "공장 자동화 설비 제어용 모듈형 프로그래머블 로직 컨트롤러(PLC) CPU 유닛",
        "material": "산업용 32비트 마이크로프로세서, 이더넷 통신 포트, 플래시 메모리, 절연 케이스",
        "function": "공장 기계 장비의 시퀀스 및 논리 제어를 총괄 수행하는 디지털 전기 제어반 기기",
        "expected_chapter": "85",
        "expected_heading": "8537"
    },
    {
        "id": 41,
        "name": "전력 변환 인버터용 1200V/600A IGBT 하프브리지 파워 모듈",
        "material": "실리콘 IGBT 칩 6개, 고속 환류 다이오드(FRD), 절연 DBC 세라믹 기판 패키지",
        "function": "고전압 대전류 스위칭을 수행하는 전력용 복합 반도체 모듈",
        "expected_chapter": "85",
        "expected_heading": ["8541", "8504"]
    },
    {
        "id": 42,
        "name": "변전소용 170kV 고전압 SF6 가스절연 개폐장치(GIS)",
        "material": "차단기(CB), 단로기(DS), 접지개폐기, SF6 절연가스 밀폐 알루미늄 외함",
        "function": "특고압 송변전 선로의 계통 개폐 및 보호 차단 기능을 일체화한 복합 수배전반 기기",
        "expected_chapter": "85",
        "expected_heading": "8537"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "가솔린 엔진 및 전기모터 병렬 하이브리드 승용차 (배기량 1,999cc)",
        "material": "모노코크 강철 차체, 4기통 가솔린 엔진, 리튬이온 배터리팩, 구동모터 (5인승)",
        "function": "내연기관과 전기모터 동력으로 도로를 주행하는 개인 승용 자동차",
        "expected_chapter": "87",
        "expected_heading": "8703"
    },
    {
        "id": 44,
        "name": "도심 공유 모빌리티용 접이식 전동 킥보드 (최고속도 25km/h)",
        "material": "항공 알루미늄 합금 프레임, 350W 브러시리스 허브모터, 36V 리튬배터리, 전자브레이크",
        "function": "모터 동력으로 1인이 탑승 주행하는 전동 킥보드 개인형 이동장치",
        "expected_chapter": "87",
        "expected_heading": "8711"
    },
    {
        "id": 45,
        "name": "응급구조용 자동 심장충격기(AED)",
        "material": "심전도(ECG) 분석 회로, 고전압 커패시터, 음성안내 마이크로프로세서, 전극 패드",
        "function": "심정지 환자의 심전도를 분석하고 전기 충격을 인가하는 응급 의료기기",
        "expected_chapter": "90",
        "expected_heading": "9018"
    },
    {
        "id": 46,
        "name": "스마트폰 카메라용 5배 광학 잠망경식 폴디드 줌 렌즈 모듈",
        "material": "유리 및 플라스틱 비구면 렌즈 5매, 프리즘 반사경, VCM 보이스코일 모터 하우징",
        "function": "카메라 이미지센서 앞에 장착되어 광학적으로 상을 결상시키는 장착된 광학 렌즈 조립체",
        "expected_chapter": "90",
        "expected_heading": "9002"
    },
    {
        "id": 47,
        "name": "휴대용 디지털 광학식 당도계 및 굴절계 (Brix 0~93%)",
        "material": "광학 유리 프리즘, LED 광원, 고감도 리니어 CCD 센서, 디지털 LCD",
        "function": "액체 시료의 빛 굴절률을 측정하여 당도(Brix)를 디지털 표시하는 물리화학 분석기기",
        "expected_chapter": "90",
        "expected_heading": "9027"
    },
    {
        "id": 48,
        "name": "가정용 클래식 쿼츠 크리스탈 탁상시계",
        "material": "원목(Wood) 케이스, 쿼츠 전자 무브먼트, 유리 커버",
        "function": "책상 및 탁상 거치용 쿼츠 시계",
        "expected_chapter": "91",
        "expected_heading": "9105"
    },
    {
        "id": 49,
        "name": "어린이 정서 발달용 동물 솜 인형 봉제 완구",
        "material": "폴리에스테르 인조 모피 원단 겉감, PP 솜 충전재 (높이 30cm)",
        "function": "아동 놀이 및 애착용 동물 봉제 인형 완구",
        "expected_chapter": "95",
        "expected_heading": "9503"
    },
    {
        "id": 50,
        "name": "사무용 스테인리스강제 가위 (길이 18cm)",
        "material": "SUS420J2 스테인리스 칼날 강판, ABS 플라스틱 손잡이",
        "function": "종이 및 직물 절단용 사무용 가위",
        "expected_chapter": "82",
        "expected_heading": "8213"
    }
]

def run_set4_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 4] 50개 완전히 새로운 수출입 품목 AI 정밀 품목분류 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET4_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET4_50_ITEMS, 1):
        p_name = item["name"]
        p_mat = item["material"]
        p_func = item["function"]
        exp_ch = item["expected_chapter"]
        exp_hd = item["expected_heading"]

        # Run AI Classification
        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=p_name,
            material=p_mat,
            function_use=p_func,
            db=db
        )

        pred_code = res.get("recommendedHsCode", "0000.00-0000")
        clean_code = pred_code.replace(".", "").replace("-", "").strip()
        pred_ch = clean_code[:2]
        pred_hd = clean_code[:4]

        # Validate Chapter and Heading
        ch_match = (pred_ch == exp_ch) if isinstance(exp_ch, str) else (pred_ch in exp_ch)
        hd_match = (pred_hd == exp_hd) if isinstance(exp_hd, str) else (pred_hd in exp_hd)

        is_passed = ch_match and hd_match

        status_str = "✅ PASS" if is_passed else "❌ FAIL"
        if is_passed:
            passed_count += 1
            print(f"[{idx:02d}/50] {status_str} | {p_name} -> AI: {pred_code} (예상: {exp_hd})", flush=True)
        else:
            print(f"[{idx:02d}/50] {status_str} | {p_name}", flush=True)
            print(f"       -> 판정 세번: {pred_code} (분류 류/호: {pred_hd})", flush=True)
            print(f"       -> 예상 기준: 제{exp_ch}류 / 제{exp_hd}호", flush=True)
            print(f"       -> 법적 논리: {res.get('legalReasoning', '')[:100]}...", flush=True)
            failed_items.append({
                "item": item,
                "predicted_code": pred_code,
                "predicted_hd": pred_hd,
                "expected_hd": exp_hd,
                "result": res
            })

    elapsed = time.time() - start_time
    total = len(SET4_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 4 결과 요약] 검증 완료!", flush=True)
    print(f"총 품목 수: {total}개 | 통과: {passed_count}개 | 실패: {len(failed_items)}개", flush=True)
    print(f"정확도: {acc:.1f}% | 오류율: {err_rate:.1f}% | 소요 시간: {elapsed:.2f}초", flush=True)
    print("=" * 105, flush=True)

    if failed_items:
        print("\n[오류 항목 상세 분석 리스트]", flush=True)
        for f in failed_items:
            it = f["item"]
            print(f"- No.{it['id']} [{it['name']}]: 판정={f['predicted_code']} (호: {f['predicted_hd']}) vs 기대={f['expected_hd']}", flush=True)
            print(f"  재질/용도: {it['material']} / {it['function']}", flush=True)
            
    db.close()
    return passed_count, failed_items

if __name__ == "__main__":
    run_set4_test()
