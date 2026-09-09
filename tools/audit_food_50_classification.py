import os
import sys
import json
import sqlite3

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# 50대 식품류 난해 및 빈출 품목 테스트 데이터셋
FOOD_50_TEST_CASES = [
    # [수산물 / 육류 조제품: 02/03류 vs 16/21류]
    {"id": 1, "name": "냉동 해물볶음", "material": "오징어, 조개, 새우, 채소, 양념 볶음", "function": "식용 볶음요리", "expected_hs": "1605.59-9000", "category": "연체동물 조제품 (16류)"},
    {"id": 2, "name": "훈제 연어", "material": "연어, 소금, 훈연 가공", "function": "식용", "expected_hs": "0305.41-0000", "category": "훈제 어류 (03류 잔류)"},
    {"id": 3, "name": "구운 김 (조미김)", "material": "김, 참기름, 소금 가열구이", "function": "식용 조미김", "expected_hs": "2008.99-5010", "category": "해조류 조제품 (20류)"},
    {"id": 4, "name": "마른 미역", "material": "미역 100% (단순 건조)", "function": "국거리용 식용 해조류", "expected_hs": "1212.21-1010", "category": "식용 해조류 (12류)"},
    {"id": 5, "name": "냉동 돈까스", "material": "돼지고기 등심, 빵가루, 튀김옷", "function": "가열조리용 돈육가공품", "expected_hs": "1602.49-9000", "category": "돼지고기 조제품 (16류)"},
    {"id": 6, "name": "냉동 닭꼬치 (양념가열)", "material": "닭고기, 데리야끼 소스 구이", "function": "식용 꼬치요리", "expected_hs": "1602.32-9000", "category": "가금육 조제품 (16류)"},
    {"id": 7, "name": "건조 오징어", "material": "오징어 100% (단순 건조)", "function": "식용 마른오징어", "expected_hs": "0307.49-1000", "category": "건조 연체동물 (03류)"},
    {"id": 8, "name": "조미 오징어채 (진미채)", "material": "오징어, 설탕, 솔비톨, 조미가공", "function": "반찬/안주용", "expected_hs": "1605.54-9000", "category": "오징어 조제품 (16류)"},
    {"id": 9, "name": "찐 꽃게 (껍질째 냉동)", "material": "꽃게 100% (껍질째 자숙 냉동)", "function": "식용 갑각류", "expected_hs": "0306.14-0000", "category": "자숙 갑각류 (03류 잔류)"},
    {"id": 10, "name": "게맛살 (크래미)", "material": "연육(어육 스리미), 게향, 전분", "function": "어육 연제품", "expected_hs": "1604.20-2000", "category": "어육 조제품 (16류)"},
    {"id": 11, "name": "소고기 육포 (비프저키)", "material": "쇠고기, 간장, 향신료 건조조제", "function": "식용 건조육", "expected_hs": "1602.50-1000", "category": "쇠고기 조제품 (16류)"},
    {"id": 12, "name": "참치 통조림 (기름절임)", "material": "다랑어 살코기, 카놀라유, 정제수", "function": "통조림 반찬", "expected_hs": "1604.14-1000", "category": "어류 통조림 조제품 (16류)"},

    # [곡물 / 종실 / 분말 / 제분 / 프리믹스: 10/11/12류 vs 19/20/21류]
    {"id": 13, "name": "볶은 참깨", "material": "참깨 100% (가열 볶음)", "function": "양념/고명용", "expected_hs": "2008.19-1000", "category": "볶은 종실 조제품 (20류)"},
    {"id": 14, "name": "생 참깨", "material": "참깨 100% (미가공 생물)", "function": "착유용/식용 원료", "expected_hs": "1207.40-0000", "category": "채유용 종실 (12류)"},
    {"id": 15, "name": "참깨가루 (식용 조제품)", "material": "참깨 분말 (식용 가공)", "function": "식용 가루", "expected_hs": "2008.19-3000", "category": "참깨 조제분말 (20류)"},
    {"id": 16, "name": "볶지 않은 참깨 거친가루 (파쇄물)", "material": "생참깨 파쇄 (1.25mm 체 통과 60%)", "function": "채유/가공용 원료", "expected_hs": "1207.40-0000", "category": "파쇄 종자 (12류/분석47260-1300)"},
    {"id": 17, "name": "볶지 않은 참깨 고운분말", "material": "생참깨 분말 (미가공 미세분말)", "function": "식품 제조 원료", "expected_hs": "1208.90-9000", "category": "종실 고운분말 (12류)"},
    {"id": 18, "name": "들깨가루 (식용 조제품)", "material": "들깨 껍질 탈피 후 분쇄", "function": "탕/국용 고명", "expected_hs": "2008.19-9000", "category": "들깨 조제분말 (20류)"},
    {"id": 19, "name": "생 들깨", "material": "들깨 100% (미가공 생물)", "function": "착유용 종실", "expected_hs": "1207.50-0000", "category": "채유용 종실 (12류)"},
    {"id": 20, "name": "볶은 땅콩", "material": "땅콩 (가열 로스팅)", "function": "간식용 견과류", "expected_hs": "2008.11-9000", "category": "볶은 땅콩 조제품 (20류)"},
    {"id": 21, "name": "생 땅콩 (탈각)", "material": "생땅콩 100% (볶지 않은 것)", "function": "식용/가공용 생견과", "expected_hs": "1202.42-0000", "category": "미조리 땅콩 (12류)"},
    {"id": 22, "name": "땅콩버터 (피넛버터)", "material": "볶은 땅콩 페이스트", "function": "스프레드 잼용", "expected_hs": "2008.11-1000", "category": "땅콩버터 (20류)"},
    {"id": 23, "name": "쌀가루 (멥쌀가루)", "material": "쌀 100% (미가공 제분)", "function": "떡/제과 원료", "expected_hs": "1102.90-1000", "category": "곡물 제분분말 (11류)"},
    {"id": 24, "name": "밀가루 (강력분)", "material": "소맥(밀) 100%", "function": "제빵용 밀가루", "expected_hs": "1101.00-1000", "category": "소맥분 (11류)"},
    {"id": 25, "name": "핫케이크 믹스", "material": "밀가루, 설탕, 베이킹파우더, 분유", "function": "팬케이크 조제 프리믹스", "expected_hs": "1901.20-9000", "category": "곡물 조제 프리믹스 (19류)"},
    {"id": 26, "name": "튀김가루 (부침가루)", "material": "소맥분, 쌀가루, 조미조제품", "function": "튀김/부침 조리용 믹스", "expected_hs": "1901.20-9000", "category": "조제 베이커리 믹스 (19류)"},
    {"id": 27, "name": "도토리 가루", "material": "도토리 전분/분말 100%", "function": "도토리묵 제조용", "expected_hs": "2106.90-9060", "category": "도토리가루 조제품 (21류)"},
    {"id": 28, "name": "감자 전분", "material": "감자 추출 순수 전분", "function": "식품 점증제", "expected_hs": "1108.13-0000", "category": "식물성 전분 (11류)"},
    {"id": 29, "name": "감자칩 (포테이토칩)", "material": "슬라이스 감자 유탕 처리 스낵", "function": "과자/스낵", "expected_hs": "2005.20-1000", "category": "감자 조제품 스낵 (20류)"},
    {"id": 30, "name": "냉동 감자튀김 (프렌치프라이)", "material": "감자 스틱, 1차 유탕 냉동", "function": "가열조리용 감자", "expected_hs": "2004.10-0000", "category": "냉동 감자 조제품 (20류)"},

    # [과실 / 채소 가공 및 음료 / 조미료: 07/08/09류 vs 20/21/22류]
    {"id": 31, "name": "냉동 딸기 (무가당)", "material": "딸기 100% (단순 급속냉동)", "function": "식용 냉동과실", "expected_hs": "0811.10-0000", "category": "단순냉동 과실 (08류)"},
    {"id": 32, "name": "딸기 잼", "material": "딸기, 설탕, 펙틴 가열농축", "function": "빵 스프레드용 잼", "expected_hs": "2007.99-1000", "category": "잼/젤리 조제품 (20류)"},
    {"id": 33, "name": "건조 망고 (설탕절임)", "material": "망고 70%, 설탕 30% 건조", "function": "간식용 건조과일", "expected_hs": "2008.99-9000", "category": "설탕절임 과실조제품 (20류)"},
    {"id": 34, "name": "건조 대추", "material": "대추 100% (단순 건조)", "function": "식용/한약재 건과실", "expected_hs": "0813.40-1000", "category": "단순건조 과실 (08류)"},
    {"id": 35, "name": "배 퓨레", "material": "배 과육 마쇄 가열농축", "function": "음료/식품 가공원료", "expected_hs": "2008.40-0000", "category": "과실 퓨레 조제품 (20류)"},
    {"id": 36, "name": "배 주스 (과즙 100%)", "material": "배 착즙액 100%", "function": "과실음료", "expected_hs": "2009.89-1090", "category": "과실 주스 (20류)"},
    {"id": 37, "name": "배추 김치", "material": "절임배추, 고춧가루, 마늘, 젓갈 발효", "function": "전통 발효식품", "expected_hs": "2005.99-1000", "category": "채소 조제품 김치 (20류)"},
    {"id": 38, "name": "절임 배추 (염수절임)", "material": "배추, 소금물 염장 (일시저장용)", "function": "김장용 원료 채소", "expected_hs": "0711.90-9000", "category": "일시저장 처리 채소 (07류)"},
    {"id": 39, "name": "볶은 커피 원두 (로스팅)", "material": "아라비카 커피두 100% 로스팅", "function": "원두커피 추출용", "expected_hs": "0901.21-0000", "category": "볶은 커피 (09류 잔류)"},
    {"id": 40, "name": "인스턴트 커피 분말", "material": "커피 추출 고형물 (동결건조)", "function": "즉석 커피 음용", "expected_hs": "2101.11-1000", "category": "커피 추출물 조제품 (21류)"},
    {"id": 41, "name": "녹차 잎 (단순 건조/덖음)", "material": "녹차 찻잎 100%", "function": "다류 침출용", "expected_hs": "0902.10-0000", "category": "단순 가공 차 (09류)"},
    {"id": 42, "name": "액상 홍차 음료", "material": "홍차 추출액, 설탕, 정제수", "function": "즉석 음용 차음료", "expected_hs": "2202.99-9000", "category": "비알코올 음료 (22류)"},
    {"id": 43, "name": "천연 벌꿀 (아카시아꿀)", "material": "순수 천연벌꿀 100%", "function": "식용 꿀", "expected_hs": "0409.00-0000", "category": "천연 꿀 (04류)"},
    {"id": 44, "name": "사양벌꿀 (설탕급여벌꿀)", "material": "설탕을 먹여 키운 꿀벌의 사양꿀", "function": "조제 감미 식품", "expected_hs": "2106.90-9099", "category": "사양꿀 조제식품 (21류)"},
    {"id": 45, "name": "고추장", "material": "고춧가루, 찹쌀, 메주가루, 엿기름", "function": "전통 발효 장류 소스", "expected_hs": "2103.90-1010", "category": "조미용 장류 소스 (21류)"},
    {"id": 46, "name": "된장", "material": "대두(콩), 식염, 발효메주", "function": "전통 발효 장류", "expected_hs": "2103.90-1020", "category": "조미용 장류 소스 (21류)"},
    {"id": 47, "name": "양조 간장", "material": "탈지대두, 소맥, 식염수 발효", "function": "액상 조미 소스", "expected_hs": "2103.10-0000", "category": "간장 (21류)"},
    {"id": 48, "name": "카레 분말 (순수 향신료 믹스)", "material": "강황, 큐민, 코리앤더 분말 혼합", "function": "향신료 원료", "expected_hs": "0910.99-1000", "category": "향신료 혼합물 (09류)"},
    {"id": 49, "name": "레토르트 카레 (조리식품)", "material": "카레분, 감자, 당근, 쇠고기, 유지", "function": "즉석 조리 완제품", "expected_hs": "2103.90-9030", "category": "카레 조제품 (21류)"},
    {"id": 50, "name": "판 두부 (신선)", "material": "대두(콩) 추출액, 응고제", "function": "식용 신선 두부", "expected_hs": "2106.90-9040", "category": "두부 조제품 (21류)"}
]

def run_tests():
    from backend.main import app
    from backend.db import SessionLocal
    from backend.rag.classification_processor import AICustomsClassificationProcessor

    db = SessionLocal()
    pass_count = 0
    fail_count = 0
    results = []

    print("=" * 80)
    print(" CUSWAY AI 50대 핵심 식품류 품목분류(HS Code) 정밀 검증 테스트")
    print("=" * 80)

    for item in FOOD_50_TEST_CASES:
        try:
            # Run classification pipeline
            pred = AICustomsClassificationProcessor.run_classification_pipeline(
                product_name=item["name"],
                material=item["material"],
                function_use=item["function"],
                db=db
            )
            recommended_hs = pred.get("recommendedHsCode", "")
            expected_hs = item["expected_hs"]
            
            # Compare first 4/6 or exact 10 digits
            clean_rec = recommended_hs.replace('.', '').replace('-', '').strip()
            clean_exp = expected_hs.replace('.', '').replace('-', '').strip()

            is_pass = (clean_rec == clean_exp) or (clean_rec[:6] == clean_exp[:6] and clean_rec[:4] == clean_exp[:4])
            
            if is_pass:
                pass_count += 1
                status_icon = "[PASS]"
            else:
                fail_count += 1
                status_icon = "[FAIL]"

            print(f"[{item['id']:02d}/50] {status_icon} | {item['name']:<20} | 결과: {recommended_hs:<14} | 정답: {expected_hs:<14} | {item['category']}")
            
            results.append({
                "id": item["id"],
                "name": item["name"],
                "material": item["material"],
                "category": item["category"],
                "recommended_hs": recommended_hs,
                "expected_hs": expected_hs,
                "is_pass": is_pass,
                "reasoning": pred.get("legalReasoning", "")[:100]
            })
        except Exception as e:
            fail_count += 1
            print(f"[{item['id']:02d}/50] [ERROR] | {item['name']}: {str(e)}")
            results.append({
                "id": item["id"],
                "name": item["name"],
                "material": item["material"],
                "category": item["category"],
                "recommended_hs": "ERROR",
                "expected_hs": item["expected_hs"],
                "is_pass": False,
                "reasoning": str(e)
            })

    db.close()

    print("=" * 80)
    print(f"테스트 요약: 총 50건 중 성공 {pass_count}건, 보정 필요 {fail_count}건 (정확도: {pass_count/50*100:.1f}%)")
    print("=" * 80)

    # Save test results to JSON
    with open("tools/food_50_test_results.json", "w", encoding="utf-8") as f:
        json.dump({"summary": {"total": 50, "pass": pass_count, "fail": fail_count, "accuracy": pass_count/50*100}, "results": results}, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    run_tests()
