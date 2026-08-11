import { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { DeclarationData } from '../App';

interface KakaoSenderProps {
  analyzedData: DeclarationData | null;
  onSendComplete: (phone: string) => void;
}

export default function KakaoSender({ analyzedData, onSendComplete }: KakaoSenderProps) {
  const [phone, setPhone] = useState('010-5813-2026');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!phone.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      onSendComplete(phone.trim());
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>
          환급 안내 알림톡 시뮬레이터 (KakaoSender)
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          사후 세액 검증 결과 과다납부(환급 대상)로 식별된 소상공인 수입자에게 카카오 알림톡을 발송하여 환급 신청을 유도합니다.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px'
      }}>
        
        {/* Send Setup Panel */}
        <section className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--accent-primary)" />
            수신인 및 메시지 구성
          </h3>

          {!analyzedData ? (
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} />
              <span>검증 엔진에서 분석 완료된 데이터가 없습니다. 기본 테스트 메시지가 발송됩니다.</span>
            </div>
          ) : (
            <div style={{
              background: 'rgba(20, 184, 166, 0.05)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(20, 184, 166, 0.15)',
              color: 'var(--accent-primary)',
              fontSize: '0.85rem'
            }}>
              <strong>대상 수입자:</strong> {analyzedData.importer} <br />
              <strong>예상 관세 환급액:</strong> ₩{analyzedData.refundAmount.toLocaleString()}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>수신 전화번호</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
                placeholder="010-0000-0000"
              />
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={sending || sent}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: '#FEE500',
              color: '#191919',
              fontWeight: 700,
              cursor: (sending || sent) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
            {sending ? (
              <>알림톡 전송 중...</>
            ) : sent ? (
              <>
                <CheckCircle size={16} />
                알림톡 전송 성공!
              </>
            ) : (
              <>
                <Send size={16} />
                카카오 알림톡 발송하기
              </>
            )}
          </button>
        </section>

        {/* Message Preview Mobile Screen Simulator */}
        <section className="glass-panel" style={{
          padding: '20px',
          background: '#B2C7DA',
          borderRadius: '24px',
          border: '12px solid #334155',
          height: '450px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          {/* Mobile Status Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#334155', marginBottom: '12px', fontWeight: 600 }}>
            <span>BDS AI 채널</span>
            <span>10:02 AM</span>
          </div>

          {/* Chat Bubble */}
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            borderTopLeftRadius: 0,
            padding: '14px',
            fontSize: '0.8rem',
            color: '#1e293b',
            lineHeight: '1.5',
            position: 'relative',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', display: 'block', marginBottom: '6px' }}>
              [BDS 관세 환급 지원금 알림]
            </span>
            안녕하세요 사장님! 기 세관에 납부하신 수입 관세 사후 검증 결과, 최적 협정세율 미적용에 따른 과다납부 환급 대상금액이 식별되었습니다. <br /><br />
            <strong>환급대상금액:</strong> ₩{analyzedData ? analyzedData.refundAmount.toLocaleString() : '2,979,600'}원 <br />
            <strong>수입신고번호:</strong> {analyzedData ? analyzedData.declarationNo : '14302-26-1020261'} <br /><br />
            아래 환급 신청하기를 눌러 간편하게 세액 경정청구를 신청하세요.
          </div>
        </section>

      </div>
    </div>
  );
}
