import os
import sqlite3

def check_database():
    db_paths = ["cusway.db", "backend/cusway.db", "../cusway.db"]
    conn = None
    active_path = None
    
    for path in db_paths:
        if os.path.exists(path):
            try:
                conn = sqlite3.connect(path)
                # Test table existence
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='explanatory_notes';")
                if cursor.fetchone():
                    active_path = path
                    break
                conn.close()
            except Exception:
                pass
                
    if not conn or not active_path:
        print("[-] 데이터베이스 파일(cusway.db) 또는 'explanatory_notes' 테이블을 찾을 수 없습니다.")
        print("    현재 디렉토리 경로:", os.getcwd())
        return

    print(f"[+] 활성화된 DB 경로: {active_path}")
    cursor = conn.cursor()
    
    # Get all distinct chapter values
    try:
        cursor.execute("SELECT DISTINCT heading FROM explanatory_notes;")
        headings = [r[0] for r in cursor.fetchall()]
        chapters = sorted(list(set([h.split('.')[0] for h in headings if '.' in h])))
        
        print(f"[+] 총 적재된 '호(Heading)' 개수: {len(headings)}개")
        print(f"[+] 데이터베이스에 적재된 '류(Chapter)' 목록:")
        print(f"    {', '.join(chapters)}")
        
        # Check specifically for Chapter 96 (만년필)
        has_96 = any(h.startswith("96.") for h in headings)
        if has_96:
            print("[✓] 96류(만년필 포함)가 DB에 정상 적재되어 있습니다.")
        else:
            print("[X] ⚠️ 96류가 DB에 존재하지 않습니다! (seeding이 누락되었거나 데이터가 불완전합니다.)")
            
    except Exception as e:
        print(f"[-] 데이터 조회 중 오류 발생: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_database()
