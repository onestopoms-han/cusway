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

init_db_migrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

