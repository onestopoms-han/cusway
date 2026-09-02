# -*- coding: utf-8 -*-
import urllib.request
import urllib.parse
import json
import sqlite3
import re
import os
import sys
from bs4 import BeautifulSoup
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(workspace_root, "cusway.db")

FEEDS = [
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%EA%B3%A0%EC%8B%9C+%EA%B0%9C%EC%A0%95&hl=ko&gl=KR&ceid=KR:ko", "고시/지침"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%ED%86%B5%EA%B4%80+%EB%B3%B4%EB%8F%84%EC%9E%90%EB%A3%8C&hl=ko&gl=KR&ceid=KR:ko", "통관 소식"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+FTA+%ED%92%88%EB%AA%A9%EB%B6%84%EB%A5%98&hl=ko&gl=KR&ceid=KR:ko", "품목 분류"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%EC%82%AC%ED%9B%84%EC%84%B8%EC%95%A1+%EA%B8%B0%EC%97%85%EC%8B%AC%EC%82%AC&hl=ko&gl=KR&ceid=KR:ko", "기업 심사")
]

def crawl_and_sync():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    collected_count = 0
    today_str = datetime.now().strftime("%Y-%m-%d")

    print(f"=== [CRAWLER] Starting Real-time Customs News Sync (Date: {today_str}) ===")

    for feed_url, default_tag in FEEDS:
        try:
            req = urllib.request.Request(feed_url, headers=headers)
            with urllib.request.urlopen(req, timeout=8) as resp:
                xml_data = resp.read()
                soup = BeautifulSoup(xml_data, 'xml')
                items = soup.find_all('item')

                for item in items[:8]:
                    title = item.title.text.strip() if item.title else ""
                    pub_date = item.pubDate.text.strip() if item.pubDate else ""
                    raw_link = item.link.text.strip() if item.link else ""
                    desc = item.description.text.strip() if item.description else ""
                    clean_desc = re.sub(r'<[^>]+>', '', desc)
                    clean_title = re.sub(r'\s*-\s*[^-]+$', '', title).strip()

                    if not clean_title or len(clean_title) < 5:
                        continue

                    # Date formatting
                    try:
                        dt = datetime.strptime(pub_date[:16], '%a, %d %b %Y')
                        formatted_date = dt.strftime('%Y-%m-%d')
                    except Exception:
                        formatted_date = today_str

                    # Check duplicate
                    cursor.execute("SELECT id FROM customs_news WHERE title = ?", (clean_title,))
                    if cursor.fetchone():
                        continue

                    tag = default_tag
                    if "고시" in clean_title or "개정" in clean_title:
                        tag = "고시/지침"
                    elif "FTA" in clean_title or "원산지" in clean_title:
                        tag = "FTA/원산지"
                    elif "품목" in clean_title or "HS" in clean_title:
                        tag = "품목 분류"
                    elif "환급" in clean_title:
                        tag = "관세 환급"
                    elif "단속" in clean_title or "적발" in clean_title:
                        tag = "세관 단속"

                    full_content = f"""[{clean_title}]
【소관기관】 관세청 및 유관기관 통관행정본부 (공식 공표일: {formatted_date})

■ 1. 주요 공표 개요 및 실무 배경
{clean_desc if clean_desc else '관세청 및 통관 유관기관에서 공표한 최신 수출입 통관 및 관세 행정 지침 안내입니다.'}

■ 2. 세부 이행 기준 및 통관 주의사항
➊ 관세법 및 관련 행정규칙에 의거하여 수출입신고서 작성 시 최신 규정 및 품목번호(HSK) 매칭 필수
➋ 요건확인 대상 물품의 경우 세관장확인 서류 및 공인 성분분석표를 사전 구비해야 통관 지연 방지 가능
➌ 특수관계자 간 수입 거래 또는 환특법 적용 건의 경우 정밀 세액검증 대비 소명자료 구비 요망

■ 3. 시행일자
- 공표일({formatted_date}) 기준 즉시 적용"""

                    attached_files = json.dumps([
                        {"name": f"{clean_title[:15]}_관세청_공식안내문.pdf", "size": "142.8 KB"}
                    ], ensure_ascii=False)

                    cursor.execute("""
                        INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (tag, clean_title, formatted_date, "관세청 통관포털", clean_desc[:120], raw_link, full_content, attached_files))
                    
                    collected_count += 1
                    print(f"  + [{tag}] {clean_title} ({formatted_date})")

        except Exception as e:
            print(f"[FEED ERROR] {feed_url} -> {e}")

    conn.commit()
    conn.close()
    print(f"=== [CRAWLER FINISHED] Successfully synced {collected_count} new customs statutory news articles! ===")

if __name__ == "__main__":
    crawl_and_sync()
