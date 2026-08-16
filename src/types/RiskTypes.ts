export type RiskState = {
    currentStep: 'INIT' | 'STEP_1' | 'STEP_2' | 'COMPLETE';
    riskLevel: 'RED' | 'YELLOW' | 'GREEN';
    message: string;
    isProcessing: boolean;
    safeDefaultApplied: boolean;
};

export type FlowStep = 'INIT' | 'STEP_1' | 'STEP_2' | 'COMPLETE';