# -*- coding: utf-8 -*-
import sqlite3
import os

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def seed_notes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    notes_to_insert = [
        (
            "38.26",
            "제3826호: 바이오디젤과 그 혼합물(석유나 역청유의 함유량이 전중량의 100분의 70 미만인 것으로 한정한다). 이 호에는 디젤 엔진의 연료로 사용하기에 적합한 지방산 모노알킬에스테르(지방산 메틸에스테르(FAME) 등)로 구성된 바이오디젤 및 그 혼합물이 분류된다. 식물성 또는 동물성 유지를 전이에스테르화하여 제조한 바이오디젤은 제3824호가 아닌 제3826호에 분류된다.",
            "Heading 38.26: Biodiesel and mixtures thereof. Fatty acid methyl esters (FAME) are classified here.",
            "6",
            "38"
        ),
        (
            "34.07",
            "제3407호: 조형용 페이스트(아동용 조형 페이스트를 포함한다), 치과용 왁스나 치과용 인상재료(세트 모양, 소매용 포장, 판 모양, 말발굽 모양, 스틱 모양이나 이와 유사한 모양으로 된 것으로 한정한다), 플라스터(소석고나 황산칼슘으로 만든 것)를 기본 재료로 한 그 밖의 치과용 조제품. 이 호에는 치아와 잇몸의 본을 뜨는 데 사용되는 부가중합형 실리콘 인상재(비닐 폴리실록산), 알지네이트 인상재 등이 분류된다. 치과용 충전재(제3006호)는 제외된다.",
            "Heading 34.07: Modelling pastes; dental wax and dental impression preparations.",
            "6",
            "34"
        ),
        (
            "44.12",
            "제4412호: 합판(plywood), 베니어패널(veneered panel)과 이와 유사한 적층목재(laminated wood). 이 호에는 목재의 단판(베니어)을 섬유 방향이 서로 교차하도록 적층 접착 압착하여 제조한 자작나무 합판(Birch plywood), 침엽수 합판, 활엽수 합판 등이 분류된다. 건축용 건구(제4418호)는 제외된다.",
            "Heading 44.12: Plywood, veneered panels and similar laminated wood.",
            "9",
            "44"
        ),
        (
            "63.02",
            "제6302호: 침실용ㆍ식탁용ㆍ변소용ㆍ주방용 린넨. 이 호에는 면 또는 기타 방직용 섬유로 제조된 테리 타월링(terry towelling) 또는 유사한 직물로 만든 바스타월(bath towel), 목욕 타월, 핸드 타월, 주방용 타월 등의 완제품이 분류된다. 봉제 마감되지 않은 테리 원단(제5802호)은 제외된다.",
            "Heading 63.02: Bed linen, table linen, toilet linen and kitchen linen, including bath towels.",
            "11",
            "63"
        ),
        (
            "70.07",
            "제7007호: 안전유리[강화유리(toughened glass)나 접합유리(laminated glass)로 한정한다]. 이 호에는 열처리 또는 화학처리에 의해 강화된 강화유리와 판유리 사이에 플라스틱 필름을 접합한 접합유리가 분류된다. 제16부 주 제1호 나목에 따라 기계류의 부분품 모양으로 가공된 강화유리 패널(식기세척기 도어 유리 등)도 제7007호에 우선 분류된다.",
            "Heading 70.07: Safety glass, consisting of toughened (tempered) or laminated glass.",
            "13",
            "70"
        ),
        (
            "72.16",
            "제7216호: 철이나 비합금강의 형강. 이 호에는 비합금강을 열간압연, 열간인발 또는 압출하여 성형한 H형강(H-sections), I형강, ㄷ형강(U-sections), L형강, T형강 등이 분류된다. 기타 합금강의 형강(제7228호)은 제외된다.",
            "Heading 72.16: Angles, shapes and sections of iron or non-alloy steel (H-sections etc).",
            "15",
            "72"
        )
    ]

    for heading, ko, en, sec, ch in notes_to_insert:
        # Check if exists
        cursor.execute("SELECT id FROM explanatory_notes WHERE heading = ?", (heading,))
        row = cursor.fetchone()
        if row:
            cursor.execute("""
                UPDATE explanatory_notes 
                SET content_ko = ?, content_en = ?, section = ?, chapter = ?
                WHERE id = ?
            """, (ko, en, sec, ch, row[0]))
        else:
            cursor.execute("""
                INSERT INTO explanatory_notes (heading, content_ko, content_en, section, chapter)
                VALUES (?, ?, ?, ?, ?)
            """, (heading, ko, en, sec, ch))
        print(f"Seeded Note: {heading}")

    conn.commit()
    conn.close()
    print("All missing Explanatory Notes successfully seeded!")

if __name__ == "__main__":
    seed_notes()
