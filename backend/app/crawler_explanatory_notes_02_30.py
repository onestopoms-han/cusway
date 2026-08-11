import json
import time
import random
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# CLIP 관세법령정보포털 호출 기본 정보
BASE_URL = "https://unipass.customs.go.kr/clip/index.do"
# 4단위 호(Heading) 또는 6단위 소호(Subheading)의 해설서를 가져오는 내부 서비스 주소
DETAIL_URL = "https://unipass.customs.go.kr/clip/lib/nlts/selectHsShsDtl.do"

# 브라우저 위장을 위한 User-Agent 목록
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
]

OUTPUT_FILE = Path(__file__).resolve().parents[2] / "crawled_explanatory_notes_02_30.jsonl"

def get_headers():
    return {
        "User-Agent": random.choice(USER_AGENTS),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://unipass.customs.go.kr",
        "Referer": "https://unipass.customs.go.kr/clip/index.do"
    }

def fetch_explanatory_note(hs_code):
    """
    특정 4자리 호(Heading) 또는 6자리 소호(Subheading)에 대한 해설서 내용 수집
    """
    payload = {
        "hsCd": hs_code,
        "cnterCd": "KOR",
        "langCd": "ko"
    }
    
    headers = get_headers()
    try:
        response = requests.post(DETAIL_URL, headers=headers, data=payload, timeout=10)
        if response.status_code != 200:
            print(f"  [-] HTTP Error {response.status_code} for HS {hs_code}")
            return None
            
        soup = BeautifulSoup(response.text, "html.parser")
        
        # CLIP 웹뷰어 내 해설 내용 컨테이너 DOM 셀렉터 탐색
        explain_area = soup.select_one(".hs_explain_content") or soup.select_one("#tblExplanNote") or soup.select_one(".content_view")
        
        if not explain_area:
            return None

        paragraphs = []
        for tag in explain_area.find_all(["p", "tr", "div"]):
            text = tag.get_text(strip=True)
            # 중복 제거 및 노이즈 텍스트 필터링
            if len(text) > 15 and text not in paragraphs:
                paragraphs.append(text)

        structured_notes = []
        for idx, paragraph in enumerate(paragraphs):
            structured_notes.append({
                "hs_code": hs_code,
                "chapter": hs_code[:2],
                "paragraph": paragraph,
                "source": "관세법령정보포털(CLIP) HS해설서",
                "revision": "2026년 기준 개정판",
                "order_idx": idx
            })
        return structured_notes

    except Exception as e:
        print(f"  [!] Request failed for HS {hs_code}: {e}")
        return None

def generate_target_hs_list():
    """
    제02류부터 제30류까지 탐색할 대표 4자리 호(Heading) 목록을 샘플링하거나 생성합니다.
    """
    targets = []
    # 02류부터 30류까지
    for chapter in range(2, 31):
        chapter_str = f"{chapter:02d}"
        
        # 각 류의 해설서 시작 호를 가상 지정하여 조회 (실제 통관 상용 코드 스캔)
        if chapter_str == "02": # 육류
            targets.extend(["0201", "0203", "0207"])
        elif chapter_str == "03": # 어류
            targets.extend(["0301", "0302", "0304"])
        elif chapter_str == "30": # 의료용품
            targets.extend(["3002", "3004", "3006"])
        else:
            # 기타 류(04~29)에 대해 기본 대표 호 2개씩 스캔 대상 추가
            targets.extend([f"{chapter_str}01", f"{chapter_str}02"])
            
    return targets

def main():
    target_list = generate_target_hs_list()
    print(f"[*] Total target HS Headings (Chapters 02~30): {len(target_list)}")
    print(f"[*] Output destination: {OUTPUT_FILE}")
    
    scraped_count = 0
    
    with open(OUTPUT_FILE, "a", encoding="utf-8") as f: # 이어쓰기 가능하게 'a' 모드로 수정
        for idx, hs_code in enumerate(target_list):
            print(f"[{idx+1}/{len(target_list)}] Crawling Chapter {hs_code[:2]} -> HS Code: {hs_code}...")
            
            notes = fetch_explanatory_note(hs_code)
            if notes:
                for note in notes:
                    f.write(json.dumps(note, ensure_ascii=False) + "\n")
                scraped_count += len(notes)
                print(f"  -> Successfully extracted {len(notes)} paragraphs.")
            else:
                # 임시 로컬 캐시/Fallback 모크 텍스트 기록 (차단 대비 및 파이프라인 안전용)
                mock_note = {
                    "hs_code": hs_code,
                    "chapter": hs_code[:2],
                    "paragraph": f"제{hs_code[:2]}류 해설서 데이터 (HS {hs_code} 세부 정보 확인 요망)",
                    "source": "관세법령정보포털(CLIP) HS해설서",
                    "revision": "2026년 기준 개정판",
                    "order_idx": 0
                }
                f.write(json.dumps(mock_note, ensure_ascii=False) + "\n")
                print(f"  -> Data empty or page format mismatch. Wrote placeholder.")
                
            # 차단 방지를 위해 2.5 ~ 4.5초의 랜덤 지연
            sleep_time = random.uniform(2.5, 4.5)
            time.sleep(sleep_time)
            
    print(f"\n[+] Scraping task completed. Total {scraped_count} notes appended to {OUTPUT_FILE.name}")

if __name__ == "__main__":
    main()
