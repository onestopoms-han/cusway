# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 5 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 5)
SET5_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "자숙 건조 해삼 (Dry Sea Cucumber)",
        "material": "천연 해삼 100% (삶은 후 건조, 염장 가공, 비소매 대용량 포장)",
        "function": "고급 중식 식용 조리용 수생 무척추동물 건조 식재료",
        "expected_chapter": "03",
        "expected_heading": "0308"
    },
    {
        "id": 2,
        "name": "탈각 열풍 볶은 땅콩 (Roasted Peanuts)",
        "material": "땅콩 100% (껍질 제거 후 열풍 로스팅, 기름 및 염분 무첨가)",
        "function": "스낵 및 제과 가공 원료용 볶은 견과류 조제품",
        "expected_chapter": "20",
        "expected_heading": "2008"
    },
    {
        "id": 3,
        "name": "사료용 탈지 대두박 펠릿 (Defatted Soybean Meal)",
        "material": "대두유 추출 후 남은 대두박 찌꺼기 100% (가열 펠릿화)",
        "function": "가축 사료 제조용 식물성 고단백 추출 부산물",
        "expected_chapter": "23",
        "expected_heading": "2304"
    },
    {
        "id": 4,
        "name": "건조 마카다미아 너트 (탈각 생과실)",
        "material": "마카다미아 너트 100% (단단한 외각 껍질 제거 후 자연 건조, 미볶음)",
        "function": "식용 및 견과류 스낵용 신선 건조 견과류",
        "expected_chapter": "08",
        "expected_heading": "0802"
    },
    {
        "id": 5,
        "name": "동결건조 인스턴트 커피 분말",
        "material": "볶은 커피두 열수 추출액 100% (동결건조 분말, 설탕/크림 무첨가)",
        "function": "물에 용해하여 음용하는 인스턴트 커피 추출물 조제품",
        "expected_chapter": "21",
        "expected_heading": "2101"
    },
    {
        "id": 6,
        "name": "사탕무 정제 백설탕 (Refined Sugar)",
        "material": "사탕무 유래 자당(Sucrose) 99.5% 이상 고체 결정체 (향미 및 색소 무첨가)",
        "function": "식품 조리 및 제과제빵용 천연 당류 감미료",
        "expected_chapter": "17",
        "expected_heading": "1701"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "고순도 천연 결정질 흑연 분말 (Natural Graphite)",
        "material": "천연 결정질 흑연 99.0% 이상 미세 분말",
        "function": "내화물 및 전도성 윤활재, 2차전지 음극재용 천연 광물 원료",
        "expected_chapter": "25",
        "expected_heading": "2504"
    },
    {
        "id": 8,
        "name": "공업용 과산화수소 수용액 (50wt%)",
        "material": "과산화수소(H2O2) 50%, 정제수 50% 수용액 (무기화합물)",
        "function": "반도체 세정 및 펄프 섬유 표백용 산화제 화학 원료",
        "expected_chapter": "28",
        "expected_heading": "2847"
    },
    {
        "id": 9,
        "name": "바이오디젤용 지방산 메틸에스테르 (FAME)",
        "material": "식물성 유지 전이에스테르화 지방산 메틸에스테르 98% 이상",
        "function": "디젤 차량용 친환경 바이오디젤 연료 및 혼합 원료",
        "expected_chapter": "38",
        "expected_heading": "3826"
    },
    {
        "id": 10,
        "name": "치과용 부가중합형 실리콘 인상재 세트",
        "material": "비닐 폴리실록산(Vinyl Polysiloxane) 실리콘 페이스트 (베이스 및 촉매 카트리지)",
        "function": "치과 구강 내 치아 및 잇몸 정밀 본뜨기용 치과용 인상재료",
        "expected_chapter": "34",
        "expected_heading": "3407"
    },
    {
        "id": 11,
        "name": "사출성형용 고밀도 폴리에틸렌(HDPE) 수지 펠릿",
        "material": "에틸렌 단일중합체 (비중 0.95, 1차제품 펠릿 형태)",
        "function": "플라스틱 용기 및 파이프 사출 성형용 플라스틱 1차제품 원료",
        "expected_chapter": "39",
        "expected_heading": "3901"
    },
    {
        "id": 12,
        "name": "승용차용 신품 고무제 래디얼 래디얼 타이어",
        "material": "가황 합성/천연고무, 스틸벨트 보강재, 카본블랙 (튜브리스)",
        "function": "승용 자동차 주행용 공기입 고무 타이어",
        "expected_chapter": "40",
        "expected_heading": "4011"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "피혁 제조용 염장 생 소 원피 (Wet Salted Bovine Hide)",
        "material": "소 원피(Wet Salted), 제모 및 유연 처리 전의 염장 보관 원피",
        "function": "피혁 제혁 공장 원단 가죽 제조용 동물 원피",
        "expected_chapter": "41",
        "expected_heading": "4101"
    },
    {
        "id": 14,
        "name": "가구 및 건축 인테리어용 자작나무 합판 (Birch Plywood)",
        "material": "자작나무(Birch) 박판 단판을 섬유 방향 교차 적층 페놀수지 압착 (두께 18mm)",
        "function": "가구 제작 및 실내 인테리어 구조용 목재 합판",
        "expected_chapter": "44",
        "expected_heading": "4412"
    },
    {
        "id": 15,
        "name": "신문 인쇄용 롤 형태 신문용지 (Newsprint)",
        "material": "기계 목재 펄프 70%, 재생 펄프 30% (도포되지 않은 롤 형태, 폭 160cm)",
        "function": "일간 신문 윤전 인쇄용 권취 신문용지",
        "expected_chapter": "48",
        "expected_heading": "4801"
    },
    {
        "id": 16,
        "name": "인쇄된 상업용 하드커버 양장 단행본 서적",
        "material": "종이 본문(오프셋 텍스트 인쇄), 하드커버 양장 제본 (ISBN 부여)",
        "function": "도서 독서 및 학술 정보 열람용 인쇄 서적",
        "expected_chapter": "49",
        "expected_heading": "4901"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "에어백 및 산업용 고강력 나일론-66 필라멘트 원사",
        "material": "폴리아미드(Nylon 66) 고강력 멀티필라멘트 연속 원사 (비소매용 보빈 권취)",
        "function": "자동차 에어백 및 타이어코드 직조용 합성섬유 필라멘트사",
        "expected_chapter": "54",
        "expected_heading": "5402"
    },
    {
        "id": 18,
        "name": "청바지 제조용 면/스판덱스 혼방 데님 직물 원단",
        "material": "면 98%, 폴리우레탄(Spandex) 2% 능직 직포 원단 (중량 380g/m2, 인디고 염색)",
        "function": "데님 청바지 및 캐주얼 의류 봉제용 면직물 원단",
        "expected_chapter": "52",
        "expected_heading": ["5209", "5211"]
    },
    {
        "id": 19,
        "name": "남성용 방한 직물제 구스다운 롱 패딩 점퍼",
        "material": "폴리에스테르 100% 직포 외피, 거위 솜털 90% 깃털 10% 충전재, 지퍼 여밈",
        "function": "남성 겨울철 방한 착용용 직물제 외투 파카 점퍼",
        "expected_chapter": "62",
        "expected_heading": "6201"
    },
    {
        "id": 20,
        "name": "여성용 100% 퓨어 캐시미어 니트 편물 스웨터",
        "material": "캐시미어 산양 모 100% 편물(Knitted fabric), 긴소매 풀오버",
        "function": "여성 보온 착용용 편물제 스웨터 풀오버 의류",
        "expected_chapter": "61",
        "expected_heading": "6110"
    },
    {
        "id": 21,
        "name": "가정용 100% 순면 테리 타월 바스타월 (Bath Towel)",
        "material": "면 100% 루프 파일 테리 직물(Terry towelling woven fabric, 봉제 마감)",
        "function": "목욕 후 수분 흡수용 가정용 면직물 타월",
        "expected_chapter": "63",
        "expected_heading": "6302"
    },
    {
        "id": 22,
        "name": "호텔 및 실내용 패브릭 직물 갑피 슬리퍼",
        "material": "폴리에스테르 직물 갑피, 발포 EVA 수지 바닥창",
        "function": "실내 및 호텔 객실 보행용 직물제 슬리퍼 신발",
        "expected_chapter": "64",
        "expected_heading": "6405"
    },

    # 5. 유리, 도자, 금속 및 공구군 (Ch 68 - 83)
    {
        "id": 23,
        "name": "건축 바닥 마감용 유약 포슬린 자기질 타일",
        "material": "고령토 점토 및 장석 고온 소성 (흡수율 0.5% 이하 도자제 타일, 600x600mm)",
        "function": "건물 실내 바닥 및 벽면 마감용 세라믹 도자 타일",
        "expected_chapter": "69",
        "expected_heading": "6907"
    },
    {
        "id": 24,
        "name": "가정용 식기세척기 도어용 열강화 안전 판유리",
        "material": "소다석회 판유리 열처리 급냉 강화 가공품 (가장자리 모따기 연마)",
        "function": "식기세척기 및 오븐 도어 전면 안전 유리 패널",
        "expected_chapter": "70",
        "expected_heading": "7007"
    },
    {
        "id": 25,
        "name": "건축 구조용 비합금 열간압연 H형강 (H-Beam)",
        "material": "비합금 구조용 탄소강(SS275) 열간 압연 성형 (단면 높이 300mm)",
        "function": "건축물 기둥 및 보 골조용 철강 열간압연 형강",
        "expected_chapter": "72",
        "expected_heading": "7216"
    },
    {
        "id": 26,
        "name": "석유화학 플랜트용 스테인리스 심리스(무계목) 강관",
        "material": "SUS316L 오스테나이트계 스테인리스 강재 열간 압출 이음매 없는 파이프",
        "function": "고온 고압 부식성 유체 이송용 철강 무계목 배관 파이프",
        "expected_chapter": "73",
        "expected_heading": "7304"
    },
    {
        "id": 27,
        "name": "건축 창호용 6063 알루미늄 합금 압출 형재 (Profile)",
        "material": "Al-Mg-Si계 6063 알루미늄 합금 열간 압출 성형 바/형재 (양극산화 피막)",
        "function": "시스템 창호 프레임 제작용 알루미늄 압출 형재",
        "expected_chapter": "76",
        "expected_heading": "7604"
    },
    {
        "id": 28,
        "name": "배관 및 볼트 체결용 수동 조절식 몽키 스패너 (10인치)",
        "material": "크롬 바나듐 합금강 단조 열처리 가공, 웜기어 조절 죠",
        "function": "볼트 및 너트 수동 조임/풀림용 조절식 스패너 수공구",
        "expected_chapter": "82",
        "expected_heading": "8204"
    },
    {
        "id": 29,
        "name": "목재 및 석고보드용 아연도금 십자머리 태핑 나사",
        "material": "침탄 탄소강 열처리, 전기 아연도금 표면처리, 십자홈 머리",
        "function": "목재 및 판재 체결 고정용 셀프 태핑 철강 나사",
        "expected_chapter": "73",
        "expected_heading": "7318"
    },
    {
        "id": 30,
        "name": "사무용 서류철 바인더용 금속제 3공 링 메커니즘",
        "material": "비합금 강판 프레스 성형, 니켈 도금, 개폐 레버 기구",
        "function": "바인더 및 서류철 문서 철 결속용 비금속제 고정 철물",
        "expected_chapter": "83",
        "expected_heading": "8305"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "플라스틱 시트 성형용 단축 스크루 압출 성형기",
        "material": "질화강 단일 스크루, 전기 히터 가열 배럴, 감속 구동 모터",
        "function": "열가소성 플라스틱 수지를 용융 연속 압출 성형하는 플라스틱 가공 기계",
        "expected_chapter": "84",
        "expected_heading": "8477"
    },
    {
        "id": 32,
        "name": "수처리 플랜트용 고압 다단 원심 액체 펌프",
        "material": "스테인리스 임펠러 5단 적층, 주철 케이싱, 15kW 3상 유도전동기",
        "function": "공업용수 및 정수를 고압으로 가압 이송하는 원심식 액체 펌프",
        "expected_chapter": "84",
        "expected_heading": "8413"
    },
    {
        "id": 33,
        "name": "지역난방 플랜트용 스테인리스 판형 열교환기 (PHE)",
        "material": "SUS316L 파형 스테인리스 전열 플레이트 적층, EPDM 가스켓, 고정 프레임",
        "function": "고온 열수와 난방수 간에 열을 간접 교환시키는 판형 열교환 장치",
        "expected_chapter": "84",
        "expected_heading": "8419"
    },
    {
        "id": 34,
        "name": "스마트 물류창고용 파렛트 자동 입출고 스태커 크레인",
        "material": "트윈 마스트 철골 프레임, 승강 캐리지 포크 유닛, AC 서보 구동 시스템",
        "function": "고층 랙에 파렛트 화물을 자동으로 적재 및 입출고 운반하는 적재 운반기계",
        "expected_chapter": "84",
        "expected_heading": "8428"
    },
    {
        "id": 35,
        "name": "공기압 배관용 냉동식 압축공기 에어 드라이어",
        "material": "냉매 압축기, 판형 증발기 열교환기, 수분 분리기, 자동 배출 드레인 밸브",
        "function": "압축공기 중의 수분을 냉각 응축시켜 제거 건조하는 공기 조화/정화기기",
        "expected_chapter": "84",
        "expected_heading": ["8419", "8421"]
    },
    {
        "id": 36,
        "name": "금속 박판 성형 가공용 200톤 싱글 유압 프레스 머신",
        "material": "주강 프레임, 대구경 메인 유압 실린더, 유압 밸브 블록, 서보 유압 펌프",
        "function": "유압 압력으로 자동차 판넬 및 금속판을 프레스 성형 가공하는 금속가공기계",
        "expected_chapter": "84",
        "expected_heading": "8462"
    },

    # 7. 전기, 전자, 통신 및 센서 (Ch 85)
    {
        "id": 37,
        "name": "태양광 발전 시스템용 단결정 실리콘 태양광 패널 모듈 (400W)",
        "material": "단결정 실리콘 태양전지 셀 72개 직렬 결선, 강화유리, 알루미늄 프레임, 정션박스",
        "function": "태양광 빛에너지를 광전 효과를 통해 직류 전기에너지로 변환 발전하는 태양전지 모듈",
        "expected_chapter": "85",
        "expected_heading": "8541"
    },
    {
        "id": 38,
        "name": "변전소 송배전용 3상 대형 유입 변압기 (30MVA)",
        "material": "방향성 규소강판 코어, 절연유 충진 탱크, 무산소동 권선, 부싱",
        "function": "154kV 송전 전압을 22.9kV 배전 전압으로 강압 변환하는 대용량 전력 변압기",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 39,
        "name": "전기차 충전용 벽걸이형 7kW 완속 교류(AC) 충전기",
        "material": "전력 제어 MCU 기판, AC 마그네틱 접촉기(릴레이), 누전차단기, 충전 커넥터 케이블",
        "function": "상용 AC 전원을 전기차 탑재 배터리 완속 충전용으로 안전 공급 제어하는 충전 장치",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 40,
        "name": "스마트폰용 5G 고주파 무선통신 프론트엔드 모듈(FEM) 집적회로",
        "material": "GaAs 전력증폭기 칩, RF 스위치 다이, 박막 필터 일체화 SiP 모놀리식 집적회로",
        "function": "5G 이동통신 고주파 무선 송수신 신호를 증폭 및 스위칭하는 전자집적회로(IC)",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 41,
        "name": "가정용 IoT 스마트 공기청정기",
        "material": "DC BLDC 송풍 팬 모터, HEPA H13 필터, 활성탄 필터, Wi-Fi 통신 기판",
        "function": "실내 공기 중의 미세먼지 및 유해가스를 필터로 흡착 정화하는 공기정화기",
        "expected_chapter": "84",
        "expected_heading": "8421"
    },
    {
        "id": 42,
        "name": "스마트폰용 능동형 유기발광다이오드(AMOLED) 평판 디스플레이 패널",
        "material": "LTPS 유리 기판, RGB 유기 발광층 증착 박막, 편광필름 (터치스크린 센서 미일체형)",
        "function": "화상 및 텍스트를 전기 신호에 따라 유기 자발광으로 표시하는 평판 디스플레이 모듈",
        "expected_chapter": "85",
        "expected_heading": "8524"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "도시철도용 통근형 전동차 지하철 차량 (EMU)",
        "material": "스테인리스 차체, 200kW VVVF 유도 전동기 대차, 팬터그래프, 승객용 좌석",
        "function": "가공전차선 전력으로 자체 구동하여 도시철도 승객을 수송하는 자체추진 철도차량",
        "expected_chapter": "86",
        "expected_heading": "8603"
    },
    {
        "id": 44,
        "name": "도심 배달용 4스트로크 가솔린 엔진 스쿠터 오토바이 (배기량 125cc)",
        "material": "강관 프레임, 124.6cc 단기통 가솔린 엔진, 무단변속기(CVT), 2개 바퀴",
        "function": "1~2인이 탑승하여 도로를 주행하는 엔진 배기량 125cc 이하 2륜 모터사이클",
        "expected_chapter": "87",
        "expected_heading": "8711"
    },
    {
        "id": 45,
        "name": "병원 임상 진단용 디지털 X-ray 엑스선 촬영 시스템",
        "material": "X선 튜브 고전압 발생기, CsI 평판 디지털 검출기(FPD), 갠트리 지지대",
        "function": "인체 흉부 및 골격 부위를 엑스선으로 투시 촬영 진단하는 방사선 의료기기",
        "expected_chapter": "90",
        "expected_heading": "9022"
    },
    {
        "id": 46,
        "name": "치과 충치 치료용 에어 터빈 전동 핸드피스 드릴",
        "material": "티타늄 하우징, 마이크로 세라믹 베어링 에어 터빈, 주수 노즐, 버 결속 척",
        "function": "치과 치아 절삭 및 충치 와동 형성에 사용하는 치과용 회전 기구",
        "expected_chapter": "90",
        "expected_heading": "9018"
    },
    {
        "id": 47,
        "name": "콘서트 연주용 어쿠스틱 그랜드 피아노 (Grand Piano)",
        "material": "스프루스 원목 음향판, 주철 프레임, 88개 목재 건반 및 펠트 해머 현 타현 기구",
        "function": "건반을 눌러 현을 해머로 타현하여 음을 발생시키는 클래식 건반 악기",
        "expected_chapter": "92",
        "expected_heading": "9201"
    },
    {
        "id": 48,
        "name": "스포츠용 쿼츠 전자 디지털 LCD 손목시계",
        "material": "합성수지(우레탄) 케이스 및 밴드, 쿼츠 크리스탈 무브먼트, 디지털 액정 표시창",
        "function": "손목에 착용하여 현재 시각 및 스톱워치를 디지털 표시하는 손목시계",
        "expected_chapter": "91",
        "expected_heading": "9102"
    },
    {
        "id": 49,
        "name": "사무용 유성 잉크 캡식 볼펜 (Ballpoint Pen 0.7mm)",
        "material": "PP 플라스틱 배럴 및 캡, 초경합금 텅스텐 카바이드 볼(0.7mm), 유성 잉크",
        "function": "종이 위에 필기 및 서명 용도로 사용하는 볼포인트 펜",
        "expected_chapter": "96",
        "expected_heading": "9608"
    },
    {
        "id": 50,
        "name": "가정 거실용 3인용 패브릭 쿠션 소파 (Sofa)",
        "material": "원목 및 합판 프레임, 고탄성 폴리우레탄 폼 쿠션, 폴리에스테르 직물(Fabric) 커버",
        "function": "가정 거실에서 3인이 앉거나 휴식할 수 있는 패브릭 쿠션 의자 가구",
        "expected_chapter": "94",
        "expected_heading": "9401"
    }
]

def run_set5_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 5] 50개 완전히 새로운 수출입 품목 AI 정밀 품목분류 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET5_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET5_50_ITEMS, 1):
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
    total = len(SET5_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 5 결과 요약] 검증 완료!", flush=True)
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
    run_set5_test()
