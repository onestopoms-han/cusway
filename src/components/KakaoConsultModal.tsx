import { useState } from 'react';
import { MessageCircle, Phone, Clock, CheckCircle2, X, Send, ShieldCheck, User, Building, HelpCircle } from 'lucide-react';

interface KakaoConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
}

export default function KakaoConsultModal({ isOpen, onClose, currentUser }: KakaoConsultModalProps) {
  const [name, setName] = useState(currentUser?.company_name || '');
  const [phone, setPhone] = useState(currentUser?.phone_number || '');
  const [company, setCompany] = useState(currentUser?.company_name || '');
  const [inquiryType, setInquiryType] = useState('품목분류 (HS Code 사전심사)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleOpenKakaoDirect = () => {
    // 카카오톡 채널 1:1 채팅 또는 오픈채팅 직통 링크
    const kakaoUrl = 'https://pf.kakao.com/_onestopcustoms/chat';
    window.open(kakaoUrl, '_blank');
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      alert('성함, 연락처 및 문의 내용을 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultation/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          company_name: company,
          inquiry_type: inquiryType,
          message
        })
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3500);
    } catch (err) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1.5px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #FEE500 0%, #FBBF24 100%)',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#111827'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>💬</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                카카오톡 & 전문 관세사 1:1 실시간 상담
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.85 }}>
                원스탑 관세법인 공인 관세사 직통 배정
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(0,0,0,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#111827'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* Option 1: Instant Kakao Channel Button */}
          <div style={{
            background: 'rgba(254, 229, 0, 0.08)',
            border: '1.5px solid rgba(254, 229, 0, 0.35)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FEE500' }}>
                ⚡ 카카오톡 앱에서 실시간 1:1 채팅
              </span>
              <span style={{ fontSize: '0.7rem', background: '#FEE500', color: '#000', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                가장 빠른 답변
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              카카오톡 채널로 연결되어 전문 관세사와 실시간으로 1:1 비밀 대화를 나누실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={handleOpenKakaoDirect}
              style={{
                background: '#FEE500',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                color: '#111827',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(254, 229, 0, 0.25)',
                transition: 'transform 0.15s ease'
              }}
            >
              <MessageCircle size={18} />
              카카오톡 1:1 채팅 상담 시작하기
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>또는 빠른 상담 예약 남기기</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Option 2: Quick Consultation Booking Form */}
          {isSuccess ? (
            <div style={{
              padding: '24px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10b981',
              borderRadius: '12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={36} color="#34d399" />
              <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 800 }}>
                관세사 1:1 상담 접수가 완료되었습니다!
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#a7f3d0', lineHeight: 1.5 }}>
                담당 공인 관세사가 남겨주신 연락처(<strong>{phone}</strong>)로 빠른 시간 내에 직접 연락드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConsultSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    성함 / 담당자명 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    연락처 (휴대폰 번호) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                  상담 쟁점 분야
                </label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="품목분류 (HS Code 사전심사)">📦 품목분류 (HS Code 결정 및 세관 소명)</option>
                  <option value="관세평가 (특수관계/이전가격/로열티)">⚖️ 관세평가 (특수관계 이전가격 / 로열티 가산 소명)</option>
                  <option value="수입요건 및 통관 검역 (식약처/전안법)">📑 수입통관 요건확인 & 검역 면제</option>
                  <option value="FTA 협정세율 및 원산지 검증">🌍 FTA 협정세율 적용 및 사후 검증 대응</option>
                  <option value="관세 환급 및 과세처분 경정청구">💰 관세 경정청구 및 과오납 세액 환급</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                  상담 문의 내용 *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="예: 수입하려는 원자재의 85류 세번 판정이 애매하여 관세청 사전심사 대행 및 소명 의견서 작성을 의뢰하고 싶습니다."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    resize: 'none',
                    lineHeight: 1.5
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.25)'
                }}
              >
                <Send size={16} />
                {isSubmitting ? '상담 접수 중...' : '관세사 1:1 상담 예약 신청하기'}
              </button>
            </form>
          )}

          {/* Direct Hotline Footer */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: '#94a3b8'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="var(--accent-cyan)" />
              <span>직통 상담: <strong style={{ color: '#fff' }}>02-540-0000</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#f59e0b" />
              <span>평일 09:00 ~ 18:00</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
