import React from 'react';

// 1. 상태 및 에러 정의
export type StepStatus = 'Pending' | 'InProgress' | 'Completed' | 'Failed';

export interface StepIndicatorProps {
  steps: { id: number; name: string; status: StepStatus; required: boolean }[]; // 단계 데이터 배열
  currentStepId: number; // 현재 진행 중인 단계의 ID
  error?: string; // 단계별 오류 메시지
}

/**
 * StepIndicator 컴포넌트: 권한 흐름(Authority Flow)의 각 단계를 시각화합니다.
 */
export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStepId, error }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      {steps.map((step) => {
        const isCurrent = step.id === currentStepId;
        let statusStyle = '';

        switch (step.status) {
          case 'Completed':
            statusStyle = 'background-color: #4CAF50; color: white;'; // Green
            break;
          case 'InProgress':
            statusStyle = 'background-color: #FFC107; color: #333;'; // Amber
            break;
          case 'Failed':
            statusStyle = 'background-color: #F44336; color: white;'; // Red
            break;
          case 'Pending':
          default:
            statusStyle = 'background-color: #E0E0E0; color: #666;'; // Gray
        }

        return (
          <div key={step.id} style={{ flex: 1, textAlign: 'center', padding: '15px', border: '2px solid #ccc', borderRadius: '6px' }}>
            <div style={{ 
                backgroundColor: statusStyle, 
                padding: '10px', 
                borderRadius: '5px', 
                margin: '0 auto 10px',
                width: '100%'
            }}>
              <strong>{step.name}</strong>
              <br/>
              <small>{step.status}</small>
            </div>
            {isCurrent && <span style={{ color: '#007bff', fontWeight: 'bold' }}>▶ 현재</span>}
          </div>
        );
      })}
    </div>
  );
};

export { StepStatus };