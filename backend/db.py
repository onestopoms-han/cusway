from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

import shutil

# Database connection setup
if os.environ.get("VERCEL"):
    # Vercel 환경에서 cusway.db 위치 자동 탐색
    possible_src_paths = [
        os.path.join(os.getcwd(), "cusway.db"),
        os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cusway.db"),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "cusway.db"),
        "/var/task/cusway.db"
    ]
    src_db = None
    for p in possible_src_paths:
        if os.path.exists(p):
            src_db = p
            break

    dest_db = "/tmp/cusway.db"
    if src_db:
        # dest_db가 없거나 크기가 다를 때만 1회 복사 (서버리스 렉 및 OOM 방지)
        if not os.path.exists(dest_db):
            try:
                shutil.copy2(src_db, dest_db)
                print(f"[DB_INIT] Successfully prepared /tmp/cusway.db from {src_db}")
            except Exception as e:
                print(f"[DB_INIT_WARN] Copy to /tmp failed, fallback to direct read: {e}")
                dest_db = src_db
        DATABASE_URL = f"sqlite:///{dest_db}"
    else:
        print("[DB_INIT_WARN] Source database not found in known paths, using /tmp/cusway.db")
        DATABASE_URL = "sqlite:////tmp/cusway.db"
else:
    DATABASE_URL = "sqlite:///./cusway.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db_migrations():
    import sqlite3
    db_file = "./cusway.db"
    if os.path.exists(db_file):
        try:
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            # Check existing columns in hs_rate_master
            cursor.execute("PRAGMA table_info(hs_rate_master)")
            existing_cols = {row[1] for row in cursor.fetchall()}
            if existing_cols:
                cols_to_add = [
                    ("has_seasonal_rate", "INTEGER DEFAULT 0"),
                    ("seasonal_schedule", "TEXT"),
                    ("specific_rate", "REAL"),
                    ("specific_unit", "TEXT"),
                    ("duty_type", "TEXT DEFAULT 'AD_VALOREM'"),
                    ("duty_formula", "TEXT")
                ]
                for col_name, col_type in cols_to_add:
                    if col_name not in existing_cols:
                        cursor.execute(f"ALTER TABLE hs_rate_master ADD COLUMN {col_name} {col_type}")
                        print(f"[MIGRATION] Added column {col_name} to hs_rate_master")
                conn.commit()
            conn.close()
        except Exception as e:
            print(f"[MIGRATION_WARN] {e}")

def init_customs_rates_2026():
    import sqlite3
    db_file = "./cusway.db"
    if os.environ.get("VERCEL"):
        db_file = "/tmp/cusway.db"
        
    excel_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "관세청_품목번호별 관세율표_20260211.xlsx")
    if not os.path.exists(excel_path):
        excel_path = "관세청_품목번호별 관세율표_20260211.xlsx"
        
    if os.path.exists(db_file) and os.path.exists(excel_path):
        try:
            conn = sqlite3.connect(db_file)
            cursor = conn.cursor()
            cursor.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='customs_rates_2026'")
            table_exists = cursor.fetchone()[0] > 0
            if table_exists:
                cursor.execute("SELECT count(*) FROM customs_rates_2026")
                cnt = cursor.fetchone()[0]
                if cnt >= 300000:
                    conn.close()
                    return # already populated
            
            print("[RATES_INIT] Initializing 2026 Customs Tariff Master from Excel...")
            import openpyxl
            wb = openpyxl.load_workbook(excel_path, read_only=True)
            ws = wb['2.12'] if '2.12' in wb.sheetnames else wb.active
            
            cursor.execute("DROP TABLE IF EXISTS customs_rates_2026")
            cursor.execute("""
            CREATE TABLE customs_rates_2026 (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hs_code TEXT NOT NULL,
                rate_code TEXT NOT NULL,
                rate_val REAL,
                specific_rate REAL,
                base_price REAL,
                country_type TEXT,
                usage_type TEXT,
                start_date TEXT,
                end_date TEXT
            )
            """)
            
            batch = []
            count = 0
            for row in ws.iter_rows(values_only=True):
                count += 1
                if count == 1:
                    continue
                hsk = str(row[0]).strip() if row[0] is not None else ''
                rcode = str(row[1]).strip() if row[1] is not None else ''
                if not hsk or not rcode:
                    continue
                rval = float(row[2]) if row[2] is not None else None
                srate = float(row[3]) if row[3] is not None else None
                bprice = float(row[4]) if row[4] is not None else None
                ctype = str(row[5]).strip() if row[5] is not None else None
                utype = str(row[6]).strip() if row[6] is not None else None
                sdate = str(row[7]).strip() if row[7] is not None else None
                edate = str(row[8]).strip() if row[8] is not None else None
                batch.append((hsk, rcode, rval, srate, bprice, ctype, utype, sdate, edate))
                
            cursor.executemany("""
            INSERT INTO customs_rates_2026 (hs_code, rate_code, rate_val, specific_rate, base_price, country_type, usage_type, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, batch)
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_rates_hsk ON customs_rates_2026(hs_code)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_rates_rcode ON customs_rates_2026(rate_code)")
            conn.commit()
            conn.close()
            print(f"[RATES_INIT] Successfully loaded {len(batch)} tariff rows into customs_rates_2026.")
        except Exception as e:
            print(f"[RATES_INIT_WARN] Failed to auto-init customs_rates_2026: {e}")

init_db_migrations()
init_customs_rates_2026()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

