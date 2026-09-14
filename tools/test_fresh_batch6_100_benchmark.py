# -*- coding: utf-8 -*-
"""
CUSWAY 6th Fresh Batch: 100 Brand New Real-World Customs Benchmark
Evaluates the enhanced RAG & 2-Step Progressive Classification Pipeline across 100 completely new items:
  - Step 1: Rapid 1-Step Probe & GRI Classification / 2-Step Pinpoint Smart Chip
  - Step 2: Tariff & FTA Optimization
  - Step 3: Clearance Requirements & Statutes
  - Step 4: Administrative Documents & Action Plan
"""
import sys
import os
import time
import json

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, workspace_root)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from backend.db import SessionLocal
from backend.models import HSCodeMaster, CustomsPrecedent
from backend.rag.classification_processor import AICustomsClassificationProcessor
from backend.main import get_hs_rates_api, get_clearance_guide_api

# 완전히 새로운 제6차 100대 실무 고난도 품목 데이터셋 (Batch 6)
BATCH6_100_ITEMS = [
    # [1. 농축수산/식품/건기식 (15개)]
    {"id": 1, "cat": "과실/냉동", "name": "냉동 블루베리 (비가열 단순 급속동결 1kg 소매포장)", "mat": "블루베리 생과 100%", "func": "비가열 급속 동결 식용 과실", "exp_ch": ["08"], "exp_hd": ["0811"]},
    {"id": 2, "cat": "커피가공", "name": "인스턴트 동결건조 커피 분말 (가당 없는 순수 커피추출분말)", "mat": "커피 원두 추출 건조물 100%", "func": "물에 녹여 음용하는 인스턴트 가공 커피", "exp_ch": ["21"], "exp_hd": ["2101"]},
    {"id": 3, "cat": "유가공품", "name": "자연 치즈 모차렐라 블록 (비숙성 생치즈)", "mat": "살균 원유 98%, 식염, 렌넷, 유산균", "func": "피자 및 요리용 천연 모차렐라 치즈", "exp_ch": ["04"], "exp_hd": ["0406"]},
    {"id": 4, "cat": "수산가공", "name": "자숙 냉동 문어 다리 (열처리 찜 가공 후 급속냉동)", "mat": "참문어 99%, 식염 1%", "func": "해동 후 즉시 섭취 가능한 조리 수산물", "exp_ch": ["16", "03"], "exp_hd": ["1605", "0307"]},
    {"id": 5, "cat": "유지류", "name": "압착 엑스트라 버진 올리브유 (비열처리 저온 압착 식용유)", "mat": "올리브 과육 압착유 100%", "func": "샐러드 드레싱 및 조리용 식물성 고정유", "exp_ch": ["15"], "exp_hd": ["1509"]},
    {"id": 6, "cat": "견과가공", "name": "허니버터 아몬드 (설탕, 버터, 꿀 코팅 구운 아몬드 스낵)", "mat": "볶은 아몬드 75%, 설탕, 물엿, 버터, 꿀", "func": "당류 및 버터 코팅 가공 견과류 스낵", "exp_ch": ["20"], "exp_hd": ["2008"]},
    {"id": 7, "cat": "복합소스", "name": "이탈리아산 토마토 바질 파스타 소스 (병입 가공 소스)", "mat": "토마토 퓨레 80%, 양파, 올리브유, 바질, 소금", "func": "스파게티 및 요리용 복합 조미 소스", "exp_ch": ["21"], "exp_hd": ["2103"]},
    {"id": 8, "cat": "면류/조제품", "name": "생면 우동 (밀가루 반죽 숙성 생면 200g)", "mat": "밀가루 96%, 정제염, 산도조절제, 주정", "func": "가열 조리용 비건조 생 파스타/면", "exp_ch": ["19"], "exp_hd": ["1902"]},
    {"id": 9, "cat": "음료류", "name": "유기농 무가당 귀리 음료 (오트 밀크 대체유)", "mat": "귀리 추출액 90%, 정제수, 해바라기유, 정제염", "func": "식물성 곡물 추출 비알코올 음료", "exp_ch": ["22"], "exp_hd": ["2202"]},
    {"id": 10, "cat": "곡물가공", "name": "콘플레이크 시리얼 (설탕 코팅 옥수수 가공 시리얼)", "mat": "옥수수 그리츠 88%, 설탕, 맥아추출물, 소금", "func": "우유에 말아먹는 아침식사용 조제 곡물", "exp_ch": ["19"], "exp_hd": ["1904"]},
    {"id": 11, "cat": "차류/원물", "name": "유기농 얼그레이 홍차 찻잎 (베르가못 착향 발효차)", "mat": "발효 홍차 98%, 천연 베르가못 오일 2%", "func": "소매 포장된 침출 음용용 찻잎 (티백)", "exp_ch": ["09"], "exp_hd": ["0902"]},
    {"id": 12, "cat": "육가공품", "name": "스페인산 하몽 이베리코 베요타 (염장 자연건조 햄 슬라이스)", "mat": "돼지 뒷다리육 95%, 천일염 5%", "func": "소금 절임 후 36개월 자연 건조 숙성한 생햄", "exp_ch": ["02", "16"], "exp_hd": ["0210", "1602"]},
    {"id": 13, "cat": "건기식", "name": "루테인 지아잔틴 캡슐 (마리골드꽃 추출 연질캡슐 영양제)", "mat": "마리골드꽃 추출물, 식물성 오일, 젤라틴 캡슐", "func": "눈 건강 보조용 복용 식료 조제품", "exp_ch": ["21"], "exp_hd": ["2106"]},
    {"id": 14, "cat": "향신료", "name": "블랙 페퍼 통후추 (건조 미분쇄 흑후추 열매)", "mat": "건조 흑후추 100%", "func": "요리 조미용 천연 향신료 원물", "exp_ch": ["09"], "exp_hd": ["0904"]},
    {"id": 15, "cat": "초콜릿", "name": "다크 초콜릿 바 (카카오 함량 72% 판 초콜릿)", "mat": "카카오매스, 설탕, 카카오버터, 레시틴", "func": "기호용 판형 카카오 당과자", "exp_ch": ["18"], "exp_hd": ["1806"]},

    # [2. 화학/의약/화장품/소재/고무/플라스틱 (20개)]
    {"id": 16, "cat": "기초화장품", "name": "히알루론산 수분 보습 에센스 (소매포장 세럼 50ml)", "mat": "정제수, 히알루론산나트륨, 글리세린, 부틸렌글라이콜", "func": "얼굴 피부 보습용 액상 기초 화장품", "exp_ch": ["33"], "exp_hd": ["3304"]},
    {"id": 17, "cat": "세정제", "name": "가정용 액체 주방세제 (식기 세척용 중성세제)", "mat": "음이온 계면활성제 15%, 알킬글루코사이드, 정제수", "func": "식기 및 식재료 세척용 조제 계면활성 세제", "exp_ch": ["34"], "exp_hd": ["3402"]},
    {"id": 18, "cat": "방향제품", "name": "실내용 아로마 디퓨저 (에센셜 오일 배합 방향제 200ml)", "mat": "에탄올, 디프로필렌글라이콜, 천연 라벤더 향료", "func": "실내 공간에 향기를 확산시키는 탈취 방향 조제품", "exp_ch": ["33"], "exp_hd": ["3307"]},
    {"id": 19, "cat": "합성수지", "name": "투명 폴리카보네이트(PC) 펠릿 (성형용 플라스틱 1차제품)", "mat": "Polycarbonate 수지 100%", "func": "사출 및 압출 성형용 열가소성 수지 원료 펠릿", "exp_ch": ["39"], "exp_hd": ["3907"]},
    {"id": 20, "cat": "점착필름", "name": "스마트폰 액정 보호용 강화유리 필름 (실리콘 점착층)", "mat": "화학강화유리(0.33mm), 광학용 실리콘 점착제, PET 이형지", "func": "스마트폰 디스플레이 표면 긁힘 및 파손 방지 커버", "exp_ch": ["70", "39"], "exp_hd": ["7007", "3919"]},
    {"id": 21, "cat": "유기화합물", "name": "무수 구연산 결정 (식품/공업용 Citric Acid Anhydrous)", "mat": "Citric Acid (단일 유기화합물) 99.8%", "func": "식품 산미료 및 세정용 유기산 원료", "exp_ch": ["29"], "exp_hd": ["2918"]},
    {"id": 22, "cat": "무기화합물", "name": "고순도 이산화티타늄 루틸 분말 (TiO2 99.0% 백색 안료)", "mat": "Titanium Dioxide 99.0%", "func": "도료, 플라스틱, 화장품용 백색 무기 안료", "exp_ch": ["28", "32"], "exp_hd": ["2823", "3206"]},
    {"id": 23, "cat": "의약외품", "name": "하이드로콜로이드 여드름 스팟 패치 (멸균 상처보호 밴드)", "mat": "하이드로콜로이드 점착층, 폴리우레탄 필름", "func": "피부 상처 삼출물 흡수 및 보호용 소매포장 밴드", "exp_ch": ["30"], "exp_hd": ["3005"]},
    {"id": 24, "cat": "고무제품", "name": "산업용 가황 고무 컨베이어 벨트 (강선 코드 보강 벨트)", "mat": "가황 합성고무(SBR/NR), 스틸 와이어 보강층", "func": "광산 및 시멘트 공장에서 벌크 화물을 이송하는 벨트", "exp_ch": ["40"], "exp_hd": ["4010"]},
    {"id": 25, "cat": "접착제", "name": "산업용 2액형 에폭시 구조용 접착제 (주제 및 경화제 세트)", "mat": "비스페놀A형 에폭시 수지 60%, 폴리아미드 경화제 40%", "func": "금속, 복합재료, 콘크리트 강력 접합용 화학 접착제", "exp_ch": ["35", "39"], "exp_hd": ["3506", "3907"]},
    {"id": 26, "cat": "화장품", "name": "자외선 차단 선크림 (SPF 50+ PA++++ 유무기 혼합 자차)", "mat": "산화아연, 에칠헥실메톡시신나메이트, 정제수", "func": "자외선 차단 및 피부 보호용 기초 화장품", "exp_ch": ["33"], "exp_hd": ["3304"]},
    {"id": 27, "cat": "플라스틱관", "name": "반도체 고순도 PFA 튜빙 (불소수지 배관 튜브 1/2인치)", "mat": "Perfluoroalkoxy (PFA) 100%", "func": "반도체 초순수 및 고순도 케미컬 이송용 불소수지 튜브", "exp_ch": ["39"], "exp_hd": ["3917"]},
    {"id": 28, "cat": "치과재료", "name": "치과용 광중합 복합레진 (충치 치료용 충전재 시린지)", "mat": "Bis-GMA 레진 모노머, 실리카 필러, 광개시제", "func": "치과에서 충치 삭제 부위를 수복 충전하는 레진", "exp_ch": ["30"], "exp_hd": ["3006"]},
    {"id": 29, "cat": "합성고무", "name": "니트릴 부타디엔 고무 롤 (NBR 시트, 내유성 고무판)", "mat": "가황하지 않은 비가황 NBR 컴파운드 판", "func": "가스켓 및 패킹 가공용 내유성 고무 원단", "exp_ch": ["40"], "exp_hd": ["4002", "4008"]},
    {"id": 30, "cat": "가죽", "name": "자동차 시트용 천연 소가죽 통가죽 (도장 마감 나파가죽)", "mat": "소가죽 100%, 폴리우레탄 표면 코팅", "func": "고급 자동차 시트 및 내장재용 가공 가죽", "exp_ch": ["41"], "exp_hd": ["4107"]},
    {"id": 31, "cat": "연마재", "name": "인조 다이아몬드 분말 (산업용 정밀 연마 지립 50캐럿)", "mat": "합성 다이아몬드 결정 100%", "func": "반도체 웨이퍼 및 광학 렌즈 정밀 래핑 연마제", "exp_ch": ["71"], "exp_hd": ["7105"]},
    {"id": 32, "cat": "단열재", "name": "건축용 압출 발포 폴리스티렌(XPS) 단열보드 (아이소핑크)", "mat": "발포 폴리스티렌 수지 100%", "func": "건물 벽체 및 바닥 보온 단열용 폼 보드", "exp_ch": ["39"], "exp_hd": ["3921"]},
    {"id": 33, "cat": "도료", "name": "수성 아크릴 에멀젼 페인트 (실내 벽면 도장용 친환경 도료)", "mat": "아크릴 공중합체 에멀젼, 안료, 물", "func": "건축물 실내 벽체 미관 및 보호 도장용 수성 페인트", "exp_ch": ["32"], "exp_hd": ["3209"]},
    {"id": 34, "cat": "비타민", "name": "아스코르브산 결정 분말 (비타민 C 순도 99.5%)", "mat": "L-Ascorbic Acid (단일 비타민 화합물) 99.5%", "func": "식품 첨가물 및 영양제 제조용 원료 비타민", "exp_ch": ["29"], "exp_hd": ["2936"]},
    {"id": 35, "cat": "플라스틱용기", "name": "화장품용 투명 PET 에어로졸 미스트 스프레이 공병 (100ml)", "mat": "PET 수지 바디, PP 펌프 노즐", "func": "액상 화장품 충전용 소형 플라스틱 병", "exp_ch": ["39"], "exp_hd": ["3923"]},

    # [3. 섬유/의류/패션/신발/잡화 (15개)]
    {"id": 36, "cat": "편직의류", "name": "여성용 캐시미어 100% 터틀넥 니트 (편직 풀오버)", "mat": "방적 캐시미어사 100%", "func": "동절기 보온용 여성 편직 상의", "exp_ch": ["61"], "exp_hd": ["6110"]},
    {"id": 37, "cat": "직물의류", "name": "남성용 면 100% 옥스퍼드 셔츠 (직물제 긴소매 정장셔츠)", "mat": "면 직물(Cotton) 100%", "func": "남성 정장 및 캐주얼 착용용 직물제 셔츠", "exp_ch": ["62"], "exp_hd": ["6205"]},
    {"id": 38, "cat": "가죽의류", "name": "천연 양가죽 남성용 라이더 재킷 (가죽 아우터)", "mat": "천연 양가죽 겉감, 폴리에스터 안감, 스틸 지퍼", "func": "남성 방풍 및 패션용 천연 가죽 재킷", "exp_ch": ["42"], "exp_hd": ["4203"]},
    {"id": 39, "cat": "가방/핸드백", "name": "천연 소가죽 여성용 숄더 핸드백 (가죽 토트백)", "mat": "천연 소가죽 외피, 면 안감, 황동 버클 장식", "func": "여성용 소지품 수납 휴대용 가죽 가방", "exp_ch": ["42"], "exp_hd": ["4202"]},
    {"id": 40, "cat": "신발/스니커즈", "name": "가죽 갑피 캐주얼 스니커즈 (소가죽 갑피 + 고무 밑창)", "mat": "천연 소가죽 갑피, 텍스타일 안감, 가황고무 아웃솔", "func": "일상 보행 및 패션용 가죽 운동화", "exp_ch": ["64"], "exp_hd": ["6403"]},
    {"id": 41, "cat": "직물의류", "name": "남성용 데님 청바지 (면 98% 스판덱스 2% 진 바지)", "mat": "면 98%, 폴리우레탄(스판) 2% 데님 직물", "func": "남성용 직물제 캐주얼 바지", "exp_ch": ["62"], "exp_hd": ["6203"]},
    {"id": 42, "cat": "타월/침구", "name": "호텔용 면 100% 테리 테디 바스 타월 (목욕 수건 70x140cm)", "mat": "면 테리직물(Terry Towelling) 100%", "func": "목욕 후 물기 흡수용 대형 바스타월", "exp_ch": ["63"], "exp_hd": ["6302"]},
    {"id": 43, "cat": "의류부속", "name": "남성용 실크 100% 자카드 넥타이 (핸드메이드 타이)", "mat": "견직물(Silk) 100%, 모 심지", "func": "정장 착용용 남성 목 부속 패션 타이", "exp_ch": ["62"], "exp_hd": ["6215"]},
    {"id": 44, "cat": "모자류", "name": "코튼 트윌 야구모자 (스냅백 볼캡)", "mat": "면 직물 100%, 플라스틱 버클", "func": "자외선 차단 및 캐주얼 착용용 모자", "exp_ch": ["65"], "exp_hd": ["6505"]},
    {"id": 45, "cat": "가방/배낭", "name": "등산용 나일론 백팩 (40L 방수 아웃도어 배낭)", "mat": "고강도 나일론(Cordura) 직물, 알루미늄 프레임", "func": "등산 장비 및 짐 수납 운반용 직물제 배낭", "exp_ch": ["42"], "exp_hd": ["4202"]},
    {"id": 46, "cat": "침구류", "name": "거위털 구스다운 이불 (헝가리 구스 솜털 90% 사계절용)", "mat": "면 100% 원단 겉감, 거위 솜털 90% 깃털 10%", "func": "침대용 보온 침구 이불", "exp_ch": ["94"], "exp_hd": ["9404"]},
    {"id": 47, "cat": "신발/슬리퍼", "name": "실내용 EVA 일체형 슬리퍼 (사출성형 쿠션 룸슈즈)", "mat": "에틸렌비닐아세테이트(EVA) 발포체 100%", "func": "실내 및 욕실용 방수 경량 슬리퍼", "exp_ch": ["64"], "exp_hd": ["6402"]},
    {"id": 48, "cat": "편직의류", "name": "기능성 쿨맥스 스포츠 반소매 티셔츠 (편직 애슬레저 상의)", "mat": "폴리에스터 92%, 폴리우레탄 8% 싱글 저지 편물", "func": "흡한속건 스포츠 운동용 편직 티셔츠", "exp_ch": ["61"], "exp_hd": ["6109"]},
    {"id": 49, "cat": "선글라스", "name": "편광 렌즈 아세테이트 선글라스 (UV400 차단 패션 안경)", "mat": "아세테이트 플라스틱 프레임, TAC 편광렌즈", "func": "자외선 및 눈부심 차단용 보호 안경", "exp_ch": ["90"], "exp_hd": ["9004"]},
    {"id": 50, "cat": "우산/양산", "name": "초경량 카본 살대 5단 미니 양우산", "mat": "자외선차단 코팅 폴리에스터 원단, 카본/알루미늄 살대", "func": "휴대용 자외선 차단 및 비가림용 접이식 우산", "exp_ch": ["66"], "exp_hd": ["6601"]},

    # [4. 비금속/철강/금속/패스너/하드웨어 (10개)]
    {"id": 51, "cat": "철강선", "name": "아연도금 고탄소 강선 코일 (스프링 제조용 와이어, 지름 2.0mm)", "mat": "고탄소강(C 0.7%), 아연도금 표면", "func": "매트리스 및 산업용 스프링 가공용 강선", "exp_ch": ["72"], "exp_hd": ["7217"]},
    {"id": 52, "cat": "알루미늄박", "name": "가정용 롤 알루미늄 호일 (두께 15㎛, 폭 30cm, 지지물 없음)", "mat": "알루미늄 순도 99.5%", "func": "음식 조리 및 포장용 얇은 알루미늄 박", "exp_ch": ["76"], "exp_hd": ["7607"]},
    {"id": 53, "cat": "절삭공구", "name": "초경합금 밀링 인서트 팁 (CNC 공구용 교체형 인서트)", "mat": "텅스텐 카바이드(WC-Co), TiAlN PVD 코팅", "func": "금속 절삭 가공 공구 홀더에 체결되는 절삭날", "exp_ch": ["82"], "exp_hd": ["8209", "8207"]},
    {"id": 54, "cat": "스테인리스관", "name": "반도체 배관용 스테인리스 스틸 316L EP 무계목 관", "mat": "STS316L 전해연마(EP) 심리스 파이프", "func": "반도체 초고순도 가스 라인용 무계목 스테인리스 강관", "exp_ch": ["73"], "exp_hd": ["7304"]},
    {"id": 55, "cat": "금속위생용품", "name": "욕실용 스테인리스 수전 금구 (세면대 원홀 싱글레버 혼합수전)", "mat": "황동 바디, 크롬 도금 스테인리스 외장, 세라믹 카트리지", "func": "온수와 냉수를 혼합 조절 토출하는 배관 밸브 기구", "exp_ch": ["84"], "exp_hd": ["8481"]},
    {"id": 56, "cat": "동파이프", "name": "에어컨 냉매 배관용 탈산동 원형 동관 (외경 9.52mm 코일관)", "mat": "인탈산동(C1220) 99.9%", "func": "냉동공조기 냉매 이송용 이음매 없는 구리 파이프", "exp_ch": ["74"], "exp_hd": ["7411"]},
    {"id": 57, "cat": "수공구", "name": "전문가용 토크 렌치 (디지털 토크 측정 라챗 렌치 1/2인치)", "mat": "크롬 바나듐 합금강 바디, 디지털 LCD 모듈", "func": "볼트 너트를 규정 토크값으로 정밀 조이는 수공구", "exp_ch": ["82"], "exp_hd": ["8204"]},
    {"id": 58, "cat": "도자제품", "name": "가정용 도자기제 커피 머그잔 및 접시 세트 (본차이나)", "mat": "본차이나 자기(Bone China) 100%", "func": "음료 및 디저트 서빙용 식탁 도자기", "exp_ch": ["69"], "exp_hd": ["6911", "6912"]},
    {"id": 59, "cat": "금속패스너", "name": "블라인드 리벳 (알루미늄 리벳 바디 + 스틸 맨드릴 4mm)", "mat": "알루미늄 합금 리벳, 탄소강 심축", "func": "판금 구조물 단면 비탈착 영구 체결용 리벳", "exp_ch": ["83", "76", "73"], "exp_hd": ["8308", "7616", "7318"]},
    {"id": 60, "cat": "금속체인", "name": "산업용 롤러 체인 (동력 전달용 더블 피치 스틸 체인)", "mat": "열처리 탄소합금강 링크 플레이트, 핀, 롤러", "func": "기계 동력 전달 및 컨베이어 구동용 철강 체인", "exp_ch": ["73"], "exp_hd": ["7315"]},

    # [5. 일반/정밀기계/자동화/냉난방/베어링 (15개)]
    {"id": 61, "cat": "공작기계", "name": "CNC 와이어 컷팅 방전가공기 (방전 와이어 가공기)", "mat": "주물 베드, AC 서보모터, 방전 전원부, CNC 컨트롤러", "func": "황동 와이어 방전 스파크로 정밀 금형을 가공하는 기계", "exp_ch": ["84"], "exp_hd": ["8456"]},
    {"id": 62, "cat": "포장기계", "name": "식품용 전자동 삼면 밀봉 포장기 (수평형 필로우 포장기)", "mat": "STS304 프레임, 인버터 모터, 엔드실러, 필름 공급부", "func": "제과 및 식품을 필름으로 고속 자동 포장 밀봉하는 기계", "exp_ch": ["84"], "exp_hd": ["8422"]},
    {"id": 63, "cat": "기계요소", "name": "정밀 유성기어 감속기 (서보모터 직결형 감속비 10:1)", "mat": "침탄열처리 합금강 기어, 알루미늄 하우징, 베어링", "func": "회전 속도를 줄이고 토크를 증폭시키는 기계식 변속기", "exp_ch": ["84"], "exp_hd": ["8483"]},
    {"id": 64, "cat": "액체펌프", "name": "반도체 케미컬용 에어 구동 다이어프램 펌프 (AODD 펌프)", "mat": "PTFE(테플론) 몸체, 다이어프램 막, 체크 밸브", "func": "압축 공기로 강산 및 화학 약품을 맥동 이송하는 펌프", "exp_ch": ["84"], "exp_hd": ["8413"]},
    {"id": 65, "cat": "인쇄기계", "name": "산업용 디지털 UV 평판 프린터 (목재/아크릴 평판 인쇄기)", "mat": "스틸 프레임, 피에조 잉크젯 헤드, UV LED 경화 램프", "func": "평면 소재 표면에 UV 잉크를 분사 경화 인쇄하는 기계", "exp_ch": ["84"], "exp_hd": ["8443"]},
    {"id": 66, "cat": "공기압축기", "name": "치과용 오일리스 저소음 소형 공기압축기 (0.75kW 24L)", "mat": "무급유 피스톤 펌프, 알루미늄 에어탱크, 압력스위치", "func": "치과 치료용 클린 압축 공기를 공급하는 무급유 컴프레셔", "exp_ch": ["84"], "exp_hd": ["8414"]},
    {"id": 67, "cat": "기계요소", "name": "스페리컬 롤러 베어링 (내경 100mm 중하중 조심 롤러베어링)", "mat": "고탄소 크롬 베어링강(SUJ2) 내외륜 및 롤러, 황동 리테이너", "func": "중장비 축의 고하중 회전 지지용 구름 베어링", "exp_ch": ["84"], "exp_hd": ["8482"]},
    {"id": 68, "cat": "사출성형기", "name": "전자동 전전동 플라스틱 사출성형기 (형체력 150톤)", "mat": "스틸 형체 기구, 전동 서보모터 구동 스크루, 배럴, 터치스크린", "func": "용융 플라스틱을 금형에 고압 사출 성형하는 기계", "exp_ch": ["84"], "exp_hd": ["8477"]},
    {"id": 69, "cat": "유압기기", "name": "복동식 유압 실린더 (스트로크 500mm 프레스용 유압 액추에이터)", "mat": "탄소강 튜브 롭, 크롬도금 로드, 우레탄 실링 패킹", "func": "유압 에너지를 직선 왕복 운동으로 변환하는 실린더", "exp_ch": ["84"], "exp_hd": ["8412"]},
    {"id": 70, "cat": "열교환장치", "name": "산업용 쉘앤튜브 다관식 열교환기 (스테인리스 튜브 열교환기)", "mat": "STS316L 열교환 튜브 다발, 탄소강 외피 쉘", "func": "플랜트 공정에서 유체 간 열을 전달하는 열교환 장치", "exp_ch": ["84"], "exp_hd": ["8419"]},
    {"id": 71, "cat": "반도체장비", "name": "반도체 웨이퍼 화학기상증착(CVD) 박막 증착기", "mat": "진공 챔버, RF 플라즈마 제너레이터, 가스 공급 매니폴드", "func": "웨이퍼 표면에 절연막 및 금속막을 화학 기상 증착하는 장비", "exp_ch": ["84"], "exp_hd": ["8486"]},
    {"id": 72, "cat": "물류기계", "name": "산업용 파레트 랩핑기 (턴테이블식 로봇 랩핑기)", "mat": "회전 턴테이블, 스트레치 필름 캐리지, 전동 모터", "func": "파레트 적재 화물을 스트레치 필름으로 자동 권취 포장하는 기계", "exp_ch": ["84"], "exp_hd": ["8422"]},
    {"id": 73, "cat": "송풍기", "name": "공조용 시로코 원심 송풍기 (삼상 2.2kW 덕트 팬)", "mat": "아연도금 강판 케이싱, 다익형 임펠러, 유도전동기", "func": "빌딩 및 환기 덕트에 공기를 강제 흡배기하는 송풍기", "exp_ch": ["84"], "exp_hd": ["8414"]},
    {"id": 74, "cat": "여과기", "name": "산업용 역삼투압(RO) 순수 수처리 막 여과장치", "mat": "STS304 하우징, 폴리아미드 RO 멤브레인 모듈, 고압펌프", "func": "원수에서 염분과 불순물을 99% 이상 여과 정제하는 수처리 장치", "exp_ch": ["84"], "exp_hd": ["8421"]},
    {"id": 75, "cat": "밸브", "name": "전동 액추에이터 버터플라이 밸브 (배관 제어용 모터 구동 밸브)", "mat": "주철 몸체, STS304 디스크, 전동 모터 액추에이터", "func": "신호에 따라 모터로 디스크를 회전하여 배관 유량을 자동 제어하는 밸브", "exp_ch": ["84"], "exp_hd": ["8481"]},

    # [6. 전기/전자/통신/배터리/디스플레이 (15개)]
    {"id": 76, "cat": "이차전지", "name": "전기차용 원통형 리튬이온 배터리 셀 (21700 NCM 규격 5000mAh)", "mat": "NCM 양극재, 흑연 음극재, 유기 전해액, 알루미늄 캔", "func": "전기에너지를 화학적으로 충방전 저장하는 축전지 단전지", "exp_ch": ["85"], "exp_hd": ["8507"]},
    {"id": 77, "cat": "태양광발전", "name": "단결정 N형 실리콘 태양광 모듈 (양면발전 패널 550W)", "mat": "단결정 실리콘 웨이퍼 셀, 강화유리, 알루미늄 프레임", "func": "태양빛 에너지를 직접 직류 전기에너지로 변환하는 발전 패널", "exp_ch": ["85"], "exp_hd": ["8541"]},
    {"id": 78, "cat": "통신기기", "name": "기업용 와이파이 6E 무선 AP 공유기 (PoE 기가비트 라우터)", "mat": "플라스틱 하우징, 메인보드, 듀얼밴드 안테나 6개", "func": "유선 네트워크 신호를 무선 Wi-Fi 신호로 변환 송수신하는 통신기기", "exp_ch": ["85"], "exp_hd": ["8517"]},
    {"id": 79, "cat": "전자소자", "name": "다층 세라믹 커패시터 (MLCC 0603 인치 규격 10uF 칩)", "mat": "티탄산바륨 세라믹 유전체, 니켈 내부전극", "func": "전자기기 회로에서 전하를 충방전하고 노이즈를 제거하는 수동소자", "exp_ch": ["85"], "exp_hd": ["8532"]},
    {"id": 80, "cat": "집적회로", "name": "인공지능 가속기 NPU 프로세서 BGA 반도체 칩 (IC)", "mat": "실리콘 다이, 플립칩 BGA 패키지, 솔더볼", "func": "딥러닝 신경망 연산을 초고속 처리하는 모놀리식 집적회로", "exp_ch": ["85"], "exp_hd": ["8542"]},
    {"id": 81, "cat": "디스플레이", "name": "스마트워치용 원형 AMOLED 플렉시블 디스플레이 패널 (1.4인치)", "mat": "LTPO TFT 기판, 유기발광다이오드 OLED 발광층, 봉지박막", "func": "전기 신호를 영상 화면으로 표시하는 자체발광 평판 표시패널", "exp_ch": ["85"], "exp_hd": ["8524", "8528"]},
    {"id": 82, "cat": "전력변환기", "name": "태양광 발전용 계통연계형 스트링 인버터 (삼상 50kW)", "mat": "IGBT 파워모듈, DSP 제어보드, 방열판 섀시", "func": "태양광 패널의 직류(DC) 전력을 상용 교류(AC) 전력으로 변환하는 장치", "exp_ch": ["85"], "exp_hd": ["8504"]},
    {"id": 83, "cat": "음향기기", "name": "휴대용 방수 블루투스 무선 스피커 (20W 스테레오)", "mat": "네오디뮴 스피커 유닛, 블루투스 칩, 리튬이온 배터리, 실리콘 케이스", "func": "스마트폰과 무선 연결되어 오디오 음향을 증폭 출력하는 기기", "exp_ch": ["85"], "exp_hd": ["8518"]},
    {"id": 84, "cat": "전열기기", "name": "가정용 2구 인덕션 전기레인지 (IH 방식 조리기)", "mat": "세라믹 글라스 상판, 구리 유도 가열 코일, PCB 제어기", "func": "전자기 유도로 조리 용기를 직접 발열 가열하는 조리기기", "exp_ch": ["85"], "exp_hd": ["8516"]},
    {"id": 85, "cat": "전기배선", "name": "전기차 급속 충전기용 고전압 유연 케이블 (차폐형 배선 35sq)", "mat": "무산소 동선 도체, 실리콘 절연체, 알루미늄 포일 차폐막", "func": "대용량 전류를 손실 없이 전송하는 절연 전선", "exp_ch": ["85"], "exp_hd": ["8544"]},
    {"id": 86, "cat": "소형가전", "name": "휴대용 초음파 피부 미안기 (갈바닉 이온 마사지기)", "mat": "ABS 하우징, 티타늄 헤드, 초음파 진동자, 배터리", "func": "초음파 진동과 미세전류로 피부 화장품 흡수를 돕는 가정용 기기", "exp_ch": ["85", "90"], "exp_hd": ["8543", "9019"]},
    {"id": 87, "cat": "센서기기", "name": "산업용 비접촉 적외선 온도 센서 트랜스미터 (4-20mA 출력)", "mat": "광학 렌즈, 써모파일 적외선 검출 소자, 스테인리스 하우징", "func": "물체에서 방출되는 적외선을 감지하여 온도를 측정 전송하는 계측기", "exp_ch": ["90"], "exp_hd": ["9025"]},
    {"id": 88, "cat": "스위치", "name": "산업용 비상정지 누름버튼 스위치 (방수형 E-STOP 스위치 22mm)", "mat": "폴리카보네이트 몸체, 은합금 접점부", "func": "비상 시 누름 조작으로 제어 전원 회로를 즉시 차단 개폐하는 전기 스위치", "exp_ch": ["85"], "exp_hd": ["8536"]},
    {"id": 89, "cat": "방송영상", "name": "산업용 머신비전 GigE 카메라 (글로벌 셔터 CMOS 500만화소)", "mat": "소니 CMOS 센서, 알루미늄 하우징, GigE 통신 인터페이스", "func": "생산 라인에서 제품 불량을 고속 촬영 검사하는 디지털 카메라", "exp_ch": ["85"], "exp_hd": ["8525"]},
    {"id": 90, "cat": "컴퓨터기기", "name": "NVMe M.2 2280 고속 SSD 솔리드스테이트드라이브 (2TB)", "mat": "3D TLC 낸드 플래시, SSD 컨트롤러 IC, DRAM, PCB", "func": "컴퓨터 메인보드에 장착되어 디지털 데이터를 비휘발성 저장하는 기억장치", "exp_ch": ["84", "85"], "exp_hd": ["8471", "8523"]},

    # [7. 광학/의료/시계/악기/모빌리티/가구/생활잡화 (10개)]
    {"id": 91, "cat": "의료기기", "name": "외과 수술용 초음파 절삭 지혈기 핸드피스 (하모닉 수술기구)", "mat": "티타늄 블레이드, 압전 세라믹 트랜스듀서, 의료용 플라스틱 핸들", "func": "초음파 진동을 이용하여 수술 부위 조직을 동시에 절개 및 지혈하는 의료기기", "exp_ch": ["90"], "exp_hd": ["9018"]},
    {"id": 92, "cat": "광학기기", "name": "레이저 간섭계 기반 표면 거칠기 3D 측정기 (비접촉 광학 조도계)", "mat": "He-Ne 레이저 광원, 간섭 대물렌즈, CCD 센서, 정밀 스테이지", "func": "빛의 간섭 무늬를 분석하여 나노미터 단위로 표면 형상을 측정하는 광학기기", "exp_ch": ["90"], "exp_hd": ["9031"]},
    {"id": 93, "cat": "시계류", "name": "스위스제 오토매틱 기계식 손목시계 (사파이어 크리스탈 글라스)", "mat": "316L 스테인리스 스틸 케이스, 기계식 무브먼트(태엽), 악어가죽 스트랩", "func": "스프링 태엽 구동 방식으로 시간을 표시하는 아날로그 손목시계", "exp_ch": ["91"], "exp_hd": ["9102", "9101"]},
    {"id": 94, "cat": "가구류", "name": "인체공학 메시 사무용 메쉬 의자 (럼버서포트 및 팔걸이 조절)", "mat": "고강도 엔지니어링 플라스틱 프레임, 통기성 메쉬 원단, 알루미늄 오발 다리", "func": "사무실 및 서재에서 착석용으로 사용하는 회전식 의자", "exp_ch": ["94"], "exp_hd": ["9401"]},
    {"id": 95, "cat": "가구류", "name": "원목 6인용 주방 식탁 다이닝 테이블 (길이 180cm)", "mat": "천연 북미산 월넛 원목 100%, 친환경 오일 마감", "func": "가정 주방에서 식사용으로 사용하는 목재 식탁 가구", "exp_ch": ["94"], "exp_hd": ["9403"]},
    {"id": 96, "cat": "모빌리티", "name": "도심형 접이식 전기 자전거 (350W 허브모터 36V 리튬배터리 내장)", "mat": "알루미늄 6061 프레임, BLDC 허브모터, 36V 10Ah 배터리, 20인치 타이어", "func": "보조 모터 동력 및 페달로 주행하는 이륜 전기 자전거", "exp_ch": ["87"], "exp_hd": ["8711"]},
    {"id": 97, "cat": "악기류", "name": "솔리드 탑 어쿠스틱 통기타 (스프루스 원목 전판 포크기타)", "mat": "시트카 스프루스 단판, 마호가니 측후판, 로즈우드 지판, 스틸 현", "func": "손가락이나 피크로 현을 퉁겨 음향 통으로 소리를 내는 현악기", "exp_ch": ["92"], "exp_hd": ["9202"]},
    {"id": 98, "cat": "완구류", "name": "어린이용 조립식 플라스틱 블록 세트 (500피스 완구)", "mat": "ABS 수지 사출 블록 100%", "func": "어린이가 상상력으로 다양한 모형을 조립 결합하는 놀이용 완구", "exp_ch": ["95"], "exp_hd": ["9503"]},
    {"id": 99, "cat": "운동용구", "name": "탄소섬유 배드민턴 라켓 (초경량 4U 카본 라켓)", "mat": "고탄성 카본 그라파이트 프레임 및 샤프트, 우레탄 그립", "func": "배드민턴 경기에서 셔틀콕을 타격하는 운동 경기용구", "exp_ch": ["95"], "exp_hd": ["9506"]},
    {"id": 100, "cat": "조명기구", "name": "모던 거실용 LED 펜던트 천장 조명등 (스마트 밝기 조절)", "mat": "알루미늄 링 갓, 아크릴 디퓨저, 내장형 LED 모듈, SMPS 안정기", "func": "실내 천장에 매달아 공간을 밝히는 고정식 전기 조명기구", "exp_ch": ["94"], "exp_hd": ["9405"]}
]

def run_batch6_benchmark():
    db = SessionLocal()
    print("=" * 90)
    print("      CUSWAY 6TH FRESH BATCH: 100 BRAND NEW CUSTOMS ITEMS BENCHMARK")
    print("=" * 90)
    
    start_time = time.time()
    
    step1_direct_pass = 0
    step2_interactive_pass = 0
    total_failures = 0
    
    pipeline_step2_pass = 0
    pipeline_step3_pass = 0
    pipeline_step4_pass = 0
    
    failure_details = []
    
    for idx, item in enumerate(BATCH6_100_ITEMS):
        item_id = item["id"]
        cat = item["cat"]
        p_name = item["name"]
        p_mat = item["mat"]
        p_func = item["func"]
        exp_ch = item["exp_ch"]
        exp_hd = item["exp_hd"]
        
        # ----------------------------------------------------
        # Step 1: Progressive Classification
        # ----------------------------------------------------
        probe_res = AICustomsClassificationProcessor.probe_clarification_needs(
            product_name=p_name,
            db=db
        )
        
        if probe_res.get("needs_clarification"):
            chips = probe_res.get("chips", [])
            chosen_chip = chips[0]["value"] if chips else p_mat
            
            cls_res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=p_name,
                material=p_mat,
                function_use=f"{p_func} ({chosen_chip})",
                db=db
            )
        else:
            cls_res = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=p_name,
                material=p_mat,
                function_use=p_func,
                db=db
            )
            
        resolved_hsk = cls_res.get("recommendedHsCode", "0000.00-0000")
        clean_hsk = resolved_hsk.replace('.', '').replace('-', '').strip()
        ch2 = clean_hsk[:2]
        hd4 = clean_hsk[:4]
        
        # Verification: Check if Chapter & Heading match expected legal scope
        ch_match = ch2 in exp_ch
        hd_match = hd4 in exp_hd
        
        if ch_match and hd_match:
            if not probe_res.get("needs_clarification"):
                step1_direct_pass += 1
                status_str = "✅ PASS (Direct 1-Step)"
            else:
                step2_interactive_pass += 1
                status_str = "✨ PASS (Interactive 2-Step Chip)"
        else:
            total_failures += 1
            status_str = "❌ FAIL (Misclassified)"
            failure_details.append({
                "id": item_id,
                "cat": cat,
                "name": p_name,
                "got_hsk": resolved_hsk,
                "exp_hd": exp_hd,
                "reason": cls_res.get("headingName", "")
            })
            
        # ----------------------------------------------------
        # 4-Step Pipeline Tests (Steps 2, 3, 4)
        # ----------------------------------------------------
        try:
            rates_res = get_hs_rates_api(resolved_hsk, db=db)
            if rates_res and "rates" in rates_res and "base_rate" in rates_res["rates"]:
                pipeline_step2_pass += 1
        except Exception:
            pass

        try:
            guide_res = get_clearance_guide_api(resolved_hsk, db=db)
            if guide_res and "requirements" in guide_res:
                pipeline_step3_pass += 1
                if len(guide_res["requirements"]) > 0:
                    first_req = guide_res["requirements"][0]
                    if "guide" in first_req and "documents" in first_req["guide"]:
                        pipeline_step4_pass += 1
                else:
                    pipeline_step4_pass += 1
        except Exception:
            pass

        print(f"[{item_id:03d}/100] [{cat:^8s}] {p_name[:36]:<38s} ➔ {resolved_hsk:<14s} | {status_str}")

    db.close()
    elapsed = time.time() - start_time
    total_passed = step1_direct_pass + step2_interactive_pass
    overall_accuracy = (total_passed / len(BATCH6_100_ITEMS)) * 100.0
    
    print("\n" + "=" * 90)
    print("                     FINAL 100 FRESH ITEMS BENCHMARK REPORT (BATCH 6)")
    print("=" * 90)
    print(f"Total Benchmark Items Tested     : {len(BATCH6_100_ITEMS)} items")
    print(f"Total Execution Elapsed Time     : {elapsed:.2f} seconds (avg {elapsed/len(BATCH6_100_ITEMS):.2f}s/item)")
    print("-" * 90)
    print(f"Step 1: Direct 1-Step Pass       : {step1_direct_pass} items ({(step1_direct_pass/100)*100:.1f}%)")
    print(f"Step 1: Interactive 2-Step Pass  : {step2_interactive_pass} items ({(step2_interactive_pass/100)*100:.1f}%)")
    print(f"★ TOTAL CLASSIFICATION ACCURACY  : {total_passed} / 100 ({overall_accuracy:.1f}%)")
    print(f"❌ Classification Errors          : {total_failures} items ({(total_failures/100)*100:.1f}%)")
    print("-" * 90)
    print(f"Pipeline Step 2 (Tariff/FTA Pass): {pipeline_step2_pass} / 100 ({(pipeline_step2_pass/100)*100:.1f}%)")
    print(f"Pipeline Step 3 (Clearance Laws) : {pipeline_step3_pass} / 100 ({(pipeline_step3_pass/100)*100:.1f}%)")
    print(f"Pipeline Step 4 (Action Plan/Doc): {pipeline_step4_pass} / 100 ({(pipeline_step4_pass/100)*100:.1f}%)")
    print("=" * 90)
    
    if failure_details:
        print("\n[DETAILED AUDIT OF ERRORED ITEMS]")
        for f in failure_details:
            print(f"• ID {f['id']:02d} [{f['cat']}] '{f['name']}' ➔ 도출 세번: {f['got_hsk']} (기대 호: {f['exp_hd']}) | 이유: {f['reason']}")
        print("=" * 90)

if __name__ == "__main__":
    run_batch6_benchmark()
