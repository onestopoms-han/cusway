import React, { createContext, useState, useContext, useMemo } from 'react';
import { FullFlowState, FlowStage, FlowData, FlowTransitionRule } from '../types/FlowSchema';

// 1. Context 정의
interface FlowContextType {
  flowState: FullFlowState;
  updateStage: (newStage: FlowStage) => void;
  transitionRules: FlowTransitionRule[];
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

// 2. Provider 컴포넌트
export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flowState, setFlowState] = useState<FullFlowState>({
    currentStage: 'Anxiety', // 초기 상태는 불안감 인지
    riskScore: 75,          // 임시값 설정 (실제는 API 연동)
    valueProposition: {
      title: "안전망 구축 시작",
      description: "복잡한 리스크를 통제 가능한 흐름으로 전환합니다.",
      details: {}
    },
    visualTheme: {
      primaryColor: '#FF0000', // Anxiety Red
      secondaryColor: '#FFD700'  // Gold Link
    },
    transitionRules: [
      {
        fromStage: 'Anxiety',
        toStage: 'Solution',
        condition: (data) => data.riskScore > 50, // 위험 점수가 50 이상이면 다음 단계로 진행 가능
        feedbackInstruction: "데이터 기반의 안전한 경로를 찾아보세요. 당신은 이제 통제권을 가집니다.",
      },
      {
        fromStage: 'Solution',
        toStage: 'Control',
        condition: (data) => data.valueProposition.details && Object.keys(data.valueProposition.details).length > 0, // 가치 제안 데이터가 채워지면 다음 단계로 진행 가능
        feedbackInstruction: "모든 리스크를 통제하고 성장하는 다음 단계를 실행하십시오.",
      }
    ]
  });

  const updateStage = (newStage: FlowStage) => {
    setFlowState(prevState => ({
      ...prevState,
      currentStage: newStage,
    }));
  };

  const contextValue = useMemo(() => ({
    flowState,
    updateStage,
    transitionRules: flowState.transitionRules,
  }), [flowState]);

  return (
    <FlowContext.Provider value={contextValue}>
      {children}
    </FlowContext.Provider>
  );
};

// 3. Custom Hook
export const useFlow = () => {
  const context = useContext(FlowContext);
  if (context === undefined) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};