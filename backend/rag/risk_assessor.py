class CustomsRiskAssessor:
    """
    Evaluates Post-Clearance Audit (PCA) risk and calculates legal penalty exposures
    including under-reporting fines (10%) and daily delay interest (0.022%).
    """
    
    LEGAL_AUDIT_DB = {
        "ART-ROYALTY": {
            "risk_multiplier": 2.5,
            "description": "관세법 제30조 제1항 제4호 - 권리사용료(로열티) 가산 누락 리스크"
        },
        "ART-ASSISTS": {
            "risk_multiplier": 2.0,
            "description": "관세법 제30조 제1항 제3호 - 해외 무상 생산지원비 가산 누락 리스크"
        },
        "ART-RELATION": {
            "risk_multiplier": 1.8,
            "description": "관세법 제30조 제1항 - 특수관계자간 이전가격 고저 신고 영향 리스크"
        },
        "ART-INDIRECT": {
            "risk_multiplier": 1.5,
            "description": "관세법 제30조 제1항 - 간접지급액 및 사후 귀속이익의 과세 누락 리스크"
        }
    }

    def __init__(self, system_weights: dict = None):
        # Default system weights representing audit severity
        self.weights = system_weights or {
            "market_weight": 1.2,
            "compliance_weight": 2.5,
            "legal_weight": 1.0
        }

    def calculate_audit_risk(self, duty_shortfall: float, delay_days: int, article_keys: list) -> dict:
        """
        Calculates penalty exposure and yields a risk score based on actual customs laws.
        - Under-reporting fine = 10% of duty shortfall.
        - Daily delay interest = 0.022% per day of duty shortfall.
        """
        # 1. Base Tax Penalty Calculation (Customs Act Article 42)
        under_reporting_fine = duty_shortfall * 0.10
        delay_interest = duty_shortfall * delay_days * 0.00022
        total_tax_exposure = under_reporting_fine + delay_interest

        # 2. Legal Multiplier based on historical audit target points
        legal_multiplier = 1.0
        applied_issues = []
        for key in article_keys:
            audit_item = self.LEGAL_AUDIT_DB.get(key)
            if audit_item:
                legal_multiplier += audit_item["risk_multiplier"]
                applied_issues.append(audit_item["description"])

        # 3. Compute final risk score scaled index
        # Risk score integrates both financial scale of shortfall and legal multipliers
        base_financial_factor = min(duty_shortfall / 5000000.0, 10.0) # Cap scale at 10.0 for normal audits
        final_score = (base_financial_factor * self.weights.get("market_weight", 1.2)) * (legal_multiplier * self.weights.get("compliance_weight", 2.5))
        
        # Scale to 100 max
        final_score = min(round(final_score, 1), 100.0)

        # 4. Determine Audit Risk Level
        risk_level = "안전 (Low Risk)"
        if final_score >= 70.0:
            risk_level = "심각 (Hard Stop - Immediate Action Required)"
        elif final_score >= 40.0:
            risk_level = "주의 (Medium Risk - Audit Target)"

        return {
            "duty_shortfall": round(duty_shortfall, 0),
            "under_reporting_fine": round(under_reporting_fine, 0),
            "delay_interest": round(delay_interest, 0),
            "total_penalty_exposure": round(total_tax_exposure, 0),
            "risk_score": final_score,
            "risk_level": risk_level,
            "applied_issues": applied_issues
        }
