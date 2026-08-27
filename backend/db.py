from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

import shutil

# Vercel 배포 환경에서는 /tmp 폴더만 쓰기 권한이 허용되므로 파일 복사 후 사용
if os.environ.get("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/cusway.db"
    src_db = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cusway.db")
    dest_db = "/tmp/cusway.db"
    try:
        if os.path.exists(src_db):
            shutil.copy2(src_db, dest_db)
            print(f"[DB_COPY] Successfully copied and overwrote {src_db} to {dest_db} (size: {os.path.getsize(dest_db)} bytes)")
        else:
            print(f"[DB_COPY_WARN] Source database not found at {src_db}")
    except Exception as e:
        print(f"[DB_COPY_ERROR] Failed to copy database: {e}")
else:
    DATABASE_URL = "sqlite:///./cusway.db"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
