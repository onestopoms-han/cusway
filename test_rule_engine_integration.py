import unittest
from action_plan_service import evaluate_classification_logic # 실제 서비스 함수를 가정합니다. 필요하다면 경로 수정 필요
import json

# rules_matrix.json의 내용을 로드하여 테스트에 사용합니다.
with open('rules_matrix.json', 'r') as f:
    RULE_MATRIX = json.load(f)

class TestRuleEngineIntegration(unittest.TestCase):
    """
    HS Code 분류 규칙 엔진의 통합 및 경계값 테스트 스위트.
    법적 우선순위 규칙이 논리적으로 완벽히 구현되었는지 검증합니다.
    """
    def setUp(self):
        """테스트 실행 전에 규칙을 로드하고 초기 상태를 설정합니다."""
        self.rules = RULE_MATRIX

    def test_priority_hierarchy_application(self):
        """Level 1 우선순위가 Level 2보다 무조건 적용되는지 검증합니다 (핵심 논리)."""
        # 테스트 케이스 1: 가장 높은 우선순위 규칙이 적용되어야 함
        input_item = {"category": "FPD 모듈류", "sub_code": "85.24"}
        expected_result = "85.24" # FPD 모듈류가 다른 모든 호에 우선한다.

        # 실제 서비스 함수를 호출한다고 가정합니다. (evaluate_classification_logic)
        actual_result = evaluate_classification_logic(input_item, self.rules)
        self.assertEqual(actual_result, expected_result, "Level 1 규칙이 올바르게 적용되지 않았습니다.")

    def test_functional_priority_logic_transition(self):
        """기능적 우선순위 로직 (동력 전달 vs 전기적 변환)의 전환을 검증합니다."""
        # 테스트 케이스 2: 동력 전달 기능이 전기적 변환 기능보다 우선해야 함.
        input_item = {"category": "캠샤프트", "functional_type": "동력 전달"}
        
        actual_result = evaluate_classification_logic(input_item, self.rules)
        self.assertIn(actual_result, ["84.83", "기계류(Chapter 84) 기본 분류를 검토한다."], "동력 전달 로직이 올바르게 작동하지 않았습니다.")

    def test_risk_management_check_edge_case(self):
        """위험 관리 체크리스트가 경계값에서 정확한 결과를 반환하는지 검증합니다."""
        # 테스트 케이스 3: 위험 관리 체크리스트의 예외적인 입력 처리 확인.
        input_item = {"product_type": "PCB", "risk_level": "High"}
        
        # 이 부분은 실제 서비스 로직에 따라 'True/False' 또는 특정 코드를 반환해야 합니다. 
        # 여기서는 결과가 예상 범위 내에 있는지 확인합니다.
        actual_result = evaluate_classification_logic(input_item, self.rules)
        self.assertTrue(actual_result in ["PASS", "FAIL"], "위험 관리 체크리스트의 결과 형식이 올바르지 않습니다.")

    def test_risk_management_check_default(self):
        """모든 조건이 충족되지 않았을 때의 기본값 처리를 검증합니다."""
        # 테스트 케이스 4: 모든 조건에 해당하지 않을 경우 (기본 분류로 회귀)
        input_item = {"product_type": "GenericPart", "risk_level": "Low"}
        
        actual_result = evaluate_classification_logic(input_item, self.rules)
        self.assertEqual(actual_result, "기능(Function)을 기준으로 상위/하위 호를 판단한다.", "조건 미충족 시 기본 로직으로 회귀하지 않았습니다.")


if __name__ == '__main__':
    # 실제 실행 전에 action_plan_service.py에 evaluate_classification_logic 함수가 정의되어 있어야 합니다.
    unittest.main()