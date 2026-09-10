import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from backend.db import SessionLocal
from backend.rag.llm_chain import query_rag_hs_classification, run_local_fallback_match
from backend.rag.sensor_classifier import classify_sensor_universally

db = SessionLocal()

# Exhaustive Multi-Industry 25+ Sensor Benchmark Test Cases
sensor_test_cases = [
    # 1. Robotics & Industrial Automation
    ("로봇 관절 토크센서 (Robot joint torque sensor)", "9031.80-9080", "9031"),
    ("산업용 로봇 6축 힘/토크센서 (FT sensor)", "9031.80-9080", "9031"),
    ("스마트팩토리 레이저 변위센서 (Laser displacement sensor)", "9031.80-9090", "9031"),
    ("공작기계 광학식 로터리 엔코더 (Rotary encoder)", "9031.80-9090", "9031"),
    ("자동화 라인 금속 근접센서 (Proximity sensor)", "9031.80-9090", "9031"),
    ("산업용 초음파 두께측정 센서 (Ultrasonic thickness sensor)", "9031.80-9060", "9031"),
    ("용접부 결함 탐상 비파괴 검사센서 (NDT crack sensor)", "9031.80-9070", "9031"),
    ("인장 시험기 로드셀 센서 (Tension load cell)", "9031.80-2000", "9031"),
    
    # 2. Autonomous Driving & Mobility (ADAS & EV)
    ("자율주행차 77GHz 밀리미터파 레이더센서 (Automotive radar sensor)", "8526.10-1000", "8526"),
    ("자율주행차 솔리드스테이트 라이다센서 (LiDAR sensor)", "9031.80-9090", "9031"),
    ("자동차 에어백 충돌 가속도센서 (Crash G-sensor)", "9031.80-9090", "9031"),
    ("자동차 시트 탑승자 하중센서 (WCS occupant sensor)", "9031.80-9090", "9031"),
    ("자동차 전자식 조향각센서 (Steering angle sensor)", "9031.80-9090", "9031"),
    ("전기차 배터리팩 고전압 홀 전류센서 (Hall current sensor)", "9030.33-0000", "9030"),
    ("내연기관/수소차 배기가스 산소센서 (Exhaust oxygen sensor)", "9027.10-0000", "9027"),
    ("자동차 타이어 공기압 센서 (TPMS pressure sensor)", "9026.20-4000", "9026"),
    
    # 3. Semiconductor & Battery Equipment
    ("반도체 웨이퍼 결함 광학 검사센서 (Wafer inspection sensor)", "9031.80-9091", "9031"),
    ("진공 챔버용 정밀 피에조 압력센서 (Vacuum pressure sensor)", "9026.20-4000", "9026"),
    ("이차전지 전극 코팅 두께 측정센서 (Coating thickness sensor)", "9031.80-9060", "9031"),
    
    # 4. Smart Energy, Plant & Marine
    ("선박 연료 배관 질량 유량센서 (Mass flow meter sensor)", "9026.10-1000", "9026"),
    ("원자력 플랜트 보일러 수위센서 (Liquid level sensor)", "9026.10-2000", "9026"),
    ("스마트그리드 변전소 고압 송전선 변류기 CT센서 (Current sensor)", "9030.33-0000", "9030"),
    ("스마트팜 온실 온습도 복합센서 (Temp & humidity sensor)", "9025.80-0000", "9025"),
    
    # 5. Healthcare & Medical Diagnostics
    ("당뇨 환자용 패치형 연속혈당측정 CGM 센서 (CGM sensor patch)", "9018.90-9090", "9018"),
    ("환자 감시장치용 심전도 ECG 전극 센서 (ECG electrode sensor)", "9018.19-8000", "9018"),
    
    # 6. Discrete Semiconductor & Switches
    ("광통신용 수광 포토다이오드 소자 (Photodiode device)", "8541.49-0000", "8541"),
    ("실리콘 웨이퍼 패키징 MEMS 가속도계 IC 칩 (MEMS accelerometer IC)", "8542.39-0000", "8542"),
    ("기계식 설비 도어 안전 리미트스위치 (Limit switch)", "8536.50-9000", "8536")
]

print("=" * 95)
print("     ENTERPRISE ALL-INDUSTRY SENSOR CLASSIFICATION BENCHMARK SUITE")
print("=" * 95)

passed = 0
for name, expected_hsk, expected_heading in sensor_test_cases:
    # 1. Test Universal Classifier Engine
    u_res = classify_sensor_universally(name)
    u_code = u_res['recommendedHsCode']
    
    # 2. Test Local Fallback Matcher
    l_res = run_local_fallback_match(name, "", "", db)
    l_code = l_res['recommendedHsCode']
    
    match = (u_code == expected_hsk) and (l_code == expected_hsk)
    if match:
        passed += 1
        print(f"[PASS] {name:50} -> HSK: {u_code:13} | {u_res['headingName'][:35]}")
    else:
        print(f"[FAIL] {name:50} -> Got U:{u_code}, L:{l_code} (Expected {expected_hsk})")

print("=" * 95)
print(f"Benchmark Result: {passed}/{len(sensor_test_cases)} Passed (100% Precision: {passed == len(sensor_test_cases)})")
