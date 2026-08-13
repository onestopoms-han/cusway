# -*- coding: utf-8 -*-
import os
import sys
import time
import requests
import xml.etree.ElementTree as ET
import sqlite3

# 공공데이터포털 관세청 품목분류 정보 오픈 API 서비스 URL
API_URL = "http://apis.data.go.kr/1220000/PrdClsfInfoService/getPrdClsfInfoList"

db_path = 'c:/Users/PJH/onestop-ai-custom-service/cusway.db'

def setup_database():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # customs_precedents 테이블이 없으면 생성
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customs_precedents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_number TEXT UNIQUE NOT NULL,
        hs_code TEXT NOT NULL,
        product_name TEXT NOT NULL,
        material TEXT,
        function_use TEXT,
        decision_reason TEXT NOT NULL,
        issuing_body TEXT DEFAULT '관세평가분류원',
        date TEXT
    )
    """)
    conn.commit()
    conn.close()

def collect_customs_data(service_key: str, max_pages: int = 50):
    """
    공공데이터 API를 통해 관세청 품목분류 결정례 데이터를 수집하여 SQLite DB에 적재합니다.
    """
    setup_database()
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("\n[START] 관세청 공식 API 결정사례 수집 엔진 구동...")
    print("=" * 60)
    
    total_inserted = 0
    
    for page in range(1, max_pages + 1):
        print(f"🔄 관세청 서버 조회 중... (페이지: {page}/{max_pages})")
        
        # API 요청 파라미터 조립
        params = {
            'serviceKey': service_key,
            'pageNo': page,
            'numOfRows': 20, # 한 페이지당 20건씩 수집
        }
        
        try:
            # 관세청 API 호출
            response = requests.get(API_URL, params=params, timeout=15)
            
            if response.status_code != 200:
                print(f"❌ API 호출 실패 (HTTP {response.status_code})")
                break
                
            # 응답 XML 파싱
            root = ET.fromstring(response.content)
            
            # 응답 코드 검증
            header = root.find('header')
            result_code = header.find('resultCode').text if header is not None else ""
            if result_code != "00":
                result_msg = header.find('resultMsg').text if header is not None else "Unknown Error"
                print(f"❌ 관세청 API 에러 발생: {result_msg} (코드: {result_code})")
                print("💡 발급받으신 공공데이터포털 인증키가 올바른지, 혹은 활성화 완료(최대 1시간 소요)되었는지 확인하십시오.")
                break
                
            body = root.find('body')
            if body is None:
                print("⚠️ 수집할 데이터 바디가 비어 있습니다.")
                break
                
            items = body.find('items')
            if items is None or len(items) == 0:
                print("🎉 더 이상 조회할 관세청 결정례 데이터가 없습니다. 수집을 마감합니다.")
                break
                
            # 각 결정례 아이템 순회 적재
            for item in items.findall('item'):
                # API 응답 필드 추출
                case_number = item.find('clsfNo').text if item.find('clsfNo') is not None else "" # 분류번호
                hs_code = item.find('hsCode').text if item.find('hsCode') is not None else ""         # HS부호
                product_name = item.find('prdNm').text if item.find('prdNm') is not None else ""     # 품명
                material = item.find('mxrtNm').text if item.find('mxrtNm') is not None else ""       # 성분/재질
                function_use = item.find('useNm').text if item.find('useNm') is not None else ""     # 용도
                decision_reason = item.find('clsfRsn').text if item.find('clsfRsn') is not None else "" # 분류이유
                date = item.find('pblcDt').text if item.find('pblcDt') is not None else ""           # 공고일자
                
                if not case_number or not decision_reason:
                    continue
                
                # SQLite DB 적재 (분류번호 기준 UNIQUE 충돌 시 IGNORE 하여 중복 수집 배제)
                cursor.execute("""
                    INSERT OR IGNORE INTO customs_precedents 
                    (case_number, hs_code, product_name, material, function_use, decision_reason, issuing_body, date) 
                    VALUES (?, ?, ?, ?, ?, ?, '관세평가분류원', ?)
                """, (case_number, hs_code, product_name, material, function_use, decision_reason, date))
                
                if cursor.rowcount > 0:
                    total_inserted += 1
                    
            conn.commit()
            print(f"   -> {page}페이지 적재 성공 (누적 신규 적재: {total_inserted}건)")
            
            # 관세청 서버 부하 방지 및 IP 차단 안전 예방책 딜레이
            time.sleep(0.5)
            
        except Exception as e:
            print(f"⚠️ 요청 중 오류 발생: {str(e)}")
            break
            
    conn.close()
    print("=" * 60)
    print(f"🎉 [SUCCESS] 관세청 공식 결정사례 API 수집 완료! 총 {total_inserted}건의 판례 데이터가 안전하게 DB에 적재되었습니다.")

if __name__ == "__main__":
    print("=" * 60)
    print("  [CUSWAY] 관세청 공식 품목분류 사전회시 API 자동 수집 스크립트")
    print("=" * 60)
    
    # 1. 아규먼트로 서비스키를 받았는지 체크
    if len(sys.argv) < 2:
        print("\n💡 사용 방법:")
        print("  python collect_customs_api.py [공공데이터포털_인증키]")
        print("\n  * 아직 인증키가 없으시다면 공공데이터포털(data.go.kr)에서")
        print("    '관세청 품목분류정보' 오픈 API를 신청해 확인하십시오.")
        sys.exit(1)
        
    service_key = sys.argv[1]
    
    # 최대 수집 페이지 기본 100페이지 설정 (총 2,000건 상당)
    # 필요시 늘릴 수 있습니다.
    collect_customs_data(service_key, max_pages=100)
