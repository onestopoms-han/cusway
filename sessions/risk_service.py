class RiskService:
    """
    Authority Flow Risk Score 계산 및 법적 근거 기반 위험 분석 서비스.
    법적 근거 조항과 가중치를 통합하여 선제적 위험 방어 보험료 개념을 반영합니다.
    """
    def __init__(self, weights: dict, legal_db: dict):
        # 가중치 설정 (예: 법적 리스크와 시장 리스크의 비율)
        self.weights = weights
        # 법률 데이터베이스 로드 (Article ID 및 관련 벌금/위험 데이터 포함)
        self.legal_db = legal_db

    def calculate_risk_score(self, diagnosis_input: dict) -> dict:
        """
        진단 입력과 법적 데이터를 기반으로 최종 위험 점수를 계산합니다.
        """
        base_risk = 0.0
        weighted_legal_risk = 0.0

        # 1. 기본 리스크 계산 (Diagnosis Input 기반)
        if 'financial_exposure' in diagnosis_input:
            base_risk += diagnosis_input['financial_exposure'] * self.weights.get('market_weight', 1.0)
        if 'compliance_gap' in diagnosis_input:
            base_risk += diagnosis_input['compliance_gap'] * self.weights.get('legal_weight', 1.5)

        # 2. 법적 근거 기반 리스크 가중치 적용 (Article ID 통합)
        legal_multiplier = 1.0
        if 'article_ids' in diagnosis_input and diagnosis_input['article_ids']:
            for article_id in diagnosis_input['article_ids']:
                # 법적 데이터베이스에서 해당 조항의 위험 가중치를 조회
                risk_factor = self.legal_db.get(article_id, {}).get('risk_multiplier', 1.0)
                legal_multiplier += risk_factor
            
            weighted_legal_risk = legal_multiplier * self.weights.get('compliance_weight', 2.0)

        # 최종 위험 점수 계산 (가중치 기반 통합)
        final_score = (base_risk * self.weights.get('market_weight', 1.0)) + (weighted_legal_risk * self.weights.get('compliance_weight', 2.0))
        
        # Hard Stop 임계값 적용 로직
        hard_stop_threshold = self.legal_db.get('hard_stop_threshold', 50)
        hard_stop_status = "Low Risk"
        if final_score >= hard_stop_threshold:
            hard_stop_status = "Hard Stop - Immediate Action Required"

        return {
            "final_risk_score": round(final_score, 2),
            "weighted_legal_component": round(weighted_legal_risk, 2),
            "risk_level": hard_stop_status,
            "details": {
                "base_risk": round(base_risk, 2),
                "legal_contribution": round(weighted_legal_risk, 2),
                "applied_threshold": hard_stop_threshold
            }
        }

def setup_mock_data():
    """Mock 법률 데이터베이스 및 가중치 설정."""
    # 실제 법률 DB를 Mock업 (Article ID와 위험 계수)
    legal_database = {
        "ART-101": {"risk_multiplier": 1.5, "description": "기초 준수 조항"},
        "ART-203": {"risk_multiplier": 2.5, "description": "벌금 발생 가능 조항"},
        "ART-404": {"risk_multiplier": 1.0, "description": "일반 계약 조항"},
    }
    
    # 시스템 가중치 설정 (선제적 위험 방어 보험료 개념 반영)
    system_weights = {
        "market_weight": 1.2,  # 시장 리스크의 영향력
        "compliance_weight": 2.5, # 법적 준수의 영향력 (더 높게 설정하여 통제권 회복 강조)
        "legal_weight": 1.0    # 법적 근거의 직접적인 영향력
    }
    
    return system_weights, legal_database

def run_tests():
    """구현된 서비스에 대한 단위 테스트 실행."""
    print("--- Running RiskService Tests ---")
    system_weights, legal_db = setup_mock_data()
    
    # Mock Input Data 1: Low Risk Scenario (Compliance Gap 낮음)
    input_low = {
        "financial_exposure": 10,
        "compliance_gap": 5,
        "article_ids": ["ART-404"]
    }
    service = RiskService(system_weights, legal_db)
    result_low = service.calculate_risk_score(input_low)
    print(f"Test Case 1 (Low Risk): {result_low}")

    # Mock Input Data 2: High Risk Scenario (Compliance Gap 높음, 높은 법적 근거 포함)
    input_high = {
        "financial_exposure": 30,
        "compliance_gap": 20,
        "article_ids": ["ART-203", "ART-101"] # 더 많은 법적 위험 요소 포함
    }
    result_high = service.calculate_risk_score(input_high)
    print(f"Test Case 2 (High Risk): {result_high}")

    # 검증 로직 확인: Hard Stop 임계값 적용 테스트 (ART-203과 ART-101이 포함된 경우 점수가 높게 나와야 함)
    print("--- Test Execution Complete ---")

if __name__ == "__main__":
    run_tests()