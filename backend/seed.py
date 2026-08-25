from .db import SessionLocal, engine, Base
from .models import User, Precedent, CashbackRequest, ExplanatoryNote
from .rag.parser import parse_explanatory_notes
from .rag.precedents_collector import collect_and_seed_precedents
import os

def seed_data():
    # 테이블 생성
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()


    # 1. 테스트 유저 생성 (CUSWAY 관리자 및 일반 고객들)
    users_data = [
        {"email": "admin@cusway.kr", "password": "pjhcustoms2026!", "company_name": "CUSWAY 관세팀", "plan": "Business", "status": "Active", "accrued_points": 15000, "user_type": "broker", "years_of_experience": 12, "credibility_weight": 3.0},
        {"email": "director@seoulcustoms.com", "password": "password123!", "company_name": "서울관세법인", "plan": "Business", "status": "Active", "accrued_points": 25000, "user_type": "broker", "years_of_experience": 8, "credibility_weight": 2.0},
        {"email": "trade_agent@korea.co.kr", "password": "password123!", "company_name": "한국관세사무소", "plan": "Basic", "status": "Active", "accrued_points": 5000, "user_type": "practitioner", "years_of_experience": 4, "credibility_weight": 1.5},
        {"email": "customs_tax@corp.com", "password": "password123!", "company_name": "태평양세무관세", "plan": "Business", "status": "Suspended", "accrued_points": 0, "user_type": "general_user", "years_of_experience": 1, "credibility_weight": 1.0}
    ]

    for u in users_data:
        exists = db.query(User).filter(User.email == u["email"]).first()
        if not exists:
            db_user = User(
                email=u["email"],
                password=u["password"],
                company_name=u["company_name"],
                plan=u["plan"],
                status=u["status"],
                accrued_points=u["accrued_points"],
                user_type=u["user_type"],
                years_of_experience=u["years_of_experience"],
                credibility_weight=u["credibility_weight"]
            )
            db.add(db_user)

    # 2. 기본 관세평가 판례 적재 (시나리오 매핑용 5개 리딩 판례)
    precedents_data = [
        {
            "id": "VAL-001",
            "category": "royalty",
            "category_ko": "권리사용료 (로열티)",
            "case_number": "조세심판원 심판2022관0084",
            "title": "수입물품과 상표권 사용 허락에 따른 권리사용료의 관련성 및 거래조건성 여부",
            "authority": "조세심판원",
            "date": "2022-11-24",
            "key_issue": "의류 완제품을 수입하면서 지급한 상표권 사용료가 관세법상 과세가격 가산요소인 권리사용료에 해당하는지 여부",
            "factual_background": "청구법인은 해외 본사로부터 의류 브랜드를 라이선스 받아 국내에서 제조 및 완제품 수입 판매하는 계약을 체결함. 수입 완제품에 대해 순매출액의 4%를 상표권 사용료(로열티)로 본사에 송금하였으며, 세관은 이를 수입물품과 관련이 있고 거래조건성이 충족된다고 보아 과세처분함.",
            "customs_argument": "수입되는 의류 완제품에 상표가 부착되어 수입되고 있으며, 로열티 미지급 시 완제품 공급 계약이 해지될 수 있으므로 거래조건성이 성립하여 가산해야 한다.",
            "importer_argument": "해당 상표권 계약은 국내 마케팅 및 국내 유통 권리에 대한 대가이며, 수입 물품의 구매 여부와 상관없이 국내 매출을 기준으로 산정되므로 거래조건성이 없다.",
            "holding_ko": "기각 (과세 유지) - 완제품에 부착되어 수입되는 상표권의 경우, 특단의 사정이 없는 한 수입물품과 밀접한 관련이 인정되며 로열티 지급이 수입거래의 실질적 조건으로 판단됨.",
            "reasoning_snippet": "라이선스 계약서상 로열티가 미지급될 경우 라이선서가 본 완제품 독점 수입 권한을 취소하거나 완제품 매매계약을 해지할 수 있도록 명시되어 있는 점에 비추어 볼 때, 구매자인 청구법인이 판매자에게 로열티를 지급하는 것은 수입물품 거래 성립의 조건(거래조건성)을 충족한다.",
            "implication_ko": "완제품 수입 계약과 라이선스 계약이 분리되어 있더라도, 계약서 내에 \"로열티 미지급 시 완제품 공급 계약 해지 권한\" 등이 교차 참조(Cross-reference)되어 있다면 거래조건성이 성립하여 100% 과세가격에 가산됩니다. 소명 시 계약서상 해지 조항의 분리 독립성을 증명해야 합니다."
        },
        {
            "id": "VAL-002",
            "category": "transfer-pricing",
            "category_ko": "특수관계자 거래 (이전가격)",
            "case_number": "대법원 2020두39485 판결",
            "title": "다국적 기업 국내 법인의 수입물품 이전가격이 특수관계에 영향을 받아 저가로 신고되었는지 판단 기준",
            "authority": "대법원",
            "date": "2021-04-15",
            "key_issue": "외국 본사로부터 원재료를 수입하는 국내 법인의 수입가격이 특수관계가 없는 자 사이의 통상적인 가격 결정 방법과 부합하는지 여부",
            "factual_background": "글로벌 화학회사 국내 지사인 청구법인은 본사로부터 계열사 할인가격으로 원재료를 수입함. 세관은 동종동류 물품의 국내 도매이익률 등을 조사하여 신고가격이 통상적인 독립기업간 거래가격(Arm's Length Price)보다 현저히 낮아 특수관계가 가격에 영향을 미쳤다고 판단, 제4방법으로 과세가격을 재정함.",
            "customs_argument": "국내 지사의 영업이익률이 업계 평균에 비해 지나치게 높고 본사로부터의 매입 원가가 낮게 형성되어 있으므로 특수관계에 의해 가격이 왜곡된 것이다.",
            "importer_argument": "신고가격은 OECD 이전가격 가이드라인에 부합하는 거래순이익률법(TNMM)에 기초하여 산정된 정상가격이므로 제1방법이 인정되어야 한다.",
            "holding_ko": "파기환송 (화주 승소 취지) - 세관이 이전가격의 부적정성을 입증하기 위해서는 단순히 국내 이익률의 고저만을 따질 것이 아니라, 가격결정 공식이 상업적 실질에 부합하는지를 객관적으로 검증해야 한다.",
            "reasoning_snippet": "특수관계자 간의 거래가격이 가격에 영향을 미쳤는지 여부는 거래의 정황, 독립된 제3자 간 가격 결정 방식과의 유사성, 해당 업계의 통상적인 거래 관행 등을 종합적으로 고려해야 한다. 원심은 청구법인이 제출한 국세청 합의 가격 및 정상가격 보고서의 합리성을 배제한 오류가 있다.",
            "implication_ko": "국세청에 제출하는 APA(사전조정) 자료 및 세법상 이전가격 정상가격 보고서(TP Report)가 관세평가 처분 시 수입자가 특수관계 영향을 받지 않았음을 입증하는 매우 강력한 방어 소명 자료가 됨을 명시한 판결입니다."
        },
        {
            "id": "VAL-003",
            "category": "assists",
            "category_ko": "생산지원비",
            "case_number": "조세심판원 심판2021관0042",
            "title": "수입자가 해외 수출자에게 무상 제공한 설계 도면 및 소프트웨어 개발 비용의 과세가격 가산 여부",
            "authority": "조세심판원",
            "date": "2021-09-08",
            "key_issue": "국내 수입자가 자체 개발하여 해외 제조사에 무상 제공한 LCD 패널 회로 설계 정보가 관세법상 생산지원비에 해당하는지 여부",
            "factual_background": "청구법인은 국내 연구소에서 설계 비용 10억 원을 들여 작성한 설계 도면을 해외 위탁가공 공장에 무상 송부하여 조립 생산함. 세관은 해당 설계 도면이 수입물품 생산에 필수적인 생산지원에 해당하므로 설계 개발비용을 과세가격에 더해야 한다고 주장함.",
            "customs_argument": "수입물품 생산을 위해 무상으로 제공된 기술 및 설계이며, 이는 관세법 시행령 제17조에 명시된 생산지원물품에 해당하므로 가산해야 한다.",
            "importer_argument": "관세법 제30조 제1항 제3호에 따르면, 생산지원 기술 및 설계 중에서 \"우리나라에서 개발된 것\"은 가산 요소에서 제외하도록 규정되어 있으므로 비과세이다.",
            "holding_ko": "인용 (화주 승소) - 우리나라에서 개발되어 무상으로 제공된 기술, 설계, 고안 및 공예는 생산지원비 가산 대상에서 제외된다.",
            "reasoning_snippet": "쟁점 설계도면의 실질적 연구개발 및 설계 수정 작업이 우리나라(국내 연구소) 내에서 전적으로 이루어졌음이 세금계산서 및 인건비 명세로 입증되므로, 이는 관세법 제30조 제1항 제3호 다목 단서에 따른 우리나라 개발 기술에 해당하여 생산지원액으로 가산할 수 없다.",
            "implication_ko": "국외 위탁 가공 시 기술/디자인 지원 비용이 세관 심사에서 쟁점이 될 경우, 해당 개발 인프라와 인건비 지출이 \"국내에서 집행되었음\"을 증명하는 연구소 일지 및 비용 집행 문서를 준비하면 생산지원비 비과세 소명이 확실해집니다."
        },
        {
            "id": "VAL-004",
            "category": "indirect-payment",
            "category_ko": "간접지급액",
            "case_number": "대법원 2017두47281 판결",
            "title": "수입자가 해외 본사를 대신하여 국내 광고대행사에 지급한 광고비의 과세가격(간접지급액) 가산 기준",
            "authority": "대법원",
            "date": "2018-02-28",
            "key_issue": "수입물품의 국내 판매 촉진을 위해 국내 수입업자가 부담한 광고비가 관세법상 판매조건부 간접지급액에 해당하여 과세가격에 합산되어야 하는지 여부",
            "factual_background": "다국적 수입업체인 청구법인은 자동차를 수입하면서 국내 마케팅 광고비를 직접 지출함. 세관은 해당 광고 활동이 실제로는 판매자인 본사의 의무를 국내 지사가 대리 수행한 것이므로 광고비 총액을 본사에 대한 간접적인 물품 대금 지급으로 보아 관세 과세가격을 증액 처분함.",
            "customs_argument": "본사와 지사 간의 딜러 계약에 의거 국내 광고비 지출이 강제되어 있으므로 실제 물품 대금의 일부인 간접 지급액에 해당한다.",
            "importer_argument": "지출된 광고비는 국내 마케팅 목적의 자체 영업비용이며, 수입 완성차의 가격 결정과는 하등의 관계가 없는 공제요소적 성격이다.",
            "holding_ko": "인용 (화주 승소) - 수입자가 자기의 계산과 책임 하에 행한 국내 광고 활동 비용은 구매자 자신의 이익을 위한 것이므로 판매자에 대한 간접지급액으로 볼 수 없다.",
            "reasoning_snippet": "관세법상 간접지급액이 되려면 판매자의 채무를 구매자가 대신 변제하는 등 실질적으로 판매자에게 이익이 전가되어야 한다. 본 건 광고는 청구법인이 수입차의 국내 유통업자로서 자기의 영업 매출을 늘리기 위해 독자적으로 집행한 광고이므로 가산할 수 없다.",
            "implication_ko": "계약서상 광고비 지출 한도나 의무가 형식적으로 걸려 있더라도, 광고의 실질적인 기획, 집행, 매체 선정이 국내 지사(수입자)의 책임과 자기 계산으로 이루어졌음을 세금계산서와 집행 보고서로 소명하면 전액 비과세 방어가 가능합니다."
        },
        {
            "id": "VAL-005",
            "category": "freight",
            "category_ko": "운임 및 관련비용",
            "case_number": "대법원 2019두40112 판결",
            "title": "수입항 도착 후 발생한 체선료(Demurrage) 및 터미널 핸들링 차지(THC)의 과세가격 제외 여부",
            "authority": "대법원",
            "date": "2020-01-09",
            "key_issue": "수입 부두에 선박이 접안한 이후 하역 지연으로 인해 선주에게 추가 지급한 체선료가 관세법상 수입항 도착까지의 운임(과세가격)에 포함되는지 여부",
            "factual_background": "석탄 수입업자인 청구법인은 수입항에 도착한 선박이 하역 부두 혼잡으로 접안이 지연되면서 발생한 체선료 2억 원을 선사에 지급함. 세관은 체선료 역시 운송에 수반되는 실질적 비용이므로 수입항 도착 인도 가격에 산입하여 관세를 물림.",
            "customs_argument": "체선료는 선박 운송 과정의 연장선상에서 발생하는 비용이므로 본질적으로 운임의 일부로서 과세가격 가산요소이다.",
            "importer_argument": "체선료는 수입항 도착 '이후' 발생한 하역 지연에 대한 패널티 성격의 지출이므로 관세법상 도착 이후 비용에 해당하여 제외되어야 한다.",
            "holding_ko": "인용 (화주 승소) - 수입 선박이 수입항 하역 장소에 도착(본선 접안 또는 대기선 닻을 내린 시점)한 이후에 발생하는 체선료는 과세가격에서 제외된다.",
            "reasoning_snippet": "관세법 제30조 제1항 제6호는 \"수입항에 도착하여 본선하역 준비가 완료될 때까지\"의 운임만을 가산하도록 한정하고 있으므로, 도착 이후 하역 대기 중에 추가 발생한 지연 지출은 관세법상 과세 시점이 경과한 비과세 대상이다.",
            "implication_ko": "체선료 및 하역 관련 분쟁 시, 선박의 정박/접안 시간 확인서(Statement of Facts)와 선사 발행 청구 일지를 대조하여 \"하역 준비 완료 선언 시점(N.O.R)\" 이후에 청구된 체선료임을 입증하면 100% 면세 소명이 인정됩니다."
        }
    ]

    for p in precedents_data:
        exists = db.query(Precedent).filter(Precedent.id == p["id"]).first()
        if not exists:
            db_p = Precedent(
                id=p["id"],
                category=p["category"],
                category_ko=p["category_ko"],
                case_number=p["case_number"],
                title=p["title"],
                authority=p["authority"],
                date=p["date"],
                key_issue=p["key_issue"],
                factual_background=p["factual_background"],
                holding_ko=p["holding_ko"],
                customs_argument=p["customs_argument"],
                importer_argument=p["importer_argument"],
                reasoning_snippet=p["reasoning_snippet"],
                implication_ko=p["implication_ko"]
            )
            db.add(db_p)

    # 3. 기본 가짜 캐시백 공유 사례 적재
    requests_data = [
        {
            "email": "director@seoulcustoms.com",
            "type": "hs",
            "type_ko": "HS 품목분류",
            "hs_code_or_issue": "2101.12-1000",
            "item_name": "식물성 대체크림 혼합 커피믹스",
            "file_name": "품목분류회신_2026_커피믹스.pdf",
            "points": 10000,
            "status": "승인 완료"
        },
        {
            "email": "director@seoulcustoms.com",
            "type": "valuation",
            "type_ko": "관세평가 판례",
            "hs_code_or_issue": "상표권 권리사용료 범위",
            "item_name": "의류 라이선스 수입 상표권 계약",
            "file_name": "결정례_상표권로열티_비과세소명.pdf",
            "points": 8000,
            "status": "승인 완료"
        },
        {
            "email": "trade_agent@korea.co.kr",
            "type": "hs",
            "type_ko": "HS 품목분류",
            "hs_code_or_issue": "1902.19-1000",
            "item_name": "기타 조리하지 않은 파스타면",
            "file_name": "사전심사회신_1902_면류.pdf",
            "points": 5000,
            "status": "검토 대기중"
        }
    ]

    for r in requests_data:
        exists = db.query(CashbackRequest).filter(CashbackRequest.file_name == r["file_name"]).first()
        if not exists:
            db_r = CashbackRequest(
                email=r["email"],
                type=r["type"],
                type_ko=r["type_ko"],
                hs_code_or_issue=r["hs_code_or_issue"],
                item_name=r["item_name"],
                file_name=r["file_name"],
                points=r["points"],
                status=r["status"]
            )
            db.add(db_r)

    # 4. RAG 관세율표 해설서 원문 적재 시드 구문 추가 (JSON 파일들로부터 로드)
    notes_count = db.query(ExplanatoryNote).count()
    if notes_count < 1000:
        print("[RAG-SEED] Indexing chapter JSON files into SQLite...")
        db.query(ExplanatoryNote).delete()
        
        import glob
        import json
        
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        notes_dir = os.path.join(parent_dir, "src", "data", "explanatory_notes")
        json_pattern = os.path.join(notes_dir, "chapter_*.json")
        json_files = glob.glob(json_pattern)
        
        indexed_count = 0
        for filepath in json_files:
            filename = os.path.basename(filepath)
            chapter_num = filename.replace("chapter_", "").replace(".json", "")
            chapter_name = f"제{chapter_num}류" if chapter_num.isdigit() else ""
            
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for item in data:
                        hs_code = item.get("hsCode", "")
                        # Convert "9608" to "96.08" for consistency in RAG match
                        if len(hs_code) == 4 and hs_code.isdigit():
                            heading = f"{hs_code[:2]}.{hs_code[2:]}"
                        else:
                            heading = hs_code
                            
                        db_note = ExplanatoryNote(
                            heading=heading,
                            content_ko=item.get("contentKo", ""),
                            content_en=item.get("contentEn", ""),
                            section="",
                            chapter=chapter_name
                        )
                        db.add(db_note)
                        indexed_count += 1
            except Exception as e:
                print(f"[RAG-SEED] Error indexing {filename}: {e}")
                
        print(f"[RAG-SEED] Successfully indexed {indexed_count} Heading nodes from JSON files to DB.")

    # 5. RAG 공식 관세청 결정례 적재
    collect_and_seed_precedents(db)

    # 6. CUSWAY 4단계 마법사용 시드 데이터 추가 (배주스 2009.89-1090, 건조 스파게티 1902.11-1000)
    from .models import HSRateMaster, HSRequirement, RequirementProcedure
    import json

    # 6-1. 세율 마스터 시딩
    rates_data = [
        # 배주스 (2009.89-1090)
        {"hs_code": "2009.89-1090", "country_code": "US", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 4.5, "fta_name": "한-미 FTA", "recommended_rate": 4.5},
        {"hs_code": "2009.89-1090", "country_code": "CN", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 45.0, "fta_name": "한-중 FTA", "recommended_rate": 45.0},
        {"hs_code": "2009.89-1090", "country_code": "IT", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0},
        
        # 달걀이 포함된 건조 스파게티 면 (1902.11-1000)
        {"hs_code": "1902.11-1000", "country_code": "IT", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0},
        {"hs_code": "1902.11-1000", "country_code": "CN", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 6.4, "fta_name": "한-중 FTA", "recommended_rate": 6.4},
        {"hs_code": "1902.11-1000", "country_code": "VN", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 0.0, "fta_name": "한-ASEAN FTA", "recommended_rate": 0.0},

        # 갈비살 (0201.30-0000)
        {"hs_code": "0201.30-0000", "country_code": "US", "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": 10.6, "fta_name": "한-미 FTA", "recommended_rate": 10.6},
        {"hs_code": "0201.30-0000", "country_code": "AU", "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": 13.3, "fta_name": "한-호주 FTA", "recommended_rate": 13.3},

        # 냉동 조기 (0303.89-9000)
        {"hs_code": "0303.89-9000", "country_code": "CN", "base_rate": 20.0, "wto_rate": 20.0, "fta_rate": 16.0, "fta_name": "한-중 FTA", "recommended_rate": 16.0},

        # 신선 사과 (0808.10-0000)
        {"hs_code": "0808.10-0000", "country_code": "US", "base_rate": 45.0, "wto_rate": 45.0, "fta_rate": 45.0, "fta_name": "한-미 FTA (혜택외)", "recommended_rate": 45.0},

        # 커피믹스 (2101.12-1000)
        {"hs_code": "2101.12-1000", "country_code": "IT", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0},

        # 포도주 (2204.21-1000)
        {"hs_code": "2204.21-1000", "country_code": "FR", "base_rate": 15.0, "wto_rate": 15.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0},
        {"hs_code": "2204.21-1000", "country_code": "CL", "base_rate": 15.0, "wto_rate": 15.0, "fta_rate": 0.0, "fta_name": "한-칠레 FTA", "recommended_rate": 0.0},

        # 인체 세정용 물티슈 (3307.90-9000)
        {"hs_code": "3307.90-9000", "country_code": "CN", "base_rate": 6.5, "wto_rate": 6.5, "fta_rate": 5.2, "fta_name": "한-중 FTA", "recommended_rate": 5.2},

        # 면제 티셔츠 (6109.10-1000)
        {"hs_code": "6109.10-1000", "country_code": "VN", "base_rate": 13.0, "wto_rate": 13.0, "fta_rate": 0.0, "fta_name": "한-ASEAN FTA", "recommended_rate": 0.0},

        # 리튬이온 배터리 충전기 (8504.40-1560)
        {"hs_code": "8504.40-1560", "country_code": "CN", "base_rate": 8.0, "wto_rate": 0.0, "fta_rate": 0.0, "fta_name": "한-중 FTA", "recommended_rate": 0.0},

        # 전기자전거 (8711.60-0000)
        {"hs_code": "8711.60-0000", "country_code": "CN", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 4.0, "fta_name": "한-중 FTA", "recommended_rate": 4.0},

        # 지그소 완구 퍼즐 (9503.00-3300)
        {"hs_code": "9503.00-3300", "country_code": "CN", "base_rate": 0.0, "wto_rate": 0.0, "fta_rate": 0.0, "fta_name": "한-중 FTA", "recommended_rate": 0.0},

        # 스마트폰 (8517.13-0000)
        {"hs_code": "8517.13-0000", "country_code": "US", "base_rate": 0.0, "wto_rate": 0.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0},
        {"hs_code": "8517.13-0000", "country_code": "CN", "base_rate": 0.0, "wto_rate": 0.0, "fta_rate": 0.0, "fta_name": "한-중 FTA", "recommended_rate": 0.0},
        {"hs_code": "8517.13-0000", "country_code": "IT", "base_rate": 0.0, "wto_rate": 0.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0}
    ]

    for r in rates_data:
        exists = db.query(HSRateMaster).filter(HSRateMaster.hs_code == r["hs_code"], HSRateMaster.country_code == r["country_code"]).first()
        if not exists:
            db_r = HSRateMaster(
                hs_code=r["hs_code"],
                country_code=r["country_code"],
                base_rate=r["base_rate"],
                wto_rate=r["wto_rate"],
                fta_rate=r["fta_rate"],
                fta_name=r["fta_name"],
                recommended_rate=r["recommended_rate"]
            )
            db.add(db_r)

    # 6-2. 수입 요건 통합공고 / 세관장확인 시딩
    requirements_data = [
        # 배주스
        {
            "hs_code": "2009.89-1090",
            "law_name": "수입식품안전관리 특별법",
            "agency_name": "식품의약품안전처",
            "check_type": "세관장확인",
            "description": "식품위생법 제19조에 의한 수입식품등의 수입신고서가 접수되어 검사 결과 적합 판정을 받아야 통관이 수리됨."
        },
        # 건조 스파게티 면
        {
            "hs_code": "1902.11-1000",
            "law_name": "수입식품안전관리 특별법",
            "agency_name": "식품의약품안전처",
            "check_type": "세관장확인",
            "description": "달걀 성분 함유 가공품으로서 식품위생법상 식약처장의 요건 승인을 요하며 정밀검사 대상이 될 수 있음."
        },
        # 갈비살
        {
            "hs_code": "0201.30-0000",
            "law_name": "가축전염병 예방법",
            "agency_name": "농림축산검역본부",
            "check_type": "세관장확인",
            "description": "가축전염병예방법 제32조에 의거 지정검역물품으로서 지정검역관의 수입검역에 합격하여야 수입할 수 있음."
        },
        # 냉동 조기
        {
            "hs_code": "0303.89-9000",
            "law_name": "수산물방역법",
            "agency_name": "국립수산물품질관리원",
            "check_type": "세관장확인",
            "description": "수산생물질병관리법 제27조에 의거 지정검역대상으로 국립수산물품질관리원장의 수입검역을 필하여야 함."
        },
        # 신선 사과
        {
            "hs_code": "0808.10-0000",
            "law_name": "식물방역법",
            "agency_name": "농림축산검역본부",
            "check_type": "세관장확인",
            "description": "식물방역법 제12조에 의거 수입식물검역을 필하여야 하며, 병해충 우려 지역에 따른 수입제한 여부 사전 확인 요망."
        },
        # 커피믹스
        {
            "hs_code": "2101.12-1000",
            "law_name": "수입식품안전관리 특별법",
            "agency_name": "식품의약품안전처",
            "check_type": "세관장확인",
            "description": "식품위생법상 해외제조업소 등록 필수 및 수입 시마다 수입신고서 및 한글표시사항 검사 적합 판정 필요."
        },
        # 와인
        {
            "hs_code": "2204.21-1000",
            "law_name": "수입식품안전관리 특별법",
            "agency_name": "식품의약품안전처",
            "check_type": "세관장확인",
            "description": "주류 수입 면허 및 성분 정밀검사(최초 수입 시 100ml)에 합격하고 한글표시사항 스티커를 부착해야 함."
        },
        # 물티슈
        {
            "hs_code": "3307.90-9000",
            "law_name": "화장품법",
            "agency_name": "식품의약품안전처",
            "check_type": "통합공고",
            "description": "화장품법상 화장품책임판매업 등록이 필요하며 수입 시마다 의약품수출입협회에 표준통관예정보고(EDI) 승인을 득해야 함."
        },
        # 면제 티셔츠
        {
            "hs_code": "6109.10-1000",
            "law_name": "전기용품 및 생활용품 안전관리법",
            "agency_name": "국가기술표준원",
            "check_type": "통합공고",
            "description": "전안법상 가정용 섬유제품으로서 안전기준준수대상에 해당하며 한글 표시사항(혼용률, 취급상주의사항 등) 부착이 필수임."
        },
        # 배터리 충전기
        {
            "hs_code": "8504.40-1560",
            "law_name": "전파법",
            "agency_name": "국립전파연구원",
            "check_type": "세관장확인",
            "description": "전파법 제58조의2에 따른 방송통신기자재등의 적합성평가(KC 인증)를 득해야 통관이 수리됨."
        },
        # 전기자전거
        {
            "hs_code": "8711.60-0000",
            "law_name": "전기용품 및 생활용품 안전관리법",
            "agency_name": "국가기술표준원",
            "check_type": "세관장확인",
            "description": "전안법상 안전확인대상 생활용품(이륜 자전거)으로서 공인 시험기관의 안전성 테스트 완료 및 KC 표시가 필수임."
        },
        # 완구 퍼즐
        {
            "hs_code": "9503.00-3300",
            "law_name": "어린이제품 안전 특별법",
            "agency_name": "국가기술표준원",
            "check_type": "세관장확인",
            "description": "어린이제품안전특별법 제22조에 의거 유아 완구로서 안전확인(KC)을 득하고 포장에 한글 경고문구를 표시하여야 함."
        },
        # 스마트폰
        {
            "hs_code": "8517.13-0000",
            "law_name": "전파법",
            "agency_name": "국립전파연구원",
            "check_type": "세관장확인",
            "description": "전파법 제58조의2에 따른 방송통신기자재등의 적합성평가(적합인증 또는 적합등록)를 받아야 수입할 수 있음. 다만, 자가사용 목적의 1대에 한해서는 세관장확인 요건이 면제됩니다."
        }
    ]

    for req in requirements_data:
        exists = db.query(HSRequirement).filter(HSRequirement.hs_code == req["hs_code"], HSRequirement.law_name == req["law_name"]).first()
        if not exists:
            db_req = HSRequirement(
                hs_code=req["hs_code"],
                law_name=req["law_name"],
                agency_name=req["agency_name"],
                check_type=req["check_type"],
                description=req["description"]
            )
            db.add(db_req)

    # 6-3. 법령별 수입 절차 상세 시딩
    procedures_data = [
        {
            "law_name": "수입식품안전관리 특별법",
            "pre_clearance_steps": json.dumps([
                "수입 전 최초 영업등록: 식약처 교육 이수 및 수입식품업 면허 취득",
                "해외제조업소 등록 확인: 선적 7일 전 유효한 제조업체 등록 여부 확인",
                "수입신고 접수: 관세청 유니패스(Uni-Pass)를 통해 식약처 전송",
                "검사 수행: 서류검증, 현물검증, 혹은 무작위 정밀검사(최대 10일 소요) 검사 대기",
                "적합 판정 수령: 요건수리 완료 문자 확인 후 관세 신고 연동"
            ]),
            "required_documents": json.dumps([
                "한글표시사항 도안 (스티커 시안 포함)",
                "수입식품 제조공정도 및 성분 분석표 (제조사 서명본)",
                "해외제조업소 등록 증빙 서류"
            ]),
            "processing_agency": "식품의약품안전처 수입식품정보마루 (https://impfood.mfds.go.kr)",
            "average_duration": "서류 1~2일 / 정밀검사 7~10일"
        },
        {
            "law_name": "가축전염병 예방법",
            "pre_clearance_steps": json.dumps([
                "원산지 검역증명서 발급: 수출국 검역당국이 배포한 동물성 성분 위생증 원본 수령",
                "수입검역 신청서 제출: 한국 농림축산검역본부 포털에 수입신고 연계",
                "지정 보세구역 입고: 동식물검역 전용 보세창고 반입 완료 확인",
                "시료 채취 및 역학조사: 전염병 인자(조류독감, 구제역 등) 잔류 검증 수행",
                "수입검역증명서(C/O) 발급: 관세청 유니패스로 검역완료 전문 연계 전송"
            ]),
            "required_documents": json.dumps([
                "수출국 정부 발행 동물성 위생검역증명서 원본 (Health Certificate)",
                "수입선하증권(B/L) 및 송장(Invoice)"
            ]),
            "processing_agency": "농림축산검역본부 통합시스템 (https://www.qia.go.kr)",
            "average_duration": "3~5 영업일"
        },
        {
            "law_name": "수산물방역법",
            "pre_clearance_steps": json.dumps([
                "검역 신청: 국립수산물품질관리원 지사에 수입수산물 검역신청서 전송",
                "역학조사 및 현물검사: 보세창고 반입 후 냉동 상태, 이물질 혼입 여부 실물 검증",
                "검역 필증 수령: 관세청 유니패스로 합격 통보 자동 연동 확인"
            ]),
            "required_documents": json.dumps([
                "수출국 정부 발행 수산물 위생검역증명서 원본",
                "포장명세서(Packing List) 및 Invoice"
            ]),
            "processing_agency": "국립수산물품질관리원 (https://www.nfqs.go.kr)",
            "average_duration": "2~4 영업일"
        },
        {
            "law_name": "식물방역법",
            "pre_clearance_steps": json.dumps([
                "선적 서류 제출: 수출국 정부가 발행한 식물검역증명서 사전 제출",
                "보세창고 입고 및 시료 채취: 외래 금지 병해충(해충, 바이러스) 전염 가능성 검증",
                "합격 판정 및 반입 승인: 검역 통과 후 세관 수입신고 수리 진행"
            ]),
            "required_documents": json.dumps([
                "수출국 정부 발행 식물검역증명서 원본 (Phytosanitary Certificate)",
                "가열 또는 소독처리증명서 (해당 물품 한정)"
            ]),
            "processing_agency": "농림축산검역본부 (https://www.qia.go.kr)",
            "average_duration": "1~3 영업일"
        },
        {
            "law_name": "화장품법",
            "pre_clearance_steps": json.dumps([
                "화장품책임판매업 등록: 수입 전 국내 화장품 책임판매업자 자격 선 취득",
                "표준통관예정보고(EDI): 선적 완료 전 의약품수출입협회에 EDI 시스템으로 수입 정보 보고 및 승인 수령",
                "품질 관리 검사: 통관 후 화장품 시험검사성적서 작성 및 적합 판정 완료 후 시판"
            ]),
            "required_documents": json.dumps([
                "화장품책임판매업 등록증 사본",
                "수입화장품 제조/판매 증명서 (Certificate of Free Sale)",
                "제조 성분 분석표 (전성분 표시 증빙)"
            ]),
            "processing_agency": "한국의약품수출입협회 (https://www.kpta.or.kr)",
            "average_duration": "EDI 승인 1영업일 / 통관 후 품질 검증 3~5일"
        },
        {
            "law_name": "전기용품 및 생활용품 안전관리법",
            "pre_clearance_steps": json.dumps([
                "KC 인증 신청: 국가 지정 시험기관에 수입 샘플 테스트 및 안전 인증 신청",
                "KC 인증 마킹 부착: 수입 통관 전 완제품 포장 및 본체에 KC 마크와 표시사항 인쇄",
                "안전확인신고 접수: 제품안전정보센터에 승인번호 등록 후 통관 요건 매핑 연동"
            ]),
            "required_documents": json.dumps([
                "안전확인신고 증명서 사본 (KC 인증서)",
                "전기회로도 및 리튬 배터리 MSDS (배터리 내장형 제품의 경우)",
                "제품 설명서 및 한글 사양 라벨 도안"
            ]),
            "processing_agency": "제품안전정보센터 (https://www.safetykorea.kr)",
            "average_duration": "시험성적서 발급 3~4주 / 통관 요건 연동 즉시"
        },
        {
            "law_name": "전파법",
            "pre_clearance_steps": json.dumps([
                "적합성평가 시험: 국립전파연구원 지정 기관에서 전자파 적합성 시험 수행",
                "적합등록 필증 발급: 적합성평가 포털에 결과서 등록 후 등록 번호 획득",
                "수입 요건 확인 부착: 통관 시 세관장 요건 전파법 코드 매핑 제출"
            ]),
            "required_documents": json.dumps([
                "방송통신기자재 적합등록(적합인증) 필증",
                "제품 전자파 측정 시험성적서",
                "한글 표기사항 라벨 시안"
            ]),
            "processing_agency": "국립전파연구원 (https://rra.go.kr)",
            "average_duration": "적합등록 시험 1~2주 / 행정 수수료 승인 1영업일"
        },
        {
            "law_name": "어린이제품 안전 특별법",
            "pre_clearance_steps": json.dumps([
                "유해물질 안전성 테스트: 국가 공인 시험기관에 납, 카드뮴, 프탈레이트계 가소제 검출 시험 의뢰",
                "안전확인 신고: 한국제품안전관리원에 시험결과 보고 및 안전확인 신고필증 발급",
                "통관 전 KC 마킹 확인: 완구 표면에 주의문구 및 연령 경고 표시 완료 점검"
            ]),
            "required_documents": json.dumps([
                "어린이제품 안전성 시험성적서 원본",
                "어린이제품 안전확인 신고필증",
                "한글 경고 표시사항 라벨 도안"
            ]),
            "processing_agency": "한국제품안전관리원 (https://www.kips.kr)",
            "average_duration": "화학 정밀분석 5~7 영업일"
        }
    ]

    for proc in procedures_data:
        exists = db.query(RequirementProcedure).filter(RequirementProcedure.law_name == proc["law_name"]).first()
        if not exists:
            db_proc = RequirementProcedure(
                law_name=proc["law_name"],
                pre_clearance_steps=proc["pre_clearance_steps"],
                required_documents=proc["required_documents"],
                processing_agency=proc["processing_agency"],
                average_duration=proc["average_duration"]
            )
            db.add(db_proc)

    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_data()

