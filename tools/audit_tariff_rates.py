import sqlite3
import os
import sys
import json
from datetime import datetime

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

def audit_tariff_engine():
    db_path = os.path.join(workspace_root, "cusway.db")
    
    print("=" * 80)
    print("               CUSWAY TARIFF RATE & DUAL DUTY INTEGRITY AUDIT")
    print("=" * 80)
    print(f"Database: {db_path}")
    
    # 1. Initialize & Seed Database directly to ensure latest schema
    from backend.db import SessionLocal, engine, Base
    from backend.models import HSRateMaster
    from backend.seed import seed_data
    
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Run seed
        seed_data()
        print("[AUDIT] Seed data synchronized successfully.")
    except Exception as e:
        print(f"[AUDIT_WARN] Seed sync warning: {e}")
        
    # 2. Comprehensive Test Cases for 6 Categories & 25 Ultra-Sensitive Items
    test_cases = [
        # --- Category 1: 유지작물 및 식물성 유지 (제12류 / 제15류) ---
        {
            "name": "Cat 1-1: 참깨 (1207.40) 한-EU FTA 2026 하반기 선택세율 (99.4% or 1,051원/kg)",
            "hs_code": "1207.40-0000", "origin": "IT", "date": "2026-09-05",
            "expected_fta_rate": 99.4, "expected_specific_rate": 1051.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 1051000, # 1,000kg * 1,051원 = 1,051,000 > 994,000
            "expected_chosen_method": "종량세 (중량 기준)"
        },
        {
            "name": "Cat 1-2: 참깨 (1207.40) 한-EU FTA 2026 상반기 선택세율 (132.6% or 1,402원/kg)",
            "hs_code": "1207.40-0000", "origin": "IT", "date": "2026-03-15",
            "expected_fta_rate": 132.6, "expected_specific_rate": 1402.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 2000000, "weight_kg": 1000,
            "expected_final_duty": 2652000, # 200만원 * 132.6% = 2,652,000 > 1,402,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 1-3: 참깨 (1207.40) 한-영국 FTA 2026 하반기 선택세율 (99.4% or 1,051원/kg)",
            "hs_code": "1207.40-0000", "origin": "GB", "date": "2026-10-10",
            "expected_fta_rate": 99.4, "expected_specific_rate": 1051.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 1051000,
            "expected_chosen_method": "종량세 (중량 기준)"
        },
        {
            "name": "Cat 1-4: 참깨 (1207.40) 미국산 한-미 FTA 0.0% 무관세",
            "hs_code": "1207.40-0000", "origin": "US", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_specific_rate": None, "expected_duty_type": "AD_VALOREM",
            "cif_price": 5000000, "weight_kg": 1000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 1-5: 참깨 (1207.40) 중국산 한-중 FTA TRQ(FCN6) 0.0% 무관세",
            "hs_code": "1207.40-0000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 5000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 1-6: 들깨 (1207.99) WTO 선택세율(40% or 369원/kg) 종량세 선택 검증",
            "hs_code": "1207.99-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 40.0, "expected_wto_rate": 40.0, "expected_specific_rate": 369.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 500000, "weight_kg": 1000,
            "expected_final_duty": 369000, # 종가세 200,000 < 종량세 369,000
            "expected_chosen_method": "종량세 (중량 기준)"
        },
        {
            "name": "Cat 1-7: 참기름 (1515.50) WTO 초고율 선택세율(630% or 6,660원/kg) 종가세 선택",
            "hs_code": "1515.50-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 40.0, "expected_wto_rate": 630.0, "expected_specific_rate": 6660.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 100,
            "expected_final_duty": 6300000, # 종가세 6,300,000 > 종량세 666,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 1-8: 대두 (1201.90) 한-EU FTA 0.0% 무관세",
            "hs_code": "1201.90-0000", "origin": "IT", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 5000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 1-8b: 밥밑용 대두 (1201.90-3000) 중국산 한-중 FTA 양허제외 및 aT추천 3%/선택세 487% 또는 956원/kg",
            "hs_code": "1201.90-3000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 3.0, "expected_wto_rate": 487.0, "expected_specific_rate": 956.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 4870000, # 종가세 4,870,000 > 종량세 956,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 1-9: 대두유 (1507.10) 한-미 FTA 0.0% 무관세",
            "hs_code": "1507.10-0000", "origin": "US", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 5000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },

        # --- Category 2: 양념 채소류 (제07류 / 제09류) ---
        {
            "name": "Cat 2-1: 신선 마늘 (0703.20) WTO 선택세율(360% or 1,800원/kg) 종량세 선택",
            "hs_code": "0703.20-1000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 50.0, "expected_wto_rate": 360.0, "expected_specific_rate": 1800.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 100000, "weight_kg": 1000,
            "expected_final_duty": 1800000, # 종가세 360,000 < 종량세 1,800,000
            "expected_chosen_method": "종량세 (중량 기준)"
        },
        {
            "name": "Cat 2-2: 건조 마늘 (0712.90-2090) WTO 선택세율(360% or 1,800원/kg) 종가세 선택",
            "hs_code": "0712.90-2090", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 50.0, "expected_wto_rate": 360.0, "expected_specific_rate": 1800.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 500,
            "expected_final_duty": 3600000, # 종가세 3,600,000 > 종량세 900,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 2-3: 신선 양파 (0703.10) WTO 선택세율(135% or 206원/kg) 종량세 선택",
            "hs_code": "0703.10-1000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 50.0, "expected_wto_rate": 135.0, "expected_specific_rate": 206.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 100000, "weight_kg": 1000,
            "expected_final_duty": 206000, # 종가세 135,000 < 종량세 206,000
            "expected_chosen_method": "종량세 (중량 기준)"
        },
        {
            "name": "Cat 2-4: 건고추 (0904.21) WTO 선택세율(270% or 6,210원/kg) 종가세 선택",
            "hs_code": "0904.21-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 50.0, "expected_wto_rate": 270.0, "expected_specific_rate": 6210.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 100,
            "expected_final_duty": 2700000, # 종가세 2,700,000 > 종량세 621,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 2-5: 신선 생강 (0910.11) 중국산 한-중 FTA TRQ(FCN6) 0.0% 무관세",
            "hs_code": "0910.11-0000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 5000000, "weight_kg": 2000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 2-6: 건조 생강 (0910.12) 중국산 한-중 FTA TRQ(FCN6) 0.0% 무관세",
            "hs_code": "0910.12-0000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 3000000, "weight_kg": 1000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },

        # --- Category 3: 건조채소, 두류, 버섯류 (제07류) ---
        {
            "name": "Cat 3-1: 건조 표고버섯 (0712.39-1010) WTO 선택세율(514% or 1,625원/kg) 종가세 선택",
            "hs_code": "0712.39-1010", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 30.0, "expected_wto_rate": 514.0, "expected_specific_rate": 1625.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 5140000, # 종가세 5,140,000 > 종량세 1,625,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 3-2: 팥 (0713.32) 중국산 한-중 FTA TRQ(FCN6) 0.0% 무관세",
            "hs_code": "0713.32-0000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 8000000, "weight_kg": 4000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 3-3: 녹두 (0713.31) 중국산 한-중 FTA TRQ(FCN6) 0.0% 무관세",
            "hs_code": "0713.31-0000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 6000000, "weight_kg": 3000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 3-4: 신선 감자 (0701.90) 미국산 한-미 FTA 0.0% 무관세",
            "hs_code": "0701.90-0000", "origin": "US", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 5000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },

        # --- Category 4: 과실류 및 계절관세 품목 (제08류) ---
        {
            "name": "Cat 4-1: 신선 오렌지 (0805.10) 3월 계절관세 기간(30.0%) 적용",
            "hs_code": "0805.10-0000", "origin": "KR", "date": "2026-03-15",
            "expected_base_rate": 30.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 3000,
            "expected_final_duty": 3000000,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 4-2: 신선 오렌지 (0805.10) 11월 기본관세 기간(50.0%) 적용",
            "hs_code": "0805.10-0000", "origin": "KR", "date": "2026-11-20",
            "expected_base_rate": 50.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 3000,
            "expected_final_duty": 5000000,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 4-3: 신선 포도 (0806.10) 7월 국내 수확기 보호 계절관세(45.0%) 적용",
            "hs_code": "0806.10-0000", "origin": "KR", "date": "2026-07-15",
            "expected_base_rate": 45.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 2000,
            "expected_final_duty": 4500000,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 4-4: 신선 포도 (0806.10) 12월 비수확기 계절관세(24.0%) 적용",
            "hs_code": "0806.10-0000", "origin": "KR", "date": "2026-12-10",
            "expected_base_rate": 24.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 2000,
            "expected_final_duty": 2400000,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 4-5: 신선 밤 (0802.41) WTO 선택세율(211% or 838원/kg) 종가세 선택",
            "hs_code": "0802.41-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 40.0, "expected_wto_rate": 211.0, "expected_specific_rate": 838.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 500,
            "expected_final_duty": 2110000, # 종가세 2,110,000 > 종량세 419,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },

        # --- Category 5: 곡물, 맥아, 전분 (제10류 / 제11류) ---
        {
            "name": "Cat 5-1: 쌀 (1006.30) 일반 WTO 고율 양허세율(513.0%) 적용",
            "hs_code": "1006.30-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 5.0, "expected_wto_rate": 513.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 5130000,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 5-2: 맥아 (1107.10) 호주산 한-호주 FTA TRQ 0.0% 무관세",
            "hs_code": "1107.10-0000", "origin": "AU", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 20000000, "weight_kg": 10000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 5-3: 감자전분 (1108.13) WTO 선택세율(455% or 344원/kg) 종가세 선택",
            "hs_code": "1108.13-0000", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 8.0, "expected_wto_rate": 455.0, "expected_specific_rate": 344.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 1000,
            "expected_final_duty": 4550000, # 종가세 4,550,000 > 종량세 344,000
            "expected_chosen_method": "종가세 (가격 기준)"
        },

        # --- Category 6: 특산물, 가공품, 낙농품 (제04류 / 제12류 / 제20류 / 제21류) ---
        {
            "name": "Cat 6-1: 인삼/홍삼 (1211.20) WTO 초고율 선택세(754.3% or 28,218원/kg) 종가세 선택",
            "hs_code": "1211.20-1010", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 20.0, "expected_wto_rate": 754.3, "expected_specific_rate": 28218.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 100,
            "expected_final_duty": 7543000, # 종가세 7,543,000 > 종량세 2,821,800
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 6-2: 홍삼 농축액 (2106.90-3010) WTO 초고율 선택세(754.3% or 28,218원/kg)",
            "hs_code": "2106.90-3010", "origin": "CN", "date": "2026-09-05",
            "expected_base_rate": 8.0, "expected_wto_rate": 754.3, "expected_specific_rate": 28218.0, "expected_duty_type": "ALTERNATIVE",
            "cif_price": 1000000, "weight_kg": 100,
            "expected_final_duty": 7543000,
            "expected_chosen_method": "종가세 (가격 기준)"
        },
        {
            "name": "Cat 6-3: 탈지분유 (0402.10) 미국산 한-미 FTA TRQ 0.0% 무관세",
            "hs_code": "0402.10-0000", "origin": "US", "date": "2026-09-05",
            "expected_fta_rate": 0.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 10000000, "weight_kg": 5000,
            "expected_final_duty": 0,
            "expected_chosen_method": "종가세 단독"
        },
        {
            "name": "Cat 6-4: 조제마늘 (2005.99) 한-중 FTA 협정세율(8.0%) 적용",
            "hs_code": "2005.99-1000", "origin": "CN", "date": "2026-09-05",
            "expected_fta_rate": 8.0, "expected_duty_type": "AD_VALOREM",
            "cif_price": 1000000, "weight_kg": 500,
            "expected_final_duty": 80000,
            "expected_chosen_method": "종가세 단독"
        }
    ]
    
    from backend.main import get_hs_rates_api, calculate_duty_api
    
    passed_count = 0
    failed_count = 0
    
    print("\n[EXECUTING AUTOMATED TEST CASES]")
    for idx, tc in enumerate(test_cases):
        print(f"\nTest {idx+1}: {tc['name']}")
        try:
            # 1. Test get_hs_rates_api
            rates_res = get_hs_rates_api(
                hs_code=tc["hs_code"],
                origin=tc["origin"],
                declaration_date=tc.get("date"),
                db=db
            )
            r = rates_res["rates"]
            
            if "expected_fta_rate" in tc:
                assert r["fta_rate"] == tc["expected_fta_rate"], f"FTA rate mismatch: expected {tc['expected_fta_rate']}, got {r['fta_rate']}"
            if "expected_specific_rate" in tc:
                assert r["specific_rate"] == tc["expected_specific_rate"], f"Specific rate mismatch: expected {tc['expected_specific_rate']}, got {r['specific_rate']}"
            if "expected_duty_type" in tc:
                assert r["duty_type"] == tc["expected_duty_type"], f"Duty type mismatch: expected {tc['expected_duty_type']}, got {r['duty_type']}"
                
            # 2. Test calculate_duty_api
            calc_res = calculate_duty_api(
                hs_code=tc["hs_code"],
                origin=tc["origin"],
                cif_price_krw=tc["cif_price"],
                weight_kg=tc["weight_kg"],
                declaration_date=tc.get("date"),
                has_co=True,
                has_trq_recommendation=False,
                db=db
            )
            
            assert calc_res["final_duty"] == tc["expected_final_duty"], f"Final duty mismatch: expected {tc['expected_final_duty']}, got {calc_res['final_duty']}"
            assert calc_res["calculation_breakdown"]["chosen_method"] == tc["expected_chosen_method"], f"Method mismatch: expected {tc['expected_chosen_method']}, got {calc_res['calculation_breakdown']['chosen_method']}"
            
            print(f"  [PASS] Final Duty: {calc_res['final_duty']:,} KRW | Method: {calc_res['calculation_breakdown']['chosen_method']}")
            print(f"         Breakdown: {calc_res['calculation_breakdown']['comparison_reason']}")
            passed_count += 1
        except Exception as e:
            print(f"  [FAIL] {e}")
            failed_count += 1
            
    db.close()
    
    print("\n" + "=" * 80)
    print("                     TARIFF AUDIT EXECUTION SUMMARY")
    print("=" * 80)
    print(f"Total Tests Executed : {len(test_cases)}")
    print(f"Total Passed         : {passed_count}")
    print(f"Total Failed         : {failed_count}")
    
    if failed_count > 0:
        print(f"[FAILED] Audit detected {failed_count} failures!")
        sys.exit(1)
    else:
        print("[SUCCESS] All compound, seasonal, and TRQ tariffs validated with 100% precision!")
        sys.exit(0)

if __name__ == "__main__":
    audit_tariff_engine()

