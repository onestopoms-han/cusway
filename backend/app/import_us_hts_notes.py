import csv
from pathlib import Path

from .db import SessionLocal
from .models import USHtsNote

# 프로젝트 루트 기준 CSV 파일 위치 (예: us_hts_notes.csv)
CSV_PATH = Path(__file__).resolve().parents[2] / "us_hts_notes.csv"

def load_us_notes(session, rows):
    """US HTS 노트를 DB에 삽입 (중복 방지)."""
    for row in rows:
        hs6 = row.get("hs6")
        paragraph = row.get("paragraph")
        source = row.get("source")
        revision = row.get("revision")
        year = int(row.get("year")) if row.get("year") else None

        exists = (
            session.query(USHtsNote)
            .filter(USHtsNote.hs6 == hs6, USHtsNote.paragraph == paragraph)
            .first()
        )
        if exists:
            continue

        session.add(
            USHtsNote(
                hs6=hs6,
                paragraph=paragraph,
                source=source,
                revision=revision,
                year=year,
            )
        )
    session.commit()

def main():
    if not CSV_PATH.is_file():
        print(f"❌ US HTS CSV 파일을 찾을 수 없습니다: {CSV_PATH}")
        return

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    db = SessionLocal()
    try:
        load_us_notes(db, rows)
        print(f"✅ US HTS 노트 {len(rows)}개를 DB에 저장했습니다.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
