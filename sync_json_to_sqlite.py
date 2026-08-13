# -*- coding: utf-8 -*-
import os
import json
import sqlite3

project_root = 'c:/Users/PJH/onestop-ai-custom-service'
db_path = os.path.join(project_root, 'cusway.db')
json_dir = os.path.join(project_root, 'src/data/explanatory_notes')

print("[SQLite Database - Explanatory Note JSON Sync Engine (Python) Active]")
print("=" * 60)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # 1. Clean table
    cursor.execute("DELETE FROM explanatory_notes")
    conn.commit()
    print("Cleaned explanatory_notes table successfully.")

    # 2. Iterate JSON files
    files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
    print(f"Found {len(files)} JSON files in explanatory_notes directory.")

    total_inserted = 0
    for file in files:
        file_path = os.path.join(json_dir, file)
        chapter_num = "".join(filter(str.isdigit, file))
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                notes = json.load(f)
                
            for note in notes:
                heading = note.get('hsCode') or note.get('heading') or ""
                content_ko = note.get('contentKo') or note.get('content_ko') or ""
                content_en = note.get('contentEn') or note.get('content_en') or ""
                section = note.get('section') or ""
                chapter = note.get('chapter') or chapter_num or ""
                
                cursor.execute(
                    "INSERT INTO explanatory_notes (heading, content_ko, content_en, section, chapter) VALUES (?, ?, ?, ?, ?)",
                    (heading, content_ko, content_en, section, chapter)
                )
                total_inserted += 1
                
            print(f"Loaded {len(notes)} notes from {file}")
        except Exception as e:
            print(f"Error parsing/loading {file}: {str(e)}")
            
    conn.commit()
    print("=" * 60)
    print(f"SUCCESS: Totally synced {total_inserted} records into SQLite database.")
except Exception as e:
    print("Global Error:", str(e))
finally:
    conn.close()
