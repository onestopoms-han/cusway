# -*- coding: utf-8 -*-
"""
50 Arbitrary Multi-Keyword Challenging Test Suite
Evaluates the RAG pipeline on 50 real-world unspaced/compound queries across Food, Sensors, Machinery, Electronics, Chemicals, and Materials.
"""
import sys
import os
import io

# UTF-8 output setup for Windows console
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

sys.path.insert(0, os.path.abspath('.'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.models import Base
from backend.rag.classification_processor import AICustomsClassificationProcessor

MULTI_KEYWORD_50_CASES = [
    # --- Category 1: Food, Agri, Oils, Health & Bio (15 items) ---
    {
        "id": 1,
        "name": "식용올리브오일식물성연질캡슐",
        "material": "엑스트라버진 올리브유 99%, 식물성 젤라틴 캡슐 1%",
        "function_use": "1회 섭취용으로 캡슐화된 식용 건강식품",
        "exp_head": "2106",
        "exp_hsk": "2106.90-9099"
    },
    {
        "id": 2,
        "name": "오메가3피쉬오일연질캡슐",
        "material": "정제어유(EPA/DHA 함유) 1000mg, 연질캡슐",
        "function_use": "혈행 개선용 건강기능식품 캡슐",
        "exp_head": "2106",
        "exp_hsk": "2106.90-9099"
    },
    {
        "id": 3,
        "name": "냉동치아바타생지반죽",
        "material": "소맥분, 효모, 올리브유, 정제소금, 물",
        "function_use": "베이커리 매장에서 해동 후 즉시 굽는 미소성 냉동 빵 반죽 도우",
        "exp_head": "1901",
        "exp_hsk": "1901.20-9000"
    },
    {
        "id": 4,
        "name": "구운올리브치아바타빵",
        "material": "밀가루, 블랙올리브, 올리브오일, 효모",
        "function_use": "완전 가열 베이킹된 이탈리아식 식사용 빵",
        "exp_head": "1905",
        "exp_hsk": "1905.90-1010"
    },
    {
        "id": 5,
        "name": "유기농바닐라라떼음료베이스파우더",
        "material": "인스턴트 커피 추출물 20%, 유기농 탈지분유 40%, 바닐라향 파우더",
        "function_use": "온수나 우유에 타서 마시는 조제 커피음료 베이스",
        "exp_head": "2101",
        "exp_hsk": "2101.12-1000"
    },
    {
        "id": 6,
        "name": "볶은유기농참깨가루",
        "material": "유기농 참깨 100% (볶음 열처리 후 분쇄)",
        "function_use": "음식 조리용 및 양념용 볶은 참깨 분말",
        "exp_head": "2008",
        "exp_hsk": "2008.19-3000"
    },
    {
        "id": 7,
        "name": "비가열저온압착생들기름",
        "material": "국내산 들깨 100% (비가열 저온 착유)",
        "function_use": "식용 샐러드 드레싱 및 조리용 액상 유지",
        "exp_head": "1515",
        "exp_hsk": "1515.90-9000"
    },
    {
        "id": 8,
        "name": "엑스트라버진올리브유",
        "material": "스페인산 올리브 열매 100% (물리적 냉압착)",
        "function_use": "최고급 버진 식용 올리브 기름 (산도 0.8% 이하)",
        "exp_head": "1509",
        "exp_hsk": "1509.20-0000"
    },
    {
        "id": 9,
        "name": "급속냉동스위트크랜베리과육",
        "material": "신선 크랜베리 100% (단순 IQF 급속 냉동)",
        "function_use": "제과제빵 및 음료 가공용 냉동 과실",
        "exp_head": "0811",
        "exp_hsk": "0811.90-9000"
    },
    {
        "id": 10,
        "name": "천연가당건조크랜베리",
        "material": "건조 크랜베리 65%, 설탕 34%, 해바라기유 1%",
        "function_use": "설탕을 첨가하여 조제 건조한 과실 스낵",
        "exp_head": "2008",
        "exp_hsk": "2008.93-0000"
    },
    {
        "id": 11,
        "name": "천연동결건조로열젤리분말",
        "material": "생 로열젤리 100% (동결건조)",
        "function_use": "식용 천연 곤충 생산품",
        "exp_head": "0410",
        "exp_hsk": "0410.90-0000"
    },
    {
        "id": 12,
        "name": "농축유청단백질WPC분말",
        "material": "우유 유청 단백질 80% 농축",
        "function_use": "스포츠 헬스 보충제 제조용 유청 가공품",
        "exp_head": "0404",
        "exp_hsk": "0404.10-1000"
    },
    {
        "id": 13,
        "name": "식품제조용천연바닐라엑기스",
        "material": "바닐라빈 추출물, 알코올(주정), 천연 착향료 혼합물",
        "function_use": "음료 및 제과제빵 식품 착향용 원료",
        "exp_head": "3302",
        "exp_hsk": "3302.10-9000"
    },
    {
        "id": 14,
        "name": "100%착즙냉동레몬주스",
        "material": "레몬 과즙 100% (발효되지 않고 알코올 무첨가, 냉동)",
        "function_use": "음료 제조용 냉동 감귤류 주스",
        "exp_head": "2009",
        "exp_hsk": "2009.39-0000"
    },
    {
        "id": 15,
        "name": "냉동수리미연육어묵맛살",
        "material": "명태 연육 80%, 전분 10%, 게향, 난백",
        "function_use": "조제 어육 맛살 및 어묵",
        "exp_head": "1604",
        "exp_hsk": "1604.20-2000"
    },

    # --- Category 2: Sensors & Precision Instruments (15 items) ---
    {
        "id": 16,
        "name": "자율주행차솔리드스테이트라이다센서",
        "material": "905nm 레이저 다이오드, SPAD 어레이 수광소자, 알루미늄 하우징",
        "function_use": "자율주행차 전방 3D 포인트클라우드 거리 측정 및 장애물 검사",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9090"
    },
    {
        "id": 17,
        "name": "차량용77GHz전방밀리미터파레이더센서",
        "material": "77GHz 송수신 RFIC, 마이크로스트립 패치 안테나, DSP",
        "function_use": "차량 어댑티브 크루즈 컨트롤(ACC) 및 긴급제동(AEB)용 레이더",
        "exp_head": "8526",
        "exp_hsk": "8526.10-1000"
    },
    {
        "id": 18,
        "name": "전기차배터리팩홀전류센서",
        "material": "홀소자 IC, 고투자율 페라이트 코어, 신호증폭회로",
        "function_use": "전기차 고전압 배터리팩 충방전 전류(A) 정밀 측정",
        "exp_head": "9030",
        "exp_hsk": "9030.33-0000"
    },
    {
        "id": 19,
        "name": "스마트팩토리레이저변위센서",
        "material": "반도체 레이저 발광부, CMOS 리니어 이미지센서, 광학 렌즈",
        "function_use": "생산 라인 이송 물품의 나노/마이크로 단위 위치 변위 정밀 측정",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9090"
    },
    {
        "id": 20,
        "name": "공작기계광학식로터리엔코더",
        "material": "유리제 정밀 슬릿 디스크, 적외선 LED, 포토 트랜지스터 수광부",
        "function_use": "CNC 공작기계 주축 모터의 회전각도 및 회전속도 측정",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9090"
    },
    {
        "id": 21,
        "name": "산업용배관공기질량유량센서",
        "material": "백금 RTD 열선 박막 소자, SUS316 스테인리스 하우징",
        "function_use": "산업용 공압 배관 내 흐르는 기체의 질량 유량(Mass Flow) 측정",
        "exp_head": "9026",
        "exp_hsk": "9026.10-1000"
    },
    {
        "id": 22,
        "name": "유압프레스초고압압력센서",
        "material": "피에조 저항 스트레인게이지, 메탈 다이어프램",
        "function_use": "산업용 유압 설비의 유압 오일 압력(bar) 측정 및 검사",
        "exp_head": "9026",
        "exp_hsk": "9026.20-4000"
    },
    {
        "id": 23,
        "name": "반도체웨이퍼표면결함광학검사기",
        "material": "고해상도 TDI 라인스캔 카메라, UV 광원, 웨이퍼 이송 스테이지",
        "function_use": "300mm 실리콘 웨이퍼 미세 패턴 스크래치 및 결함 검사",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9091"
    },
    {
        "id": 24,
        "name": "이차전지양극재슬러리점도센서",
        "material": "진동식 토션 로드 공진자, SUS316 센서 프로브",
        "function_use": "배터리 믹싱 공정 중 슬러리의 동점도(Viscosity) 물리적 측정",
        "exp_head": "9027",
        "exp_hsk": "9027.89-9000"
    },
    {
        "id": 25,
        "name": "대기환경초미세먼지PM2.5측정센서",
        "material": "광산란식 레이저 다이오드, 집광 렌즈, 흡입 팬",
        "function_use": "대기 중 미세먼지 입자 산란광 분석을 통한 농도 측정",
        "exp_head": "9027",
        "exp_hsk": "9027.89-9000"
    },
    {
        "id": 26,
        "name": "배관용초음파비파괴검사센서",
        "material": "PZT 압전 세라믹 진동자, 댐핑 블록, 초음파 딜레이 라인",
        "function_use": "플랜트 강관 용접부 내부 크랙 및 두께 비파괴 탐상 검사",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9070"
    },
    {
        "id": 27,
        "name": "수처리장잔류염소수질pH센서",
        "material": "유리 전극, 은/염화은(Ag/AgCl) 기준전극, 세라믹 정션",
        "function_use": "정수장 및 하수처리장 수용액의 수소이온농도(pH) 전기화학적 측정",
        "exp_head": "9027",
        "exp_hsk": "9027.89-9000"
    },
    {
        "id": 28,
        "name": "드론용6축IMU가속도자이로센서",
        "material": "MEMS 실리콘 구조체, ASIC 신호처리 회로",
        "function_use": "비행체 3축 가속도 및 3축 각속도(자이로) 자세 측정",
        "exp_head": "9031",
        "exp_hsk": "9031.80-9090"
    },
    {
        "id": 29,
        "name": "스마트팜온실토양온습도센서",
        "material": "정전용량식 수분 감지 전극, NTC 서미스터 온도 감지기",
        "function_use": "비닐하우스 토양 내부 온도 및 함수율 동시 측정",
        "exp_head": "9025",
        "exp_hsk": "9025.80-0000"
    },
    {
        "id": 30,
        "name": "패치형연속혈당측정CGM센서",
        "material": "포도당 산화효소(GOx) 코팅 미세 필라멘트 전극, 무선 트랜스미터",
        "function_use": "피하 간질액 내 포도당 농도 연속 측정 및 모니터링",
        "exp_head": "9018",
        "exp_hsk": "9018.90-9090"
    },

    # --- Category 3: Machinery, Electronics & Electrical (10 items) ---
    {
        "id": 31,
        "name": "초고압유입식전력용변압기",
        "material": "방향성 규소강판 코어, 절연유, 무산소동 권선",
        "function_use": "발전소 및 변전소 전력 계통 154kV 전압 승압/강압 변성기",
        "exp_head": "8504",
        "exp_hsk": "8504.23-1000"
    },
    {
        "id": 32,
        "name": "산업용로봇관절교류AC서보모터",
        "material": "영구자석 회전자, 동선 권선 고정자, 알루미늄 프레임 (출력 750W)",
        "function_use": "다관절 로봇 및 자동화 설비 관절 구동용 교류 전동기",
        "exp_head": "8501",
        "exp_hsk": "8501.52-9000"
    },
    {
        "id": 33,
        "name": "전기차충전기용고전압IGBT전력반도체모듈",
        "material": "SiC/Si IGBT 칩, 절연 세라믹 기판, 구리 베이스플레이트",
        "function_use": "급속충전기 및 인버터 전력 스위칭용 개별 반도체 트랜지스터 디바이스",
        "exp_head": "8541",
        "exp_hsk": "8541.29-0000"
    },
    {
        "id": 34,
        "name": "서버용DDR5SDRAM메모리모듈",
        "material": "DRAM IC 칩, 다층 PCB 인쇄회로기판, PMIC",
        "function_use": "컴퓨터 서버 데이터 임시 기억 저장용 메모리 모듈",
        "exp_head": "8473",
        "exp_hsk": "8473.30-1000"
    },
    {
        "id": 35,
        "name": "공작기계용초경엔드밀절삭공구",
        "material": "텅스텐 카바이드 초경합금(WC-Co), TiAlN 코팅",
        "function_use": "머시닝센터 금속 절삭 가공용 밀링 엔드밀 바이트 공구",
        "exp_head": "8207",
        "exp_hsk": "8207.70-0000"
    },
    {
        "id": 36,
        "name": "반도체제조용고진공터보분자펌프",
        "material": "알루미늄 합금 다단 로터 블레이드, 자기부상 베어링, 모터",
        "function_use": "반도체 진공 챔버를 10^-7 Pa 초고진공 상태로 배기하는 진공펌프",
        "exp_head": "8414",
        "exp_hsk": "8414.10-9000"
    },
    {
        "id": 37,
        "name": "원심식냉각수순환펌프",
        "material": "주철 케이싱, 스테인리스 임펠러, 전동기 직결",
        "function_use": "공장 냉각탑 냉각수 강제 순환용 원심 액체 펌프",
        "exp_head": "8413",
        "exp_hsk": "8413.70-9000"
    },
    {
        "id": 38,
        "name": "산업용PLC프로그래머블컨트롤러",
        "material": "CPU 프로세서, 디지털 입출력 모듈, 전원 공급기, 베이스 랙",
        "function_use": "공장 자동화 라인 시퀀스 논리 제어 및 전압 제어반",
        "exp_head": "8537",
        "exp_hsk": "8537.10-0000"
    },
    {
        "id": 39,
        "name": "스마트폰용OLED디스플레이패널모듈",
        "material": "플렉시블 유기발광다이오드 패널, 구동 DDI 칩, FPCB, 편광판",
        "function_use": "스마트폰 화면 표시용 평판 디스플레이 모듈",
        "exp_head": "8524",
        "exp_hsk": "8524.91-0000"
    },
    {
        "id": 40,
        "name": "이차전지용리튬이온배터리셀",
        "material": "양극(NCM), 음극(흑연), 전해액, 분리막, 알루미늄 파우치 케이스",
        "function_use": "전기차 및 ESS 전력 저장용 2차 충전식 리튬이온 축전지",
        "exp_head": "8507",
        "exp_hsk": "8507.60-0000"
    },

    # --- Category 4: Chemicals, Materials, Metals & Articles (10 items) ---
    {
        "id": 41,
        "name": "반도체식각용초고순도불화수소가스",
        "material": "불화수소(HF) 순도 99.999% 이상",
        "function_use": "반도체 실리콘 산화막 건식/습식 에칭 식각용 무기산 가스",
        "exp_head": "2811",
        "exp_hsk": "2811.11-0000"
    },
    {
        "id": 42,
        "name": "3D프린팅용티타늄합금구형분말",
        "material": "Ti-6Al-4V 티타늄 합금 구형 분말 (입도 15~45㎛)",
        "function_use": "금속 3D 프린터 적층 제조용 티타늄 분말 소재",
        "exp_head": "8108",
        "exp_hsk": "8108.20-1000"
    },
    {
        "id": 43,
        "name": "자동차배터리용압연동박포일",
        "material": "순동(Cu 99.9%), 두께 6㎛ 압연박",
        "function_use": "이차전지 음극 집전체용 동박(구리 포일)",
        "exp_head": "7410",
        "exp_hsk": "7410.11-0000"
    },
    {
        "id": 44,
        "name": "사파이어단결정반도체잉곳웨이퍼",
        "material": "합성 고순도 알루미나(Al2O3) 단결정 사파이어",
        "function_use": "Micro-LED 및 GaN 에피택셜 성장용 기판 웨이퍼 소재",
        "exp_head": "7104",
        "exp_hsk": "7104.20-0000"
    },
    {
        "id": 45,
        "name": "열가소성폴리우레탄TPU수지펠릿",
        "material": "디이소시아네이트와 폴리올 중합 열가소성 엘라스토머 펠릿",
        "function_use": "신발 밑창 및 케이스 사출 성형용 1차 플라스틱 원료",
        "exp_head": "3909",
        "exp_hsk": "3909.50-0000"
    },
    {
        "id": 46,
        "name": "자동차타이어용합성고무SBR라텍스",
        "material": "스티렌-부타디엔 공중합 고무 에멀전(SBR Latex)",
        "function_use": "타이어 트레드 고무 컴파운딩용 합성 고무 1차 원료",
        "exp_head": "4002",
        "exp_hsk": "4002.11-0000"
    },
    {
        "id": 47,
        "name": "탄소섬유강화플라스틱CFRP복합재패널",
        "material": "탄소섬유 직물 60%, 에폭시 수지 40% 복합 성형판",
        "function_use": "항공기 동체 및 스포츠카 경량 외판 구조재",
        "exp_head": "6815",
        "exp_hsk": "6815.19-0000"
    },
    {
        "id": 48,
        "name": "스테인리스스틸육각볼트너트세트",
        "material": "SUS304 스테인리스강",
        "function_use": "기계 프레임 체결 및 결합용 나사선 볼트 및 암나사 너트",
        "exp_head": "7318",
        "exp_hsk": "7318.15-0000"
    },
    {
        "id": 49,
        "name": "남성용방수투습고어텍스등산자켓",
        "material": "나일론 겉감, PTFE 멤브레인 라미네이팅 직물",
        "function_use": "등산 및 아웃도어용 남성 방수 외투 자켓",
        "exp_head": "6201",
        "exp_hsk": "6201.40-0000"
    },
    {
        "id": 50,
        "name": "태양광발전용단결정실리콘태양전지모듈",
        "material": "단결정 실리콘 태양전지 셀, EVA 시트, 저철분 강화유리, 알루미늄 프레임",
        "function_use": "태양광 빛에너지를 전기에너지로 변환하는 광전 태양광 발전 패널",
        "exp_head": "8541",
        "exp_hsk": "8541.43-0000"
    }
]

def run_benchmark():
    from backend.db import SessionLocal
    db = SessionLocal()

    print("=" * 100)
    print("      CUSWAY AI 다중 키워드 복합 품명 50선 정밀 실증 벤치마크 테스트")
    print("=" * 100)
    print(f"총 검증 대상: {len(MULTI_KEYWORD_50_CASES)}개 고난이도 복합 품명")
    print("-" * 100)

    passed_count = 0
    failed_count = 0
    failures = []

    for item in MULTI_KEYWORD_50_CASES:
        i = item["id"]
        pname = item["name"]
        mat = item["material"]
        fuse = item["function_use"]
        exp_head = item["exp_head"]
        exp_hsk = item["exp_hsk"]

        try:
            res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=pname,
                material=mat,
                function_use=fuse,
                db=db
            )
            rec_code = res.get("recommendedHsCode", "0000.00-0000")
            clean_rec = rec_code.replace(".", "").replace("-", "").strip()
            clean_exp_head = exp_head.replace(".", "").replace("-", "").strip()
            
            # Check 4-digit heading match
            head_match = clean_rec.startswith(clean_exp_head)
            # Check 10-digit exact match or 6-digit subheading match
            clean_exp_hsk = exp_hsk.replace(".", "").replace("-", "").strip()
            subhead_match = clean_rec[:6] == clean_exp_hsk[:6] if len(clean_rec) >= 6 and len(clean_exp_hsk) >= 6 else False
            hsk_exact = (clean_rec == clean_exp_hsk)

            is_pass = head_match

            status_str = "[PASS]" if is_pass else "[FAIL]"
            if is_pass:
                passed_count += 1
            else:
                failed_count += 1
                failures.append({
                    "id": i,
                    "name": pname,
                    "expected_head": exp_head,
                    "expected_hsk": exp_hsk,
                    "actual_hsk": rec_code,
                    "heading_name": res.get("headingName", ""),
                    "reasoning": res.get("legalReasoning", "")[:120]
                })

            match_detail = "10단위 일치" if hsk_exact else ("6단위 세호 일치" if subhead_match else "4단위 호 일치")
            if not is_pass:
                match_detail = "불일치 (오류)"

            print(f"[{i:02d}/50] {status_str} {pname:<26} -> HSK: {rec_code:<14} (Exp: {exp_hsk}) | {match_detail}")

        except Exception as e:
            failed_count += 1
            failures.append({
                "id": i,
                "name": pname,
                "expected_head": exp_head,
                "expected_hsk": exp_hsk,
                "actual_hsk": "ERROR",
                "error": str(e)
            })
            print(f"[{i:02d}/50] [ERROR] {pname:<26} -> Exception: {e}")

    db.close()

    print("=" * 100)
    print("                           최종 벤치마크 검증 성적표")
    print("=" * 100)
    print(f"■ 총 테스트 항목 : {len(MULTI_KEYWORD_50_CASES)} 건")
    print(f"■ 통과 (PASS)    : {passed_count} 건 ({(passed_count/len(MULTI_KEYWORD_50_CASES))*100:.1f}%)")
    print(f"■ 실패 (FAIL)    : {failed_count} 건 ({(failed_count/len(MULTI_KEYWORD_50_CASES))*100:.1f}%)")
    print(f"■ 최종 에러율    : {(failed_count/len(MULTI_KEYWORD_50_CASES))*100:.1f}%")
    print("=" * 100)

    if failures:
        print("\n[발생한 실패/오류 상세 내역]")
        for f in failures:
            print(f"  - [{f['id']:02d}] {f['name']}: 예상={f['expected_hsk']} (호 {f['expected_head']}) vs 실제={f.get('actual_hsk')} | 오류사유={f.get('error') or f.get('heading_name')}")
    else:
        print("\n>>> 50개 전 항목 호(Heading) 기준 100% 정합성 검증 완료 (0.0% 에러) <<<")

if __name__ == "__main__":
    run_benchmark()
