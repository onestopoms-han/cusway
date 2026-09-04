# -*- coding: utf-8 -*-
"""
Seed Set 8 WCO Explanatory Notes into cusway.db
"""
import sqlite3

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

SET8_NOTES = [
    (
        "02.07",
        "제0207호: 가금육과 식용 가금 설육(신선, 냉장, 냉동). 이 호에는 닭, 오리, 거위, 칠면조 등의 가금육을 분류한다. 뼈를 제거하고 급속 냉동한 닭 가슴살 절단육(제0207.14호)이 포함된다.",
        "Heading 02.07: Meat and edible offal, of poultry, fresh, chilled or frozen, including frozen chicken breast fillet.",
        "1",
        "02"
    ),
    (
        "03.02",
        "제0302호: 신선하거나 냉장한 어류(제0304호의 어류의 피레와 그 밖의 어육은 제외한다). 이 호에는 내장을 제거하고 얼음 냉장 보관한 신선 무지개송어(Trout, 제0302.11호)가 분류된다.",
        "Heading 03.02: Fish, fresh or chilled, including rainbow trout.",
        "1",
        "03"
    ),
    (
        "04.01",
        "제0401호: 밀크와 크림(농축하지 않은 것으로서 설탕이나 그 밖의 감미료를 첨가하지 않은 것으로 한정한다). 이 호에는 무가당 멸균 및 저온 살균 처리된 액상 우유(원유, 제0401.20호)가 분류된다.",
        "Heading 04.01: Milk and cream, not concentrated nor containing added sugar or other sweetening matter, including pasteurized milk.",
        "1",
        "04"
    ),
    (
        "05.02",
        "제0502호: 돼지 털과 오소리 털, 그 밖의 브러시 제조용 털, 이들의 웨이스트. 이 호에는 세척, 열소독 및 정렬 처리된 천연 가공 생 돼지 털(돈모, Pig bristles, 제0502.10호)을 분류한다.",
        "Heading 05.02: Pigs', hogs' or boars' bristles and hair; badger hair and other brush making hair; waste of such bristles or hair.",
        "1",
        "05"
    ),
    (
        "07.09",
        "제0709호: 그 밖의 채소(신선하거나 냉장한 것으로 한정한다). 이 호에는 신선한 파프리카 및 단고추류(Capsicum, 제0709.60호)를 분류한다.",
        "Heading 07.09: Other vegetables, fresh or chilled, including fresh bell peppers (paprika).",
        "2",
        "07"
    ),
    (
        "09.07",
        "제0907호: 정향(꽃봉오리와 열매를 포함한다). 이 호에는 정향나무의 꽃봉오리를 건조한 통 정향(Whole cloves, 제0907.10호)을 분류한다.",
        "Heading 09.07: Cloves (whole fruit, cloves and stems).",
        "2",
        "09"
    ),
    (
        "10.01",
        "제1001호: 밀과 메슬린(meslin). 이 호에는 제분용 비종자 연질 적색 밀(Soft red winter wheat, 제1001.99호) 곡물을 분류한다.",
        "Heading 10.01: Wheat and meslin.",
        "2",
        "10"
    ),
    (
        "11.08",
        "제1108호: 전분과 이눌린(inulin). 이 호에는 옥수수 배유에서 추출한 순수 옥수수 전분 분말(Corn starch, 제1108.12호)을 분류한다.",
        "Heading 11.08: Starches; inulin, including maize (corn) starch.",
        "2",
        "11"
    ),
    (
        "12.06",
        "제1206호: 해바라기씨(부순 것인지에 상관없다). 이 호에는 껍질을 벗긴 탈각 식용 생 해바라기씨(Shelled sunflower seeds, 제1206.00호)를 분류한다.",
        "Heading 12.06: Sunflower seeds, whether or not broken or shelled.",
        "2",
        "12"
    ),
    (
        "15.15",
        "제1515호: 그 밖의 고정된 식물성 유지와 이들의 분획물. 이 호에는 화학적 변성이 없는 공업용 정제 피마자유(Castor oil, 제1515.30호)를 분류한다.",
        "Heading 15.15: Other fixed vegetable or microbial fats and oils, including castor oil.",
        "3",
        "15"
    ),
    (
        "17.04",
        "제1704호: 설탕과자(코코아를 함유한 것은 제외하며 화이트초콜릿을 포함한다). 이 호에는 천연 벌꿀이 첨가된 단단한 설탕 캔디(Hard candy, 제1704.90호)를 분류한다.",
        "Heading 17.04: Sugar confectionery (including white chocolate), not containing cocoa, including honey hard candies.",
        "4",
        "17"
    ),
    (
        "18.05",
        "제1805호: 코코아 가루(설탕이나 그 밖의 감미료를 첨가한 것은 제외한다). 이 호에는 설탕이나 감미료가 첨가되지 않은 순수 무가당 코코아 분말(Pure cocoa powder, 제1805.00호)을 분류한다.",
        "Heading 18.05: Cocoa powder, not containing added sugar or other sweetening matter.",
        "4",
        "18"
    ),
    (
        "19.02",
        "제1902호: 파스타(스파게티ㆍ마카로니ㆍ누들 등)와 쿠스쿠스. 이 호에는 기름에 튀기지 않고 증숙 후 열풍 건조한 파스타형 라면 건면(제1902.19호 또는 제1902.30호)을 분류한다.",
        "Heading 19.02: Pasta, whether or not cooked or stuffed, including non-fried dried ramen noodles.",
        "4",
        "19"
    ),
    (
        "20.01",
        "제2001호: 식초나 초산으로 조제하거나 저장처리한 채소ㆍ과실ㆍ견과류와 그 밖의 식용 식물의 부분. 이 호에는 식초에 절여 밀폐 용기에 담은 오이 피클(Cucumber pickles in vinegar, 제2001.10호)을 분류한다.",
        "Heading 20.01: Vegetables, fruit, nuts and other edible parts of plants, prepared or preserved by vinegar or acetic acid, including cucumber pickles.",
        "4",
        "20"
    ),
    (
        "21.03",
        "제2103호: 소스와 소스용 조제품, 혼합 조미료, 겨자가루와 조제한 겨자. 이 호에는 식염, MSG, 쇠고기 분말 등을 혼합한 복합 분말 조미료(다시다류, 제2103.90호)를 분류한다.",
        "Heading 21.03: Sauces and preparations therefor; mixed condiments and mixed seasonings.",
        "4",
        "21"
    ),
    (
        "22.01",
        "제2201호: 생수ㆍ광천수ㆍ탄산수(설탕이나 그 밖의 감미료나 맛이나 향을 첨가하지 않은 것으로 한정한다). 이 호에는 무가당 무착향 천연 탄산수(Sparkling mineral water, 제2201.10호)를 분류한다.",
        "Heading 22.01: Waters, including natural or artificial mineral waters and aerated waters, not containing added sugar or other sweetening matter nor flavoured.",
        "4",
        "22"
    ),
    (
        "24.02",
        "제2402호: 시가(cigar)ㆍ시가를로(cigarillo)ㆍ클레텍(kretek)ㆍ궐련(담배나 담배 대용물로 만든 것으로 한정한다). 이 호에는 연초 잎과 아세테이트 필터로 제조된 연소 흡연용 일반 궐련 담배(Cigarettes, 제2402.20호)를 분류한다.",
        "Heading 24.02: Cigars, cheroots, cigarillos and cigarettes, of tobacco or of tobacco substitutes.",
        "4",
        "24"
    ),
    (
        "25.05",
        "제2505호: 천연 모래(금속을 함유하는 모래는 제외한다). 이 호에는 유리 제조 및 주조용 몰드 제작용 천연 규사(Silica sands, 제2505.10호)를 분류한다.",
        "Heading 25.05: Natural sands of all kinds, whether or not coloured, other than metalbearing sands, including silica sands and quartz sands.",
        "5",
        "25"
    ),
    (
        "28.12",
        "제2812호: 비금속의 할로겐화물과 산화할로겐화물. 이 호에는 반도체 식각용 고순도 육불화황(Sulfur hexafluoride, SF6, 제2812.90호) 가스를 분류한다.",
        "Heading 28.12: Halides and halide oxides of non-metals, including sulfur hexafluoride (SF6).",
        "6",
        "28"
    ),
    (
        "32.08",
        "제3208호: 페인트와 바니시(합성 중합체나 화학적으로 변성 가공한 천연 중합체를 기본 재료로 하여 비수성 매질에 분산하거나 용해한 것으로 한정한다). 이 호에는 유기용제 분산 에폭시 수지 방청 도료(Epoxy paint, 제3208.90호)를 분류한다.",
        "Heading 32.08: Paints and varnishes based on synthetic polymers or chemically modified natural polymers, dispersed or dissolved in a non-aqueous medium.",
        "6",
        "32"
    ),
    (
        "34.02",
        "제3402호: 유기계면활성제(비누는 제외한다), 조제 계면활성제, 조제 세제, 조제 청정제. 이 호에는 양이온 계면활성제를 주성분으로 한 의류용 액상 섬유 유연제(Fabric softener, 제3402.50호/90호)를 분류한다.",
        "Heading 34.02: Organic surface-active agents; surface-active preparations, washing preparations and cleaning preparations, including fabric softeners.",
        "6",
        "34"
    ),
    (
        "39.20",
        "제3920호: 플라스틱으로 만든 그 밖의 판ㆍ시트(sheet)ㆍ필름ㆍ박(foil)ㆍ스트립(비다공성이며 다른 재료로 보강ㆍ적층ㆍ지지하거나 이와 유사하게 결합하지 않은 것으로 한정한다). 다공성 에틸렌 중합체 필름(이차전지 PE 분리막, 제3920.10호)을 포함한다.",
        "Heading 39.20: Other plates, sheets, film, foil and strip, of plastics, non-cellular and not reinforced, laminated, supported or similarly combined with other materials, including microporous PE separator films.",
        "7",
        "39"
    ),
    (
        "40.15",
        "제4015호: 의류와 의류 부속품(장갑ㆍ벙어리장갑류를 포함하며 경질고무 외의 가황고무로 만든 것으로서 모든 용도에 사용하는 것으로 한정한다). 이 호에는 의료 수술용 천연 가황 라텍스 멸균 검진 장갑(Surgical gloves, 제4015.12호)을 분류한다.",
        "Heading 40.15: Articles of apparel and clothing accessories (including gloves, mittens and mitts), for all purposes, of vulcanised rubber other than hard rubber, including surgical gloves.",
        "7",
        "40"
    ),
    (
        "62.14",
        "제6214호: 숄ㆍ스카프ㆍ머플러ㆍ만틸라(mantilla)ㆍ베일(veil)과 이와 유사한 물품. 이 호에는 견직물 원단 가장자리를 봉제 마감한 100% 천연 실크 스카프 완제품(Silk scarf, 제6214.10호)을 분류한다.",
        "Heading 62.14: Shawls, scarves, mufflers, mantillas, veils and the like, including 100% silk printed scarves.",
        "11",
        "62"
    ),
    (
        "64.03",
        "제6403호: 신발류(바깥 바닥을 고무ㆍ플라스틱ㆍ가죽ㆍ조성 가죽으로 만들고 갑피를 가죽으로 만든 것으로 한정한다). 이 호에는 천연 소가죽 스웨이드 갑피를 갖춘 여성용 앵클부츠(제6403.51호/91호)를 분류한다.",
        "Heading 64.03: Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of leather, including suede ankle boots.",
        "12",
        "64"
    ),
    (
        "70.07",
        "제7007호: 안전유리(강화유리나 접합유리로 된 것으로 한정한다). 이 호에는 폴더블 디스플레이 표면 보호용 초박형 화학강화 유리 윈도우(UTG, Ultra Thin Glass, 제7007.19호)를 분류한다.",
        "Heading 7007: Safety glass, consisting of toughened (tempered) or laminated glass, including ultra-thin chemically tempered glass (UTG).",
        "13",
        "70"
    ),
    (
        "72.02",
        "제7202호: 합금철. 이 호에는 제강용 고탄소 페로크롬(Ferro-chromium, 제7202.41호) 합금철 덩어리를 분류한다.",
        "Heading 72.02: Ferro-alloys, including ferro-chromium.",
        "15",
        "72"
    ),
    (
        "74.10",
        "제7410호: 동박(구리박)(두께가 0.15밀리미터 이하인 것으로 한정하며, 인쇄했거나 뒷면을 종이ㆍ판지ㆍ플라스틱이나 이와 유사한 보강재료로 보강한 것인지에 상관없다). 이 호에는 폴리이미드 필름으로 뒷면을 보강한 연성회로기판용 2층 동박적층판(FCCL, 제7410.21호)을 분류한다.",
        "Heading 74.10: Copper foil (whether or not printed or backed with paper, paperboard, plastics or similar backing materials) of a thickness not exceeding 0.15 mm, including flexible copper clad laminate (FCCL).",
        "15",
        "74"
    ),
    (
        "76.06",
        "제7606호: 알루미늄 판ㆍ시트ㆍ스트립(두께가 0.2밀리미터를 초과하는 것으로 한정한다). 이 호에는 알루미늄 판 사이에 난연 수지 코어를 결합한 건축용 알루미늄 복합 패널(제7606.12호 또는 제7610호)을 분류한다.",
        "Heading 76.06: Aluminium plates, sheets and strip, of a thickness exceeding 0.2 mm, including aluminium composite panels.",
        "15",
        "76"
    ),
    (
        "84.13",
        "제8413호: 액체펌프(계량장치를 갖추었는지에 상관없다)와 액체엘리베이터. 이 호에는 건설 중장비 유압 구동용 액시얼 피스톤 유압 펌프(Axial piston pump, 제8413.50호/60호)를 분류한다.",
        "Heading 84.13: Pumps for liquids, whether or not fitted with a measuring device; liquid elevators, including hydraulic axial piston pumps.",
        "16",
        "84"
    ),
    (
        "84.43",
        "제8443호: 인쇄기(인쇄용 판ㆍ실린더와 그 밖의 인쇄용 구성요소를 사용하여 인쇄하는 기계로 한정한다). 이 호에는 포장 필름 표면에 연속 다색 인쇄를 수행하는 롤투롤 그라비아 인쇄기(Gravure printing machine, 제8443.19호)를 분류한다.",
        "Heading 84.43: Printing machinery used for printing by means of plates, cylinders and other printing components, including gravure printing machines.",
        "16",
        "84"
    ),
    (
        "84.57",
        "제8457호: 머시닝센터ㆍ유닛컨스트럭션머신(싱글스테이션)ㆍ멀티스테이션 트랜스퍼머신(금속가공용으로 한정한다). 이 호에는 자동 공구교환장치를 갖춘 5축 수직형 머시닝 센터(Machining center, 제8457.10호)를 분류한다.",
        "Heading 84.57: Machining centres, unit construction machines (single station) and multi-station transfer machines, for working metal.",
        "16",
        "84"
    ),
    (
        "85.01",
        "제8501호: 전동기와 발전기(발전세트는 제외한다). 이 호에는 전기차 바퀴 구동용 영구자석 동기모터(PMSM Drive motor, 제8501.53호)를 분류한다.",
        "Heading 85.01: Electric motors and generators (excluding generating sets), including EV traction drive motors.",
        "16",
        "85"
    ),
    (
        "85.04",
        "제8504호: 변압기ㆍ정지형 변환기(예: 정류기)ㆍ유도자. 이 호에는 154kV 송전용 대용량 변압기(제8504.23호) 및 로봇 모터 제어용 서보 드라이브 인버터(제8504.40호)를 분류한다.",
        "Heading 85.04: Electrical transformers, static converters (for example, rectifiers) and inductors, including high-voltage transformers and servo drive inverters.",
        "16",
        "85"
    ),
    (
        "85.17",
        "제8517호: 전화기(스마트폰 포함)와 기타 송신용ㆍ수신용 기기. 이 호에는 자율주행 차량용 5G 텔레매틱스 무선통신 제어 모듈(TCU, 제8517.62호)을 분류한다.",
        "Heading 85.17: Telephone sets; other apparatus for the transmission or reception of voice, images or other data, including automotive telematics control units (TCU).",
        "16",
        "85"
    ),
    (
        "89.01",
        "제8901호: 순항선ㆍ유람선ㆍ페리보트ㆍ화물선ㆍ부선과 이와 유사한 선박. 이 호에는 해상 컨테이너 화물 운송용 초대형 컨테이너선(Container ships, 제8901.90호)을 분류한다.",
        "Heading 89.01: Cruise ships, excursion boats, ferry-boats, cargo ships, barges and similar vessels, including container ships.",
        "17",
        "89"
    ),
    (
        "90.21",
        "제9021호: 정형외과용 기기(목발ㆍ외과용 벨트ㆍ탈장대를 포함한다), 부목과 그 밖의 골절치료용 기기, 인공의 인체 부분, 보청기와 그 밖의 결함ㆍ장애를 보정하기 위해 착용하거나 휴대하거나 인체에 삽입하는 기기. 이 호에는 치과 보철용 지르코니아 인공치아 크라운(Artificial teeth, 제9021.21호)을 분류한다.",
        "Heading 90.21: Orthopaedic appliances; artificial parts of the body, including artificial teeth and dental fittings (zirconia crowns).",
        "18",
        "90"
    ),
    (
        "90.31",
        "제9031호: 따로 분류되지 않은 측정용이나 검사용 기기(광학식을 포함한다). 이 호에는 자율주행차 주변 환경 인식용 3차원 고체형 라이다(Solid-State LiDAR) 센서(제9031.80호)를 분류한다.",
        "Heading 90.31: Measuring or checking instruments, appliances and machines, not specified or included elsewhere in this Chapter, including automotive LiDAR sensors.",
        "18",
        "90"
    ),
    (
        "91.01",
        "제9101호: 손목시계ㆍ회중시계와 그 밖의 휴대용 시계(케이스에 귀금속이나 귀금속을 입힌 금속을 사용한 것으로 한정한다). 이 호에는 18K 골드 케이스를 사용한 기계식 크로노그래프 고급 손목시계(제9101.21호)를 분류한다.",
        "Heading 91.01: Wrist-watches, pocket-watches and other watches, with case of precious metal or of metal clad with precious metal.",
        "18",
        "91"
    ),
    (
        "94.02",
        "제9402호: 의료용ㆍ외과용ㆍ치과용ㆍ수의과용 가구. 이 호에는 병원 수술실용 전동 유압식 다기능 수술대(Operating tables, 제9402.90호)를 분류한다.",
        "Heading 94.02: Medical, surgical, dental or veterinary furniture, including operating tables.",
        "20",
        "94"
    ),
    (
        "94.05",
        "제9405호: 램프와 조명기구. 이 호에는 공연장 및 방송국 무대 연출용 DMX 제어 고출력 LED 무빙헤드 조명기구(Moving light, 제9405.42호)를 분류한다.",
        "Heading 94.05: Luminaires and lighting fittings including searchlights and spotlights, including DMX-controlled LED moving head lights.",
        "20",
        "94"
    ),
    (
        "95.06",
        "제9506호: 신체훈련ㆍ체조ㆍ육상ㆍ기타 운동이나 옥외 게임에 사용하는 용구. 이 호에는 골프채의 부품인 고탄성 카본 그라파이트 골프채 샤프트(Golf club shafts, 제9506.39호)를 분류한다.",
        "Heading 95.06: Articles and equipment for general physical exercise, gymnastics, athletics, other sports or outdoor games, including golf club shafts.",
        "20",
        "95"
    )
]

def seed_set8():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for heading, ko_text, en_text, sec, chap in SET8_NOTES:
        cursor.execute("SELECT id FROM explanatory_notes WHERE heading = ?", (heading,))
        row = cursor.fetchone()
        if row:
            cursor.execute("""
                UPDATE explanatory_notes 
                SET content_ko = ?, content_en = ?, section = ?, chapter = ?
                WHERE heading = ?
            """, (ko_text, en_text, sec, chap, heading))
            print(f"[UPDATED] Heading {heading}")
        else:
            cursor.execute("""
                INSERT INTO explanatory_notes (heading, content_ko, content_en, section, chapter)
                VALUES (?, ?, ?, ?, ?)
            """, (heading, ko_text, en_text, sec, chap))
            print(f"[INSERTED] Heading {heading}")

    conn.commit()
    conn.close()
    print("Set 8 knowledge seeded successfully into cusway.db!")

if __name__ == "__main__":
    seed_set8()
