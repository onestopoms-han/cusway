import sqlite3
import sys

# Force standard output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def deduplicate_and_clean():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("--- [1] 중복 및 미파싱 데이터 분석 시작 ---")
    
    # 0. 중복 여부와 무관하게 '파싱할 수 없습니다'가 포함된 레코드를 일괄적으로 영구 삭제합니다.
    cursor.execute("""
        DELETE FROM customs_precedents 
        WHERE decision_reason LIKE '%상세 분류이유 내용을 파싱할 수 없습니다%'
    """)
    deleted_failed_direct = cursor.rowcount
    conn.commit()
    print(f"-> '파싱 실패' 쓰레기 데이터 일괄 삭제 완료: {deleted_failed_direct}건")
    
    # 1. 동일한 case_number를 가지고 있는 중복 레코드 정리
    cursor.execute("""
        SELECT case_number, COUNT(*) 
        FROM customs_precedents 
        GROUP BY case_number 
        HAVING COUNT(*) > 1
    """)
    duplicated_cases = cursor.fetchall()
    print(f"중복된 case_number 건수: {len(duplicated_cases)}")
    
    deleted_dup_count = 0
    
    for case_number, count in duplicated_cases:
        if not case_number:
            continue
            
        cursor.execute("""
            SELECT id 
            FROM customs_precedents 
            WHERE case_number = ?
            ORDER BY id ASC
        """, (case_number,))
        records = cursor.fetchall()
        
        # 가장 최근 것(큰 id) 하나만 남기고 나머지 중복 삭제
        normal_ids = [r[0] for r in records]
        if len(normal_ids) > 1:
            for nid in normal_ids[:-1]:
                cursor.execute("DELETE FROM customs_precedents WHERE id = ?", (nid,))
                deleted_dup_count += 1
                
    conn.commit()
    print(f"-> 동일한 중복 데이터 중 오래된 복사본 {deleted_dup_count}건을 정리 완료했습니다.")
    
    # 2. 여전히 데이터베이스에 남아있는 '파싱할 수 없습니다' 단독 레코드의 수 확인
    cursor.execute("""
        SELECT COUNT(*) FROM customs_precedents 
        WHERE decision_reason LIKE '%상세 분류이유 내용을 파싱할 수 없습니다%'
    """)
    remaining_failed = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM customs_precedents")
    total_records = cursor.fetchone()[0]
    
    print(f"\n--- [2] 최종 데이터베이스 상태 요약 ---")
    print(f"정리 후 총 레코드 수: {total_records}건")
    print(f"남아있는 파싱 실패 레코드 수: {remaining_failed}건 (재크롤링 타겟)")
    print("---------------------------------------")
    
    conn.close()

if __name__ == "__main__":
    deduplicate_and_clean()
