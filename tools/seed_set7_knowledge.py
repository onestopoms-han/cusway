# -*- coding: utf-8 -*-
"""
Seed Set 7 missing WCO Explanatory Notes into cusway.db
"""
import sqlite3

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

SET7_NOTES = [
    (
        "02.08",
        "제0208호: 기타 육과 식용 설육(신선, 냉장, 냉동). 이 호에는 제0201호 내지 제0207호에 포함되지 않는 기타 육과 식용 설육을 분류한다. 여기에는 고래고기, 물개고기, 토끼육, 사슴육, 파충류(뱀, 거북), 개구리 다리(Frog legs, 제0208.20호)가 포함된다.",
        "Heading 02.08: Other meat and edible meat offal, fresh, chilled or frozen, including frogs' legs.",
        "1",
        "02"
    ),
    (
        "04.10",
        "제0410호: 따로 분류되지 않은 식용의 동물성 생산품(로열젤리, 곤충 등). 이 호에는 다른 호에 분류되지 않은 인간이 소비하기에 적합한 동물성 생산품을 분류한다. 꿀벌이 분비하는 천연 로열젤리(Royal jelly)는 생것이거나 동결건조 분말상인 것을 불문하고 본 호에 분류한다.",
        "Heading 04.10: Insects and other edible products of animal origin, not elsewhere specified or included, including royal jelly.",
        "1",
        "04"
    ),
    (
        "05.07",
        "제0507호: 상아ㆍ거북의 껍질ㆍ고래수염ㆍ뿔ㆍ사슴뿔(녹용)ㆍ발굽ㆍ발톱ㆍ부리. 이 호에는 사슴의 뿔(녹용, Deer horn/antler, 제0507.90호)을 분류한다. 의약품용이나 한약재용으로 건조하거나 얇게 썬 절편(슬라이스) 가공된 녹용도 본 호에 포함된다.",
        "Heading 05.07: Ivory, tortoise-shell, whalebone and whalebone hair, horns, antlers (deer horns), hooves, nails, claws and beaks.",
        "1",
        "05"
    ),
    (
        "07.12",
        "제0712호: 건조한 채소(원상태인 것, 자른 것, 얇게 썬 것, 부순 것, 가루 모양인 것). 이 호에는 건조한 송로버섯(Truffles, 트러플) 및 건조 버섯류를 분류한다. 슬라이스하여 건조한 블랙 트러플은 제0712.39호에 분류된다.",
        "Heading 07.12: Dried vegetables, whole, cut, sliced, broken or in powder, but not further prepared, including dried truffles.",
        "2",
        "07"
    ),
    (
        "11.02",
        "제1102호: 곡분(밀가루나 메슬린 가루는 제외한다). 이 호에는 밀이나 메슬린 이외의 곡물을 분쇄하여 얻은 곡분을 분류한다. 쌀가루(제1102.90호), 퀴노아 곡분(Quinoa flour, 제1102.90호) 등이 포함된다.",
        "Heading 11.02: Cereal flours other than of wheat or meslin, including quinoa flour.",
        "2",
        "11"
    ),
    (
        "12.07",
        "제1207호: 그 밖의 채종유 종자와 함유성(含油性) 과실. 이 호에는 기름을 추출하거나 식용으로 사용되는 기타 채종유 종자를 분류한다. 치아시드(Chia seed, Salvia hispanica 종자, 제1207.99호) 등이 포함된다.",
        "Heading 12.07: Other oil seeds and oleaginous fruits, whether or not broken, including chia seeds.",
        "2",
        "12"
    ),
    (
        "14.04",
        "제1404호: 따로 분류되지 않은 식물성 생산품(수세미, 면린터 등). 이 호에는 다른 곳에 분류되지 않은 식물성 원료 및 생산품을 분류한다. 건조 천연 수세미(Loofah, Luffa cylindrica)로 만든 세척용 패드 및 가공품은 제1404.90호에 분류된다.",
        "Heading 14.04: Vegetable products not elsewhere specified or included, including loofah (luffa) cleaning pads.",
        "2",
        "14"
    ),
    (
        "16.04",
        "제1604호: 조제하거나 저장처리한 어류, 캐비아와 어란으로 조제한 캐비아 대용물. 이 호에는 식물성 기름에 침지(기름절임)하여 밀폐 용기에 담아 멸균한 훈제 연어 통조림(제1604.11호) 등 모든 조제ㆍ저장처리 어류를 분류한다.",
        "Heading 16.04: Prepared or preserved fish; caviar and caviar substitutes prepared from fish eggs, including salmon canned in oil.",
        "4",
        "16"
    ),
    (
        "18.04",
        "제1804호: 코코아 버터ㆍ코코아 지방ㆍ코코아 오일. 이 호에는 카카오두를 압착하여 얻어지는 코코아 버터(Cocoa butter)를 분류한다. 설탕이나 다른 물질이 첨가되지 않은 순수 코코아 버터 펠릿 및 유지는 제1804.00호에 분류된다.",
        "Heading 18.04: Cocoa butter, fat and oil.",
        "4",
        "18"
    ),
    (
        "20.07",
        "제2007호: 잼ㆍ과실 젤리ㆍ마멀레이드(marmalade)ㆍ과실이나 견과류의 퓨레(purée). 이 호에는 과실을 조리하여 얻은 퓨레(Purée) 및 페이스트를 분류한다. 설탕이 첨가된 냉동 망고 퓨레는 제2007.99호에 분류된다.",
        "Heading 20.07: Jams, fruit jellies, marmalades, fruit or nut puree and fruit or nut pastes, including mango puree.",
        "4",
        "20"
    ),
    (
        "23.03",
        "제2303호: 양조나 증류 박과 웨이스트. 이 호에는 맥주 양조 공정에서 맥아즙을 추출하고 남은 맥주박(Brewers' spent grains) 건조 사료용 부산물을 분류한다(제2303.30호).",
        "Heading 23.03: Brewing or distilling dregs and waste, including dried brewers' spent grains for animal feed.",
        "4",
        "23"
    ),
    (
        "24.04",
        "제2404호: 연소시키지 않고 흡입하도록 만든 제품(전자담배용 스틱). 이 호에는 디바이스에 장착하여 연소 없이 가열 흡입하는 궐련형 전자담배용 담배 스틱(제2404.11호) 및 니코틴 액상을 분류한다.",
        "Heading 24.04: Products containing tobacco, reconstituted tobacco, nicotine, or tobacco substitutes, intended for inhalation without combustion.",
        "4",
        "24"
    ),
    (
        "25.26",
        "제2526호: 천연 동석(steatite)과 활석(talc). 이 호에는 화장품 및 의약품용으로 미분쇄하고 불순물을 정제한 천연 함수 규산마그네슘인 탤크(Talc, 활석 분말, 제2526.20호)를 분류한다.",
        "Heading 25.26: Natural steatite, whether or not roughly trimmed or merely cut; talc, crushed or powdered.",
        "5",
        "25"
    ),
    (
        "32.07",
        "제3207호: 조제 안료ㆍ조제 유광제ㆍ조제 유약ㆍ액상 러스터(luster)와 이와 유사한 조제품. 이 호에는 도자기, 세라믹 타일 표면에 고온 소성 인쇄하기 위해 조제된 무기 착색 잉크 및 액상 러스터를 분류한다.",
        "Heading 32.07: Prepared pigments, prepared opacifiers and prepared colours, vitrifiable enamels and glazes, liquid lustres and similar preparations, including inorganic ceramic inks.",
        "6",
        "32"
    ),
    (
        "34.05",
        "제3405호: 구두약ㆍ가구ㆍ바닥ㆍ차체(coachwork)ㆍ유리ㆍ금속용 광택제와 크림. 이 호에는 자동차 차체 도장면의 광택 및 보호를 위해 실리콘 오일, 왁스, 유화제를 혼합 조제한 액상/페이스트상 광택제(제3405.30호)를 분류한다.",
        "Heading 34.05: Polishes and creams, for footwear, furniture, floors, coachwork, glass or metal, including car body polishes.",
        "6",
        "34"
    ),
    (
        "36.02",
        "제3602호: 조제 폭약(화약은 제외한다). 이 호에는 화학 반응을 통해 질소 가스를 급속 발생시켜 에어백 쿠션을 팽창시키는 에어백용 고체 가스발생제(Gas generant) 정제 및 조제 폭약을 분류한다.",
        "Heading 36.02: Prepared explosives, other than propellent powders, including automotive airbag solid gas generants.",
        "6",
        "36"
    ),
    (
        "37.07",
        "제3707호: 사진용 화학조제품, 사진용으로 미혼합된 물품. 이 호에는 반도체 리소그래피 노광 공정에서 웨이퍼 표면에 미세 회로 패턴을 형성하는 감광액인 포토레지스트(Photoresist, EUV/ArF 레지스트, 제3707.90호)를 분류한다.",
        "Heading 37.07: Chemical preparations for photographic uses, including photoresists for semiconductor EUV lithography.",
        "6",
        "37"
    ),
    (
        "38.01",
        "제3801호: 인조 흑연, 콜로이드 모양이나 반(半)콜로이드 모양 흑연. 이 호에는 석유 코크스 등을 고온 열처리 흑연화하여 인공 제조한 인조 흑연(Artificial graphite, 제3801.10호)을 분류한다. 배터리 음극재용 인조 흑연 분말이 포함된다.",
        "Heading 38.01: Artificial graphite; colloidal or semi-colloidal graphite, including synthetic graphite for battery anodes.",
        "6",
        "38"
    ),
    (
        "38.24",
        "제3824호: 따로 분류되지 않은 화학품과 화학공업 조제품. 이 호에는 반도체 웨이퍼 표면을 나노 단위로 연마하는 화학기계연마용 CMP 슬러리(Chemical Mechanical Planarization Slurry, 제3824.99호)를 분류한다.",
        "Heading 38.24: Prepared binders for foundry moulds; chemical products and preparations of the chemical or allied industries, including semiconductor CMP slurry.",
        "6",
        "38"
    ),
    (
        "48.23",
        "제4823호: 그 밖의 지ㆍ판지ㆍ셀룰로오스워딩과 셀룰로오스섬유의 웹(특정 크기나 모양으로 자른 것). 이 호에는 종이를 나선형으로 말아 성형 가공한 일회용 종이 빨대(Paper drinking straws, 제4823.90호)를 분류한다.",
        "Heading 48.23: Other paper, paperboard, cellulose wadding and webs of cellulose fibres, cut to size or shape, including paper straws.",
        "10",
        "48"
    ),
    (
        "71.10",
        "제7110호: 백금(가공하지 않은 것, 반가공한 것, 분말 모양인 것). 이 호에는 순도 99.99% 이상의 백금(Pt)으로 된 디스크 형태의 반도체 박막 증착용 스퍼터링 타겟(Platinum sputtering target, 제7110.11호/19호)을 분류한다.",
        "Heading 71.10: Platinum, unwrought or in semi-manufactured forms, or in powder form, including platinum sputtering targets.",
        "14",
        "71"
    ),
    (
        "84.86",
        "제8486호: 반도체 디바이스ㆍ전자집적회로ㆍ평판디스플레이 제조용 기계와 기기. 이 호에는 반도체 웨이퍼의 미세 회로 패턴 세정 및 초임계 CO2 건조 기계(제8486.20호)를 분류한다.",
        "Heading 84.86: Machines and apparatus of a kind used solely or principally for the manufacture of semiconductor boules or wafers, semiconductor devices, electronic integrated circuits or flat panel displays.",
        "16",
        "84"
    ),
    (
        "85.42",
        "제8542호: 전자집적회로. 이 호에는 포토다이오드 어레이와 신호처리 회로가 하나의 실리콘 칩에 집적된 반도체 CMOS 이미지 센서(CIS, 제8542.39호)를 분류한다.",
        "Heading 85.42: Electronic integrated circuits, including CMOS image sensors (CIS).",
        "16",
        "85"
    ),
    (
        "90.18",
        "제9018호: 내과용ㆍ외과용ㆍ치과용ㆍ수의과용 기기. 이 호에는 초전도 마그넷과 RF 코일을 사용하는 병원 진단용 자기공명영상장치(MRI, Magnetic Resonance Imaging, 제9018.13호)를 분류한다.",
        "Heading 90.18: Instruments and appliances used in medical, surgical, dental or veterinary sciences, including magnetic resonance imaging (MRI) apparatus.",
        "18",
        "90"
    ),
    (
        "95.04",
        "제9504호: 비디오 게임 콘솔과 비디오 게임기, 당구용구, 카지노용 특수 테이블 게임용품. 이 호에는 동전이나 요금을 투입하여 작동하는 오락실용 아케이드 비디오 게임기 및 모션 체감형 VR 시뮬레이터 게임기(제9504.30호)를 분류한다.",
        "Heading 95.04: Video game consoles and machines, table or parlour games, including coin-operated arcade game machines and VR simulators.",
        "20",
        "95"
    )
]

def seed_set7():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for heading, ko_text, en_text, sec, chap in SET7_NOTES:
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
    print("Set 7 knowledge seeded successfully into cusway.db!")

if __name__ == "__main__":
    seed_set7()
