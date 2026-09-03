# -*- coding: utf-8 -*-
import sqlite3

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def seed_set6_notes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    notes = [
        (
            "03.03",
            "제0303호: 냉동 어류(제0304호의 어류의 피레(fillet)와 그 밖의 어육은 제외한다). 이 호에는 급속 냉동된 연어, 참치 및 연어 알(salmon roe), 청어 알 등의 식용 냉동 어류 및 어란이 분류된다.",
            "Heading 03.03: Fish, frozen, including fish roes.",
            "1",
            "03"
        ),
        (
            "08.04",
            "제0804호: 대추야자ㆍ무화과ㆍ파인애플ㆍ아보카도ㆍ구아바ㆍ망고ㆍ망고스틴(신선하거나 건조한 것으로 한정한다). 이 호에는 설탕이나 감미료를 첨가하지 않은 천연 건조 무화과(dried figs) 등이 분류된다.",
            "Heading 08.04: Dates, figs, pineapples, avocados, guavas, mangoes and mangosteens, fresh or dried.",
            "2",
            "08"
        ),
        (
            "09.05",
            "제0905호: 바닐라. 이 호에는 천연 바닐라 나무의 열매 꼬투리(Vanilla beans)로서 전초, 조각 또는 분말 형태의 것이 분류된다. 바닐라 엑기스(제3302호)는 제외된다.",
            "Heading 09.05: Vanilla beans.",
            "2",
            "09"
        ),
        (
            "15.11",
            "제1511호: 팜유와 그 분획물(정제했는지에 상관없으며 화학적으로 변성 가공한 것은 제외한다). 이 호에는 기름야자 열매 과육에서 물리적으로 압착 추출한 미정제 팜유(조유) 및 정제유가 분류된다.",
            "Heading 15.11: Palm oil and its fractions, whether or not refined, but not chemically modified.",
            "3",
            "15"
        ),
        (
            "21.02",
            "제2102호: 효모(활성이나 비활성인 것으로 한정한다), 그 밖의 단세포 미생물(죽은 것으로 한정하며, 제3002호의 백신은 제외한다), 조제한 베이킹파우더. 이 호에는 제빵용 활성 인스턴트 건조 효모(Active dry yeast)가 분류된다.",
            "Heading 21.02: Yeasts (active or inactive); other single-cell micro-organisms, dead.",
            "4",
            "21"
        ),
        (
            "22.07",
            "제2207호: 변성하지 않은 에틸알코올(알코올 용량이 전용량의 100분의 80 이상인 것으로 한정한다), 변성 에틸알코올과 그 밖의 변성 주정(알코올 용량에 상관없다). 이 호에는 합성 에탄올(도수 99.5% vol 무변성)이 분류된다.",
            "Heading 22.07: Undenatured ethyl alcohol of an alcoholic strength by volume of 80 % vol or higher.",
            "4",
            "22"
        ),
        (
            "29.23",
            "제2923호: 제4급 암모늄염과 수산화제4급 암모늄, 레시틴과 그 밖의 포스포아미노리피드(화학적으로 순수한지 여부를 불문한다). 이 호에는 테트라메틸암모늄 하이드록사이드(TMAH) 수용액 등이 분류된다.",
            "Heading 29.23: Quaternary ammonium salts and hydroxides (TMAH etc).",
            "6",
            "29"
        ),
        (
            "39.04",
            "제3904호: 염화비닐이나 그 밖의 할로겐화 올레핀의 중합체(일차제품으로 한정한다). 이 호에는 가소제를 첨가하지 않은 폴리염화비닐(PVC) 수지 분말 및 펠릿이 분류된다.",
            "Heading 39.04: Polymers of vinyl chloride, in primary forms.",
            "7",
            "39"
        ),
        (
            "40.09",
            "제4009호: 가황고무(경질고무는 제외한다)로 만든 관ㆍ파이프ㆍ호스(피팅을 부착한 것인지에 상관없다). 이 호에는 섬유로 보강된 합성고무제 압축공기 호스가 분류된다.",
            "Heading 40.09: Tubes, pipes and hoses, of vulcanised rubber other than hard rubber.",
            "7",
            "40"
        ),
        (
            "44.11",
            "제4411호: 목재나 그 밖의 목질재료로 만든 섬유판(수지나 그 밖의 유기물질로 결합한 것인지에 상관없다). 이 호에는 중밀도 섬유판(MDF) 및 고밀도 섬유판(HDF)이 분류된다.",
            "Heading 44.11: Fibreboard of wood or other ligneous materials (MDF etc).",
            "9",
            "44"
        ),
        (
            "48.10",
            "제4810호: 종이와 판지[한쪽 면이나 양쪽 면을 카올린이나 그 밖의 무기물질로 도포(塗布)한 것으로 한정한다]. 이 호에는 포장 상자용 도포 백판지(Coated Duplex Board)가 분류된다.",
            "Heading 48.10: Paper and paperboard, coated with kaolin or other inorganic substances.",
            "10",
            "48"
        ),
        (
            "49.10",
            "제4910호: 인쇄된 캘린더(캘린더 블록을 포함하며, 어떤 형태로 인쇄된 것이라도 상관없다). 이 호에는 벽걸이형 연간 달력, 탁상용 달력이 분류된다.",
            "Heading 49.10: Calendars of any kind, printed, including calendar blocks.",
            "10",
            "49"
        ),
        (
            "50.07",
            "제5007호: 견직물과 견 웨이스트의 직물. 이 호에는 생사 100%로 제직된 견 평직 실크 직물 원단이 분류된다.",
            "Heading 50.07: Woven fabrics of silk or of silk waste.",
            "11",
            "50"
        ),
        (
            "55.09",
            "제5509호: 합성스테이플섬유의 방적사(재봉사와 소매용은 제외한다). 이 호에는 폴리에스테르 스테이플 섬유 방적사 원사(비소매용)가 분류된다.",
            "Heading 55.09: Yarn of synthetic staple fibres (other than sewing thread), not put up for retail sale.",
            "11",
            "55"
        ),
        (
            "63.06",
            "제6306호: 타포린(tarpaulin)ㆍ차양(awning)ㆍ선블라인드(sunblind), 텐트, 돛(보트용ㆍ세일보드용ㆍ랜드크래프트용으로 한정한다), 캠핑용품. 이 호에는 PVC 코팅 폴리에스테르 직포 방수 타포린 및 텐트가 분류된다.",
            "Heading 63.06: Tarpaulins, awnings and sunblinds; tents; sails for boats, sailboards or landcraft; camping goods.",
            "11",
            "63"
        ),
        (
            "69.02",
            "제6902호: 내화벽돌ㆍ내화블록ㆍ내화타일과 이와 유사한 내화 도자제품(규산질 화석분이나 이와 유사한 규산질 흙으로 만든 것은 제외한다). 이 호에는 마그네시아-카본계 염기성 내화벽돌이 분류된다.",
            "Heading 69.02: Refractory bricks, blocks, tiles and similar refractory ceramic constructional goods.",
            "13",
            "69"
        ),
        (
            "70.02",
            "제7002호: 유리(가공하지 않은 봉ㆍ관으로 한정한다). 이 호에는 용융 실리카 석영 유리관(Quartz tubes) 등이 분류된다.",
            "Heading 70.02: Glass in balls, rods or tubes, unworked.",
            "13",
            "70"
        ),
        (
            "72.14",
            "제7214호: 철이나 비합금강의 봉(단조ㆍ열간압연ㆍ열간인발ㆍ열간압출한 것으로 한정하되, 압연 후 꼬인 것은 포함하며, 그 밖의 가공을 하지 않은 것으로 한정한다). 이 호에는 콘크리트용 비합금 열간압연 이형 철근(Deformed rebar)이 분류된다.",
            "Heading 72.14: Other bars and rods of iron or non-alloy steel (deformed rebar etc).",
            "15",
            "72"
        ),
        (
            "76.06",
            "제7606호: 알루미늄의 판ㆍ시트(sheet)ㆍ스트립(두께가 0.2밀리미터를 초과하는 것으로 한정한다). 이 호에는 음료 캔 제조용 3000계열 알루미늄 합금 압연 판재 코일이 분류된다.",
            "Heading 76.06: Aluminium plates, sheets and strip, of a thickness exceeding 0.2 mm.",
            "15",
            "76"
        ),
        (
            "82.03",
            "제8203호: 줄ㆍ라습(rasp)ㆍ플라이어(pliers)[절단용 플라이어를 포함한다]ㆍ핀셋ㆍ금속절단용 가위ㆍ파이프커터(pipe-cutter)ㆍ볼트커터(bolt cropper)ㆍ천공펀치(perforating punch)와 이와 유사한 수공구. 이 호에는 바이스 그립 잠금 플라이어(Locking pliers)가 분류된다.",
            "Heading 82.03: Files, rasps, pliers (including locking pliers), pincers, tweezers, etc.",
            "15",
            "82"
        ),
        (
            "83.07",
            "제8307호: 비금속(卑金屬)으로 만든 유연성 관(피팅을 부착한 것인지에 상관없다). 이 호에는 스테인리스 주름 벨로우즈 플렉시블 메탈 호스가 분류된다.",
            "Heading 83.07: Flexible tubing of base metal, with or without fittings.",
            "15",
            "83"
        ),
        (
            "85.07",
            "제8507호: 축전지(스파레이터를 포함하며, 직사각형인지에 상관없다). 이 호에는 전기차용 리튬이온 배터리 셀 및 팩이 분류된다.",
            "Heading 85.07: Electric accumulators, including separators therefor (Lithium-ion batteries).",
            "16",
            "85"
        ),
        (
            "85.16",
            "제8516호: 전기식 즉석식이나 저장식 물가열기와 투입식 가열기, 공간난방기와 토양난방기, 전열기기, 전자레인지 등. 이 호에는 인덕션 IH 및 전자레인지 조리기가 분류된다.",
            "Heading 85.16: Electric instantaneous or storage water heaters; electro-thermic appliances; microwave ovens.",
            "16",
            "85"
        ),
        (
            "87.01",
            "제8701호: 트랙터(제8709호의 트랙터는 제외한다). 이 호에는 세미트레일러 견인용 도로용 트랙터 트럭 헤드가 분류된다.",
            "Heading 87.01: Tractors (other than tractors of heading 87.09) (Road tractors for semi-trailers).",
            "17",
            "87"
        ),
        (
            "89.03",
            "제8903호: 요트와 그 밖의 오락용이나 스포츠용 선박, 노를 젓는 보트와 카누. 이 호에는 레저 낚시용 알루미늄 파워모터 보트가 분류된다.",
            "Heading 89.03: Yachts and other vessels for pleasure or sports; rowing boats and canoes.",
            "17",
            "89"
        ),
        (
            "90.01",
            "제9001호: 광섬유와 광섬유 다발, 광섬유 케이블, 편광재료의 판과 시트, 렌즈ㆍ프리즘ㆍ반사경과 그 밖의 광학용품(미장착된 것으로 한정한다). 이 호에는 미장착된 시력 보정용 플라스틱 안경 렌즈가 분류된다.",
            "Heading 90.01: Optical fibres; lenses, unmounted (spectacle lenses of plastics etc).",
            "18",
            "90"
        ),
        (
            "92.02",
            "제9202호: 그 밖의 현악기(예: 기타ㆍ바이올린ㆍ하프). 이 호에는 어쿠스틱 통기타, 클래식 기타가 분류된다.",
            "Heading 92.02: Other string musical instruments (for example, guitars, violins, harps).",
            "18",
            "92"
        ),
        (
            "94.03",
            "제9403호: 그 밖의 가구와 그 부분품. 이 호에는 사무실용 강철제 3단 서류 캐비닛, 금속제 사무용 가구가 분류된다.",
            "Heading 9403: Other furniture and parts thereof (metal furniture of a kind used in offices).",
            "20",
            "94"
        ),
        (
            "94.04",
            "제9404호: 매트리스 서포트(mattress support), 침구와 이와 유사한 물품. 이 호에는 독립 포켓 스프링 침대 매트리스, 라텍스 매트리스가 분류된다.",
            "Heading 94.04: Mattress supports; articles of bedding (mattresses etc).",
            "20",
            "94"
        )
    ]

    for heading, ko, en, sec, ch in notes:
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
    print("All Set 6 Explanatory Notes seeded successfully!")

if __name__ == "__main__":
    seed_set6_notes()
