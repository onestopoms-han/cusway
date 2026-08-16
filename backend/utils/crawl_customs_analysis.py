# -*- coding: utf-8 -*-
import os
import time
import sqlite3
from playwright.sync_api import sync_playwright

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

def parse_material_and_use(text):
    """
    본문 텍스트에서 성분(재질) 및 용도(기능) 영역을 추출합니다.
    """
    material = "성상 및 화학 성분 정보 분석서 참조."
    function_use = "용도 및 기능 명세 참조."
    
    # 성상/재질 분석 적출
    import re
    mat_match = re.search(r"(성상|재질|성분|조성|구성).*?(?=용도|기능|분류이유|이유|$)", text, re.DOTALL)
    if mat_match:
        material = mat_match.group(0).strip()[:800]
        
    # 용도/기능 적출
    use_match = re.search(r"(용도|기능|작동|사용).*?(?=재질|성분|분류이유|이유|$)", text, re.DOTALL)
    if use_match:
        function_use = use_match.group(0).strip()[:800]
        
    return material, function_use

def crawl_customs_analysis(max_pages: int = 15):
    setup_database()
    
    print(f"\n[START] 중앙관세분석소 화학분석/성분 사례 수집 시작 (목표: {max_pages}페이지)...")
    print("=" * 60)
    
    total_inserted = 0
    collected_cases = []
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                args=['--disable-blink-features=AutomationControlled']
            )
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                locale="ko-KR"
            )
            page = context.new_page()
            
            # UNI-PASS 품목분류 국내사례 탭 접속
            page.goto("https://unipass.customs.go.kr/clip/index.do?opnurl=/prlstclsfsrch/openULS0203042S.do", wait_until="load", timeout=60000)
            time.sleep(5)
            
            page.wait_for_selector("form#iSrchCond, #iSrchCond", timeout=30000)
            time.sleep(2)
            
            # 조회 기간 설정
            try:
                page.locator("input#srchStDt").fill("20150101")
                page.locator("input#srchEdDt").fill("20260801")
                time.sleep(1)
            except Exception as e:
                print(f"[WARN] 조회 일자 설정 스킵: {e}")
                
            # 검색어 입력창에 "분석" (성분분석 사례 추출) 입력
            try:
                # srchSrwr가 검색어 인풋 필드
                page.locator("input#srchSrwr").fill("분석")
                time.sleep(1)
                print("[SEARCH] 검색어 입력완료: '분석' (관세분석소 회시 결과 타게팅)")
            except Exception as e:
                print(f"[WARN] 검색어 입력 실패: {e}")
            
            # 조회 클릭
            search_button = page.locator("form#iSrchCond a:has-text('조회'), form#iSrchCond button:has-text('조회'), form#iSrchCond a.btn_blue").first
            search_button.click(force=True)
            print("[WAIT] 데이터 조회 응답 동기화 중 (8초)...")
            time.sleep(8)
            
            for p_idx in range(1, max_pages + 1):
                print(f"[PAGE] 분석소 데이터 파싱 진행 중... (페이지: {p_idx}/{max_pages})")
                
                rows = page.locator("table.table tbody tr").all()
                if not rows or len(rows) == 0:
                    print("[WARN] 테이블 행을 찾을 수 없어 마감합니다.")
                    break
                    
                if "데이터가 없습니다" in rows[0].inner_text():
                    print("[FINISH] 분석례 데이터 수집 종점에 도달했습니다.")
                    break
                    
                row_count = len(rows)
                print(f"   -> 이번 페이지 목록 개수: {row_count}건 감지")
                
                for i in range(row_count):
                    try:
                        row_selector = page.locator("table.table tbody tr").nth(i)
                        cols = row_selector.locator("td").all()
                        if len(cols) < 6:
                            continue
                            
                        date_str = cols[0].inner_text().strip()
                        case_number = cols[2].inner_text().strip()
                        hs_code = cols[3].inner_text().strip().replace('-', '')
                        product_name = cols[5].inner_text().strip()
                        
                        # 이미 존재하는 사건번호는 스킵하되, issuing_body가 '중앙관세분석소'가 아니면 업데이트
                        conn_chk = sqlite3.connect(db_path)
                        cursor_chk = conn_chk.cursor()
                        cursor_chk.execute("SELECT issuing_body FROM customs_precedents WHERE case_number = ?", (case_number,))
                        chk_row = cursor_chk.fetchone()
                        conn_chk.close()
                        
                        if chk_row:
                            current_body = chk_row[0]
                            if current_body != '중앙관세분석소':
                                conn_up = sqlite3.connect(db_path)
                                cursor_up = conn_up.cursor()
                                cursor_up.execute("UPDATE customs_precedents SET issuing_body = '중앙관세분석소' WHERE case_number = ?", (case_number,))
                                conn_up.commit()
                                conn_up.close()
                                print(f"   [{i+1}/{row_count}] {case_number} 발행기관을 '중앙관세분석소'로 업데이트 완료.")
                                total_inserted += 1
                            else:
                                print(f"   [{i+1}/{row_count}] {case_number} 이미 분석소 정보로 적재되어 있음. 스킵.")
                            continue
                            
                        # 상세 보기 클릭
                        link = cols[5].locator("a").first
                        link.scroll_into_view_if_needed()
                        
                        decision_reason = ""
                        try:
                            with page.expect_popup(timeout=8000) as popup_info:
                                link.evaluate("el => el.click()")
                                
                            popup_page = popup_info.value
                            popup_page.wait_for_load_state("domcontentloaded")
                            time.sleep(1)
                            
                            full_text = popup_page.locator("body").inner_text().strip()
                            popup_page.close()
                            
                            # 화학분석 내용 기반으로 성분/용도 분할 파싱
                            material, function_use = parse_material_and_use(full_text)
                            decision_reason = full_text
                            
                            collected_cases.append((case_number, hs_code, product_name, material, function_use, decision_reason, date_str))
                            print(f"   [SUCCESS] {case_number} | {product_name} 분석 데이터 획득")
                        except Exception as e_pop:
                            # 팝업 실패 시 폴백 (레이어)
                            try:
                                page.wait_for_selector("div#clsfRsnArea, #clsfRsnArea, .clsfRsnArea", timeout=2000)
                                full_text = page.locator("div#clsfRsnArea, #clsfRsnArea, .clsfRsnArea").inner_text().strip()
                                
                                close_btn = page.locator("a:has-text('닫기')").first
                                if close_btn.is_visible():
                                    close_btn.click()
                                else:
                                    page.evaluate("fn_close()")
                                    
                                material, function_use = parse_material_and_use(full_text)
                                decision_reason = full_text
                                collected_cases.append((case_number, hs_code, product_name, material, function_use, decision_reason, date_str))
                                print(f"   [SUCCESS] {case_number} | {product_name} 분석 데이터 획득 (Fallback)")
                            except Exception as e_lay:
                                print(f"   [ERROR] {case_number} 상세 로딩 실패: {e_pop} / {e_lay}")
                                
                        time.sleep(0.3)
                    except Exception as e_row:
                        print(f"   [ERROR] {i+1}번째 행 처리 중 예외: {e_row}")
                        
                # 데이터 베이스 배치 저장
                if collected_cases:
                    print(f"\n💾 [PAGE_COMMIT] {p_idx}페이지 수집 데이터 {len(collected_cases)}건 저장 중...")
                    conn = sqlite3.connect(db_path, timeout=30.0)
                    cursor = conn.cursor()
                    page_inserted = 0
                    for case in collected_cases:
                        cursor.execute("""
                            INSERT OR IGNORE INTO customs_precedents 
                            (case_number, hs_code, product_name, material, function_use, decision_reason, issuing_body, date) 
                            VALUES (?, ?, ?, ?, ?, ?, '중앙관세분석소', ?)
                        """, case)
                        if cursor.rowcount > 0:
                            page_inserted += 1
                            total_inserted += 1
                    conn.commit()
                    conn.close()
                    collected_cases.clear()
                    print(f"[SUCCESS] {p_idx}페이지 {page_inserted}건 (누적 {total_inserted}건) 적재 완료.")
                
                # 다음 페이지 페이징 처리
                try:
                    # '다음' 버튼 혹은 페이지 번호 선택
                    current_page_num = p_idx
                    next_page_num = current_page_num + 1
                    
                    # 10페이지 단위 그룹 전환 예외 조치
                    if current_page_num % 10 == 0:
                        next_btn = page.locator("div.paging a.next, div.paging a.btn_next, div.paging a:has-text('>')").first
                        if next_btn.is_visible():
                            next_btn.click()
                            print(f"[PAGING] 다음 10페이지 그룹으로 전환 완료")
                            time.sleep(5)
                            continue
                        else:
                            print("[FINISH] 다음 페이지 그룹 버튼이 없습니다. 마감합니다.")
                            break
                            
                    # 일반 숫자 버튼 클릭
                    page_btn = page.locator(f"div.paging a:has-text('{next_page_num}'), div.paging span:has-text('{next_page_num}')").first
                    if page_btn.is_visible():
                        page_btn.click()
                        time.sleep(4)
                    else:
                        # a 태그 안에 숫자가 있는 경우
                        page_btn_alternative = page.locator(f"div.paging a[onclick*='fn_searchPage({next_page_num})'], div.paging a[onclick*='goPage({next_page_num})']").first
                        if page_btn_alternative.is_visible():
                            page_btn_alternative.click()
                            time.sleep(4)
                        else:
                            print(f"[FINISH] {next_page_num}페이지 이동 버튼이 없습니다. 마감합니다.")
                            break
                except Exception as e_page:
                    print(f"[ERROR] 페이징 전환 중 오류 발생: {e_page}")
                    break
                    
    except Exception as e_main:
        print(f"[CRITICAL] 메인 프로세스 예외 발생: {e_main}")
        
    print("=" * 60)
    print(f"[FINISH] 중앙관세분석소 데이터 적재 완료! 총 신규 추가 건수: {total_inserted}건")

if __name__ == "__main__":
    import sys
    pages = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    crawl_customs_analysis(pages)
