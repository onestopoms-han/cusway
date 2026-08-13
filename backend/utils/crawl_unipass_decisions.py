# -*- coding: utf-8 -*-
import os
import time
import re
import requests
from bs4 import BeautifulSoup
import sqlite3

# 관세청 UNI-PASS 품목분류 결정사례 조회용 서블릿 주소
POST_URL = "https://unipass.customs.go.kr/clip/hsinfosrch/openULS0201007Q.do" # 결정사례 조회 서블릿
DETAIL_URL = "https://unipass.customs.go.kr/clip/hsinfosrch/openULS0201007D.do" # 결정사례 상세 서블릿

db_path = 'c:/Users/PJH/onestop-ai-custom-service/cusway.db'

def setup_database():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customs_precedents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_number TEXT UNIQUE NOT NULL,
        hs_code TEXT NOT NULL,
        product_name TEXT NOT NULL,
        material TEXT,
        function_use TEXT,
        decision_reason TEXT NOT NULL,
        issuing_body TEXT DEFAULT '관세평가분류원',
        date TEXT
    )
    """)
    conn.commit()
    conn.close()

def crawl_unipass_decisions(max_pages: int = 20):
    """
    requests.Session()을 통해 쿠키 세션을 맺고 유니패스 결정례를 파싱하여 적재합니다.
    """
    setup_database()
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("\n[START] 관세청 UNI-PASS 세션 동기화 기반 크롤러 기동...")
    print("=" * 60)
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Referer': 'https://unipass.customs.go.kr/clip/index.do'
    }
    
    session = requests.Session()
    
    try:
        # 1. index.do를 먼저 호출하여 세션 쿠키(JSESSIONID 등)를 발급받아 세션 객체에 자동 저장
        print("🔗 관세청 UNI-PASS 세션 접속 및 쿠키 확보 중...")
        init_res = session.get("https://unipass.customs.go.kr/clip/index.do", headers=headers, timeout=15)
        print(f"   -> 세션 상태 코드: {init_res.status_code}")
        
        total_inserted = 0
        
        for page in range(1, max_pages + 1):
            print(f"🔄 관세청 UNI-PASS 폼 조회 중... (페이지: {page}/{max_pages})")
            
            # 목록 조회를 위한 POST 데이터
            data = {
                'pageIndex': page,
                'recordCountPerPage': 10,
                'searchHsCode': '',
                'searchProdNm': '',
                'searchClsfNo': ''
            }
            
            # 2. 세션 객체로 목록 검색 요청을 전송
            response = session.post(POST_URL, data=data, headers=headers, timeout=15)
            if response.status_code != 200:
                print(f"❌ {page}페이지 목록 요청 실패 (HTTP {response.status_code})")
                time.sleep(5)
                continue
                
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 테이블 탐색
            table = soup.find('table', {'class': 'board_list'})
            if not table:
                table = soup.find('table')
                
            if not table:
                print("⚠️ 목록 테이블을 검출하지 못했습니다. 응답 형식을 점검하십시오.")
                # 디버깅용 덤프 출력
                print(response.text[:500])
                break
                
            rows = table.find('tbody').find_all('tr') if table.find('tbody') else table.find_all('tr')[1:]
            
            if not rows or "데이터가 없습니다" in rows[0].text or len(rows) == 0:
                print("🎉 더 이상 수집할 결정례 데이터가 없습니다. 수집 마감.")
                break
                
            for row in rows:
                cols = row.find_all('td')
                if len(cols) < 5:
                    continue
                    
                # 항목 추출
                case_number = cols[1].text.strip() # 분류번호 (제2023-XX호)
                hs_code = cols[2].text.strip().replace('-', '') # HS코드
                product_name = cols[3].text.strip() # 품명
                date_str = cols[4].text.strip() if len(cols) > 4 else "" # 일자
                
                # 상세 이동 링크 onclick 파싱
                link_node = cols[3].find('a')
                if not link_node:
                    continue
                
                onclick_val = link_node.get('onclick', '')
                id_match = re.search(r"fn_detail\('([^']+)'", onclick_val)
                if not id_match:
                    continue
                decision_id = id_match.group(1)
                
                # 3. 세션 유지 상태로 상세 결정이유 전송
                detail_data = {
                    'clsfNo': decision_id,
                    'pageIndex': page
                }
                
                detail_response = session.post(DETAIL_URL, data=detail_data, headers=headers, timeout=15)
                if detail_response.status_code != 200:
                    continue
                    
                detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
                
                # 결정 사유 영역 파싱
                reason_area = detail_soup.find('div', {'id': 'clsfRsnArea'}) or detail_soup.find('td', {'class': 'board_view_content'})
                decision_reason = reason_area.text.strip() if reason_area else "상세 본문 파싱 지연"
                
                # SQLite DB 적재 (중복 무시)
                cursor.execute("""
                    INSERT OR IGNORE INTO customs_precedents 
                    (case_number, hs_code, product_name, decision_reason, issuing_body, date) 
                    VALUES (?, ?, ?, ?, '관세평가분류원', ?)
                """, (case_number, hs_code, product_name, decision_reason, date_str))
                
                if cursor.rowcount > 0:
                    total_inserted += 1
                    print(f"   [ADD] {case_number} | {product_name} ({hs_code})")
                    
            conn.commit()
            print(f"   -> {page}페이지 크롤링 완료 (누적 신규 수집: {total_inserted}건)")
            
            # 방화벽 우회용 지능형 지연
            time.sleep(1.5)
            
    except Exception as e:
        print(f"⚠️ 크롤러 중대 중단 에러: {str(e)}")
    finally:
        conn.close()
        print("=" * 60)
        print(f"🎉 [SUCCESS] 세션 동기화 기반 크롤러 완수! 최종 {total_inserted}건 적재 완료.")

if __name__ == "__main__":
    # 시범 10페이지 기동 (총 100건 상당)
    crawl_unipass_decisions(max_pages=10)
