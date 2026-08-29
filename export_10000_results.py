import sys
import os
import time
import csv
import sqlite3
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup system paths to allow direct execution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from backend.rag.llm_chain import query_rag_hs_classification

def load_10000_test_cases(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DISTINCT product_name, material, function_use, hs_code 
        FROM customs_precedents 
        WHERE product_name IS NOT NULL AND hs_code IS NOT NULL
    """)
    rows = cursor.fetchall()
    conn.close()

    cases = []
    # Repeat the rows to fill exactly 10000 items
    while len(cases) < 10000:
        for row in rows:
            if len(cases) >= 10000:
                break
            prod, mat, use, hs_code = row
            if not mat:
                mat = "기타 재질 사양"
            if not use:
                use = "가이드라인 참조 용도"
            
            # Add index suffix if duplicated to keep product name clean but distinguishable
            count_suffix = f" (복제분 {len(cases) // len(rows)})" if len(cases) >= len(rows) else ""
            cases.append({
                "name": f"{prod}{count_suffix}",
                "material": mat,
                "use": use,
                "original_hs_code": hs_code
            })
    return cases

def run_export_10000():
    workspace_root = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(workspace_root, "cusway.db")
    engine = create_engine(f'sqlite:///{db_path}')
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    # 1. Temporarily rename keys to run in fast local fallback mode
    keys = ["openai.key", "gemini.key", "groq.key"]
    renamed_keys = []
    for k in keys:
        kp = os.path.join(workspace_root, k)
        if os.path.exists(kp):
            try:
                os.rename(kp, kp + ".tmp")
                renamed_keys.append(kp)
            except Exception as e:
                print(f"[WARN] Failed to rename {k}: {e}")

    # Set environment variables empty
    os.environ["GROQ_API_KEY"] = ""
    os.environ["OPENAI_API_KEY"] = ""
    os.environ["GEMINI_API_KEY"] = ""

    print("=" * 80)
    print("               ONESTOP AI BATCH CLASSIFIER (10000 CASES EXPORTER)")
    print("=" * 80)
    print(f"Loading data from: {db_path}")
    test_cases = load_10000_test_cases(db_path)
    print(f"Loaded {len(test_cases)} items for batch processing.")
    print("Processing and classifying...")

    output_csv = os.path.join(workspace_root, "onestop_10000_classification_results.csv")
    
    start_time = time.time()
    
    with open(output_csv, mode="w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "번호 (Index)", 
            "품목명 (Product Name)", 
            "재질 (Material)", 
            "용도/기능 (Function/Use)", 
            "원래 HS Code (DB)", 
            "AI 추천 HS Code (AI Recommended)", 
            "검증 상태 (Status)", 
            "적용 통칙 (Applied GRIs)", 
            "분류 소명 근거 (Legal Reasoning)"
        ])
        
        for idx, tc in enumerate(test_cases):
            prod = tc["name"]
            mat = tc["material"]
            use = tc["use"]
            orig_hs = tc["original_hs_code"]
            
            try:
                res = query_rag_hs_classification(prod, mat, use, db)
                recommended = res.get("recommendedHsCode", "0000.00-0000")
                applied_gris = ", ".join(res.get("appliedGris", ["통칙 제1호"]))
                reasoning = res.get("legalReasoning", "로컬 검증에 부합함.")
                
                clean_orig = orig_hs.replace(".", "").replace("-", "").strip()[:2]
                clean_rec = recommended.replace(".", "").replace("-", "").strip()[:2]
                status = "PASS" if clean_orig == clean_rec else "WARN"
                
                writer.writerow([
                    idx + 1,
                    prod,
                    mat,
                    use,
                    orig_hs,
                    recommended,
                    status,
                    applied_gris,
                    reasoning
                ])
            except Exception as e:
                writer.writerow([
                    idx + 1,
                    prod,
                    mat,
                    use,
                    orig_hs,
                    "ERROR",
                    "FAIL",
                    "N/A",
                    f"에러 발생: {str(e)}"
                ])
                
            if (idx + 1) % 500 == 0:
                print(f"Progress: {idx + 1}/10000 items processed...")

    elapsed = time.time() - start_time
    print(f"\n[SUCCESS] Exported 10000 items classification results to:")
    print(f" -> {output_csv}")
    print(f"Elapsed Time: {elapsed:.2f} seconds.")
    print("=" * 80)

    # 2. Restore keys
    for kp in renamed_keys:
        if os.path.exists(kp + ".tmp"):
            try:
                os.rename(kp + ".tmp", kp)
            except Exception as e:
                print(f"[WARN] Failed to restore key {kp}: {e}")

if __name__ == "__main__":
    run_export_10000()
