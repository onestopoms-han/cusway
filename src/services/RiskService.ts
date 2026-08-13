class RiskService {
    // 리스크 가중치 설정 (예시 값이며, 실제 법규 및 비즈니스 목표에 따라 조정되어야 함)
    private static WEIGHTS = {
        legalRisk: 0.5,       // 법적 근거 관련 위험 점수 가중치
        marketVolatility: 0.3, // 시장 변동성 관련 위험 점수 가중치
        complexity: 0.2,      // 시스템 복잡성 및 관리 난이도 관련 위험 점수 가중치
    };

    // 법적 근거와 벌금 액수를 기반으로 리스크를 계산하는 핵심 로직
    public calculateRiskScore(articleId: string, penaltyAmount: number, marketIndex: number): { score: number, riskLevel: 'Normal' | 'Warning' | 'Critical', actionPlan: string } {
        // 1. 법적 위험 점수 산출 (Article ID 기반)
        let legalRiskScore = 0;
        if (articleId.startsWith('CR')) { // 예시: CR(Criminal/Compliance) 관련 조항이 포함된 경우 고위험
            legalRiskScore = 50;
        } else if (articleId.startsWith('REG')) { // 일반 규제 관련
            legalRiskScore = 20;
        } else {
            legalRiskScore = 10;
        }

        // 2. 시장 변동성 위험 점수 산출
        let marketRiskScore = Math.abs(marketIndex - 100) * 1.5; // 기준점 100에서 벗어날수록 가중치 증가

        // 3. 복잡성 위험 점수 산출 (시스템 구조의 복잡도에 따라)
        let complexityRiskScore = 10 + Math.floor(Math.random() * 20); // 실제로는 시스템 설계 복잡도를 반영해야 함

        // 최종 리스크 점수 계산 (가중치 적용)
        let totalRiskScore = (legalRiskScore * this.WEIGHTS.legalRisk) + 
                             (marketRiskScore * this.WEIGHTS.marketVolatility) + 
                             (complexityRiskScore * this.WEIGHTS.complexity);

        // 리스크 레벨 결정
        let riskLevel: 'Normal' | 'Warning' | 'Critical';
        let actionPlan: string;

        if (totalRiskScore < 30) {
            riskLevel = 'Normal';
            actionPlan = "현재 안정적입니다. 권한 확보 경로(Authority Flow)를 점진적으로 강화하세요.";
        } else if (totalRiskScore < 65) {
            riskLevel = 'Warning';
            actionPlan = "경고 단계입니다. 법적 근거 조항과 시장 변동성을 재검토하고 통제권 확보 계획을 즉시 실행하세요.";
        } else {
            riskLevel = 'Critical';
            actionPlan = "위험 임계값을 초과했습니다. 즉각적인 행동이 필요하며, 시스템 안정성 확보를 위한 긴급 조치(Hard Stop)를 검토하십시오.";
        }

        return { score: Math.round(totalRiskScore), riskLevel, actionPlan };
    }

    // 테스트 케이스 실행 함수
    public runTestScenarios(): void {
        console.log("--- RiskService Test Scenarios ---");
        const testCases = [
            { id: "Normal", articleId: "REG-001", penaltyAmount: 1000, marketIndex: 105 }, // 낮은 위험
            { id: "Warning", articleId: "CR-202", penaltyAmount: 5000, marketIndex: 90 },  // 중간 위험 (경고)
            { id: "Critical", articleId: "CR-999", penaltyAmount: 10000, marketIndex: 120 } // 높은 위험 (위험)
        ];

        testCases.forEach(test => {
            const result = this.calculateRiskScore(test.articleId, test.penaltyAmount, test.marketIndex);
            console.log(`\nScenario: ${test.id} (${test.articleId})`);
            console.log(`  결과: Score=${result.score}, Level=${result.riskLevel}`);
            console.log(`  Action Plan: ${result.actionPlan}`);
        });
    }
}

// 테스트 실행 (실제 환경에서는 별도 테스트 파일로 분리되나, MVP 검증을 위해 여기에 포함)
const riskService = new RiskService();
riskService.runTestScenarios();