# -*- coding: utf-8 -*-
import sqlite3
import json

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def seed_today_news():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table if not exists
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customs_news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        agency TEXT NOT NULL,
        summary TEXT NOT NULL,
        link TEXT NOT NULL,
        full_content TEXT NOT NULL,
        attached_files TEXT NOT NULL
    )
    """)

    # 2026-09-03 Today's Breaking Customs Notices & Guidelines
    today_items = [
        (
            "관세청 속보",
            "[속보] 2026년 9월 3일 관세청 사후 세액정밀검증 및 환급 신청 대상 품목 일제 고시",
            "2026-09-03",
            "관세청 심사국 세액심사과",
            "2026년 9월 3일부로 반도체, 이차전지, 바이오에너지 및 정밀화학 원자재에 대한 사후 세액 적정성 5년 소멸시효 검증 강화 및 자진정정 감면 안내 공고",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065421",
            """[2026년 9월 3일 관세청 사후 세액정밀검증 및 환급 신청 종합지침]
【소관부처】 관세청 심사국 세액심사과 (공고 제2026-89호, 2026. 9. 3.)

관세청은 성실납세 문화 정착과 수출입 기업의 세액 오류 사전 예방을 위해, 2026년 9월 3일부로 5년 제척기간 내 주요 수입물품에 대한 사후 세액정밀검증 및 관세 환급 지원 방안을 시행합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 1. 중점 정밀 세액검증 대상 품목군
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➊ 반도체 제조용 전구체, TMAH 현상액 및 실리콘 웨이퍼 (제28류, 제29류, 제38류)
   - 주요 이슈: 화학단일물과 조제품 간 품목분류 오류 및 특수관계자 간 이전가격(Transfer Pricing) 적정성
➋ 이차전지 양극재(NCM/LFP) 및 리튬이온 축전지 셀 (제8507호)
   - 주요 이슈: 잠정가격신고 확정 여부 및 생산지원비용(로열티/금형비) 가산 누락 여부
➌ 바이오디젤 및 FAME 혼합물 (제3826호)
   - 주요 이슈: 70% 미만 함유 혼합물 세번 판정 및 신재생에너지 감면 적합성

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 2. 자진수정신고 감면 혜택
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ㅇ 세관의 서면조사 통지 전 자진수정신고 시:
   - 가산세 100% 면제 및 사후 기획심사 대상에서 2년간 유예
ㅇ 관세 환급 대상 오류 발견 시:
   - 과오납 관세에 대한 5년 소급 경정청구 및 환급 가산금 즉시 지급 처리

■ 3. 시행일자: 2026년 9월 3일(목) 즉시 시행""",
            json.dumps([
                {"name": "20260903_사후세액정밀검증_시행지침_전문.pdf", "size": "188.4 KB"},
                {"name": "자진수정신고_및_환급신청서_표준서식.hwp", "size": "420.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "수출입 통관",
            "[긴급] 2026년 9월 3일 관세율표 HSK 10단위 품목분류 및 분류근거 매칭 기준 시달",
            "2026-09-03",
            "관세청 품목분류과 / 관세평가분류원",
            "디스플레이(제8524호), 첨단 반도체 부품(제8541호, 제8486호) 및 섬유/철강 제품에 대한 WCO 2026 기준 품목분류 사전심사 법적 근거 통일화 안내",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065422",
            """[2026년 9월 3일 관세율표 HSK 10단위 품목분류 집행 기준 통보]
【소관기관】 관세평가분류원 품목분류1과 (2026. 9. 3.)

■ 1. 핵심 개정 및 적용 기준
➊ 평판디스플레이 모듈(FPD) 분류:
   - 백라이트 및 터치센서 유무에 따른 제8524호 소호 결정 기준 명확화
➋ 제16부 주 제1호 및 제2호 우선순위 적용:
   - 가공된 강화유리(제7007호) 및 비금속제 관(제8307호)의 기계류 배제 원칙 철저 준수
➌ 수입신고서 상 필수 규격 기재:
   - 순도, 함량, 분자량, 물리적 형상 등 세번 결정 핵심 스펙 누락 시 수리 전 보완 요구

■ 2. 시행일: 2026년 9월 3일 수입신고건부터 적용""",
            json.dumps([
                {"name": "20260903_품목분류_법적근거_매칭매뉴얼.pdf", "size": "210.5 KB"},
                {"name": "주요오분류_방지_체크시트.xlsx", "size": "95.2 KB"}
            ], ensure_ascii=False)
        ),
        (
            "FTA 협정세율",
            "2026년 9월 3일 RCEP 및 한-EU FTA 원산지 자율증명 사후검증 실무 매뉴얼 배포",
            "2026-09-03",
            "관세청 FTA집행기획관",
            "원산지 소명서 및 원자재 소요량 명세서(BOM) 위변조 방지 전자검증 체계 구축 및 수입기업 대상 체크리스트 공지",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065423",
            """[RCEP 및 한-EU FTA 원산지 사후검증 실무 가이드라인]
【소관부처】 관세청 자유무역협정집행기획관 (2026. 9. 3.)

■ 1. 목적
체약상대국 세관의 원산지 간접검증 요청 급증에 대비하여 국내 수입기업의 특혜관세 추징 리스크를 방지함.

■ 2. 필수 보관 증빙서류 (5년간 보관 의무)
1. 원산지증명서 원본 (C/O)
2. 제조공정도 및 원자재 수불대장
3. 원산지포괄확인서 및 협정별 원산지결정기준(PSR) 충족 증빙

■ 3. 상담 지원: 원스탑 관세 AI 포털 및 관세청 FTA 상담센터 125""",
            json.dumps([
                {"name": "20260903_FTA_원산지사후검증_가이드.pdf", "size": "340.1 KB"}
            ], ensure_ascii=False)
        ),
        (
            "특송 통관",
            "해외직구 개인통관고유부호 도용 차단 2단계 인증 의무화 전면 시행",
            "2026-09-02",
            "관세청 전자상거래통관과",
            "명의도용 불법 통관을 원천 차단하기 위한 통관고유부호-휴대폰 본인인증 실시간 연동 시스템 가동",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065415",
            """[개인통관고유부호 도용 방지 실시간 2단계 인증제 시행 안내]
【소관부처】 관세청 전자상거래통관과 (2026. 9. 2.)

해외직구 물품 통관 시 타인의 명의를 도용한 불법 의약품, 면세 악용 분할 반입을 차단하기 위해 수입신고 시 실시간 SMS 2단계 인증 체계를 전면 도입합니다.""",
            json.dumps([
                {"name": "개인통관고유부호_2단계인증_안내문.pdf", "size": "115.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "통합공고 요건",
            "2026년 9월 1일 대외무역법 통합공고 개정 고시 (식약처/환경부 수입승인 대상 갱신)",
            "2026-09-01",
            "산업통상자원부 / 관세청",
            "유해화학물질 및 수입식품 등의 수입 승인 절차 간소화 및 세관장확인 대상 전산 자동화 공고",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065401",
            """[대외무역법 통합공고 개정 고시안]
【소관부처】 산업통상자원부 고시 제2026-112호 (2026. 9. 1.)

화학물질관리법 및 수입식품안전관리특별법에 따른 3,400여 개 세번의 통관 전 행정절차 및 구비서류 전산 연계 기준을 공포합니다.""",
            json.dumps([
                {"name": "20260901_통합공고_개정전문.pdf", "size": "512.8 KB"}
            ], ensure_ascii=False)
        ),
        (
            "통관 지침",
            "전자담배 니코틴 용액 수입통관 지침(개정) 수정 안내",
            "2026-08-06",
            "관세청 통관기획과",
            "세금 탈루 의혹 및 유해성 문제 제기에 따른 합성·유사·무니코틴 수입통관 증빙서류 확대 및 수리 전 성분분석 의무화 지침",
            "https://n.news.naver.com/mnews/article/001/0014859231?sid=101",
            """[전자담배 니코틴 용액 수입통관 지침(개정) 수정 전문]
【소관부처】 관세청 통관기획과 (2026. 8. 6. 통관기획과-1389호 개정)

■ 1. 수입통관 시 증빙서류 제출 기준 확대 (합성 6종, 유사/무니코틴 5종)
■ 2. 수리 전 정밀 성분분석 의무화
■ 3. 시행일: 2026. 8. 18.부터 전면 시행""",
            json.dumps([
                {"name": "전자담배_니코틴_수입통관지침_개정전문.pdf", "size": "69.8 KB"}
            ], ensure_ascii=False)
        )
    ]

    # Clear and insert fresh data
    cursor.execute("DELETE FROM customs_news")
    for tag, title, date, agency, summary, link, content, files in today_items:
        cursor.execute("""
            INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (tag, title, date, agency, summary, link, content, files))
        print(f"Inserted News [{date}] {title[:40]}...")

    conn.commit()
    conn.close()
    print("Successfully seeded today's news items into SQLite!")

if __name__ == "__main__":
    seed_today_news()
