import re

class HSConsistencyValidator:
    """
    WCO General Rules for Interpretation (GRI) and Note Exclusion validation engine.
    Ensures legal coherence of the final HS Code classification.
    """
    
    # Mutual exclusion mappings between chapters/headings
    EXCLUSION_RULES = [
        {
            "target_chapter": "95",  # Toys & Games
            "excluded_chapters": ["84", "85", "87"],  # No heavy machinery, electric motors, or passenger vehicles
            "exception_keywords": ["작동", "완구용", "장난감", "배터리식", "미니어처", "인형"],
            "error_msg": "제95류(완구) 분류 시, 산업용/상업용 기계류(제84/85류) 또는 승용차량(제87류)의 성격이 강하면 일반 기계나 차량으로 분류되어야 합니다."
        },
        {
            "target_chapter": "94",  # Furniture & Prefabricated buildings
            "excluded_headings": ["7308"],  # No structural steelworks
            "exception_keywords": ["선반", "캐비닛", "서랍장", "책상", "의자"],
            "error_msg": "제94류(가구)는 고정식 철강 구조물(제7308호)과 구분되어야 합니다. 영구 고정식 교량/탑 등은 가구에서 제외됩니다."
        },
        {
            "target_chapter": "70",  # Glassware
            "excluded_headings": ["7020", "9503"],  # No double-walled vacuum flasks or toy glassware
            "exception_keywords": ["음료용", "텀블러", "식탁용", "주방용"],
            "error_msg": "제7013호(유리제품)는 보온병용 유리 내벽(제7020호) 및 완구용 제품(제95류)을 제외합니다."
        },
        {
            "target_chapter": "19",  # Pasta & Flour preparations
            "excluded_chapters": ["21", "02"],  # No pure meat products or coffee extracts
            "exception_keywords": ["파스타", "면", "스파게티", "마카로니"],
            "error_msg": "제1902호(파스타)는 육류 함량이 20%를 초과하는 조제품(제16류) 또는 커피 혼합물을 함유한 제품은 제외됩니다."
        }
    ]

    @staticmethod
    def validate_gri_path(applied_gris: list, productName: str, material: str, legalReasoning: str) -> tuple:
        """
        Validates if the reasoning aligns with the declared GRI (통칙) path.
        Returns: (is_valid: bool, score_deduction: int, warning_msg: str)
        """
        query_text = (productName + " " + material + " " + legalReasoning).lower()
        score_deduction = 0
        warnings = []

        # Rule A: If GRI 3(b) (통칙 제3호 나목 - 복합 재질) is declared, check for compound descriptions
        has_gri3b = any("3호" in g and "나" in g for g in applied_gris) or any("3호나" in g for g in applied_gris)
        if has_gri3b:
            # Check for multiple materials or compound indicators (%, and, 스텐, 유리, 혼합, 결합 등)
            compound_indicators = ["%", "와 ", "과 ", "혼합", "결합", "복합", "함유", "플레이트", "조립"]
            if not any(ind in query_text for ind in compound_indicators):
                score_deduction += 25
                warnings.append("통칙 제3호 나목(복합물/혼합물)이 선언되었으나, 재질 사양에 복합 성분 설명이 누락되어 있습니다.")

        # Rule B: If GRI 2(a) (통칙 제2호 가목 - 미완성/미조립) is declared, verify indications of disassembly
        has_gri2a = any("2호" in g and "가" in g for g in applied_gris) or any("2호가" in g for g in applied_gris)
        if has_gri2a:
            disassembly_indicators = ["미조립", "분해", "미완성", "완성되지 않은", "조립식", "kd"]
            if not any(ind in query_text for ind in disassembly_indicators):
                score_deduction += 20
                warnings.append("통칙 제2호 가목(미완성/미조립)이 선언되었으나, 제품 설명에 미조립/분해 상태의 조율 근거가 부족합니다.")

        # Rule C: If only GRI 1 is applied but reasoning invokes compound splitting, note the contradiction
        has_only_gri1 = len(applied_gris) == 1 and ("1호" in applied_gris[0])
        if has_only_gri1 and ("본질적 특성" in query_text or "혼합물" in query_text):
            score_deduction += 15
            warnings.append("통칙 제1호만 선언되었으나, 법적 리즈닝 내용 중에 통칙 제3호(본질적 특성) 판단 논리가 혼용되어 있습니다.")

        return len(warnings) == 0, score_deduction, " | ".join(warnings)

    @staticmethod
    def check_exclusions(hs_code: str, productName: str, material: str) -> tuple:
        """
        Validates the HS Code against Chapter and Heading mutual exclusion rules.
        Returns: (is_valid: bool, score_deduction: int, warning_msg: str)
        """
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        if len(clean_code) < 4:
            return True, 0, ""

        chapter = clean_code[:2]
        heading = clean_code[:4]
        
        query_text = (productName + " " + material).lower()
        score_deduction = 0
        warnings = []

        for rule in HSConsistencyValidator.EXCLUSION_RULES:
            # Check Chapter Exclusions
            if chapter == rule.get("target_chapter"):
                for excl_ch in rule.get("excluded_chapters", []):
                    # If query text implies an excluded chapter keyword heavily but lacks exceptions
                    if excl_ch == "84" and ("기계" in query_text or "모터" in query_text or "엔진" in query_text):
                        if not any(exc in query_text for exc in rule["exception_keywords"]):
                            score_deduction += 35
                            warnings.append(rule["error_msg"])
                            break
                            
            # Check Heading Exclusions
            if heading in rule.get("excluded_headings", []):
                # If target heading overlaps with exclusion criteria
                score_deduction += 40
                warnings.append(rule["error_msg"])

        return len(warnings) == 0, score_deduction, " | ".join(warnings)

    @classmethod
    def compute_consistency_score(cls, classification_data: dict) -> dict:
        """
        Computes the final HS Code classification consistency rating.
        Input: dict with recommendedHsCode, appliedGris, legalReasoning, product_name, material
        Output: dict with consistency_score, status, warnings list
        """
        hs_code = classification_data.get("recommendedHsCode", "")
        applied_gris = classification_data.get("appliedGris", [])
        legal_reasoning = classification_data.get("legalReasoning", "")
        product_name = classification_data.get("product_name", "")
        material = classification_data.get("material", "")

        base_score = 100
        warnings = []

        # 1. Check GRI logic alignment
        _, gri_deduct, gri_warn = cls.validate_gri_path(applied_gris, product_name, material, legal_reasoning)
        if gri_deduct > 0:
            base_score -= gri_deduct
            warnings.append(f"[GRI 모순] {gri_warn}")

        # 2. Check Note Exclusions
        _, excl_deduct, excl_warn = cls.check_exclusions(hs_code, product_name, material)
        if excl_deduct > 0:
            base_score -= excl_deduct
            warnings.append(f"[제외조항 저촉] {excl_warn}")

        # 3. Check HS Code length format
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        if not re.match(r'^\d{4}(\.\d{2})?(\-\d{4})?$', hs_code) and clean_code != "0000000000":
            base_score -= 10
            warnings.append("[코드 규격] 추천된 HS Code 포맷(10단위)이 표준 규격에 어긋납니다.")

        # Cap minimum score at 0
        final_score = max(0, base_score)
        
        status = "정합성 확실 (상)"
        if final_score < 60:
            status = "정합성 불능 (하) - 검토 보류"
        elif final_score < 85:
            status = "정합성 검토 필요 (중)"

        return {
            "consistency_score": final_score,
            "status": status,
            "warnings": warnings
        }
