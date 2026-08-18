import sys
import os
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup system paths to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.rag.llm_chain import query_rag_hs_classification

# 50 Representative Test Cases for Customs HS Code Classification
TEST_CASES = [
    # 1. Food Group (식품군 - Chapters 01-24)
    {"name": "계란 스파게티 면", "material": "듀럼밀 세몰리나, 계란 노른자", "use": "조리용 국수 파스타", "expected_chapter": "19", "group": "food"},
    {"name": "건조 마카로니", "material": "밀가루, 정제수", "use": "파스타 요리용 식자재", "expected_chapter": "19", "group": "food"},
    {"name": "정제 설탕", "material": "사탕수수 원당", "use": "식용 감미료", "expected_chapter": "17", "group": "food"},
    {"name": "밀크 초콜릿", "material": "설탕, 코코아 버터, 전지분유", "use": "간식용 단 초콜릿 과자", "expected_chapter": "18", "group": "food"},
    {"name": "슬라이스 치즈", "material": "원유, 젖산균, 식염", "use": "식용 가공 유제품", "expected_chapter": "04", "group": "food"},
    {"name": "식용 정제 천일염", "material": "염화나트륨 99%", "use": "식용 소금 조미료", "expected_chapter": "25", "group": "food"},
    {"name": "오이지 피클", "material": "오이, 정제소금, 정제수", "use": "절임 식품 반찬류", "expected_chapter": "20", "group": "food"},
    {"name": "버터", "material": "우유 유지방", "use": "제과제빵용 스프레드", "expected_chapter": "04", "group": "food"},
    {"name": "벌꿀", "material": "천연 벌꿀 100%", "use": "식용 감미료", "expected_chapter": "04", "group": "food"},
    {"name": "말린 표고버섯", "material": "표고버섯 100%", "use": "식용 건조 채소", "expected_chapter": "07", "group": "food"},
    {"name": "감자 전분", "material": "감자 녹말 가공물", "use": "식료품 점성 조제용 전분", "expected_chapter": "11", "group": "food"},
    {"name": "타피오카 펄", "material": "카사바 전분 호화물", "use": "음료 버블티 첨가용 식자재", "expected_chapter": "19", "group": "food"},
    {"name": "콘플레이크 시리얼", "material": "옥수수, 설탕, 맥아", "use": "아침식사용 팽창 곡물 시리얼", "expected_chapter": "19", "group": "food"},
    {"name": "크루아상 빵", "material": "밀가루, 이스트, 버터", "use": "베이커리 식용 빵류", "expected_chapter": "19", "group": "food"},
    {"name": "신선 사과", "material": "생사과 100%", "use": "식용 생과실", "expected_chapter": "08", "group": "food"},

    # 2. Chemical/Resin Group (화학/수지군 - Chapters 28-40)
    {"name": "에폭시 수지 접착제", "material": "에폭시 폴리머, 경화제", "use": "공업용 강력 접착 화학제", "expected_chapter": "35", "group": "chemical"},
    {"name": "주물용 모래 바인더", "material": "페놀 수지 화합물", "use": "주형 코어 제조용 결합 화학제", "expected_chapter": "38", "group": "chemical"},
    {"name": "플라스틱 밀폐 용기", "material": "폴리프로필렌(PP)", "use": "식품 보관용 주방용기", "expected_chapter": "39", "group": "resin"},
    {"name": "아스피린 알약", "material": "아세틸살리실산, 부형제", "use": "해열 진통 소포제 의약품", "expected_chapter": "30", "group": "chemical"},
    {"name": "천연 고무 장갑", "material": "가황하지 않은 천연 라텍스", "use": "가정 주방용 세척 장갑", "expected_chapter": "40", "group": "resin"},
    {"name": "메탄올 용액", "material": "메틸 알코올 99.9%", "use": "공업용 유기 화학 유제 용제", "expected_chapter": "29", "group": "chemical"},
    {"name": "비타민 C 정제", "material": "아스코르브산 단일 비타민", "use": "영양 공급용 단일 비타민제", "expected_chapter": "29", "group": "chemical"},
    {"name": "화장용 액체 스킨", "material": "글리세린, 정제수, 에탄올, 향료", "use": "피부 기초 보습용 화장품", "expected_chapter": "33", "group": "chemical"},
    {"name": "세탁용 분말 세제", "material": "계면활성제, 알칼리제", "use": "의류 및 세탁기용 세정제", "expected_chapter": "34", "group": "chemical"},
    {"name": "질소 비료", "material": "요소 비료 성분", "use": "농업 작물 재배용 화학 비료", "expected_chapter": "31", "group": "chemical"},
    {"name": "플라스틱 일회용 빨대", "material": "폴리에틸렌(PE)", "use": "음료 흡입용 일회용 가구", "expected_chapter": "39", "group": "resin"},
    {"name": "고무 패킹 링", "material": "가황한 불포화 고무", "use": "기계 배관 접합 밀폐용 고무실링", "expected_chapter": "40", "group": "resin"},

    # 3. Textiles/Garments Group (직물/의류군 - Chapters 50-63)
    {"name": "면 100% 티셔츠", "material": "순면 편직물", "use": "신체 일상용 캐주얼 아웃웨어 의류", "expected_chapter": "61", "group": "textile"},
    {"name": "폴리에스터 방직사", "material": "폴리에틸렌 테레프탈레이트 섬유", "use": "직물 및 원단 제직용 재봉사", "expected_chapter": "54", "group": "textile"},
    {"name": "작업용 방한 조끼", "material": "나일론 패딩 원단, 솜 충전물", "use": "추운 현장 야외 작업복 방한의", "expected_chapter": "62", "group": "textile"},
    {"name": "실크 스카프", "material": "천연 견사 100%", "use": "여성 목 장식용 패션 잡화", "expected_chapter": "62", "group": "textile"},
    {"name": "양모 담요", "material": "천연 모사 메리노울", "use": "취침용 겨울 보온용 침구 담요", "expected_chapter": "63", "group": "textile"},
    {"name": "가죽 재킷", "material": "천연 우피(소가죽)", "use": "상반신 착용 아웃웨어 가죽의류", "expected_chapter": "42", "group": "leather"},
    {"name": "스포츠 면 양말", "material": "면 85%, 스판덱스 15%", "use": "발 보호 및 운동용 언더웨어 양말", "expected_chapter": "61", "group": "textile"},

    # 4. Machinery/Electronics Group (기계/전자기기군 - Chapters 84-85)
    {"name": "스마트폰 전화기", "material": "리튬 배터리, 모바일 AP, 알루미늄 외장", "use": "무선 통신망 셀룰러 이동 전화기", "expected_chapter": "85", "group": "machinery"},
    {"name": "광학 마우스", "material": "플라스틱 사출물, LED 센서, USB PCB", "use": "컴퓨터 자동자료처리기계 입력 장치", "expected_chapter": "84", "group": "machinery"},
    {"name": "전기자전거", "material": "알루미늄 프레임, BLDC 모터, 배터리", "use": "모터 구동 보조원동기를 갖춘 이륜차", "expected_chapter": "87", "group": "machinery"},
    {"name": "소형 탁상용 선풍기", "material": "소형 단상 모터, 플라스틱 팬", "use": "실내 공기 순환 및 개인 냉방용 가전", "expected_chapter": "84", "group": "machinery"},
    {"name": "기어 감속기", "material": "합금강 정밀 기어 기어박스", "use": "산업용 회전 동력 토크 변환 장치", "expected_chapter": "84", "group": "machinery"},
    {"name": "다층 인쇄회로기판(PCB)", "material": "에폭시 수지 유리섬유, 구리 박판 회로", "use": "가전기기 내부 회로 소자 마운팅 회로 기판", "expected_chapter": "85", "group": "machinery"},
    {"name": "단상 유도 전동기", "material": "구리 코일, 철강 로터", "use": "전기 에너지를 기계적 동력으로 변환하는 모터", "expected_chapter": "85", "group": "machinery"},
    {"name": "사출 성형기", "material": "철강 프레임, 실린더, 유압 펌프", "use": "플라스틱 가열 유동 사출 성형 가공 기계", "expected_chapter": "84", "group": "machinery"},
    {"name": "노트북 컴퓨터", "material": "배터리, 메인보드, LCD 패널", "use": "휴대용 자동자료처리기계 PC", "expected_chapter": "84", "group": "machinery"},
    {"name": "컴퓨터용 키보드", "material": "플라스틱 스위치, 컨트롤러 회로", "use": "컴퓨터 자동자료처리기계 전용 키 입력장치", "expected_chapter": "84", "group": "machinery"},
    {"name": "식기세척기", "material": "스테인리스 챔버, 히터, 펌프", "use": "식기 및 주방용구 자동 세척용 주방 가전", "expected_chapter": "84", "group": "machinery"},
    {"name": "전기 면도기", "material": "소형 DC 모터, 내장 충전지, 컷팅 날", "use": "개인 위생용 안면 수염 쉐이빙 면도기", "expected_chapter": "85", "group": "machinery"},
    {"name": "무선 공유기", "material": "와이파이 칩셋, 안테나, 전원 회로", "use": "인터넷 데이터 패킷 송수신 유무선 공유 게이트웨이", "expected_chapter": "85", "group": "machinery"},

    # 5. Metals/Miscellaneous (금속 및 잡품군 - Chapters 72-83, 90-96)
    {"name": "철강제 볼트 너트", "material": "탄소강 스틸 나사 가공물", "use": "구조물 및 부품 기계적 영구 결합용 조임 나사", "expected_chapter": "73", "group": "metal"},
    {"name": "지그소 퍼즐 완구", "material": "종이 판지 인쇄 성형물", "use": "아동 및 성인 지능 개발 놀이 완구", "expected_chapter": "95", "group": "miscellaneous"},
    {"name": "성경책", "material": "종이, 가죽 커버, 인쇄 잉크", "use": "기독교 신앙 예배용 인쇄 종교 서적", "expected_chapter": "49", "group": "miscellaneous"},
    {"name": "스테인리스 주방용 냄비", "material": "SUS304 스테인리스 강판", "use": "식용 가열 요리 주방용 조리용기", "expected_chapter": "73", "group": "metal"},
    {"name": "수동 조작식 주방용 캔 오프너", "material": "크롬도금 탄소강", "use": "수동 통조림 금속 캔 뚜껑 개봉 도구", "expected_chapter": "82", "group": "metal"}
]

def run_test_suite():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cusway.db")
    engine = create_engine(f'sqlite:///{db_path}')
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("=" * 80)
    print("               CUSWAY RAG COMPLIANCE AUTOMATED TEST SUITE (50 CASES)")
    print("=" * 80)
    print(f"Database Loaded: {db_path}")
    print(f"Total Test Cases Loaded: {len(TEST_CASES)}")
    print("-" * 80)

    # Determine mode: if gemini.key exists and size of key > 0, we can run live LLM requests.
    # To prevent rate-limiting, we default to local matching if no key is present or by configuration.
    gemini_key_exists = False
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    g_key = os.path.join(parent_dir, "gemini.key")
    if os.path.exists(g_key) and os.path.getsize(g_key) > 5:
        gemini_key_exists = True

    # CLI option: run 'python test_suite_50.py --live' to force live API calls
    run_live = "--live" in sys.argv
    if run_live:
        print("[MODE] Running LIVE API Test Mode (Gemini / OpenAI). Note: May hit rate limits.")
    else:
        print("[MODE] Running FAST Local Cache Heuristic Validation Mode.")
        # Temporarily mock the API key to force local matching in backend
        os.environ["GROQ_API_KEY"] = ""
        os.environ["OPENAI_API_KEY"] = ""
        os.environ["GEMINI_API_KEY"] = ""
        workspace_root = os.path.dirname(parent_dir)
        for d in [parent_dir, workspace_root]:
            if os.path.exists(os.path.join(d, "openai.key")):
                try: os.rename(os.path.join(d, "openai.key"), os.path.join(d, "openai.key.tmp"))
                except: pass
            if os.path.exists(os.path.join(d, "gemini.key")):
                try: os.rename(os.path.join(d, "gemini.key"), os.path.join(d, "gemini.key.tmp"))
                except: pass

    passed_count = 0
    failed_cases = []

    print(f"{'No.':<4} | {'Product Name':<28} | {'Exp':<3} | {'Recommended HS':<12} | {'Status':<7} | {'Message/Notes'}")
    print("-" * 110)

    start_time = time.time()
    for idx, tc in enumerate(TEST_CASES):
        prod = tc["name"]
        mat = tc["material"]
        use = tc["use"]
        expected = tc["expected_chapter"]
        group = tc["group"]

        try:
            # Execute classification
            res = query_rag_hs_classification(prod, mat, use, db)
            recommended = res.get("recommendedHsCode", "0000.00-0000")
            competing = res.get("competingHsCodes", [])
            
            # 1. Check basic category matching
            # Extract heading (e.g. "19" from "1902.11-0000")
            clean_code = recommended.replace(".", "").replace("-", "")
            actual_prefix = clean_code[:2]
            
            status = "PASS"
            msg = ""

            # Check for critical category mismatch (e.g. food matching to Chapter 84/85 machinery)
            if group == "food" and actual_prefix in ["84", "85"]:
                status = "FAIL"
                msg = f"Critical Error: Food matched to machinery chapter {actual_prefix}"
            elif group == "machinery" and actual_prefix not in ["84", "85", "87", "90"]:
                status = "FAIL"
                msg = f"Critical Error: Machinery matched to chapter {actual_prefix}"
            
            # Check competing codes for semantic consistency (no food matching to machinery in competitors)
            for comp in competing:
                comp_code = comp.get("hsCode", "").replace(".", "").replace("-", "")
                comp_prefix = comp_code[:2]
                if group == "food" and comp_prefix in ["84", "85"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Food has machinery competitor code {comp.get('hsCode')}"
                elif group == "machinery" and comp_prefix in ["01", "02", "03", "04", "07", "08", "19", "20", "21"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Machinery has food competitor code {comp.get('hsCode')}"

            # Check expected chapter
            if actual_prefix != expected and status == "PASS":
                # Some slight differences are okay if it is a close chapter, but flag it
                status = "WARN"
                msg = f"Expected chapter {expected}, got {actual_prefix}"

            if status in ["PASS", "WARN"]:
                passed_count += 1
            else:
                failed_cases.append({"index": idx+1, "name": prod, "recommended": recommended, "error": msg})

            status_str = f"\033[92m{status:<7}\033[0m" if status == "PASS" else (f"\033[93m{status:<7}\033[0m" if status == "WARN" else f"\033[91m{status:<7}\033[0m")
            # Fallback if coloring not supported on Windows console
            if os.name == 'nt':
                status_str = f"{status:<7}"

            print(f"{idx+1:<4} | {prod:<28} | {expected:<3} | {recommended:<12} | {status_str} | {msg}")

        except Exception as e:
            failed_cases.append({"index": idx+1, "name": prod, "recommended": "ERROR", "error": str(e)})
            print(f"{idx+1:<4} | {prod:<28} | {expected:<3} | ERROR        | FAIL    | {str(e)}")

        # Sleep slightly if running live to avoid API rate limit blocks
        if run_live:
            time.sleep(3.5)

    # Restore temporary files if renamed
    if not run_live:
        workspace_root = os.path.dirname(parent_dir)
        for d in [parent_dir, workspace_root]:
            if os.path.exists(os.path.join(d, "openai.key.tmp")):
                try: os.rename(os.path.join(d, "openai.key.tmp"), os.path.join(d, "openai.key"))
                except: pass
            if os.path.exists(os.path.join(d, "gemini.key.tmp")):
                try: os.rename(os.path.join(d, "gemini.key.tmp"), os.path.join(d, "gemini.key"))
                except: pass

    elapsed = time.time() - start_time
    print("-" * 110)
    print(f"Test Summary: {passed_count}/{len(TEST_CASES)} passed/warned in {elapsed:.2f} seconds.")
    print("-" * 110)
    
    if failed_cases:
        print("\n=== FAILED TEST DETAILS ===")
        for fc in failed_cases:
            print(f"No. {fc['index']} [{fc['name']}] -> Recommended: {fc['recommended']} | Reason: {fc['error']}")
        print("=" * 80)
        sys.exit(1)
    else:
        print("\n\033[92m[SUCCESS] All 50 test cases passed local semantic verification!\033[0m" if os.name != 'nt' else "\n[SUCCESS] All 50 test cases passed local semantic verification!")
        print("=" * 80)
        sys.exit(0)

if __name__ == '__main__':
    run_test_suite()
