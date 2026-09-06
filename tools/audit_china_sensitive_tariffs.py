import json
from datetime import datetime

# Direct simulation of tariff calculation engine logic from backend/main.py and api/index.py

ALL_FTA_EXCLUDED_PREFIXES = [
    "100610", "1006.10", "100620", "1006.20", "100630", "1006.30", "100640", "1006.40",
    "110230", "1102.30",
    "11081910", "1108.19.10",
]

CHINA_RCEP_EXCLUDED_PREFIXES = [
    "0201", "0202", "0203", "0204", "0205", "0206", "0207", "0208", "0209", "0210",
    "0301", "0302", "0303", "0304", "0305", "0306", "0307", "0308",
    "0401", "0402", "0403", "0404", "0405", "0406", "0407", "0408", "0409", "0410",
    "0701", "0702", "0703", "0704", "0705", "0706", "0707", "0708", "0709", "0710", "0711", "0712", "0713", "0714",
    "0801", "0802", "0803", "0804", "0805", "0806", "0807", "0808", "0809", "0810", "0811", "0812", "0813",
    "0902", "0904", "0910",
    "1001", "1002", "1003", "1004", "1005", "1006", "1007", "1008",
    "1101", "1102", "1103", "1104", "1105", "1106", "1107", "1108", "1109",
    "1201", "1202", "1207", "1211", "1212",
    "1515", "151550", "1515.50", "151590", "1515.90",
    "1601", "1602", "1604", "1605",
    "2001", "2002", "2003", "2004", "2005", "200811", "2008.11",
    "210390", "2103.90", "210690", "2106.90",
]

def check_china_sensitive_duty(hs_code: str, origin: str = "CN", has_co: bool = True, has_trq: bool = False):
    clean = hs_code.replace(".", "").replace("-", "").strip()
    is_china_rcep_excluded = (origin.upper() in ["CN", "JP", "RCEP"]) and any(clean.startswith(p.replace(".", "")) for p in CHINA_RCEP_EXCLUDED_PREFIXES)
    is_all_excluded = any(clean.startswith(p.replace(".", "")) for p in ALL_FTA_EXCLUDED_PREFIXES)
    
    # Check if a non-TRQ general 0% FTA rate could mistakenly be applied
    is_fcn6_trq_eligible = clean.startswith("120740") or clean.startswith("071331") or clean.startswith("071332") or clean.startswith("091011")
    
    status = {
        "hs_code": hs_code,
        "origin": origin,
        "is_excluded": is_china_rcep_excluded or is_all_excluded,
        "allow_general_fta_zero": not (is_china_rcep_excluded or is_all_excluded),
        "fcn6_trq_eligible": is_fcn6_trq_eligible
    }
    return status

def run_china_audit():
    test_cases = [
        # 1. 두류 및 유지작물
        {"name": "밥밑용 대두", "code": "1201.90-3000", "expected_excluded": True},
        {"name": "콩나물용 대두", "code": "1201.90-1000", "expected_excluded": True},
        {"name": "채유용 대두", "code": "1201.90-2000", "expected_excluded": True},
        {"name": "기타 대두", "code": "1201.90-9000", "expected_excluded": True},
        {"name": "참깨 (일반수입)", "code": "1207.40-0000", "expected_excluded": True},
        {"name": "들깨", "code": "1207.99-0000", "expected_excluded": True},
        {"name": "땅콩 (탈각)", "code": "1202.42-0000", "expected_excluded": True},
        {"name": "팥", "code": "0713.32-0000", "expected_excluded": True},
        {"name": "녹두", "code": "0713.31-0000", "expected_excluded": True},
        
        # 2. 채소 및 향신료
        {"name": "신선/냉장 마늘", "code": "0703.20-1000", "expected_excluded": True},
        {"name": "건조 마늘", "code": "0712.90-1000", "expected_excluded": True},
        {"name": "양파", "code": "0703.10-1000", "expected_excluded": True},
        {"name": "대파/쪽파", "code": "0703.90-0000", "expected_excluded": True},
        {"name": "고춧가루", "code": "0904.22-0000", "expected_excluded": True},
        {"name": "건고추", "code": "0904.21-0000", "expected_excluded": True},
        {"name": "생강", "code": "0910.11-0000", "expected_excluded": True},
        {"name": "건조 표고버섯", "code": "0712.34-0000", "expected_excluded": True},
        {"name": "감자", "code": "0701.90-0000", "expected_excluded": True},
        {"name": "고구마", "code": "0714.20-0000", "expected_excluded": True},
        
        # 3. 과실 및 견과류
        {"name": "사과", "code": "0808.10-0000", "expected_excluded": True},
        {"name": "배", "code": "0808.30-0000", "expected_excluded": True},
        {"name": "건대추", "code": "0813.40-1000", "expected_excluded": True},
        {"name": "곶감", "code": "0813.40-2000", "expected_excluded": True},
        {"name": "밤", "code": "0802.42-0000", "expected_excluded": True},
        {"name": "잣", "code": "0802.90-1000", "expected_excluded": True},
        
        # 4. 곡물 및 제분
        {"name": "쌀 (백미)", "code": "1006.30-0000", "expected_excluded": True},
        {"name": "옥수수", "code": "1005.90-0000", "expected_excluded": True},
        {"name": "밀", "code": "1001.99-0000", "expected_excluded": True},
        {"name": "밀가루", "code": "1101.00-1000", "expected_excluded": True},
        {"name": "옥수수 전분", "code": "1108.12-0000", "expected_excluded": True},
        {"name": "맥아", "code": "1107.10-0000", "expected_excluded": True},
        
        # 5. 낙농품 및 축산물
        {"name": "전지분유", "code": "0402.21-0000", "expected_excluded": True},
        {"name": "천연꿀", "code": "0409.00-0000", "expected_excluded": True},
        {"name": "냉동 삼겹살", "code": "0203.29-1000", "expected_excluded": True},
        {"name": "냉동 닭고기", "code": "0207.14-0000", "expected_excluded": True},
        {"name": "소고기 갈비", "code": "0202.30-0000", "expected_excluded": True},
        
        # 6. 수산물
        {"name": "냉동 조기", "code": "0303.89-1000", "expected_excluded": True},
        {"name": "냉동 명태", "code": "0303.67-0000", "expected_excluded": True},
        {"name": "냉동 오징어", "code": "0307.43-1000", "expected_excluded": True},
        {"name": "냉동 새우", "code": "0306.17-0000", "expected_excluded": True},
        {"name": "활 전복", "code": "0307.81-1000", "expected_excluded": True},
        
        # 7. 한약재 및 조제품
        {"name": "홍삼/인삼", "code": "1211.20-1000", "expected_excluded": True},
        {"name": "참기름", "code": "1515.50-0000", "expected_excluded": True},
        {"name": "들기름", "code": "1515.90-0000", "expected_excluded": True},
        {"name": "볶음참깨", "code": "2008.19-3000", "expected_excluded": True},
        {"name": "고추장", "code": "2103.90-1000", "expected_excluded": True},
    ]
    
    passed = 0
    failed = 0
    results = []
    
    for tc in test_cases:
        res = check_china_sensitive_duty(tc["code"], "CN")
        is_ok = (res["is_excluded"] == tc["expected_excluded"]) and (not res["allow_general_fta_zero"])
        if is_ok:
            passed += 1
            results.append(f"✅ PASS: [{tc['code']}] {tc['name']} -> 한-중 FTA 일반 0% 특혜 완벽 배제 (양허제외 보호 정상 작동)")
        else:
            failed += 1
            results.append(f"❌ FAIL: [{tc['code']}] {tc['name']} -> 0% 누출 위험 발생!")
            
    print(f"=== 중국산 민감 농축수산물 50대 전수 감사 결과 ===")
    print(f"총 검증 항목: {len(test_cases)}건 | 성공: {passed}건 | 실패: {failed}건 | 오류율: {failed / len(test_cases) * 100:.1f}%")
    for r in results:
        print(r)
        
    return passed, failed

if __name__ == "__main__":
    run_china_audit()
