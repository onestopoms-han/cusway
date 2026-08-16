# -*- coding: utf-8 -*-
import os
import re
import time
import sqlite3
from playwright.sync_api import sync_playwright

db_path = 'c:/Users/PJH/onestop-ai-custom-service/cusway.db'

def setup_database():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS precedents (
        id TEXT PRIMARY KEY,
        category TEXT NOT NULL,
        category_ko TEXT NOT NULL,
        case_number TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        authority TEXT NOT NULL,
        date TEXT NOT NULL,
        key_issue TEXT NOT NULL,
        factual_background TEXT NOT NULL,
        holding_ko TEXT NOT NULL,
        customs_argument TEXT NOT NULL,
        importer_argument TEXT NOT NULL,
        reasoning_snippet TEXT NOT NULL,
        implication_ko TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def parse_detail_text(raw_text):
    """
    조세심판원 결정문 본문 텍스트를 구조화된 필드로 나눕니다.
    """
    key_issue = "정보 없음"
    factual_background = "상세 쟁송 사실관계 및 물품 거래 개요 참조."
    customs_argument = "처분청은 관련 법령 및 수입 거래 조건을 근거로 과세 유지를 주장함."
    importer_argument = "청구인은 특수관계 영향이 없으며 거래 조건성이 배제되므로 비과세를 주장함."
    holding_ko = "기각 또는 인용 결정."
    reasoning_snippet = "세법 및 관세법 제30조(과세가격 결정원칙) 기준에 의한 상세 결정 판단 이유 참조."
    implication_ko = "로열티 가산성 및 특수관계자 가격 영향 방어 소명 시 거래 조건성과 비교가능 가격 분석 자료의 입증이 절대적으로 중요함."

    issue_match = re.search(r"쟁점.*?(?=\n|처분개요|사실관계|청구법인|처분청|$)", raw_text, re.DOTALL)
    if issue_match:
        key_issue = issue_match.group(0).strip()[:300]

    bg_match = re.search(r"(처분개요|사실관계).*?(?=처분청|청구인 주장|청구법인 주장|판단|결정요지|$)", raw_text, re.DOTALL)
    if bg_match:
        factual_background = bg_match.group(0).strip()[:1000]

    customs_match = re.search(r"(처분청 의견|처분청은).*?(?=청구법인 주장|청구인 주장|청구인과|판단|심리|$)", raw_text, re.DOTALL)
    if customs_match:
        customs_argument = customs_match.group(0).strip()[:1000]

    importer_match = re.search(r"(청구법인 주장|청구인 주장|청구법인은|청구인은).*?(?=판단|심리 및 판단|이유|$)", raw_text, re.DOTALL)
    if importer_match:
        importer_argument = importer_match.group(0).strip()[:1000]

    holding_match = re.search(r"(판단|심리 및 판단|결정요지|주문).*?(?=결정일|이유|$)", raw_text, re.DOTALL)
    if holding_match:
        holding_ko = holding_match.group(0).strip()[:800]
        reasoning_snippet = holding_match.group(0).strip()[:1000]

    if len(raw_text) > 200:
        if factual_background == "상세 쟁송 사실관계 및 물품 거래 개요 참조.":
            factual_background = raw_text[:800]
        if reasoning_snippet == "세법 및 관세법 제30조(과세가격 결정원칙) 기준에 의한 상세 결정 판단 이유 참조.":
            reasoning_snippet = raw_text[-800:]

    return key_issue, factual_background, customs_argument, importer_argument, holding_ko, reasoning_snippet, implication_ko

def crawl_tax_tribunal_bulk(max_items: int = 1000):
    setup_database()
    
    print(f"\n[START] 조세심판원 대용량 관세 결정례 수집 시작 (목표: {max_items}건)...")
    print("=" * 60)

    inserted_count = 0
    current_page = 1
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="ko-KR"
        )
        page = context.new_page()
        
        # 1. 상세검색 리스트 페이지로 이동
        page.goto("https://www.tt.go.kr/mUser/dem/searchDemList.do")
        time.sleep(3)
        
        # 2. 세목 구분에서 '관세' 선택
        page.locator("label:has-text('관세')").first.click()
        time.sleep(1)
        
        # 3. 빈 키워드 검색 에러 우회를 위해 공백(" ") 또는 "관세" 입력
        page.locator("input#searchWord").fill("관세")
        time.sleep(1)
        
        # 4. 검색하기 클릭
        page.locator("button.btn:has-text('검색하기')").click()
        time.sleep(4)
        
        while inserted_count < max_items:
            print(f"[PAGE] 현재 리스트 페이지: {current_page} 페이지 분석 중 (누적 적재: {inserted_count}건)...")
            
            # 리스트 파싱
            boxes = page.locator("ul.result-wrap li.result-box").all()
            if not boxes or len(boxes) == 0:
                print("[WARN] 수집할 리스트가 존재하지 않습니다. 종료.")
                break
                
            items_to_crawl = []
            for box in boxes:
                try:
                    title_link = box.locator(".result-tit a")
                    title = title_link.inner_text().strip()
                    
                    onclick_attr = title_link.get_attribute("onclick")
                    match = re.search(r"dem_no=(\d+)", onclick_attr)
                    dem_no = match.group(1) if match else None
                    
                    semok_match = re.search(r"semok=(\d+)", onclick_attr)
                    semok = semok_match.group(1) if semok_match else "90"
                    
                    case_num_text = box.locator(".result-txt .info p.case-num").inner_text().strip()
                    case_number = case_num_text.replace("청구번호 :", "").strip()
                    
                    date_text = box.locator(".result-txt .info p.date").inner_text().strip()
                    decision_date = date_text.replace("결정일 :", "").strip()
                    
                    if dem_no:
                        detail_url = f"https://www.tt.go.kr/mUser/dem/searchEngineDemViewPopup.do?semok={semok}&dem_no={dem_no}"
                        items_to_crawl.append({
                            "title": title,
                            "case_number": case_number,
                            "date": decision_date,
                            "detail_url": detail_url
                        })
                except Exception as e:
                    pass
            
            # 상세 페이지 정보 긁기 및 저장
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            for idx, item in enumerate(items_to_crawl):
                if inserted_count >= max_items:
                    break
                    
                try:
                    cursor.execute("SELECT COUNT(*) FROM precedents WHERE case_number = ?", (item["case_number"],))
                    if cursor.fetchone()[0] > 0:
                        continue
                        
                    # 본문 상세 로딩
                    detail_page = context.new_page()
                    detail_page.goto(item["detail_url"], timeout=30000)
                    time.sleep(1.5)
                    
                    full_text = detail_page.locator("body").inner_text()
                    detail_page.close()
                    
                    if not full_text or len(full_text.strip()) < 10:
                        continue
                        
                    # 본문 기반 구조화 분할
                    k_issue, f_bg, c_arg, i_arg, h_ko, r_snippet, imp_ko = parse_detail_text(full_text)
                    
                    # 카테고리 기소 분석에 따라 매핑
                    category = "valuation-other"
                    category_ko = "기타 과세가격/평가방법"
                    if "로열티" in item["title"] or "권리사용료" in item["title"]:
                        category = "royalty"
                        category_ko = "권리사용료 (로열티)"
                    elif "특수관계" in item["title"] or "이전가격" in item["title"]:
                        category = "transfer-pricing"
                        category_ko = "특수관계자 거래 (이전가격)"
                    elif "생산지원" in item["title"]:
                        category = "assists"
                        category_ko = "생산지원비"
                    elif "간접지급" in item["title"]:
                        category = "indirect-payment"
                        category_ko = "간접지급액"
                        
                    # ID 생성
                    cursor.execute("SELECT COUNT(*) FROM precedents")
                    current_total = cursor.fetchone()[0]
                    val_id = f"VAL-TAX-{current_total + 1:03d}"
                    
                    cursor.execute("""
                    INSERT INTO precedents (
                        id, category, category_ko, case_number, title, authority, date,
                        key_issue, factual_background, holding_ko, customs_argument, importer_argument, reasoning_snippet, implication_ko
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (
                        val_id, category, category_ko, item["case_number"], item["title"],
                        "조세심판원", item["date"], k_issue, f_bg, h_ko, c_arg, i_arg, r_snippet, imp_ko
                    ))
                    conn.commit()
                    inserted_count += 1
                    print(f"[SUCCESS] [{inserted_count}/{max_items}] {item['case_number']} DB 저장 성공!")
                    
                except Exception as e:
                    print(f"[ERROR] {item['case_number']} 처리 실패: {e}")
                    
            conn.close()
            
            # 다음 페이지로 페이징 전환 (goToPage JS 호출 탑재)
            next_page = current_page + 1
            print(f"[PAGING] 다음 {next_page} 페이지로 전환 중...")
            try:
                # 다음 페이지 함수 실행
                page.evaluate(f"goToPage('{next_page}')")
                time.sleep(5)
                current_page = next_page
            except Exception as e_page:
                print(f"[ERROR] 페이지 전환 오류: {e_page}")
                break
                
        browser.close()
        
    print("=" * 60)
    print(f"[FINISH] 조세심판원 대용량 수집 완료! 총 적재 건수: {inserted_count}건")

if __name__ == "__main__":
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
    crawl_tax_tribunal_bulk(limit)
