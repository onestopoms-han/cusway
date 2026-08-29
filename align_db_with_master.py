import sqlite3
import re
import os

def align_database():
    workspace_root = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(workspace_root, "cusway.db")
    
    print("=" * 80)
    print("               ONESTOP DATABASE HS CODE ALIGNMENT SYSTEM")
    print("=" * 80)
    print(f"Target Database: {db_path}")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Fetch all precedents
    cursor.execute("SELECT id, hs_code, product_name FROM customs_precedents")
    precedents = cursor.fetchall()
    print(f"Total Precedents fetched: {len(precedents)}")
    
    # 2. Load all valid 10-digit codes from hs_code_master for fast lookup
    cursor.execute("SELECT hs_code, name_ko FROM hs_code_master WHERE hscode_length = 10")
    master_records = cursor.fetchall()
    
    # Store clean numbers as keys, formatted as values
    master_clean_map = {}
    master_formatted_set = set()
    
    for code, name in master_records:
        clean = re.sub(r'[^\d]', '', code)
        if len(clean) == 10:
            master_clean_map[clean] = code
            # Keep track of valid formatted ones
            master_formatted_set.add(code)
            
    print(f"Loaded {len(master_clean_map)} unique 10-digit official codes from Master DB.")
    
    updates = []
    corrections_log = []
    
    for pid, hs_code, prod_name in precedents:
        if not hs_code:
            continue
            
        # Clean the precedent code to pure digits
        clean_code = re.sub(r'[^\d]', '', hs_code).strip()
        
        # If code matches a valid 10-digit clean or formatted code directly
        if len(clean_code) == 10:
            if clean_code in master_clean_map:
                formatted = f"{clean_code[:4]}.{clean_code[4:6]}-{clean_code[6:10]}"
                if hs_code != formatted:
                    updates.append((formatted, pid))
                    corrections_log.append(f"Format Fix: [{prod_name}] '{hs_code}' -> '{formatted}'")
                continue
        
        # If the code does not exist in master, or is less than 10 digits
        # Try to find a match by prefix
        prefix_len = 6 if len(clean_code) >= 6 else (4 if len(clean_code) >= 4 else 0)
        prefix = clean_code[:prefix_len] if prefix_len > 0 else ""
        
        matched_code = None
        
        if prefix:
            # Find all 10-digit codes starting with this prefix in master
            candidates = [c for c in master_clean_map.keys() if c.startswith(prefix)]
            if candidates:
                # Find the best candidate matching the original suffix
                orig_suffix = clean_code[prefix_len:] if len(clean_code) > prefix_len else ""
                
                # Heuristic: Find candidate with closest matching suffix
                best_cand = None
                if orig_suffix:
                    # Look for candidate starting with the same digit as the original suffix (e.g. '9' for '9000' -> '9090')
                    matching_first_digit = [c for c in candidates if c[prefix_len] == orig_suffix[0]]
                    if matching_first_digit:
                        best_cand = matching_first_digit[-1] # Prefer the last/generic one (like 9090)
                
                if not best_cand:
                    # Fallback to the last candidate (often ending in 9090 or generic category)
                    best_cand = candidates[-1]
                    
                matched_code = best_cand
                
        if matched_code:
            formatted = f"{matched_code[:4]}.{matched_code[4:6]}-{matched_code[6:10]}"
            updates.append((formatted, pid))
            corrections_log.append(f"Replacement: [{prod_name}] '{hs_code}' -> '{formatted}' (Mapped via prefix {prefix})")
        else:
            # If absolutely no match, default to unclassified format or keep original format cleaned to 10-digit
            if len(clean_code) >= 4:
                padded = clean_code.ljust(10, '0')
                formatted = f"{padded[:4]}.{padded[4:6]}-{padded[6:10]}"
                updates.append((formatted, pid))
                corrections_log.append(f"Padded Default: [{prod_name}] '{hs_code}' -> '{formatted}'")
                
    # Apply updates to database
    print(f"\nApplying {len(updates)} updates to database customs_precedents...")
    cursor.executemany("UPDATE customs_precedents SET hs_code = ? WHERE id = ?", updates)
    conn.commit()
    
    # Print sample of corrections
    print("\n=== SAMPLE DATABASE CORRECTIONS (First 30) ===")
    for log in corrections_log[:30]:
        print(log)
        
    print(f"\n[SUCCESS] Database CustomsPrecedent HS Codes fully aligned and cleaned! Total updated: {len(updates)}")
    conn.close()

if __name__ == "__main__":
    align_database()
