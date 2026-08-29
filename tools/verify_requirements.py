import sqlite3
import os

db_path = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def verify_db():
    if not os.path.exists(db_path):
        print("DB not found.")
        return
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. hs_requirements 전체 통계
    cursor.execute("SELECT count(*) FROM hs_requirements")
    total_reqs = cursor.fetchone()[0]
    print(f"Total requirements records: {total_reqs}")
    
    # 2. 고유 법령명(law_name)과 건수 분포
    cursor.execute("SELECT law_name, count(*) FROM hs_requirements GROUP BY law_name ORDER BY count(*) DESC")
    laws = cursor.fetchall()
    print("\n--- Law Name Distribution ---")
    for law, count in laws:
        print(f" - {law}: {count} rows")
        
    # 3. 세관장확인 vs 통합공고 분포
    cursor.execute("SELECT check_type, count(*) FROM hs_requirements GROUP BY check_type")
    types = cursor.fetchall()
    print("\n--- Check Type Distribution ---")
    for c_type, count in types:
        print(f" - {c_type}: {count} rows")
        
    # 4. 꼬인 텍스트가 있거나 description이 비어 있는 레코드 검사
    cursor.execute("SELECT count(*) FROM hs_requirements WHERE description IS NULL OR length(description) < 5")
    empty_desc_count = cursor.fetchone()[0]
    print(f"\nRequirements with empty/short description: {empty_desc_count}")
    
    # 5. 샘플 레코드 5개 출력
    cursor.execute("SELECT hs_code, law_name, agency_name, check_type, SUBSTR(description, 1, 80) FROM hs_requirements LIMIT 5")
    samples = cursor.fetchall()
    print("\n--- Sample Requirements Data ---")
    for s in samples:
        print(s)
        
    conn.close()

if __name__ == "__main__":
    verify_db()
