import json
import os
from pathlib import Path

from .db import SessionLocal
from .models import ExplanatoryNote

# JSON 파일 경로 (프로젝트 루트 기준)
JSON_PATH = Path(__file__).resolve().parents[2] / "crawled_explanatory_notes.json"

def load_notes(session, notes):
    """주어진 세션에 설명 노트를 삽입한다.
    동일한 hs6 와 paragraph 가 이미 존재하면 건너뛴다.
    """
    for note in notes:
        hs6 = note.get("hs6")
        paragraph = note.get("paragraph")
        source = note.get("source")
        revision = note.get("revision")
        exists = (
            session.query(ExplanatoryNote)
            .filter(ExplanatoryNote.hs6 == hs6, ExplanatoryNote.paragraph == paragraph)
            .first()
        )
        if exists:
            continue
        db_note = ExplanatoryNote(
            hs6=hs6,
            paragraph=paragraph,
            source=source,
            revision=revision,
        )
        session.add(db_note)
    session.commit()

def main():
    if not JSON_PATH.is_file():
        print(f"❌ JSON 파일을 찾을 수 없습니다: {JSON_PATH}")
        return
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list):
        print("❌ JSON 형식이 리스트가 아닙니다.")
        return
    db = SessionLocal()
    try:
        load_notes(db, data)
        print(f"✅ {len(data)} 개의 노트를 DB에 저장했습니다.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
