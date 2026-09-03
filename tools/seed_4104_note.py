# -*- coding: utf-8 -*-
import sqlite3

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM explanatory_notes WHERE heading = '41.04'")
    row = cursor.fetchone()
    content = "제4104호: 소(버팔로를 포함한다)와 마속(말ㆍ당나귀ㆍ노새 등)동물의 유연처리ㆍ크러스트 처리한 원피(털을 제거한 것으로 한정하고, 스플릿한 것인지에 상관없으며 그 이상 가공한 것은 제외한다). 이 호에는 식물성 탄닝 처리한 말 가죽(마피), 소가죽의 크러스트 상태 피혁이 분류된다."
    
    if row:
        cursor.execute("UPDATE explanatory_notes SET content_ko = ? WHERE id = ?", (content, row[0]))
    else:
        cursor.execute("INSERT INTO explanatory_notes (heading, content_ko, section, chapter) VALUES ('41.04', ?, '8', '41')", (content,))
    
    conn.commit()
    conn.close()
    print("Seeded 41.04 successfully!")

if __name__ == "__main__":
    seed()
