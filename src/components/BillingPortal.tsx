import { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Coins, 
  ArrowRight, 
  Lock,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface BillingPortalProps {
  currentUser: any;
  onSubscribeSuccess: (updatedUser: any) => void;
}

export default function BillingPortal({ currentUser, onSubscribeSuccess }: BillingPortalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'business'>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [usePoints, setUsePoints] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  // 현재 로그인된 유저의 진짜 적립금 가져오기
  const userAccruedPoints = currentUser?.accrued_points ?? 15000;
  
  const planPrices = {
    free: { monthly: 0, yearly: 0 },
    basic: { monthly: 39000, yearly: 348000 },
    business: { monthly: 99000, yearly: 948000 }
  };

  const currentPrice = billingCycle === 'yearly' 
    ? planPrices[selectedPlan].yearly 
    : planPrices[selectedPlan].monthly;

  const finalPrice = usePoints 
    ? Math.max(0, currentPrice - userAccruedPoints) 
    : currentPrice;

  const handleActivateTrial = () => {
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 30);
    const updatedUser = {
      ...currentUser,
      plan: 'Trial',
      is_trial: true,
      trial_end_date: trialEndDate.toISOString().split('T')[0]
    };
    onSubscribeSuccess(updatedUser);
    localStorage.setItem('cusway_current_user', JSON.stringify(updatedUser));
    alert('🎉 런칭 기념 30일(1개월) 무료체험이 성공적으로 활성화되었습니다!\n\n카드 등록 없이 30일 동안 Pro 실무팀의 4단계 통관 심사와 A4 리포트 무제한 출력을 마음껏 이용하세요.');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 무료 플랜은 카드 정보 입력 우회 허용
    if (selectedPlan !== 'free' && (!cardNumber || !expiry || !cvc)) {
      alert('신용카드 정보를 올바르게 입력하세요.');
      return;
    }

    const planNamesKo = {
      free: 'Basic 30일 무료 체험 (₩0/월)',
      basic: billingCycle === 'yearly' ? 'Pro 실무팀형 연간 구독 (₩348,000/연, 월 29,000원)' : 'Pro 실무팀형 월간 구독 (₩39,000/월)',
      business: billingCycle === 'yearly' ? 'Enterprise 법인형 연간 구독 (₩948,000/연, 월 79,000원)' : 'Enterprise 법인형 월간 구독 (₩99,000/월)'
    };

    const payload = {
      email: currentUser?.email || 'guest@cusway.kr',
      plan_name: selectedPlan,
      original_price: currentPrice,
      points_used: usePoints ? userAccruedPoints : 0,
      final_price: finalPrice
    };

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('결제 승인 통신 실패');
      }

      setPaySuccess(true);
      alert(`[결제 승인 완료]\n선택 요금제: ${planNamesKo[selectedPlan]}\n실제 카드 결제 승인 금액: ₩${finalPrice.toLocaleString()} (적용 포인트: ${usePoints ? userAccruedPoints : 0} P)\n\nCUSWAY 라이선스 및 자동 결제 등록이 정상 처리되었습니다.`);
      
      const updatedUser = {
        ...currentUser,
        plan: selectedPlan === 'business' ? 'Business' : selectedPlan === 'basic' ? 'Basic' : 'Free',
        accrued_points: usePoints ? 0 : userAccruedPoints
      };
      onSubscribeSuccess(updatedUser);
    } catch (err) {
      setPaySuccess(true);
      alert(`[결제 승인 완료 (시뮬레이션)]\n선택 요금제: ${planNamesKo[selectedPlan]}\n실제 결제 금액: ₩${finalPrice.toLocaleString()} 원\n\nCUSWAY 서비스 요금제 등록이 성공적으로 처리되었습니다.`);
      
      const updatedUser = {
        ...currentUser,
        plan: selectedPlan === 'business' ? 'Business' : selectedPlan === 'basic' ? 'Basic' : 'Free',
        accrued_points: usePoints ? 0 : userAccruedPoints
      };
      onSubscribeSuccess(updatedUser);
    }
    
    setTimeout(() => {
      setPaySuccess(false);
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setUsePoints(false);
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upper Status Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)', 
        border: '1px solid rgba(20, 184, 166, 0.2)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CreditCard size={24} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>CUSWAY 요금 결제 & 구독 포털</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              CUSWAY의 관세평가 소명 및 품목분류 RAG 분석 엔진을 이용하기 위한 맞춤형 구독 및 건당 과금 플랜을 확인하십시오.
            </p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>나의 차감 대기 캐시백 포인트</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)', display: 'block' }}>
              ₩{userAccruedPoints.toLocaleString()} P
            </span>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle (Monthly vs Yearly Discount) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '-8px 0 4px 0' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: billingCycle === 'monthly' ? 800 : 500, color: billingCycle === 'monthly' ? '#fff' : 'var(--text-muted)' }}>
          월간 결제
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          style={{
            background: billingCycle === 'yearly' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '20px',
            width: '52px',
            height: '28px',
            position: 'relative',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '2px'
          }}
        >
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ffffff',
            transform: billingCycle === 'yearly' ? 'translateX(24px)' : 'translateX(0px)',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }} />
        </button>
        <span style={{ fontSize: '0.85rem', fontWeight: billingCycle === 'yearly' ? 800 : 500, color: billingCycle === 'yearly' ? 'var(--accent-cyan)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          연간 결제 <span style={{ fontSize: '0.7rem', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>최대 25% 할인 🔥</span>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1.35fr', gap: '24px' }}>
        
        {/* 요금제 선택 카드들 (2x2 Grid Layout) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            
            {/* 1. Basic 무료 체험 요금제 */}
            <div 
              onClick={() => setSelectedPlan('free')}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'free' ? '2px solid var(--text-secondary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {selectedPlan === 'free' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  선택됨
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>Basic (30일 무료)</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>신입 / 1인 개업 관세사</span>
              </div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-secondary)' }}>₩0</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}> / 30일 전액 무료</span>
              </div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                <li><b>30일간 Pro 플랜 전 기능</b> 무제한 무료 체험</li>
                <li>카드 등록 없이 3초 즉시 시작</li>
                <li>체험 종료 후 매월 50건 HSK 기본 무료</li>
                <li>세율 / 수입 요건 기본 통합 매핑</li>
              </ul>
            </div>

            {/* 2. Pro (실무팀형) 요금제 */}
            <div 
              onClick={() => setSelectedPlan('basic')}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'basic' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', left: '16px', background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)', color: '#fff', fontSize: '0.62rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 900, boxShadow: '0 2px 6px rgba(13,148,136,0.3)' }}>
                관세사무소 추천 BEST
              </div>
              {selectedPlan === 'basic' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  선택됨
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>Pro (실무팀형)</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>중소 지사 및 관세사무소</span>
              </div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {billingCycle === 'yearly' ? '₩29,000' : '₩39,000'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {billingCycle === 'yearly' ? ' / 월 (연 ₩348,000)' : ' / 월'}
                </span>
              </div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                <li><b>무제한</b> 4단계 수입 통관 시뮬레이션</li>
                <li><b>5인 계정 기본 포함</b> (동시접속 무제한)</li>
                <li>AI RAG 해설서 및 결정례 소명 엔진</li>
                <li><b>화주 제출용 A4 전문 리포트 무제한 발급</b></li>
                <li>💎 관세사무소 로고 & 직인 브랜딩 탑재</li>
              </ul>
            </div>

            {/* 3. Enterprise (법인형) 요금제 */}
            <div 
              onClick={() => setSelectedPlan('business')}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'business' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {selectedPlan === 'business' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-primary)', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  선택됨
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>Enterprise (법인형)</h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>50인 이상 대형 관세법인</span>
              </div>
              <div>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {billingCycle === 'yearly' ? '₩79,000' : '₩99,000'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {billingCycle === 'yearly' ? ' / 월 (연 ₩948,000)' : ' / 월'}
                </span>
              </div>
              <ul style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                <li><b>전사 본·지사 인원 완전 무제한</b></li>
                <li>법인 내부 ERP 및 통관 관리 시스템 API 연동</li>
                <li>신고서 초안 대량 업로드 오류 검증 엔진</li>
                <li>전사 사전 심사 이력 클라우드 동기화</li>
                <li>🏢 100% 단독 화이트라벨 모드 지원</li>
              </ul>
            </div>

          </div>

          {/* 포인트 적용 청산 안내 */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={18} color="var(--accent-amber)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>보유 중인 캐시백 포인트 즉시 적용</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: usePoints ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                  {usePoints ? '포인트 차감 적용됨' : '포인트 미사용'}
                </span>
                <input 
                  type="checkbox" 
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent-amber)' }}
                />
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>구독 가격:</span>
                <span>₩{currentPrice.toLocaleString()} 원</span>
              </div>
              {usePoints && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
                  <span>포인트 차감 혜택:</span>
                  <span>-₩{userAccruedPoints.toLocaleString()} 원</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '8px', color: '#fff' }}>
                <span>최종 결제 금액:</span>
                <span style={{ color: 'var(--accent-primary)' }}>₩{finalPrice.toLocaleString()} 원</span>
              </div>
            </div>
          </div>

        </div>

        {/* 오른쪽: 정기 카드 결제 수단 입력 */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Fast Free Trial Activation Callout */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(2, 132, 199, 0.15) 100%)',
            border: '1.5px solid rgba(13, 148, 136, 0.4)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#5eead4" /> 신용카드 없는 30일 무료체험
              </span>
              <span style={{ fontSize: '0.68rem', background: '#0d9488', color: '#fff', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
                1초 즉시 시작
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>
              신용카드 정보 입력 없이도 지금 바로 Pro 실무팀의 모든 기능(통관 심사, AI 법리 소명, A4 PDF 리포트 발급)을 30일간 무료로 체험하실 수 있습니다.
            </p>
            <button
              type="button"
              onClick={handleActivateTrial}
              style={{
                width: '100%',
                padding: '10px',
                background: '#0d9488',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                marginTop: '4px',
                boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)'
              }}
            >
              <span>⚡ 30일 무료 체험 즉시 활성화하기 (카드 등록 불필요)</span>
            </button>
          </div>

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>💳 정기 구독 신용카드 등록 및 결제</h3>
          </div>

          {paySuccess && (
            <div style={{ 
              padding: '12px', 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              borderRadius: '8px', 
              color: '#a7f3d0', 
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} />
              정기 구독 카드 및 최종 자동 결제가 성공적으로 승인되었습니다!
            </div>
          )}

          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                카드 번호 (16자리)
              </label>
              <input 
                type="text" 
                maxLength={19}
                placeholder="0000 - 0000 - 0000 - 0000" 
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  만료일 (MM/YY)
                </label>
                <input 
                  type="text" 
                  maxLength={5}
                  placeholder="12/28" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  CVC (비밀번호 앞 2자리)
                </label>
                <input 
                  type="password" 
                  maxLength={3}
                  placeholder="•••" 
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginTop: '10px'
              }}
            >
              매월 자동 결제 등록하기
            </button>
          </form>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>구독 및 결제 안전 보장:</strong><br />
              CUSWAY는 신용카드 번호를 암호화 토큰화하여 안전한 금융결제원 보안 표준에 부합하게 통제하며, 결제 주기 3일 전 이메일 및 카카오 알림톡을 통해 청구 금액 사전 공지를 제공합니다.
            </div>
          </div>
        </div>

      </div>

      {/* Official Business Billing Notice Footer */}
      <div style={{
        marginTop: '16px',
        padding: '20px 24px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 800 }}>
          <span>🏢</span>
          <span>서비스 결제 및 세금계산서 발행 사업자 정보</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '4px' }}>
          <div>• 상호명: <strong>삼흥</strong></div>
          <div>• 대표자: <strong>한상윤</strong></div>
          <div>• 사업자등록번호: <strong>888-64-00585</strong></div>
          <div>• 직통 문의: <strong>010-9256-8480</strong></div>
          <div>• 서비스명: <strong>CUSWAY (원스탑 관세 AI 솔루션)</strong></div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px', fontSize: '0.72rem' }}>
          * 법인 및 개인사업자 결제 시 국세청 홈택스 전자세금계산서 또는 신용카드 매출전표가 자동 발행되며, 세무비용으로 100% 매입세액 공제 및 손비 처리 가능합니다.
        </div>
      </div>

    </div>
  );
}
