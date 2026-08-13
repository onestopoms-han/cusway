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
        # Phase 2: Classification (Runs through LLM Chain with CoT guidelines)
        # ----------------------------------------------------
        # The query_rag_hs_classification handles the LLM RAG prompts and fallbacks
        result_dict = query_rag_hs_classification(product_name, material, function_use, db, custom_key)

        # ----------------------------------------------------
        # Phase 3: Legal Consistency & Exclusions Validation
        # ----------------------------------------------------
        # Validate logic and note exclusions
        validation_results = HSConsistencyValidator.compute_consistency_score(result_dict)
        result_dict["consistency_score"] = validation_results["consistency_score"]
        result_dict["consistency_status"] = validation_results["status"]
        result_dict["consistency_warnings"] = validation_results["warnings"]

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

        print(f"[PROCESSOR] Pipeline execution completed successfully. HS Code matched: {result_dict.get('recommendedHsCode')}")
        return result_dict
