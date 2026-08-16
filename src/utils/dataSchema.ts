// API 응답 스키마 정의 (Dashboard_API_Response_Schema_v1.0 기반)
export interface DashboardApiResponse {
    flowId: string;
    rate: number; // 핵심 리스크 지수 (0.0 ~ 1.0)
    riskLevel: 'RED' | 'YELLOW' | 'GREEN';
    message: string;
    step: 'INIT' | 'STEP_1' | 'STEP_2' | 'COMPLETE';
}