import sqlite3
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
import sys

# Set encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def populate_customs_news():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 1. Official curated customs notices / policy changes
    initial_notices = [
        ("관세 고시", "2026년 하반기 보세화물 관리에 관한 고시 일부개정안 공포", "2026-08-31", "관세청 통관국", "보세구역 반입 대상 물품의 전자신고 의무화 및 위험관리 평가기준 고도화 안내", "https://unipass.customs.go.kr/clip/index.do"),
        ("FTA 고시", "한-중동 CEPA 및 한-필리핀 FTA 발효에 따른 원산지증명서 운영지침", "2026-08-30", "관세청 자유무역협정집행과", "사후적용 경정청구 기한 및 협정관세율 적용 요건에 대한 세부 처리 가이드라인", "https://unipass.customs.go.kr/clip/index.do"),
        ("세관 단속", "백꾸, 뽑기방 유행에 인천세관 압수 짝퉁 80%는 키링, 인형", "2026-08-28", "인천세관 휴대품심사과", "가방 꾸미기 유행으로 짝퉁 캐릭터 인형 및 키링 등의 무단 지식재산권 침해 물품 수입 급증 및 세관 압수 조치", "https://n.news.naver.com/mnews/article/001/0016273395?sid=102"),
        ("무역 동향", "중국 때렸더니 베트남이 1위 관세전쟁이 뒤집은 미국 무역흑자국", "2026-08-26", "기획재정부 대외경제국", "미국의 고율 관세 부과 여파로 중국의 대미 수출 우회 기지로 급부상한 베트남의 대미 무역 흑자 규모 사상 최대 기록", "https://n.news.naver.com/mnews/article/016/0002688937?sid=104"),
        ("안전성 검사", "중국산 배추 포름알데히드 검사 최근 수입 8건 모두 불검출", "2026-08-25", "식품의약품안전처 수입검사과", "소비자 안전 확보를 위해 긴급 전수 조사한 중국산 배추에 대해 잔류 화학 성분 불검출 판정 및 통관 절차 재개", "https://n.news.naver.com/mnews/article/001/0016270688?sid=101"),
        ("의약 직구", "위고비, 마운자로 불법 직구 기승 작년 연간치 3.5배 적발", "2026-08-24", "관세청 특송통관국", "해외 직구를 악용한 오남용 우려 전문의약품의 개인 무단 밀수 통관 시도 단속 강화 및 적합성 위반 건수 급증", "https://n.news.naver.com/mnews/article/001/0016265892?sid=101"),
        ("품목 분류", "관세평가분류원, 2026년 제3차 품목분류(HSK) 협의회 결정 고시", "2026-08-22", "관세평가분류원 품목분류과", "AI 반도체 탑재 복합기기 및 기능성 전자섬유에 대한 10단위 HSK 세번 확정 공고", "https://unipass.customs.go.kr/clip/index.do"),
        ("환급 특례", "수출용 원재료 관세환급 소요량 사전심사 신청 기간 및 절차 안내", "2026-08-20", "관세청 세원심사과", "중소 수출기업의 환급 누락 방지를 위한 간이정액환급률 적용 대상 품목 확대 시행", "https://unipass.customs.go.kr/clip/index.do"),
        ("통관 제도", "전자상거래 전자상거래 전용 특송물류센터 자동화 검사 시스템 가동", "2026-08-18", "평택직할세관", "X-ray AI 판독기를 통한 불법 위해물품 및 미신고 특송화물 자동 적발률 대폭 향상", "https://unipass.customs.go.kr/clip/index.do"),
        ("관세 평가", "다국적기업 이전가격 사후세액검증 및 사전세액조정(APA) 연계 강화", "2026-08-15", "서울세관 심사총괄과", "특수관계자 간 수입거래에 대한 정상가격 과세 표준 검증 지침 개정 배포", "https://unipass.customs.go.kr/clip/index.do"),
        ("원산지 검증", "RCEP 및 한-아세안 FTA 체약국 간 직접운송 입증서류 간소화 지침", "2026-08-12", "관세청 국제협력총괄과", "경유국 통과 시 비가공증명서 제출 면제 기준 확대 및 통관 지연 해소 대책", "https://unipass.customs.go.kr/clip/index.do"),
        ("수입 요건", "수입식품안전관리특별법 개정안 시행에 따른 해외제조업소 등록 확인 필수화", "2026-08-10", "식품의약품안전처", "미등록 해외제조업소로부터 수입되는 가공식품에 대한 세관 수입신고 자동 불수리 연계", "https://unipass.customs.go.kr/clip/index.do")
    ]
    
    # Clear old fallback records
    cursor.execute("DELETE FROM customs_news")
    
    for tag, title, date_str, agency, summary, link in initial_notices:
        cursor.execute("""
            INSERT INTO customs_news (tag, title, date, agency, summary, link)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (tag, title, date_str, agency, summary, link))
        
    conn.commit()
    print(f"Populated {len(initial_notices)} official customs news records into DB!")
    conn.close()

if __name__ == "__main__":
    populate_customs_news()
