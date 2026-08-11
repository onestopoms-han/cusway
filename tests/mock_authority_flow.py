from typing import List, Dict, Any
import json

# Mock Data Setup
MOCK_INITIAL_RISK = 85  # Initial high risk score
MOCK_RULES = {
    "Rule_1": "84.84 Gaskets and similar joints of metal sheeting combined",
    "Rule_2": "85.01 - 전동기와 발전기(발전세트는 제외한다)",
    "Rule_3": "Chapter 85: Electrical machinery and equipment and parts the",
}

def simulate_authority_flow(initial_risk: int) -> Dict[str, Any]:
    """
    Authority Flow를 시뮬레이션하여 위험 점수 감소 경로와 최종 규칙을 반환합니다.
    """
    if initial_risk < 0:
        raise ValueError("Risk score cannot be negative.")

    # 1. 트래킹 데이터 배열 생성 (점수 감소 시뮬레이션)
    tracking_data = []
    current_risk = initial_risk
    
    # 경로 시뮬레이션 (가정된 논리적 분기)
    path_steps = [
        {"step": 1, "rule_applied": MOCK_RULES["Rule_1"], "risk_after": current_risk - 10},
        {"step": 2, "rule_applied": MOCK_RULES["Rule_2"], "risk_after": current_risk - 25},
        {"step": 3, "rule_applied": MOCK_RULES["Rule_3"], "risk_after": current_risk - 40},
    ]
    tracking_data.extend(path_steps)

    # 최종 결과 계산 (가장 낮은 점수 또는 최종 규칙 기반)
    final_risk = max(0, current_risk - 60) # 최종적으로 최소 위험도 도달 시뮬레이션
    
    return {
        "initial_risk_score": initial_risk,
        "tracking_history": tracking_data,
        "final_rule_citation": MOCK_RULES["Rule_3"], # 최종 결정에 영향을 미친 규칙 인용
        "final_risk_level": final_risk
    }

def get_authority_flow_response(input_risk: int) -> Dict[str, Any]:
    """
    API 응답을 위한 최종 래퍼 함수.
    """
    try:
        result = simulate_authority_flow(input_risk)
        return {
            "status": "success",
            "data": result
        }
    except ValueError as e:
        return {
            "status": "error",
            "message": str(e)
        }

# --- Mock API Endpoint Simulation (FastAPI/Flask style simulation) ---
def handle_authority_flow_request(risk_score: int) -> Dict[str, Any]:
    """
    실제 API 요청을 시뮬레이션하는 핸들러.
    """
    print(f"--- Authority Flow Request Received for Risk Score: {risk_score} ---")
    response = get_authority_flow_response(risk_score)
    return response

if __name__ == "__main__":
    # 테스트 실행 예시 (실제 API 호출 대신 로컬 실행)
    test_result = handle_authority_flow_request(MOCK_INITIAL_RISK)
    print("\n--- Simulation Result ---")
    print(json.dumps(test_result, indent=2, ensure_ascii=False))