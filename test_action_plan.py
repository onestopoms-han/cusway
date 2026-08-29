import unittest
from action_plan_service import process_external_data, calculate_authority_flow_rate
import datetime

class TestActionPlanService(unittest.TestCase):
    def setUp(self):
        # 테스트에 사용할 기준 시간 설정
        self.current_time = datetime.datetime.now().isoformat()

    def test_successful_processing(self):
        """정상적인 데이터 입력 시 성공적으로 처리되는지 확인합니다."""
        valid_data = {
            'risk_score': 50,
            'time_data': {'duration': 120},
            'timestamp_applied': '2026-08-10T10:00:00Z',
            'authority_flow_rate': 1.5,
            'api_call_status': 'OK'
        }
        result = process_external_data(valid_data, self.current_time)
        self.assertEqual(result['status'], 'VALID')
        self.assertIn('authority_flow_rate', result)

        final_rate = calculate_authority_flow_rate(result, self.current_time)
        # risk_score 50 이하이므로 최종 배율은 그대로여야 함 (1.5)
        self.assertAlmostEqual(final_rate, 1.5)


    def test_edge_case_data_mismatch_and_nulls(self):
        """Edge Case 3: 필수 필드 누락 및 잘못된 타입 입력 시 안전한 실패를 확인합니다."""
        # 필수 필드 누락 (KeyError 유발 예상)
        incomplete_data = {
            'risk_score': 60,
            'time_data': {'duration': 120}
            # timestamp_applied 누락
        }
        result = process_external_data(incomplete_data, self.current_time)
        self.assertIn('error', result)
        self.assertEqual(result['authority_flow_rate'], 0.0)

        # 잘못된 타입 입력 (TypeError 유발 예상)
        invalid_data = {
            'risk_score': "high", # 문자열 대신 float/int 기대
            'time_data': {'duration': 120},
            'timestamp_applied': '2026-08-10T10:00:00Z',
            'authority_flow_rate': 1.5,
        }
        result_type = process_external_data(invalid_data, self.current_time)
        self.assertIn('error', result_type)
        self.assertEqual(result_type['authority_flow_rate'], 0.0)


    def test_edge_case_regulatory_shift(self):
        """Edge Case 1: 법규 변동성 시나리오 (과거 데이터 사용 확인)."""
        stale_data = {
            'risk_score': 80,
            'time_data': {'duration': 120},
            'timestamp_applied': '2026-08-05T00:00:00Z', # 과거 적용 시점
            'authority_flow_rate': 2.0,
            'api_call_status': 'OK'
        }
        # 현재 시간은 미래이므로 Stale Data 플래그가 발생해야 함
        future_time = datetime.datetime.now().isoformat()

        result = process_external_data(stale_data, future_time)
        self.assertEqual(result['status'], 'STALE_DATA') # Stale 데이터 플래그 확인

        final_rate = calculate_authority_flow_rate(result, future_time)
        # 시간 비교 로직에 따라 기존 값 사용 (안정성 확보)
        self.assertAlmostEqual(final_rate, 2.0)


    def test_edge_case_rate_limit(self):
        """Edge Case 2: Rate Limit 발생 시 안전하게 0.0 반환을 확인합니다."""
        rate_limited_data = {
            'risk_score': 30,
            'time_data': {'duration': 60},
            'timestamp_applied': '2026-08-10T10:00:00Z',
            'authority_flow_rate': 1.0,
            'api_call_status': 'RATE_LIMITED' # Rate Limit 플래그 설정
        }
        result = process_external_data(rate_limited_data, self.current_time)
        self.assertEqual(result['error_code'], 'API_RATE_LIMIT')
        self.assertEqual(result['authority_flow_rate'], 0.0)

        final_rate = calculate_authority_flow_rate(result, self.current_time)
        # Rate Limit 발생 시 최종 계산도 0.0이 되어야 함
        self.assertEqual(final_rate, 0.0)

if __name__ == '__main__':
    unittest.main()