import sqlite3
import pandas as pd
import os
import sys

def import_hs_master():
    workspace_root = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(workspace_root, "cusway.db")
    excel_path = os.path.join(workspace_root, "관세청_HS부호 단위별 품목명_20260101.xlsx")
    
    print("=" * 80)
    print("               ONESTOP OFFICIAL HS CODE MASTER SYNC")
    print("=" * 80)
    print(f"Database Path: {db_path}")
    print(f"Excel Path: {excel_path}")
    
    if not os.path.exists(excel_path):
        print(f"[FATAL] Excel reference not found at {excel_path}")
        sys.exit(1)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Clear existing hs_code_master
    print("Clearing existing hs_code_master table...")
    cursor.execute("DELETE FROM hs_code_master")
    conn.commit()
    
    # 2. Parse Excel Sheets
    xls = pd.ExcelFile(excel_path)
    sheet_names = xls.sheet_names
    print(f"Available sheet names: {sheet_names}")
    
    total_inserted = 0
    
    for idx, sname in enumerate(sheet_names):
        print(f"Processing sheet: {sname}...")
        df = pd.read_excel(excel_path, sheet_name=sname, dtype=str)
        
        # Determine columns
        cols = df.columns
        code_col = cols[0]
        name_ko_col = cols[1]
        name_en_col = cols[2] if len(cols) > 2 else None
        
        expected_len = 10
        if "HS2" in sname or idx == 0: expected_len = 2
        elif "HS4" in sname or idx == 1: expected_len = 4
        elif "HS6" in sname or idx == 2: expected_len = 6
        elif "HS8" in sname or idx == 3: expected_len = 8
        elif "HS10" in sname or idx == 4: expected_len = 10
        
        records = []
        for _, row in df.iterrows():
            raw_val = str(row[code_col]).strip()
            
            # Clean floating decimal tail (.0) if parsed as float representation
            if raw_val.endswith('.0'):
                raw_val = raw_val[:-2]
            
            # Clean standard formatting separators
            clean_code = raw_val.replace('.', '').replace('-', '').strip()
            
            # Safe padding: Only prepend '0' if the original value started with '0' 
            # OR if it belongs to Chapter 01-09 (i.e. length is expected_len - 1 and does not start with 1-9)
            if len(clean_code) < expected_len:
                if raw_val.startswith('0') or clean_code.startswith('0'):
                    clean_code = clean_code.zfill(expected_len)
                elif expected_len > 1 and len(clean_code) == expected_len - 1 and clean_code[0] in ['1','2','3','4','5','6','7','8','9']:
                    # Keep it as is (do NOT prepand 0 to avoid chapter corruption, e.g. 91011 -> 091011 mismatch)
                    pass
                else:
                    # Fallback padding for generic safe codes
                    clean_code = clean_code.zfill(expected_len)
            
            name_ko = str(row[name_ko_col]).strip() if pd.notna(row[name_ko_col]) else ""
            name_en = str(row[name_en_col]).strip() if name_en_col and pd.notna(row[name_en_col]) else ""
            
            if not name_ko or name_ko.lower() == 'nan':
                name_ko = "품목명 정보 없음"
            
            # Generate formatting styles for DB lookup optimization
            if len(clean_code) == 10:
                formatted_code = f"{clean_code[:4]}.{clean_code[4:6]}-{clean_code[6:10]}"
            elif len(clean_code) == 6:
                formatted_code = f"{clean_code[:4]}.{clean_code[4:6]}"
            elif len(clean_code) == 5:
                formatted_code = f"{clean_code[:4]}.{clean_code[4]}"
            else:
                formatted_code = clean_code
                
            # Keep both standard numerical format and formatted representation
            records.append((clean_code, expected_len, name_ko, name_en))
            if formatted_code != clean_code:
                records.append((formatted_code, expected_len, name_ko, name_en))
                
        # Bulk Insert
        cursor.executemany("""
            INSERT OR REPLACE INTO hs_code_master (hs_code, hscode_length, name_ko, name_en)
            VALUES (?, ?, ?, ?)
        """, records)
        conn.commit()
        print(f" -> Inserted {len(records)} records for {expected_len}-digit codes.")
        total_inserted += len(records)
        
    conn.close()
    print("=" * 80)
    print(f"[SUCCESS] Official HS Code Master Synced! Total Records: {total_inserted}")
    print("=" * 80)

if __name__ == "__main__":
    import_hs_master()
