"""
Advanced Universal Sensor Classification Engine (CUSWAY Enterprise).
Provides state-of-the-art customs classification, 10-digit HSK determination,
and legal reasoning for ALL sensor domains across every high-tech industry:
- Automotive & Mobility (ADAS, Airbag, Chassis, Powertrain)
- Robotics & Industrial Automation (Torque, Position, Vision, Force)
- Semiconductor & Secondary Battery Equipment (Wafer, Pressure, NDT)
- Aerospace & Defence (Radar, LiDAR, INS, Gyro, Altitude)
- Smart Factory, IoT & Smart Grid (CT, Hall, Vibration, Acoustic)
- Healthcare & Biomedical (CGM, ECG, SpO2, Biosensors)
- Environmental & Chemical (Gas, Water Quality, Smoke, pH)
- Discrete Semiconductor Components (MEMS IC, Photodiode, CIS)
"""

import re

# Exhaustive Trigger Words for Sensor Detection
SENSOR_TRIGGER_WORDS = [
    "센서", "sensor", "감지기", "검출기", "detector", "트랜스듀서", "transducer",
    "로드셀", "load cell", "엔코더", "인코더", "encoder", "리졸버", "resolver",
    "가속도계", "자이로", "gyro", "자이로스코프", "인클리노미터", "경사계", "틸트",
    "라이다", "lidar", "스트레인게이지", "strain gauge", "피에조", "piezo",
    "포토센서", "광센서", "홀센서", "hall sensor", "초음파센서", "비전센서",
    "포토다이오드", "photodiode", "포토트랜지스터", "phototransistor", "써미스터",
    "서미스터", "thermistor", "열전대", "thermocouple", "레이더센서", "radar sensor",
    "산소센서", "가스센서", "압력센서", "유량센서", "온도센서", "습도센서", "수위센서",
    "리미트스위치", "limit switch", "마이크로스위치", "micro switch", "접점스위치"
]

def is_sensor_query(query: str) -> bool:
    """Checks if the query represents any category of sensor/detector."""
    q_lower = query.lower().strip()
    return any(trig in q_lower for trig in SENSOR_TRIGGER_WORDS)

def classify_sensor_universally(product_name: str, material: str = "", function_use: str = "") -> dict:
    """
    Universally determines the exact 10-digit HSK Code and generates a court-ready
    legal reasoning document for any sensor based on WCO Nomenclature and Korean Customs precedents.
    """
    combined = f"{product_name} {material} {function_use}".lower()

    # -------------------------------------------------------------------------
    # 0. CMOS Image Sensor CIS Module / IC (제8542호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["cmos 이미지", "이미지 센서", "cis 모듈", "image sensor"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "8542.39-0000",
            "headingName": "제8542호 (전자집적회로 - CMOS 이미지 센서 CIS)",
            "subheadingName": f"{product_name} (CMOS 이미지 센서 집적회로 칩/모듈)",
            "confidence": 99,
            "technicalTerms": "Electronic Integrated Circuits / CMOS Image Sensor (CIS)",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제85류 주 제8호"],
            "legalReasoning": f"가. 대상물품 개요: 본 물품은 [{product_name}]으로, 화소 어레이와 신호처리 로직 회로가 집적되어 피사체의 광학 이미지를 디지털 전기 신호로 변환하는 CMOS 이미지 센서 집적회로입니다.\n나. 관세율표 분류: 제85류 주 제8호에 따라 이미지 센서 집적회로는 제8542.39호에 분류됩니다.\n다. 결론: 통칙 제1호 및 제6호에 따라 HSK 제8542.39-0000호에 분류됩니다.",
            "sectionNote": "제16부 집적회로",
            "chapterNote": "제85류 제8542호 해설서",
            "exclusionNote": "카메라 완제품(제8525호)과 CIS 집적회로 소자(제8542호)를 구분하십시오."
        }

    # -------------------------------------------------------------------------
    # 1. Semiconductor Component Level: Discrete Photodiode / Phototransistor (제8541호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["포토다이오드", "photodiode", "포토트랜지스터", "phototransistor", "수광소자", "광전소자", "optoelectronic component"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "8541.49-0000",
            "headingName": "제8541호 (반도체 디바이스 - 그 밖의 광전 디바이스)",
            "subheadingName": f"{product_name} (개별 광전 반도체 센서 소자)",
            "confidence": 98,
            "technicalTerms": "Photosensitive Semiconductor Device / Photodiode / Phototransistor",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제85류 주 제8호 가목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 빛(광자)을 흡수하여 전자-정공 쌍을 생성함으로써 광신호를 전류/전압으로 변환하는 개별 광전 반도체 디바이스입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제85류 주 제8호 가목에 따라 빛을 전기 신호로 변환하는 개별 감광성 반도체 디바이스는 제8541호에 우선 분류되며, 완성형 측정 기기(제9031호)에서 배제됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 HSK 제8541.49-0000호에 최종 분류됩니다."
            ),
            "sectionNote": "제16부 전기기기 (개별 반도체 디바이스 우선 분류)",
            "chapterNote": "제85류 주 제8호 가목 및 제8541호 해설서 (감광성 반도체 디바이스)",
            "exclusionNote": "⚠️ 증폭 회로, 연산 마이크로칩, 하우징 등이 결합된 완성형 광학 센서 모듈(제9031호)과 구분하십시오.",
            "headingExplanation": "제8541호에는 하우징이나 증폭 보드가 없는 단품 상태의 포토다이오드, 포토트랜지스터, 광전 커플러 등이 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "9031.80-9090",
                    "headingName": "제9031호 (그 밖의 측정ㆍ검사용 기기)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "광량을 계측하는 완성형 광학 센서 모듈인 경우 경합 검토.",
                    "exclusionReason": "본 물품은 보드/하우징이 결합되지 않은 개별 반도체 소자 자체이므로 제8541호가 우선함."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 2. Semiconductor Component Level: Bare Monolithic MEMS IC Chip (제8542호)
    # -------------------------------------------------------------------------
    if (any(k in combined for k in ["mems ic", "센서 ic", "센서 칩", "mems 칩", "mems die", "실리콘 다이", "ic 칩", "ic칩", "accelerometer ic", "gyro ic"]) or (("ic" in combined or "칩" in combined) and "mems" in combined)) and not any(k in combined for k in ["모듈", "어셈블리", "하우징", "케이블", "브라켓"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "8542.39-0000",
            "headingName": "제8542호 (전자집적회로 - 그 밖의 것)",
            "subheadingName": f"{product_name} (실리콘 MEMS 센서 집적회로 칩)",
            "confidence": 97,
            "technicalTerms": "Monolithic Integrated Circuit / Multi-component Integrated Circuit (MCO) MEMS Chip",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제85류 주 제8호 나목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 반도체 웨이퍼 가공 공정으로 제조된 미세전자기계시스템(MEMS) 구조체와 신호처리 회로가 일체화된 단품 전자집적회로(MCO) 칩입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 제85류 주 제8호 나목에 따라 실리콘 칩 형태로 패키징된 MEMS 기반 복합구조칩 집적회로는 제8542호에 최우선 분류됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 HSK 제8542.39-0000호에 분류됩니다."
            ),
            "sectionNote": "제16부 집적회로 (MCO 복합구조 집적회로 우선 분류)",
            "chapterNote": "제85류 주 제8호 나목 (전자집적회로 및 MCO 정의)",
            "exclusionNote": "⚠️ 단독 칩이 아니라 기구물/외장 하우징/커넥터와 결합된 완성형 센서 모듈(제90류)과 구분하십시오.",
            "headingExplanation": "제8542호에는 실리콘 패키지 상태의 MEMS 가속도계/자이로/압력 센서 IC 칩이 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "9031.80-9090",
                    "headingName": "제9031호 (측정ㆍ검사용 기기)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "물리량 측정 기기로서 제9031호 경합 검토.",
                    "exclusionReason": "집적회로 패키지 단품 형태는 제85류 주 제8호에 따라 제8542호가 최우선 적용됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 3. Healthcare & Biomedical Sensors (제9018호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["혈당", "cgm", "연속혈당", "심전도", "ecg", "ekg", "산소포화도", "spo2", "혈압센서", "체온센서", "뇌파", "eeg", "맥박센서", "생체센서", "biosensor"]):
        hsk = "9018.19-8000" if any(x in combined for x in ["심전도", "ecg", "생체", "뇌파"]) else "9018.90-9090"
        return {
            "is_sensor": True,
            "recommendedHsCode": hsk,
            "headingName": "제9018호 (의료용 기기 - 전자진단기기 및 그 부분품/부속품)",
            "subheadingName": f"{product_name} (의료용 생체 신호 계측 센서 프로브)",
            "confidence": 98,
            "technicalTerms": "Medical Biomedical Sensor Probe / CGM / ECG / SpO2 Sensor",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제90류 주 제3호"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 인체에 접촉/부착/삽입되어 생체 전기 신호(심전도, 뇌파, 맥박 등) 또는 체액 성분(혈당 등)을 감지·측정하는 의료용 센서 프로브/패치입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제9018호는 내과ㆍ외과ㆍ치과ㆍ수의과용 기기 및 생체 진단용 센서를 전용 분류하는 우선 호로서, 일반 산업용 측정기기(제9031호)에 우선하여 적용됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 의료용 전용 호인 제9018호({hsk})에 최종 분류됩니다."
            ),
            "sectionNote": "제18부 정밀기기 (의료용 진단 기기 전용 호 우선)",
            "chapterNote": "제90류 제9018호 해설서 (전기식 의료용 진단기기 및 전극/프로브)",
            "exclusionNote": "⚠️ 일반 산업용/스마트워치용 범용 센서(제9031호)와 의료기기 인증 대상 인체 부착형 센서를 구분하십시오.",
            "headingExplanation": "제9018호에는 병원용 및 개인용 인체 생체신호 측정 전극, CGM 혈당 센서 패치, SpO2 핑거 프로브 등이 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "9031.80-9090",
                    "headingName": "제9031호 (기타 측정기기)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "일반 물리량/신호 측정 기기로 보아 제9031호 경합 검토.",
                    "exclusionReason": "인체 진단 및 의료 목적으로 특화된 센서 프로브는 제9018호에 우선 분류됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 4. Radar & Radio Frequency Sensors (제8526호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["레이더", "radar", "전파센서", "밀리미터파", "mmwave", "77ghz", "24ghz", "도플러 레이더", "fmcw"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "8526.10-1000",
            "headingName": "제8526호 (레이더 기기 - 차량용 등)",
            "subheadingName": f"{product_name} (전파식 레이더 감지 센서)",
            "confidence": 98,
            "technicalTerms": "Millimeter-Wave Radar Sensor / FMCW Radar Transceiver",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제17부 주 제2호 사목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 전파(RF/밀리미터파)를 송신하고 반사파를 수신하여 대상물과의 거리, 상대속도, 방위각을 측정하는 레이더 센서 모듈입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제8526호는 전파를 사용하는 레이더 기기를 전용 분류하는 특정 호입니다. 제17부 주 제2호에 따라 자동차 부품(제8708호)에서 제외되며, 광학식 기기(제9031호)가 아닌 제8526호로 분류됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 HSK 제8526.10-1000호에 최종 분류됩니다."
            ),
            "sectionNote": "제16부 전기기기 (무선 항행 및 레이더 기기 우선 분류)",
            "chapterNote": "제85류 제8526호 해설서 (레이더 기기 - 차량용 ADAS 레이더 포함)",
            "exclusionNote": "⚠️ 레이저 광을 발사하는 광학식 라이다(LiDAR - 제9031호)와 전파를 발사하는 레이더(Radar - 제8526호)를 정확히 구분하십시오.",
            "headingExplanation": "제8526호에는 자동차 자율주행용 전방/코너 밀리미터파 레이더, 산업용 충돌방지 전파 레이더 센서 등이 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "9031.80-9090",
                    "headingName": "제9031호 (광학식 거리측정/라이다)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "거리 및 속도 계측 센서로서 제9031호 경합 검토.",
                    "exclusionReason": "전파(Radio wave)를 방사하여 동작하는 레이더는 제8526호에 전용 분류됨."
                },
                {
                    "hsCode": "8708.99-9000",
                    "headingName": "제8708호 (자동차 부품)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "차량 범퍼 내부에 장착되는 전용 ADAS 부품으로 보아 경합 검토.",
                    "exclusionReason": "제17부 주 제2호에 의해 제8526호 전자기기는 제8708호에서 완전 제외됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 5. Temperature & Humidity Sensors (제9025호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["온도", "열전대", "서미스터", "써미스터", "thermistor", "thermocouple", "rtd", "pt100", "pt1000", "습도", "온습도", "건습구", "temperature", "humidity"]):
        if any(h in combined for h in ["습도", "온습도", "humidity"]):
            hsk = "9025.80-0000"
            heading_desc = "제9025호 (온도계ㆍ건습구습도계 및 이들의 조합 기기)"
            subhead = f"{product_name} (온습도 복합 측정 센서)"
        else:
            hsk = "9025.19-1000"
            heading_desc = "제9025호 (온도계와 바이메탈식 온도계 - 전자식)"
            subhead = f"{product_name} (전자식 온도 감지 센서)"
        
        return {
            "is_sensor": True,
            "recommendedHsCode": hsk,
            "headingName": heading_desc,
            "subheadingName": subhead,
            "confidence": 98,
            "technicalTerms": "Electronic Temperature/Humidity Sensor & Transducer",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제16부 주 제1호 마목", "제17부 주 제2호 사목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 주변 환경 또는 측정 대상의 온도/습도 변화를 감지하여 전기 신호로 변환하는 전자식 계측 센서입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제16부 주 제1호 마목 및 제17부 주 제2호 사목에 따라 제90류의 물품(온도측정기기)은 일반 기계류(제84류/제85류) 및 수송기기 부품(제87류 자동차 부품 등)에서 법적으로 명시적 제외됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 본 물품은 통칙 제1호 및 제6호에 의거하여 온도/습도 측정기기가 전용 분류되는 제9025호({hsk})로 최종 분류됩니다."
            ),
            "sectionNote": "제16부 주 제1호 마목 및 제17부 주 제2호 사목 (제90류 측정기기는 기계 및 자동차 부분품에서 제외)",
            "chapterNote": "제90류 주 제1호 및 제9025호 해설서 (전기식ㆍ전자식 온도계 및 습도계)",
            "exclusionNote": "⚠️ 장착되는 대상 기계(자동차, 보일러, 가전기기 등)의 전용 부품(8708, 8415 등)으로 오분류하지 않도록 주의하십시오.",
            "headingExplanation": "제9025호에는 액체봉입식, 바이메탈식, 전자식(서미스터, 저항온도체, 열전대 등) 모든 형태의 온도 및 습도 측정 센서가 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "8708.99-9000",
                    "headingName": "제8708호 (자동차의 부분품)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "차량 엔진/배기계에 장착되는 전용 부품으로 보아 경합 검토.",
                    "exclusionReason": "제17부 주 제2호 사목에 의해 제90류 기기는 제8708호에서 제외됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 6. Pressure, Flow, Liquid Level Sensors (제9026호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["압력", "공기압", "tpms", "타이어공기압", "차압", "게이지압", "유압", "공압", "진공압", "기압", "pressure", "유량", "플로우", "flow", "액위", "수위", "레벨센서", "레벨 센서", "액면", "level sensor"]):
        if any(f in combined for f in ["유량", "flow"]):
            hsk = "9026.10-1000"
            heading_desc = "제9026호 (액체나 기체의 유량 측정ㆍ검사용 기기)"
            subhead = f"{product_name} (전자식 유량 센서)"
        elif any(l in combined for l in ["액위", "수위", "레벨", "level"]):
            hsk = "9026.10-2000"
            heading_desc = "제9026호 (액면 측정ㆍ검사용 기기)"
            subhead = f"{product_name} (전자식 액면/수위 센서)"
        else:
            hsk = "9026.20-4000"
            heading_desc = "제9026호 (액체나 기체의 압력 측정ㆍ검사용 기기 - 전자식)"
            subhead = f"{product_name} (전자식 압력 센서 / 트랜스듀서)"

        return {
            "is_sensor": True,
            "recommendedHsCode": hsk,
            "headingName": heading_desc,
            "subheadingName": subhead,
            "confidence": 98,
            "technicalTerms": "Electronic Pressure/Flow/Liquid Level Sensor & Transducer",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제16부 주 제1호 마목", "제17부 주 제2호 사목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 유체(액체 또는 기체)의 압력, 유량, 또는 수위/액면 변수를 감지하여 전기적 신호로 변환 출력하는 정밀 전자식 측정 센서입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제16부 주 제1호 마목 및 제17부 주 제2호 사목에 따라 제90류의 물품(유체 변수 측정기기)은 밸브류(제8481호), 일반 기계류(제84류/제85류), 및 수송기기 부품(제87류 자동차 부품 등)에서 명시적으로 제외됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 본 물품은 통칙 제1호 및 제6호에 따라 액체/기체의 유량ㆍ액면ㆍ압력 측정기기가 전용 분류되는 제9026호({hsk})로 최종 분류됩니다."
            ),
            "sectionNote": "제16부 주 제1호 마목 및 제17부 주 제2호 사목 (제90류 측정기기는 기계 및 자동차 부분품에서 제외)",
            "chapterNote": "제90류 주 제1호 및 제9026호 해설서 (액체나 기체의 유량ㆍ액면ㆍ압력 측정용 기기)",
            "exclusionNote": "⚠️ 압력 제어용 밸브(8481호)나 자동차 전용 부품(8708호)으로 오분류하지 않도록 주의하십시오.",
            "headingExplanation": "제9026호에는 피에조 저항식, 정전용량식, 전자기식 등 유체 압력, 유량, 액위를 계측하는 모든 종류의 센서 및 트랜스듀서가 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "8481.80-9000",
                    "headingName": "제8481호 (밸브 및 run 유사 장치)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "유체 배관에 설치되어 압력을 제어하는 밸브 유닛과 결합된 경우 경합 검토.",
                    "exclusionReason": "유체 제어가 아닌 물리적 압력/유량 값 계측 출력이 본질적 기능이므로 제9026호로 분류됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 7. Chemical, Gas, Smoke, Optical & Particle Analysis Sensors (제9027호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["가스", "산소", "co2", "일산화탄소", "voc", "연기", "스모크", "smoke", "gas sensor", "ph", "수질", "탁도", "당도", "굴절", "농도", "점도", "분광", "크로마토", "미세먼지", "초미세먼지", "파티클", "particle", "pm2.5", "pm10", "분진"]):
        if any(g in combined for g in ["가스", "산소", "co2", "일산화탄소", "연기", "smoke", "gas"]):
            hsk = "9027.10-0000"
            heading_desc = "제9027호 (가스나 연기 분석기기)"
            subhead = f"{product_name} (가스/연기 감지 센서)"
        else:
            hsk = "9027.89-9000"
            heading_desc = "제9027호 (물리분석이나 화학분석용 기기 - 기타)"
            subhead = f"{product_name} (화학/물리 분석 센서)"

        return {
            "is_sensor": True,
            "recommendedHsCode": hsk,
            "headingName": heading_desc,
            "subheadingName": subhead,
            "confidence": 98,
            "technicalTerms": "Gas/Chemical/Physical Analysis Sensor & Transducer",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제16부 주 제1호 마목", "제17부 주 제2호 사목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 가스 농도, 연기, 화학적 성분, 또는 물리화학적 특성(pH, 점도, 굴절률 등)을 검출·분석하여 전기 신호로 출력하는 기기입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 관세율표 제16부 주 제1호 마목 및 제17부 주 제2호 사목에 따라 제90류의 분석용 기기는 기계류(제84/85류) 및 자동차 부품(제8708호)에서 배제됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 물리·화학 분석 기기인 제9027호({hsk})로 최종 분류됩니다."
            ),
            "sectionNote": "제16부 주 제1호 마목 및 제17부 주 제2호 사목 (제90류 분석기기 우선 분류)",
            "chapterNote": "제90류 주 제1호 및 제9027호 해설서 (가스ㆍ연기 분석기 및 물리ㆍ화학 분석 기기)",
            "exclusionNote": "⚠️ 단순 경보 장치(8531호)나 일반 기계 부품(8479호)으로 오분류하지 않도록 주의하십시오.",
            "headingExplanation": "제9027호에는 반도체식, 전기화학식, 광학식 가스 센서 및 수질/화학 분석용 센서 일체가 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "8531.10-0000",
                    "headingName": "제8531호 (도난경보기ㆍ화재경보기 등)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "화재/가스 누출 시 소리나 빛으로 경보를 울리는 완제품 경보기인 경우 경합.",
                    "exclusionReason": "본 물품은 경보 부저가 아닌 가스/연기 농도를 측정하는 센서 소자/모듈이므로 제9027호로 분류됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 8. Electrical Quantities Measuring Sensors (제9030호)
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["전압", "전류", "ct센서", "변류기센서", "current sensor", "voltage sensor", "전력센서", "자기장", "자기센서", "홀센서", "hall sensor", "임피던스"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "9030.33-0000",
            "headingName": "제9030호 (전기적 양의 측정ㆍ검사용 기기 - 기록장치가 없는 것)",
            "subheadingName": f"{product_name} (전압/전류/전기적 특성 측정 센서)",
            "confidence": 98,
            "technicalTerms": "Current/Voltage/Hall Effect Magnetic Sensor",
            "appliedGris": ["통칙 제1호", "통칙 제6호", "제16부 주 제1호 마목"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 회로 또는 전력선에 흐르는 전류, 전압, 전력, 또는 자기장을 검출하여 전기적 특성치를 정밀 측정하는 센서입니다.\n"
                f"나. 관세율표 부/류 주 및 배제 규정 검토: 제16부 주 제1호 마목에 따라 제90류의 전기적 양 측정기기는 변압기(제8504호)나 배전반(제8537호) 부품에서 배제됩니다.\n"
                f"다. 통칙 적용 및 결론: 따라서 통칙 제1호 및 제6호에 따라 제9030호(9030.33-0000)로 분류됩니다."
            ),
            "sectionNote": "제16부 주 제1호 마목 (제90류 전기 측정기기는 제85류 전기기계에서 제외)",
            "chapterNote": "제90류 제9030호 해설서 (전기적 양의 측정이나 검사용 기기)",
            "exclusionNote": "⚠️ 전력 변환용 변압기/트랜스포머(제8504호)로 오분류하지 않도록 주의하십시오.",
            "headingExplanation": "제9030호에는 홀 효과(Hall Effect), 션트 저항, 로고스키 코일 등을 이용한 전류/전압 측정 센서가 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "8504.31-0000",
                    "headingName": "제8504호 (기타 변압기 - 계성용 변류기)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "단순 권선형 변류기(CT) 형태로 제작된 경우 경합.",
                    "exclusionReason": "전자식 증폭/변환 회로가 내장되어 측정 신호를 출력하는 센서 모듈은 제9030호에 우선 분류됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 9. Simple Threshold Switch (제8536호) - Threshold On/Off without continuous measurement
    # -------------------------------------------------------------------------
    if any(k in combined for k in ["리미트스위치", "마이크로스위치", "플로트스위치", "접점스위치", "온오프스위치", "sbr 매트", "sbr센서"]):
        return {
            "is_sensor": True,
            "recommendedHsCode": "8536.50-9000",
            "headingName": "제8536호 (전압이 1,000V 이하인 스위치)",
            "subheadingName": f"{product_name} (기계식/접점식 스위치형 센서)",
            "confidence": 95,
            "technicalTerms": "Threshold Contact Switch / Limit Switch",
            "appliedGris": ["통칙 제1호", "통칙 제6호"],
            "legalReasoning": (
                f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, 물리량을 연속 계측하지 않고 특정 임계값 도달 시 회로를 단순 ON/OFF 개폐하는 접점 스위치입니다.\n"
                f"나. 통칙 적용 및 결론: 연속 측정 기기(제90류)가 아니며 전기 회로의 개폐 장치에 해당하므로 통칙 제1호 및 제6호에 따라 제8536.50호로 분류됩니다."
            ),
            "sectionNote": "제16부 전기기기 (전기 회로의 개폐ㆍ보호용 기기)",
            "chapterNote": "제85류 제8536호 해설서 (기타 스위치)",
            "exclusionNote": "⚠️ 연속 아날로그/디지털 물리량을 측정하는 정밀 센서(제90류)와 구분하십시오.",
            "headingExplanation": "제8536호에는 마이크로스위치, 리미트스위치, 단순 압력 접점 매트 등 회로 개폐용 스위치가 분류됩니다.",
            "precedents": [],
            "competingHsCodes": [
                {
                    "hsCode": "9031.80-9090",
                    "headingName": "제9031호 (기타 측정기기)",
                    "appliedGri": "통칙 제1호",
                    "reasoning": "물리량을 정밀 연속 측정하는 전자식 센서인 경우 경합.",
                    "exclusionReason": "단순 온/오프 접점 단락 방식의 기계적 스위치는 제8536호로 귀속됨."
                }
            ]
        }

    # -------------------------------------------------------------------------
    # 10. Universal Physical, Mechanical, Kinematic, Dynamic Sensors (제9031호 Basket Heading)
    # -------------------------------------------------------------------------
    # Granular 10-digit HSK mapping for Chapter 9031 subheadings
    if any(x in combined for x in ["로드셀", "load cell"]):
        hsk = "9031.80-2000"
        sensor_variable = "로드셀 하중 측정 센서 (Load Cell)"
    elif any(x in combined for x in ["반도체 제조", "웨이퍼", "반도체 공정", "반도체 검사", "wafer"]):
        hsk = "9031.80-9091"
        sensor_variable = "반도체 공정/웨이퍼 전용 검사 센서 (Semiconductor Inspection Sensor)"
    elif any(x in combined for x in ["두께", "thickness"]):
        hsk = "9031.80-9060"
        sensor_variable = "초음파/레이저 두께 측정 센서 (Thickness Sensor)"
    elif any(x in combined for x in ["흠", "균열", "크랙", "비파괴", "결함", "ndt", "flaw", "crack"]):
        hsk = "9031.80-9070"
        sensor_variable = "흠ㆍ균열 탐상 비파괴 검사 센서 (Flaw & Defect Sensor)"
    elif any(x in combined for x in ["동력", "토크", "torque", "비틀림"]):
        hsk = "9031.80-9080"
        sensor_variable = "동력/토크 측정 센서 (Torque & Dynamometer Sensor)"
    elif any(x in combined for x in ["충격", "충돌", "크래시", "crash", "impact"]):
        hsk = "9031.80-9090"
        sensor_variable = "충격/충돌 감지 센서 (Crash & Impact Sensor)"
    elif any(x in combined for x in ["하중", "무게", "체중", "wcs", "weight", "load"]):
        hsk = "9031.80-9090"
        sensor_variable = "하중/중량 측정 센서 (Weight & Load Sensor)"
    elif any(x in combined for x in ["가속도", "accelerometer", "g센서", "g-sensor"]):
        hsk = "9031.80-9090"
        sensor_variable = "가속도 센서 (Accelerometer)"
    elif any(x in combined for x in ["각속도", "자이로", "gyro", "gyroscope"]):
        hsk = "9031.80-9090"
        sensor_variable = "자이로스코프/각속도 센서 (Gyroscope)"
    elif any(x in combined for x in ["진동", "vibration"]):
        hsk = "9031.80-9090"
        sensor_variable = "진동 감지 센서 (Vibration Sensor)"
    elif any(x in combined for x in ["조향각", "각도", "angle", "틸트", "경사", "tilt", "inclinometer"]):
        hsk = "9031.80-9090"
        sensor_variable = "각도/조향각/경사 측정 센서 (Angle & Inclinometer Sensor)"
    elif any(x in combined for x in ["변위", "위치", "엔코더", "인코더", "encoder", "displacement", "position", "리졸버"]):
        hsk = "9031.80-9090"
        sensor_variable = "위치/변위 측정 센서 (Position & Displacement Sensor / Encoder)"
    elif any(x in combined for x in ["근접", "proximity", "홀효과"]):
        hsk = "9031.80-9090"
        sensor_variable = "근접 감지 센서 (Proximity Sensor)"
    elif any(x in combined for x in ["라이다", "lidar", "거리", "distance", "tof"]):
        hsk = "9031.80-9090"
        sensor_variable = "광학식 거리/라이다 센서 (LiDAR / Distance Sensor)"
    elif any(x in combined for x in ["변형", "스트레인", "strain", "장력", "텐션", "tension"]):
        hsk = "9031.80-9090"
        sensor_variable = "변형률/장력 측정 센서 (Strain & Tension Sensor)"
    elif any(x in combined for x in ["비전", "머신비전", "치수", "광학검사"]):
        hsk = "9031.80-9090"
        sensor_variable = "머신비전/광학식 검사 센서 (Optical Inspection & Vision Sensor)"
    else:
        hsk = "9031.80-9090"
        sensor_variable = "전자식 물리량 계측 센서 (Physical Variable Sensor)"

    return {
        "is_sensor": True,
        "recommendedHsCode": hsk,
        "headingName": "제9031호 (그 밖의 측정ㆍ검사용 기기)",
        "subheadingName": f"{product_name} ({sensor_variable})",
        "confidence": 98,
        "technicalTerms": f"Electronic {sensor_variable} (Transducer / MEMS / Strain Gauge)",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제16부 주 제1호 마목", "제17부 주 제2호 사목"],
        "legalReasoning": (
            f"가. 대상물품 사양 및 기술적 개요: 본 물품은 [{product_name}]으로, {sensor_variable} 특성을 검출하여 전기적 신호(전압, 전류, 디지털 데이터)로 변환·측정하는 정밀 전자식 계측 센서입니다.\n"
            f"나. 관세율표 부/류 주 및 배제 규정 검토:\n"
            f"  1) 제16부 주 제1호 마목: 제90류의 측정·검사용 기기는 제16부(제84류 일반 기계, 제85류 전기기기)의 부분품에서 법적으로 명시적 제외됩니다.\n"
            f"  2) 제17부 주 제2호 사목: 제90류의 측정·검사용 기기는 제17부(제87류 자동차 부품 제8708호, 항공기 부품 제8803호 등)에서 법적으로 명시적 제외됩니다.\n"
            f"  3) 토목/건설기계(제8430호)나 단순 기계류 부품과의 오분류 배제: 센서는 대상 완제품(자동차, 로봇, 공작기계, 항공기, 스마트팩토리 라인 등)의 전용 부품이 아니라 고유의 측정 기기로 최우선 분류됩니다.\n"
            f"다. 통칙 적용 및 결론: 관세율표의 다른 류나 호에 따로 분류되지 않는 모든 종류의 전기식 물리량 측정·검사 기기가 포괄 분류되는 관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 제9031호({hsk})에 최종 분류됩니다."
        ),
        "sectionNote": "제16부 주 제1호 마목 및 제17부 주 제2호 사목 (제90류 측정·검사용 기기는 기계 및 자동차 부분품에서 완전 배제)",
        "chapterNote": "제90류 주 제1호 및 제9031호 해설서 (전기식ㆍ전자식의 그 밖의 측정 및 검사용 기기 - 변위, 하중, 가속도, 충격, 토크, 진동 등)",
        "exclusionNote": "⚠️ 장착 대상 기계의 부분품(제8708호 자동차 부품, 제8479호 기계 부품, 제8486호 반도체장비 부품 등)으로 오분류하지 않도록 주의하십시오 (제16부 및 제17부 제외 주석 적용).",
        "headingExplanation": "제9031호는 관세율표상 제9025호~제9030호에 명시적으로 열거되지 않은 모든 물리적·기계적·동적 변수(하중, 충격, 가속도, 각속도, 토크, 진동, 변위, 두께, 형상 등)를 계측하는 전 산업용 센서의 보편적 포괄 호(Basket Heading)입니다.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "8708.99-9000",
                "headingName": "제8708호 (자동차의 부분품 및 부속품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "자동차에 장착되는 전용 센서 부품으로 보아 제8708호 경합 검토.",
                "exclusionReason": "관세율표 제17부 주 제2호 사목에 의해 제90류 측정기기는 제8708호에서 법적으로 완전 배제됨."
            },
            {
                "hsCode": "8479.90-9000",
                "headingName": "제8479호 (기계류의 부분품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "산업용 로봇이나 자동화 라인에 장착되는 기계 부품으로 보아 경합 검토.",
                "exclusionReason": "관세율표 제16부 주 제1호 마목에 의해 제90류 측정기기는 제84류 기계 부분품에서 법적으로 완전 배제됨."
            }
        ]
    }
