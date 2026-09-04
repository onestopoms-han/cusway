import re

NEWS_ARRAY_CODE = '''latest_today_news = [
    {
        "id": 1,
        "tag": "관세청 속보",
        "title": "[속보] 2026년 9월 4일 관세율표 HSK 품목분류 및 농축수산물 양허세율 적용 지침 고시",
        "date": "2026-09-04",
        "agency": "관세청 통관국 품목분류과",
        "summary": "2026년 9월 4일부로 개정 관세율표에 따른 주요 농축수산물(건조 표고버섯, 대두, 마늘 등) 종가·종량 선택세율 적용 및 WCO 2026 해설서 기반 품목분류 사전심사 기준 전국 세관 시행 안내.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065430",
        "full_content": """[2026년 9월 4일 관세율표 HSK 품목분류 및 농축수산물 양허세율 적용 지침]
【소관부처】 관세청 통관국 품목분류과 (공고 제2026-105호, 2026. 9. 4.)

관세청은 통관 심사의 정확성을 제고하고 수입신고 오류를 예방하기 위해, 2026년 9월 4일 개정 관세율표에 따른 농축수산물 종가·종량 선택세율 적용 기준 및 WCO 해설서 기반 품목분류 사전심사 지침을 전국 세관에 통보합니다.

■ 1. 중점 확인 품목군: 
 - 건조 표고버섯(제0712.34호): 기본세율 30% vs 추천외 양허세율 514% 또는 1,625원/kg 중 고액과세
 - 대두(제1201.90호): 기본세율 3% vs 추천내 3%(FTA 0%) vs 추천외 487% 또는 956원/kg 선택세
 - 마늘(제0703.20호), 참깨(제1207.40호), 들깨(제1207.99호) 등 민감 농산물
■ 2. 종가세 및 종량세 선택세 적용 품목의 과세가격 신고 적정성 사전 검증
■ 3. 시행일자: 2026년 9월 4일(금) 즉시 시행""",
        "attached_files": '[{"name": "20260904_품목분류_및_선택세율_적용지침_전문.pdf", "size": "215.4 KB"}, {"name": "농축수산물_세율적용_실무매뉴얼.pdf", "size": "340.0 KB"}]'
    },
    {
        "id": 2,
        "tag": "FTA 협정세율",
        "title": "[고시] 2026년 9월 4일 한-EU FTA 및 RCEP 원산지증명서(C/O) 간소화 기준 개정",
        "date": "2026-09-04",
        "agency": "관세청 자유무역협정집행기획관",
        "summary": "EU 27개 회원국 대상 6,000유로 초과 시 인증수출자(Approved Exporter) 전산 검증 연동 및 RCEP 연결원산지증명서(Back-to-Back C/O) 인정 범위 확대 고시.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065431",
        "full_content": """[한-EU FTA 및 RCEP 원산지증명서 간소화 기준 개정 고시]
【소관부처】 관세청 자유무역협정집행기획관 (관세청고시 제2026-88호)

EU 27개 회원국 및 RCEP 체결국과의 교역 활성화를 위하여 원산지증명서 발급 및 세관 검증 절차를 대폭 간소화합니다.

1. EU 수입신고서 상 인증수출자 번호 자동 유효성 검증 시스템 가동
2. RCEP 중계무역 시 제3국 연결원산지증명서(Back-to-Back C/O)의 전산 승인 절차 신설
3. 영세 중소기업 대상 FTA 사후적용(1년 이내) 경정청구 간이 환급 지원 체계 확대""",
        "attached_files": '[{"name": "20260904_한EU_RCEP_원산지증명_개정고시문.pdf", "size": "188.0 KB"}]'
    },
    {
        "id": 3,
        "tag": "통합공고 요건",
        "title": "[공고] 2026년 9월 4일 수입식품 및 식물검역 유니패스 실시간 자동 승인 연계 가동",
        "date": "2026-09-04",
        "agency": "식품의약품안전처 / 농림축산검역본부 / 관세청",
        "summary": "식품위생법 및 식물방역법 검역 합격증명서와 유니패스(UNIPASS) 수입신고서의 1:1 실시간 자동 대조 시스템 가동으로 통관 소요 시간 50% 단축.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065432",
        "full_content": """[수입식품 및 식물검역 유니패스 실시간 자동 승인 연계 가동]
【소관부처】 식품의약품안전처 / 농림축산검역본부 / 관세청 공동 공고

수입식품안전관리특별법 및 식물방역법에 따른 검역 검사 합격 통보가 관세청 유니패스 전자통관 시스템과 실시간 API로 직결됩니다.

- 세관장확인 요건 수기 승인 대기시간 완전 폐지 (적합 판정 즉시 세관 통관 전산 통과)
- 최초 수입 정밀검사 대상 품목의 검사 진행 상황 모바일 실시간 알림 서비스 개시""",
        "attached_files": '[{"name": "식약처_관세청_실시간_검역승인_연계_운영매뉴얼.pdf", "size": "420.5 KB"}]'
    },
    {
        "id": 4,
        "tag": "관세평가",
        "title": "2026년 9월 3일 관세평가 쟁점(다국적기업 이전가격 및 권리사용료 가산) 심사 사례집 배포",
        "date": "2026-09-03",
        "agency": "관세평가분류원 관세평가과",
        "summary": "특수관계자 간 이전가격 사전약정(APA) 및 특허권/상표권 로열티 가산율 산정 표준 가이드라인 전국 배포.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065425",
        "full_content": """[다국적기업 이전가격 및 권리사용료 가산 심사 사례집]
【소관부처】 관세평가분류원 관세평가과

다국적기업 본·지사 간 특수관계 거래 시 과세가격 결정(제1방법 배제 여부) 및 라이선스 계약에 따른 로열티 가산 판단 기준을 집대성한 2026년도 최신 판례집을 발간합니다.""",
        "attached_files": '[{"name": "2026_관세평가_이전가격_심사사례집.pdf", "size": "1.2 MB"}]'
    },
    {
        "id": 5,
        "tag": "특송 통관",
        "title": "해외직구 개인통관고유부호 도용 차단 2단계 모바일 인증 전면 시행",
        "date": "2026-09-02",
        "agency": "관세청 전자상거래통관과",
        "summary": "명의도용 불법 통관을 원천 차단하기 위한 개인통관고유부호-휴대폰 실시간 본인인증 연동 시스템 본격 가동.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065415",
        "full_content": """[개인통관고유부호 도용 차단 2단계 모바일 인증 전면 시행]
전자상거래 특송물품 수입신고 시 명의도용 피해를 방지하기 위해 관세청 국민비서 또는 카카오톡 기반 2단계 인증이 필수 적용됩니다.""",
        "attached_files": '[{"name": "해외직구_본인인증_개편안내문.pdf", "size": "150.2 KB"}]'
    },
    {
        "id": 6,
        "tag": "관세청 고시",
        "title": "[고시 제2026-82호] 2026년도 하반기 할당관세(0%) 적용 품목 및 수량 배정 지침",
        "date": "2026-09-01",
        "agency": "기획재정부 / 관세청 산업관세과",
        "summary": "물가 안정 및 원자재 공급망 안정을 위해 석유화학 원료(나프타, LPG), 사료용 곡물, 희소금속 등 76개 품목에 대한 하반기 할당관세 0% 적용 지침 고시.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065401",
        "full_content": """[2026년도 하반기 탄력관세(할당관세) 적용 지침]
소관: 기획재정부 산업관세과 / 관세청 통관물류국

1. 적용 대상: 나프타 제조용 원유(0%), LPG(0%), 옥수수(사료용 0%), 대두박(0%), 리튬·니켈 원자재(0%) 등 총 76개 품목
2. 적용 기간: 2026년 7월 1일 ~ 2026년 12월 31일 수입신고 수리분
3. 수입신고 시 할당관세 추천서(추천기관: 한국석유화학협회, 농림축산식품부 등) 전자 제출 필수""",
        "attached_files": '[{"name": "2026_하반기_할당관세_품목_및_세율표.pdf", "size": "450.0 KB"}]'
    },
    {
        "id": 7,
        "tag": "WCO 품목분류",
        "title": "WCO 제73차 품목분류위원회(HSC) 결정사항 국내 관세율표 해석 적용 지침",
        "date": "2026-08-30",
        "agency": "관세평가분류원 품목분류1과",
        "summary": "AI 가속기 반도체 모듈(제8473호 vs 제8542호) 및 스마트 웨어러블 헬스케어 기기(제8517호 vs 제9018호)에 대한 WCO 국제 표준 분류 결정 국내 세관 적용 통보.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065388",
        "full_content": """[WCO 제73차 품목분류위원회(HSC) 결정 국내 수용 지침]
WCO HSC에서 최종 확정된 첨단 신산업 물품의 HS Code 분류 기준을 국내 세관 사전심사 및 통관 심사에 즉시 적용합니다.""",
        "attached_files": '[{"name": "WCO_HSC_73차_분류결정서_국문번역본.pdf", "size": "620.0 KB"}]'
    },
    {
        "id": 8,
        "tag": "FTA 협정세율",
        "title": "한-칠레 FTA 발효 22주년 맞이 원산지 간이신고 및 직송요건 검증 완화 안내",
        "date": "2026-08-28",
        "agency": "관세청 FTA집행과",
        "summary": "한-칠레 FTA 협정 체결 품목 중 칠레산 와인, 리튬 원자재, 포도 등에 대한 직접운송 입증서류 간소화 규정 시행.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065375",
        "full_content": """[한-칠레 FTA 원산지 직송요건 검증 간소화]
칠레 발 한국행 화물이 미국 또는 중남미 항구를 경유할 경우, 선화증권(Through B/L) 제출 시 세관 통제 하 환적 입증을 자동 인정합니다.""",
        "attached_files": '[{"name": "한칠레_직접운송_간소화_지침.pdf", "size": "180.0 KB"}]'
    },
    {
        "id": 9,
        "tag": "세관 심사기법",
        "title": "2026년도 관세청 사후 세액심사(ACVA/기업심사) 중점 점검 5대 테마 공표",
        "date": "2026-08-25",
        "agency": "관세청 심사정책국 심사총괄과",
        "summary": "1) 다국적기업 로열티 가산 누락, 2) 품목분류 오류를 통한 저율 협정세율 부정적용, 3) 잠정가격 신고 후 확정가격 지연, 4) 농산물 TRQ 우회 수입, 5) 관세환급 과다청구.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065360",
        "full_content": """[2026년 하반기 세관 기업심사 중점 점검 테마]
기업심사 대상 업체는 사전 자율점검표를 활용하여 수입신고 적정성을 검토하시기 바랍니다.""",
        "attached_files": '[{"name": "2026_기업심사_자율점검표.pdf", "size": "310.0 KB"}]'
    },
    {
        "id": 10,
        "tag": "수출입 물류",
        "title": "부산항·인천항 수입 화물 컨테이너 검색기(X-Ray) AI 판독 시스템 전면 확대",
        "date": "2026-08-22",
        "agency": "관세청 정보데이터정책관",
        "summary": "우범 화물 선별 정확도 향상 및 성실 기업 신속 통관(Green Line) 확대를 위한 딥러닝 기반 AI X-Ray 판독 엔진 정식 가동.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065345",
        "full_content": """[AI 기반 컨테이너 X-Ray 판독 시스템 가동]
비정형 은닉 물품 판독률이 95% 이상으로 향상되어 정상 화물의 입항 후 통관 소요 시간이 3시간 이내로 단축됩니다.""",
        "attached_files": '[{"name": "스마트통관_AI_XRay_운영계획.pdf", "size": "512.0 KB"}]'
    },
    {
        "id": 11,
        "tag": "관세청 공고",
        "title": "2026년 제3차 품목분류(HS) 사전심사 결정 사례 120건 대국민 공개",
        "date": "2026-08-20",
        "agency": "관세평가분류원 품목분류과",
        "summary": "이차전지 음극재 코팅제(제3824호), 스마트 팩토리용 협동 로봇(제8479호), 융복합 기능성 화장품(제3304호) 등 주요 신제품 사전회시 사례 공개.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065330",
        "full_content": """[2026년 제3차 품목분류 사전심사 결정례 공개]
관세법령정보포털(CLIP) 및 CUSWAY 지식허브 DB에 120건의 최신 사전회시 사례가 실시간 동기화되었습니다.""",
        "attached_files": '[{"name": "2026_3차_품목분류_사전심사_결정사례집.pdf", "size": "2.4 MB"}]'
    },
    {
        "id": 12,
        "tag": "FTA 협정세율",
        "title": "한-인도네시아 CEPA 및 RCEP 활용 수출입 기업을 위한 원산지 검증 가이드 배포",
        "date": "2026-08-18",
        "agency": "관세청 원산지검증과",
        "summary": "인도네시아 세관의 원산지 사후검증 요청 증가에 따른 한국 수출입 기업의 품목별 원산지결정기준(PSR) 충족 증명 서류 관리 요령 안내.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065315",
        "full_content": """[한-인도네시아 CEPA 원산지 사후검증 대응 수칙]
부가가치기준(RVC) 및 세번변경기준(CTH) 충족을 증명하는 원자재 원산지확인서 보관 필수 (5년 보존).""",
        "attached_files": '[{"name": "인도네시아_CEPA_원산지검증_대응매뉴얼.pdf", "size": "480.0 KB"}]'
    },
    {
        "id": 13,
        "tag": "관세환급",
        "title": "수출용 원재료 관세환급(환특법) 간이정액환급률표 개정 고시",
        "date": "2026-08-15",
        "agency": "관세청 세원심사과",
        "summary": "중소 수출기업의 자금 유동성 지원을 위해 자동차 부품, 전기전자 모듈 등 150개 품목에 대한 간이정액 환급 단가 상향 조정.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065300",
        "full_content": """[2026년 간이정액환급률표 일부 개정]
수출금액 10,000원당 정액 환급액이 품목별 평균 12% 인상되어 서류 없는 간이 환급 혜택이 확대됩니다.""",
        "attached_files": '[{"name": "20260815_간이정액환급률표_개정본.pdf", "size": "390.0 KB"}]'
    },
    {
        "id": 14,
        "tag": "대외무역법",
        "title": "수입물품 원산지 표시위반(라벨 갈이) 특별 단속 기간 운영 결과 발표",
        "date": "2026-08-10",
        "agency": "관세청 조사총괄과",
        "summary": "외국산 의류, 공구, 농산물을 국산으로 둔갑시킨 원산지 표시 훼손·허위표시 45개 업체 적발 및 과징금 부과 처분.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065280",
        "full_content": """[원산지 표시위반 기획단속 결과 및 처벌 기준 강화]
원산지 미표시 및 허위표시 시 대외무역법 제33조에 의거 최대 3억원의 과징금 또는 형사고발 조치됩니다.""",
        "attached_files": '[{"name": "원산지표시_적정성_자가진단_체크리스트.pdf", "size": "210.0 KB"}]'
    },
    {
        "id": 15,
        "tag": "통합공고 요건",
        "title": "화학물질관리법 및 환경부 고시 수입 세관장확인 대상 화학물질 50종 추가 고시",
        "date": "2026-08-05",
        "agency": "환경부 / 관세청 통관기획과",
        "summary": "유독물질 및 제한물질 신규 지정에 따른 유니패스 수입요건확인 승인 번호 기재 의무화 안내.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065260",
        "full_content": """[화관법 세관장확인 대상 화학물질 확대 고시]
제28류, 29류, 38류 수입 화학제품 통관 시 화학물질 수입신고서 및 유독물질 수입허가증 첨부 필수.""",
        "attached_files": '[{"name": "2026_신규_세관장확인_화학물질_목록.pdf", "size": "320.0 KB"}]'
    },
    {
        "id": 16,
        "tag": "관세청 속보",
        "title": "관세청 UNIPASS 전자통관 차세대 클라우드 인프라 전환 및 24시간 무중단 체계 구축",
        "date": "2026-08-01",
        "agency": "관세청 정보관리관",
        "summary": "수출입 통관 신고 접수 및 자동 수리 처리 속도 3배 향상, 주말/야간 자동 수리율 99% 달성.",
        "link": "https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065240",
        "full_content": """[차세대 전자통관 유니패스 인프라 가동]
수입신고서 전송 후 수리 필증 교부까지 평균 소요시간이 15분 이내로 단축되었습니다.""",
        "attached_files": '[{"name": "차세대_유니패스_이용자_가이드.pdf", "size": "670.0 KB"}]'
    }
]'''

# 1. Update backend/main.py
with open("backend/main.py", "r", encoding="utf-8") as f:
    main_code = f.read()

# Replace get_customs_news in backend/main.py
backend_news_func = f'''{NEWS_ARRAY_CODE}

@app.get("/api/customs/news")
def get_customs_news(db: Session = Depends(get_db)):
    try:
        news_list = db.query(CustomsNews).order_by(CustomsNews.date.desc(), CustomsNews.id.desc()).all()
        if not news_list:
            for item in latest_today_news:
                db.add(CustomsNews(
                    id=item["id"],
                    tag=item["tag"],
                    title=item["title"],
                    date=item["date"],
                    agency=item["agency"],
                    summary=item["summary"],
                    link=item["link"],
                    full_content=item["full_content"],
                    attached_files=item["attached_files"]
                ))
            db.commit()
            news_list = db.query(CustomsNews).order_by(CustomsNews.date.desc(), CustomsNews.id.desc()).all()

        return [
            {{
                "id": item.id,
                "tag": item.tag,
                "title": item.title,
                "date": item.date,
                "agency": item.agency,
                "summary": item.summary,
                "link": item.link,
                "full_content": item.full_content,
                "attached_files": item.attached_files
            }}
            for item in news_list
        ]
    except Exception as e:
        print(f"[GET_NEWS_ERR] {{e}}")
        return latest_today_news'''

# Replace in backend/main.py between @app.get("/api/customs/news") and the next function
main_code_updated = re.sub(
    r'@app\.get\("/api/customs/news"\)[\s\S]*?return \[\s*\{\s*"id": item\.id[\s\S]*?for item in news_list\s*\]',
    backend_news_func,
    main_code
)
with open("backend/main.py", "w", encoding="utf-8") as f:
    f.write(main_code_updated)
print("Updated backend/main.py successfully.")

# 2. Update api/index.py
with open("api/index.py", "r", encoding="utf-8") as f:
    api_code = f.read()

api_news_func = f'''{NEWS_ARRAY_CODE}

@app.get("/api/customs/news")
def get_customs_news_api():
    try:
        from backend.db import SessionLocal
        from backend.models import CustomsNews
        db = SessionLocal()
        try:
            news_list = db.query(CustomsNews).order_by(CustomsNews.date.desc(), CustomsNews.id.desc()).all()
            if news_list:
                return [
                    {{
                        "id": item.id,
                        "tag": item.tag,
                        "title": item.title,
                        "date": item.date,
                        "agency": item.agency,
                        "summary": item.summary,
                        "link": item.link,
                        "full_content": item.full_content,
                        "attached_files": item.attached_files
                    }}
                    for item in news_list
                ]
        finally:
            db.close()
    except Exception as e:
        print(f"[VERCEL_NEWS_ERR] {{e}}")

    return latest_today_news'''

api_code_updated = re.sub(
    r'@app\.get\("/api/customs/news"\)[\s\S]*?return \[\s*\{\s*"id": 1,[\s\S]*?\}\s*\]',
    api_news_func,
    api_code
)
with open("api/index.py", "w", encoding="utf-8") as f:
    f.write(api_code_updated)
print("Updated api/index.py successfully.")
