# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, '.')
from tools.run_iterative_set1_50 import SET1_50_ITEMS
from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

db = SessionLocal()
target_ids = [12, 13, 24, 25]
target_items = [it for it in SET1_50_ITEMS if it['id'] in target_ids]

for it in target_items:
    res = AICustomsClassificationProcessor.run_classification_pipeline(it['name'], it['material'], it['function'], db)
    code = res.get('recommendedHsCode', '')
    clean = code.replace('.', '').replace('-', '').strip()
    hd = clean[:4]
    exp = it['expected_heading']
    match = (hd == exp) if isinstance(exp, str) else (hd in exp)
    status = 'PASS' if match else 'FAIL'
    print(f"[{status}] No.{it['id']} {it['name']} -> {code} (Heading: {hd} vs Expected: {exp})", flush=True)
