# -*- coding: utf-8 -*-
import sqlite3
import sys

sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')

conn = sqlite3.connect('cusway.db')
c = conn.cursor()

# Check if exists
existing = c.execute("SELECT id FROM customs_precedents WHERE case_number = '분석47260-1300'").fetchone()

if existing:
    c.execute("""
        UPDATE customs_precedents SET
            hs_code = '1207.40-0000',
            product_name = '볶은 참깨 파쇄물 (Crushed Roasted Sesamum Seeds)',
            material = '100% 볶은 참깨 (거칠게 파쇄된 것과 원형 낟알의 혼합물)',
            function_use = '채유용 및 식품 가공용 원료',
            decision_reason = '본품은 볶은 참깨를 파쇄한 것으로 거칠게 파쇄된 참깨와 원형의 참깨가 혼합된 상태로서 1.25mm의 금속망의 체를 통과하는 중량비율이 약 60%임. 관세청 품목분류 적용기준(1.25mm 체 통과 중량비율 95% 이상 시 제1208호/제2008호 분류)에 의거하여 본 물품은 1.25mm 체 통과율이 95% 미만(약 60%)이므로 가루(분/밀)가 아닌 파쇄된 종실로 보아 관세율표 및 WCO HS 해설서 제1207호의 \"그 밖의 채유용에 적합한 종자와 과실(부수었는지에 상관없다)\"이 분류되는 HSK 1207.40-0000호에 분류함.',
            issuing_body = '관세청 중앙관세분석소 / 관세평가분류원',
            date = '2018-05-15'
        WHERE id = ?
    """, (existing[0],))
    print(f"Updated precedent id {existing[0]}")
else:
    c.execute("""
        INSERT INTO customs_precedents (case_number, hs_code, product_name, material, function_use, decision_reason, issuing_body, date)
        VALUES (
            '분석47260-1300',
            '1207.40-0000',
            '볶은 참깨 파쇄물 (Crushed Roasted Sesamum Seeds)',
            '100% 볶은 참깨 (거칠게 파쇄된 것과 원형 낟알의 혼합물)',
            '채유용 및 식품 가공용 원료',
            '본품은 볶은 참깨를 파쇄한 것으로 거칠게 파쇄된 참깨와 원형의 참깨가 혼합된 상태로서 1.25mm의 금속망의 체를 통과하는 중량비율이 약 60%임. 관세청 품목분류 적용기준(1.25mm 체 통과 중량비율 95% 이상 시 제1208호/제2008호 분류)에 의거하여 본 물품은 1.25mm 체 통과율이 95% 미만(약 60%)이므로 가루(분/밀)가 아닌 파쇄된 종실로 보아 관세율표 및 WCO HS 해설서 제1207호의 \"그 밖의 채유용에 적합한 종자와 과실(부수었는지에 상관없다)\"이 분류되는 HSK 1207.40-0000호에 분류함.',
            '관세청 중앙관세분석소 / 관세평가분류원',
            '2018-05-15'
        )
    """)
    print("Inserted precedent 분석47260-1300")

conn.commit()
conn.close()
print("Precedent registration completed successfully.")
