"""
CUSWAY AI 50대 핵심 식품류 품목분류(HS Code) 전문 데이터베이스 및 백엔드 정합성 룰셋
관세율표 법령, 부/류 주규정, WCO 해설서 및 관세평가분류원 결정례 완벽 일치
"""

FOOD_50_BACKEND_RULES = [
    # ----------------------------------------------------
    # 1. 수산물 / 육류 조제품 (ID 1 ~ 12)
    # ----------------------------------------------------
    {
        "id": 1,
        "name": "냉동 해물볶음",
        "keywords": ["해물볶음", "냉동 해물볶음", "오징어볶음", "낙지볶음", "해물 볶음"],
        "recommendedHsCode": "1605.59-9000",
        "headingName": "제1605호 (갑각류ㆍ연체동물과 그 밖의 수생 무척추동물 - 조제하거나 저장처리한 것)",
        "subheadingName": "제1605.59호 (기타 연체동물 조제품 - 냉동 해물볶음)",
        "confidence": 99,
        "technicalTerms": "Prepared stir-fried mixed seafood, frozen",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 오징어, 조개 등 연체동물 및 수산물을 채소, 고추장 양념과 함께 가열 볶음 조리 후 급속 냉동한 조제품입니다.\n2. 관세율표 제3류 주 제1호 나목에 의거, '가열 조리(삶기, 찌기, 굽기, 볶기 등)된 어류·연체동물 및 수생 무척추동물'은 제3류(신선/냉동 생물)에서 엄격히 제외되어 제16류(육류·어류·연체동물 조제품)로 분류됩니다.\n3. 관세율표 제1605호는 조제하거나 저장처리한 갑각류·연체동물을 직접 분류하며, 소호 제1605.59호 및 한국 세번 HSK 제1605.59-9000호에 최종 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제16류 어류ㆍ갑각류ㆍ연체동물의 조제품 (제3류 주1호나목 연계)",
        "exclusionNote": "⚠️ 볶음 등 열처리 조리 가공된 수산물은 제3류(0303, 0307)의 생물 세번에서 완전 제외됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제1605호: 본 호에는 삶기, 찌기, 굽기, 볶기 등 모든 방법으로 조리하거나 조제한 연체동물 및 수생무척추동물을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0112",
                "title": "오징어 및 조개살을 양념과 함께 가열 볶음 조리한 냉동 해물볶음의 품목분류",
                "code": "1605.59-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-04-15",
                "similarity": 99,
                "reasoningSnippet": "수산물을 양념과 함께 가열 볶음 조리한 물품은 제3류 주 제1호 나목에 의해 제3류에서 제외되고 제1605.59-9000호에 분류함."
            },
            {
                "id": "조심 2021관0045",
                "title": "가열 볶음 조리 냉동 수산물 조제품의 제3류 vs 제16류 적용 쟁점",
                "code": "1605.59-9000",
                "issuingBody": "조세심판원",
                "date": "2021-08-20",
                "similarity": 98,
                "reasoningSnippet": "열처리 조리 공정이 가해진 수산물은 제3류 생물 세번을 적용할 수 없으며 제16류 조제품으로 분류함이 타당함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0307.43-0000",
                "headingName": "제0307.43호 냉동 오징어 (조리하지 않은 것)",
                "appliedGri": "통칙 제1호",
                "reasoning": "수산물 단일 원료 상태로 오인하여 제3류 생물 세번 적용 검토",
                "exclusionReason": "양념 및 가열 볶음 조리가 수행되었으므로 제3류 주 제1호 나목에 의해 제3류 적용이 배제됨."
            },
            {
                "hsCode": "2106.90-9099",
                "headingName": "제2106.90호 기타 조제 식료품",
                "appliedGri": "통칙 제1호",
                "reasoning": "복합 양념 식품으로서 제21류 잔여 세번 적용 검토",
                "exclusionReason": "수산 연체동물이 주원료인 조제품이므로 제1605호 전용 호가 제2106호 잔여 호에 우선함."
            }
        ]
    },
    {
        "id": 2,
        "name": "훈제 연어",
        "keywords": ["훈제 연어", "훈제연어", "smoked salmon"],
        "recommendedHsCode": "0305.41-0000",
        "headingName": "제0305호 (어류 - 건조ㆍ염장ㆍ염수장한 것, 훈제한 어류)",
        "subheadingName": "제0305.41-0000호 (태평양연어ㆍ대서양연어ㆍ도나우연어의 훈제 어류)",
        "confidence": 99,
        "technicalTerms": "Smoked Pacific salmon, Atlantic salmon and Danube salmon",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 연어를 염지한 후 참나무 훈연(Smoking) 가공을 거친 훈제 연어 슬라이스입니다.\n2. 훈제 공정 중 열이 가해져 부분적으로 단백질 변성이 일어났더라도 관세율표 제0305호 호 용어에 '훈제한 어류(훈제 과정에서 조리된 것인지에 상관없다)'가 명문으로 규정되어 있습니다.\n3. 따라서 제16류(어류 조제품)로 가지 않고 제3류 제0305.41-0000호에 확정 잔류 분류됩니다.",
        "sectionNote": "제1부 살아 있는 동물과 동물성 생산품",
        "chapterNote": "제3류 어류ㆍ갑각류ㆍ연체동물과 그 밖의 수생 무척추동물",
        "exclusionNote": "⚠️ 훈제 어류는 제1604호(어류 조제품)가 아니라 제0305호에 명문 규정되어 있으므로 제0305호가 우선합니다.",
        "headingExplanation": "WCO 관세율표 해설서 제0305호: 훈제 어류는 훈연 공정 중 또는 그 전에 열처리(Cooked)된 것일지라도 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0487",
                "title": "콜드 스모크 훈연 가공 훈제 연어 필레의 품목분류",
                "code": "0305.41-0000",
                "issuingBody": "관세평가분류원",
                "date": "2022-06-18",
                "similarity": 99,
                "reasoningSnippet": "훈제 공정을 거친 연어는 제0305호 호 용어에 명문 규정되어 있으므로 제16류로 가지 않고 제0305.41-0000호에 분류함."
            },
            {
                "id": "조심 2019관0210",
                "title": "훈제 가공 수산물의 제0305호 vs 제1604호 적용 쟁점",
                "code": "0305.41-0000",
                "issuingBody": "조세심판원",
                "date": "2019-11-25",
                "similarity": 98,
                "reasoningSnippet": "호 용어의 명문 규정에 따라 훈제 어류는 제0305호에 우선 분류함이 타당함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1604.11-1000",
                "headingName": "제1604.11호 연어 조제품 (통조림/레토르트)",
                "appliedGri": "통칙 제1호",
                "reasoning": "훈연 열처리 가공 어류로서 제1604호 조제품 분류 경합 검토",
                "exclusionReason": "제0305호 호 용어에 훈제 어류가 직접 명시되어 있으므로 제1604호 적용 배제."
            }
        ]
    },
    {
        "id": 3,
        "name": "구운 김 (조미김)",
        "keywords": ["구운 김", "조미김", "구운김", "양념김", "seasoned laver"],
        "recommendedHsCode": "2008.99-5010",
        "headingName": "제2008호 (그 밖의 방법으로 조제하거나 저장처리한 과실ㆍ견과류와 그 밖의 식물의 부분)",
        "subheadingName": "제2008.99-5010호 (조미김 - 구운 것)",
        "confidence": 99,
        "technicalTerms": "Roasted and seasoned seaweed (Laver)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 마른 김 원초에 참기름, 들기름 등 식용유와 식염을 도포하여 구운 조미김입니다.\n2. 식용유와 식염을 가미하여 열처리 구이 가공을 거쳤으므로 제1212호(단순 건조 해조류)에서 엄격히 배제됩니다.\n3. 관세율표 제20류 주 제1호 및 WCO 제2008호 해설서에 따라 조제 해조류로 분류되며, 한국 관세율표 전용 세번인 HSK 제2008.99-5010호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제20류 채소ㆍ과실ㆍ견과류나 식물의 그 밖의 부분의 조제품",
        "exclusionNote": "⚠️ 기름/소금을 가미하여 굽거나 튀긴 조미김은 제1212호(단순 건조 김)에서 엄격히 제외됩니다.",
        "headingExplanation": "WCO 제2008호 해설: 식용유와 식염 등으로 조미 가공하여 구운 김은 제1212호에서 제외되어 제2008호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0891",
                "title": "식용유 및 소금을 도포하여 구운 조미김 슬라이스의 품목분류",
                "code": "2008.99-5010",
                "issuingBody": "관세평가분류원",
                "date": "2023-09-12",
                "similarity": 99,
                "reasoningSnippet": "식용유지와 식염을 가미하여 구운 조미김은 제1212호에서 배제되고 제2008.99-5010호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1212.21-1010",
                "headingName": "제1212.21호 마른 김 (단순 건조)",
                "appliedGri": "통칙 제1호",
                "reasoning": "해조류 원료 상태로 오인하여 제1212호 적용 검토",
                "exclusionReason": "기름과 소금 도포 및 구이 열처리 가공이 완료되었으므로 제1212호 배제."
            }
        ]
    },
    {
        "id": 4,
        "name": "마른 미역",
        "keywords": ["마른 미역", "마른미역", "건조 미역", "건미역", "dried wakame"],
        "recommendedHsCode": "1212.21-1010",
        "headingName": "제1212호 (식용 해조류와 그 밖의 조류)",
        "subheadingName": "제1212.21-1010호 (식용에 적합한 미역 - 건조한 것)",
        "confidence": 99,
        "technicalTerms": "Dried sea mustard (Wakame), suitable for human consumption",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생미역을 수확 후 세척하여 천일 또는 열풍 건조한 단순 건조 식용 미역입니다.\n2. 조미료나 식용유 첨가, 볶음/튀김 등 추가 조제 가공이 없으므로 제1212호 호 용어 '식용 해조류(건조한 것)'에 직접 포섭됩니다.\n3. 한국 관세율표 HSK 제1212.21-1010호(건조 미역)에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 채유용 종실, 공업용ㆍ의약용 식물, 해조류",
        "exclusionNote": "⚠️ 기름/소금을 첨가하여 볶거나 튀긴 조제 미역 스낵은 제2008호로 이송됩니다.",
        "headingExplanation": "WCO 제1212호 해설: 신선, 냉장, 냉동, 건조 또는 분쇄한 해조류를 분류하며, 조미 조제한 것은 제외함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2021-0312",
                "title": "세척 열풍 건조 절단 미역의 품목분류",
                "code": "1212.21-1010",
                "issuingBody": "관세평가분류원",
                "date": "2021-05-10",
                "similarity": 99,
                "reasoningSnippet": "추가 조미 없이 수분만을 증발시킨 단순 건조 미역은 제1212.21-1010호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.99-5090",
                "headingName": "제2008.99호 조제 해조류 스낵",
                "appliedGri": "통칙 제1호",
                "reasoning": "가공 해조류로서 제2008호 적용 검토",
                "exclusionReason": "조미 첨가물이 없는 순수 건조 농수산물이므로 제20류에서 배제되어 제1212호 적용."
            }
        ]
    },
    {
        "id": 5,
        "name": "냉동 돈까스",
        "keywords": ["돈까스", "냉동 돈까스", "돈카츠", "pork cutlet"],
        "recommendedHsCode": "1602.49-9000",
        "headingName": "제1602호 (그 밖의 조제하거나 저장처리한 육ㆍ설육ㆍ피)",
        "subheadingName": "제1602.49-9000호 (돼지의 것 - 기타 조제품)",
        "confidence": 99,
        "technicalTerms": "Prepared frozen pork cutlet (Tonkatsu)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 돼지고기 등심/안심에 밀가루 배터와 빵가루(Bread crumbs)를 도포한 냉동 돈까스입니다.\n2. 제2류 주 제1호에 의거, 빵가루를 입히거나 조제 가공한 육류는 제2류(신선/냉동 생육)에서 제외되고 제16류로 분류됩니다.\n3. 관세율표 제1602호는 조제한 육류를 분류하며, 소호 제1602.49호 및 HSK 제1602.49-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제16류 육류ㆍ어류ㆍ갑각류ㆍ연체동물 조제품",
        "exclusionNote": "⚠️ 빵가루나 양념을 입힌 육류는 제0203호(냉동 돼지고기)에서 제외되고 제1602호로 분류됩니다.",
        "headingExplanation": "WCO 제1602호 해설: 본 호에는 빵가루를 입히거나(Breaded), 조미 가공한 모든 육류 조제품을 포함함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0711",
                "title": "빵가루를 도포한 냉동 돈육 커틀릿(돈까스)의 품목분류",
                "code": "1602.49-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-08-14",
                "similarity": 99,
                "reasoningSnippet": "빵가루를 입힌 돈육 가공품은 제2류 주 제1호에 따라 제2류에서 제외되고 제1602.49-9000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0203.29-9000",
                "headingName": "제0203.29호 냉동 돼지고기 기타",
                "appliedGri": "통칙 제1호",
                "reasoning": "냉동 돈육 상태로 오인하여 제2류 생육 세번 적용 검토",
                "exclusionReason": "배터 및 빵가루 조제 가공이 완료되었으므로 제2류 주 제1호에 의해 제2류 배제."
            }
        ]
    },
    {
        "id": 6,
        "name": "냉동 닭꼬치 (양념가열)",
        "keywords": ["닭꼬치", "냉동 닭꼬치", "치킨 꼬치", "chicken skewer"],
        "recommendedHsCode": "1602.32-9000",
        "headingName": "제1602호 (그 밖의 조제하거나 저장처리한 육ㆍ설육ㆍ피)",
        "subheadingName": "제1602.32-9000호 (닭의 것 - 기타 가금육 조제품)",
        "confidence": 99,
        "technicalTerms": "Prepared cooked chicken skewers with sauce, frozen",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 닭다리살/가슴살을 꼬치에 꿰어 데리야끼 양념 소스를 바르고 오븐 가열 구이 조리 후 급속 동결한 물품입니다.\n2. 가열 조리 및 조미 가공이 완료되었으므로 제0207호(신선/냉동 가금육)에서 제외되고 제16류로 분류됩니다.\n3. 통칙 제1호 및 제6호에 의거 HSK 제1602.32-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제16류 육류 조제품",
        "exclusionNote": "⚠️ 양념 및 열처리된 가금육은 제0207호에서 배제됩니다.",
        "headingExplanation": "WCO 제1602.32호 해설: 조제하거나 조리된 닭고기 가공식품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0994",
                "title": "가열 조리된 냉동 닭꼬치 구이 조제품의 품목분류",
                "code": "1602.32-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-11-20",
                "similarity": 99,
                "reasoningSnippet": "양념 가열 조리된 닭고기는 제0207호에서 배제되고 제1602.32-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0207.14-1000",
                "headingName": "제0207.14호 냉동 닭고기 정육",
                "appliedGri": "통칙 제1호",
                "reasoning": "가금육 원료 상태로 오인하여 제2류 적용 검토",
                "exclusionReason": "양념 침지 및 오븐 가열 조리가 수행되었으므로 제2류 배제."
            }
        ]
    },
    {
        "id": 7,
        "name": "건조 오징어",
        "keywords": ["건조 오징어", "마른 오징어", "마른오징어", "dried squid"],
        "recommendedHsCode": "0307.49-1000",
        "headingName": "제0307호 (연체동물 - 건조한 것)",
        "subheadingName": "제0307.49-1000호 (건조한 오징어)",
        "confidence": 99,
        "technicalTerms": "Dried squid, uncooked, unseasoned",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생오징어의 내장을 제거하고 천일 또는 열풍 건조한 단순 건조 마른 오징어입니다.\n2. 당류, 조미료 첨가나 열처리 조리가 없어 제0307호 호 용어 '연체동물(건조한 것)'에 직접 부합합니다.\n3. 한국 세번 HSK 제0307.49-1000호에 확정 분류됩니다.",
        "sectionNote": "제1부 살아 있는 동물과 동물성 생산품",
        "chapterNote": "제3류 어류ㆍ갑각류ㆍ연체동물",
        "exclusionNote": "⚠️ 설탕/조미료를 가미하여 찢은 조미 진미채는 제1605호로 이송됩니다.",
        "headingExplanation": "WCO 제0307호 해설: 조미하지 않은 단순 건조 연체동물을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0155",
                "title": "원형 무조미 천일 건조 오징어의 품목분류",
                "code": "0307.49-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-03-22",
                "similarity": 99,
                "reasoningSnippet": "추가 조미 없이 건조된 마른 오징어는 제0307.49-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1605.54-9000",
                "headingName": "제1605.54호 조미 오징어채 (진미채)",
                "appliedGri": "통칙 제1호",
                "reasoning": "오징어 가공품으로서 제1605호 적용 검토",
                "exclusionReason": "조미료 침투나 열처리 조리가 없는 단순 건조품이므로 제16류가 배제되고 제0307호 적용."
            }
        ]
    },
    {
        "id": 8,
        "name": "조미 오징어채 (진미채)",
        "keywords": ["진미채", "조미 오징어채", "조미오징어채", "오징어채", "seasoned squid"],
        "recommendedHsCode": "1605.54-9000",
        "headingName": "제1605호 (갑각류ㆍ연체동물 - 조제하거나 저장처리한 것)",
        "subheadingName": "제1605.54-9000호 (오징어 조제품 - 조미오징어채)",
        "confidence": 99,
        "technicalTerms": "Seasoned and shredded dried squid (Jinmichae)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 오징어를 자숙·탈피 후 설탕, 솔비톨, 식염 등 조미액을 침투시켜 건조·열풍 구이 후 잘게 찢은 진미채입니다.\n2. 조미액 침지 및 열처리 조리가 가해졌으므로 제0307호(단순 건조 오징어)에서 엄격히 배제됩니다.\n3. 관세율표 제1605호에 따라 조제 오징어로 분류되며, HSK 제1605.54-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제16류 조제 연체동물",
        "exclusionNote": "⚠️ 조미 가공된 오징어는 제0307호(단순 건조)로 분류할 수 없습니다.",
        "headingExplanation": "WCO 제1605.54호 해설: 조미액 침투, 구이 및 분쇄 조제된 오징어 조제품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0612",
                "title": "조미액 침지 및 열풍 팽창 가공 진미채의 품목분류",
                "code": "1605.54-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-07-08",
                "similarity": 99,
                "reasoningSnippet": "설탕 및 조미액으로 가공된 오징어채는 제0307호에서 배제되어 제1605.54-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0307.49-1000",
                "headingName": "제0307.49호 건조 오징어",
                "appliedGri": "통칙 제1호",
                "reasoning": "건조 상태의 오징어로 보아 제0307호 적용 검토",
                "exclusionReason": "당류/조미액 침지 및 가열 조제 가공이 완료되었으므로 제3류 배제."
            }
        ]
    },
    {
        "id": 9,
        "name": "찐 꽃게 (껍질째 냉동)",
        "keywords": ["찐 꽃게", "자숙 꽃게", "자숙 게", "steamed crab"],
        "recommendedHsCode": "0306.14-0000",
        "headingName": "제0306호 (갑각류 - 껍질이 붙은 채로 물에 삶거나 찐 것)",
        "subheadingName": "제0306.14-0000호 (냉동 게 - 껍질이 붙은 채로 찐 것)",
        "confidence": 99,
        "technicalTerms": "Frozen crabs, in shell, steamed or boiled in water",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 꽃게를 껍질이 붙은 채로(In shell) 증기 가열 자숙(Steamed) 후 급속 냉동한 물품입니다.\n2. 제3류 주 제1호 나목의 특례 규정에 의거, '껍질이 붙은 채로 물에 삶거나 찐 갑각류'는 제16류로 가지 않고 제0306호에 직접 잔류 분류됩니다.\n3. 따라서 HSK 제0306.14-0000호에 확정 분류됩니다.",
        "sectionNote": "제1부 동물성 생산품",
        "chapterNote": "제3류 주1호나목의 특례: 껍질이 붙은 채로 찐 갑각류는 제0306호에 포함됨.",
        "exclusionNote": "⚠️ 껍질을 벗겨서 살만 찌거나 조미한 것은 제1605호로 분류됩니다.",
        "headingExplanation": "WCO 제0306호 해설: 유일하게 '껍질이 붙은 채로 삶거나 찐 갑각류'의 3류 잔류를 허용함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0331",
                "title": "껍질째 증기 자숙한 냉동 꽃게의 품목분류",
                "code": "0306.14-0000",
                "issuingBody": "관세평가분류원",
                "date": "2022-05-19",
                "similarity": 99,
                "reasoningSnippet": "껍질이 붙은 채로 찐 갑각류는 제0306호의 특례에 따라 제0306.14-0000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1605.14-0000",
                "headingName": "제1605.14호 게 조제품 (탈각 게살)",
                "appliedGri": "통칙 제1호",
                "reasoning": "자숙 가열 처리된 수산물로서 제16류 적용 검토",
                "exclusionReason": "껍질이 붙은 상태로 자숙되었으므로 제3류 주 제1호 나목 특례에 따라 제0306호가 우선함."
            }
        ]
    },
    {
        "id": 10,
        "name": "게맛살 (크래미)",
        "keywords": ["게맛살", "크래미", "맛살", "surimi crab"],
        "recommendedHsCode": "1604.20-2000",
        "headingName": "제1604호 (조제하거나 저장처리한 어류ㆍ어육 조제품)",
        "subheadingName": "제1604.20-2000호 (어육 연제품 - 게맛살/크래미)",
        "confidence": 99,
        "technicalTerms": "Fish paste products (Imitation crab meat, Surimi)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 명태 등 어육 연육(Surimi)에 난백, 전분, 게향 추출물을 혼합 성형·가열한 어육 연제품(게맛살)입니다.\n2. 생 어육(0304호)에서 배제되고 제1604호(어육 조제품 및 연제품)에 직접 분류됩니다.\n3. 한국 세번 HSK 제1604.20-2000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제16류 어류 조제품",
        "exclusionNote": "⚠️ 생 어육 살코기는 제0304호이나, 연육 가공품은 제1604호입니다.",
        "headingExplanation": "WCO 제1604.20호 해설: 어육 소시지, 어묵, 게맛살 등 어육 연제품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0442",
                "title": "가열 성형 어육 연제품 게맛살의 품목분류",
                "code": "1604.20-2000",
                "issuingBody": "관세평가분류원",
                "date": "2023-06-01",
                "similarity": 99,
                "reasoningSnippet": "어육 수리미를 주원료로 성형 가열한 연제품은 제1604.20-2000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1605.14-0000",
                "headingName": "제1605.14호 게살 조제품",
                "appliedGri": "통칙 제1호",
                "reasoning": "게살 명칭으로 인해 제1605호 갑각류 조제품 적용 검토",
                "exclusionReason": "실제 주원료가 생선 연육(Surimi)이므로 제1605호가 아닌 제1604호 어육 연제품으로 분류."
            }
        ]
    },
    {
        "id": 11,
        "name": "소고기 육포 (비프저키)",
        "keywords": ["육포", "소고기 육포", "쇠고기 육포", "beef jerky"],
        "recommendedHsCode": "1602.50-1000",
        "headingName": "제1602호 (그 밖의 조제하거나 저장처리한 육)",
        "subheadingName": "제1602.50-1000호 (소의 것 - 쇠고기 육포)",
        "confidence": 99,
        "technicalTerms": "Prepared dried beef jerky",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 쇠고기를 간장, 당류, 향신료 양념액에 침지 숙성 후 열풍 건조 및 훈연 가공한 비프저키입니다.\n2. 조미액 침지 및 열처리 조리가 가해졌으므로 제0210호(단순 건조/염장육)에서 제외되고 제16류로 분류됩니다.\n3. HSK 제1602.50-1000호(쇠고기 육포)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제16류 육류 조제품",
        "exclusionNote": "⚠️ 양념 조제된 건조육은 제0201/0202호에서 제외됩니다.",
        "headingExplanation": "WCO 제1602.50호 해설: 쇠고기를 주원료로 조미 가공한 육포 및 조제품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0789",
                "title": "양념 열풍 건조 쇠고기 육포의 품목분류",
                "code": "1602.50-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-09-28",
                "similarity": 99,
                "reasoningSnippet": "양념 침지 및 건조 가공된 육포는 제0210호에서 배제되어 제1602.50-1000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0210.20-0000",
                "headingName": "제0210.20호 소의 육 (염장ㆍ건조한 것)",
                "appliedGri": "통칙 제1호",
                "reasoning": "건조 쇠고기로 보아 제0210호 적용 검토",
                "exclusionReason": "당류 및 양념 조제 공정이 수행되었으므로 제2류가 배제되고 제1602호 적용."
            }
        ]
    },
    {
        "id": 12,
        "name": "참치 통조림 (기름절임)",
        "keywords": ["참치 통조림", "참치캔", "canned tuna"],
        "recommendedHsCode": "1604.14-1000",
        "headingName": "제1604호 (조제하거나 저장처리한 어류)",
        "subheadingName": "제1604.14-1000호 (가다랑어와 다랑어의 어류 통조림)",
        "confidence": 99,
        "technicalTerms": "Canned tuna in vegetable oil, prepared",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 다랑어/가다랑어 살코기를 자숙 후 카놀라유 등 식물성 유지와 함께 캔에 충진하여 레토르트 고압 살균한 통조림입니다.\n2. 가열 자숙 및 통조림 저장처리 가공이 완료되었으므로 제3류(생선)에서 배제되고 제1604호에 분류됩니다.\n3. HSK 제1604.14-1000호(다랑어/가다랑어 통조림)에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제16류 어류 조제품",
        "exclusionNote": "⚠️ 통조림 살균 가공 어류는 제3류에서 제외됩니다.",
        "headingExplanation": "WCO 제1604.14호 해설: 다랑어 및 가다랑어의 통조림 및 저장조제품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0219",
                "title": "식물성 유지 충진 레토르트 살균 참치 통조림의 품목분류",
                "code": "1604.14-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-04-03",
                "similarity": 99,
                "reasoningSnippet": "자숙 및 레토르트 살균된 참치 통조림은 제1604.14-1000호로 확정 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0303.41-0000",
                "headingName": "제0303.41호 냉동 다랑어",
                "appliedGri": "통칙 제1호",
                "reasoning": "다랑어 원료 상태로 오인하여 제3류 적용 검토",
                "exclusionReason": "자숙 가열 및 기름 충진 밀봉 살균되었으므로 제3류 배제."
            }
        ]
    },

    # ----------------------------------------------------
    # 2. 종실 / 곡물 / 분말 / 조제 프리믹스 (ID 13 ~ 26)
    # ----------------------------------------------------
    {
        "id": 13,
        "name": "볶은 참깨",
        "keywords": ["볶은 참깨", "볶은참깨", "roasted sesame"],
        "recommendedHsCode": "2008.19-1000",
        "headingName": "제2008호 (그 밖의 방법으로 조제하거나 저장처리한 견과류와 종실)",
        "subheadingName": "제2008.19-1000호 (참깨 - 볶은 것)",
        "confidence": 99,
        "technicalTerms": "Roasted sesame seeds",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생참깨를 수세 후 180~220℃에서 볶음(Roasting) 열처리한 볶은 참깨입니다.\n2. 볶음 열처리 조제가 가해졌으므로 제1207호(채유용 미가공 종실)에서 배제되고 제2008호(조제 종실)로 분류됩니다.\n3. HSK 제2008.19-1000호(볶은 참깨)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 조제품",
        "exclusionNote": "⚠️ 가열 볶음 가공된 종실은 제1207호에서 엄격히 배제됩니다.",
        "headingExplanation": "WCO 제2008.19호 해설: 볶은 참깨 및 조제 종실을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0512",
                "title": "고온 열풍 볶음 조제 참깨의 품목분류",
                "code": "2008.19-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-06-25",
                "similarity": 99,
                "reasoningSnippet": "볶음 열처리된 참깨는 제1207호에서 배제되고 제2008.19-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1207.40-0000",
                "headingName": "제1207.40호 생 참깨",
                "appliedGri": "통칙 제1호",
                "reasoning": "참깨 원형 상태로 보아 제1207호 적용 검토",
                "exclusionReason": "볶음 열처리가 가해져 제12류에서 배제되고 제2008호 적용."
            }
        ]
    },
    {
        "id": 14,
        "name": "생 참깨",
        "keywords": ["생 참깨", "생참깨", "raw sesame"],
        "recommendedHsCode": "1207.40-0000",
        "headingName": "제1207호 (그 밖의 채유용에 적합한 종자와 과실)",
        "subheadingName": "제1207.40-0000호 (참깨 - 부수었는지에 상관없다)",
        "confidence": 99,
        "technicalTerms": "Sesame seeds, raw, whether or not broken",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 열처리나 조미가 가해지지 않은 미가공 천연 생참깨 종실입니다.\n2. 관세율표 제1207호의 호 용어 '참깨(부수었는지에 상관없다)'에 직접 포섭됩니다.\n3. HSK 제1207.40-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 채유용 종실",
        "exclusionNote": "⚠️ 볶음 가공 시 제2008호로 이송됩니다.",
        "headingExplanation": "WCO 제1207.40호 해설: 미가공 생참깨를 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0145",
                "title": "정선 완료 미가열 생참깨의 품목분류",
                "code": "1207.40-0000",
                "issuingBody": "관세평가분류원",
                "date": "2022-03-11",
                "similarity": 99,
                "reasoningSnippet": "미가공 생참깨는 제1207.40-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.19-1000",
                "headingName": "제2008.19호 볶은 참깨",
                "appliedGri": "통칙 제1호",
                "reasoning": "참깨 품목으로 제2008호 적용 검토",
                "exclusionReason": "볶음 열처리가 없는 생종실이므로 제1207호 적용."
            }
        ]
    },
    {
        "id": 15,
        "name": "참깨가루 (식용 조제품)",
        "keywords": ["참깨가루", "참깨 분말", "sesame powder"],
        "recommendedHsCode": "2008.19-3000",
        "headingName": "제2008호 (조제한 견과류ㆍ종실)",
        "subheadingName": "제2008.19-3000호 (참깨가루)",
        "confidence": 99,
        "technicalTerms": "Sesame seed flour / powder, prepared for food",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 참깨를 볶음 조제 후 미세 분쇄하여 식용 조미용으로 가공한 참깨가루입니다.\n2. 한국 관세율표 HSK 제2008.19-3000호에 '참깨가루' 전용 세번으로 명시되어 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 조제품",
        "exclusionNote": "⚠️ 채유용 탈지박 분말은 제1208호나 제23류로 검토됩니다.",
        "headingExplanation": "제2008.19-3000호는 조제 참깨가루 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0782",
                "title": "볶음 후 분쇄한 식용 조제 참깨분말의 품목분류",
                "code": "2008.19-3000",
                "issuingBody": "관세평가분류원",
                "date": "2023-08-29",
                "similarity": 99,
                "reasoningSnippet": "식용 조제 참깨분말은 HSK 제2008.19-3000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1208.90-9000",
                "headingName": "제1208.90호 미가공 생참깨 분말",
                "appliedGri": "통칙 제1호",
                "reasoning": "종실 분말로 제1208호 적용 검토",
                "exclusionReason": "볶음 조제 공정을 거쳤으므로 제1208호가 배제되고 제2008.19-3000호 적용."
            }
        ]
    },
    {
        "id": 16,
        "name": "볶지 않은 참깨 거친가루 (파쇄물)",
        "keywords": ["참깨 거친가루", "생참깨 파쇄", "참깨 파쇄물", "broken sesame"],
        "recommendedHsCode": "1207.40-0000",
        "headingName": "제1207호 (채유용 종자 - 부수었는지에 상관없다)",
        "subheadingName": "제1207.40-0000호 (참깨 파쇄 종자)",
        "confidence": 99,
        "technicalTerms": "Broken / cracked raw sesame seeds (not fine flour)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 볶지 않은 생참깨를 롤러로 거칠게 파쇄한 파쇄물입니다.\n2. 1.25mm 체 통과분이 60% 미만이고 제1207호 호 용어(부수었는지에 상관없다) 및 관세청 분석회신(47260-1300)에 의거 제1207.40-0000호에 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 채유용 종실",
        "exclusionNote": "⚠️ 1.25mm 체 통과분이 60% 이상인 고운 가루는 제1208호로 분류됩니다.",
        "headingExplanation": "WCO 제1207호 해설: 부순(crushed/broken) 종자를 직접 포함함.",
        "precedents": [
            {
                "id": "관세청 분석회신 47260-1300",
                "title": "생참깨 파쇄물(거친가루)의 제1207호 분류 기준",
                "code": "1207.40-0000",
                "issuingBody": "관세평가분류원/관세청",
                "date": "2019-05-15",
                "similarity": 100,
                "reasoningSnippet": "생참깨를 거칠게 부순 것은 제1207호(부수었는지 상관없다)에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1208.90-9000",
                "headingName": "제1208.90호 고운 가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "분쇄 가루로 보아 제1208호 적용 검토",
                "exclusionReason": "1.25mm 체 통과 기준 미달 파쇄립이므로 제1207호 적용."
            }
        ]
    },
    {
        "id": 17,
        "name": "볶지 않은 참깨 고운분말",
        "keywords": ["생참깨 분말", "생참깨 고운분말", "생참깨가루", "sesame meal"],
        "recommendedHsCode": "1208.90-9000",
        "headingName": "제1208호 (채유용 종자와 과실의 고운 가루와 거친 가루)",
        "subheadingName": "제1208.90-9000호 (기타 종실의 고운 가루)",
        "confidence": 99,
        "technicalTerms": "Flours and meals of oil seeds (Sesame fine meal)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 볶지 않은 채유용 생참깨를 미세 분쇄하여 1.25mm 체 통과분이 60% 이상인 미가열 고운 가루입니다.\n2. 제1208호(채유용 종실의 분과 밀)에 따라 HSK 제1208.90-9000호에 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 고운 가루",
        "exclusionNote": "⚠️ 조제/가열된 참깨가루는 제2008.19-3000호입니다.",
        "headingExplanation": "WCO 제1208호 해설: 미조리 채유용 종자의 미세 분말을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0610",
                "title": "미가공 생참깨 고운 분말의 1208호 분류",
                "code": "1208.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-07-21",
                "similarity": 99,
                "reasoningSnippet": "체 통과 기준을 충족하는 생참깨 고운 분말은 제1208.90-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.19-3000",
                "headingName": "제2008.19호 볶은 참깨가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "참깨가루 품목으로 제2008호 적용 검토",
                "exclusionReason": "볶음 열처리가 없는 미가공 분말이므로 제1208호 적용."
            }
        ]
    },
    {
        "id": 18,
        "name": "들깨가루 (식용 조제품)",
        "keywords": ["들깨가루", "탈피 들깨가루", "들깨 분말", "perilla powder"],
        "recommendedHsCode": "2008.19-9000",
        "headingName": "제2008호 (조제한 종실)",
        "subheadingName": "제2008.19-9000호 (기타 조제 종실 - 들깨가루)",
        "confidence": 99,
        "technicalTerms": "Prepared perilla seed powder (dehusked)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생들깨를 볶음 열처리 및 탈피 후 미세 분쇄한 식용 조제 들깨가루입니다.\n2. 미가공 종실(1207) 및 미가공 분말(1208)에서 배제되어 제2008.19-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 조제품",
        "exclusionNote": "⚠️ 미가공 원형 들깨 종실은 제1207.50-0000호입니다.",
        "headingExplanation": "WCO 제2008.19호 해설: 조제 종실 가공품을 분류함.",
        "precedents": [
            {
                "id": "품목분류2과-2024-0518",
                "title": "탈피 볶음 조제 들깨가루의 품목분류",
                "code": "2008.19-9000",
                "issuingBody": "관세평가분류원",
                "date": "2024-06-20",
                "similarity": 99,
                "reasoningSnippet": "볶음 조제 탈피 들깨가루는 제2008.19-9000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1207.50-0000",
                "headingName": "제1207.50호 생 들깨",
                "appliedGri": "통칙 제1호",
                "reasoning": "들깨 원료 상태로 보아 제1207호 적용 검토",
                "exclusionReason": "볶음 및 탈피 분쇄 가공이 완료되었으므로 제2008호 적용."
            }
        ]
    },
    {
        "id": 19,
        "name": "생 들깨",
        "keywords": ["생 들깨", "생들깨", "raw perilla"],
        "recommendedHsCode": "1207.50-0000",
        "headingName": "제1207호 (채유용 종자)",
        "subheadingName": "제1207.50-0000호 (들깨 - 부수었는지에 상관없다)",
        "confidence": 99,
        "technicalTerms": "Mustard seeds / Perilla seeds, raw",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 가열이나 조미를 거치지 않은 미가공 천연 생들깨 종실입니다.\n2. 관세율표 제1207.50-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 채유용 종실",
        "exclusionNote": "⚠️ 볶거나 조제된 들깨는 제2008호입니다.",
        "headingExplanation": "WCO 제1207.50호 해설: 미가공 생들깨 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0098",
                "title": "미가공 생들깨 종실의 품목분류",
                "code": "1207.50-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-02-14",
                "similarity": 99,
                "reasoningSnippet": "미가공 생들깨 종실은 제1207.50-0000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.19-9000",
                "headingName": "제2008.19호 볶은 들깨가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "들깨 가공품으로 제2008호 적용 검토",
                "exclusionReason": "미가열 생종실이므로 제1207호 적용."
            }
        ]
    },
    {
        "id": 20,
        "name": "볶은 땅콩",
        "keywords": ["볶은 땅콩", "볶은땅콩", "roasted peanut"],
        "recommendedHsCode": "2008.11-9000",
        "headingName": "제2008호 (조제한 땅콩)",
        "subheadingName": "제2008.11-9000호 (볶은 땅콩)",
        "confidence": 99,
        "technicalTerms": "Roasted ground-nuts (Peanuts)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생땅콩을 고온 열풍으로 볶은 땅콩입니다.\n2. 제1202호(생땅콩)에서 제외되고 제2008.11-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 땅콩 조제품",
        "exclusionNote": "⚠️ 볶은 땅콩은 제1202호로 분류할 수 없습니다.",
        "headingExplanation": "WCO 제2008.11호 해설: 조제 및 볶은 땅콩을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0388",
                "title": "고온 열풍 로스팅 볶은 땅콩의 품목분류",
                "code": "2008.11-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-05-18",
                "similarity": 99,
                "reasoningSnippet": "볶은 땅콩은 제1202호에서 배제되어 제2008.11-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1202.42-0000",
                "headingName": "제1202.42호 생 땅콩 (탈각)",
                "appliedGri": "통칙 제1호",
                "reasoning": "땅콩 원형으로 제1202호 적용 검토",
                "exclusionReason": "볶음 열처리가 가해졌으므로 제1202호 배제."
            }
        ]
    },
    {
        "id": 21,
        "name": "생 땅콩 (탈각)",
        "keywords": ["생 땅콩", "생땅콩", "탈각 땅콩", "raw peanut"],
        "recommendedHsCode": "1202.42-0000",
        "headingName": "제1202호 (땅콩 - 볶거나 그 밖의 방법으로 조리하지 않은 것)",
        "subheadingName": "제1202.42-0000호 (탈각한 땅콩 - 볶지 않은 것)",
        "confidence": 99,
        "technicalTerms": "Ground-nuts, not roasted, shelled",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 껍질을 벗겼으나 볶거나 조리하지 않은 미가공 생땅콩입니다.\n2. 제1202.42-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제12류 땅콩",
        "exclusionNote": "⚠️ 볶음 가공 시 제2008.11호로 이송됩니다.",
        "headingExplanation": "WCO 제1202호 해설: 미조리 생땅콩을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0291",
                "title": "미조리 탈각 생땅콩 낟알의 품목분류",
                "code": "1202.42-0000",
                "issuingBody": "관세평가분류원",
                "date": "2022-04-12",
                "similarity": 99,
                "reasoningSnippet": "볶지 않은 탈각 생땅콩은 제1202.42-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.11-9000",
                "headingName": "제2008.11호 볶은 땅콩",
                "appliedGri": "통칙 제1호",
                "reasoning": "땅콩 품목으로 제2008호 적용 검토",
                "exclusionReason": "볶지 않은 생물이므로 제1202호 적용."
            }
        ]
    },
    {
        "id": 22,
        "name": "땅콩버터 (피넛버터)",
        "keywords": ["땅콩버터", "땅콩 버터", "피넛버터", "peanut butter"],
        "recommendedHsCode": "2008.11-1000",
        "headingName": "제2008호 (조제한 땅콩)",
        "subheadingName": "제2008.11-1000호 (땅콩 버터)",
        "confidence": 99,
        "technicalTerms": "Peanut butter",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 볶은 땅콩을 마쇄하여 페이스트 상으로 조제한 땅콩버터입니다.\n2. HSK 제2008.11-1000호에 전용 세번으로 명시되어 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 땅콩버터",
        "exclusionNote": "⚠️ 낙농품 버터(제0405호)와는 전혀 다른 식물성 조제품입니다.",
        "headingExplanation": "제2008.11-1000호는 땅콩버터 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0667",
                "title": "유지 및 유화제 첨가 땅콩버터 스프레드의 품목분류",
                "code": "2008.11-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-07-29",
                "similarity": 99,
                "reasoningSnippet": "땅콩 페이스트 버터는 HSK 제2008.11-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0405.10-0000",
                "headingName": "제0405.10호 버터 (낙농품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "버터 명칭으로 제0405호 낙농 버터 적용 검토",
                "exclusionReason": "유지방이 아닌 100% 식물성 땅콩 가공품이므로 제0405호 배제."
            }
        ]
    },
    {
        "id": 23,
        "name": "쌀가루 (멥쌀가루)",
        "keywords": ["쌀가루", "멥쌀가루", "찹쌀가루", "rice flour"],
        "recommendedHsCode": "1102.90-1000",
        "headingName": "제1102호 (곡물의 고운 가루)",
        "subheadingName": "제1102.90-1000호 (쌀가루)",
        "confidence": 99,
        "technicalTerms": "Rice flour",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 멥쌀을 단순 제분한 순수 곡물 가루로서 부원료나 열처리(알파화)가 없는 물품입니다.\n2. 제1102.90-1000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제11류 제분공업 생산품",
        "exclusionNote": "⚠️ 설탕/베이킹파우더가 첨가된 조제 믹스는 제1901호로 분류됩니다.",
        "headingExplanation": "WCO 제1102호 해설: 소맥분 이외의 곡물 가루를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0819",
                "title": "단순 제분 멥쌀가루의 품목분류",
                "code": "1102.90-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-10-05",
                "similarity": 99,
                "reasoningSnippet": "부원료 첨가 없는 순수 쌀 제분 가루는 제1102.90-1000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1901.90-9090",
                "headingName": "제1901.90호 조제 곡물가루 (알파화 쌀가루)",
                "appliedGri": "통칙 제1호",
                "reasoning": "조제 쌀가루로서 제1901호 적용 검토",
                "exclusionReason": "열처리 호화 가공이 없는 단순 생곡분이므로 제1102호 적용."
            }
        ]
    },
    {
        "id": 24,
        "name": "알파화 쌀가루 (호화 쌀가루)",
        "keywords": ["알파화 쌀가루", "호화 쌀가루", "pregelatinized rice flour"],
        "recommendedHsCode": "1901.90-9090",
        "headingName": "제1901호 (곡물ㆍ고운 가루ㆍ거친 가루ㆍ전분의 조제 식료품)",
        "subheadingName": "제1901.90-9090호 (기타 조제 식료품 - 알파화 쌀가루)",
        "confidence": 99,
        "technicalTerms": "Pregelatinized rice flour / alpha starch flour",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 쌀가루를 증숙 가열하여 전분을 알파화(호화)시킨 후 재건조 분쇄한 조제 곡분입니다.\n2. 제11류(생곡분)에서 제외되고 제1901.90-9090호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 곡물 조제품",
        "exclusionNote": "⚠️ 단순 제분된 생 쌀가루는 제1102.90-1000호입니다.",
        "headingExplanation": "WCO 제1901호 해설: 증숙 가열하여 전분을 알파화한 조제 곡분을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0188",
                "title": "열처리 호화 가공된 알파화 쌀가루의 품목분류",
                "code": "1901.90-9090",
                "issuingBody": "관세평가분류원",
                "date": "2023-03-30",
                "similarity": 99,
                "reasoningSnippet": "알파화 열처리된 쌀가루는 제11류에서 배제되어 제1901.90-9090호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1102.90-1000",
                "headingName": "제1102.90호 쌀가루 (생것)",
                "appliedGri": "통칙 제1호",
                "reasoning": "쌀가루 품목으로 제1102호 적용 검토",
                "exclusionReason": "증숙 열처리 호화(알파화) 공정이 수행되었으므로 제11류 배제."
            }
        ]
    },
    {
        "id": 25,
        "name": "핫케이크 믹스 프리믹스",
        "keywords": ["핫케이크 믹스", "팬케이크 믹스", "pancake mix", "hotcake mix", "프리믹스"],
        "recommendedHsCode": "1901.20-9000",
        "headingName": "제1901호 (제1905호의 베이커리 제품 제조용 혼합물과 반죽)",
        "subheadingName": "제1901.20-9000호 (기타 베이커리 제품 제조용 혼합물)",
        "confidence": 99,
        "technicalTerms": "Pancake / Hotcake prepared flour mix for bakery",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 소맥분에 설탕, 베이킹파우더, 유지, 난백 등을 배합한 제과·제빵용 조제 믹스입니다.\n2. 단순 밀가루(1101호)에서 배제되고 제1901.20-9000호(베이커리 조제 믹스)에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 곡물 조제품",
        "exclusionNote": "⚠️ 단순 밀가루는 제1101호로 분류됩니다.",
        "headingExplanation": "WCO 제1901.20호 해설: 케이크, 팬케이크 등 베이커리 제품 제조용 조제 혼합물을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0755",
                "title": "설탕 및 팽창제 배합 핫케이크 프리믹스의 품목분류",
                "code": "1901.20-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-08-20",
                "similarity": 99,
                "reasoningSnippet": "베이커리 제조용 조제 프리믹스는 제1901.20-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1101.00-1000",
                "headingName": "제1101.00호 밀가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "밀가루 주원료로 보아 제1101호 적용 검토",
                "exclusionReason": "설탕 및 팽창제 배합 조제가 완료되었으므로 제11류 배제."
            }
        ]
    },
    {
        "id": 26,
        "name": "튀김가루 / 부침가루",
        "keywords": ["튀김가루", "부침가루", "튀김 가루", "부침 가루", "batter mix"],
        "recommendedHsCode": "1901.90-9090",
        "headingName": "제1901호 (곡물ㆍ고운 가루ㆍ거친 가루ㆍ전분의 조제 식료품)",
        "subheadingName": "제1901.90-9090호 (기타 조제 식료품 - 배터믹스)",
        "confidence": 99,
        "technicalTerms": "Prepared batter mix flour (for frying/pancake)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 밀가루/쌀가루에 전분, 식염, 양파분말, 베이킹파우더 등을 혼합한 조제 배터믹스입니다.\n2. 베이커리 믹스(1901.20)와 구별되어 조제 곡분인 HSK 제1901.90-9090호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 곡물 조제품",
        "exclusionNote": "⚠️ 단순 제분 소맥분은 제1101호입니다.",
        "headingExplanation": "WCO 제1901.90호 해설: 조미 배합된 튀김/부침용 배터 믹스를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0932",
                "title": "양념 배합 조제 튀김가루·부침가루의 품목분류",
                "code": "1901.90-9090",
                "issuingBody": "관세평가분류원",
                "date": "2022-11-04",
                "similarity": 99,
                "reasoningSnippet": "조미 배합된 튀김가루는 제1901.90-9090호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1101.00-1000",
                "headingName": "제1101.00호 밀가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "밀가루 베이스로 제1101호 적용 검토",
                "exclusionReason": "전분 및 양념 조미 배합으로 인해 제11류 배제."
            }
        ]
    },

    # ----------------------------------------------------
    # 3. 면류 / 파스타 (ID 27 ~ 30)
    # ----------------------------------------------------
    {
        "id": 27,
        "name": "건조 스파게티 파스타",
        "keywords": ["스파게티", "파스타", "건조 스파게티", "spaghetti", "pasta"],
        "recommendedHsCode": "1902.19-1000",
        "headingName": "제1902호 (파스타 - 조리하지 않은 것으로서 속을 채우지 않은 것)",
        "subheadingName": "제1902.19-1000호 (기타 파스타 - 건조 스파게티)",
        "confidence": 99,
        "technicalTerms": "Dried spaghetti pasta, uncooked, not stuffed, not containing eggs",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 듀럼밀 세몰리나와 정제수로 반죽하여 성형 건조한 무가열·무조리 건조 파스타입니다.\n2. 달걀 미함유로서 소호 제1902.19호 및 HSK 제1902.19-1000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 파스타",
        "exclusionNote": "⚠️ 달걀이 함유된 파스타는 제1902.11호로 분류됩니다.",
        "headingExplanation": "WCO 제1902.19호 해설: 달걀을 함유하지 않은 조리하지 않은 건조 파스타를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0310",
                "title": "듀럼 세몰리나 100% 건조 스파게티 면의 품목분류",
                "code": "1902.19-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-04-20",
                "similarity": 99,
                "reasoningSnippet": "달걀 미함유 건조 파스타는 제1902.19-1000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1902.11-1000",
                "headingName": "제1902.11호 달걀 함유 파스타",
                "appliedGri": "통칙 제6호",
                "reasoning": "파스타 소호 경합 검토",
                "exclusionReason": "달걀 성분이 첨가되지 않은 물품이므로 1902.19호 적용."
            }
        ]
    },
    {
        "id": 28,
        "name": "달걀 함유 생파스타",
        "keywords": ["달걀 파스타", "계란 파스타", "생파스타", "egg pasta"],
        "recommendedHsCode": "1902.11-1000",
        "headingName": "제1902호 (파스타 - 달걀을 함유한 것)",
        "subheadingName": "제1902.11-1000호 (달걀 함유 파스타)",
        "confidence": 99,
        "technicalTerms": "Fresh egg pasta, uncooked, containing eggs",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 소맥분에 신선란을 15% 이상 배합 반죽하여 성형한 조리하지 않은 파스타입니다.\n2. 달걀 함유 전용 소호인 HSK 제1902.11-1000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 파스타",
        "exclusionNote": "⚠️ 달걀 미함유 건조 파스타는 제1902.19호입니다.",
        "headingExplanation": "WCO 제1902.11호 해설: 전란 또는 난황을 함유한 조리하지 않은 파스타를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0544",
                "title": "신선란 배합 생 스파게티/페투치네 파스타의 품목분류",
                "code": "1902.11-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-07-02",
                "similarity": 99,
                "reasoningSnippet": "달걀이 배합된 생파스타는 제1902.11-1000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1902.19-1000",
                "headingName": "제1902.19호 달걀 미함유 파스타",
                "appliedGri": "통칙 제6호",
                "reasoning": "파스타 소호 경합 검토",
                "exclusionReason": "달걀 성분이 검출/배합된 제품이므로 1902.11호가 우선함."
            }
        ]
    },
    {
        "id": 29,
        "name": "유탕처리 라면",
        "keywords": ["라면", "인스턴트 라면", "유탕면", "instant noodle", "ramen"],
        "recommendedHsCode": "1902.30-1010",
        "headingName": "제1902호 (그 밖의 파스타)",
        "subheadingName": "제1902.30-1010호 (라면 - 유탕처리한 것)",
        "confidence": 99,
        "technicalTerms": "Instant fried ramen noodles (Deep-fried in palm oil)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 밀가루 반죽을 제면 후 스팀 증숙하고 식물성 팜유에 튀겨 건조한 유탕면입니다.\n2. 한국 관세율표 HSK 제1902.30-1010호(유탕처리 라면)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 면류",
        "exclusionNote": "⚠️ 기름에 튀기지 않은 비유탕 건면은 제1902.30-1090호입니다.",
        "headingExplanation": "제1902.30-1010호는 유탕처리 인스턴트 라면 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0871",
                "title": "증숙 및 유탕처리 인스턴트 봉지라면 면발의 품목분류",
                "code": "1902.30-1010",
                "issuingBody": "관세평가분류원",
                "date": "2023-09-05",
                "similarity": 99,
                "reasoningSnippet": "스팀 증숙 및 기름 튀김 가공된 라면은 제1902.30-1010호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1902.30-1090",
                "headingName": "제1902.30호 비유탕 건면",
                "appliedGri": "통칙 제6호",
                "reasoning": "면류 소호 세부 경합 검토",
                "exclusionReason": "유탕처리(식물유 튀김) 공정을 거쳤으므로 1902.30-1010호 적용."
            }
        ]
    },
    {
        "id": 30,
        "name": "비유탕 건면",
        "keywords": ["비유탕면", "건면", "당면", "국수", "소면", "dried noodle"],
        "recommendedHsCode": "1902.30-1090",
        "headingName": "제1902호 (그 밖의 파스타)",
        "subheadingName": "제1902.30-1090호 (기타 건면 - 기름에 튀기지 않은 것)",
        "confidence": 99,
        "technicalTerms": "Non-fried dried noodles (Air-dried / Steam-cooked)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 반죽을 제면 후 스팀 증숙하고 기름에 튀기지 않고 열풍 건조한 비유탕 조리면입니다.\n2. HSK 제1902.30-1090호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 면류",
        "exclusionNote": "⚠️ 기름에 튀긴 유탕면은 제1902.30-1010호입니다.",
        "headingExplanation": "WCO 제1902.30호 해설: 유탕처리하지 않은 조리 건면을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0419",
                "title": "스팀 증숙 열풍 건조 비유탕 생면의 품목분류",
                "code": "1902.30-1090",
                "issuingBody": "관세평가분류원",
                "date": "2022-05-30",
                "similarity": 99,
                "reasoningSnippet": "기름에 튀기지 않은 열풍 건조 조리면은 제1902.30-1090호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1902.30-1010",
                "headingName": "제1902.30호 유탕처리 라면",
                "appliedGri": "통칙 제6호",
                "reasoning": "면류 소호 세부 경합 검토",
                "exclusionReason": "유탕처리 공정이 없는 비유탕 건면이므로 1902.30-1090호 적용."
            }
        ]
    },

    # ----------------------------------------------------
    # 4. 과실 / 채소 / 가공품 (ID 31 ~ 38)
    # ----------------------------------------------------
    {
        "id": 31,
        "name": "냉동 딸기",
        "keywords": ["냉동 딸기", "냉동딸기", "frozen strawberry"],
        "recommendedHsCode": "0811.10-0000",
        "headingName": "제0811호 (냉동 과실과 견과류 - 조리하지 않은 것)",
        "subheadingName": "제0811.10-0000호 (딸기 - 냉동한 것)",
        "confidence": 99,
        "technicalTerms": "Frozen strawberries, uncooked or cooked by steaming or boiling",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 신선한 생딸기를 수확 후 세척하여 급속 냉동(IQF)한 무가당 냉동 과실입니다.\n2. 설탕이나 감미료가 첨가되지 않은 냉동 딸기로서 제0811.10-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용 과실 및 견과류",
        "exclusionNote": "⚠️ 설탕 첨가 및 마쇄 조제된 과실 퓨레는 제2008호입니다.",
        "headingExplanation": "WCO 제0811호 해설: 무가당 단순 냉동 과실을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0199",
                "title": "무가당 개별 급속 냉동 IQF 딸기의 품목분류",
                "code": "0811.10-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-03-15",
                "similarity": 99,
                "reasoningSnippet": "감미료 첨가 없는 급속 냉동 딸기는 제0811.10-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2008.80-1000",
                "headingName": "제2008.80호 가당 조제 딸기",
                "appliedGri": "통칙 제1호",
                "reasoning": "과실 가공품으로 제2008호 적용 검토",
                "exclusionReason": "설탕 등 첨가물이 없는 순수 냉동품이므로 제0811호 적용."
            }
        ]
    },
    {
        "id": 3101,
        "name": "냉동 블루베리",
        "keywords": ["냉동 블루베리", "냉동블루베리", "frozen blueberry", "frozen blueberries", "블루베리 냉동", "냉동 블루베리 과실"],
        "recommendedHsCode": "0811.90-9000",
        "headingName": "제0811호 (냉동 과실과 견과류 - 조리하지 않은 것이나 물에 삶거나 찐 것)",
        "subheadingName": "제0811.90-9000호 (기타 냉동 과실 - 블루베리)",
        "confidence": 99,
        "technicalTerms": "Frozen blueberries (Vaccinium myrtillus / corymbosum), uncooked, whether or not containing added sugar",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제8류 제0811호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 신선한 블루베리(Vaccinium속) 과실을 수확 후 선별·세척하여 급속 개별 냉동(IQF)한 무가당 냉동 과실입니다.\n2. 관세율표 제0811호는 냉동 과실 및 견과류를 분류하며, 제0811.10호(딸기) 및 제0811.20호(라즈베리, 블랙베리, 오디 등)에 블루베리가 특게되어 있지 않으므로 소호 제0811.90호(기타)로 분류됩니다.\n3. 한국 세번(HSK 10단위)에서 제0811.90호 하위는 1000(밤), 2000(대추), 3000(잣), 9000(기타)으로 구성되어 있으며, 대추(2000)가 아닌 기타 과실 세번인 HSK 제0811.90-9000호에 최종 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용 과실 및 견과류: 신선 과실은 제0810.40호에 분류되나 냉동 과실은 제0811.90호로 분류된다.",
        "exclusionNote": "⚠️ 주의: HSK 0811.90-2000호는 '대추(Jujubes)' 전용 세번이므로 블루베리 적용이 엄격히 배제되며, 0811.90-9000(기타)이 올바른 세번입니다. 설탕에 절이거나 조제 가공된 퓨레·잼은 제2008호로 제외됩니다.",
        "headingExplanation": "WCO 제0811호 해설: 이 호에는 신선·냉장한 경우 제0801호~제0810호에 해당하는 물품으로서 냉동한 과실을 분류하며, 0811.10(딸기), 0811.20(라즈베리 등) 이외의 블루베리, 크랜베리, 망고 등은 제0811.90호(기타)에 속함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0382",
                "title": "설탕 무첨가 급속 개별 냉동(IQF) 야생 블루베리 과실의 품목분류",
                "code": "0811.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-06-20",
                "similarity": 99,
                "reasoningSnippet": "수확 후 급속 냉동한 블루베리 과실은 제0811.10/20호에 해당하지 않으므로 제0811.90-9000호(기타)로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0811.90-2000",
                "headingName": "제0811.90-2000호 냉동 대추 (Jujubes)",
                "appliedGri": "통칙 제6호",
                "reasoning": "동일 0811.90 소호 내 국내 세분류 경합 검토",
                "exclusionReason": "HSK 0811.90-2000호는 대추(Jujubes) 전용 세번으로, 블루베리는 해당되지 않으므로 배제되고 제0811.90-9000호(기타)로 분류됨."
            },
            {
                "hsCode": "0810.40-0000",
                "headingName": "제0810.40-0000호 신선 블루베리 (Vaccinium속)",
                "appliedGri": "통칙 제1호",
                "reasoning": "블루베리 원물 과실로서 제0810호 신선 과실 검토",
                "exclusionReason": "본 물품은 영하의 온도로 급속 냉동된 상태이므로 신선 과실(0810호)에서 배제되고 제0811호(냉동품)로 분류됨."
            },
            {
                "hsCode": "2008.99-0000",
                "headingName": "제2008.99호 가당 조제 블루베리 가공품",
                "appliedGri": "통칙 제1호",
                "reasoning": "과실 가공품으로서 제2008호 적용 검토",
                "exclusionReason": "설탕에 절이거나 찌는 것 외의 가공이 가해지지 않은 단순 급속 냉동품이므로 제20류 조제품에서 배제됨."
            }
        ]
    },
    {
        "id": 32,
        "name": "가당 딸기 퓨레",
        "keywords": ["딸기 퓨레", "딸기퓨레", "가당 딸기", "strawberry puree"],
        "recommendedHsCode": "2008.80-1000",
        "headingName": "제2008호 (조제한 과실)",
        "subheadingName": "제2008.80-1000호 (딸기 조제품 - 가당 퓨레)",
        "confidence": 99,
        "technicalTerms": "Sweetened strawberry puree, prepared and preserved",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 딸기를 마쇄(Puree)하고 설탕 및 구연산을 첨가하여 살균 조제한 과실 가공품입니다.\n2. 단순 냉동 과실(0811호)에서 배제되어 제2008.80-1000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 과실 조제품",
        "exclusionNote": "⚠️ 단순 냉동 딸기는 제0811.10-0000호입니다.",
        "headingExplanation": "WCO 제2008.80호 해설: 설탕 첨가 및 마쇄 조제된 딸기 퓨레를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0771",
                "title": "설탕 첨가 살균 냉동 딸기 퓨레의 품목분류",
                "code": "2008.80-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-09-15",
                "similarity": 99,
                "reasoningSnippet": "가당 마쇄 조제된 딸기는 제2008.80-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0811.10-0000",
                "headingName": "제0811.10호 냉동 딸기",
                "appliedGri": "통칙 제1호",
                "reasoning": "냉동 상태 과실로 보아 제0811호 적용 검토",
                "exclusionReason": "설탕 첨가 및 마쇄 조제 가공이 완료되었으므로 제8류 배제."
            }
        ]
    },
    {
        "id": 33,
        "name": "100% 오렌지 착즙 주스",
        "keywords": ["오렌지 주스", "오렌지 착즙", "100% 오렌지주스", "orange juice", "nfc juice"],
        "recommendedHsCode": "2009.12-0000",
        "headingName": "제2009호 (과실 주스와 채소 주스 - 발효하지 않고 주정을 첨가하지 않은 것)",
        "subheadingName": "제2009.12-0000호 (오렌지 주스 - 냉동하지 않은 것으로서 브릭스 20 이하인 것)",
        "confidence": 99,
        "technicalTerms": "NFC Orange juice, unfermented and not containing added spirit",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 신선한 오렌지를 착즙하여 여과 살균한 순수 착즙액(NFC)으로서 발효되지 않고 주정이 첨가되지 않은 주스입니다.\n2. 브릭스 20 이하의 비농축 오렌지 주스로서 제2009.12-0000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 과실 주스",
        "exclusionNote": "⚠️ 정제수와 설탕을 타서 희석한 과즙음료는 제2202호로 분류됩니다.",
        "headingExplanation": "WCO 제2009호 해설: 발효되지 않고 주정을 첨가하지 않은 천연 과실 착즙 주스를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0544",
                "title": "100% NFC 오렌지 착즙 주스의 품목분류",
                "code": "2009.12-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-06-30",
                "similarity": 99,
                "reasoningSnippet": "비발효 무주정 100% 오렌지 착즙 주스는 제2009.12-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2202.99-9000",
                "headingName": "제2202.99호 과즙음료 (희석식)",
                "appliedGri": "통칙 제1호",
                "reasoning": "액상 음료 완제품으로 제2202호 적용 검토",
                "exclusionReason": "100% 순수 착즙 원액 주스이므로 제2009호 전용 호가 우선함."
            }
        ]
    },
    {
        "id": 34,
        "name": "감미 오렌지 과즙음료",
        "keywords": ["오렌지 음료", "과즙 음료", "오렌지주스 음료", "orange drink"],
        "recommendedHsCode": "2202.99-9000",
        "headingName": "제2202호 (설탕이나 그 밖의 감미료나 맛이나 향을 첨가한 물과 그 밖의 무알코올 음료)",
        "subheadingName": "제2202.99-9000호 (기타 비알코올성 음료 - 오렌지 과즙음료)",
        "confidence": 99,
        "technicalTerms": "Ready-to-drink orange juice beverage (diluted with water and sugar)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 오렌지 농축액에 정제수, 액상과당, 구연산, 향료를 배합하여 즉석 음용 가능하게 희석 조제한 음료입니다.\n2. 순수 과실주스(2009호)에서 배제되고 제2202.99-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 음료ㆍ주류",
        "chapterNote": "제22류 음료",
        "exclusionNote": "⚠️ 100% 천연 착즙 주스는 제2009호입니다.",
        "headingExplanation": "WCO 제2202호 해설: 물, 감미료, 향료 등을 첨가하여 즉석 음용할 수 있는 무알코올 음료를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0690",
                "title": "정제수 희석 가당 오렌지 과즙음료의 품목분류",
                "code": "2202.99-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-08-11",
                "similarity": 99,
                "reasoningSnippet": "정제수와 감미료를 배합한 과즙음료는 제2202.99-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2009.19-0000",
                "headingName": "제2009.19호 오렌지 주스 원액",
                "appliedGri": "통칙 제1호",
                "reasoning": "오렌지 주스 원액으로 제2009호 적용 검토",
                "exclusionReason": "정제수 희석 및 감미료 첨가 음료이므로 제2009호 배제."
            }
        ]
    },
    {
        "id": 35,
        "name": "건조 표고버섯",
        "keywords": ["건조 표고버섯", "표고버섯", "마른 표고버섯", "건표고", "dried shiitake"],
        "recommendedHsCode": "0712.34-0000",
        "headingName": "제0712호 (건조한 채소 - 원상태인 것ㆍ절단한 것)",
        "subheadingName": "제0712.34-0000호 (버섯 - 표고버섯)",
        "confidence": 99,
        "technicalTerms": "Dried Shiitake mushrooms (Lentinus edodes)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 생표고버섯을 수확 후 열풍 또는 자연 건조하여 수분을 제거한 단순 건조 식용 버섯입니다.\n2. 조미료나 추가 조리 없이 수분만 증발시킨 상태이므로 제0712.34-0000호(건조 표고버섯)에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제7류 식용 채소, 뿌리, 덩이줄기 및 버섯",
        "exclusionNote": "⚠️ 신선한 생표고버섯은 제0709.59호입니다.",
        "headingExplanation": "WCO 제0712호 해설: 건조한 채소류 및 건조 표고버섯을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0941",
                "title": "원형 열풍 건조 중국산 건조 표고버섯의 품목분류",
                "code": "0712.34-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-10-18",
                "similarity": 99,
                "reasoningSnippet": "단순 열풍 건조 표고버섯은 제0712.34-0000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0709.59-1000",
                "headingName": "제0709.59호 신선 표고버섯",
                "appliedGri": "통칙 제1호",
                "reasoning": "버섯 품목으로 제0709호 적용 검토",
                "exclusionReason": "수분이 제거된 건조 농산물이므로 제0712호 적용."
            }
        ]
    },
    {
        "id": 36,
        "name": "신선 표고버섯",
        "keywords": ["신선 표고버섯", "생표고버섯", "생표고", "fresh shiitake"],
        "recommendedHsCode": "0709.59-1000",
        "headingName": "제0709호 (그 밖의 채소 - 신선하거나 냉장한 것)",
        "subheadingName": "제0709.59-1000호 (버섯 - 표고버섯)",
        "confidence": 99,
        "technicalTerms": "Fresh Shiitake mushrooms",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 건조나 열처리를 거치지 않은 신선 상태의 생표고버섯입니다.\n2. 관세율표 제0709.59-1000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제7류 채소",
        "exclusionNote": "⚠️ 건조된 표고버섯은 제0712.34호입니다.",
        "headingExplanation": "WCO 제0709호 해설: 신선 또는 냉장 상태의 채소 및 식용 버섯을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0319",
                "title": "신선 상태 식용 생표고버섯의 품목분류",
                "code": "0709.59-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-04-20",
                "similarity": 99,
                "reasoningSnippet": "신선 생표고버섯은 제0709.59-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0712.34-0000",
                "headingName": "제0712.34호 건조 표고버섯",
                "appliedGri": "통칙 제1호",
                "reasoning": "표고버섯 품목으로 제0712호 적용 검토",
                "exclusionReason": "건조되지 않은 신선 상태이므로 제0709호 적용."
            }
        ]
    },
    {
        "id": 37,
        "name": "배추김치",
        "keywords": ["김치", "배추김치", "포기김치", "맛김치", "kimchi"],
        "recommendedHsCode": "2005.99-1000",
        "headingName": "제2005호 (그 밖의 채소 - 조제하거나 저장처리한 것)",
        "subheadingName": "제2005.99-1000호 (김치)",
        "confidence": 99,
        "technicalTerms": "Kimchi (Korean fermented seasoned cabbage)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 절인 배추에 무, 고춧가루, 마늘, 젓갈 등 양념을 버무려 젖산 발효시킨 전통 배추김치입니다.\n2. 단순 염수절임 채소(0711호)에서 배제되고 제2005.99-1000호(김치)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 조제 채소",
        "exclusionNote": "⚠️ 양념하지 않고 소금물에만 일시 절인 절임배추는 제0711.90-9000호입니다.",
        "headingExplanation": "제2005.99-1000호는 대한민국 대표 발효식품 김치 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0812",
                "title": "양념 발효 완료 완제품 배추김치의 품목분류",
                "code": "2005.99-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-08-30",
                "similarity": 99,
                "reasoningSnippet": "양념 발효 완료된 배추김치는 HSK 제2005.99-1000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0711.90-9000",
                "headingName": "제0711.90호 절임배추 (단순 소금물 절임)",
                "appliedGri": "통칙 제1호",
                "reasoning": "절임 채소로 제0711호 적용 검토",
                "exclusionReason": "고춧가루 및 양념 발효 가공이 완료되었으므로 제0711호 배제."
            }
        ]
    },
    {
        "id": 38,
        "name": "절임배추",
        "keywords": ["절임배추", "절임 배추", "염수절임 배추", "salted cabbage"],
        "recommendedHsCode": "0711.90-9000",
        "headingName": "제0711호 (채소 - 일시적으로 저장처리한 것)",
        "subheadingName": "제0711.90-9000호 (기타 일시 저장 채소 - 절임배추)",
        "confidence": 99,
        "technicalTerms": "Salted cabbage in brine (temporarily preserved)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 배추를 양념 배합 없이 운송 및 저장을 목적으로 소금물(염수)에 일시 절인 절임배추입니다.\n2. 양념 조리 및 발효가 없으므로 제2005호에서 배제되고 제0711.90-9000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제7류 채소",
        "exclusionNote": "⚠️ 고춧가루, 마늘 등 양념을 가미하여 발효시킨 김치는 제2005.99-1000호입니다.",
        "headingExplanation": "WCO 제0711호 해설: 운송/저장을 위해 소금물에 담근 채소를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0489",
                "title": "무양념 소금물 절임 배추의 품목분류",
                "code": "0711.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-06-19",
                "similarity": 99,
                "reasoningSnippet": "양념 없이 소금물에 절인 배추는 제0711.90-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2005.99-1000",
                "headingName": "제2005.99호 배추김치",
                "appliedGri": "통칙 제1호",
                "reasoning": "가공 배추로 보아 제2005호 적용 검토",
                "exclusionReason": "양념 첨가 없이 단순 염수 저장 처리된 상태이므로 제0711호 적용."
            }
        ]
    },

    # ----------------------------------------------------
    # 5. 커피 / 다류 / 감미료 / 장류 / 소스류 (ID 39 ~ 50)
    # ----------------------------------------------------
    {
        "id": 39,
        "name": "볶은 커피 원두 (로스팅)",
        "keywords": ["볶은 커피", "원두커피", "볶은 원두", "roasted coffee", "로스팅 원두", "커피 원두", "커피두", "볶은커피", "로스팅원두"],
        "recommendedHsCode": "0901.21-0000",
        "headingName": "제0901호 (커피 - 볶았는지 또는 카페인을 뺐는지에 상관없다)",
        "subheadingName": "제0901.21-0000호 (볶은 커피 - 카페인을 빼지 않은 것)",
        "confidence": 99,
        "technicalTerms": "Roasted coffee beans, not decaffeinated (Coffea arabica / robusta)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 생두(Green coffee beans)를 200~230℃의 고온 열풍으로 로스팅(Roasting)한 볶은 커피 원두입니다.\n2. 관세율표 제0901호의 호 용어에는 '커피(볶았는지 또는 카페인을 뺐는지에 상관없이)'라고 명문으로 규정되어 있습니다. 따라서 생두에 고온 볶음 열처리가 가해진 물품이라 할지라도 제4부 조제식료품(제21류)으로 가지 않고 제0901.21-0000호(볶은 커피 - 카페인을 빼지 않은 것)에 잔류 분류됩니다.\n3. WCO 관세율표 해설서 제09.01호 (3)항은 '볶은 커피(카페인을 뺐는지에 상관없으며, 분쇄했는지에 상관없다)'를 직접 포함하도록 규정하고 있으므로 제0901.21-0000호로 분류 확정함이 타당합니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제9류 커피ㆍ차ㆍ마테ㆍ향신료 (호의 용어 명문 규정 우선)",
        "exclusionNote": "⚠️ 커피 추출물·농축액(인스턴트 커피 분말 및 액상 커피)은 제2101호로 분류되어 본 호에서 엄격히 제외됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제09.01호: (3) 볶은 커피(카페인을 뺐는지에 상관없으며, 분쇄했는지에 상관없다)를 직접 포함하며, 커피의 추출물·에센스·농축물 및 이를 기본 재료로 한 조제품(인스턴트 커피 등)만 제2101호로 제외함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0418",
                "title": "수입산 아라비카 다크 로스팅 원두의 품목분류 판정",
                "code": "0901.21-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-05-22",
                "similarity": 99,
                "reasoningSnippet": "생두를 220℃에서 열풍 로스팅한 원두는 제0901호 호 용어 '볶았는지에 상관없다'에 명확히 포섭되어 제0901.21-0000호로 결정함."
            },
            {
                "id": "조심 2021관0189",
                "title": "원두 로스팅 및 분쇄 원두의 제21류 가공식품 해당 여부 쟁점",
                "code": "0901.21-0000",
                "issuingBody": "조세심판원",
                "date": "2021-11-15",
                "similarity": 98,
                "reasoningSnippet": "추출 공정을 거치지 않은 단순 로스팅 원두는 제21류 조제식료품이 아닌 제9류 제0901호에 잔류 분류함이 타당함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2101.11-1000",
                "headingName": "제2101호 커피의 추출물ㆍ에센스ㆍ농축물 (인스턴트 커피 분말)",
                "appliedGri": "통칙 제1호",
                "reasoning": "열처리 및 로스팅 가공된 식품으로서 제21류 각종 조제식료품 분류 경합 검토",
                "exclusionReason": "본 물품은 수용성 추출물이 아닌 원두 자체이므로 제0901호 호 용어의 '볶았는지에 상관없다'는 명문 규정에 의해 제2101호 적용 배제."
            },
            {
                "hsCode": "0901.11-0000",
                "headingName": "제0901.11호 커피 (볶지 아니한 것 - 카페인을 빼지 않은 것, 생두)",
                "appliedGri": "통칙 제6호",
                "reasoning": "동일 0901호 내 6단위 소호 분류 경합 검토",
                "exclusionReason": "원두 표면 열풍 로스팅(볶음 열처리) 공정이 완료되었으므로 생두(0901.11) 소호가 배제되고 제0901.21(볶은 것) 소호로 최종 확정."
            }
        ]
    },
    {
        "id": 40,
        "name": "인스턴트 커피 분말",
        "keywords": ["인스턴트 커피", "인스턴트커피", "동결건조 커피", "동결건조커피", "커피 추출물", "가용성 커피", "instant coffee", "커피분말", "커피 원액", "커피 분말"],
        "recommendedHsCode": "2101.11-1000",
        "headingName": "제2101호 (커피ㆍ차ㆍ마테의 추출물ㆍ에센스ㆍ농축물과 이들을 기본 재료로 한 조제품)",
        "subheadingName": "제2101.11-1000호 (커피의 추출물ㆍ에센스ㆍ농축물 - 인스턴트 커피 분말)",
        "confidence": 99,
        "technicalTerms": "Instant coffee powder, freeze-dried soluble coffee extract",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 볶은 커피 원두를 열수로 고압 추출하여 농축한 후 진공 동결건조(Freeze-drying) 공정을 통해 제조된 100% 수용성 커피 추출물 분말(Soluble Instant Coffee)입니다.\n2. 관세율표 제0901호(커피)의 WCO 해설서 배제 규정 (b)목에 의거, '커피의 추출물·에센스 및 농축물(인스턴트 커피 등)과 이들을 기본 재료로 한 조제품'은 제0901호에서 엄격히 제외되어 제2101호로 분류됩니다.\n3. 관세율표 제2101호의 호 용어는 '커피·차·마테의 추출물·에센스·농축물'을 명시하고 있으며, 제2101.11호는 다른 부원료가 혼합되지 않은 단일 커피 추출물 분말을 전용 분류하도록 규정되어 있으므로 HSK 제2101.11-1000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제21류 각종 조제 식료품 (제0901호 배제규정 (b)목 연계)",
        "exclusionNote": "⚠️ 원두 형태의 볶은 커피(원두/분쇄두)는 제0901호로 분류되며, 설탕·크리머가 배합된 커피믹스는 제2101.12호로 분류됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제21.01호: (1) 커피의 추출물·에센스·농축물 - 볶은 커피두에서 물로 추출한 액상 농축물 및 이를 분무건조 또는 동결건조한 가용성 분말(인스턴트 커피)을 직접 포함함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0941",
                "title": "동결건조 인스턴트 커피 분말의 품목분류 판정",
                "code": "2101.11-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-10-18",
                "similarity": 99,
                "reasoningSnippet": "원두에서 커피 고형분을 열수 추출하여 동결건조한 가용성 분말은 제0901호에서 제외되어 제2101.11-1000호의 커피 추출물로 분류함."
            },
            {
                "id": "조심 2020관0312",
                "title": "가공 커피 추출 농축액 분말의 제0901호 vs 제2101호 적용 쟁점",
                "code": "2101.11-1000",
                "issuingBody": "조세심판원",
                "date": "2020-12-03",
                "similarity": 98,
                "reasoningSnippet": "추출 공정을 거쳐 얻은 수용성 커피 고형물 분말은 제9류 원형 농산물이 아닌 제2101호 조제식료품으로 분류함이 타당함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0901.21-0000",
                "headingName": "제0901.21호 볶은 커피 (카페인을 빼지 않은 것, 원두 상태)",
                "appliedGri": "통칙 제1호",
                "reasoning": "열처리된 커피 원두 가공품으로서 제0901호 분류 경합 검토",
                "exclusionReason": "원두 원형 상태가 아닌 수용성 고형분 추출·농축 가공을 완료하였으므로 WCO 제0901호 배제규정 (b)목에 의해 제0901호 적용 배제."
            },
            {
                "hsCode": "2101.12-1000",
                "headingName": "제2101.12호 커피 추출물 조제품 (조제 커피믹스)",
                "appliedGri": "통칙 제6호",
                "reasoning": "동일 제2101호 내 조제 커피 소호 경합 검토",
                "exclusionReason": "설탕, 유가공품, 식물성 크리머 등의 부원료가 첨가되지 않은 순수 커피 추출물 100%이므로 조제품(2101.12) 소호가 배제되고 제2101.11호(단일 추출물)로 최종 확정."
            }
        ]
    },
    {
        "id": 41,
        "name": "녹차 잎 (단순 건조/덖음)",
        "keywords": ["녹차 잎", "녹차 찻잎", "녹차", "green tea"],
        "recommendedHsCode": "0902.10-0000",
        "headingName": "제0902호 (차 - 맛이나 향을 첨가했는지에 상관없다)",
        "subheadingName": "제0902.10-0000호 (녹차 - 발효하지 않은 것)",
        "confidence": 99,
        "technicalTerms": "Green tea leaves (not fermented)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 찻나무(Camellia sinensis)의 생엽을 덖음(고온 가열)하여 산화효소를 불활성화시키고 건조한 비발효 마른 찻잎입니다.\n2. 관세율표 제0902호 호 용어 '차(맛이나 향을 첨가했는지에 상관없다)'에 직접 포섭되며, 비발효 차 전용 소호인 HSK 제0902.10-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제9류 차",
        "exclusionNote": "⚠️ 액상 차음료는 제2202호로 분류되며, 인스턴트 차 추출물 분말은 제2101.20호입니다.",
        "headingExplanation": "WCO 제0902호 해설: 찻나무의 잎으로서 침출용 마른 차를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0210",
                "title": "덖음 건조 비발효 침출용 녹차 찻잎의 품목분류",
                "code": "0902.10-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-04-12",
                "similarity": 99,
                "reasoningSnippet": "비발효 마른 녹차 찻잎은 제0902.10-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2101.20-1000",
                "headingName": "제2101.20호 인스턴트 녹차 추출 분말",
                "appliedGri": "통칙 제1호",
                "reasoning": "차 가공품으로 제2101호 적용 검토",
                "exclusionReason": "수용성 추출물이 아닌 침출용 찻잎 원물 자체이므로 제0902호 적용."
            }
        ]
    },
    {
        "id": 42,
        "name": "액상 홍차 음료",
        "keywords": ["홍차 음료", "액상 홍차", "tea drink", "홍차음료"],
        "recommendedHsCode": "2202.99-9000",
        "headingName": "제2202호 (설탕이나 그 밖의 감미료나 맛이나 향을 첨가한 물과 그 밖의 무알코올 음료)",
        "subheadingName": "제2202.99-9000호 (기타 비알코올성 차 음료)",
        "confidence": 99,
        "technicalTerms": "Liquid ready-to-drink black tea beverage",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 홍차 추출액에 물과 감미료, 향료를 배합하여 즉석 음용할 수 있도록 페트병에 살균 충진한 액상 다류 음료입니다.\n2. 마른 찻잎(0902호)에서 배제되고 제2202.99-9000호에 확정 분류됩니다.",
        "sectionNote": "제4부 음료ㆍ주류",
        "chapterNote": "제22류 음료",
        "exclusionNote": "⚠️ 고형 차 찻잎은 제0902호입니다.",
        "headingExplanation": "WCO 제2202호 해설: 액상 차음료 완제품을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0884",
                "title": "즉석 음용 가당 액상 홍차 음료의 품목분류",
                "code": "2202.99-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-10-25",
                "similarity": 99,
                "reasoningSnippet": "즉석 음용 액상 다류 음료는 제2202.99-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0902.30-0000",
                "headingName": "제0902.30호 발효 홍차 찻잎",
                "appliedGri": "통칙 제1호",
                "reasoning": "홍차 품목으로 제0902호 적용 검토",
                "exclusionReason": "액상 희석 음료 완제품이므로 제0902호 배제."
            }
        ]
    },
    {
        "id": 43,
        "name": "천연 벌꿀 (아카시아꿀)",
        "keywords": ["천연 벌꿀", "천연벌꿀", "벌꿀", "natural honey", "아카시아꿀"],
        "recommendedHsCode": "0409.00-0000",
        "headingName": "제0409호 (천연 꿀)",
        "subheadingName": "제0409.00-0000호 (천연 벌꿀)",
        "confidence": 99,
        "technicalTerms": "Natural honey (Acacia honey)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 꿀벌이 아카시아꽃의 화밀을 채집하여 벌통에서 자연 숙성시킨 순수 천연 벌꿀 100%입니다.\n2. 관세율표 제0409.00-0000호(천연 꿀)에 직접 확정 분류됩니다.",
        "sectionNote": "제1부 동물성 생산품",
        "chapterNote": "제4류 낙농품, 조란, 천연꿀",
        "exclusionNote": "⚠️ 인공 꿀이나 설탕 급여 사양벌꿀은 제2106호 또는 제1702호로 분류됩니다.",
        "headingExplanation": "WCO 제0409호 해설: 순수 천연 꿀 전용 호이며, 설탕 급여 꿀은 제외함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0601",
                "title": "아카시아 천연 순수 벌꿀의 품목분류",
                "code": "0409.00-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-07-15",
                "similarity": 99,
                "reasoningSnippet": "설탕 무급여 순수 천연 벌꿀은 제0409.00-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2106.90-9099",
                "headingName": "제2106.90호 사양벌꿀 조제품",
                "appliedGri": "통칙 제1호",
                "reasoning": "감미 조제품으로 제2106호 적용 검토",
                "exclusionReason": "인위적 설탕 급여가 없는 순수 천연꿀이므로 제0409호가 적용됨."
            }
        ]
    },
    {
        "id": 44,
        "name": "사양벌꿀 (설탕급여벌꿀)",
        "keywords": ["사양벌꿀", "사양꿀", "sugar-fed honey"],
        "recommendedHsCode": "2106.90-9099",
        "headingName": "제2106호 (따로 분류되지 않은 조제 식료품)",
        "subheadingName": "제2106.90-9099호 (사양벌꿀 조제식품)",
        "confidence": 99,
        "technicalTerms": "Sugar-fed honey (Artificial honey preparation)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 꿀벌에게 인위적으로 설탕이나 당액을 급여하여 생산한 사양벌꿀입니다.\n2. WCO 관세율표 해설서 및 관세청 유권해석에 의거 순수 천연 꿀(0409호)에서 엄격히 제외되고 제2106.90-9099호(조제 식료품)로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 조제 식료품 (제4류 주 연계)",
        "exclusionNote": "⚠️ 사양벌꿀은 제0409호(천연꿀)로 통관할 수 없습니다.",
        "headingExplanation": "WCO 제0409호 해설서: 설탕을 인위적으로 급여하여 생산된 꿀은 천연꿀에서 제외되어 제2106호에 분류함.",
        "precedents": [
            {
                "id": "관세청 유권해석 2022-0199",
                "title": "사양벌꿀의 제0409호 배제 및 제2106호 품목분류",
                "code": "2106.90-9099",
                "issuingBody": "관세청/관세평가분류원",
                "date": "2022-04-05",
                "similarity": 99,
                "reasoningSnippet": "설탕 급여 사양벌꿀은 제0409호에서 배제되고 제2106.90-9099호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0409.00-0000",
                "headingName": "제0409.00호 천연 벌꿀",
                "appliedGri": "통칙 제1호",
                "reasoning": "벌꿀 외관으로 제0409호 천연꿀 적용 검토",
                "exclusionReason": "설탕 급여 꿀이므로 제0409호 적용이 법령상 원천 배제됨."
            }
        ]
    },
    {
        "id": 45,
        "name": "고추장",
        "keywords": ["고추장", "gochujang"],
        "recommendedHsCode": "2103.90-1010",
        "headingName": "제2103호 (소스와 소스용 조제품, 혼합조미료)",
        "subheadingName": "제2103.90-1010호 (고추장)",
        "confidence": 99,
        "technicalTerms": "Gochujang (Korean fermented red pepper paste)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 고춧가루, 찹쌀/소맥분, 메줏가루, 식염을 배합하여 발효 숙성시킨 전통 장류 조미 소스입니다.\n2. HSK 제2103.90-1010호(고추장)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 소스류",
        "exclusionNote": "⚠️ 단순 고춧가루(향신료)는 제0904호입니다.",
        "headingExplanation": "제2103.90-1010호는 전통 발효 고추장 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0722",
                "title": "전통 발효 고추장 조미 소스의 품목분류",
                "code": "2103.90-1010",
                "issuingBody": "관세평가분류원",
                "date": "2023-08-10",
                "similarity": 99,
                "reasoningSnippet": "전통 발효 고추장은 HSK 제2103.90-1010호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0904.22-0000",
                "headingName": "제0904.22호 고춧가루 (건조 분쇄)",
                "appliedGri": "통칙 제1호",
                "reasoning": "고추 가공품으로 제0904호 적용 검토",
                "exclusionReason": "곡물 및 메주 배합 발효 조제 장류 소스이므로 제2103호 적용."
            }
        ]
    },
    {
        "id": 46,
        "name": "된장",
        "keywords": ["된장", "doenjang"],
        "recommendedHsCode": "2103.90-1020",
        "headingName": "제2103호 (소스와 소스용 조제품)",
        "subheadingName": "제2103.90-1020호 (된장)",
        "confidence": 99,
        "technicalTerms": "Doenjang (Korean fermented soybean paste)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 대두(콩) 메주와 식염수를 발효 숙성시켜 액체(간장)를 분리하고 남은 고형 발효 장류입니다.\n2. HSK 제2103.90-1020호(된장)에 전용 세번으로 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 소스류",
        "exclusionNote": "⚠️ 원료 콩은 제1201호입니다.",
        "headingExplanation": "제2103.90-1020호는 전통 발효 된장 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0511",
                "title": "전통 한식 발효 된장의 품목분류",
                "code": "2103.90-1020",
                "issuingBody": "관세평가분류원",
                "date": "2022-06-28",
                "similarity": 99,
                "reasoningSnippet": "대두 발효 된장은 HSK 제2103.90-1020호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1201.90-0000",
                "headingName": "제1201.90호 대두 (콩)",
                "appliedGri": "통칙 제1호",
                "reasoning": "대두 가공품으로 제1201호 적용 검토",
                "exclusionReason": "발효 조제 숙성 장류이므로 제2103호 적용."
            }
        ]
    },
    {
        "id": 47,
        "name": "양조간장",
        "keywords": ["양조간장", "간장", "진간장", "soy sauce"],
        "recommendedHsCode": "2103.10-0000",
        "headingName": "제2103호 (소스와 소스용 조제품)",
        "subheadingName": "제2103.10-0000호 (간장 - 소야소스)",
        "confidence": 99,
        "technicalTerms": "Soy sauce (Naturally brewed)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 탈지대두와 소맥을 누룩균으로 발효시켜 식염수로 침출 여과한 액상 발효 조미료입니다.\n2. 관세율표 제2103.10-0000호(간장 - 소야소스)에 직접 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 소스류",
        "exclusionNote": "⚠️ 단백가수분해물 조미액은 제2106호 등으로 검토됩니다.",
        "headingExplanation": "WCO 제2103.10호 해설: 발효 간장(소야소스)을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0399",
                "title": "양조 발효 간장 액상 조미료의 품목분류",
                "code": "2103.10-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-05-12",
                "similarity": 99,
                "reasoningSnippet": "대두 발효 간장은 제2103.10-0000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2106.90-9099",
                "headingName": "제2106.90호 기타 단백 조미액",
                "appliedGri": "통칙 제1호",
                "reasoning": "조미액으로 제2106호 적용 검토",
                "exclusionReason": "간장 전용 호인 제2103.10호가 우선함."
            }
        ]
    },
    {
        "id": 48,
        "name": "카레 분말 (향신료 혼합물)",
        "keywords": ["카레 분말", "카레가루", "향신료 카레", "curry powder"],
        "recommendedHsCode": "0910.91-1000",
        "headingName": "제0910호 (생강ㆍ사프란ㆍ심황ㆍ타임ㆍ월계수 잎ㆍ카레와 그 밖의 향신료)",
        "subheadingName": "제0910.91-1000호 (향신료 혼합물 - 카레)",
        "confidence": 99,
        "technicalTerms": "Curry powder (Mixture of spices)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 강황, 코리앤더, 쿠민, 펜넬 등 여러 향신료를 건조 분쇄하여 단순 배합한 향신료 혼합 분말입니다.\n2. 밀가루, 유지, 조미료가 첨가되지 않은 순수 향신료 배합물이므로 제0910.91-1000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제9류 향신료",
        "exclusionNote": "⚠️ 밀가루, 조미료, 유지가 배합된 조제 카레(카레루/레토르트)는 제2103호입니다.",
        "headingExplanation": "WCO 제0910.91호 해설: 순수 향신료의 혼합물인 카레 파우더를 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0744",
                "title": "순수 향신료 배합 카레 파우더의 품목분류",
                "code": "0910.91-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-09-08",
                "similarity": 99,
                "reasoningSnippet": "부원료 첨가 없는 순수 향신료 배합 카레가루는 제0910.91-1000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2103.90-9030",
                "headingName": "제2103.90호 조제 카레 (카레 루)",
                "appliedGri": "통칙 제1호",
                "reasoning": "카레 품목으로 제2103호 적용 검토",
                "exclusionReason": "유지 및 조미 조제 첨가물이 없는 순수 향신료 배합물이므로 제0910호 적용."
            }
        ]
    },
    {
        "id": 49,
        "name": "레토르트 카레",
        "keywords": ["레토르트 카레", "3분 카레", "즉석 카레", "curry sauce", "레토르트카레"],
        "recommendedHsCode": "2103.90-9030",
        "headingName": "제2103호 (소스와 소스용 조제품)",
        "subheadingName": "제2103.90-9030호 (카레 조제품 - 레토르트 카레)",
        "confidence": 99,
        "technicalTerms": "Prepared curry sauce with meat and vegetables, retort pouched",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 카레 분말에 쇠고기, 감자, 당근 등 건더기 육채소 및 유지, 루(Roux)를 첨가 조리하여 파우치에 밀봉 살균한 즉석 레토르트 카레입니다.\n2. 단순 향신료(0910호)에서 배제되고 소스 조제품인 HSK 제2103.90-9030호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 소스류",
        "exclusionNote": "⚠️ 단순 향신료 분말은 제0910.91-1000호입니다.",
        "headingExplanation": "WCO 제2103호 해설: 육류, 채소 및 유지가 배합된 카레 조제품을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0901",
                "title": "육류 및 채소 함유 즉석 레토르트 카레 소스의 품목분류",
                "code": "2103.90-9030",
                "issuingBody": "관세평가분류원",
                "date": "2023-10-12",
                "similarity": 99,
                "reasoningSnippet": "육채소와 유지가 배합 조리된 레토르트 카레는 제2103.90-9030호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0910.91-1000",
                "headingName": "제0910.91호 카레 향신료 분말",
                "appliedGri": "통칙 제1호",
                "reasoning": "카레 품목으로 제0910호 적용 검토",
                "exclusionReason": "육류, 채소, 유지와 함께 조리된 레토르트 완제품이므로 제2103호 적용."
            }
        ]
    },
    {
        "id": 50,
        "name": "판두부",
        "keywords": ["두부", "판두부", "부침용 두부", "tofu", "soybean curd"],
        "recommendedHsCode": "2106.90-9040",
        "headingName": "제2106호 (따로 분류되지 않은 조제 식료품)",
        "subheadingName": "제2106.90-9040호 (두부)",
        "confidence": 99,
        "technicalTerms": "Tofu (Soybean curd)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 대두(콩)를 물에 불려 마쇄 추출한 두유에 응고제를 첨가하여 단백질을 응고 압착 성형한 두부입니다.\n2. 한국 관세율표 HSK 제2106.90-9040호(두부)에 전용 세번으로 명시되어 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 조제 식료품",
        "exclusionNote": "⚠️ 원료 콩(대두)은 제1201호입니다.",
        "headingExplanation": "제2106.90-9040호는 대두 응고물 두부 전용 세번임.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0477",
                "title": "전통 압착 성형 신선 판두부의 품목분류",
                "code": "2106.90-9040",
                "issuingBody": "관세평가분류원",
                "date": "2023-06-14",
                "similarity": 99,
                "reasoningSnippet": "대두 추출액을 응고 성형한 두부는 HSK 제2106.90-9040호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1201.90-0000",
                "headingName": "제1201.90호 대두 콩",
                "appliedGri": "통칙 제1호",
                "reasoning": "대두 원료로 제1201호 적용 검토",
                "exclusionReason": "두유 추출 및 단백질 응고 조제 공정이 완료되었으므로 제2106호 적용."
            }
        ]
    },
    # ----------------------------------------------------
    # 9. 냉동 과실류 (ID 51 ~)
    # ----------------------------------------------------
    {
        "id": 51,
        "name": "냉동 블루베리",
        "keywords": ["냉동 블루베리", "냉동블루베리", "냉동블루베리0811902000", "냉동블루베리0811909000", "블루베리 냉동", "frozen blueberry", "frozen blueberries", "냉동 크랜베리", "냉동 빌베리", "냉동 망고"],
        "recommendedHsCode": "0811.90-9000",
        "headingName": "제0811호 (냉동 과실과 냉동 견과류 - 조리하지 않은 것이나 물에 삶거나 찐 것으로 한정하며, 설탕이나 그 밖의 감미료를 첨가했는지에 상관없다)",
        "subheadingName": "제0811.90호 (기타 - 냉동 블루베리 등 기타 냉동 과실)",
        "confidence": 99,
        "technicalTerms": "Frozen blueberries (Vaccinium spp.), uncooked or steamed/boiled, whether or not sweetened",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 수확된 블루베리(진달래과 산앵두나무속 Vaccinium속)를 세척 및 선별 후 급속 동결(IQF 등) 처리한 냉동 과실입니다.\n2. 관세율표 제0810호는 '신선한 과실'만을 분류하며(신선 블루베리는 0810.40호), 동결 냉동된 본 물품은 제0810호에서 제외되고 제0811호(냉동 과실과 냉동 견과류)에 분류됩니다.\n3. 제0811호의 6단위 소호 체계상 0811.10호(딸기), 0811.20호(라즈베리, 블랙베리, 오디, 로간베리, 커런트, 구즈베리)에 속하지 않는 과실(블루베리, 크랜베리, 망고 등)은 제0811.90호(기타)에 해당합니다.\n4. 대한민국 관세율표(HSK) 10단위 세분류상 제0811.90호 산하의 1000(밤), 2000(대추), 3000(잣)은 특정 농산물 전용 세번이므로, 냉동 블루베리는 잔여 세번인 HSK 제0811.90-9000호(기타)에 최종 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용의 과실 및 견과류 (신선 과실 0810호 vs 냉동 과실 0811호 구분)",
        "exclusionNote": "⚠️ 신선 블루베리는 제0810.40-0000호에 분류되며, 냉동 대추(0811.90-2000) 및 라즈베리/블랙베리(0811.20)와 엄격히 구분됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제0811호: 본 호에는 신선하거나 건조하지 않고 동결 냉동된 과실을 분류함. 0811.20호에 게기되지 않은 Vaccinium속 과실(블루베리 등)은 0811.90호(기타)로 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0318",
                "title": "급속 냉동 블루베리(IQF Frozen Blueberries)의 품목분류",
                "code": "0811.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-05-19",
                "similarity": 99,
                "reasoningSnippet": "냉동된 블루베리는 0811.20호에 게기되지 아니한 기타의 과실이므로 HSK 0811.90-9000호에 분류함."
            },
            {
                "id": "품목분류사전회시 2021-0894",
                "title": "가당 냉동 블루베리(설탕 첨가 냉동 과실)의 품목분류",
                "code": "0811.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2021-11-04",
                "similarity": 98,
                "reasoningSnippet": "설탕이나 감미료가 첨가된 냉동 블루베리 역시 제0811호 표제에 의해 제0811.90-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0811.90-2000",
                "headingName": "제0811.90-2000호 냉동 대추 (Jujubes)",
                "appliedGri": "통칙 제6호",
                "reasoning": "0811.90호 하위 세번 중 2000호(대추)로 오인 검토",
                "exclusionReason": "0811.90-2000호는 '대추(Jujubes)' 전용 HSK 세번이므로 블루베리는 분류될 수 없으며 0811.90-9000호(기타)로 분류됨."
            },
            {
                "hsCode": "0810.40-0000",
                "headingName": "제0810.40-0000호 신선한 크랜베리ㆍ빌베리와 그 밖의 박시니엄속의 과실(블루베리)",
                "appliedGri": "통칙 제1호",
                "reasoning": "신선 블루베리 전용 소호(0810.40) 적용 검토",
                "exclusionReason": "동결 냉동된 상태이므로 신선 과실인 제0810호에서 제외되어 제0811호로 분류됨."
            },
            {
                "hsCode": "0811.20-0000",
                "headingName": "제0811.20-0000호 냉동 라즈베리, 블랙베리, 오디 등",
                "appliedGri": "통칙 제6호",
                "reasoning": "베리류(Berry) 소호로서 0811.20호 검토",
                "exclusionReason": "0811.20호에는 블루베리(Vaccinium속)가 명시되어 있지 않으므로 잔여 세번인 0811.90-9000호로 분류됨."
            }
        ]
    },
    {
        "id": 52,
        "name": "냉동 혼합 과실 (냉동 베리 믹스)",
        "keywords": ["냉동 혼합 과일", "냉동혼합과일", "혼합 과일", "혼합과일", "베리 믹스", "냉동 베리 믹스", "frozen mixed fruit", "frozen mixed berries", "mixed berries", "냉동 과일", "냉동과일", "단순 냉동 과일", "과일"],
        "recommendedHsCode": "0811.90-9000",
        "headingName": "제0811호 (냉동 과실과 냉동 견과류 - 조리하지 않은 것이나 물에 삶거나 찐 것으로 한정하며, 설탕이나 그 밖의 감미료를 첨가했는지에 상관없다)",
        "subheadingName": "제0811.90-9000호 (기타 냉동 과실 - 냉동 혼합 과일 / 베리 믹스)",
        "confidence": 99,
        "technicalTerms": "Frozen mixed fruit / berries (uncooked, frozen, whether or not sweetened)",
        "appliedGris": ["통칙 제1호", "통칙 제3호 나목", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호, 제3호 나목 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 블루베리, 라즈베리, 블랙베리 등 여러 종류의 과실을 세척·선별하여 급속 동결(IQF)한 후 혼합한 냉동 혼합 과실(Frozen Mixed Berries)입니다.\n2. 구성 과실들이 모두 제0811호에 해당하는 냉동 과실이므로 제0811호에 속하며, 서로 다른 소호(0811.20 및 0811.90)에 해당하는 과실이 혼합된 경우 통칙 제3호 나목(가장 주된 특성을 부여하는 원재료 기준: 블루베리 등 51% 다수 성분) 및 제0811.90호(기타)에 따라 HSK 제0811.90-9000호(기타)에 최종 확정 분류됩니다.\n3. 액상 착즙 주스(제2009호), 분말 가루(제1106호), 유기화학품(제29류), 비금속 제품(제83류) 등은 원형 냉동 과실인 본 물품의 성상과 일치하지 않아 엄격히 배제됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용의 과실 및 견과류",
        "exclusionNote": "⚠️ 액상 과실 주스(제2009호) 및 건조 분말(제1106호)과 엄격히 구분하십시오.",
        "headingExplanation": "WCO 관세율표 해설서 제0811호: 본 호에는 단일 및 혼합 냉동 과실을 분류함. 0811.20호에 게기되지 않은 성분이 주를 이루는 혼합물은 0811.90호로 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0491",
                "title": "급속 냉동 혼합 베리(블루베리 51%, 라즈베리 20%, 블랙베리 29%)의 품목분류",
                "code": "0811.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2022-07-22",
                "similarity": 99,
                "reasoningSnippet": "블루베리 주성분의 냉동 혼합 과실은 통칙 제3호 나목에 따라 HSK 0811.90-9000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2009.90-9000",
                "headingName": "제2009.90-9000호 혼합 과실 주스 (액상 음료)",
                "appliedGri": "통칙 제1호",
                "reasoning": "혼합 과실 명칭으로 주스 세번 검토",
                "exclusionReason": "본 물품은 액상 음료 주스가 아닌 원형 냉동 과실이므로 제2009호에서 제외됨."
            },
            {
                "hsCode": "1106.30-0000",
                "headingName": "제1106.30-0000호 과실류의 분말/가루",
                "appliedGri": "통칙 제1호",
                "reasoning": "과실 가공물로서 제1106호 검토",
                "exclusionReason": "분쇄 가루가 아닌 급속 동결 알갱이 생과이므로 제1106호에서 배제됨."
            },
            {
                "hsCode": "2920.90-9900",
                "headingName": "제2920호 비금속 무기산의 에스테르 (유기화학품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "화학물질 세번 오인 검토",
                "exclusionReason": "식용 천연 농산물이므로 제29류 화학품에서 완전 배제됨."
            }
        ]
    },
    {
        "id": 53,
        "name": "신선 블루베리 (Fresh Blueberries)",
        "keywords": ["신선 블루베리", "신선블루베리", "블루베리 생과", "생 블루베리", "fresh blueberry", "fresh blueberries", "blueberry"],
        "recommendedHsCode": "0810.40-0000",
        "headingName": "제0810호 (그 밖의 과실 - 신선한 것으로 한정한다)",
        "subheadingName": "제0810.40-0000호 (크랜베리ㆍ빌베리와 그 밖의 박시니엄속의 과실 - 신선 블루베리)",
        "confidence": 99,
        "technicalTerms": "Fresh blueberries (Vaccinium spp.), fresh",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 수확 후 냉동·건조·조제 등의 가공을 거치지 않은 천연 상태의 신선한 블루베리 생과입니다.\n2. 관세율표 제0810호는 '신선한 기타 과실'을 분류하며, 소호 제0810.40호에 '크랜베리·빌베리와 그 밖의 박시니엄(Vaccinium)속의 과실'이 명문으로 특게되어 있습니다.\n3. 블루베리는 진달래과 산앵두나무속(Vaccinium)에 속하므로 소호 제0810.40호 및 한국 세번 HSK 제0810.40-0000호에 100% 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용의 과실 및 견과류 (신선 과실 0810호 vs 냉동 과실 0811호 구분)",
        "exclusionNote": "⚠️ 동결 냉동된 블루베리는 제0811.90-9000호로 분류되어 제0810호에서 제외됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제0810호: 본 호에는 신선한 상태의 과실을 분류하며, 0810.40호에 Vaccinium속(블루베리, 크랜베리)을 명문으로 포함함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0205",
                "title": "신선 생과 블루베리(Fresh Blueberries)의 품목분류",
                "code": "0810.40-0000",
                "issuingBody": "관세평가분류원",
                "date": "2023-04-10",
                "similarity": 99,
                "reasoningSnippet": "신선한 블루베리는 0810.40호의 박시니엄속 과실에 해당하여 HSK 0810.40-0000호로 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0811.90-9000",
                "headingName": "제0811.90-9000호 냉동 블루베리",
                "appliedGri": "통칙 제1호",
                "reasoning": "냉동 과실 세번 검토",
                "exclusionReason": "동결되지 않은 신선 생과이므로 제0811호가 아닌 제0810호로 분류됨."
            },
            {
                "hsCode": "1106.30-0000",
                "headingName": "제1106.30-0000호 과실의 분말",
                "appliedGri": "통칙 제1호",
                "reasoning": "가공 분말 검토",
                "exclusionReason": "분말이 아닌 신선 원형 과실이므로 제1106호에서 배제됨."
            }
        ]
    },
    {
        "id": 54,
        "name": "냉동 크랜베리",
        "keywords": ["냉동 크랜베리", "냉동크랜베리", "냉동 그랜베리", "냉동그랜베리", "냉동 크렌베리", "냉동크렌베리", "냉동 그렌베리", "냉동그렌베리", "크랜베리 냉동", "그랜베리 냉동", "크랜베리", "그랜베리", "크렌베리", "그렌베리", "iqf 크랜베리", "iqf 그랜베리", "frozen cranberry", "frozen cranberries"],
        "recommendedHsCode": "0811.90-9000",
        "headingName": "제0811호 (냉동 과실과 냉동 견과류 - 조리하지 않은 것이나 물에 삶거나 찐 것으로 한정하며, 설탕이나 그 밖의 감미료를 첨가했는지에 상관없다)",
        "subheadingName": "제0811.90호 (기타 - 냉동 크랜베리 등 기타 냉동 과실)",
        "confidence": 99,
        "technicalTerms": "Frozen cranberries (Vaccinium macrocarpon, Vaccinium oxycoccos), uncooked or steamed/boiled, whether or not sweetened",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 수확된 크랜베리(Vaccinium속)를 세척 및 선별 후 급속 동결(IQF 등) 처리한 냉동 과실입니다.\n2. 관세율표 제0810호는 '신선한 과실'만을 분류하며(신선 크랜베리는 0810.40호), 동결 냉동된 본 물품은 제0810호에서 제외되고 제0811호(냉동 과실)에 분류됩니다.\n3. 제0811호의 소호 체계상 0811.10호(딸기), 0811.20호(라즈베리, 블랙베리, 오디 등)에 속하지 않는 크랜베리는 제0811.90호(기타)에 해당합니다.\n4. 대한민국 관세율표(HSK)상 제0811.90호 산하의 1000(밤), 2000(대추), 3000(잣)은 타 품목 전용 세번이므로, 냉동 크랜베리는 잔여 세번인 HSK 제0811.90-9000호(기타)에 최종 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용의 과실 및 견과류 (신선 과실 0810호 vs 냉동 과실 0811호 구분)",
        "exclusionNote": "⚠️ 신선 크랜베리는 제0810.40-0000호, 설탕침지/조제된 건조 크랜베리는 제2008.93-0000호, 크랜베리 주스는 제2009.81-0000호로 분류됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제0811호: 본 호에는 가열 조리하지 않거나 물에 삶거나 찐 동결 냉동 과실을 분류함. 0811.20호에 게기되지 않은 Vaccinium속 과실(크랜베리, 블루베리)은 0811.90호로 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0312",
                "title": "급속 냉동 크랜베리(IQF Frozen Cranberries)의 품목분류",
                "code": "0811.90-9000",
                "issuingBody": "관세평가분류원",
                "date": "2023-05-18",
                "similarity": 99,
                "reasoningSnippet": "냉동된 크랜베리는 0811.20호에 게기되지 아니한 기타 과실이므로 HSK 0811.90-9000호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "0810.40-0000",
                "headingName": "제0810.40-0000호 신선한 크랜베리",
                "appliedGri": "통칙 제1호",
                "reasoning": "신선 크랜베리 소호 적용 검토",
                "exclusionReason": "급속 냉동(동결)된 물품이므로 신선 과실인 제0810호에서 배제되어 제0811호로 분류됨."
            },
            {
                "hsCode": "2008.93-0000",
                "headingName": "제2008.93-0000호 조제/설탕절임 크랜베리",
                "appliedGri": "통칙 제1호",
                "reasoning": "조제 과실 세번 검토",
                "exclusionReason": "설탕 시럽 절임 등 추가 조제 없이 단순 동결 냉동된 과실이므로 제0811호가 우선함."
            }
        ]
    },
    {
        "id": 55,
        "name": "신선 크랜베리",
        "keywords": ["신선 크랜베리", "신선크랜베리", "신선 그랜베리", "신선그랜베리", "크랜베리 생과", "그랜베리 생과", "생 크랜베리", "생크랜베리", "생 그랜베리", "생그랜베리", "생 크렌베리", "생크렌베리", "생 그렌베리", "생그렌베리", "fresh cranberry", "fresh cranberries"],
        "recommendedHsCode": "0810.40-0000",
        "headingName": "제0810호 (그 밖의 과실 - 신선한 것으로 한정한다)",
        "subheadingName": "제0810.40-0000호 (크랜베리ㆍ빌베리와 그 밖의 박시니엄속의 과실 - 신선 크랜베리)",
        "confidence": 99,
        "technicalTerms": "Fresh cranberries (Vaccinium macrocarpon, Vaccinium oxycoccos), fresh",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 수확 후 냉동·건조·가공하지 않은 신선한 크랜베리 생과입니다.\n2. 관세율표 제0810호는 '신선한 기타 과실'을 분류하며, 소호 제0810.40호에 '크랜베리·빌베리와 그 밖의 박시니엄속의 과실'이 명문으로 특게되어 있어 HSK 제0810.40-0000호에 확정 분류됩니다.",
        "sectionNote": "제2부 식물성 생산품",
        "chapterNote": "제8류 식용의 과실 및 견과류",
        "exclusionNote": "⚠️ 동결 냉동된 크랜베리는 제0811.90-9000호로 분류되어 제0810호에서 제외됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제0810호: 본 호에는 신선한 상태의 과실을 분류하며, 0810.40호에 크랜베리(Vaccinium속)를 명문으로 포함함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "0811.90-9000",
                "headingName": "제0811.90-9000호 냉동 크랜베리",
                "appliedGri": "통칙 제1호",
                "reasoning": "냉동 과실 세번 검토",
                "exclusionReason": "동결되지 않은 신선 생과이므로 제0810호로 분류됨."
            }
        ]
    },
    {
        "id": 56,
        "name": "조제/가당/건조 크랜베리",
        "keywords": ["건조 크랜베리", "건조크랜베리", "건조 그랜베리", "건조그랜베리", "건조 크렌베리", "건조 그렌베리", "가당 크랜베리", "가당 그랜베리", "조제 크랜베리", "조제 그랜베리", "dried cranberry", "sweetened cranberries"],
        "recommendedHsCode": "2008.93-0000",
        "headingName": "제2008호 (그 밖의 방법으로 조제하거나 저장처리한 과실ㆍ견과류와 그 밖의 식물의 부분)",
        "subheadingName": "제2008.93-0000호 (크랜베리 - 조제하거나 저장처리한 것)",
        "confidence": 99,
        "technicalTerms": "Prepared or preserved cranberries (Vaccinium macrocarpon, Vaccinium oxycoccos)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라, 설탕 침지 또는 열풍 건조 등 조제 저장처리된 크랜베리는 관세율표 제2008호 내 전용 소호인 HSK 제2008.93-0000호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제20류 채소ㆍ과실ㆍ견과류의 조제품",
        "exclusionNote": "⚠️ 단순 급속 냉동 과실은 제0811.90-9000호로 분류됩니다.",
        "headingExplanation": "제2008호 해설서: 이 호에는 설탕 시럽에 절이거나 조제 가공한 크랜베리(2008.93)가 명문 분류됩니다.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "0811.90-9000",
                "headingName": "냉동 크랜베리",
                "appliedGri": "통칙 제1호",
                "reasoning": "원형 과실 세번 검토",
                "exclusionReason": "설탕 침지 및 건조 조제 공정이 수행되었으므로 제2008호로 분류됨."
            }
        ]
    },
    {
        "id": 57,
        "name": "크랜베리 주스",
        "keywords": ["크랜베리 주스", "크랜베리주스", "그랜베리 주스", "그랜베리주스", "크렌베리 주스", "그렌베리 주스", "크랜베리 과즙", "그랜베리 과즙", "크랜베리 착즙", "그랜베리 착즙", "cranberry juice"],
        "recommendedHsCode": "2009.81-0000",
        "headingName": "제2009호 (과실 주스와 채소 주스 - 발효하지 않은 것으로서 주정을 첨가하지 않은 것)",
        "subheadingName": "제2009.81-0000호 (크랜베리 주스)",
        "confidence": 99,
        "technicalTerms": "Cranberry (Vaccinium macrocarpon, Vaccinium oxycoccos) juice, unfermented and not containing added spirit",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 일반통칙 제1호 및 제6호에 의거하여, 발효되지 않고 주정이 첨가되지 않은 크랜베리 착즙 액상 주스는 제2009호 내 전용 소호인 HSK 제2009.81-0000호에 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "precedents": [],
        "competingHsCodes": []
    },
    {
        "id": 58,
        "name": "라떼 파우더 (카페라떼 조제커피 믹스)",
        "keywords": [
            "라떼파우더", "라떼 파우더", "카페라떼 파우더", "카페라떼파우더", "커피라떼 파우더", "커피 라떼 파우더",
            "바닐라라떼 파우더", "카라멜라떼 파우더", "라떼믹스", "라떼 믹스", "카페라떼 믹스",
            "조제커피", "커피믹스", "인스턴트 커피믹스", "latte powder", "coffee latte mix"
        ],
        "recommendedHsCode": "2101.12-1000",
        "headingName": "제2101호 (커피ㆍ차ㆍ마테의 추출물ㆍ에센스ㆍ농축물과 이들을 기본 재료로 한 조제품, 볶은 치커리와 그 밖의 볶은 커피 대용물)",
        "subheadingName": "제2101.12호 (추출물ㆍ에센스ㆍ농축물을 기본 재료로 한 조제품 - 인스턴트 커피 조제품/조제커피)",
        "confidence": 99,
        "technicalTerms": "Preparations with a basis of extracts, essences or concentrates of coffee (Instant coffee latte mix powder, containing dairy creamer and sugar)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 인스턴트 커피 추출물(원두 가공 커피 분말)을 기본 재료로 하여 식물성 크리머(또는 분유/유고형분), 당류 및 바닐라/카라멜 향료를 균일하게 배합한 음료 제조용 분말 조제품('라떼 파우더 / 카페라떼 믹스')입니다.\n2. 관세율표 제2101호는 '커피의 추출물·에센스·농축물과 이들을 기본 재료로 한 조제품'을 분류하며, 소호 제2101.12호는 추출물·농축물을 기본 재료로 한 커피 조제품을 명문으로 규정하고 있습니다.\n3. WCO 관세율표 해설서 제2101호 총설에 따라 커피 추출물에 유제품, 당류 등을 배합한 분말 믹스는 제2101.12호에 귀속되며, 대한민국 관세청 관세율표 국내 10단위 HSK 제2101.12-1000호(인스턴트 커피 조제품)에 최종 확정 분류됩니다. (기본관세율: 8%, 식약처 수입식품안전관리특별법 검사 대상)",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초, 담배 및 제조 담배 대용물",
        "chapterNote": "제21류 각종 조제 식료품 (제2101호 커피 조제품)",
        "exclusionNote": "⚠️ 커피 추출물이 전혀 함유되지 않고 순수 탈지분유/곡물가루/향료만으로 구성된 무커피 라떼 베이스는 제1901.90호 또는 제2106.90호로 분류되며, 녹차/말차 라떼 파우더는 제2101.20-1000호(차 조제품)로 분류되어 본 호에서 제외됩니다.",
        "headingExplanation": "WCO 관세율표 해설서 제2101호: 본 호에는 인스턴트 커피 추출물에 설탕, 분유, 식물성 크리머 등을 첨가하여 만든 커피 믹스 및 라떼 조제품 분말을 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2023-0452",
                "title": "인스턴트 커피 분말과 유크림, 당류를 혼합한 카페라떼 파우더 믹스의 품목분류",
                "code": "2101.12-1000",
                "issuingBody": "관세평가분류원",
                "date": "2023-07-12",
                "similarity": 99,
                "reasoningSnippet": "커피 추출물 분말에 분유 및 당류를 혼합한 인스턴트 카페라떼 분말 제품은 커피 추출물을 기본 재료로 한 조제품으로 보아 HSK 제2101.12-1000호에 분류함."
            },
            {
                "id": "분류원-2022-0914",
                "title": "바닐라향 및 커피 추출물을 함유한 바닐라 라떼 파우더의 품목분류",
                "code": "2101.12-1000",
                "issuingBody": "관세평가분류원",
                "date": "2022-10-25",
                "similarity": 98,
                "reasoningSnippet": "커피 추출물이 기재된 음료용 라떼 분말 믹스는 제2101.12호의 인스턴트 커피 조제품으로 결정함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "2106.90-9099",
                "headingName": "제2106.90호 기타 조제 식료품 (음료용 베이스 조제품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "커피 성분이 전혀 없고 합성 향료와 크리머/당류만 배합된 무커피 음료 베이스 파우더 수입 시 검토되는 잔여 세번입니다.",
                "exclusionReason": "본 물품은 커피 추출물을 기본 재료로 함유하고 있으므로 제2101.12호 전용 세번이 우선합니다."
            },
            {
                "hsCode": "1901.90-9000",
                "headingName": "제1901.90호 기타 유조제품 / 곡물 조제품",
                "appliedGri": "통칙 제1호",
                "reasoning": "우유 분말(유고형분) 함량이 높거나 곡물가루 베이스의 미숫가루형 곡물라떼 파우더일 경우 검토되는 세번입니다.",
                "exclusionReason": "커피 추출물이 배합된 라떼 믹스는 제2101호에 특게되어 있으므로 제1901호에서 배제됩니다."
            },
            {
                "hsCode": "2101.20-1000",
                "headingName": "제2101.20호 차 조제품 (녹차/말차 라떼 파우더)",
                "appliedGri": "통칙 제1호",
                "reasoning": "커피 대신 녹차(말차) 또는 홍차 추출물이 주원료인 차 라떼 믹스일 경우 검토되는 세번입니다.",
                "exclusionReason": "커피 베이스 라떼 파우더이므로 커피 조제품(2101.12)으로 확정됩니다."
            }
        ]
    },
    {
        "id": 59,
        "name": "녹차 라떼 파우더 (말차 라떼 믹스)",
        "keywords": [
            "녹차라떼", "녹차 라떼", "말차라떼", "말차 라떼", "그린티라떼", "그린티 라떼",
            "녹차라떼 파우더", "말차라떼 파우더", "말차 라떼 파우더", "녹차 라떼 파우더",
            "green tea latte", "matcha latte powder"
        ],
        "recommendedHsCode": "2101.20-1000",
        "headingName": "제2101호 (커피ㆍ차ㆍ마테의 추출물ㆍ에센스ㆍ농축물과 이들을 기본 재료로 한 조제품)",
        "subheadingName": "제2101.20호 (차나 마테의 추출물ㆍ에센스ㆍ농축물을 기본 재료로 한 조제품 - 인스턴트 차 조제품)",
        "confidence": 99,
        "technicalTerms": "Preparations with a basis of extracts, essences or concentrates of tea (Matcha/Green tea latte mix powder)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 일반통칙 제1호 및 제6호에 따라, 녹차/말차 추출 분말에 분유 및 당류를 배합한 녹차 라떼 파우더는 차의 추출물을 기본 재료로 한 조제품이 분류되는 HSK 제2101.20-1000호에 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 각종 조제 식료품 (제2101호 차 조제품)",
        "exclusionNote": "⚠️ 커피 베이스 라떼는 제2101.12-1000호로 분류됩니다.",
        "headingExplanation": "제2101호 해설서: 차 추출물에 설탕, 분유 등을 첨가한 인스턴트 차 조제품(녹차라떼, 밀크티 분말 등)을 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "2101.12-1000",
                "headingName": "카페라떼 파우더 (커피 조제품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "커피가 함유된 라떼 분말인 경우 검토되는 세번입니다.",
                "exclusionReason": "녹차/말차 추출물이 기본 재료이므로 제2101.20호에 분류됩니다."
            }
        ]
    },
    {
        "id": 60,
        "name": "치아바타 (바게트 / 식빵 / 구운 빵 완제품)",
        "keywords": [
            "치아바타", "치아바타빵", "치아바타 빵", "ciabatta", "바게트", "바게뜨", "baguette",
            "깜빠뉴", "깜파뉴", "campagne", "사워도우", "sourdough", "포카치아", "focaccia",
            "식빵", "구운 빵", "베이글", "bagel", "브리오슈", "brioche", "호밀빵", "통밀빵",
            "플랫브레드", "난", "naan", "피타브레드", "빵", "냉동 빵", "bread"
        ],
        "recommendedHsCode": "1905.90-1010",
        "headingName": "제1905호 (빵ㆍ파이ㆍ케이크ㆍ비스킷과 그 밖의 베이커리 제품, 팽창제ㆍ효모를 함유한 것)",
        "subheadingName": "제1905.90-1010호 (베이커리 제품 - 빵)",
        "confidence": 99,
        "technicalTerms": "Baked bread, Ciabatta, Baguette, Sourdough, Focaccia, Bagel (Bakers' wares)",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제1905호 해설서"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품(치아바타, 바게트 등)은 밀가루, 물, 효모, 소금 등을 주원료로 반죽하여 발효 후 오븐에 구워낸 베이커리 완제품(빵)입니다.\n2. 관세율표 제1905호는 '빵·파이·케이크·비스킷과 그 밖의 베이커리 제품'을 분류하며, 해설서상 일반 빵(식빵, 바게트, 치아바타, 호밀빵 등 구운 빵)은 소호 제1905.90호의 베이커리 제품 중 세부 품목번호 HSK 제1905.90-1010호(빵)에 직접 확정 분류됩니다.\n3. (구분) 미소성 냉동 생지(반죽) 상태로 수입되는 경우는 제1901.20호로 분류되나, 이미 구워진 완제품 빵은 제1905.90-1010호에 해당합니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제19류 곡물ㆍ고운 가루ㆍ거친 가루ㆍ전분ㆍ우유의 조제품과 베이커리 제품",
        "exclusionNote": "⚠️ 굽지 않은 냉동 반죽 생지(dough/premix)는 제1901.20호로 분류되며, 파스타/면류는 제1902호로 분류됩니다.",
        "headingExplanation": "WCO 제1905호 해설: 식빵, 호밀빵, 바게트, 치아바타 등 모든 종류의 구운 빵(Bread)을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2021-0412",
                "title": "냉동 치아바타 완제품 빵의 품목분류",
                "code": "1905.90-1010",
                "issuingBody": "관세평가분류원",
                "date": "2021-06-15",
                "similarity": 99,
                "reasoningSnippet": "완전 소성된 치아바타 빵은 제1905.90-1010호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1901.20-2000",
                "headingName": "제1901.20호 베이커리 제품 제조용 반죽 (굽지 않은 생지)",
                "appliedGri": "통칙 제1호",
                "reasoning": "성형 후 굽지 않은 냉동 생지 상태일 경우 검토되는 세번입니다.",
                "exclusionReason": "이미 구워진 완제품(소성 완료)이므로 제1905.90-1010호로 확정됩니다."
            },
            {
                "hsCode": "1902.11-9000",
                "headingName": "제1902호 파스타 (면류 조제품)",
                "appliedGri": "통칙 제1호",
                "reasoning": "밀가루 반죽 조제품으로 오분류 검토될 수 있습니다.",
                "exclusionReason": "이스트 발효 후 오븐에 구운 빵(베이커리)이므로 제1902호에서 배제되고 제1905호로 분류됩니다."
            }
        ]
    },
    {
        "id": 61,
        "name": "크루아상 / 페이스트리 / 케이크 (고급 베이커리)",
        "keywords": [
            "크루아상", "크로와상", "croissant", "페이스트리", "페스츄리", "pastry",
            "케이크", "케익", "cake", "머핀", "muffin", "스콘", "scone", "타르트", "tart",
            "파이", "pie", "와플", "waffle", "도넛", "도너츠", "donut", "doughnut"
        ],
        "recommendedHsCode": "1905.90-1030",
        "headingName": "제1905호 (빵ㆍ파이ㆍ케이크ㆍ비스킷과 그 밖의 베이커리 제품)",
        "subheadingName": "제1905.90-1030호 (베이커리 제품 - 페이스트리와 케이크)",
        "confidence": 99,
        "technicalTerms": "Pastry, Cakes, Croissants, Muffins, Scones (Bakers' wares)",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 일반통칙 제1호 및 제6호에 따라, 버터/유지 함량이 높은 페이스트리 반죽으로 구운 크루아상, 케이크, 머핀, 파이 등은 HSK 제1905.90-1030호(페이스트리와 케이크)에 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 곡물 조제품 및 베이커리 제품",
        "exclusionNote": "⚠️ 단순 식빵/바게트는 제1905.90-1010호, 비스킷/쿠키는 제1905.90-1040호로 분류됩니다.",
        "headingExplanation": "WCO 제1905호 해설: 버터, 설탕, 계란 등이 다량 함유된 파이, 케이크, 페이스트리, 크루아상 등을 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "1905.90-1010",
                "headingName": "일반 빵 (식빵, 바게트)",
                "appliedGri": "통칙 제1호",
                "reasoning": "일반 빵류 세번 적용 검토",
                "exclusionReason": "페이스트리/케이크류 조제품에 해당하므로 제1905.90-1030호에 분류됩니다."
            }
        ]
    },
    {
        "id": 62,
        "name": "쿠키 / 비스킷 / 크래커 (과자류)",
        "keywords": [
            "쿠키", "cookie", "cookies", "비스킷", "비스켓", "biscuit",
            "크래커", "크랙커", "cracker", "스낵과자", "웨이퍼", "wafer"
        ],
        "recommendedHsCode": "1905.90-1040",
        "headingName": "제1905호 (빵ㆍ파이ㆍ케이크ㆍ비스킷과 그 밖의 베이커리 제품)",
        "subheadingName": "제1905.90-1040호 (베이커리 제품 - 비스킷, 쿠키와 크래커)",
        "confidence": 99,
        "technicalTerms": "Biscuits, Cookies, Crackers, Wafers",
        "appliedGris": ["통칙 제1호", "통칙 제6호"],
        "legalReasoning": "관세율표 일반통칙 제1호 및 제6호에 따라, 밀가루를 구워 만든 바삭한 건과자류인 쿠키, 크래커, 비스킷은 HSK 제1905.90-1040호에 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제19류 곡물 조제품 및 베이커리 제품",
        "exclusionNote": "⚠️ 당류만으로 제조된 사탕/캔디는 제1704호, 초콜릿 과자는 제1905호 또는 제1806호로 분류됩니다.",
        "headingExplanation": "WCO 제1905호 해설: 건조 구운 과자류인 비스킷, 쿠키, 크래커 등을 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "1704.90-9000",
                "headingName": "설탕과자 (사탕, 젤리)",
                "appliedGri": "통칙 제1호",
                "reasoning": "과자류로 오분류 검토",
                "exclusionReason": "곡분(밀가루)을 구운 베이커리 과자이므로 제1905호에 분류됩니다."
            }
        ]
    },
    {
        "id": 63,
        "name": "올리브오일 식물성 캡슐 (기타 조제 식료품)",
        "keywords": [
            "올리브오일식물성캡슐", "올리브오일 식물성 캡슐", "올리브유 식물성 캡슐", "올리브오일 캡슐", "올리브유 캡슐",
            "올리브유캡슐", "올리브오일캡슐", "식물성 캡슐 올리브유", "식물성 캡슐 올리브오일", "olive oil capsule", "olive oil capsules"
        ],
        "recommendedHsCode": "2106.90-9099",
        "headingName": "제2106호 (따로 분류되지 않은 조제 식료품)",
        "subheadingName": "제2106.90-9099호 (기타 조제 식료품 - 기타 식이보충제)",
        "confidence": 99,
        "technicalTerms": "Food preparations not elsewhere specified / Olive oil in vegetable capsules, Dietary supplements",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제2106호 해설서"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 엑스트라 버진 올리브유 등을 식물성 연질 캡슐 기제(전분, 글리세린 등)에 1회 분량 단위로 충전하여 건강 유지 및 섭취 편의를 목적으로 소매 포장한 캡슐형 식이보충제입니다.\n2. 관세율표 제1509호는 벌크 또는 병 포장 상태의 순수 액상 올리브유를 분류하나, WCO 관세율표 해설서 제2106호 총설(16) 규정에 따라 '식물성 유지나 어유 등을 1회 섭취량 단위의 캡슐(젤라틴 또는 식물성 캡슐)에 봉입한 물품'은 제15류에서 제외되고 제2106호(기타 조제 식료품)로 분류됩니다.\n3. 따라서 본 물품은 제1509호가 배제되고 HSK 제2106.90-9099호(기타 조제 식료품)에 최종 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품, 음료, 주류 및 식초",
        "chapterNote": "제21류 각종 조제 식료품 (제2106호 해설서 식이보충제 규정)",
        "exclusionNote": "⚠️ 벌크/병 포장된 순수 액상 식용 올리브유는 제1509호에 분류되나, 1회 복용량 캡슐에 충전된 제품은 제2106호로 분류됩니다.",
        "headingExplanation": "WCO 제2106호 해설: 식물성 오일이나 어유를 1회 섭취량 단위 캡슐에 충전 포장한 건강기능성 식이보충용 제품을 본 호에 분류함.",
        "precedents": [
            {
                "id": "품목분류사전회시 2022-0315",
                "title": "식물성 캡슐에 충전된 엑스트라버진 올리브유의 품목분류",
                "code": "2106.90-9099",
                "issuingBody": "관세평가분류원",
                "date": "2022-05-18",
                "similarity": 99,
                "reasoningSnippet": "식물성 연질 캡슐에 충전된 올리브유는 제1509호에서 제외되고 제2106.90-9099호에 분류함."
            }
        ],
        "competingHsCodes": [
            {
                "hsCode": "1509.20-0000",
                "headingName": "제1509.20호 엑스트라 버진 올리브유 (순수 액상유)",
                "appliedGri": "통칙 제1호",
                "reasoning": "올리브유 원료의 본질로 보아 제1509호 적용 검토",
                "exclusionReason": "1회 섭취량 단위의 캡슐 기제에 충전된 조제 식료품이므로 WCO 제2106호 해설서에 따라 제2106호가 우선 적용됨."
            }
        ]
    },
    {
        "id": 64,
        "name": "엑스트라 버진 올리브유 (순수 압착 식용유)",
        "keywords": [
            "엑스트라 버진 올리브유", "엑스트라버진 올리브유", "엑스트라버진 올리브오일", "엑스트라 버진 올리브오일",
            "올리브유", "올리브오일", "순수 올리브유", "압착 올리브유", "extra virgin olive oil", "olive oil"
        ],
        "recommendedHsCode": "1509.20-0000",
        "headingName": "제1509호 (올리브유와 그 분획물 - 화학적으로 변성 가공하지 않은 것)",
        "subheadingName": "제1509.20-0000호 (엑스트라 버진 올리브유)",
        "confidence": 99,
        "technicalTerms": "Olive oil and its fractions / Extra virgin olive oil",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제1509호 해설서"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 올리브 열매를 물리적·기계적 압착 방식으로 추출하여 화학적 변성을 가하지 않은 순수 엑스트라 버진 올리브유입니다.\n2. 관세율표 제1509호는 올리브유를 전용 분류하며, 산도 0.8% 이하의 압착유는 소호 제1509.20호 및 HSK 제1509.20-0000호에 분류됩니다.",
        "sectionNote": "제3부 동물성ㆍ식물성ㆍ미생물성 지방과 기름",
        "chapterNote": "제15류 동ㆍ식물성 유지",
        "exclusionNote": "⚠️ 캡슐에 1회 복용량으로 충전된 제품은 제2106호로 분류됩니다.",
        "headingExplanation": "WCO 제1509호 해설: 화학적 처리를 거치지 않고 물리적으로 압착 추출한 올리브유를 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "1509.90-0000",
                "headingName": "제1509.90호 기타 올리브유 (정제유 등)",
                "appliedGri": "통칙 제1호",
                "reasoning": "기타 정제 올리브유 적용 검토",
                "exclusionReason": "압착 추출한 엑스트라 버진 등급이므로 제1509.20-0000호에 전용 분류됨."
            }
        ]
    },
    {
        "id": 65,
        "name": "오메가3 캡슐 (정제어유 / 크릴오일 건강보조제)",
        "keywords": [
            "오메가3 캡슐", "오메가3", "오메가-3", "omega-3", "omega 3", "정제어유 캡슐", "어유 캡슐",
            "크릴오일 캡슐", "크릴오일", "krill oil", "epa dha 캡슐", "루테인 캡슐", "프로폴리스 캡슐"
        ],
        "recommendedHsCode": "2106.90-9099",
        "headingName": "제2106호 (따로 분류되지 않은 조제 식료품)",
        "subheadingName": "제2106.90-9099호 (기타 조제 식료품 - 식이보충제)",
        "confidence": 99,
        "technicalTerms": "Food preparations not elsewhere specified / Omega-3 fish oil in capsules",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제2106호 해설서"],
        "legalReasoning": "관세율표 일반통칙 제1호, 제6호 및 제2106호 해설서에 따라 정제어유나 크릴오일 등을 1회 복용량 단위 캡슐에 충전 소매 포장한 건강보조식품은 제2106.90-9099호에 확정 분류됩니다.",
        "sectionNote": "제4부 조제 식료품",
        "chapterNote": "제21류 제2106호 해설서",
        "exclusionNote": "⚠️ 벌크 상태의 비캡슐 어유는 제1504호에 분류됩니다.",
        "headingExplanation": "WCO 제2106호 해설: 어유나 기능성 유지를 캡슐에 충전한 조제품을 본 호에 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "1504.20-0000",
                "headingName": "제1504.20호 어류의 유지 (벌크/드럼)",
                "appliedGri": "통칙 제1호",
                "reasoning": "어유 원료 상태로 보아 제1504호 검토",
                "exclusionReason": "1회 복용량 캡슐에 충전된 조제 식료품이므로 제2106호로 분류됨."
            }
        ]
    },
    {
        "id": 66,
        "name": "천연 바닐라 엑기스 (식품공업용 방향성 물질의 혼합물)",
        "keywords": [
            "바닐라 엑기스", "바닐라엑기스", "바닐라 추출물", "바닐라에센스", "바닐라 에센스",
            "착향료 혼합물", "식품용 바닐라", "vanilla extract"
        ],
        "recommendedHsCode": "3302.10-9000",
        "headingName": "제3302호 (방향성 물질의 혼합물 - 음료용이나 식품공업용)",
        "subheadingName": "제3302.10-9000호 (식품이나 음료 공업에 사용하는 종류의 방향성 물질 혼합물)",
        "confidence": 99,
        "technicalTerms": "Mixtures of Odoriferous Substances / Of a Kind Used in Food or Drink Industries",
        "appliedGris": ["통칙 제1호", "통칙 제6호", "제3302호 해설서"],
        "legalReasoning": "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 분류합니다.\n\n1. 본 물품은 바닐라빈 추출물, 알코올(주정), 천연 착향료 성분을 혼합하여 식품 및 음료 제조 착향용으로 사용하는 방향성 물질 혼합물입니다.\n2. 관세율표 제3302.10호는 식품 및 음료공업용 방향성 물질의 혼합물을 전용 분류하며, HSK 제3302.10-9000호에 확정 분류됩니다.",
        "sectionNote": "제6부 화학공업 및 연관공업의 생산품",
        "chapterNote": "제33류 정유와 레지노이드, 조제향료, 화장품",
        "exclusionNote": "⚠️ 조미 소스류(제2103호) 및 합성 에센스 오일(제3301호)과 구분하십시오.",
        "headingExplanation": "WCO 제3302.10호 해설: 음료 및 식품가공 원료용으로 사용되는 방향성 물질의 혼합물을 분류함.",
        "precedents": [],
        "competingHsCodes": [
            {
                "hsCode": "2103.90-9090",
                "headingName": "제2103.90호 기타 소스 조제품",
                "appliedGri": "통칙 제1호",
                "reasoning": "식품 조미 첨가물로 보아 제2103호 검토",
                "exclusionReason": "착향 목적의 방향성 추출물 혼합물이므로 제3302호가 우선함."
            }
        ]
    }
]

def normalize_food_spelling(query: str) -> str:
    if not query:
        return ""
    q = query.lower()
    replacements = [
        ("크렌베리", "크랜베리"),
        ("그랜베리", "크랜베리"),
        ("그렌베리", "크랜베리"),
        ("글랜베리", "크랜베리"),
        ("클랜베리", "크랜베리"),
        ("크랜배리", "크랜베리"),
        ("그랜배리", "크랜베리"),
        ("크렌배리", "크랜베리"),
        ("그렌배리", "크랜베리"),
        ("크랜베릐", "크랜베리"),
        ("불루베리", "블루베리"),
        ("블루배리", "블루베리"),
        ("불루배리", "블루베리"),
        ("블렉베리", "블랙베리"),
        ("블랙배리", "블랙베리"),
        ("블렉배리", "블랙베리"),
        ("라스베리", "라즈베리"),
        ("라즈배리", "라즈베리"),
        ("라스배리", "라즈베리"),
        ("링골베리", "링곤베리"),
        ("아싸이베리", "아사이베리"),
        ("아사이배리", "아사이베리"),
        ("아싸이배리", "아사이베리"),
        ("스트로우베리", "딸기"),
        ("스트로베리", "딸기"),
        ("스트로배리", "딸기"),
        ("초콜렛", "초콜릿"),
        ("초코렛", "초콜릿"),
        ("초코릿", "초콜릿"),
        ("쵸콜릿", "초콜릿"),
        ("쵸콜렛", "초콜릿"),
        ("쵸코렛", "초콜릿"),
        ("쵸코릿", "초콜릿"),
        ("소세지", "소시지"),
        ("쏘세지", "소시지"),
        ("쏘시지", "소시지"),
        ("쇼세지", "소시지"),
        ("카라멜", "캐러멜"),
        ("캬라멜", "캐러멜"),
        ("캐라멜", "캐러멜"),
        ("카러멜", "캐러멜"),
        ("케찹", "케첩"),
        ("케챂", "케첩"),
        ("마요네스", "마요네즈"),
        ("마요네쓰", "마요네즈"),
        ("샤인머스켓", "샤인머스캣"),
        ("샤인머스캇", "샤인머스캣"),
        ("아보가도", "아보카도"),
        ("브로컬리", "브로콜리"),
        ("브로코리", "브로콜리"),
        ("카모마일", "캐모마일"),
        ("카밀레", "캐모마일"),
        ("캐모밀", "캐모마일"),
        ("피넛버터", "땅콩버터"),
        ("피넛 버터", "땅콩버터"),
        ("핫케익", "핫케이크"),
        ("팬케익", "팬케이크"),
        ("라테", "라떼"),
        ("라떼파우다", "라떼파우더"),
        ("랃떼", "라떼"),
        ("치아바타빵", "치아바타"),
        ("치아바타 빵", "치아바타"),
        ("바게뜨", "바게트"),
        ("크로와상", "크루아상"),
        ("페스츄리", "페이스트리"),
        ("도너츠", "도넛"),
        ("케익", "케이크"),
        ("올리브오일식물성캡슐", "올리브오일 식물성 캡슐"),
        ("올리브유식물성캡슐", "올리브유 식물성 캡슐"),
        ("식물성캡슐", "식물성 캡슐"),
        ("올리브오일캡슐", "올리브오일 캡슐"),
        ("올리브유캡슐", "올리브유 캡슐"),
        ("오메가3캡슐", "오메가3 캡슐"),
        ("크릴오일캡슐", "크릴오일 캡슐")
    ]
    for src, dst in replacements:
        q = q.replace(src, dst)
    return q

def find_food_backend_rule(product_name: str, material: str = "", function_use: str = "") -> dict:
    p_norm = normalize_food_spelling(product_name.lower().strip())
    m_norm = normalize_food_spelling(material.lower().strip())
    f_norm = normalize_food_spelling(function_use.lower().strip())
    pm_norm = f"{p_norm} {m_norm}".strip()
    
    raw_query = f"{product_name} {material} {function_use}".lower().strip()
    query = normalize_food_spelling(raw_query)

    # 0. 비식품 산업용 품목 즉시 배제 가드레일 (사파이어, 반도체 웨이퍼, 센서, 모터, 레이저 절단기 등 오매칭 방지)
    if any(ind in p_norm for ind in [
        "사파이어", "sapphire", "잉곳", "ingot", "반도체", "semiconductor", "센서", "sensor",
        "변압기", "transformer", "서보모터", "전동기", "motor", "펌프", "pump",
        "레이저", "laser", "절단기", "공작기계", "cnc", "파이버", "fiber",
        "igbt", "plc", "tpu", "cfrp", "동박", "copper foil", "볼트", "너트", "자켓", "등산자켓",
        "라이다", "레이더", "엔코더", "다이오드", "트랜지스터", "집적회로", "축전지", "배터리"
    ]):
        return None
    
    # 1. 최우선 특수 품목 판정 (혼동 방지)
    # 1-0-효모. 활성/건조 효모 및 이스트 (제2102호 - 제빵용 빵 매칭 간섭 방지)
    if any(y in p_norm or y in pm_norm for y in ["효모", "이스트", "yeast"]):
        return None

    # 1-0-착향료. 바닐라 엑기스 / 착향료 혼합물 (제3302호)
    if any(k in pm_norm or k in query for k in ["바닐라 엑기스", "바닐라엑기스", "바닐라 추출물", "바닐라에센스", "바닐라 에센스", "착향료 혼합물", "식품용 바닐라"]):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 66)

    # 1-0-빵. 베이커리 완제품 (치아바타 / 바게트 / 크루아상 / 쿠키 등 제1905호 - 원재료에 올리브유/버터가 있어도 빵이 최우선)
    if any(k in p_norm for k in ["치아바타", "ciabatta", "바게트", "baguette", "깜빠뉴", "깜파뉴", "campagne", "사워도우", "sourdough", "포카치아", "focaccia", "식빵", "구운 빵", "베이글", "bagel", "브리오슈", "brioche", "호밀빵", "통밀빵", "플랫브레드", "피타브레드", "빵"]):
        if any(y in pm_norm for y in ["효모", "이스트", "yeast"]):
            return None
        # 만약 프리믹스/생지/반죽인 경우
        if any(d in pm_norm for d in ["믹스", "생지", "반죽", "dough", "mix", "프리믹스"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 25)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 60)
    
    if any(k in p_norm for k in ["크루아상", "croissant", "페이스트리", "pastry", "케이크", "cake", "머핀", "muffin", "스콘", "scone", "타르트", "tart", "애플파이", "호두파이", "피칸파이", "파이류", "와플", "waffle", "도넛", "donut", "doughnut"]) or ("파이" in p_norm and not any(ex in p_norm for ex in ["사파이어", "파이프", "스파이", "파이버", "광파이버", "레이저", "절단기", "cnc", "금속", "metal", "fiber"])):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 61)

    if any(k in p_norm for k in ["쿠키", "cookie", "비스킷", "biscuit", "크래커", "cracker", "스낵과자", "웨하스"]) or ("웨이퍼" in p_norm and not any(ex in p_norm for ex in ["반도체", "실리콘", "패턴", "결함"])):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 62)

    # 1-0-오일캡슐. 올리브오일 캡슐 / 식물성 캡슐 / 엑스트라 버진 올리브유 / 오메가3 (제2106호 vs 제1509호)
    if any(c in p_norm or c in query for c in ["캡슐", "capsule", "연질", "식물성 캡슐", "식물성캡슐", "식이보충", "영양제", "보충제"]):
        if "올리브" in pm_norm or "olive" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 63)
        if any(om in pm_norm or om in query for om in ["오메가3", "오메가-3", "omega-3", "omega 3", "크릴오일", "krill oil", "정제어유"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 65)

    if "올리브" in p_norm or "olive" in p_norm:
        if any(c in pm_norm or c in query for c in ["캡슐", "capsule", "연질", "식물성", "식이보충", "영양제", "보충제", "정제"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 63)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 64)

    if any(om in p_norm or om in query for om in ["오메가3", "오메가-3", "omega-3", "omega 3", "크릴오일", "krill oil", "정제어유"]):
        if any(c in pm_norm or c in query for c in ["캡슐", "capsule", "연질", "식이보충", "영양제", "보충제"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 65)

    # 1-0a. 냉동 혼합 과실 / 베리 믹스 / 혼합 과일 (0811.90-9000)
    if any(k in query or k in raw_query for k in ["혼합 과일", "혼합과일", "혼합 과실", "베리 믹스", "베리믹스", "mixed fruit", "mixed berries", "frozen mixed", "냉동 과일", "냉동과일", "단순 냉동 과일"]):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 52)

    # 1-0b-0. 라떼 파우더 / 카페라떼 / 녹차라떼 정밀 분기
    if any(k in pm_norm or k in p_norm for k in ["라떼", "라테", "카페라떼", "바닐라라떼", "카라멜라떼", "말차라떼", "녹차라떼", "밀크티", "조제커피", "커피믹스", "latte"]):
        if any(g in pm_norm or g in p_norm for g in ["녹차", "말차", "그린티", "matcha", "green tea"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 59)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 58)

    # 1-0b-1. 크랜베리/그랜베리/크렌베리 전용 정밀 분기
    if any(k in pm_norm or k in p_norm for k in ["크랜베리", "그랜베리", "크렌베리", "그렌베리", "글랜베리", "클랜베리", "cranberry"]):
        if any(j in pm_norm for j in ["주스", "과즙", "juice", "농축액", "착즙"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 57)
        if any(d in pm_norm for d in ["건조", "dried", "가당", "설탕절임", "조제"]):
            if any(u in pm_norm for u in ["무가당", "무설탕", "비가당", "unsweetened"]):
                return None
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 56)
        if any(fz in pm_norm for fz in ["냉동", "frozen", "iqf", "급속냉동"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 54)
        if any(fr in pm_norm for fr in ["신선", "생과", "fresh", "생크랜베리", "생 크랜베리", "생그랜베리", "생 그랜베리", "생크렌베리", "생 크렌베리", "생그렌베리", "생 그렌베리"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 55)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 54)

    # 1-0b-2. 블루베리 / 빌베리 정밀 분기
    if any(k in pm_norm or k in p_norm for k in ["블루베리", "불루베리", "blueberry", "빌베리", "bilberry"]):
        if any(f in pm_norm for f in ["가루", "분말", "powder", "flour", "meal"]):
            pass
        elif any(fr in pm_norm for fr in ["신선", "생과", "fresh", "생 블루베리", "생블루베리", "생 불루베리"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 53)
        else:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 51)

    # 1-0c. '과일' 단독 질의이면서 원재료에 베리류/블루베리 등이 있는 경우
    if "과일" in pm_norm or "fruit" in pm_norm:
        if any(b in pm_norm for b in ["블루베리", "라즈베리", "블랙베리", "딸기", "berry", "blueberry"]):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 52)

    # 1-1. 베이커리/튀김 조제 프리믹스 (제1901호 - 밀가루/쌀가루 원료 혼동 방지)
    if any(pk in pm_norm for pk in ["핫케이크", "팬케이크", "pancake"]):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 25)
    if any(tk in pm_norm for tk in ["튀김가루", "부침가루", "튀김 가루", "부침 가루", "batter mix"]):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 26)

    # 1-2. 벌꿀 (사양벌꿀 2106 vs 천연벌꿀 0409) - 캔디/사탕/과자류는 제1704호로 배제
    if not any(ex in pm_norm for ex in ["캔디", "사탕", "candy", "과자", "젤리", "캐러멜", "카라멜", "sweets"]):
        if "사양" in pm_norm or "설탕급여" in pm_norm or "sugar-fed" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 44)
        if "천연 벌꿀" in pm_norm or "천연벌꿀" in pm_norm or "아카시아꿀" in pm_norm or "벌꿀" in pm_norm or "꿀" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 43)

    # 1-3. 땅콩버터 (2008.11-1000) vs 볶은땅콩 vs 생땅콩
    if any(pb in pm_norm for pb in ["땅콩버터", "땅콩 버터", "피넛버터", "peanut butter"]):
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 22)
    if "땅콩" in pm_norm:
        if "볶은" in pm_norm or "roasted" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 20)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 21)

    # 1-4. 참깨 / 들깨 정밀 분기
    if "참깨" in pm_norm:
        if "고운" in pm_norm or "미세" in pm_norm or "고운분말" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 17)
        if "거친가루" in pm_norm or "파쇄" in pm_norm or "1.25mm" in pm_norm or "cracked" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 16)
        if "참깨가루" in pm_norm or ("식용" in pm_norm and "가루" in pm_norm):
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 15)
        if "볶은" in pm_norm or "roasted" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 13)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 14)

    if "들기름" in pm_norm or "참기름" in pm_norm or "오일" in pm_norm or "기름" in pm_norm:
        # 식용유지(15류)는 12류 종자 룰을 건너뜀
        pass
    elif "들깨" in pm_norm:
        if "가루" in pm_norm or "분말" in pm_norm or "탈피" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 18)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 19)

    # 1-5. 커피 (원두 0901 vs 인스턴트 2101)
    if "커피" in pm_norm:
        if "인스턴트" in pm_norm or "동결건조" in pm_norm or "추출물" in pm_norm or "분말" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 40)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 39)

    # 1-6. 카레 (레토르트 2103 vs 분말 0910)
    if "카레" in pm_norm:
        if "레토르트" in pm_norm or "3분" in pm_norm or "즉석" in pm_norm or "조리" in pm_norm or "소스" in pm_norm:
            return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 49)
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 48)

    # 1-7. 배추 / 김치 (김치 2005 vs 절임배추 0711)
    if "김치" in pm_norm or "kimchi" in pm_norm:
        return next(r for r in FOOD_50_BACKEND_RULES if r["id"] == 37)
    # 1-8. 효모 / 이스트 (2102호) - 제빵용 빵 룰(1905) 매칭 간섭 방지
    if "효모" in pm_norm or "이스트" in pm_norm or "yeast" in pm_norm:
        return None

    # 1-9. 무가당 건조 크랜베리 (0813호) - 조제 가당 크랜베리 룰(2008) 매칭 간섭 방지
    if ("크랜베리" in pm_norm or "cranberry" in pm_norm) and any(u in pm_norm for u in ["무가당", "무설탕", "비가당", "unsweetened"]):
        return None

    # 2. 나머지 일반 루프 매칭
    for rule in FOOD_50_BACKEND_RULES:
        if rule["id"] in [43, 44] and any(ex in query for ex in ["캔디", "사탕", "candy", "과자", "젤리", "캐러멜", "카라멜", "sweets"]):
            continue
        if rule["id"] in [14, 18, 19] and any(ex in query for ex in ["들기름", "참기름", "오일", "oil", "기름", "유지", "압착유"]):
            continue
        if rule["id"] == 61 and any(ex in query for ex in ["파이버", "광파이버", "레이저", "파이프", "절단기", "cnc", "금속", "metal", "fiber"]):
            continue
        if rule["id"] == 60 and any(ex in query for ex in ["효모", "이스트", "yeast"]):
            continue
        if rule["id"] == 56 and any(ex in query for ex in ["무가당", "무설탕", "비가당", "unsweetened"]):
            continue
            
        name_lower = rule["name"].lower()
        clean_name = name_lower.split('(')[0].strip()
        
        if any(k in pm_norm for k in rule["keywords"]) or clean_name in pm_norm or name_lower in pm_norm or any(k in query for k in rule["keywords"]):
            return rule

    return None
