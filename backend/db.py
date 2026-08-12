from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Vercel 배포 환경에서는 /tmp 폴더만 쓰기 권한이 허용되므로 경로 분기 처리
if os.environ.get("VERCEL"):
    DATABASE_URL = "sqlite:////tmp/cusway.db"
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
