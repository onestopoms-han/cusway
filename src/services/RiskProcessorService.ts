// src/services/RiskProcessorService.ts
import { ActionBlueprint, SafetyContext } from '../types/ActionBlueprintSchema'; // 가정된 스키마 파일 임포트

/**
 * 리스크 데이터 처리 및 안전 기본값 적용을 담당하는 서비스 레이어.
 */
export class RiskProcessorService {
    /**
     * 입력된 위험 데이터를 분석하고 시스템의 안전 로직에 따라 최종 상태와 대체 실행 계획을 결정합니다.
     * @param rawRiskData 원본 입력 데이터 (Mock Dataset 기반)
     * @param context 현재 시스템의 안전 컨텍스트 정보
     * @returns 처리된 결과 객체 (UI 표시용 데이터 포함)
     */
    public processRisk(rawRiskData: any, context: SafetyContext): { status: 'Critical' | 'Warning' | 'Safe'; action: string; message: string; visualColor: 'Red' | 'Amber' | 'Green' } {
        let status: 'Critical' | 'Warning' | 'Safe';
        let action: string;
        let message: string;
        let visualColor: 'Red' | 'Amber' | 'Green';

        // 1. Mock Dataset 기반의 핵심 로직 매핑 (규제 위반, API 실패, 경계 조건)
        if (rawRiskData.violationType === 'Critical Violation') {
            status = 'Critical';
            action = 'Freeze_All_Transactions';
            message = "🚨 Critical Risk Detected. 모든 거래는 일시 중지되었습니다. 관련 규정 준수팀에 즉시 보고하십시오.";
            visualColor = 'Red';
        } else if (rawRiskData.violationType === 'API Failure') {
            status = 'Warning';
            action = 'Apply_Safe_Default_Value';
            message = "⚠️ Data Unavailable. 실시간 데이터 연동에 일시적인 문제가 발생했습니다. 시스템은 안전 기본값을 적용하여 잠정 위험 수준을 표시하고 있습니다.";
            visualColor = 'Amber';
        } else if (rawRiskData.violationType === 'Boundary Condition Exceeded') {
            status = 'Warning';
            action = 'Apply_Safe_Default_Value'; // 경계 조건 초과 시 안전 기본값 적용
            message = "⚠️ Boundary Limit Reached. 시스템이 안전 마진을 확보했습니다. 다음 단계는 수동 검토가 필요합니다.";
            visualColor = 'Amber';
        } else {
            // 일반적인 경우 (Safe State)
            status = 'Safe';
            action = 'Continue_Normal_Flow';
            message = "✅ 시스템 안정 상태. 모든 데이터는 정상적으로 처리 중입니다.";
            visualColor = 'Green';
        }

        return { status, action, message, visualColor };
    }
}