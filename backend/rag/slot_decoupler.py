"""
CUSWAY Slot Decoupler Architecture (Constitutional Rule Engine Tier-1)
Implements strictly decoupled 3-Slot representation without brittle keyword hijacking:
Slot 1: Physical As-Is Subject & Head Noun
Slot 2: Compounded Ingredients & Base Material
Slot 3: Operational Purpose, Industry Application & Target Object
"""

import re

# Physical State Markers (가공 상태 및 구조적 성상)
STATE_MARKERS = [
    # 열처리 및 가공도
    ("자숙", "열처리(자숙/데침) 가공 (제03류 배제 -> 제16류 조제품)"),
    ("데친", "열처리(자숙/데침) 가공 (제03류 배제 -> 제16류 조제품)"),
    ("삶은", "열처리(삶음) 가공 (제03류 배제 -> 제16류 조제품)"),
    ("볶은", "열처리(볶음/로스팅) 가공 (제08/12류 배제 -> 제2008호 조제품)"),
    ("볶음", "열처리(볶음/로스팅) 가공 (제08/12류 배제 -> 제2008호 조제품)"),
    ("구운", "열처리(구움) 가공"),
    ("동결건조", "진공 동결건조(Freeze-dried) 물리적 가공 상태"),
    ("건조", "단순 건조(Dried) 가공"),
    ("냉동", "급속 냉동(Frozen) 상태"),
    ("냉장", "신선/냉장(Fresh/Chilled) 상태"),
    ("압착", "물리적 압착(Cold-pressed/Expressed) 추출"),
    
    # 섬유/직물 구조
    ("메리야스", "편물(Knitted/Crocheted) 구조 (제60류/제61류 최우선)"),
    ("편물", "편물(Knitted/Crocheted) 구조 (제60류/제61류 최우선)"),
    ("니트", "편물(Knitted/Crocheted) 구조 (제60류/제61류 최우선)"),
    ("knitted", "편물(Knitted/Crocheted) 구조 (제60류/제61류 최우선)"),
    ("직물", "직물(Woven fabric) 구조 (제50~55류/제62류)"),
    ("직포", "직물(Woven fabric) 구조 (제50~55류/제62류)"),
    ("부직포", "부직포(Non-woven) 구조 (제56류)"),
    ("도포", "플라스틱/고무 도포·피복(Coated/Laminated) 직물 (제5903호 -> 제6210호 의류 최우선)"),
    ("코팅", "표면 도포·코팅(Coated/Laminated) 가공"),
    ("라미네이팅", "다층 라미네이팅(Laminated) 가공 (제5903호 -> 제6210호 의류 최우선)"),
    ("인조가죽", "합성수지 도포 방직용 섬유(합성피혁) (제5903호 직물제 -> 제6216호 장갑 등)"),
    ("합성피혁", "합성수지 도포 방직용 섬유(합성피혁) (제5903호 직물제 -> 제6216호 장갑 등)"),
    
    # 의료/특수 법정 주규정
    ("봉합사", "제30류 주4호 가목: 외과 수술용 멸균 흡수성 봉합사는 제3006호 전용"),
    ("봉합 원사", "제30류 주4호 가목: 외과 수술용 멸균 흡수성 봉합사는 제3006호 전용"),
    ("체온계", "제90류 체온계/온도계는 의료용 불문 제9025호 최우선 특게"),
    ("온도계", "제90류 체온계/온도계는 의료용 불문 제9025호 최우선 특게"),
    ("치과용 시멘트", "제30류 주4호 마목: 치과용 시멘트/수복재는 제3006호 전용"),
    ("치과용 수복재", "제30류 주4호 마목: 치과용 시멘트/수복재는 제3006호 전용"),
    ("치과 충전재", "치과 충전용 시멘트는 제3006호 전용"),
    ("진공청소기", "모터 내장식 진공청소기는 제8479호 로봇이 아닌 제8508호 최우선"),
    ("로봇청소기", "모터 내장식 진공청소기는 제8479호 로봇이 아닌 제8508호 최우선"),
    ("3D 프린터", "적층제조기(3D 프린터)는 제8485호(금속 SLM은 8485.10호) 전용"),
    ("3D프린터", "적층제조기(3D 프린터)는 제8485호(금속 SLM은 8485.10호) 전용"),
    ("그라인더", "가정용 모터내장 원두 그라인더는 제8509호(가정용 전기기기) 최우선"),
    
    # 화학 및 형태적 성상
    ("분말", "분말/가루(Powder) 형태"),
    ("가루", "분말/가루(Powder/Flour) 형태"),
    ("액상", "액체/수용액(Liquid/Solution) 형태"),
    ("수용액", "액체/수용액(Solution) 형태"),
    ("요소수", "제31류 주1호 나목: 순수 요소 수용액은 화학품(3824)이 아닌 제3102호 비료"),
    ("펠릿", "수지 펠릿/알갱이(Pellets/Primary form) 형태"),
    ("슬러리", "슬러리/현탁액(Slurry) 형태"),
    ("판유리", "강화유리/안전유리는 제7007호 전용"),
    ("강화유리", "강화유리/안전유리는 제7007호 전용"),
    ("테이프", "테이프/스트립(Tape/Strip) 형태"),
    ("호스", "관/파이프/호스(Tube/Pipe/Hose) 형태"),
    ("단일화합물", "화학적으로 단일한 화합물(Pure single compound) (제28류/제29류)"),
    
    # 관세율표 부·류 정식 법정 주규정 (WCO Legal Notes & Precedent Rules)
    ("향미유", "제15류 주1호: 향미를 첨가한 식용 유지(트러플 오일 등)는 제15류 배제 -> 제2103호 조미유"),
    ("트러플 오일", "제15류 주1호: 향미를 첨가한 조미용 식용유는 제15류 배제 -> 제2103호 조미유"),
    ("루이보스", "제0902호 용어 한정: Camellia sinensis 외 식물성 잎/허브차 원물은 제0902호 차에서 명백히 배제 -> 제1211호 향료/약용 식물"),
    ("보툴리눔", "제30류 주 규정: 미생물 독소(Toxins, 보톡스 등)는 일반 완제의약품(3004)보다 제3002호(독소) 특게"),
    ("독소", "제30류 주 규정: 미생물 독소(Toxins)는 제3002호 특게"),
    ("ptfe", "제3919호 용어 한정: 점착제(접착제)가 없는 PTFE 씰테이프는 제3919호 자착성 배제 -> 제3920호 비점착성 플라스틱 스트립"),
    ("씰 테이프", "제3919호 용어 한정: 점착제가 없는 테이프는 제3919호 배제 -> 제3920호 비점착성 플라스틱 스트립"),
    ("스크래쳐", "제95류 주1호: 동물용 완구/놀이기구는 제95류 배제 -> 구성 재질별(골판지 제4823호) 분류"),
    ("패드 드레서", "제7105호 분말 배제 -> 금속 기재에 다이아몬드 지립이 고착된 연마 디스크는 제6804호 연마공구/연마차 분류"),
    ("드레서", "제7105호 분말 배제 -> 제6804호 연마공구/연마차 분류"),
    ("세차용", "제6302호 가정용 린넨 배제 -> 자동차 청소용 와이핑 클로스/타월은 제6307.10호 청소포 최우선"),
    ("와이핑 클로스", "제6307.10호 청소용 걸레/와이핑 클로스 최우선"),
    ("주걱", "주방 조리용 실리콘 주걱/스패출러는 제3924호 플라스틱제 식탁/주방용품 최우선"),
    ("스패출러", "주방 조리용 도구는 제3924호(실리콘/합성수지제) 또는 제8215호"),
    ("수소저장용기", "압축가스용 실린더/용기는 제7613호(알루미늄제) 또는 제7311호(철강제) (기계류 8486 배제)"),
    ("수소용기", "압축가스용 실린더/용기는 제7613호(알루미늄제) 또는 제7311호(철강제)"),
    ("다이아프램 펌프", "액체 이송 펌프는 제8413호 액체펌프 최우선 (반도체 8486 배제)"),
    ("aodd", "공압식 다이아프램 액체펌프는 제8413호 최우선"),
    ("헤드업 디스플레이", "반사경/광학계 투영식 HUD 모듈은 단순 패널(8524)이 아닌 제8528호 모니터/프로젝터 장비"),
    ("hud", "반사경/광학계 투영식 HUD 장치는 제8528호 모니터/프로젝터 장치"),
    ("방화복", "소방관 신체보호용 특수 방화복 상하의(세트)는 제6203호 최우선 (여성용 코트 6202 배제)"),
    ("에어백 조끼", "라이더 신체보호용 에어백 조끼/베스트는 제6211호 최우선 (코트 6202 배제)"),
    ("실버", "제71류 귀금속 주규정: 은(925실버)에 금 도금(플래팅)한 물품은 제7113.11호 은제품으로 분류"),
    ("은", "제71류 귀금속 주규정: 은 제품에 금 도금한 물품은 제7113.11호 은제품으로 분류"),
]

def decouple_3slots(product_name: str, material: str = "", function_use: str = "") -> dict:
    """
    Decouples raw inputs into clean, isolated 3-Slot representation:
    - subject: Complete As-Is Physical Subject (Head Noun)
    - head_noun: Core syntactic noun entity (e.g., '3D 프린터', '카고 바이크', '봉합 원사')
    - ingredients: Base materials & composition
    - function: Application, target object, operating purpose
    - state_notes: Detected physical processing states (자숙, 편물, 도포 등)
    """
    raw_name = str(product_name).strip() if product_name else ""
    raw_mat = str(material).strip() if material else ""
    raw_func = str(function_use).strip() if function_use else ""

    detected_states = []
    combined_search = f"{raw_name} {raw_mat} {raw_func}".lower()
    for kw, state_desc in STATE_MARKERS:
        if kw in combined_search:
            if state_desc not in detected_states:
                detected_states.append(state_desc)

    # Clean product name to extract pure head noun and subject
    # Extract parenthesized expressions (often materials or standards)
    extracted_notes = re.findall(r'\((.*?)\)', raw_name)
    name_without_parens = re.sub(r'\(.*?\)', '', raw_name).strip()

    # Split tokens
    tokens = name_without_parens.split()
    
    purposes_from_name = []
    materials_from_name = []
    remaining_tokens = []

    for t in tokens:
        if t.endswith("용") or t.endswith("전용") or t.endswith("위한"):
            purposes_from_name.append(t)
        elif any(mat_kw in t for mat_kw in ["알루미늄", "스테인리스", "철강", "실리콘", "테플론", "티타늄", "금속", "목재", "가죽", "아라미드", "골판지", "유리", "수산화리튬"]) or t in ["면", "순면", "면직물", "코튼", "면사"]:
            materials_from_name.append(t)
        else:
            remaining_tokens.append(t)

    # In Korean compound nouns, the head noun (주어) is predominantly at the very end.
    # Exclude trailing adjectives/modifiers (e.g. '튀기지 않은', '가공된') from being standalone head nouns.
    valid_remaining = []
    for rt in remaining_tokens:
        if rt.endswith("않은") or rt.endswith("없는") or rt.endswith("있는"):
            continue
        valid_remaining.append(rt)

    if valid_remaining:
        head_noun = " ".join(valid_remaining[-2:]) if len(valid_remaining) >= 2 else valid_remaining[-1]
    elif remaining_tokens:
        head_noun = " ".join(remaining_tokens[-2:]) if len(remaining_tokens) >= 2 else remaining_tokens[-1]
    else:
        head_noun = tokens[-1] if tokens else raw_name

    # Synthesize clean slots
    slot1_subject = name_without_parens if name_without_parens else raw_name
    
    # Slot 2 Ingredients
    slot2_parts = []
    if raw_mat:
        slot2_parts.append(raw_mat)
    if materials_from_name:
        slot2_parts.append(", ".join(materials_from_name))
    for note in extracted_notes:
        if any(w in note.lower() for w in ["pga", "wc", "ptfe", "pu", "pc", "slm", "gan", "lfp", "god", "abs"]):
            slot2_parts.append(f"사양/성분: {note}")
    slot2_ingredients = " | ".join(slot2_parts) if slot2_parts else "일반 복합 사양"

    # Slot 3 Function / Application
    slot3_parts = []
    if raw_func:
        slot3_parts.append(raw_func)
    if purposes_from_name:
        slot3_parts.append(f"적용분야: {', '.join(purposes_from_name)}")
    slot3_function = " | ".join(slot3_parts) if slot3_parts else "일반 공업 및 소비용"

    return {
        "raw_product_name": raw_name,
        "head_noun": head_noun,
        "slot1_subject": slot1_subject,
        "slot2_ingredients": slot2_ingredients,
        "slot3_function": slot3_function,
        "detected_states": detected_states
    }
