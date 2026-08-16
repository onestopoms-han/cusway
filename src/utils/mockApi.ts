/**
 * Mock API 엔드포인트 및 데이터 시뮬레이션 모듈. E2E 테스트를 위한 환경을 제공합니다.
 */

// Mock 데이터 정의
const mockFlowData = {
    'flow-123': { rate: 0.85, riskLevel: 'RED', message: "High risk detected in flow.", step: 'STEP_2' },
    'flow-456': { rate: 0.30, riskLevel: 'GREEN', message: "Low risk, smooth transition.", step: 'STEP_1' },
    // 실패 시나리오를 위한 더미 데이터
};

/**
 * Mock API 함수: 실제 네트워크 요청을 대체합니다.
 * @param flowId 조회할 플로우 ID
 * @returns DashboardApiResponse 형태의 Promise
 */
export const mockFetchAuthorityFlowData = async (flowId: string): Promise<any> => {
    console.log(`[MockAPI] Fetching data for ${flowId}...`);

    if (flowId === 'flow-123') {
        // 성공 케이스 시뮬레이션
        return { flowId, rate: 0.85, riskLevel: 'RED', message: "High risk detected in flow.", step: 'STEP_2' };
    } else if (flowId === 'flow-456') {
        // 성공 케이스 시뮬레이션
        return { flowId, rate: 0.30, riskLevel: 'GREEN', message: "Low risk, smooth transition.", step: 'STEP_1' };
    } else if (flowId === 'fail-404') {
        // 실패 케이스 시뮬레이션 (API 호출 실패)
        throw new Error("Network Timeout or 404 Not Found");
    } else {
        // 존재하지 않는 ID 시뮬레이션
        return null; // 데이터 누락 시나리오
    }
};

// 테스트용으로 사용할 함수 (실제로는 이 모듈을 Mocking 프레임워크로 대체할 수 있음)
export const mockCalculateSafeDefault = (input: any, defaults: any): any => {
    // 실제 로직은 src/utils/safeDefaults.ts에서 가져오지만, 테스트를 위해 여기서도 정의합니다.
    if (!input) return { rate: defaults.rate, riskLevel: defaults.riskLevel, message: `No data received. Defaulted to ${defaults.rate}` };
    return { rate: input.rate, riskLevel: input.riskLevel, message: "Data retrieved successfully." };
};