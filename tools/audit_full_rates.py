import sys
import io
import os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

workspace_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from backend.main import get_hs_rates_api
from backend.db import SessionLocal

db = SessionLocal()

sample_items = [
    ('7320.20-1000', 'CN', '자동차용 코일스프링'),
    ('7320.20-1000', 'JP', '자동차용 코일스프링'),
    ('8708.29-9000', 'CN', '차체 부분품'),
    ('8708.30-1000', 'CN', '브레이크 라이닝/캘리퍼'),
    ('8708.99-9000', 'CN', '기타 자동차 부분품'),
    ('8481.80-1010', 'CN', '산업용 밸브'),
    ('8413.50-1000', 'CN', '유압 피스톤 펌프'),
    ('8504.40-3010', 'CN', '인버터/충전기'),
    ('8501.31-2000', 'CN', 'BLDC 모터'),
    ('8541.43-0000', 'CN', '태양광 모듈'),
    ('3920.10-0000', 'CN', '폴리에틸렌 시트'),
    ('4002.19-0000', 'CN', 'SBR 합성고무'),
    ('2905.12-1000', 'CN', '이소프로필알코올'),
    ('6203.42-0000', 'CN', '면 청바지'),
    ('6404.11-0000', 'CN', '러닝화'),
    ('1201.90-0000', 'CN', '대두(양허제외/TRQ)'),
    ('1207.40-0000', 'CN', '참깨(FCN6/양허제외)'),
    ('0703.20-0000', 'CN', '마늘(초민감 양허제외)'),
    ('0901.21-0000', 'CN', '원두커피'),
    ('2209.00-1000', 'IT', '발사믹 식초')
]

print("=" * 100)
print("               FULL SPECTRUM TARIFF RATES VERIFICATION AUDIT")
print("=" * 100)

for code, origin, desc in sample_items:
    res = get_hs_rates_api(code, origin=origin, declaration_date='2026-09-10', db=db)
    r = res['rates']
    br = r.get('base_rate')
    wr = r.get('wto_rate')
    fr = r.get('fta_rate')
    fn = r.get('fta_name')
    rr = r.get('recommended_rate')
    fr_str = f"{fr}%" if fr is not None else "N/A"
    print(f"[{code}] {desc:<22} ({origin}) -> Base: {br}% | WTO: {wr}% | FTA: {fr_str:<6} ({fn}) | Rec: {rr}%")

print("=" * 100)
