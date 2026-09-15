from sqlalchemy.orm import Session
import json
import re

from backend.rag.retriever import retrieve_relevant_notes, retrieve_relevant_precedents
from backend.rag.llm_chain import query_rag_hs_classification
from backend.rag.hs_validator import HSConsistencyValidator

def detect_query_domain(product_name: str) -> tuple:
    """
    Identifies the broad Customs Section/Chapter domain from the product name for RAG prioritization.
    Universal Architecture: Returns all 1-97 chapters to prevent premature chapter pruning bottlenecks.
    """
    return ("UNIVERSAL_ALL_DOMAINS", [f"{i:02d}" for i in range(1, 98)])

class AICustomsClassificationProcessor:
    """
    Orchestrator that executes the full Customs AI Classification lifecycle:
    1. RAG Document Retrieval with Domain Isolation Gate
    2. GRI Step-by-Step Chain-of-Thought (CoT) Classification (2-Pass Decoupled)
    3. Note Exclusions and GRI Validation
    4. Deterministic 10-Digit HSK Master Resolution
    """
    
    @classmethod
    def run_classification_pipeline(cls, product_name: str, material: str, function_use: str, db: Session, custom_key: str = None) -> dict:
        print(f"[PROCESSOR] Launching 2-Pass Decoupled AI Classification Pipeline for: '{product_name}'")
        
        # ----------------------------------------------------
        # Pass 1: 3-Slot Decoupling & Physical Subject Isolation
        # ----------------------------------------------------
        from backend.rag.slot_decoupler import decouple_3slots
        slot_info = decouple_3slots(product_name, material, function_use)
        search_query = slot_info.get("head_noun") or product_name
        
        domain_name, allowed_chapters = detect_query_domain(search_query)
        print(f"[PROCESSOR] Head Noun Isolated: '{search_query}' | Domain: {domain_name} (Allowed Chapters: {len(allowed_chapters)})")
        
        # ----------------------------------------------------
        # Phase 1: Retrieve Domain-Constrained RAG Notes & Precedents
        # ----------------------------------------------------
        relevant_notes = retrieve_relevant_notes(search_query, db, allowed_chapters=allowed_chapters)
        relevant_precedents = retrieve_relevant_precedents(search_query, db, allowed_chapters=allowed_chapters)

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
            
            raw_hs = result_dict.get("recommendedHsCode", "")
            clean_hs = raw_hs.replace('.', '').replace('-', '').strip()
            ch2 = clean_hs[:2]

            # [가드레일] 추천된 HS Code가 실제 마스터 DB의 10자리 세번으로 존재하는지 검증
            from backend.models import HSCodeMaster
            master_rec = db.query(HSCodeMaster).filter(
                (HSCodeMaster.hs_code == raw_hs) | (HSCodeMaster.hs_code == clean_hs)
            ).first()
            
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
                + "\n\n[필수 지침] 위 제외 조항과 모순을 철저히 확인하십시오. 경고에서 명시한 배제 호/류(예: 저촉된 세번)를 절대로 다시 선택하지 말고, 법리적 주규정 및 통칙에 부합하는 올바른 대체 세번으로 즉시 수정하여 반환하십시오."
            )
            
            # Re-query LLM with feedback prompt
            result_dict = query_rag_hs_classification(
                product_name, material, function_use, db, custom_key,
                feedback_prompt=feedback_msg
            )
        
        # ----------------------------------------------------
        # Phase 3.5: Cascading 3-Stage HSK Resolution & Clarification Probing
        # ----------------------------------------------------
        raw_hs = result_dict.get("recommendedHsCode", "")
        if raw_hs and raw_hs != "0000.00-0000":
            resolved_hs, resolved_name, structures, clarif_info = cls.resolve_hierarchical_hsk10(
                raw_hs=raw_hs,
                product_name=product_name,
                material=material,
                function_use=function_use,
                db=db
            )
            if resolved_hs and resolved_hs != raw_hs:
                print(f"[PROCESSOR] Cascading resolution adjusted '{raw_hs}' -> '{resolved_hs}' ({resolved_name})")
                result_dict["recommendedHsCode"] = resolved_hs
                if resolved_name:
                    result_dict["subheadingName"] = f"제{resolved_hs}호 ({resolved_name})"
            if structures:
                result_dict["hsk_structures"] = structures
            if clarif_info:
                result_dict["needs_clarification"] = clarif_info.get("needs_clarification", False)
                result_dict["hsk_resolution_stage"] = clarif_info.get("resolution_stage", "DIRECT_10DIGIT")
                result_dict["clarification_question"] = clarif_info.get("question", "")
                result_dict["clarification_options"] = clarif_info.get("options", [])

        result_dict["consistency_score"] = validation_results["consistency_score"]
        result_dict["consistency_status"] = validation_results["status"]
        result_dict["consistency_warnings"] = validation_results["warnings"]
        result_dict["validation_attempts"] = attempt + 1

        # ----------------------------------------------------
        # Phase 4: Build unified legal classification structure
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

            try:
                if master_rec or heading_rec or subheading_rec:
                    print(f"[PROCESSOR] Matched official master names: {result_dict.get('headingName')}")
                else:
                    print(f"[PROCESSOR] Warning: recommendedHsCode {raw_hs} not found in hs_code_master DB.")
            except Exception:
                pass

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
    def resolve_hierarchical_hsk10(cls, raw_hs: str, product_name: str, material: str = "", function_use: str = "", db: Session = None):
        """
        3-Stage Cascading HSK Resolver (Heading 4-digit -> Subheading 6-digit -> HSK 10-digit)
        Evaluates candidate nodes in the official DB and detects specification ambiguity.
        Returns: (resolved_hs_code, resolved_name_ko, candidate_structures, clarification_info)
        """
        empty_clarif = {"needs_clarification": False, "resolution_stage": "DIRECT_10DIGIT", "question": "", "options": []}
        if not raw_hs or raw_hs == "0000.00-0000":
            return raw_hs, "", [], empty_clarif
            
        clean_digits = re.sub(r'[^\d]', '', raw_hs)
        if len(clean_digits) < 4:
            return raw_hs, "", [], empty_clarif

        prefix_6 = clean_digits[:6]
        prefix_4 = clean_digits[:4]
        
        from backend.models import HSCodeMaster
        
        # 1. Query all records under the 4-digit heading to build full HSK Hierarchy context
        all_heading_records = db.query(HSCodeMaster).filter(
            ((HSCodeMaster.hs_code.like(f"{prefix_4}%")) | 
             (HSCodeMaster.hs_code.like(f"{prefix_4[:2]}.{prefix_4[2:]}%")))
        ).all()

        if not all_heading_records:
            return raw_hs, "", [], empty_clarif

        # Build clean code to official name lookup table
        code_name_table = {}
        candidates = []
        for r in all_heading_records:
            clean = re.sub(r'[^\d]', '', r.hs_code)
            name = (r.name_ko or "").strip()
            if clean and name:
                if clean not in code_name_table or len(name) > len(code_name_table[clean]):
                    code_name_table[clean] = name
            if r.hscode_length == 10:
                candidates.append(r)

        if not candidates:
            return raw_hs, "", [], empty_clarif

        # Stopwords for candidate and query matching (exclude generic physical forms, processes, and tariff boilerplate)
        generic_stopwords = {
            "제조용", "조제품", "함량", "중량", "초과", "이하", "한정한다", "제외하며", 
            "물질", "기본", "재료", "것으로서", "내용물", "무게가", "킬로그램", "직접", 
            "접하여", "포장된", "것으로", "그", "밖의", "포함한다", "전", "용량",
            "가루", "분말", "파우더", "펠릿", "칩", "조각", "플레이크", "슬라이스", "농축액",
            "볶은", "구운", "삶은", "데친", "열처리", "가열"
        }

        # 0. Decouple inputs into Constitutional 3-Slot representation (No brittle text pollution)
        from backend.rag.slot_decoupler import decouple_3slots
        slot_info = decouple_3slots(product_name, material, function_use)
        
        subject = slot_info["slot1_subject"].lower()
        head_noun = slot_info["head_noun"].lower()
        ingredients = slot_info["slot2_ingredients"].lower()
        func_text = slot_info["slot3_function"].lower()

        head_words = set(w for w in re.findall(r'[a-zA-Z가-힣]+', head_noun) if len(w) >= 2 and w not in generic_stopwords and not w.isdigit())
        subject_words = set(w for w in re.findall(r'[a-zA-Z가-힣]+', subject) if len(w) >= 2 and w not in generic_stopwords and not w.isdigit() and w not in head_words)
        ing_words = set(w for w in re.findall(r'[a-zA-Z가-힣]+', ingredients) if len(w) >= 2 and w not in generic_stopwords and not w.isdigit())
        func_words = set(w for w in re.findall(r'[a-zA-Z가-힣]+', func_text) if len(w) >= 2 and w not in generic_stopwords and not w.isdigit())

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
            
            # Inherit full hierarchy tree context (Heading -> 5-digit/6-digit Subheadings -> 8-digit -> 10-digit)
            inherited_parts = []
            for prefix_len in [4, 5, 6, 8, 10]:
                sub_code = clean_cand[:prefix_len]
                if sub_code in code_name_table:
                    inherited_parts.append(code_name_table[sub_code])
            hierarchy_context = " ".join(inherited_parts)
            cand_lower = f"{hierarchy_context} {cand_name_en}".lower()
            
            score = 0.0
            match_reasons = []
            
            # 1. Proposal alignment bonus
            if clean_cand == clean_digits:
                score += 20.0
                match_reasons.append("원래 제안 세번 일치 기본점수 (+20)")
            elif clean_cand[:6] == prefix_6:
                score += 15.0
                match_reasons.append("제안 소호 일치 (+15)")
                
            # 2. Slot 1 (Head Noun) Top-Weight Matching (Weight: 200pt/len)
            for w in head_words:
                if w in cand_lower:
                    score += 200.0 * len(w)
                    match_reasons.append(f"핵심 주어(Head Noun) 일치: '{w}' (+{200*len(w)})")
                    
            # 3. Slot 1 (Physical Subject Modifiers) Matching (Weight: 80pt/len)
            for w in subject_words:
                if w in cand_lower:
                    score += 80.0 * len(w)
                    match_reasons.append(f"성상 명사 일치: '{w}' (+{80*len(w)})")

            # 4. Slot 2 (Ingredients / Composition) Matching (Weight: 40pt/len)
            for w in ing_words:
                if w in cand_lower:
                    score += 40.0 * len(w)
                    match_reasons.append(f"원재료 일치: '{w}' (+{40*len(w)})")

            # 5. Slot 3 (Function / Application) Matching (Weight: 20pt/len)
            for w in func_words:
                if w in cand_lower:
                    score += 20.0 * len(w)
                    match_reasons.append(f"용도/기능 일치: '{w}' (+{20*len(w)})")

            # WCO Chapter 02/03/07/08 state alignment (Fresh/Chilled vs Frozen)
            if len(clean_cand) >= 5 and clean_cand[:2] in ["02", "03", "07", "08"]:
                if clean_cand[4] == "1":  # .1x is fresh / chilled
                    if any(w in (subject + " " + ingredients + " " + head_noun) for w in ["신선", "냉장", "생육", "생물", "활", "fresh", "chilled"]):
                        score += 60.0
                        match_reasons.append("신선/냉장 성상 소호 일치 (+60)")
                elif clean_cand[4] == "2":  # .2x is frozen
                    if any(w in (subject + " " + ingredients + " " + head_noun) for w in ["냉동", "동결", "frozen"]):
                        score += 60.0
                        match_reasons.append("냉동 성상 소호 일치 (+60)")

            # Species conflict check (e.g. candidate has 참깨 but input has 들깨)
            input_full = f"{subject} {ingredients} {head_noun}"
            if "참깨" in cand_lower and "들깨" in input_full and "참깨" not in input_full:
                score -= 300.0
                match_reasons.append("종실 품종 불일치 감점: 참깨 vs 들깨 (-300)")

            # 6. Fallback "기타 (Other)" safety floor
            if clean_cand.endswith("9000") or clean_cand.endswith("9090") or clean_cand.endswith("9099"):
                score += 5.0
                
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

        # Stage 3: Smart Clarification Probing
        clarification_info = {
            "needs_clarification": False,
            "resolution_stage": "DIRECT_10DIGIT",
            "question": "",
            "options": []
        }

        best_clean_code = re.sub(r'[^\d]', '', best["code"])
        best_prefix_6 = best_clean_code[:6]
        same_subheading_cands = [c for c in scored_candidates if re.sub(r'[^\d]', '', c["code"])[:6] == best_prefix_6]

        # Check for cross-subheading competition under heading (e.g. 0902.10 <=3kg vs 0902.20 >3kg)
        if len(scored_candidates) > 1:
            top1 = scored_candidates[0]
            top2 = scored_candidates[1]
            score_margin = top1["score"] - top2["score"]

            if score_margin <= 30.0 and top2["score"] >= 50.0:
                # Close competition across subheadings or within subheading
                clarification_info["needs_clarification"] = True
                clarification_info["resolution_stage"] = "NEEDS_SPEC_CLARIFICATION"
                clarification_info["question"] = f"'{product_name}'의 정확한 10단위 세번 확정을 위해 포장 형태 또는 세부 규격을 선택해 주십시오."
                clarification_info["options"] = [
                    {
                        "hscode": c["code"],
                        "name_ko": c["name_ko"],
                        "label": f"{c['code']} - {c['name_ko']}"
                    }
                    for c in scored_candidates[:3] if c["score"] >= top1["score"] - 50.0
                ]
            elif len(same_subheading_cands) == 1:
                clarification_info["needs_clarification"] = False
                clarification_info["resolution_stage"] = "DIRECT_10DIGIT"
            else:
                top1_sub = same_subheading_cands[0]
                top2_sub = same_subheading_cands[1]
                sub_margin = top1_sub["score"] - top2_sub["score"]
                has_distinct_head = any("핵심 주어" in r or "성상 명사" in r for r in top1_sub.get("reasons", []))

                if sub_margin >= 80.0 or (has_distinct_head and sub_margin > 20.0):
                    clarification_info["needs_clarification"] = False
                    clarification_info["resolution_stage"] = "CONFIRMED_VIA_MORPHOLOGY"
                else:
                    clarification_info["needs_clarification"] = True
                    clarification_info["resolution_stage"] = "NEEDS_SPEC_CLARIFICATION"
                    clarification_info["question"] = f"'{product_name}'의 최종 10단위 세번(HSK) 확정을 위해 세부 규격 또는 용도를 선택해 주십시오."
                    clarification_info["options"] = [
                        {
                            "hscode": c["code"],
                            "name_ko": c["name_ko"],
                            "label": f"{c['code']} - {c['name_ko']}"
                        }
                        for c in same_subheading_cands[:4]
                    ]
        else:
            clarification_info["needs_clarification"] = False
            clarification_info["resolution_stage"] = "DIRECT_10DIGIT"
        
        return best["code"], best["name_ko"], scored_candidates, clarification_info

    @classmethod
    def resolve_deterministic_hsk10(cls, raw_hs: str, product_name: str, material: str = "", function_use: str = "", db: Session = None):
        """
        Backward-compatible wrapper returning (resolved_hs_code, resolved_name_ko, candidate_structures)
        """
        res_code, res_name, structs, _ = cls.resolve_hierarchical_hsk10(
            raw_hs=raw_hs,
            product_name=product_name,
            material=material,
            function_use=function_use,
            db=db
        )
        return res_code, res_name, structs

    @classmethod
    def probe_clarification_needs(cls, product_name: str, db: Session) -> dict:
        """
        2-Step Progressive Classification Gate:
        Domain-Aware Probing to prevent domain mismatch (e.g. asking plastic/steel for food/tea/beverages).
        1. Food / Tea / Beverage / Agri / Supplements -> Food specific composition / processing chips
        2. Cosmetics / Toiletries -> Skin / Cleansing / Makeup chips
        3. Chemicals / Polymers -> Resin / Pigment / Compound chips
        4. Hardware / Industrial raw materials -> Plastic / Steel / Aluminum / Copper / Glass chips
        5. Machinery / Electronics -> Industrial / Auto / Home / Medical chips
        6. Fully specified or unambiguous items -> Direct resolution (needs_clarification=False)
        """
        p_clean = product_name.strip()
        p_lower = p_clean.lower()
        
        # ----------------------------------------------------
        # Domain 1: Food, Beverages, Tea, Coffee, Dairy, Agriculture, Supplements
        # ----------------------------------------------------
        food_indicators = [
            "말차", "녹차", "홍차", "라떼", "밀크티", "커피", "원두", "생두", "코코아", "초콜릿", "카카오",
            "음료", "식품", "분유", "유청", "단백질", "프로틴", "콜라겐", "치즈", "버터", "크림", "크리머",
            "시럽", "소스", "드레싱", "조미료", "양념", "향신료", "참깨", "들깨", "고춧가루", "마늘", "양파",
            "과일", "과실", "채소", "야채", "스프", "주스", "스무디", "밀가루", "전분", "당면", "설탕", "당류",
            "스낵", "과자", "사탕", "젤리", "잼", "효모", "유산균", "영양제", "비타민", "식용", "농축액",
            "tea", "latte", "coffee", "matcha", "whey", "protein", "collagen", "dairy", "cacao", "cocoa"
        ]
        is_food_domain = any(fi in p_lower for fi in food_indicators)

        if is_food_domain:
            # Sub-case 1-1: Tea / Matcha / Latte / Coffee / Beverage Mixes
            if any(k in p_lower for k in ["말차", "녹차", "홍차", "라떼", "밀크티", "티", "tea", "latte", "음료", "커피믹스", "음료용"]):
                has_spec = any(s in p_lower for s in ["100%", "순수", "무가당", "가당", "분유", "유성분", "설탕", "포도당", "크리머"])
                if not has_spec:
                    return {
                        "needs_clarification": True,
                        "clarification_type": "MATERIAL",
                        "question": f"'{p_clean}'은(는) 차(말차/녹차) 함량, 유성분(분유/크리머), 가당 여부에 따라 세번(제0902호 vs 제1901호 vs 제2106호)이 달라집니다. 어떤 성분 구성인가요?",
                        "suggested_chips": [
                            "말차/녹차 100% 순수 무가당 분말 (제0902호)",
                            "설탕·감미료 첨가 조제분말 (가당 음료용, 제2106호)",
                            "분유·유성분(1.5% 초과) 함유 라떼 조제품 (제1901호)",
                            "코코아/초콜릿 함유 조제품 (제1806호)"
                        ],
                        "direct_result": None
                    }

            # Sub-case 1-2: Protein / Collagen / Health Supplements
            if any(k in p_lower for k in ["단백질", "프로틴", "콜라겐", "유청", "protein", "collagen", "whey", "영양제"]):
                has_spec = any(s in p_lower for s in ["wpc", "wpi", "유청", "대두", "식물성", "동물성", "콜라겐", "비타민"])
                if not has_spec:
                    return {
                        "needs_clarification": True,
                        "clarification_type": "MATERIAL",
                        "question": f"'{p_clean}'은(는) 주원료 단백질원 및 배합 성분에 따라 관세율과 세번이 달라집니다. 어떤 성분 구성인가요?",
                        "suggested_chips": [
                            "유청단백질 농축 분말 (제0404호 / 제3502호)",
                            "대두단백 / 식물성 분리단백 조제품 (제2106호)",
                            "콜라겐 펩타이드 조제품 (제3503호 / 제2106호)",
                            "비타민·미네랄 영양 복합 조제품 (제2106호)"
                        ],
                        "direct_result": None
                    }

            # Sub-case 1-3: Sesame / Perilla / Agricultural & Spices powders
            if any(k in p_lower for k in ["참깨", "들깨", "곡물", "고춧가루", "향신료", "분말", "가루", "파우더"]):
                has_spec = any(s in p_lower for s in ["볶은", "미볶", "구운", "생", "100%", "조제", "가공", "조미"])
                if not has_spec:
                    return {
                        "needs_clarification": True,
                        "clarification_type": "MATERIAL",
                        "question": f"'{p_clean}'은(는) 열처리(볶음/가열) 여부 및 조미 첨가물 배합에 따라 세번이 달라집니다. 어떤 상태인가요?",
                        "suggested_chips": [
                            "볶은 열처리 가공품 (제2008호 / 제2106호)",
                            "미가공 단순 건조 및 분쇄물 (제12류 / 제09류)",
                            "식염·당류·향신료 배합 복합 조미분말 (제2103호 / 제2106호)"
                        ],
                        "direct_result": None
                    }

            # Other well-defined food items: proceed directly
            res = cls.run_classification_pipeline(product_name=p_clean, material="", function_use="", db=db)
            return {
                "needs_clarification": False,
                "clarification_type": "NONE",
                "question": "",
                "suggested_chips": [],
                "direct_result": res
            }

        # ----------------------------------------------------
        # Domain 2: Cosmetics & Toiletries
        # ----------------------------------------------------
        cosmetic_indicators = ["화장품", "파우더 팩트", "루스 파우더", "페이스 파우더", "아이섀도우", "블러셔", "클렌징 파우더", "선크림", "로션", "세럼", "마스크팩"]
        if any(ci in p_lower for ci in cosmetic_indicators):
            return {
                "needs_clarification": True,
                "clarification_type": "FUNCTION",
                "question": f"'{p_clean}'의 사용 목적과 화장품 제형은 무엇인가요?",
                "suggested_chips": [
                    "피부 메이크업용 페이스 파우더 / 팩트 (제3304호)",
                    "세안 및 세척용 클렌징 파우더 (제3401호 / 제3307호)",
                    "스킨케어 기초 화장품 제형 (제3304호)"
                ],
                "direct_result": None
            }

        # ----------------------------------------------------
        # Domain 3: Chemicals & Polymers
        # ----------------------------------------------------
        chemical_indicators = ["레진", "합성수지", "폴리머", "안료", "염료", "시약", "화합물", "촉매", "용제"]
        if any(ci in p_lower for ci in chemical_indicators):
            return {
                "needs_clarification": True,
                "clarification_type": "MATERIAL",
                "question": f"'{p_clean}'의 화학적 조성 및 용도는 무엇인가요?",
                "suggested_chips": [
                    "플라스틱 / 합성수지 1차 분말 (제39류)",
                    "착색제 / 유·무기 안료 및 염료 (제32류)",
                    "단일 화학 성분 유기/무기 화합물 (제28류 / 제29류)",
                    "산업용 화학 조제품 및 촉매 (제38류)"
                ],
                "direct_result": None
            }

        # ----------------------------------------------------
        # Domain 4: Hardware & Industrial Materials (Non-food)
        # ----------------------------------------------------
        material_ambiguity_patterns = [
            r"파이프", r"배관", r"관$", r"튜브", r"호스", r"플레이트", r"판재", r"시트", r"필름", r"박판", r"포일",
            r"펠릿", r"원단", r"직물", r"원사", r"실$",
            r"가스켓", r"패킹", r"o링", r"실링", r"용기", r"탱크", r"보틀", r"병$", r"단열재", r"패널",
            r"와이어", r"철선", r"봉$", r"환봉", r"형강", r"단조품", r"주물", r"도가니", r"볼트", r"너트", r"나사", r"스프링"
        ]
        
        has_specific_material = any(m in p_lower for m in [
            "스테인리스", "플라스틱", "알루미늄", "티타늄", "실리콘", "고무", "유리", "세라믹", "목재",
            "실크", "면", "울", "가죽", "탄소섬유", "카본", "구리", "동", "철강", "불소수지", "ptfe",
            "금", "은", "백금", "니켈", "아연", "주석", "나일론", "폴리에스터", "아크릴"
        ])
        
        is_material_ambiguous = any(re.search(pat, p_lower) for pat in material_ambiguity_patterns)
        if is_material_ambiguous and not has_specific_material:
            return {
                "needs_clarification": True,
                "clarification_type": "MATERIAL",
                "question": f"'{p_clean}'은(는) 구성 재질에 따라 관세율과 세번이 달라집니다. 어떤 재질로 제작되었나요?",
                "suggested_chips": [
                    "플라스틱 / 합성수지",
                    "철강 / 스테인리스",
                    "알루미늄 / 경합금",
                    "가황 고무 / 실리콘",
                    "동 / 구리 / 황동",
                    "유리 / 세라믹 / 석재"
                ],
                "direct_result": None
            }

        # ----------------------------------------------------
        # Domain 5: Machinery & Electronic Equipment
        # ----------------------------------------------------
        function_ambiguity_patterns = [
            r"모터", r"전동기", r"엔진", r"펌프", r"컴프레셔", r"압축기", r"밸브", r"센서", r"감지기",
            r"변환기", r"어댑터", r"컨트롤러", r"제어기", r"장치", r"설비"
        ]
        has_specific_function = any(f in p_lower for f in [
            "차량용", "자동차용", "산업용", "가정용", "의료용", "연구용", "스마트폰용", "반도체용", "선박용", "항공용", "농업용"
        ])
        is_function_ambiguous = any(re.search(pat, p_lower) for pat in function_ambiguity_patterns)
        if is_function_ambiguous and not has_specific_function:
            return {
                "needs_clarification": True,
                "clarification_type": "FUNCTION",
                "question": f"'{p_clean}'은(는) 주요 사용 목적과 적용 분야에 따라 관세율과 세번이 달라집니다. 어떤 용도로 사용되나요?",
                "suggested_chips": [
                    "산업용 공장 / 생산설비 라인",
                    "자동차 / 전기차 / 모빌리티용",
                    "가정용 / 개인 소비재용",
                    "의료 / 병원 / 헬스케어용",
                    "연구 / 실험실용"
                ],
                "direct_result": None
            }

        # ----------------------------------------------------
        # Domain 6: Direct Resolution for Unambiguous Goods
        # ----------------------------------------------------
        res = cls.run_classification_pipeline(
            product_name=p_clean,
            material="",
            function_use="",
            db=db
        )
        return {
            "needs_clarification": False,
            "clarification_type": "NONE",
            "question": "",
            "suggested_chips": [],
            "direct_result": res
        }

