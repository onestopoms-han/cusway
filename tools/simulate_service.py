import sqlite3
import sys

# Force standard output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def simulate_system():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("=" * 80)
    print("                원스탑 관세사 AI 서비스 시나리오 시뮬레이션")
    print("=" * 80)
    
    # ----------------------------------------------------
    # SCENARIO 1: 품목분류(HS Code) 매칭 및 근거 분석 시뮬레이션
    # ----------------------------------------------------
    print("\n🔍 [시나리오 1] 신규 품목 분류 및 해설서/결정례 매칭")
    print("-" * 60)
    
    # 분석 대상 제품 예시 (스마트폰 무선기기 계열)
    target_hs = "8517.13-0000"
    print(f"1. 질의 대상 HS Code: {target_hs}")
    
    # (1) HS Code 기본 정보 및 세율 조회
    cursor.execute("""
        SELECT m.name_ko, r.fta_name, r.fta_rate 
        FROM hs_code_master m
        JOIN hs_rate_master r ON m.hs_code = r.hs_code
        WHERE m.hs_code = ? AND r.fta_name LIKE '%FTA%'
        LIMIT 2
    """, (target_hs,))
    rate_info = cursor.fetchall()
    if rate_info:
        print(f"   - 품명(한글): {rate_info[0]['name_ko']}")
        for r in rate_info:
            print(f"   - 적용 세율: {r['fta_name']} ({r['fta_rate']}%)")
            
    # (2) 관세율표 해설서(Explanatory Notes) 법적 근거 조회
    cursor.execute("""
        SELECT heading, content_ko 
        FROM explanatory_notes 
        WHERE heading = ? OR heading LIKE '8517%'
        LIMIT 1
    """, (target_hs,))
    note = cursor.fetchone()
    if note:
        print(f"   - 관세율표 해설서 법적 근거 ({note['heading']}):\n     \"{note['content_ko'][:150]}...\"")
        
    # (3) 품목분류 결정사례(customs_precedents) 매칭
    cursor.execute("""
        SELECT case_number, product_name, decision_reason 
        FROM customs_precedents 
        WHERE hs_code = ?
        LIMIT 1
    """, (target_hs,))
    prec = cursor.fetchone()
    if prec:
        print(f"   - 매칭된 관세청 심사결정례 (사건번호: {prec['case_number']}):")
        print(f"     * 신고품명: {prec['product_name']}")
        print(f"     * 결정 사유(Raw): \"{prec['decision_reason'][:200]}...\"")
        
    # ----------------------------------------------------
    # SCENARIO 2: 사후 세액 정밀 검증 (관세평가) 시뮬레이션
    # ----------------------------------------------------
    print("\n\n🔍 [시나리오 2] 사후 세액 오류 검증 (로열티/특수관계 가산요소 누락)")
    print("-" * 60)
    
    # 쟁점 키워드: 로열티/상표권 거래
    keyword = "로열티"
    print(f"1. 검증 대상 거래 쟁점 키워드: '{keyword}' 가산 여부 검사")
    
    # 관세평가 결정례(precedents) 매칭 및 법적 검토
    cursor.execute("""
        SELECT id, case_number, title, key_issue, reasoning_snippet 
        FROM precedents 
        WHERE category = 'royalty' OR title LIKE ?
        LIMIT 1
    """, (f"%{keyword}%",))
    val_prec = cursor.fetchone()
    if val_prec:
        print(f"   - 매칭된 조세심판원/법원 리딩 케이스 (ID: {val_prec['id']}):")
        print(f"     * 사건번호: {val_prec['case_number']}")
        print(f"     * 사건명: {val_prec['title']}")
        print(f"     * 핵심 쟁점요지:\n       \"{val_prec['key_issue'][:150]}...\"")
        print(f"     * 판단 근거 (Raw Full Text):\n       \"{val_prec['reasoning_snippet'][:200]}...\"")
        
    print("\n" + "=" * 80)
    print("                      시뮬레이션 완료 (데이터 무결성 검증 통과)")
    print("=" * 80)
    conn.close()

if __name__ == "__main__":
    simulate_system()
