import React, { useState, useCallback } from 'react';

// 1. 데이터 스키마 정의 (Dashboard_API_Response_Schema_v1.0.md 기반)
interface RiskData {
  reportId: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'DeepRed'; // 위험 레벨
  calculatedRiskScore: number;
  RecommendedAction: string; // 권장 행동 지침 (가장 중요)
  riskRationale: string; // 위험 근거
  premiumValueProposition: string; // Premium 가치 제안 (UX 연동용)
  status?: string;
  timestamp?: string;
}

interface RiskSimulatorProps {
  initialData: RiskData | null;
  onProcess: (data: RiskData) => void;
}

const RiskAuthorityFlowSimulator: React.FC<RiskSimulatorProps> = ({ initialData, onProcess }) => {
  const [currentData, setCurrentData] = useState<RiskData | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback((data: RiskData) => {
    setIsLoading(true);
    setError(null);
    
    // 2. 핵심 로직 시뮬레이션 (스코어링 엔진의 결과 반영)
    // 실제로는 여기서 외부 스코어링 API 호출 및 데이터 검증이 발생합니다.
    const processedData = {
      ...data,
      // 예시: 점수에 따른 동적 상태 변경 시뮬레이션
      status: data.riskLevel === 'DeepRed' ? 'Action Required Immediately' : 'Review Recommended',
      timestamp: new Date().toISOString(),
    };

    // 3. 결과 전달 및 UI 업데이트 요청
    setTimeout(() => {
      setCurrentData(processedData);
      setIsLoading(false);
      onProcess(processedData); // 상위 컴포넌트로 최종 데이터 전달
    }, 500); // 로딩 시간 시뮬레이션
  }, [onProcess]);


  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>🛡️ 위험 인지 및 권한 확보 시뮬레이터</h2>
      {isLoading ? (
        <p>⚙️ 스코어링 엔진 처리 중... 잠시만 기다려 주세요.</p>
      ) : error ? (
        <p style={{ color: 'red' }}>🚨 오류 발생: {error}</p>
      ) : currentData ? (
        <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
          <h3>✅ 최종 위험 분석 결과</h3>
          <p><strong>보고서 ID:</strong> {currentData.reportId}</p>
          <p><strong>위험 레벨:</strong> <span style={{ color: getRiskColor(currentData.riskLevel) }}>{currentData.riskLevel}</span></p>
          <p><strong>점수 (Score):</strong> {currentData.calculatedRiskScore.toFixed(2)}</p>
          <p><strong>권장 행동 (Action):</strong> <strong style={{ color: '#D9534F', fontSize: '1.1em' }}>{currentData.RecommendedAction}</strong></p>
          <p><strong>위험 근거:</strong> {currentData.riskRationale}</p>
          <p><strong>가치 제안 (Value Prop):</strong> {currentData.premiumValueProposition}</p>
          <div style={{ marginTop: '15px', padding: '10px', borderLeft: '4px solid #5BC0DE' }}>
            <strong>상태 요약:</strong> {currentData.status}
          </div>
        </div>
      ) : (
        <p>데이터를 입력하고 분석을 시작해 주세요.</p>
      )}

      <button 
        onClick={() => handleProcess(currentData || { reportId: 'mock-001', riskLevel: 'Medium', calculatedRiskScore: 65.4, RecommendedAction: 'Review Documentation and Adjust Strategy', riskRationale: 'Initial risk detected based on input data.', premiumValueProposition: 'Pro tier unlocks actionable insights.', status: 'Review Recommended', timestamp: new Date().toISOString() })}
        disabled={isLoading}
        style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: isLoading ? 'wait' : 'pointer' }}
      >
        {isLoading ? '처리 중...' : '위험 분석 실행'}
      </button>
    </div>
  );
};

// 위험 레벨에 따른 색상 매핑 함수 (디자인 원칙 반영)
const getRiskColor = (level: RiskData['riskLevel']): string => {
  switch (level) {
    case 'DeepRed':
      return '#D9534F'; // Deep Red 계열 강조
    case 'High':
      return '#F0AD4E'; // Warning/Amber
    case 'Medium':
      return '#5BC0DE'; // Blue/Standard
    case 'Low':
      return '#5CB85C'; // Green
    default:
      return '#999';
  }
};

export default RiskAuthorityFlowSimulator;