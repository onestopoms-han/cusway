# risk_calculator.py
from typing import List, Dict, Any, Tuple
from pydantic import BaseModel, Field

# 1. 입력 데이터 스키마 정의 (Input Schema)
class RiskFactor(BaseModel):
    """단일 리스크 요인에 대한 데이터 구조."""
    factor_name: str = Field(..., description="리스크 요인의 명칭 (예: 법적 근거, 위반 정도)")
    value: float = Field(..., description="해당 요인의 정량적 값 (0.0 ~ 100.0)")
    frequency_weight: float = Field(..., description="발생 빈도 가중치 (0.1 ~ 1.0)")
    legal_article_id: str = Field(..., description="관련 법적 조항 ID")

class RiskInputData(BaseModel):
    """리스크 점수 계산을 위한 전체 입력 데이터 스키마."""
    contextual_data: Dict[str, Any] = Field(..., description="사용자 또는 상황에 대한 맥락 데이터 (예: 시장 위험도, 규제 복잡성)")
    factors: List[RiskFactor] = Field(..., description="개별 리스크 요인 목록")
    base_risk_threshold: float = Field(50.0, description="시스템 안정성을 위한 기본 임계값")

# 2. 가중치 기반 리스크 점수 산정 알고리즘 (Algorithm)
class RiskCalculator:
    """리스크 점수를 계산하고 행동 지침을 도출하는 핵심 로직 클래스."""

    def __init__(self, weights: Dict[str, float]):
        """
        가중치 맵 초기화.
        weights: 리스크 요인 유형별 가중치 (예: '법적_위반' : 3.0)
        """
        self.weights = weights

    def calculate_risk_score(self, input_data: RiskInputData) -> float:
        """
        입력 데이터를 기반으로 최종 리스크 점수를 계산합니다. (가중치 적용)
        """
        total_weighted_risk = 0.0
        
        for factor in input_data.factors:
            # 1. 기본 위험도 계산: 값 * 빈도 가중치
            base_risk = factor.value * factor.frequency_weight
            
            # 2. 법적 근거 가중치 적용 (사용자가 정의한 유형별 가중치)
            factor_type = factor.factor_name.split('_')[0] # 예: '법적_위반' -> '법적'
            weight = self.weights.get(factor_type, 1.0) # 기본값 1.0 적용
            
            weighted_risk = base_risk * weight
            total_weighted_risk += weighted_risk
        
        # 최종 점수 정규화 및 임계값 처리 (선제적 위험 방어 보험료 개념 반영)
        final_score = min(100.0, total_weighted_risk * 1.5) # 1.5배 증폭 및 최대 100점 제한
        
        return round(final_score, 2)

    def generate_actionable_blueprint(self, score: float, input_data: RiskInputData) -> Dict[str, Any]:
        """
        최종 점수에 따라 '다음 행동'과 해당 법적 조항을 매핑하여 출력합니다.
        """
        action_blueprint = {
            "score": score,
            "status": "Normal",
            "action": "모니터링 지속",
            "article_id": "N/A"
        }

        # 리스크 점수 기반 행동 로직 (Authority Flow 구현)
        if score >= input_data.base_risk_threshold * 1.5:
            action_blueprint["status"] = "Critical"
            action_blueprint["action"] = "즉각적 법적 검토 및 Hard Stop 임계값 확인"
            # 가장 심각한 리스크에 해당하는 Article ID를 매핑 (가정)
            if any(f.legal_article_id == 'Law_Violation_Critical' for f in input_data.factors):
                action_blueprint["article_id"] = "Law_Violation_Critical"
            else:
                action_blueprint["article_id"] = "Legal_Review_Required"
        elif score >= input_data.base_risk_threshold:
            action_blueprint["status"] = "Warning"
            action_blueprint["action"] = "선제적 위험 방어 보험료 검토 및 완화 조치 실행"
            action_blueprint["article_id"] = "Risk_Mitigation_Plan"
        else:
            action_blueprint["status"] = "Low"
            action_blueprint["action"] = "정상 운영 유지 및 데이터 모니터링"
            action_blueprint["article_id"] = "Compliance_Check"

        return action_blueprint

# 3. 테스트 케이스 (Test Case)
def run_test_case():
    """핵심 로직에 대한 테스트 실행."""
    print("--- 리스크 계산 로직 테스트 시작 ---")
    
    # 가중치 설정: 법적 위반이 가장 무거움
    weights = {
        "법적": 3.0,
        "시장": 2.5,
        "운영": 1.5
    }
    calculator = RiskCalculator(weights=weights)

    # 테스트 데이터 준비: 높은 리스크 시나리오
    test_input = RiskInputData(
        contextual_data={"market_volatility": 80},
        factors=[
            RiskFactor(factor_name="법적_위반", value=90.0, frequency_weight=1.0, legal_article_id="Law_Violation_Critical"),
            RiskFactor(factor_name="시장_변동성", value=75.0, frequency_weight=0.8, legal_article_id="Market_Risk_Index"),
            RiskFactor(factor_name="운영_복잡성", value=60.0, frequency_weight=1.2, legal_article_id="Operation_Complexity")
        ],
        base_risk_threshold=50.0 # 기본 임계값 설정
    )

    print(f"입력 데이터 확인: {test_input.json()}")
    
    # 1. 리스크 점수 계산 실행
    calculated_score = calculator.calculate_risk_score(test_input)
    print(f"\n[결과] 계산된 리스크 점수: {calculated_score}")

    # 2. 행동 청사진 생성 실행
    blueprint = calculator.generate_actionable_blueprint(calculated_score, test_input)
    print("\n[결과] 도출된 행동 청사진:")
    import json
    print(json.dumps(blueprint, indent=4, ensure_ascii=False))
    
    print("\n--- 테스트 완료 ---")

if __name__ == "__main__":
    run_test_case()