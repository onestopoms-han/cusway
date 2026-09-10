import sqlite3
import json

conn = sqlite3.connect('cusway.db')
c = conn.cursor()

def get_rates_for_hsk(hsk_raw, origin_country='US'):
    clean = hsk_raw.replace('.', '').replace('-', '').strip()
    origin = origin_country.upper().strip()
    
    # 1. Query all rates from customs_rates_2026 for this HSK
    c.execute('SELECT rate_code, rate_val, specific_rate, usage_type, start_date, end_date FROM customs_rates_2026 WHERE hs_code = ?', (clean,))
    rows = c.fetchall()
    
    if not rows and len(clean) >= 6:
        c.execute('SELECT rate_code, rate_val, specific_rate, usage_type, start_date, end_date FROM customs_rates_2026 WHERE hs_code LIKE ? LIMIT 50', (f'{clean[:6]}%',))
        rows = c.fetchall()
        
    rate_map = {}
    for rcode, rval, srate, utype, sdate, edate in rows:
        if rcode not in rate_map:
            rate_map[rcode] = []
        rate_map[rcode].append({
            'rate_val': rval,
            'specific_rate': srate,
            'usage_type': utype,
            'start_date': sdate,
            'end_date': edate
        })
        
    # Base rate (A)
    base_info = rate_map.get('A', rate_map.get('A1', [{'rate_val': 8.0}]))[0]
    base_rate = base_info['rate_val']
    
    # WTO rate (C)
    wto_rows = rate_map.get('C', rate_map.get('C1', []))
    wto_rate = wto_rows[0]['rate_val'] if wto_rows else None
    
    # Quota rates (W1, W2)
    quota_w1 = rate_map.get('W1', [])
    quota_w2 = rate_map.get('W2', [])
    
    # Adjustment / Seasonal / Provisional
    adj_t1 = rate_map.get('T1', [])
    adj_t2 = rate_map.get('T2', [])
    
    print(f'=== HSK: {clean} (Origin: {origin}) ===')
    print(f'  Base Rate (A): {base_rate}%')
    print(f'  WTO Bound Rate (C): {wto_rate}%')
    if quota_w1:
        print(f'  Quota Rate (W1 - Recommended): {quota_w1[0]["rate_val"]}%')
    if quota_w2:
        print(f'  Quota Rate (W2 - Out-of-quota): {quota_w2[0]["rate_val"]}%')
    if adj_t1 or adj_t2:
        print(f'  Adjustment Tariff (T): {adj_t1 or adj_t2}')
        
    # Check FTA rates
    fta_keys = [k for k in rate_map.keys() if k.startswith('F') or k.startswith('R')]
    fta_summary = []
    for k in sorted(fta_keys)[:8]:
        val = rate_map[k][0]['rate_val']
        fta_summary.append(f"{k}:{val}%")
    print(f'  All FTA codes present ({len(fta_keys)}): {", ".join(fta_summary)}...')

get_rates_for_hsk('7320201000', 'CN')
get_rates_for_hsk('7320201000', 'US')
get_rates_for_hsk('0402101010', 'US')
get_rates_for_hsk('0201100000', 'AU')
get_rates_for_hsk('1001991010', 'US')
