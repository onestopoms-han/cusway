from sqlalchemy.orm import Session
import json

from backend.rag.retriever import retrieve_relevant_notes, retrieve_relevant_precedents
from backend.rag.llm_chain import query_rag_hs_classification
from backend.rag.hs_validator import HSConsistencyValidator
from backend.rag.risk_assessor import CustomsRiskAssessor

class AICustomsClassificationProcessor:
    """
    Orchestrator that executes the full Customs AI Classification lifecycle:
    1. RAG Document Retrieval
    2. GRI Step-by-Step Chain-of-Thought (CoT) Classification
    3. Note Exclusions and GRI Validation
    4. Post-Clearance Audit Tax Risk Evaluation
    """
    
    @classmethod
    def run_classification_pipeline(cls, product_name: str, material: str, function_use: str, db: Session, custom_key: str = None) -> dict:
        print(f"[PROCESSOR] Launching AI Classification Pipeline for: '{product_name}'")
        
        # ----------------------------------------------------
        # Phase 1: Retrieve RAG notes & precedents
        # ----------------------------------------------------
        combined_query = f"{product_name} {material} {function_use}"
        relevant_notes = retrieve_relevant_notes(combined_query, db)
        relevant_precedents = retrieve_relevant_precedents(combined_query, db)

        # ----------------------------------------------------
        # Phase 2: Classification (Runs through LLM Chain with Iterative Feedback Loop up to 3 retries)
        # ----------------------------------------------------
        result_dict = query_rag_hs_classification(product_name, material, function_use, db, custom_key)
        
        # ----------------------------------------------------
        # Phase 3: Legal Consistency & Exclusions Validation with Self-Correction Loop
        # ----------------------------------------------------
        max_retries = 3
        validation_results = {"consistency_score": 0, "status": "FAIL", "warnings": []}
        
        for attempt in range(max_retries):
            validation_results = HSConsistencyValidator.compute_consistency_score(result_dict)
            
            # If no warnings and hs code is resolved, we exit early (Success)
            if not validation_results["warnings"] and result_dict.get("recommendedHsCode") != "0000.00-0000":
                print(f"[PROCESSOR] Attempt {attempt+1}: Verification passed with no warnings.")
                break
                
            if attempt == max_retries - 1:
                print(f"[PROCESSOR] Attempt {attempt+1}: Maximum feedback retries reached. Retaining final version.")
                break
                
            # If warnings exist or classification failed, format feedback prompt and re-run LLM
            print(f"[PROCESSOR] Attempt {attempt+1}: Inconsistency/Fail detected. Warnings: {validation_results['warnings']}")
            
            feedback_msg = (
                f"당신의 이전 분류 결과 {result_dict.get('recommendedHsCode')} ({result_dict.get('headingName')}) 에 다음 법적 모순 및 제외 조항 저촉 경고가 감지되었습니다:\n"
                + "\n".join([f"- {w}" for w in validation_results["warnings"]])
                + "\n\n이 제외 조항과 모순을 철저히 대조하여 본 물품에 합당한 세번(GRI 통칙에 입각한 대체 세번)으로 엄격하게 수정하여 반환하십시오."
            )
            
            # Re-query LLM with feedback prompt
            result_dict = query_rag_hs_classification(
                product_name, material, function_use, db, custom_key,
                feedback_prompt=feedback_msg
            )
        
        result_dict["consistency_score"] = validation_results["consistency_score"]
        result_dict["consistency_status"] = validation_results["status"]
        result_dict["consistency_warnings"] = validation_results["warnings"]
        result_dict["validation_attempts"] = attempt + 1

        # ----------------------------------------------------
        # Phase 4: Post-Clearance Audit (PCA) Tax Risk Assessment
        # ----------------------------------------------------
        # Identify risk keys by scanning keywords in inputs & reasoning
        risk_keys = []
        lower_query = combined_query.lower() + " " + result_dict.get("legalReasoning", "").lower()
        
        if any(w in lower_query for w in ["로열티", "상표권", "라이선스", "royalty", "licence"]):
            risk_keys.append("ART-ROYALTY")
        if any(w in lower_query for w in ["생산지원", "무상제공", "도면", "금형", "assists"]):
            risk_keys.append("ART-ASSISTS")
        if any(w in lower_query for w in ["특수관계", "본지사", "지사", "본사", "계열사", "relation"]):
            risk_keys.append("ART-RELATION")
        if any(w in lower_query for w in ["간접지급", "의무대행", "광고비", "사후귀속", "indirect"]):
            risk_keys.append("ART-INDIRECT")

        # Calculate estimated risk exposure assuming a baseline duty shortfall sample of $25,000 (~3,000만원)
        # for risk simulation and analysis report
        duty_shortfall = 30000000.0  # Default simulated shortfall of 30,000,000 KRW
        delay_days = 365  # Default simulated delay of 1 year
        
        assessor = CustomsRiskAssessor()
        risk_results = assessor.calculate_audit_risk(duty_shortfall, delay_days, risk_keys)
        
        result_dict["tax_risk"] = risk_results

        # ----------------------------------------------------
        # Phase 5: Build unified legal classification structure
        # ----------------------------------------------------
        # If the consistency validator flags complete contradiction, adjust code and status
        if validation_results["consistency_score"] < 40:
            result_dict["confidence"] = min(result_dict["confidence"], 45)
            # Downgrade to warnings-hold
            result_dict["recommendedHsCode"] = "0000.00-0000"

        # ----------------------------------------------------
        # Phase 5-2: Real-time HS Code Master validation & autofill
        # ----------------------------------------------------
        raw_hs = result_dict.get("recommendedHsCode", "")
        clean_hs = ""
        hs_prefix = ""
        if raw_hs and raw_hs != "0000.00-0000":
            from backend.models import HSCodeMaster, CustomsPrecedent
            
            clean_hs = raw_hs.replace('.', '').replace('-', '')
            # 4자리 Heading 코드 (예: 0811)
            hs_4 = clean_hs[:4] if len(clean_hs) >= 4 else ""
            # 6자리 Subheading 코드 (예: 081190)
            hs_6 = clean_hs[:6] if len(clean_hs) >= 6 else ""

            # 4단위 호 용어 쿼리
            heading_rec = None
            if hs_4:
                hs_4_dot = f"{hs_4[:2]}.{hs_4[2:]}"
                heading_rec = db.query(HSCodeMaster).filter(
                    (HSCodeMaster.hs_code == hs_4) | (HSCodeMaster.hs_code == hs_4_dot)
                ).first()

            # 6단위 소호 용어 쿼리
            subheading_rec = None
            if hs_6:
                hs_6_dot = f"{hs_6[:4]}.{hs_6[4:]}"
                subheading_rec = db.query(HSCodeMaster).filter(
                    (HSCodeMaster.hs_code == hs_6) | (HSCodeMaster.hs_code == hs_6_dot)
                ).first()

            # 10단위 세번 레코드 쿼리 (백업용)
            master_rec = db.query(HSCodeMaster).filter(
                (HSCodeMaster.hs_code == raw_hs) | (HSCodeMaster.hs_code == clean_hs)
            ).first()

            # 계층별 최적 명칭 지정
            if heading_rec:
                result_dict["headingName"] = heading_rec.name_ko
            elif master_rec:
                result_dict["headingName"] = master_rec.name_ko
            else:
                result_dict["headingName"] = "기타 품목"

            if subheading_rec:
                result_dict["subheadingName"] = subheading_rec.name_en or subheading_rec.name_ko or ""
            elif master_rec:
                result_dict["subheadingName"] = master_rec.name_en or ""
            else:
                result_dict["subheadingName"] = ""

            if master_rec or heading_rec or subheading_rec:
                print(f"[PROCESSOR] Matched official master names: {result_dict.get('headingName')} ({result_dict.get('subheadingName')})")
            else:
                print(f"[PROCESSOR] Warning: recommendedHsCode {raw_hs} not found in hs_code_master DB.")

            # ----------------------------------------------------
            # Phase 5-3: Match real customs precedents by prefix (first 4 digits)
            # ----------------------------------------------------
            precedent_cases = []
            hs_prefix = clean_hs[:4]
            if hs_prefix:
                db_cases = db.query(CustomsPrecedent).filter(
                    CustomsPrecedent.hs_code.like(f"{hs_prefix}%")
                ).limit(3).all()
                for c in db_cases:
                    precedent_cases.append({
                        "case_number": c.case_number,
                        "hs_code": c.hs_code,
                        "product_name": c.product_name,
                        "decision_reason": c.decision_reason,
                        "date": c.date or ""
                    })
                print(f"[PROCESSOR] Enriched {len(precedent_cases)} matching customs precedents for prefix {hs_prefix}")
            result_dict["precedent_cases"] = precedent_cases

        print(f"[PROCESSOR] Pipeline execution completed successfully. HS Code matched: {result_dict.get('recommendedHsCode')}")
        return result_dict
