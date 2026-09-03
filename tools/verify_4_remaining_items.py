import os
import sys
import time

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.db import SessionLocal
from backend.rag.classification_processor import AICustomsClassificationProcessor

REMAINING_4_ITEMS = [
    {
        "index": 22,
        "name": "농업용 생분해성 PLA/PBAT 멀칭 필름",
        "material": "PLA(폴리락트산) 60%, PBAT(폴리부틸렌 아디페이트 테레프탈레이트) 40% 블렌딩 고분자 컴파운드",
        "function": "토양 수분 유지, 잡초 억제 및 작물 수확 후 자연 생분해(폐비닐 수거 불필요)",
        "expected": ["3920", "3921"]
    },
    {
        "index": 50,
        "name": "우주망원경용 초저열팽창 글래스 세라믹 거울 블랭크",
        "material": "초저열팽창 결정화 유리 세라믹(Zero-expansion Glass-Ceramic)",
        "function": "우주 극저온/고온 환경에서 열변형 없는 직경 1.5m 우주망원경 주반사경 원소재",
        "expected": ["7006", "7014", "9001"]
    },
    {
        "index": 52,
        "name": "전기차 구동모터용 초극박 고효율 무방향성 규소강판 코일",
        "material": "두께 0.2mm 무방향성 전기강판(Si 3.2% 함유 합금강)",
        "function": "고속 회전 전기차 구동모터의 철손(Iron Loss) 극소화 및 모터 효율 향상 코어 소재",
        "expected": ["7225", "7226"]
    },
    {
        "index": 98,
        "name": "미세조류 광합성 탄소포집 및 산소발생 스마트 가구 조명",
        "material": "스마트 바이오리액터 유리 튜브, LED 광원 모듈, 알루미늄 스탠드 프레임",
        "function": "실내 CO2 흡수 및 광합성 산소 방출, 인테리어 무드 조명 및 공기정화 복합 가구",
        "expected": ["9405", "8421"]
    }
]

def main():
    db = SessionLocal()
    processor = AICustomsClassificationProcessor()
    
    print("=" * 80)
    print("🔬 미통과 4개 품목 정밀 검증 시작")
    print("=" * 80)
    
    passed = 0
    for item in REMAINING_4_ITEMS:
        print(f"\n[{item['index']:02d}] {item['name']}")
        res = processor.run_classification_pipeline(
            product_name=item["name"],
            material=item["material"],
            function_use=item["function"],
            db=db
        )
        rec_code = res.get("recommendedHsCode", "0000.00-0000")
        clean_code = rec_code.replace('.', '').replace('-', '').strip()
        is_pass = any(clean_code.startswith(exp) for exp in item["expected"])
        
        status = "✅ PASS" if is_pass else f"❌ FAIL (예상: {item['expected']})"
        print(f"   ➔ 추천 HSK: {rec_code} | 결과: {status}")
        if is_pass:
            passed += 1
            
    print("\n" + "=" * 80)
    print(f"📊 4개 검증 결과: {passed}/{len(REMAINING_4_ITEMS)} PASS ({passed/len(REMAINING_4_ITEMS)*100:.1f}%)")
    print("=" * 80)

if __name__ == "__main__":
    main()
