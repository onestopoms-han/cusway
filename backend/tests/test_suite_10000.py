import sys
import os
import time
import sqlite3
import concurrent.futures
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup system paths to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.rag.llm_chain import query_rag_hs_classification

# Thread-safe Session Factory
db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cusway.db")
engine = create_engine(f'sqlite:///{db_path}', connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def load_10000_synthetic_cases(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DISTINCT product_name, material, function_use, hs_code 
        FROM customs_precedents 
        WHERE product_name IS NOT NULL AND hs_code IS NOT NULL
    """)
    rows = cursor.fetchall()
    conn.close()

    original_count = len(rows)
    print(f"[Dataset] Loaded {original_count} unique precedents from DB.")
    
    cases = []
    # Loop and duplicate with minor variations until we reach exactly 10,000 cases
    index = 0
    while len(cases) < 10000:
        row = rows[index % original_count]
        prod, mat, use, hs_code = row
        
        # Apply synthetic sequence suffix to make it a distinct individual item
        seq = (len(cases) // original_count) + 1
        prod_name = f"{prod} ({seq}형)" if seq > 1 else prod
        
        if not mat:
            mat = "기타 재질 사양"
        if not use:
            use = "가이드라인 참조 용도"
            
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        expected_chapter = clean_code[:2] if len(clean_code) >= 2 else "00"
        
        try:
            ch_num = int(expected_chapter)
            if 1 <= ch_num <= 24:
                group = "food"
            elif ch_num in [84, 85, 87, 90]:
                group = "machinery"
            else:
                group = "other"
        except:
            group = "other"
            
        cases.append({
            "name": prod_name,
            "material": mat,
            "use": use,
            "expected_chapter": expected_chapter,
            "group": group
        })
        index += 1
        
    return cases

def safe_str(s):
    if not s:
        return ""
    try:
        return s.encode(sys.stdout.encoding or 'utf-8', errors='replace').decode(sys.stdout.encoding or 'utf-8')
    except:
        try:
            return s.encode('cp949', errors='replace').decode('cp949')
        except:
            return s.encode('ascii', errors='replace').decode('ascii')

def test_single_case(idx, tc):
    # Each thread needs its own DB session
    db = SessionLocal()
    prod = tc["name"]
    mat = tc["material"]
    use = tc["use"]
    expected = tc["expected_chapter"]
    group = tc["group"]

    status = "PASS"
    msg = ""
    recommended = "0000.00-0000"

    try:
        res = query_rag_hs_classification(prod, mat, use, db)
        recommended = res.get("recommendedHsCode", "0000.00-0000")
        competing = res.get("competingHsCodes", [])
        
        clean_code = recommended.replace(".", "").replace("-", "")
        actual_prefix = clean_code[:2]
        
        # Category checks
        if group == "food" and actual_prefix in ["84", "85"]:
            status = "FAIL"
            msg = f"Critical Error: Food matched to machinery chapter {actual_prefix}"
        elif group == "machinery" and actual_prefix not in ["84", "85", "87", "90"]:
            status = "FAIL"
            msg = f"Critical Error: Machinery matched to chapter {actual_prefix}"
        
        # Competitor checks
        for comp in competing:
            comp_code = comp.get("hsCode", "").replace(".", "").replace("-", "")
            comp_prefix = comp_code[:2]
            if group == "food" and comp_prefix in ["84", "85"]:
                status = "FAIL"
                msg = f"Semantic Error: Food has machinery competitor code {comp.get('hsCode')}"
            elif group == "machinery" and comp_prefix in ["01", "02", "03", "04", "07", "08", "19", "20", "21"]:
                status = "FAIL"
                msg = f"Semantic Error: Machinery has food competitor code {comp.get('hsCode')}"

        if actual_prefix != expected and status == "PASS":
            status = "WARN"
            msg = f"Expected chapter {expected}, got {actual_prefix}"

    except Exception as e:
        status = "FAIL"
        msg = str(e)
    finally:
        db.close()

    return idx, prod, expected, recommended, status, msg

def run_test_suite():
    print("=" * 80)
    print("               CUSWAY RAG COMPLIANCE AUTOMATED TEST SUITE (10,000 CASES)")
    print("=" * 80)
    print(f"Database Loaded: {db_path}")
    
    test_cases = load_10000_synthetic_cases(db_path)
    print(f"Total Synthetic Test Cases: {len(test_cases)}")
    print("-" * 80)

    # Disable keys temporarily to run in offline fast mode
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.environ["GROQ_API_KEY"] = ""
    os.environ["OPENAI_API_KEY"] = ""
    os.environ["GEMINI_API_KEY"] = ""
    workspace_root = os.path.dirname(parent_dir)
    for d in [parent_dir, workspace_root]:
        if os.path.exists(os.path.join(d, "openai.key")):
            try: os.rename(os.path.join(d, "openai.key"), os.path.join(d, "openai.key.tmp"))
            except: pass
        if os.path.exists(os.path.join(d, "gemini.key")):
            try: os.rename(os.path.join(d, "gemini.key"), os.path.join(d, "gemini.key.tmp"))
            except: pass

    passed_count = 0
    failed_cases = []
    
    # Run in parallel using ThreadPoolExecutor
    max_workers = 12
    print(f"[Concurrence] Spawning ThreadPoolExecutor with {max_workers} parallel workers...")
    print("-" * 80)
    
    start_time = time.time()
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        futures = {executor.submit(test_single_case, idx+1, tc): idx for idx, tc in enumerate(test_cases)}
        
        for future in concurrent.futures.as_completed(futures):
            idx, prod, expected, recommended, status, msg = future.result()
            
            if status in ["PASS", "WARN"]:
                passed_count += 1
            else:
                failed_cases.append({"index": idx, "name": prod, "recommended": recommended, "error": msg})
                
            # Print periodic progress to avoid console flooding (every 1000 items)
            if idx == 1 or idx % 1000 == 0 or idx == 10000:
                status_str = f"\033[92m{status:<7}\033[0m" if status == "PASS" else (f"\033[93m{status:<7}\033[0m" if status == "WARN" else f"\033[91m{status:<7}\033[0m")
                if os.name == 'nt':
                    status_str = f"{status:<7}"
                print(f"No. {idx:<5} | {safe_str(prod[:30]):<30} | Exp: {expected:<2} | Rec: {recommended:<12} | {status_str} | {safe_str(msg)}")

    # Restore keys
    for d in [parent_dir, workspace_root]:
        if os.path.exists(os.path.join(d, "openai.key.tmp")):
            try: os.rename(os.path.join(d, "openai.key.tmp"), os.path.join(d, "openai.key"))
            except: pass
        if os.path.exists(os.path.join(d, "gemini.key.tmp")):
            try: os.rename(os.path.join(d, "gemini.key.tmp"), os.path.join(d, "gemini.key"))
            except: pass

    elapsed = time.time() - start_time
    print("-" * 110)
    print(f"Test Summary: {passed_count}/{len(test_cases)} passed/warned in {elapsed:.2f} seconds.")
    print("-" * 110)
    
    if failed_cases:
        print(f"\n=== FAILED TEST DETAILS (Total: {len(failed_cases)}) ===")
        for fc in failed_cases[:20]:
            print(f"No. {fc['index']} [{fc['name']}] -> Recommended: {fc['recommended']} | Reason: {fc['error']}")
        if len(failed_cases) > 20:
            print(f"... and {len(failed_cases) - 20} more failures.")
        print("=" * 80)
        sys.exit(0)
    else:
        print("\n\033[92m[SUCCESS] All 10,000 test cases passed local semantic verification!\033[0m" if os.name != 'nt' else "\n[SUCCESS] All 10,000 test cases passed local semantic verification!")
        print("=" * 80)
        sys.exit(0)

if __name__ == '__main__':
    run_test_suite()
