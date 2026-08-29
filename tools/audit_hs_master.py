import sqlite3
import pandas as pd
import os
import sys

def audit_database():
    workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(workspace_root, "cusway.db")
    excel_path = os.path.join(workspace_root, "관세청_HS부호 단위별 품목명_20260101.xlsx")
    
    print("=" * 80)
    print("               ONESTOP HS CODE DATABASE INTEGRITY AUDIT")
    print("=" * 80)
    print(f"Database: {db_path}")
    print(f"Excel Master Reference: {excel_path}")
    
    if not os.path.exists(db_path):
        print(f"[FATAL] Database not found at {db_path}")
        sys.exit(1)
    if not os.path.exists(excel_path):
        print(f"[FATAL] Excel reference not found at {excel_path}")
        sys.exit(1)
        
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    xls = pd.ExcelFile(excel_path)
    sheet_names = xls.sheet_names
    
    mismatches = 0
    total_checked = 0
    
    for idx, sname in enumerate(sheet_names):
        print(f"\nAuditing Sheet: {sname}...")
        df = pd.read_excel(excel_path, sheet_name=sname, dtype=str)
        
        # Determine code column and name columns
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
        
        for _, row in df.iterrows():
            raw_val = str(row[code_col]).strip()
            
            # Clean floating decimal tail (.0) if parsed as float representation
            if raw_val.endswith('.0'):
                raw_val = raw_val[:-2]
                
            clean_code = raw_val.replace('.', '').replace('-', '').strip()
            
            # Safe padding: Match identical rules with import_official_hs.py
            if len(clean_code) < expected_len:
                if raw_val.startswith('0') or clean_code.startswith('0'):
                    clean_code = clean_code.zfill(expected_len)
                elif expected_len > 1 and len(clean_code) == expected_len - 1 and clean_code[0] in ['1','2','3','4','5','6','7','8','9']:
                    # Keep as is to avoid prepending corruption (e.g. 87044 -> 087044 missing chapter bug)
                    pass
                else:
                    clean_code = clean_code.zfill(expected_len)
            
            excel_name_ko = str(row[name_ko_col]).strip() if pd.notna(row[name_ko_col]) else ""
            excel_name_en = str(row[name_en_col]).strip() if name_en_col and pd.notna(row[name_en_col]) else ""
            
            if not excel_name_ko or excel_name_ko.lower() == 'nan':
                excel_name_ko = "품목명 정보 없음"
                
            # Formatting styles
            if len(clean_code) == 10:
                formatted_code = f"{clean_code[:4]}.{clean_code[4:6]}-{clean_code[6:10]}"
            elif len(clean_code) == 6:
                formatted_code = f"{clean_code[:4]}.{clean_code[4:6]}"
            elif len(clean_code) == 5:
                formatted_code = f"{clean_code[:4]}.{clean_code[4]}"
            else:
                formatted_code = clean_code
                
            # Query Database
            cursor.execute("""
                SELECT name_ko, name_en FROM hs_code_master 
                WHERE hs_code = ? OR hs_code = ?
            """, (clean_code, formatted_code))
            
            db_records = cursor.fetchall()
            
            if not db_records:
                print(f"  [MISSING] HS Code {clean_code} / {formatted_code} not found in DB.")
                mismatches += 1
                continue
                
            total_checked += 1
            
            # Verify if any DB record matches excel reference
            matched_at_least_one = False
            for db_ko, db_en in db_records:
                # Clean strings for strict comparison
                clean_db_ko = db_ko.strip() if db_ko else ""
                clean_db_en = db_en.strip() if db_en else ""
                
                # Check Ko names and En names
                if clean_db_ko == excel_name_ko and clean_db_en == excel_name_en:
                    matched_at_least_one = True
                    break
                    
            if not matched_at_least_one:
                print(f"  [MISMATCH] HS Code: {clean_code} ({formatted_code})")
                print(f"    Excel Name (Ko): {excel_name_ko}")
                print(f"    Excel Name (En): {excel_name_en}")
                print(f"    Database Records:")
                for r_ko, r_en in db_records:
                    print(f"      - DB (Ko): {r_ko} | DB (En): {r_en}")
                mismatches += 1
                
    conn.close()
    
    print("\n" + "=" * 80)
    print("                     AUDIT EXECUTION REPORT SUMMARY")
    print("=" * 80)
    print(f"Total Database HSK Checked : {total_checked}")
    print(f"Total Mismatches Found     : {mismatches}")
    
    if mismatches > 0:
        print(f"[FAILED] Audit failed! Detected {mismatches} mismatch(es) or missing item(s).")
        sys.exit(1)
    else:
        print("[SUCCESS] Audit passed! Database matches the Excel Master Reference 100%.")
        sys.exit(0)

if __name__ == "__main__":
    audit_database()
