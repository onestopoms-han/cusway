# -*- coding: utf-8 -*-
import os
import sys
import sqlite3
import openpyxl

# Force stdout encoding to UTF-8
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

DB_PATH = r"c:\Users\PJH\onestop-ai-custom-service\cusway.db"
EXCEL_PATH = r"c:\Users\PJH\onestop-ai-custom-service\관세청_품목번호별 관세율표_20260211.xlsx"

# FTA 코드 매핑 (Rate Type Prefix -> (Country Code, FTA Name))
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

def sync_rates():
    print("=" * 80)
    print("       2026 관세청 공식 품목번호별 관세율표 고속 DB 동기화 엔진")
    print("=" * 80)
    
    if not os.path.exists(EXCEL_PATH):
        print(f"❌ 엑셀 파일을 찾을 수 없습니다: {EXCEL_PATH}")
        return
        
    print(f"📖 엑셀 파일 로딩 중: {EXCEL_PATH} ...")
    wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
    sheet_name = '2.12' if '2.12' in wb.sheetnames else wb.sheetnames[0]
    ws = wb[sheet_name]
    print(f"✅ 시트 '{sheet_name}' 선택 완료.")

    # 1. 메모리에서 품목별(HS Code)로 기본세율, WTO세율, FTA세율을 집계
    # structure: items[hs_code] = { 'base': float, 'wto': float, 'fta': { country_code: (fta_rate, fta_name) } }
    items = {}
    
    row_count = 0
    print("⚡ 380,000+ 행 고속 파싱 시작...")
    
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0: continue
        row_count += 1
        if row_count % 50000 == 0:
            print(f"  -> {row_count:,}행 처리 중...")
            
        raw_hs = str(row[0]).strip() if row[0] is not None else ""
        if not raw_hs: continue
        
        # 10자리 HS Code 정리
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
                'base': 8.0,
                'wto': None,
                'ftas': {} # country_code -> (rate, fta_name)
            }
            
        if rate_val is None:
            continue
            
        if rate_type == 'A': # 기본세율
            items[clean_hs]['base'] = rate_val
        elif rate_type == 'C': # WTO 양허관세
            items[clean_hs]['wto'] = rate_val
        else:
            # Check FTA matching
            matched = False
            for prefix, (c_code, f_name) in FTA_CODE_MAP.items():
                if rate_type.startswith(prefix):
                    items[clean_hs]['ftas'][c_code] = (rate_val, f_name)
                    matched = True
                    break

    print(f"\n🎉 총 {row_count:,}개 행 파싱 완료! 고유 HS 10단위 품목 수: {len(items):,}개")

    # 2. SQLite DB에 hs_rate_master 레코드 생성 및 일괄 적재
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("🧹 기존 hs_rate_master 테이블 정리 중...")
    cursor.execute("DELETE FROM hs_rate_master")
    conn.commit()

    records = []
    
    # 기본 지원 대상 국가들
    standard_countries = ['US', 'CN', 'VN', 'IT', 'JP', 'AU', 'CA', 'GB', 'IN', 'NZ', 'CL']
    
    for hs_code, data in items.items():
        base_rate = data['base']
        wto_rate = data['wto']
        
        # 각 국가별 FTA 행 생성
        for cntry in standard_countries:
            if cntry in data['ftas']:
                fta_rate, fta_name = data['ftas'][cntry]
            else:
                fta_rate, fta_name = None, None
                
            # 최적 추천세율 산정 (FTA < WTO < 기본 순서)
            rates_available = [base_rate]
            if wto_rate is not None: rates_available.append(wto_rate)
            if fta_rate is not None: rates_available.append(fta_rate)
            recommended_rate = min(rates_available) if rates_available else base_rate
            
            # 10자리 표준 숫자형 코드 단일 적재 (용량 최적화 및 쿼리 일관성)
            records.append((clean_hs, cntry, base_rate, wto_rate, fta_rate, fta_name, recommended_rate))

    print(f"💾 데이터베이스 일괄 적재 중... (총 {len(records):,}개 세율 레코드)")
    cursor.executemany("""
        INSERT INTO hs_rate_master (hs_code, country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, records)
    
    # 빠른 조회를 위한 인덱스 생성
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hs_rate_code ON hs_rate_master (hs_code);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_hs_rate_country ON hs_rate_master (hs_code, country_code);")
    
    conn.commit()
    conn.close()
    
    print("=" * 80)
    print(f"✨ [SUCCESS] 2026년 공식 관세율표 {len(records):,}건 완벽 동기화 완료!")
    print("=" * 80)

if __name__ == "__main__":
    sync_rates()
