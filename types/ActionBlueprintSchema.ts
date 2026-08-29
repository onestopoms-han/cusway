interface RiskLevel {
  Critical: 'Critical';
  Warning: 'Warning';
  Normal: 'Normal';
}

interface ContextState {
  risk_level: RiskLevel;
  authority_flow_status: 'Acquired' | 'Pending' | 'Failed';
  trigger_event: string;
}

interface ActionStep {
  step_id: number;
  action_type: string; // e.g., Data_Gathering, Legal_Review
  description: string;
  target_module: string; // e.g., RiskModule, ComplianceEngine
  input_parameters: Record<string, any>; // Dynamic parameters based on action_type
}

interface ActionPlan {
  blueprint_id: string;
  context_state: ContextState;
  action_plan: {
    goal_objective: string;
    required_actions: ActionStep[];
  };
}

export type ActionBlueprintSchema = ActionPlan;
export type ValidationResult = 'Success' | 'Failure';

/**
 * 데이터 유효성 검증 로직 (Pseudocode/Interface)
 * 실제 구현은 Zod 등 라이브러리를 사용하여 구체화될 예정.
 */
export function validateActionBlueprint(blueprint: ActionBlueprintSchema): ValidationResult {
  if (!blueprint.blueprint_id || !blueprint.context_state || !blueprint.action_plan) {
    console.error("Validation Error: 필수 필드가 누락되었습니다.");
    return 'Failure';
  }

  // ContextState 유효성 검사
  const validRiskLevels = ['Critical', 'Warning', 'Normal'];
  if (!validRiskLevels.includes(blueprint.context_state.risk_level)) {
    console.error("Validation Error: risk_level은 유효한 값('Critical', 'Warning', 'Normal')이어야 합니다.");
    return 'Failure';
  }
  if (!['Acquired', 'Pending', 'Failed'].includes(blueprint.context_state.authority_flow_status)) {
    console.error("Validation Error: authority_flow_status는 유효한 값('Acquired', 'Pending', 'Failed')이어야 합니다.");
    return 'Failure';
  }

  // Action Plan 유효성 검사
  if (!blueprint.action_plan.goal_objective || !Array.isArray(blueprint.action_plan.required_actions)) {
    console.error("Validation Error: goal_objective 및 required_actions 배열이 누락되었습니다.");
    return 'Failure';
  }

  // 각 ActionStep 유효성 검사 (깊은 검증은 추후 구현)
  for (const step of blueprint.action_plan.required_actions) {
    if (!step.step_id || !step.action_type || !step.description || !step.target_module) {
      console.error(`Validation Error: ActionStep ${step.step_id}의 필수 필드가 누락되었습니다.`);
      return 'Failure';
    }
  }

  // 모든 검증 통과
  return 'Success';
}