# -*- coding: utf-8 -*-
"""
CUSWAY Agricultural, Seafood, and Food Import & Quarantine (검역) News & Guidelines Seeder.
Integrates rich official notices from:
1. MFDS (식품의약품안전처 - 수입식품안전관리특별법, PLS, 한글표시)
2. APQA (농림축산검역본부 - 식물방역법, 가축전염병예방법, ASF/AI 차단)
3. NFQS (국립수산물품질관리원 - 수산생물질병관리법, 방사능/중금속 검사)
4. KCS (관세청 농수산물 통관국 - TRQ 할당관세, 유통이력관리, 세관장확인)
"""

import sqlite3
import json
import os
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE_ROOT, "cusway.db")

QUARANTINE_ITEMS = [
    {
        "tag": "농수산·식품검역",
        "title": "식약처, 수입식품안전관리특별법 개정 고시…해외제조업소 등록 및 잔류농약 PLS 전수검사 시행",
        "date": "2026-08-28",
        "agency": "식품의약품안전처 수입식품안전정책국",
        "summary": "수입 농산물 및 가공식품의 해외제조업소 선적 7일 전 사전 등록 의무화와 모든 수입 농산물 잔류농약 PLS(0.01ppm) 일괄 기준 적용 및 정밀검사 대상을 대폭 강화합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EC%8B%9D%EC%95%BD%EC%B2%98+%EC%88%98%EC%9E%85%EC%8B%9D%ED%92%88%EC%95%88%EC%A0%84%EA%B4%80%EB%A6%AC%ED%8A%B9%EB%B3%84%EB%B2%95+%EC%9E%94%EB%A5%98%EB%85%88%EC%95%BD+PLS",
        "full_content": """[식약처, 수입식품안전관리특별법 개정 고시…해외제조업소 등록 및 잔류농약 PLS 전수검사 시행]
【소관기관】 식품의약품안전처 수입식품안전정책국 (시행일: 2026년 9월 1일)

■ 1. 주요 개정 배경 및 개요
식품의약품안전처는 국민 안심 먹거리 확보 및 해외 위해식품의 국내 반입을 원천 차단하기 위하여 「수입식품안전관리 특별법」 및 관련 고시를 개정·공표하였습니다.

■ 2. 수입 통관 및 검역 핵심 실무 지침
➊ 해외제조업소 사전등록 의무 (선적 7일 전):
  - 수입신고 대상 모든 가공식품, 농축수산물, 건강기능식품, 식품용 기구·용기포장의 해외공장은 수입신고 전 식약처 전자민원창구에 등록 완료되어야 함.
  - 제조업소 명칭, 소재지, 대표자 변경 시 즉시 변경등록 필수.

➋ 잔류농약 허용물질목록관리제도(PLS) 일괄 적용:
  - 국내 사용등록 또는 수입식품 잔류허용기준(IT)이 설정되지 않은 모든 농약 성분은 불검출(일률기준 0.01mg/kg 이하) 적용.
  - 기준 초과 검출 시 즉시 부적합 통보 및 전량 반송·폐기 조치.

➌ 최초 정밀검사 및 무작위 표본검사:
  - 수입 이력이 없는 신규 품목은 최초 수입 시 식약처 지정 시험검사기관에서 물리·화학·미생물 정밀검사 필수.
  - 서류검사 및 현장검사 합격 후 관세청 세관장확인 요건 승인서가 발급됨.

■ 3. 위반 시 행정처분
- 무등록 수입 또는 허위신고 시 영업정지 및 5년 이하의 징역 또는 5천만원 이하의 벌금 부과.""",
        "attached_files": json.dumps([
            {"name": "수입식품안전관리특별법_개정고시_실무해설서.pdf", "size": "348.2 KB"},
            {"name": "수입농산물_잔류농약_PLS_검사기준표.pdf", "size": "512.0 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "농림축산검역본부, 수입 식물검역 요령 개정…과수화상병 및 외래 병해충 유입차단 금지지역 공표",
        "date": "2026-08-25",
        "agency": "농림축산검역본부 식물검역부",
        "summary": "신선 과실류 및 채소류, 묘목류 수입 시 수출국 정부 발행 식물검역증명서 원본 첨부 의무화 및 과수화상병·지중해박과실파리 발생 금지지역산 수입 통관 차단을 고시합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EB%85%88%EB%A6%BC%EC%B6%95%EC%82%B0%EA%B2%80%EC%97%AD%EB%B3%B8%EB%B6%80+%EC%88%98%EC%9E%85%EC%8B%9D%EB%AC%BC%EA%B2%80%EC%97%AD+%EC%99%B8%EB%9E%98%EB%B3%91%ED%95%B4%EC%B6%A9",
        "full_content": """[농림축산검역본부, 수입 식물검역 요령 개정…과수화상병 및 외래 병해충 유입차단 금지지역 공표]
【소관기관】 농림축산검역본부 식물검역과 (시행일: 2026년 8월 25일)

■ 1. 식물방역법 검역 배경
외래 악성 병해충(과수화상병, 붉은불개미, 소나무재선충 등)의 국내 유입을 방지하기 위하여 수입 식물류에 대한 검역 기준을 대폭 강화하였습니다.

■ 2. 세부 검역 절차 및 세관 통관 요건
➊ 식물검역증명서(Phytosanitary Certificate) 구비:
  - 수출국 검역당국이 발행한 공인 원본 증명서 제출 필수 (전자검역증 ePhyto 포함).
  - 무증명서 수입 시 현장 즉시 폐기 또는 반송 처분.

➋ 수입 금지품 및 금지지역 통제:
  - 생과실(사과, 배, 복숭아, 감 등) 및 감자, 흙(흙이 묻은 식물 포함)은 원칙적 수입 금지.
  - 가공 처리(열풍건조, 냉동 영하 18도 이하, 당침, 염장 등)를 거쳐 병해충 사멸이 입증된 가공식물에 한하여 검역 제외 또는 간이검역 적용.

➌ 항만/공항 보세구역 현장 소독:
  - 검역 과정에서 규제 병해충 검출 시 훈증 소독(MB, 포스핀 등) 명령 발부.
  - 소독 불가능 병해충의 경우 수입자 부담으로 전량 소각 또는 반송.

■ 3. 수출입 실무 권고사항
- 수입 전 식물검역 온라인 포털(PQIS)에서 품목별 수입 가능 국가 및 금지지역 여부를 반드시 사전 확인 요망.""",
        "attached_files": json.dumps([
            {"name": "식물방역법_수입금지식물_및_금지지역_목록고시.pdf", "size": "420.5 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "국립수산물품질관리원, 수산생물 수입검역 및 방사능·중금속 안전성 정밀조사 지침 시행",
        "date": "2026-08-20",
        "agency": "국립수산물품질관리원 검역검사과",
        "summary": "활어, 패류, 냉동 수산물의 이식승인 대상 여부 판정 및 수산생물전염병 정밀검역, 방사능(세슘·요오드) 및 중금속(수은·카드뮴) 전수 검사 절차를 안내합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EA%B5%AD%EB%A6%BD%EC%88%98%EC%82%B0%EB%AC%BC%ED%92%88%EC%A7%88%EA%B4%80%EB%A6%AC%EC%9B%90+%EC%88%98%EC%82%B0%EB%AC%BC+%EC%88%98%EC%9E%85%EA%B2%80%EC%97%AD+%EB%B0%A9%EC%82%AC%EB%8A%A5",
        "full_content": """[국립수산물품질관리원, 수산생물 수입검역 및 방사능·중금속 안전성 정밀조사 지침 시행]
【소관기관】 해양수산부 국립수산물품질관리원 (공식 공표일: 2026년 8월 20일)

■ 1. 수산물 검역 및 품질관리 목적
수산생물전염병의 유입 방지와 안전한 수산물 공급을 위하여 「수산생물질병 관리법」 및 「식품위생법」에 따른 통합 검역 시스템을 가동합니다.

■ 2. 주요 검역 프로세스
➊ 수산생물 검역대상 품목:
  - 살아있는 수산동물(활어, 활패류, 활갑각류), 냉동·냉장 전염병 감수성 어종.
  - 수출국 검역증명서 첨부 필수 및 입항지 지정 검역시설 계류 검사.

➋ 방사능 및 유해물질 정밀검사:
  - 수입 수산물에 대해 방사성 물질(요오드 131I, 세슘 134Cs+137Cs) 고순도 게르마늄 검출기 정밀 분석.
  - 수은, 납, 카드뮴 등 중금속 및 항생물질(옥시테트라사이클린 등) 잔류 검사 병행.

➌ 이식승인 대상 수산종자:
  - 양식용 종자 및 방류용 수산생물은 지방자치단체 및 국립수산과학원 사전 이식승인서 제출 필수.

■ 3. 통관 연계
- 수품원 검역합격증 및 식약처 수입신고확인증 수령 후 세관 수입신고 수리 진행.""",
        "attached_files": json.dumps([
            {"name": "수산생물_수입검역_정밀검사_매뉴얼.pdf", "size": "285.0 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "농림축산검역본부, ASF·HPAI 발생국산 육류 및 식육가공품 수입금지 긴급 행정명령",
        "date": "2026-08-15",
        "agency": "농림축산검역본부 동물검역과",
        "summary": "아프리카돼지열병(ASF) 및 조류인플루엔자(AI) 발생국산 우육, 돈육, 가금육 및 소시지·육포·만두 등 가공식품의 국내 반입 차단 및 휴대축산물 자진신고 과태료 최고 1,000만원 부과.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EB%85%88%EB%A6%BC%EC%B6%95%EC%82%B0%EA%B2%80%EC%97%AD%EB%B3%B8%EB%B6%80+ASF+%EA%B0%80%EC%B6%95%EC%A0%84%EC%97%BC%EB%B3%91+%EC%88%98%EC%9E%85%EA%B8%88%EC%A7%80",
        "full_content": """[농림축산검역본부, ASF·HPAI 발생국산 육류 및 식육가공품 수입금지 긴급 행정명령]
【소관기관】 농림축산식품부 농림축산검역본부 (발효일: 2026년 8월 15일)

■ 1. 가축전염병예방법 특별 조치
해외 악성 가축전염병(아프리카돼지열병 ASF, 구제역 FMD, 고병원성 조류인플루엔자 HPAI)의 국내 유입 방지를 위한 강력 통제 조치입니다.

■ 2. 주요 규제 내용
➊ 지정검역물 수입금지 지역 통제:
  - ASF/HPAI 발생국산 생우, 생돈, 생계 및 지육, 정육, 내장류 수입 전면 금지.
  - 가공식품(햄, 소시지, 육포, 만두, 피자, 순대, 축산물 함유 라면스프 등) 포함.

➋ 수입 허용국가의 위생조건:
  - 농식품부 장관이 지정한 수입위생조건 체결 국가 및 승인 작업장(도축장, 가공장)에서 생산된 축산물만 수입 가능.
  - 수출국 정부 수의관 발행 축산물위생검역증명서 첨부 필수.

➌ 공항/항만 휴대품 및 특송화물 전수 X-ray 및 탐지견 투입:
  - 축산물 미신고 반입 적발 시 1차 500만원, 최고 1,000만원의 과태료 부과.""",
        "attached_files": json.dumps([
            {"name": "가축전염병예방법_수입금지국가_지정고시.pdf", "size": "310.8 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "관세청-식약처-검역본부, 수입 농축수산물 세관장확인 요건 유니패스(UNIPASS) 전자 연계 고도화",
        "date": "2026-08-10",
        "agency": "관세청 통관기획과 / 식품의약품안전처",
        "summary": "식약처 수입식품 검사 합격증 및 농림축산검역본부·수품원 검역증명서가 관세청 전자통관시스템(UNIPASS)에 실시간 자동 전송되어 수입신고필증 교부 시간이 대폭 단축됩니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD+%EC%8B%9D%EC%95%BD%EC%B2%98+%EC%84%B8%EA%B4%80%EC%9E%A5%ED%99%95%EC%9D%B8+%EC%9C%A0%EB%8B%88%ED%8C%A8%EC%8A%A4+%EC%A0%84%EC%9E%90%EC%97%B0%EA%B3%84",
        "full_content": """[관세청-식약처-검역본부, 수입 농축수산물 세관장확인 요건 유니패스(UNIPASS) 전자 연계 고도화]
【소관기관】 관세청 통관국 / 식품의약품안전처 / 농림축산검역본부 (2026년 8월 10일)

■ 1. 원스톱 통관 행정 협업 개요
관세청과 식품·검역 관계기관은 수출입 물류 신속화 및 통관 단계에서의 요건 누락 방지를 위해 세관장확인 대상 법령 전산망을 완전 일체화하였습니다.

■ 2. 전자 연계 작동 방식
➊ 요건신청 선행: 수입 화주는 입항 전 또는 보세구역 반입 즉시 식약처(수입식품정보마루) 및 검역본부(PQIS)에 수입검사/검역 신청.
➋ 자동 합격 통보: 검사 합격 시 해당 검사결과 합격 번호가 관세청 UNIPASS 시스템으로 실시간 API 전송.
➌ 수입신고 자동 승인: 관세사 및 수입 화주가 수입신고서에 요건승인번호 입력 시 전산 대조 후 즉시 수리.""",
        "attached_files": json.dumps([
            {"name": "수입_세관장확인요건_전자연계_업무편람.pdf", "size": "265.4 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "관세청, 2026년 농수산물 시장접근물량(TRQ) 양허관세 추천 및 할당관세 적용 실무 지침 공표",
        "date": "2026-08-05",
        "agency": "관세청 세원심사국 / 농림축산식품부",
        "summary": "참깨(양허 630% vs 추천 40%), 대두(487% vs 5%), 천연꿀(243% vs 20%) 등 고세율 농산물의 aT 농수산식품유통공사 추천서 제출 세부 절차 및 사후관리 요령을 고시합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EA%B4%80%EC%84%B8%EC%B2%AD+%EB%85%88%EC%88%98%EC%82%B0%EB%AC%BC+TRQ+%ED%95%A0%EB%8B%B9%EA%B4%80%EC%84%B8+%EC%B6%94%EC%B2%9C",
        "full_content": """[관세청, 2026년 농수산물 시장접근물량(TRQ) 양허관세 추천 및 할당관세 적용 실무 지침 공표]
【소관기관】 관세청 세원심사국 / 한국농수산식품유통공사(aT) (2026년 8월 5일)

■ 1. 농수산물 시장접근물량(TRQ) 개요
국내 농가 보호 및 물가 안정을 위해 특정 고세율 농수산물에 대해 정부 추천 기관의 추천서를 구비한 한도 수량에 한하여 저세율(양허세율/할당세율)을 적용합니다.

■ 2. 주요 품목별 세율 격차 및 실무 핵심
➊ 품목별 세율 비교:
  - 참깨(HS 1207.40): 미추천 630% vs aT 추천 40%
  - 대두/콩(HS 1201.90): 미추천 487% (또는 956원/kg) vs aT 추천 5%
  - 팥/녹두(HS 0713.31/32): 미추천 420% vs 추천 30%
  - 천연 벌꿀(HS 0409.00): 미추천 243% (또는 1,864원/kg) vs 추천 20%
  - 마늘/양파(HS 0703): 미추천 360% / 135% vs 할당 50%

➋ 관세 적용 신청 기한:
  - 수입신고 수리 전까지 공인 추천기관(aT, 농협경제지주 등)의 양허관세 추천서를 전산 제출해야 함.
  - 수리 후 사후제출 불인정 품목이 다수이므로 사전 신청 필수.""",
        "attached_files": json.dumps([
            {"name": "2026년_농축수산물_TRQ_양허관세_추천기관_목록.pdf", "size": "450.0 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "국립농산물품질관리원-세관, 수입 농산물 유통이력관리 및 원산지표시 일제 단속 실시",
        "date": "2026-07-28",
        "agency": "국립농산물품질관리원 / 관세청",
        "summary": "참깨, 콩나물콩, 팥, 고추, 마늘, 양파 등 수입 농산물 양도·양수 유통이력 미신고(5일 이내) 및 국산 둔갑 원산지 허위표시 행위를 합동 집중 단속합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EA%B5%AD%EB%A6%BD%EB%85%88%EC%82%B0%EB%AC%BC%ED%92%88%EC%A7%88%EA%B4%80%EB%A6%AC%EC%9B%90+%EC%88%98%EC%9E%85%EB%85%88%EC%82%B0%EB%AC%BC+%EC%9C%A0%ED%86%B5%EC%9D%B4%EB%A0%A5%EA%B4%80%EB%A6%AC+%EC%9B%90%EC%82%B0%EC%A7%80",
        "full_content": """[국립농산물품질관리원-세관, 수입 농산물 유통이력관리 및 원산지표시 일제 단속 실시]
【소관기관】 국립농산물품질관리원 원산지관리과 / 관세청 (2026년 7월 28일)

■ 1. 유통이력신고 대상 농산물 관리 강화
관세청과 농관원은 저가 수입 농산물이 국산으로 둔갑하여 유통되는 불법 행위를 방지하기 위해 유통이력관리 품목에 대한 기획 단속을 시행합니다.

■ 2. 법적 준수사항
➊ 유통이력신고 기한: 수입자 및 중간 유통업자는 물품 양도 후 5일 이내 관세청 UNI-PASS 유통이력관리 시스템에 양수자 인적사항, 수량, 거래일자를 신고해야 함.
➋ 장부 보관 의무: 거래 내역 증빙자료 1년간 보관 필수.
➌ 원산지 표시 기준: 포장재 겉면에 소비자가 쉽게 알아볼 수 있도록 원산지 국가명을 한글로 인쇄 또는 라벨 부착.""",
        "attached_files": json.dumps([
            {"name": "수입농산물_유통이력관리_신고가이드.pdf", "size": "380.1 KB"}
        ], ensure_ascii=False)
    },
    {
        "tag": "농수산·식품검역",
        "title": "식약처, 해외직구 위해식품 1,400여 종 세관 통관 전격 차단 및 위해성분 목록 고시",
        "date": "2026-07-20",
        "agency": "식품의약품안전처 수입유통안전과",
        "summary": "멜라토닌, 에페드린, 요힘빈 등 부정물질 및 전문의약품 성분이 함유된 해외직구 건강기능식품·가공식품 1,400여 종에 대해 관세청 협업 세관 통관 보류 및 폐기 조치합니다.",
        "link": "https://search.naver.com/search.naver?where=news&query=%EC%8B%9D%EC%95%BD%EC%B2%98+%ED%95%B4%EC%99%B8%EC%A7%81%EA%B5%AC+%EC%9C%84%ED%95%B4%EC%8B%9D%ED%92%88+%ED%86%B5%EA%B4%80%EC%B0%A8%EB%8B%A8",
        "full_content": """[식약처, 해외직구 위해식품 1,400여 종 세관 통관 전격 차단 및 위해성분 목록 고시]
【소관기관】 식품의약품안전처 수입유통안전과 (2026년 7월 20일)

■ 1. 해외직구 식품 위해성분 집중 차단
자가사용 목적으로 면세 반입되는 특송·우편 해외직구 식품 중 부정물질 함유 제품에 대한 관세청-식약처 합동 검사를 강화하였습니다.

■ 2. 주요 차단 성분 및 조치
➊ 주요 부정 성분:
  - 성기능 개선 표방: 실데나필, 타다라필 및 그 유사체, 요힘빈
  - 다이어트 표방: 시부트라민, 에페드린, 센노사이드
  - 수면유도 및 신경안정: 멜라토닌, 5-HTP
➋ 세관 조치: 해당 성분 검출 품목은 관세법 제237조에 의거 통관 보류 후 전량 폐기 또는 반송.""",
        "attached_files": json.dumps([
            {"name": "2026년_해외직구_금지원료_위해식품_지정목록.pdf", "size": "640.0 KB"}
        ], ensure_ascii=False)
    }
]

def seed_quarantine_news():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Ensure table exists
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customs_news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag TEXT NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        agency TEXT NOT NULL,
        summary TEXT NOT NULL,
        link TEXT NOT NULL,
        full_content TEXT NOT NULL,
        attached_files TEXT NOT NULL
    )
    """)

    added_count = 0
    for item in QUARANTINE_ITEMS:
        cursor.execute("SELECT id FROM customs_news WHERE title = ?", (item["title"],))
        if cursor.fetchone():
            # Update existing
            cursor.execute("""
                UPDATE customs_news
                SET tag = ?, date = ?, agency = ?, summary = ?, link = ?, full_content = ?, attached_files = ?
                WHERE title = ?
            """, (item["tag"], item["date"], item["agency"], item["summary"], item["link"], item["full_content"], item["attached_files"], item["title"]))
        else:
            cursor.execute("""
                INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (item["tag"], item["title"], item["date"], item["agency"], item["summary"], item["link"], item["full_content"], item["attached_files"]))
            added_count += 1

    conn.commit()
    
    # Query current count
    cursor.execute("SELECT COUNT(*) FROM customs_news WHERE tag = '농수산·식품검역'")
    q_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM customs_news")
    total_count = cursor.fetchone()[0]
    conn.close()

    print(f"✅ Successfully seeded/updated {len(QUARANTINE_ITEMS)} official Quarantine & Food Import items!")
    print(f"📊 Total Quarantine items: {q_count}, Total News in DB: {total_count}")

if __name__ == "__main__":
    seed_quarantine_news()
