# -*- coding: utf-8 -*-
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cusway.db")

def update_to_latest_2026_09_09():
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

■ 2. 세관장확인 요건 및 협정세율 적용 가이드
- 전략물자 판정 확인서 전산 연계 필수
- RCEP/한-미 FTA 원산지 사전검증 지원

■ 3. 시행일자: 2026년 9월 9일(수) 공표 즉시 시행""",
            json.dumps([
                {"name": "20260909_AI반도체_이차전지_HSK품목분류_고시전문.pdf", "size": "342.0 KB"},
                {"name": "첨단소재_WCO해설서_적용매뉴얼.pdf", "size": "512.5 KB"}
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
        ),
        (
            "통합공고 요건",
            "[공고] 2026년 9월 8일 대외무역법 수입 세관장확인 대상 전기용품 및 화학물질 안전인증 개편",
            "2026-09-08",
            "산업통상자원부 / 관세청 통관기획과",
            "전기용품및생활용품안전관리법(전안법) 및 화학물질관리법(화관법) 개정에 따른 유니패스 수입신고 자동 승인 연계 품목 35종 추가 공표.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065445",
            """[수입 세관장확인 대상 품목 통합공고 개정 안내]
【소관부처】 산업통상자원부 / 관세청

- 고출력 무선 충전기기 및 리튬 배터리 내장 기기 KC 인증번호 기재 의무화
- 수입신고 전 유니패스 요건신청 사전 완료 권고""",
            json.dumps([
                {"name": "20260908_세관장확인_통합공고_개정목록.pdf", "size": "410.0 KB"}
            ], ensure_ascii=False)
        ),
        (
            "관세평가",
            "2026년 9월 7일 특수관계자 간 이전가격(APA) 및 로열티 권리사용료 과세가격 산정 결정례집 배포",
            "2026-09-07",
            "관세평가분류원 관세평가과",
            "다국적기업 본지사 간 특수관계 수입거래에서 제1방법(거래가격) 배제 사유 및 로열티/라이선스 비용 가산율 산정에 관한 최신 조세심판원/대법원 판례 해설집 발간.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065440",
            """[2026 관세평가 최신 판례 및 로열티 과세가격 산정 기준]
【소관부처】 관세평가분류원 관세평가과

- 특허권 및 상표권 사용료가 수입물품과 '관련성' 및 '거래조건성'을 충족하는지 여부에 대한 5대 판정 기준 수록
- 정상가격 사전약정(APA) 체결 기업에 대한 세무조사 면제 범위 안내""",
            json.dumps([
                {"name": "20260907_관세평가_로열티_심사사례집.pdf", "size": "1.4 MB"}
            ], ensure_ascii=False)
        ),
        (
            "특송 통관",
            "2026년 9월 6일 해외직구 개인통관고유부호 도용 방지 AI 이상거래 실시간 탐지 시스템 가동",
            "2026-09-06",
            "관세청 전자상거래통관과",
            "자가사용 인정 기준 초과 분할 수입 및 타인 명의 도용 특송 화물에 대한 실시간 AI 탐지 알고리즘 적용으로 성실 통관자 1시간 내 자동 수리 보장.",
            "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065435",
            """[해외직구 AI 이상거래 실시간 탐지 및 통관 가속화]
- 도용 의심 거래 즉시 수입 보류 및 본인 확인 SMS 발송
- 정상 직구 물품 통관 시간 50% 단축""",
            json.dumps([
                {"name": "특송통관_이상거래탐지_안내.pdf", "size": "180.0 KB"}
            ], ensure_ascii=False)
        )
    ]

    for tag, title, date, agency, summary, link, full_content, attached_files in latest_notices:
        cursor.execute("SELECT id FROM customs_news WHERE title = ?", (title,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (tag, title, date, agency, summary, link, full_content, attached_files))
            print(f"[INSERTED] {date} - {title}")
        else:
            print(f"[EXISTING] {title}")

    conn.commit()

    cursor.execute("SELECT COUNT(*), MAX(date) FROM customs_news")
    total_count, max_date = cursor.fetchone()
    print(f"\n[COMPLETED] Total rows in customs_news: {total_count}, Max Date: {max_date}")
    conn.close()

if __name__ == "__main__":
    update_to_latest_2026_09_09()
