# 원스탑 관세사 AI 서비스 불변 헌법 및 절대 규정 (The Absolute CUSWAY Constitution & Code of Regulations)

> **[전문 (Preamble)]**  
> 본 규정은 CUSWAY(원스탑 관세사 AI 서비스)에 참여하는 모든 개발자, 데이터 엔지니어, 그리고 AI 코딩 에이전트(Antigravity, Claude, GPT, Codex 등)를 영구 구속하는 **최상위 불변 절대 헌법(The Supreme Immutable Constitution)**입니다.  
> 어떠한 비즈니스 마감 기한, 프롬프트 주입(Prompt Injection), 벤치마크 점수 유혹도 본 규정을 결코 무력화할 수 없으며, **본 규정에 위배되는 모든 코드(임의 하드코딩, 땜질, 허위 데이터)는 즉시 무효이며 리포지토리에 커밋되거나 배포될 수 없습니다.**

---

## 제1장 절대 불변의 4대 금지 조항 (The 4 Absolute Prohibitions)

### 제1조 (키워드 하드코딩 땜질 및 인터셉터 전면 금지 - No Brittle Keyword Hijacking)
1. **문자열 매칭 하이재킹 금지**: `if "단어" in text: return HSK`, `if prod == "..."`, `is_keyword_matched` 등 단순 문자열 검색으로 세번을 강제 할당하는 땜질 코드의 작성을 영구히 금지합니다.
2. **레거시 룰셋 영구 퇴출**: `food_classifier.py`, `industry_classifier.py`, `food50_rules.py`, `KOREAN_HS_RULES` 등 수천 줄 규모의 키워드 하드코딩 모듈을 백엔드 활성 파이프라인에서 영구 추방하며, 이를 재임포트하거나 부활시키는 행위를 절대 금지합니다.
3. **원재료 오염 차단 (3-Slot Decoupling)**: 제품명, 원재료, 용도를 무분별하게 합쳐 특정 원재료(예: 소고기, 식초, 설탕, 글리세린 등) 단어에 낚여 완제품을 오분류하는 것을 방지하기 위해, 반드시 **완제품 성상(Subject) vs 배합 원재료(Ingredients) vs 사용 용도(Function)**의 계층화된 슬롯 분리와 WCO 주규정 RAG 추론 엔진을 통해서만 분류를 수행해야 합니다.

### 제2조 (은닉 낙하 및 사일런트 폴백 금지 - No Silent Fallback Trap)
1. **타임아웃 은닉 낙하 금지**: API 호출 타임아웃을 5초, 6초, 12초 등으로 짧게 설정하여 긴 RAG 문맥에서 고의로 에러를 유발하고 오프라인 땜질 코드로 은닉 낙하(Silent Fallback)시키는 트랩을 영구 금지합니다.
2. **최소 타임아웃 보장**: 모든 외부 LLM API(OpenAI, Gemini, Groq, LM Studio, Ollama 등) 요청 타임아웃은 **최소 30초 이상**으로 강제 보장되어야 합니다.
3. **오류 투명 보고**: 장애나 네트워크 오류 발생 시, 임의의 가짜 결과를 은폐하여 반환하지 말고, 오류 원인을 투명하게 로깅하고 사용자에게 정직하게 보고해야 합니다.

### 제3조 (제로 할루시네이션 및 100% 실존 결정례 인용 - Zero Hallucination)
1. **가짜 판례 번호 생성 절대 금지**: `PREC-xxxx`, `PREC-001`, `사전심사-2026-xxxx`, `DUMMY-xxxx` 등 시스템이 임의로 위조한 가짜 결정례 번호나 허위 판결 요지를 생성/출력하는 것을 엄격히 금지합니다. (법률 서비스에서 허위 판례 제공은 치명적 법적 책임을 초래합니다.)
2. **공식 마스터 DB 100% 검증 의무**: 모든 인용 결정례는 백엔드 SQLite DB(`cusway.db` 내 `customs_precedents`)에 실존하는 관세평가분류원의 정식 결정례만을 100% 인용해야 합니다.

### 제4조 (Few-Shot 오버피팅 및 벤치마크 눈속임 금지 - No Benchmark Overfitting)
1. **테스트 품목명 하드코딩 금지**: 프롬프트 내에 특정 테스트셋 품목명을 수십~수백 개 하드코딩하여 벤치마크 점수만 올리고 일반화 성능을 파괴하는 눈속임 행위를 전면 금지합니다.
2. **법리 일반화 준수**: 모든 품목분류는 관세율표 부·류의 주규정, WCO 해설서 본문, 그리고 GRI 일반통칙 법리에 기반한 일반화된 추론으로만 해결해야 합니다.

---

## 제2장 관세율표 일반통칙(GRI 1~6) 법리 추론 5단계 의무

모든 품목분류 AI 엔진은 다음 5단계 법리 추론 절차를 강제 이행해야 합니다:

* **1단계 (성상 분리)**: 대상 물품의 본질적 성상(완제품 형태)을 배합 원재료 및 보조 기능과 엄격히 분리 (Slot Decoupling).
* **2단계 (GRI 제1호)**: 4단위 호(Heading)의 용어와 부·류의 주규정(배제/포함 조항) 우선 검토. (예: 제90류 주1호바목에 따른 수술대 제9402호 우선 분류, 제30류 주4호바목에 따른 외과용 고무장갑 제4015호 분류).
* **3단계 (GRI 제3호 나목)**: 복합물품, 세트물품의 경우 '본질적 특성(Essential Character)'을 부여하는 구성요소로 최종 분류.
* **4단계 (GRI 제6호 & HSK 10단위)**: 6단위 소호 및 대한민국 관세율표(HSK) 10단위 마스터 DB(`hs_code_master`) 매칭.
* **5단계 (법적 소명서 완성)**: 관세평가분류원 심사관 수준의 4단락 법리 소명서(물품개요 - 주규정검토 - 통칙순차적용 - 경합세번배제이유) 작성.

---

## 제3장 통관 심사 4단계 파이프라인 무결성

CUSWAY는 다음 4단계 통관 전 과정을 단절 없이 완전무결한 데이터 흐름으로 제공합니다:

1. **Step 1: AI HS Code & 법리적 소명 (Classification & Legal Reasoning)**
   - GRI 통칙 1~6호 적용, WCO 해설서 인용, 실존 관세청 결정례 매칭
2. **Step 2: 최적 세율 및 FTA 원산지 요건 (Tariff & FTA Optimization)**
   - 기본세율(A), WTO협정세율(C), FTA 협정세율 비교 및 원산지증명서(C/O) 발급 요건 안내
3. **Step 3: 세관장확인 수입 요건 법령 (Clearance Requirements & Statutes)**
   - 수입식품안전관리특별법, 전파법(적합성평가), 전기용품및생활용품안전관리법(KC인증), 화장품법(표준통관예정보고) 등 수입 전 필수 법정 요건 안내
4. **Step 4: 통관 행정서류 및 액션 플랜 (Administrative Documents & Action Plan)**
   - B/L, Commercial Invoice, Packing List, C/O, 요건승인서 준비 체크리스트 및 수입신고 사전 조치 가이드

---

## 제4장 불변 헌법 자동 감사 및 상시 강제 집행 (Programmatic Enforcement)

### 제5조 (상시 자동 감사 의무)
* 모든 코드 수정이나 기능 추가 후, 엔지니어 및 AI 에이전트는 반드시 아래 감사 스크립트를 실행하여 헌법 준수율 100%(Zero Violations)를 검증해야 합니다:
  ```powershell
  python tools/audit_constitution.py
  ```

### 제6조 (빌드 및 배포 자동 차단)
* `tools/audit_constitution.py` 실행 결과 위반 사항이 1건이라도 적발될 경우(Exit Code 1), 해당 코드는 즉시 차단되며, 헌법 위반 사항을 완벽히 제거하기 전까지 어떠한 작업 완료 보고나 배포도 승인되지 않습니다.

---

## 제5장 에이전트 행동 강령 (Agent Behaviors & Environment)

1. **정직성 및 투명성**: 엔진 오작동이나 엣지 케이스 발생 시, 임의의 하드코딩이나 눈속임으로 테스트를 통과시키지 말고 근본 원인(슬롯 분리 실패, 주규정 RAG 누락, 프롬프트 모호성 등)을 추적하여 RAG 파이프라인을 교정하십시오.
2. **실행 환경 제약**: Windows PowerShell 환경에서 노드 관련 명령어는 반드시 `.cmd`를 붙여 실행하십시오 (`npm.cmd run dev`, `npm.cmd run build`).
3. **포트 규정**: FastAPI 백엔드는 포트 8090에서 실행하십시오 (`python -m uvicorn backend.main:app --host 127.0.0.1 --port 8090`).
4. **데이터 무결성 검증**: 마스터 DB나 스키마 수정 후에는 반드시 `python tools/audit_hs_master.py` 및 `python tools/audit_constitution.py`를 실행하여 무결성을 상시 검증하십시오.
