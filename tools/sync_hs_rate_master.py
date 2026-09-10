import sqlite3
import time

def sync_hs_rate_master():
    t0 = time.time()
    conn = sqlite3.connect('cusway.db')
    cursor = conn.cursor()
    
    print("1. Reading unique HS codes and their rates from customs_rates_2026...")
    cursor.execute("""
    SELECT DISTINCT hs_code FROM customs_rates_2026
    """)
    all_hs_codes = [r[0] for r in cursor.fetchall()]
    print(f"Total distinct HS codes: {len(all_hs_codes)}")
    
    # Mapping of country codes to their primary FTA rate codes
    COUNTRY_FTA_CODE_MAP = {
        "CN": [("FCN1", "한-중 FTA (FCN1)"), ("FRCCN1", "RCEP (한-중 / FRCCN1)")],
        "US": [("FUS1", "한-미 FTA (FUS1)")],
        "EU": [("FEU1", "한-EU FTA (FEU1)")],
        "DE": [("FEU1", "한-EU FTA (독일 / FEU1)")],
        "FR": [("FEU1", "한-EU FTA (프랑스 / FEU1)")],
        "IT": [("FEU1", "한-EU FTA (이탈리아 / FEU1)")],
        "NL": [("FEU1", "한-EU FTA (네덜란드 / FEU1)")],
        "ES": [("FEU1", "한-EU FTA (스페인 / FEU1)")],
        "GB": [("FGB1", "한-영 FTA (FGB1)")],
        "JP": [("FRCJP1", "RCEP (한-일 / FRCJP1)")],
        "VN": [("FVN1", "한-베트남 FTA (FVN1)"), ("FAS1", "한-아세안 FTA (FAS1)"), ("FRCAS1", "RCEP (한-베트남 / FRCAS1)")],
        "AU": [("FAU1", "한-호주 FTA (FAU1)"), ("FRCAU1", "RCEP (한-호주 / FRCAU1)")],
        "CA": [("FCA1", "한-캐나다 FTA (FCA1)")],
        "NZ": [("FNZ1", "한-뉴질랜드 FTA (FNZ1)"), ("FRCNZ1", "RCEP (한-뉴질랜드 / FRCNZ1)")],
        "CL": [("FCL1", "한-칠레 FTA (FCL1)")],
        "PE": [("FPE1", "한-페루 FTA (FPE1)")],
        "CO": [("FCO1", "한-콜롬비아 FTA (FCO1)")],
        "TR": [("FTR1", "한-터키 FTA (FTR1)")],
        "IN": [("FIN1", "한-인도 CEPA (FIN1)")],
        "ID": [("FID1", "한-인도네시아 CEPA (FID1)"), ("FAS1", "한-아세안 FTA (FAS1)")],
        "SG": [("FSG1", "한-싱가포르 FTA (FSG1)"), ("FAS1", "한-아세안 FTA (FAS1)")],
        "PH": [("FPH1", "한-필리핀 FTA (FPH1)"), ("FAS1", "한-아세안 FTA (FAS1)")],
        "KH": [("FKH1", "한-캄보디아 FTA (FKH1)"), ("FAS1", "한-아세안 FTA (FAS1)")],
        "IL": [("FIL1", "한-이스라엘 FTA (FIL1)")],
        "CH": [("FEFCH", "한-EFTA FTA (스위스 / FEFCH)"), ("FEF1", "한-EFTA FTA (FEF1)")],
        "NO": [("FEFNO", "한-EFTA FTA (노르웨이 / FEFNO)"), ("FEF1", "한-EFTA FTA (FEF1)")],
        "IS": [("FEFIS", "한-EFTA FTA (아이슬란드 / FEFIS)"), ("FEF1", "한-EFTA FTA (FEF1)")],
        "CR": [("FCECR1", "한-중미 FTA (코스타리카 / FCECR1)")],
        "HN": [("FCEHN1", "한-중미 FTA (온두라스 / FCEHN1)")],
        "NI": [("FCENI1", "한-중미 FTA (니카라과 / FCENI1)")],
        "PA": [("FCEPA1", "한-중미 FTA (파나마 / FCEPA1)")],
        "SV": [("FCESV1", "한-중미 FTA (엘살바도르 / FCESV1)")],
    }

    # Fetch all customs rates into memory dictionary
    print("2. Fetching all rate rows into memory...")
    cursor.execute("SELECT hs_code, rate_code, rate_val, specific_rate, usage_type FROM customs_rates_2026")
    rates_by_hsk = {}
    for hsk, rcode, rval, srate, utype in cursor.fetchall():
        if hsk not in rates_by_hsk:
            rates_by_hsk[hsk] = {}
        if rcode not in rates_by_hsk[hsk]:
            rates_by_hsk[hsk][rcode] = []
        rates_by_hsk[hsk][rcode].append((rval, srate, utype))
        
    print(f"Loaded rates for {len(rates_by_hsk)} HS codes.")
    
    # Rebuild hs_rate_master with clean records
    cursor.execute("DROP TABLE IF EXISTS hs_rate_master_new")
    cursor.execute("""
    CREATE TABLE hs_rate_master_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hs_code TEXT NOT NULL,
        country_code TEXT NOT NULL,
        base_rate REAL,
        wto_rate REAL,
        fta_rate REAL,
        fta_name TEXT,
        recommended_rate REAL,
        specific_rate REAL,
        specific_unit TEXT,
        duty_type TEXT DEFAULT 'AD_VALOREM',
        duty_formula TEXT,
        has_seasonal_rate INTEGER DEFAULT 0,
        seasonal_schedule TEXT
    )
    """)
    
    insert_batch = []
    
    for hsk, rmap in rates_by_hsk.items():
        # Base rate
        base_rate = None
        if 'A' in rmap:
            base_rate = rmap['A'][0][0]
        elif 'A1' in rmap:
            base_rate = rmap['A1'][0][0]
        else:
            base_rate = 8.0
            
        # WTO rate
        wto_rate = None
        if 'C' in rmap:
            wto_rate = rmap['C'][0][0]
        elif 'C1' in rmap:
            wto_rate = rmap['C1'][0][0]
            
        # W1 quota
        quota_rate = None
        if 'W1' in rmap:
            quota_rate = rmap['W1'][0][0]
            
        # 1) Base/WTO record
        rec_rate = min([r for r in [base_rate, wto_rate, quota_rate] if r is not None]) if any(r is not None for r in [base_rate, wto_rate, quota_rate]) else base_rate
        insert_batch.append((
            hsk, "BASE", base_rate, wto_rate, None, "기본/WTO", rec_rate, None, None, "AD_VALOREM", None, 0, None
        ))
        
        # 2) Country-specific FTA records
        for ccode, fta_list in COUNTRY_FTA_CODE_MAP.items():
            matched_fta_rate = None
            matched_fta_name = fta_list[0][1]
            for fcode, fname in fta_list:
                if fcode in rmap:
                    matched_fta_rate = rmap[fcode][0][0]
                    matched_fta_name = fname
                    break
                    
            if matched_fta_rate is not None:
                fta_rec_rate = min([r for r in [matched_fta_rate, quota_rate, min([x for x in [base_rate, wto_rate] if x is not None])] if r is not None])
                insert_batch.append((
                    hsk, ccode, base_rate, wto_rate, matched_fta_rate, matched_fta_name, fta_rec_rate, None, None, "AD_VALOREM", None, 0, None
                ))
                
    print(f"3. Inserting {len(insert_batch)} rows into hs_rate_master_new...")
    cursor.executemany("""
    INSERT INTO hs_rate_master_new (hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate, specific_rate, specific_unit, duty_type, duty_formula, has_seasonal_rate, seasonal_schedule)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, insert_batch)
    
    cursor.execute("CREATE INDEX idx_hs_rm_new_hsk ON hs_rate_master_new(hs_code)")
    cursor.execute("CREATE INDEX idx_hs_rm_new_country ON hs_rate_master_new(country_code)")
    
    cursor.execute("DROP TABLE hs_rate_master")
    cursor.execute("ALTER TABLE hs_rate_master_new RENAME TO hs_rate_master")
    conn.commit()
    
    cursor.execute("SELECT count(*) FROM hs_rate_master")
    final_count = cursor.fetchone()[0]
    print(f"4. Successfully synchronized hs_rate_master with {final_count} rows in {time.time() - t0:.2f}s!")
    
    # Test a few samples
    print("\nVerification Samples in hs_rate_master:")
    cursor.execute("SELECT hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name FROM hs_rate_master WHERE hs_code = '7320201000'")
    for r in cursor.fetchall():
        print("  7320201000:", r)
    conn.close()

if __name__ == '__main__':
    sync_hs_rate_master()
