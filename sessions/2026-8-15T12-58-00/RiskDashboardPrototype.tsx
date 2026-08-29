import React, { useState, useMemo, useCallback } from 'react';

// --- 1. Type Definitions (데이터 계약서) ---
/**
 * Authority Flow 상태를 정의합니다. Designer 스펙 기반.
 */
type RiskState = 'High Risk' | 'Warning/Action' | 'Control Achieved' | 'Stable/Safe';

/**
 * 리스크 대시보드에 필요한 핵심 데이터 구조.
 */
interface RiskData {
  riskLevel: 'High' | 'Medium' | 'Low'; // 실제 진단 결과 (Backend에서 Mock)
  lossPotential: number;              // 손실 잠재력 (Loss Zone)
  authorityMultiplier: number;       // 통제권 확보 지표 (Authority Flow 핵심)
  status: RiskState;                  // 현재 상태 (UI 렌더링 기준)
  errorMessage?: string;              // 에러 또는 경고 메시지
}

/**
 * 리스크 대시보드 컴포넌트의 상태와 로직을 관리하는 인터페이스.
 */
interface DashboardState {
  data: RiskData;
  isLoading: boolean;
  error: string | null;
  handleTransition: (newState: RiskState) => void; // 상태 전환 핸들러
  simulateDataFetch: (mockResult: RiskData | null, error: string | null) => void; // Mock 데이터 로딩 시뮬레이션
}

// --- 2. Core Logic & Prototype Component ---

/**
 * 리스크 대시보드 프로토타입 컴포넌트.
 * 실제 API 호출 없이 상태 전환 및 데이터 검증 로직에 집중합니다.
 */
const RiskDashboardPrototype: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    data: {
      riskLevel: 'Medium',
      lossPotential: 50000,
      authorityMultiplier: 1.0, // 초기값
      status: 'Warning/Action',
      errorMessage: null,
    },
    isLoading: false,
    error: null,
    handleTransition: () => {},
    simulateDataFetch: () => {},
  });

  // --- 핵심 로직: Authority Multiplier 계산 (가상의 복잡도 반영) ---
  const calculateMultiplier = useCallback((riskLevel: 'High' | 'Medium' | 'Low', lossPotential: number): number => {
    // 실제 비즈니스 로직은 복잡하므로, 여기서는 가중치 기반으로 시뮬레이션합니다.
    if (riskLevel === 'High') return 0.5; // 고위험일수록 확보 난이도 높음
    if (riskLevel === 'Medium') return 1.2; // 중간 단계에서 통제권 확보에 더 많은 노력이 필요함
    return 1.5; // Low Risk는 이미 안정적이므로 빠르게 달성 가능하다고 가정
  }, []);

  // --- 상태 전환 핸들러 구현 ---
  const handleTransition = useCallback((newState: RiskState) => {
    setState(prevState => ({ ...prevState, data: { ...prevState.data, status: newState } }));
    console.log(`[Prototype] State Transitioned to: ${newState}`);
    // TODO: 실제로는 이 시점에서 UI 애니메이션을 트리거해야 합니다. (Designer 스펙 참조)
  }, []);

  // --- Mock 데이터 시뮬레이션 함수 ---
  const simulateDataFetch = useCallback((mockResult: RiskData | null, error: string | null) => {
    setState(prevState => ({
      ...prevState,
      isLoading: false,
      error: error,
      data: mockResult || prevState.data, // 에러가 있으면 이전 데이터 유지
    }));
  }, []);

  // 초기 로딩 시뮬레이션 (시스템 강건성 검증을 위해)
  React.useEffect(() => {
    // 3초 후 성공적으로 데이터를 로드하는 시나리오 시뮬레이션
    const timer = setTimeout(() => {
      const mockData: RiskData = {
        riskLevel: 'High', // 테스트를 위해 High로 설정
        lossPotential: 120000,
        authorityMultiplier: 0.5,
        status: 'High Risk',
        errorMessage: "Critical Loss Zone Detected. Immediate Action Required.",
      };
      simulateDataFetch(mockData, null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [simulateDataFetch]);


  // --- 렌더링 부분 (Prototype View) ---
  return (
    <div className="risk-dashboard-prototype">
      <h2>Risk & Authority Dashboard Prototype</h2>
      
      {state.isLoading && <p>Loading System Integrity...</p>}
      {state.error && <div className="error-message error-critical">{state.error}</div>}

      {/* Pain Gauge Visualization Placeholder (Designer 스펙 적용 지점) */}
      <div className={`pain-gauge-visualization ${state.data.status.replace(/\s/g, '-')}`}>
        <h3>Authority Flow Status: {state.data.status}</h3>
        <p>Risk Level: {state.data.riskLevel}</p>
        <p>Loss Potential: ${state.data.lossPotential.toLocaleString()}</p>
        
        {/* Authority Multiplier Display */}
        <div className="multiplier-display">
          <h4>Authority Multiplier: {state.data.authorityMultiplier.toFixed(2)}x</h4>
          <p>Action Required: {state.data.status === 'High Risk' ? 'Immediate Intervention' : state.data.status === 'Control Achieved' ? 'Monitoring Phase' : 'Mitigation Planning'}</p>
        </div>

        {/* State Transition Controls (Verification Point) */}
        <div className="transition-controls">
          <button onClick={() => handleTransition('Warning/Action')}>Move to Mitigation</button>
          <button onClick={() => handleTransition('Control Achieved')}>Attempt Control</button>
          <button onClick={() => handleTransition('Stable/Safe')}>Achieve Stability</button>
        </div>

        {/* Debugging Point (System Robustness Check) */}
        <details>
            <summary>⚙️ Debug: Full Data Dump</summary>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
        </details>
      </div>
    </div>
  );
};

export default RiskDashboardPrototype;