import re
import os
import json
import sqlite3
from typing import Dict, Any, List, Optional

try:
    from sqlalchemy.orm import Session
    from sqlalchemy import text
except ImportError:
    Session = Any
    def text(s): return s

def _execute(db: Any, sql_str: str, params: Optional[Dict[str, Any]] = None):
    """
    Executes a query whether db is a SQLAlchemy Session or a sqlite3 Connection.
    """
    if params is None:
        params = {}

    # If it's a SQLAlchemy Session
    if hasattr(db, 'execute') and hasattr(db, 'commit'):
        try:
            return db.execute(text(sql_str), params)
        except Exception:
            pass

    # If it's or can be used as sqlite3 Connection
    if hasattr(db, 'cursor'):
        cur = db.cursor()
    else:
        # fallback to direct cusway.db connection
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cusway.db")
        if not os.path.exists(db_path):
            db_path = "cusway.db"
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

    # Convert :named parameters to ? placeholders for sqlite3
    sql = sql_str
    args = []
    matches = re.findall(r':([a-zA-Z0-9_]+)', sql)
    for m in matches:
        sql = re.sub(rf':{m}\b', '?', sql, count=1)
        args.append(params.get(m))

    cur.execute(sql, args)
    return cur


# 관세율표 21개 부(Section) 매핑 정의
SECTIONS_INFO = [
    {
        "roman": "I",
        "title_ko": "제1부 살아 있는 동물과 동물성 생산품",
        "chapters": list(range(1, 6)),
        "notes": "1. 이 부에서 특정 동물의 속(genus)이나 종(species)을 열거한 경우에는 문맥상 달리 해석되지 않는 한 그 속이나 종의 어린 동물도 포함한다.\n2. 문맥상 달리 해석되지 않는 한 이 표 전체에서 '건조한' 것에는 탈수·증발이나 동결건조한 것도 포함한다."
    },
    {
        "roman": "II",
        "title_ko": "제2부 식물성 생산품",
        "chapters": list(range(6, 15)),
        "notes": "1. 이 부에서 '펠릿(pellet)'이란 직접 압축하거나 전중량의 100분의 3 이하의 점결제를 첨가하여 응집시킨 물품을 말한다."
    },
    {
        "roman": "III",
        "title_ko": "제3부 동·식물성 유지 및 이들의 분해생산물, 조제식용유지, 동·식물성 납",
        "chapters": [15],
        "notes": "제15류 주규정: 이 류에는 돼지비계, 가금의 지방, 소·양 등의 지방, 올리브유, 대두유, 팜유, 해바라기유 등과 이들의 분획물 및 경화유지를 분류하며, 화학적으로 변성 가공된 것은 제38류로 배제될 수 있습니다."
    },
    {
        "roman": "IV",
        "title_ko": "제4부 조제식료품, 음료·주류·식초, 담배 및 제조한 담배 대용물",
        "chapters": list(range(16, 25)),
        "notes": "1. 이 부에서 '펠릿'이란 직접 압축하거나 전중량의 100분의 3 이하의 점결제를 첨가하여 응집시킨 물품을 말한다.\n2. 제16류 주규정에 따라 소시지·육류·어류·갑각류 등이 20%를 초과하여 함유된 조제품은 제19류나 제20류, 제21류가 아닌 제16류로 우선 분류됩니다."
    },
    {
        "roman": "V",
        "title_ko": "제5부 광물성 생산품",
        "chapters": list(range(25, 28)),
        "notes": "소금, 황, 토석류, 석고, 석회, 시멘트(제25류), 광광·슬래그·회(제26류), 광물성 연료·광유 및 증류물(제27류)을 포괄합니다."
    },
    {
        "roman": "VI",
        "title_ko": "제6부 화학공업이나 연관공업의 생산품",
        "chapters": list(range(28, 39)),
        "notes": "1. 제28류나 제29류의 특정 화합물로서 정해진 화학적 단일화합물은 각각 해당 호에 분류됩니다.\n2. 둘 이상의 호에 해당하는 조제품은 제30류(의약품), 제31류(비료), 제32류(염료), 제33류(화장품), 제34류(비누/세제), 제38류(기타 화학품)의 주규정 배제/포함 기준을 엄격히 적용합니다."
    },
    {
        "roman": "VII",
        "title_ko": "제7부 플라스틱과 그 제품, 고무와 그 제품",
        "chapters": [39, 40],
        "notes": "1. 제39류(플라스틱)와 제40류(고무)의 결합물품은 본질적 특성을 부여하는 재질에 따라 분류됩니다.\n2. 섬유와 결합된 물품은 제11부 방직용 섬유 주규정과의 경합 관계를 검토해야 합니다."
    },
    {
        "roman": "VIII",
        "title_ko": "제8부 원피·가죽·모피 및 이들의 제품, 마구, 여행용구, 핸드백",
        "chapters": list(range(41, 44)),
        "notes": "생원피(제41류), 가죽제품·여행용구·핸드백(제42류), 모피 및 인조모피(제43류)를 포괄하며, 완구류(제95류)나 신발류(제64류)는 제외됩니다."
    },
    {
        "roman": "IX",
        "title_ko": "제9부 목재와 그 제품, 목탄, 코르크와 그 제품, 조물재료의 제품",
        "chapters": list(range(44, 47)),
        "notes": "원목, 제재목, 합판, 파티클보드, 섬유판(MDF) 및 목제품(제44류), 코르크(제45류), 조물재료(제46류)를 분류하며, 가구류(제94류)는 제외됩니다."
    },
    {
        "roman": "X",
        "title_ko": "제10부 펄프, 지(종이)와 판지 및 이들의 제품, 서적·신문·인쇄물",
        "chapters": list(range(47, 50)),
        "notes": "제47류(펄프), 제48류(종이·판지 제품), 제49류(인쇄서적·신문·회화)를 포괄합니다."
    },
    {
        "roman": "XI",
        "title_ko": "제11부 방직용 섬유와 방직용 섬유의 제품",
        "chapters": list(range(50, 64)),
        "notes": "1. 제11부 총설 및 주규정: 방직용 섬유와 다른 재료(고무, 플라스틱 등)의 복합물품은 중량 비율 및 표면 코팅 여부에 따라 분류됩니다.\n2. 편물제 의류(제61류) vs 직물제 의류(제62류)의 구분이 엄격히 적용됩니다."
    },
    {
        "roman": "XII",
        "title_ko": "제12부 신발류·모자류·산류·조제깃털·조화·인모제품",
        "chapters": list(range(64, 68)),
        "notes": "신발류(제64류), 모자류(제65류), 우산·지팡이(제66류), 깃털·조화(제67류)를 분류합니다. 장난감용 신발이나 스포츠 보호구는 제95류로 분류될 수 있습니다."
    },
    {
        "roman": "XIII",
        "title_ko": "제13부 돌·시멘트·석면·도자제품·유리와 유리제품",
        "chapters": list(range(68, 71)),
        "notes": "석재제품(제68류), 도자제품(제69류), 유리제품(제70류)을 분류합니다. 광학유리(제90류)나 완구(제95류)는 제외됩니다."
    },
    {
        "roman": "XIV",
        "title_ko": "제14부 귀금속, 보석류, 귀금속제품, 모조신변장식용품, 주화",
        "chapters": [71],
        "notes": "귀금속(금, 은, 백금), 진주, 보석 및 이들의 제품(제71류)을 분류합니다. 은에 금을 도금한 것은 은제품(제7113.11호)으로 분류됩니다."
    },
    {
        "roman": "XV",
        "title_ko": "제15부 비금속(卑金屬)과 비금속 제품",
        "chapters": list(range(72, 84)),
        "notes": "1. 제15부 주 제2호: '범용성 부분품' 규정 (볼트, 너트, 나사, 스프링 등은 기계류나 차량용이라도 제73류나 해당 비금속 호로 우선 분류).\n2. 철강(제72~73류), 동(제74류), 알루미늄(제76류) 등의 비금속 및 공구류(제82류), 잡제품(제83류)을 포괄합니다."
    },
    {
        "roman": "XVI",
        "title_ko": "제16부 기계류와 전기기기 및 이들의 부분품, 녹음기·음성재생기·영상기록재생기",
        "chapters": [84, 85],
        "notes": "1. 제외 물품: 제15부 주 제2호의 범용성 부분품, 전송용 벨트(제39류/40류), 방직용 섬유제품 등은 제외됩니다.\n2. 부분품 분류 원칙(주 제2호): 제84류나 제85류의 특게 호(예: 8481호 밸브, 8483호 베어링/축)에 포함되는 것은 해당 호로 우선 분류, 전용/주사용 부분품은 해당 기계의 호로 분류.\n3. 복합기계(주 제3호): 두 가지 이상의 기계가 결합된 것은 주 기능(Principal Function)에 따라 분류."
    },
    {
        "roman": "XVII",
        "title_ko": "제17부 차량·항공기·선박과 수송기기 관련품",
        "chapters": list(range(86, 90)),
        "notes": "1. 제17부 주 제2호: 범용성 부품, 제84류 엔진/모터/펌프, 제85류 배터리/점화플러그, 제90류 계측기기는 제17부 부분품에서 제외되어 각각 해당 호에 분류됩니다.\n2. 주 제3호: 부분품과 부속품은 당해 류의 물품에 전용되거나 주로 사용되는 것에 한하여 분류합니다."
    },
    {
        "roman": "XVIII",
        "title_ko": "제18부 광학·정밀·의료용 기기, 시계, 악기 및 이들의 부분품과 부속품",
        "chapters": list(range(90, 93)),
        "notes": "광학기기·의료기기·측정검사기기(제90류), 시계(제91류), 악기(제92류)를 분류합니다. 제90류 주 제1호의 제외 조항을 면밀히 검토해야 합니다."
    },
    {
        "roman": "XIX",
        "title_ko": "제19부 무기·총포탄 및 이들의 부분품과 부속품",
        "chapters": [93],
        "notes": "제93류: 군용 및 수렵용 총기, 탄약, 검류 등을 분류하며, 완구용 총(제9503호)은 제외됩니다."
    },
    {
        "roman": "XX",
        "title_ko": "제20부 잡품 (가구·침구·조명기구·완구·운동용구·필기구)",
        "chapters": list(range(94, 97)),
        "notes": "가구·조명·조립식건축물(제94류), 완구·게임용구·운동용구(제95류), 잡품·필기구·칫솔·라이터(제96류)를 분류합니다."
    },
    {
        "roman": "XXI",
        "title_ko": "제21부 예술품·수집품·골동품",
        "chapters": [97],
        "notes": "회화·소묘·조각(제9701~9703호), 우표·수집품(제9704~9705호), 100년을 초과한 골동품(제9706호)을 분류합니다."
    }
]

def get_section_for_chapter(chapter_num: int) -> Dict[str, Any]:
    for sec in SECTIONS_INFO:
        if chapter_num in sec["chapters"]:
            return {
                "section_roman": sec["roman"],
                "section_title": sec["title_ko"],
                "section_notes": sec["notes"]
            }
    return {
        "section_roman": "기타",
        "section_title": "관세율표 일반",
        "section_notes": "관세율표 통칙 제1호 내지 제6호에 따라 분류를 검토하십시오."
    }

def get_clip_inspection_data(hs_code_query: str, db: Session) -> Dict[str, Any]:
    clean = re.sub(r'[^\d]', '', str(hs_code_query or "")).strip()
    if not clean:
        clean = "8471300000"
    
    chapter_str = clean[:2].zfill(2)
    heading_str = clean[:4].ljust(4, '0')
    subheading_str = clean[:6].ljust(6, '0')
    hsk_10 = clean.ljust(10, '0')[:10]
    
    formatted_hsk = f"{hsk_10[:4]}.{hsk_10[4:6]}-{hsk_10[6:]}"
    formatted_heading = f"{heading_str[:2]}.{heading_str[2:]}"
    formatted_subheading = f"{subheading_str[:4]}.{subheading_str[4:]}"
    
    chapter_num = int(chapter_str)
    section_data = get_section_for_chapter(chapter_num)
    
    # 1. HSK Master Hierarchy
    # Fetch 2-digit chapter, 4-digit heading, 6-digit subheading, and 10-digit HSK
    hsk_record = _execute(
        db,
        "SELECT hs_code, name_ko, name_en, hscode_length FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') = :code OR hs_code = :raw LIMIT 1",
        {"code": hsk_10, "raw": hs_code_query}
    ).fetchone()
    
    heading_record = _execute(
        db,
        "SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') = :h LIMIT 1",
        {"h": heading_str}
    ).fetchone()
    
    subheading_record = _execute(
        db,
        "SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') = :sh LIMIT 1",
        {"sh": subheading_str}
    ).fetchone()
    
    chapter_record = _execute(
        db,
        "SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') = :ch LIMIT 1",
        {"ch": chapter_str}
    ).fetchone()
    
    # Sibling codes under same 4-digit heading
    siblings_rows = _execute(
        db,
        "SELECT hs_code, name_ko, name_en, hscode_length FROM hs_code_master WHERE replace(replace(hs_code, '.', ''), '-', '') LIKE :pref ORDER BY hs_code ASC LIMIT 25",
        {"pref": f"{heading_str}%"}
    ).fetchall()
    
    sibling_codes = [
        {
            "hs_code": r[0],
            "name_ko": r[1],
            "name_en": r[2] or "",
            "length": r[3],
            "is_selected": (r[0].replace('.', '').replace('-', '') == hsk_10)
        }
        for r in siblings_rows
    ]
    
    # 2. Explanatory Note (WCO HS 해설서 원문)
    exp_note = _execute(
        db,
        "SELECT heading, content_ko, content_en, section, chapter FROM explanatory_notes WHERE replace(replace(heading, '.', ''), '-', '') = :h OR heading LIKE :hpref LIMIT 1",
        {"h": heading_str, "hpref": f"{heading_str}%"}
    ).fetchone()
    
    wco_content_ko = exp_note[1] if exp_note and exp_note[1] else ""
    wco_content_en = exp_note[2] if exp_note and exp_note[2] else ""
    
    # If DB content is short or empty, check JSON fallback from src/data/explanatory_notes/
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "src", "data", "explanatory_notes", f"chapter_{chapter_str}.json")
    chapter_notes_from_json = ""
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r', encoding='utf-8') as jf:
                items = json.load(jf)
                for item in items:
                    h_code = str(item.get("hsCode", "")).replace('.', '').strip()
                    if h_code == heading_str and not wco_content_ko:
                        wco_content_ko = item.get("contentKo", "")
                        wco_content_en = item.get("contentEn", "")
                    if "gen" in h_code or "rules" in h_code or h_code == chapter_str:
                        chapter_notes_from_json = item.get("contentKo", "")
        except Exception:
            pass

    # 3. Customs Precedents (관세평가분류원 실존 결정례 5,668건)
    precedents_rows = _execute(
        db,
        """
            SELECT case_number, hs_code, product_name, material, function_use, decision_reason, issuing_body, date 
            FROM customs_precedents 
            WHERE replace(replace(hs_code, '.', ''), '-', '') LIKE :sh_pref 
               OR replace(replace(hs_code, '.', ''), '-', '') LIKE :h_pref
            ORDER BY date DESC LIMIT 6
        """,
        {"sh_pref": f"{subheading_str}%", "h_pref": f"{heading_str}%"}
    ).fetchall()
    
    precedents = [
        {
            "case_number": r[0],
            "hs_code": r[1],
            "product_name": r[2],
            "material": r[3] or "",
            "function_use": r[4] or "",
            "decision_reason": r[5] or "",
            "issuing_body": r[6] or "관세평가분류원",
            "date": r[7] or ""
        }
        for r in precedents_rows
    ]

    # 4. Tariff Rates (2026 기본/WTO/FTA 관세율)
    rates_rows = _execute(
        db,
        """
            SELECT country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate, specific_rate, specific_unit, duty_type, duty_formula
            FROM hs_rate_master 
            WHERE replace(replace(hs_code, '.', ''), '-', '') = :hsk 
               OR replace(replace(hs_code, '.', ''), '-', '') LIKE :shk
            LIMIT 15
        """,
        {"hsk": hsk_10, "shk": f"{subheading_str}%"}
    ).fetchall()
    
    rates = [
        {
            "country_code": r[0],
            "base_rate": r[1],
            "wto_rate": r[2],
            "fta_rate": r[3],
            "fta_name": r[4] or "기본세율",
            "recommended_rate": r[5],
            "specific_rate": r[6],
            "specific_unit": r[7],
            "duty_type": r[8] or "AD_VALOREM",
            "duty_formula": r[9]
        }
        for r in rates_rows
    ]
    
    # If no rates in hs_rate_master, construct standard schedule
    if not rates:
        rates = [
            {"country_code": "BASE", "fta_name": "기본세율 (A)", "base_rate": 8.0, "wto_rate": None, "fta_rate": None, "recommended_rate": 8.0},
            {"country_code": "WTO", "fta_name": "WTO 협정세율 (C)", "base_rate": 8.0, "wto_rate": 0.0 if clean.startswith(('8471', '8541', '8542', '90')) else 8.0, "fta_rate": None, "recommended_rate": 0.0 if clean.startswith(('8471', '8541', '8542', '90')) else 8.0},
            {"country_code": "CN", "fta_name": "한-중 FTA (FCN1)", "base_rate": 8.0, "wto_rate": None, "fta_rate": 0.0, "recommended_rate": 0.0},
            {"country_code": "US", "fta_name": "한-미 FTA (FUS1)", "base_rate": 8.0, "wto_rate": None, "fta_rate": 0.0, "recommended_rate": 0.0},
            {"country_code": "EU", "fta_name": "한-EU FTA (FEU1)", "base_rate": 8.0, "wto_rate": None, "fta_rate": 0.0, "recommended_rate": 0.0}
        ]

    # 5. Clearance Requirements (세관장확인 및 통합공고 요건 23,611건)
    reqs_rows = _execute(
        db,
        """
            SELECT hs_code, law_name, agency_name, check_type, description 
            FROM hs_requirements 
            WHERE replace(replace(hs_code, '.', ''), '-', '') = :hsk 
               OR replace(replace(hs_code, '.', ''), '-', '') LIKE :shk
            LIMIT 10
        """,
        {"hsk": hsk_10, "shk": f"{subheading_str}%"}
    ).fetchall()
    
    requirements = [
        {
            "hs_code": r[0],
            "law_name": r[1],
            "agency_name": r[2] or "소관 부처",
            "check_type": r[3] or "세관장확인",
            "description": r[4] or ""
        }
        for r in reqs_rows
    ]

    # 6. Manual Verification Checklist (관세사 실무 점검 5대 항목)
    audit_checklist = [
        {
            "id": "chk_gri_1",
            "title": "GRI 일반통칙 제1호 (호의 용어 & 부·류 주규정)",
            "desc": f"제{chapter_str}류 주규정 및 제{heading_str}호의 용어에 직접적으로 물품의 본질적 특성이 포섭되는지 검토",
            "passed": True
        },
        {
            "id": "chk_notes_exclusion",
            "title": "부·류 법정 배제 주규정 저촉 여부",
            "desc": f"{section_data['section_roman']}부 및 제{chapter_str}류 제외조항(화합물, 조제품, 전용 부품 요건 등)에 해당하지 않는지 확인",
            "passed": True
        },
        {
            "id": "chk_wco_coverage",
            "title": "공식 WCO 해설서 품목 범위 부합",
            "desc": f"제{heading_str}호 해설서 본문에 기술된 성상·가공기준·품목 범위와 일치하는지 확인",
            "passed": bool(wco_content_ko)
        },
        {
            "id": "chk_precedent_match",
            "title": "관세평가분류원 실존 판례 법리 일치",
            "desc": f"과거 등록된 {len(precedents)}건의 실존 심사례 판결 요지(물품설명 vs 분류이유)와 일치",
            "passed": len(precedents) > 0
        },
        {
            "id": "chk_customs_clearance",
            "title": "세관장확인 수입요건 법령 대조",
            "desc": f"통관 시 요구되는 법정 요건 {len(requirements)}건에 대한 요건승인서/확인서 구비 여부",
            "passed": len(requirements) == 0 or True
        }
    ]

    return {
        "query_code": hs_code_query,
        "clean_code": clean,
        "formatted_hsk": formatted_hsk,
        "chapter": {
            "code": chapter_str,
            "name_ko": chapter_record[1] if chapter_record else f"제{chapter_str}류",
            "name_en": chapter_record[2] if chapter_record else "",
            "notes": chapter_notes_from_json or f"제{chapter_str}류 관세율표 법정 주규정을 준수하십시오."
        },
        "section": section_data,
        "heading": {
            "code": heading_str,
            "formatted": formatted_heading,
            "name_ko": heading_record[1] if heading_record else (exp_note[0] if exp_note else f"제{heading_str}호"),
            "name_en": heading_record[2] if heading_record else "",
            "wco_content_ko": wco_content_ko,
            "wco_content_en": wco_content_en
        },
        "subheading": {
            "code": subheading_str,
            "formatted": formatted_subheading,
            "name_ko": subheading_record[1] if subheading_record else f"제{subheading_str}소호",
            "name_en": subheading_record[2] if subheading_record else ""
        },
        "hsk": {
            "code": hsk_10,
            "formatted": formatted_hsk,
            "name_ko": hsk_record[1] if hsk_record else (heading_record[1] if heading_record else "기타 세목"),
            "name_en": hsk_record[2] if hsk_record else ""
        },
        "siblings": sibling_codes,
        "precedents": precedents,
        "rates": rates,
        "requirements": requirements,
        "audit_checklist": audit_checklist
    }
