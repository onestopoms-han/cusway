import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 1. 2008.19-3000 (볶은 참깨가루 / 볶음참깨) 요건 삽입
cur.execute("DELETE FROM hs_requirements WHERE hs_code IN ('2008.19-3000', '2008193000')")

req_records = [
    (
        '2008.19-3000',
        '수입식품안전관리 특별법',
        '식품의약품안전처',
        '세관장확인',
        '수입식품안전관리 특별법 제20조에 의거 수입 시 지방식품의약품안전청장에게 신고하여 수입식품등의 수입신고확인증을 교부받아야 함. (식품위생법 제7조 및 제9조에 따른 기준 및 규격 적합, 해외제조업소 사전등록 및 한글표시사항(라벨링) 부착 의무 대상)'
    ),
    (
        '2008.19-3000',
        '수입식품안전관리 특별법',
        '식품의약품안전처',
        '통합공고',
        '수입식품안전관리 특별법에 의거 수입식품등 수입업 영업등록 및 해외제조업소 등록 필수. 최초 수입 시 정밀검사(잔류농약, 중금속, 벤조피렌 등) 수검 대상.'
    ),
    (
        '2008.19-3000',
        '식물방역법',
        '농림축산검역본부',
        '세관장확인',
        '식물방역법 제10조의 규정에 의한 수입금지지역 확인 및 농림축산검역본부장에게 신고하여 식물검역을 받아야 함. (단, 고온 볶음 열처리 및 미세 분쇄로 병해충 사멸 공정이 확인되는 가공품은 제조공정도 확인을 거쳐 식물검역 제외 또는 서류검역 처리 가능)'
    ),
    (
        '2008.19-3000',
        '대외무역법 (원산지표시)',
        '관세청',
        '세관장확인',
        '대외무역법 제33조 및 농수산물의 원산지 표시 등에 관한 법률에 의거 원산지를 적정하게 표시(소비자 포장용기 또는 수입포대 각인/인쇄)하여야 통관 가능.'
    ),
    (
        '2008193000',
        '수입식품안전관리 특별법',
        '식품의약품안전처',
        '세관장확인',
        '수입식품안전관리 특별법 제20조에 의거 수입 시 지방식품의약품안전청장에게 신고하여 수입식품등의 수입신고확인증을 교부받아야 함.'
    ),
    (
        '2008193000',
        '식물방역법',
        '농림축산검역본부',
        '세관장확인',
        '식물방역법 제10조의 규정에 의한 수입금지지역 확인 및 농림축산검역본부장에게 신고하여 식물검역을 받아야 함.'
    )
]

for r in req_records:
    cur.execute("""
        INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
        VALUES (?, ?, ?, ?, ?)
    """, r)

print("Inserted requirements for 2008.19-3000 / 2008193000")

# 2. Check other missing food items in Ch 01-24 and fill them with appropriate sibling/chapter templates
cur.execute("""
    SELECT DISTINCT hs_code, name_ko 
    FROM hs_code_master 
    WHERE (length(replace(replace(hs_code, '.', ''), '-', '')) = 10)
    AND substr(replace(replace(hs_code, '.', ''), '-', ''), 1, 2) BETWEEN '01' AND '24'
""")
all_food = cur.fetchall()

filled_count = 0
for hsk, name in all_food:
    clean = hsk.replace('.', '').replace('-', '')
    formatted = f"{clean[:4]}.{clean[4:6]}-{clean[6:]}"
    
    cur.execute("SELECT COUNT(*) FROM hs_requirements WHERE hs_code = ? OR hs_code = ? OR hs_code = ?", (hsk, clean, formatted))
    cnt = cur.fetchone()[0]
    if cnt == 0:
        chapter = int(clean[:2])
        # Determine appropriate requirements based on chapter
        if chapter in [1, 2, 4, 5, 16]: # Animal / Meat / Dairy
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '수입식품안전관리 특별법', '식품의약품안전처', '세관장확인', '수입식품안전관리 특별법 제20조에 의거 지방식품의약품안전청장에게 수입신고하여 합격하여야 함.'))
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '가축전염병 예방법', '농림축산검역본부', '세관장확인', '가축전염병예방법 제32조에 의거 수출국 정부기관 발행 검역증명서 첨부 및 동물검역 합격 필요.'))
        elif chapter == 3: # Fish / Seafood
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '수입식품안전관리 특별법', '식품의약품안전처', '세관장확인', '수입식품안전관리 특별법 제20조에 의거 지방식품의약품안전청장에게 수입신고하여 합격하여야 함.'))
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '수산물방역법', '국립수산물품질관리원', '세관장확인', '수산생물질병관리법 제24조에 의거 수입 검역 합격 증명서 필요.'))
        elif chapter in [6, 7, 8, 9, 10, 11, 12, 13, 14, 20]: # Plants / Vegetables / Fruits / Grains / Preparations
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '수입식품안전관리 특별법', '식품의약품안전처', '세관장확인', '수입식품안전관리 특별법 제20조에 의거 지방식품의약품안전청장에게 수입신고하여 합격하여야 함.'))
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '식물방역법', '농림축산검역본부', '세관장확인', '식물방역법 제10조의 규정에 의한 수입금지지역 확인 및 농림축산검역본부 식물검역 합격 필요.'))
        else: # Other Food Preparations / Oils / Sugars / Beverages (Ch 15, 17, 18, 19, 21, 22, 23, 24)
            cur.execute("""
                INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
                VALUES (?, ?, ?, ?, ?)
            """, (formatted, '수입식품안전관리 특별법', '식품의약품안전처', '세관장확인', '수입식품안전관리 특별법 제20조에 의거 지방식품의약품안전청장에게 수입신고하여 수입식품등 신고필증을 교부받아야 함.'))
        
        filled_count += 1

conn.commit()
print(f"Filled missing requirements for {filled_count} food/agricultural codes!")

# Verify 2008.19-3000
cur.execute("SELECT hs_code, law_name, agency_name, check_type, description FROM hs_requirements WHERE hs_code = '2008.19-3000'")
print("\n=== Verification for 2008.19-3000 ===")
for r in cur.fetchall():
    print(r)
