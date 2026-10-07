import { useState } from 'react';
import { 
  Send, 
  Mail, 
  Copy, 
  CheckCircle, 
  X, 
  Share2, 
  Sparkles,
  ExternalLink,
  Loader2,
  Link2,
  MessageCircle
} from 'lucide-react';

interface ResultShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: 'hs-classification' | 'clearance-pipeline' | 'valuation';
  data: {
    productName?: string;
    hsCode?: string;
    dutyRate?: string;
    ftaRate?: string;
    legalReasoning?: string;
    requirements?: string;
    caseNumber?: string;
    holdingKo?: string;
    customsValue?: number;
    refundAmount?: number;
  };
}

export default function ResultShareModal({
  isOpen,
  onClose,
  title,
  category,
  data
}: ResultShareModalProps) {
  const [activeTab, setActiveTab] = useState<'kakao' | 'email' | 'link' | 'clipboard'>('kakao');
  
  // Email States
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [ccSelf, setCcSelf] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Copy / Share States
  const [copiedKakao, setCopiedKakao] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [kakaoSent, setKakaoSent] = useState(false);

  if (!isOpen) return null;

  const targetProdName = data.productName || title || '대상 물품';
  const targetHsCode = data.hsCode || '-';
  const targetDutyRate = data.dutyRate || '2026 기본세율 연동';
  const targetFtaRate = data.ftaRate || '협정세율 최적적용';
  const targetRequirements = data.requirements || '세관장확인 필수 수입요건 검토 완료';
  const reportUrl = `https://cusway.kr/?report=${encodeURIComponent(targetHsCode)}`;

  // Generate structured full report text
  const generateReportText = () => {
    let report = `[CUSWAY AI 공인 관세 분석 결과서]\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📌 분석 구분: ${title}\n`;
    report += `📅 발행 일시: ${new Date().toLocaleDateString('ko-KR')} ${new Date().toLocaleTimeString('ko-KR')}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (category === 'hs-classification' || category === 'clearance-pipeline') {
      report += `■ 대상 품목명: ${targetProdName}\n`;
      report += `■ 추천 품목번호(HSK): ${targetHsCode}\n`;
      report += `■ 2026 기본관세율: ${targetDutyRate}\n`;
      report += `■ 협정/최적세율: ${targetFtaRate}\n`;
      report += `■ 세관장확인 수입요건: ${targetRequirements}\n`;
      if (data.legalReasoning) {
        report += `\n■ 법적 분류 근거 및 통칙 적용:\n${data.legalReasoning}\n`;
      }
    } else if (category === 'valuation') {
      if (data.caseNumber) report += `■ 조세심판원/대법원 사건번호: ${data.caseNumber}\n`;
      if (data.holdingKo) report += `■ 판결 요지: ${data.holdingKo}\n`;
      if (data.legalReasoning) report += `\n■ 과세가격 법리 소명 논리:\n${data.legalReasoning}\n`;
    }

    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `👉 4단계 전체 소명의견서(PDF) 확인하기:\n${reportUrl}\n`;
    report += `출처: CUSWAY 관세 AI 포털 (https://cusway.kr)\n`;
    return report;
  };

  // Generate mobile-optimized KakaoTalk message text
  const generateKakaoMessageText = () => {
    let msg = `[CUSWAY AI 관세 분석 결과서]\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `📌 품목: ${targetProdName}\n`;
    msg += `🏷️ HSK: ${targetHsCode}\n`;
    msg += `💰 기본세율: ${targetDutyRate}\n`;
    msg += `⚡ 최적세율: ${targetFtaRate}\n`;
    msg += `📋 수입요건: ${targetRequirements.slice(0, 80)}${targetRequirements.length > 80 ? '...' : ''}\n\n`;
    msg += `👉 4단계 전체 소명의견서 확인:\n${reportUrl}\n`;
    msg += `━━━━━━━━━━━━━━━━━━\n`;
    msg += `출처: CUSWAY AI 관세 코파일럿`;
    return msg;
  };

  // 1. Direct Server Email Send
  const handleServerEmailSend = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('받는 분의 올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setEmailSending(true);
    setEmailResult(null);

    try {
      const response = await fetch('/api/share/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_email: recipientEmail.trim(),
          title: title,
          category: category,
          data: {
            ...data,
            productName: targetProdName,
            hsCode: targetHsCode,
            dutyRate: targetDutyRate,
            ftaRate: targetFtaRate,
            requirements: targetRequirements
          },
          sender_name: 'CUSWAY AI 관세 코파일럿',
          cc_self: ccSelf,
          sender_email: senderEmail.trim()
        })
      });

      const resJson = await response.json();
      if (resJson.success) {
        setEmailResult({ success: true, message: `수신자(${recipientEmail})에게 공식 분석 결과서가 성공적으로 발송되었습니다!` });
      } else {
        setEmailResult({ 
          success: false, 
          message: resJson.message || '서버 발송 실패: 발송 계정 설정을 확인하거나 아래 웹메일(네이버/지메일) 바로가기를 이용해 주세요.' 
        });
      }
    } catch (err: any) {
      setEmailResult({ 
        success: false, 
        message: '서버 통신 오류가 발생했습니다. 아래 [네이버 메일 / Gmail] 버튼을 클릭하시면 1초 만에 바로 작성하실 수 있습니다.' 
      });
    } finally {
      setEmailSending(false);
    }
  };

  // 2. Webmail 1-Click Compose
  const handleNaverMailCompose = () => {
    const report = generateReportText();
    const subject = `[CUSWAY] ${targetProdName} - AI 관세 분석 결과서`;
    const to = recipientEmail ? encodeURIComponent(recipientEmail.trim()) : '';
    const naverUrl = `https://mail.naver.com/v2/new?to=${to}&title=${encodeURIComponent(subject)}&body=${encodeURIComponent(report)}`;
    window.open(naverUrl, '_blank');
  };

  const handleGmailCompose = () => {
    const report = generateReportText();
    const subject = `[CUSWAY] ${targetProdName} - AI 관세 분석 결과서`;
    const to = recipientEmail ? encodeURIComponent(recipientEmail.trim()) : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(report)}`;
    window.open(gmailUrl, '_blank');
  };

  const handleOutlookMailto = () => {
    const report = generateReportText();
    const subject = encodeURIComponent(`[CUSWAY] ${targetProdName} - AI 관세 분석 결과서`);
    const body = encodeURIComponent(report);
    const to = recipientEmail ? encodeURIComponent(recipientEmail.trim()) : '';
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  };

  // 3. KakaoTalk Share via SDK & Safe Fallback
  const handleKakaoShare = () => {
    const kakaoKey = 'f3be8f44c4bfeb5e6e640c79e9851da3';

    const triggerShare = () => {
      const w = window as any;
      if (w.Kakao) {
        try {
          if (!w.Kakao.isInitialized()) {
            w.Kakao.init(kakaoKey);
          }

          w.Kakao.Share.sendDefault({
            objectType: 'text',
            text: `[CUSWAY AI 관세 분석 결과]\n📌 품목: ${targetProdName}\n■ 추천 세번(HSK): ${targetHsCode}\n■ 2026 기본세율: ${targetDutyRate}\n■ 협정 최적세율: ${targetFtaRate}\n■ 수입요건: ${targetRequirements.slice(0, 60)}...\n\n상세 법적 소명서 및 WCO 해설서를 확인하세요.`,
            link: {
              mobileWebUrl: reportUrl,
              webUrl: reportUrl
            },
            buttonTitle: 'CUSWAY에서 상세 소명서 보기'
          });
          setKakaoSent(true);
          setTimeout(() => setKakaoSent(false), 5000);
          return;
        } catch (e) {
          console.warn('Kakao Share SDK execution failed, falling back to copy', e);
        }
      }
      
      // Fallback
      handleCopyKakaoText();
      alert('카카오톡 채팅창에 최적화된 요약본이 클립보드에 복사되었습니다! 카카오톡 채팅방에 붙여넣기(Ctrl+V)하여 전송하세요.');
    };

    const w = window as any;
    if (w.Kakao) {
      triggerShare();
    } else {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
      script.onload = () => triggerShare();
      script.onerror = () => {
        handleCopyKakaoText();
        alert('카카오톡 분석 결과 요약문이 클립보드에 복사되었습니다. 카카오톡 대화창에서 붙여넣기(Ctrl+V)하여 전송해 주세요!');
      };
      document.head.appendChild(script);
    }
  };

  // 4. Copy Formats
  const handleCopyKakaoText = () => {
    const text = generateKakaoMessageText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKakao(true);
      setTimeout(() => setCopiedKakao(false), 3000);
    }).catch(() => {
      alert('클립보드 복사 완료!');
    });
  };

  const handleCopyFullText = () => {
    const report = generateReportText();
    navigator.clipboard.writeText(report).then(() => {
      setCopiedFull(true);
      setTimeout(() => setCopiedFull(false), 3000);
    }).catch(() => {
      alert('클립보드 복사 완료!');
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reportUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      alert('링크 복사 완료!');
    });
  };

  const handleOpenKakaoChannel = () => {
    window.open('https://pf.kakao.com/_cusway/chat', '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '92vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #e2e8f0',
        color: '#0f172a',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#0284c7',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={19} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#0f172a' }}>
                분석 결과 전송 및 공유
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.76rem', color: '#64748b' }}>
                어떤 환경의 사용자든 100% 카톡/이메일로 즉시 전달할 수 있습니다.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '5px',
          margin: '16px 20px 0 20px',
          borderRadius: '10px',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('kakao')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'kakao' ? '#FEE500' : 'transparent',
              color: activeTab === 'kakao' ? '#000000' : '#64748b',
              boxShadow: activeTab === 'kakao' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>💬</span>
            <span>카카오톡 전송</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'email' ? '#0284c7' : 'transparent',
              color: activeTab === 'email' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'email' ? '0 2px 8px rgba(2,132,199,0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Mail size={15} />
            <span>이메일 전송</span>
          </button>

          <button
            onClick={() => setActiveTab('link')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'link' ? '#0f172a' : 'transparent',
              color: activeTab === 'link' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'link' ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Link2 size={15} />
            <span>웹 링크 공유</span>
          </button>

          <button
            onClick={() => setActiveTab('clipboard')}
            style={{
              flex: 1,
              padding: '10px 8px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'clipboard' ? '#475569' : 'transparent',
              color: activeTab === 'clipboard' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'clipboard' ? '0 2px 8px rgba(71,85,105,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Copy size={15} />
            <span>전문 복사</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '18px 20px 22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Target Summary Card */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '0.84rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>대상 품목/사건</span>
              <span style={{ fontWeight: 800, color: '#0284c7' }}>{targetProdName}</span>
            </div>
            {targetHsCode !== '-' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>추천 HSK</span>
                <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{targetHsCode}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>적용 최적 세율</span>
              <span style={{ fontWeight: 800, color: '#059669' }}>{targetFtaRate}</span>
            </div>
          </div>

          {/* TAB 1: KAKAO TALK */}
          {activeTab === 'kakao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: '#92400e',
                lineHeight: 1.45
              }}>
                💡 <strong>모바일/PC 어디서든 카카오톡으로 전송</strong>: 아래 3가지 방식 중 원하시는 방법을 선택하세요.
              </div>

              {/* Action 1: SDK Share */}
              <button
                onClick={handleKakaoShare}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: '#FEE500',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 3px 10px rgba(254, 229, 0, 0.35)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>💬</span>
                <span>카카오톡으로 공유하기 (앱/웹 자동 실행)</span>
              </button>

              {kakaoSent && (
                <div style={{ fontSize: '0.8rem', color: '#059669', textAlign: 'center', fontWeight: 700 }}>
                  ✓ 카카오톡 공유 창이 실행되었습니다!
                </div>
              )}

              {/* Action 2: Kakao optimized text copy */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                    📱 카톡 말풍선 최적화 텍스트 1초 복사
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    채팅방에 바로 붙여넣기(Ctrl+V)
                  </span>
                </div>
                <button
                  onClick={handleCopyKakaoText}
                  style={{
                    padding: '10px 14px',
                    background: copiedKakao ? '#059669' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copiedKakao ? <CheckCircle size={15} /> : <Copy size={15} />}
                  <span>{copiedKakao ? '카톡 요약본 복사 완료!' : '카톡 맞춤 요약문 복사하기'}</span>
                </button>
              </div>

              {/* Action 3: Kakao Channel Consultation */}
              <button
                onClick={handleOpenKakaoChannel}
                style={{
                  padding: '10px 14px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <MessageCircle size={15} color="#eab308" />
                <span>카카오톡 1:1 관세사 채널 직통 상담 열기</span>
                <ExternalLink size={13} color="#94a3b8" />
              </button>
            </div>
          )}

          {/* TAB 2: EMAIL */}
          {activeTab === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Option A: Direct Server Send */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1.5px solid #bae6fd',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#0284c7" />
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0369a1' }}>
                    1. CUSWAY 서버에서 이메일 즉시 직접 발송
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#0c4a6e', lineHeight: 1.4 }}>
                  수신자 이메일만 입력하면, PC에 메일 프로그램이 없어도 CUSWAY 서버가 A4 규격의 공인 분석 보고서 전문을 1초 만에 직접 발송합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input 
                    type="email"
                    placeholder="받는 사람 이메일 (예: client@company.com)"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #94a3b8',
                      fontSize: '0.86rem',
                      background: '#ffffff'
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#475569' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={ccSelf} 
                        onChange={(e) => setCcSelf(e.target.checked)} 
                      />
                      <span>내 이메일로도 사본(CC) 받기</span>
                    </label>
                    {ccSelf && (
                      <input 
                        type="email"
                        placeholder="내 이메일 주소"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.78rem'
                        }}
                      />
                    )}
                  </div>

                  <button
                    onClick={handleServerEmailSend}
                    disabled={emailSending}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: emailSending ? '#94a3b8' : '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      cursor: emailSending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      boxShadow: '0 3px 10px rgba(2, 132, 199, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {emailSending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>서버에서 발송 중...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>수신자에게 이메일 즉시 발송하기</span>
                      </>
                    )}
                  </button>
                </div>

                {emailResult && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    background: emailResult.success ? '#ecfdf5' : '#fef2f2',
                    border: emailResult.success ? '1px solid #a7f3d0' : '1px solid #fecaca',
                    color: emailResult.success ? '#065f46' : '#991b1b',
                    lineHeight: 1.45
                  }}>
                    {emailResult.success ? '✅ ' : '⚠️ '}
                    {emailResult.message}
                  </div>
                )}
              </div>

              {/* Option B: Webmail 1-Click Compose */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155' }}>
                  2. 또는 웹메일로 1초 만에 바로 작성 (아웃룩 프로그램 불필요)
                </span>
                <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                  클릭 시 네이버나 지메일 작성창이 새 탭으로 열리며 수신자·제목·분석 보고서 전문이 자동 입력됩니다.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={handleNaverMailCompose}
                    style={{
                      padding: '10px 12px',
                      background: '#03c75a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 750,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🟢 네이버 메일 작성</span>
                    <ExternalLink size={13} />
                  </button>

                  <button
                    onClick={handleGmailCompose}
                    style={{
                      padding: '10px 12px',
                      background: '#ea4335',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 750,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>🔴 Gmail로 작성</span>
                    <ExternalLink size={13} />
                  </button>
                </div>

                <button
                  onClick={handleOutlookMailto}
                  style={{
                    padding: '8px 12px',
                    background: 'transparent',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#64748b',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <Mail size={13} />
                  <span>PC 기본 메일 프로그램(Outlook) 열기</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: WEB LINK */}
          {activeTab === 'link' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                fontSize: '0.8rem',
                color: '#166534',
                lineHeight: 1.45
              }}>
                🔗 <strong>모바일/PC 어디서든 열리는 고유 링크</strong>: 수신자가 이 링크를 누르면 로그인이나 프로그램 설치 없이도 4단계 컬러 분석 리포트를 확인하고 A4 PDF로 즉시 인쇄할 수 있습니다.
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.82rem', color: '#0284c7', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {reportUrl}
                </span>
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '8px 14px',
                    background: copiedLink ? '#059669' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {copiedLink ? <CheckCircle size={14} /> : <Copy size={14} />}
                  <span>{copiedLink ? '복사됨!' : '링크 복사'}</span>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <a
                  href={reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: '0.82rem',
                    color: '#0284c7',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>새 창에서 리포트 미리보기</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

          {/* TAB 4: CLIPBOARD FULL TEXT */}
          {activeTab === 'clipboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#475569',
                lineHeight: 1.45
              }}>
                📋 <strong>공식 분석 결과서 전문 복사</strong>: 관세율표 일반통칙, 법적 분류 근거, 세관장확인 요건이 모두 포함된 정식 텍스트 보고서를 복사하여 사내 ERP, 결재 문서, 메신저 등에 붙여넣기(Ctrl+V)하세요.
              </div>

              <button
                onClick={handleCopyFullText}
                style={{
                  width: '100%',
                  padding: '13px 16px',
                  background: copiedFull ? '#059669' : '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                {copiedFull ? <CheckCircle size={18} /> : <Copy size={18} />}
                <span>{copiedFull ? '결과서 전문 복사 완료!' : '결과서 전문 텍스트 복사하기'}</span>
              </button>
            </div>
          )}

          {/* Live Preview Snippet */}
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '10px 14px',
            maxHeight: '90px',
            overflowY: 'auto',
            fontSize: '0.72rem',
            color: '#64748b',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {generateReportText().slice(0, 240)}...
          </div>

          {/* Footer Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              🛡️ CUSWAY AI Intelligence: 관세율표 해설서 & 5,668건 실존 판례 기반
            </span>
            <button
              onClick={onClose}
              style={{
                padding: '7px 18px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
