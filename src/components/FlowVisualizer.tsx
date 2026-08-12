import React from 'react';
import { RiskGauge, calculateRiskLevel } from './RiskGauge';
import { StepIndicator, StepStatus } from './StepIndicator';

// 예시 데이터 (실제로는 API로부터 받아올 것)
const mockRiskData = {
  score: 75.5,
  level: 'High',
  label: 'Authority Flow Risk Score',
  description: '중간 수준의 법적/시장 위험이 감지되었습니다. 즉각적인 전략적 검토가 필요합니다.',
  error: null
};

const mockSteps = [
  { id: 1, name: 'Pain Point 인지 (Input)', status: 'Completed', required: true },
  { id: 2, name: '데이터 수집 및 정합성 검증', status: 'InProgress', required: true },
  { id: 3, name: '리스크 점수 계산 로직 적용', status: 'Pending', required: false },
  { id: 4, name: '권위 흐름 분석 (Output)', status: 'Pending', required: false },
  { id: 5, name: '최적의 행동 경로 제시', status: 'Pending', required: false },
];

/**
 * FlowVisualizer 컴포넌트: 리스크 점수와 권한 흐름 단계를 통합 시각화합니다.
 */
export const FlowVisualizer: React.FC = () => {
  const riskLevel = calculateRiskLevel(mockRiskData.score); // 실제 로직 적용
  const steps = mockSteps;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🚀 Authority Flow Risk Analysis</h2>
      
      {/* 1. 리스크 게이지 섹션 */}
      <div style={{ marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '30px' }}>
        <RiskGauge
          score={mockRiskData.score}
          level={riskLevel}
          label={mockRiskData.label}
          description={mockRiskData.description}
          error={mockRiskData.error}
        />
      </div>

      {/* 2. 단계 진행 상황 섹션 */}
      <h3>권한 흐름 진행 상태 (Authority Flow Status)</h3>
      <StepIndicator 
        steps={steps} 
        currentStepId={2} // 현재 '데이터 수집 및 정합성 검증'에서 진행 중이라고 가정
        error={mockRiskData.error}
      />

      {/* 3. 추가 정보 영역 (예시) */}
      <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed #ccc' }}>
        <h4>시스템 상태 요약</h4>
        <p>현재 리스크 레벨: <strong style={{ color: riskLevel === 'Critical' ? 'red' : riskLevel === 'High' ? 'orange' : 'green' }}>{riskLevel}</strong></p>
        <p>다음 단계: 데이터 정합성 검증 완료 후, 리스크 계산 로직 적용을 진행하십시오.</p>
      </div>
    </div>
  );
};

export default FlowVisualizer;