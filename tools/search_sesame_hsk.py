# -*- coding: utf-8 -*-
import sqlite3
import sys

sys.stdout.reconfigure(line_buffering=True, encoding='utf-8')

conn = sqlite3.connect('cusway.db')
c = conn.cursor()

print("=== 1. hs_code_master search for '깨' ===")
for r in c.execute("SELECT hs_code, hscode_length, name_ko, name_en FROM hs_code_master WHERE name_ko LIKE '%깨%'").fetchall():
    print(r)

print("\n=== 2. hs_code_master 1207 ===")
for r in c.execute("SELECT hs_code, hscode_length, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '1207%'").fetchall():
    print(r)

print("\n=== 3. hs_code_master 1208 ===")
for r in c.execute("SELECT hs_code, hscode_length, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '1208%'").fetchall():
    print(r)

print("\n=== 4. hs_code_master 2008.19 ===")
for r in c.execute("SELECT hs_code, hscode_length, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '200819%'").fetchall():
    print(r)

print("\n=== 5. hs_code_master 2008 ===")
for r in c.execute("SELECT hs_code, hscode_length, name_ko, name_en FROM hs_code_master WHERE hs_code LIKE '2008%'").fetchall():
    print(r)
