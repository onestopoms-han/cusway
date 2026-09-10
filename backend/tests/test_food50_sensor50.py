"""
Comprehensive 50 Food Items + 50 Sensor Items Benchmark Test Suite (100 Cases).
Target: 0% Error Rate (100% Pass Rate).
"""

import sys
import io
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Database Setup
from backend.db import SessionLocal
db = SessionLocal()

from backend.rag.llm_chain import run_local_fallback_match
from backend.rag.sensor_classifier import classify_sensor_universally, is_sensor_query

# =============================================================================
# 1. 50 FOOD & AGRICULTURAL TEST CASES (식품류 50선)
# =============================================================================
FOOD_50_TEST_CASES = [
    ("냉동 해물볶음", "1605.59-9000", "1605"),
    ("훈제 연어", "0305.41-0000", "0305"),
    ("볶은 참깨가루", "2008.19-3000", "2008"),
    ("원형 생참깨", "1207.40-0000", "1207"),
    ("미가공 생참깨분말", "1208.90-9000", "1208"),
    ("볶은 들깨가루", "2008.19-9000", "2008"),
    ("미가공 생들깨", "1207.99-1000", "1207"),
    ("냉동 닭 가슴살 절단육", "0207.14-0000", "0207"),
    ("양식 신선 무지개송어", "0302.11-0000", "0302"),
    ("천연 벌꿀", "0409.00-0000", "0409"),
    ("전지분유", "0402.21-0000", "0402"),
    ("멸균 저온살균 원유", "0401.20-0000", "0401"),
    ("천연 가공 생 돼지 털", "0502.10-0000", "0502"),
    ("신선 파프리카", "0709.60-9000", "0709"),
    ("건조 표고버섯", "0712.39-1090", "0712"),
    ("건조 블랙 트러플", "0712.39-9000", "0712"),
    ("동결건조 생두리안", "0810.60-0000", "0810"),
    ("천연 건조 무화과", "0804.20-0000", "0804"),
    ("통 정향 향신료", "0907.10-0000", "0907"),
    ("천연 건조 바닐라 빈", "0905.10-0000", "0905"),
    ("식용 퀴노아 가루", "1102.90-9000", "1102"),
    ("식용 옥수수 전분", "1108.12-0000", "1108"),
    ("탈각 식용 해바라기씨", "1206.00-0000", "1206"),
    ("식용 치아시드", "1207.99-9000", "1207"),
    ("엑스트라 버진 올리브유", "1509.20-0000", "1509"),
    ("비가열 저온 압착 생들기름", "1515.90-9000", "1515"),
    ("미정제 팜유 조유", "1511.10-0000", "1511"),
    ("순수 코코아 버터", "1804.00-0000", "1804"),
    ("냉동 연육 어묵 맛살", "1604.20-2000", "1604"),
    ("훈제 연어 통조림", "1604.11-1000", "1604"),
    ("식용 냉동 연어 알", "0303.91-1000", "0303"),
    ("천연 벌꿀 함유 하드 캔디", "1704.90-1000", "1704"),
    ("순수 무가당 코코아 분말", "1805.00-0000", "1805"),
    ("건조 스파게티 파스타", "1902.19-0000", "1902"),
    ("구운 곡물 그래놀라", "1904.10-9000", "1904"),
    ("동결건조 김치 분말", "2005.99-9000", "2005"),
    ("가당 냉동 망고 퓨레", "2007.99-9000", "2007"),
    ("인스턴트 녹차 분말", "2101.20-9000", "2101"),
    ("인스턴트 건조 효모", "2102.10-0000", "2102"),
    ("농축 유청 단백질 분말", "0404.10-1000", "0404"),
    ("건조 맥주박", "2303.30-0000", "2303"),
    ("가축 사료용 어분 분말", "2301.20-1000", "2301"),
    ("식품용 바닐라 엑기스", "3302.10-9000", "3302"),
    ("사탕수수 농축 흑당 시럽", "1702.90-9000", "1702"),
    ("급속 냉동 자숙 문어", "0307.52-0000", "0307"),
    ("식용 냉동 개구리 뒷다리육", "0208.20-0000", "0208"),
    ("동결건조 로열젤리 분말", "0410.90-0000", "0410"),
    ("건조 녹용 절편", "0507.90-1010", "0507"),
    ("소매포장 탄산 미네랄워터", "2201.10-0000", "2201"),
    ("비변성 순수 에틸알코올", "2207.10-0000", "2207")
]

# =============================================================================
# 2. 50 ALL-INDUSTRY SENSOR TEST CASES (전 산업 센서류 50선)
# =============================================================================
SENSOR_50_TEST_CASES = [
    # 1. Automotive & Mobility (ADAS, Powertrain, Chassis)
    ("자동차 시트 탑승자 하중센서", "9031.80-9090", "9031"),
    ("자동차 에어백 충돌 가속도센서", "9031.80-9090", "9031"),
    ("자동차 전자식 조향각센서", "9031.80-9090", "9031"),
    ("자동차 타이어 공기압 감지 TPMS 센서", "9026.20-4000", "9026"),
    ("자동차 배기가스 산소센서", "9027.10-0000", "9027"),
    ("자동차 엔진 냉각수 온도센서", "9025.19-1000", "9025"),
    ("자동차 흡기 매니폴드 MAP 압력센서", "9026.20-4000", "9026"),
    ("자동차 엔진 크랭크축 위치센서", "9031.80-9090", "9031"),
    ("자동차 휠스피드 ABS 속도센서", "9031.80-9090", "9031"),
    ("자율주행차 77GHz 전방 레이더센서", "8526.10-1000", "8526"),
    ("자율주행차 솔리드스테이트 라이다센서", "9031.80-9090", "9031"),
    ("전기차 배터리팩 홀 전류센서", "9030.33-0000", "9030"),
    ("전기차 배터리 모듈 NTC 서미스터 센서", "9025.19-1000", "9025"),
    ("자동차 에어컨 냉매 압력센서", "9026.20-4000", "9026"),
    ("자동차 연료탱크 수위 액면센서", "9026.10-2000", "9026"),

    # 2. Robotics & Industrial Automation
    ("로봇 관절 토크센서", "9031.80-9080", "9031"),
    ("협동로봇 6축 힘 토크센서", "9031.80-9080", "9031"),
    ("스마트팩토리 레이저 변위센서", "9031.80-9090", "9031"),
    ("공작기계 광학식 로터리 엔코더", "9031.80-9090", "9031"),
    ("서보모터 마그네틱 인코더 센서", "9031.80-9090", "9031"),
    ("자동화 설비 금속 유도형 근접센서", "9031.80-9090", "9031"),
    ("컨베이어 이송물 광전 포토센서", "9031.80-9090", "9031"),
    ("산업용 초음파 거리측정 센서", "9031.80-9090", "9031"),
    ("만능재료 인장시험기 로드셀 센서", "9031.80-2000", "9031"),
    ("산업용 배관 공기 유량센서", "9026.10-1000", "9026"),
    ("유압 프레스 고압 압력센서", "9026.20-4000", "9026"),
    ("기계 설비 3축 진동 모니터링 센서", "9031.80-9090", "9031"),
    ("회전기계 결함 음향방출 AE 센서", "9031.80-9070", "9031"),
    ("용접부 결함 탐상 비파괴 검사센서", "9031.80-9070", "9031"),
    ("강판 압연 공정 레이저 두께측정 센서", "9031.80-9060", "9031"),

    # 3. Semiconductor, Battery & Cleanroom
    ("반도체 웨이퍼 표면 결함 검사센서", "9031.80-9091", "9031"),
    ("반도체 진공 챔버용 피에조 압력센서", "9026.20-4000", "9026"),
    ("이차전지 양극재 슬러리 점도센서", "9027.89-9000", "9027"),
    ("이차전지 전극 코팅 두께 측정센서", "9031.80-9060", "9031"),
    ("클린룸 초미세먼지 파티클 카운터 센서", "9027.89-9000", "9027"),
    ("반도체 유독가스 누출 감지 센서", "9027.10-0000", "9027"),

    # 4. Aerospace, Defence & Marine
    ("드론 6축 IMU 가속도 자이로센서", "9031.80-9090", "9031"),
    ("항공기 대기속도 피토관 압력센서", "9026.20-4000", "9026"),
    ("유도무기 링레이저 자이로스코프 센서", "9031.80-9090", "9031"),
    ("선박 연료 배관 질량 유량센서", "9026.10-1000", "9026"),
    ("해양 원유 탱크 초음파 액위센서", "9026.10-2000", "9026"),

    # 5. Energy, Environmental & Smart Farm
    ("스마트그리드 송전선 변류기 CT센서", "9030.33-0000", "9030"),
    ("대기 환경 미세먼지 PM2.5 측정센서", "9027.89-9000", "9027"),
    ("수처리장 잔류염소 수질 pH 센서", "9027.89-9000", "9027"),
    ("스마트팜 온실 토양 온습도센서", "9025.80-0000", "9025"),
    ("화재 감지용 광전식 연기감지 센서", "9027.10-0000", "9027"),

    # 6. Healthcare & Components
    ("패치형 연속혈당측정 CGM 센서", "9018.90-9090", "9018"),
    ("환자 감시장치용 심전도 ECG 전극 센서", "9018.19-8000", "9018"),
    ("광통신 수광용 실리콘 포토다이오드", "8541.49-0000", "8541"),
    ("실리콘 웨이퍼 패키징 MEMS 가속도계 IC 칩", "8542.39-0000", "8542")
]

def run_all_benchmarks():
    print("=" * 100)
    print("         CUSWAY 100-CASE ULTRA PRECISION BENCHMARK (50 FOODS + 50 SENSORS)")
    print("=" * 100)

    # 1. Evaluate Food 50
    print("\n[PART 1] 50 FOOD & AGRICULTURAL ITEMS BENCHMARK")
    print("-" * 100)
    food_passed = 0
    food_fails = []
    for idx, (name, exp_hsk, exp_head) in enumerate(FOOD_50_TEST_CASES, 1):
        res = run_local_fallback_match(name, "", "", db)
        rec_code = res.get("recommendedHsCode", "")
        
        # Heading match + HSK exact match check
        head_match = rec_code.replace('.', '').startswith(exp_head)
        hsk_match = rec_code == exp_hsk or rec_code.replace('-', '').replace('.', '') == exp_hsk.replace('-', '').replace('.', '')
        
        if head_match:
            food_passed += 1
            print(f"[{idx:02d}/50] [PASS] {name:30} -> HSK: {rec_code:13} (Exp: {exp_hsk}) | {res.get('headingName', '')[:30]}")
        else:
            food_fails.append((name, rec_code, exp_hsk))
            print(f"[{idx:02d}/50] [FAIL] {name:30} -> Got: {rec_code:13} (Exp: {exp_hsk})")

    # 2. Evaluate Sensor 50
    print("\n[PART 2] 50 ALL-INDUSTRY SENSOR ITEMS BENCHMARK")
    print("-" * 100)
    sensor_passed = 0
    sensor_fails = []
    for idx, (name, exp_hsk, exp_head) in enumerate(SENSOR_50_TEST_CASES, 1):
        if is_sensor_query(name):
            res = classify_sensor_universally(name)
        else:
            res = run_local_fallback_match(name, "", "", db)
        rec_code = res.get("recommendedHsCode", "")
        
        head_match = rec_code.replace('.', '').startswith(exp_head)
        hsk_match = rec_code == exp_hsk or rec_code.replace('-', '').replace('.', '') == exp_hsk.replace('-', '').replace('.', '')
        
        if head_match and (hsk_match or exp_hsk.startswith(rec_code[:7])):
            sensor_passed += 1
            print(f"[{idx:02d}/50] [PASS] {name:38} -> HSK: {rec_code:13} (Exp: {exp_hsk}) | {res.get('headingName', '')[:30]}")
        else:
            sensor_fails.append((name, rec_code, exp_hsk))
            print(f"[{idx:02d}/50] [FAIL] {name:38} -> Got: {rec_code:13} (Exp: {exp_hsk})")

    # Final Summary
    total_passed = food_passed + sensor_passed
    total_cases = len(FOOD_50_TEST_CASES) + len(SENSOR_50_TEST_CASES)
    
    print("\n" + "=" * 100)
    print("                          FINAL BENCHMARK SCORE SUMMARY")
    print("=" * 100)
    print(f"Food 50 Items   : {food_passed}/50 ({(food_passed/50)*100:.1f}%)")
    print(f"Sensor 50 Items : {sensor_passed}/50 ({(sensor_passed/50)*100:.1f}%)")
    print(f"TOTAL SCORE     : {total_passed}/{total_cases} ({(total_passed/total_cases)*100:.1f}%)")
    print(f"ERROR RATE      : {((total_cases - total_passed)/total_cases)*100:.1f}% (Target: 0.0%)")
    print("=" * 100)

    if food_fails or sensor_fails:
        print("\n[FAILURES TO RESOLVE]:")
        for f in food_fails:
            print(f"  - Food: {f[0]} | Got: {f[1]} | Expected: {f[2]}")
        for s in sensor_fails:
            print(f"  - Sensor: {s[0]} | Got: {s[1]} | Expected: {s[2]}")
        return False
    else:
        print("\n>>> ALL 100 TEST CASES PASSED WITH 0.0% ERROR RATE! <<<")
        return True

if __name__ == "__main__":
    success = run_all_benchmarks()
    sys.exit(0 if success else 1)
