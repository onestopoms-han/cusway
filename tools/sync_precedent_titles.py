import sqlite3
import sys

# Set encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def sync_titles():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. VAL-TAX: If key_issue is present and clean, copy to title
    cursor.execute("""
        UPDATE precedents 
        SET title = key_issue 
        WHERE (title LIKE '%%' OR title IS NULL OR title = '') 
          AND key_issue IS NOT NULL 
          AND key_issue != '' 
          AND key_issue NOT LIKE '%%'
    """)
    print(f"Updated {cursor.rowcount} broken titles in precedents from clean key_issue.")
    
    # 2. Synchronize categories for better UX filtering
    cursor.execute("""
        UPDATE precedents 
        SET category = 'royalty', category_ko = '권리사용료 (로열티)'
        WHERE (title LIKE '%로열티%' OR title LIKE '%권리사용%' OR key_issue LIKE '%로열티%' OR key_issue LIKE '%권리사용%')
    """)
    
    cursor.execute("""
        UPDATE precedents 
        SET category = 'transfer_price', category_ko = '이전가격 (특수관계)'
        WHERE (title LIKE '%이전가격%' OR title LIKE '%특수관계%' OR key_issue LIKE '%이전가격%' OR key_issue LIKE '%특수관계%')
    """)
    
    cursor.execute("""
        UPDATE precedents 
        SET category = 'classification', category_ko = '품목분류 (HS Code)'
        WHERE (title LIKE '%HS%' OR title LIKE '%품목분류%' OR key_issue LIKE '%HS%' OR key_issue LIKE '%품목분류%')
    """)
    
    cursor.execute("""
        UPDATE precedents 
        SET category = 'exemption', category_ko = '관세 감면 및 환급'
        WHERE (title LIKE '%감면%' OR title LIKE '%환급%' OR key_issue LIKE '%감면%' OR key_issue LIKE '%환급%')
    """)

    conn.commit()
    conn.close()
    print("Precedents titles and category mappings synchronized successfully!")

if __name__ == "__main__":
    sync_titles()
