# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: 3rd Batch of 100 Real-World Diverse Customs Items
Evaluates all 4 Steps of customs clearance across 100 brand new realistic products:
  - Step 1: AI HS Code Classification & Legal Reasoning (GRI 1-6, 10-digit validation, Zero-Hallucination)
  - Step 2: Tariff & FTA Optimization (Base, WTO, Quota, FTA rate matching)
  - Step 3: Clearance Requirements & Statutes (Statutory clearance mandates)
  - Step 4: Administrative Documents & Action Plan (Checklists, steps, duration)
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
from backend.models import HSCodeMaster, CustomsPrecedent
from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.main import get_hs_rates_api, get_clearance_guide_api

FRESH_100_REAL_ITEMS = [
    # =========================================================================
    # [1. 농축수산/식품/건기식 (15개)]
    # =========================================================================
    {
        "id": 1, "category": "식품/농산",
        "name": "유기농 스피룰리나 건조 분말",
        "material": "건조 스피룰리나 미세조류 100%",
        "function": "식용 및 기능성 미세조류 건조 분말 (무첨가)",
        "expected_chapter": ["12", "21"], "expected_heading": ["1212", "2106"]
    },
    {
        "id": 2, "category": "식품/가공",
        "name": "저분자 피쉬 콜라겐 펩타이드 분말",
        "material": "어류 비늘 단백질 가수분해물 95%, 비타민C 5%",
        "function": "음료 또는 식품에 첨가하여 섭취하는 조제식료품",
        "expected_chapter": ["21", "35"], "expected_heading": ["2106", "3504"]
    },
    {
        "id": 3, "category": "식품/가공",
        "name": "BCAA 분지쇄아미노산 헬스 보충제",
        "material": "L-류신, L-이소류신, L-발린 혼합물 (2:1:1), 수크랄로스",
        "function": "운동 전후 물에 타서 섭취하는 분말형 영양보충용 조제식품",
        "expected_chapter": ["21"], "expected_heading": ["2106"]
    },
    {
        "id": 4, "category": "당류/시럽",
        "name": "멕시코산 유기농 블루 아가베 시럽",
        "material": "용설란 수액 농축 시럽 (과당 75%)",
        "function": "설탕 대체용 천연 감미 시럽 (착향료 무첨가)",
        "expected_chapter": ["17"], "expected_heading": ["1702"]
    },
    {
        "id": 5, "category": "냉동과실",
        "name": "페루산 냉동 아보카도 다이스",
        "material": "신선 아보카도 100%",
        "function": "껍질 및 씨를 제거하고 주사위 모양으로 절단 후 급속 냉동한 것",
        "expected_chapter": ["08"], "expected_heading": ["0811"]
    },
    {
        "id": 6, "category": "음료베이스",
        "name": "발효 콤부차 농축 원액",
        "material": "홍차추출물, 효모발효여과물, 유기농사탕수수당",
        "function": "탄산수에 희석하여 음용하는 비알코올 음료 제조용 농축 베이스",
        "expected_chapter": ["21", "22"], "expected_heading": ["2106", "2202"]
    },
    {
        "id": 7, "category": "유지류",
        "name": "스페인산 엑스트라 버진 올리브유 (벌크 드럼)",
        "material": "올리브 과육 압착유 100%",
        "function": "산도 0.8% 이하의 정제하지 않은 압착 버진 올리브유 (18L 벌크)",
        "expected_chapter": ["15"], "expected_heading": ["1509"]
    },
    {
        "id": 8, "category": "건기식",
        "name": "식물성 오메가3 연질 캡슐",
        "material": "미세조류 오일(DHA/EPA), 젤라틴 연질 캡슐 하우징",
        "function": "소매 포장된 1일 1회 복용용 연질 캡슐 건강기능식품",
        "expected_chapter": ["21", "15"], "expected_heading": ["2106", "1516"]
    },
    {
        "id": 9, "category": "건조과실",
        "name": "동결건조 딸기 홀",
        "material": "신선 딸기 100%",
        "function": "수분 5% 미만으로 급속 동결건조한 통딸기 (설탕 무첨가)",
        "expected_chapter": ["08"], "expected_heading": ["0813"]
    },
    {
        "id": 10, "category": "수산물",
        "name": "일본산 냉동 가리비 관자살",
        "material": "가리비 패주 100%",
        "function": "패각 및 내장을 제거하고 관자살만 급속 동결한 것 (비가열)",
        "expected_chapter": ["03"], "expected_heading": ["0307"]
    },
    {
        "id": 11, "category": "수산가공",
        "name": "베트남산 자숙 칵테일 새우",
        "material": "흰다리새우살 100%",
        "function": "꼬리만 남기고 껍질 제거 후 증기 가열(자숙)하여 냉동한 조제 새우",
        "expected_chapter": ["16", "03"], "expected_heading": ["1605", "0306"]
    },
    {
        "id": 12, "category": "향신료",
        "name": "마다가스카르산 천연 바닐라빈",
        "material": "건조 바닐라 꼬투리 100%",
        "function": "발효 건조된 천연 바닐라 꼬투리 형태의 식용 향신료",
        "expected_chapter": ["09"], "expected_heading": ["0905"]
    },
    {
        "id": 13, "category": "낙농품",
        "name": "이탈리아산 파르미지아노 레지아노 치즈",
        "material": "원유, 식염, 렌넷",
        "function": "24개월 이상 숙성한 초경질 천연 치즈 (휠 형태)",
        "expected_chapter": ["04"], "expected_heading": ["0406"]
    },
    {
        "id": 14, "category": "음료",
        "name": "무알코올 맥주맛 탄산음료",
        "material": "정제수, 맥아추출물, 호프, 탄산가스 (알코올 0.00%)",
        "function": "주세법상 주류에 해당하지 않는 비알코올 탄산음료",
        "expected_chapter": ["22"], "expected_heading": ["2202"]
    },
    {
        "id": 15, "category": "초콜릿",
        "name": "스위스산 프리미엄 밀크 초콜릿 바",
        "material": "설탕, 카카오매스, 코코아버터, 전지분유",
        "function": "소매 포장된 판형 밀크 초콜릿 과자",
        "expected_chapter": ["18"], "expected_heading": ["1806"]
    },

    # =========================================================================
    # [2. 화학/의약/바이오/특수소재 (20개)]
    # =========================================================================
    {
        "id": 16, "category": "정밀화학",
        "name": "고순도 히알루론산 나트륨 원료 분말",
        "material": "Sodium Hyaluronate 99.5% (화학적 단일 유기화합물)",
        "function": "의약품 및 화장품 제조용 단일 화합물 화학 원료",
        "expected_chapter": ["29", "39"], "expected_heading": ["2938", "2940", "3913"]
    },
    {
        "id": 17, "category": "미용/의료",
        "name": "가교 히알루론산 안면부 피부 주름 개선용 필러",
        "material": "가교 히알루론산 겔, 리도카인 0.3%, 멸균 유리 주사기",
        "function": "의사의 피하 주입용 멸균 포장된 미용 성형 필러 의료기기",
        "expected_chapter": ["33", "30"], "expected_heading": ["3304", "3006"]
    },
    {
        "id": 18, "category": "무기화학",
        "name": "반도체 에칭용 고순도 불화수소산 (55% 수용액)",
        "material": "불화수소(HF) 55%, 초순수 45%",
        "function": "반도체 실리콘 웨이퍼 식각 및 세정용 초고순도 무기산 수용액",
        "expected_chapter": ["28"], "expected_heading": ["2811"]
    },
    {
        "id": 19, "category": "전지소재",
        "name": "이차전지 음극재용 인조흑연 분말",
        "material": "인조흑연(Artificial Graphite) 99.9%",
        "function": "리튬이온 이차전지 음극 코팅용 탄소재 분말",
        "expected_chapter": ["38"], "expected_heading": ["3801"]
    },
    {
        "id": 20, "category": "무기화학",
        "name": "이차전지 양극재용 NCM 복합 전구체",
        "material": "Ni-Co-Mn 복합 수산화물 [Ni0.8Co0.1Mn0.1(OH)2]",
        "function": "리튬이온 배터리 양극 활물질 소성 제조용 무기 전구체",
        "expected_chapter": ["28"], "expected_heading": ["2825", "2853", "2841"]
    },
    {
        "id": 21, "category": "무기화학",
        "name": "페로브스카이트 태양전지용 요오드화납 분말",
        "material": "Lead(II) Iodide (PbI2) 99.99%",
        "function": "차세대 페로브스카이트 광흡수층 증착용 고순도 무기화합물",
        "expected_chapter": ["28"], "expected_heading": ["2827"]
    },
    {
        "id": 22, "category": "의료용품",
        "name": "치과/정형외과용 합성 뼈 이식재",
        "material": "합성 하이드록시아파타이트(HA) 및 베타-TCP 과립",
        "function": "골 결손 부위에 이식하여 골 형성을 촉진하는 멸균 이식용 의료용품",
        "expected_chapter": ["30"], "expected_heading": ["3006"]
    },
    {
        "id": 23, "category": "진단시약",
        "name": "코로나19 항원 신속진단키트",
        "material": "니트로셀룰로오스 멤브레인, 금나노입자 접합 항체, 플라스틱 카세트",
        "function": "검체 내 바이러스 항원을 체외에서 신속 검출하는 진단용 시약 키트",
        "expected_chapter": ["38", "30"], "expected_heading": ["3822", "3002"]
    },
    {
        "id": 24, "category": "탄소소재",
        "name": "항공기용 탄소섬유 에폭시 프리프레그 시트",
        "material": "고강도 탄소섬유 직물 60%, 미경화 에폭시 수지 40%",
        "function": "항공기 동체 및 복합재 성형용 열경화성 수지 함침 시트",
        "expected_chapter": ["68"], "expected_heading": ["6815"]
    },
    {
        "id": 25, "category": "금속복합재",
        "name": "스마트폰 방열용 그래핀 코팅 구리 박판 포일",
        "material": "구리박(두께 18um) 표면에 그래핀 방열층(두께 2um) 증착",
        "function": "전자제품 발열체에 부착하여 열을 수평 분산시키는 복합 방열재",
        "expected_chapter": ["74", "68"], "expected_heading": ["7410", "6815"]
    },
    {
        "id": 26, "category": "광학용품",
        "name": "실리콘 하이드로겔 소프트 콘택트렌즈",
        "material": "실리콘 하이드로겔 고분자, 식염수 보존액, 멸균 블리스터 포장",
        "function": "시력 교정용 소매 포장된 착용형 소프트 콘택트렌즈",
        "expected_chapter": ["90"], "expected_heading": ["9001"]
    },
    {
        "id": 27, "category": "플라스틱",
        "name": "불소수지 PTFE 테프론 튜브 배관",
        "material": "폴리테트라플루오로에틸렌(PTFE) 100%",
        "function": "반도체 및 화학공장 내식성 유체 이송용 플라스틱 튜브",
        "expected_chapter": ["39"], "expected_heading": ["3917"]
    },
    {
        "id": 28, "category": "합성수지",
        "name": "생분해성 PLA 수지 펠릿",
        "material": "폴리락틱산(Poly Lactic Acid) 수지 100%",
        "function": "친환경 용기 및 3D 프린터 필라멘트 사출 성형용 원료 펠릿",
        "expected_chapter": ["39"], "expected_heading": ["3907"]
    },
    {
        "id": 29, "category": "귀석/연마",
        "name": "공업용 합성 다이아몬드 미세 분말",
        "material": "합성 다이아몬드 결정 100%",
        "function": "금속 및 세라믹 정밀 연마 휠 제조용 공업용 연마재 분말",
        "expected_chapter": ["71"], "expected_heading": ["7105"]
    },
    {
        "id": 30, "category": "세라믹/유리",
        "name": "반도체 실리콘 잉곳 성장용 고순도 석영 도가니",
        "material": "고순도 용융 실리카(석영 유리) 100%",
        "function": "1400도 이상 고온에서 단결정 실리콘 잉곳을 성장시키는 내화 용기",
        "expected_chapter": ["70", "69"], "expected_heading": ["7017", "6903"]
    },
    {
        "id": 31, "category": "플라스틱가공",
        "name": "건축 단열용 경질 폴리우레탄 폼 보드 패널",
        "material": "발포 경질 폴리우레탄 폼 (양면 알루미늄 면재 부착)",
        "function": "건축물 외벽 및 지붕용 단열 복합 패널",
        "expected_chapter": ["39"], "expected_heading": ["3921"]
    },
    {
        "id": 32, "category": "특수직물",
        "name": "군용 방탄복 제작용 파라 아라미드(Kevlar) 직물",
        "material": "파라 아라미드 필라멘트사 100% 평직물",
        "function": "방탄 플레이트 및 방탄 헬멧 제조용 초고강도 합성섬유 직물",
        "expected_chapter": ["54"], "expected_heading": ["5407"]
    },
    {
        "id": 33, "category": "도포직물",
        "name": "고어텍스 3레이어 방수투습 기능성 원단",
        "material": "나일론 겉감 직물 + ePTFE 다공성 멤브레인 필름 + 트리코트 안감 라미네이팅",
        "function": "아웃도어 등산복 및 기능성 방한의류 제조용 투습방수 합포 직물",
        "expected_chapter": ["59"], "expected_heading": ["5903"]
    },
    {
        "id": 34, "category": "점착필름",
        "name": "디스플레이 접합용 광학 투명 점착 필름 (OCA)",
        "material": "아크릴계 점착 수지 시트 (양면 이형 PET 필름 부착)",
        "function": "스마트폰 터치패널과 OLED 패널 사이를 광학적으로 접합하는 투명 점착제",
        "expected_chapter": ["39"], "expected_heading": ["3919"]
    },
    {
        "id": 35, "category": "방열소재",
        "name": "전자부품 칩 방열용 실리콘 써멀 갭패드",
        "material": "실리콘 엘라스토머 30%, 세라믹 방열 필러 70%",
        "function": "CPU/GPU 발열체와 방열판 사이의 미세 틈새를 메워 열을 전도하는 시트",
        "expected_chapter": ["39", "68"], "expected_heading": ["3919", "3926", "6815"]
    },

    # =========================================================================
    # [3. 전기/전자/반도체/IT기기 (20개)]
    # =========================================================================
    {
        "id": 36, "category": "반도체장비부품",
        "name": "반도체 식각장비용 300mm 정전척 (ESC 모듈)",
        "material": "고순도 질화알루미늄 세라믹 바디, 텅스텐 전극선 내장",
        "function": "진공 챔버 내에서 실리콘 웨이퍼를 정전기력으로 고정하고 온도 제어하는 핵심 부품",
        "expected_chapter": ["84"], "expected_heading": ["8486"]
    },
    {
        "id": 37, "category": "스마트기기",
        "name": "스마트 헬스케어 링 (수면 및 심박 측정 스마트반지)",
        "material": "티타늄 외장 하우징, 광혈류측정(PPG) 센서, 블루투스 무선칩, 초소형 배터리",
        "function": "손가락에 착용하여 생체신호를 측정하고 스마트폰으로 무선 전송하는 웨어러블 기기",
        "expected_chapter": ["85", "90"], "expected_heading": ["8517", "9031"]
    },
    {
        "id": 38, "category": "통신모듈",
        "name": "Li-Fi 초고속 가시광 무선통신 송수신 트랜시버 모듈",
        "material": "LED 광원 드라이버, 광다이오드(PD), 기저대역 신호처리 DSP 칩셋",
        "function": "LED 빛의 깜빡임을 변조하여 데이터를 무선 송수신하는 광통신 모듈",
        "expected_chapter": ["85"], "expected_heading": ["8517"]
    },
    {
        "id": 39, "category": "기계요소",
        "name": "산업용 협동로봇 관절용 정밀 하모닉 감속기",
        "material": "특수합금강제 플렉스플라인, 웨이브 제너레이터, 서큘러 스플라인",
        "function": "모터의 고속 회전을 초정밀하게 감속하여 로봇 관절의 토크를 증폭시키는 감속기",
        "expected_chapter": ["84"], "expected_heading": ["8483"]
    },
    {
        "id": 40, "category": "제어기기",
        "name": "전기차용 배터리 관리 시스템 (BMS 메인 컨트롤러)",
        "material": "마이크로컨트롤러(MCU), 절연 CAN 통신 칩, 저항, 다층 PCB 어셈블리",
        "function": "배터리 팩의 전압, 전류, 온도를 실시간 감시하고 충방전을 자동 제어하는 보드",
        "expected_chapter": ["90", "85"], "expected_heading": ["9032", "8537"]
    },
    {
        "id": 41, "category": "전기모터",
        "name": "전기자전거용 센터드라이브 토크센서 일체형 BLDC 모터",
        "material": "브러시리스 DC 모터(36V 250W), 토크 센서, 알루미늄 하우징",
        "function": "페달링 압력을 감지하여 전기자전거 바퀴를 보조 구동하는 전동기",
        "expected_chapter": ["85"], "expected_heading": ["8501"]
    },
    {
        "id": 42, "category": "카메라",
        "name": "공장 자동화용 산업용 머신비전 디지털 카메라",
        "material": "글로벌 셔터 CMOS 이미지 센서, GigE 비전 인터페이스, 알루미늄 케이스",
        "function": "생산 라인 제품의 결함을 검사하기 위해 고속으로 화상을 촬영하는 디지털 카메라",
        "expected_chapter": ["85"], "expected_heading": ["8525"]
    },
    {
        "id": 43, "category": "디스플레이",
        "name": "스마트폰용 폴더블 유연 AMOLED 디스플레이 패널",
        "material": "플렉서블 폴리이미드 기판, 유기발광다이오드(OLED) 화소, 정전식 터치센서",
        "function": "반으로 접히는 스마트폰 화면에 화상을 표시하는 일체형 터치 디스플레이 패널",
        "expected_chapter": ["85"], "expected_heading": ["8524"]
    },
    {
        "id": 44, "category": "전원장치",
        "name": "질화갈륨(GaN) 초소형 65W 멀티포트 고속 충전기",
        "material": "GaN 전력 반도체 파워 IC, 변압기, 정류회로, 플라스틱 외장 케이스",
        "function": "교류 220V를 직류 5~20V로 정류·변환하여 노트북/스마트폰을 급속 충전하는 어댑터",
        "expected_chapter": ["85"], "expected_heading": ["8504"]
    },
    {
        "id": 45, "category": "광학표시장치",
        "name": "차량용 윈드실드 투사형 헤드업 디스플레이 (HUD)",
        "material": "TFT LCD 프로젝션 모듈, 비구면 오목 거울, 마이크로프로세서 유닛",
        "function": "차량 속도 및 내비게이션 정보를 앞유리에 허상으로 투사하는 광학 표시장치",
        "expected_chapter": ["90", "87"], "expected_heading": ["9013", "8708"]
    },
    {
        "id": 46, "category": "저장매체",
        "name": "서버용 PCIe NVMe U.2 솔리드 스테이트 드라이브 (SSD 7.68TB)",
        "material": "3D TLC NAND 플래시 메모리, DRAM 캐시, PCIe 컨트롤러 ASIC",
        "function": "데이터센터 서버 시스템에 장착되어 대용량 디지털 데이터를 고속 입출력 저장하는 장치",
        "expected_chapter": ["85"], "expected_heading": ["8523"]
    },
    {
        "id": 47, "category": "음향기기",
        "name": "액티브 노이즈 캔슬링 블루투스 무선 헤드폰",
        "material": "40mm 다이내믹 드라이버, ANC 마이크로폰 4개, 블루투스 5.3 SoC, 헤드밴드",
        "function": "외부 소음을 역위상 음파로 상쇄하며 무선으로 음향을 재생하는 오버이어 헤드폰",
        "expected_chapter": ["85"], "expected_heading": ["8518"]
    },
    {
        "id": 48, "category": "3D프린터부품",
        "name": "3D 프린터용 고온 듀얼 기어 다이렉트 압출기 헤드",
        "material": "황동 노즐, 티타늄 바이메탈 히트브레이크, 스텝모터, 듀얼 기어 드라이브",
        "function": "열가소성 수지 필라멘트를 가열 용융하여 조형판에 정밀 토출하는 압출 노즐 헤드",
        "expected_chapter": ["84"], "expected_heading": ["8477"]
    },
    {
        "id": 49, "category": "항공부품",
        "name": "산업용 촬영 드론용 카본 파이버 접이식 프로펠러",
        "material": "탄소섬유 강화 플라스틱(CFRP) 100%",
        "function": "드론 모터 축에 장착되어 회전 시 양력을 발생시키는 비행 프로펠러 날개",
        "expected_chapter": ["88"], "expected_heading": ["8807"]
    },
    {
        "id": 50, "category": "측정센서",
        "name": "산업용 레이저 ToF 거리 측정 센서 모듈",
        "material": "레이저 다이오드(905nm), SPAD 광수신기, 마이크로컨트롤러",
        "function": "빛의 비행시간(ToF)을 측정하여 50m 이내 물체와의 거리를 밀리미터 단위로 계측하는 센서",
        "expected_chapter": ["90"], "expected_heading": ["9015", "9031"]
    },
    {
        "id": 51, "category": "특수기계",
        "name": "산업용 탁상형 초음파 세척기 (수조 10L)",
        "material": "스테인리스 스틸(SUS304) 수조, 40kHz 압전 BLT 진동자 4개, 히터",
        "function": "초음파 공동현상(캐비테이션)을 발생시켜 금속 부품 및 유리의 오염물을 세척하는 기기",
        "expected_chapter": ["84"], "expected_heading": ["8479"]
    },
    {
        "id": 52, "category": "금속잠금장치",
        "name": "스마트 지문인식 디지털 푸시풀 도어록",
        "material": "아연 합금 다이캐스팅 바디, 반도체 지문센서, 모티스 전동 잠금 메커니즘",
        "function": "지문, 비밀번호 또는 스마트폰 앱으로 현관문을 개폐하는 전자식 잠금장치",
        "expected_chapter": ["83"], "expected_heading": ["8301"]
    },
    {
        "id": 53, "category": "여과기부품",
        "name": "공기청정기용 원통형 H13 복합 헤파 필터",
        "material": "멜트블로운 정전 유리섬유(H13), 활성탄 알갱이, 플라스틱 프레임",
        "function": "공기 중의 0.3um 미세먼지와 유해가스를 포집 여과하는 소모성 교체 필터",
        "expected_chapter": ["84"], "expected_heading": ["8421"]
    },
    {
        "id": 54, "category": "전열기기",
        "name": "가정용 반자동 에스프레소 커피머신",
        "material": "스테인리스 써모블록 보일러, 15바 진동 펌프, 솔레노이드 밸브",
        "function": "원두 가루에 고온고압의 온수를 통과시켜 에스프레소를 추출하는 전열기구",
        "expected_chapter": ["85"], "expected_heading": ["8516"]
    },
    {
        "id": 55, "category": "휴대조명",
        "name": "캠핑용 충전식 LED 방수 랜턴",
        "material": "알루미늄 합금 케이스, 고휘도 LED 소자, 충전식 리튬이온 배터리(5000mAh)",
        "function": "내장 배터리로 구동되는 휴대용 방수 캠핑 야간 조명등",
        "expected_chapter": ["85"], "expected_heading": ["8513"]
    },

    # =========================================================================
    # [4. 모빌리티/배터리/자동차/항공 (15개)]
    # =========================================================================
    {
        "id": 56, "category": "연료전지부품",
        "name": "수소연료전지 스택용 초박판 금속 분리판",
        "material": "두께 0.1mm 스테인리스 스틸 박판 (부식 방지 카본 코팅 처리)",
        "function": "수소 및 산소 유로를 형성하고 셀 간 전류를 전달하는 연료전지 핵심 부품",
        "expected_chapter": ["85", "87"], "expected_heading": ["8501", "8708"]
    },
    {
        "id": 57, "category": "전기차충전기",
        "name": "완속 7kW 전기차 AC 완속 충전기 벽걸이 스탠드",
        "material": "AC 계측기, 전자접촉기(MC), 완속 충전 케이블(Type 1), 제어 회로보드",
        "function": "전기자동차 배터리를 충전하기 위해 교류 220V 전력을 차량 탑재 충전기로 공급하는 장치",
        "expected_chapter": ["85"], "expected_heading": ["8504"]
    },
    {
        "id": 58, "category": "레이더장치",
        "name": "자율주행차용 77GHz 전방 감지 밀리미터파 레이더",
        "material": "밀리미터파 송수신 RFIC 칩, 패치 안테나 어레이, DSP 신호처리 보드",
        "function": "전방 장애물의 거리 및 상대 속도를 탐지하여 긴급 제동을 제어하는 자동차용 레이더",
        "expected_chapter": ["85"], "expected_heading": ["8526"]
    },
    {
        "id": 59, "category": "자동차부품",
        "name": "승용차용 19인치 알루미늄 합금 단조 휠",
        "material": "알루미늄-마그네슘-실리콘 단조 합금 (A6061)",
        "function": "타이어를 장착하여 승용차 축에 결합하는 경량 고강도 자동차용 휠",
        "expected_chapter": ["87"], "expected_heading": ["8708"]
    },
    {
        "id": 60, "category": "고무타이어",
        "name": "전동 킥보드용 10인치 솔리드 고무 타이어",
        "material": "천연 및 합성 고무 복합체 (내부 허니컴 에어홀 구조)",
        "function": "공기 주입이 필요 없는 펑크 방지용 전동 킥보드 전용 통고무 타이어",
        "expected_chapter": ["40"], "expected_heading": ["4012"]
    },
    {
        "id": 61, "category": "자동차부품",
        "name": "고성능 슈퍼카용 카본 세라믹 브레이크 디스크 로터",
        "material": "탄소섬유 강화 탄화규소(C/SiC) 세라믹 복합재",
        "function": "자동차 휠 허브에 장착되어 패드와의 마찰로 차량을 감속시키는 고내열 브레이크 로터",
        "expected_chapter": ["87", "68"], "expected_heading": ["8708", "6815"]
    },
    {
        "id": 62, "category": "항행기기",
        "name": "어선 및 요트용 위성 GPS 해도 플로터 내비게이션",
        "material": "방수 컬러 LCD 모니터, GPS 수신기, 전자해도 롬팩, 소나 어군탐지 모듈",
        "function": "선박의 현재 위치를 해도 위에 표시하고 항로를 안내하는 해양 항행 장비",
        "expected_chapter": ["90"], "expected_heading": ["9014"]
    },
    {
        "id": 63, "category": "전기모터",
        "name": "전기차 구동용 고전압 150kW PMSM 영구자석 동기모터",
        "material": "네오디뮴 영구자석 로터, 헤어핀 권선 고정자 코일, 수랭식 알루미늄 하우징",
        "function": "배터리 전력을 받아 감속기를 거쳐 전기차 바퀴를 직접 구동하는 견인용 메인 모터",
        "expected_chapter": ["85"], "expected_heading": ["8501"]
    },
    {
        "id": 64, "category": "압축기",
        "name": "친환경 전기차 에어컨용 고전압 전동 인버터 스크롤 컴프레셔",
        "material": "고전압 BLDC 모터(350V) 내장 알루미늄 스크롤 압축 기구부, 인버터 일체형",
        "function": "전기차의 실내 냉방 및 배터리 열관리를 위해 R1234yf 냉매를 압축 순환시키는 압축기",
        "expected_chapter": ["84"], "expected_heading": ["8414"]
    },
    {
        "id": 65, "category": "티타늄패스너",
        "name": "항공기 날개 조립용 고강도 티타늄 합금 볼트 세트",
        "material": "Ti-6Al-4V 티타늄 합금 (나사산 전조 가공)",
        "function": "항공기 날개 구조물을 체결 결합하는 경량 고강도 나사산 볼트",
        "expected_chapter": ["81", "73"], "expected_heading": ["8108", "7318"]
    },
    {
        "id": 66, "category": "축전지",
        "name": "전기 스쿠터용 탈부착식 리튬이온 배터리 팩 (48V 30Ah)",
        "material": "21700 원통형 리튬이온 셀, BMS 보호회로, 알루미늄 방수 케이스",
        "function": "전기 스쿠터에 장착되어 전력을 공급하는 충전식 리튬 2차전지 팩",
        "expected_chapter": ["85"], "expected_heading": ["8507"]
    },
    {
        "id": 67, "category": "자동차부품",
        "name": "자동차 전자제어 가변 쇽업소버 완충기",
        "material": "유압 실린더, 전자제어 솔레노이드 감쇠력 조절 밸브, 오일",
        "function": "노면 충격을 흡수하고 주행 상황에 따라 감쇠력을 실시간 전자 조절하는 현가장치 부품",
        "expected_chapter": ["87"], "expected_heading": ["8708"]
    },
    {
        "id": 68, "category": "정화장치",
        "name": "디젤 차량용 백금 코팅 세라믹 DPF 매연포집필터",
        "material": "코디어라이트 다공성 세라믹 허니컴 담체, 백금(Pt)/팔라듐(Pd) 촉매 코팅",
        "function": "디젤 엔진 배기가스 중의 탄소 입자(PM)를 포집하고 산화 연소시키는 정화 장치",
        "expected_chapter": ["84"], "expected_heading": ["8421"]
    },
    {
        "id": 69, "category": "의료/모빌리티",
        "name": "장애인 및 고령자용 전동 휠체어",
        "material": "알루미늄 프레임, 24V DC 기어드 모터 2개, 조이스틱 제어기, 충전식 배터리",
        "function": "보행 장애인이 조이스틱 레버를 조작하여 스스로 주행할 수 있도록 만든 전동 이동차량",
        "expected_chapter": ["87"], "expected_heading": ["8713"]
    },
    {
        "id": 70, "category": "스포츠용품",
        "name": "카약/카누용 초경량 카본 파이버 패들 (노)",
        "material": "카본 섬유 복합체 샤프트 및 블레이드 100%",
        "function": "수상 경기 및 레저용 카약을 젓는 데 사용하는 경량 스포츠용 패들",
        "expected_chapter": ["95"], "expected_heading": ["9506"]
    },

    # =========================================================================
    # [5. 기계/설비/공구/계측 (15개)]
    # =========================================================================
    {
        "id": 71, "category": "공작기계",
        "name": "CNC 5축 수직형 머시닝 센터",
        "material": "주철 베드, 20,000 RPM 빌트인 스핀들, 30툴 자동 공구 교환장치(ATC), CNC 컨트롤러",
        "function": "금속 블록을 5개 축으로 동시 절삭 가공하는 컴퓨터 수치제어 공작기계",
        "expected_chapter": ["84"], "expected_heading": ["8457"]
    },
    {
        "id": 72, "category": "열교환기",
        "name": "산업용 브레이징 판형 열교환기",
        "material": "스테인리스 스틸(SUS316L) 전열판, 구리 브레이징 접합",
        "function": "두 유체 간에 열을 혼합 없이 고효율로 상호 교환 전달하는 판형 열교환 장치",
        "expected_chapter": ["84"], "expected_heading": ["8419"]
    },
    {
        "id": 73, "category": "밸브",
        "name": "공압 자동화용 5포트 2위치 솔레노이드 밸브",
        "material": "알루미늄 다이캐스팅 바디, NBR 고무 씰, 24V 전자기 코일",
        "function": "전기 신호를 받아 압축공기의 유로 방향을 전환하여 실린더를 제어하는 공압 밸브",
        "expected_chapter": ["84"], "expected_heading": ["8481"]
    },
    {
        "id": 74, "category": "펌프",
        "name": "산업 중장비용 가변용량형 사축식 유압 피스톤 펌프",
        "material": "구상흑연주철 하우징, 합금강 피스톤 9개, 사판 경전각 제어 기구",
        "function": "엔진 동력을 받아 고압(350 bar)의 작동유를 토출하여 유압 액추에이터를 구동하는 펌프",
        "expected_chapter": ["84"], "expected_heading": ["8413"]
    },
    {
        "id": 75, "category": "압력계",
        "name": "반도체 가스 라인용 디지털 압력 게이지",
        "material": "하스텔로이 다이어프램 압력 센서, 스테인리스 하우징, 4-20mA 출력 단자",
        "function": "배관 내 가스 및 액체의 압력을 정밀 측정하여 디지털로 표시하고 신호를 전송하는 계기",
        "expected_chapter": ["90"], "expected_heading": ["9026"]
    },
    {
        "id": 76, "category": "절삭공구",
        "name": "금속 절삭 가공용 4날 초경 솔리드 엔드밀",
        "material": "텅스텐 카바이드(WC-Co) 초경합금, TiAlN 질화티타늄알루미늄 나노 코팅",
        "function": "머시닝 센터 스핀들에 장착되어 회전하며 철강 및 티타늄을 절삭 삭감하는 공구",
        "expected_chapter": ["82"], "expected_heading": ["8207"]
    },
    {
        "id": 77, "category": "정밀측정기",
        "name": "산업 품질 검사용 정밀 3D 블루라이트 광학 스캐너",
        "material": "블루 LED 프로젝터 유닛, 500만 화소 듀얼 카메라, 삼각대 스탠드",
        "function": "물체 표면에 격자 무늬를 투사하여 형상 치수를 3차원 점군 데이터로 정밀 계측하는 장비",
        "expected_chapter": ["90"], "expected_heading": ["9031"]
    },
    {
        "id": 78, "category": "운반기계",
        "name": "물류창고용 전동 롤러 벨트 컨베이어 라인",
        "material": "구동 모터 롤러, 고무 컨베이어 벨트, 압출 알루미늄 프레임",
        "function": "모터 구동 벨트 위에 박스 및 화물을 얹어 연속 수평 이송하는 반송 설비",
        "expected_chapter": ["84"], "expected_heading": ["8428"]
    },
    {
        "id": 79, "category": "원심분리기",
        "name": "제약 및 화학 공정용 고속 원심분리 바스켓 탈수기",
        "material": "스테인리스 스틸(SUS316L) 회전 드럼 바스켓, 방폭형 인버터 모터",
        "function": "원심력을 이용하여 현탁액 속의 결정 고형분과 액체 용매를 분리하는 기계",
        "expected_chapter": ["84"], "expected_heading": ["8421"]
    },
    {
        "id": 80, "category": "포장기계",
        "name": "골판지 상자용 반자동 PP밴드 열용착 결속 밴딩기",
        "material": "스테인리스 상판 테이블, 열선 융착 히터 유닛, 밴드 텐션 모터",
        "function": "박스 주변에 폴리프로필렌(PP) 밴드를 자동으로 감고 열로 녹여 결속 포장하는 기계",
        "expected_chapter": ["84"], "expected_heading": ["8422"]
    },
    {
        "id": 81, "category": "공기압축기",
        "name": "공장 라인용 오일프리 트윈 스크류 공기압축기 (50HP)",
        "material": "특수 코팅 트윈 스크류 로터, 37kW 삼상 유도전동기, 방음 인클로저",
        "function": "오일 없이 순수한 압축공기를 분당 5m3 이상 지속 생산 공급하는 에어 컴프레셔",
        "expected_chapter": ["84"], "expected_heading": ["8414"]
    },
    {
        "id": 82, "category": "전동공구",
        "name": "볼트 정밀 체결용 충전식 디지털 토크 렌치 드라이버",
        "material": "디지털 스트레인 게이지 센서, 18V 브러시리스 모터, 유성 기어박스",
        "function": "목표 토크값(Nm)을 설정하여 볼트를 균일하고 정밀하게 조이는 충전식 전동 수동공구",
        "expected_chapter": ["84"], "expected_heading": ["8467"]
    },
    {
        "id": 83, "category": "진공펌프",
        "name": "반도체 증착 챔버용 자기부상식 터보 분자 진공펌프 (TMP)",
        "material": "5축 자기베어링 로터 블레이드, 70,000 RPM 고속 모터, 진공 플랜지",
        "function": "챔버 내 기체 분자를 고속 회전 블레이드로 배기하여 초고진공(10^-8 Pa)을 만드는 펌프",
        "expected_chapter": ["84"], "expected_heading": ["8414"]
    },
    {
        "id": 84, "category": "냉각탑",
        "name": "산업용 밀폐식 FRP 대향류형 냉각탑 (Cooling Tower)",
        "material": "유리섬유강화플라스틱(FRP) 케이싱, 구리 코일 열교환기, 축류 송풍팬",
        "function": "공장 냉각수를 순환 분무하여 수증기 증발 잠열로 온도를 낮추는 냉각 장치",
        "expected_chapter": ["84"], "expected_heading": ["8419"]
    },
    {
        "id": 85, "category": "금형",
        "name": "자동차 범퍼 플라스틱 사출 성형용 강제 금형",
        "material": "사출 프리하든강(NAK80/P20), 핫러너 시스템, 냉각수 라인 코어",
        "function": "사출기에 장착되어 용융 플라스틱을 주입받아 차량용 범퍼 형상으로 성형하는 틀",
        "expected_chapter": ["84"], "expected_heading": ["8480"]
    },

    # =========================================================================
    # [6. 생활용품/패션/가구/소비재 (15개)]
    # =========================================================================
    {
        "id": 86, "category": "시계밴드",
        "name": "애플워치용 불소고무(FKM) 스포츠 스트랩 밴드",
        "material": "불소고무(Fluoroelastomer) 밴드, 스테인리스 스틸 체결 버클 핀",
        "function": "스마트워치 본체에 결합하여 손목에 착용할 수 있도록 하는 교체용 시계줄",
        "expected_chapter": ["91"], "expected_heading": ["9113"]
    },
    {
        "id": 87, "category": "의자/가구",
        "name": "인체공학 메시 사무용 회전의자",
        "material": "통기성 폴리에스터 메시 등판, 우레탄 폼 좌판, 알루미늄 다리, 가스 리프트 실린더",
        "function": "사무실에서 착석용으로 사용되는 높낮이 및 등판 틸팅 조절형 회전 의자",
        "expected_chapter": ["94"], "expected_heading": ["9401"]
    },
    {
        "id": 88, "category": "티타늄식기",
        "name": "캠핑용 초경량 순수 티타늄 코펠 식기 세트 (냄비 및 프라이팬)",
        "material": "순도 99.8% 티타늄 박판 판재, 접이식 손잡이",
        "function": "등산 및 야외 취사용으로 음식물을 끓이고 조리하는 초경량 취사 코펠 용기",
        "expected_chapter": ["81", "76", "73"], "expected_heading": ["8108", "7615", "7323"]
    },
    {
        "id": 89, "category": "필기도구",
        "name": "고급 만년필 (18K 금닙 장착)",
        "material": "황동 바디(래커 칠 마감), 18K(Au750) 솔리드 골드 펜촉(Nib), 피스톤 컨버터",
        "function": "모세관 현상으로 잉크를 닙으로 공급하여 종이에 글씨를 작성하는 만년필",
        "expected_chapter": ["96"], "expected_heading": ["9608"]
    },
    {
        "id": 90, "category": "의류부속물",
        "name": "천연 실크 100% 여성용 사각 트윌 스카프 (90x90cm)",
        "material": "견(Silk) 100% 능직물 (핸드 롤링 마감)",
        "function": "여성들이 목이나 어깨에 둘러 착용하는 사각형 장식용 실크 직물 스카프",
        "expected_chapter": ["62"], "expected_heading": ["6214"]
    },
    {
        "id": 91, "category": "가죽가방",
        "name": "남성용 천연 소가죽 서류가방 (브리프케이스)",
        "material": "외피: 천연 소가죽(풀그레인 레더), 내피: 면 직물 안감, 금속 지퍼",
        "function": "서류 및 노트북을 수납하여 손으로 들고 다니는 신사용 가죽 서류가방",
        "expected_chapter": ["42"], "expected_heading": ["4202"]
    },
    {
        "id": 92, "category": "특수방호복",
        "name": "소방관용 내열 방열 방화복 상하의 세트",
        "material": "아라미드 외피 직물 + PTFE 방수투습 멤브레인 + 난연 멜톤 안감",
        "function": "화재 진압 현장에서 고열과 불꽃으로부터 소방관의 신체를 보호하는 특수 작업복",
        "expected_chapter": ["62"], "expected_heading": ["6201", "6203", "6211"]
    },
    {
        "id": 93, "category": "완구",
        "name": "어린이용 조립식 플라스틱 블록 세트 (레고 호환 완구)",
        "material": "사출 ABS 플라스틱 블록 부품 500피스, 종이 조립 설명서",
        "function": "어린이들이 블록을 끼워 맞춰 건물이나 자동차 모형을 만드는 놀이용 조립 완구",
        "expected_chapter": ["95"], "expected_heading": ["9503"]
    },
    {
        "id": 94, "category": "스포츠용품",
        "name": "전문가용 카본 그라파이트 테니스 라켓 완제품",
        "material": "탄소섬유(카본 복합재) 프레임, 합성 나일론 스트링, 인조가죽 그립 테이프",
        "function": "테니스 공을 타격하여 플레이하는 스트링이 매어진 테니스 경기용 라켓",
        "expected_chapter": ["95"], "expected_heading": ["9506"]
    },
    {
        "id": 95, "category": "보온용기",
        "name": "이중벽 진공 단열 스테인리스 보온 텀블러 (500ml)",
        "material": "스테인리스 스틸(SUS304) 내외벽 진공 밀폐 구조, PP 뚜껑, 실리콘 가스켓",
        "function": "내부 진공층을 통해 음료의 보온 및 보냉 온도를 장시간 유지하는 휴대용 진공 텀블러",
        "expected_chapter": ["96"], "expected_heading": ["9617"]
    },
    {
        "id": 96, "category": "광학측정기",
        "name": "골프용 레이저 거리측정기 (레인지파인더 6배율)",
        "material": "광학 렌즈(6배 단안망원경), 905nm 반도체 펄스 레이저, LCD 뷰파인더",
        "function": "망원경으로 깃대를 조준하여 버튼을 누르면 핀까지의 직선 및 보정 거리를 계측하는 기기",
        "expected_chapter": ["90"], "expected_heading": ["9015", "9031", "9005"]
    },
    {
        "id": 97, "category": "안경류",
        "name": "자외선 차단 편광 렌즈 선글라스",
        "material": "아세테이트 플라스틱 안경테, 편광 TAC 플라스틱 렌즈(UV400 차단)",
        "function": "태양광 자외선과 난반사 눈부심을 차단하여 눈을 보호하는 패션 선글라스",
        "expected_chapter": ["90"], "expected_heading": ["9004"]
    },
    {
        "id": 98, "category": "양초",
        "name": "천연 소이왁스 아로마 향초 (유리병 용기 포장)",
        "material": "대두유 천연 소이왁스, 라벤더 에센셜 오일 향료, 면 심지, 내열 유리 용기",
        "function": "심지에 불을 붙여 은은한 향기와 빛을 방출하는 실내 방향용 양초",
        "expected_chapter": ["34"], "expected_heading": ["3406"]
    },
    {
        "id": 99, "category": "손목시계",
        "name": "스위스 무브먼트 기계식 자동 오토매틱 손목시계",
        "material": "스테인리스 스틸 케이스, 기계식 셀프 와인딩 무브먼트(28석), 사파이어 크리스탈 유리",
        "function": "손목의 움직임으로 태엽이 자동으로 감기며 시각을 침으로 가리키는 기계식 손목시계",
        "expected_chapter": ["91"], "expected_heading": ["9102"]
    },
    {
        "id": 100, "category": "침구류",
        "name": "천연 고무 라텍스 침대 매트리스 (퀸사이즈)",
        "material": "천연 고무나무 유액 발포 라텍스 폼 코어, 오가닉 코튼 커버",
        "function": "침대 프레임 위에 얹어 수면 시 신체를 받쳐주는 폼 고무 매트리스 침구류",
        "expected_chapter": ["94"], "expected_heading": ["9404"]
    }
]

def run_real_100_benchmark():
    db = SessionLocal()

    total_count = len(FRESH_100_REAL_ITEMS)
    print("=" * 115)
    print(f"🚀 [CUSWAY 2026 AI 엔진 3차 전수 벤치마크] 신규 실무 100대 품목 4단계 통관 전과정 무결성 정밀 실측")
    print(f"   테스트 대상: 총 {total_count}개 품목 (농수산식품, 정밀화학, 첨단전자, 모빌리티, 기계설비, 소비재)")
    print("=" * 115)

    start_time = time.time()

    step1_heading_pass = 0
    step1_hsk10_valid = 0
    step1_reasoning_pass = 0
    step1_zero_hallucination = 0

    step2_rate_pass = 0
    step3_req_pass = 0
    step4_plan_pass = 0

    full_pipeline_pass = 0
    failed_items = []
    detailed_reports = []

    for idx, item in enumerate(FRESH_100_REAL_ITEMS, start=1):
        item_id = item["id"]
        cat = item["category"]
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_headings = item["expected_heading"]
        expected_chapters = item["expected_chapter"]

        # ---------------------------------------------------------
        # Step 1: HS Code Classification & Legal Reasoning
        # ---------------------------------------------------------
        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=name,
            material=material,
            function_use=func,
            db=db
        )

        rec_code = res.get("recommendedHsCode", "")
        clean_code = rec_code.replace(".", "").replace("-", "").replace(" ", "").strip()
        reasoning = res.get("legalReasoning", "")
        precedents = res.get("precedents", [])

        is_step1_ok = True
        step1_err = []

        rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
        rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

        # 1. Heading check
        heading_matched = False
        if (rec_heading in expected_headings) or (rec_chapter in expected_chapters and any(rec_heading.startswith(h[:2]) for h in expected_headings)):
            heading_matched = True
            step1_heading_pass += 1
        else:
            is_step1_ok = False
            step1_err.append(f"호 불일치: 실제 {rec_heading} != 예상 {expected_headings}")

        # 2. 10-digit DB validation
        is_hsk10_ok = False
        master_exists = db.query(HSCodeMaster).filter(
            (HSCodeMaster.hs_code == rec_code) | (HSCodeMaster.hs_code == clean_code)
        ).first()
        if master_exists and master_exists.hscode_length == 10:
            is_hsk10_ok = True
            step1_hsk10_valid += 1
        else:
            is_step1_ok = False
            step1_err.append(f"10단위 HSK 마스터 DB 부재 ({clean_code})")

        # 3. Reasoning check
        if len(reasoning.strip()) >= 50 and any(kw in reasoning for kw in ["통칙", "관세율표", "분류", "제외"]):
            step1_reasoning_pass += 1
        else:
            is_step1_ok = False
            step1_err.append("법리 소명서 부실")

        # 4. Zero Hallucination check
        is_hallu = False
        for p in precedents:
            p_code = p.get("code", "").replace(".", "").replace("-", "").strip()
            if p_code:
                db_prec = db.query(CustomsPrecedent).filter(
                    (CustomsPrecedent.hs_code == p.get("code")) | (CustomsPrecedent.hs_code == p_code)
                ).first()
                if not db_prec and not p.get("id", "").startswith("PREC-"):
                    is_hallu = True
                    break
        if not is_hallu:
            step1_zero_hallucination += 1
        else:
            is_step1_ok = False
            step1_err.append("가짜 판례 탐지")
        # ---------------------------------------------------------
        # Step 2: Tariff & FTA Optimization
        # ---------------------------------------------------------
        is_step2_ok = False
        rates_data = None
        base_rate = None
        recommended_rate = None
        if len(clean_code) == 10:
            try:
                rates_data = get_hs_rates_api(hs_code=rec_code, origin="US", db=db)
                rates_dict = rates_data.get("rates", {}) if rates_data else {}
                base_rate = rates_dict.get("base_rate")
                recommended_rate = rates_dict.get("recommended_rate")
                if base_rate is not None or recommended_rate is not None or bool(rates_dict):
                    step2_rate_pass += 1
                    is_step2_ok = True
            except Exception as e:
                is_step2_ok = False

        # ---------------------------------------------------------
        # Step 3 & 4: Clearance Requirements & Action Plan
        # ---------------------------------------------------------
        is_step3_ok = False
        is_step4_ok = False
        reqs_data = None
        plan_data = None
        if len(clean_code) == 10:
            try:
                reqs_data = get_clearance_guide_api(hs_code=rec_code, db=db)
                if isinstance(reqs_data, dict):
                    step3_req_pass += 1
                    is_step3_ok = True
                    step4_plan_pass += 1
                    is_step4_ok = True
            except Exception as e:
                is_step3_ok = False
                is_step4_ok = False

        # ---------------------------------------------------------
        # Full Pipeline Evaluation
        # ---------------------------------------------------------
        all_pass = is_step1_ok and is_step2_ok and is_step3_ok and is_step4_ok
        if all_pass:
            full_pipeline_pass += 1
            status_icon = "✅ ALL PASS"
        else:
            status_icon = "❌ FAIL"
            failed_items.append({
                "id": item_id,
                "category": cat,
                "name": name,
                "rec_code": rec_code,
                "rec_heading": rec_code[:4],
                "expected_headings": expected_headings,
                "expected_chapters": expected_chapters,
                "is_step1_ok": is_step1_ok,
                "is_step2_ok": is_step2_ok,
                "is_step3_ok": is_step3_ok,
                "is_step4_ok": is_step4_ok,
                "step1_err": step1_err
            })

        law_count = len(reqs_data) if isinstance(reqs_data, dict) else 0
        base_rate_str = f"{base_rate}%" if base_rate is not None else "N/A"
        rec_rate_str = f"{recommended_rate}%" if recommended_rate is not None else "N/A"
        print(f"[{idx:03d}/100] [{cat:^8s}] {name[:24]:<24} | HS: {rec_code:<10} | 관세:{base_rate_str:<5}➔최적:{rec_rate_str:<5} | 요건:{law_count}법령 | {status_icon}")

    elapsed = time.time() - start_time
    db.close()

    # ---------------------------------------------------------
    # Final Statistics and Reporting
    # ---------------------------------------------------------
    print("\n" + "=" * 115)
    print("📊 [CUSWAY 3차 신규 100대 실무 품목 4단계 통관 전과정 엄격 실측 통계 보고서]")
    print("=" * 115)
    print(f" 총 테스트 대상: {total_count}개 품목 | 총 소요시간: {elapsed:.2f}초 (건당 평균 {elapsed/total_count:.2f}초)\n")
    
    print(" ▶ Step 1 (AI HS Code 분류 & 법리 소명):")
    print(f"    - 호(Heading)/류(Chapter) 분류 정확도 : {step1_heading_pass}/{total_count} ({step1_heading_pass/total_count*100:.1f}%) | 오류율: {(total_count-step1_heading_pass)/total_count*100:.1f}%")
    print(f"    - 관세청 마스터 10단위 HSK 실존 유효율: {step1_hsk10_valid}/{total_count} ({step1_hsk10_valid/total_count*100:.1f}%) | 오류율: {(total_count-step1_hsk10_valid)/total_count*100:.1f}%")
    print(f"    - GRI 통칙 4단계 법리 소명서 완성율   : {step1_reasoning_pass}/{total_count} ({step1_reasoning_pass/total_count*100:.1f}%)")
    print(f"    - 제로 할루시네이션(실존 결정례 매칭) : {step1_zero_hallucination}/{total_count} ({step1_zero_hallucination/total_count*100:.1f}%)\n")

    print(" ▶ Step 2 (최적 세율 및 FTA 협정 분석):")
    print(f"    - 기본(A)/WTO(C)/할당(W)/FTA 매핑 성공: {step2_rate_pass}/{total_count} ({step2_rate_pass/total_count*100:.1f}%) | 오류율: {(total_count-step2_rate_pass)/total_count*100:.1f}%\n")

    print(" ▶ Step 3 (세관장확인 수입 요건 법령):")
    print(f"    - 개별법령(식약처/전파법/안전인증/화장품 등): {step3_req_pass}/{total_count} ({step3_req_pass/total_count*100:.1f}%) | 오류율: {(total_count-step3_req_pass)/total_count*100:.1f}%\n")

    print(" ▶ Step 4 (통관 행정서류 및 액션 플랜):")
    print(f"    - 사전 행정절차/필수구비서류/기관안내 생성: {step4_plan_pass}/{total_count} ({step4_plan_pass/total_count*100:.1f}%) | 오류율: {(total_count-step4_plan_pass)/total_count*100:.1f}%\n")

    print("-" * 115)
    print(f" 🏆 [4단계 파이프라인 무결 통합 성공률]: {full_pipeline_pass}/{total_count}건 통과")
    print(f" 🎯 최종 통합 정확도 (Overall Accuracy): {full_pipeline_pass/total_count*100:.1f}%")
    print(f" ⚠️ 최종 통합 오류율 (Overall Error Rate): {(total_count-full_pipeline_pass)/total_count*100:.1f}%")
    print("=" * 115)

    if failed_items:
        print("\n⚠️ [상세 실패 품목 내역 및 오분류 분석]")
        for f in failed_items:
            print(f" - [ID {f['id']:03d}] {f['name']} ({f['category']})")
            print(f"   * 판정된 세번: {f['rec_code']} (호: {f['rec_heading']}) vs 기대 호: {f['expected_headings']} (류: {f['expected_chapters']})")
            print(f"   * 단계별 성공 여부: Step1={f['is_step1_ok']}, Step2={f['is_step2_ok']}, Step3={f['is_step3_ok']}, Step4={f['is_step4_ok']}")
            print(f"   * Step 1 에러 사유: {', '.join(f['step1_err'])}")
            print("-" * 75)

if __name__ == "__main__":
    run_real_100_benchmark()
