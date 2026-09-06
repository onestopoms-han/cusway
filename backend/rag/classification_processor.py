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
        
        # ----------------------------------------------------
        # Phase 3.5: Deterministic 10-Digit HSK Master Resolution
        # ----------------------------------------------------
        raw_hs = result_dict.get("recommendedHsCode", "")
        if raw_hs and raw_hs != "0000.00-0000":
            resolved_hs, resolved_name, structures = cls.resolve_deterministic_hsk10(
                raw_hs=raw_hs,
                product_name=product_name,
                material=material,
                function_use=function_use,
                db=db
            )
            if resolved_hs and resolved_hs != raw_hs:
                print(f"[PROCESSOR] Deterministic 10-digit resolution adjusted '{raw_hs}' -> '{resolved_hs}' ({resolved_name})")
                result_dict["recommendedHsCode"] = resolved_hs
                if resolved_name:
                    result_dict["subheadingName"] = f"제{resolved_hs}호 ({resolved_name})"
            if structures:
                result_dict["hsk_structures"] = structures

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

            # 10단위 세번 레코드 쿼리
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

        print(f"[PROCESSOR] Pipeline execution completed successfully. HS Code matched: {result_dict.get('recommendedHsCode')}")
        return result_dict

    @classmethod
    def resolve_deterministic_hsk10(cls, raw_hs: str, product_name: str, material: str = "", function_use: str = "", db: Session = None):
        """
        Deterministically resolves and validates a 10-digit HSK code against official DB siblings.
        Calculates token and semantic overlap between the query text and sibling HSK candidate names.
        Returns: (resolved_hs_code, resolved_name_ko, candidate_structures)
        """
        if not raw_hs or raw_hs == "0000.00-0000":
            return raw_hs, "", []
            
        clean_digits = re.sub(r'[^\d]', '', raw_hs)
        if len(clean_digits) < 4:
            return raw_hs, "", []

        prefix_6 = clean_digits[:6]
        prefix_4 = clean_digits[:4]
        
        from backend.models import HSCodeMaster
        
        # 1. Query all 10-digit candidates under 6-digit prefix
        candidates = db.query(HSCodeMaster).filter(
            ((HSCodeMaster.hs_code.like(f"{prefix_6}%")) | 
             (HSCodeMaster.hs_code.like(f"{prefix_4}.{prefix_6[4:6]}%"))) &
            (HSCodeMaster.hscode_length == 10)
        ).order_by(HSCodeMaster.hs_code).all()
        
        # If no 10-digit candidates under 6-digit, try 4-digit prefix
        if not candidates:
            candidates = db.query(HSCodeMaster).filter(
                ((HSCodeMaster.hs_code.like(f"{prefix_4}%")) | 
                 (HSCodeMaster.hs_code.like(f"{prefix_4[:2]}.{prefix_4[2:]}%"))) &
                (HSCodeMaster.hscode_length == 10)
            ).order_by(HSCodeMaster.hs_code).all()

        if not candidates:
            return raw_hs, "", []

        # Stopwords for candidate and query matching
        generic_stopwords = {
            "제조용", "조제품", "함량", "중량", "초과", "이하", "한정한다", "제외하며", 
            "물질", "기본", "재료", "것으로서", "내용물", "무게가", "킬로그램", "직접", 
            "접하여", "포장된", "것으로", "그", "밖의", "포함한다", "전", "용량"
        }

        # Prepare query tokens and text
        full_text = f"{product_name} {material} {function_use}".lower()
        text_words = [w for w in re.findall(r'[\w가-힣]+', full_text) if w not in generic_stopwords]
        
        # Extract key morphemes / subwords for Korean (e.g., 참깨가루 -> 참깨, 가루)
        expanded_words = set(text_words)
        for w in list(text_words):
            if len(w) >= 3:
                for sub_len in range(2, len(w)):
                    for i in range(len(w) - sub_len + 1):
                        sub_w = w[i:i+sub_len]
                        if sub_w not in generic_stopwords:
                            expanded_words.add(sub_w)
                        
        scored_candidates = []
        seen_clean_codes = set()
        
        for cand in candidates:
            cand_code = cand.hs_code
            clean_cand = re.sub(r'[^\d]', '', cand_code)
            if clean_cand in seen_clean_codes:
                continue
            seen_clean_codes.add(clean_cand)

            formatted_code = f"{clean_cand[:4]}.{clean_cand[4:6]}-{clean_cand[6:]}" if len(clean_cand) == 10 else cand_code
                
            cand_name_ko = cand.name_ko or ""
            cand_name_en = cand.name_en or ""
            cand_lower = f"{cand_name_ko} {cand_name_en}".lower()
            
            score = 0.0
            match_reasons = []
            
            # Exact clean match baseline
            if clean_cand == clean_digits:
                score += 5.0
                match_reasons.append("기존 제안 세번 기본점수")
                
            # 1. Exact phrase / word match (excluding generic stopwords)
            for w in set(text_words):
                if len(w) >= 2 and w in cand_lower:
                    score += 80.0 * len(w)
                    match_reasons.append(f"핵심어 일치: '{w}'")
                    
            # 2. Sub-token matching from expanded morphemes
            for sw in expanded_words:
                if len(sw) >= 2 and sw in cand_lower:
                    score += 30.0 * len(sw)
                    
            # 3. High-weight domain keywords matching (Bidirectional Korean & English)
            keyword_boosts = [
                ("가루", ["가루", "분말", "세말", "조말", "flour", "powder", "meal"]),
                ("참깨", ["참깨", "깨", "sesamum", "sesame"]),
                ("볶은", ["볶은", "구운", "roasted", "heat-treated", "toasted"]),
                ("콩나물", ["콩나물", "sprout", "sprouting", "yellow soybean"]),
                ("대두", ["대두", "콩", "soybean", "soya", "glycine max"]),
                ("모터", ["전동기", "모터", "motor", "pmsm", "actuator", "servo"]),
                ("배터리", ["축전지", "배터리", "battery", "accumulator", "lithium", "li-ion"]),
                ("밤", ["밤", "chestnut"]),
                ("코코넛", ["코코넛", "coconut"]),
                ("땅콩", ["땅콩", "피넛", "peanut", "ground-nut"]),
                ("버터", ["버터", "butter", "paste"]),
                ("도토리", ["도토리", "acorn"]),
                ("인삼", ["인삼", "ginseng"]),
                ("홍삼", ["홍삼", "red ginseng"]),
                ("커피", ["커피", "coffee"]),
                ("크림", ["크리머", "크림", "creamer"]),
                ("녹차", ["녹차", "green tea"]),
                ("홍차", ["홍차", "black tea"]),
                ("콜라", ["콜라", "cola"]),
                ("알로에", ["알로에", "aloe"]),
                ("효모", ["효모", "yeast"]),
                ("벌꿀", ["벌꿀", "꿀", "honey"]),
                ("로열젤리", ["로열젤리", "royal jelly"]),
            ]
            
            for kw_name, target_terms in keyword_boosts:
                input_has_kw = any(t in full_text for t in target_terms)
                cand_has_kw = any(t in cand_lower for t in target_terms)
                
                if input_has_kw and cand_has_kw:
                    score += 300.0
                    match_reasons.append(f"특화 품목 키워드 적합: '{kw_name}'")
                elif not input_has_kw and cand_has_kw:
                    # Penalty if candidate is specific to another item not mentioned in input
                    if kw_name in ["밤", "코코넛", "도토리", "인삼", "홍삼", "피넛", "콜라", "알로에", "효모", "벌꿀", "로열젤리", "녹차", "홍차"]:
                        score -= 300.0
                        match_reasons.append(f"타 품목 전용 세번 감점: '{kw_name}' 미포함")

            # 4. Fallback "기타 (Other)" base score
            if "기타" in cand_name_ko or "other" in cand_lower:
                score += 1.0
                
            scored_candidates.append({
                "code": formatted_code,
                "name_ko": cand_name_ko,
                "name_en": cand_name_en,
                "score": score,
                "reasons": match_reasons
            })
            
        # Sort candidates by score descending
        scored_candidates.sort(key=lambda x: x["score"], reverse=True)
        best = scored_candidates[0]
        
        return best["code"], best["name_ko"], scored_candidates

