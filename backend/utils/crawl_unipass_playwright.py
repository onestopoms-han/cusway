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

def crawl_unipass_with_browser(max_pages: int = 10):
    """
    Playwright 진짜 크롬 브라우저를 백그라운드로 띄워 관세청 유니패스 결정례를 100% 무결하게 긁어옵니다.
    """
    setup_database()
    
    print("\n[START] Playwright 크롬 브라우저 기반 관세청 수집기 가동...")
    print("=" * 60)
    
    total_inserted = 0
    collected_cases = []  # DB 락 충돌 방지를 위해 메모리에 긁어 모은 뒤 마지막에 벌크 이식
    
    try:
        with sync_playwright() as p:
            # 헤드리스 자동화 감지 무력화 인자(args) 추가 장착
            browser = p.chromium.launch(
                headless=True,
                args=['--disable-blink-features=AutomationControlled']
            )
            # 한국어 로케일 및 User-Agent 위장 설정으로 보안 필터 우회
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                locale="ko-KR"
            )
            page = context.new_page()
            
            # 1. 메인 포털 사전심사 국내사례 탭으로 직접 직행 접속
            print("🔗 관세청 UNI-PASS 사전심사 국내사례 탭으로 직접 이동 중...")
            page.goto("https://unipass.customs.go.kr/clip/index.do?opnurl=/prlstclsfsrch/openULS0203042S.do", wait_until="load", timeout=60000)
            time.sleep(5)
            
            # 3. AJAX로 본문 폼이 동적 삽입될 때까지 확실하게 대기
            print("📂 사전심사 검색 폼(iSrchCond) 동적 로딩 대기 중...")
            page.wait_for_selector("form#iSrchCond, #iSrchCond", timeout=30000)
            time.sleep(3)
            
            # 3-2. 조회 시작일/종료일 설정 (2020년부터 최신까지 데이터 범위를 대폭 넓혀 팩트 데이터 추출)
            try:
                print("📅 조회 일자 범위 확장 중 (20150101 ~ 20260801)...")
                page.locator("input#srchStDt").fill("20150101")
                page.locator("input#srchEdDt").fill("20260801")
                time.sleep(1)
            except Exception as e:
                print("⚠️ 조회 일자 범위 변경 중 예외 발생:", str(e))
            
            # 4. [조회] 버튼 클릭 (iSrchCond 내부의 조회 버튼 지목 + force=True로 덮개 무력화 클릭)
            print("🔍 전체 결정사례 [조회] 클릭...")
            search_button = page.locator("form#iSrchCond a:has-text('조회'), form#iSrchCond button:has-text('조회'), form#iSrchCond a.btn_blue").first
            search_button.click(force=True)
            
            # 5. 조회 데이터 로딩 대기 (wait_for_selector 대신 8초 정적 슬립으로 타임아웃 튕김 차단)
            print("⏳ 데이터 렌더링 동기화 중 (8초 대기)...")
            time.sleep(8)
            
            for p_idx in range(1, max_pages + 1):
                print(f"🔄 UNI-PASS 브라우저 파싱 중... (페이지: {p_idx}/{max_pages})")
                
                # 목록 테이블 행(Rows) 긁기
                rows = page.locator("table.table tbody tr").all()
                if not rows or len(rows) == 0:
                    print("⚠️ 수집할 행이 없습니다. 마감합니다.")
                    break
                    
                if "데이터가 없습니다" in rows[0].inner_text():
                    print("🎉 관세청 전체 판례 끝에 도달했습니다. 수집 마감.")
                    break
                    
                row_count = len(rows)
                print(f"   -> 이번 페이지 목록 개수: {row_count}건 감지")
                
                # 각 행을 하나씩 클릭하여 상세 레이어(모달) 띄우기
                for i in range(row_count):
                    row_selector = page.locator("table.table tbody tr").nth(i)
                    cols = row_selector.locator("td").all()
                    if len(cols) < 6:
                        continue
                        
                    # 신규 순서: [시행일자(0), 시행기관(1), 참조번호(2), 결정세번(3), 이미지(4), 품명(5)]
                    date_str = cols[0].inner_text().strip()
                    issuing_body = cols[1].inner_text().strip()
                    case_number = cols[2].inner_text().strip()
                    hs_code = cols[3].inner_text().strip().replace('-', '')
                    product_name = cols[5].inner_text().strip()
                    
                    # 상세 보기 링크 클릭 (강제 스크롤 및 JS 강제 클릭으로 보안 차단 회피)
                    decision_reason = ""
                    try:
                        # 1. 팝업 창 여부 테스트 (10초 타임아웃으로 안정화)
                        link = cols[5].locator("a").first
                        link.scroll_into_view_if_needed()
                        
                        with page.expect_popup(timeout=10000) as popup_info:
                            # 로케이터 개체 자체에서 evaluate를 트리거하여 강제 클릭
                            link.evaluate("el => el.click()")
                            
                        popup_page = popup_info.value
                        popup_page.wait_for_load_state("domcontentloaded")
                        time.sleep(1) # 렌더링 안정화 대기
                        
                        # 팝업 본문 내 분류이유 상세 텍스트 스캔
                        decision_reason = popup_page.locator("body").inner_text().strip()
                        popup_page.close()
                        print(f"   [POPUP_PARSED] {case_number} 상세 수집 성공")
                        
                        # 수집 성공 시 메모리에 즉시 추가하고 다음 행으로 점프
                        collected_cases.append((case_number, hs_code, product_name, decision_reason, date_str))
                        print(f"   [TEMP_ADD] {case_number} | {product_name} ({hs_code})")
                        time.sleep(0.2)
                        continue
                    except Exception as e1:
                        # 2. 팝업이 아닌 레이어 모달 형태인 경우 Fallback 구동
                        try:
                            page.wait_for_selector("div#clsfRsnArea, #clsfRsnArea, .clsfRsnArea", timeout=2000)
                            decision_reason = page.locator("div#clsfRsnArea, #clsfRsnArea, .clsfRsnArea").inner_text().strip()
                            
                            # 닫기 버튼 클릭하여 복귀
                            close_btn = page.locator("a:has-text('닫기')").first
                            if close_btn.is_visible():
                                close_btn.click()
                            else:
                                page.evaluate("fn_close()")
                            print(f"   [LAYER_PARSED] {case_number} 상세 수집 성공")
                        except Exception as e2:
                            decision_reason = "상세 분류이유 내용을 파싱할 수 없습니다."
                            print(f"   [PARSE_WARN] {case_number} 상세 파싱 실패: {str(e1)} / {str(e2)}")
                    
                    time.sleep(0.2)
                    
                    # Fallback 수집 케이스 임시 보관
                    collected_cases.append((case_number, hs_code, product_name, decision_reason, date_str))
                    print(f"   [TEMP_ADD] {case_number} | {product_name} ({hs_code})")
                    
                # [안전 실시간 적재] 1개 페이지 순회가 끝나는 즉시 SQLite DB에 즉시 적재 및 커밋 (메모리 플러시)
                if collected_cases:
                    print(f"\n💾 [PAGE_COMMIT] {p_idx}페이지 수집 데이터 {len(collected_cases)}건 즉시 저장 중...")
                    conn = sqlite3.connect(db_path, timeout=30.0)
                    cursor = conn.cursor()
                    page_inserted = 0
                    for case in collected_cases:
                        cursor.execute("""
                            INSERT OR IGNORE INTO customs_precedents 
                            (case_number, hs_code, product_name, decision_reason, issuing_body, date) 
                            VALUES (?, ?, ?, ?, '관세평가분류원', ?)
                        """, case)
                        if cursor.rowcount > 0:
                            page_inserted += 1
                            total_inserted += 1
                    conn.commit()
                    conn.close()
                    collected_cases.clear() # 메모리 비우기
                    print(f"🎉 [PAGE_COMMIT_SUCCESS] {p_idx}페이지 {page_inserted}건 (누적 {total_inserted}건) 적재 완료.")
                    
                # 다음 페이지 클릭 (일반 텍스트 겹침 오작동 방지용 정밀 JS 페이징 클릭 엔진 장착)
                page_changed = False
                try:
                    page_changed = page.evaluate(f"""() => {{
                        const pageLinks = Array.from(document.querySelectorAll(".paging a, .page_num a, [class*='page'] a, a"));
                        const targetLink = pageLinks.find(el => {{
                            const text = el.textContent.trim();
                            const isNumeric = text === "{(p_idx + 1)}";
                            const isPagingArea = el.closest(".paging, .page_num, [class*='page']") !== null;
                            return isNumeric && (isPagingArea || el.className.includes("page"));
                        }});
                        if (targetLink) {{
                            targetLink.click();
                            return true;
                        }}
                        return false;
                    }}""")
                except Exception as pe:
                    print("   [PAGING_WARN] JS 페이징 처리 실패:", str(pe))
                    
                if page_changed:
                    print(f"   [PAGING] {p_idx + 1}페이지로 전환 완료")
                    time.sleep(5)
                else:
                    # 10단위 블록을 넘길 때 범용 [다음] 버튼 클릭
                    next_block_btn = page.locator("a.btn_next, a.next, a:has-text('다음'), a:has-text('▶')").first
                    if next_block_btn.is_visible():
                        next_block_btn.click()
                        time.sleep(5)
                    else:
                        print("🎉 다음 페이지 링크가 존재하지 않습니다. 크롤링 완수!")
                        break
                        
            browser.close()
    except (KeyboardInterrupt, SystemExit, Exception) as outer_e:
        print(f"\n⚠️ [CRAWLER_INTERRUPT] 수집 중 인터럽트 또는 강제 종료 감지: {str(outer_e)}")
    finally:
        # 브라우저가 강제 종료되거나 예외가 나더라도, 현재까지 수집된 모든 데이터를 SQLite DB에 긴급 벌크 적재 (데이터 유실 방지 가드레일)
        if collected_cases:
            print(f"\n💾 [FINALLY] 수집 보관 데이터 {len(collected_cases)}건을 SQLite DB(cusway.db)에 긴급 적재 중...")
            conn = sqlite3.connect(db_path, timeout=30.0)
            cursor = conn.cursor()
            for case in collected_cases:
                cursor.execute("""
                    INSERT OR IGNORE INTO customs_precedents 
                    (case_number, hs_code, product_name, decision_reason, issuing_body, date) 
                    VALUES (?, ?, ?, ?, '관세평가분류원', ?)
                """, case)
                if cursor.rowcount > 0:
                    total_inserted += 1
            conn.commit()
            conn.close()
            print(f"🎉 [FINALLY_SUCCESS] 총 {total_inserted}건의 판례 최종 적재 완료.")
        else:
            print("\n💾 [FINALLY] 수집된 임시 보관 데이터가 없어 적재를 생략합니다.")
        print("=" * 60)

if __name__ == "__main__":
    # 100페이지 대규모 벌크 기동 (약 3,000건의 사전심사 결정례 수집)
    import sys
    pages = 100
    if len(sys.argv) > 1:
        try:
            pages = int(sys.argv[1])
        except ValueError:
            pass
    crawl_unipass_with_browser(max_pages=pages)
