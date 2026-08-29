# 손실 예측 데이터 스키마 요구사항 (ROI 기반)

본 스키마는 '손실 예측'을 위한 입력값으로 사용될 것이며, 모든 입력은 **재무적 근거(Loss Aversion)**를 포함해야 합니다.

## 1. 법규/규제 영향 데이터 (Regulatory Impact Data)
*   **항목:** 관세율 변경 (HS Code별), 수입 제한 변화, 환경 규제 강화 등 핵심 변동 사항.
*   **필수 필드:** `Regulation_ID`, `Effective_Date` (2026년 8월 기준), `Impact_Type` (직접 비용 증가/간접 리스크), `Estimated_Change_Rate` (예상 변화율).
*   **활용 목적:** 법규 변경이 예상되는 시점의 잠재적 손실액을 예측하는 근거로 사용.

## 2. 경쟁사 사례 데이터 (Competitor Case Data)
*   **항목:** 경쟁사의 최근 성공/실패 사례 (특히 관세/수입 관련 리스크).
*   **필수 필드:** `Competitor_Name`, `Scenario` (특정 상황), `Outcome` (성공/실패), `Associated_Loss_Amount` (관련 손실액 추정치), `Time_to_Resolution`.
*   **활용 목적:** 실제 시장에서의 위험 회피 비용(Risk Aversion Cost)을 정량화.

## 3. 재무 변동성 데이터 (Financial Volatility Data)
*   **항목:** 원자재 가격, 인건비 상승률 등 외부 경제 지표.
*   **필수 필드:** `Metric_Name`, `Value` (예: 원자재 가격), `Volatility_Index` (변동성 지표).
*   **활용 목적:** 시스템이 예측하는 변동성과 실제 시장의 괴리를 측정하여 모델의 정확도를 검증.