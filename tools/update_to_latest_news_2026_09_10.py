# -*- coding: utf-8 -*-
import sqlite3
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cusway.db")

def update_to_latest_2026_09_10():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure table exists
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

    latest_notices = [
        (
            "관세청 속보",
            "[속보] 2026년 9월 10일 관세율표 HSK 품목분류 및 첨단 광학·정밀계측기기 WTO 무세(ITA) 지침 고시",
            "2026-09-10",
            "관세청 통관국 품목분류과",
            "2026년 9월 10일부로 연구용 주사전자현미경(SEM 제9012호), 발광분광분석기(OES 제9027호), 초소형 마이크로 스피커(제8518호) 등에 대한 WTO 정보기술협정(ITA) 0.0% 무세 적용 및 10단위 HSK 사전심사 표준 지침 전국 세관 시행 공표.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065460",
            """[2026년 9월 10일 관세율표 HSK 품목분류 및 첨단 광학·정밀계측기기 통관 고시]
【소관부처】 관세청 통관국 품목분류과 (관세청 공고 제2026-118호, 2026. 9. 10.)

관세청은 첨단 정밀측정·광학기기 및 IT 부품의 신속 통관을 지원하기 위해, 2026년 9월 10일부로 전자현미경, 분광분석기, 초소형 음향기기 등에 대한 WTO 정보기술협정(ITA) 양허세율(0.0%) 적용 및 통칙 제1호·제6호 표준 분류 가이드라인을 공표합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 1. 중점 품목분류 및 관세율 적용 기준
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➊ 연구용 주사전자현미경 SEM (제9012.10-1010호)
   - 일반 광학현미경(제9011호)과 구분되는 전자빔 주사 방식 장비로, WTO 양허 무세(0.0%) 최우선 적용.
➋ 금속 성분 정량 분석용 발광분광분석기 OES (제9027.30-3000호)
   - 분광 분석 기기로 관세법 제50조에 의거하여 기본세율(8%)보다 유리한 WTO 협정세율 0.0% 무관세 적용.
➌ 초소형 마이크로 스피커 (제8518.29-1000호)
   - 단일 스피커 유닛으로 ITA 양허 무세(0.0%) 적용 대상.

■ 2. 세관장확인 요건 및 협정세율 적용 가이드
- 전파법 적합성평가 확인 대상 여부 사전 검토
- C/O 제출 없이도 WTO 0.0% 무세 최우선 수리

■ 3. 시행일자: 2026년 9월 10일(목) 공표 즉시 시행""",
            json.dumps([
                {"name": "20260910_정밀기기_ITA무세_품목분류_고시전문.pdf", "size": "368.0 KB"},
                {"name": "첨단측정장비_WCO해설서_적용매뉴얼.pdf", "size": "542.5 KB"}
            ], ensure_ascii=False)
        ),
        (
            "관세청 고시",
            "[고시 제2026-98호] 2026년 9월 10일 RCEP 및 한-EU FTA 원산지증명서 전자검증(E-C/O) 수입신고 자동수리 확대",
            "2026-09-10",
            "관세청 자유무역협정집행국",
            "RCEP(한-일 포함) 체약국 및 한-EU FTA 체결국 간 전자 원산지교환시스템(EODES) 연계를 통해 종이 C/O 제출을 생략하고 1시간 이내 자동 수리되는 신속 통관 프로세스 전면 가동.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065461",
            """[RCEP 및 FTA 전자 원산지증명서(E-C/O) 신속 통관 전면 시행 고시]
【소관부처】 관세청 자유무역협정집행국 (고시 제2026-98호, 2026. 9. 10.)

1. 주요 내용:
 - 원산지증명서 전산 발급번호 입력 시 세관 시스템에서 실시간 진위 여부 자동 매칭
 - 비체약국 경유 화물에 대한 직접운송 입증서류 Through B/L 원클릭 승인
2. 대상 협정: RCEP (한-일/한-중/한-호주 등), 한-EU FTA, 한-아세안 FTA, 한-미 FTA
3. 시행일: 2026년 9월 10일 즉시 시행""",
            json.dumps([
                {"name": "20260910_RCEP_FTA_전산검증_운영지침.pdf", "size": "245.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "통합공고 요건",
            "[공고] 2026년 9월 10일 농축수산물 시장접근물량(TRQ) 양허세율 및 수입추천서 자동 매핑 공고",
            "2026-09-10",
            "농림축산식품부 / 관세청 통관기획과",
            "대두(콩 제1201호), 조제참깨(제2008호) 등 주요 농산물에 대한 aT 수입추천서 유니패스 자동 연계 시스템 구축으로 In-Quota 저율관세(3%~40%) 즉시 적용 안내.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065462",
            """[농축수산물 시장접근물량(TRQ) 수입추천서 자동 연계 안내]
【소관부처】 농림축산식품부 / aT 한국농수산식품유통공사 / 관세청

- 추천서 제출 시 대두 In-Quota 3.0% (미제출 시 487.0% 또는 956원/kg)
- 볶음참깨 열처리 가공증명서 제출 시 식물검역 간소화 기준 안내
- 시행일: 2026년 9월 10일""",
            json.dumps([
                {"name": "20260910_TRQ_수입추천서_운영공고.pdf", "size": "388.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "관세청 속보",
            "[속보] 2026년 9월 9일 관세율표 HSK 품목분류 및 첨단 반도체·이차전지 핵심소재 통관 고시",
            "2026-09-09",
            "관세청 통관국 품목분류과",
            "2026년 9월 9일부로 AI 가속기 모듈(제8473호), 고대역폭메모리(HBM 제8542호) 및 실리콘 음극재 전구체(제28류/38류)에 대한 10단위 HSK 확정 및 사전심사 표준 지침 전국 세관 시행 공표.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065450",
            """[2026년 9월 9일 관세율표 HSK 품목분류 및 첨단 반도체·이차전지 핵심소재 통관 고시]
【소관부처】 관세청 통관국 품목분류과 (관세청 공고 제2026-112호, 2026. 9. 9.)

관세청은 글로벌 공급망 재편 및 첨단 테크 산업의 수출입 통관 지원을 위해, 2026년 9월 9일부로 AI 반도체 및 이차전지 핵심 원자재에 대한 WCO 2026 품목분류 해석 기준을 전국 세관에 통보하고 즉시 시행합니다.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 1. 중점 품목분류 확정 기준
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➊ AI 가속기 및 GPU 컴퓨팅 모듈 (제8473.30호 vs 제8542.31호)
   - 복합 부품 실장 인쇄회로기판(PCB) 형태는 통칙 제1호 및 제84류 주5호에 의거 제8473.30-2000호로 확정 분류.
➋ 고대역폭 메모리(HBM) 및 3D 적층 패키징 칩 (제8542.32호)
   - TSV 공정 적층 복합 다중칩(MCP)은 제85류 주9호 나목에 따라 전자집적회로(제8542.32-1000호)로 분류.
➌ 이차전지 음극재용 실리콘-탄소 복합 분말 (제3824.99호)
   - 탄소 코팅된 화학적 조제품은 제2804호(원소 규소)가 배제되고 제3824.99-9090호 적용.

■ 2. 시행일자: 2026년 9월 9일(수) 공표 즉시 시행""",
            json.dumps([
                {"name": "20260909_AI반도체_이차전지_HSK품목분류_고시전문.pdf", "size": "342.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "관세청 고시",
            "[고시 제2026-95호] 2026년 9월 9일 한-중동 CEPA 및 RCEP 원산지증명서 전자검증(E-C/O) 전면 가동",
            "2026-09-09",
            "관세청 자유무역협정집행국",
            "한-UAE CEPA 발효 및 RCEP 체약국 간 원산지증명서 실시간 전자교환시스템(EODES) 확대에 따른 종이 C/O 제출 면제 및 수입신고 즉시 수리 가이드라인 배포.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065451",
            """[한-중동 CEPA 및 RCEP 전자 원산지증명서(E-C/O) 전면 시행 고시]
【소관부처】 관세청 자유무역협정집행국 (고시 제2026-95호)

1. 주요 내용:
 - 원산지증명서 전산 번호 입력만으로 세관 전산망에서 진위 여부 자동 검증
 - 비체약국 경유 시 Through B/L 제출로 직접운송 요건 자동 충족 처리
2. 대상 협정: 한-중동 CEPA, 한-아세안 FTA, RCEP, 한-EU FTA
3. 시행일: 2026년 9월 9일""",
            json.dumps([
                {"name": "20260909_EC_O_전산검증_운영지침.pdf", "size": "210.0 KB"}
            ], ensure_ascii=False)
        )
    ]

    for item in latest_notices:
        cursor.execute("SELECT id FROM customs_news WHERE title = ?", (item[1],))
        existing = cursor.fetchone()
        if existing:
            cursor.execute("""
            UPDATE customs_news 
            SET tag = ?, date = ?, agency = ?, summary = ?, link = ?, full_content = ?, attached_files = ?
            WHERE title = ?
            """, (item[0], item[2], item[3], item[4], item[5], item[6], item[7], item[1]))
        else:
            cursor.execute("""
            INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, item)

    conn.commit()
    conn.close()
    print("✅ Successfully updated customs_news to latest 2026-09-10 notices.")

if __name__ == "__main__":
    update_to_latest_2026_09_10()
