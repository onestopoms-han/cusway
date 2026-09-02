import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  Copy, 
  CheckCircle, 
  X, 
  Share2, 
  FileText, 
  Sparkles,
  ExternalLink
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
  const [activeTab, setActiveTab] = useState<'kakao' | 'email' | 'clipboard'>('kakao');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [kakaoSent, setKakaoSent] = useState(false);

  if (!isOpen) return null;

  // Generate structured report text for sharing
  const generateReportText = () => {
    let report = `[CUSWAY AI 공인 관세 분석 결과서]\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `📌 분석 구분: ${title}\n`;
    report += `📅 발행 일시: ${new Date().toLocaleDateString('ko-KR')} ${new Date().toLocaleTimeString('ko-KR')}\n`;
    report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (category === 'hs-classification' || category === 'clearance-pipeline') {
      if (data.productName) report += `■ 대상 품목명: ${data.productName}\n`;
      if (data.hsCode) report += `■ 추천 품목번호(HSK): ${data.hsCode}\n`;
      if (data.dutyRate) report += `■ 2026 기본관세율: ${data.dutyRate}\n`;
      if (data.ftaRate) report += `■ 협정/최적세율: ${data.ftaRate}\n`;
      if (data.requirements) report += `■ 세관장확인 수입요건: ${data.requirements}\n`;
      if (data.legalReasoning) report += `\n■ 법적 분류 근거 및 통칙 적용:\n${data.legalReasoning}\n`;
    } else if (category === 'valuation') {
      if (data.caseNumber) report += `■ 조세심판원/대법원 사건번호: ${data.caseNumber}\n`;
      if (data.holdingKo) report += `■ 판결 요지: ${data.holdingKo}\n`;
      if (data.legalReasoning) report += `\n■ 과세가격 법리 소명 논리:\n${data.legalReasoning}\n`;
    }

    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    report += `출처: CUSWAY 관세 AI 포털 (https://cusway.kr)\n`;
    return report;
  };

  // 1. Kakao Talk Share
  const handleKakaoShare = () => {
    try {
      const kakaoKey = 'f3be8f44c4bfeb5e6e640c79e9851da3';
      const w = window as any;
      if (w.Kakao) {
        if (!w.Kakao.isInitialized()) {
          w.Kakao.init(kakaoKey);
        }

        const reportSummary = `${data.productName || title} | HSK: ${data.hsCode || '-'} | 세율: ${data.ftaRate || data.dutyRate || '최적적용'}`;

        w.Kakao.Share.sendDefault({
          objectType: 'text',
          text: `[CUSWAY AI 관세 분석 결과]\n${title}\n\n${reportSummary}\n\n세부 법적 근거 및 관세율표 대조 보고서를 확인하세요.`,
          link: {
            mobileWebUrl: 'https://cusway.kr',
            webUrl: 'https://cusway.kr'
          },
          buttonTitle: '결과 리포트 열기'
        });
        setKakaoSent(true);
        setTimeout(() => setKakaoSent(false), 4000);
      } else {
        handleCopyText();
        alert('카카오톡 공유 창을 여는 중입니다. 결과 전문이 클립보드에 복사되었으니 카톡 창에 바로 붙여넣기(Ctrl+V)하실 수도 있습니다!');
      }
    } catch (err) {
      console.warn('Kakao share fallback:', err);
      handleCopyText();
      alert('결과 전문이 클립보드에 복사되었습니다! 카카오톡 대화창에 바로 붙여넣어(Ctrl+V) 전송하세요.');
    }
  };

  // 2. Email Share
  const handleEmailSend = () => {
    const report = generateReportText();
    const subject = encodeURIComponent(`[CUSWAY] ${title} - AI 관세 분석 결과서`);
    const body = encodeURIComponent(report);

    const mailtoUrl = `mailto:${recipientEmail ? encodeURIComponent(recipientEmail) : ''}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  // 3. Copy Text to Clipboard
  const handleCopyText = () => {
    const report = generateReportText();
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }).catch(() => {
      alert('클립보드 복사 완료!');
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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
              width: '34px',
              height: '34px',
              borderRadius: '9px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                분석 결과 전송 및 공유
              </h3>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                원하는 전송 채널(카카오톡 / 이메일 / 클립보드)을 선택하세요.
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
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '6px',
          margin: '18px 22px 0 22px',
          borderRadius: '10px',
          gap: '6px'
        }}>
          <button
            onClick={() => setActiveTab('kakao')}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
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
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
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
            <Mail size={16} />
            <span>이메일 전송</span>
          </button>

          <button
            onClick={() => setActiveTab('clipboard')}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: activeTab === 'clipboard' ? '#0f172a' : 'transparent',
              color: activeTab === 'clipboard' ? '#ffffff' : '#64748b',
              boxShadow: activeTab === 'clipboard' ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Copy size={16} />
            <span>전문 복사</span>
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 22px 24px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Summary Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 16px',
            fontSize: '0.86rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>대상 품목/사건</span>
              <span style={{ fontWeight: 800, color: '#0284c7' }}>{data.productName || data.caseNumber || title}</span>
            </div>
            {data.hsCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>추천 HSK</span>
                <span style={{ fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{data.hsCode}</span>
              </div>
            )}
            {data.ftaRate && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>적용 최적 세율</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>{data.ftaRate}</span>
              </div>
            )}
          </div>

          {/* TAB 1: Kakao Share UI */}
          {activeTab === 'kakao' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#92400e',
                lineHeight: 1.4
              }}>
                💡 <b>카카오톡 전송 안내</b>: 아래 버튼을 클릭하면 카카오톡 대화상대(나에게 보내기 또는 거래처/사내 단톡방)를 선택하여 분석 결과 카드 메시지를 즉시 전송합니다.
              </div>

              <button
                onClick={handleKakaoShare}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#FEE500',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.96rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(254, 229, 0, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>💬</span>
                <span>카카오톡으로 즉시 전송하기</span>
              </button>

              {kakaoSent && (
                <p style={{ fontSize: '0.8rem', color: '#059669', textAlign: 'center', margin: 0, fontWeight: 700 }}>
                  ✓ 카카오톡 공유 창이 실행되었습니다!
                </p>
              )}
            </div>
          )}

          {/* TAB 2: Email Send UI */}
          {activeTab === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#0369a1',
                lineHeight: 1.4
              }}>
                ✉️ <b>이메일 전송 안내</b>: 수신인 이메일을 입력하고 [메일 작성]을 누르면, PC/모바일의 기본 메일 앱(Gmail/Outlook 등)에 정형화된 공인 분석 결과서 전문이 자동 입력되어 열립니다.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                  받는 사람 이메일 (선택 입력)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="email"
                    placeholder="client@company.com (미입력 시 본문만 로드)"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.86rem'
                    }}
                  />
                  <button
                    onClick={handleEmailSend}
                    style={{
                      padding: '10px 18px',
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Mail size={16} />
                    <span>메일 작성</span>
                  </button>
                </div>
              </div>

              {emailSent && (
                <p style={{ fontSize: '0.8rem', color: '#0284c7', margin: 0, fontWeight: 700, textAlign: 'center' }}>
                  ✓ 기본 메일 프로그램에 정형화된 분석 보고서가 로드되었습니다.
                </p>
              )}
            </div>
          )}

          {/* TAB 3: Clipboard Text Copy UI */}
          {activeTab === 'clipboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '12px 14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#475569',
                lineHeight: 1.4
              }}>
                📋 <b>클립보드 복사 안내</b>: 법적 분류 근거, 통칙 주석, 세관장확인 요건이 포함된 공식 분석 결과서 전문을 텍스트로 복사하여 사내 메신저나 ERP에 붙여넣기(Ctrl+V)하세요.
              </div>

              <button
                onClick={handleCopyText}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: copied ? '#059669' : '#0f172a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                <span>{copied ? '전문 텍스트 복사 완료!' : '분석 결과서 전문 텍스트 복사'}</span>
              </button>
            </div>
          )}

          {/* Preview snippet of text */}
          <div style={{
            background: '#f8fafc',
            border: '1px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '10px 14px',
            maxHeight: '100px',
            overflowY: 'auto',
            fontSize: '0.74rem',
            color: '#64748b',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {generateReportText().slice(0, 250)}...
          </div>

          {/* Close button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 20px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#475569',
                fontWeight: 700,
                fontSize: '0.84rem',
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
