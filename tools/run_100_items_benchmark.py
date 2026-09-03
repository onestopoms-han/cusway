# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: 100 New Future Advanced Products Benchmark Simulator
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

NEW_FUTURE_100 = [
    # --- Section I & II: Bio/Food Tech (Ch 01-24) ---
    {
        "id": 1,
        "name": "식물성 대체 단백질 인공 연어 필레",
        "material": "미세조류 추출 단백질 60%, 완두콩 단백질 30%, 식물성 오일 10%",
        "function": "실제 연어의 결감과 영양을 모사한 3D 바이오 프린팅 식물성 대체 수산물 식품",
        "expected_chapter": ["21", "03", "16"],
        "expected_heading": ["2106", "0304", "1604"]
    },
    {
        "id": 2,
        "name": "식용 곤충 갈색거저리 추출 고순도 단백질 분말",
        "material": "갈색거저리(Tenebrio molitor) 유충 탈지 단백질 분말 100%",
        "function": "미래 대체 단백질 공급용으로 가공된 식용 곤충 가공 분말",
        "expected_chapter": ["04", "21", "23"],
        "expected_heading": ["0410", "2106", "2309"]
    },
    {
        "id": 3,
        "name": "효소 변환 고순도 액상 알룰로스 시럽",
        "material": "D-알룰로스(D-Psicose) 수용액 99.5%",
        "function": "효소 반응으로 과당을 변환하여 제조한 무설탕 제로칼로리 기능성 대체 감미료",
        "expected_chapter": ["17", "29"],
        "expected_heading": ["1702", "2940"]
    },
    {
        "id": 4,
        "name": "비건 코코넛 오일 기반 식물성 대체 슬라이스 치즈",
        "material": "정제 코코넛 오일 40%, 변성 전분 30%, 효모 추출물 10%, 정제수",
        "function": "유제품 알레르기 소비자를 위한 비건 치즈 대체 조제품",
        "expected_chapter": ["21", "04"],
        "expected_heading": ["2106", "0406"]
    },
    {
        "id": 5,
        "name": "진공 저온 증류 무알코올 발효 맥주 음료",
        "material": "보리 맥아 발효액, 홉, 정제수 (알코올 농도 0.00%)",
        "function": "발효 후 알코올을 분리 추출하여 만든 청량 음료",
        "expected_chapter": ["22"],
        "expected_heading": ["2202"]
    },
    {
        "id": 6,
        "name": "동결건조 유기농 아사이베리 과육 분말",
        "material": "아사이베리(Euterpe oleracea) 동결건조 분말 100%",
        "function": "항산화 영양 보충용 과실 가공 건조 분말",
        "expected_chapter": ["21", "08", "11"],
        "expected_heading": ["2106", "0811", "1106"]
    },
    {
        "id": 7,
        "name": "해조류 추출 바이오 식물성 젤라틴 대체재 분말",
        "material": "홍조류 카라기난 및 갈조류 알긴산나트륨 혼합 분말 100%",
        "function": "동물성 젤라틴을 대체하는 식물성 점증/겔화제 조제품",
        "expected_chapter": ["13", "39", "21"],
        "expected_heading": ["1302", "3913", "2106"]
    },
    {
        "id": 8,
        "name": "미세조류 배양 비건 오메가3 DHA 정제 오일",
        "material": "쉬조키트리움(Schizochytrium) 미세조류 추출 지방산 100%",
        "function": "중금속 걱정 없는 식물성 EPA/DHA 건강기능식품 원료 오일",
        "expected_chapter": ["15", "21"],
        "expected_heading": ["1515", "2106"]
    },
    {
        "id": 9,
        "name": "스마트팜 수경재배 건조 로즈마리 잎",
        "material": "수경재배 로즈마리 건조 잎 100%",
        "function": "식품 조미료 및 향료용 건조 허브 식물",
        "expected_chapter": ["12", "09"],
        "expected_heading": ["1211", "0910"]
    },
    {
        "id": 10,
        "name": "정밀 발효 미생물 배양 유청 단백질 분말",
        "material": "유전자재조합 효모 발효 베타락토글로불린 98%",
        "function": "소 없이 미생물 발효로 합성한 순수 단백질 원료",
        "expected_chapter": ["35", "21"],
        "expected_heading": ["3502", "3504", "2106"]
    },

    # --- Section VI: Chemical & Pharma (Ch 28-38) ---
    {
        "id": 11,
        "name": "2차전지용 실리콘-탄소(Si-C) 나노 복합 음극재 분말",
        "material": "나노 실리콘 입자 20%, 다공성 탄소 매트릭스 80%",
        "function": "전기차 배터리의 에너지 밀도를 극대화하는 리튬 2차전지용 음극 활물질",
        "expected_chapter": ["28", "38"],
        "expected_heading": ["2804", "3801", "3824"]
    },
    {
        "id": 12,
        "name": "바이오 피마자유 기반 고순도 세바식산 결정 분말",
        "material": "세바식산(Sebacic Acid, C10H18O4) 99.8%",
        "function": "생분해성 플라스틱 및 바이오 나일론 중합용 디카르복실산 유기화합물",
        "expected_chapter": ["29"],
        "expected_heading": ["2917"]
    },
    {
        "id": 13,
        "name": "리소좀 축적질환 치료용 재조합 효소 단백질 원액",
        "material": "유전자재조합 아갈시다제 베타 수용액",
        "function": "파브리병 환자의 효소 결핍을 치료하는 바이오 의약품 원료",
        "expected_chapter": ["30"],
        "expected_heading": ["3002", "3004"]
    },
    {
        "id": 14,
        "name": "mRNA 백신 약물 전달용 이온화 지질나노입자(LNP) 조제품",
        "material": "양이온성 지질, 콜레스테롤, DSPC, PEG-지질 복합 현탁액",
        "function": "mRNA 유전물질을 세포 내로 안전하게 침투시키는 나노 약물 전달체",
        "expected_chapter": ["38", "30", "29"],
        "expected_heading": ["3824", "3002", "2923"]
    },
    {
        "id": 15,
        "name": "친환경 식물성 합성 에스테르 변압기 절연유",
        "material": "합성 펜타에리스리톨 에스테르 99.5%, 산화방지제 0.5%",
        "function": "초고압 변압기의 전기 절연 및 냉각용 생분해성 절연유",
        "expected_chapter": ["38", "27"],
        "expected_heading": ["3824", "2710", "3819"]
    },
    {
        "id": 16,
        "name": "화장품용 레스베라트롤 리포솜 나노 캡슐 분산액",
        "material": "인지질 리포솜, 레스베라트롤 5%, 정제수 75%, 부틸렌글라이콜",
        "function": "피부 침투율을 높인 기능성 주름개선 안티에이징 화장품 원료",
        "expected_chapter": ["33", "38"],
        "expected_heading": ["3304", "3824"]
    },
    {
        "id": 17,
        "name": "선박용 무독성 실리콘 하이드로겔 방오 도료",
        "material": "실리콘 수지 60%, 불소 폴리머 20%, 용제 20%",
        "function": "해양 생물이 선체에 달라붙지 못하게 하는 친환경 방오 페인트",
        "expected_chapter": ["32"],
        "expected_heading": ["3208", "3209"]
    },
    {
        "id": 18,
        "name": "반도체 패키징용 고내열 에폭시 몰딩 컴파운드(EMC)",
        "material": "에폭시 수지 15%, 구상 실리카 필러 80%, 경화제 5%",
        "function": "반도체 칩을 습기, 충격, 열로부터 보호 밀봉하는 봉지재",
        "expected_chapter": ["38", "39"],
        "expected_heading": ["3824", "3907"]
    },
    {
        "id": 19,
        "name": "2차전지 전극용 고분자량 PVDF 바인더 용액",
        "material": "폴리비닐리덴 플루오라이드(PVDF) 12%, NMP 용매 88%",
        "function": "양극 활물질을 알루미늄 집전체에 결착시키는 2차전지용 바인더",
        "expected_chapter": ["39", "38"],
        "expected_heading": ["3904", "3824"]
    },
    {
        "id": 20,
        "name": "폐플라스틱 화학적 재활용 열분해 정제 나프타",
        "material": "C5~C12 파라핀 및 올레핀계 탄화수소 100%",
        "function": "석유화학 나프타 분해 공정(NCC)에 재투입되는 플라스틱 재생 원료유",
        "expected_chapter": ["27"],
        "expected_heading": ["2710"]
    },

    # --- Section VII: Plastics & Rubber (Ch 39-40) ---
    {
        "id": 21,
        "name": "플렉서블 디스플레이용 투명 전도성 고분자 필름",
        "material": "PEDOT:PSS 전도성 코팅 폴리에틸렌 테레프탈레이트(PET) 필름",
        "function": "터치스크린 전극용 투명하고 유연한 전도성 플라스틱 필름",
        "expected_chapter": ["39"],
        "expected_heading": ["3920", "3907"]
    },
    {
        "id": 22,
        "name": "농업용 생분해성 PLA/PBAT 멀칭 필름",
        "material": "폴리락틱산(PLA) 40%, 폴리부틸렌 아디페이트 테레프탈레이트(PBAT) 60%",
        "function": "작물 수확 후 흙 속에서 자연 분해되는 친환경 농업용 피복 필름",
        "expected_chapter": ["39"],
        "expected_heading": ["3920", "3921"]
    },
    {
        "id": 23,
        "name": "수소 충전소용 수소 가스 변색 감지 고무 가스켓",
        "material": "불소고무(FKM) 90%, 수소 반응 변색 염료 10%",
        "function": "수소 누출 시 색상이 변하여 육안으로 누출을 감지하는 배관 밀봉용 고무 링",
        "expected_chapter": ["40", "38"],
        "expected_heading": ["4016", "3824"]
    },
    {
        "id": 24,
        "name": "우주 발사체 밸브용 초내한 불소 실리콘 고무 O링",
        "material": "불소실리콘 고무(FVMQ) 100%",
        "function": "영하 150도 극저온 액체산소 밸브를 밀폐하는 고성능 패킹 부품",
        "expected_chapter": ["40"],
        "expected_heading": ["4016"]
    },
    {
        "id": 25,
        "name": "차세대 전자소자용 투명 폴리이미드(CPI) 에어로겔 시트",
        "material": "다공성 투명 폴리이미드 에어로겔 100%",
        "function": "5G 고주파 안테나의 유전율 저하 및 단열용 초경량 플라스틱 시트",
        "expected_chapter": ["39"],
        "expected_heading": ["3920", "3921"]
    },
    {
        "id": 26,
        "name": "자동차 경량화 구조용 탄소섬유 강화 열가소성 복합재 시트 (CFRTP)",
        "material": "폴리아미드(PA6) 매트릭스 50%, 연속 탄소섬유 직물 50%",
        "function": "열성형 가공으로 자동차 차체 부품을 제작하는 고강도 경량 시트",
        "expected_chapter": ["39", "68"],
        "expected_heading": ["3921", "6815"]
    },
    {
        "id": 27,
        "name": "반도체 클린룸용 정전기 방지 초고투명 CPP 필름",
        "material": "무연신 폴리프로필렌(CPP) 99%, 대전방지제 1%",
        "function": "정전기 및 이물질 부착을 방지하는 반도체 웨이퍼 포장용 필름",
        "expected_chapter": ["39"],
        "expected_heading": ["3920"]
    },
    {
        "id": 28,
        "name": "인공 심장 펌프용 의료용 액상 실리콘 고무(LSR) 멤브레인",
        "material": "생체적합성 의료용 액상 실리콘 엘라스토머 100%",
        "function": "혈액 펌프 박동 시 반복 신축 구동하는 의료 기기용 실리콘 부품",
        "expected_chapter": ["39", "40", "90"],
        "expected_heading": ["3926", "4016", "9021"]
    },
    {
        "id": 29,
        "name": "해양 완전 생분해성 PHA 수지 일차제품 펠릿",
        "material": "폴리하이드록시알카노에이트(PHA) 수지 100%",
        "function": "해수에서도 6개월 내 90% 이상 분해되는 바이오 플라스틱 사출 원료",
        "expected_chapter": ["39"],
        "expected_heading": ["3907", "3913"]
    },
    {
        "id": 30,
        "name": "스마트 윈도우용 고분자 분산형 액정(PDLC) 광학 필름",
        "material": "액정 액적 분산 아크릴 고분자층, 양면 ITO 코팅 PET 필름",
        "function": "전원 인가 시 투명/불투명 상태가 제어되는 스마트 차광 필름",
        "expected_chapter": ["39", "90"],
        "expected_heading": ["3920", "9013"]
    },

    # --- Section XI: Textiles & Wearables (Ch 50-63) ---
    {
        "id": 31,
        "name": "스마트 의류용 탄소나노튜브 발열 방직사",
        "material": "탄소나노튜브(CNT) 코팅 폴리에스테르 연속 필라멘트사",
        "function": "전류가 흐르면 원적외선 열을 방출하는 전도성 발열 실",
        "expected_chapter": ["56", "54", "55"],
        "expected_heading": ["5605", "5402", "5509"]
    },
    {
        "id": 32,
        "name": "의료 방사선 방호용 텅스텐 나노분말 함침 복합 직물",
        "material": "나일론 직물 40%, 텅스텐(W) 나노 입자 함침 실리콘 60%",
        "function": "납을 대체하여 X선을 차단하는 가볍고 무독성인 방사선 방호복용 직물",
        "expected_chapter": ["59", "54"],
        "expected_heading": ["5903", "5911", "5407"]
    },
    {
        "id": 33,
        "name": "유전자재조합 미생물 유래 인공 거미줄 생체 섬유 방적사",
        "material": "재조합 거미 실크 스파이도인 단백질 섬유 100%",
        "function": "강철보다 강하고 나일론보다 유연한 인공 거미줄 방직용 실",
        "expected_chapter": ["54", "55", "50"],
        "expected_heading": ["5402", "5503", "5004"]
    },
    {
        "id": 34,
        "name": "웨어러블 발전용 PVDF 압전 나노섬유 복합 직물",
        "material": "PVDF 압전 전기방사 나노섬유층, 은도금 전도성 직물 전극",
        "function": "인체 움직임에 의한 압력 변화로 전기를 생산하는 자가발전 직물",
        "expected_chapter": ["59", "56"],
        "expected_heading": ["5903", "5603"]
    },
    {
        "id": 35,
        "name": "초경량 난연 파라-아라미드 방탄 조끼용 직물",
        "material": "초고강도 파라-아라미드(Kevlar) 필라멘트 직물 100%",
        "function": "군경용 방탄 조끼 및 방검복을 제작하는 고인성 방호 직물",
        "expected_chapter": ["54", "59"],
        "expected_heading": ["5407", "5903"]
    },
    {
        "id": 36,
        "name": "수소 연료전지용 탄소종이 가스확산층 (GDL)",
        "material": "탄소섬유 부직포 80%, PTFE 불소수지 코팅 20%",
        "function": "수소와 산소의 가스 확산 및 생성수를 배출하는 연료전지 핵심 직물 부품",
        "expected_chapter": ["68", "56", "59"],
        "expected_heading": ["6815", "5603", "5911"]
    },
    {
        "id": 37,
        "name": "해양 미세플라스틱 포집용 고내구성 나노섬유 필터 부직포",
        "material": "폴리에테르술폰(PES) 전기방사 나노섬유 다공성 부직포 100%",
        "function": "1마이크로미터 이하의 미세플라스틱을 거르는 정밀 해수 여과 필터",
        "expected_chapter": ["56", "59"],
        "expected_heading": ["5603", "5911"]
    },
    {
        "id": 38,
        "name": "스마트 헬스케어 심전도 측정용 은도금 전도성 니트 밴드",
        "material": "은(Ag) 도금 폴리아미드 원사 40%, 탄성 스판덱스 60%",
        "function": "가슴에 착용하여 피부 접촉으로 생체 심전도(ECG) 신호를 감지하는 밴드",
        "expected_chapter": ["61", "63"],
        "expected_heading": ["6117", "6307"]
    },
    {
        "id": 39,
        "name": "흡수성 수술용 폴리디옥사논(PDO) 모노필라멘트 봉합사",
        "material": "폴리디옥사논(Polydioxanone) 멸균 원사 100%",
        "function": "체내 봉합 후 6개월 내에 무해하게 분해 흡수되는 외과용 수술 봉합사",
        "expected_chapter": ["30", "54"],
        "expected_heading": ["3006", "5404"]
    },
    {
        "id": 40,
        "name": "극지 탐험용 에어로겔 단열 패딩 방한모",
        "material": "방수 나일론 겉감, 실리카 에어로겔 부직포 단열재, 양모 안감",
        "function": "영하 50도 극한 환경에서 체온을 유지하는 초단열 머리 보호 모자",
        "expected_chapter": ["65"],
        "expected_heading": ["6505", "6506"]
    },

    # --- Section XIII & XIV: Stone, Glass, Ceramics, Precious Metals (Ch 68-71) ---
    {
        "id": 41,
        "name": "전기차 배터리 열폭주 방지용 실리카 에어로겔 차단 패드",
        "material": "실리카 에어로겔 70%, 유리섬유 매트 30%",
        "function": "배터리 셀 사이에 장착되어 화재 전이를 차단하는 초내열 방화 패드",
        "expected_chapter": ["68"],
        "expected_heading": ["6806", "6815"]
    },
    {
        "id": 42,
        "name": "반도체 웨이퍼 CMP 연마용 합성 다이아몬드 연마 슬러리",
        "material": "나노 다이아몬드 분말 5%, 실리카 졸 15%, 탈이온수 80%",
        "function": "반도체 실리콘 및 SiC 웨이퍼 표면을 나노 단위로 평탄화하는 연마액",
        "expected_chapter": ["38", "71"],
        "expected_heading": ["3824", "7105"]
    },
    {
        "id": 43,
        "name": "폴더블 스마트폰용 초박형 화학강화유리 (UTG)",
        "material": "두께 30㎛ 알루미노실리케이트 화학 강화 판유리",
        "function": "20만 회 이상 접었다 펼 수 있는 유연한 폴더블 디스플레이 커버 유리",
        "expected_chapter": ["70"],
        "expected_heading": ["7006", "7007"]
    },
    {
        "id": 44,
        "name": "원자력 발전용 탄화규소(SiC) 세라믹 복합재 피복관",
        "material": "SiC 섬유 강화 탄화규소(SiC/SiC) 복합 세라믹 튜브",
        "function": "1200도 이상 고온에서도 수소 폭발 위험이 없는 원전 핵연료 보호관",
        "expected_chapter": ["69", "68"],
        "expected_heading": ["6909", "6815"]
    },
    {
        "id": 45,
        "name": "양자 컴퓨팅 센서용 NV센터 합성 단결정 다이아몬드 기판",
        "material": "질소-공공(NV) 센터 도핑 고순도 합성 다이아몬드 웨이퍼",
        "function": "상온에서 초정밀 자기장 및 온도를 측정하는 양자 센서 칩 기판",
        "expected_chapter": ["71"],
        "expected_heading": ["7104", "7105"]
    },
    {
        "id": 46,
        "name": "건축 외장용 투명 건물일체형 태양광(BIPV) 강화 판유리",
        "material": "투명 페로브스카이트 태양전지 셀 삽입 접합 강화유리",
        "function": "건물 창호 역할을 하면서 동시에 전력을 생산하는 발전용 판유리",
        "expected_chapter": ["70", "85"],
        "expected_heading": ["7007", "8541", "7005"]
    },
    {
        "id": 47,
        "name": "초저손실 광섬유 제조용 고순도 합성 석영유리 프리폼 봉",
        "material": "고순도 이산화규소(SiO2) 합성 석영 유리 원통 봉",
        "function": "고온 인발 공정을 통해 통신용 광섬유 케이블을 뽑아내는 모재",
        "expected_chapter": ["70"],
        "expected_heading": ["7002", "9001"]
    },
    {
        "id": 48,
        "name": "수소 터빈용 이트리아 안정화 지르코니아(YSZ) 열차폐 세라믹 코팅 분말",
        "material": "지르코니아(ZrO2) 92%, 산화이트륨(Y2O3) 8% 복합 산화물 분말",
        "function": "1500도 고온 가스터빈 블레이드 표면에 플라즈마 용사 코팅하는 단열재",
        "expected_chapter": ["69", "38", "28"],
        "expected_heading": ["6909", "3824", "2825"]
    },
    {
        "id": 49,
        "name": "전고체 배터리용 가넷형 LLZO 고체 세라믹 전해질 펠릿",
        "material": "리튬-란타넘-지르코늄 산화물(Li7La3Zr2O12) 결정 세라믹",
        "function": "액체 전해액 없이 리튬 이온을 전달하는 불연성 고체 전해질",
        "expected_chapter": ["69", "28", "38"],
        "expected_heading": ["6909", "2853", "3824"]
    },
    {
        "id": 50,
        "name": "우주망원경용 초저열팽창 글래스 세라믹 거울 블랭크",
        "material": "제로듀어(Zerodur) 리튬-알루미노실리케이트 유리 세라믹",
        "function": "온도 변화에도 형태 왜곡이 없는 우주 반사경 원자재",
        "expected_chapter": ["70", "90"],
        "expected_heading": ["7006", "7014", "9001"]
    },

    # --- Section XV: Base Metals & Advanced Alloys (Ch 72-83) ---
    {
        "id": 51,
        "name": "금속 3D 프린팅용 고순도 티타늄 합금 (Ti-6Al-4V) 구형 분말",
        "material": "티타늄 90%, 알루미늄 6%, 바나듐 4% 가스 분무 분말",
        "function": "항공우주 및 의료용 임플란트를 적층 제조하는 3D 프린터 원료",
        "expected_chapter": ["81"],
        "expected_heading": ["8108"]
    },
    {
        "id": 52,
        "name": "전기차 구동모터용 초극박 고효율 무방향성 규소강판 코일",
        "material": "철 96.5%, 규소 3.2%, 알루미늄 0.3% 합금 강판 (두께 0.20mm)",
        "function": "모터 회전 시 전력 손실을 최소화하는 전기강판",
        "expected_chapter": ["72"],
        "expected_heading": ["7225", "7226"]
    },
    {
        "id": 53,
        "name": "우주 항공 발사체용 알루미늄-리튬(Al-Li) 합금 단조 링",
        "material": "알루미늄 95%, 리튬 2%, 구리 2%, 지르코늄 1% 단조품",
        "function": "우주로켓 동체 프레임을 구성하는 초경량 고강도 금속 링",
        "expected_chapter": ["76"],
        "expected_heading": ["7601", "7616"]
    },
    {
        "id": 54,
        "name": "액화수소 저장탱크용 고망간 오스테나이트강 극저온 강판",
        "material": "철 72%, 망간 24%, 크롬 3%, 탄소 1% 합금강",
        "function": "영하 253도 액화수소 저장 환경에서 충격 인성을 유지하는 강판",
        "expected_chapter": ["72"],
        "expected_heading": ["7225", "7219"]
    },
    {
        "id": 55,
        "name": "스마트폰 폴더블 힌지용 지르코늄 기반 비정질 액체금속(Liquidmetal)",
        "material": "지르코늄-티타늄-니켈-구리-베릴륨 비정질 합금 성형품",
        "function": "초고탄성과 내마모성을 갖춘 정밀 폴더블 힌지 기어 부품",
        "expected_chapter": ["81"],
        "expected_heading": ["8113", "8112"]
    },
    {
        "id": 56,
        "name": "가스터빈 고온부용 니켈계 단결정 초합금 터빈 블레이드",
        "material": "니켈 60%, 코발트 10%, 크롬 8%, 레늄 3%, 텅스텐 합금",
        "function": "1400도 고온 연소가스 속에서 발전 터빈을 구동하는 내열 합금 블레이드",
        "expected_chapter": ["84", "75"],
        "expected_heading": ["8411", "7508", "8406"]
    },
    {
        "id": 57,
        "name": "수전해 수소발생 스택용 백금 도금 티타늄 다공성 수송층 (PTL)",
        "material": "티타늄 소결 다공성 시트, 백금(Pt) 1㎛ 전기도금",
        "function": "PEM 수전해 장치에서 물과 산소 가스를 확산 수송하는 전극판",
        "expected_chapter": ["81", "71", "84"],
        "expected_heading": ["8108", "7110", "8479"]
    },
    {
        "id": 58,
        "name": "2차전지 음극 집전체용 두께 4.5㎛ 초극박 압연 동박 코일",
        "material": "고순도 전기동(Cu 99.99%) 압연 박판 코일",
        "function": "음극 활물질 슬러리를 코팅하여 전류를 모으는 2차전지용 박",
        "expected_chapter": ["74"],
        "expected_heading": ["7410"]
    },
    {
        "id": 59,
        "name": "초경량 마그네슘 합금 다이캐스팅 드론 기체 프레임",
        "material": "마그네슘 90%, 알루미늄 9%, 아연 1% (AZ91D) 주조품",
        "function": "비행 시간 연장을 위한 드론 본체 경량 구조 프레임",
        "expected_chapter": ["81", "88"],
        "expected_heading": ["8104", "8807"]
    },
    {
        "id": 60,
        "name": "원자로 제어봉용 고순도 하프늄(Hf) 합금 튜브",
        "material": "하프늄 97%, 지르코늄 3% 합금 튜브",
        "function": "중성자를 흡수하여 원자로 핵분열 연쇄반응을 제어하는 원자로 튜브",
        "expected_chapter": ["81", "84"],
        "expected_heading": ["8112", "8401"]
    },

    # --- Section XVI: Advanced Machinery & Electronics (Ch 84-85) ---
    {
        "id": 61,
        "name": "반도체 극자외선(EUV) 노광장비용 CO2 고출력 레이저 광원 모듈",
        "material": "탄산가스 레이저 발진기, 펄스 증폭기, 빔 집속 챔버",
        "function": "주석 드롭렛을 타격하여 13.5nm 파장의 극자외선 광을 생성하는 장치 부품",
        "expected_chapter": ["84", "90"],
        "expected_heading": ["8486", "9013"]
    },
    {
        "id": 62,
        "name": "스마트 물류센터용 라이다 기반 자율주행 무인이송로봇 (AGV/AMR)",
        "material": "LiDAR 센서, SLAM 제어 보드, BLDC 모터 휠, 리튬 배터리",
        "function": "물류 창고에서 팔레트 및 물품을 무인으로 자동 운반하는 로봇",
        "expected_chapter": ["84", "87"],
        "expected_heading": ["8479", "8709"]
    },
    {
        "id": 63,
        "name": "양자컴퓨터 냉각용 무냉매 극저온 헬륨 희석냉동기",
        "material": "3He-4He 희석 챔버, 펄스 튜브 냉각기, 극저온 차폐 실드",
        "function": "양자 큐비트 프로세서를 절대영도에 가까운 10mK 극저온으로 냉각하는 장치",
        "expected_chapter": ["84"],
        "expected_heading": ["8418", "8479"]
    },
    {
        "id": 64,
        "name": "산업용 드론 탑재용 수소연료전지 발전 파워팩",
        "material": "고분자전해질 연료전지 스택, 수소 감압 레귤레이터, DC-DC 컨버터",
        "function": "수소를 산소와 반응시켜 드론 구동 모터에 연속 전력을 공급하는 발전기",
        "expected_chapter": ["85"],
        "expected_heading": ["8501", "8504"]
    },
    {
        "id": 65,
        "name": "전기차 인버터용 1200V 탄화규소(SiC) 전력반도체 모듈",
        "material": "SiC MOSFET 칩, DBC 세라믹 기판, 알루미늄 방열 베이스",
        "function": "배터리의 직류 전원을 모터 구동용 교류 전원으로 초고효율 변환하는 모듈",
        "expected_chapter": ["85"],
        "expected_heading": ["8541", "8504"]
    },
    {
        "id": 66,
        "name": "비침습 뇌파(EEG) 측정 및 무선 전송 BCI 헤드셋",
        "material": "건식 전극 센서, 생체신호 증폭 ASIC 칩, 블루투스 송신기",
        "function": "뇌파를 실시간 측정하여 휠체어나 컴퓨터를 생각만으로 제어하는 인터페이스 기기",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9018", "8517"]
    },
    {
        "id": 67,
        "name": "신재생에너지 ESS용 바나듐 레독스 흐름 전지(VRFB) 스택",
        "material": "카본 펠트 전극, 이온교환막, 티타늄 바이폴라 플레이트",
        "function": "바나듐 수계 전해액을 순환시켜 대용량 전력을 충방전하는 대형 에너지 저장 스택",
        "expected_chapter": ["85"],
        "expected_heading": ["8507"]
    },
    {
        "id": 68,
        "name": "산업용 티타늄 금속 3D 프린터 레이저 소결 적층제조기",
        "material": "파이버 레이저, 분말 베드 챔버, 갈바노미터 스캐너, CNC 제어부",
        "function": "금속 분말을 레이저로 한 층씩 용융 소결하여 3차원 금속 부품을 조형하는 기계",
        "expected_chapter": ["84"],
        "expected_heading": ["8485", "8479"]
    },
    {
        "id": 69,
        "name": "자율주행 4단계용 128채널 3차원 차량용 라이다(LiDAR) 센서",
        "material": "905nm 파장 레이저 다이오드 어레이, SPAD 수광 소자, 회전 미러 모듈",
        "function": "차량 주변 200m 이내 물체의 3차원 점군 공간 데이터를 실시간 생성하는 센서",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9031", "8526", "9015"]
    },
    {
        "id": 70,
        "name": "AI 데이터센터 광통신용 800Gbps QSFP-DD 광트랜시버",
        "material": "실리콘 포토닉스 광엔진, 레이저 다이오드, DSP 제어 칩",
        "function": "전기 신호를 광 신호로 초고속 변환하여 광섬유 케이블로 송수신하는 모듈",
        "expected_chapter": ["85"],
        "expected_heading": ["8517", "8541"]
    },
    {
        "id": 71,
        "name": "인공태양 핵융합로용 초전도 토카막 전자석 코일",
        "material": "Nb3Sn 초전도 선재, 스테인리스 극저온 재킷 도관, 에폭시 절연",
        "function": "초고온 플라즈마를 공중에 가두기 위해 13테슬라 이상의 초강력 자기장을 생성하는 코일",
        "expected_chapter": ["85"],
        "expected_heading": ["8505", "8543"]
    },
    {
        "id": 72,
        "name": "원거리 초음파 집속 무선 전력전송 수신 모듈",
        "material": "압전 세라믹 초음파 수신 트랜스듀서, 정류 회로, 안테나 기판",
        "function": "공기 중으로 전달된 초음파 에너지를 전기에너지로 변환하는 무선 충전 수신기",
        "expected_chapter": ["85"],
        "expected_heading": ["8504", "8543"]
    },
    {
        "id": 73,
        "name": "인공지능 휴머노이드 로봇 관절용 프레임리스 BLDC 로터리 액추에이터",
        "material": "영구자석 동기모터, 하모닉 드라이브 감속기, 중공축 앱솔루트 엔코더",
        "function": "인간형 로봇의 팔다리 관절을 정밀하고 강력하게 구동하는 일체형 액추에이터",
        "expected_chapter": ["85", "84"],
        "expected_heading": ["8501", "8483"]
    },
    {
        "id": 74,
        "name": "스마트 안경 AR용 초소형 마이크로 LED 디스플레이 패널",
        "material": "초고밀도 마이크로 LED 어레이(화소 크기 5㎛), 실리콘 백플레인 기판",
        "function": "증강현실 안경 렌즈에 고휘도 영상을 투사하는 초소형 디스플레이",
        "expected_chapter": ["85"],
        "expected_heading": ["8528", "8541"]
    },
    {
        "id": 75,
        "name": "스마트 팩토리 품질검사용 딥러닝 임베디드 엣지 비전 카메라",
        "material": "글로벌 셔터 CMOS 이미지 센서, NPU 연산 프로세서, 방열 알루미늄 케이스",
        "function": "제조 라인에서 부품의 미세 불량을 AI 실시간 영상 분석으로 자동 검출하는 카메라",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9031", "8525"]
    },
    {
        "id": 76,
        "name": "원전 고방사선 내환경 다관절 원격 제어 로봇 매니퓰레이터",
        "material": "텅스텐 방사선 차폐 하우징, 티타늄 감속기 관절, 내방사선 케이블",
        "function": "사람이 접근할 수 없는 원전 폐로 현장에서 절단 및 폐기물 수거를 수행하는 로봇 팔",
        "expected_chapter": ["84"],
        "expected_heading": ["8479", "8428"]
    },
    {
        "id": 77,
        "name": "스마트폰용 초소형 MEMS 압력 센서 칩",
        "material": "실리콘 다이어프램 압저항 소자, ASIC 신호처리 회로",
        "function": "대기압을 측정하여 고도와 층간 이동을 정밀 감지하는 소형 센서 칩",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9026", "8542", "9031"]
    },
    {
        "id": 78,
        "name": "고체 산화물 수전해(SOEC) 고온 수소 발생 스택",
        "material": "이트리아 안정화 지르코니아(YSZ) 세라믹 셀, 페로브스카이트 전극, 인터커넥터",
        "function": "700도 고온 수증기를 전기분해하여 청정 수소를 대량 제조하는 스택 장치",
        "expected_chapter": ["85", "84"],
        "expected_heading": ["8543", "8419"]
    },
    {
        "id": 79,
        "name": "저궤도 통신위성 추적용 전자식 위상배열 평면 안테나 (ESA)",
        "material": "RF 위상변위기 집적회로 칩 어레이, 다층 고주파 PCB 기판",
        "function": "기계적 회전 없이 전자적으로 빔을 조향하여 고속 이동 위성과 통신하는 안테나",
        "expected_chapter": ["85"],
        "expected_heading": ["8517", "8529"]
    },
    {
        "id": 80,
        "name": "전기차 주차 구역 매립형 무선 충전 송신 패드",
        "material": "리츠선 자기유도 코일, 페라이트 자기 차폐판, 방수 알루미늄 외함",
        "function": "주차된 전기차 하부로 자기장을 방출하여 비접촉 충전하는 송신 장치",
        "expected_chapter": ["85"],
        "expected_heading": ["8504", "8543"]
    },

    # --- Section XVII: Transport & Aerospace (Ch 86-89) ---
    {
        "id": 81,
        "name": "도심항공교통(UAM) 4인승 순수전기 수직이착륙 무인 자율비행체",
        "material": "탄소섬유 복합재 동체, 8축 분산 전기 추진 모터, 항법 비행제어 컴퓨터",
        "function": "도심 상공을 수직 이착륙하여 승객을 자율 비행으로 수송하는 비행체",
        "expected_chapter": ["88"],
        "expected_heading": ["8806", "8802"]
    },
    {
        "id": 82,
        "name": "심해 6000m 탐사용 자율무인잠수정 (AUV)",
        "material": "티타늄 내압 선체, 리튬폴리머 배터리, 다중빔 음향측심기(MBES), 추진기",
        "function": "해저 지형 및 심해 자원을 무인으로 탐사 매핑하는 잠수정",
        "expected_chapter": ["89"],
        "expected_heading": ["8906", "8901"]
    },
    {
        "id": 83,
        "name": "하이퍼루프 튜브 초고속 주행용 자기부상 보기(Bogie) 대차",
        "material": "고온 초전도 자석 모듈, 선형 유도 전동기 스테이터, 알루미늄 서스펜션",
        "function": "진공 튜브 내에서 시속 1000km로 부상하여 주행하는 철도 대차",
        "expected_chapter": ["86"],
        "expected_heading": ["8607"]
    },
    {
        "id": 84,
        "name": "우주 발사체 상단 궤도 투입용 메탄-액체산소 로켓 엔진",
        "material": "인코넬 3D 프린팅 재생냉각 연소기, 터보펌프, 짐벌 엑추에이터",
        "function": "소형 위성을 목표 우주 궤도에 정밀 안착시키는 우주 로켓 엔진",
        "expected_chapter": ["84"],
        "expected_heading": ["8412"]
    },
    {
        "id": 85,
        "name": "해상 운송용 무탄소 암모니아 연소 선박용 대형 디젤 엔진",
        "material": "주철 크랭크케이스, 암모니아 고압 직분사 밸브, SCR 촉매 후처리 장치",
        "function": "온실가스 배출 없이 암모니아를 연소하여 대형 상선을 추진하는 엔진",
        "expected_chapter": ["84"],
        "expected_heading": ["8408", "8409"]
    },
    {
        "id": 86,
        "name": "친환경 물류 수송용 수소연료전지 대형 트랙터 트럭",
        "material": "고강도 강철 프레임, 350kW 수소연료전지 스택, 고압 수소탱크, 구동모터",
        "function": "컨테이너 트레일러를 견인하여 장거리 화물을 무공해 수송하는 트랙터",
        "expected_chapter": ["87"],
        "expected_heading": ["8701", "8704"]
    },
    {
        "id": 87,
        "name": "산불 진화용 자율비행 소화탄 투하 특수 드론",
        "material": "카본 복합재 프레임, 열화상 탐지 카메라, 분말 소화탄 투하 장치",
        "function": "접근이 어려운 야간 산불 현장에 소화탄을 정밀 투하하여 진화하는 특수 드론",
        "expected_chapter": ["88", "84"],
        "expected_heading": ["8806", "8424"]
    },
    {
        "id": 88,
        "name": "우주 쓰레기 포집 및 궤도 제거용 서비스 위성",
        "material": "우주용 알루미늄 구조체, 다관절 로봇 팔, 랑데부 도킹 센서, 이온 엔진",
        "function": "우주 궤도를 떠도는 고장난 인공위성을 포획하여 대기권으로 재돌입 소멸시키는 위성",
        "expected_chapter": ["88", "84"],
        "expected_heading": ["8802", "8479"]
    },
    {
        "id": 89,
        "name": "해양 레저용 휴대용 전동 수중 스쿠터 (Diver Propulsion Vehicle)",
        "material": "방수 ABS 하우징, 브러시리스 수중 프로펠러, 리튬이온 배터리 팩",
        "function": "다이버가 손으로 잡고 수중에서 최대 시속 7km로 추진 잠수하는 레저 장비",
        "expected_chapter": ["95", "89"],
        "expected_heading": ["9506", "8903"]
    },
    {
        "id": 90,
        "name": "군용 특수부대 상륙작전용 무인 수륙양용 다목적 전술차량",
        "material": "방탄 알루미늄 합금 차체, 8x8 독립 구동 수냉식 모터, 워터제트 추진기",
        "function": "수상과 육상을 자유롭게 넘나들며 정찰 및 특수 물자를 수송하는 수륙양용차량",
        "expected_chapter": ["87"],
        "expected_heading": ["8703", "8704", "8705"]
    },

    # --- Section XVIII & XX: Medical, Optics, Misc High-Tech (Ch 90-96) ---
    {
        "id": 91,
        "name": "비침습 레이저 광음향 혈당 측정기",
        "material": "근적외선 펄스 레이저 다이오드, 광음향 압전 센서, OLED 디스플레이",
        "function": "피부를 찌르지 않고 레이저 빛으로 혈관 내 포도당 농도를 연속 측정하는 의료기기",
        "expected_chapter": ["90"],
        "expected_heading": ["9018", "9027"]
    },
    {
        "id": 92,
        "name": "뇌수술용 정밀 증강현실(AR) 3차원 수술 내비게이션 시스템",
        "material": "광학식 위치 추적 카메라, 수술 기구 마커, 실시간 3D 렌더링 컴퓨터",
        "function": "환자의 뇌 CT/MRI 영상을 환부 위에 실시간 3차원으로 겹쳐 투영하는 정밀 수술 가이드 장비",
        "expected_chapter": ["90"],
        "expected_heading": ["9018", "9031"]
    },
    {
        "id": 93,
        "name": "반도체 2nm 공정 검사용 원자간력 현미경 (AFM)",
        "material": "피에조 캔틸레버 나노 프로브, 레이저 간섭 변위 센서, 방진 제진대",
        "function": "원자 크기의 팁으로 웨이퍼 표면을 스캔하여 3차원 미세 형상을 비파괴 측정하는 계측기",
        "expected_chapter": ["90"],
        "expected_heading": ["9012", "9031"]
    },
    {
        "id": 94,
        "name": "망막 질환 환자 시력 회복용 체내 삽입형 인공 망막 전자 임플란트",
        "material": "생체 적합 티타늄 마이크로 전극 어레이, 무선 전력 수신 코일, ASIC 칩",
        "function": "망막 뒤에 삽입되어 시신경에 직접 전기 자극을 주어 시각을 복원하는 인공 장기",
        "expected_chapter": ["90"],
        "expected_heading": ["9021"]
    },
    {
        "id": 95,
        "name": "지하 광물 및 지하수 탐사용 초정밀 원자 양자 중력계",
        "material": "루비듐 원자 자기광학트랩 챔버, 라만 레이저 간섭계, 진공 시스템",
        "function": "절대 중력 가속도의 미세 변화를 양자 간섭으로 측정하여 지하 구조를 탐사하는 물리분석기",
        "expected_chapter": ["90"],
        "expected_heading": ["9015", "9031"]
    },
    {
        "id": 96,
        "name": "소화관 전 구간 자율 검진용 스마트 무선 캡슐 내시경",
        "material": "생체적합성 폴리카보네이트 캡슐, 초소형 초광각 CMOS 렌즈, 무선 RF 송신기",
        "function": "환자가 알약처럼 삼키면 장기를 통과하며 고화질 내부 영상을 무선 전송하는 내시경",
        "expected_chapter": ["90"],
        "expected_heading": ["9018"]
    },
    {
        "id": 97,
        "name": "양자 암호 통신망용 단일 광자 송수신 광학계 모듈",
        "material": "초전도 나노와이어 단일광자 검출기(SNSPD), 정밀 광섬유 결합 렌즈계",
        "function": "양자키(QKD) 단일 광자 펄스를 손실 없이 송수신하여 도청 불가능한 암호 통신을 구현하는 장치",
        "expected_chapter": ["90", "85"],
        "expected_heading": ["9013", "8517"]
    },
    {
        "id": 98,
        "name": "미세조류 광합성 탄소포집 및 산소발생 스마트 가구 조명",
        "material": "투명 바이오 반응기 유리 튜브, 배양액 펌프, 식물성장용 LED 조명",
        "function": "실내 이산화탄소를 흡수하고 산소를 방출하며 은은한 무드 조명을 제공하는 스마트 실내 가구",
        "expected_chapter": ["94", "84"],
        "expected_heading": ["9405", "8421"]
    },
    {
        "id": 99,
        "name": "독거노인 돌봄 및 정서 교감형 AI 대화 반려 로봇 인형",
        "material": "실리콘 스킨 외피, 터치 감정 센서, 음성인식 마이크, 대화형 AI 프로세서",
        "function": "어르신의 말벗이 되어주고 응급 상황 시 보호자에게 구조 신호를 보내는 반려 로봇 인형",
        "expected_chapter": ["95", "85", "84"],
        "expected_heading": ["9503", "8543", "8479"]
    },
    {
        "id": 100,
        "name": "귀금속 및 고가 미술품 진품 인증용 나노 DNA 바코드 보안 라벨",
        "material": "합성 DNA 올리고머 함유 특수 보안 잉크 인쇄 점착 필름 라벨",
        "function": "위조가 불가능한 고유 DNA 염기서열 정보를 담아 물품에 부착하는 보안 인증 라벨",
        "expected_chapter": ["39", "49", "38"],
        "expected_heading": ["3919", "4911", "3824"]
    }
]

def run_benchmark():
    print("=" * 100, flush=True)
    print(">> [CUSWAY] 신규 미래 혁신 100대 품목 AI RAG 품목분류 정밀 검증 시작", flush=True)
    print("=" * 100, flush=True)

    db = SessionLocal()
    results = []
    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(NEW_FUTURE_100, 1):
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
            
            clean_code = rec_code.replace('.', '').replace('-', '')
            rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
            rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

            is_pass = (rec_chapter in expected_chapters) or (rec_heading in expected_headings)

            if is_pass:
                passed_count += 1
                status_str = "✅ PASS"
            else:
                status_str = f"❌ FAIL (예상: 제{' / '.join(expected_headings)}호)"
                failed_items.append({
                    "id": item["id"],
                    "name": name,
                    "recommended": rec_code,
                    "expected_headings": expected_headings,
                    "expected_chapters": expected_chapters
                })

            print(f"[{idx:03d}/100] {name:<45} ➔ 추천: {rec_code:<12} (신뢰도: {confidence}%) | {status_str}", flush=True)

        except Exception as e:
            print(f"[{idx:03d}/100] {name:<45} ➔ ⚠️ ERROR: {str(e)}", flush=True)
            failed_items.append({
                "id": item["id"],
                "name": name,
                "error": str(e)
            })

    elapsed = time.time() - start_time
    total = len(NEW_FUTURE_100)
    accuracy = (passed_count / total) * 100
    error_rate = 100.0 - accuracy

    print("-" * 100, flush=True)
    print(f"📊 [결과 요약] 통과: {passed_count}/{total}건 | 정확도: {accuracy:.1f}% | 오류율: {error_rate:.1f}% | 소요시간: {elapsed:.2f}초", flush=True)
    print("=" * 100, flush=True)

    if failed_items:
        print(f"\n⚠️ [미통과 품목 목록 ({len(failed_items)}건)]", flush=True)
        for f in failed_items:
            print(f" - #{f['id']:03d} {f['name']} ➔ 추천: {f.get('recommended', 'N/A')} (예상 호: {f.get('expected_headings')})", flush=True)

    db.close()
    return passed_count, total, failed_items

if __name__ == "__main__":
    run_benchmark()
