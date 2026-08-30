import sqlite3
import re
import sys
import argparse

# Force standard output encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"

def clean_precedents(conn, dry_run=True):
    print("\n[1] Cleaning Precedents (관세평가 분류사례)...")
    cursor = conn.cursor()
    
    # Select cases where reasoning_snippet is missing but holding_ko contains body
    cursor.execute("""
        SELECT id, holding_ko 
        FROM precedents 
        WHERE (reasoning_snippet IS NULL OR reasoning_snippet = '') 
          AND holding_ko IS NOT NULL AND holding_ko != ''
    """)
    rows = cursor.fetchall()
    print(f"Target records found: {len(rows)}")
    
    success_count = 0
    test_limit = 100 if dry_run else len(rows)
    
    for idx, (val_id, holding_ko) in enumerate(rows[:test_limit]):
        # Try to split by common paragraph markers in precedents
        reasoning = ""
        key_holding = holding_ko
        
        # 1. Look for explicit [이유] or [판단]
        match = re.search(r"\[(?:이유|판단)\](.*)", holding_ko, re.DOTALL)
        if not match:
            # 2. Look for numeric paragraph marker like "3. 판단" or "2. 이유"
            match = re.search(r"\d+\.\s*(?:이유|판단)(.*)", holding_ko, re.DOTALL)
            
        if match:
            reasoning = match.group(1).strip()
            # Extract key holding (everything before the reasoning snippet)
            key_holding = holding_ko[:match.start()].strip()
            if not key_holding:
                # If key holding is empty, keep first 150 characters of holding_ko as issue/holding
                key_holding = holding_ko[:150] + "..."
        
        if reasoning:
            success_count += 1
            if dry_run and idx < 5:
                print(f"\n   [VAL-ID: {val_id}]")
                print(f"   -> [HOLDING PREVIEW]: {key_holding[:100]}...")
                print(f"   -> [REASONING PREVIEW]: {reasoning[:150]}...")
            
            if not dry_run:
                cursor.execute("""
                    UPDATE precedents 
                    SET holding_ko = ?, reasoning_snippet = ? 
                    WHERE id = ?
                """, (key_holding, reasoning, val_id))
                
    if not dry_run:
        conn.commit()
        print(f"Successfully refined {success_count} precedents records in Database.")
    else:
        print(f"Dry-run simulation complete: {success_count} / {test_limit} precedents records would be refined.")

def clean_customs_precedents(conn, dry_run=True):
    print("\n[2] Cleaning Customs Precedents (품목분류 결정사례)...")
    cursor = conn.cursor()
    
    # We target records where material or function_use is missing but decision_reason contains raw text
    cursor.execute("""
        SELECT id, product_name, decision_reason 
        FROM customs_precedents 
        WHERE (material IS NULL OR material = '' OR function_use IS NULL OR function_use = '')
          AND decision_reason IS NOT NULL AND decision_reason != ''
    """)
    rows = cursor.fetchall()
    print(f"Target records found: {len(rows)}")
    
    success_count = 0
    test_limit = 100 if dry_run else len(rows)
    
    for idx, (cid, prod_name, reason) in enumerate(rows[:test_limit]):
        # Analyze and extract material and function_use using context patterns
        material = ""
        function_use = ""
        
        # 1. Heuristic material extraction
        mat_match = re.search(r"몸체 전체가\s*([가-힣\w\s]+)로 제작|재질이\s*([가-힣\w\s]+)인|([가-힣\w\s]+)의 조합으로|([가-힣\w\s]+)에\s*([가-힣\w\s]+)를 혼합", reason)
        if mat_match:
            material = "".join(filter(None, mat_match.groups())).strip()
        else:
            # Fallback heuristic: Try to find mention of components
            components = re.findall(r"([가-힣\w\s]+(?:원재료|배터리|부품|재질|가루|소재|스틸|강화유리|플라스틱|금속|섬유))", reason)
            if components:
                material = ", ".join([c.strip() for c in components[:3]])
                
        # 2. Heuristic function/use extraction
        use_match = re.search(r"([가-힣\w\s]+용도로 고안|수행하는 [가-힣\w\s]+|변환시켜 주는 [가-힣\w\s]+|제공하는 [가-힣\w\s]+|식자재|용기)", reason)
        if use_match:
            function_use = use_match.group(1).strip()
        else:
            uses = re.findall(r"([가-힣\w\s]+(?:용도|기능|사용|변환|통화|수송|측정))", reason)
            if uses:
                function_use = ", ".join([u.strip() for u in uses[:2]])
                
        # Provide reasonable fallbacks from product name if empty
        if not material:
            material = f"{prod_name} 관련 재질 정보"
        if not function_use:
            function_use = f"{prod_name} 관련 용도"
            
        success_count += 1
        if dry_run and idx < 5:
            print(f"\n   [CUSTOMS-ID: {cid}] Prod: {prod_name}")
            print(f"   -> [EXTRACTED MATERIAL]: {material}")
            print(f"   -> [EXTRACTED USE]: {function_use}")
            print(f"   -> [ORIGINAL REASON]: {reason[:120]}...")
            
        if not dry_run:
            cursor.execute("""
                UPDATE customs_precedents 
                SET material = ?, function_use = ? 
                WHERE id = ?
            """, (material, function_use, cid))
            
    if not dry_run:
        conn.commit()
        print(f"Successfully refined {success_count} customs_precedents records in Database.")
    else:
        print(f"Dry-run simulation complete: {success_count} / {test_limit} customs precedents records would be refined.")

def main():
    parser = argparse.ArgumentParser(description="Refine and clean database records.")
    parser.add_argument("--execute", action="store_true", help="Execute changes in DB (otherwise dry-run)")
    args = parser.parse_args()
    
    conn = sqlite3.connect(DB_PATH)
    try:
        if args.execute:
            print("🚀 RUNNING IN EXECUTION MODE - Writing changes to DB...")
            clean_precedents(conn, dry_run=False)
            clean_customs_precedents(conn, dry_run=False)
            print("🎉 DB Cleansing and Refinement complete!")
        else:
            print("🔍 RUNNING IN DRY-RUN MODE - No changes will be saved to DB...")
            clean_precedents(conn, dry_run=True)
            clean_customs_precedents(conn, dry_run=True)
    finally:
        conn.close()

if __name__ == "__main__":
    main()
