import sqlite3
import os

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

if os.path.exists(DB_PATH):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # hs_rate_master와 hs_requirements의 모든 레코드 제거 (새로 깨끗하게 수집하기 위함)
        print("Clearing tables...")
        cursor.execute("DELETE FROM hs_rate_master")
        print("Cleared hs_rate_master. Remaining rows:", cursor.execute("SELECT COUNT(*) FROM hs_rate_master").fetchone()[0])
        
        cursor.execute("DELETE FROM hs_requirements")
        print("Cleared hs_requirements. Remaining rows:", cursor.execute("SELECT COUNT(*) FROM hs_requirements").fetchone()[0])
        
        conn.commit()
        conn.close()
        print("DB table cleanup completed.")
    except Exception as e:
        print("Error clearing tables:", e)
else:
    print("Database not found.")
