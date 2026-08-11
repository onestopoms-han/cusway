import React from 'react';
import { useFlow } from '../context/FlowContext';
import Scene1Anxiety from './Scene1Anxiety'; // 추후 구현할 컴포넌트
import Scene2Solution from './Scene2Solution'; // 추후 구현할 컴포넌트
import Scene3Control from './Scene3Control'; // 추후 구현할 컴포넌트

interface FlowContainerProps {}

const FlowContainer: React.FC<FlowContainerProps> = () => {
  const { flowState, updateStage, transitionRules } = useFlow();

  // 다음 단계로 이동 가능 여부 검증 로직
  const canAdvanceToNextStep = (fromStage: 'Anxiety' | 'Solution') => {
    const rules = transitionRules.filter(rule => rule.fromStage === fromStage);
    if (rules.length === 0) return false;

    // 현재 단계에서 다음 단계로의 전환 규칙을 확인
    const nextRule = rules.find(rule => rule.toStage !== fromStage);
    if (!nextRule) return false;

    return nextRule.condition(flowState);
  };

  const handleAdvance = (targetStage: 'Solution' | 'Control') => {
    // 실제 상태 전환 전에 유효성 검증 수행
    let canAdvance = false;
    if (flowState.currentStage === 'Anxiety' && targetStage === 'Solution') {
      canAdvance = transitionRules.some(rule => rule.fromStage === 'Anxiety' && rule.toStage === 'Solution' && rule.condition(flowState));
    } else if (flowState.currentStage === 'Solution' && targetStage === 'Control') {
      canAdvance = transitionRules.some(rule => rule.fromStage === 'Solution' && rule.toStage === 'Control' && rule.condition(flowState));
    }

    if (canAdvance) {
      updateStage(targetStage);
    } else {
      console.warn(`권한 회복 조건 미충족: ${flowState.currentStage}에서 ${targetStage}로 이동할 수 없습니다.`);
    }
  };

  return (
    <div className="flow-container">
      <h1>Authority Flow: 리스크 통제 경험</h1>
      <div className="flow-visualization">
        {/* 1. 불안감 인지 단계 */}
        {flowState.currentStage === 'Anxiety' && <Scene1Anxiety />}

        {/* 2. 해결책 제시 단계 */}
        {flowState.currentStage === 'Solution' && <Scene2Solution />}

        {/* 3. 통제권 회복 단계 */}
        {flowState.currentStage === 'Control' && <Scene3Control />}
      </div>

      <div className="navigation-panel">
        {flowState.currentStage !== 'Control' && (
          <button
            onClick={() => handleAdvance('Solution')}
            disabled={!canAdvanceToNextStep('Anxiety')}
            className={`next-step-btn ${canAdvanceToNextStep('Anxiety') ? 'active' : 'disabled'}`}
          >
            다음 단계: 해결책 제시
          </button>
        )}

        {flowState.currentStage !== 'Solution' && (
          <button
            onClick={() => handleAdvance('Control')}
            disabled={!canAdvanceToNextStep('Solution')}
            className={`next-step-btn ${canAdvanceToNextStep('Solution') ? 'active' : 'disabled'}`}
          >
            다음 단계: 통제권 회복
          </button>
        )}
      </div>
    </div>
  );
};

export default FlowContainer;