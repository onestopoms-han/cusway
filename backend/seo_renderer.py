# -*- coding: utf-8 -*-
"""
CUSWAY Programmatic SEO Renderer
--------------------------------
10단위 HSK 코드, 관세율표, 세관장확인 요건, 관세평가분류원 실존 결정례 DB를 연동하여
구글봇 및 네이버 서치어드바이저가 즉시 색인할 수 있는 고품질 초고속 SSR HTML 페이지를 생성합니다.
"""

import os
import re
import sqlite3
import html
from typing import Optional, Dict, Any, List

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(WORKSPACE_ROOT, "cusway.db")

def format_hsk(code: str) -> str:
    """10자리 연속 숫자를 표준 HSK 10단위 표기법(XXXX.XX-XXXX)으로 변환합니다."""
    clean = re.sub(r'[^0-9]', '', str(code or ''))
    if len(clean) == 10:
        return f"{clean[:4]}.{clean[4:6]}-{clean[6:]}"
    elif len(clean) == 6:
        return f"{clean[:4]}.{clean[4:6]}"
    elif len(clean) == 4:
        return clean
    return str(code)

def normalize_code(code: str) -> str:
    """모든 특수기호 및 공백을 제거한 순수 숫자 문자열 반환"""
    return re.sub(r'[^0-9]', '', str(code or ''))

def get_hsk_details(hsk_query: str) -> Optional[Dict[str, Any]]:
    """SQLite DB에서 해당 HSK 코드의 마스터 정보, 관세율, 세관장확인 요건, 결정례를 일괄 조회합니다."""
    clean_code = normalize_code(hsk_query)
    if not clean_code:
        return None

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # 1. 마스터 정보 검색 (10단위 우선 -> 6단위 -> 4단위)
    master_row = None
    if len(clean_code) == 10:
        cursor.execute("SELECT hs_code, name_ko, name_en, hscode_length FROM hs_code_master WHERE hs_code = ? LIMIT 1", (clean_code,))
        master_row = cursor.fetchone()
    
    if not master_row and len(clean_code) >= 6:
        prefix6 = clean_code[:6]
        cursor.execute("SELECT hs_code, name_ko, name_en, hscode_length FROM hs_code_master WHERE hs_code LIKE ? ORDER BY hscode_length DESC LIMIT 1", (f"{prefix6}%",))
        master_row = cursor.fetchone()

    if not master_row:
        prefix4 = clean_code[:4]
        cursor.execute("SELECT hs_code, name_ko, name_en, hscode_length FROM hs_code_master WHERE hs_code LIKE ? ORDER BY hscode_length DESC LIMIT 1", (f"{prefix4}%",))
        master_row = cursor.fetchone()

    if not master_row:
        conn.close()
        return None

    actual_hsk = master_row["hs_code"]
    name_ko = master_row["name_ko"] or "수출입 지정 품목"
    name_en = master_row["name_en"] or ""
    formatted_code = format_hsk(actual_hsk)

    # 2. 관세율 검색 (기본세율, WTO, FTA 특혜세율)
    cursor.execute("""
        SELECT country_code, base_rate, wto_rate, fta_rate, fta_name, recommended_rate 
        FROM hs_rate_master 
        WHERE hs_code = ? OR hs_code = ?
    """, (actual_hsk, formatted_code))
    rate_rows = cursor.fetchall()

    base_rate = "8.0%"
    wto_rate = "8.0%"
    fta_list = []

    if rate_rows:
        first_r = rate_rows[0]
        if first_r["base_rate"] is not None:
            base_rate = f"{first_r['base_rate']}%"
        if first_r["wto_rate"] is not None:
            wto_rate = f"{first_r['wto_rate']}%"

        for r in rate_rows:
            if r["fta_name"] and r["fta_rate"] is not None:
                fta_list.append({
                    "name": r["fta_name"],
                    "rate": f"{r['fta_rate']}%",
                    "country": r["country_code"] or "FTA"
                })

    # 기본 주요 FTA 안내 보강
    if not fta_list:
        fta_list = [
            {"name": "한-중 FTA", "rate": "0% ~ 4.0%", "country": "CN"},
            {"name": "한-미 FTA", "rate": "0% (무관세)", "country": "US"},
            {"name": "한-EU FTA", "rate": "0% (원산지신고문안 필수)", "country": "EU"},
            {"name": "한-아세안 FTA", "rate": "0% (Form AK)", "country": "ASEAN"}
        ]

    # 3. 세관장확인 수입요건 검색
    cursor.execute("""
        SELECT law_name, agency_name, check_type, description 
        FROM hs_requirements 
        WHERE hs_code = ? OR hs_code = ? OR hs_code LIKE ?
    """, (actual_hsk, formatted_code, f"{clean_code[:4]}%"))
    req_rows = cursor.fetchall()
    requirements = []
    for r in req_rows:
        requirements.append({
            "law_name": r["law_name"],
            "agency_name": r["agency_name"],
            "check_type": r["check_type"],
            "description": r["description"]
        })

    # 4. 실존 관세평가분류원 결정례 검색 (해당 세번 관련)
    cursor.execute("""
        SELECT case_number, product_name, decision_reason, issuing_body, date 
        FROM customs_precedents 
        WHERE hs_code LIKE ? OR hs_code LIKE ?
        ORDER BY id DESC LIMIT 2
    """, (f"%{clean_code[:4]}%", f"%{actual_hsk}%"))
    precedent_rows = cursor.fetchall()
    precedents = []
    for p in precedent_rows:
        precedents.append({
            "case_number": p["case_number"],
            "product_name": p["product_name"],
            "decision_reason": p["decision_reason"][:300] + "..." if p["decision_reason"] and len(p["decision_reason"]) > 300 else p["decision_reason"],
            "issuing_body": p["issuing_body"] or "관세평가분류원",
            "date": p["date"] or "공식결정례"
        })

    # 5. WCO 해설서 (호 기준)
    heading_4 = actual_hsk[:4]
    cursor.execute("""
        SELECT content_ko FROM explanatory_notes 
        WHERE heading = ? OR heading LIKE ? LIMIT 1
    """, (heading_4, f"%{heading_4}%"))
    note_row = cursor.fetchone()
    wco_note = note_row["content_ko"][:400] + "..." if note_row and note_row["content_ko"] else ""

    conn.close()

    return {
        "hsk_raw": actual_hsk,
        "hsk_formatted": formatted_code,
        "name_ko": name_ko,
        "name_en": name_en,
        "base_rate": base_rate,
        "wto_rate": wto_rate,
        "fta_list": fta_list,
        "requirements": requirements,
        "precedents": precedents,
        "wco_note": wco_note,
        "heading_4": heading_4
    }

def render_hsk_page(hsk_query: str) -> str:
    """검색엔진 최적화(SEO)를 완벽히 충족하는 고대비 반응형 웹페이지 HTML을 반환합니다."""
    data = get_hsk_details(hsk_query)
    if not data:
        return render_404_page(hsk_query)

    title = f"HSK {data['hsk_formatted']} {data['name_ko']} 관세율·FTA·수입요건 총정리 | CUSWAY"
    meta_desc = f"대한민국 관세율표 HSK {data['hsk_formatted']} [{data['name_ko']}]의 기본세율({data['base_rate']}), WTO협정세율({data['wto_rate']}), 한-중/한-미 FTA 협정세율 및 세관장확인 수입 필수 법령, 관세평가분류원 실존 결정례 해설을 실시간으로 확인하세요."
    canonical_url = f"https://cusway.kr/hs/{data['hsk_raw']}"

    # 요건 HTML 조합
    req_html = ""
    if data["requirements"]:
        for req in data["requirements"]:
            req_html += f"""
            <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-left: 5px solid #0284c7; padding: 18px 20px; border-radius: 10px; margin-bottom: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 800; font-size: 1.05rem; color: #0f172a;">⚖️ {html.escape(req['law_name'] or '세관장확인대상법령')}</span>
                    <span style="background: #e0f2fe; color: #0369a1; font-size: 0.8rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">{html.escape(req['agency_name'] or '세관인증기관')}</span>
                </div>
                <p style="margin: 0; font-size: 0.92rem; color: #475569; line-height: 1.6;">{html.escape(req['description'] or req['check_type'] or '수입신고 전 요건확인서(또는 면제확인서) 전산 연계 필수.')}</p>
            </div>
            """
    else:
        req_html = """
        <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; padding: 18px 20px; border-radius: 10px; color: #475569; font-size: 0.95rem;">
            ✅ <strong>세관장확인 비대상 품목:</strong> 관세법 제226조에 따른 세관장확인 대상 법령이 지정되지 않아, 통상적인 일반 수입신고 절차로 신속 통관이 가능합니다. (단, 대외무역법상 원산지 표시 의무 준수 필요)
        </div>
        """

    # FTA 리스트 HTML 조합
    fta_html = ""
    for fta in data["fta_list"]:
        fta_html += f"""
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
            <span style="font-weight: 700; color: #1e293b;">🌐 {html.escape(fta['name'])}</span>
            <span style="font-weight: 800; color: #0284c7; font-size: 1.05rem;">{html.escape(fta['rate'])}</span>
        </div>
        """

    # 결정례 HTML 조합
    precedents_html = ""
    if data["precedents"]:
        for p in data["precedents"]:
            precedents_html += f"""
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <span style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">📜 결정례: {html.escape(p['case_number'])}</span>
                    <span style="font-size: 0.8rem; color: #64748b; font-weight: 600;">{html.escape(p['issuing_body'])} ({html.escape(p['date'])})</span>
                </div>
                <div style="font-weight: 700; color: #334155; margin-bottom: 6px; font-size: 0.92rem;">물품명: {html.escape(p['product_name'] or '신청물품')}</div>
                <div style="font-size: 0.9rem; color: #475569; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 3px solid #64748b;">
                    {html.escape(p['decision_reason'] or '통칙 제1호 및 제6호에 의거한 본질적 특성 기준 분류')}
                </div>
            </div>
            """

    wco_box = ""
    if data["wco_note"]:
        wco_box = f"""
        <div style="background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 18px 20px; border-radius: 8px; margin-top: 16px;">
            <div style="font-weight: 800; color: #1e3a8a; margin-bottom: 6px; font-size: 0.95rem;">📖 WCO 세계관세기구 해설서 (제{data['heading_4']}호 공식 법리)</div>
            <p style="margin: 0; font-size: 0.9rem; color: #334155; line-height: 1.65;">{html.escape(data['wco_note'])}</p>
        </div>
        """

    full_html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{html.escape(title)}</title>
    <meta name="description" content="{html.escape(meta_desc)}">
    <meta name="keywords" content="HSK {data['hsk_formatted']}, {html.escape(data['name_ko'])}, 관세율, FTA협정세율, 세관장확인, 수입요건, 품목분류, WCO해설서, CUSWAY">
    <link rel="canonical" href="{canonical_url}">
    
    <!-- Open Graph (SNS 공유) -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="{html.escape(title)}">
    <meta property="og:description" content="{html.escape(meta_desc)}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:site_name" content="CUSWAY - AI 관세 통관 코파일럿">
    <meta property="og:locale" content="ko_KR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{html.escape(title)}">
    <meta name="twitter:description" content="{html.escape(meta_desc)}">

    <!-- Schema.org JSON-LD (검색엔진 구조화 데이터) -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "{html.escape(title)}",
      "description": "{html.escape(meta_desc)}",
      "url": "{canonical_url}",
      "author": {{
        "@type": "Organization",
        "name": "CUSWAY",
        "url": "https://cusway.kr"
      }},
      "publisher": {{
        "@type": "Organization",
        "name": "CUSWAY 관세평가원 AI 연구팀",
        "logo": {{
          "@type": "ImageObject",
          "url": "https://cusway.kr/logo.png"
        }}
      }},
      "mainEntityOfPage": "{canonical_url}",
      "about": [
        {{
          "@type": "Thing",
          "name": "{html.escape(data['name_ko'])}"
        }},
        {{
          "@type": "Thing",
          "name": "HS Code {data['hsk_formatted']}"
        }}
      ]
    }}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
            background-color: #f8fafc;
            color: #0f172a;
            line-height: 1.6;
        }}
        .container {{
            max-width: 960px;
            margin: 0 auto;
            padding: 30px 20px 80px 20px;
        }}
        .header-bar {{
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            padding: 16px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        .brand {{
            font-size: 1.4rem;
            font-weight: 900;
            color: #0284c7;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .brand-badge {{
            font-size: 0.75rem;
            font-weight: 700;
            background: #e0f2fe;
            color: #0284c7;
            padding: 2px 8px;
            border-radius: 9999px;
        }}
        .nav-btn {{
            background: #0284c7;
            color: #ffffff;
            text-decoration: none;
            padding: 8px 18px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.9rem;
            transition: all 0.2s ease;
        }}
        .nav-btn:hover {{
            background: #0369a1;
            transform: translateY(-1px);
        }}
        .card {{
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 28px;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
        }}
        .badge-code {{
            display: inline-block;
            background: #0284c7;
            color: #ffffff;
            font-weight: 900;
            font-size: 1.3rem;
            padding: 4px 14px;
            border-radius: 8px;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }}
        .item-title {{
            font-size: 1.8rem;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
        }}
        .item-subtitle {{
            font-size: 1.05rem;
            color: #64748b;
            font-weight: 500;
            margin-bottom: 20px;
        }}
        .grid-2 {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }}
        @media (max-width: 768px) {{
            .grid-2 {{ grid-template-columns: 1fr; }}
            .item-title {{ font-size: 1.45rem; }}
        }}
        .rate-box {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
        }}
        .rate-box .label {{
            font-size: 0.85rem;
            font-weight: 700;
            color: #64748b;
            margin-bottom: 4px;
        }}
        .rate-box .value {{
            font-size: 1.6rem;
            font-weight: 900;
            color: #0f172a;
        }}
        .section-heading {{
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        .cta-banner {{
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: #ffffff;
            border-radius: 16px;
            padding: 32px 28px;
            text-align: center;
            box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.3);
            margin-top: 36px;
        }}
        .cta-btn {{
            display: inline-block;
            background: #ffffff;
            color: #0284c7;
            font-weight: 900;
            font-size: 1.1rem;
            padding: 14px 32px;
            border-radius: 10px;
            text-decoration: none;
            margin-top: 18px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        }}
        .cta-btn:hover {{
            background: #f0f9ff;
            transform: scale(1.02);
        }}
    </style>
</head>
<body>

    <header class="header-bar">
        <a href="https://cusway.kr" class="brand">
            ⚡ CUSWAY <span class="brand-badge">관세·통관 인텔리전스</span>
        </a>
        <a href="https://cusway.kr" class="nav-btn">통관 리포트 무료 발급 →</a>
    </header>

    <div class="container">
        
        <!-- 품목 개요 카드 -->
        <div class="card">
            <span class="badge-code">HSK {data['hsk_formatted']}</span>
            <h1 class="item-title">{html.escape(data['name_ko'])}</h1>
            <div class="item-subtitle">{html.escape(data['name_en'])}</div>

            <!-- 관세율 비교 그리드 -->
            <div style="margin-top: 24px;">
                <div class="section-heading">📊 관세율표 (기본·WTO·협정세율 비교)</div>
                <div class="grid-2" style="margin-bottom: 16px;">
                    <div class="rate-box">
                        <div class="label">기본관세율 (A)</div>
                        <div class="value">{data['base_rate']}</div>
                    </div>
                    <div class="rate-box">
                        <div class="label">WTO 협정세율 (C)</div>
                        <div class="value" style="color: #0284c7;">{data['wto_rate']}</div>
                    </div>
                </div>

                <div style="margin-top: 16px;">
                    <div style="font-weight: 700; color: #475569; font-size: 0.95rem; margin-bottom: 8px;">🌍 주요 FTA 원산지증명서(C/O) 특혜세율</div>
                    {fta_html}
                </div>
            </div>
        </div>

        <!-- 세관장확인 수입 필수 요건 -->
        <div class="card">
            <div class="section-heading">🛡️ 세관장확인 수입 필수 요건 (통관 허가 법령)</div>
            <p style="font-size: 0.92rem; color: #64748b; margin-bottom: 16px;">
                관세법 제226조에 따라 유니패스(UNI-PASS) 수입신고 전 아래 요건확인서 발급 및 전산연계가 완료되어야 통관 보류를 예방할 수 있습니다.
            </p>
            {req_html}
        </div>

        <!-- 관세평가분류원 실존 결정례 & WCO 법리 -->
        <div class="card">
            <div class="section-heading">⚖️ 관세평가분류원 공식 결정례 및 WCO 분류 법리</div>
            <p style="font-size: 0.92rem; color: #64748b; margin-bottom: 16px;">
                관세율표 해석에 관한 일반통칙(GRI) 제1호 및 제6호에 근거한 실무 판례 요약입니다.
            </p>
            {precedents_html}
            {wco_box}
        </div>

        <!-- 하단 강력한 CTA 배너 -->
        <div class="cta-banner">
            <h2 style="font-size: 1.6rem; font-weight: 900; margin-bottom: 8px;">이 품목으로 화주 제출용 A4 통관 리포트가 필요하신가요?</h2>
            <p style="font-size: 1.05rem; opacity: 0.9; max-width: 650px; margin: 0 auto; line-height: 1.6;">
                CUSWAY AI 코파일럿에서 3초 만에 4단계 세무·법리 소명서와 회사 로고가 인쇄된 정식 A4 PDF 리포트를 30일간 무료로 무제한 출력하세요.
            </p>
            <a href="https://cusway.kr" class="cta-btn">🚀 30일 무료 체험으로 전체 리포트 출력하기</a>
        </div>

    </div>

</body>
</html>"""
    return full_html

def render_404_page(hsk_query: str) -> str:
    """존재하지 않거나 검색 실패 시 안내 페이지"""
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>HS코드를 찾을 수 없습니다 | CUSWAY</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, sans-serif; text-align: center; padding: 80px 20px; background: #f8fafc; color: #0f172a; }}
        h1 {{ font-size: 2rem; margin-bottom: 12px; }}
        p {{ color: #64748b; margin-bottom: 24px; }}
        a {{ display: inline-block; background: #0284c7; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; }}
    </style>
</head>
<body>
    <h1>🔍 HS코드 정보를 찾을 수 없습니다 ({html.escape(hsk_query)})</h1>
    <p>입력하신 HSK 세번이 대한민국 관세율표 마스터 DB에 등록되어 있지 않거나 형식 오류입니다.</p>
    <a href="https://cusway.kr">CUSWAY 메인 검색으로 이동 →</a>
</body>
</html>"""

def generate_sitemap_xml(limit: int = 1500) -> str:
    """구글/네이버 검색엔진 등록용 XML 사이트맵을 동적 생성합니다."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # 10단위 세번 중 주요 1,500건 추출
    cursor.execute("""
        SELECT hs_code FROM hs_code_master 
        WHERE hscode_length = 10 
        ORDER BY hs_code ASC LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        '    <loc>https://cusway.kr/</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>'
    ]

    for r in rows:
        code = r[0]
        xml_lines.append('  <url>')
        xml_lines.append(f'    <loc>https://cusway.kr/hs/{code}</loc>')
        xml_lines.append('    <changefreq>weekly</changefreq>')
        xml_lines.append('    <priority>0.8</priority>')
        xml_lines.append('  </url>')

    xml_lines.append('</urlset>')
    return "\n".join(xml_lines)

def generate_robots_txt() -> str:
    """검색엔진 로봇용 robots.txt 내용 반환"""
    return """User-agent: *
Allow: /
Allow: /hs/
Allow: /sitemap.xml

Sitemap: https://cusway.kr/sitemap.xml
"""
