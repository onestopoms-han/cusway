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

FAILED_ITEMS = [
    {
        "index": 14,
        "name": "mRNA 백신 약물 전달용 이온화 지질나노입자(LNP) 조제품",
        "material": "이온화 지질(Ionizable Lipid), 콜레스테롤, DSPC, PEG-지질 복합 에멀젼",
        "function": "mRNA 유전물질을 세포 내로 안전하게 전달하는 약물전달체(LNP) 원료",
        "expected_headings": ["3824", "3002", "2923"]
    },
    {
        "index": 22,
        "name": "농업용 생분해성 PLA/PBAT 멀칭 필름",
        "material": "폴리락트산(PLA) 및 PBAT 생분해성 고분자 블렌드 (두께 15㎛)",
        "function": "작물 재배 후 토양에서 100% 자연 분해되는 친환경 농업용 멀칭 필름",
        "expected_headings": ["3920", "3921"]
    },
    {
        "index": 23,
        "name": "수소 충전소용 수소 가스 변색 감지 고무 가스켓",
        "material": "수소 감응형 변색 안료가 함침된 불소고무(FKM) 가스켓",
        "function": "수소 배관 밀폐 및 미세 누출 발생 시 색상이 변하여 육안 식별 가능한 안전 가스켓",
        "expected_headings": ["4016", "3824"]
    },
    {
        "index": 24,
        "name": "우주 발사체 밸브용 초내한 불소 실리콘 고무 O링",
        "material": "초내한 특수 불소 실리콘 고무 (Fluorosilicone Rubber, FVMQ)",
        "function": "영하 196도 극저온 액체산소 밸브의 기밀 유지를 위한 고무 실링 부품",
        "expected_headings": ["4016"]
    },
    {
        "index": 25,
        "name": "차세대 전자소자용 투명 폴리이미드(CPI) 에어로겔 시트",
        "material": "나노 다공성 투명 폴리이미드 에어로겔 (두께 50㎛)",
        "function": "플렉서블 디스플레이 및 반도체 기판용 초저유전율 단열/절연 필름",
        "expected_headings": ["3920", "3921"]
    },
    {
        "index": 43,
        "name": "폴더블 스마트폰용 초박형 화학강화유리 (UTG)",
        "material": "화학강화(이온교환) 초박막 알루미노실리케이트 유리 (두께 30㎛)",
        "function": "수십만 회 접었다 펴는 폴더블 디스플레이의 커버 윈도우 보호 유리",
        "expected_headings": ["7006", "7007"]
    },
    {
        "index": 51,
        "name": "금속 3D 프린팅용 고순도 티타늄 합금 (Ti-6Al-4V) 구형 분말",
        "material": "티타늄 90%, 알루미늄 6%, 바나듐 4% 가스 분무 구형 분말 (입도 15~45㎛)",
        "function": "항공우주 및 의료용 정밀 금속 3D 프린터(PBF/DED) 적층제조용 금속 분말 원료",
        "expected_headings": ["8108"]
    },
    {
        "index": 99,
        "name": "독거노인 돌봄 및 정서 교감형 AI 대화 반려 로봇 인형",
        "material": "실리콘 스킨, 내부 모터/센서, 스피커/마이크 및 AI 음성인식 모듈 내장",
        "function": "어르신 복약 알림, 24시간 음성 대화, 이상 징후 감지 및 긴급 호출 기능을 갖춘 봉제/실리콘 인형 형태의 반려 로봇",
        "expected_headings": ["9503", "8543", "8479"]
    }
]

def main():
    db = SessionLocal()
    processor = AICustomsClassificationProcessor()
    
    print("=" * 80)
    print("🔬 8개 미통과 품목 정밀 검증 시작")
    print("=" * 80)
    
    passed = 0
    for item in FAILED_ITEMS:
        print(f"\n[{item['index']:02d}] {item['name']}")
        res = processor.run_classification_pipeline(
            product_name=item["name"],
            material=item["material"],
            function_use=item["function"],
            db=db
        )
        rec_code = res.get("recommendedHsCode", "0000.00-0000")
        clean_code = rec_code.replace('.', '').replace('-', '').strip()
        heading_4 = clean_code[:4]
        
        is_pass = any(heading_4.startswith(exp) or exp in heading_4 for exp in item["expected_headings"])
        status = "✅ PASS" if is_pass else f"❌ FAIL (예상: {item['expected_headings']})"
        if is_pass:
            passed += 1
        print(f"   ➔ 추천 HSK: {rec_code} | 결과: {status}")
        
    print("\n" + "=" * 80)
    print(f"📊 8개 검증 결과: {passed}/{len(FAILED_ITEMS)} PASS ({passed/len(FAILED_ITEMS)*100:.1f}%)")
    print("=" * 80)

if __name__ == "__main__":
    main()
