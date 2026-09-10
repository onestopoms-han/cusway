import sqlite3
import time

def sync_hs_rate_master():
    t0 = time.time()
    conn_rates = sqlite3.connect('customs_rates_2026.db')
    cur_rates = conn_rates.cursor()
    
    conn = sqlite3.connect('cusway.db')
    cursor = conn.cursor()
    
    print("1. Reading unique HS codes and their rates from customs_rates_2026.db...")
    cur_rates.execute("""
    SELECT DISTINCT hs_code FROM customs_rates_2026
    """)
    all_hs_codes = [r[0] for r in cur_rates.fetchall()]
    print(f"Total distinct HS codes: {len(all_hs_codes)}")
    
    # Mapping of country codes to their primary FTA rate codes (Core FTA partners)
    COUNTRY_FTA_CODE_MAP = {
        "CN": [("FCN1", "한-중 FTA (FCN1)"), ("FRCCN1", "RCEP (한-중 / FRCCN1)")],
        "US": [("FUS1", "한-미 FTA (FUS1)")],
        "EU": [("FEU1", "한-EU FTA (FEU1)")],
        "GB": [("FGB1", "한-영 FTA (FGB1)")],
        "JP": [("FRCJP1", "RCEP (한-일 / FRCJP1)")],
        "VN": [("FVN1", "한-베트남 FTA (FVN1)"), ("FAS1", "한-아세안 FTA (FAS1)"), ("FRCAS1", "RCEP (한-베트남 / FRCAS1)")],
        "AU": [("FAU1", "한-호주 FTA (FAU1)"), ("FRCAU1", "RCEP (한-호주 / FRCAU1)")],
        "CA": [("FCA1", "한-캐나다 FTA (FCA1)")],
    }

    # Fetch all customs rates into memory dictionary
    print("2. Fetching all rate rows into memory...")
    cur_rates.execute("SELECT hs_code, rate_code, rate_val, specific_rate, usage_type FROM customs_rates_2026")
    rates_by_hsk = {}
    for hsk, rcode, rval, srate, utype in cur_rates.fetchall():
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
        for c_cand in ["C", "C1", "C2", "C3", "C4", "C5", "C6", "C2A1", "C2A2", "C2A3", "C2A4", "C2A5", "C2A6", "C2A7", "C2A8", "C2A9"]:
            if c_cand in rmap and rmap[c_cand] and rmap[c_cand][0][0] is not None:
                wto_rate = rmap[c_cand][0][0]
                break
            
        # W1 quota
        quota_rate = None
        if 'W1' in rmap and rmap['W1'] and rmap['W1'][0][0] is not None:
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
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hs_rm_new_hsk ON hs_rate_master_new(hs_code)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hs_rm_new_country ON hs_rate_master_new(country_code)")
    
    cursor.execute("DROP TABLE IF EXISTS hs_rate_master")
    cursor.execute("ALTER TABLE hs_rate_master_new RENAME TO hs_rate_master")
    conn.commit()
    
    cursor.execute("SELECT count(*) FROM hs_rate_master")
    final_count = cursor.fetchone()[0]
    print(f"4. Successfully synchronized hs_rate_master with {final_count} rows in {time.time() - t0:.2f}s!")
    
    # Test a few samples
    print("\nVerification Samples in hs_rate_master:")
    cursor.execute("SELECT hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name FROM hs_rate_master WHERE hs_code = '7320201000' LIMIT 5")
    for r in cursor.fetchall():
        print("  7320201000:", r)
    conn.execute("VACUUM")
    conn.close()

if __name__ == '__main__':
    sync_hs_rate_master()
