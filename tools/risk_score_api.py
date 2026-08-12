<![CDATA[
import json
from typing import Dict, Any

class RiskScoreAPI:
    """
    Authority Flow Risk Score 계산 및 리스크 관리 API 모듈.
    법적 리스크와 시장 리스크를 가중치 기반으로 통합하여 최종 위험 점수와 행동 경로를 산출합니다.
    """

    # 권위 흐름에 따른 핵심 가중치 정의 (회사 목표 반영)
    WEIGHTS = {
        "LEGAL_WEIGHT": 0.5,  # 법적 리스크의 중요도
        "MARKET_WEIGHT": 0.3, # 시장/상업적 리스크의 중요도
        "AUTHORITY_FLOW_BONUS": 0.2, # 권위 흐름에 따른 보정 계수 (통제권 확보 노력 반영)
    }

    HARD_STOP_THRESHOLD = 75  # 이 점수 이상일 경우 자동 Hard Stop 트리거

    def __init__(self):
        pass

    def calculate_risk_score(self, legal_risk: float, market_risk: float, authority_flow_score: float) -> Dict[str, Any]:
        """
        법적 리스크, 시장 리스크, 권위 흐름 점수를 통합하여 최종 위험 점수와 행동 경로를 계산합니다.

        Args:
            legal_risk (float): 법적 리스크 점수 (0.0 ~ 100.0)
            market_risk (float): 시장/상업적 리스크 점수 (0.0 ~ 100.0)
            authority_flow_score (float): 권위 흐름 평가 점수 (0.0 ~ 100.0, 통제권 회복 노력 반영)

        Returns:
            Dict[str, Any]: 계산 결과 및 행동 지침
        """
        if not all(isinstance(x, (int, float)) for x in [legal_risk, market_risk, authority_flow_score]):
            raise ValueError("모든 입력 값은 숫자여야 합니다.")

        # 1. 가중치 기반 위험 점수 계산
        weighted_sum = (legal_risk * self.WEIGHTS["LEGAL_WEIGHT"]) + \
                       (market_risk * self.WEIGHTS["MARKET_WEIGHT"]) + \
                       (authority_flow_score * self.WEIGHTS["AUTHORITY_FLOW_BONUS"])

        # 2. 최종 점수 산출 (최대 100점)
        final_score = min(100.0, weighted_sum * 1.5) # 가중치와 보정을 통해 점수를 조정하여 최대치를 설정

        # 3. Hard Stop 기능 적용
        action_path = "Continue Analysis"
        if final_score >= self.HARD_STOP_THRESHOLD:
            action_path = "HARD STOP: 즉각적인 법적/운영 검토 필요 (Legal Review Required)"

        # 4. 권위 흐름 기반 행동 경로 제안 (Authority Flow Integration)
        if authority_flow_score < 30 and final_score > 50:
            action_path = "ACTION REQUIRED: 통제권 회복을 위한 초기 전략 수립"
        elif legal_risk > 80:
            action_path = "ACTION REQUIRED: 법적 리스크 최소화를 위한 즉각적 조치"

        result = {
            "final_risk_score": round(final_score, 2),
            "legal_component_score": round(legal_risk * self.WEIGHTS["LEGAL_WEIGHT"], 2),
            "market_component_score": round(market_risk * self.WEIGHTS["MARKET_WEIGHT"], 2),
            "authority_flow_contribution": round(authority_flow_score * self.WEIGHTS["AUTHORITY_FLOW_BONUS"], 2),
            "suggested_action": action_path,
            "status": "Success" if final_score < self.HARD_STOP_THRESHOLD else "Alert",
        }

        return result

def run_test_suite():
    """API 로직에 대한 단위 테스트 실행."""
    print("--- Running RiskScoreAPI Test Suite ---")
    api = RiskScoreAPI()
    
    # Test Case 1: Low Risk, High Authority (Ideal Scenario)
    legal1, market1, authority1 = 10.0, 20.0, 95.0
    result1 = api.calculate_risk_score(legal1, market1, authority1)
    print(f"Test Case 1 (Low Risk): {json.dumps(result1, indent=2)}")

    # Test Case 2: High Legal Risk, Low Authority (Critical Scenario)
    legal2, market2, authority2 = 90.0, 50.0, 10.0
    result2 = api.calculate_risk_score(legal2, market2, authority2)
    print(f"Test Case 2 (High Legal Risk): {json.dumps(result2, indent=2)}")

    # Test Case 3: Balanced Risk, Moderate Authority (Warning Scenario)
    legal3, market3, authority3 = 40.0, 45.0, 60.0
    result3 = api.calculate_risk_score(legal3, market3, authority3)
    print(f"Test Case 3 (Balanced Risk): {json.dumps(result3, indent=2)}")

    print("--- Test Suite Execution Complete ---")

if __name__ == "__main__":
    run_test_suite()
]]>