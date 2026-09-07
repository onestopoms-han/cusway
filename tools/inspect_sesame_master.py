# -*- coding: utf-8 -*-
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('cusway.db')
cur = conn.cursor()

print("=== 1. Searching for '참깨' in hs_code_master ===")
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE name_ko LIKE '%참깨%' OR name_en LIKE '%sesam%'")
for r in cur.fetchall():
    print(r)

print("\n=== 2. Searching for '들깨' in hs_code_master ===")
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE name_ko LIKE '%들깨%' OR name_en LIKE '%perilla%'")
for r in cur.fetchall():
    print(r)

print("\n=== 3. Searching for '1207' in hs_code_master ===")
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '1207%' OR hs_code LIKE '12.07%'")
for r in cur.fetchall():
    print(r)

print("\n=== 4. Searching for '1208' in hs_code_master ===")
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '1208%' OR hs_code LIKE '12.08%'")
for r in cur.fetchall():
    print(r)

print("\n=== 5. Searching for '2008.19' or '200819' in hs_code_master ===")
cur.execute("SELECT hs_code, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '200819%' OR hs_code LIKE '2008.19%'")
for r in cur.fetchall():
    print(r)

conn.close()
