# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 6 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 6)
SET6_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "냉동 식용 칠레산 연어 알 (Salmon Roe)",
        "material": "천연 연어 어란 100% (세척 후 급속 냉동, 소금/조미료 무첨가, 비소매 벌크)",
        "function": "식용 조리 및 스시 가공용 냉동 어류의 알",
        "expected_chapter": "03",
        "expected_heading": "0303"
    },
    {
        "id": 2,
        "name": "천연 터키산 건조 무화과 과실 (Dried Figs)",
        "material": "무화과 100% (햇볕 자연 건조, 설탕이나 감미료 무첨가)",
        "function": "간식 및 제과 제빵용 건조 과실",
        "expected_chapter": "08",
        "expected_heading": "0804"
    },
    {
        "id": 3,
        "name": "식용 미정제 팜유 조유 (Crude Palm Oil)",
        "material": "기름야자(Oil Palm) 과육 물리적 압착 조유 100% (화학적 변성 없음)",
        "function": "식용 정제유 및 마가린 제조 원료용 식물성 고정유",
        "expected_chapter": "15",
        "expected_heading": "1511"
    },
    {
        "id": 4,
        "name": "천연 마다가스카르산 건조 바닐라 빈 꼬투리 (Vanilla Beans)",
        "material": "천연 바닐라 열매 꼬투리 100% (발효 및 건조)",
        "function": "제과 및 요리용 향신료",
        "expected_chapter": "09",
        "expected_heading": "0905"
    },
    {
        "id": 5,
        "name": "가축 사료 제조용 어분 펠릿 (Fish Meal)",
        "material": "식용 부적합 어류 및 어류 부산물 증자 건조 분말 100% (펠릿화)",
        "function": "양식 어류 및 가축 사료 원료용 동물성 단백질 부산물",
        "expected_chapter": "23",
        "expected_heading": "2301"
    },
    {
        "id": 6,
        "name": "제빵용 활성 인스턴트 건조 효모 (Active Dry Yeast)",
        "material": "사카로미세스 세레비시에(Saccharomyces cerevisiae) 건조 균체 99%, 유화제 1%",
        "function": "빵 반죽 발효 팽창용 식용 배양 건조 효모",
        "expected_chapter": "21",
        "expected_heading": "2102"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "공업용 고순도 화학 침전 탄산칼슘 분말 (PCC)",
        "material": "화학적 합성 침전 탄산칼슘(CaCO3 99.2% 무기화합물 분말)",
        "function": "제지 코팅 및 플라스틱 고무 충전재용 화학 원료",
        "expected_chapter": "28",
        "expected_heading": "2836"
    },
    {
        "id": 8,
        "name": "공업용 무변성 순수 에틸알코올 (에탄올 99.5% vol)",
        "material": "에틸렌 합성 에틸알코올 (알코올 도수 99.5% vol, 변성제 무첨가)",
        "function": "화학 합성 및 의약품 용제용 무변성 에틸알코올",
        "expected_chapter": "22",
        "expected_heading": "2207"
    },
    {
        "id": 9,
        "name": "반도체 포토레지스트 현상액용 테트라메틸암모늄 하이드록사이드 (TMAH 25%)",
        "material": "테트라메틸암모늄 하이드록사이드(TMAH) 25%, 초순수 75% (제4급 암모늄염 수용액)",
        "function": "반도체 및 디스플레이 노광 공정용 전자급 알칼리 현상액 원료",
        "expected_chapter": "29",
        "expected_heading": "2923"
    },
    {
        "id": 10,
        "name": "파이프 및 창호 프로파일 압출용 폴리염화비닐(PVC) 수지 분말",
        "material": "염화비닐 단일중합체 분말 100% (가소제 미첨가, 1차제품)",
        "function": "경질 PVC 파이프 및 건축자재 성형용 합성수지 1차제품",
        "expected_chapter": "39",
        "expected_heading": "3904"
    },
    {
        "id": 11,
        "name": "산업 기계용 섬유 보강 가황 합성고무제 압축공기 호스",
        "material": "내유성 NBR 합성고무 내관, 고장력 폴리에스테르 편조 섬유 보강층, EPDM 외피 (피팅 금구 미부착)",
        "function": "공장 자동화 에어 공구용 압축공기 이송 가황고무 호스",
        "expected_chapter": "40",
        "expected_heading": "4009"
    },
    {
        "id": 12,
        "name": "외과 수술용 멸균 흡수성 합성 봉합사 세트 (Surgical Suture)",
        "material": "폴리글리콜산(PGA) 멸균 합성 흡수성 원사 및 스테인리스 수술용 바늘 일체형 세트",
        "function": "외과 수술 시 생체 조직 결합 및 봉합용 의료용품",
        "expected_chapter": "30",
        "expected_heading": "3006"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "식물성 탄닝 유연 크러스트 말 가죽 (마피)",
        "material": "말 원피 제모 후 베지터블 탄닝 처리한 크러스트 상태의 피혁",
        "function": "고급 구두 갑피 및 가죽 가방 제조용 원단 가죽",
        "expected_chapter": "41",
        "expected_heading": ["4104", "4106"]
    },
    {
        "id": 14,
        "name": "가구 및 인테리어용 중밀도 목재 섬유판 (MDF 보드)",
        "material": "목재 섬유를 합성수지 접착제와 함께 고온 열압 성형 (밀도 0.7g/cm3, 두께 12mm)",
        "function": "가구 도어 및 실내 내장재 가공용 목재 섬유판",
        "expected_chapter": "44",
        "expected_heading": "4411"
    },
    {
        "id": 15,
        "name": "고급 화장품 포장 상자용 도포 백판지 (Coated Duplex Board)",
        "material": "화학 목재 펄프, 표면 카올린 백색 안료 도포 판지 (평량 350g/m2, 시트 형태)",
        "function": "포장용 단상자 및 박스 인쇄 인쇄용 도포 판지",
        "expected_chapter": "48",
        "expected_heading": "4810"
    },
    {
        "id": 16,
        "name": "인쇄된 상업용 벽걸이형 연간 달력 (Calendar)",
        "material": "아트지 12매(풀컬러 날짜 및 사진 인쇄), 상단 금속 와이어 트윈링 제본",
        "function": "벽면에 걸어 연간 날짜와 일정을 확인하는 인쇄된 달력",
        "expected_chapter": "49",
        "expected_heading": "4910"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "산업용 의류 직조용 100% 폴리에스테르 방적사 원사",
        "material": "폴리에스테르 스테이플 단섬유 방적 단사 (비소매용 콘 권취, 30수)",
        "function": "작업복 및 셔츠 직물 제직용 합성섬유 방적사",
        "expected_chapter": "55",
        "expected_heading": "5509"
    },
    {
        "id": 18,
        "name": "여성 고급 블라우스용 100% 천연 실크 견 평직 직물",
        "material": "생사(Silk) 100% 평직 직포 원단 (중량 60g/m2, 염색 가공)",
        "function": "고급 실크 블라우스 및 스카프 봉제용 견직물 원단",
        "expected_chapter": "50",
        "expected_heading": "5007"
    },
    {
        "id": 19,
        "name": "남성용 100% 면 직물제 클래식 트렌치코트",
        "material": "면 100% 고밀도 개버딘 직포 외피, 폴리에스테르 안감, 허리 벨트, 더블 단추 여밈",
        "function": "남성 환절기 착용용 직물제 외투 코트 의류",
        "expected_chapter": "62",
        "expected_heading": "6201"
    },
    {
        "id": 20,
        "name": "신생아용 순면 편물 배냇저고리 및 턱받이 세트",
        "material": "면 100% 싱글 인터록 편물(Knitted fabric), 부드러운 봉제 마감",
        "function": "신생아 피부 보호 및 착용용 편물제 유아복 세트",
        "expected_chapter": "61",
        "expected_heading": "6111"
    },
    {
        "id": 21,
        "name": "야외 캠핑용 PVC 양면 코팅 방수 타포린 텐트 천",
        "material": "폴리에스테르 고강력 직포 양면에 방수 PVC 수지 도포 코팅 및 테두리 아일렛 마감",
        "function": "캠핑용 방수포 및 화물 덮개용 직물제 타포린 완제품",
        "expected_chapter": "63",
        "expected_heading": "6306"
    },
    {
        "id": 22,
        "name": "남성용 천연 소가죽 갑피 클래식 옥스퍼드 정장 구두",
        "material": "천연 소가죽 은면 갑피(Leather upper), 고무 및 가죽 접합 밑창, 끈 결속",
        "function": "남성 정장 착용 및 보행용 가죽 갑피 신발",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },

    # 5. 유리, 도자, 금속 및 공구군 (Ch 68 - 83)
    {
        "id": 23,
        "name": "제철 전기로 라이닝용 마그네시아-카본계 염기성 내화벽돌",
        "material": "소결 마그네시아(MgO 82%), 흑연 탄소(14%), 유기 바인더 고온 소성 성형체",
        "function": "철강 용융로 및 전기로 고온 내화 라이닝용 도자제 내화물 벽돌",
        "expected_chapter": "69",
        "expected_heading": "6902"
    },
    {
        "id": 24,
        "name": "반도체 확산로 공정용 고순도 석영 유리관 (Quartz Tube)",
        "material": "용융 실리카 석영 유리 100% (SiO2 99.99%, 외경 200mm 원통형 관)",
        "function": "반도체 웨이퍼 열처리 공정 챔버용 고온 석영 유리관",
        "expected_chapter": "70",
        "expected_heading": "7002"
    },
    {
        "id": 25,
        "name": "건축 토목 구조용 비합금 열간압연 이형 철근 (Rebar)",
        "material": "비합금 탄소강 열간압연 성형, 표면 마디 및 리브 돌기 가공 (직경 19mm)",
        "function": "철근 콘크리트 골조 보강용 비합금강 철근 봉",
        "expected_chapter": "72",
        "expected_heading": "7214"
    },
    {
        "id": 26,
        "name": "초저온 LNG 이송 배관용 스테인리스 주름 벨로우즈 플렉시블 메탈 호스",
        "material": "SUS316L 얇은 강판 파형 주름 성형관, SUS304 와이어 브레이드 편조 외장, 플랜지 피팅",
        "function": "진동 흡수 및 초저온 가스 배관 연결용 유연성 스테인리스 금속관",
        "expected_chapter": "83",
        "expected_heading": "8307"
    },
    {
        "id": 27,
        "name": "알루미늄 음료 캔 바디 제조용 합금 압연 판재 코일",
        "material": "Al-Mn계 3104 알루미늄 합금 냉간 압연 코일 (두께 0.26mm, 폭 1,200mm)",
        "function": "탄산음료 및 맥주 캔 딥드로잉 성형용 알루미늄 판재",
        "expected_chapter": "76",
        "expected_heading": "7606"
    },
    {
        "id": 28,
        "name": "배관 및 정비용 수동 바이스 그립 잠금 플라이어 (Locking Pliers)",
        "material": "크롬몰리브덴 합금강 단조 가공, 토글 링크 잠금 기구, 압착 조",
        "function": "공작물을 강력하게 고정 클램핑하거나 볼트를 회전시키는 수동 플라이어 공구",
        "expected_chapter": "82",
        "expected_heading": "8203"
    },
    {
        "id": 29,
        "name": "건축 철골 접합용 10.9등급 고장력 육각 볼트 및 너트 세트",
        "material": "합금강(SCM435) 열처리 가공, 나사산 가공, 육각 헤드 볼트 및 너트 일체형",
        "function": "건축 H형강 및 철골 구조물 체결용 철강 볼트 너트 제품",
        "expected_chapter": "73",
        "expected_heading": "7318"
    },
    {
        "id": 30,
        "name": "사무실용 강철제 3단 이동식 서류 보관 캐비닛 서랍장",
        "material": "냉간압연 강판(SPCC) 프레스 성형 및 정전 분체도장, 볼베어링 레일, 열쇠 잠금장치, 바퀴",
        "function": "사무실 책상 하부에 배치하여 문서와 서류를 수납 보관하는 사무용 금속 가구",
        "expected_chapter": "94",
        "expected_heading": "9403"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "반도체 에칭 챔버용 자기부상 복합 터보 분자 진공 펌프 (TMP)",
        "material": "알루미늄 합금 다단 터빈 로터 블레이드, 자기베어링 유닛, 내장형 고주파 전동기 드라이버",
        "function": "반도체 챔버 내부를 초고진공 상태로 배기 유지하는 기체 진공 펌프",
        "expected_chapter": "84",
        "expected_heading": "8414"
    },
    {
        "id": 32,
        "name": "대용량 스낵 제조용 산업용 연속 자동 전기 튀김기",
        "material": "SUS304 스테인리스 유조, 침지식 전기 가열 히터, 메쉬 컨베이어 벨트, 유온 제어반",
        "function": "고온 식용유로 스낵 및 치킨을 연속 가열 튀김 조리하는 산업용 식품 가공 기계",
        "expected_chapter": "84",
        "expected_heading": "8419"
    },
    {
        "id": 33,
        "name": "전자회로기판(PCB) 표면실장용 초고속 다기능 칩 마운터",
        "material": "리니어 모터 구동 갠트리, 멀티 비전 얼라인먼트 카메라, 진공 흡착 노즐 헤드 16개",
        "function": "PCB 기판 위에 SMD 초소형 전자부품을 고속 정밀 픽앤플레이스 실장하는 기계",
        "expected_chapter": "84",
        "expected_heading": ["8479", "8486"]
    },
    {
        "id": 34,
        "name": "자동차 타이어 성형용 유압식 큐어링 가황 프레스 머신",
        "material": "주강 프레임, 스팀 가열 돔 챔버, 타이어 분할 몰드 메커니즘, 메인 유압 실린더",
        "function": "미가황 그린타이어에 열과 압력을 가해 패턴과 고무 물성을 완성하는 고무 가공기계",
        "expected_chapter": "84",
        "expected_heading": "8477"
    },
    {
        "id": 35,
        "name": "공장 자동화 라인용 6축 다관절 수직 산업용 로봇암",
        "material": "알루미늄 주물 암 링크, 6개 AC 서보 모터 및 정밀 RV 감속기 관절, 로봇 제어반",
        "function": "프로그래밍에 의해 용접, 조립, 이송 작업을 다목적으로 수행하는 산업용 로봇 기계",
        "expected_chapter": "84",
        "expected_heading": "8479"
    },
    {
        "id": 36,
        "name": "플랜트 배관용 스테인리스 플랜지식 2피스 볼 밸브 (SUS316 2인치)",
        "material": "SUS316 스테인리스 스틸 주강 바디, PTFE 시트, 크롬도금 구형 볼, 수동 레버",
        "function": "배관 내 유체의 흐름을 90도 회전 볼로 개폐 차단하는 유체 제어 밸브",
        "expected_chapter": "84",
        "expected_heading": "8481"
    },

    # 7. 전기, 전자, 통신 및 센서 (Ch 85)
    {
        "id": 37,
        "name": "전기차 배터리팩용 삼원계 리튬이온 NCM 파우치 배터리 셀 (3.7V 60Ah)",
        "material": "NCM811 양극판, 실리콘-흑연 복합 음극판, 세라믹 코팅 분리막, 알루미늄 파우치 외장",
        "function": "화학 에너지를 충전 및 방전하여 전기차 모터에 전력을 공급하는 리튬이온 축전지",
        "expected_chapter": "85",
        "expected_heading": "8507"
    },
    {
        "id": 38,
        "name": "신재생에너지 인버터용 1200V 탄화규소(SiC) 쇼트키 배리어 다이오드",
        "material": "SiC 반도체 칩, 무산소동 리드프레임, 에폭시 몰딩 패키지(TO-247-2L)",
        "function": "고전압 전력 변환 회로에서 역방향 전류를 저지하고 고속 스위칭 정류하는 개별 반도체 소자",
        "expected_chapter": "85",
        "expected_heading": "8541"
    },
    {
        "id": 39,
        "name": "엔터프라이즈 네트워크용 48포트 기가비트 이더넷 L3 스위칭 허브",
        "material": "L3 패킷 스위칭 ASIC 칩셋, 48개 RJ45 기가비트 포트, 4개 10G SFP+ 광포트, 전원 모듈",
        "function": "유선 랜 네트워크에서 데이터 패킷을 목적지 IP로 고속 라우팅 및 스위칭 중계하는 통신기기",
        "expected_chapter": "85",
        "expected_heading": "8517"
    },
    {
        "id": 40,
        "name": "스마트폰용 마이크로 다이내믹 스피커 리시버 유닛",
        "material": "네오디뮴 영구자석, 극박 폴리머 진동판, 구리 보이스코일, 사각 금속 프레임 (외형 12x15mm)",
        "function": "전기 음향 신호를 진동판의 기계적 진동으로 변환하여 가청 소리를 출력하는 마이크로 스피커",
        "expected_chapter": "85",
        "expected_heading": "8518"
    },
    {
        "id": 41,
        "name": "가정 주방용 인덕션 IH 및 전자레인지 복합 조리기",
        "material": "IH 유도 가열 코일, 2.45GHz 마그네트론 고주파 발진기, 세라믹 글래스 상판, 디지털 터치 PCB",
        "function": "전자유도 가열과 마이크로파 전자기파로 음식물을 가열 조리하는 주방용 전열기기",
        "expected_chapter": "85",
        "expected_heading": "8516"
    },
    {
        "id": 42,
        "name": "스마트 TV용 55인치 4K UHD 액정표시장치(LCD) 오픈셀 패널 모듈",
        "material": "TFT 어레이 유리 기판, 컬러필터 유리 기판, 액정(LC) 층, 소스/게이트 구동 COF IC (백라이트 미포함)",
        "function": "전기 신호에 따라 화소의 광투과율을 제어하여 영상을 표시하는 평판 디스플레이 모듈",
        "expected_chapter": "85",
        "expected_heading": "8524"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "레저 스포츠용 선외기 가솔린 모터 장착 알루미늄 파워보트 (선체 6.2m)",
        "material": "해양용 알루미늄 합금(5083) 선체, 150마력 선외기 엔진, 조타 콘솔, 6인승 시트",
        "function": "해상에서 레저 낚시 및 수상 스포츠를 즐기는 오락용 모터 선박",
        "expected_chapter": "89",
        "expected_heading": "8903"
    },
    {
        "id": 44,
        "name": "트레일러 견인용 디젤 대형 트랙터 트럭 헤드 (구동축 6x2)",
        "material": "13리터 터보 디젤 엔진(500마력), 12단 자동변속기, 캡 오버 차체, 피프스 휠(커플러)",
        "function": "컨테이너 반트레일러를 연결 견인하여 도로로 화물을 수송하는 트랙터 자동차",
        "expected_chapter": "87",
        "expected_heading": "8701"
    },
    {
        "id": 45,
        "name": "병원 임상 진단용 고해상도 디지털 컬러 초음파 영상 진단기",
        "material": "압전 세라믹 초음파 프로브 트랜스듀서, 디지털 빔포머 프로세서, 21.5인치 의료용 모니터",
        "function": "인체 복부 및 심장에 초음파를 송수신하여 단층 영상을 실시간 진단하는 의료용 기기",
        "expected_chapter": "90",
        "expected_heading": "9018"
    },
    {
        "id": 46,
        "name": "시력 보정 안경용 미장착 플라스틱 광학 렌즈 (굴절률 1.67)",
        "material": "열경화성 고굴절 광학 폴리머 수지(MR-7), 반사방지(AR) 멀티 코팅, 원형 미가공 블랭크",
        "function": "안경테에 삽입 연마 가공하기 전의 시력 보정용 단초점 안경 렌즈",
        "expected_chapter": "90",
        "expected_heading": "9001"
    },
    {
        "id": 47,
        "name": "음악 연주용 어쿠스틱 드레드넛 통기타 (Acoustic Guitar)",
        "material": "스프루스 원목 상판, 마호가니 측후판, 로즈우드 핑거보드, 6개 스틸 와이어 현, 크롬 헤드머신",
        "function": "손가락이나 피크로 현을 튕겨 울림통으로 소리를 내는 어쿠스틱 현악기",
        "expected_chapter": "92",
        "expected_heading": "9202"
    },
    {
        "id": 48,
        "name": "남성용 오토매틱 셀프와인딩 기계식 아날로그 손목시계",
        "material": "316L 스테인리스 스틸 케이스 및 브레이슬릿, 24석 기계식 무브먼트, 로터 태엽 와인딩, 사파이어 크리스탈",
        "function": "착용자의 팔 움직임으로 태엽을 감아 바늘로 시각을 표시하는 기계식 손목시계",
        "expected_chapter": "91",
        "expected_heading": "9102"
    },
    {
        "id": 49,
        "name": "사무용 친환경 플라스틱 성형 지우개 (Eraser)",
        "material": "비프탈레이트 가소화 폴리염화비닐(PVC) 수지 성형 블록, 종이 슬리브",
        "function": "종이에 연필로 필기한 흑연 자국을 마찰로 지우는 플라스틱제 지우개 문구용품",
        "expected_chapter": "39",
        "expected_heading": "3926"
    },
    {
        "id": 50,
        "name": "가정용 독립 포켓 스프링 침대 매트리스 (Queen Size)",
        "material": "탄소강 독립 포켓 스프링 코일 어셈블리, 고밀도 폼 패딩, 자카드 직물 퀼팅 커버 (두께 28cm)",
        "function": "침대 프레임 위에 얹어 수면과 휴식을 취하는 독립 스프링 침대 매트리스",
        "expected_chapter": "94",
        "expected_heading": "9404"
    }
]

def run_set6_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 6] 50개 완전히 새로운 수출입 품목 AI 정밀 품목분류 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET6_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET6_50_ITEMS, 1):
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
    total = len(SET6_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 6 결과 요약] 검증 완료!", flush=True)
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
    run_set6_test()
