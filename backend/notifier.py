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
    admin_recipient = os.environ.get("ADMIN_NOTIFICATION_EMAIL", smtp_user or "pjh@onestopcustoms.com")

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
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8;">원스탑 관세사 AI 플랫폼에 새로운 회원이 등록되었습니다.</p>
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
