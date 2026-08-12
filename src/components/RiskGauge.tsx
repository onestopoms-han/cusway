import React from 'react';

// 1. 상태 및 에러 정의
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface RiskGaugeProps {
  score: number; // 0에서 100 사이의 리스크 점수
  level: RiskLevel; // 계산된 위험 레벨 (Low, Medium, High, Critical)
  label: string; // 측정 대상 레이블 (예: 'Authority Flow Risk Score')
  description: string; // 리스크 수준에 따른 설명 텍스트
  error?: string; // 데이터 유효성 검사 오류 메시지
}

/**
 * RiskGauge 컴포넌트: 리스크 점수를 게이지 형태로 시각화합니다.
 */
export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, level, label, description, error }) => {
  // 색상 매핑 정의 (Designer의 손실 최소화 원칙 반영)
  const getStyles = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return { background: '#4CAF50', color: '#ffffff' }; // Green
      case 'Medium':
        return { background: '#FFC107', color: '#333333' }; // Amber/Yellow
      case 'High':
        return { background: '#FF9800', color: '#ffffff' }; // Orange
      case 'Critical':
        return { background: '#F44336', color: '#ffffff' }; // Red
      default:
        return { background: '#CCCCCC', color: '#333333' };
    }
  };

  const styles = getStyles(level);

  return (
    <div style={{ padding: '20px', border: `2px solid ${styles.background}`, borderRadius: '10px', textAlign: 'center', maxWidth: '350px', margin: '20px auto' }}>
      <h3>{label}</h3>
      <div style={{ width: '100%', height: '30px', backgroundColor: '#E0E0E0', borderRadius: '5px', marginBottom: '10px' }}>
        <div style={{ width: `${score}%`, height: '100%', backgroundColor: styles.background, transition: 'width 0.5s ease-in-out' }}></div>
      </div>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: styles.color }}>{score.toFixed(1)} / 100</p>
      <p>{description}</p>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>⚠️ 오류: {error}</p>}
    </div>
  );
};

// 추가적인 유효성 검증 로직을 위한 헬퍼 함수 (실제 서비스 레이어에서 사용될 것을 가정)
export const calculateRiskLevel = (score: number): RiskLevel => {
    if (score >= 80) return 'Critical';
    if (score >= 50) return 'High';
    if (score >= 20) return 'Medium';
    return 'Low';
};

export { calculateRiskLevel };