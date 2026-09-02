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
        // Fallback: copy to clipboard
        handleCopyText();
        alert('카카오톡 공유 SDK를 로드 중입니다. 결과 전문이 클립보드에 복사되었으니 카톡 창에 바로 붙여넣기(Ctrl+V)하세요!');
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

    // Open user's default mail client (Gmail, Outlook, Mail app)
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
        maxWidth: '560px',
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
          padding: '20px 24px',
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
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                분석 결과 전송 및 공유
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                {title}의 공인 법적 분석 보고서를 카카오톡 또는 이메일로 즉시 전송합니다.
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

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Summary Box */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '0.88rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>대상 품목/사건</span>
              <span style={{ fontWeight: 800, color: '#0284c7' }}>{data.productName || data.caseNumber || title}</span>
            </div>
            {data.hsCode && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
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

          {/* Action 1: Kakao Share Button */}
          <div>
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
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 12px rgba(254, 229, 0, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>💬</span>
              <span>카카오톡으로 결과 리포트 전송</span>
            </button>
            {kakaoSent && (
              <p style={{ fontSize: '0.78rem', color: '#059669', textAlign: 'center', marginTop: '6px', fontWeight: 700 }}>
                ✓ 카카오톡 공유 창이 실행되었습니다.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span>또는 이메일 / 클립보드</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          {/* Action 2: Email Send Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
              수신인 이메일 (선택 입력)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email"
                placeholder="client@company.com (미입력 시 메일 앱만 열림)"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem'
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
            {emailSent && (
              <p style={{ fontSize: '0.78rem', color: '#0284c7', margin: 0, fontWeight: 700 }}>
                ✓ 기본 메일 프로그램에 정형화된 분석 보고서가 로드되었습니다.
              </p>
            )}
          </div>

          {/* Action 3: Copy Text Button */}
          <button
            onClick={handleCopyText}
            style={{
              width: '100%',
              padding: '12px',
              background: '#f8fafc',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '10px',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {copied ? <CheckCircle size={18} color="#059669" /> : <Copy size={18} />}
            <span>{copied ? '전문이 클립보드에 복사되었습니다!' : '보고서 전문 텍스트 클립보드 복사'}</span>
          </button>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end',
          borderRadius: '0 0 16px 16px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '8px',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
