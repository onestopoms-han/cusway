# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 3 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 3)
SET3_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "냉동 껍질 벗긴 흰다리새우 살 (P&D)",
        "material": "새우 살 100% (껍질 및 내장 제거 후 급속 개별 냉동)",
        "function": "식용 냉동 갑각류 수산물 원료",
        "expected_chapter": "03",
        "expected_heading": "0306"
    },
    {
        "id": 2,
        "name": "동결건조 발효 김치 분말",
        "material": "배추김치 100% (발효 후 동결건조 분말화)",
        "function": "라면 스프 및 식품 가공용 조제 채소 분말",
        "expected_chapter": "20",
        "expected_heading": "2005"
    },
    {
        "id": 3,
        "name": "정제 식용 코코넛 야자유",
        "material": "코코넛 야자 건조 과육(코프라) 착유 정제유 100%",
        "function": "제과 및 식용 조리용 식물성 고정유",
        "expected_chapter": "15",
        "expected_heading": "1513"
    },
    {
        "id": 4,
        "name": "천연 마누카 꿀 캔디 조제품",
        "material": "마누카 꿀 90%, 프로폴리스 추출물 5%, 당류",
        "function": "목 보호용 식용 사탕 조제식료품",
        "expected_chapter": "17",
        "expected_heading": "1704"
    },
    {
        "id": 5,
        "name": "압착 롤드 오트 귀리 시리얼 플레이크",
        "material": "통귀리 100% (증자 가열 후 롤러 압착 가공)",
        "function": "식사용 조제 곡물 시리얼 플레이크",
        "expected_chapter": "19",
        "expected_heading": "1904"
    },
    {
        "id": 6,
        "name": "알코올 도수 0.0% 무알코올 보리 발효 음료",
        "material": "보리 맥아 추출액, 호프 추출물, 탄산가스, 정제수 (에탄올 0.00%)",
        "function": "청량음료용 무알코올 음료",
        "expected_chapter": "22",
        "expected_heading": "2202"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "고순도 공업용 침강 탄산칼슘(PCC) 분말",
        "material": "합성 탄산칼슘 (CaCO3 99.0% 이상)",
        "function": "제지 코팅 및 고무 충전용 무기화학 단일화합물",
        "expected_chapter": "28",
        "expected_heading": "2836"
    },
    {
        "id": 8,
        "name": "경구용 세파클러 캡슐 항생제",
        "material": "세파클러 수화물 250mg 젤라틴 캡슐제 (소매 포장)",
        "function": "세균성 감염증 치료용 의약품",
        "expected_chapter": "30",
        "expected_heading": "3004"
    },
    {
        "id": 9,
        "name": "피부 주입용 가교 히알루론산 겔 필러",
        "material": "가교 히알루론산 나트륨 겔 (멸균 프리필드시린지 충전)",
        "function": "안면 주름 개선용 조직수복용 생체재료 의약/의료용품",
        "expected_chapter": "30",
        "expected_heading": "3006"
    },
    {
        "id": 10,
        "name": "초단열 실리카 에어로겔 단열 블랭킷",
        "material": "유리섬유 부직포 매트릭스에 함침된 나노 실리카 에어로겔",
        "function": "건축 및 플랜트 배관용 초고성능 단열재 제품",
        "expected_chapter": "68",
        "expected_heading": "6806"
    },
    {
        "id": 11,
        "name": "의료 및 실험실용 니트릴 고무(NBR) 일회용 장갑",
        "material": "가황 아크릴로니트릴-부타디엔 합성고무 (파우더프리)",
        "function": "오염 방지 및 의료 검진용 가황고무제 장갑",
        "expected_chapter": "40",
        "expected_heading": "4015"
    },
    {
        "id": 12,
        "name": "지하 매설용 고밀도 폴리에틸렌(HDPE) 배관 파이프",
        "material": "고밀도 폴리에틸렌 수지 압출 성형관 (직경 110mm)",
        "function": "상수도 및 가스 이송용 경질 플라스틱 관",
        "expected_chapter": "39",
        "expected_heading": "3917"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "파치먼트 처리 마감 염소 가죽",
        "material": "산양 가죽(Goatskin leather) 파치먼트 가공 완제가죽",
        "function": "고급 북바인딩 및 가죽 공예용 완제 피혁",
        "expected_chapter": "41",
        "expected_heading": "4106"
    },
    {
        "id": 14,
        "name": "스마트폰 보호용 폴리카보네이트 하드 케이스",
        "material": "사출 성형 폴리카보네이트 플라스틱 100%",
        "function": "스마트폰 외관 보호용 플라스틱 케이스",
        "expected_chapter": "39",
        "expected_heading": "3926"
    },
    {
        "id": 15,
        "name": "친환경 원목 자작나무 집성 판재",
        "material": "자작나무 각재를 친환경 접착제로 결합 집성한 판재 (두께 18mm)",
        "function": "가구 제작 및 인테리어용 집성 목재",
        "expected_chapter": "44",
        "expected_heading": "4418"
    },
    {
        "id": 16,
        "name": "전기차 배터리팩 포장용 난연 골판지 상자",
        "material": "난연 처리된 3중 골판지 시트 조립 상자",
        "function": "리튬 배터리 안전 운송용 골판지 포장용기",
        "expected_chapter": "48",
        "expected_heading": "4819"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "초고탄성률 탄소섬유 3K 평직 직물 원단",
        "material": "탄소섬유 연속 토우사를 평직으로 직조한 직물 (수지 미함침)",
        "function": "항공우주 및 스포츠용 탄소복합재(CFRP) 성형용 탄소섬유 직물",
        "expected_chapter": "68",
        "expected_heading": "6815"
    },
    {
        "id": 18,
        "name": "여성용 캐시미어 혼방 모직 더블 롱코트",
        "material": "양모 80%, 캐시미어 20% 모직물(Woven fabric), 폴리에스테르 안감",
        "function": "여성용 방한 외출용 직물제 롱코트",
        "expected_chapter": "62",
        "expected_heading": "6202"
    },
    {
        "id": 19,
        "name": "남성용 흡한속건 기능성 폴리에스테르 운동용 반팔 티셔츠",
        "material": "폴리에스테르 100% 기능성 싱글 저지 편물(Knitted fabric)",
        "function": "운동 및 스포츠 활동용 편물제 반팔 티셔츠",
        "expected_chapter": "61",
        "expected_heading": "6109"
    },
    {
        "id": 20,
        "name": "산업 현장용 강철 토캡 내장 안전화",
        "material": "소가죽 갑피, 강철 발가락 보호대(Toe-cap), 내유성 고무 바닥",
        "function": "작업장 발 보호용 안전 작업 신발",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 21,
        "name": "천연 밍크 모피 롱 코트",
        "material": "밍크 천연 모피(Mink fur skins) 봉제 완성품, 실크 안감",
        "function": "고급 방한용 천연 모피 의류",
        "expected_chapter": "43",
        "expected_heading": "4303"
    },
    {
        "id": 22,
        "name": "아웃도어 등산용 고어텍스 방수 투습 롱 팬츠 바지",
        "material": "PTFE 라미네이팅 나일론 직물(Woven waterproof fabric)",
        "function": "등산 및 야외활동용 직물제 방수 바지",
        "expected_chapter": "62",
        "expected_heading": "6203"
    },

    # 5. 유리, 도자, 금속 및 공구군 (Ch 69 - 83)
    {
        "id": 23,
        "name": "전력 송배전선로용 고전압 자기제 현수 애자",
        "material": "알루미나 자기(Porcelain ceramic) 본체, 아연도금 주철 캡",
        "function": "특고압 가공 송전선로의 절연 및 지지용 전기 절연체",
        "expected_chapter": "85",
        "expected_heading": "8546"
    },
    {
        "id": 24,
        "name": "반도체 및 광학용 고순도 단결정 사파이어 웨이퍼",
        "material": "인공 합성 단결정 산화알루미늄(Al2O3) 경면 연마 기판",
        "function": "Micro LED 및 고출력 RF 반도체 제조용 기판 웨이퍼",
        "expected_chapter": "71",
        "expected_heading": "7104"
    },
    {
        "id": 25,
        "name": "항공기 기체 조립용 티타늄 합금(Ti-6Al-4V) 육각 볼트",
        "material": "고강도 티타늄 합금 가공품 (나사산 외경 8mm)",
        "function": "항공기 구조물 체결 고정용 티타늄제 나사 볼트",
        "expected_chapter": "81",
        "expected_heading": "8108"
    },
    {
        "id": 26,
        "name": "주방용 스테인리스강(SUS304) 프레스 드로잉 싱크볼",
        "material": "오스테나이트계 스테인리스 강판 (두께 1.0mm)",
        "function": "주방 싱크대 매립 설거지 및 조리용 스테인리스 용기",
        "expected_chapter": "73",
        "expected_heading": "7324"
    },
    {
        "id": 27,
        "name": "콘크리트 천공용 전기 다이아몬드 코어 드릴 비트",
        "material": "다이아몬드 소결 분말 세그먼트 팁, 강철 원통 샹크",
        "function": "콘크리트 벽체 배관 관통 홀 천공용 전동공구 교환식 비트",
        "expected_chapter": "82",
        "expected_heading": "8207"
    },
    {
        "id": 28,
        "name": "건축용 알루미늄 합금 압출 커튼월 바 프로파일 형재",
        "material": "알루미늄-마그네슘-실리콘 합금(6063-T5) 중공 압출 형재",
        "function": "빌딩 외벽 유리 커튼월 프레임 시공용 알루미늄 형재",
        "expected_chapter": "76",
        "expected_heading": "7604"
    },
    {
        "id": 29,
        "name": "가구 서랍용 볼베어링 3단 댐핑 슬라이드 레일",
        "material": "아연도금 냉간압연강판, 스틸 볼베어링, 유압 댐퍼",
        "function": "가구 서랍 개폐 가이드 및 완충 지지용 철강제 취부구",
        "expected_chapter": "83",
        "expected_heading": "8302"
    },
    {
        "id": 30,
        "name": "수동 조작식 볼텍스 기계식 벤치 바이스",
        "material": "주철 주물 바디, 탄소강 조(Jaw), 수동 회전 핸들 스크류",
        "function": "금속 및 목재 공작물을 단단히 물려 고정하는 수공구",
        "expected_chapter": "82",
        "expected_heading": "8205"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "금속 정밀 가공용 파이버 레이저 판금 절단기",
        "material": "12kW 파이버 레이저 발진기, CNC 3축 갠트리 프레임, 오토 포커스 헤드",
        "function": "고출력 레이저 빔으로 스테인리스 및 탄소강 판재를 고정밀 절단하는 공작기계",
        "expected_chapter": "84",
        "expected_heading": "8456"
    },
    {
        "id": 32,
        "name": "자동차 플라스틱 범퍼 사출 성형용 강철 금형(Mold)",
        "material": "고인성 단조 P20 공구강 코어 및 캐비티 블록, 핫러너 시스템",
        "function": "용융 플라스틱을 주입받아 완성형 범퍼를 성형하는 주형 금형",
        "expected_chapter": "84",
        "expected_heading": "8480"
    },
    {
        "id": 33,
        "name": "반도체 실리콘 웨이퍼 매엽식 화학 세정기",
        "material": "불소수지 챔버, 케미컬 약액 공급 노즐, 스핀 척 회전 유닛",
        "function": "웨이퍼 표면의 파티클과 유기 오염물을 화학 약액으로 정밀 세정하는 반도체 제조기계",
        "expected_chapter": "84",
        "expected_heading": "8486"
    },
    {
        "id": 34,
        "name": "산업 공정용 무급유식(오일프리) 로터리 스크루 공기압축기",
        "material": "테플론 코팅 트윈 스크루 로터, 75kW 인버터 모터, 수냉식 쿨러",
        "function": "윤활유 혼입 없이 순수한 고압 압축공기를 연속 생산 공급하는 기체 압축기",
        "expected_chapter": "84",
        "expected_heading": "8414"
    },
    {
        "id": 35,
        "name": "물류 창고용 자동 수직 리프트 컨베이어",
        "material": "구동 체인, 승강 캐리지, 전동 기어드 모터, 안전 인터록",
        "function": "화물 팔레트 및 상자를 층간 수직으로 자동 연속 승강 운반하는 하역기계",
        "expected_chapter": "84",
        "expected_heading": "8428"
    },
    {
        "id": 36,
        "name": "산업용 유압 시스템용 기어식 오일 펌프",
        "material": "고강도 알루미늄 하우징, 침탄 열처리 합금강 기어 로터",
        "function": "회전하는 기어 치합으로 고압 유압 오일을 압송하는 용적형 액체 펌프",
        "expected_chapter": "84",
        "expected_heading": "8413"
    },

    # 7. 전기, 전자, 통신 및 센서 (Ch 85)
    {
        "id": 37,
        "name": "위성 통신 송신기용 X-밴드 GaN 고출력 증폭기(SSPA) 모듈",
        "material": "GaN HEMT 다이, 드라이버 증폭기, 내부 정합회로, 방열 패키지",
        "function": "마이크로파 무선 고주파 신호를 고출력으로 선형 증폭하는 고주파 전기증폭기",
        "expected_chapter": "85",
        "expected_heading": "8543"
    },
    {
        "id": 38,
        "name": "스마트폰용 폴더블 능동형 유기발광다이오드(AMOLED) 디스플레이 패널",
        "material": "폴리이미드 플렉시블 기판, LTPS TFT 백플레인, 초박막유리(UTG), 터치센서 일체형",
        "function": "접히는 스마트폰 화면에 고해상도 그래픽 영상을 표시하는 디스플레이 모듈",
        "expected_chapter": "85",
        "expected_heading": ["8524", "8528"]
    },
    {
        "id": 39,
        "name": "전기차용 800V 고전압 배터리 탑재형 충전기(OBC)",
        "material": "SiC 전력 스위치, 고주파 공진 변압기, 정류 다이오드, 제어 DSP",
        "function": "교류(AC) 완속 충전 전원을 직류(DC) 800V로 정류 변환하여 배터리를 충전하는 정지형 변환기",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 40,
        "name": "차량용 디지털 위상배열 광 레이더(LiDAR) 센서",
        "material": "905nm 레이저 다이오드 어레이, SPAD 광수신기, 광학 빔 스티어링 소자",
        "function": "레이저 광 펄스를 발사하고 반사 시간을 측정하여 3차원 주변 거리를 감지하는 광학 거리측정기",
        "expected_chapter": "90",
        "expected_heading": "9015"
    },
    {
        "id": 41,
        "name": "초고속 5G 이동통신 기지국용 매시브 MIMO 빔포밍 안테나",
        "material": "64T64R 패치 안테나 배열 기판, 위상천이기, 알루미늄 다이캐스팅 레이돔 외함",
        "function": "무선 통신 전파를 특정 방향으로 집속하여 송수신하는 무선 통신기기용 안테나",
        "expected_chapter": "85",
        "expected_heading": "8517"
    },
    {
        "id": 42,
        "name": "산업용 안전 차단용 3상 기중 회로 차단기(ACB)",
        "material": "은합금 접점, 소호실 그리드, 전자식 트립 릴레이 유닛, 절연 수지 몰드 프레임",
        "function": "정격 1,000V 이하 4,000A 대용량 교류 전로의 과전류 및 단락 사고 시 전류를 자동 차단하는 전기기기",
        "expected_chapter": "85",
        "expected_heading": "8536"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "도시형 저상 수소연료전지 전기 버스 (승차정원 50인승)",
        "material": "강철 일체형 모노코크 차체, 180kW 수소연료전지 스택, 구동 모터",
        "function": "도로 위에서 승객 10인 이상을 대중교통으로 수송하는 대형 상용 승합 자동차",
        "expected_chapter": "87",
        "expected_heading": "8702"
    },
    {
        "id": 44,
        "name": "밀폐 산업 배관 점검용 소형 내시경 드론",
        "material": "탄소섬유 보호 케이지, 4축 브러시리스 모터, 4K 광학 카메라, 조명 LED",
        "function": "원격 무선 조종으로 좁은 배관 내부를 비행 촬영 점검하는 무인기",
        "expected_chapter": "88",
        "expected_heading": "8806"
    },
    {
        "id": 45,
        "name": "치과 매립용 타이타늄 치조골 임플란트 픽스처",
        "material": "의료용 순수 티타늄(Grade 4) 나사 가공물, SLA 표면처리 (소매 멸균 포장)",
        "function": "턱뼈에 식립되어 인공치아의 지지대 역할을 하는 인공치근 정형외과/치과용 매식재",
        "expected_chapter": "90",
        "expected_heading": "9021"
    },
    {
        "id": 46,
        "name": "생물학 연구용 정립형 삼안 광학 현미경",
        "material": "광학 유리 대물렌즈 4종, 쌍안 접안렌즈, 할로겐 광원, 기계식 재물대",
        "function": "미세 세포 및 조직 표본을 광학 렌즈로 확대 관찰하는 정밀 광학 현미경",
        "expected_chapter": "90",
        "expected_heading": "9011"
    },
    {
        "id": 47,
        "name": "헬스케어 수면 모니터링 스마트 건강 반지(Smart Ring)",
        "material": "티타늄 외장 링, 광혈류측정(PPG) 센서, 피부온도 센서, 블루투스 BLE 칩, 초소형 충전지",
        "function": "손가락에 착용하여 심박수, 산소포화도 및 수면 상태를 연속 계측 전송하는 웨어러블 측정기기",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9031", "8517", "9018"]
    },
    {
        "id": 48,
        "name": "스테인리스 스틸 다이버 방수 오토매틱 손목시계 (300m 방수)",
        "material": "SUS316L 케이스, 사파이어 크리스탈 글라스, 기계식 자동 태엽 무브먼트",
        "function": "손목 착용 휴대용 기계식 시계",
        "expected_chapter": "91",
        "expected_heading": "9102"
    },
    {
        "id": 49,
        "name": "공연용 61건반 디지털 신디사이저 전자 건반 악기",
        "material": "벨로시티 감압 건반, DSP 음원 발생 엔진, 오디오 DAC, 알루미늄 외장",
        "function": "건반 조작으로 전자적 신호를 발생하여 다양한 악기 음색을 합성 출력하는 전자 악기",
        "expected_chapter": "92",
        "expected_heading": "9207"
    },
    {
        "id": 50,
        "name": "산업 현장용 정밀 레이저 거리측정기 (측정거리 100m)",
        "material": "레이저 송수광 광학 모듈, 연산 마이크로프로세서, 디지털 LCD",
        "function": "레이저 위상차 방식으로 목표물과의 거리를 정밀 계측 표시하는 광학식 거리측정기",
        "expected_chapter": "90",
        "expected_heading": "9015"
    }
]

def run_set3_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 3] 50개 완전히 새로운 수출입 품목 AI 정밀 품목분류 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET3_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET3_50_ITEMS, 1):
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
    total = len(SET3_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 3 결과 요약] 검증 완료!", flush=True)
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
    run_set3_test()
