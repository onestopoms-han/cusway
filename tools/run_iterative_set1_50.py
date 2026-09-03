# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 1 Iterative 50 New Representative Products Benchmark
Runs automated classification and validates accuracy against WCO / Korea Customs Service tariff standards.
"""
import sys
import os
import time
import json
import sqlite3

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

# 50 Carefully Curated New Diverse Representative Customs Items
SET1_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "동결건조 딸기 슬라이스",
        "material": "신선 딸기 100% (수분 2% 이하 동결건조)",
        "function": "제과용 토핑 및 그대로 섭취하는 건조 과실",
        "expected_chapter": "08",
        "expected_heading": "0813"
    },
    {
        "id": 2,
        "name": "초임계 추출 바닐라 엑기스 향료",
        "material": "바닐라빈 에탄올 추출액 (에탄올 35%, 바닐린 농축액)",
        "function": "식품 조리 및 제과제빵용 천연 착향료",
        "expected_chapter": "33",
        "expected_heading": "3302"
    },
    {
        "id": 3,
        "name": "훈제 연어 필레 가공품",
        "material": "대서양 연어 98%, 정제소금 2% (냉훈 가공)",
        "function": "즉석 섭취용 훈제 생선 수산가공품",
        "expected_chapter": "03",
        "expected_heading": "0305"
    },
    {
        "id": 4,
        "name": "압착 올리브 엑스트라 버진 오일",
        "material": "올리브 열매 100% 물리적 저온 압착유",
        "function": "식용 샐러드 드레싱 및 조리용 미정제 올리브유",
        "expected_chapter": "15",
        "expected_heading": "1509"
    },
    {
        "id": 5,
        "name": "천연 사탕수수 유기농 흑당 시럽",
        "material": "사탕수수 즙 농축액 100% (자당 함량 70% 이상)",
        "function": "음료 제조 및 디저트용 액상 천연 당류",
        "expected_chapter": "17",
        "expected_heading": "1702"
    },
    {
        "id": 6,
        "name": "유기농 인스턴트 건조 녹차 분말",
        "material": "녹차잎 열수추출 고형분 100% (말차 아님)",
        "function": "물에 즉시 용해되는 인스턴트 티 음료 베이스",
        "expected_chapter": "21",
        "expected_heading": "2101"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "고순도 합성 리튬 탄산염 분말",
        "material": "탄산리튬(Li2CO3) 화학적 순도 99.9% 분말",
        "function": "2차전지 양극재 합성용 무기 화학 원료",
        "expected_chapter": "28",
        "expected_heading": "2836"
    },
    {
        "id": 8,
        "name": "디스플레이 세정용 이소프로필알코올(IPA)",
        "material": "2-프로판올(IPA) 고순도 99.99%",
        "function": "전자 정밀 회로 및 디스플레이 패널 세정용 무수 유기용제",
        "expected_chapter": "29",
        "expected_heading": "2905"
    },
    {
        "id": 9,
        "name": "동물용 광견병 불활화 백신 주사제",
        "material": "불활화 광견병 바이러스 항원, 멸균 주사용수",
        "function": "반려견/가축 광견병 예방 면역 주사제",
        "expected_chapter": "30",
        "expected_heading": "3002"
    },
    {
        "id": 10,
        "name": "자외선 차단 선스틱 밤",
        "material": "징크옥사이드, 합성 왁스, 실리카, 식물성 오일 (SPF50+)",
        "function": "자외선 차단 및 피부 보호 스틱형 화장품",
        "expected_chapter": "33",
        "expected_heading": "3304"
    },
    {
        "id": 11,
        "name": "생분해성 PLA 사출용 펠릿 수지",
        "material": "폴리락트산(Polylactic Acid) 100% 1차제품 펠릿",
        "function": "친환경 일회용품 성형 가공용 플라스틱 원료",
        "expected_chapter": "39",
        "expected_heading": "3907"
    },
    {
        "id": 12,
        "name": "자동차 엔진룸용 불소고무(FKM) 가스켓",
        "material": "가황 불소계 합성고무 성형품",
        "function": "내열/내유 엔진 오일 밀폐용 씰 가스켓",
        "expected_chapter": "40",
        "expected_heading": "4016"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "크롬 탄닝 마감 암소 은면 가죽",
        "material": "소 가죽(Bovine leather) 크롬 유연 완제 은면가죽",
        "function": "고급 핸드백 및 가죽 잡화 제조용 원단",
        "expected_chapter": "41",
        "expected_heading": "4107"
    },
    {
        "id": 14,
        "name": "천연 양가죽 방한 장갑",
        "material": "천연 양가죽 겉감, 보온 양모 안감",
        "function": "손 착용 방한 및 외출용 천연 가죽 장갑",
        "expected_chapter": "42",
        "expected_heading": "4203"
    },
    {
        "id": 15,
        "name": "친환경 골판지 조립식 포장 상자",
        "material": "다층 골판지(Corrugated paperboard) 100%",
        "function": "물류 택배 배송용 포장 박스",
        "expected_chapter": "48",
        "expected_heading": "4819"
    },
    {
        "id": 16,
        "name": "아동용 컬러 그림책",
        "material": "아트지, 컬러 오프셋 인쇄, 하드커버 제본",
        "function": "유아 및 아동용 인쇄 그림 도서",
        "expected_chapter": "49",
        "expected_heading": "4903"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "탄소섬유 연속 필라멘트 토우 원사",
        "material": "폴리아크릴로니트릴(PAN)계 고강도 탄소섬유 100%",
        "function": "항공 및 고기능성 복합소재 직조용 보강 원사",
        "expected_chapter": "68",
        "expected_heading": "6815"
    },
    {
        "id": 18,
        "name": "방염 아라미드(Kevlar) 직조 직물",
        "material": "파라-아라미드 방적사 100% 평직 직물",
        "function": "소방관 방화복 및 방탄복 외피용 특수 직물",
        "expected_chapter": "55",
        "expected_heading": "5515"
    },
    {
        "id": 19,
        "name": "남성 순모 메리노울 니트 스웨터",
        "material": "메리노 양모 편직물(Knitted) 100%",
        "function": "상반신 착용 보온용 편물 니트 풀오버",
        "expected_chapter": "61",
        "expected_heading": "6110"
    },
    {
        "id": 20,
        "name": "여성용 폴리에스테르 방수 트렌치코트",
        "material": "폴리에스테르 직조 직물(Woven), 방수 발수 코팅",
        "function": "여성 외출용 방수 방풍 외투 코트",
        "expected_chapter": "62",
        "expected_heading": "6202"
    },
    {
        "id": 21,
        "name": "프로 스포츠용 쿠셔닝 런닝화",
        "material": "갑피: 메쉬 섬유 및 인조가죽 / 밑창: 고무 및 EVA 폼",
        "function": "달리기 및 육상 운동용 스포츠 신발",
        "expected_chapter": "64",
        "expected_heading": "6404"
    },
    {
        "id": 22,
        "name": "산업 현장용 안전 보호 헬멧",
        "material": "고밀도 ABS 수지 쉘, 충격 흡수 라이너, 턱끈",
        "function": "건설/공장 작업장 낙하물 충격 방지 머리 보호구",
        "expected_chapter": "65",
        "expected_heading": "6506"
    },

    # 5. 유리, 도자, 보석, 철강/금속군 (Ch 69 - 83)
    {
        "id": 23,
        "name": "식탁용 도자기 커피 머그컵",
        "material": "경질 자기(Porcelain) 100%",
        "function": "가정 및 카페 음료 음용용 도자기 잔",
        "expected_chapter": "69",
        "expected_heading": "6911"
    },
    {
        "id": 24,
        "name": "스마트폰 카메라용 광학 유리 렌즈 블랭크",
        "material": "고굴절 광학 유리(Optical glass) 성형물 (광학 연마 전)",
        "function": "정밀 카메라 렌즈 가공용 원형 유리 블랭크",
        "expected_chapter": "70",
        "expected_heading": "7014"
    },
    {
        "id": 25,
        "name": "전기차 모터용 무방향성 전기강판 코일",
        "material": "규소 3.0% 함유 합금강판 (폭 1,000mm 롤 코일)",
        "function": "구동 모터 코어 적층용 고효율 전자기 강판",
        "expected_chapter": "72",
        "expected_heading": "7225"
    },
    {
        "id": 26,
        "name": "건축 배관용 이음매 없는 스테인리스 파이프",
        "material": "SUS316L 스테인리스 스틸 무계목(Seamless) 관",
        "function": "부식성 유체 및 고압 배관용 금속 관",
        "expected_chapter": "73",
        "expected_heading": "7304"
    },
    {
        "id": 27,
        "name": "반도체 패키징용 초미세 순금(Gold) 본딩 와이어",
        "material": "순금(Au) 99.99% 극세선 (직경 18㎛)",
        "function": "반도체 칩 다이와 리드프레임 전기적 연결용 본딩 선",
        "expected_chapter": "71",
        "expected_heading": "7108"
    },
    {
        "id": 28,
        "name": "알루미늄 압출 창호용 형재 프레임",
        "material": "알루미늄 6063 합금 압출 중공 형재",
        "function": "건축용 단열 창호 및 유리 지지 프레임",
        "expected_chapter": "76",
        "expected_heading": "7604"
    },
    {
        "id": 29,
        "name": "초경 합금 CNC 절삭 인서트 팁",
        "material": "탄화텅스텐(WC) 90%, 코발트(Co) 10% 소결 서멧",
        "function": "금속 공작기계 선반/밀링 바이트용 교체형 절삭 공구",
        "expected_chapter": "82",
        "expected_heading": "8209"
    },
    {
        "id": 30,
        "name": "디지털 전자 도어락 잠금장치",
        "material": "아연 다이캐스팅 바디, 전자 솔레노이드 락, 터치패드",
        "function": "출입문 비밀번호 및 카드키 전자 제어 잠금장치",
        "expected_chapter": "83",
        "expected_heading": "8301"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "수소차용 초고압 왕복동 기체 압축기",
        "material": "단조강 실린더, 피스톤, 냉각 자켓 (토출압력 900bar)",
        "function": "수소충전소용 수소가스 초고압 압축 공급 펌프/압축기",
        "expected_chapter": "84",
        "expected_heading": "8414"
    },
    {
        "id": 32,
        "name": "반도체 클린룸용 HEPA FFU 팬필터유닛",
        "material": "알루미늄 외장, 원심 송풍 팬, 초고성능 유리섬유 필터",
        "function": "반도체 라인 천장에서 공기 중 미립자를 여과/순환하는 공기청정 기계",
        "expected_chapter": "84",
        "expected_heading": "8421"
    },
    {
        "id": 33,
        "name": "스마트 물류창고용 갠트리형 이송 로봇",
        "material": "알루미늄 갠트리 레일, 서보 액추에이터, 흡착식 그리퍼",
        "function": "물류 팔레트 간 박스를 자동 적재 및 이송하는 기계 장치",
        "expected_chapter": "84",
        "expected_heading": "8428"
    },
    {
        "id": 34,
        "name": "CNC 5축 수직형 머시닝센터 공작기계",
        "material": "주철 베드, 고속 스핀들(20000rpm), ATC 공구교환장치",
        "function": "컴퓨터 수치제어로 금속 부품을 5축 절삭 가공하는 공작기계",
        "expected_chapter": "84",
        "expected_heading": "8457"
    },
    {
        "id": 35,
        "name": "반도체 웨이퍼 화학기계적 연마기 (CMP 장비)",
        "material": "연마 플래튼, 웨이퍼 캐리어 헤드, 슬러리 분사 노즐",
        "function": "반도체 제조공정 중 실리콘 웨이퍼 박막 표면을 평탄화 연마하는 기계",
        "expected_chapter": "84",
        "expected_heading": "8486"
    },
    {
        "id": 36,
        "name": "산업용 로봇 관절용 정밀 하모닉 감속기",
        "material": "합금강 플렉스플라인, 서큘러 스플라인, 웨이브 제너레이터",
        "function": "모터의 고속 회전을 극초정밀 감속하여 백래시를 억제하는 전동기구",
        "expected_chapter": "84",
        "expected_heading": "8483"
    },

    # 7. 전기, 전자, 음향, 영상기기 (Ch 85)
    {
        "id": 37,
        "name": "전기차 급속 충전용 SiC 전력 모듈",
        "material": "탄화규소(SiC) MOSFET 칩, 세라믹 DBC 기판, 몰딩 수지",
        "function": "고전압 직류/교류 전력 변환 및 스위칭을 제어하는 반도체 소자 모듈",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 38,
        "name": "전기차용 원통형 4680 리튬이온 배터리 셀",
        "material": "하이니켈 NCM 양극재, 실리콘 음극재, 원통형 스틸 캔",
        "function": "전기자동차에 전력을 공급하는 충전식 2차전지 축전지",
        "expected_chapter": "85",
        "expected_heading": "8507"
    },
    {
        "id": 39,
        "name": "AI 연산 가속용 HBM3E 메모리 반도체 칩",
        "material": "실리콘 다이 적층, TSV 관통전극, 마이크로 범프",
        "function": "GPU 옆에 초근접 실장되어 초대용량 데이터를 고속 전송하는 집적회로",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 40,
        "name": "무선 능동형 노이즈캔슬링(ANC) 블루투스 이어폰",
        "material": "초소형 다이내믹 드라이버, ANC 마이크, 블루투스 SoC, 배터리",
        "function": "스마트폰 음향을 무선 수신하여 귀에 재생하는 헤드폰/이어폰",
        "expected_chapter": "85",
        "expected_heading": "8518"
    },
    {
        "id": 41,
        "name": "차량용 77GHz 밀리미터파 ADAS 레이더 센서",
        "material": "RF 트랜시버 칩셋, 평면 패치 안테나, 레이돔 하우징",
        "function": "차량 전방 물체의 거리/속도를 전파로 감지하는 전파탐지 무선기기",
        "expected_chapter": "85",
        "expected_heading": "8526"
    },
    {
        "id": 42,
        "name": "회의실용 85인치 4K UHD 스마트 인터랙티브 디스플레이",
        "material": "85인치 액정 디스플레이(LCD) 패널, 터치 센서, 비디오 프로세서",
        "function": "컴퓨터 화면 표시 및 화상회의 영상을 수신하여 표출하는 모니터/디스플레이",
        "expected_chapter": "85",
        "expected_heading": "8528"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/완구/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "도심 배송용 친환경 순수 전기 트럭 (총중량 3.5톤)",
        "material": "고장력 강판 프레임, 150kW 구동 모터, 80kWh LFP 배터리",
        "function": "화물 운송용 순수 모터 구동 4륜 전기 화물자동차",
        "expected_chapter": "87",
        "expected_heading": "8704"
    },
    {
        "id": 44,
        "name": "농업용 자율비행 살포 드론 (무게 24kg)",
        "material": "탄소섬유 암, 8축 브러시리스 모터, RTK-GPS, 16L 약제 탱크",
        "function": "조종사 탑승 없이 원격/자율비행하여 농약을 분무하는 무인항공기",
        "expected_chapter": "88",
        "expected_heading": "8806"
    },
    {
        "id": 45,
        "name": "병원용 이동식 디지털 X선 진단 촬영기",
        "material": "X선 튜브 제너레이터, 플랫패널 디지털 검출기(FPD), 이동 카트",
        "function": "인체 흉부 및 골절 부위를 X선 조사하여 방사선 진단 영상을 얻는 의료기기",
        "expected_chapter": "90",
        "expected_heading": "9022"
    },
    {
        "id": 46,
        "name": "산업 현장용 비접촉 적외선 열화상 카메라",
        "material": "비냉각 마이크로볼로미터 적외선 검출기, 게르마늄 렌즈, 디스플레이",
        "function": "설비 발열 온도를 원격 측정하여 열화상 이미지로 표시하는 온도측정기",
        "expected_chapter": "90",
        "expected_heading": "9025"
    },
    {
        "id": 47,
        "name": "기계식 자동 오토매틱 손목시계",
        "material": "316L 스테인리스 스틸 케이스, 기계식 로터 무브먼트, 사파이어 크리스탈",
        "function": "손목에 착용하여 태엽과 로터의 기계적 진동으로 시간을 표시하는 시계",
        "expected_chapter": "91",
        "expected_heading": "9102"
    },
    {
        "id": 48,
        "name": "음향 무대용 88건반 디지털 전자 피아노",
        "material": "해머 액션 88건반, PCM 음원 DSP 칩셋, 앰프 및 스피커 내장",
        "function": "건반 터치를 감지하여 전자적으로 합성된 악기음을 출력하는 전자악기",
        "expected_chapter": "92",
        "expected_heading": "9207"
    },
    {
        "id": 49,
        "name": "어린이 놀이용 브릭 조립 블록 세트",
        "material": "ABS 플라스틱 사출 성형 블록 부품 500피스",
        "function": "아동이 손으로 결합하여 구조물을 만드는 조립 완구",
        "expected_chapter": "95",
        "expected_heading": "9503"
    },
    {
        "id": 50,
        "name": "사무용 유성 겔 잉크 볼펜 (팁 직경 0.5mm)",
        "material": "텅스텐 카바이드 볼 팁, 플라스틱 배럴, 유성 겔 잉크",
        "function": "종이에 잉크를묻혀 필기하는 볼포인트 펜",
        "expected_chapter": "96",
        "expected_heading": "9608"
    }
]

def run_set1_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 1] 50개 신규 대표 수출입 품목 AI 정밀 품목분류 자동 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET1_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET1_50_ITEMS, 1):
        p_name = item["name"]
        p_mat = item["material"]
        p_func = item["function"]
        exp_ch = item["expected_chapter"]
        exp_hd = item["expected_heading"]

        # Run AI Classification
        res = AICustomsClassificationProcessor.run_classification_pipeline(
            product_name=p_name,
            material=p_mat,
            function_use=p_func,
            db=db
        )

        pred_code = res.get("recommendedHsCode", "0000.00-0000")
        clean_code = pred_code.replace(".", "").replace("-", "").strip()
        pred_ch = clean_code[:2]
        pred_hd = clean_code[:4]

        # Validate Chapter and Heading
        ch_match = (pred_ch == exp_ch) if isinstance(exp_ch, str) else (pred_ch in exp_ch)
        hd_match = (pred_hd == exp_hd) if isinstance(exp_hd, str) else (pred_hd in exp_hd)

        is_passed = ch_match and hd_match

        status_str = "✅ PASS" if is_passed else "❌ FAIL"
        if is_passed:
            passed_count += 1
            print(f"[{idx:02d}/50] {status_str} | {p_name} -> AI: {pred_code} (예상: {exp_hd})", flush=True)
        else:
            print(f"[{idx:02d}/50] {status_str} | {p_name}", flush=True)
            print(f"       -> 판정 세번: {pred_code} (분류 류/호: {pred_hd})", flush=True)
            print(f"       -> 예상 기준: 제{exp_ch}류 / 제{exp_hd}호", flush=True)
            print(f"       -> 법적 논리: {res.get('legalReasoning', '')[:100]}...", flush=True)
            failed_items.append({
                "item": item,
                "predicted_code": pred_code,
                "predicted_hd": pred_hd,
                "expected_hd": exp_hd,
                "result": res
            })

    elapsed = time.time() - start_time
    total = len(SET1_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 1 결과 요약] 검증 완료!", flush=True)
    print(f"총 품목 수: {total}개 | 통과: {passed_count}개 | 실패: {len(failed_items)}개", flush=True)
    print(f"정확도: {acc:.1f}% | 오류율: {err_rate:.1f}% | 소요 시간: {elapsed:.2f}초", flush=True)
    print("=" * 105, flush=True)

    if failed_items:
        print("\n[오류 항목 상세 분석 리스트]")
        for f in failed_items:
            it = f["item"]
            print(f"- No.{it['id']} [{it['name']}]: 판정={f['predicted_code']} (호: {f['predicted_hd']}) vs 기대={f['expected_hd']}")
            print(f"  재질/용도: {it['material']} / {it['function']}")
            
    db.close()
    return passed_count, failed_items

if __name__ == "__main__":
    run_set1_test()
