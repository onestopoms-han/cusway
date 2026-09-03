from sqlalchemy.orm import Session
import json
import re

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
            
            # [가드레일] 추천된 HS Code가 실제 마스터 DB의 10자리 세번으로 존재하는지 검증
            raw_hs = result_dict.get("recommendedHsCode", "")
            clean_hs = raw_hs.replace('.', '').replace('-', '').strip()
            
            from backend.models import HSCodeMaster
            master_rec = db.query(HSCodeMaster).filter(
                (HSCodeMaster.hs_code == raw_hs) | (HSCodeMaster.hs_code == clean_hs)
            ).first()
            
            # 0000.00-0000이 아니고 DB에 존재하지 않거나, HSK 10자리가 아닌 껍데기 세번(예: 6자리/8자리)인 경우 경고 처리
            is_valid_hsk10 = master_rec and master_rec.hscode_length == 10
            
            if raw_hs != "0000.00-0000" and not is_valid_hsk10:
                validation_results["consistency_score"] = min(validation_results["consistency_score"], 50)
                
                # 6자리 소호 하부에 속하는 실제 HSK 10자리 리스트 검색하여 피드백 제공
                prefix = clean_hs[:6]
                alternatives = db.query(HSCodeMaster).filter(
                    (HSCodeMaster.hs_code.like(f"{prefix}%")) & (HSCodeMaster.hscode_length == 10)
                ).all()
                
                alt_list = [f"{a.hs_code} ({a.name_ko})" for a in alternatives]
                if alt_list:
                    warn_msg = f"[존재하지 않는 HSK 10자리 세번] 추천한 '{raw_hs}'는 관세청 HSK 마스터 DB에 존재하지 않는 코드입니다. 해당 소호의 다음 세번({', '.join([a.hs_code for a in alternatives[:4]])})을 참고하거나, 호/소호가 부적합한 경우 올바른 류/호의 실존 10자리 세번으로 전면 수정하십시오."
                else:
                    warn_msg = f"[존재하지 않는 HSK 10자리 세번] 추천한 '{raw_hs}'는 관세청 HSK 마스터 DB에 존재하지 않는 코드입니다. 통칙에 맞는 올바른 류/호의 실존하는 유효한 HSK 10자리 세번으로 전면 수정하십시오."
                
                # 중복 추가 방지
                if not any(warn_msg[:30] in w for w in validation_results["warnings"]):
                    validation_results["warnings"].append(warn_msg)
            
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
                + "\n".join([f"- {str(w)}" for w in validation_results["warnings"]])
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

        # [강제 보정 포스트 프로세서] 만약 최종추천 세번이 존재하지 않는 코드인 경우, 가장 적합한 실존 10자리 코드로 강제 변환
        final_raw_hs = result_dict.get("recommendedHsCode", "")
        final_clean_hs = final_raw_hs.replace('.', '').replace('-', '').strip()
        
        if final_raw_hs != "0000.00-0000" and final_clean_hs:
            from backend.models import HSCodeMaster
            final_rec = db.query(HSCodeMaster).filter(
                (HSCodeMaster.hs_code == final_raw_hs) | (HSCodeMaster.hs_code == final_clean_hs)
            ).first()
            
            is_valid_hsk10 = final_rec and final_rec.hscode_length == 10
            if not is_valid_hsk10:
                prefix = final_clean_hs[:6]
                alternatives = db.query(HSCodeMaster).filter(
                    (HSCodeMaster.hs_code.like(f"{prefix}%")) & (HSCodeMaster.hscode_length == 10)
                ).all()
                
                if alternatives:
                    best_alt = None
                    for alt in alternatives:
                        clean_alt = alt.hs_code.replace('.', '').replace('-', '')
                        if clean_alt.endswith("9099") or clean_alt.endswith("9000") or clean_alt.endswith("9090") or clean_alt.endswith("90000"):
                            best_alt = alt
                            break
                    if not best_alt:
                        best_alt = alternatives[0]
                    
                    raw_alt = best_alt.hs_code.replace('.', '').replace('-', '')
                    formatted_alt = f"{raw_alt[:4]}.{raw_alt[4:6]}-{raw_alt[6:10]}"
                    print(f"[PROCESSOR] Forced post-correction: '{final_raw_hs}' is invalid. Mapping to closest HSK 10-digit: '{formatted_alt}'")
                    result_dict["recommendedHsCode"] = formatted_alt

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
            # Phase 5-3: Match real customs precedents by exact 10-digit HS Code
            # ----------------------------------------------------
            precedent_cases = []
            if clean_hs:
                # Format to standard HSK 10-digit format (e.g. 8507.60-3000) for strict matching
                formatted_hsk = f"{clean_hs[:4]}.{clean_hs[4:6]}-{clean_hs[6:]}" if len(clean_hs) == 10 else clean_hs
                db_cases = db.query(CustomsPrecedent).filter(
                    ((CustomsPrecedent.hs_code == clean_hs) | 
                     (CustomsPrecedent.hs_code == formatted_hsk)) &
                    (~CustomsPrecedent.decision_reason.like("%파싱할 수 없습니다%"))
                ).limit(3).all()
                for c in db_cases:
                    precedent_cases.append({
                        "case_number": c.case_number,
                        "hs_code": c.hs_code,
                        "product_name": c.product_name,
                        "decision_reason": c.decision_reason,
                        "issuing_body": c.issuing_body or "관세평가분류원",
                        "date": c.date or ""
                    })
                print(f"[PROCESSOR] Enriched {len(precedent_cases)} matching customs precedents for exact HS code {clean_hs}")
            result_dict["precedent_cases"] = precedent_cases
            
            # Filter precedents list in the result to ensure they match the recommendedHsCode exactly (10-digit)
            # and do not contain corrupted parser error messages
            if "precedents" in result_dict and isinstance(result_dict["precedents"], list):
                recommended_hs = result_dict.get("recommendedHsCode", "")
                rec_clean = re.sub(r'[^\d]', '', recommended_hs)
                
                if rec_clean:
                    filtered_precedents = []
                    for p in result_dict["precedents"]:
                        p_code = p.get("code") or p.get("hsCode") or ""
                        p_clean = re.sub(r'[^\d]', '', p_code)
                        p_reason = p.get("reasoningSnippet") or p.get("decision_reason") or p.get("reasoning") or ""
                        
                        if "파싱할 수 없습니다" in p_reason:
                            print(f"[PROCESSOR] Filtering out precedent {p.get('id')} due to corrupted parser error message.")
                            continue
                            
                        if p_clean == rec_clean:
                            filtered_precedents.append(p)
                        else:
                            print(f"[PROCESSOR] Filtering out mismatched precedent {p.get('id')} with code {p_code} (exact HS code mismatch with recommended {recommended_hs})")
                    result_dict["precedents"] = filtered_precedents

        # Do not cache simulated AI results to avoid contaminating official Customs Service data.

        print(f"[PROCESSOR] Pipeline execution completed successfully. HS Code matched: {result_dict.get('recommendedHsCode')}")
        return result_dict
