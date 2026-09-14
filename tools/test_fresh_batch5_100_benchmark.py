# -*- coding: utf-8 -*-
"""
CUSWAY 5th Fresh Batch: 100 Brand New Real-World Customs Benchmark
Evaluates the updated 2-Step Progressive Classification & Domain-Aware Pipeline across 100 completely new items:
  - Step 1: Rapid 1-Step Probe & GRI Classification / 2-Step Pinpoint Smart Chip
  - Step 2: Tariff & FTA Optimization
  - Step 3: Clearance Requirements & Statutes
  - Step 4: Administrative Documents & Action Plan
"""
import sys
import os
import time

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

# 완전히 새로운 제5차 100대 실무 고난도 품목 데이터셋 (Batch 5)
BATCH5_100_ITEMS = [
    # [1. 농축수산/식품/건기식 (15개)]
    {"id": 1, "cat": "식품/차류", "name": "말차라떼 파우더 (가당 탈지분유 배합 음료용 조제분말)", "mat": "말차 분말 15%, 탈지분유 30%, 설탕 55%", "func": "우유나 물에 타서 마시는 음료용 조제분말", "exp_ch": ["19", "21"], "exp_hd": ["1901", "2106"]},
    {"id": 2, "cat": "과실/냉동", "name": "냉동 아보카도 다이스 (단순 절단 급속동결)", "mat": "생과 아보카도 100%", "func": "비가열 급속 동결 식용 과실", "exp_ch": ["08"], "exp_hd": ["0811"]},
    {"id": 3, "cat": "커피/생두", "name": "에티오피아 예가체프 생두 (비로스팅 미가공 커피원두)", "mat": "생두 100%", "func": "로스팅 가공용 탈곡 건조 미가공 커피두", "exp_ch": ["09"], "exp_hd": ["0901"]},
    {"id": 4, "cat": "천연꿀", "name": "뉴질랜드산 마누카 꿀 (천연 생꿀 MGO 550+)", "mat": "천연 벌꿀 100%", "func": "소매 포장된 미가공 천연 꿀", "exp_ch": ["04"], "exp_hd": ["0409"]},
    {"id": 5, "cat": "수산가공", "name": "노르웨이산 훈제 연어 슬라이스 (훈제 가공 냉장)", "mat": "대서양 연어살 97%, 천일염 3%", "func": "소금 절임 후 참나무 훈연 가공한 수산물", "exp_ch": ["03", "16"], "exp_hd": ["0305", "1604"]},
    {"id": 6, "cat": "과실분말", "name": "동결건조 딸기 파우더 (첨가물 없는 순수 딸기 100% 분말)", "mat": "건조 딸기 100%", "func": "무가당 과실 건조 분말", "exp_ch": ["08", "11"], "exp_hd": ["0813", "1106", "2008"]},
    {"id": 7, "cat": "유지류", "name": "엑스트라버진 코코넛 오일 (비열처리 저온압착 식용유)", "mat": "코코넛 과육 압착유 100%", "func": "비가열 식용 식물성 고정유", "exp_ch": ["15"], "exp_hd": ["1513"]},
    {"id": 8, "cat": "유가공품", "name": "가당 연유 (당류 첨가 농축 우유)", "mat": "원유 55%, 설탕 45%", "func": "농축 가당 밀크 제과 원료", "exp_ch": ["04"], "exp_hd": ["0402"]},
    {"id": 9, "cat": "견과가공", "name": "볶은 해바라기씨 (소금 조미 구운 견과 스낵)", "mat": "해바라기씨 98%, 정제염 2%", "func": "열처리 볶음 조제 견과류", "exp_ch": ["20"], "exp_hd": ["2008"]},
    {"id": 10, "cat": "복합소스", "name": "태국산 똠얌꿍 페이스트 (복합 향신료 조미 페이스트)", "mat": "레몬그라스, 고추, 샬롯, 식물성유지, 식염", "func": "찌개 및 요리 조미용 복합 조미 소스", "exp_ch": ["21"], "exp_hd": ["2103"]},
    {"id": 11, "cat": "당류/시럽", "name": "캐나다산 메이플 시럽 (단풍나무 수액 농축 100%)", "mat": "메이플 수액 농축액 100%", "func": "팬케이크 및 제과용 천연 당 시럽", "exp_ch": ["17"], "exp_hd": ["1702"]},
    {"id": 12, "cat": "면/만두", "name": "냉동 만두 (돼지고기 25% 함유 교자만두 조제품)", "mat": "만두피(밀가루), 돼지고기 25%, 부추, 두부", "func": "가열 조리용 냉동 포장 만두", "exp_ch": ["19"], "exp_hd": ["1902"]},
    {"id": 13, "cat": "곡물분말", "name": "유기농 귀리 분말 (오트밀 제분 가루)", "mat": "귀리 100%", "func": "제과 및 식용 곡물 분말", "exp_ch": ["11"], "exp_hd": ["1104", "1102"]},
    {"id": 14, "cat": "음료류", "name": "콤부차 발효 음료 (홍차 발효 탄산 비알코올 음료)", "mat": "발효 홍차 추출액, 탄산수, 유기농 설탕, 천연향료", "func": "청량 탄산 발효 건강 음료", "exp_ch": ["22"], "exp_hd": ["2202"]},
    {"id": 15, "cat": "육가공품", "name": "호주산 와규 소고기 육포 (양념 건조 쇠고기포)", "mat": "소고기 우둔살 85%, 간장, 설탕, 향신료", "func": "양념 염장 후 열풍 건조한 조제 육류", "exp_ch": ["16"], "exp_hd": ["1602"]},

    # [2. 화학/의약/소재/화장품/플라스틱/고무 (20개)]
    {"id": 16, "cat": "화장품", "name": "세안용 효소 클렌징 파우더 (파파인 효소 함유 세안제)", "mat": "파파인 효소, 아미노산 계면활성제, 옥수수전분", "func": "물에 개어 거품을 내어 얼굴을 씻는 세안용 화장품", "exp_ch": ["33", "34"], "exp_hd": ["3304", "3401", "3307"]},
    {"id": 17, "cat": "합성수지", "name": "3D 프린터용 PLA 필라멘트 (폴리락트산 수지 압출 와이어)", "mat": "Poly Lactic Acid 수지 100%", "func": "3D 프린터 노즐에서 용융 적층되는 성형용 수지선", "exp_ch": ["39"], "exp_hd": ["3916"]},
    {"id": 18, "cat": "전지소재", "name": "리튬인산철(LFP) 양극활물질 분말 (LiFePO4 99.5%)", "mat": "Lithium Iron Phosphate 99.5%", "func": "이차전지 양극 슬러리 제조용 활물질 원료", "exp_ch": ["28", "38"], "exp_hd": ["2842", "3824"]},
    {"id": 19, "cat": "완제의약품", "name": "아세트아미노펜 정제 완제의약품 (해열진통제 500mg 소매포장)", "mat": "아세트아미노펜 500mg, 전분, 스테아르산마그네슘", "func": "발열 및 두통 치료용 복용 완제 의약품", "exp_ch": ["30"], "exp_hd": ["3004"]},
    {"id": 20, "cat": "점착필름", "name": "광학용 OCA 투명 점착 필름 (디스플레이 합지용 테이프)", "mat": "광학 아크릴 점착층, PET 이형필름", "func": "스마트폰 터치패널과 OLED를 접합하는 투명 양면필름", "exp_ch": ["39"], "exp_hd": ["3919"]},
    {"id": 21, "cat": "유기화합물", "name": "반도체 세정용 초고순도 이소프로필알코올 (IPA 99.999%)", "mat": "2-Propanol (단일 유기화합물) 99.999%", "func": "반도체 웨이퍼 세정 및 건조용 용제", "exp_ch": ["29"], "exp_hd": ["2905"]},
    {"id": 22, "cat": "천연고무", "name": "천연 고무 라텍스 액상 원료 (암모니아 안정화 원액)", "mat": "천연 고무 수액 60%, 물 및 암모니아 40%", "func": "고무장갑 및 폼 제조용 원료 라텍스", "exp_ch": ["40"], "exp_hd": ["4001"]},
    {"id": 23, "cat": "불소수지", "name": "불소수지 PTFE 바 (압출 테플론 원형 봉, 지름 50mm)", "mat": "Polytetrafluoroethylene 100%", "func": "기계 가공용 내화학성 플라스틱 환봉", "exp_ch": ["39"], "exp_hd": ["3916", "3926"]},
    {"id": 24, "cat": "메이크업", "name": "매트 립스틱 (착색 안료 및 왁스 배합 메이크업 완제품)", "mat": "마이크로크리스탈린 왁스, 식물성 오일, 유기 착색안료", "func": "입술 화장용 소매 포장 메이크업 제품", "exp_ch": ["33"], "exp_hd": ["3304"]},
    {"id": 25, "cat": "단열소재", "name": "고온 세라믹 단열 섬유 블랭킷 (알루미나 실리카 섬유 매트)", "mat": "Al2O3-SiO2 세라믹 섬유 100%", "func": "산업용 가열로 및 보일러 고온 단열 매트", "exp_ch": ["68"], "exp_hd": ["6806"]},
    {"id": 26, "cat": "이온교환수지", "name": "수처리용 양이온 교환 수지 펠릿 (스티렌계 이온교환수지)", "mat": "술폰산기 결합 가교 폴리스티렌 수지", "func": "정수 및 초순수 제조용 이온 흡착 교환 수지", "exp_ch": ["39"], "exp_hd": ["3914"]},
    {"id": 27, "cat": "의료재료", "name": "치과용 레진 시멘트 (치아 보철물 접착용 복합레진 완제품)", "mat": "비스메타크릴레이트 모노머, 실리카 나노 필러", "func": "크라운 및 인레이 치과 보철물 영구 접착제", "exp_ch": ["30"], "exp_hd": ["3006"]},
    {"id": 28, "cat": "도료", "name": "고광택 폴리에스터 분체도료 (정전분체 도장용 파우더 페인트)", "mat": "폴리에스테르 수지, 경화제, 이산화티타늄 안료", "func": "가전제품 및 알루미늄 섀시 정전 분체 도장 도료", "exp_ch": ["39", "32"], "exp_hd": ["3907", "3208", "3824"]},
    {"id": 29, "cat": "고무제품", "name": "실리콘 O-링 (내열 고무 실링 패킹 세트)", "mat": "가황 실리콘 고무 100%", "func": "배관 연결부 유체 누설 방지용 환형 고무 가스켓", "exp_ch": ["40"], "exp_hd": ["4016"]},
    {"id": 30, "cat": "의료용품", "name": "수술용 멸균 라텍스 장갑 (의료용 일회용 파우더프리 장갑)", "mat": "가황 천연고무 라텍스, 폴리머 코팅", "func": "수술실에서 외과의사가 착용하는 멸균 고무장갑", "exp_ch": ["40"], "exp_hd": ["4015"]},
    {"id": 31, "cat": "귀금속화합물", "name": "공업용 질산은 결정 (순도 99.8% 은 화합물)", "mat": "AgNO3 (단일 무기화합물) 99.8%", "func": "도금액 제조 및 화학 분석 시약", "exp_ch": ["28"], "exp_hd": ["2843"]},
    {"id": 32, "cat": "가죽", "name": "가구용 천연 소가죽 원단 (크롬 탄닌 무두질 마감 통가죽)", "mat": "소 가죽 100%", "func": "소파 및 의자 시트 제조용 가공 가죽", "exp_ch": ["41"], "exp_hd": ["4107"]},
    {"id": 33, "cat": "탄소제품", "name": "탄소섬유 직물 (CFRP 제조용 고강도 3K 카본 크로스)", "mat": "폴리아크릴로니트릴(PAN)계 탄소섬유사 직조 원단", "func": "항공기 및 스포츠용품 복합재료 성형용 직물", "exp_ch": ["68"], "exp_hd": ["6815"]},
    {"id": 34, "cat": "투습방수막", "name": "방수 통기성 ePTFE 멤브레인 필름 (아웃도어 원단용 필름)", "mat": "연신 다공성 폴리테트라플루오로에틸렌 100%", "func": "기능성 아웃도어 의류 라미네이팅용 미세다공성 막", "exp_ch": ["39"], "exp_hd": ["3920", "3921"]},
    {"id": 35, "cat": "비타민원료", "name": "고순도 나이아신아마이드 분말 (비타민 B3 의약/화장품용 원료)", "mat": "Nicotinamide (단일 화합물) 99.5%", "func": "피부 미백 화장품 및 영양제 제조용 비타민 원료", "exp_ch": ["29"], "exp_hd": ["2936"]},

    # [3. 섬유/의류/가죽/신발/잡화 (10개)]
    {"id": 36, "cat": "편직의류", "name": "남성용 메리노 울 100% 니트 스웨터 (편직 긴소매 상의)", "mat": "방적 모사(Merino Wool) 100%", "func": "보온용 남성 편직 니트 스웨터", "exp_ch": ["61"], "exp_hd": ["6110"]},
    {"id": 37, "cat": "직물의류", "name": "여성용 방풍 기능성 고어텍스 재킷 (직물제 등산 아우터)", "mat": "나일론 직물 겉감, PTFE 방수막, 심실링 테이프", "func": "등산 및 레저용 방수 방풍 직물제 재킷", "exp_ch": ["62"], "exp_hd": ["6202", "6201"]},
    {"id": 38, "cat": "가죽신발", "name": "천연 소가죽 남성용 구두 (가죽 갑피 및 가죽 밑창 드레스화)", "mat": "천연 소가죽 갑피, 가죽 본창, 고무 힐", "func": "정장 착용용 남성 가죽 신사화", "exp_ch": ["64"], "exp_hd": ["6403"]},
    {"id": 39, "cat": "운동화", "name": "통기성 에어메시 러닝화 (합성섬유 갑피 + 고무/EVA 밑창)", "mat": "폴리에스터 편직 갑피, 사출성형 EVA 중창, 합성고무 밑창", "func": "조깅 및 스포츠용 운동화", "exp_ch": ["64"], "exp_hd": ["6404"]},
    {"id": 40, "cat": "여행가방", "name": "여행용 폴리카보네이트 캐리어 하드케이스 (바퀴형 트렁크)", "mat": "폴리카보네이트 수지 외피, 알루미늄 핸들, 우레탄 바퀴", "func": "여행용 의류 및 소지품 수납 운반용 하드 수하물 가방", "exp_ch": ["42"], "exp_hd": ["4202"]},
    {"id": 41, "cat": "견직물잡화", "name": "실크 100% 디지털 프린팅 스카프 (핸드롤 마감)", "mat": "견직물(Silk) 100%", "func": "여성 목 장식용 실크 직물 스카프", "exp_ch": ["62"], "exp_hd": ["6214"]},
    {"id": 42, "cat": "타월/직물", "name": "초극세사 클리너 타월 (폴리에스터/나일론 혼방 직물)", "mat": "폴리에스터 80%, 폴리아미드 20%", "func": "자동차 세차 및 안경 렌즈 닦이용 초극세사 타월", "exp_ch": ["63"], "exp_hd": ["6307"]},
    {"id": 43, "cat": "방한의류", "name": "헤비 다운 점퍼 (오리 솜털 90% 충전 롱패딩)", "mat": "폴리에스터 방수 겉감, 덕다운 90% 깃털 10%", "func": "동절기 보온용 다운 충전 직물 파카", "exp_ch": ["62"], "exp_hd": ["6201"]},
    {"id": 44, "cat": "보호장갑", "name": "방화용 아라미드 소방관 안전장갑 (케블라 내열 보호장갑)", "mat": "아라미드 섬유(Kevlar) 겉감, 방수투습 멤브레인, 가죽 손바닥", "func": "화재 진압용 내열 방염 직물제 보호장갑", "exp_ch": ["62"], "exp_hd": ["6216"]},
    {"id": 45, "cat": "우산", "name": "원목 프레임 3단 접이식 자동 양우산", "mat": "방수 코팅 폴리에스터 폰지 원단, 스틸/알루미늄 살대, 원목 손잡이", "func": "비와 자외선을 차단하는 휴대용 접이식 우산", "exp_ch": ["66"], "exp_hd": ["6601"]},

    # [4. 비금속/철강/금속/하드웨어 (10개)]
    {"id": 46, "cat": "철강관", "name": "스테인리스 스틸 304 무계목(Seamless) 고압 배관 파이프", "mat": "STS304 합금강 (원형 단면)", "func": "석유화학 플랜트용 고압 유체 이송 무계목 강관", "exp_ch": ["73"], "exp_hd": ["7304"]},
    {"id": 47, "cat": "알루미늄형재", "name": "알루미늄 합금 6061 압출 T-슬롯 프로파일 프레임 (길이 3m)", "mat": "Al-Mg-Si 합금 (Al 6061-T6)", "func": "자동화 설비 및 3D 프린터 골격 조립용 압출 형재", "exp_ch": ["76"], "exp_hd": ["7604"]},
    {"id": 48, "cat": "밸브", "name": "황동(Brass) 볼 밸브 (나사산 연결 배관용 수동 밸브 1인치)", "mat": "단조 황동(C3771) 몸체, PTFE 시트, 스틸 레버", "func": "배관 라인의 유체 흐름을 수동 개폐 차단하는 볼밸브", "exp_ch": ["84"], "exp_hd": ["8481"]},
    {"id": 49, "cat": "나사/패스너", "name": "고장력 육각 볼트 및 너트 세트 (아연도금 합금강 볼트 M12)", "mat": "열처리 합금강 (강도 10.9), 아연도금 표면", "func": "건축 철골 구조물 및 기계 프레임 체결용 나사", "exp_ch": ["73"], "exp_hd": ["7318"]},
    {"id": 50, "cat": "동제품", "name": "배터리 팩용 니켈 도금 구리 버스바 (두께 3mm 전도성 바)", "mat": "무산소동(OFC) 99.9%, 니켈 도금", "func": "2차전지 모듈 간 대전류를 통전 연결하는 동 버스바", "exp_ch": ["74", "85"], "exp_hd": ["7407", "8544"]},
    {"id": 51, "cat": "절삭공구", "name": "다이아몬드 코어 드릴 비트 (콘크리트 천공용 원통형 비트)", "mat": "합금강 섕크 바디, 다이아몬드 지립 소결 세그먼트 팁", "func": "전동 해머드릴에 장착되어 콘크리트 및 석재를 뚫는 공구", "exp_ch": ["82"], "exp_hd": ["8207"]},
    {"id": 52, "cat": "주방용품", "name": "주철제 주방용 무쇠 프라이팬 (에나멜 코팅 스킬렛)", "mat": "주철(Cast Iron) 100%, 도자기질 에나멜 코팅", "func": "음식 조리 및 구이용 가정용 주방용품", "exp_ch": ["73"], "exp_hd": ["7323"]},
    {"id": 53, "cat": "유리제품", "name": "건축용 접합 안전유리 (PVB 필름 삽입 복층 강화유리)", "mat": "강화유리 판 2장, PVB 접합 필름(0.76mm)", "func": "건물 외벽 커튼월 및 난간용 파손 방지 안전유리", "exp_ch": ["70"], "exp_hd": ["7007"]},
    {"id": 54, "cat": "도금강판", "name": "용융아연도금 강판 코일 (두께 1.2mm GI 코일)", "mat": "탄소강 냉간압연 강판, 양면 아연도금", "func": "자동차 차체 패널 및 가전제품 외판용 도금 강판", "exp_ch": ["72"], "exp_hd": ["7210"]},
    {"id": 55, "cat": "초경공구", "name": "텅스텐 카바이드 4날 엔드밀 (CNC 가공용 초경 절삭공구)", "mat": "초미립자 초경합금(WC-Co), AlTiN 코팅", "func": "머시닝센터 밀링 가공으로 금속을 절삭하는 공구", "exp_ch": ["82"], "exp_hd": ["8207"]},

    # [5. 기계/엔진/자동화/냉난방/베어링 (15개)]
    {"id": 56, "cat": "산업용로봇", "name": "산업용 6축 다관절 수직 로봇 암 (가반하중 20kg 조립 로봇)", "mat": "알루미늄 주물 암, 서보모터 6개, 하모닉 드라이브 감속기", "func": "공장 생산라인에서 부품을 정밀 이송 및 조립하는 로봇", "exp_ch": ["84"], "exp_hd": ["8479", "8428"]},
    {"id": 57, "cat": "기계요소", "name": "볼스크류 액추에이터 (정밀 볼나사 및 리니어 가이드 일체형)", "mat": "합금강 볼스크류 축, 순환 볼 너트, 알루미늄 슬라이더 베이스", "func": "회전 운동을 고정밀 직선 왕복 운동으로 변환하는 기계요소", "exp_ch": ["84"], "exp_hd": ["8483", "8479"]},
    {"id": 58, "cat": "압축기", "name": "스크류식 공기 압축기 (75kW 오일인젝션 에어 컴프레셔)", "mat": "스크류 로터 쌍, 삼상 유도전동기, 오일 세퍼레이터, 방음 케이스", "func": "대기를 흡입 압축하여 8bar 고압 공기를 공급하는 압축기", "exp_ch": ["84"], "exp_hd": ["8414"]},
    {"id": 59, "cat": "액체펌프", "name": "원심식 다단 스테인리스 수중 펌프 (삼상 5.5kW 배수 펌프)", "mat": "STS304 임펠러 및 디퓨저, 밀폐형 수중 모터, 메카니컬 씰", "func": "지하수 및 산업용수를 양수 가압 이송하는 액체 펌프", "exp_ch": ["84"], "exp_hd": ["8413"]},
    {"id": 60, "cat": "유압모터", "name": "굴착기용 유압 액시얼 피스톤 모터 (감속기 일체형 주행모터)", "mat": "단조강 사축 실린더 블록, 피스톤, 유성기어 감속기 하우징", "func": "유압 오일의 압력 에너지를 회전 동력으로 변환하는 유압 모터", "exp_ch": ["84"], "exp_hd": ["8412"]},
    {"id": 61, "cat": "열교환기", "name": "산업용 판형 열교환기 (스테인리스 전열판 및 가스켓 조립체)", "mat": "STS316L 헤링본 전열 플레이트 50장, NBR 가스켓, 스틸 프레임", "func": "두 유체 간에 열을 직접 섞이지 않고 교환 전달하는 장치", "exp_ch": ["84"], "exp_hd": ["8419"]},
    {"id": 62, "cat": "공기정화기", "name": "클린룸용 FFU 팬필터유닛 (HEPA 필터 내장형 송풍기)", "mat": "BLDC 모터 팬, H14 HEPA 필터, 아연도금강판 챔버", "func": "반도체 클린룸 천장에 설치되어 공기를 여과 순환하는 송풍장치", "exp_ch": ["84"], "exp_hd": ["8421", "8414"]},
    {"id": 63, "cat": "내연기관", "name": "4행정 디젤 선박용 비상발전기 엔진 (출력 500kW 내연기관)", "mat": "주철 엔진 블록, 단조강 크랭크축, 터보차저, 커먼레일 연료분사장치", "func": "선박 내 비상 전력 공급용 발전기를 구동하는 압축점화식 엔진", "exp_ch": ["84"], "exp_hd": ["8408"]},
    {"id": 64, "cat": "베어링", "name": "정밀 깊은홈 볼베어링 (외경 52mm 고속 회전 전동기용)", "mat": "고탄소 크롬 베어링강(SUJ2) 내외륜, 강구 볼, 스틸 리테이너", "func": "기계 회전축의 마찰을 줄이고 하중을 지지하는 롤링 베어링", "exp_ch": ["84"], "exp_hd": ["8482"]},
    {"id": 65, "cat": "특수가공기", "name": "금속 3D 프린터 (선택적 레이저 용융 SLM 적층제조기)", "mat": "500W 파이버 레이저 발진기, 갈바노 스캐너, 불활성 챔버, 분말 베드", "func": "금속 분말을 레이저로 한 층씩 용융 소결하여 입체 조형하는 기계", "exp_ch": ["84"], "exp_hd": ["8477", "8486", "8479"]},
    {"id": 66, "cat": "포장기계", "name": "산업용 자동 라벨 부착기 (컨베이어 연동 자동 라벨러)", "mat": "스텝모터 라벨 피더, 광전 센서, 알루미늄 컨베이어 벨트", "func": "컨베이어로 이송되는 병/박스 표면에 롤 라벨을 자동 부착하는 기계", "exp_ch": ["84"], "exp_hd": ["8422"]},
    {"id": 67, "cat": "물류이송", "name": "스마트팩토리 AGV 무인 이송 대차 (자기유도 자율주행 물류 로봇)", "mat": "리튬 배터리, 듀얼 구동 모터, 자기센서 모듈, 강철 섀시", "func": "공장 바닥의 마그네틱 테이프를 따라 부품 파렛트를 무인 운반하는 대차", "exp_ch": ["84", "87"], "exp_hd": ["8428", "8709"]},
    {"id": 68, "cat": "반도체장비", "name": "반도체 웨이퍼 세정용 스핀 프로세서 (Single Spin Scrubber)", "mat": "테플론 챔버, 정밀 서보 스핀 척, 메가소닉 세정 노즐 아암", "func": "고속 회전하는 웨이퍼에 케미컬과 초순수를 분사하여 파티클을 세정하는 장비", "exp_ch": ["84"], "exp_hd": ["8486"]},
    {"id": 69, "cat": "감속기", "name": "산업용 서보모터 결합용 정밀 유성 기어 감속기", "mat": "침탄 담금질 합금강 썬 기어, 유성 캐리어, 주철 케이스", "func": "서보모터의 고속 회전을 감속하여 높은 토크를 출력하는 기어장치", "exp_ch": ["84"], "exp_hd": ["8483"]},
    {"id": 70, "cat": "식품가공기", "name": "전자동 에스프레소 커피 머신 (업소용 2그룹 머신)", "mat": "스테인리스 듀얼 보일러, 바이브레이션 로터리 펌프, PID 제어기", "func": "원두를 고압 고온의 물로 추출하여 에스프레소 커피를 만드는 기계", "exp_ch": ["84"], "exp_hd": ["8419", "8438", "8516"]},

    # [6. 전기/전자/통신/디스플레이/센서 (15개)]
    {"id": 71, "cat": "음향기기", "name": "액티브 노이즈 캔슬링 블루투스 무선 헤드폰", "mat": "40mm 다이내믹 드라이버, ANC 전용 DSP 칩, 리튬폴리머 배터리, 가죽 헤드밴드", "func": "스마트폰과 블루투스로 연결되어 음향을 재생하고 외부 소음을 차단하는 헤드폰", "exp_ch": ["85"], "exp_hd": ["8518"]},
    {"id": 72, "cat": "모니터", "name": "32인치 8K 미니 LED 전문가용 디스플레이 모니터", "mat": "Mini LED 백라이트 IPS 패널, 타이밍 컨트롤러, HDMI 2.1 AD보드, 알루미늄 스탠드", "func": "PC 그래픽카드의 고화질 8K 비디오 신호를 받아 화면에 출력하는 모니터", "exp_ch": ["85"], "exp_hd": ["8528"]},
    {"id": 73, "cat": "통신부품", "name": "5G 스마트폰용 mmWave RF 프론트엔드 모듈 (RFIC 내장)", "mat": "밀리미터파 전력증폭기(PA), LNA, 안테나 배열(AiP) 기판", "func": "28GHz 5G 초고주파 무선신호를 송수신 증폭 변환하는 반도체 모듈", "exp_ch": ["85"], "exp_hd": ["8517", "8542"]},
    {"id": 74, "cat": "스위치", "name": "스마트홈 IoT 매립형 터치 벽스위치 (Zigbee 무선 조명 스위치)", "mat": "정전용량 터치센서, 트라이액 릴레이 제어 회로, Zigbee 통신 칩", "func": "가정 내 전등 전원을 수동 터치 또는 스마트폰 앱으로 온/오프하는 스위치", "exp_ch": ["85"], "exp_hd": ["8536", "8537"]},
    {"id": 75, "cat": "전기충전기", "name": "전기차 완속 충전기 (7kW 220V 32A 벽걸이형 홈 충전기)", "mat": "타입1 충전 커넥터 케이블(5m), 제어보드(MCU), 누전차단기, 방수 외함", "func": "가정용 단상 교류 전원을 제어하여 전기차 배터리로 전력을 공급 충전하는 기기", "exp_ch": ["85"], "exp_hd": ["8504"]},
    {"id": 76, "cat": "영상기기", "name": "드론용 4K 짐벌 카메라 (3축 브러시리스 모터 짐벌 일체형)", "mat": "1/2인치 CMOS 이미지센서, 3축 서보 모터, IMU 자이로센서, 광학 렌즈", "func": "비행 중 진동을 상쇄하며 4K 고화질 항공 영상을 촬영 녹화하는 카메라", "exp_ch": ["85"], "exp_hd": ["8525"]},
    {"id": 77, "cat": "축전지", "name": "대용량 에너지저장장치(ESS)용 인산철 리튬이온 배터리 랙 (50kWh)", "mat": "LFP 배터리 모듈 10개, BMS 배터리관리시스템, 고전압 차단 스위치 랙", "func": "태양광 발전 전력을 대용량 저장했다가 전력망에 방전 공급하는 축전지", "exp_ch": ["85"], "exp_hd": ["8507"]},
    {"id": 78, "cat": "계측센서", "name": "스마트워치용 광학식 심박 및 산소포화도 PPG 바이오센서 모듈", "mat": "녹색/적색/적외선 LED 소자 4개, 포토다이오드 수광부, 아날로그 프론트엔드 IC", "func": "혈관의 맥파를 광학 반사로 측정하여 심박수와 SpO2를 계측하는 센서", "exp_ch": ["90", "85"], "exp_hd": ["9031", "8541", "9018"]},
    {"id": 79, "cat": "전자제어기", "name": "자동차용 CAN 통신 중앙 게이트웨이 ECU 전자제어장치", "mat": "듀얼코어 32비트 MCU 프로세서, CAN/LIN 트랜시버, 다층 PCB 기판", "func": "차량 내 서로 다른 네트워크 간 데이터를 라우팅 중계 제어하는 장치", "exp_ch": ["85", "90"], "exp_hd": ["8537", "9032"]},
    {"id": 80, "cat": "전력변환기", "name": "태양광 발전용 100kW 스트링 계통연계형 3상 인버터", "mat": "IGBT 스위칭 모듈, MPPT 컨트롤러, AC 출력 필터, 방열 알루미늄 인클로저", "func": "태양광 패널의 직류 600V를 한전 계통 3상 교류 380V로 변환 송전하는 인버터", "exp_ch": ["85"], "exp_hd": ["8504"]},
    {"id": 81, "cat": "기억장치", "name": "솔리드 스테이트 드라이브 (M.2 NVMe PCIe 4.0 SSD 2TB)", "mat": "3D TLC 낸드 플래시 메모리 IC, PCIe NVMe 컨트롤러 칩, DRAM 캐시", "func": "PC 및 서버에 장착되어 운영체제와 대용량 데이터를 비휘발성 저장하는 매체", "exp_ch": ["85"], "exp_hd": ["8523"]},
    {"id": 82, "cat": "유량계", "name": "산업용 초음파 유량계 (배관 외부 부착형 클램프온 계측기)", "mat": "압전 초음파 트랜스듀서 센서 쌍, 디지털 연산 변환기, LCD 표시창", "func": "초음파 전파 시간차를 측정하여 배관 손상 없이 유체 유량을 계측하는 기기", "exp_ch": ["90"], "exp_hd": ["9026"]},
    {"id": 83, "cat": "전원공급기", "name": "초고속 GaN 100W PD 멀티 USB-C 충전기 어댑터", "mat": "질화갈륨(GaN) 파워 IC, 고주파 변압기, Type-C PD 제어 칩, 난연 플라스틱 케이스", "func": "가정용 교류 220V를 직류 5V~20V 전압으로 고속 변환 충전하는 전원장치", "exp_ch": ["85"], "exp_hd": ["8504"]},
    {"id": 84, "cat": "자물쇠", "name": "스마트 디지털 도어락 (지문인식 + 번호 + 블루투스 일체형)", "mat": "아연 다이캐스팅 모티스 락, 광학 지문센서, 솔레노이드 모터 잠금장치", "func": "출입문 손잡이에 장착되어 전자식 인증으로 문을 잠그고 해제하는 자물쇠", "exp_ch": ["83"], "exp_hd": ["8301"]},
    {"id": 85, "cat": "전산장치", "name": "고성능 AI 추론용 PCIe 신경망 NPU 가속기 카드", "mat": "인공지능 NPU 반도체 칩, LPDDR5 메모리, PCIe 인터페이스 기판, 쿨링팬", "func": "서버 컴퓨터 메인보드에 장착되어 딥러닝 AI 연산을 초고속 가속하는 전산장비", "exp_ch": ["84", "85"], "exp_hd": ["8471", "8542"]},

    # [7. 모빌리티/광학/의료기기/가구/생활용품 (15개)]
    {"id": 86, "cat": "선박/보트", "name": "레저용 2인승 접이식 카약 (드롭스티치 고압 팽창식 보트)", "mat": "PVC 보강 드롭스티치 원단, 알루미늄 패들, EVA 폼 시트", "func": "공기를 주입하여 수상 레저 활동에 사용하는 팽창식 소형 보트", "exp_ch": ["89"], "exp_hd": ["8903"]},
    {"id": 87, "cat": "의료조명", "name": "수술실용 천장 고정식 무영등 LED 수술 조명기구", "mat": "고연색성 LED 모듈 60개, 다축 밸런스 스프링 암, 멸균 조절 손잡이", "func": "수술 부위에 그림자가 생기지 않도록 강력하고 균일한 빛을 비추는 조명", "exp_ch": ["94", "90"], "exp_hd": ["9405", "9018"]},
    {"id": 88, "cat": "사무용가구", "name": "인체공학 풀메쉬 사무용 회전의자 (요추 지지대 및 가스실린더 높낮이 조절)", "mat": "폴리에스터 통기성 탄성 메시, 알루미늄 다이캐스팅 오발 다리, 우레탄 바퀴", "func": "사무실에서 착석하여 업무를 보기 위한 회전식 높낮이 조절 의자", "exp_ch": ["94"], "exp_hd": ["9401"]},
    {"id": 89, "cat": "의료기기", "name": "디지털 수술용 복강경 내시경 카메라 시스템 (광원 장치 포함)", "mat": "4K 고해상도 로드 렌즈 광학 튜브, LED 광원 본체, 비디오 프로세서", "func": "인체 복강 내부에 삽입하여 장기 내부를 모니터로 관찰하는 의료용 내시경", "exp_ch": ["90"], "exp_hd": ["9018"]},
    {"id": 90, "cat": "광학기기", "name": "천체 관측용 굴절 망원경 (구경 102mm 삼각대 포함 세트)", "mat": "아크로매틱 2매 복합 렌즈, 알루미늄 경통, 적도의식 마운트, 스틸 삼각대", "func": "달과 행성, 별자리 천체를 육안으로 확대 관측하는 광학 망원경", "exp_ch": ["90"], "exp_hd": ["9005"]},
    {"id": 91, "cat": "가전기기", "name": "전자동 가정용 음식물처리기 (고온 건조 분쇄 방식 감량기)", "mat": "임펠러 분쇄 맷돌 블레이드, PTC 가열 히터, 활성탄 탈취 필터, 플라스틱 케이스", "func": "가정 내 음식물 쓰레기를 가열 건조 분쇄하여 부피를 감량시키는 전기기기", "exp_ch": ["85"], "exp_hd": ["8509"]},
    {"id": 92, "cat": "자전거부품", "name": "자전거용 알루미늄 유압 디스크 브레이크 캘리퍼 및 레버 세트", "mat": "단조 알루미늄 캘리퍼 몸체, 세라믹 피스톤 2개, 유압 호스, 레진 브레이크 패드", "func": "자전거 핸들 레버 조작으로 로터 원판을 압착 제동하는 유압식 브레이크", "exp_ch": ["87"], "exp_hd": ["8714"]},
    {"id": 93, "cat": "전열침구", "name": "자동온도조절 카본 탄소섬유 온열 매트 (싱글 전기요)", "mat": "탄소섬유 발열사 퀼팅 원단, 마이콤 디지털 온도조절기, 난연 솜", "func": "침대나 바닥에 깔고 전기를 공급하여 인체를 따뜻하게 하는 온열 매트", "exp_ch": ["85", "94", "63"], "exp_hd": ["8516", "9404", "6301"]},
    {"id": 94, "cat": "측량기기", "name": "골프용 레이저 거리측정기 (슬로프 보정 핀시커 거리계)", "mat": "반도체 펄스 레이저 다이오드(905nm), 광학 6배율 뷰파인더, OLED 디스플레이", "func": "목표 깃대까지의 직선 거리 및 경사 보정 거리를 레이저로 계측하는 기기", "exp_ch": ["90"], "exp_hd": ["9015", "9031"]},
    {"id": 95, "cat": "이동식전원", "name": "캠핑용 포터블 파워뱅크 (인산철 1000Wh AC 220V 인버터 내장형)", "mat": "LiFePO4 배터리 팩, 순수정현파 1200W 인버터, MPPT 태양광 충전기, 알루미늄 외함", "func": "야외에서 스마트폰, 노트북 및 220V 가전제품에 전력을 공급하는 휴대용 전원장치", "exp_ch": ["85"], "exp_hd": ["8507"]},
    {"id": 96, "cat": "가구류", "name": "전동 높이조절 스탠딩 데스크 (듀얼모터 책상)", "mat": "스틸 리프팅 컬럼 다리 2개, 듀얼 DC 모터, 파티클보드 LPM 상판, 메모리 컨트롤러", "func": "버튼 조작으로 상판 높이를 조절하여 서서 일할 수 있는 사무용 책상", "exp_ch": ["94"], "exp_hd": ["9403"]},
    {"id": 97, "cat": "운동기구", "name": "가정용 마그네틱 접이식 실내 자전거 (헬스 사이클)", "mat": "스틸 프레임, 마그네틱 플라이휠 저항 장치, 안장, LCD 운동 계기판", "func": "페달을 돌려 실내에서 유산소 운동을 하는 고정식 운동 기구", "exp_ch": ["95"], "exp_hd": ["9506"]},
    {"id": 98, "cat": "악기류", "name": "88건반 디지털 해머액션 피아노 (스탠드 및 3페달 세트)", "mat": "그레이디드 해머액션 건반, 스테레오 사운드 DSP 모듈, 앰프 스피커, 목재 스탠드", "func": "건반 터치를 센서로 감지하여 디지털 어쿠스틱 피아노 음향을 출력하는 전자악기", "exp_ch": ["92"], "exp_hd": ["9207"]},
    {"id": 99, "cat": "안전장구", "name": "오토바이용 풀페이스 카본 헬멧 (ECE 22.06 안전인증)", "mat": "탄소섬유 쉘, 고밀도 EPS 충격흡수 폼, 폴리카보네이트 안티포그 쉴드", "func": "이륜차 주행 시 라이더의 머리와 안면을 충격으로부터 보호하는 안전모", "exp_ch": ["65"], "exp_hd": ["6506"]},
    {"id": 100, "cat": "완구류", "name": "무선 조종 4채널 미니 드론 RC 쿼드콥터 (컨트롤러 포함)", "mat": "ABS 수지 프레임, 코어리스 모터 4개, 자이로스코프 비행제어보드, 2.4GHz 조종기", "func": "어린이 및 청소년이 리모컨으로 공중 비행 조종 놀이를 하는 완구", "exp_ch": ["95"], "exp_hd": ["9503"]}
]

def run_batch5_benchmark():
    print("=" * 90)
    print("      CUSWAY 5TH FRESH BATCH: 100 BRAND NEW CUSTOMS ITEMS BENCHMARK")
    print("=" * 90)
    
    db = SessionLocal()
    start_time = time.time()
    
    step1_direct_pass = 0
    step2_interactive_pass = 0
    total_failures = 0
    
    pipeline_step2_pass = 0  # FTA Rates
    pipeline_step3_pass = 0  # Clearance Requirements
    pipeline_step4_pass = 0  # Admin Docs
    
    failure_details = []
    
    for item in BATCH5_100_ITEMS:
        item_id = item["id"]
        cat = item["cat"]
        p_name = item["name"]
        p_mat = item["mat"]
        p_func = item["func"]
        exp_ch = item["exp_ch"]
        exp_hd = item["exp_hd"]
        
        # ----------------------------------------------------
        # Step 1 Test: 2-Step Progressive Classification Pipeline
        # ----------------------------------------------------
        # Phase 1: Probe
        probe_res = AICustomsClassificationProcessor.probe_clarification_needs(p_name, db)
        
        is_step1_passed = False
        resolved_hsk = "0000.00-0000"
        probe_matched_chip = None
        
        if probe_res.get("needs_clarification"):
            # Interactive Smart Chip Phase
            chips = probe_res.get("suggested_chips", [])
            # Simulate picking the best matching chip based on material/function specification
            chosen_chip = chips[0] if chips else ""
            for c in chips:
                if any(k in c for k in p_mat.split() + p_func.split()):
                    chosen_chip = c
                    break
            probe_matched_chip = chosen_chip
            
            # Run with chosen chip
            if probe_res.get("clarification_type") == "MATERIAL":
                cls_res = AICustomsClassificationProcessor.run_classification_pipeline(
                    product_name=p_name,
                    material=chosen_chip,
                    function_use=p_func,
                    db=db
                )
            else:
                cls_res = AICustomsClassificationProcessor.run_classification_pipeline(
                    product_name=p_name,
                    material=p_mat,
                    function_use=chosen_chip,
                    db=db
                )
        else:
            cls_res = probe_res.get("direct_result") or AICustomsClassificationProcessor.run_classification_pipeline(
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
        
        # Exact 10-digit DB validity check
        master_entry = db.query(HSCodeMaster).filter(
            (HSCodeMaster.hs_code == resolved_hsk) | 
            (HSCodeMaster.hs_code == clean_hsk) |
            (HSCodeMaster.hs_code.like(f"{hd4}%"))
        ).first()
        is_valid_db_code = master_entry is not None
        
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
            # Step 2: Optimal Tariff & FTA Rates
            rates_res = get_hs_rates_api(resolved_hsk, db=db)
            if rates_res and "rates" in rates_res and "base_rate" in rates_res["rates"]:
                pipeline_step2_pass += 1
        except Exception:
            pass

        try:
            # Step 3 & 4: Clearance Requirements & Admin Documents
            guide_res = get_clearance_guide_api(resolved_hsk, db)
            if guide_res and "requirements" in guide_res:
                pipeline_step3_pass += 1
                # If requirements exist or general customs guide available
                if len(guide_res["requirements"]) > 0:
                    first_req = guide_res["requirements"][0]
                    if "guide" in first_req and "documents" in first_req["guide"]:
                        pipeline_step4_pass += 1
                else:
                    # General clearance admin documents (B/L, Invoice, Packing List)
                    pipeline_step4_pass += 1
        except Exception:
            pass

        print(f"[{item_id:03d}/100] [{cat:^8s}] {p_name[:36]:<38s} ➔ {resolved_hsk:<14s} | {status_str}")

    db.close()
    elapsed = time.time() - start_time
    total_passed = step1_direct_pass + step2_interactive_pass
    overall_accuracy = (total_passed / len(BATCH5_100_ITEMS)) * 100.0
    
    print("\n" + "=" * 90)
    print("                     FINAL 100 FRESH ITEMS BENCHMARK REPORT")
    print("=" * 90)
    print(f"Total Benchmark Items Tested     : {len(BATCH5_100_ITEMS)} items")
    print(f"Total Execution Elapsed Time     : {elapsed:.2f} seconds (avg {elapsed/len(BATCH5_100_ITEMS):.2f}s/item)")
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
    run_batch5_benchmark()
