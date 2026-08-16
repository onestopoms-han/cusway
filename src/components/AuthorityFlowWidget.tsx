import React, { useState, useEffect, useMemo } from 'react';
import { RiskState, FlowStep } from '../types/RiskTypes'; // 필요한 타입 정의가 있다고 가정
import { calculateSafeDefault } from '../utils/safeDefaults'; // 안전 기본값 로직이 있다고 가정

// 가상의 API 호출 함수 (실제로는 axios 등을 사용)
const fetchAuthorityFlowData = async (flowId: string): Promise<any> => {
    // 이 부분은 테스트를 위해 Mocking을 통해 대체될 예정입니다.
    // 실제 환경에서는 API 호출 로직이 들어갑니다.
    await new Promise(resolve => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션
    throw new Error("API_FAILED"); // 기본적으로 실패를 가정하여 안전장치 테스트 준비
};

const AuthorityFlowWidget: React.FC<{ flowId: string }> = ({ flowId }) => {
    const [status, setStatus] = useState<RiskState>({
        currentStep: FlowStep.INIT,
        riskLevel: 'GREEN',
        message: 'Loading flow data...',
        isProcessing: false,
        safeDefaultApplied: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. API 호출 시도 (실패 시나리오 테스트 준비)
                const data = await fetchAuthorityFlowData(flowId);

                // 2. 데이터 유효성 검사 및 안전 기본값 적용
                if (!data || typeof data.rate === 'undefined') {
                    console.warn("API 응답에 필수 데이터 누락. Safe Default Value 적용 시작.");
                    const safeData = calculateSafeDefault(data, { rate: 0.5, riskLevel: 'YELLOW' }); // 예시 안전 기본값
                    setStatus({
                        currentStep: FlowStep.INIT,
                        riskLevel: safeData.riskLevel,
                        message: `Data missing. Defaulted to ${safeData.rate}`,
                        isProcessing: false,
                        safeDefaultApplied: true,
                    });
                    // 실제 데이터 대신 안전값으로 상태 업데이트
                    setStatus({ ...status, riskLevel: safeData.riskLevel, message: safeData.message, safeDefaultApplied: true });
                    return;
                }

                // 3. 정상 로직 처리
                const newStatus = {
                    currentStep: data.step || FlowStep.INIT,
                    riskLevel: data.riskLevel || 'GREEN',
                    message: data.message || 'Flow loaded successfully.',
                    isProcessing: false,
                    safeDefaultApplied: false, // 성공 시 안전값 적용 플래그 해제
                };

                setStatus(newStatus);

            } catch (err) {
                // 4. API 호출 실패 처리 및 안전 기본값 적용 (Critical Path)
                console.error("Authority Flow Data Fetch Error:", err);
                const safeErrorState = calculateSafeDefault(null, { rate: 0.1, riskLevel: 'RED' }); // API 실패 시 최악의 안전값 적용

                setStatus({
                    currentStep: FlowStep.INIT,
                    riskLevel: safeErrorState.riskLevel,
                    message: `Failed to load data. Applying Safe Default: ${safeErrorState.message}`,
                    isProcessing: false,
                    safeDefaultApplied: true,
                });
                setError(`데이터 로드 실패: ${err.message}`);

            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [flowId]);

    // UI 렌더링 로직 (Designer의 상태 머신 및 시각화 반영)
    const getStyle = useMemo(() => {
        switch (status.riskLevel) {
            case 'RED': return { color: '#D9534F', backgroundColor: '#F2dede' }; // Critical Red
            case 'YELLOW': return { color: '#F0AD4E', backgroundColor: '#fcf8e3' }; // Warning Yellow
            case 'GREEN': return { color: '#5CB85C', backgroundColor: '#dff0d8' }; // Safe Green
            default: return { color: '#777', backgroundColor: '#f5f5f5' };
        }
    }, [status.riskLevel]);

    return (
        <div className={`authority-flow-widget ${getStyle.backgroundColor}`}>
            <h3>Authority Flow Status ({flowId})</h3>
            <p>Current Step: {status.currentStep}</p>
            <p>Risk Level: <span style={{ color: getStyle.color, fontWeight: 'bold' }}>{status.riskLevel}</span></p>
            <p>{status.message}</p>

            {status.safeDefaultApplied && (
                <div className="safe-default-notice" style={{ color: '#8A6D3B', border: '1px solid #D9534F', padding: '10px', marginTop: '15px' }}>
                    ⚠️ 안전 기본값이 적용되었습니다. 시스템 안정성을 확보했습니다.
                </div>
            )}

            {status.isProcessing && <p>Processing...</p>}
        </div>
    );
};

export default AuthorityFlowWidget;