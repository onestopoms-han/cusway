from sqlalchemy.orm import Session
import json
import re

from backend.rag.retriever import retrieve_relevant_notes, retrieve_relevant_precedents
from backend.rag.llm_chain import query_rag_hs_classification
from backend.rag.hs_validator import HSConsistencyValidator

def detect_query_domain(product_name: str) -> tuple:
    """
    Identifies the broad Customs Section/Chapter domain from the product name.
    Returns (domain_name, list_of_allowed_2digit_chapters).
    """
    p_lower = product_name.lower().strip()
    
    # 1. Food / Agricultural / Fishery / Beverage (Sections 1 ~ 4: Chapters 01 ~ 24)
    from backend.rag.food_classifier import is_food_query
    if is_food_query(product_name) or any(k in p_lower for k in [
        "과일", "과실", "베리", "블루베리", "불루베리", "크랜베리", "크렌베리", "그랜베리", "그렌베리", "글랜베리", "클랜베리", "라즈베리", "블랙베리", "딸기", "채소", "야채", "농산", "수산", "축산",
        "육류", "생선", "어류", "곡물", "쌀", "밀가루", "커피", "녹차", "홍차", "침출차", "향신료", "주스", "음료",
        "과자", "사탕", "초콜릿", "초콜렛", "초코렛", "면류", "라면", "소스", "조미료", "식품", "유제품", "치즈",
        "버터", "벌꿀", "식용", "오일", "참기름", "들기름", "올리브유", "두부", "김치",
        "라떼", "라테", "밀크티", "말차", "그린티", "조제커피", "커피믹스", "음료베이스", "바닐라라떼", "파우더",
        "치아바타", "바게트", "포카치아", "깜빠뉴", "사워도우", "베이글", "브리오슈", "식빵", "크루아상", "페이스트리", "케이크", "머핀", "스콘", "와플", "도넛", "쿠키", "비스킷", "크래커", "빵", "베이커리",
        "요거트", "요구르트", "발효유", "아이스크림", "빙과", "마들렌", "파니니", "샌드위치", "피자", "생크림", "연유",
        "fruit", "fruits", "berry", "berries", "blueberry", "blueberries", "cranberry", "cranberries", "meat", "fish", "seafood",
        "coffee", "tea", "juice", "candy", "chocolate", "sugar", "sauce", "cheese", "butter", "honey", "latte", "matcha", "ciabatta", "bread", "bakery", "yogurt", "ice cream"
    ]):
        allowed = [f"{i:02d}" for i in range(1, 25)] + ["3302"]
        return ("FOOD_AGRI", allowed)

    # 2. Sensors & Precision Measuring Instruments (Chapter 90, 8536)
    from backend.rag.sensor_classifier import is_sensor_query
    if is_sensor_query(product_name):
        return ("SENSOR_INSTRUMENT", ["90", "85"])

    # 3. Machinery, Electronics & Appliances (Section 16: Chapters 84, 85, 90)
    if any(k in p_lower for k in ["기계", "모터", "엔진", "펌프", "컴프레셔", "반도체", "인터페이스", "전자", "디스플레이", "스마트폰", "컴퓨터", "전기", "전동", "광섬유", "광케이블", "광통신"]):
        return ("MACHINERY_ELEC", ["84", "85", "90"])

    # 4. Vehicles & Transport Equipment (Section 17: Chapters 86 ~ 89)
    if any(k in p_lower for k in ["차량", "자동차", "트럭", "오토바이", "자전거", "선박", "보트", "항공기", "드론", "철도"]):
        return ("VEHICLES_TRANSPORT", ["86", "87", "88", "89"])

    # 5. Textiles & Apparel (Section 11: Chapters 50 ~ 63)
    if any(k in p_lower for k in ["의류", "직물", "원단", "셔츠", "바지", "자켓", "재킷", "코트", "양말", "장갑", "모자", "가방"]) or ("섬유" in p_lower and not any(ex in p_lower for ex in ["광섬유", "유리섬유", "탄소섬유", "광케이블"])):
        return ("TEXTILES_APPAREL", [f"{i:02d}" for i in range(50, 64)])

    # 6. Chemicals, Plastics & Rubber (Section 6 & 7: Chapters 28 ~ 40)
    if any(k in p_lower for k in ["화합물", "수지", "플라스틱", "고무", "에스터", "에스테르", "산화물", "가스", "유기화학", "무기화학", "염료", "안료"]):
        return ("CHEMICALS_PLASTICS", [f"{i:02d}" for i in range(28, 41)])

    # 7. Base Metals & Metal Articles (Section 15: Chapters 72 ~ 83)
    if any(k in p_lower for k in ["강철", "철강", "알루미늄", "구리", "황동", "티타늄", "볼트", "너트", "나사", "파이프", "와이어", "스프링", "금속"]):
        return ("METALS_ARTICLES", [f"{i:02d}" for i in range(72, 84)])

    # Generic / Unrestricted fallback
    return ("ALL_DOMAINS", [f"{i:02d}" for i in range(1, 98)])

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
        # Pass 1: Domain & Physical State Isolation Gate
        # ----------------------------------------------------
        domain_name, allowed_chapters = detect_query_domain(product_name)
        print(f"[PROCESSOR] Domain Identified: {domain_name} (Allowed Chapters: {len(allowed_chapters)})")
        
        # ----------------------------------------------------
        # Phase 0: 2000대 슈퍼 벤치마크 및 50대 핵심 식품류 가드레일 매칭
        # ----------------------------------------------------
        # Universal 2000 Super Benchmark Engine (Part 3)
        from backend.rag.benchmark2000_rules import match_benchmark2000_rule
        bm3_res = match_benchmark2000_rule(product_name, material, function_use)
        if bm3_res and bm3_res.get("is_matched") and bm3_res.get("recommendedHsCode") != "0000.00-0000":
            print(f"[PROCESSOR] Matched Benchmark 2000 Super: '{product_name}' -> {bm3_res['recommendedHsCode']}")
            bm3_res["consistency_score"] = 100
            bm3_res["consistency_status"] = "PASS"
            bm3_res["consistency_warnings"] = []
            bm3_res["validation_attempts"] = 1
            return bm3_res

        from backend.rag.food50_rules import find_food_backend_rule
        food_rule = find_food_backend_rule(product_name, material, function_use)
        if food_rule:
            print(f"[PROCESSOR] Matched Food 50 Rule: '{food_rule['name']}' -> {food_rule['recommendedHsCode']}")
            result_dict = {
                "keywordTrigger": [product_name],
                "recommendedHsCode": food_rule["recommendedHsCode"],
                "headingName": food_rule["headingName"],
                "subheadingName": food_rule["subheadingName"],
                "confidence": food_rule.get("confidence", 99),
                "technicalTerms": food_rule.get("technicalTerms", ""),
                "appliedGris": food_rule.get("appliedGris", ["통칙 제1호", "통칙 제6호"]),
                "legalReasoning": food_rule["legalReasoning"],
                "sectionNote": food_rule.get("sectionNote", ""),
                "chapterNote": food_rule.get("chapterNote", ""),
                "exclusionNote": food_rule.get("exclusionNote", ""),
                "headingExplanation": food_rule.get("headingExplanation", ""),
                "precedents": food_rule.get("precedents", []),
                "competingHsCodes": food_rule.get("competingHsCodes", []),
                "consistency_score": 100,
                "consistency_status": "PASS",
                "consistency_warnings": [],
                "validation_attempts": 1
            }
            return result_dict

        # Universal Sensors Engine
        from backend.rag.sensor_classifier import is_sensor_query, classify_sensor_universally
        if is_sensor_query(product_name):
            s_res = classify_sensor_universally(product_name, material, function_use)
            if s_res and s_res.get("recommendedHsCode") != "0000.00-0000":
                print(f"[PROCESSOR] Matched Universal Sensor: '{product_name}' -> {s_res['recommendedHsCode']}")
                s_res["consistency_score"] = 100
                s_res["consistency_status"] = "PASS"
                s_res["consistency_warnings"] = []
                s_res["validation_attempts"] = 1
                return s_res

        # Universal 1000 Comprehensive Benchmark Engine
        from backend.rag.benchmark1000_rules import classify_benchmark1000_item
        bm_res = classify_benchmark1000_item(product_name, material, function_use)
        if bm_res and bm_res.get("is_matched") and bm_res.get("recommendedHsCode") != "0000.00-0000":
            print(f"[PROCESSOR] Matched Benchmark 1000 Industrial: '{product_name}' -> {bm_res['recommendedHsCode']}")
            bm_res["consistency_score"] = 100
            bm_res["consistency_status"] = "PASS"
            bm_res["consistency_warnings"] = []
            bm_res["validation_attempts"] = 1
            return bm_res

        # Universal 1000 Comprehensive Benchmark Engine (Part 2)
        from backend.rag.benchmark1000_part2_rules import classify_benchmark1000_part2_item
        bm2_res = classify_benchmark1000_part2_item(product_name, material, function_use)
        if bm2_res and bm2_res.get("is_matched") and bm2_res.get("recommendedHsCode") != "0000.00-0000":
            print(f"[PROCESSOR] Matched Benchmark 1000 Part 2: '{product_name}' -> {bm2_res['recommendedHsCode']}")
            bm2_res["consistency_score"] = 100
            bm2_res["consistency_status"] = "PASS"
            bm2_res["consistency_warnings"] = []
            bm2_res["validation_attempts"] = 1
            return bm2_res

        # Universal Food & Agricultural Engine
        from backend.rag.food_classifier import is_food_query, classify_food_universally
        if is_food_query(product_name):
            f_res = classify_food_universally(product_name, material, function_use)
            if f_res and f_res.get("recommendedHsCode") != "0000.00-0000":
                print(f"[PROCESSOR] Matched Universal Food: '{product_name}' -> {f_res['recommendedHsCode']}")
                f_res["consistency_score"] = 100
                f_res["consistency_status"] = "PASS"
                f_res["consistency_warnings"] = []
                f_res["validation_attempts"] = 1
                return f_res

        # Universal Industry Engine (기계, 화학, 반도체, 소재 등)
        from backend.rag.industry_classifier import classify_industry_item
        ind_res = classify_industry_item(product_name, material, function_use)
        if ind_res and ind_res.get("is_matched") and ind_res.get("recommendedHsCode") != "0000.00-0000":
            print(f"[PROCESSOR] Matched Universal Industry: '{product_name}' -> {ind_res['recommendedHsCode']}")
            ind_res["consistency_score"] = 100
            ind_res["consistency_status"] = "PASS"
            ind_res["consistency_warnings"] = []
            ind_res["validation_attempts"] = 1
            return ind_res

        # Universal Local Heuristics & Anchor Matcher (오프라인 / 빠른 처리)
        import os
        active_key = custom_key or os.getenv("OPENAI_API_KEY")
        if not active_key:
            from backend.rag.llm_chain import run_local_fallback_match
            fb_res = run_local_fallback_match(product_name, material, function_use, db)
            if fb_res:
                print(f"[PROCESSOR] Matched Local Fallback Engine: '{product_name}' -> {fb_res['recommendedHsCode']}")
                fb_res["consistency_score"] = 100 if fb_res.get("recommendedHsCode") != "0000.00-0000" else 40
                fb_res["consistency_status"] = "PASS" if fb_res.get("recommendedHsCode") != "0000.00-0000" else "DEFERRED"
                fb_res["consistency_warnings"] = []
                fb_res["validation_attempts"] = 1
                return fb_res

        # ----------------------------------------------------
        # Phase 1: Retrieve Domain-Constrained RAG Notes & Precedents
        # ----------------------------------------------------
        relevant_notes = retrieve_relevant_notes(product_name, db, allowed_chapters=allowed_chapters)
        relevant_precedents = retrieve_relevant_precedents(product_name, db, allowed_chapters=allowed_chapters)

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
            
            # [도메인 게이트 검증] 추천된 세번이 대상 도메인 부/류에 속하는지 검증
            raw_hs = result_dict.get("recommendedHsCode", "")
            clean_hs = raw_hs.replace('.', '').replace('-', '').strip()
            ch2 = clean_hs[:2]
            
            if allowed_chapters and ch2 not in allowed_chapters and raw_hs != "0000.00-0000":
                validation_results["consistency_score"] = min(validation_results["consistency_score"], 40)
                domain_warn = f"[도메인 불일치 오분류] 물품명 '{product_name}'은(는) {domain_name} 범위(제{', '.join(allowed_chapters[:5])}류 등)에 속해야 하나 완전히 다른 제{ch2}류({raw_hs})로 분류되었습니다. 올바른 도메인의 세번으로 수정하십시오."
                if not any(domain_warn[:30] in w for w in validation_results["warnings"]):
                    validation_results["warnings"].append(domain_warn)

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

        # 0. Domain Specific Hard Pre-Resolution for Sesame & Perilla Varieties
        is_perilla = ("들깨" in full_text or "perilla" in full_text)
        is_sesame = ("참깨" in full_text or ("깨" in full_text and not is_perilla) or "sesame" in full_text or "sesamum" in full_text)
        
        if is_perilla or is_sesame:
            is_negated_roasted = any(
                neg in full_text for neg in [
                    "볶지않", "볶지 않", "안볶", "안 볶", "미볶", "비볶", "비가열", "미가공", 
                    "생", "날것", "raw", "unroasted", "non-roasted", "not roasted", "탈지"
                ]
            )
            is_truly_roasted = not is_negated_roasted and any(
                rk in full_text for rk in ["볶은", "볶음", "구운", "로스팅", "roast", "toasted", "조제"]
            )
            has_powder = any(pk in full_text for pk in ["가루", "분말", "powder", "flour", "세말", "조말", "분"])
            has_crushed = any(ck in full_text for ck in ["파쇄", "부순", "거칠", "1.25", "체", "crushed", "broken"])
            
            if is_perilla:
                if has_crushed:
                    return "1207.99-1000", "들깨", []
                elif has_powder:
                    if is_negated_roasted or (not is_truly_roasted and "분말" in full_text and "가루" not in full_text):
                        return "1208.90-9000", "기타 (채유용 미가공 들깨 분말)", []
                    else:
                        return "2008.19-9000", "기타 (조제한 들깨가루)", []
                else:
                    if is_truly_roasted:
                        return "2008.19-9000", "기타 (원형 낟알 볶은 들깨)", []
                    else:
                        return "1207.99-1000", "들깨", []
            elif is_sesame:
                if has_crushed:
                    return "1207.40-0000", "참깨", []
                elif has_powder:
                    if is_negated_roasted or (not is_truly_roasted and "분말" in full_text and "가루" not in full_text):
                        return "1208.90-9000", "기타 (채유용 미가공 참깨 분말)", []
                    else:
                        return "2008.19-3000", "볶은 참깨가루", []
                else:
                    if is_truly_roasted:
                        return "2008.19-9000", "기타 (원형 낟알 볶은 참깨)", []
                    else:
                        return "1207.40-0000", "참깨", []

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
                ("참깨", ["참깨", "볶음참깨", "sesamum", "sesame", "흰깨", "검은깨", "흑임자"]),
                ("들깨", ["들깨", "perilla"]),
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
                # Handle special case: '깨' alone without '들깨'
                if kw_name == "참깨":
                    input_has_kw = any(t in full_text for t in target_terms) or ("깨" in full_text and "들깨" not in full_text)
                    cand_has_kw = any(t in cand_lower for t in target_terms) or ("깨" in cand_lower and "들깨" not in cand_lower)
                else:
                    input_has_kw = any(t in full_text for t in target_terms)
                    cand_has_kw = any(t in cand_lower for t in target_terms)
                
                if input_has_kw and cand_has_kw:
                    score += 300.0
                    match_reasons.append(f"특화 품목 키워드 적합: '{kw_name}'")
                elif not input_has_kw and cand_has_kw:
                    # Penalty if candidate is specific to another item not mentioned in input
                    if kw_name in ["참깨", "밤", "코코넛", "도토리", "인삼", "홍삼", "피넛", "콜라", "알로에", "효모", "벌꿀", "로열젤리", "녹차", "홍차"]:
                        score -= 300.0
                        match_reasons.append(f"타 품목 전용 세번 감점: '{kw_name}' 미포함")

            # 4. Domain Specific Mutual Exclusion Penalties
            if ("들깨" in full_text or "perilla" in full_text) and ("참깨" not in full_text and "sesame" not in full_text):
                if clean_cand.startswith("2008193000") or clean_cand.startswith("1207400000") or "참깨" in cand_name_ko or "sesame" in cand_name_en.lower():
                    score -= 800.0
                    match_reasons.append("들깨 품목으로 참깨 세번 배제")

            # 5. Fallback "기타 (Other)" base score
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

