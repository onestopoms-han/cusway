# -*- coding: utf-8 -*-
import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set project path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.rag.retriever import retrieve_relevant_notes
from backend.models import ExplanatoryNote

def test_rag_retrieval():
    db_path = 'c:/Users/PJH/onestop-ai-custom-service/cusway.db'
    engine = create_engine(f'sqlite:///{db_path}')
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    test_queries = [
        {"query": "비타민C", "expected_chapter": "29"},
        {"query": "비타민D", "expected_chapter": "29"},
        {"query": "마우스", "expected_chapter": "84"},
        {"query": "인형", "expected_chapter": "95"},
        {"query": "로보트 완구", "expected_chapter": "95"},
        {"query": "달걀", "expected_chapter": "04"}
    ]

    print("[RAG Retrieval Engine Precision Test]")
    print("=" * 60)

    all_passed = True
    for idx, item in enumerate(test_queries):
        q = item["query"]
        expected = item["expected_chapter"]
        notes = retrieve_relevant_notes(q, db)
        
        print(f"Query {idx+1}: '{q}'")
        if not notes:
            print("  Result: FAIL (No matching notes found in database)")
            all_passed = False
            continue
            
        best_note = notes[0]
        heading = best_note.heading.replace('.', '')
        actual_chapter = heading[:2]
        
        is_match = (actual_chapter == expected)
        status_text = "PASS" if is_match else "FAIL"
        if not is_match:
            all_passed = False
            
        print(f"  Best Match Heading: {best_note.heading}")
        print(f"  Expected Chapter:   {expected} | Actual Chapter: {actual_chapter}")
        print(f"  Status:             {status_text}")
        print(f"  Content Snippet:    {best_note.content_ko[:120]}...")
        print("-" * 60)

    db.close()
    if all_passed:
        print("ALL TESTS PASSED (100% Precision Match)")
    else:
        print("SOME TESTS FAILED - Check RAG scoring filters")

if __name__ == '__main__':
    test_rag_retrieval()
