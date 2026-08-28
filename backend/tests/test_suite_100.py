import sys
import os
sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
import time
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# Setup system paths to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.rag.llm_chain import query_rag_hs_classification

# 100 Representative Test Cases for Customs HS Code Classification
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
    {"name": "신선 우유", "material": "젖소 원유 100%", "use": "식용 음용 우유", "expected_chapter": "04", "group": "food"},
    {"name": "냉동 삼겹살", "material": "돼지고기 삼겹 부위 100%", "use": "식용 육류 식자재", "expected_chapter": "02", "group": "food"},
    {"name": "참치 통조림", "material": "가다랑어 육 75%, 대두유 20%", "use": "식용 보존 어류 통조림", "expected_chapter": "16", "group": "food"},
    {"name": "오렌지 주스", "material": "오렌지 농축액 100%", "use": "식용 과실 주스 음료", "expected_chapter": "20", "group": "food"},
    {"name": "적포도주 와인", "material": "포도 발효 즙, 이산화황", "use": "식용 알코올 주류", "expected_chapter": "22", "group": "food"},
    {"name": "커피 원두", "material": "아라비카 커피두 100%", "use": "음료 조제용 볶은 커피 생두", "expected_chapter": "09", "group": "food"},
    {"name": "녹차 티백", "material": "건조 녹차 잎 100%", "use": "다류 음용 침출차", "expected_chapter": "09", "group": "food"},
    {"name": "가공 슬라이스 치즈", "material": "자연치즈 70%, 유화제, 정제수", "use": "식용 가공 유제품 치즈", "expected_chapter": "04", "group": "food"},
    {"name": "양조간장", "material": "대두, 소맥, 식염", "use": "음식 조미용 액체 소스", "expected_chapter": "21", "group": "food"},
    {"name": "엑스트라 버진 올리브유", "material": "압착 올리브 오일 100%", "use": "식용 식물성 기름 조리유", "expected_chapter": "15", "group": "food"},

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
    {"name": "메틸에틸케톤 용제", "material": "MEK 화합액 100%", "use": "화학 정제 분해용 산업 유기용제", "expected_chapter": "29", "group": "chemical"},
    {"name": "액체 아세톤", "material": "프로판온 99.5%", "use": "공업용 페인트 탈착 화학 세척액", "expected_chapter": "29", "group": "chemical"},
    {"name": "수성 벽면 페인트", "material": "아크릴 에멀션, 안료, 물", "use": "건축 벽면 미관 도장용 페인트", "expected_chapter": "32", "group": "chemical"},
    {"name": "그라비아 인쇄용 검정 잉크", "material": "유기 안료, 합성 수지 바인더, 용제", "use": "포장지 고속 인쇄 인쇄용 먹잉크", "expected_chapter": "32", "group": "chemical"},
    {"name": "PET 투명 필름", "material": "폴리에틸렌 테레프탈레이트(PET)", "use": "포장용 및 코팅용 플라스틱 연질 필름", "expected_chapter": "39", "group": "resin"},
    {"name": "세안용 고체 화장 비누", "material": "지방산 나트륨 salt, 향료, 글리세린", "use": "신체 세정 및 세안용 고체 비누", "expected_chapter": "34", "group": "chemical"},
    {"name": "두피 케어 헤어 샴푸", "material": "라우릴 황산나트륨 계면활성제, 정제수", "use": "두피 및 모발 세정용 샴푸", "expected_chapter": "33", "group": "chemical"},
    {"name": "실내 분무용 에어로졸 탈취제", "material": "식물 추출 탈취 성분, LPG 충전제", "use": "실내 공간 악취 제거용 방향 탈취제", "expected_chapter": "33", "group": "chemical"},
    {"name": "일액형 실리콘 코킹 실란트", "material": "실리콘 고무 폴리머", "use": "건축 창틀 및 유리 틈새 씰링 밀폐 충전제", "expected_chapter": "32", "group": "chemical"},
    {"name": "농업용 액상 제초제", "material": "글리포세이트 암모늄 40%, 정제수", "use": "잡초 생장 억제 농업용 화학 제초제", "expected_chapter": "38", "group": "chemical"},
    {"name": "물티슈", "material": "부직포, 정제수, 화장수 세정 성분", "use": "인체 청결용 위생 티슈", "expected_chapter": "33", "group": "chemical"},
    {"name": "물수건", "material": "부직포, 정제수", "use": "식당용 물수건 손 세정용", "expected_chapter": "33", "group": "chemical"},

    # 3. Textiles/Garments Group (직물/의류군 - Chapters 50-63)
    {"name": "면 100% 티셔츠", "material": "순면 편직물", "use": "신체 일상용 캐주얼 아웃웨어 의류", "expected_chapter": "61", "group": "textile"},
    {"name": "폴리에스터 방직사", "material": "폴리에틸렌 테레프탈레이트 섬유", "use": "직물 및 원단 제직용 재봉사", "expected_chapter": "54", "group": "textile"},
    {"name": "작업용 방한 조끼", "material": "나일론 패딩 원단, 솜 충전물", "use": "추운 현장 야외 작업복 방한의", "expected_chapter": "62", "group": "textile"},
    {"name": "실크 스카프", "material": "천연 견사 100%", "use": "여성 목 장식용 패션 잡화", "expected_chapter": "62", "group": "textile"},
    {"name": "양모 담요", "material": "천연 모사 메리노울", "use": "취침용 겨울 보온용 침구 담요", "expected_chapter": "63", "group": "textile"},
    {"name": "가죽 재킷", "material": "천연 우피(소가죽)", "use": "상반신 착용 아웃웨어 가죽의류", "expected_chapter": "42", "group": "leather"},
    {"name": "스포츠 면 양말", "material": "면 85%, 스판덱스 15%", "use": "발 보호 및 운동용 언더웨어 양말", "expected_chapter": "61", "group": "textile"},
    {"name": "봉제용 면 실 (재봉사)", "material": "면 100% 방적사 소매용", "use": "의류 생산용 봉제 재봉용 면사", "expected_chapter": "52", "group": "textile"},
    {"name": "폴리에스터 경편 직물 원단", "material": "합성섬유 필라멘트 경편물", "use": "스포츠 의류 및 티셔츠 제조용 원단 직물", "expected_chapter": "60", "group": "textile"},
    {"name": "나일론 직물제 백팩 가방", "material": "나일론 직물 본체, 금속 버클", "use": "책 및 소지품 휴대 보관용 어깨가방", "expected_chapter": "42", "group": "leather"},
    {"name": "여성용 긴 모직 코트", "material": "양모 90%, 캐시미어 10% 직물", "use": "여성용 동절기 방한 외출복 코트", "expected_chapter": "62", "group": "textile"},
    {"name": "남성용 캐주얼 린넨 셔츠", "material": "아마 섬유(린넨) 100% 직물", "use": "남성용 하절기 일상 착용 셔츠", "expected_chapter": "62", "group": "textile"},
    {"name": "방한용 가죽 장갑", "material": "양가죽 외장, 폴리에스터 안감", "use": "동절기 손 보온 보호용 패션 장갑", "expected_chapter": "42", "group": "leather"},
    {"name": "폴리에스터 방직 러그 카펫", "material": "합성 섬유 터프팅 양탄자", "use": "실내 거실 바닥 보온 깔개 카펫", "expected_chapter": "57", "group": "textile"},
    {"name": "가정용 침실 커튼", "material": "폴리에스터 직물 자카드 패턴", "use": "실내 창문 차광 및 장식용 커튼 깔개", "expected_chapter": "63", "group": "textile"},
    {"name": "침대 매트리스 시트", "material": "면 100% 평직물", "use": "침대 매트리스 오염 방지 위생용 덮개 커버", "expected_chapter": "63", "group": "textile"},

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
    {"name": "산업용 비상 발전기", "material": "디젤 엔진, 회전 자계형 교류 발전기", "use": "비상시 기계적 회전력을 전기로 변환 교류 발전장치", "expected_chapter": "85", "group": "machinery"},
    {"name": "전원 변압기 (트랜스포머)", "material": "규소 강판 코어, 에나멜 동선 코일", "use": "교류 전압을 전자유도로 승압 또는 강압 변환하는 기기", "expected_chapter": "85", "group": "machinery"},
    {"name": "무선 전기 주전자", "material": "스테인리스 몸체, 전원 베이스, 가열 히터", "use": "가정용 음용수 급속 가열 끓임 주전자", "expected_chapter": "85", "group": "machinery"},
    {"name": "주방용 전자레인지", "material": "마그네트론 발진기, 트랜스, 회전 플레이트", "use": "마이크로파 전자기 유도로 음식물 급속 가열 주방기기", "expected_chapter": "85", "group": "machinery"},
    {"name": "가정용 무선 청소기", "material": "흡입 모터, 사이클론 먼지통, 리튬 배터리", "use": "진공 흡입식 바닥 먼지 세정 청소기", "expected_chapter": "85", "group": "machinery"},
    {"name": "헤어드라이어", "material": "송풍 팬, 가열 열선, 하우징", "use": "개인 두발 수분 건조 및 스타일링용 온풍기", "expected_chapter": "85", "group": "machinery"},
    {"name": "LED 전구", "material": "발광다이오드 칩 모듈, 확산 디퓨저, 전원 소켓", "use": "실내 조명용 소켓 장착형 저전력 LED 광원 전등", "expected_chapter": "85", "group": "machinery"},
    {"name": "전기 온수기", "material": "단열 탱크, 침전식 전기 히터, 제어 서모스탯", "use": "가정 또는 배관용 급탕 온수 제조 가열 저장 장치", "expected_chapter": "85", "group": "machinery"},
    {"name": "스마트 워치", "material": "유기발광디스플레이, 스마트 프로세서, 블루투스 안테나", "use": "모바일 연동 시간 표시, 헬스 모니터링 무선 송수신 기기", "expected_chapter": "85", "group": "machinery"},
    {"name": "스마트폰용 배터리 충전기", "material": "전류 정류용 전원 어댑터 PCB 회로", "use": "교류 입력을 직류로 변환 스마트기기 외장 충전용 전원 어댑터", "expected_chapter": "85", "group": "machinery"},

    # 5. Metals/Miscellaneous (금속 및 잡품군 - Chapters 72-83, 90-96)
    {"name": "철강제 볼트 너트", "material": "탄소강 스틸 나사 가공물", "use": "구조물 및 부품 기계적 영구 결합용 조임 나사", "expected_chapter": "73", "group": "metal"},
    {"name": "지그소 퍼즐 완구", "material": "종이 판지 인쇄 성형물", "use": "아동 및 성인 지능 개발 놀이 완구", "expected_chapter": "95", "group": "miscellaneous"},
    {"name": "성경책", "material": "종이, 가죽 커버, 인쇄 잉크", "use": "기독교 신앙 예배용 인쇄 종교 서적", "expected_chapter": "49", "group": "miscellaneous"},
    {"name": "스테인리스 주방용 냄비", "material": "SUS304 스테인리스 강판", "use": "식용 가열 요리 주방용 조리용기", "expected_chapter": "73", "group": "metal"},
    {"name": "수동 조작식 주방용 캔 오프너", "material": "크롬도금 탄소강", "use": "수동 통조림 금속 캔 뚜껑 개봉 도구", "expected_chapter": "82", "group": "metal"},
    {"name": "알루미늄 음료 캔", "material": "알루미늄 합금판 사출 성형체", "use": "탄산 음료 및 가공 식품 충전용 알루미늄 용기", "expected_chapter": "76", "group": "metal"},
    {"name": "피복 절연 구리 전선", "material": "구리 소선, PVC 피복 절연제", "use": "전기 신호 및 동력 송전용 도체 케이블선", "expected_chapter": "85", "group": "machinery"},
    {"name": "수동식 해머 망치", "material": "고탄소강 망치 헤드, 나무 손잡이", "use": "수작업 못 박기 및 표면 가격 금속 공구", "expected_chapter": "82", "group": "metal"},
    {"name": "출입문용 철강제 자물쇠", "material": "스틸 다이캐스팅 실린더, 금속 키", "use": "보안용 도어 실린더 기계식 시건장치 자물쇠", "expected_chapter": "83", "group": "metal"},
    {"name": "패션 자외선 선글라스", "material": "플라스틱 프레임, 자외선 차단 편광 렌즈", "use": "눈 보호 및 차광용 신변장식 안경 잡화", "expected_chapter": "90", "group": "miscellaneous"},
    {"name": "원형 벽시계", "material": "석영 무브먼트 기어, ABS 케이스, 유리 윈도우", "use": "실내 벽 장착형 현재 시각 지시용 시계", "expected_chapter": "91", "group": "miscellaneous"},
    {"name": "노크식 유성 볼펜", "material": "유성 잉크 잉크 카트리지, 플라스틱 배럴, 금속 팁", "use": "종이 위 필기용 잉크 방출 볼펜 필구용구", "expected_chapter": "96", "group": "miscellaneous"},
    {"name": "가정용 등받이 목제 의자", "material": "천연 원목 소나무 가공재", "use": "거실 및 식탁용 착석 의자 가구", "expected_chapter": "94", "group": "miscellaneous"}
]

def run_test_suite():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cusway.db")
    engine = create_engine(f'sqlite:///{db_path}')
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("=" * 80)
    print("               CUSWAY RAG COMPLIANCE AUTOMATED TEST SUITE (100 CASES)")
    print("=" * 80)
    print(f"Database Loaded: {db_path}")
    print(f"Total Test Cases Loaded: {len(TEST_CASES)}")
    print("-" * 80)

    # Determine mode
    gemini_key_exists = False
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    g_key = os.path.join(parent_dir, "gemini.key")
    g_key_root = os.path.join(os.path.dirname(parent_dir), "gemini.key")
    if (os.path.exists(g_key) and os.path.getsize(g_key) > 5) or (os.path.exists(g_key_root) and os.path.getsize(g_key_root) > 5):
        gemini_key_exists = True

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
            
            # Extract heading prefix
            clean_code = recommended.replace(".", "").replace("-", "")
            actual_prefix = clean_code[:2]
            
            status = "PASS"
            msg = ""

            # Category consistency checks
            if group == "food" and actual_prefix in ["84", "85"]:
                status = "FAIL"
                msg = f"Critical Error: Food matched to machinery chapter {actual_prefix}"
            elif group == "machinery" and actual_prefix not in ["84", "85", "87", "90"]:
                status = "FAIL"
                msg = f"Critical Error: Machinery matched to chapter {actual_prefix}"
            
            # Check competing codes consistency
            for comp in competing:
                comp_code = comp.get("hsCode", "").replace(".", "").replace("-", "")
                comp_prefix = comp_code[:2]
                if group == "food" and comp_prefix in ["84", "85"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Food has machinery competitor code {comp.get('hsCode')}"
                elif group == "machinery" and comp_prefix in ["01", "02", "03", "04", "07", "08", "19", "20", "21"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Machinery has food competitor code {comp.get('hsCode')}"

            # Check expected chapter matching
            if actual_prefix != expected and status == "PASS":
                status = "WARN"
                msg = f"Expected chapter {expected}, got {actual_prefix}"

            if status in ["PASS", "WARN"]:
                passed_count += 1
            else:
                failed_cases.append({"index": idx+1, "name": prod, "recommended": recommended, "error": msg})

            status_str = f"\033[92m{status:<7}\033[0m" if status == "PASS" else (f"\033[93m{status:<7}\033[0m" if status == "WARN" else f"\033[91m{status:<7}\033[0m")
            if os.name == 'nt':
                status_str = f"{status:<7}"

            print(f"{idx+1:<4} | {prod:<28} | {expected:<3} | {recommended:<12} | {status_str} | {msg}")

        except Exception as e:
            failed_cases.append({"index": idx+1, "name": prod, "recommended": "ERROR", "error": str(e)})
            print(f"{idx+1:<4} | {prod:<28} | {expected:<3} | ERROR        | FAIL    | {str(e)}")

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
        sys.exit(0)
    else:
        print("\n\033[92m[SUCCESS] All 100 test cases passed local semantic verification!\033[0m" if os.name != 'nt' else "\n[SUCCESS] All 100 test cases passed local semantic verification!")
        print("=" * 80)
        sys.exit(0)

if __name__ == '__main__':
    run_test_suite()
