import sys, os
sys.path.insert(0, os.getcwd())

from backend.db import SessionLocal
from backend.models import Precedent, CustomsPrecedent

db = SessionLocal()
try:
    total_precedents = db.query(Precedent).count()
    total_customs = db.query(CustomsPrecedent).count()
    print(f"DB precedents count: {total_precedents:,}")
    print(f"DB customs_precedents count: {total_customs:,}")
    
    first_5 = db.query(Precedent).limit(5).all()
    print("Sample Precedents:")
    for p in first_5:
        print(f" - [{p.id}] {p.case_number} | {p.title[:40]}")
finally:
    db.close()
