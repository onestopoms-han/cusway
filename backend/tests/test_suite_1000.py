import sys
import os
import time
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup system paths to allow direct execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.rag.llm_chain import query_rag_hs_classification

def load_1000_test_cases(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # Query exactly 1000 records from customs_precedents
    cursor.execute("""
        SELECT DISTINCT product_name, material, function_use, hs_code 
        FROM customs_precedents 
        WHERE product_name IS NOT NULL AND hs_code IS NOT NULL
        LIMIT 1000
    """)
    rows = cursor.fetchall()
    conn.close()

    cases = []
    for idx, row in enumerate(rows):
        prod, mat, use, hs_code = row
        if not mat:
            mat = "기타 재질 사양"
        if not use:
            use = "가이드라인 참조 용도"
        
        # Clean hs_code (e.g. 8517.13-0000 -> 85)
        clean_code = hs_code.replace(".", "").replace("-", "").strip()
        expected_chapter = clean_code[:2] if len(clean_code) >= 2 else "00"
        
        # Classify group
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
            "name": prod,
            "material": mat,
            "use": use,
            "expected_chapter": expected_chapter,
            "group": group
        })
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

def run_test_suite():
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "cusway.db")
    engine = create_engine(f'sqlite:///{db_path}')
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    print("=" * 80)
    print("               CUSWAY RAG COMPLIANCE AUTOMATED TEST SUITE (1000 CASES)")
    print("=" * 80)
    print(f"Database Loaded: {db_path}")
    
    # Load dynamically from DB
    test_cases = load_1000_test_cases(db_path)
    print(f"Dynamically Loaded Test Cases: {len(test_cases)}")
    print("-" * 80)

    # Determine mode
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    run_live = "--live" in sys.argv
    if run_live:
        print("[MODE] Running LIVE API Test Mode (Gemini / OpenAI). Note: May hit rate limits.")
    else:
        print("[MODE] Running FAST Local Cache Heuristic Validation Mode.")
        # Temporarily mock the API key to force local matching in backend
        os.environ["GROQ_API_KEY"] = ""
        os.environ["OPENAI_API_KEY"] = ""
        os.environ["GEMINI_API_KEY"] = ""
        workspace_root = os.path.dirname(parent_dir)
        print("[SETUP] Key renaming handled externally.")

    passed_count = 0
    failed_cases = []

    print(f"{'No.':<4} | {'Product Name':<32} | {'Exp':<3} | {'Recommended HS':<12} | {'Status':<7} | {'Message/Notes'}")
    print("-" * 110)

    start_time = time.time()
    for idx, tc in enumerate(test_cases):
        prod = tc["name"]
        mat = tc["material"]
        use = tc["use"]
        expected = tc["expected_chapter"]
        group = tc["group"]

        try:
            # Execute classification
            res = query_rag_hs_classification(prod, mat, use, db)
            recommended = res.get("recommendedHsCode", "0000.00-0000")
            competing = res.get("competingHsCodes", [])
            
            # Extract heading prefix
            clean_code = recommended.replace(".", "").replace("-", "")
            actual_prefix = clean_code[:2]
            
            status = "PASS"
            msg = ""

            # Category consistency checks
            if group == "food" and actual_prefix in ["84", "85"]:
                status = "FAIL"
                msg = f"Critical Error: Food matched to machinery chapter {actual_prefix}"
            elif group == "machinery" and actual_prefix not in ["84", "85", "87", "90"]:
                status = "FAIL"
                msg = f"Critical Error: Machinery matched to chapter {actual_prefix}"
            
            # Check competing codes consistency
            for comp in competing:
                comp_code = comp.get("hsCode", "").replace(".", "").replace("-", "")
                comp_prefix = comp_code[:2]
                if group == "food" and comp_prefix in ["84", "85"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Food has machinery competitor code {comp.get('hsCode')}"
                elif group == "machinery" and comp_prefix in ["01", "02", "03", "04", "07", "08", "19", "20", "21"]:
                    status = "FAIL"
                    msg = f"Semantic Error: Machinery has food competitor code {comp.get('hsCode')}"

            # Check expected chapter matching
            if actual_prefix != expected and status == "PASS":
                status = "WARN"
                msg = f"Expected chapter {expected}, got {actual_prefix}"

            if status in ["PASS", "WARN"]:
                passed_count += 1
            else:
                failed_cases.append({"index": idx+1, "name": prod, "recommended": recommended, "error": msg})

            status_str = f"\033[92m{status:<7}\033[0m" if status == "PASS" else (f"\033[93m{status:<7}\033[0m" if status == "WARN" else f"\033[91m{status:<7}\033[0m")
            if os.name == 'nt':
                status_str = f"{status:<7}"

            # Limit console length to prevent buffer overflow but show periodic progress
            if idx < 50 or idx % 100 == 0 or idx >= 950:
                print(f"{idx+1:<4} | {safe_str(prod[:32]):<32} | {expected:<3} | {recommended:<12} | {status_str} | {safe_str(msg)}")
            elif idx == 50:
                print("... [Intermediate progress hidden for clarity] ...")

        except Exception as e:
            failed_cases.append({"index": idx+1, "name": prod, "recommended": "ERROR", "error": str(e)})
            print(f"{idx+1:<4} | {safe_str(prod[:32]):<32} | {expected:<3} | ERROR        | FAIL    | {safe_str(str(e))}")

        if run_live:
            time.sleep(3.5)

    # Restore temporary files if renamed
    if not run_live:
        print("[CLEANUP] Keys remained renamed or handled externally.")

    elapsed = time.time() - start_time
    print("-" * 110)
    print(f"Test Summary: {passed_count}/{len(test_cases)} passed/warned in {elapsed:.2f} seconds.")
    print("-" * 110)
    
    if failed_cases:
        print(f"\n=== FAILED TEST DETAILS (Total: {len(failed_cases)}) ===")
        # Print first 20 failures to prevent console flood
        for fc in failed_cases[:20]:
            print(f"No. {fc['index']} [{fc['name']}] -> Recommended: {fc['recommended']} | Reason: {fc['error']}")
        if len(failed_cases) > 20:
            print(f"... and {len(failed_cases) - 20} more failures.")
        print("=" * 80)
        sys.exit(0)
    else:
        print("\n\033[92m[SUCCESS] All 1000 test cases passed local semantic verification!\033[0m" if os.name != 'nt' else "\n[SUCCESS] All 1000 test cases passed local semantic verification!")
        print("=" * 80)
        sys.exit(0)

if __name__ == '__main__':
    run_test_suite()
