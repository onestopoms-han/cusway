import os
import sys

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

def main():
    db = SessionLocal()
    processor = AICustomsClassificationProcessor()
    
    name = "해양 레저용 휴대용 전동 수중 스쿠터 (Diver Propulsion Vehicle)"
    material = "고강도 경량 알루미늄 및 방수 폴리카보네이트 하우징, 리튬이온 배터리팩, 듀얼 브러시리스 모터 및 프로펠러"
    function = "스쿠버다이빙 및 스노클링 시 다이버가 손으로 잡고 수중에서 최대 6km/h 속도로 이동 추진하는 수상 스포츠 레저 장비"
    expected = ["9506", "8903"]
    
    print("=" * 80)
    print(f"🔬 #089 단독 정밀 검증 시작: {name}")
    print("=" * 80)
    
    res = processor.run_classification_pipeline(
        product_name=name,
        material=material,
        function_use=function,
        db=db
    )
    rec_code = res.get("recommendedHsCode", "0000.00-0000")
    clean_code = rec_code.replace('.', '').replace('-', '').strip()
    is_pass = any(clean_code.startswith(exp) for exp in expected)
    
    status = "✅ PASS" if is_pass else f"❌ FAIL (예상: {expected})"
    print(f"\n➔ 추천 HSK: {rec_code} | 결과: {status}")
    print(f"➔ 법적 근거 요약: {res.get('legalReasoning', '')[:200]}...")

if __name__ == "__main__":
    main()
