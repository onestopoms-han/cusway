import sqlite3

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 1. Sync wto_rate in BASE rows from non-null peer rows for sensitive agri items
cur.execute("""
    UPDATE hs_rate_master 
    SET wto_rate = 611.5 
    WHERE replace(replace(hs_code, '.', ''), '-', '') = '0813402000' AND wto_rate IS NULL
""")

cur.execute("""
    UPDATE hs_rate_master 
    SET wto_rate = 513.6 
    WHERE replace(replace(hs_code, '.', ''), '-', '') = '0902100000' AND wto_rate IS NULL
""")

cur.execute("""
    UPDATE hs_rate_master 
    SET wto_rate = 135.0 
    WHERE replace(replace(hs_code, '.', ''), '-', '') = '0703101010' AND wto_rate IS NULL
""")

cur.execute("""
    UPDATE hs_rate_master 
    SET wto_rate = 377.3 
    WHERE replace(replace(hs_code, '.', ''), '-', '') = '0910111000' AND wto_rate IS NULL
""")

# 2. Add 수입식품안전관리 특별법 to 0306179091 if missing
cur.execute("SELECT count(*) FROM hs_requirements WHERE replace(replace(hs_code, '.', ''), '-', '') = '0306179091' AND law_name LIKE '%수입식품%'")
if cur.fetchone()[0] == 0:
    cur.execute("""
        INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
        VALUES ('0306.17-9091', '수입식품안전관리 특별법', '식품의약품안전처', '세관장확인', '식용 수산물(냉동 흰다리새우)은 수입식품안전관리 특별법 제20조에 따라 관세청 통관 전 식품의약품안전처장에게 수입신고하여 위생 및 방사능/중금속 정밀검사를 완료하여야 합니다.')
    """)

conn.commit()
conn.close()
print("DB Synced successfully!")
