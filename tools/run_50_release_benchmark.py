# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: 50 New Advanced Product Benchmark & Release Quality Verification
Automated iterative testing until 0% error rate (100% accuracy) is achieved.
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

NEW_50_RELEASE_ITEMS = [
    # --- Section I & II: Bio/Food Tech (Ch 01-24) ---
    {
        "id": 1,
        "name": "배양육 돈육 안심 슬라이스",
        "material": "동물 세포 배양 근육 및 지방 조직 85%, 식물성 하이드로겔 지지체 15%",
        "function": "도축 없이 세포 배양으로 실제 돼지고기 조직과 단백질을 재현한 식용 배양육 조제품",
        "expected_chapter": ["16", "21"],
        "expected_heading": ["1602", "2106"]
    },
    {
        "id": 2,
        "name": "남극 크릴새우 오일 고농축 인지질 아스타잔틴 연질캡슐",
        "material": "크릴새우(Euphausia superba) 추출 오일 100%, 젤라틴 캡슐 피막",
        "function": "오메가3 및 인지질, 아스타잔틴을 함유하여 심혈관 건강을 돕는 건강기능식품 연질캡슐",
        "expected_chapter": ["21", "15"],
        "expected_heading": ["2106", "1504", "1517"]
    },
    {
        "id": 3,
        "name": "고순도 식물성 스테비올 배당체 감미료 분말 (Reb M 98%)",
        "material": "스테비아 잎 추출 레바우디오사이드 M (Rebaudioside M, C56H90O33) 98% 이상",
        "function": "설탕 대비 300배 단맛을 내는 무칼로리 천연 당배당체 유기 감미료",
        "expected_chapter": ["29", "38", "21"],
        "expected_heading": ["2938", "3824", "2106"]
    },
    {
        "id": 4,
        "name": "동결건조 콤부차 스코비(SCOBY) 복합 미생물 종균 펠릿",
        "material": "초산균 및 효모 복합체 동결건조 균체 90%, 프리바이오틱스 당류 10%",
        "function": "발효 음료인 콤부차 제조 시 투입하는 발효 스타터 미생물 조제품",
        "expected_chapter": ["21", "30"],
        "expected_heading": ["2102", "2106", "3002"]
    },
    {
        "id": 5,
        "name": "유기농 귀리 농축 단백질 식이섬유 음료 베이스",
        "material": "효소 분해 유기농 귀리 추출액 95%, 해조칼슘, 천연향료",
        "function": "우유를 대체하는 식물성 오트밀크 음료 제조용 무가당 액상 조제품",
        "expected_chapter": ["22", "21"],
        "expected_heading": ["2202", "2106"]
    },

    # --- Section VI: Chemical & Pharma (Ch 28-38) ---
    {
        "id": 6,
        "name": "차세대 리튬황(Li-S) 배터리용 유기 황-탄소 복합 양극 활물질 분말",
        "material": "고순도 황(S8) 70%, 다공성 탄소 나노튜브(CNT) 30%",
        "function": "초고용량 리튬황 2차전지의 양극에 도포되는 활물질 복합 화학 조제품",
        "expected_chapter": ["28", "38"],
        "expected_heading": ["2802", "3824", "2803"]
    },
    {
        "id": 7,
        "name": "반도체 3D 낸드 식각용 육불화부타디엔(C4F6) 초고순도 특수가스",
        "material": "헥사플루오로-1,3-부타디엔 (C4F6) 99.999%",
        "function": "반도체 식각 공정에서 고종횡비 접촉홀을 초미세 건식 식각하는 불소계 특수가스",
        "expected_chapter": ["29"],
        "expected_heading": ["2903"]
    },
    {
        "id": 8,
        "name": "GLP-1 수용체 작동제 비만치료제 합성 펩타이드 원료의약품(API)",
        "material": "세마글루타이드(Semaglutide) 고순도 동결건조 분말 99.2%",
        "function": "인슐린 분비를 촉진하고 식욕을 억제하는 비만 및 제2형 당뇨 치료제 합성 호르몬 펩타이드",
        "expected_chapter": ["29", "30"],
        "expected_heading": ["2937", "3002", "3004"]
    },
    {
        "id": 9,
        "name": "이차전지 전해액용 리튬염 LiFSI (Lithium Bis(fluorosulfonyl)imide)",
        "material": "리튬 비스(플루오로술포닐)이미드 (LiFSI, LiN(SO2F)2) 고순도 결정 99.9%",
        "function": "저온 출력 및 고온 수명을 향상시키는 2차전지 전해액 첨가용 무기/유기 리튬염 화합물",
        "expected_chapter": ["28", "29", "38"],
        "expected_heading": ["2853", "2935", "3824"]
    },
    {
        "id": 10,
        "name": "수소 전기차 연료전지 스택 냉각용 초저전도도 부동액 조제품",
        "material": "에틸렌글리콜 50%, 탈이온수 48%, 비이온성 유기 부식방지제 2%",
        "function": "전기 전도도를 극도로 낮추어 전기 단락을 방지하며 연료전지 스택을 냉각하는 액",
        "expected_chapter": ["38"],
        "expected_heading": ["3820", "3824"]
    },
    {
        "id": 11,
        "name": "항체-약물 접합체(ADC) 표적 항암제용 링커-페이로드 유기 화합물",
        "material": "MC-VC-PAB-MMAE 유기 합성 화합물 분말 99.0%",
        "function": "단일클론항체에 결합하여 암세포에 세포독성 약물을 정밀 전달하는 치료용 중간체",
        "expected_chapter": ["29", "30"],
        "expected_heading": ["2934", "3002", "3004"]
    },
    {
        "id": 12,
        "name": "태양전지 페로브스카이트용 고순도 메틸암모늄 납 요오드화물(MAPbI3)",
        "material": "CH3NH3PbI3 결정성 분말 99.5%",
        "function": "차세대 탠덤 태양전지 광흡수층을 형성하는 유무기 하이브리드 반도체 화합물",
        "expected_chapter": ["28", "29", "38"],
        "expected_heading": ["2853", "2921", "3824"]
    },
    {
        "id": 13,
        "name": "바이오매스 발효 기반 친환경 바이오 1,3-프로판디올 (Bio-PDO)",
        "material": "1,3-프로판디올 (1,3-Propanediol, C3H8O2) 99.8%",
        "function": "친환경 PTT 폴리에스테르 섬유 및 화장품 보습제 원료로 사용되는 2가 알코올 유기화합물",
        "expected_chapter": ["29"],
        "expected_heading": ["2905"]
    },

    # --- Section VII: Plastics & Rubber (Ch 39-40) ---
    {
        "id": 14,
        "name": "우주복 외피용 에어로겔 복합 열가소성 폴리우레탄(TPU) 멤브레인 필름",
        "material": "열가소성 폴리우레탄(TPU) 70%, 나노 실리카 에어로겔 30% 복합 필름",
        "function": "극저온/초고온 단열 및 투습방수 기능을 수행하는 우주복 및 극한 방한복용 플라스틱 필름",
        "expected_chapter": ["39"],
        "expected_heading": ["3920", "3921"]
    },
    {
        "id": 15,
        "name": "고전압 배터리 팩 밀봉용 난연 실리콘 폼 패킹 가스켓 시트",
        "material": "자가소화성 실리콘 폼 엘라스토머 가황고무 100%",
        "function": "전기차 배터리 팩 하우징 사이에 압착되어 수분 침투 및 화재 열폭주를 차단하는 고무 패킹",
        "expected_chapter": ["40", "39"],
        "expected_heading": ["4016", "4008", "3921", "3926"]
    },
    {
        "id": 16,
        "name": "생체 흡수성 PLGA 수술용 정형외과 골절 고정 스크류 나사",
        "material": "폴리락틱-코-글리콜산(PLGA) 생체흡수성 고분자 100%",
        "function": "골절된 뼈를 고정하고 1~2년 후 체내에서 자연 분해되어 2차 제거 수술이 필요 없는 의료용 나사",
        "expected_chapter": ["90", "39"],
        "expected_heading": ["9021", "3926"]
    },
    {
        "id": 17,
        "name": "전자기파 차폐(EMI)용 카본블랙 분산 전도성 NBR 합성고무 시트",
        "material": "아크릴로니트릴-부타디엔 고무(NBR) 60%, 전도성 카본블랙 40%",
        "function": "전자제어장치(ECU)에서 발생하는 전자파 노이즈를 흡수 차폐하는 탄성 고무 판",
        "expected_chapter": ["40"],
        "expected_heading": ["4008", "4016"]
    },
    {
        "id": 18,
        "name": "반도체 웨이퍼 백그라인딩용 자외선 경화형(UV-dicing) 아크릴 점착 테이프 롤",
        "material": "폴리에틸렌 테레프탈레이트(PET) 기재 필름, UV 반응형 아크릴 점착제 코팅",
        "function": "웨이퍼 후면 연마 및 절단 시 칩을 고정하고 UV 조사 시 점착력이 상실되어 쉽게 분리되는 테이프",
        "expected_chapter": ["39"],
        "expected_heading": ["3919"]
    },

    # --- Section XI & XII: Textiles & Technical Weaves (Ch 50-65) ---
    {
        "id": 19,
        "name": "소방관용 초고온 내열 PBI/아라미드 혼방 방화복 직물",
        "material": "폴리벤즈이미다졸(PBI) 섬유 40%, 파라-아라미드 60% 직물",
        "function": "직접 화염 접촉 및 600도 고열에서도 탄화되지 않고 인장력을 유지하는 특수 방화복용 직물",
        "expected_chapter": ["55", "54", "59"],
        "expected_heading": ["5515", "5407", "5903"]
    },
    {
        "id": 20,
        "name": "스마트 의류 생체신호 수집용 은 나노와이어 코팅 전도성 탄성사",
        "material": "폴리우레탄 스판덱스 심사, 은(Ag) 나노와이어 코팅 폴리에스테르 복합사",
        "function": "신축성이 뛰어나며 의복에 직조되어 심박수 및 근전도 신호를 메인 보드로 전송하는 전도성 실",
        "expected_chapter": ["56", "54"],
        "expected_heading": ["5605", "5402"]
    },
    {
        "id": 21,
        "name": "해상 오일펜스 계류용 초고분자량 폴리에틸렌(UHMWPE) 고강도 편직 로프",
        "material": "초고분자량 폴리에틸렌(UHMWPE) 연속 필라멘트 브레이디드 로프 100%",
        "function": "강철 와이어 대비 7배 강도를 가지며 해수에 뜨는 해상 방제용 초고강도 밧줄",
        "expected_chapter": ["56"],
        "expected_heading": ["5607"]
    },
    {
        "id": 22,
        "name": "인공 혈관용 팽창형 폴리테트라플루오로에틸렌(ePTFE) 직조 튜브",
        "material": "미세 다공성 ePTFE 섬유 직조 튜브 100%",
        "function": "폐색된 동맥을 대체하여 체내 혈류를 유지시키는 인공 장기 외과용 혈관 보철물",
        "expected_chapter": ["90", "59", "39"],
        "expected_heading": ["9021", "5911", "3917"]
    },

    # --- Section XIII & XIV: Glass, Ceramics, Carbon, Crystals (Ch 68-71) ---
    {
        "id": 23,
        "name": "인공위성 대형 광학 반사경용 화학기상증착 탄화규소(CVD-SiC) 소결 블랭크",
        "material": "초고순도 화학기상증착 탄화규소(SiC) 복합 세라믹 블록",
        "function": "우주 방사선 및 극심한 온도 변화에도 열팽창이 거의 없는 인공위성 탑재체 반사경 모재",
        "expected_chapter": ["69", "68"],
        "expected_heading": ["6909", "6815"]
    },
    {
        "id": 24,
        "name": "스마트폰 카메라 모듈용 고굴절 잠망경 광학 프리즘 유리 블록",
        "material": "란타넘 광학 붕규산염 유리(N-LAK9), 정밀 광학 연마품",
        "function": "빛의 경로를 90도 굴절시켜 스마트폰 내부에서 10배 광학 줌을 구현하는 프리즘 소자",
        "expected_chapter": ["90", "70"],
        "expected_heading": ["9001", "7014", "7006"]
    },
    {
        "id": 25,
        "name": "수소저장용기용 탄소섬유 복합재 고압 수소 실린더 라이너",
        "material": "탄소섬유 토우(T1000) 80%, 에폭시 수지 매트릭스 20% 필라멘트 와인딩 성형품",
        "function": "700바(bar) 초고압 수소를 저장하는 수소차용 수소 탱크 본체",
        "expected_chapter": ["68", "73", "76"],
        "expected_heading": ["6815", "7311", "7613"]
    },
    {
        "id": 26,
        "name": "전기차 전력반도체용 질화갈륨(GaN) 온 실리콘 에피택셜 단결정 웨이퍼",
        "material": "실리콘 기판(Si) 위 GaN 에피택셜 박막 성장 단결정 웨이퍼",
        "function": "초고속 고효율 전력 스위칭 반도체 칩을 제조하기 위한 화합물 반도체 기판",
        "expected_chapter": ["38", "85", "28"],
        "expected_heading": ["3818", "8541", "2853"]
    },
    {
        "id": 27,
        "name": "마이크로 LED 디스플레이 전사용 사파이어(Al2O3) 단결정 기판 웨이퍼",
        "material": "합성 단결정 알파-산화알루미늄 (Corundum / Sapphire) 웨이퍼 100%",
        "function": "마이크로 LED 칩을 에피택셜 성장시킨 후 떼어내는 광학용 고순도 인조 보석 기판",
        "expected_chapter": ["71"],
        "expected_heading": ["7104", "7105"]
    },

    # --- Section XV: Base Metals & Advanced Alloys (Ch 72-83) ---
    {
        "id": 28,
        "name": "전고체 배터리 집전체용 두께 6㎛ 초극박 전주도금 순니켈 포일 코일",
        "material": "고순도 전기니켈(Ni 99.9%) 전주박 코일",
        "function": "황화물계 전고체 전해질과의 화학적 부식을 방지하는 2차전지 양극 집전용 박",
        "expected_chapter": ["75"],
        "expected_heading": ["7506"]
    },
    {
        "id": 29,
        "name": "우주 발사체 터보펌프용 3D 프린팅 인코넬 718 니켈기 초합금 구형 분말",
        "material": "니켈 53%, 크롬 19%, 철 18%, 니오븀 5%, 몰리브덴 (Inconel 718) 분말",
        "function": "로켓 엔진의 극저온 산화제 펌프 부품을 금속 적층 제조(SLM)하는 분말 원료",
        "expected_chapter": ["75"],
        "expected_heading": ["7504"]
    },
    {
        "id": 30,
        "name": "핵융합 토카막 다이버터용 텅스텐-구리(W-Cu) 복합 금속 내열 타일",
        "material": "텅스텐 80%, 구리 20% 가압 소결 합금 타일",
        "function": "초고온 플라즈마 입자의 직접 충돌을 견디며 열을 신속히 배출하는 내열 금속 블록",
        "expected_chapter": ["81", "74"],
        "expected_heading": ["8101", "8113", "7419"]
    },
    {
        "id": 31,
        "name": "초전도 전력 케이블용 희토류 바륨 구리 산화물(REBCO) 고온 초전도 테이프",
        "material": "하스텔로이 합금 기판, REBCO 초전도층, 은(Ag) 및 구리(Cu) 도금 안정화층",
        "function": "영하 196도 액체질소 온도에서 전기저항 0으로 대용량 전류를 전송하는 초전도 전선",
        "expected_chapter": ["85"],
        "expected_heading": ["8544", "8548"]
    },
    {
        "id": 32,
        "name": "자동차 충돌 안전용 2000MPa급 붕소(Boron) 합금강 열간성형 도금 강판",
        "material": "보론 첨가 알루미늄-규소(Al-Si) 도금 합금강판 코일",
        "function": "핫스탬핑 공법으로 자동차 B필러 및 센터필러를 성형하는 초고장력 합금강판",
        "expected_chapter": ["72"],
        "expected_heading": ["7225", "7210"]
    },

    # --- Section XVI: Machinery & Electronics (Ch 84-85) ---
    {
        "id": 33,
        "name": "반도체 첨단 패키징용 초정밀 칩렛(Chiplet) 하이브리드 본딩 머신",
        "material": "화강암 제진 정반, 나노 스테이지, 레이저 간섭계, 진공 본딩 챔버",
        "function": "구리(Cu-Cu) 직접 접합 방식으로 칩과 칩을 1마이크로미터 미만 오차로 결합하는 제조장비",
        "expected_chapter": ["84"],
        "expected_heading": ["8486"]
    },
    {
        "id": 34,
        "name": "수소전기 대형트럭용 120kW 고분자전해질(PEM) 수소연료전지 발전 파워 모듈",
        "material": "막전극접합체(MEA) 스택, 수소 재순환 블로워, 공기 압축기, 통합 ECU",
        "function": "수소와 공기 중 산소를 반응시켜 직류 전기를 연속 생산하는 친환경 발전 파워팩",
        "expected_chapter": ["85"],
        "expected_heading": ["8501", "8504"]
    },
    {
        "id": 35,
        "name": "산업용 휴머노이드 로봇용 6축 토크 센서 내장형 스마트 전동 그리퍼",
        "material": "BLDC 모터, 티타늄 기어 감속기, 광학식 접촉 압력 센서, 이더캣 제어기",
        "function": "물체의 재질과 무게를 감지하여 파손 없이 정밀 파지하는 로봇 손 말단 장치",
        "expected_chapter": ["84", "85"],
        "expected_heading": ["8479", "8501", "8428"]
    },
    {
        "id": 36,
        "name": "AI 데이터센터 액침냉각 서버용 초고효율 브레이징 판형 열교환기",
        "material": "SUS316L 스테인리스 판재, 니켈/구리 진공 브레이징 접합체",
        "function": "서버 절연유와 외부 냉각수 간의 열을 교환하여 초고열 GPU를 냉각하는 열교환 장치",
        "expected_chapter": ["84"],
        "expected_heading": ["8419"]
    },
    {
        "id": 37,
        "name": "전고체 배터리 전극 조밀화용 온간 정수압 프레스(WIP) 성형 장비",
        "material": "초고압 압력 용기, 오일 가열 히터 펌프, 유압 실린더, PLC 자동화 제어반",
        "function": "고온 고압(2000기압)의 액체 압력을 균일하게 가해 전고체 전지 셀의 공극을 없애는 프레스기",
        "expected_chapter": ["84"],
        "expected_heading": ["8462", "8479"]
    },
    {
        "id": 38,
        "name": "생성형 AI 연산 가속용 12단 적층 고대역폭 메모리 (HBM3E) 패키지 칩",
        "material": "실리콘 관통전극(TSV) 연결 DRAM 다이 12단, 베이스 로직 다이, EMC 몰딩",
        "function": "초당 1.2TB 속도로 데이터를 전송하여 AI GPU와 직접 통신하는 다층 직접회로 메모리",
        "expected_chapter": ["85"],
        "expected_heading": ["8542"]
    },
    {
        "id": 39,
        "name": "신재생에너지 송전망 연계용 대용량 초고압 직류송전(HVDC) 전력변환 밸브",
        "material": "IGBT 전력반도체 스택, 수냉식 방열판, 광섬유 게이트 드라이버 유닛",
        "function": "해상풍력의 교류(AC) 전력을 초고압 직류(DC)로 변환하여 장거리 송전하는 전력 변환기",
        "expected_chapter": ["85"],
        "expected_heading": ["8504"]
    },
    {
        "id": 40,
        "name": "자율주행 레벨4 차량용 77GHz 밀리미터파 4D 이미징 레이더 센서 모듈",
        "material": "밀리미터파 레이더 트랜시버 RFIC, 평면 패치 안테나 어레이, DSP 신호처리 보드",
        "function": "전방 300m 이내 차량과 보행자의 거리, 속도, 방위각, 높이를 전천후 감지하는 레이더",
        "expected_chapter": ["85"],
        "expected_heading": ["8526"]
    },
    {
        "id": 41,
        "name": "반도체 클린룸용 무진 비접촉 자기부상 OHT (Overhead Hoist Transport) 반송차",
        "material": "리니어 유도 모터, 영구자석 부상 모듈, 웨이퍼 FOUP 파지 벨트, 무선 통신 모듈",
        "function": "클린룸 천장 레일을 따라 마찰 분진 없이 초고속으로 웨이퍼 캐리어를 자동 이송하는 궤도 반송기",
        "expected_chapter": ["84", "86"],
        "expected_heading": ["8428", "8604"]
    },

    # --- Section XVII: Transport & Aerospace (Ch 86-89) ---
    {
        "id": 42,
        "name": "미래 친환경 철도용 수소연료전지-리튬배터리 하이브리드 기관차",
        "material": "강철 차체, 400kW 수소연료전지 파워팩, 영구자석 동기 견인 전동기",
        "function": "비전철화 구간에서 온실가스 없이 수소와 배터리로 화물 열차를 견인하는 철도 차량",
        "expected_chapter": ["86"],
        "expected_heading": ["8602", "8601"]
    },
    {
        "id": 43,
        "name": "항만 무인 자동화용 AI 라이다 자율주행 전기 스트래들 캐리어",
        "material": "고강도 갠트리 프레임, 4륜 조향 인휠 모터, 컨테이너 트위스트락 스프레더",
        "function": "컨테이너 야드에서 40피트 해상 컨테이너를 집어 올려 무인으로 이송 및 적재하는 특수 하역차량",
        "expected_chapter": ["84", "87"],
        "expected_heading": ["8426", "8709", "8479"]
    },
    {
        "id": 44,
        "name": "해상 탄소포집 저장용 무탄소 암모니아 추진 액화이산화탄소(LCO2) 전용 운반선",
        "material": "저온 압력용기용 강재 선체, 암모니아 연소 이중연료 디젤 엔진, 극저온 보랭 화물창",
        "function": "포집된 이산화탄소를 액화 상태로 해상 운송하여 해저에 격리 저장하는 특수 화물 선박",
        "expected_chapter": ["89"],
        "expected_heading": ["8901"]
    },
    {
        "id": 45,
        "name": "행성 탐사 로버용 다관절 로봇 팔 및 심부 암석 코어링 시추 모듈",
        "material": "티타늄 하모닉 드라이브 감속기, 다이아몬드 코어 비트, 분광 분석 센서 헤드",
        "function": "우주 행성 표면의 암석을 드릴로 시추하여 샘플을 채취하는 탐사 로봇의 부속 장치",
        "expected_chapter": ["84", "88"],
        "expected_heading": ["8479", "8802", "8430"]
    },

    # --- Section XVIII & XX: Precision Medical, Optics, Misc High-Tech (Ch 90-96) ---
    {
        "id": 46,
        "name": "척추 미세 수술용 3D CT 실시간 연동 햅틱 로봇 수술 콘솔 기기",
        "material": "마스터 조종 콘솔 핸들, 햅틱 포스 피드백 모터, 고해상도 3D 입체 디스플레이",
        "function": "의사가 원격으로 조작하여 환자의 척추 신경 손상 없이 나사못을 정밀 삽입하는 외과 수술 장비",
        "expected_chapter": ["90"],
        "expected_heading": ["9018"]
    },
    {
        "id": 47,
        "name": "원전 주변 방사능 오염 감시용 고순도 게르마늄(HPGe) 감마선 분광 분석기",
        "material": "고순도 단결정 게르마늄 검출기, 액체질소 냉각 크라이오스탯, 다채널 파고분석기(MCA)",
        "function": "방사성 핵종(세슘, 요오드 등)이 방출하는 감마선 에너지를 측정하여 방사능 농도를 정밀 분석하는 계측기",
        "expected_chapter": ["90"],
        "expected_heading": ["9030", "9027"]
    },
    {
        "id": 48,
        "name": "XR 공간 컴퓨팅 헤드셋용 초고휘도 실리콘 기반 유기발광다이오드 (OLEDoS) 패널",
        "material": "실리콘 CMOS 웨이퍼 백플레인, 화이트 OLED 발광층, 초미세 RGB 컬러필터",
        "function": "1.03인치 크기에 4K 해상도를 구현하여 증강현실 안경에 초고화질 가상화면을 투사하는 마이크로 패널",
        "expected_chapter": ["85"],
        "expected_heading": ["8528", "8541"]
    },
    {
        "id": 49,
        "name": "하반신 마비 환자 보행 재활용 착용형 외골격 로봇 슈트 (Exoskeleton)",
        "material": "탄소섬유 프레임, 인체공학적 고관절/무릎 전동 액추에이터, 족압 센서, 스마트 배터리팩",
        "function": "보행 장애인이 착용하여 스스로 일어서고 걸을 수 있도록 다리 근력을 보조하는 정형외과용 재활기기",
        "expected_chapter": ["90", "84"],
        "expected_heading": ["9021", "8479"]
    },
    {
        "id": 50,
        "name": "위변조 방지용 키랄 나노 액정 분산 보안 광학 필름",
        "material": "콜레스테릭 액정 고분자 코팅 PET 필름 (특정 파장 원편광 반사)",
        "function": "보는 각도와 편광 필터에 따라 색상이 전환되어 여권 및 신분증의 위조를 원천 차단하는 광학 필름",
        "expected_chapter": ["39", "90"],
        "expected_heading": ["3920", "9013", "3919"]
    }
]

def run_benchmark():
    print("=" * 100, flush=True)
    print(">> [CUSWAY] 출시 전 최종 50개 신규 품목 AI RAG 품목분류 벤치마크 검증 시작", flush=True)
    print("=" * 100, flush=True)

    db = SessionLocal()
    results = []
    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(NEW_50_RELEASE_ITEMS, 1):
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_chapters = item["expected_chapter"]
        expected_headings = item["expected_heading"]
        
        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=name,
                material=material,
                function_use=func,
                db=db
            )
            
            rec_code = res.get("recommendedHsCode", "0000.00-0000")
            confidence = res.get("confidence", 0)
            
            clean_code = rec_code.replace('.', '').replace('-', '').strip()
            rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
            rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

            is_pass = (rec_chapter in expected_chapters) or (rec_heading in expected_headings)

            if is_pass:
                passed_count += 1
                status_str = "PASS"
            else:
                status_str = f"FAIL (예상 호: {' / '.join(expected_headings)})"
                failed_items.append({
                    "id": item["id"],
                    "name": name,
                    "recommended": rec_code,
                    "expected_headings": expected_headings,
                    "expected_chapters": expected_chapters,
                    "reasoning": res.get("legalReasoning", "")
                })

            print(f"[{idx:02d}/50] {name:<45} -> 추천: {rec_code:<12} (신뢰도: {confidence}%) | {status_str}", flush=True)

        except Exception as e:
            print(f"[{idx:02d}/50] {name:<45} -> ERROR: {str(e)}", flush=True)
            failed_items.append({
                "id": item["id"],
                "name": name,
                "error": str(e)
            })

    elapsed = time.time() - start_time
    total = len(NEW_50_RELEASE_ITEMS)
    accuracy = (passed_count / total) * 100
    error_rate = 100.0 - accuracy

    print("-" * 100, flush=True)
    print(f"[결과 요약] 통과: {passed_count}/{total}건 | 정확도: {accuracy:.1f}% | 오류율: {error_rate:.1f}% | 소요시간: {elapsed:.2f}초", flush=True)
    print("=" * 100, flush=True)

    if failed_items:
        print(f"\n[미통과 품목 목록 ({len(failed_items)}건)]", flush=True)
        for f in failed_items:
            print(f" - #{f['id']:02d} {f['name']} -> 추천: {f.get('recommended', 'N/A')} (예상: {f.get('expected_headings')})", flush=True)

    db.close()
    return passed_count, total, failed_items

if __name__ == "__main__":
    run_benchmark()
