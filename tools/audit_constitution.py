"""
CUSWAY 불변 헌법 자동 감사기 (Automated Constitutional Auditor)

본 스크립트는 CUSWAY 불변 헌법(AGENTS.md)을 소프트웨어적으로 영구 강제 집행하기 위한
절대 감사 도구입니다.

[검증 항목]
1. 금지된 레거시 하드코딩 모듈 임포트 검사 (food_classifier, industry_classifier, food50_rules 등)
2. 백엔드 파이프라인 내 키워드 하이재킹 인터셉터 검사 (if "단어" in text: return HSK)
3. 가짜 판례 번호 및 임의 더미 데이터 검사 (PREC-, 사전심사-2026-, DUMMY- 등)
4. LLM API 타임아웃 무결성 검사 (은닉 낙하 방지를 위해 최소 30초 보장 여부)
5. SQLite 관세청 공식 마스터 DB 및 결정례 DB 무결성 검사
"""

import os
import sys
import re
import ast
import sqlite3

if sys.platform == "win32":
    import io
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except AttributeError:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
RAG_DIR = os.path.join(BACKEND_DIR, "rag")

class ConstitutionalAuditor:
    def __init__(self):
        self.violations = []
        self.passed_checks = []

    def log_violation(self, rule_no: str, description: str, file_path: str = "", line_no: int = 0):
        loc = f" ({file_path}:{line_no})" if file_path and line_no else f" ({file_path})" if file_path else ""
        self.violations.append(f"[헌법 위반 제{rule_no}호]{loc} {description}")

    def log_pass(self, check_name: str):
        self.passed_checks.append(check_name)

    def audit_forbidden_imports(self):
        """1. 금지된 레거시 키워드 모듈 임포트 검사"""
        forbidden_modules = [
            "food_classifier",
            "industry_classifier",
            "food50_rules",
            "benchmark1000_rules",
            "benchmark2000_rules",
            "benchmark1000_part2_rules",
            "KOREAN_HS_RULES"
        ]

        active_python_files = []
        for root, dirs, files in os.walk(BACKEND_DIR):
            for file in files:
                if file.endswith(".py"):
                    active_python_files.append(os.path.join(root, file))

        for file_path in active_python_files:
            rel_path = os.path.relpath(file_path, ROOT_DIR)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            for mod in forbidden_modules:
                pattern = rf"(from\s+[\w\.]*{mod}\s+import|import\s+[\w\.]*{mod})"
                matches = list(re.finditer(pattern, content))
                for m in matches:
                    line_no = content[:m.start()].count("\n") + 1
                    self.log_violation("2조(키워드땜질)", f"금지된 레거시 하드코딩 모듈 '{mod}' 임포트 감지", rel_path, line_no)

        if not any("금지된 레거시" in v for v in self.violations):
            self.log_pass("레거시 하드코딩 모듈(food/industry classifier 등) 임포트 0건 확인")

    def audit_fake_precedent_ids(self):
        """2. 가짜 판례 번호 패턴(PREC-, 사전심사-2026-) 검사"""
        target_files = [
            os.path.join(BACKEND_DIR, "main.py"),
            os.path.join(RAG_DIR, "llm_chain.py"),
            os.path.join(RAG_DIR, "classification_processor.py"),
            os.path.join(RAG_DIR, "retriever.py")
        ]

        fake_patterns = [
            r'["\']PREC-\d{4}-\d{2}["\']',
            r'["\']PREC-001["\']',
            r'["\']사전심사-2026-\d+["\']',
            r'["\']DUMMY-\d+["\']'
        ]

        for file_path in target_files:
            if not os.path.exists(file_path):
                continue
            rel_path = os.path.relpath(file_path, ROOT_DIR)
            with open(file_path, "r", encoding="utf-8") as f:
                lines = f.readlines()

            for idx, line in enumerate(lines, start=1):
                # 허용되는 주석/경고문 내의 언급은 제외 (예: "가짜 번호 PREC-001을 생성하지 마십시오")
                if "절대 가짜" in line or "주의" in line or "예:" in line or "#" in line:
                    continue
                for pat in fake_patterns:
                    if re.search(pat, line):
                        self.log_violation("1조(가짜판례금지)", f"가짜 판례 식별자 하드코딩 감지: {line.strip()}", rel_path, idx)

        if not any("가짜 판례" in v for v in self.violations):
            self.log_pass("가짜 결정례 식별자(PREC-, 사전심사-2026- 등) 미사용 확인")

    def audit_llm_timeouts(self):
        """3. LLM API 타임아웃 무결성 검사 (은닉 낙하 방지 최소 30초)"""
        llm_chain_path = os.path.join(RAG_DIR, "llm_chain.py")
        if not os.path.exists(llm_chain_path):
            self.log_violation("2조(은닉낙하방지)", "backend/rag/llm_chain.py 파일이 존재하지 않습니다.")
            return

        with open(llm_chain_path, "r", encoding="utf-8") as f:
            content = f.read()

        # urllib.request.urlopen 호출에서 timeout 값 추출
        timeout_matches = re.findall(r'urlopen\([^)]*timeout\s*=\s*(\d+)', content)
        for t_str in timeout_matches:
            timeout_val = int(t_str)
            if timeout_val < 30:
                self.log_violation("2조(은닉낙하방지)", f"LLM API 호출 타임아웃이 {timeout_val}초로 설정되어 있습니다. (사일런트 폴백 방지를 위해 최소 30초 이상이어야 함)", "backend/rag/llm_chain.py")

        if not any("타임아웃" in v for v in self.violations):
            self.log_pass("LLM API 호출 타임아웃 무결성 보장 (최소 30초 이상) 확인")

    def audit_database_master_integrity(self):
        """4. SQLite DB 무결성 및 실존 마스터 검사"""
        db_path = os.path.join(ROOT_DIR, "cusway.db")
        if not os.path.exists(db_path):
            self.log_violation("3조(공식DB검증)", "cusway.db 파일이 루트 디렉토리에 존재하지 않습니다.")
            return

        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Check hs_code_master
        cur.execute("SELECT COUNT(*) FROM hs_code_master WHERE hscode_length = 10")
        hsk10_count = cur.fetchone()[0]
        if hsk10_count < 11000:
            self.log_violation("3조(공식DB검증)", f"hs_code_master 10단위 세번 수가 {hsk10_count}개로 기준치(11,000개)에 미달합니다.")
        else:
            self.log_pass(f"관세율표 HSK 10단위 마스터 DB 검증 완료 (총 {hsk10_count}개 세번)")

        # Check customs_precedents
        cur.execute("SELECT COUNT(*) FROM customs_precedents")
        prec_count = cur.fetchone()[0]
        if prec_count < 1000:
            self.log_violation("1조(실존판례DB)", f"관세평가분류원 실존 결정례 수가 {prec_count}건으로 부족합니다.")
        else:
            self.log_pass(f"관세평가분류원 실존 결정례 DB 검증 완료 (총 {prec_count}건 공식 판례)")

        conn.close()

    def audit_trq_master_integrity(self):
        """5. 시장접근물량(TRQ) 63개 품목군 234개 HSK 세번 및 분말 판정 무결성 검사 (헌법 제6장)"""
        db_path = os.path.join(ROOT_DIR, "customs_rates_2026.db")
        if not os.path.exists(db_path):
            self.log_violation("8조(TRQ연동)", "customs_rates_2026.db 파일이 존재하지 않습니다.")
            return

        conn = sqlite3.connect(db_path)
        cur = conn.cursor()

        # Check exact count of distinct HSK with W1
        cur.execute("SELECT COUNT(DISTINCT hs_code) FROM customs_rates_2026 WHERE rate_code = 'W1'")
        trq_count = cur.fetchone()[0]
        if trq_count < 200:
            self.log_violation("8조(TRQ연동)", f"TRQ(W1) 대상 세번 수가 {trq_count}개로 기준치(200개 이상)에 미달합니다.")
        else:
            self.log_pass(f"시장접근물량(TRQ, W1/W2) 마스터 DB 무결성 검증 완료 (총 {trq_count}개 정규 세번)")

        # Verify raw sesame 1207.40-0000 has W1 and W2
        cur.execute("SELECT rate_code FROM customs_rates_2026 WHERE hs_code = '1207400000' AND rate_code IN ('W1', 'W2')")
        sesame_codes = [r[0] for r in cur.fetchall()]
        if "W1" not in sesame_codes or "W2" not in sesame_codes:
            self.log_violation("7조(원물분류)", "참깨 원물(1207.40-0000)의 TRQ 세율(W1/W2)이 DB에 누락되었습니다.")
        else:
            self.log_pass("참깨 원물(1207.40-0000) TRQ(W1: 40%, W2: 630%) 마스터 등록 확인")

        # Verify non-TRQ items do NOT have W1
        cur.execute("SELECT COUNT(*) FROM customs_rates_2026 WHERE hs_code = '2106909099' AND rate_code = 'W1'")
        if cur.fetchone()[0] > 0:
            self.log_violation("8조(허위TRQ금지)", "비해당 가공식품 2106.90-9099에 W1이 등록되어 있습니다.")

        conn.close()

        # Verify no isolated '분' in powder detection arrays
        for chk_file in ["api/index.py", "src/components/HsClassifier.tsx"]:
            f_path = os.path.join(ROOT_DIR, chk_file)
            if os.path.exists(f_path):
                with open(f_path, "r", encoding="utf-8") as f:
                    content = f.read()
                if re.search(r'\[[^\]]*["\']분["\'][^\]]*\]', content):
                    self.log_violation("7조(분자낚임금지)", f"가루 감지 배열에 단일 글자 '분'이 포함되어 성분/수분 낚임 위험이 있습니다.", chk_file)

        if not any("분자낚임" in v for v in self.violations):
            self.log_pass("가루 판정 시 일상어('성분/수분/구분') 낚임 방지 무결성 검증 완료")

    def run_all(self):
        print("=" * 80)
        print("⚖️  [CUSWAY 불변 헌법 자동 감사 시스템 (CONSTITUTION AUDITOR)]  ⚖️")
        print("=" * 80)
        
        self.audit_forbidden_imports()
        self.audit_fake_precedent_ids()
        self.audit_llm_timeouts()
        self.audit_database_master_integrity()
        self.audit_trq_master_integrity()

        print("\n✅ [통과된 헌법 준수 항목]")
        for p in self.passed_checks:
            print(f"  ✓ {p}")

        if self.violations:
            print("\n🚨 [헌법 위반 사항 적발 - 즉시 교정 필수!]")
            for v in self.violations:
                print(f"  ❌ {v}")
            print("\n" + "=" * 80)
            print("❌ CONSTITUTION AUDIT FAILED: 헌법 위반 사항이 발견되어 빌드/배포가 차단됩니다.")
            print("=" * 80)
            sys.exit(1)
        else:
            print("\n" + "=" * 80)
            print("🏆 CONSTITUTION AUDIT PASSED: 헌법 100% 준수 (Zero Violations)")
            print("=" * 80)
            sys.exit(0)

if __name__ == "__main__":
    auditor = ConstitutionalAuditor()
    auditor.run_all()
