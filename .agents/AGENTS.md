# 원스탑 관세사 AI 서비스 개발 지침 (CUSWAY Absolute Constitution & Architecture)

이 문서는 CUSWAY(원스탑 관세사 AI 서비스)에 참여하는 모든 AI 에이전트와 엔지니어가 반드시 영구적으로 준수해야 하는 **최상위 불변 헌법(Constitution)**입니다. 어떠한 경우에도 임의의 하드코딩이나 임시 땜질을 금지하며, 아래의 원칙에 따라 시스템을 구축하고 유지해야 합니다.

---

## 1. 절대 불변의 3대 핵심 헌법

### ① 제로 할루시네이션 원칙 (Zero-Hallucination & 100% Real Precedents DB)
* **가짜 판례/번호 생성 절대 금지**: `사전심사-2026-xxxx`, `PREC-xxxx` 등 AI가 임의로 생성한 가짜 결정례 번호나 허위 판결 요지를 출력하는 것은 엄격히 금지됩니다. (법률 서비스에서 허위 정보는 치명적인 법적 책임을 초래합니다.)
* **공식 DB 검증 의무**: 모든 결정례는 백엔드 SQLite DB(`customs_precedents`, `precedents`)에 실존하는 관세평가분류원의 정식 결정례만을 100% 인용해야 합니다.

### ② 키워드 하드코딩 땜질 전면 금지 (No Brittle Keyword Hijacking)
* **문자열 병합 오염 금지**: 제품명, 원재료, 용도를 `combined = name + material + function`으로 무분별하게 합쳐서 특정 성분 단어(예: 글리세린, 히알루론산, 모터 등) 하나에 낚여 전체 품목을 오분류하는 규칙 작성을 영구히 금지합니다.
* **하드코딩 인터셉터 배제**: 수천 줄의 `if "단어" in text: return HSK` 식의 땜질 코드를 지양하고, **완제품 성상(Subject) vs 배합 원재료(Ingredients) vs 사용 용도(Function)**의 계층화된 슬롯 분리와 WCO 주규정 RAG 추론 엔진을 통해 일반화된 분류를 수행해야 합니다.

### ③ 관세율표 일반통칙(GRI 1~6) 법리 추론 체계 영구 고정
* **1단계 (성상 분리)**: 대상 물품의 본질적 성상(완제품 형태)을 원재료 및 부원료와 엄격히 분리.
* **2단계 (GRI 제1호)**: 4단위 호(Heading)의 용어와 부·류의 주규정(배제/포함 조항) 우선 검토. (예: 제29류 주1호 단일화합물 요건 미충족 시 화학품 배제).
* **3단계 (GRI 제3호 나목)**: 복합물품, 세트물품의 경우 '본질적 특성(Essential Character)'을 부여하는 구성요소로 최종 분류.
* **4단계 (GRI 제6호 & HSK 10단위)**: 6단위 소호 및 대한민국 관세율표(HSK) 10단위 마스터 DB(`hs_code_master`) 매칭.
* **5단계 (법적 소명서 완성)**: 관세평가분류원 심사관 수준의 4단락 법리 소명서(물품개요 - 주규정검토 - 통칙순차적용 - 경합세번배제이유) 작성.

---

## 2. 통관 심사 4단계 파이프라인 무결성

CUSWAY는 다음 4단계 통관 전 과정을 완전무결한 데이터 흐름으로 제공합니다:

1. **Step 1: AI HS Code & 법리적 소명 (Classification & Legal Reasoning)**
   - GRI 통칙 1~6호 적용, WCO 해설서 인용, 실존 관세청 결정례 매칭
2. **Step 2: 최적 세율 및 FTA 원산지 요건 (Tariff & FTA Optimization)**
   - 기본세율(A), WTO협정세율(C), FTA 협정세율 비교 및 원산지증명서(C/O) 발급 요건 안내
3. **Step 3: 세관장확인 수입 요건 법령 (Clearance Requirements & Statutes)**
   - 수입식품안전관리특별법, 전파법(적합성평가), 전기용품및생활용품안전관리법(KC인증), 화장품법(표준통관예정보고) 등 수입 전 필수 법정 요건 안내
4. **Step 4: 통관 행정서류 및 액션 플랜 (Administrative Documents & Action Plan)**
   - B/L, Commercial Invoice, Packing List, C/O, 요건승인서 준비 체크리스트 및 수입신고 사전 조치 가이드

---

## 3. 에이전트 행동 지침 (Agent Behaviors)
* **정직성 및 투명성**: 엔진의 오작동이나 엣지 케이스 발생 시, 결과를 조작하거나 하드코딩으로 눈속임하지 말고 근본 원인(슬롯 분리 실패, 주규정 검색 누락 등)을 추적하여 RAG 파이프라인을 교정하십시오.
* **실행 환경 제약**: Windows PowerShell 환경에서 노드 관련 명령어는 반드시 `.cmd`를 붙여 실행 (`npm.cmd run dev`, `npm.cmd run build`).
* **포트 규정**: FastAPI 백엔드는 포트 8090에서 실행 (`python -m uvicorn backend.main:app --host 127.0.0.1 --port 8090`).
* **데이터 무결성 검증**: 마스터 DB나 스키마 수정 후에는 반드시 `python tools/audit_hs_master.py`를 실행하여 10단위 무결성을 검증하십시오.
