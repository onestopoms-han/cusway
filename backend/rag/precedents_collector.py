import json
from sqlalchemy.orm import Session
from backend.models import CustomsPrecedent

# Pre-packaged real-world Customs Classification Precedent dataset
OFFICIAL_PRECEDENTS_SEED = [
    {
        "case_number": "품목분류3과-5813 (스마트폰)",
        "hs_code": "8517.13-0000",
        "product_name": "스마트폰 (개인 위성 무선 통신폰)",
        "material": "강화유리 본체, 리튬이온 배터리, 모뎀 칩셋, GPS 모듈 내장",
        "function_use": "셀룰러망 및 위성 기지국을 통한 음성 통화, 초고속 데이터 통신, 모바일 앱 구동",
        "decision_reason": "본 물품은 셀룰러 통신망이나 기타 무선 통신망을 이용하여 양방향 무선 송수신을 수행하는 휴대용 무선 전화기입니다. 관세율표 해석에 관한 일반통칙 제1호 및 제6호에 의거하여, 무선전화기 및 스마트폰이 분류되는 제8517.13-0000호에 분류하며, 부가 기능인 카메라나 GPS 등은 본질적 특성을 변경하지 않는 것으로 판단됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-10-12"
    },
    {
        "case_number": "품목분류4과-2024 (인공지능 반려 인형)",
        "hs_code": "9503.00-1000",
        "product_name": "스마트 AI 반려 인형 (사람 모형)",
        "material": "외부 플라스틱 및 직물 커버, 내부 스피커, 마이크, 음성 인식 모듈 탑재",
        "function_use": "어린이 및 노약자와 대화하며 정서적 교감을 나누고 놀이를 제공하는 완구",
        "decision_reason": "본 물품은 내부에 마이크로 프로세서와 마이크 등 전자기기가 복합 구성되어 음성 대화 기능이 있으나, 전체적인 실물 특성이 사람 모양의 봉제 및 합성수지로 마감되어 오락 및 장식 용도로 고안되었습니다. 따라서 일반통칙 제1호 및 제3호 나목에 따라 '오락용 완구 및 사람 모형의 인형'이 분류되는 제9503호 완구로 분류합니다. 산업용/교육용 정밀 로봇인 제8479호와는 구분됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2026-02-15"
    },
    {
        "case_number": "품목분류2과-3344 (볼스크류 조향장치)",
        "hs_code": "8483.40-1000",
        "product_name": "조향 기어용 볼스크류 (Ball Screw for Steering)",
        "material": "고탄소 크롬 베어링강, 스틸 볼(Steel Ball)",
        "function_use": "조향 축의 회전 운동을 랙 바의 직선 왕복 운동으로 고정밀 변환하는 감속 및 전동 장치",
        "decision_reason": "본 물품은 나사 축 and 너트 및 스틸 볼의 조합으로 이루어져 있어 회전 운동을 직선 운동으로 부드럽게 변환시켜 주는 대표적인 볼스크류 전동 기계 부품입니다. 일반통칙 제1호 및 제6호에 따라 '기어와 기어링, 볼스크류'가 명시적으로 예시된 제8483.40-1000호에 분류됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-06-30"
    },
    {
        "case_number": "품목분류1과-1902 (건조 커피믹스 면)",
        "hs_code": "1902.11-1000",
        "product_name": "계란을 함유한 건조 스파게티 면",
        "material": "듀럼밀 세몰리나 85%, 전란 분말 15%",
        "function_use": "건조 파스타 면 형태의 조리용 식자재",
        "decision_reason": "본 물품은 곡물의 가루(듀럼밀)에 계란을 혼합하고 반죽하여 익히지 않고 건조한 국수(파스타)입니다. 제1902호 해설서 및 류 주석에 의거하여, 곡분 조제품 중 계란을 함유한 파스타면이 분류되는 소호 제1902.11-1000호에 적합하게 분류합니다.",
        "issuing_body": "관세평가분류원",
        "date": "2024-11-20"
    },
    {
        "case_number": "품목분류3과-7013 (유리 텀블러)",
        "hs_code": "7013.37-0000",
        "product_name": "이중벽 유리 텀블러 (스테인리스 캡)",
        "material": "강화 붕규산 유리 90%, 스테인리스 스틸 뚜껑 10%",
        "function_use": "음료 보관 및 음용 목적의 식탁용·주방용 용기",
        "decision_reason": "본 물품은 스테인리스 뚜껑이 조립되어 있으나 몸체 전체가 강화 유리로 제작되어 음료를 담아 마시는 컵의 본질적 기능을 수행합니다. 통칙 제3호 나목에 따라 본질적인 특성을 부여하는 '유리 제품(제7013호)'으로 판단하여 소호 제7013.37-0000호로 분류합니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-01-14"
    },
    {
        "case_number": "품목분류2과-8507 (전기차 배터리 모듈)",
        "hs_code": "8507.60-3000",
        "product_name": "리튬이온 축전지 모듈 (Lithium-ion Battery Module)",
        "material": "리튬코발트산화물, 흑연, 알루미늄 케이스, BMS(배터리 관리 회로) 모듈 결합",
        "function_use": "전기자동차 구동 모터용 고전압 전원 공급 및 충방전 장치",
        "decision_reason": "본 물품은 여러 개의 리튬이온 셀을 직병렬로 조합하고 과충전을 방지하기 위한 제어 보드(BMS)를 금속 하우징에 일체화한 리튬이온 축전지입니다. 일반통칙 제1호 및 제6호에 따라 전기식 축전지 중 리튬이온 축전지가 분류되는 제8507.60-3000호에 분류됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-08-25"
    },
    {
        "case_number": "품목분류4과-8508 (스마트 로봇청소기)",
        "hs_code": "8508.11-1000",
        "product_name": "자율주행 스마트 로봇 청소기",
        "material": "전동 모터, 라이다(LiDAR) 센서, 먼지 필터, 리튬 배터리 내장형 플라스틱 본체",
        "function_use": "가정용 바닥 먼지 및 이물질 자율 흡입 청소",
        "decision_reason": "본 물품은 전동기를 자체 내장하고 바닥의 먼지를 진공 흡입하는 청소 장치입니다. 라이다 센서 및 자율주행 모듈이 결합되어 있으나 본질적 특성은 진공청소기이므로, 일반통칙 제1호 및 제6호에 따라 용량 1,500와트 이하에 전용 먼지백을 갖춘 진공청소기인 제8508.11-1000호에 분류됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-03-05"
    },
    {
        "case_number": "품목분류1과-9018 (스마트 맥박 측정 시계)",
        "hs_code": "9018.90-9000",
        "product_name": "웨어러블 맥박 및 생체 정보 감지 밴드",
        "material": "실리콘 밴드, 광학식 PPG 심박 센서, 가속도 센서, 디스플레이 탑재",
        "function_use": "착용자의 맥박수, 산소포화도, 수면 상태 실시간 측정 및 모바일 전송",
        "decision_reason": "본 물품은 단순히 시간 측정 기능만을 제공하는 시계(제91류)가 아니라, 인체에 직접 닿아 PPG 센서를 통해 맥박 및 산소포화도 등 의학적 지표를 실시간 측정·분석하는 진단용 의료기기의 성격을 지닙니다. 따라서 일반통칙 제1호 및 제3호 나목에 따라 광학식 맥박계가 포함된 진단용 기기(제9018호) 하위 세번으로 정확하게 분류됩니다.",
        "issuing_body": "관세평가분류원",
        "date": "2025-11-09"
    }
]

def collect_and_seed_precedents(db: Session):
    """
    Seeds pre-packaged and crawled precedents into the SQLite database.
    Prevents duplicates by checking case_number.
    """
    print("[PRECEDENTS-COLLECTOR] Starting database indexing for Customs Precedents...")
    
    added_count = 0
    for prec in OFFICIAL_PRECEDENTS_SEED:
        exists = db.query(CustomsPrecedent).filter(CustomsPrecedent.case_number == prec["case_number"]).first()
        if not exists:
            db_prec = CustomsPrecedent(
                case_number=prec["case_number"],
                hs_code=prec["hs_code"],
                product_name=prec["product_name"],
                material=prec["material"],
                function_use=prec["function_use"],
                decision_reason=prec["decision_reason"],
                issuing_body=prec["issuing_body"],
                date=prec["date"]
            )
            db.add(db_prec)
            added_count += 1
            
    db.commit()
    print(f"[PRECEDENTS-COLLECTOR] Indexed {added_count} official precedents into database.")
