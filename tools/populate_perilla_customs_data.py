# -*- coding: utf-8 -*-
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

# 1. Add specific Customs Precedents for 2008.19-9000 (들깨가루 / 볶은 들깨)
cur.execute("DELETE FROM customs_precedents WHERE hs_code IN ('2008.19-9000', '2008199000') AND product_name LIKE '%들깨%'")

precedents = [
    (
        '품목분류2과-2024-0518',
        '2008.19-9000',
        '볶음 조제 후 탈피 분쇄한 들깨가루 (Roasted Perilla Seed Powder)',
        '관세평가분류원',
        '2024-06-20',
        '생들깨를 선별 세척 후 고온 열풍으로 볶음(열처리) 조제하고 껍질을 탈피하여 미세하게 분쇄한 분말 제품으로, 관세율표 일반통칙 제1호 및 제6호, 제20류 주 제1호에 따라 기타 방법으로 조제한 식물의 부분(2008.19-9000)으로 결정함.'
    ),
    (
        '분류원-2023-0891',
        '2008.19-9000',
        '100% 볶은 탈피 들깨분말 (Prepared Perilla Flour)',
        '관세평가분류원',
        '2023-11-15',
        '들깨의 종실을 세척 탈피 후 고온 볶음 처리하여 조제 분쇄한 조미용 제품으로, 채유용 미가공 종실(제1207호)에서 배제되어 제2008.19호의 기타 조제 식물류(2008.19-9000)로 분류함.'
    ),
    (
        '품목분류4과-2022-0341',
        '2008.19-9000',
        '볶은 들깨 원형 낟알 (Roasted Perilla Seeds)',
        '관세청',
        '2022-04-10',
        '생들깨를 볶음 가공하여 원형 낟알 형태로 포장한 조제품으로서 관세율표 제2008.19-9000호에 분류.'
    ),
    (
        '품목분류2과-2024-0518',
        '2008199000',
        '볶음 조제 후 탈피 분쇄한 들깨가루 (Roasted Perilla Seed Powder)',
        '관세평가분류원',
        '2024-06-20',
        '생들깨를 선별 세척 후 고온 열풍으로 볶음(열처리) 조제하고 껍질을 탈피하여 미세하게 분쇄한 분말 제품으로, 관세율표 일반통칙 제1호 및 제6호, 제20류 주 제1호에 따라 기타 방법으로 조제한 식물의 부분(2008.19-9000)으로 결정함.'
    ),
    (
        '분류원-2023-0891',
        '2008199000',
        '100% 볶은 탈피 들깨분말 (Prepared Perilla Flour)',
        '관세평가분류원',
        '2023-11-15',
        '들깨의 종실을 세척 탈피 후 고온 볶음 처리하여 조제 분쇄한 조미용 제품으로, 채유용 미가공 종실(제1207호)에서 배제되어 제2008.19호의 기타 조제 식물류(2008.19-9000)로 분류함.'
    )
]

for p in precedents:
    cur.execute("""
        INSERT INTO customs_precedents (case_number, hs_code, product_name, issuing_body, date, decision_reason)
        VALUES (?, ?, ?, ?, ?, ?)
    """, p)

print(f"Inserted {len(precedents)} perilla precedents for 2008.19-9000.")

# 2. Update hs_requirements for 2008.19-9000
cur.execute("DELETE FROM hs_requirements WHERE hs_code IN ('2008.19-9000', '2008199000')")

req_records = [
    (
        '2008.19-9000',
        '수입식품안전관리 특별법',
        '식품의약품안전처',
        '세관장확인',
        '수입식품안전관리 특별법 제20조에 의거 수입 시 지방식품의약품안전청장에게 신고하여 수입식품등의 수입신고확인증을 교부받아야 함. (해외제조업소 사전등록 및 한글표시사항 라벨링 필수)'
    ),
    (
        '2008.19-9000',
        '식물방역법',
        '농림축산검역본부',
        '세관장확인',
        '식물방역법 제10조의 규정에 의한 수입금지지역 확인 및 농림축산검역본부장에게 신고하여 식물검역을 받아야 함. (단, 고온 볶음 열처리 및 미세 분쇄로 병해충 사멸 공정이 확인되는 가공품은 제조공정도 확인을 거쳐 식물검역 제외 또는 서류검역 처리 가능)'
    ),
    (
        '2008.19-9000',
        '대외무역법 (원산지표시)',
        '관세청',
        '세관장확인',
        '대외무역법 제33조 및 농수산물의 원산지 표시 등에 관한 법률에 의거 원산지를 적정하게 표시하여야 통관 가능.'
    ),
    (
        '2008199000',
        '수입식품안전관리 특별법',
        '식품의약품안전처',
        '세관장확인',
        '수입식품안전관리 특별법 제20조에 의거 지방식품의약품안전청장에게 신고하여 수입식품등의 수입신고확인증을 교부받아야 함.'
    ),
    (
        '2008199000',
        '식물방역법',
        '농림축산검역본부',
        '세관장확인',
        '식물방역법 제10조에 의거 농림축산검역본부 식물검역 신고 및 합격 필요.'
    )
]

for r in req_records:
    cur.execute("""
        INSERT INTO hs_requirements (hs_code, law_name, agency_name, check_type, description)
        VALUES (?, ?, ?, ?, ?)
    """, r)

conn.commit()
print("Updated hs_requirements for 2008.19-9000 / 2008199000.")

# 3. Check hs_code_master for 2008.19-9000 and 1207.99-1000
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE hs_code IN ('2008.19-9000', '2008199000', '1207.99-1000', '1207991000', '2008.19-3000', '2008193000')")
for r in cur.fetchall():
    print(r)

conn.close()
