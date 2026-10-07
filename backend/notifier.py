import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import threading

def _send_email_task(user_email: str, company_name: str, user_type: str, years: int, weight: float, phone_number: str = ""):
    smtp_host = os.environ.get("SMTP_HOST", "smtp.naver.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 465))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    admin_recipient = os.environ.get("ADMIN_NOTIFICATION_EMAIL", smtp_user or "admin@cusway.kr")

    user_type_ko = {
        "broker": "관세사 / 전문가",
        "practitioner": "수출입 기업 실무자",
        "general_user": "일반 이용자"
    }.get(user_type, "일반 이용자")

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    subject = f"[CUSWAY 신규가입] {company_name} ({user_type_ko})님이 가입하셨습니다."
    
    phone_display = phone_number if phone_number else "미등록 (소셜 간편가입)"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; background-color: #f8fafc; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; color: #ffffff; }}
        .header h2 {{ margin: 0; font-size: 20px; color: #14b8a6; }}
        .content {{ padding: 24px; color: #334155; line-height: 1.6; }}
        .info-table {{ width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 20px; }}
        .info-table th, .info-table td {{ padding: 12px; border-bottom: 1px solid #f1f5f9; text-align: left; font-size: 14px; }}
        .info-table th {{ background: #f8fafc; color: #64748b; width: 30%; }}
        .badge {{ display: inline-block; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 12px; background: #ccfbf1; color: #0f766e; }}
        .footer {{ background: #f8fafc; padding: 16px 24px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 CUSWAY 신규 회원 가입 알림</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">CUSWAY AI 관세 통합 플랫폼에 새로운 회원이 등록되었습니다.</p>
        </div>
        <div class="content">
          <p style="font-size: 15px; font-weight: 600; color: #0f172a;">새로운 회원의 상세 정보는 다음과 같습니다:</p>
          <table class="info-table">
            <tr>
              <th>가입 일시</th>
              <td>{now_str}</td>
            </tr>
            <tr>
              <th>회사/법인명</th>
              <td><strong>{company_name}</strong></td>
            </tr>
            <tr>
              <th>계정 이메일</th>
              <td><a href="mailto:{user_email}" style="color: #0284c7; text-decoration: none;">{user_email}</a></td>
            </tr>
            <tr>
              <th>연락처 (전화번호)</th>
              <td><strong style="color: #0d9488;">{phone_display}</strong></td>
            </tr>
            <tr>
              <th>회원 구분</th>
              <td><span class="badge">{user_type_ko}</span></td>
            </tr>
            <tr>
              <th>실무 경력</th>
              <td>{years}년차</td>
            </tr>
            <tr>
              <th>부여 가중치</th>
              <td><strong>{weight:.1f} 점</strong></td>
            </tr>
          </table>
          <p style="font-size: 13px; color: #64748b;">
            관리자 포털의 <strong>[고객 디렉토리]</strong>에서 회원의 연락처를 확인하고 1:1 상담 및 권한 관리를 수행하실 수 있습니다.
          </p>
        </div>
        <div class="footer">
          본 메일은 CUSWAY 관세 Copilot 시스템에서 자동으로 발송되었습니다.
        </div>
      </div>
    </body>
    </html>
    """

    print(f"[NEW_USER_NOTIFICATION] New registration: {company_name} ({user_email}, tel: {phone_display}, {user_type_ko}, {years}yrs, weight {weight}) at {now_str}")

    if not smtp_user or smtp_user == "YOUR_EMAIL@naver.com" or not smtp_password:
        print("[NEW_USER_NOTIFICATION] SMTP credentials not set in .env. Notification logged to system console.")
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = admin_recipient
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=10)
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, [admin_recipient], msg.as_string())
        server.quit()
        print(f"[NEW_USER_NOTIFICATION] Notification email successfully sent to {admin_recipient}")
    except Exception as e:
        print(f"[NEW_USER_NOTIFICATION_ERROR] Failed to send email via SMTP: {e}")

def notify_new_user_registration(user_email: str, company_name: str, user_type: str = "general_user", years: int = 0, weight: float = 1.0, phone_number: str = ""):
    """
    Non-blocking async notification trigger.
    Runs in a detached daemon thread to prevent blocking client signup response.
    """
    t = threading.Thread(
        target=_send_email_task,
        args=(user_email, company_name, user_type, years, weight, phone_number),
        daemon=True
    )
    t.start()

def send_customs_report_email(
    recipient_email: str,
    title: str,
    category: str,
    data: dict,
    sender_name: str = "CUSWAY AI 관세 코파일럿",
    cc_self: bool = False,
    sender_email: str = ""
) -> tuple:
    """
    Universal customs report direct email delivery via SMTP.
    Delivers executive-grade HTML report directly to the recipient's inbox.
    Returns (success: bool, message: str).
    """
    smtp_host = os.environ.get("SMTP_HOST", "smtp.naver.com")
    smtp_port = int(os.environ.get("SMTP_PORT", 465))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    if not smtp_user or not smtp_password:
        return False, "서버의 발신용 이메일 계정(SMTP)이 아직 설정되지 않았습니다. .env 환경설정을 확인해 주세요."

    clean_to = recipient_email.strip()
    if not clean_to or "@" not in clean_to:
        return False, "유효한 수신자 이메일 주소를 입력해 주세요."

    prod_name = data.get("productName") or title or "수입신고 대상 물품"
    hs_code = data.get("hsCode") or "-"
    duty_rate = data.get("dutyRate") or "2026 관세율표 연동"
    fta_rate = data.get("ftaRate") or "협정세율 최적적용"
    requirements = data.get("requirements") or "해당 물품 세관장확인 수입요건 법령 검토 완료"
    legal_reasoning = data.get("legalReasoning") or "관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 법리적으로 확정 분류함."
    case_number = data.get("caseNumber") or ""
    holding_ko = data.get("holdingKo") or ""

    now_str = datetime.now().strftime("%Y년 %m월 %d일 %H:%M")
    subject = f"[CUSWAY 공인 관세 리포트] {prod_name} - AI 품목분류 및 통관 소명의견서"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif; background-color: #0f172a; padding: 24px; margin: 0; color: #334155; }}
        .email-card {{ max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%); padding: 30px 28px; color: #ffffff; border-bottom: 3px solid #0284c7; }}
        .brand-badge {{ display: inline-block; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; border: 1px solid rgba(56, 189, 248, 0.3); margin-bottom: 10px; }}
        .title {{ margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; line-height: 1.35; }}
        .subtitle {{ margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; }}
        .content {{ padding: 28px; background: #ffffff; line-height: 1.6; font-size: 14px; }}
        .summary-box {{ background: #f8fafc; border-radius: 10px; border: 1.5px solid #e2e8f0; padding: 18px; margin-bottom: 22px; }}
        .row {{ display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }}
        .row:last-child {{ border-bottom: none; }}
        .label {{ color: #64748b; font-weight: 600; min-width: 110px; }}
        .val {{ color: #0f172a; font-weight: 700; text-align: right; }}
        .val-code {{ font-family: Consolas, monospace; color: #0284c7; font-size: 16px; font-weight: 800; }}
        .val-highlight {{ color: #059669; font-weight: 800; }}
        .section-title {{ font-size: 15px; font-weight: 800; color: #0f172a; margin: 24px 0 10px 0; display: flex; align-items: center; gap: 6px; }}
        .box {{ background: #f1f5f9; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #334155; white-space: pre-wrap; line-height: 1.65; }}
        .req-box {{ background: #fffbeb; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #92400e; white-space: pre-wrap; line-height: 1.65; }}
        .cta-wrap {{ text-align: center; margin: 30px 0 10px 0; }}
        .cta-btn {{ display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 800; font-size: 15px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35); }}
        .footer {{ background: #f8fafc; padding: 20px 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.5; }}
      </style>
    </head>
    <body>
      <div class="email-card">
        <div class="header">
          <div class="brand-badge">CUSWAY AI CUSTOMS INTELLIGENCE</div>
          <h1 class="title">공인 AI 관세 품목분류 & 통관 사전진단서</h1>
          <p class="subtitle">발행 일시: {now_str} &nbsp;|&nbsp; 발신: {sender_name}</p>
        </div>
        <div class="content">
          <p style="margin-top: 0; font-size: 14px; color: #475569;">
            안녕하세요, <strong>CUSWAY</strong>에서 발행된 공인 AI 관세 분석 결과서를 안내해 드립니다.
          </p>

          <div class="summary-box">
            <div class="row">
              <span class="label">대상 품목명</span>
              <span class="val">{prod_name}</span>
            </div>
            <div class="row">
              <span class="label">추천 세번(HSK)</span>
              <span class="val val-code">{hs_code}</span>
            </div>
            <div class="row">
              <span class="label">2026 기본세율</span>
              <span class="val">{duty_rate}</span>
            </div>
            <div class="row">
              <span class="label">적용 최적 협정세율</span>
              <span class="val val-highlight">{fta_rate}</span>
            </div>
          </div>

          <div class="section-title">⚖️ 관세율표 일반통칙 및 법적 분류 근거</div>
          <div class="box">{legal_reasoning}</div>

          <div class="section-title">📋 세관장확인 필수 수입요건</div>
          <div class="req-box">{requirements}</div>

          {f'''
          <div class="section-title">🏛️ 조세심판원/관세평가 결정례 요지</div>
          <div class="box"><strong>사건번호: {case_number}</strong><br>{holding_ko}</div>
          ''' if case_number or holding_ko else ''}

          <div class="cta-wrap">
            <a href="https://cusway.kr" target="_blank" class="cta-btn">
              👉 CUSWAY에서 4단계 전체 소명의견서(PDF) 확인하기
            </a>
          </div>
        </div>

        <div class="footer">
          <strong>(주)이레 CUSWAY 관세 AI 인텔리전스 사업부</strong><br>
          본 메일은 수신자의 요청 또는 업무 협조에 의해 발송되었습니다.<br>
          웹사이트: <a href="https://cusway.kr" style="color: #0284c7; text-decoration: none;">https://cusway.kr</a> &nbsp;|&nbsp; 문의: admin@cusway.kr
        </div>
      </div>
    </body>
    </html>
    """

    recipients = [clean_to]
    if cc_self and sender_email and "@" in sender_email and sender_email.strip() != clean_to:
        recipients.append(sender_email.strip())

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{sender_name} <{smtp_user}>"
        msg["To"] = clean_to
        if len(recipients) > 1:
            msg["Cc"] = sender_email.strip()
        msg.attach(MIMEText(html_content, "html", "utf-8"))

        if smtp_port == 465:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=12)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port, timeout=12)
            server.starttls()

        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, recipients, msg.as_string())
        server.quit()
        return True, f"수신자({clean_to})에게 분석 결과서가 성공적으로 발송되었습니다."
    except smtplib.SMTPAuthenticationError as auth_err:
        err_msg = f"SMTP 인증 실패 (535): {auth_err}. 네이버 메일 환경설정에서 [POP3/SMTP 사용함]을 켜고, 2단계 인증 시 [애플리케이션 비밀번호]를 발급받아야 합니다."
        print(f"[REPORT_EMAIL_AUTH_ERROR] {err_msg}")
        return False, err_msg
    except Exception as e:
        err_msg = f"이메일 전송 중 네트워크/서버 오류: {e}"
        print(f"[REPORT_EMAIL_ERROR] {err_msg}")
        return False, err_msg
