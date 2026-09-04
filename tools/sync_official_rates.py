import os
import sys
import sqlite3
import openpyxl

# Force UTF-8 stdout
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"cusway.db"
EXCEL_PATH = r"관세청_품목번호별 관세율표_20260211.xlsx"

FTA_CODE_MAP = {
    'FUS': ('US', '한-미 FTA'),
    'FEU': ('IT', '한-EU FTA'),
    'FCN': ('CN', '한-중 FTA'),
    'FVN': ('VN', '한-베트남 FTA'),
    'FAU': ('AU', '한-호주 FTA'),
    'FCA': ('CA', '한-캐나다 FTA'),
    'FGB': ('GB', '한-영 FTA'),
    'FNZ': ('NZ', '한-뉴질랜드 FTA'),
    'FTR': ('TR', '한-튀르키예 FTA'),
    'FPE': ('PE', '한-페루 FTA'),
    'FCL': ('CL', '한-칠레 FTA'),
    'FIN': ('IN', '한-인도 CEPA'),
    'FSG': ('SG', '한-싱가포르 FTA'),
    'FAS': ('VN', '한-아세안 FTA'),
    'FRCJ': ('JP', 'RCEP (일본)'),
    'FRCAU': ('AU', 'RCEP (호주)'),
    'FRCNZ': ('NZ', 'RCEP (뉴질랜드)'),
    'FRCAS': ('VN', 'RCEP (아세안)'),
    'FID': ('ID', '한-인도네시아 CEPA'),
    'FKH': ('KH', '한-캄보디아 FTA'),
    'FPH': ('PH', '한-필리핀 FTA'),
    'FIL': ('IL', '한-이스라엘 FTA'),
    'FCO': ('CO', '한-콜롬비아 FTA'),
    'FCENI': ('NI', '한-중미 FTA (니카라과)'),
    'FCECR': ('CR', '한-중미 FTA (코스타리카)'),
    'FCEHN': ('HN', '한-중미 FTA (온두라스)'),
    'FCESV': ('SV', '한-중미 FTA (엘살바도르)'),
    'FCEPA': ('PA', '한-중미 FTA (파나마)')
}

def sync_compact_rates():
    print("=" * 80)
    print("       2026 관세청 공식 관세율표 고효율 최적화 동기화 엔진")
    print("=" * 80)
    
    wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
    sheet_name = '2.12' if '2.12' in wb.sheetnames else wb.sheetnames[0]
    ws = wb[sheet_name]
    
    items = {}
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0: continue
        raw_hs = str(row[0]).strip() if row[0] is not None else ""
        if not raw_hs: continue
        
        clean_hs = raw_hs.replace('.', '').replace('-', '')
        if len(clean_hs) < 10:
            clean_hs = clean_hs.zfill(10)
            
        rate_type = str(row[1]).strip() if row[1] is not None else ""
        try:
            rate_val = float(row[2]) if row[2] is not None else None
        except (ValueError, TypeError):
            rate_val = None
            
        if clean_hs not in items:
            items[clean_hs] = {
                'base': None,
                'wto': None,
                'ftas': {} # country_code -> (rate, fta_name)
            }
            
        if rate_val is None:
            continue
            
        if rate_type == 'A':
            items[clean_hs]['base'] = rate_val
        elif rate_type == 'C':
            items[clean_hs]['wto'] = rate_val
        else:
            for prefix, (c_code, f_name) in FTA_CODE_MAP.items():
                if rate_type.startswith(prefix) and c_code in ['US', 'CN', 'VN', 'IT', 'JP', 'AU', 'CA', 'GB', 'IN', 'NZ', 'CL']:
                    # 만약 동일 국가에 복수 FTA가 있으면 더 유리한(낮은) 세율 우선 보존
                    if c_code in items[clean_hs]['ftas']:
                        existing_rate, _ = items[clean_hs]['ftas'][c_code]
                        if rate_val < existing_rate:
                            items[clean_hs]['ftas'][c_code] = (rate_val, f_name)
                    else:
                        items[clean_hs]['ftas'][c_code] = (rate_val, f_name)
                    break

    records = []
    for hs_code, data in items.items():
        base_rate = data['base'] if data['base'] is not None else 8.0
        wto_rate = data['wto']
        
        # 1. 기본 레코드 (ALL/BASE) - FTA 미적용 시 기본세율/WTO세율 기준
        rates_avail = [base_rate]
        if wto_rate is not None: rates_avail.append(wto_rate)
        rec_rate = min(rates_avail)
        records.append((hs_code, 'BASE', base_rate, wto_rate, None, '기본/WTO', rec_rate))
        
        # 2. 실제 유효한 FTA가 존재하는 국가들만 추가 적재
        for cntry, (fta_rate, fta_name) in data['ftas'].items():
            fta_avail = [base_rate]
            if wto_rate is not None: fta_avail.append(wto_rate)
            if fta_rate is not None: fta_avail.append(fta_rate)
            fta_rec_rate = min(fta_avail)
            records.append((hs_code, cntry, base_rate, wto_rate, fta_rate, fta_name, fta_rec_rate))

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Drop existing indexes on hs_rate_master to avoid duplicates
    cursor.execute("DROP INDEX IF EXISTS idx_hs_rate_code")
    cursor.execute("DROP INDEX IF EXISTS idx_hs_rate_country")
    cursor.execute("DROP INDEX IF EXISTS ix_hs_rate_master_hs_code")
    cursor.execute("DROP INDEX IF EXISTS ix_hs_rate_master_id")
    
    cursor.execute("DELETE FROM hs_rate_master")
    conn.commit()
    
    print(f"💾 고효율 최적화 레코드 일괄 적재 중... (총 {len(records):,}개 세율 레코드)")
    cursor.executemany("""
        INSERT INTO hs_rate_master (hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, records)
    
    # 단일 복합 고속 인덱스 생성
    cursor.execute("CREATE INDEX IF NOT EXISTS ix_hs_rate_search ON hs_rate_master (hs_code, country_code);")
    
    conn.commit()
    conn.execute("VACUUM")
    conn.close()
    
    size_mb = os.path.getsize(DB_PATH) / (1024 * 1024)
    print(f"✨ 최적화 완료! 총 레코드: {len(records):,}건, DB 파일 크기: {size_mb:.2f} MB")

if __name__ == "__main__":
    sync_compact_rates()
