# -*- coding: utf-8 -*-
"""
CUSWAY 2026 AI Engine: Set 2 Iterative 50 New Diverse Representative Products Benchmark
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

# 50 Completely New Curated Diverse Customs Items (Set 2)
SET2_50_ITEMS = [
    # 1. 농축수산 및 식료품군 (Ch 01 - 24)
    {
        "id": 1,
        "name": "동결건조 두리안 과육 스낵",
        "material": "두리안 과육 100% (동결건조)",
        "function": "스낵 및 제과용 건조 과실 가공품",
        "expected_chapter": "08",
        "expected_heading": "0813"
    },
    {
        "id": 2,
        "name": "냉동 자숙 자이언트 문어 다리",
        "material": "문어 100% (열수 자숙 데침 후 급속 냉동)",
        "function": "식용 냉동 연체동물 수산물",
        "expected_chapter": "03",
        "expected_heading": "0307"
    },
    {
        "id": 3,
        "name": "천연 유기농 블루 아가베 시럽",
        "material": "아가베 선인장 착즙 농축액 100% (과당 시럽)",
        "function": "음료 및 베이킹용 액상 천연 감미료 당시럽",
        "expected_chapter": "17",
        "expected_heading": "1702"
    },
    {
        "id": 4,
        "name": "식물성 무가당 귀리 오트 음료",
        "material": "귀리 추출액 90%, 정제수, 식물성 유지, 탄산칼슘",
        "function": "우유 대체용 식물성 곡물 음료",
        "expected_chapter": "22",
        "expected_heading": "2202"
    },
    {
        "id": 5,
        "name": "저온 압착 엑스트라 버진 아보카도 오일",
        "material": "아보카도 과육 100% 비가열 압착 식물성 기름",
        "function": "식용 샐러드 드레싱 및 조리용 식물성 유지",
        "expected_chapter": "15",
        "expected_heading": "1515"
    },
    {
        "id": 6,
        "name": "분무 건조 가공 유청 분말",
        "material": "우유 유청 단백질 농축 분말 (단백질 80%)",
        "function": "식품 제조 및 스포츠 단백질 보충 원료",
        "expected_chapter": "04",
        "expected_heading": "0404"
    },

    # 2. 광물, 화학, 의약, 플라스틱/고무군 (Ch 25 - 40)
    {
        "id": 7,
        "name": "공업용 정전 분체 도장용 에폭시 수지 분말",
        "material": "에폭시 수지, 경화제, 안료 조제품 (분말 상태)",
        "function": "금속 표면 정전 분체 도장용 유기 합성 페인트 도료",
        "expected_chapter": "32",
        "expected_heading": "3208"
    },
    {
        "id": 8,
        "name": "금속 가공용 수용성 절삭유 조제품",
        "material": "광물유 60%, 합성 계면활성제, 방청제, 정제수",
        "function": "금속 절삭/연삭 공정용 냉각 윤활 조제품",
        "expected_chapter": "34",
        "expected_heading": "3403"
    },
    {
        "id": 9,
        "name": "금연 보조용 니코틴 경피 흡수 패치",
        "material": "니코틴 활성성분, 점착제, 방출 조절막 (소매용 포장)",
        "function": "피부 부착용 금연 치료 의약품",
        "expected_chapter": "30",
        "expected_heading": "3004"
    },
    {
        "id": 10,
        "name": "병원 수술용 멸균 면 거즈 패드",
        "material": "탈지 표백 면직물 100% (소매용 멸균 개별포장)",
        "function": "외과 수술 및 창상 드레싱용 의료용 거즈",
        "expected_chapter": "30",
        "expected_heading": "3005"
    },
    {
        "id": 11,
        "name": "광학용 고투명 폴리카보네이트(PC) 펠릿",
        "material": "폴리카보네이트 100% (1차제품 펠릿)",
        "function": "자동차 헤드램프 및 렌즈 사출 성형용 플라스틱 수지 원료",
        "expected_chapter": "39",
        "expected_heading": "3907"
    },
    {
        "id": 12,
        "name": "전자기 차폐용 전도성 실리콘 고무 가스켓",
        "material": "니켈-흑연 입자 충전 가황 실리콘 고무 성형품",
        "function": "통신장비 외함의 전자파(EMI) 차폐 및 방수 씰링 패킹",
        "expected_chapter": "40",
        "expected_heading": "4016"
    },

    # 3. 원피, 가죽, 목재, 지류군 (Ch 41 - 49)
    {
        "id": 13,
        "name": "식물성 탄닝 마감 크러스트 양가죽",
        "material": "양 가죽(Sheepskin leather) 베지터블 유연 완제가죽",
        "function": "가죽 재킷 및 장갑 제조용 완제 가죽 원단",
        "expected_chapter": "41",
        "expected_heading": "4105"
    },
    {
        "id": 14,
        "name": "휴대용 천연 소가죽 여행용 서류가방",
        "material": "천연 소가죽 외피, 면 직물 안감, 금속 잠금장식",
        "function": "서류 및 소지품 휴대 보관용 가죽 브리프케이스",
        "expected_chapter": "42",
        "expected_heading": "4202"
    },
    {
        "id": 15,
        "name": "가정용 천연 펄프 롤 화장지",
        "material": "100% 순수 천연 펄프 종이 (폭 10cm 롤 형태)",
        "function": "가정 화장실용 위생 화장지",
        "expected_chapter": "48",
        "expected_heading": "4818"
    },
    {
        "id": 16,
        "name": "상업용 컬러 인쇄 상품 카탈로그",
        "material": "스노우지, 양면 4색 오프셋 인쇄, 중철 제본",
        "function": "기업 제품 홍보 및 안내용 인쇄물 카탈로그",
        "expected_chapter": "49",
        "expected_heading": "4911"
    },

    # 4. 섬유 및 의류잡화군 (Ch 50 - 65)
    {
        "id": 17,
        "name": "투습방수 PTFE 멤브레인 3레이어 기능성 직물",
        "material": "나일론 평직물 겉감, 확장 다공성 PTFE 필름, 트리코트 안감 라미네이팅",
        "function": "아웃도어 등산복 및 방수 재킷 제조용 복합 방수 기능성 직물",
        "expected_chapter": "59",
        "expected_heading": "5903"
    },
    {
        "id": 18,
        "name": "남성 신사 정장용 100% 실크 넥타이",
        "material": "견직물(Silk 100% Woven)",
        "function": "남성 정장 착용 목 장식용 넥타이",
        "expected_chapter": "62",
        "expected_heading": "6215"
    },
    {
        "id": 19,
        "name": "100% 퓨어 캐시미어 니트 머플러",
        "material": "캐시미어 산양모 편직물(Knitted) 100%",
        "function": "목 착용 보온용 방한 편물 스카프 머플러",
        "expected_chapter": "61",
        "expected_heading": "6117"
    },
    {
        "id": 20,
        "name": "스파이크리스 가죽 갑피 프로 골프화",
        "material": "천연 소가죽 갑피(Upper), 고무 및 TPU 바깥바닥(Outsole)",
        "function": "골프 경기용 운동 신발",
        "expected_chapter": "64",
        "expected_heading": "6403"
    },
    {
        "id": 21,
        "name": "여성용 천연 밀짚 썬바이저 모자",
        "material": "천연 식물성 밀짚 조형 편조물(Plaited straw)",
        "function": "햇빛 차단 및 외출용 편조제 모자",
        "expected_chapter": "65",
        "expected_heading": "6504"
    },
    {
        "id": 22,
        "name": "초고강도 UHMWPE 방탄 직물",
        "material": "초고분자량 폴리에틸렌 필라멘트사 직포 직물",
        "function": "방탄조끼 및 방호장비 제작용 특수 섬유 직물",
        "expected_chapter": "54",
        "expected_heading": "5407"
    },

    # 5. 유리, 도자, 금속 및 공구군 (Ch 69 - 83)
    {
        "id": 23,
        "name": "실험실용 내열 붕규산 유리 비커",
        "material": "팽창계수가 낮은 붕규산 유리(Borosilicate glass)",
        "function": "화학 실험 및 액체 가열 계량용 이화학 유리 기구",
        "expected_chapter": "70",
        "expected_heading": "7017"
    },
    {
        "id": 24,
        "name": "전자 패키징용 초극박 알루미늄 박 (두께 6.5㎛)",
        "material": "알루미늄 99.5% 압연 박 (두께 0.0065mm, 지지물 없음)",
        "function": "2차전지 파우치 필름 및 전자 차폐용 알루미늄 포일",
        "expected_chapter": "76",
        "expected_heading": "7607"
    },
    {
        "id": 25,
        "name": "고강도 탄소강 육각 와셔 헤드 셀프드릴링 스크류",
        "material": "열처리 탄소강, 아연도금 마감 (나사산 외경 4.8mm)",
        "function": "샌드위치 판넬 및 강판 고정용 직결 나사 볼트",
        "expected_chapter": "73",
        "expected_heading": "7318"
    },
    {
        "id": 26,
        "name": "초경합금 팁 장착 목공용 원형 톱날",
        "material": "합금강 원판 바디, 텅스텐 카바이드(WC) 절삭 팁 브레이징",
        "function": "목재 및 판재 고속 회전 절단용 원형 톱날 공구",
        "expected_chapter": "82",
        "expected_heading": "8202"
    },
    {
        "id": 27,
        "name": "CNC 밀링용 다결정 다이아몬드(PCD) 엔드밀",
        "material": "PCD 소결 다이아몬드 날부, 탄화텅스텐 샹크",
        "function": "비철금속 및 복합재 정밀 밀링 절삭 공구",
        "expected_chapter": "82",
        "expected_heading": "8207"
    },
    {
        "id": 28,
        "name": "황동 주조제 싱크대 혼합 싱글레버 수전 밸브",
        "material": "황동(Brass) 주물 바디, 세라믹 디스크 카트리지, 크롬도금",
        "function": "주방 온냉수 유량 및 온도 조절 수도꼭지 밸브",
        "expected_chapter": "84",
        "expected_heading": "8481"
    },
    {
        "id": 29,
        "name": "알루미늄제 접이식 초경량 캠핑 의자",
        "material": "알루미늄 7075 튜브 프레임, 코듀라 옥스퍼드 직물 시트",
        "function": "야외 캠핑 및 휴식용 접이식 이동 의자",
        "expected_chapter": "94",
        "expected_heading": "9401"
    },
    {
        "id": 30,
        "name": "사무용 문서철용 철강제 스테이플 침",
        "material": "아연도금 연강선재 스트립 블록 (1,000피스 연접)",
        "function": "스테이플러에 장전하여 종이를 묶는 철침 부속품",
        "expected_chapter": "83",
        "expected_heading": "8305"
    },

    # 6. 기계 및 기계류 (Ch 84)
    {
        "id": 31,
        "name": "가정용 자율주행 스마트 로봇 청소기",
        "material": "LiDAR 센서, BLDC 흡입 모터, 리튬이온 배터리팩, 회전 물걸레",
        "function": "모터 구동으로 바닥 먼지를 자율 흡입 및 물걸레 청소하는 전자기기",
        "expected_chapter": "85",
        "expected_heading": "8508"
    },
    {
        "id": 32,
        "name": "반도체 웨이퍼 이송용 4축 클린룸 로봇암",
        "material": "초정밀 서보모터, 알루미늄 암 링크, 진공 엔드이펙터 그리퍼",
        "function": "진공 챔버와 카세트 간 실리콘 웨이퍼를 정밀 반송하는 기계 장치",
        "expected_chapter": "84",
        "expected_heading": "8486"
    },
    {
        "id": 33,
        "name": "산업용 유압식 단동 피스톤 실린더",
        "material": "고장력 크롬도금 강철 튜브, 피스톤 로드, 폴리우레탄 씰",
        "function": "유압 오일 압력으로 강력한 직선 왕복 운동 동력을 생성하는 유압 기계",
        "expected_chapter": "84",
        "expected_heading": "8412"
    },
    {
        "id": 34,
        "name": "플라스틱 사출기용 질화강 바이메탈 스크류 실린더",
        "material": "질화합금강 표면 열처리 스크류 및 합금 내마모성 라이너",
        "function": "수지 가열 용융 및 사출을 담당하는 사출성형기 전용 핵심 부품",
        "expected_chapter": "84",
        "expected_heading": "8477"
    },
    {
        "id": 35,
        "name": "공장 냉각탑용 원심식 냉각수 순환 펌프",
        "material": "주철 볼류트 케이싱, 청동 임펠러, 15kW 3상 유도전동기 직결",
        "function": "산업용 냉각수를 고압 대용량으로 순환 공급하는 액체 펌프",
        "expected_chapter": "84",
        "expected_heading": "8413"
    },
    {
        "id": 36,
        "name": "공압 자동화 라인용 5포트 전자 솔레노이드 밸브",
        "material": "알루미늄 바디, 전자기 코일 솔레노이드, 스풀 밸브 기구",
        "function": "전기 신호로 압축공기 흐름 방향을 절환 제어하는 밸브",
        "expected_chapter": "84",
        "expected_heading": "8481"
    },

    # 7. 전기, 전자, 통신 및 센서 (Ch 85)
    {
        "id": 37,
        "name": "초고속 충전기용 질화갈륨(GaN) 전력 트랜지스터",
        "material": "GaN-on-Si 에피택셜 다이, DFN 표면실장 패키지",
        "function": "고주파 고효율 전력 스위칭을 수행하는 개별 반도체 소자",
        "expected_chapter": "85",
        "expected_heading": "8541"
    },
    {
        "id": 38,
        "name": "VR/AR 헤드셋용 1.3인치 마이크로 OLED 디스플레이",
        "material": "실리콘 웨이퍼 기판 백플레인, 백색 OLED 유기 발광층, 컬러필터",
        "function": "초고해상도 영상을 표시하는 디스플레이 소자 패널",
        "expected_chapter": "85",
        "expected_heading": ["8524", "8528"]
    },
    {
        "id": 39,
        "name": "스마트폰용 15W 자기유도식 무선 충전 송신 패드",
        "material": "평면 구리 권선 코일, 페라이트 자기차폐 시트, 무선충전 IC",
        "function": "전자기 유도 방식으로 스마트폰 배터리를 무선 충전하는 기기",
        "expected_chapter": "85",
        "expected_heading": "8504"
    },
    {
        "id": 40,
        "name": "온디바이스 AI 연산용 NPU 신경망 프로세서 칩",
        "material": "4나노 공정 단일 실리콘 칩, BGA 패키지",
        "function": "딥러닝 텐서 추론 연산을 고속 처리하는 모놀리식 집적회로",
        "expected_chapter": "85",
        "expected_heading": "8542"
    },
    {
        "id": 41,
        "name": "광통신용 파장분할다중(WDM) 광 트랜시버 모듈",
        "material": "1310nm DFB 레이저 다이오드, PIN 광다이오드 수신기, LC 광커넥터",
        "function": "광신호와 전기신호를 상호 변환하여 고속 데이터를 송수신하는 통신기기",
        "expected_chapter": "85",
        "expected_heading": "8517"
    },
    {
        "id": 42,
        "name": "산업용 대용량 리튬인산철(LFP) ESS 배터리 랙",
        "material": "LFP 3.2V 셀 240직렬 모듈, 배터리관리시스템(BMS), 스틸 랙",
        "function": "전력망 잉여 전력을 대용량 저장하는 축전지 시스템",
        "expected_chapter": "85",
        "expected_heading": "8507"
    },

    # 8. 수송기기, 광학/의료, 시계/악기/잡품군 (Ch 87 - 96)
    {
        "id": 43,
        "name": "도심 주행용 친환경 전동 스쿠터 (최고시속 45km/h)",
        "material": "강철 파이프 프레임, 3kW 휠 인허브 모터, 72V 리튬 배터리",
        "function": "도로 주행용 2륜 모터사이클/전동 스쿠터",
        "expected_chapter": "87",
        "expected_heading": "8711"
    },
    {
        "id": 44,
        "name": "선박 항해용 전자해도 표시시스템 (ECDIS) 전용 단말기",
        "material": "24인치 해양용 고휘도 방수 모니터, 항법 프로세서 유닛, 항해 센서 인터페이스",
        "function": "선박 위치와 해도를 실시간 표시하여 항해를 지원하는 전자기기",
        "expected_chapter": "90",
        "expected_heading": "9014"
    },
    {
        "id": 45,
        "name": "치과 진료용 초음파 스케일러 치료기",
        "material": "압전 세라믹 초음파 핸드피스, 티타늄 팁, 주수 펌프 제어기",
        "function": "초음파 미세 진동으로 치석을 제거하는 치과용 의료기기",
        "expected_chapter": "90",
        "expected_heading": "9018"
    },
    {
        "id": 46,
        "name": "비접촉 이마 적외선 피부 온도 체온계",
        "material": "적외선 서모파일 센서 렌즈, 연산 마이크로컨트롤러, LCD",
        "function": "인체 이마 표면 온도를 측정하여 체온을 디지털 표시하는 체온계",
        "expected_chapter": "90",
        "expected_heading": "9025"
    },
    {
        "id": 47,
        "name": "고급 만년필용 14K 골드 펜촉(Nib)",
        "material": "14K 금(Au 58.5%) 합금 프레스 성형 판, 이리듐 볼 팁 용접",
        "function": "만년필에 장착되어 모세관 현상으로 잉크를 종이에 전달하는 펜촉 부분품",
        "expected_chapter": "96",
        "expected_heading": "9608"
    },
    {
        "id": 48,
        "name": "기계식 쿼츠 크로노그래프 남성 손목시계",
        "material": "티타늄 케이스, 쿼츠 전자식 무브먼트, 아날로그 바늘",
        "function": "손목 착용 휴대용 시계",
        "expected_chapter": "91",
        "expected_heading": "9102"
    },
    {
        "id": 49,
        "name": "공연 연주용 어쿠스틱 드럼 세트",
        "material": "자작나무 합판 쉘 드럼 5종, 마일러 헤드 피피, 스틸 심벌 3종",
        "function": "스틱으로 타격하여 소리를 내는 타악기 세트",
        "expected_chapter": "92",
        "expected_heading": "9206"
    },
    {
        "id": 50,
        "name": "어린이 놀이용 팽창식 PVC 튜브 물놀이 기구",
        "material": "고주파 융착 PVC 플라스틱 시트 (손잡이 구비)",
        "function": "수영장/물놀이장에서 아동이 타고 노는 완구용 튜브",
        "expected_chapter": "95",
        "expected_heading": "9503"
    }
]

def run_set2_test():
    db = SessionLocal()
    print("=" * 105)
    print("      [SET 2] 50개 완전히 새로운 수출입 품목 AI 정밀 품목분류 벤치마크")
    print("=" * 105)
    print(f"총 검증 대상: {len(SET2_50_ITEMS)}개 품목")
    print("-" * 105)

    passed_count = 0
    failed_items = []

    start_time = time.time()

    for idx, item in enumerate(SET2_50_ITEMS, 1):
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
    total = len(SET2_50_ITEMS)
    acc = (passed_count / total) * 100.0
    err_rate = 100.0 - acc

    print("=" * 105, flush=True)
    print(f"🎯 [SET 2 결과 요약] 검증 완료!", flush=True)
    print(f"총 품목 수: {total}개 | 통과: {passed_count}개 | 실패: {len(failed_items)}개", flush=True)
    print(f"정확도: {acc:.1f}% | 오류율: {err_rate:.1f}% | 소요 시간: {elapsed:.2f}초", flush=True)
    print("=" * 105, flush=True)

    if failed_items:
        print("\n[오류 항목 상세 분석 리스트]", flush=True)
        for f in failed_items:
            it = f["item"]
            print(f"- No.{it['id']} [{it['name']}]: 판정={f['predicted_code']} (호: {f['predicted_hd']}) vs 기대={f['expected_hd']}", flush=True)
            print(f"  재질/용도: {it['material']} / {it['function']}", flush=True)
            
    db.close()
    return passed_count, failed_items

if __name__ == "__main__":
    run_set2_test()
