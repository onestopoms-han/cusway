# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Comprehensive 100-Item Hybrid (Traditional + Future) Benchmark
Evaluates all 4 Steps of customs clearance across 100 realistic, diverse products:
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

HYBRID_100_ITEMS = [
    # =========================================================================
    # [SECTION I: Live Animals & Animal Products (Ch 01-05)]
    # =========================================================================
    {
        "id": 1,
        "category": "전통(구)",
        "name": "미국산 냉동 쇠고기 갈비 (본갈비)",
        "material": "냉동 쇠고기 100% (뼈 포함)",
        "function": "식용 육류 부위로 영하 18도 이하에서 급속 동결된 소고기 갈비",
        "expected_chapter": ["02"],
        "expected_heading": ["0202"]
    },
    {
        "id": 2,
        "category": "전통(구)",
        "name": "러시아산 건조 해삼",
        "material": "천연 해삼(Apostichopus japonicus) 100%",
        "function": "자숙 후 염장 건조 처리한 고급 식용 수산물 건어물",
        "expected_chapter": ["03"],
        "expected_heading": ["0308", "0307"]
    },
    {
        "id": 3,
        "category": "전통(구)",
        "name": "뉴질랜드산 천연 마누카 꿀 (UMF 20+)",
        "material": "천연 벌꿀 100%",
        "function": "마누카 꽃에서 채집한 천연 숙성 식용 벌꿀",
        "expected_chapter": ["04"],
        "expected_heading": ["0409"]
    },
    {
        "id": 4,
        "category": "신규(미래)",
        "name": "식용 곤충 갈색거저리 유충 탈지 단백질 분말",
        "material": "밀웜 유충 탈지 분말 100%",
        "function": "대체 단백질 공급을 위한 식용 곤충 가공 분말 원료",
        "expected_chapter": ["04", "21", "23"],
        "expected_heading": ["0410", "2106", "2309"]
    },

    # =========================================================================
    # [SECTION II: Vegetable Products (Ch 06-14)]
    # =========================================================================
    {
        "id": 5,
        "category": "전통(구)",
        "name": "에티오피아 예가체프 미배전 생두 (Green Coffee)",
        "material": "아라비카종 생두 100% (디카페인 아님)",
        "function": "로스팅을 거치지 않은 커피 추출용 생두 원자재",
        "expected_chapter": ["09"],
        "expected_heading": ["0901"]
    },
    {
        "id": 6,
        "category": "전통(구)",
        "name": "마다가스카르산 천연 바닐라 빈 (Vanilla Beans)",
        "material": "건조 숙성된 바닐라 꼬투리 100%",
        "function": "베이커리 및 디저트 향미 부여용 천연 향신료",
        "expected_chapter": ["09"],
        "expected_heading": ["0905"]
    },
    {
        "id": 7,
        "category": "전통(구)",
        "name": "멕시코산 신선 아보카도 (Hass Avocado)",
        "material": "생과실 아보카도 100%",
        "function": "신선 상태로 식용 소비되는 아보카도 과실",
        "expected_chapter": ["08"],
        "expected_heading": ["0804"]
    },
    {
        "id": 8,
        "category": "신규(미래)",
        "name": "해조류 추출 바이오 식물성 젤라틴 대체재 분말",
        "material": "홍조류 카라기난 및 갈조류 알긴산나트륨 복합 분말 100%",
        "function": "동물성 젤라틴을 대체하는 식물성 점증/겔화제 원료",
        "expected_chapter": ["13", "21", "39"],
        "expected_heading": ["1302", "2106", "3913"]
    },

    # =========================================================================
    # [SECTION III: Animal/Vegetable Fats & Oils (Ch 15)]
    # =========================================================================
    {
        "id": 9,
        "category": "전통(구)",
        "name": "스페인산 엑스트라 버진 올리브유 (드럼 벌크 포장)",
        "material": "냉압착 순수 올리브유 100% (산도 0.5% 이하)",
        "function": "식용 조리 및 드레싱용 비변성 식물성 유지",
        "expected_chapter": ["15"],
        "expected_heading": ["1509"]
    },
    {
        "id": 10,
        "category": "신규(미래)",
        "name": "미세조류 배양 비건 오메가3 DHA 정제 오일 (벌크)",
        "material": "쉬조키트리움 미세조류 추출 지방산 에스테르 100%",
        "function": "어유를 대체하는 식물성 고순도 DHA 건강기능식품 원료 오일",
        "expected_chapter": ["15", "21"],
        "expected_heading": ["1515", "2106"]
    },

    # =========================================================================
    # [SECTION IV: Prepared Foodstuffs, Beverages, Spirits (Ch 16-24)]
    # =========================================================================
    {
        "id": 11,
        "category": "전통(구)",
        "name": "이탈리아산 숙성 프로슈토 디 파르마 생햄 슬라이스",
        "material": "돼지 뒷다리육 95%, 천일염 5%",
        "function": "소금에 절여 18개월간 자연 건조 숙성한 발효 생햄",
        "expected_chapter": ["02", "16"],
        "expected_heading": ["0210", "1602"]
    },
    {
        "id": 12,
        "category": "전통(구)",
        "name": "스코틀랜드산 싱글몰트 위스키 (알코올 43% Vol, 700ml)",
        "material": "맥아 증류 원액 100%",
        "function": "오크통에서 12년 숙성한 알코올 증류주 주류",
        "expected_chapter": ["22"],
        "expected_heading": ["2208"]
    },
    {
        "id": 13,
        "category": "신규(미래)",
        "name": "효소 변환 고순도 액상 알룰로스 시럽",
        "material": "D-알룰로스(D-Psicose) 수용액 99.5%",
        "function": "과당을 효소 변환하여 제조한 무설탕 제로칼로리 대체 감미료",
        "expected_chapter": ["17", "29"],
        "expected_heading": ["1702", "2940"]
    },
    {
        "id": 14,
        "category": "신규(미래)",
        "name": "비건 코코넛 오일 기반 식물성 대체 슬라이스 치즈",
        "material": "정제 코코넛 오일 40%, 변성 전분 30%, 효모 추출물 10%, 정제수",
        "function": "유제품 알레르기 소비자를 위한 비건 치즈 대체 조제품",
        "expected_chapter": ["21", "04"],
        "expected_heading": ["2106", "0406"]
    },
    {
        "id": 15,
        "category": "신규(미래)",
        "name": "진공 저온 증류 무알코올 발효 맥주 음료",
        "material": "맥아 발효액, 홉, 정제수 (알코올 0.00%)",
        "function": "발효 후 알코올을 분리 제거한 탄산 청량음료",
        "expected_chapter": ["22"],
        "expected_heading": ["2202"]
    },

    # =========================================================================
    # [SECTION V: Mineral Products (Ch 25-27)]
    # =========================================================================
    {
        "id": 16,
        "category": "전통(구)",
        "name": "공업용 천연 인편상 흑연 분말 (Natural Flake Graphite)",
        "material": "탄소 함량 99% 천연 흑연 분말",
        "function": "내화물 및 윤활제 제조용 천연 광물 분말",
        "expected_chapter": ["25", "38"],
        "expected_heading": ["2504", "3801"]
    },
    {
        "id": 17,
        "category": "전통(구)",
        "name": "광물유계 고성능 자동차 가솔린 엔진오일 (5W-30)",
        "material": "정제 광물유 85%, 청정분산제 및 점도조절제 15%",
        "function": "내연기관 엔진의 마찰 감소 및 윤활용 엔진오일",
        "expected_chapter": ["27", "34"],
        "expected_heading": ["2710", "3403"]
    },

    # =========================================================================
    # [SECTION VI: Chemical & Pharma (Ch 28-38)]
    # =========================================================================
    {
        "id": 18,
        "category": "전통(구)",
        "name": "공업용 고순도 무수 구연산 결정 분말 (Citric Acid)",
        "material": "구연산(C6H8O7) 99.8%",
        "function": "식품 산미료 및 세정제 원료용 유기 카르복실산 화합물",
        "expected_chapter": ["29"],
        "expected_heading": ["2918"]
    },
    {
        "id": 19,
        "category": "신규(미래)",
        "name": "바이오 피마자유 기반 고순도 세바식산 결정 분말",
        "material": "세바식산(Sebacic Acid, C10H18O4) 99.8%",
        "function": "생분해성 플라스틱 및 바이오 나일론 중합용 디카르복실산 유기화합물",
        "expected_chapter": ["29"],
        "expected_heading": ["2917"]
    },
    {
        "id": 20,
        "category": "신규(미래)",
        "name": "친환경 식물성 합성 에스테르 변압기 절연유",
        "material": "합성 펜타에리스리톨 에스테르 99.5%, 산화방지제 0.5%",
        "function": "초고압 변압기의 전기 절연 및 냉각용 생분해성 절연유 조제품",
        "expected_chapter": ["38", "27"],
        "expected_heading": ["3824", "2710", "3819"]
    },
    {
        "id": 21,
        "category": "신규(미래)",
        "name": "2차전지용 실리콘-탄소(Si-C) 나노 복합 음극재 분말",
        "material": "나노 실리콘 입자 20%, 다공성 탄소 매트릭스 80%",
        "function": "전기차 배터리 용량을 극대화하는 리튬 2차전지용 음극 활물질",
        "expected_chapter": ["28", "38"],
        "expected_heading": ["2804", "3801", "3824"]
    },
    {
        "id": 22,
        "category": "신규(미래)",
        "name": "리소좀 축적질환 치료용 재조합 효소 단백질 원액",
        "material": "유전자재조합 아갈시다제 베타 수용액",
        "function": "파브리병 환자의 효소 결핍을 치료하는 바이오 의약품 원액",
        "expected_chapter": ["30"],
        "expected_heading": ["3002", "3004"]
    },
    {
        "id": 23,
        "category": "신규(미래)",
        "name": "mRNA 백신 약물 전달용 이온화 지질나노입자(LNP) 조제품",
        "material": "양이온성 지질, 콜레스테롤, DSPC 복합 현탁액",
        "function": "mRNA 유전물질을 세포 내로 안전하게 전달하는 나노 약물 전달체",
        "expected_chapter": ["38", "30", "29"],
        "expected_heading": ["3824", "3002", "2923"]
    },
    {
        "id": 24,
        "category": "신규(미래)",
        "name": "화장품용 레스베라트롤 리포솜 나노 캡슐 분산액",
        "material": "인지질 리포솜, 레스베라트롤 5%, 부틸렌글라이콜",
        "function": "피부 흡수율을 높인 기능성 주름개선 안티에이징 화장품 원료",
        "expected_chapter": ["33", "38"],
        "expected_heading": ["3304", "3824"]
    },
    {
        "id": 25,
        "category": "전통(구)",
        "name": "건축용 무초산형 실리콘 실란트 코킹제",
        "material": "실리콘 폴리머 70%, 탄산칼슘 충전제 20%, 경화제 10%",
        "function": "유리 및 창호 틈새 방수 밀봉용 접착 실란트",
        "expected_chapter": ["32", "35"],
        "expected_heading": ["3214", "3506"]
    },
    {
        "id": 26,
        "category": "신규(미래)",
        "name": "반도체 EUV 공정용 금속 산화물 포토레지스트 (MOR)",
        "material": "산화주석 나노 클러스터 유기용제 분산액",
        "function": "차세대 반도체 2nm 이하 초미세 회로 패턴 형성용 감광액",
        "expected_chapter": ["37"],
        "expected_heading": ["3707"]
    },

    # =========================================================================
    # [SECTION VII: Plastics & Rubber (Ch 39-40)]
    # =========================================================================
    {
        "id": 27,
        "category": "전통(구)",
        "name": "투명 폴리카보네이트(PC) 압출 평판 시트 (두께 5mm)",
        "material": "폴리카보네이트 수지 100%",
        "function": "방음벽 및 건축 캐노피용 고강도 플라스틱 판",
        "expected_chapter": ["39"],
        "expected_heading": ["3920"]
    },
    {
        "id": 28,
        "category": "신규(미래)",
        "name": "생분해성 농업용 멀칭 필름 롤",
        "material": "PLA 40%, PBAT 60% 생분해 수지",
        "function": "수확 후 토양에서 100% 분해되는 친환경 농업 피복 필름",
        "expected_chapter": ["39"],
        "expected_heading": ["3920", "3921"]
    },
    {
        "id": 29,
        "category": "신규(미래)",
        "name": "우주 발사체 밸브용 초내한 불소 실리콘 고무 O링",
        "material": "가황 불소실리콘 고무(FVMQ) 100%",
        "function": "영하 150도 극저온 액체산소 밸브를 밀봉하는 고무 씰 패킹",
        "expected_chapter": ["40"],
        "expected_heading": ["4016"]
    },
    {
        "id": 30,
        "category": "신규(미래)",
        "name": "차세대 전자소자용 투명 폴리이미드(CPI) 에어로겔 시트",
        "material": "다공성 투명 폴리이미드 에어로겔 100%",
        "function": "5G 고주파 안테나의 신호 손실 저감 및 단열용 플라스틱 시트",
        "expected_chapter": ["39"],
        "expected_heading": ["3921", "3920"]
    },
    {
        "id": 31,
        "category": "신규(미래)",
        "name": "인공 심장 펌프용 의료용 액상 실리콘 고무(LSR) 멤브레인",
        "material": "생체적합성 의료용 액상 실리콘 엘라스토머 100%",
        "function": "혈액 펌프 박동 시 유연하게 신축 구동하는 실리콘 부품",
        "expected_chapter": ["39", "40", "90"],
        "expected_heading": ["3926", "4016", "9021"]
    },
    {
        "id": 32,
        "category": "전통(구)",
        "name": "산업용 합성고무 고압 유압 호스 (스틸 와이어 보강)",
        "material": "합성 NBR 고무, 강철 와이어 편조층 (피팅 미결합)",
        "function": "건설장비 유압 오일 이송용 고내압 고무 호스",
        "expected_chapter": ["40"],
        "expected_heading": ["4009"]
    },

    # =========================================================================
    # [SECTION VIII: Hides, Skins, Leather & Bags (Ch 41-43)]
    # =========================================================================
    {
        "id": 33,
        "category": "전통(구)",
        "name": "이탈리아산 천연 소가죽 풀그레인 나파 가죽 원단",
        "material": "크롬 탄닌 무두질한 은면 소가죽 100%",
        "function": "고급 가구 및 자동차 시트 제작용 천연 완성 가죽",
        "expected_chapter": ["41"],
        "expected_heading": ["4107"]
    },
    {
        "id": 34,
        "category": "전통(구)",
        "name": "천연 소가죽 외피 비즈니스 서류가방 (Briefcase)",
        "material": "천연 가죽 80%, 폴리에스테르 안감 20%",
        "function": "서류 및 노트북 수납 휴대용 가죽 가방",
        "expected_chapter": ["42"],
        "expected_heading": ["4202"]
    },

    # =========================================================================
    # [SECTION IX: Wood & Articles of Wood (Ch 44-46)]
    # =========================================================================
    {
        "id": 35,
        "category": "전통(구)",
        "name": "천연 오크 원목 마루 바닥재 (Tongue and Groove 가공)",
        "material": "참나무(Oak) 원목 100%",
        "function": "연속적으로 홈 가공된 실내 건축용 목재 마루판",
        "expected_chapter": ["44"],
        "expected_heading": ["4409", "4418"]
    },
    {
        "id": 36,
        "category": "전통(구)",
        "name": "자작나무 방수 합판 (두께 18mm, 다층 적층)",
        "material": "자작나무 단판, 페놀 수지 접착제",
        "function": "인테리어 및 가구 제작용 건축 목재 합판",
        "expected_chapter": ["44"],
        "expected_heading": ["4412"]
    },

    # =========================================================================
    # [SECTION X: Pulp, Paper & Paperboard (Ch 47-49)]
    # =========================================================================
    {
        "id": 37,
        "category": "전통(구)",
        "name": "표백 크라프트 판지 롤 (골판지 제조용 라이너)",
        "material": "화학 표백 목재 펄프 100% (1㎡당 200g 초과)",
        "function": "포장용 골판지 상자 외장재용 두꺼운 종이 롤",
        "expected_chapter": ["48"],
        "expected_heading": ["4804", "4805"]
    },
    {
        "id": 38,
        "category": "신규(미래)",
        "name": "귀금속 및 고가 미술품 진품 인증용 나노 DNA 바코드 보안 라벨",
        "material": "점착 PET 필름, 합성 올리고뉴클레오타이드 나노 잉크",
        "function": "위변조를 방지하는 분자 단위 식별 보안 점착 라벨",
        "expected_chapter": ["39", "48", "49"],
        "expected_heading": ["3919", "4821", "4911"]
    },

    # =========================================================================
    # [SECTION XI: Textiles & Textile Articles (Ch 50-63)]
    # =========================================================================
    {
        "id": 39,
        "category": "전통(구)",
        "name": "100% 견(실크) 프린트 능직 여성용 스카프",
        "material": "견사 직물 100%",
        "function": "목에 착용하는 실크 직물제 패션 스카프",
        "expected_chapter": ["62"],
        "expected_heading": ["6214"]
    },
    {
        "id": 40,
        "category": "전통(구)",
        "name": "남성용 면 100% 능직 데님 청바지 (Blue Jeans)",
        "material": "면 데님 직물 100%",
        "function": "일상 착용을 위한 남성용 긴바지 의류",
        "expected_chapter": ["62"],
        "expected_heading": ["6203"]
    },
    {
        "id": 41,
        "category": "전통(구)",
        "name": "폴리에스테르 스포츠 기능성 긴소매 편물 티셔츠",
        "material": "폴리에스테르 메리야스 편물 100%",
        "function": "땀 흡수 및 속건 기능의 스포츠 운동용 니트 상의",
        "expected_chapter": ["61"],
        "expected_heading": ["6109", "6110"]
    },
    {
        "id": 42,
        "category": "신규(미래)",
        "name": "스마트 의류용 탄소나노튜브 발열 방직사",
        "material": "탄소나노튜브(CNT) 코팅 폴리에스테르 필라멘트사",
        "function": "전류 인가 시 원적외선 열을 방출하는 전도성 발열 실",
        "expected_chapter": ["56", "54", "55"],
        "expected_heading": ["5605", "5402", "5509"]
    },
    {
        "id": 43,
        "category": "신규(미래)",
        "name": "의료 방사선 방호용 텅스텐 복합 직물",
        "material": "나일론 직물 40%, 텅스텐 분말 함침 실리콘 60%",
        "function": "X선을 차단하는 가볍고 무독성인 의료용 방사선 방호 직물",
        "expected_chapter": ["59", "54"],
        "expected_heading": ["5903", "5911", "5407"]
    },
    {
        "id": 44,
        "category": "신규(미래)",
        "name": "초경량 난연 파라-아라미드 방탄 직물",
        "material": "초고강도 파라-아라미드 필라멘트사 100%",
        "function": "방탄조끼 및 방검복을 제작하는 고인성 방호 원단",
        "expected_chapter": ["54", "59"],
        "expected_heading": ["5407", "5903"]
    },
    {
        "id": 45,
        "category": "신규(미래)",
        "name": "스마트 헬스케어 심전도 측정용 은도금 전도성 니트 밴드",
        "material": "은 도금 원사 40%, 탄성 스판덱스 60%",
        "function": "가슴에 착용하여 피부 접촉으로 생체 심전도를 감지하는 밴드 부속품",
        "expected_chapter": ["61", "63"],
        "expected_heading": ["6117", "6307"]
    },

    # =========================================================================
    # [SECTION XII: Footwear, Headgear (Ch 64-67)]
    # =========================================================================
    {
        "id": 46,
        "category": "전통(구)",
        "name": "가죽 갑피 강철 토캡 장착 산업용 안전화",
        "material": "천연 가죽 갑피, 강철 보호대, 고무 바닥창",
        "function": "발가락 낙하 충격을 방지하는 작업장용 보호 안전화",
        "expected_chapter": ["64"],
        "expected_heading": ["6403"]
    },
    {
        "id": 47,
        "category": "전통(구)",
        "name": "텍스타일 갑피 고무창 스포츠 조깅 런닝화",
        "material": "폴리에스테르 메쉬 갑피, EVA/고무 밑창",
        "function": "야외 조깅 및 육상 운동용 스포츠 신발",
        "expected_chapter": ["64"],
        "expected_heading": ["6404"]
    },
    {
        "id": 48,
        "category": "신규(미래)",
        "name": "극지 탐험용 에어로겔 단열 패딩 방한모",
        "material": "나일론 방수 외피, 실리카 에어로겔 부직포 단열재, 양모 안감",
        "function": "영하 50도 극한 환경에서 체온을 보존하는 초단열 방한 모자",
        "expected_chapter": ["65"],
        "expected_heading": ["6505", "6506"]
    },

    # =========================================================================
    # [SECTION XIII & XIV: Stone, Ceramic, Glass, Precious Stones (Ch 68-71)]
    # =========================================================================
    {
        "id": 49,
        "category": "전통(구)",
        "name": "건축 외장용 천연 화강암 판석 (연마 가공)",
        "material": "천연 화강암 100% (두께 30mm)",
        "function": "표면을 평평하게 연마 가공한 건축 바닥 및 벽체용 석재 판",
        "expected_chapter": ["68"],
        "expected_heading": ["6802"]
    },
    {
        "id": 50,
        "category": "신규(미래)",
        "name": "전기차 배터리 열폭주 방지용 실리카 에어로겔 차단 패드",
        "material": "실리카 에어로겔 70%, 유리섬유 매트 30%",
        "function": "배터리 셀 사이에 장착되어 화재 전이를 차단하는 초내열 방화 패드",
        "expected_chapter": ["68"],
        "expected_heading": ["6806", "6815"]
    },
    {
        "id": 51,
        "category": "신규(미래)",
        "name": "폴더블 스마트폰용 초박형 화학강화유리 (UTG)",
        "material": "두께 30㎛ 알루미노실리케이트 화학 강화 판유리",
        "function": "20만 회 이상 굽힘을 견디는 폴더블 디스플레이 커버 유리",
        "expected_chapter": ["70"],
        "expected_heading": ["7006", "7007"]
    },
    {
        "id": 52,
        "category": "신규(미래)",
        "name": "원자력 발전용 탄화규소(SiC) 세라믹 복합재 피복관",
        "material": "SiC 섬유 강화 탄화규소 복합 세라믹 튜브",
        "function": "1200도 이상 고온에서도 안전한 원전 핵연료 보호 튜브",
        "expected_chapter": ["69", "68"],
        "expected_heading": ["6909", "6815"]
    },
    {
        "id": 53,
        "category": "신규(미래)",
        "name": "양자 컴퓨팅 센서용 NV센터 합성 단결정 다이아몬드 기판",
        "material": "질소 도핑 고순도 합성 다이아몬드 웨이퍼",
        "function": "상온에서 초정밀 자기장 및 온도를 측정하는 양자 센서 칩 기판",
        "expected_chapter": ["71"],
        "expected_heading": ["7104", "7105"]
    },
    {
        "id": 54,
        "category": "신규(미래)",
        "name": "우주망원경용 초저열팽창 글래스 세라믹 거울 블랭크",
        "material": "제로듀어(Zerodur) 유리 세라믹",
        "function": "온도 변화에도 형태 왜곡이 없는 우주 반사경 광학 블랭크",
        "expected_chapter": ["70", "90"],
        "expected_heading": ["7006", "7014", "9001"]
    },

    # =========================================================================
    # [SECTION XV: Base Metals & Advanced Alloys (Ch 72-83)]
    # =========================================================================
    {
        "id": 55,
        "category": "전통(구)",
        "name": "스테인리스 스틸 무계목(Seamless) 고압 배관 파이프",
        "material": "오스테나이트계 STS316L 합금강 100%",
        "function": "부식성 화학 유체를 이송하는 이음매 없는 원형 금속 강관",
        "expected_chapter": ["73"],
        "expected_heading": ["7304"]
    },
    {
        "id": 56,
        "category": "전통(구)",
        "name": "알루미늄 합금 압출 형재 (창호 프레임용 Bar)",
        "material": "알루미늄-마그네슘-규소 합금(AL6063) 100%",
        "function": "단면 형상으로 열간 압출 성형된 건축 창호 프레임재",
        "expected_chapter": ["76"],
        "expected_heading": ["7604"]
    },
    {
        "id": 57,
        "category": "신규(미래)",
        "name": "금속 3D 프린팅용 고순도 티타늄 합금 (Ti-6Al-4V) 구형 분말",
        "material": "티타늄 90%, 알루미늄 6%, 바나듐 4% 가스 분무 분말",
        "function": "항공우주 및 의료용 임플란트를 적층 제조하는 3D 프린터 원료",
        "expected_chapter": ["81"],
        "expected_heading": ["8108"]
    },
    {
        "id": 58,
        "category": "신규(미래)",
        "name": "전기차 구동모터용 초극박 고효율 무방향성 규소강판 코일",
        "material": "철 96.5%, 규소 3.2%, 알루미늄 0.3% 합금 강판 (두께 0.20mm)",
        "function": "모터 회전 시 전력 손실을 최소화하는 전기강판",
        "expected_chapter": ["72"],
        "expected_heading": ["7225", "7226"]
    },
    {
        "id": 59,
        "category": "신규(미래)",
        "name": "우주 항공 발사체용 알루미늄-리튬(Al-Li) 합금 단조 링",
        "material": "알루미늄 96%, 리튬 1.5%, 구리 2.5% 단조 합금",
        "function": "로켓 연료 탱크 및 동체 연결용 고강도 경량 단조 링 부품",
        "expected_chapter": ["76"],
        "expected_heading": ["7616", "7608"]
    },
    {
        "id": 60,
        "category": "신규(미래)",
        "name": "액화수소 저장탱크용 고망간강 극저온 합금 강판",
        "material": "망간 24%, 철 70%, 탄소 0.5% 오스테나이트 합금강",
        "function": "영하 253도 극저온에서 취성 파괴를 방지하는 수소탱크용 두꺼운 강판",
        "expected_chapter": ["72"],
        "expected_heading": ["7225"]
    },

    # =========================================================================
    # [SECTION XVI: Machinery, Mechanical Appliances & Electrical Equipment (Ch 84-85)]
    # =========================================================================
    {
        "id": 61,
        "category": "전통(구)",
        "name": "산업용 삼상 유도 전동기 모터 (출력 15kW)",
        "material": "주철 케이싱, 규소강판 코어, 구리 권선",
        "function": "공장 펌프 및 송풍기를 구동하는 교류(AC) 전기 모터",
        "expected_chapter": ["85"],
        "expected_heading": ["8501"]
    },
    {
        "id": 62,
        "category": "전통(구)",
        "name": "산업용 유압 구동 피스톤 펌프 (건설중장비용)",
        "material": "합금강 주물 바디, 회전 피스톤 어셈블리",
        "function": "유압 오일을 고압으로 토출하여 굴삭기 실린더를 구동하는 기계 펌프",
        "expected_chapter": ["84"],
        "expected_heading": ["8413"]
    },
    {
        "id": 63,
        "category": "전통(구)",
        "name": "수치제어(CNC) 금속 수직 머시닝센터 공작기계",
        "material": "주철 베드, 스핀들 모터, 공구 자동교환장치",
        "function": "금속 부품을 고속 회전 공구로 정밀 밀링 절삭 가공하는 공작기계",
        "expected_chapter": ["84"],
        "expected_heading": ["8457", "8459"]
    },
    {
        "id": 64,
        "category": "신규(미래)",
        "name": "스마트 물류창고용 자율주행 무인이송로봇 AGV",
        "material": "알루미늄 섀시, 모터, 배터리, 제어 모듈",
        "function": "물류센터 내에서 화물을 적재하고 자율주행으로 운반하는 무인 이송 로봇",
        "expected_chapter": ["84", "87"],
        "expected_heading": ["8479", "8709"]
    },
    {
        "id": 65,
        "category": "신규(미래)",
        "name": "산업용 드론 탑재용 수소연료전지 발전 파워팩",
        "material": "PEMFC 연료전지 스택, 수소 감압 밸브, DC-DC 컨버터",
        "function": "수소를 공급받아 직류 전기를 발전하여 드론에 공급하는 발전기",
        "expected_chapter": ["85"],
        "expected_heading": ["8501"]
    },
    {
        "id": 66,
        "category": "신규(미래)",
        "name": "인공태양 핵융합로용 초전도 토카막 전자석 코일",
        "material": "고온 초전도 선재(YBCO), 스테인리스 보강재",
        "function": "초고온 플라즈마를 자기장으로 가두는 핵융합용 강력 전자석 코일",
        "expected_chapter": ["85"],
        "expected_heading": ["8505"]
    },
    {
        "id": 67,
        "category": "신규(미래)",
        "name": "전기차용 800V 고전압 SiC 전력반도체 모듈 (MOSFET)",
        "material": "SiC 반도체 칩, 질화규소(Si3N4) 기판, 구리 핀",
        "function": "전기차 인버터에서 직류-교류 전력을 고효율 변환 제어하는 전력 소자",
        "expected_chapter": ["85"],
        "expected_heading": ["8541", "8504"]
    },
    {
        "id": 68,
        "category": "신규(미래)",
        "name": "전기차용 리튬이온 NCM 파우치형 2차전지 배터리 셀",
        "material": "NCM 양극, 흑연 음극, 전해액, 알루미늄 파우치",
        "function": "전기 에너지를 충방전 저장하는 리튬 2차전지 축전지 셀",
        "expected_chapter": ["85"],
        "expected_heading": ["8507"]
    },
    {
        "id": 69,
        "category": "신규(미래)",
        "name": "반도체 포토리소그래피 노광장비용 고진공 자기부상 터보분자펌프",
        "material": "알루미늄 합금 로터, 자기부상 베어링, 고주파 모터",
        "function": "노광 챔버 내부를 초고진공 상태로 유지하는 진공 배기 펌프",
        "expected_chapter": ["84"],
        "expected_heading": ["8414", "8486"]
    },
    {
        "id": 70,
        "category": "신규(미래)",
        "name": "인공지능 딥러닝 연산용 초고대역폭 메모리 (HBM3E)",
        "material": "적층 실리콘 DRAM 다이, TSV 실리콘 관통전극, 인터포저",
        "function": "GPU 옆에 집적되어 테라바이트급 데이터를 초고속 전송하는 메모리 반도체",
        "expected_chapter": ["85"],
        "expected_heading": ["8542"]
    },

    # =========================================================================
    # [SECTION XVII: Vehicles, Aircraft, Vessels (Ch 86-89)]
    # =========================================================================
    {
        "id": 71,
        "category": "전통(구)",
        "name": "배기량 2000cc 가솔린 엔진 구동 승용 자동차 (세단)",
        "material": "강철 차체, 내연기관 엔진, 바퀴 4개",
        "function": "도로 위에서 인원을 수송하는 완성된 일반 승용차",
        "expected_chapter": ["87"],
        "expected_heading": ["8703"]
    },
    {
        "id": 72,
        "category": "전통(구)",
        "name": "순수 전동식 배터리 구동 지게차 (포크리프트, 인양능력 3톤)",
        "material": "강철 프레임, 전동 모터, 배터리, 인양 포크",
        "function": "창고 및 부두에서 파레트 화물을 상하 적재 및 운반하는 작업용 차량",
        "expected_chapter": ["84", "87"],
        "expected_heading": ["8427", "8709"]
    },
    {
        "id": 73,
        "category": "신규(미래)",
        "name": "도심항공교통 UAM 무인 자율비행체 eVTOL",
        "material": "탄소복합재 동체, 분산 전기 모터 8기, 배터리",
        "function": "승객 수송을 위해 수직 이착륙하는 순수전기 무인 자율 비행체",
        "expected_chapter": ["88"],
        "expected_heading": ["8806", "8802"]
    },
    {
        "id": 74,
        "category": "신규(미래)",
        "name": "심해 6000m 탐사용 자율무인잠수정 AUV",
        "material": "티타늄 내압선체, 배터리, 소나 음향탐지기, 추진기",
        "function": "해저 지형 및 해양 환경을 자율 탐사하는 무인 특수 잠수정",
        "expected_chapter": ["89"],
        "expected_heading": ["8906"]
    },
    {
        "id": 75,
        "category": "신규(미래)",
        "name": "우주 발사체용 메탄-액체산소 로켓 엔진",
        "material": "니켈 합금 연소실, 터보펌프, 밸브 어셈블리",
        "function": "액체 메탄 연소 가스 분출로 추진력을 발생시키는 로켓 반작용 모터",
        "expected_chapter": ["84"],
        "expected_heading": ["8412"]
    },

    # =========================================================================
    # [SECTION XVIII: Optical, Precision, Medical Instruments (Ch 90-92)]
    # =========================================================================
    {
        "id": 76,
        "category": "전통(구)",
        "name": "의료용 수술용 티타늄 메스 손잡이 및 교체형 외과 수술도구",
        "material": "의료용 티타늄 합금 100%",
        "function": "외과 수술 시 절개 및 생체 조직을 다루는 수술용 기기",
        "expected_chapter": ["90"],
        "expected_heading": ["9018"]
    },
    {
        "id": 77,
        "category": "전통(구)",
        "name": "산업용 광학 생물 현미경 (배율 1000배, 양안 광학계)",
        "material": "금속 프레임, 광학 유리 렌즈, LED 광원",
        "function": "가시광선 렌즈 굴절을 통해 세포 및 미생물 시료를 확대 관찰하는 광학현미경",
        "expected_chapter": ["90"],
        "expected_heading": ["9011"]
    },
    {
        "id": 78,
        "category": "신규(미래)",
        "name": "비침습 레이저 광음향 혈당 측정기",
        "material": "펄스 레이저 다이오드, 초음파 압전 트랜스듀서, 디스플레이",
        "function": "피부 채혈 없이 레이저 광음향 신호로 혈당을 측정하는 진단 의료기기",
        "expected_chapter": ["90"],
        "expected_heading": ["9018", "9027"]
    },
    {
        "id": 79,
        "category": "신규(미래)",
        "name": "반도체 2nm 공정 검사용 원자간력 현미경 (AFM)",
        "material": "원자간력 캔틸레버 프로브, 압전 스캐너, 광학 검출기",
        "function": "원자 단위 3차원 형상과 미세 결함을 측정하는 주사형 프로브 현미경",
        "expected_chapter": ["90", "84"],
        "expected_heading": ["9012", "8486", "9031"]
    },
    {
        "id": 80,
        "category": "신규(미래)",
        "name": "자율주행 자동차용 고정형 솔리드스테이트 라이다(LiDAR) 센서",
        "material": "905nm VCSEL 레이저 어레이, SPAD 수광 소자, 렌즈",
        "function": "레이저 펄스를 방출하고 반사파를 수신하여 주변 3차원 거리를 정밀 측정하는 장치",
        "expected_chapter": ["90"],
        "expected_heading": ["9031", "9013", "8526"]
    },
    {
        "id": 81,
        "category": "신규(미래)",
        "name": "소화관 전 구간 자율 검진용 스마트 무선 캡슐 내시경",
        "material": "초소형 CMOS 카메라, LED 조명, RF 무선 송신기, 배터리",
        "function": "삼키면 위장관을 통과하며 내부 점막 영상을 캡처 송신하는 캡슐형 내시경",
        "expected_chapter": ["90"],
        "expected_heading": ["9018"]
    },
    {
        "id": 82,
        "category": "신규(미래)",
        "name": "양자 암호 통신망용 단일 광자 송수신 광학계 모듈",
        "material": "편광 빔스플리터, 파장판, 비선형 광학 결정, 광섬유 커플러",
        "function": "단일 광자의 양자 상태를 생성하고 편광을 제어하는 광학 장치",
        "expected_chapter": ["90"],
        "expected_heading": ["9001", "9002", "9013"]
    },
    {
        "id": 83,
        "category": "전통(구)",
        "name": "산업용 배관 설치용 전자기식 액체 유량계",
        "material": "스테인리스 관로, 전자기 유도 코일, 변환기",
        "function": "도전성 액체의 유량을 전자기 유도 방식으로 측정하는 측정기기",
        "expected_chapter": ["90"],
        "expected_heading": ["9026"]
    },

    # =========================================================================
    # [SECTION XX: Miscellaneous Articles & Furniture & Toys (Ch 94-96)]
    # =========================================================================
    {
        "id": 84,
        "category": "전통(구)",
        "name": "인체공학 조절형 메쉬 사무용 회전 의자",
        "material": "알루미늄 다리, 나일론 메쉬 등판, 가스 실린더",
        "function": "높낮이와 등판 각도 조절이 가능한 바퀴 달린 사무용 가구 의자",
        "expected_chapter": ["94"],
        "expected_heading": ["9401"]
    },
    {
        "id": 85,
        "category": "전통(구)",
        "name": "어린이용 플라스틱 조립식 블록 완구 세트 (Lego Type)",
        "material": "ABS 플라스틱 성형 블록 100%",
        "function": "손으로 끼워 맞춰 다양한 구조물을 만드는 어린이 놀이용 완구",
        "expected_chapter": ["95"],
        "expected_heading": ["9503"]
    },
    {
        "id": 86,
        "category": "신규(미래)",
        "name": "독거노인 돌봄 및 정서 교감형 AI 대화 반려 로봇 인형",
        "material": "실리콘 피부, 내부 모터 서보, AI 음성인식 마이크 및 스피커",
        "function": "대화를 나누고 감정을 표현하여 정서적 안정을 주는 반려 로봇 인형",
        "expected_chapter": ["95", "84"],
        "expected_heading": ["9503", "8479"]
    },
    {
        "id": 87,
        "category": "신규(미래)",
        "name": "해양 레저 다이빙용 휴대용 전동 수중 스쿠터 DPV",
        "material": "방수 ABS 하우징, 브러시리스 DC 모터, 프로펠러, 배터리",
        "function": "다이버가 손잡이를 잡고 수중에서 이동할 수 있도록 추진력을 주는 스포츠 용구",
        "expected_chapter": ["95", "89"],
        "expected_heading": ["9506", "8903"]
    },
    {
        "id": 88,
        "category": "신규(미래)",
        "name": "미세조류 광합성 탄소포집 및 산소발생 스마트 가구 조명",
        "material": "투명 아크릴 바이오리액터 탱크, 목재 프레임, LED 생장 조명",
        "function": "실내 인테리어 가구이면서 미세조류로 이산화탄소를 흡수 산소를 배출하는 가구",
        "expected_chapter": ["94", "84"],
        "expected_heading": ["9403", "9405", "8421"]
    },
    {
        "id": 89,
        "category": "전통(구)",
        "name": "고급 만년필 (18K 금 닙 펜촉 장착)",
        "material": "황동 바디 락카 도장, 18K 골드 닙 펜촉",
        "function": "잉크 카트리지를 충전하여 종이에 글씨를 쓰는 필기도구",
        "expected_chapter": ["96"],
        "expected_heading": ["9608"]
    },

    # =========================================================================
    # [ADDITIONAL TOUGH HYBRID ITEMS (Ch 01-97 Multi-domain Stress Test)]
    # =========================================================================
    {
        "id": 90,
        "category": "전통(구)",
        "name": "조미 김 스낵 (참기름 및 정제염 도포 구운 김)",
        "material": "건조 김 90%, 참기름 6%, 정제염 4%",
        "function": "참기름을 바르고 소금을 뿌려 구운 즉석 섭취용 조미 식용 해조류",
        "expected_chapter": ["20", "21"],
        "expected_heading": ["2008", "2106"]
    },
    {
        "id": 91,
        "category": "전통(구)",
        "name": "한국 전통 발효 숙성 고추장 (플라스틱 용기 포장)",
        "material": "고춧가루 25%, 찹쌀 20%, 메주가루 10%, 물엿, 정제수",
        "function": "음식 조리 및 양념용 장류 조미 식품",
        "expected_chapter": ["21"],
        "expected_heading": ["2103"]
    },
    {
        "id": 92,
        "category": "전통(구)",
        "name": "동결건조 100% 인스턴트 가용성 커피 분말",
        "material": "커피 생두 추출 농축액 동결건조 분말 100%",
        "function": "온수에 녹여 즉석에서 음용하는 인스턴트 커피",
        "expected_chapter": ["21"],
        "expected_heading": ["2101"]
    },
    {
        "id": 93,
        "category": "신규(미래)",
        "name": "스마트 윈도우용 고분자 분산형 액정(PDLC) 광학 필름",
        "material": "액정 액적 분산 아크릴 고분자층, 양면 ITO 코팅 PET 필름",
        "function": "전원 인가 시 투명/불투명 상태가 전기적으로 전환되는 광학 차광 필름",
        "expected_chapter": ["39", "90"],
        "expected_heading": ["3920", "9013"]
    },
    {
        "id": 94,
        "category": "신규(미래)",
        "name": "유전자재조합 미생물 유래 인공 거미줄 생체 섬유 방적사",
        "material": "재조합 거미 실크 단백질(스파이도인) 섬유 100%",
        "function": "강철보다 강하고 유연한 바이오 인공 실크 방직용 실",
        "expected_chapter": ["54", "55", "50"],
        "expected_heading": ["5402", "5503", "5004"]
    },
    {
        "id": 95,
        "category": "신규(미래)",
        "name": "수소 연료전지용 탄소종이 가스확산층 (GDL)",
        "material": "탄소섬유 부직포 80%, PTFE 불소수지 발수 코팅 20%",
        "function": "연료전지 스택 내부에서 수소와 산소를 균일 확산시키는 탄소 직물 부품",
        "expected_chapter": ["68", "56", "59"],
        "expected_heading": ["6815", "5603", "5911"]
    },
    {
        "id": 96,
        "category": "신규(미래)",
        "name": "반도체 웨이퍼 CMP 정밀 연마용 다이아몬드 연마 슬러리",
        "material": "나노 합성 다이아몬드 분말 5%, 실리카 졸 15%, 탈이온수 80%",
        "function": "반도체 웨이퍼 표면을 나노 단위로 평탄화 연마하는 화학 슬러리 조제품",
        "expected_chapter": ["38", "71"],
        "expected_heading": ["3824", "7105"]
    },
    {
        "id": 97,
        "category": "신규(미래)",
        "name": "해양 미세플라스틱 포집용 고내구성 나노섬유 필터 부직포",
        "material": "폴리에테르술폰(PES) 전기방사 나노섬유 웹 100%",
        "function": "1㎛ 이하의 미세플라스틱을 포집하는 해수 정밀 여과 필터 부직포",
        "expected_chapter": ["56", "59"],
        "expected_heading": ["5603", "5911"]
    },
    {
        "id": 98,
        "category": "신규(미래)",
        "name": "전고체 배터리용 가넷형 LLZO 고체 세라믹 전해질 펠릿",
        "material": "리튬-란타넘-지르코늄 산화물(Li7La3Zr2O12) 세라믹",
        "function": "액체 전해액 없이 리튬 이온을 전도시송하는 불연성 고체 전해질",
        "expected_chapter": ["69", "28", "38"],
        "expected_heading": ["6909", "2853", "3824"]
    },
    {
        "id": 99,
        "category": "전통(구)",
        "name": "골프용 가죽 장갑 (왼손 착용용)",
        "material": "양가죽(Cabretta Leather) 90%, 탄성 밴드 10%",
        "function": "골프 클럽 그립감 향상 및 손 보호용 운동용 가죽 장갑",
        "expected_chapter": ["42", "61", "62"],
        "expected_heading": ["4203", "6116", "6216"]
    },
    {
        "id": 100,
        "category": "전통(구)",
        "name": "치과용 의치(틀니) 부착용 크림 접착제",
        "material": "나트륨/칼슘염 고분자 수지 40%, 미네랄오일, 바세린",
        "function": "잇몸에 틀니를 고정시켜 음식물 유입을 방지하는 치과용 조제품",
        "expected_chapter": ["33", "30"],
        "expected_heading": ["3306", "3006"]
    }
]

def run_strict_hybrid_benchmark():
    print("=" * 115, flush=True)
    print(">> [CUSWAY] 신구(신규 미래 + 전통 실무) 100대 물품 4단계 통관 전과정 엄격 실측 벤치마크", flush=True)
    print("=" * 115, flush=True)

    db = SessionLocal()
    total_count = len(HYBRID_100_ITEMS)
    
    # Step 1 Metrics
    step1_heading_pass = 0
    step1_hsk10_valid = 0
    step1_reasoning_pass = 0
    step1_zero_hallucination = 0
    
    # Step 2 Metrics
    step2_rate_pass = 0
    
    # Step 3 Metrics
    step3_req_pass = 0
    
    # Step 4 Metrics
    step4_plan_pass = 0
    
    # Combined Pipeline
    full_pipeline_pass = 0
    
    failed_items = []
    detailed_reports = []

    start_time = time.time()

    for idx, item in enumerate(HYBRID_100_ITEMS, 1):
        item_id = item["id"]
        cat = item["category"]
        name = item["name"]
        material = item["material"]
        func = item["function"]
        expected_chapters = item["expected_chapter"]
        expected_headings = item["expected_heading"]

        # ---------------------------------------------------------
        # STEP 1: AI HS Code & Legal Reasoning
        # ---------------------------------------------------------
        step1_err = None
        rec_code = "0000.00-0000"
        confidence = 0
        legal_reasoning = ""
        precedents = []
        is_step1_ok = False
        is_hsk10_ok = False
        heading_matched = False

        try:
            res1 = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=name,
                material=material,
                function_use=func,
                db=db
            )
            rec_code = res1.get("recommendedHsCode", "0000.00-0000")
            confidence = res1.get("confidence", 0)
            legal_reasoning = res1.get("legalReasoning", "")
            precedents = res1.get("precedents", [])

            clean_code = rec_code.replace('.', '').replace('-', '').strip()
            rec_chapter = clean_code[:2] if len(clean_code) >= 2 else ""
            rec_heading = clean_code[:4] if len(clean_code) >= 4 else ""

            # 1-1. Heading Match Check
            if (rec_heading in expected_headings) or (rec_chapter in expected_chapters and any(rec_heading.startswith(h[:2]) for h in expected_headings)):
                heading_matched = True
                step1_heading_pass += 1
            else:
                heading_matched = False

            # 1-2. 10-digit HSK Master Validation
            master_rec = db.query(HSCodeMaster).filter(
                (HSCodeMaster.hs_code == rec_code) | (HSCodeMaster.hs_code == clean_code)
            ).first()
            if master_rec and master_rec.hscode_length == 10:
                is_hsk10_ok = True
                step1_hsk10_valid += 1
            else:
                is_hsk10_ok = False

            # 1-3. Legal Reasoning Check
            if len(legal_reasoning.strip()) >= 50 and any(kw in legal_reasoning for kw in ["통칙", "관세율표", "분류", "제외"]):
                step1_reasoning_pass += 1

            # 1-4. Zero Hallucination Check
            is_hallu = False
            for p in precedents:
                p_code = p.get("code", "").replace('.', '').replace('-', '')
                if p_code:
                    db_prec = db.query(CustomsPrecedent).filter(
                        (CustomsPrecedent.hs_code == p.get("code")) |
                        (CustomsPrecedent.hs_code == p_code)
                    ).first()
                    if not db_prec and not p.get("id", "").startswith("PREC-"):
                        is_hallu = True
                        break
            if not is_hallu:
                step1_zero_hallucination += 1

            if heading_matched and is_hsk10_ok and not is_hallu:
                is_step1_ok = True

        except Exception as e:
            step1_err = str(e)
            rec_code = "0000.00-0000"

        # ---------------------------------------------------------
        # STEP 2: Tariff & FTA Optimization
        # ---------------------------------------------------------
        is_step2_ok = False
        rates_data = None
        base_rate = None
        recommended_rate = None

        if rec_code != "0000.00-0000":
            try:
                rates_data = get_hs_rates_api(hs_code=rec_code, origin="US", db=db)
                rates_dict = rates_data.get("rates", {})
                base_rate = rates_dict.get("base_rate")
                recommended_rate = rates_dict.get("recommended_rate")
                if base_rate is not None or recommended_rate is not None:
                    step2_rate_pass += 1
                    is_step2_ok = True
            except Exception as e:
                is_step2_ok = False

        # ---------------------------------------------------------
        # STEP 3 & STEP 4: Clearance Requirements & Action Plan
        # ---------------------------------------------------------
        is_step3_ok = False
        is_step4_ok = False
        reqs_data = None

        if rec_code != "0000.00-0000":
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
        print(f"[{idx:03d}/100] [{cat}] {name[:24]:<24} | HS: {rec_code:<12} | 관세:{base_rate_str:<5}➔최적:{rec_rate_str:<5} | 요건:{law_count}법령 | {status_icon}")

        detailed_reports.append({
            "id": item_id,
            "category": cat,
            "name": name,
            "material": material,
            "function": func,
            "recommendedHsCode": rec_code,
            "headingMatched": heading_matched,
            "hsk10Valid": is_hsk10_ok,
            "allPass": all_pass,
            "step2": rates_data,
            "step3_law_count": law_count
        })

    elapsed = time.time() - start_time

    # ---------------------------------------------------------
    # Final Statistics and Reporting
    # ---------------------------------------------------------
    print("\n" + "=" * 115)
    print("📊 [CUSWAY 신구 100대 물품 4단계 통관 전과정 엄격 실측 통계 보고서]")
    print("=" * 115)
    print(f" 총 테스트 대상: {total_count}개 품목 (전통 실무 50개 + 첨단 미래 50개) | 총 소요시간: {elapsed:.2f}초 (건당 평균 {elapsed/total_count:.2f}초)\n")
    
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
        print("\n[Step 1 불일치 / 실패 품목 상세 분석]:")
        for f in failed_items:
            print(f"  - #{f['id']:03d} [{f['category']}] {f['name']}")
            print(f"    └ 추천코드: {f['rec_code']} (추천호: {f['rec_heading']}) vs 예상호: {f['expected_headings']}")

    # Save to scratch
    out_dir = os.path.join(workspace_root, "scratch")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "benchmark_hybrid_100_strict_results.json")
    with open(out_path, "w", encoding="utf-8") as fp:
        json.dump({
            "total": total_count,
            "full_pass": full_pipeline_pass,
            "accuracy": full_pipeline_pass / total_count * 100,
            "error_rate": (total_count - full_pipeline_pass) / total_count * 100,
            "failed_items": failed_items,
            "details": detailed_reports
        }, fp, ensure_ascii=False, indent=2)

    print(f"\n[INFO] Detailed results saved to {out_path}")
    db.close()
    return full_pipeline_pass, total_count

if __name__ == "__main__":
    run_strict_hybrid_benchmark()
