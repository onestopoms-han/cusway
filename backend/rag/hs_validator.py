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
            "exception_keywords": ["작동", "완구용", "장난감", "배터리식", "미니어처", "인형", "완구용자전거", "완구용퍼즐", "유희용"],
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
        },
        {
            "target_chapter": "33",  # Cosmetics
            "excluded_chapters": ["34", "38"],  # Impregnated paper/wipes with soap or disinfectant
            "exception_keywords": ["화장용", "클렌징", "메이크업", "피부세정"],
            "error_msg": "제33류(조제화장품/물티슈)는 비누나 계면활성제를 침투시킨 물티슈(제3401호) 또는 알코올/소독제를 침투시킨 물티슈(제3808호)를 제외합니다."
        },
        {
            "target_chapter": "39",  # Plastics
            "excluded_headings": ["7117", "9503"],  # No plastic toy/accessory imitation jewelry
            "exception_keywords": ["포장재", "산업용", "건축용", "시트", "필름", "점착테이프", "펠릿", "수지"],
            "error_msg": "제3926호(기타 플라스틱 제품)는 플라스틱제 완구/인형(제9503호) 또는 모조 신변장식용품(제7117호)을 제외하며, 이들은 해당 전용 호로 우선 분류됩니다."
        },
        {
            "target_chapter": "03",  # Fish, crustaceans, molluscs (Uncooked/raw)
            "excluded_chapters": ["16", "21"],  # Prepared or cooked seafood belongs to Chapter 16 or 21
            "exception_keywords": ["생물", "활어", "신선", "냉장", "단순냉동", "원형", "통어류", "필레", "미조리", "염장", "건조", "훈제"],
            "error_msg": "제3류(어류·갑각류·연체동물)는 조리(열처리: 볶음, 튀김, 구이, 찜 등)되거나 조제된 물품을 제외합니다(제3류 주 제1호 나목). 조리·볶음된 해물/수산물은 제16류(1604호 또는 1605호)나 제21류(조제 식료품)로 분류되어야 합니다."
        },
        {
            "target_chapter": "87",  # Vehicles parts
            "excluded_headings": ["8483", "8511", "8512"],  # Specific machinery parts prioritized over vehicle parts (17부 주2호 마목)
            "exception_keywords": ["범퍼", "섀시", "차체", "핸들", "브레이크"],
            "error_msg": "제8708호(차량용 부분품)는 범용 기계요소인 전동축, 기어 장치, 볼스크류(제8483호) 및 시동용 전기 기기(제8511호)를 제외하며, 이들은 해당 기계류 호에 최우선적으로 분류됩니다."
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
                    # Check Machinery exclusion in Toys
                    if excl_ch in ["84", "85", "87"] and ("기계" in query_text or "모터" in query_text or "엔진" in query_text or "차량" in query_text):
                        if not any(exc in query_text for exc in rule["exception_keywords"]):
                            score_deduction += 35
                            warnings.append(rule["error_msg"])
                            break
                    # Check Soap/Disinfectant exclusion in Cosmetics
                    elif excl_ch in ["34", "38"] and ("비누" in query_text or "세제" in query_text or "세척" in query_text or "소독" in query_text or "살균" in query_text or "알코올" in query_text):
                        if not any(exc in query_text for exc in rule["exception_keywords"]):
                            score_deduction += 35
                            warnings.append(rule["error_msg"])
                            break
                    # Check Cooked/Prepared Seafood exclusion in Chapter 3
                    elif excl_ch in ["16", "21"] and ("볶음" in query_text or "조리" in query_text or "튀김" in query_text or "구이" in query_text or "양념" in query_text or "가열" in query_text or "조제" in query_text):
                        if not any(exc in query_text for exc in ["단순냉동", "생물", "활어", "신선", "미조리"]):
                            score_deduction += 50
                            warnings.append(rule["error_msg"])
                            break
                            
            # Check Heading Exclusions (Ensure target chapter matches before checking excluded heading)
            if chapter == rule.get("target_chapter"):
                if heading in rule.get("excluded_headings", []):
                    # 3926호 플라스틱 제품으로 판정하려 하나 장난감/장신구 키워드가 매치될 때
                    if rule.get("target_chapter") == "39" and ("완구" in query_text or "장난감" in query_text or "인형" in query_text or "장신구" in query_text or "액세서리" in query_text):
                        if not any(exc in query_text for exc in rule["exception_keywords"]):
                            score_deduction += 40
                            warnings.append(rule["error_msg"])
                    # 8708호 차량 부품으로 판정하려 하나 볼스크류/샤프트/기어(8483) 키워드가 매치될 때
                    elif rule.get("target_chapter") == "87" and ("볼스크류" in query_text or "샤프트" in query_text or "기어" in query_text or "전동축" in query_text):
                        if not any(exc in query_text for exc in rule["exception_keywords"]):
                            score_deduction += 40
                            warnings.append(rule["error_msg"])
                    # 기타 일반적 매핑 제외
                    else:
                        score_deduction += 30
                        warnings.append(rule["error_msg"])

        return len(warnings) == 0, score_deduction, " | ".join(warnings)

    @classmethod
    def check_semantic_consistency(cls, hs_code: str, productName: str, material: str) -> tuple:
        """
        Checks if the recommended HS Code chapter semantically matches the product name/materials.
        Returns: (is_valid: bool, score_deduction: int, warning_msg: str)
        """
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        if len(clean_code) < 2 or clean_code.startswith("00"):
            return True, 0, ""
        if len(clean_code) < 2:
            return True, 0, ""
            
        chapter = clean_code[:2]
        query_text = (productName + " " + material).lower()
        score_deduction = 0
        warnings = []
        
        # 1. Food keywords mapped to Non-Food chapters
        food_keywords = ["파스타", "스파게티", "국수", "누들", "식료품", "빵", "과자", "초콜릿", "밀가루", "전분", "곡물"]
        has_food_keyword = any(k in query_text for k in food_keywords)
        
        if has_food_keyword and not any(m in query_text for m in ["기계", "장치", "기구", "로봇", "로보트", "드론", "프린터", "수확", "탈곡", "도정", "제조기"]):
            chapter_int = int(chapter) if chapter.isdigit() else 0
            if chapter_int > 24 and chapter_int != 95:
                score_deduction += 45
                warnings.append(f"식품/조리 가공식품 키워드가 감지되었으나 기계/화학 등 제{chapter}류로 분류되었습니다.")
            elif chapter == "04" and any(k in query_text for k in ["파스타", "스파게티", "국수", "누들", "빵", "과자"]):
                score_deduction += 45
                warnings.append("면류/파스타/빵류 제품이 단순 낙농품 및 조류의 알(제04류)로 분류되었습니다.")

        # 2. Machinery/Electronics keywords mapped to Food/Agriculture chapters
        machinery_keywords = ["기계", "모터", "엔진", "pcb", "회로", "센서", "로봇", "전자기기", "펌프"]
        has_machinery_keyword = any(k in query_text for k in machinery_keywords)
        if has_machinery_keyword:
            chapter_int = int(chapter) if chapter.isdigit() else 99
            if chapter_int <= 24:
                score_deduction += 45
                warnings.append(f"기계/전자기기 관련 단어가 감지되었으나 농축수산물/식품류(제{chapter}류)로 분류되었습니다.")

        # 3. Standalone sensor keywords mapped to vehicle parts (8708) or construction machinery (8430)
        from backend.rag.sensor_classifier import is_sensor_query
        is_complex_system = any(v in query_text for v in ["로봇", "robot", "agv", "amr", "비행체", "항공기", "잠수정", "선박", "차량", "가구", "인형", "완구"])
        if is_sensor_query(query_text) and not is_complex_system:
            if chapter in ["87", "86", "88", "89", "94", "95"] or clean_code.startswith("8430"):
                score_deduction += 50
                warnings.append(f"독립된 센서/계측기기 물품은 제16부 주 제1호 마목 및 제17부 주 제2호 사목에 의해 완제품 부품(제{chapter}류)이나 건설기계(제8430호)에서 배제되고 제90류(제9025~9031호) 또는 제85류로 분류되어야 합니다.")

        # 4. Medical Endoscope / Diagnostics mapped to Food (Chapters 01~24)
        if any(med in query_text for med in ["내시경", "혈당", "진단기", "의료기기", "수술"]) and chapter.isdigit() and int(chapter) <= 24:
            score_deduction += 60
            warnings.append(f"의료/진단/내시경 기기 물품이 농축수산물/조제식료품(제{chapter}류)으로 심각하게 오분류되었습니다. 제90류(제9018호 등)로 재분류하십시오.")

        # 5. Aircraft / Vessels / Complex Vehicles mapped to raw components (Battery 8507, Carbon fiber 6815)
        if any(veh in query_text for veh in ["uam", "비행체", "항공기", "자율비행", "잠수정", "auv"]) and clean_code.startswith(("8507", "6815")):
            score_deduction += 60
            warnings.append(f"수송용 완성 비행체/잠수정 물품은 탑재 배터리(8507)나 외장재(6815)가 아닌 수송기기(제88류/제89류)로 분류되어야 합니다.")

        # 6. Machinery / Feeder vs Processed target objects (Section XVI vs Chapter 73)
        if any(m in query_text for m in ["공급기", "피더기", "정렬기", "선별기"]) and clean_code.startswith("7318"):
            score_deduction += 60
            warnings.append("부품 정렬/공급 피더 장치는 체결 대상물인 볼트/너트(제7318호)가 아니라 고유한 기능을 가진 기계류인 제8479호 또는 운반기계 제8428호로 분류되어야 합니다.")

        # 7. Chemical salts & powders vs Downstream finished articles (Section VI vs Section XVI / Chapter 33)
        if any(k in query_text for k in ["전해질 염", "전해질염", "리튬염", "lipf6", "lifsi"]) and clean_code.startswith("8507"):
            score_deduction += 60
            warnings.append("이차전지 전해질 염 원료는 제16부 주 제1호 가목에 따라 축전지 완제품(제8507호)에서 제외되며 무기염 제2835호 또는 제2853호/제3824호로 분류되어야 합니다.")

        if any(k in query_text for k in ["세라마이드", "아데노신", "나노 분말", "원료 분말"]) and "화장품" in query_text and clean_code.startswith("3304"):
            score_deduction += 60
            warnings.append("화장품 제조 배합용 단일 유기화합물 원료 분말은 제33류 주 제3호에 따라 완제 화장품(제3304호)에서 제외되며 유기화합물 제2924호 또는 제2942호로 분류되어야 합니다.")

        if any(k in query_text for k in ["pbat", "생분해"]) and clean_code.startswith("2905"):
            score_deduction += 60
            warnings.append("생분해성 PBAT 공중합 수지 펠릿은 단일 알코올(제2905호)이 아니라 폴리에스테르 수지 1차제품 제3907호로 분류되어야 합니다.")

        if any(k in query_text for k in ["카본블랙", "백금"]) and any(k in query_text for k in ["담지", "촉매"]) and clean_code.startswith("2803"):
            score_deduction += 60
            warnings.append("백금 등 귀금속이 담지된 촉매는 카본블랙 원자재(제2803호)가 아니라 담지 촉매 제3815호로 분류되어야 합니다.")

        # 8. Measurement / Scale vs Wireless communications (GRI 3(b) Essential Character)
        if any(k in query_text for k in ["체중계", "체지방계", "체지방 체중계"]) and clean_code.startswith("8517"):
            score_deduction += 60
            warnings.append("무선통신 기능이 결합된 스마트 체중계/체지방계는 통칙 제3호(나)에 따라 주 기능인 중량 계량기기 제8423호로 분류되어야 합니다.")

        # 9. Medical sutures vs General surgical instruments (Chapter 30 Note 4(a))
        if "봉합사" in query_text and clean_code.startswith("9018"):
            score_deduction += 60
            warnings.append("외과 수술용 멸균 봉합재(바늘 일체형 포함)는 제30류 주 제4호 가목에 따라 외과용 기기(제9018호)가 아니라 의료용품 제3006호로 분류되어야 합니다.")

        # 10. Agricultural / Food raw vs Extracts & Beverages (Chapters 09, 15, 22 vs 21, 08, 20)
        if any(k in query_text for k in ["가루 녹차", "가루녹차", "말차", "잎 100%"]) and clean_code.startswith("2101"):
            score_deduction += 60
            warnings.append("단순 분쇄 찻잎 100% 분말은 추출 공정이 없으므로 인스턴트 추출물(제2101호)이 아니라 차 제0902호로 분류되어야 합니다.")

        if any(k in query_text for k in ["아몬드 밀크", "식물성 밀크", "아몬드 음료"]) and clean_code.startswith("2008"):
            score_deduction += 60
            warnings.append("소매용 액상 식물성 밀크 음료는 조제 견과류(제2008호)가 아니라 기타 비알코올성 음료 제2202호로 분류되어야 합니다.")

        if any(k in query_text for k in ["아보카도 오일", "아보카도유", "아보카도 기름"]) and clean_code.startswith("0804"):
            score_deduction += 60
            warnings.append("압착 식물성 아보카도 오일은 신선/건조 과실(제0804호)이 아니라 기타 식물성 고정유 제1515호로 분류되어야 합니다.")

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

        # 2b. Check Semantic Consistency
        _, sem_deduct, sem_warn = cls.check_semantic_consistency(hs_code, product_name, material)
        if sem_deduct > 0:
            base_score -= sem_deduct
            warnings.append(f"[대분류 모순] {sem_warn}")

        # 3. Check HS Code length format
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        if not re.match(r'^\d{4}(\.\d{2})?(\-\d{4})?$', hs_code) and clean_code != "0000000000":
            base_score -= 10
            warnings.append("[코드 규격] 추천된 HS Code 포맷(10자리)이 표준 규격에서 어긋납니다.")

        # Cap minimum score at 0
        final_score = max(0, base_score)
        
        status = "적합성 확실 (상)"
        if final_score < 60:
            status = "적합성 불능 (하 - 검토 보류)"
        elif final_score < 85:
            status = "적합성 검토 필요 (중)"

        return {
            "consistency_score": final_score,
            "status": status,
            "warnings": warnings
        }
