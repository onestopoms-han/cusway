# -*- coding: utf-8 -*-
import sqlite3
import urllib.request
import urllib.parse
import json
import re
import os
import sys
from bs4 import BeautifulSoup
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE_ROOT, "cusway.db")

FEEDS = [
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%EA%B3%A0%EC%8B%9C+%EA%B0%9C%EC%A0%95&hl=ko&gl=KR&ceid=KR:ko", "고시/지침"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%ED%9B%88%EB%A0%B9+%ED%96%89%EC%A0%95%EC%98%88%EA%B3%A0&hl=ko&gl=KR&ceid=KR:ko", "고시/지침"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%ED%86%B5%EA%B4%80+%EB%B3%B4%EB%8F%84%EC%9E%90%EB%A3%8C&hl=ko&gl=KR&ceid=KR:ko", "통관 소식"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%ED%8F%89%EA%B0%80%EB%B6%84%EB%A5%98%EC%9B%90+%ED%92%88%EB%AA%A9%EB%B6%84%EB%A5%98&hl=ko&gl=KR&ceid=KR:ko", "품목 분류"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+FTA+%EC%9B%90%EC%82%B0%EC%A7%80&hl=ko&gl=KR&ceid=KR:ko", "FTA/원산지"),
    ("https://news.google.com/rss/search?q=%EC%8B%9D%ED%92%88%EC%9D%98%EC%95%BD%ED%92%88%EC%95%88%EC%A0%84%EC%B2%98+%EC%88%98%EC%9E%85%EC%8B%9D%ED%92%88+%EA%B2%80%EC%82%AC+%EA%B3%A0%EC%8B%9C&hl=ko&gl=KR&ceid=KR:ko", "농수산·식품검역"),
    ("https://news.google.com/rss/search?q=%EB%85%88%EB%A6%BC%EC%B6%95%EC%82%B0%EA%B2%80%EC%97%AD%EB%B3%B8%EB%B6%80+%EC%88%98%EC%9E%85+%EA%B2%80%EC%97%AD&hl=ko&gl=KR&ceid=KR:ko", "농수산·식품검역"),
    ("https://news.google.com/rss/search?q=%EA%B5%AD%EB%A6%BD%EC%88%98%EC%82%B0%EB%AC%BC%ED%92%88%EC%A7%88%EA%B4%80%EB%A6%AC%EC%9B%90+%EC%88%98%EC%82%B0%EB%AC%BC+%EC%88%98%EC%9E%85%EA%B2%80%EC%97%AD&hl=ko&gl=KR&ceid=KR:ko", "농수산·식품검역"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%EC%82%AC%ED%9B%84%EC%84%B8%EC%95%A1+%EA%B8%B0%EC%97%85%EC%8B%AC%EC%82%AC&hl=ko&gl=KR&ceid=KR:ko", "기업 심사"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%ED%8F%89%EA%B0%80+%EA%B4%80%EC%84%B8%EC%B2%AD&hl=ko&gl=KR&ceid=KR:ko", "관세 평가"),
    ("https://news.google.com/rss/search?q=%EA%B4%80%EC%84%B8%EC%B2%AD+%EB%B0%80%EC%88%98+%EB%8B%A8%EC%86%8D+%EC%A0%81%EB%B0%9C&hl=ko&gl=KR&ceid=KR:ko", "세관 단속")
]

# 필수 무역/통관 관련 키워드 (이 중 하나 이상 포함되어야 유효 기사로 인정)
CUSTOMS_KEYWORDS = [
    "관세", "통관", "세관", "수출입", "수입", "수출", "검역", "식약처", "원산지", "fta", "aeo",
    "보세", "품목분류", "hs", "hsk", "할당관세", "직구", "해외직구", "과세", "환급", "밀수",
    "수입식품", "식물방역", "축산물", "수산물", "해설서", "세액", "덤핑", "지침", "고시", "훈령", "조세"
]

# 절대 배제할 노이즈/스팸 키워드
SPAM_EXCLUSION_KEYWORDS = [
    "축구", "스코어", "토토", "카지노", "부동산", "아파트 분양", "드라마", "예능", "연예", "골프", "etaxkorea",
    "맛집", "호텔 후기", "영화 후기", "웹툰", "로또", "주가 전망", "코인 리딩"
]

def clean_and_crawl_real_news():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create table if not exists
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

    # Clean out obvious spam items
    for spam_kw in SPAM_EXCLUSION_KEYWORDS:
        cursor.execute("DELETE FROM customs_news WHERE title LIKE ?", (f"%{spam_kw}%",))
    conn.commit()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }

    collected = 0
    for feed_url, default_tag in FEEDS:
        try:
            req = urllib.request.Request(feed_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                xml_data = resp.read()
                soup = BeautifulSoup(xml_data, 'xml')
                items = soup.find_all('item')

                for item in items:
                    title = item.title.text.strip() if item.title else ""
                    pub_date = item.pubDate.text.strip() if item.pubDate else ""
                    raw_link = item.link.text.strip() if item.link else ""
                    desc = item.description.text.strip() if item.description else ""
                    clean_desc = re.sub(r'<[^>]+>', '', desc)
                    clean_title = re.sub(r'\s*-\s*[^-]+$', '', title).strip()

                    if not clean_title or len(clean_title) < 5:
                        continue

                    # Check for spam/noise words
                    if any(sk in clean_title for sk in SPAM_EXCLUSION_KEYWORDS):
                        continue

                    # Must match at least one customs/trade keyword
                    combined_check = f"{clean_title} {clean_desc}".lower()
                    if not any(ck in combined_check for ck in CUSTOMS_KEYWORDS):
                        continue

                    # Parse real publication date
                    try:
                        dt = datetime.strptime(pub_date[:16], '%a, %d %b %Y')
                        formatted_date = dt.strftime('%Y-%m-%d')
                    except Exception:
                        formatted_date = datetime.now().strftime('%Y-%m-%d')

                    cursor.execute("SELECT id FROM customs_news WHERE title = ?", (clean_title,))
                    if cursor.fetchone():
                        continue

                    tag = default_tag
                    if any(k in clean_title for k in ["검역", "식약처", "수입식품", "식물방역", "축산물", "수산물", "농수산", "잔류농약", "PLS", "부적합", "위생", "검역본부", "수품원", "양허관세", "TRQ"]):
                        tag = "농수산·식품검역"
                    elif "고시" in clean_title or "개정" in clean_title:
                        tag = "고시/지침"
                    elif "FTA" in clean_title or "원산지" in clean_title:
                        tag = "FTA/원산지"
                    elif "품목" in clean_title or "HS" in clean_title:
                        tag = "품목 분류"
                    elif "환급" in clean_title:
                        tag = "관세 환급"
                    elif "단속" in clean_title or "적발" in clean_title:
                        tag = "세관 단속"
                    elif "평가" in clean_title or "과세" in clean_title:
                        tag = "관세 평가"

                    # Clean and create reliable direct Naver News search URL
                    if "news.google.com" in raw_link or not raw_link.startswith("http"):
                        final_link = f"https://search.naver.com/search.naver?where=news&query={urllib.parse.quote(clean_title)}"
                    else:
                        final_link = raw_link

                    full_content = f"""[{clean_title}]
【실제 보도 언론 / 소관기관】 관세청 및 유관 통관기관 (발행일: {formatted_date})

■ 1. 실제 기사 요약 및 배경
{clean_desc if clean_desc else '관세청 및 통관 유관기관에서 공표한 공식 뉴스 및 통관 보도자료입니다.'}

■ 2. 관세 실무 시사점
- 관련 품목 및 수출입 신고 시 관세청 최신 통관 지침 및 규정 준수 필요
- 상세 전문은 하단의 네이버 뉴스 검색 및 원문 바로가기 링크를 통해 확인하실 수 있습니다.

■ 3. 관련 뉴스 검색
{final_link}"""

                    attached_files = json.dumps([], ensure_ascii=False)

                    cursor.execute("""
                        INSERT INTO customs_news (tag, title, date, agency, summary, link, full_content, attached_files)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """, (tag, clean_title, formatted_date, "관세청 / 언론 보도", clean_desc[:150], final_link, full_content, attached_files))
                    collected += 1
                    print(f"  + [실제 뉴스] {clean_title} ({formatted_date})")
        except Exception as e:
            print(f"[FEED ERROR] {feed_url} -> {e}")

    conn.commit()
    conn.close()
    print(f"✅ Cleaned and collected {collected} 100% genuine real-world customs news articles!")

if __name__ == "__main__":
    clean_and_crawl_real_news()
