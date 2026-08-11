import React, { useMemo } from 'react';

// 1. 타입 정의 (TypeScript Strictness 확보)
type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

interface ActionGuidance {
  text: string;
  color: string; // Hex color for text
}

interface AuthorityActionWidgetProps {
  currentRisk: RiskLevel;
  controlScore: number; // 0-100 scale assumed
  onAction: (risk: RiskLevel) => void;
}

// 2. 상태 매핑 정의 (Designer 사양 기반)
const RISK_CONFIG: Record<RiskLevel, { bgColor: string; textColor: string; guidance: ActionGuidance }> = {
  Low: {
    bgColor: '#3CB371', // Growth Green
    textColor: '#004D66', // Deep Blue (Authority Color)
    guidance: { text: '권장 행동 지침: 조치 완료.', color: '#004D66' }
  },
  Moderate: {
    bgColor: '#FFD700', // Rich Gold
    textColor: '#333333',
    guidance: { text: '주의: 선제적 조치 필요.', color: '#333333' }
  },
  High: {
    bgColor: '#DC143C', // Red/Danger
    textColor: '#FFFFFF',
    guidance: { text: '즉각적인 행동 요구: 권한 확보.', color: '#FFFFFF' }
  },
  Critical: {
    bgColor: '#8B0000', // Dark Red for critical state
    textColor: '#FFFFFF',
    guidance: { text: '최고 위험: 즉시 통제권 회복.', color: '#FFFFFF' }
  }
};

// 3. 컴포넌트 구현 (State Management 및 데이터 바인딩)
const AuthorityActionWidget: React.FC<AuthorityActionWidgetProps> = ({
  currentRisk,
  controlScore,
  onAction,
}) => {
  // 현재 상태에 따른 디자인 정보 조회
  const config = RISK_CONFIG[currentRisk];

  // Control Score 기반의 동적 색상 결정 (간단한 예시)
  const scoreColor = useMemo(() => {
    if (controlScore >= 80) return '#006400'; // Darker Green for high control
    if (controlScore >= 50) return '#DAA520'; // Gold range
    return '#DC143C'; // Red range
  }, [controlScore]);

  // 상태 변화 시 호출될 핸들러 함수 정의
  const handleActionClick = () => {
    onAction(currentRisk);
  };

  return (
    <div style={{ 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: config.bgColor,
        border: `3px solid ${config.textColor}`,
        color: config.textColor,
        textAlign: 'center',
        transition: 'all 0.3s ease'
    }}>
      <h2 style={{ marginBottom: '15px', fontSize: '1.8em', fontWeight: 'bold' }}>
        Authority Action Widget
      </h2>
      
      {/* 통제 점수 표시 */}
      <div style={{ 
          fontSize: '3em', 
          fontWeight: '900', 
          margin: '10px 0', 
          color: scoreColor,
          textShadow: `0 0 5px ${scoreColor}` // 시각적 강조
      }}>
        {controlScore}%
      </div>

      {/* 권장 행동 지침 */}
      <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: config.textColor + '15', // Very light tint of text color
          borderLeft: `5px solid ${config.textColor}`,
          fontWeight: '600'
      }}>
        {config.guidance.text}
      </div>

      {/* 행동 촉구 버튼 */}
      <button 
        onClick={handleActionClick}
        style={{
          marginTop: '25px',
          padding: '10px 20px',
          backgroundColor: config.textColor,
          border: `none`,
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.textColor + 'A0'} // Hover effect implementation based on spec
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.textColor}
      >
        {currentRisk === 'Low' ? '진행하기' : '조치 요청'}
      </button>
    </div>
  );
};

export default AuthorityActionWidget;