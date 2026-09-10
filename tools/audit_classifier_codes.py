import re
import sqlite3

def check_classifier_codes():
    with open('backend/rag/industry_classifier.py', 'r', encoding='utf-8') as f:
        text = f.read()

    codes = set(re.findall(r'"recommendedHsCode":\s*"([^"]+)"', text))
    print(f"Total unique codes in industry_classifier.py: {len(codes)}")

    conn = sqlite3.connect('cusway.db')
    cur = conn.cursor()
    conn_r = sqlite3.connect('customs_rates_2026.db')
    cur_r = conn_r.cursor()

    invalid = []
    for c in sorted(codes):
        clean = re.sub(r'\D', '', c)
        cur.execute('SELECT 1 FROM hs_code_master WHERE hs_code = ? AND hscode_length = 10', (clean,))
        m_ok = cur.fetchone() is not None
        cur_r.execute('SELECT 1 FROM customs_rates_2026 WHERE hs_code = ?', (clean,))
        r_ok = cur_r.fetchone() is not None
        if not m_ok or not r_ok:
            # find best candidate
            prefix = clean[:6] if len(clean)>=6 else clean[:4]
            cur.execute('SELECT hs_code FROM hs_code_master WHERE hs_code LIKE ? AND hscode_length = 10 ORDER BY hs_code LIMIT 1', (f"{prefix}%",))
            cand = cur.fetchone()
            best = cand[0] if cand else None
            formatted_best = f"{best[:4]}.{best[4:6]}-{best[6:]}" if best else None
            invalid.append((c, clean, formatted_best))

    print(f"Invalid codes: {len(invalid)}")
    for old_code, clean, best in invalid:
        print(f"  {old_code} -> {best}")

if __name__ == "__main__":
    check_classifier_codes()
