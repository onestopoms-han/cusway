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
        },
        {
            "target_chapter": "85",  # Electric motors vs Furniture
            "excluded_headings": ["8501"],
            "exception_keywords": ["데스크", "책상", "스탠딩", "의자", "침대", "가구"],
            "error_msg": "[복합 가구 모순] 모터가 내장된 스탠딩 데스크/책상/의자/가구는 통칙 제3호 나목에 따라 완제품 가구 제9403호로 분류되어야 하며, 제8501호(전동기 단독)로 오분류되어서는 안 됩니다."
        },
        {
            "target_chapter": "68",  # Carbon fiber vs Helmets/Safety gear
            "excluded_headings": ["6815"],
            "exception_keywords": ["헬멧", "안전모", "모자", "보호구"],
            "error_msg": "[안전보호구 모순] 탄소섬유/카본 재질의 안전모/헬멧은 외피 재질에 관계없이 두부 보호구 제6506호(안전모)로 분류되어야 합니다."
        },
        {
            "target_chapter": "02",  # Raw meat vs Prepared Jerky
            "excluded_headings": ["0201", "0202", "0203"],
            "exception_keywords": ["육포", "양념", "건조육", "가공육", "소시지"],
            "error_msg": "[조제육류 모순] 양념, 건조 또는 가열 조제된 소고기 육포는 제02류(신선/냉장 생육)가 아니라 조제 식육 제1602호로 분류되어야 합니다."
        },
        {
            "target_chapter": "08",  # Fresh fruit vs Frozen Fruit
            "excluded_headings": ["0804", "0805", "0806", "0807", "0808", "0809", "0810"],
            "exception_keywords": ["냉동", "급속동결", "동결"],
            "error_msg": "[냉동과실 모순] 급속 동결 또는 냉동된 과실(아보카도 등)은 신선 과실(제0804호 등)이 아니라 냉동 과실 제0811호로 분류되어야 합니다."
        },
        {
            "target_chapter": "90",  # Thermometers vs General Medical instruments
            "excluded_headings": ["9018", "9019"],
            "exception_keywords": ["체온계", "온도계", "써모미터"],
            "error_msg": "[체온계 특게 모순] 인체 체온 측정용이라 하더라도 체온계는 제9018호(의료기기)가 아니라 온도계/체온계 전용 호인 제9025호(HSK 9025.19-1000호)로 최우선 분류되어야 합니다."
        },
        {
            "target_chapter": "90",  # Sterile Sutures & Dental Cements vs Medical Instruments
            "excluded_headings": ["9018"],
            "exception_keywords": ["봉합사", "봉합 원사", "봉합재", "치과용 시멘트", "복합레진"],
            "error_msg": "[의료용품 특게 모순] 제30류 주 제4호 가목 및 마목에 따라 외과 수술용 멸균 흡수성 봉합사와 치과용 시멘트/수복재는 제9018호(수술기구)가 아닌 제3006호(의료용품)로 전용 분류되어야 합니다."
        },
        {
            "target_chapter": "62",  # Knitted garments vs Woven garments
            "excluded_chapters": ["62"],
            "exception_keywords": ["편물", "메리야스", "knitted", "니트", "레깅스", "타이츠"],
            "error_msg": "[편물 의류 모순] 메리야스 편물(Knitted)로 제작된 의류는 직물제 의류(제62류)가 아닌 편물제 의류(제61류, 레깅스는 6104호)로 분류되어야 합니다 (제61류 총설)."
        },
        {
            "target_chapter": "03",  # Cooked/Boiled Shrimp vs Raw Seafood
            "excluded_headings": ["0306"],
            "exception_keywords": ["자숙", "데친", "삶은", "조리한"],
            "error_msg": "[조제 갑각류 모순] 끓는 물에 살짝 데치거나 삶은(자숙) 열처리 새우는 제0306호(생새우)에서 제외되며 제1605호(조제 또는 보존처리한 갑각류)로 분류되어야 합니다 (제3류 주 제1호 나목)."
        },
        {
            "target_chapter": "85",  # Vacuum Cleaners vs General Robots/Appliances
            "excluded_headings": ["8479", "8509"],
            "exception_keywords": ["로봇청소기", "진공청소기", "청소기"],
            "error_msg": "[진공청소기 특게 모순] 전동기를 자체 내장한 진공청소기(로봇청소기 포함)는 제8479호(로봇)나 제8509호(가정용 기기)가 아닌 제8508호(진공청소기)로 분류되어야 합니다."
        }
,
        {
            "target_chapter": "15",  # Flavoring Oil vs Pure Edible Oil
            "excluded_headings": ["1509", "1515", "1516"],
            "exception_keywords": ["향미유", "트러플", "향료", "조미"],
            "error_msg": "[향미유 모순] 식용 유지에 향료나 조미 성분을 첨가한 조미용 향미유(트러플 오일 등)는 제15류에서 제외되며 제2103호(조미료)로 분류되어야 합니다 (제15류 주 제1호)."
        },
        {
            "target_chapter": "09",  # Non-Camellia sinensis Herb Tea
            "excluded_headings": ["0902"],
            "exception_keywords": ["루이보스", "캐모마일", "페퍼민트", "허브차"],
            "error_msg": "[차류 한정 모순] Camellia sinensis 속의 식물이 아닌 허브차(루이보스, 캐모마일 등)는 제0902호(차)에서 제외되며 제1211호(향료/약용 식물)로 분류되어야 합니다 (제0902호 용어)."
        },
        {
            "target_chapter": "30",  # Botulinum Toxin vs General Medicaments
            "excluded_headings": ["3004"],
            "exception_keywords": ["보툴리눔", "독소", "보톡스", "toxin"],
            "error_msg": "[독소 특게 모순] 보툴리눔 독소 등 미생물 독소(Toxins)는 소매 완제 의약품(제3004호)보다 제3002호(독소)로 우선 분류되어야 합니다 (제30류 주 규정)."
        },
        {
            "target_chapter": "39",  # Non-adhesive Tape vs Self-adhesive Tape
            "excluded_headings": ["3919"],
            "exception_keywords": ["점착제 없음", "비점착", "씰테이프", "씰 테이프"],
            "error_msg": "[점착성 테이프 모순] 점착제(접착제)가 없는 PTFE 씰테이프/스트립은 제3919호(자착성)에서 제외되며 제3920호로 분류되어야 합니다 (제3919호 용어)."
        },
        {
            "target_chapter": "95",  # Pet Toys vs Human Toys
            "excluded_headings": ["9503"],
            "exception_keywords": ["고양이", "반려묘", "스크래쳐", "동물용"],
            "error_msg": "[동물용 완구 모순] 동물용 완구 및 놀이기구(고양이 스크래쳐 등)는 제9503호에서 제외되며 구성 재질(골판지 제4823호 등)로 분류되어야 합니다 (제95류 주 제1호)."
        },
        {
            "target_chapter": "63",  # Cleaning Wiping Cloth vs Household Linen
            "excluded_headings": ["6302"],
            "exception_keywords": ["세차", "와이핑", "청소용", "클로스"],
            "error_msg": "[와이핑 클로스 모순] 차량 세차 및 청소용 와이핑 클로스/타월은 가정용 린넨(제6302호)이 아니라 청소용 포(제6307.10호)로 분류되어야 합니다."
        },
        {
            "target_chapter": "84",  # Gas Cylinder vs Machinery
            "excluded_headings": ["8486"],
            "exception_keywords": ["수소저장", "수소탱크", "수소용기", "가스용기"],
            "error_msg": "[고압가스용기 모순] 고압 가스/수소 저장 실린더 용기는 기계류(제8486호)가 아니라 알루미늄 용기 제7613호 또는 철강 용기 제7311호로 분류되어야 합니다."
        },
        {
            "target_chapter": "84",  # Liquid Pump vs Semiconductor Machinery
            "excluded_headings": ["8486"],
            "exception_keywords": ["다이아프램 펌프", "aodd", "유체 이송 펌프"],
            "error_msg": "[액체 펌프 모순] 유체 이송용 다이아프램 펌프는 반도체 기계(제8486호)가 아니라 액체 펌프 제8413호로 분류되어야 합니다."
        },
        {
            "target_chapter": "90",  # Operating Table vs Medical Devices
            "excluded_headings": ["9018", "9019"],
            "exception_keywords": ["수술대", "진찰대", "병원용 침대"],
            "error_msg": "[의료용 가구 특게 모순] 제90류 주 제1호 (ij)목에 따라 전동식/유압식을 불문하고 환자용 수술대·진찰대 등 의료용 가구는 제9018호(수술기구)가 아니라 제9402호(의료용 가구)로 전용 분류되어야 합니다."
        },
        {
            "target_chapter": "30",  # Surgical Rubber Gloves vs Medical Gel/Articles
            "excluded_headings": ["3006"],
            "exception_keywords": ["장갑", "검진 장갑", "수술용 장갑", "라텍스 장갑"],
            "error_msg": "[고무장갑 재질 특게 모순] 멸균 수술용 또는 검진용이라 하더라도 천연가황고무제 장갑은 제3006호(의료용품/겔)가 아니라 제4015호(가황고무제 의류 및 장갑)로 분류되어야 합니다."
        },
        {
            "target_chapter": "30",  # Dental Crowns / Prosthetics vs Dental Cements
            "excluded_headings": ["3006"],
            "exception_keywords": ["인공치아", "크라운", "보철물", "치아 크라운", "임플란트 픽스처"],
            "error_msg": "[인공치아 특게 모순] 치과 보철용 지르코니아/세라믹 인공치아 크라운은 제3006호(치과용 시멘트)가 아니라 제9021호(인공치아/정형외과용 기기)로 전용 분류되어야 합니다."
        },
        {
            "target_chapter": "11",  # Raw Wheat Grains vs Milled Flour
            "excluded_headings": ["1101", "1102"],
            "exception_keywords": ["곡물 낟알", "비종자", "원맥", "비분쇄", "낟알", "연질 적색 밀"],
            "error_msg": "[곡물 vs 제분가루 모순] '제분용'이라는 용도 표시가 있더라도 분쇄되지 않은 원형 곡물 낟알(밀 등)은 제1101호(밀가루)가 아니라 제1001호(밀 곡물)로 분류되어야 합니다."
        },
        {
            "target_chapter": "22",  # Pickles / Pickled Veg vs Vinegar
            "excluded_headings": ["2209"],
            "exception_keywords": ["피클", "침지 채소", "오이 피클", "절임"],
            "error_msg": "[조제 채소 모순] 식초나 초산에 침지·절임 처리한 채소(오이 피클 등)는 제2209호(식초)에서 제외되며 제2001호(식초로 조제한 채소)로 분류되어야 합니다 (제20류 주 제1호)."
        },
        {
            "target_chapter": "84",  # Printing Machines vs Semiconductor Tools
            "excluded_headings": ["8486"],
            "exception_keywords": ["인쇄기", "그라비아", "옵셋", "프린팅 머신"],
            "error_msg": "[인쇄기계 특게 모순] 롤투롤 필름 인쇄기나 그라비아 인쇄기는 반도체 기기(제8486호)가 아니라 제8443호(인쇄기계)로 분류되어야 합니다."
        },
        {
            "target_chapter": "94",  # Leather articles/fabric hijacked into Furniture
            "excluded_headings": ["9401", "9402", "9403", "9404"],
            "exception_keywords": ["소가죽", "가죽 원단", "가공 가죽", "피혁", "은면가죽", "leather"],
            "error_msg": "[원자재 용도침범 모순] 가구용 소파 커버 등으로 사용되더라도 조립되지 않은 가죽 원단/피혁은 제94류(가구)에서 배제되며 제41류(가죽, 4107호)로 분류되어야 합니다 (제94류 주 제1호 및 GRI 제1호)."
        },
        {
            "target_chapter": "16",  # Fresh/Chilled Unseasoned Meat vs Prepared Meat
            "excluded_headings": ["1601", "1602"],
            "exception_keywords": ["신선", "냉장", "무양념", "생 갈비", "소 갈비", "돼지 삼겹살", "생육"],
            "error_msg": "[신선육 vs 조제육류 모순] 양념, 열처리 조리 또는 건조되지 않은 신선/냉장 식육은 '조리용'이라는 용도 표시가 있더라도 제16류(조제육류)에서 배제되고 제02류(0201/0202호 등)로 분류되어야 합니다 (제16류 주 제1호)."
        },
        {
            "target_chapter": "21",  # Malt Extract vs Basket Food Preparations
            "excluded_headings": ["2106"],
            "exception_keywords": ["맥아 추출물", "맥아추출물", "malt extract", "맥아 엑스"],
            "error_msg": "[맥아 추출물 특게 모순] 맥아 추출물은 일반 조제식료품(제2106호)이 아니라 제1901호(맥아 추출물)에 전용 특게되어 있으므로 GRI 제3호 가목에 따라 제1901호로 우선 분류되어야 합니다."
        },
        {
            "target_chapter": "12",  # Soya Beans vs Other Oil Seeds
            "excluded_headings": ["1207"],
            "exception_keywords": ["대두", "황대두", "콩", "soya", "soybean"],
            "error_msg": "[대두 특게 모순] 대두(콩)는 '착유용' 목적이더라도 기타 채유용 종실(제1207호)이 아니라 대두 전용 호인 제1201호로 분류되어야 합니다 (GRI 제1호 및 제3호 가목)."
        },
        {
            "target_chapter": "33",  # Hair Shampoo vs Skincare / General Cosmetics
            "excluded_headings": ["3304"],
            "exception_keywords": ["샴푸", "두발 세정", "shampoo", "헤어클렌저"],
            "error_msg": "[샴푸 특게 모순] 머리털 세정용 샴푸는 기초화장용 제품류(제3304호)가 아니라 두발용 제품류 제3305호(샴푸 3305.10호)로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "40",  # New Tyres vs Retreaded / Used Tyres
            "excluded_headings": ["4012"],
            "exception_keywords": ["신품", "미사용", "새 타이어", "레이디얼"],
            "error_msg": "[공기타이어 신품 특게 모순] 미사용 신품 고무제 공기타이어는 재생/중고 타이어(제4012호)가 아니라 신품 공기타이어 제4011호로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "90",  # X-ray CT Scanner vs General Medical Instruments
            "excluded_headings": ["9018"],
            "exception_keywords": ["단층촬영", "ct 스캐너", "ct scanner", "엑스선", "x-ray", "x선"],
            "error_msg": "[엑스선 단층촬영기 특게 모순] 엑스선을 응용한 컴퓨터 단층촬영장치(CT Scanner)는 일반 의료기기(제9018호)가 아니라 엑스선 응용기기 제9022호(9022.12호)로 분류되어야 합니다 (GRI 제3호 가목)."
        },
        {
            "target_chapter": "72",  # Stainless Steel Flat-Rolled Width Threshold
            "excluded_headings": ["7220"],
            "exception_keywords": ["1219", "1000", "폭 600", "폭 1", "광폭", "코일"],
            "error_msg": "[스테인리스강 평판 규격 모순] 폭이 600mm 이상인 스테인리스강 평판압연제품은 제7220호(폭 600mm 미만)가 아니라 제7219호(폭 600mm 이상)로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "76",  # Aluminium Tubes & Pipes vs Plates & Sheets
            "excluded_headings": ["7606"],
            "exception_keywords": ["압출관", "배관", "파이프", "튜브", "외경", "tube", "pipe"],
            "error_msg": "[알루미늄 관 특게 모순] 원형 단면의 알루미늄 배관/압출관은 판/시트(제7606호)가 아니라 알루미늄 관 제7608호로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "90",  # Digital Camera vs Analog Film Camera
            "excluded_headings": ["9006"],
            "exception_keywords": ["디지털", "digital", "센서", "cmos", "ccd", "미러리스", "dslr"],
            "error_msg": "[디지털 카메라 제외조항 저촉] 제90류 주 제1호 (h)목에 따라 디지털 카메라 및 비디오카메라는 제9006호(필름카메라)에서 명백히 배제되며 제8525호(디지털 카메라 8525.89호)로 분류되어야 합니다."
        },
        {
            "target_chapter": "50",  # Cotton Yarn vs Silk
            "excluded_headings": ["5007", "5006", "5005"],
            "exception_keywords": ["면사", "면 섬유", "방적사", "cotton yarn"],
            "error_msg": "[면사 재질 모순] 천연 면 섬유로 만든 면사는 견/실크(제50류)가 아니라 제52류(면사 제5205호 등)로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "08",  # Crustaceans / Dried Shrimp vs Dried Fruits
            "excluded_headings": ["0813", "0811", "0812"],
            "exception_keywords": ["새우", "새우살", "갑각류", "shrimp", "게살", "오징어"],
            "error_msg": "[수산물 vs 과실류 모순] 동결건조되었더라도 새우/갑각류 등 수산물은 건조 과실(제0813호)이 아니라 제0306호(갑각류)로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "15",  # Coconut oil vs Other fixed vegetable oils
            "excluded_headings": ["1515"],
            "exception_keywords": ["코코넛", "야자핵", "coconut", "바바수"],
            "error_msg": "[코코넛유 특게 모순] 코코넛유는 기타 식물성 유지(제1515호)가 아니라 전용 특게 호인 제1513호로 분류되어야 합니다 (GRI 제3호 가목)."
        },
        {
            "target_chapter": "08",  # Walnuts vs Tropical fruits
            "excluded_headings": ["0804"],
            "exception_keywords": ["호두", "walnut", "헤이즐넛", "아몬드"],
            "error_msg": "[견과류 특게 모순] 호두 등 견과류는 열대과실(제0804호)이 아니라 견과류 전용 호인 제0802호로 분류되어야 합니다 (GRI 제1호)."
        },
        {
            "target_chapter": "20",  # Roasted coffee vs Prepared food
            "excluded_headings": ["2008", "2009"],
            "exception_keywords": ["커피", "coffee", "원두", "에스프레소"],
            "error_msg": "[커피 배제 규정 모순] 볶은 커피 원두는 제20류(조제식품)에서 배제되며 커피 전용 호인 제0901호로 분류되어야 합니다 (제20류 주 제1호 및 제0901호 본문)."
        },
        {
            "target_chapter": "30",  # Vaccines vs Retail medicaments
            "excluded_headings": ["3004"],
            "exception_keywords": ["백신", "vaccine", "항원"],
            "error_msg": "[백신 특게 모순] 인체용 및 동물용 백신은 소매 완제 의약품(제3004호)에서 제외되며 면역물품/백신 전용 호인 제3002호(3002.41호 등)로 분류되어야 합니다 (제30류 주 제2호)."
        },
        {
            "target_chapter": "62",  # Leather apparel vs Woven fabric apparel
            "excluded_headings": ["6201", "6202", "6203", "6204"],
            "exception_keywords": ["소가죽", "가죽 자켓", "라이더 자켓", "천연가죽 외투", "leather jacket"],
            "error_msg": "[가죽 의류 배제 모순] 천연 가죽이나 모조 가죽으로 만든 의류 및 자켓은 직물제 의류(제62류)에서 배제되며 가죽제 의류 제4203호로 분류되어야 합니다 (제62류 주 제1호 다목)."
        },
        {
            "target_chapter": "75",  # Titanium vs Nickel
            "excluded_headings": ["7505", "7506", "7507"],
            "exception_keywords": ["티타늄", "titanium", "ti-6al"],
            "error_msg": "[티타늄 금속 류 모순] 티타늄 및 그 합금 봉/판은 니켈(제75류)이 아니라 티타늄 전용 류인 제81류(8108호)로 분류되어야 합니다."
        },
        {
            "target_chapter": "84",  # General CNC Laser & Plastic Molders vs 8486
            "excluded_headings": ["8486"],
            "exception_keywords": ["레이저 절단", "레이저 가공기", "파이버 레이저", "사출 성형", "사출기", "플라스틱 사출"],
            "error_msg": "[반도체 장비 과적용 모순] 반도체/디스플레이 전용 제조 장비가 아닌 일반 금속 절단용 레이저 공작기계는 제8456호로, 일반 플라스틱 사출성형기는 제8477호로 분류되어야 합니다 (제84류 주 제9호)."
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
                            
            # Check Heading Exclusions
            if chapter == rule.get("target_chapter"):
                if heading in rule.get("excluded_headings", []):
                    # Check if query contains any of the target prohibited keywords for this heading
                    has_kw = any(exc in query_text for exc in rule.get("exception_keywords", []))
                    if has_kw:
                        score_deduction += 50
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
