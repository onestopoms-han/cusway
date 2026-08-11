import React, { useMemo } from 'react';

// 리스크 레벨별 매핑 정의 (Interaction Spec Sheet 기반)
const RISK_LEVELS: Record<string, { color: string, message: string }> = {
  Stable: { color: '#3CB371', message: "권한 확보 경로가 안정적으로 확보되었습니다." }, // Green Tone
  Caution: { color: '#FFBF00', message: "중간 리스크 구간입니다. 선제적 권한 확보 조치가 필요합니다." }, // Amber Tone
  Warning: { color: '#CC3333', message: "**높은 리스크 감지.** 즉각적인 검토 및 대응이 요구됩니다." }, // Red Tone
  Critical: { color: '#FF0000', message: "**최대 위험 발생.** 즉각적인 최고 수준의 조치가 필요합니다." }, // Bright Red Tone
};

/**
 * RiskScoreGauge 컴포넌트: 리스크 점수를 시각화하고 동적 피드백을 제공하는 최소 단위 프로토타입.
 * @param {object} props - 컴포넌트가 받을 속성들
 * @param {number} props.riskScore - 0에서 100 사이의 현재 리스크 점수
 * @param {'Stable' | 'Caution' | 'Warning' | 'Critical'} props.currentStatus - 현재 리스크 상태
 */
const RiskScoreGauge: React.FC<{ riskScore: number; currentStatus: 'Stable' | 'Caution' | 'Warning' | 'Critical' }> = ({ riskScore, currentStatus }) => {
  // 1. 상태 매핑 및 색상 결정 (Data-based Authority 적용)
  const levelData = RISK_LEVELS[currentStatus];

  // 2. 애니메이션 로직 시뮬레이션 (실제 백엔드 호출 대신, 점수에 따라 상태를 동적으로 변경한다고 가정)
  // 실제 환경에서는 이 부분에 API 통신 및 상태 업데이트 로직이 들어갑니다.
  const simulatedScore = useMemo(() => {
    // 시뮬레이션을 위해 입력된 score를 그대로 사용하지만, 실제로는 API 응답을 받아야 합니다.
    return riskScore;
  }, [riskScore]);

  // 3. UI 구성 요소 정의
  return (
    <div className="risk-score-gauge-container">
      <h3>권한 확보 경로 리스크 점수</h3>
      
      {/* Gauge Visualization */}
      <div className="gauge-visualizer">
        <div 
          className="gauge-fill" 
          style={{ width: `${simulatedScore}%`, backgroundColor: levelData.color }}
        >
          {/* 실제 Gauge 형태를 시뮬레이션하기 위해 텍스트 오버레이 */}
          <span className="gauge-text">{simulatedScore.toFixed(0)}%</span>
        </div>
      </div>

      {/* Dynamic Feedback Message (Tooltip/Banner) */}
      <div className={`risk-feedback-banner risk-${currentStatus.toLowerCase()}`}>
        {levelData.message}
      </div>

      {/* 상태 정보 표시 */}
      <p className="status-indicator">현재 상태: <strong>{currentStatus}</strong></p>
    </div>
  );
};

export default RiskScoreGauge;