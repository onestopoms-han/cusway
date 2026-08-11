/**
 * FlowSchema v2.0: 사용자 권한 회복 경험을 위한 데이터 계약서
 * 이 스키마는 백엔드에서 제공하는 진단 결과와 프론트엔드 상태 전환에 필요한 모든 정보를 포함합니다.
 */

export type FlowStage = 'Anxiety' | 'Solution' | 'Control';

export interface FlowData {
  currentStage: FlowStage;
  riskScore: number; // 0-100 사이의 위험 점수
  valueProposition: {
    title: string;
    description: string;
    details: {
      [key: string]: any; // Premium/Pro 플랜별 차별점 데이터 포함
    };
  };
  visualTheme: {
    primaryColor: string; // 예: '#FF0000' (Anxiety), '#006D4C' (Solution)
    secondaryColor: string; // 예: '#FFD700' (Gold Link)
  };
}

export interface FlowTransitionRule {
  fromStage: FlowStage;
  toStage: FlowStage;
  condition: (data: FlowData) => boolean; // 다음 단계로 넘어가기 위한 조건 함수
  feedbackInstruction: string; // 다음 단계에서 사용자에게 제공할 핵심 메시지
}

export interface FullFlowState extends FlowData {
  transitionRules: FlowTransitionRule[];
}