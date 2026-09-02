import sqlite3
import re
import sys

# Set encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def clean_and_sync_all_titles():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Query all records with full reasoning text
    cursor.execute("""
        SELECT id, case_number, title, key_issue, reasoning_snippet 
        FROM precedents 
        WHERE reasoning_snippet IS NOT NULL AND length(reasoning_snippet) > 100
    """)
    records = cursor.fetchall()
    
    print(f"Refining titles & key issues for {len(records)} full-text precedents...")
    
    updated_count = 0
    
    for rid, case_no, current_title, current_issue, reasoning in records:
        extracted_issue = None
        
        # 1. Try pattern: [제 목] ... [결정요지]
        m_title = re.search(r'\[제\s*목\]\s*\n+(.*?)(?=\n+.*?\[|\Z)', reasoning, re.DOTALL)
        if m_title:
            extracted_issue = m_title.group(1).strip()
            
        # 2. Try pattern: 가. 쟁점 ... 나. 관련법령
        if not extracted_issue:
            m_issue = re.search(r'가\.\s*쟁점\s*\n+(.*?)(?=\n+\s*나\.|\Z)', reasoning, re.DOTALL)
            if m_issue:
                # Clean up excess spaces
                cleaned = re.sub(r'\s+', ' ', m_issue.group(1)).strip()
                if len(cleaned) > 5:
                    extracted_issue = cleaned
                    
        # 3. Try pattern: 1. 쟁점
        if not extracted_issue:
            m_issue2 = re.search(r'1\.\s*쟁점\s*\n+(.*?)(?=\n+\s*2\.|\Z)', reasoning, re.DOTALL)
            if m_issue2:
                cleaned = re.sub(r'\s+', ' ', m_issue2.group(1)).strip()
                if len(cleaned) > 5:
                    extracted_issue = cleaned

        # If extracted, update title and key_issue
        if extracted_issue:
            # Cut title to a clean concise length if too long
            final_title = extracted_issue if len(extracted_issue) <= 150 else extracted_issue[:147] + "..."
            
            cursor.execute("""
                UPDATE precedents
                SET title = ?,
                    key_issue = ?
                WHERE id = ?
            """, (final_title, extracted_issue, rid))
            updated_count += 1
            
    conn.commit()
    print(f"Successfully cleaned titles and key issues for {updated_count} / {len(records)} precedents!")
    
    # Update Categories
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

if __name__ == "__main__":
    clean_and_sync_all_titles()
