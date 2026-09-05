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
            "factual_background": "【사실관계 요약 및 상세 처분개요】\n청구법인은 글로벌 스포츠 의류 및 액세서리를 판매하는 다국적 지주회사 A사의 한국 내 전속 유통업자이자 라이선시(Licensee)이다. 청구법인은 A사와 '독점 판매권 및 라이선스 허가 계약(Exclusive Distribution and License Agreement)'을 체결하여 국내 유통망을 운영하고 있다.\n해당 계약에 따르면 청구법인은 수입한 완제품 스포츠웨어(셔츠, 자켓, 스포츠슈즈 등)에 A사가 소유한 상표(Trademarks)를 부착하여 재판매하는 조건으로, 상표권 사용 및 국내 마케팅 보증 대가로 순매출액(Net Sales Value)의 4%에 해당하는 로열티를 분기별로 A사에 송금하도록 되어 있다.\n또한, 청구법인은 수입 물품 가격과는 별도의 인보이스를 통해 라이선스 수수료를 본사에 정산해왔다.\n세관 처분청은 청구법인에 대한 기업심사(관세조사)를 실시한 결과, 이 상표권 로열티가 완제품 수입과 직접적인 '관련성'을 가지며, 상표권 계약 제9.2조에 '로열티를 지체하거나 지급하지 아니하는 경우 A사는 수입 독점 유통 권한을 정지하거나 부품 및 완제품 매매계약(Supply Agreement)을 즉각 해지할 수 있다'는 크로스디폴트(Cross-default) 조항이 규정되어 있음을 확인하고, 로열티 미지급 시 수입을 지속할 수 없으므로 '거래조건성'이 성립한다고 보아 가산율 4%를 적용하여 법인세 경정액 및 부가가치세 추징 처분을 내렸다.\n이에 대해 수입자는 불복하여 조세심판을 청구하였다.",
            "customs_argument": "수입 되는 의류 완제품에 상표가 부착되어 수입되고 있으며, 로열티 미지급 시 완제품 공급 계약이 해지될 수 있으므로 거래조건성이 성립하여 가산해야 한다.",
            "importer_argument": "해당 상표권 계약은 국내 마케팅 및 국내 유통 권리에 대한 대가이며, 수입 물품의 구매 여부와 상관없이 국내 매출을 기준으로 산정되므로 거래조건성이 없다.",
            "holding_ko": "기각 (과세 유지) - 완제품에 부착되어 수입되는 상표권의 경우, 특단의 사정이 없는 한 수입물품과 밀접한 관련이 인정되며 로열티 지급이 수입거래의 실질적 조건으로 판단됨.",
            "reasoning_snippet": "【심판원 판단 이유 및 조세법리 해석 전문】\n관세법 제30조 제1항 제4호 및 같은 법 시행령 제19조에 따르면 구매자가 수입물품을 구매하기 위하여 판매자에게 직접 또는 간접으로 지급하는 권리사용료는 과세가격에 가산하도록 규정하고 있다.\n완제품 상표권 거래에서 '관련성'과 '거래조건성'을 심리하건대,\n첫째, 쟁점 수입물품은 이미 수입 신고 당시에 상표가 부착되어 수입되므로 그 자체가 상표권을 체화하고 있어 관련성이 100% 인정된다.\n둘째, '거래조건성'의 존부를 판단하기 위해서는 라이선스 계약서와 물품 공급 계약서의 상호 유기적 결합도를 살펴보아야 한다. 본 건 쟁점 라이선스 계약서 제9.2조 및 공급계약 제14.4조를 대조해 보면, 구매자가 권리사용료 지급 의무를 불이행할 경우 라이선서는 단순히 국내 상표권 사용 권리를 박탈하는 것에 그치지 않고, 완제품의 독점 공급 및 매매 권한을 일방적으로 종료하거나 취소할 수 있도록 명문으로 규정하고 있다.\n이와 같은 유기적 교차 해지 규정은 상표권 사용료의 지급이 단순히 수입 이후 유통 단계의 권리보장 대가에 그치지 않고, 구매자가 수입물품을 취득하기 위해 필수적으로 이행해야 하는 실질적 반대급부이자 거래 조건임을 반증한다.\n따라서 처분청의 과세 처분은 정당하다.",
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
            "factual_background": "【사실관계 요약 및 상세 처분개요】\n청구법인은 다국적 화학 전문 기업인 B사의 한국 자회사(지분율 100% 보유)로서, 의약품 및 정밀화학 제조에 사용되는 주원료(Active Pharmaceutical Ingredients)를 해외 특수관계자인 본사 및 계열 제조사로부터 지속적으로 수입하여 왔다.\n수입자는 이전가격 산정 방법으로 법인세 및 관세 평가 목적상 정상가격으로 인정받기 위해 거래순이익률법(TNMM)을 채택하였고, 이를 바탕으로 영업이익률 목표 구간(Target Profit Margin Range)인 3.5%~5.5%를 유지할 수 있도록 수입원가를 이전가격 정책(TP Policy)에 따라 매년 소급 조정(Year-end TP Adjustment)하였다.\n세관 처분청은 청구법인에 대한 정밀 관세조사를 벌여, 청구법인의 동종동류 수입 비율에 따른 국내 세전 영업이익률 및 마진 지출 비중이 국내 동종 도매업계 평균(1.2%~2.4%)을 2배 이상 초과한다는 점을 지적했다.\nB사가 특수관계를 남용하여 본사 마진을 한국 지사로 이전하기 위해 의도적으로 수입 신고가격을 비정상적으로 높거나 낮게 설정함으로써 특수관계가 수입물품의 거래가격에 직접적인 영향을 미쳤다고 단정하였다. 이에 따라 제1방법을 부인하고 동종동류 비율에 기초한 제4방법을 적용하여 수입액 차액에 대한 법인세 환급 거부 및 수십억 원의 관세 추징 고지 처분을 통보하였다.\n이에 대해 화주는 이전가격 결정구조의 합리성을 들어 대법원에 행정소송을 제기하였다.",
            "customs_argument": "국내 지사의 영업이익률이 업계 평균에 비해 지나치게 높고 본사로부터의 매입 원가가 낮게 형성되어 있으므로 특수관계에 의해 가격이 왜곡된 것이다.",
            "importer_argument": "신고가격은 OECD 이전가격 가이드라인에 부합하는 거래순이익률법(TNMM)에 기초하여 산정된 정상가격이므로 제1방법이 인정되어야 한다.",
            "holding_ko": "파기환송 (화주 승소 취지) - 세관이 이전가격의 부적정성을 입증하기 위해서는 단순히 국내 이익률의 고저만을 따질 것이 아니라, 가격결정 공식이 상업적 실질에 부합하는지를 객관적으로 검증해야 한다.",
            "reasoning_snippet": "【대법원 이유 판시 요지 및 독립기업간 가격 판단 기준 해석 전문】\n관세법 제30조 제1항 및 제3항 제4호에 의하면 특수관계에 있는 자들 사이의 수입 물품 가격이 그 특수관계로 인하여 영향을 받지 아니한 경우에는 제1방법인 거래가격을 기초로 과세가격을 결정할 수 있도록 하고 있다.\n특수관계가 가격에 영향을 미쳤는지 여부에 대한 입증 책임은 일차적으로 처분청에 있으나, 수입자가 가격의 합리성 규명을 위해 객관적 증빙자료를 제출한 경우 세관은 이를 실질적으로 분석해야 한다.\n재판부는 다음과 같은 근거로 처분청의 제1방법 부인 조치에 법리적 오해가 있음을 선언한다:\n첫째, 단지 수입자의 국내 도매영업이익률이 동종업계 평균치를 웃돈다는 통계적 사실만으로는 수입 거래 가격 자체가 조세 회피 내지 특수관계의 압박에 의해 왜곡되었다고 단정하기 부족하다.\n둘째, 수입자가 제출한 이전가격정상성보고서(TP Report) 및 경제적 분석 자료에 비추어 볼 때 본사가 설정한 원재료 가격 결정 공식(Pricing Formula)은 글로벌 시장에서 판매되는 비계열사 거래처 대상 공급단가 산정 로직과 유사한 상업적 실질을 준수하고 있다.\n따라서, 제1방법 배제 요건에 해당하는 가격의 비정상적 작위성을 엄격하게 입증하지 못한 처분청의 제1방법 부인 처분은 위법하다.",
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
            "factual_background": "【사실관계 요약 및 상세 처분개요】\n청구법인은 국내에서 디스플레이 가전제품을 제조·수입하여 유통하는 업체로, LCD 패널 및 메인 제어보드를 중국의 위탁생산 외주공장인 C사로부터 주문자 상표부착 방식(OEM)으로 수입해오고 있다.\n수입 프로세스 개시 전, 청구법인은 국내 연구소 산하 하드웨어 개발 부서의 소속 엔지니어들을 활용하여 약 10억 원 상당의 연구개발 인건비와 설비 유지비를 투입하여 쟁점 LCD 패널 구동에 필수적인 '회로도 설계 도면(Gerber File)' 및 제어 칩셋 펌웨어(Embedded Code)를 직접 제작하였다.\n이후 해당 도면 및 소프트웨어를 기재한 저장매체를 중국 제조업체 C사에 무상으로 제공하여 정밀 사출 및 조립 생산 공정에 그대로 반영하도록 조치하였다.\n세관 처분청은 이 설계가 LCD 완제품 생산에 결정적이고 절대적인 기술 요소임을 입증하고, 수입자가 제조자에게 무상으로 제공한 자원이므로 생산지원비로 규정하여 개발 원가인 10억 원을 수입 물품 누적 수량에 비례하여 안분 산정하여 과세처분하였다.\n수입자는 국내에서 개발한 기술 정보는 법적으로 생산지원비 가산 예외 대상에 해당한다고 보아 즉각 심판청구를 제기하였다.",
            "customs_argument": "수입물품 생산을 위해 무상으로 제공된 기술 및 설계이며, 이는 관세법 시행령 제17조에 명시된 생산지원물품에 해당하므로 가산해야 한다.",
            "importer_argument": "관세법 제30조 제1항 제3호에 따르면, 생산지원 기술 및 설계 중에서 \"우리나라에서 개발된 것\"은 가산 요소에서 제외하도록 규정되어 있으므로 비과세이다.",
            "holding_ko": "인용 (화주 승소) - 우리나라에서 개발되어 무상으로 제공된 기술, 설계, 고안 및 공예는 생산지원비 가산 대상에서 제외된다.",
            "reasoning_snippet": "【심판원 판단 이유 및 조세법리 해석 전문】\n관세법 제30조 제1항 제3호는 수입물품의 생산 및 수출을 위하여 구매자가 무료 또는 인하된 가격으로 직접 또는 간접으로 물품 및 용역을 제공하는 경우 그 가액을 가산하도록 하고 있으나, 다목에서 '기술, 설계, 고안 및 공예'에 대하여는 '우리나라 외의 지역에서 개발된 것에 한한다'고 명확히 가산 범위의 한계를 한정하고 있다.\n본 건에 관하여 심리하건대,\n첫째, Gerber 회로도 및 펌웨어 코딩은 전부 국내 본사 연구원들이 근무 시간 중 국내 본사 전산망에서 단독 개발한 지적 성과물로 입증된다.\n둘째, 세법상 기술 설계의 개발지(Origin of Development)는 해당 R&D 행위가 실질적으로 행해진 지리적 공간에 의해 결정되므로, 수입제품 생산을 위해 외국의 제조사에게 기술자료가 송부되었더라도 국내 연구소 내에서 전적으로 이루어진 이상 우리나라 개발 기술에 해당하여 생산지원비로 합산할 수 없다.\n따라서 처분청의 과세 처분은 취소 결정을 선언한다.",
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
            "factual_background": "【사실관계 요약 및 상세 처분개요】\n청구법인은 독일 소재 자동차 제조 본사 D사로부터 프리미엄 승용차 및 부품을 독점 수입하여 국내 딜러망을 통해 판매하는 한국 공식 수입 총판 지사(Importer)이다.\nD사와 청구법인이 체결한 딜러쉽 계약서(Dealer Agreement) 제11.2조에 따르면 '청구법인은 매년 국내 유통되는 차량의 브랜드 이미지 유지를 위해 순 매출액의 최소 2.5% 이상을 국내 TV 광고, 인쇄 매체 지출, 모터쇼 참가 등 광고선전비로 집행하여야 한다'는 최소 광고 지출 의무가 설정되어 있었다.\n청구법인은 이에 따라 국내 유수의 광고대행사들과 개별 대행 계약을 맺고 연간 수백억 원의 매체 광고비를 지출하였다.\n세관 처분청은 이 광고선전비 지출 의무가 수입 거래에 실질적인 강제성을 띤 판매 조건부 행위이며 본사가 부담해야 할 비용을 대신 지출한 간접지급액이라 보아 관세를 추징하였다.\n이에 수입자는 마케터로서 본인 영업을 확대하기 위한 목적의 자체 영업비이므로 가산대상이 아니라고 조세소송을 제기하였다.",
            "customs_argument": "본사와 지사 간의 딜러 계약에 의거 국내 광고비 지출이 강제되어 있으므로 실제 물품 대금의 일부인 간접 지급액에 해당한다.",
            "importer_argument": "지출된 광고비는 국내 마케팅 목적의 자체 영업비용이며, 수입 완성차의 가격 결정과는 하등의 관계가 없는 공제요소적 성격이다.",
            "holding_ko": "인용 (화주 승소) - 수입자가 자기의 계산과 책임 하에 행한 국내 광고 활동 비용은 구매자 자신의 이익을 위한 것이므로 판매자에 대한 간접지급액으로 볼 수 없다.",
            "reasoning_snippet": "【대법원 판결 취지 및 간접지급액 판단의 법리 해석 전문】\n관세법 제30조 제1항 제1호에 의한 실제지급가격이라 함은 수입물품의 대가로서 구매자가 판매자에게 지급하였거나 지급하여야 할 총금액을 의미하며, 여기에는 구매자가 판매자의 채무를 상환하거나 판매자와의 약정에 따라 판매자의 의무를 대신 이행하는 간접지급액도 포함될 수 있다.\n그러나 수입자가 국내 시장에서 독점 수입업자로서 행한 광고 행위의 성격을 심리하건대,\n첫째, 본 계약상의 최소 광고비 지출 규정은 브랜드 관리 차원의 조율일 뿐이며, 불이행 시 자동차 공급 중단 등의 즉각적 페널티가 없어 거래 조건성을 인정하기 어렵다.\n둘째, 광고의 실질적인 집행 주체가 한국 지사이며 집행 수혜자도 매출을 올리는 한국 지사 자신이다.\n셋째, 해외 본사가 법적으로 부담해야 할 광고의 채무가 국내 지사의 대금 결제에 의해 소멸되는 관계가 증명되지 않는다.\n따라서, 구매자가 자기의 계산과 책임 하에 행한 광고선전 활동은 설령 그것이 판매자에게 반사적 이익을 준다고 할지라도 간접지급액으로 가산할 수 없다.",
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
            "factual_background": "【사실관계 요약 및 상세 처분개요】\n청구법인은 국내 에너지 발전용 유연탄 및 석탄을 호주, 인도네시아 등지로부터 대형 벌크선을 임차하여 수입 운송해 온 발전 공기업이다.\n수입항에 도착한 선박이 하역 부두의 혼잡 및 설비 대기 원인 등으로, 송하 선박이 정박(Anchorage) 구역에 진입하고 입항 준비 완료 선언서(NOR)를 제출하였음에도 불구하고 실제 하역 부두에 물리적으로 접안하기까지 평균 수일의 하역 지연이 발생하였다.\n수입자는 용선 계약상의 연체 벌금이자 대가인 체선료(Demurrage) 총 2억 4천만 원을 선주에게 지급하였으며, 세관은 수입물품 통관 전 물동 단계에서 발생한 모든 운임 수반액은 수입항까지의 운임 범위에 속한다며 관세를 과세하였다.\n수입자는 정박지 도착 시점에 해상운임 지급 의무가 종결된다고 주장하며 행정소송을 제기하였다.",
            "customs_argument": "체선료는 선박 운송 과정의 연장선상에서 발생하는 비용이므로 본질적으로 운임의 일부로서 과세가격 가산요소이다.",
            "importer_argument": "체선료는 수입항 도착 '이후' 발생한 하역 지연에 대한 패널티 성격의 지출이므로 관세법상 도착 이후 비용에 해당하여 제외되어야 한다.",
            "holding_ko": "인용 (화주 승소) - 수입 선박이 수입항 하역 장소에 도착(본선 접안 또는 대기선 닻을 내린 시점)한 이후에 발생하는 체선료는 과세가격에서 제외된다.",
            "reasoning_snippet": "【대법원 판시 요지 및 도착 시점 획정에 대한 법리 해석 전문】\n관세법 제30조 제1항 제6호에 규정된 '수입항까지의 운임·보험료 및 그 밖에 운송과 관련되는 비용'은 물품이 해외 발송지로부터 수입항에 도착하여 하역할 수 있는 상태에 도달할 때까지 발생하는 비용으로 한정된다.\n해당 벌크 용선거래 하역 지연 체선료에 관하여 보건대:\n첫째, 입항준비완료선언(NOR)은 선박이 지정된 정박 장소에 도달하여 하역 작업을 개시할 준비가 완료되었음을 알리는 선주의 확정 통보이므로 이 시점에 선박은 이미 수입항에 도달한 것이다.\n둘째, 정박 대기 중에 추가 발생한 지연 지출은 지연 손해금 성격일 뿐 수입항까지 선박을 이동시키기 위한 해상 운임에 해당하지 않는다.\n셋째, WCO 평가협정 예해 및 다수의 국제적 관행 또한 수입항 도착 완료 NOR 시점 이후의 부두 혼잡비는 비과세 비용으로 인정하고 있다.\n따라서, 쟁점 체선료는 수입항 도착 이후의 비용이므로 운임 가산 대상에서 배제하여야 한다.",
            "implication_ko": "체선료 및 하역 관련 분쟁 시, 선박의 정박/접안 시간 확인서(Statement of Facts)와 선사 발행 청구 일지를 대조하여 \"하역 준비 완료 선언 시점(N.O.R)\" 이후에 청구된 체선료임을 입증하면 100% 면세 소명이 인정됩니다."
        },
        {
            "id": "VAL-006",
            "category": "indirect-payment",
            "category_ko": "간접지급액 (우회거래 및 수정세금계산서)",
            "case_number": "조세심판원 조심2024관12·56·157(병합)",
            "title": "다국적 기업의 수하인 명의대여(우회거래)를 통한 저율 TRQ 적용의 부정행위 및 음(陰)의 수정수입세금계산서 발급의 적법성 여부",
            "authority": "조세심판원",
            "date": "2026-06-30",
            "key_issue": "청구법인이 수입자 명의 우회를 통해 저율의 TRQ 세율을 적용받은 행위가 부정행위에 해당하는지 여부 및 이에 따른 세관장의 음(陰)의 수정수입세금계산서 발급 처분의 적법성 여부",
            "factual_background": "【처분개요 및 사실관계】\n가. 농림축산식품부장관은 「대한민국 정부와 호주 정부 간의 자유무역협정」, 「대한민국과 캐나다 간의 자유무역협정」 및 「대한민국과 유럽연합 및 그 회원국 간의 자유무역협정」(이하 \"쟁점FTA\"라 한다) 등에 따라 무관세로 양허된 농축산물 관세율 할당물량(Tariff Rate Quota, 이하 \"TRQ\"라 하고, TRQ에 적용되는 쟁점FTA 협정관세율을 \"TRQ 추천세율\"이라 한다)의 수입자 결정․물량 배정 및 TRQ 적용 추천 등 수입관리에 필요한 사항을 규정하기 위해 '대한민국 정부와 호주 정부 간의 자유무역협정에 따른 농축산물 관세율 할당물량 추천 및 수입관리 요령', '대한민국과 캐나다 간의 자유무역협정에 따른 농축산물 관세율 할당물량 추천 및 수입관리 요령' 및 '대한민국과 유럽연합 및 그 회원국 간의 자유무역협정에 따른 농축산물 관세율 할당물량 추천 및 수입관리 요령'을 고시하였고, 수입권 배분 및 TRQ 적용 추천대행기관으로 한국농수산식품유통공사(이하 \"유통공사\"라 한다)를 지정하였다.\n\n나. 청구법인은 맥주의 제조 및 유통을 주된 사업으로 영위하고 있는 다국적기업으로서, AAA의 완전자회사로, BBB와 맥아 등 원재료에 대한 조달서비스 계약을 체결하고, BBB는 호주, 캐나다, EU 등지에 소재하는 쟁점수출자와 맥아의 가격, 품질, 수량, 인도조건, 결제조건 등을 협상하여 계약을 체결한다.\n\n다. 청구법인은 맥아를 직접 수입한 후, 쟁점FTA에 따른 TRQ 추천세율(0%)을 적용받아 수입통관하거나, 시장접근물량에 대한 WTO 양허관세율(30%) 또는 초과 시 WTO 미추천양허관세율(269%)을 적용받아 수입통관을 하고 있다. 또한, 쟁점유통업체(청구법인의 자회사, 전직 직원이 설립한 회사 등)가 유통공사로부터 배분받은 TRQ 추천세율(0%) 수입권을 이용해 맥아 67,022톤(이하 \"쟁점물품\"이라 한다)을 수입한 후 이를 전량 청구법인에게 공급하도록 하였다.\n\n라. 처분청은 쟁점물품의 실질적 화주가 청구법인임에도 청구법인이 저율의 TRQ 추천세율(0%)을 적용받기 위해 쟁점유통업체로 하여금 수입통관하게 하고 이를 다시 청구법인이 구매하는 방식으로 관세 등을 회피하였다고 보아, 2024.1.3. 청구법인에게 관세, 부가가치세, 가산세 등을 경정․고지하면서 부가가치세에 대해 수입세금계산서를 발급하였다.\n\n마. 이후 처분청은 청구법인의 행위는 「관세법」 제42조 제2항에서 규정하는 '부정한 행위'에 해당한다고 보아 2024.4.25. 부정행위과소신고가산세 40%(부가가치세 가산세 60%)를 부과하는 처분(쟁점①처분)을 하였으며, 2024.1.3. 발급한 부가가치세 수입세금계산서를 취소하기 위해 마이너스(陰) 수정수입세금계산서를 발급하는 처분(쟁점②처분)을 하였다. 청구법인은 이에 불복하여 2024.7.23. 심판청구를 제기하였다.",
            "customs_argument": "① 청구법인은 B/L 등 무역서류 상 수하인을 자신이 아닌 쟁점유통업체로 기재하도록 지시하여 부정한 방법으로 TRQ 추천세율을 중복 편취하였으므로 가산세 부과는 정당하다. ② 실질 납세의무자 변동에 따라 2024.1.3. 발급한 세금계산서는 실질적으로 결정/경정에 따른 수정수입세금계산서에 해당하므로, 부정행위에 기반하여 발급된 계산서를 취소하는 음(陰)의 수정수입세금계산서 발급 역시 적법하다.",
            "importer_argument": "① 자료 은닉이나 기망행위가 없었고 3자간 통정이 불가능하므로 부정행위가 아니다. ② 맥아 TRQ는 실수요자 제한이 없어 수입 후 타인 판매가 자유롭게 허용되며 국가 세수 일실이 없었다. ③ 2024.1.3. 발급한 수입세금계산서는 최초 징수 시 발행된 것이므로 수정수입세금계산서 규정을 적용해 소급 취소(음의 세금계산서 발급)할 수 없다.",
            "holding_ko": "기각 (과세 유지 및 음의 세금계산서 발급 정당) - ① 수하인 명의 우회를 지시해 저율 TRQ 혜택을 편취한 행위는 관세법상 부정한 행위에 해당하여 가산세 처분이 타당하다. ② 경정·고지 처분을 통해 납세의무자를 변경하며 발급한 세금계산서는 수정수입세금계산서의 성격을 가지므로, 부정행위를 이유로 이를 취소하는 음(陰)의 수정수입세금계산서 처분은 정당하다.",
            "reasoning_snippet": "【결정요지 및 판단이유】\n1. 쟁점①(부정행위과소신고가산세)에 대하여:\n맥아의 FTA TRQ 배분은 신청 업체 수로 1/N 균등 배분 방식으로서 더 많은 신청 업체를 동원할수록 더 많은 TRQ 물량의 배분 및 적용 추천을 받아 낮은 세율을 적용받을 수 있다.\n청구법인은 부족 할당물량을 확보하고 TRQ 물량의 경제적 이익을 편취할 목적으로 6개 쟁점유통업체 명의로 FTA 할당관세 추천서를 발급받아 TRQ 추천세율을 적용받았던 점, 청구법인 내부품의서에 'we can save 30% of import tariff'라고 명시되어 있어 이 건 거래의 목적이 쟁점유통업체를 통한 관세 절감이라는 점을 내부적으로 인지하고 있었던 것으로 보이는 점, 청구법인은 선하증권(B/L) 등 무역서류 상에 수하인 등을 청구법인이 아닌 쟁점유통업체로 기재하도록 쟁점수출자에게 지시하는 등 부정한 행위를 통하여 쟁점물품에 대해 낮은 세율의 TRQ 추천세율을 적용받은 점 등에 비추어, 이 건 가산세 부과처분은 잘못이 없는 것으로 판단된다.\n\n2. 쟁점②(음의 수정수입세금계산서 발급)에 대하여:\n「부가가치세법」 제35조 제1항에 따라 세관장은 수입되는 재화에 대하여 부가가치세를 징수할 때에 수입세금계산서를 수입하는 자에게 발급하여야 하고, 제2항에서 세관장이 과세표준 또는 세액을 결정 또는 경정하는 경우에는 수입하는 자에게 수정한 수입세금계산서를 발급하도록 규정하고 있으며, 제3항에서 세관장이 수정수입세금계산서를 발급한 후 이미 발급한 수정수입세금계산서를 그 수정 전으로 되돌리는 내용의 수정수입세금계산서를 발급할 수 있다고 규정하고 있다.\n처분청이 2024.1.3. 청구법인에게 발급한 수입세금계산서는 징수 시 최초 발급된 것이 아니라, 세관장이 과세표준 또는 세액을 결정 또는 경정하면서 발급한 수정한 수입세금계산서로 볼 수 있는 점, 2024.1.3. 청구법인을 쟁점물품의 실제 납세의무자(화주)로 보아 경정․고지한 금액에 대하여만 발급된 수입세금계산서는 청구법인으로 수입자를 변경하고 세액을 추가하는 등 수정한 수입세금계산서에 해당하는 점, 이후 처분청이 「부가가치세법」 제35조 제3항에 따라 청구법인의 행위가 「관세법」 제42조 제2항에 따른 '부정한 행위'에 해당한다고 보아 2024.1.3. 청구법인에게 발급한 수정한 수입세금계산서를 그 수정 전으로 되돌리는 내용의 수정수입세금계산서를 발급한 점 등을 고려할 때, 음(陰)의 수정수입세금계산서 발급 처분은 잘못이 없다.",
            "implication_ko": "타인의 명의를 개입시켜 B/L상 수입자를 허위로 작성하는 행위나 TRQ 물량 균등 배분의 제도를 남용하기 위해 독립성이 결여된 유통업체를 내세우는 우회거래 구조는, 실질과세원칙에 따른 추징뿐만 아니라 관세법상 \"부정한 행위\"로 성립되어 40~60%의 징벌적 부정행위가산세 부과 및 추징된 부가가치세 매입세액공제를 전면 불허하는 음(陰)의 수정수입세금계산서 처분으로 이어지므로 절대 주의해야 합니다."
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

    # 6-1. 세율 마스터 시딩 (2026년 공식 관세율표, 복합세/선택세, 계절관세 및 TRQ 완벽 반영)
    rates_data = [
        # 1. 참깨 (1207.40-0000)
        {
            "hs_code": "1207.40-0000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 40.0,
            "specific_rate": 6660.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "630% 또는 6,660원/kg 양자 중 고액 (일반 WTO TRQ W1 추천: 40%, 한-중 FTA FCN6 추천: 0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1207.40-0000", "country_code": "IT", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": 99.4, "fta_name": "한-EU FTA (FEU1)", "recommended_rate": 99.4,
            "specific_rate": 1051.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "99.4% 또는 1,051원/kg 양자 중 고액 (상반기: 132.6% 또는 1,402원/kg)",
            "has_seasonal_rate": True,
            "seasonal_schedule": json.dumps({
                "first_half": {"fta_rate": 132.6, "specific_rate": 1402.0, "unit": "원/kg", "formula": "132.6% 또는 1,402원/kg 양자 중 고액", "name": "상반기(1~6월)"},
                "second_half": {"fta_rate": 99.4, "specific_rate": 1051.0, "unit": "원/kg", "formula": "99.4% 또는 1,051원/kg 양자 중 고액", "name": "하반기(7~12월)"}
            })
        },
        {
            "hs_code": "1207.40-0000", "country_code": "GB", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": 99.4, "fta_name": "한-영국 FTA (FGB1)", "recommended_rate": 99.4,
            "specific_rate": 1051.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "99.4% 또는 1,051원/kg 양자 중 고액 (상반기: 132.6% 또는 1,402원/kg)",
            "has_seasonal_rate": True,
            "seasonal_schedule": json.dumps({
                "first_half": {"fta_rate": 132.6, "specific_rate": 1402.0, "unit": "원/kg", "formula": "132.6% 또는 1,402원/kg 양자 중 고액", "name": "상반기(1~6월)"},
                "second_half": {"fta_rate": 99.4, "specific_rate": 1051.0, "unit": "원/kg", "formula": "99.4% 또는 1,051원/kg 양자 중 고액", "name": "하반기(7~12월)"}
            })
        },
        {
            "hs_code": "1207.40-0000", "country_code": "US", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA 원산지증명서 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1207.40-0000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": 0.0, "fta_name": "한-중 FTA (FCN6)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% (FCN6: aT 한-중 TRQ추천 시) / 630% 또는 6,660원/kg (FCN1: 미추천 선택세)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 2. 들깨 (1207.99-0000)
        {
            "hs_code": "1207.99-0000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 40.0,
            "specific_rate": 369.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "40% 또는 369원/kg 양자 중 고액 (aT 추천서 구비 시 40%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1207.99-0000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 40.0,
            "specific_rate": 369.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "40% 또는 369원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 3. 건조 표고버섯 (0712.39-1010)
        {
            "hs_code": "0712.39-1010", "country_code": "KR", 
            "base_rate": 30.0, "wto_rate": 514.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": 1625.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "514% 또는 1,625원/kg 양자 중 고액 (산림조합 추천서 구비 시 30%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0712391010", "country_code": "BASE", 
            "base_rate": 30.0, "wto_rate": 514.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": 1625.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "514% 또는 1,625원/kg 양자 중 고액 (산림조합 추천서 구비 시 30%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0712.39-1010", "country_code": "CN", 
            "base_rate": 30.0, "wto_rate": 514.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 30.0,
            "specific_rate": 1625.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "514% 또는 1,625원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0712391010", "country_code": "CN", 
            "base_rate": 30.0, "wto_rate": 514.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 30.0,
            "specific_rate": 1625.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "514% 또는 1,625원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 4. 신선/냉장 마늘 (0703.20-1000)
        {
            "hs_code": "0703.20-1000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 360.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 1800.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "360% 또는 1,800원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0703.20-1000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 360.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 1800.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "360% 또는 1,800원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 5. 신선/냉장 양파 (0703.10-1000)
        {
            "hs_code": "0703.10-1000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 135.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 206.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "135% 또는 206원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0703.10-1000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 135.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 206.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "135% 또는 206원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 6. 건고추 및 고춧가루 (0904.21-0000 / 0904.22-0000 / 0904.20-1000)
        {
            "hs_code": "0904.21-0000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0904.21-0000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0904.22-0000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0904.22-0000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0904.20-1000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0904.20-1000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 270.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 6210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "270% 또는 6,210원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 건조 마늘 (0712.90-2090)
        {
            "hs_code": "0712.90-2090", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 360.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 1800.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "360% 또는 1,800원/kg 양자 중 고액 (aT 추천서 구비 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0712.90-2090", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 360.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 1800.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "360% 또는 1,800원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 건조 생강 (0910.12-0000)
        {
            "hs_code": "0910.12-0000", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 377.3, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": 1910.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "377.3% 또는 1,910원/kg 양자 중 고액 (일반 WTO W1: 20%, 한-중 FTA FCN6: 0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0910.12-0000", "country_code": "CN", 
            "base_rate": 20.0, "wto_rate": 377.3, "fta_rate": 0.0, "fta_name": "한-중 FTA (FCN6)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% (FCN6: aT 한-중 TRQ추천 시) / 377.3% 또는 1,910원/kg (FCN1: 미추천 선택세)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 신선/냉장 감자 (0701.90-0000)
        {
            "hs_code": "0701.90-0000", "country_code": "KR", 
            "base_rate": 30.0, "wto_rate": 304.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "304.0% (aT 추천 시 30.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0701.90-0000", "country_code": "US", 
            "base_rate": 30.0, "wto_rate": 304.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0701.90-0000", "country_code": "AU", 
            "base_rate": 30.0, "wto_rate": 304.0, "fta_rate": 0.0, "fta_name": "한-호주 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-호주 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 참기름 (1515.50-0000)
        {
            "hs_code": "1515.50-0000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 40.0,
            "specific_rate": 6660.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "630% 또는 6,660원/kg 양자 중 고액 (전 FTA 양허제외)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1515.50-0000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 630.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 40.0,
            "specific_rate": 6660.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "630% 또는 6,660원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 들기름 (1515.90-1000)
        {
            "hs_code": "1515.90-1000", "country_code": "KR", 
            "base_rate": 36.0, "wto_rate": 36.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 36.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "36.0% (기본관세, 전 FTA 양허제외)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1515.90-1000", "country_code": "CN", 
            "base_rate": 36.0, "wto_rate": 36.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 36.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "36.0% (전 FTA 양허제외)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 대두유 (1507.10-0000 조유 / 1507.90-0000 정제유)
        {
            "hs_code": "1507.10-0000", "country_code": "KR", 
            "base_rate": 5.0, "wto_rate": 5.4, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 5.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "5.0% (기본관세) / 5.4% (WTO)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1507.10-0000", "country_code": "US", 
            "base_rate": 5.0, "wto_rate": 5.4, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1507.90-0000", "country_code": "KR", 
            "base_rate": 5.0, "wto_rate": 27.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 5.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "5.0% (기본관세) / 27.0% (WTO)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1507.90-0000", "country_code": "US", 
            "base_rate": 5.0, "wto_rate": 27.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 7. 대두 (1201.90-0000)
        {
            "hs_code": "1201.90-0000", "country_code": "KR", 
            "base_rate": 3.0, "wto_rate": 487.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 3.0,
            "specific_rate": 956.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "487% 또는 956원/kg 양자 중 고액 (aT 추천서 구비 시 3.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1201.90-0000", "country_code": "US", 
            "base_rate": 3.0, "wto_rate": 487.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1201.90-0000", "country_code": "IT", 
            "base_rate": 3.0, "wto_rate": 487.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-EU FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 8. 신선 오렌지 (0805.10-0000) - 계절관세 품목
        {
            "hs_code": "0805.10-0000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": None, "fta_name": "기본/계절관세", "recommended_rate": 30.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "30% (계절관세 3.1~8.31) / 50% (기본관세 9.1~2.28)",
            "has_seasonal_rate": True,
            "seasonal_schedule": json.dumps({
                "in_season": {"months": [3, 4, 5, 6, 7, 8], "rate": 30.0, "formula": "30.0% (계절관세 기간 3.1~8.31)", "name": "계절관세(3~8월)"},
                "out_season": {"months": [9, 10, 11, 12, 1, 2], "rate": 50.0, "formula": "50.0% (기본관세 기간 9.1~2.28)", "name": "기본관세(9~2월)"}
            })
        },
        {
            "hs_code": "0805.10-0000", "country_code": "US", 
            "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 0.0, "fta_name": "한-미 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 9. 신선 포도 (0806.10-0000) - 계절관세 품목
        {
            "hs_code": "0806.10-0000", "country_code": "KR", 
            "base_rate": 45.0, "wto_rate": 45.0, "fta_rate": None, "fta_name": "기본/계절관세", "recommended_rate": 24.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "45% (국내 수확기 5.1~10.15) / 24% (비수확기 10.16~4.30)",
            "has_seasonal_rate": True,
            "seasonal_schedule": json.dumps({
                "in_season": {"months": [5, 6, 7, 8, 9, 10], "rate": 45.0, "formula": "45.0% (국내 수확기 보호 5.1~10.15)", "name": "수확기(5~10월)"},
                "out_season": {"months": [11, 12, 1, 2, 3, 4], "rate": 24.0, "formula": "24.0% (비수확기 10.16~4.30)", "name": "비수확기(11~4월)"}
            })
        },
        {
            "hs_code": "0806.10-0000", "country_code": "CL", 
            "base_rate": 45.0, "wto_rate": 45.0, "fta_rate": 0.0, "fta_name": "한-칠레 FTA", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-칠레 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 10. 팥 (0713.32-0000) - 초민감 농산물
        {
            "hs_code": "0713.32-0000", "country_code": "KR", 
            "base_rate": 30.0, "wto_rate": 420.8, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": 4210.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "420.8% 또는 4,210원/kg 양자 중 고액 (일반 WTO W1: 30%, 한-중 FTA FCN6: 0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0713.32-0000", "country_code": "CN", 
            "base_rate": 30.0, "wto_rate": 420.8, "fta_rate": 0.0, "fta_name": "한-중 FTA (FCN6)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% (FCN6: aT 한-중 TRQ추천 시) / 420.8% 또는 4,210원/kg (FCN1: 미추천 선택세)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 11. 녹두 (0713.31-0000) - 초민감 농산물
        {
            "hs_code": "0713.31-0000", "country_code": "KR", 
            "base_rate": 30.0, "wto_rate": 607.5, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": 4950.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "607.5% 또는 4,950원/kg 양자 중 고액 (일반 WTO W1: 30%, 한-중 FTA FCN6: 0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0713.31-0000", "country_code": "CN", 
            "base_rate": 30.0, "wto_rate": 607.5, "fta_rate": 0.0, "fta_name": "한-중 FTA (FCN6)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% (FCN6: aT 한-중 TRQ추천 시) / 607.5% 또는 4,950원/kg (FCN1: 미추천 선택세)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 12. 생강 (0910.11-0000)
        {
            "hs_code": "0910.11-0000", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 377.3, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": 1910.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "377.3% 또는 1,910원/kg 양자 중 고액 (일반 WTO W1: 20%, 한-중 FTA FCN6: 0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0910.11-0000", "country_code": "CN", 
            "base_rate": 20.0, "wto_rate": 377.3, "fta_rate": 0.0, "fta_name": "한-중 FTA (FCN6)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% (FCN6: aT 한-중 TRQ추천 시) / 377.3% 또는 1,910원/kg (FCN1: 미추천 선택세)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 13. 맥아 (1107.10-0000) - 맥주 원료 TRQ
        {
            "hs_code": "1107.10-0000", "country_code": "KR", 
            "base_rate": 30.0, "wto_rate": 269.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 30.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "269.0% (aT 일반 WTO W1 추천 시 30%, FTA TRQ 추천 시 0.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1107.10-0000", "country_code": "AU", 
            "base_rate": 30.0, "wto_rate": 269.0, "fta_rate": 0.0, "fta_name": "한-호주 FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (aT FTA TRQ 수입추천 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1107.10-0000", "country_code": "CA", 
            "base_rate": 30.0, "wto_rate": 269.0, "fta_rate": 0.0, "fta_name": "한-캐나다 FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (aT FTA TRQ 수입추천 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1107.10-0000", "country_code": "IT", 
            "base_rate": 30.0, "wto_rate": 269.0, "fta_rate": 0.0, "fta_name": "한-EU FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (aT FTA TRQ 수입추천 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 14. 탈지/전지분유 (0402.10-0000)
        {
            "hs_code": "0402.10-0000", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 176.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": 1186.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "176% 또는 1,186원/kg 양자 중 고액 (유가공협회 추천 시 20%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0402.10-0000", "country_code": "US", 
            "base_rate": 20.0, "wto_rate": 176.0, "fta_rate": 0.0, "fta_name": "한-미 FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA 할당관세 추천 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0402.10-0000", "country_code": "IT", 
            "base_rate": 20.0, "wto_rate": 176.0, "fta_rate": 0.0, "fta_name": "한-EU FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-EU FTA 할당관세 추천 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 15. 땅콩 탈각 (1202.42-0000)
        {
            "hs_code": "1202.42-0000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 230.5, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 24.0,
            "specific_rate": 1930.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "230.5% 또는 1,930원/kg 양자 중 고액 (aT 추천 시 24%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1202.42-0000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 230.5, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 40.0,
            "specific_rate": 1930.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "230.5% 또는 1,930원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 16. 천연 꿀 (0409.00-0000)
        {
            "hs_code": "0409.00-0000", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 243.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": 1864.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "243% 또는 1,864원/kg 양자 중 고액 (aT 추천 시 20%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0409.00-0000", "country_code": "CN", 
            "base_rate": 20.0, "wto_rate": 243.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 20.0,
            "specific_rate": 1864.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "243% 또는 1,864원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 17. 밤 (0802.41-0000 / 0802.42-0000)
        {
            "hs_code": "0802.41-0000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 211.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 40.0,
            "specific_rate": 838.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "211% 또는 838원/kg 양자 중 고액 (산림조합 추천 시 40%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0802.41-0000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 211.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 40.0,
            "specific_rate": 838.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "211% 또는 838원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 18. 잣 (0802.90-1000)
        {
            "hs_code": "0802.90-1000", "country_code": "KR", 
            "base_rate": 40.0, "wto_rate": 510.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 40.0,
            "specific_rate": 4110.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "510% 또는 4,110원/kg 양자 중 고액 (산림조합 추천 시 40%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0802.90-1000", "country_code": "CN", 
            "base_rate": 40.0, "wto_rate": 510.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 40.0,
            "specific_rate": 4110.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "510% 또는 4,110원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 19. 대추 (0813.40-1000)
        {
            "hs_code": "0813.40-1000", "country_code": "KR", 
            "base_rate": 50.0, "wto_rate": 611.5, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 50.0,
            "specific_rate": 5496.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "611.5% 또는 5,496원/kg 양자 중 고액 (산림조합 추천 시 50%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "0813.40-1000", "country_code": "CN", 
            "base_rate": 50.0, "wto_rate": 611.5, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 50.0,
            "specific_rate": 5496.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "611.5% 또는 5,496원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 20. 쌀 (1006.30-0000) - 전 FTA 양허제외
        {
            "hs_code": "1006.30-0000", "country_code": "KR", 
            "base_rate": 5.0, "wto_rate": 513.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 5.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "513.0% (aT 국영무역 TRQ 추천 시 5.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1006.30-0000", "country_code": "CN", 
            "base_rate": 5.0, "wto_rate": 513.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 5.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "513.0% (전 FTA 양허제외)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 21. 감자전분 (1108.13-0000)
        {
            "hs_code": "1108.13-0000", "country_code": "KR", 
            "base_rate": 8.0, "wto_rate": 455.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 8.0,
            "specific_rate": 344.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "455% 또는 344원/kg 양자 중 고액 (aT 추천 시 8.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1108.13-0000", "country_code": "CN", 
            "base_rate": 8.0, "wto_rate": 455.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 8.0,
            "specific_rate": 344.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "455% 또는 344원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 22. 고구마전분 (1108.14-0000)
        {
            "hs_code": "1108.14-0000", "country_code": "KR", 
            "base_rate": 8.0, "wto_rate": 241.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 8.0,
            "specific_rate": 239.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "241% 또는 239원/kg 양자 중 고액 (aT 추천 시 8.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1108.14-0000", "country_code": "CN", 
            "base_rate": 8.0, "wto_rate": 241.0, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 8.0,
            "specific_rate": 239.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "241% 또는 239원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 23. 옥수수 (1005.90-1000 사료용 / 1005.90-9000 가공용)
        {
            "hs_code": "1005.90-0000", "country_code": "KR", 
            "base_rate": 3.0, "wto_rate": 328.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 3.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "328.0% (aT/사료협회 TRQ 추천 시 3.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1005.90-0000", "country_code": "US", 
            "base_rate": 3.0, "wto_rate": 328.0, "fta_rate": 0.0, "fta_name": "한-미 FTA (TRQ)", "recommended_rate": 0.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "0.0% 무관세 (한-미 FTA C/O 구비 시)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 24. 인삼 / 홍삼 (1211.20-1010) - 국내 최고세율 품목
        {
            "hs_code": "1211.20-1010", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 754.3, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": 28218.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "754.3% 또는 28,218원/kg 양자 중 고액 (인삼농협 추천 시 20%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "1211.20-1010", "country_code": "CN", 
            "base_rate": 20.0, "wto_rate": 754.3, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 20.0,
            "specific_rate": 28218.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "754.3% 또는 28,218원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 25. 홍삼 농축액 / 엑기스 (2106.90-3010)
        {
            "hs_code": "2106.90-3010", "country_code": "KR", 
            "base_rate": 8.0, "wto_rate": 754.3, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 8.0,
            "specific_rate": 28218.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "754.3% 또는 28,218원/kg 양자 중 고액 (인삼농협 추천 시 8.0%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "2106.90-3010", "country_code": "CN", 
            "base_rate": 8.0, "wto_rate": 754.3, "fta_rate": None, "fta_name": "한-중 FTA (양허제외)", "recommended_rate": 8.0,
            "specific_rate": 28218.0, "specific_unit": "원/kg", "duty_type": "ALTERNATIVE",
            "duty_formula": "754.3% 또는 28,218원/kg 양자 중 고액",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 26. 조제마늘 / 초절임마늘 (2005.99-1000)
        {
            "hs_code": "2005.99-1000", "country_code": "KR", 
            "base_rate": 20.0, "wto_rate": 54.0, "fta_rate": None, "fta_name": "기본/WTO", "recommended_rate": 20.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "54.0% (기본관세 20%)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },
        {
            "hs_code": "2005.99-1000", "country_code": "CN", 
            "base_rate": 20.0, "wto_rate": 54.0, "fta_rate": 8.0, "fta_name": "한-중 FTA", "recommended_rate": 8.0,
            "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM",
            "duty_formula": "8.0% (한-중 FTA 연차감축 협정세율)",
            "has_seasonal_rate": False, "seasonal_schedule": None
        },

        # 기타 기존 품목 (배주스, 건조 스파게티, 갈비살, 와인)
        {"hs_code": "2009.89-1090", "country_code": "US", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 4.5, "fta_name": "한-미 FTA", "recommended_rate": 4.5, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "4.5% (한-미 FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "2009.89-1090", "country_code": "CN", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 45.0, "fta_name": "한-중 FTA", "recommended_rate": 45.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "45.0% (한-중 FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "2009.89-1090", "country_code": "IT", "base_rate": 50.0, "wto_rate": 50.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "0.0% 무관세 (한-EU FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "1902.11-1000", "country_code": "IT", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "0.0% 무관세", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "1902.11-1000", "country_code": "CN", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 6.4, "fta_name": "한-중 FTA", "recommended_rate": 6.4, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "6.4% (한-중 FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "1902.11-1000", "country_code": "VN", "base_rate": 8.0, "wto_rate": 8.0, "fta_rate": 0.0, "fta_name": "한-ASEAN FTA", "recommended_rate": 0.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "0.0% 무관세", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "0201.30-0000", "country_code": "US", "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": 10.6, "fta_name": "한-미 FTA", "recommended_rate": 10.6, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "10.6% (한-미 FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "0201.30-0000", "country_code": "AU", "base_rate": 40.0, "wto_rate": 40.0, "fta_rate": 13.3, "fta_name": "한-호주 FTA", "recommended_rate": 13.3, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "13.3% (한-호주 FTA)", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "2204.21-1000", "country_code": "FR", "base_rate": 15.0, "wto_rate": 15.0, "fta_rate": 0.0, "fta_name": "한-EU FTA", "recommended_rate": 0.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "0.0% 무관세", "has_seasonal_rate": False, "seasonal_schedule": None},
        {"hs_code": "2204.21-1000", "country_code": "CL", "base_rate": 15.0, "wto_rate": 15.0, "fta_rate": 0.0, "fta_name": "한-칠레 FTA", "recommended_rate": 0.0, "specific_rate": None, "specific_unit": None, "duty_type": "AD_VALOREM", "duty_formula": "0.0% 무관세", "has_seasonal_rate": False, "seasonal_schedule": None}
    ]

    for r in rates_data:
        clean_hs = r["hs_code"].replace(".", "").replace("-", "")
        formatted_codes = list(set([r["hs_code"], clean_hs, f"{clean_hs[:4]}.{clean_hs[4:6]}-{clean_hs[6:]}" if len(clean_hs) == 10 else r["hs_code"]]))
        
        matches = db.query(HSRateMaster).filter(HSRateMaster.hs_code.in_(formatted_codes), HSRateMaster.country_code == r["country_code"]).all()
        if not matches:
            db_r = HSRateMaster(
                hs_code=r["hs_code"],
                country_code=r["country_code"],
                base_rate=r["base_rate"],
                wto_rate=r["wto_rate"],
                fta_rate=r["fta_rate"],
                fta_name=r["fta_name"],
                recommended_rate=r["recommended_rate"],
                specific_rate=r.get("specific_rate"),
                specific_unit=r.get("specific_unit"),
                duty_type=r.get("duty_type", "AD_VALOREM"),
                duty_formula=r.get("duty_formula"),
                has_seasonal_rate=r.get("has_seasonal_rate", False),
                seasonal_schedule=r.get("seasonal_schedule")
            )
            db.add(db_r)
        else:
            for exists in matches:
                exists.base_rate = r["base_rate"]
                exists.wto_rate = r["wto_rate"]
                exists.fta_rate = r["fta_rate"]
                exists.fta_name = r["fta_name"]
                exists.recommended_rate = r["recommended_rate"]
                exists.specific_rate = r.get("specific_rate")
                exists.specific_unit = r.get("specific_unit")
                exists.duty_type = r.get("duty_type", "AD_VALOREM")
                exists.duty_formula = r.get("duty_formula")
                exists.has_seasonal_rate = r.get("has_seasonal_rate", False)
                exists.seasonal_schedule = r.get("seasonal_schedule")
                db.add(exists)
    db.commit()

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

