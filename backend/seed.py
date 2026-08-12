from .db import SessionLocal, engine, Base
from .models import User, Precedent, CashbackRequest, ExplanatoryNote
from .rag.parser import parse_explanatory_notes
import os

def seed_data():
    # 테이블 생성
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()


    # 1. 테스트 유저 생성 (CUSWAY 관리자 및 일반 고객들)
    users_data = [
        {"email": "admin@cusway.kr", "password": "pjhcustoms2026!", "company_name": "CUSWAY 관세팀", "plan": "Business", "status": "Active", "accrued_points": 15000},
        {"email": "director@seoulcustoms.com", "password": "password123!", "company_name": "서울관세법인", "plan": "Business", "status": "Active", "accrued_points": 25000},
        {"email": "trade_agent@korea.co.kr", "password": "password123!", "company_name": "한국관세사무소", "plan": "Basic", "status": "Active", "accrued_points": 5000},
        {"email": "customs_tax@corp.com", "password": "password123!", "company_name": "태평양세무관세", "plan": "Business", "status": "Suspended", "accrued_points": 0}
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
                accrued_points=u["accrued_points"]
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
            "holding_ko": "파기환송 (임포터 승소 취지) - 세관이 이전가격의 부적정성을 입증하기 위해서는 단순히 국내 이익률의 고저만을 따질 것이 아니라, 가격결정 공식이 상업적 실질에 부합하는지를 객관적으로 검증해야 한다.",
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
            "holding_ko": "인용 (임포터 승소) - 우리나라에서 개발되어 무상으로 제공된 기술, 설계, 고안 및 공예는 생산지원비 가산 대상에서 제외된다.",
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
            "holding_ko": "인용 (임포터 승소) - 수입자가 자기의 계산과 책임 하에 행한 국내 광고 활동 비용은 구매자 자신의 이익을 위한 것이므로 판매자에 대한 간접지급액으로 볼 수 없다.",
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
            "holding_ko": "인용 (임포터 승소) - 수입 선박이 수입항 하역 장소에 도착(본선 접안 또는 대기선 닻을 내린 시점)한 이후에 발생하는 체선료는 과세가격에서 제외된다.",
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

    # 4. RAG 관세율표 해설서 원문 적재 시드 구문 추가
    notes_exists = db.query(ExplanatoryNote).first()
    if not notes_exists:
        print("[RAG-SEED] Indexing raw_explanatory_notes.txt into SQLite...")
        # 프로젝트 루트 경로 내 raw_explanatory_notes.txt 탐색
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        notes_path = os.path.join(parent_dir, "raw_explanatory_notes.txt")
        if os.path.exists(notes_path):
            parsed_notes = parse_explanatory_notes(notes_path)
            # Limit seeding to top 800 notes to ensure coverage of glass (70), steel (73) and machinery (84-85)
            for note in parsed_notes[:800]:
                db_note = ExplanatoryNote(
                    heading=note["heading"],
                    content_ko=note["content_ko"],
                    content_en=note["content_en"],
                    section=note["section"],
                    chapter=note["chapter"]
                )
                db.add(db_note)
            print(f"[RAG-SEED] Successfully indexed {len(parsed_notes[:800])} Heading nodes to DB.")
        else:
            print(f"[RAG-SEED] Cannot find raw_explanatory_notes.txt at {notes_path}")

    db.commit()
    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_data()
