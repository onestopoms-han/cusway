# -*- coding: utf-8 -*-
import os
import sqlite3
import pandas as pd

excel_file = "관세청_HS부호 단위별 품목명_20260101.xlsx"
db_path = "cusway.db"

def format_hs_code(code_val, sheet_name):
    """
    엑셀의 숫자형 HS 코드를 문자열로 안전하게 변환하고, 앞자리 0을 복원합니다.
    """
    if pd.isna(code_val):
        return None
    
    # 공백 제거 및 문자열화
    code_str = str(code_val).strip()
    if code_str.endswith('.0'):
        code_str = code_str[:-2]
        
    # 소수점이나 다른 특수문자가 섞여있다면 제거
    code_str = re.sub(r'[^0-9]', '', code_str) if 're' in globals() else code_str.replace('.', '').replace('-', '')
    
    # 각 시트 단위별 자릿수 메꿔주기
    if sheet_name == 'HS2단위':
        return code_str.zfill(2)
    elif sheet_name == 'HS4단위':
        return code_str.zfill(4)
    elif sheet_name == 'HS6단위(5단위포함)':
        # 5단위 혹은 6단위
        if len(code_str) <= 5:
            return code_str.zfill(5)
        return code_str.zfill(6)
    elif sheet_name == 'HS8단위(7, 9단위포함)':
        if len(code_str) <= 7:
            return code_str.zfill(7)
        return code_str.zfill(8)
    elif sheet_name == 'HS10단위':
        return code_str.zfill(10)
        
    return code_str

def format_with_punctuation(hs_code):
    """
    순수 숫자 자릿수로 채워진 HS 코드를 표준 WCO 관세율표 포맷(점, 대시)으로 변환합니다.
    예: 0101211000 -> 0101.21-1000
    """
    if not hs_code:
        return hs_code
        
    length = len(hs_code)
    if length == 4:
        return hs_code # 0101
    elif length == 6:
        return f"{hs_code[:4]}.{hs_code[4:]}" # 0101.21
    elif length == 10:
        return f"{hs_code[:4]}.{hs_code[4:6]}-{hs_code[6:]}" # 0101.21-1000
    return hs_code

def import_excel_to_db():
    if not os.path.exists(excel_file):
        print(f"❌ 엑셀 파일 '{excel_file}'을 찾을 수 없습니다. 경로를 확인하십시오.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("\n[START] 관세청 공식 HSK 마스터 엑셀 대량 이식 시작...")
    print("=" * 60)
    
    xl = pd.ExcelFile(excel_file)
    total_records = 0
    
    # 중복 삽입 방지를 위한 트랜잭션 구동
    try:
        for sheet in xl.sheet_names:
            print(f"📊 시트 읽는 중: {sheet}")
            df = pd.read_excel(excel_file, sheet_name=sheet)
            
            # 첫 번째 컬럼이 HS 코드 컬럼임
            code_col = df.columns[0]
            
            records_to_insert = []
            for _, row in df.iterrows():
                raw_code = row[code_col]
                name_ko = row['한글품목명'] if '한글품목명' in row and not pd.isna(row['한글품목명']) else ""
                name_en = row['영문품목명'] if '영문품목명' in row and not pd.isna(row['영문품목명']) else ""
                
                # 포맷 정리
                clean_code = format_hs_code(raw_code, sheet)
                if not clean_code:
                    continue
                
                length = len(clean_code)
                
                # 1. 순수 숫자 포맷 적재
                records_to_insert.append((clean_code, length, name_ko, name_en))
                
                # 2. 문장부호가 포함된 WCO 표준 포맷 적재 (검색 정합성 방어용)
                formatted_code = format_with_punctuation(clean_code)
                if formatted_code != clean_code:
                    records_to_insert.append((formatted_code, length, name_ko, name_en))
            
            # 벌크 INSERT 구문 기동
            cursor.executemany("""
                INSERT OR REPLACE INTO hs_code_master (hs_code, hscode_length, name_ko, name_en) 
                VALUES (?, ?, ?, ?)
            """, records_to_insert)
            
            conn.commit()
            total_inserted_sheet = cursor.execute("SELECT changes()").fetchone()[0]
            print(f"   -> {sheet} 이식 완료! (적재 행수: {len(records_to_insert)}건)")
            total_records += len(records_to_insert)
            
        print("=" * 60)
        # 최종 DB 건수 확인
        cursor.execute("SELECT COUNT(*) FROM hs_code_master")
        db_total = cursor.fetchone()[0]
        print(f"🎉 [SUCCESS] HSK 엑셀 마스터 이식 완수! 총 {total_records}개 항목 적재 (마스터 테이블 누적: {db_total}건)")
        
    except Exception as e:
        print("❌ 이식 오류 발생:", str(e))
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    import re
    import_excel_to_db()
