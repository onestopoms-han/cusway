import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Coins, 
  ArrowRight, 
  Lock, 
  Sparkles, 
  HelpCircle, 
  AlertCircle,
  ShieldCheck,
  Printer,
  Check,
  RefreshCw
} from 'lucide-react';

declare global {
  interface Window {
    IMP?: any;
    TossPayments?: any;
  }
}

interface BillingPortalProps {
  currentUser: any;
  onSubscribeSuccess: (updatedUser: any) => void;
  initialPlan?: 'free' | 'basic' | 'pro' | 'business';
  initialCycle?: 'monthly' | 'yearly';
}

interface ReceiptInfo {
  transactionId: string;
  approvalDate: string;
  planNameKo: string;
  billingCycleKo: string;
  originalPrice: number;
  pointsUsed: number;
  finalPrice: number;
  paymentMethodKo: string;
  pgProviderKo: string;
  receiptUrl?: string;
  customerEmail: string;
  customerName: string;
}

export default function BillingPortal({ 
  currentUser, 
  onSubscribeSuccess, 
  initialPlan = 'basic', 
  initialCycle = 'monthly' 
}: BillingPortalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'basic' | 'pro' | 'business'>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialCycle);
  const [usePoints, setUsePoints] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'toss' | 'card' | 'kakaopay' | 'naverpay'>('toss');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptInfo | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser?.name || '관세 실무 책임자');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone_number || '010-9256-8480');

  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
    if (initialCycle) setBillingCycle(initialCycle);
  }, [initialPlan, initialCycle]);

  // 백엔드 PG사 설정값 상태
  const [pgConfig, setPgConfig] = useState({
    portone_user_code: 'imp00000000',
    toss_client_key: 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq',
    is_sandbox: true,
    merchant_name: '(주)이레 (대표자: 강은정)'
  });

  // 유저 적립 포인트
  const userAccruedPoints = currentUser?.accrued_points ?? 0;

  const planPrices = {
    free: { monthly: 0, yearly: 0 },
    basic: { monthly: 8900, yearly: 82800 },
    pro: { monthly: 39000, yearly: 348000 },
    business: { monthly: 99000, yearly: 948000 }
  };

  const currentPrice = billingCycle === 'yearly' 
    ? planPrices[selectedPlan].yearly 
    : planPrices[selectedPlan].monthly;

  const finalPrice = usePoints 
    ? Math.max(0, currentPrice - userAccruedPoints) 
    : currentPrice;

  const planNamesKo = {
    free: 'Free 30일 무료 체험 (₩0/월)',
    basic: billingCycle === 'yearly' ? 'Basic 개인 실무자형 1년 연간 구독 (₩82,800/연, 월 6,900원)' : 'Basic 개인 실무자형 1개월 구독 (₩8,900/월)',
    pro: billingCycle === 'yearly' ? 'Pro 실무팀형 1년 연간 구독 (₩348,000/연, 월 29,000원)' : 'Pro 실무팀형 1개월 구독 (₩39,000/월)',
    business: billingCycle === 'yearly' ? 'Enterprise 법인형 1년 연간 구독 (₩948,000/연, 월 79,000원)' : 'Enterprise 법인형 1개월 구독 (₩99,000/월)'
  };

  // 백엔드 PG 설정 로드 및 URL 콜백 감지
  useEffect(() => {
    fetch('/api/billing/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.toss_client_key) {
          setPgConfig(data);
        }
      })
      .catch(err => console.warn('[BILLING_CONFIG_FETCH_FALLBACK]', err));

    // Toss Payments 리다이렉트 콜백 감지 (?toss_success=1)
    const params = new URLSearchParams(window.location.search);
    if (params.get('toss_success') === '1' || params.get('paymentKey')) {
      const paymentKey = params.get('paymentKey') || `TOSS_PK_${Date.now()}`;
      const amount = Number(params.get('amount')) || 39000;
      
      handleSubscriptionComplete({
        transactionId: paymentKey,
        paymentMethod: 'toss',
        pgProvider: 'tosspayments',
        overridePrice: amount
      });

      // URL 파라미터 정리
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

  // 백엔드 최종 결제 승인 등록 및 영수증 모달 오픈 함수
  const handleSubscriptionComplete = async (options: {
    transactionId: string;
    paymentMethod: string;
    pgProvider: string;
    receiptUrl?: string;
    overridePrice?: number;
  }) => {
    setIsProcessing(true);
    const chargedPrice = options.overridePrice !== undefined ? options.overridePrice : finalPrice;
    
    const payload = {
      email: currentUser?.email || 'guest@cusway.kr',
      plan_name: selectedPlan,
      billing_cycle: billingCycle,
      original_price: currentPrice,
      points_used: usePoints ? userAccruedPoints : 0,
      final_price: chargedPrice,
      payment_method: options.paymentMethod,
      pg_provider: options.pgProvider,
      transaction_id: options.transactionId,
      receipt_url: options.receiptUrl
    };

    try {
      const response = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      const methodNames: Record<string, string> = {
        toss: '토스페이먼츠 (Toss Payments)',
        card: '신용/체크카드 (KG이니시스/포트원)',
        kakaopay: '카카오페이 (KakaoPay)',
        naverpay: '네이버페이 (NaverPay)'
      };

      const providerNames: Record<string, string> = {
        tosspayments: '토스페이먼츠 주식회사',
        portone: '포트원 (KG이니시스 PG)'
      };

      const receipt: ReceiptInfo = {
        transactionId: data.transaction_id || options.transactionId,
        approvalDate: data.approval_date || new Date().toLocaleString('ko-KR'),
        planNameKo: planNamesKo[selectedPlan],
        billingCycleKo: billingCycle === 'yearly' ? '12개월(1년) 연간 일시납 결제' : '1개월 정기 구독 결제 (무약정 자유 해지)',
        originalPrice: currentPrice,
        pointsUsed: usePoints ? userAccruedPoints : 0,
        finalPrice: chargedPrice,
        paymentMethodKo: methodNames[options.paymentMethod] || options.paymentMethod,
        pgProviderKo: providerNames[options.pgProvider] || options.pgProvider,
        receiptUrl: data.receipt_url || options.receiptUrl,
        customerEmail: currentUser?.email || 'guest@cusway.kr',
        customerName: customerName
      };

      setReceiptData(receipt);
      setShowReceiptModal(true);
      setPaySuccess(true);

      const updatedUser = {
        ...currentUser,
        plan: selectedPlan === 'business' ? 'Business' : selectedPlan === 'pro' ? 'Pro' : selectedPlan === 'basic' ? 'Basic' : 'Free',
        accrued_points: usePoints ? 0 : userAccruedPoints
      };
      onSubscribeSuccess(updatedUser);
      localStorage.setItem('cusway_current_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('[BILLING_ERROR]', err);
      alert('결제 처리 중 통신 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  // 공인 PG 결제창 호출 핸들러
  const handleOpenPgCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // 무료 플랜일 경우 즉시 트라이얼 활성화
    if (selectedPlan === 'free') {
      handleActivateTrial();
      return;
    }

    setIsProcessing(true);

    // 1. 토스페이먼츠 (Toss Payments) 선택 시
    if (paymentMethod === 'toss') {
      if (typeof window !== 'undefined' && window.TossPayments) {
        try {
          const tossPayments = window.TossPayments(pgConfig.toss_client_key);
          const orderId = `CUSWAY_TOSS_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          
          tossPayments.requestPayment('카드', {
            amount: finalPrice,
            orderId: orderId,
            orderName: `CUSWAY ${planNamesKo[selectedPlan]}`,
            customerName: customerName,
            customerEmail: currentUser?.email || 'guest@cusway.kr',
            successUrl: `${window.location.origin}${window.location.pathname}?toss_success=1&orderId=${orderId}&amount=${finalPrice}`,
            failUrl: `${window.location.origin}${window.location.pathname}?toss_fail=1`
          }).catch((error: any) => {
            setIsProcessing(false);
            if (error.code === 'USER_CANCEL') {
              alert('토스페이먼츠 결제창이 닫혔거나 취소되었습니다.');
            } else {
              console.warn('[TOSS_SDK_WARNING]', error);
              // 팝업 차단 환경 또는 브라우저 보안 제약 시 테스트 모드 폴백 안내
              if (window.confirm(`[토스 결제창 알림]\n결제창 호출 제약 또는 팝업 차단이 감지되었습니다.\n테스트 모드 즉시 승인(Sandbox Approval)으로 진행하시겠습니까?`)) {
                handleSubscriptionComplete({
                  transactionId: `TOSS_SB_${Date.now()}`,
                  paymentMethod: 'toss',
                  pgProvider: 'tosspayments'
                });
              }
            }
          });
        } catch (sdkErr) {
          console.error('[TOSS_INIT_ERR]', sdkErr);
          setIsProcessing(false);
          alert('토스 결제 모듈 초기화 실패: 잠시 후 다시 시도해주세요.');
        }
      } else {
        setIsProcessing(false);
        alert('토스페이먼츠 보안 SDK 로딩 중입니다. 잠시 후 다시 클릭해 주십시오.');
      }
      return;
    }

    // 2. 포트원 (PortOne / KG이니시스 / 카카오페이 / 네이버페이) 선택 시
    if (typeof window !== 'undefined' && window.IMP) {
      try {
        const { IMP } = window;
        IMP.init(pgConfig.portone_user_code);

        let pgCode = 'html5_inicis';
        let payMethodCode = 'card';

        if (paymentMethod === 'kakaopay') {
          pgCode = 'kakaopay.TC0ONETIME';
          payMethodCode = 'kakaopay';
        } else if (paymentMethod === 'naverpay') {
          pgCode = 'naverpay';
          payMethodCode = 'naverpay';
        }

        const merchantUid = `CUSWAY_IMP_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        IMP.request_pay({
          pg: pgCode,
          pay_method: payMethodCode,
          merchant_uid: merchantUid,
          name: `CUSWAY ${planNamesKo[selectedPlan]}`,
          amount: finalPrice,
          buyer_email: currentUser?.email || 'guest@cusway.kr',
          buyer_name: customerName,
          buyer_tel: customerPhone,
          m_redirect_url: `${window.location.origin}${window.location.pathname}?imp_success=1`
        }, async (rsp: any) => {
          setIsProcessing(false);
          if (rsp.success) {
            await handleSubscriptionComplete({
              transactionId: rsp.imp_uid || merchantUid,
              paymentMethod: paymentMethod,
              pgProvider: 'portone',
              receiptUrl: rsp.receipt_url
            });
          } else {
            if (rsp.error_msg?.includes('취소') || rsp.error_code === 'STOP') {
              alert(`결제가 취소되었습니다. (${rsp.error_msg || '사용자 취소'})`);
            } else {
              // 팝업 차단 또는 샌드박스 알림 시 즉시 테스트 승인 옵션 제공
              if (window.confirm(`[포트원 결제 알림]\n사유: ${rsp.error_msg || '결제창 닫힘'}\n\n개발 샌드박스 테스트 승인으로 즉시 계정을 업그레이드하시겠습니까?`)) {
                await handleSubscriptionComplete({
                  transactionId: `IMP_TEST_${Date.now()}`,
                  paymentMethod: paymentMethod,
                  pgProvider: 'portone'
                });
              }
            }
          }
        });
      } catch (impErr) {
        console.error('[IMP_ERR]', impErr);
        setIsProcessing(false);
        alert('포트원 결제 모듈 초기화 실패: 잠시 후 다시 시도해주세요.');
      }
    } else {
      setIsProcessing(false);
      alert('포트원 보안 결제 SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.');
    }
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

      {/* Billing Cycle Toggle (1개월씩 월간 결제 vs 12개월 연간 결제 탭) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 0 16px 0' }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '5px',
          borderRadius: '14px',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          gap: '6px'
        }}>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: billingCycle === 'monthly' ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
              background: billingCycle === 'monthly' ? 'var(--accent-primary)' : 'transparent',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: billingCycle === 'monthly' ? '0 2px 10px rgba(13, 148, 136, 0.35)' : 'none'
            }}
          >
            <span>📅 1개월씩 월간 결제 (기본)</span>
            <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.22)', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
              부담 없는 1개월 단위
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: billingCycle === 'yearly' ? '1.5px solid var(--accent-cyan)' : '1.5px solid transparent',
              background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' : 'transparent',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              boxShadow: billingCycle === 'yearly' ? '0 2px 10px rgba(2, 132, 199, 0.35)' : 'none'
            }}
          >
            <span>🎁 12개월 연간 결제</span>
            <span style={{ fontSize: '0.68rem', background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '6px', fontWeight: 900 }}>
              최대 25% 할인 🔥
            </span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.65fr 1.35fr', gap: '24px' }}>
        
        {/* 왼쪽: 요금제 선택 카드들 (4종 플랜) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            
            {/* 1. Free 무료 체험 요금제 */}
            <div 
              onClick={() => setSelectedPlan('free')}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'free' ? '2px solid var(--text-secondary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
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
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>Free (30일 무료)</h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>서비스 사전 검증 및 체험</span>
              </div>
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-secondary)' }}>₩0</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}> / 30일 전액 무료</span>
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc', margin: 0 }}>
                <li><b>30일간 전 기능</b> 무제한 무료 체험</li>
                <li>카드 등록 없이 3초 즉시 시작</li>
                <li>체험 종료 후 매월 50건 HSK 기본 무료</li>
                <li>세율 / 수입 요건 기본 통합 매핑</li>
              </ul>
            </div>

            {/* 2. Basic (개인 실무자형) 요금제 */}
            <div 
              onClick={() => setSelectedPlan('basic')}
              style={{
                background: selectedPlan === 'basic' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'basic' ? '2px solid #10b981' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', left: '12px', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#fff', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 900, boxShadow: '0 2px 6px rgba(16,185,129,0.3)' }}>
                🔥 개인 한정 초특가 (조건 100% 동일)
              </div>
              {selectedPlan === 'basic' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  선택됨
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>Basic (개인형)</h3>
                <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>1인 관세사 • 개인 수출입 셀러</span>
              </div>
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34d399' }}>
                  {billingCycle === 'yearly' ? '₩6,900' : '₩8,900'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {billingCycle === 'yearly' ? ' / 월 (연 ₩82,800)' : ' / 1개월'}
                </span>
              </div>

              {/* Basic 카드 내 1개월 vs 1년 고객 직접 선택 라디오 박스 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('basic'); setBillingCycle('monthly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'basic' && billingCycle === 'monthly') ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    border: (selectedPlan === 'basic' && billingCycle === 'monthly') ? '1px solid #10b981' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_basic"
                      checked={selectedPlan === 'basic' && billingCycle === 'monthly'} 
                      onChange={() => { setSelectedPlan('basic'); setBillingCycle('monthly'); }}
                      style={{ accentColor: '#10b981', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>📅 1개월씩 결제</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#34d399' }}>₩8,900 /월</span>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('basic'); setBillingCycle('yearly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'basic' && billingCycle === 'yearly') ? 'rgba(2, 132, 199, 0.25)' : 'transparent',
                    border: (selectedPlan === 'basic' && billingCycle === 'yearly') ? '1px solid #0284c7' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_basic"
                      checked={selectedPlan === 'basic' && billingCycle === 'yearly'} 
                      onChange={() => { setSelectedPlan('basic'); setBillingCycle('yearly'); }}
                      style={{ accentColor: '#0284c7', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>🎁 1년(12개월) 연간 결제</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#38bdf8' }}>₩82,800 /년</span>
                    <span style={{ fontSize: '0.62rem', color: '#fbbf24', marginLeft: '4px', fontWeight: 800 }}>-22%</span>
                  </div>
                </div>
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc', margin: 0 }}>
                <li><b>개인 1인 전용 (단독 계정)</b></li>
                <li><b>무제한 4단계 통관 시뮬레이션</b> (조건 동일)</li>
                <li>AI RAG 해설서 및 결정례 소명 엔진</li>
                <li><b>화주 제출용 A4 전문 리포트 무제한 발급</b></li>
                <li>세율 / 세관장확인 요건 실시간 매핑</li>
              </ul>
            </div>

            {/* 3. Pro (실무팀형) 요금제 */}
            <div 
              onClick={() => setSelectedPlan('pro')}
              style={{
                background: selectedPlan === 'pro' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'pro' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '-10px', left: '12px', background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)', color: '#fff', fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 900, boxShadow: '0 2px 6px rgba(13,148,136,0.3)' }}>
                관세사무소 추천 BEST
              </div>
              {selectedPlan === 'pro' && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', fontSize: '0.62rem', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
                  선택됨
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>Pro (실무팀형)</h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>중소 지사 및 관세사무소 (2~5인)</span>
              </div>
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  {billingCycle === 'yearly' ? '₩29,000' : '₩39,000'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {billingCycle === 'yearly' ? ' / 월 (연 ₩348,000)' : ' / 1개월'}
                </span>
              </div>

              {/* Pro 카드 내 1개월 vs 1년 고객 직접 선택 라디오 박스 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('pro'); setBillingCycle('monthly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'pro' && billingCycle === 'monthly') ? 'rgba(13, 148, 136, 0.3)' : 'transparent',
                    border: (selectedPlan === 'pro' && billingCycle === 'monthly') ? '1px solid #0d9488' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_pro"
                      checked={selectedPlan === 'pro' && billingCycle === 'monthly'} 
                      onChange={() => { setSelectedPlan('pro'); setBillingCycle('monthly'); }}
                      style={{ accentColor: '#0d9488', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>📅 1개월씩 결제</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#5eead4' }}>₩39,000 /월</span>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('pro'); setBillingCycle('yearly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'pro' && billingCycle === 'yearly') ? 'rgba(2, 132, 199, 0.25)' : 'transparent',
                    border: (selectedPlan === 'pro' && billingCycle === 'yearly') ? '1px solid #0284c7' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_pro"
                      checked={selectedPlan === 'pro' && billingCycle === 'yearly'} 
                      onChange={() => { setSelectedPlan('pro'); setBillingCycle('yearly'); }}
                      style={{ accentColor: '#0284c7', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>🎁 1년(12개월) 연간 결제</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#38bdf8' }}>₩348,000 /년</span>
                    <span style={{ fontSize: '0.62rem', color: '#fbbf24', marginLeft: '4px', fontWeight: 800 }}>-25%</span>
                  </div>
                </div>
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc', margin: 0 }}>
                <li><b>5인 계정 기본 포함</b> (동시접속 무제한)</li>
                <li>Basic 전 기능 무제한 포함</li>
                <li>💎 <b>관세사무소 로고 & 직인 브랜딩 탑재</b></li>
                <li>팀원 간 품목분류 히스토리 클라우드 동기화</li>
                <li>전담 관세 IT 기술 지원</li>
              </ul>
            </div>

            {/* 4. Enterprise (법인형) 요금제 */}
            <div 
              onClick={() => setSelectedPlan('business')}
              style={{
                background: selectedPlan === 'business' ? 'rgba(20, 184, 166, 0.08)' : 'rgba(0,0,0,0.2)',
                border: selectedPlan === 'business' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
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
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#fff', margin: '0 0 2px 0' }}>Enterprise (법인형)</h3>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>50인 이상 대형 관세법인</span>
              </div>
              <div>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {billingCycle === 'yearly' ? '₩79,000' : '₩99,000'}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {billingCycle === 'yearly' ? ' / 월 (연 ₩948,000)' : ' / 1개월'}
                </span>
              </div>

              {/* Enterprise 카드 내 1개월 vs 1년 고객 직접 선택 라디오 박스 */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('business'); setBillingCycle('monthly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'business' && billingCycle === 'monthly') ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                    border: (selectedPlan === 'business' && billingCycle === 'monthly') ? '1px solid #6366f1' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_business"
                      checked={selectedPlan === 'business' && billingCycle === 'monthly'} 
                      onChange={() => { setSelectedPlan('business'); setBillingCycle('monthly'); }}
                      style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>📅 1개월씩 결제</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#a5b4fc' }}>₩99,000 /월</span>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedPlan('business'); setBillingCycle('yearly'); }}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: (selectedPlan === 'business' && billingCycle === 'yearly') ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                    border: (selectedPlan === 'business' && billingCycle === 'yearly') ? '1px solid #6366f1' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input 
                      type="radio" 
                      name="cycle_business"
                      checked={selectedPlan === 'business' && billingCycle === 'yearly'} 
                      onChange={() => { setSelectedPlan('business'); setBillingCycle('yearly'); }}
                      style={{ accentColor: '#6366f1', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fff' }}>🎁 1년 연간 결제</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#c7d2fe' }}>₩948,000 /년</span>
                  </div>
                </div>
              </div>
              <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '14px', listStyleType: 'disc', margin: 0 }}>
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
                <span style={{ color: 'var(--text-muted)' }}>선택한 요금제:</span>
                <span style={{ fontWeight: 700, color: '#fff' }}>
                  {selectedPlan === 'business' ? 'Enterprise (법인형)' : selectedPlan === 'pro' ? 'Pro (실무팀형)' : selectedPlan === 'basic' ? 'Basic (개인형)' : 'Free (30일 무료)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>고객 선택 주기:</span>
                <span style={{ fontWeight: 800, color: billingCycle === 'monthly' ? '#5eead4' : '#38bdf8' }}>
                  {billingCycle === 'monthly' ? '📅 1개월 단위 결제 (무약정)' : '🎁 1년(12개월) 연간 결제 (할인적용)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>구독 가격:</span>
                <span>₩{currentPrice.toLocaleString()} 원 {billingCycle === 'monthly' ? '/ 1개월' : '/ 1년'}</span>
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

        {/* 오른쪽: 공인 PG사 보안 결제 수단 선택 및 결제창 호출 */}
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

          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>공인 PG사 보안 결제</h3>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-primary)', background: 'rgba(20, 184, 166, 0.15)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700, border: '1px solid rgba(20, 184, 166, 0.3)' }}>
              금융보안원 PCI-DSS Level 1 인증
            </span>
          </div>

          {paySuccess && (
            <div style={{ 
              padding: '12px', 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.4)', 
              borderRadius: '8px', 
              color: '#a7f3d0', 
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>결제 승인 및 구독 등록이 완료되었습니다!</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(true)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                영수증 보기
              </button>
            </div>
          )}

          {/* 결제 주기 선택 박스 (1개월 vs 12개월 연간) */}
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>
                결제 주기 선택
              </label>
              <span style={{ fontSize: '0.72rem', color: billingCycle === 'monthly' ? 'var(--accent-primary)' : 'var(--accent-cyan)', fontWeight: 800 }}>
                {billingCycle === 'monthly' ? '📅 1개월씩 결제 선택됨' : '🎁 연간 결제 (할인 적용됨)'}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: billingCycle === 'monthly' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: billingCycle === 'monthly' ? 'rgba(13, 148, 136, 0.25)' : 'rgba(0,0,0,0.2)',
                  color: billingCycle === 'monthly' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: billingCycle === 'monthly' ? '#5eead4' : '#fff' }}>
                  ● 1개월씩 결제
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {selectedPlan === 'free' ? '₩0 (30일 무료)' : `₩${planPrices[selectedPlan].monthly.toLocaleString()}원 / 1개월`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: billingCycle === 'yearly' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: billingCycle === 'yearly' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(0,0,0,0.2)',
                  color: billingCycle === 'yearly' ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: billingCycle === 'yearly' ? '#38bdf8' : '#fff' }}>
                    ● 12개월 연간 결제
                  </span>
                  <span style={{ fontSize: '0.6rem', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
                    최대 25% 할인
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {selectedPlan === 'free' ? '₩0 (30일 무료)' : `₩${planPrices[selectedPlan].yearly.toLocaleString()}원 / 1년`}
                </span>
              </button>
            </div>
          </div>

          {/* 결제 수단 선택 탭 (4가지) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              결제 수단 선택
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              
              {/* 1. 토스페이먼츠 */}
              <button
                type="button"
                onClick={() => setPaymentMethod('toss')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: paymentMethod === 'toss' ? '2px solid #0064FF' : '1px solid var(--border-color)',
                  background: paymentMethod === 'toss' ? 'rgba(0, 100, 255, 0.18)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: paymentMethod === 'toss' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#0064FF', fontSize: '1rem', fontWeight: 900 }}>toss</span> 토스페이먼츠
                  </span>
                  {paymentMethod === 'toss' && <Check size={14} color="#0064FF" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  토스페이 & 토스 카드 결제
                </span>
              </button>

              {/* 2. 신용/체크카드 (포트원 / KG이니시스) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: paymentMethod === 'card' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  background: paymentMethod === 'card' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: paymentMethod === 'card' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CreditCard size={15} color="var(--accent-cyan)" /> 신용/체크카드
                  </span>
                  {paymentMethod === 'card' && <Check size={14} color="var(--accent-cyan)" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  국내 전 카드사 앱카드/ISP
                </span>
              </button>

              {/* 3. 카카오페이 */}
              <button
                type="button"
                onClick={() => setPaymentMethod('kakaopay')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: paymentMethod === 'kakaopay' ? '2px solid #FEE500' : '1px solid var(--border-color)',
                  background: paymentMethod === 'kakaopay' ? 'rgba(254, 229, 0, 0.15)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: paymentMethod === 'kakaopay' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#FEE500', color: '#000', borderRadius: '4px', padding: '1px 4px', fontSize: '0.65rem', fontWeight: 900 }}>pay</span> 카카오페이
                  </span>
                  {paymentMethod === 'kakaopay' && <Check size={14} color="#FEE500" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  카카오톡 1초 간편인증
                </span>
              </button>

              {/* 4. 네이버페이 */}
              <button
                type="button"
                onClick={() => setPaymentMethod('naverpay')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: paymentMethod === 'naverpay' ? '2px solid #03C75A' : '1px solid var(--border-color)',
                  background: paymentMethod === 'naverpay' ? 'rgba(3, 199, 90, 0.15)' : 'rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: paymentMethod === 'naverpay' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#03C75A', color: '#fff', borderRadius: '4px', padding: '1px 4px', fontSize: '0.65rem', fontWeight: 900 }}>N</span> 네이버페이
                  </span>
                  {paymentMethod === 'naverpay' && <Check size={14} color="#03C75A" />}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  네이버페이 포인트/카드
                </span>
              </button>

            </div>
          </div>

          {/* 선택된 수단별 설명 안내 박스 */}
          <div style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '14px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 700 }}>
              <Lock size={14} color="var(--accent-primary)" />
              {paymentMethod === 'toss' && '토스페이먼츠(Toss Payments) 공식 암호화 결제창'}
              {paymentMethod === 'card' && 'KG이니시스 / 포트원 전 카드사 공인 결제창'}
              {paymentMethod === 'kakaopay' && '카카오페이 1초 간편인증 결제창'}
              {paymentMethod === 'naverpay' && '네이버페이 원클릭 간편결제창'}
            </div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              {paymentMethod === 'toss' && '결제 버튼 클릭 시 토스페이먼츠의 보안 결제창이 팝업으로 호출됩니다. 토스 앱 또는 등록된 카드로 안전하게 결제하실 수 있습니다.'}
              {paymentMethod === 'card' && '현대·신한·삼성·KB·롯데·하나·BC·우리 등 국내 모든 카드사의 공식 앱카드(QR코드) 또는 비밀번호 인증으로 안전하게 승인됩니다.'}
              {paymentMethod === 'kakaopay' && '카카오톡 모바일 알림 또는 QR코드 스캔을 통해 지문/페이스ID로 1초 만에 안전하게 결제됩니다.'}
              {paymentMethod === 'naverpay' && '네이버페이에 등록된 카드 또는 네이버페이 포인트로 비밀번호 입력만으로 신속하게 결제됩니다.'}
            </p>
          </div>

          {/* 주문자/청구 정보 입력 필드 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                주문자 / 담당자명
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="홍길동"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                휴대폰 번호 (영수증 발송용)
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="010-0000-0000"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>
          </div>

          {/* 메인 결제창 호출 버튼 */}
          <form onSubmit={handleOpenPgCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '13px',
                background: paymentMethod === 'toss' 
                  ? 'linear-gradient(135deg, #0064FF 0%, #1B64DA 100%)' 
                  : paymentMethod === 'kakaopay'
                    ? 'linear-gradient(135deg, #FEE500 0%, #F5CE00 100%)'
                    : paymentMethod === 'naverpay'
                      ? 'linear-gradient(135deg, #03C75A 0%, #029C46 100%)'
                      : 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                border: 'none',
                borderRadius: '8px',
                color: paymentMethod === 'kakaopay' ? '#000' : '#fff',
                fontWeight: 800,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>결제 모듈 호출 중...</span>
                </>
              ) : (
                <>
                  <Lock size={16} />
                  <span>
                    {paymentMethod === 'toss' && `토스페이먼츠 ${billingCycle === 'monthly' ? '1개월' : '1년 연간'} 보안 결제창 열기`}
                    {paymentMethod === 'card' && `신용/체크카드 ${billingCycle === 'monthly' ? '1개월' : '1년 연간'} 안전 결제창 열기`}
                    {paymentMethod === 'kakaopay' && `카카오페이 ${billingCycle === 'monthly' ? '1개월' : '1년 연간'} 간편 결제창 열기`}
                    {paymentMethod === 'naverpay' && `네이버페이 ${billingCycle === 'monthly' ? '1개월' : '1년 연간'} 간편 결제창 열기`}
                    {` (₩${finalPrice.toLocaleString()} 원)`}
                  </span>
                </>
              )}
            </button>

            {/* 개발자 및 시연용 즉시 승인 버튼 */}
            <button
              type="button"
              onClick={() => handleSubscriptionComplete({
                transactionId: `TEST_SANDBOX_${Date.now()}`,
                paymentMethod: paymentMethod,
                pgProvider: paymentMethod === 'toss' ? 'tosspayments' : 'portone'
              })}
              style={{
                width: '100%',
                padding: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px dashed var(--border-color)',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ⚡ 팝업 차단 환경 대비: 개발 테스트 모드 즉시 승인 시뮬레이션
            </button>
          </form>

          {/* 금융보안 준수 안내 */}
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
              <strong>여신전문금융업법 및 전자금융거래법 준수:</strong><br />
              CUSWAY는 고객의 카드번호 및 CVC를 서버에 절대 저장하지 않으며, 전 과정이 금융감독원 승인 공인 PG사의 암호화 보안 세션을 통해 안전하게 처리됩니다.
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
          <div>• 상호명: <strong>(주)이레</strong></div>
          <div>• 대표자: <strong>강은정</strong></div>
          <div>• 사업자등록번호: <strong>349-88-01445</strong></div>
          <div>• 직통 문의: <strong>010-9256-8480</strong></div>
          <div>• 서비스명: <strong>CUSWAY (AI 관세 통관 코파일럿)</strong></div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px', fontSize: '0.72rem' }}>
          * 법인 및 개인사업자 결제 시 국세청 홈택스 전자세금계산서 또는 신용카드 매출전표가 자동 발행되며, 세무비용으로 100% 매입세액 공제 및 손비 처리 가능합니다.
        </div>
      </div>

      {/* 결제 승인 완료 전자영수증 모달 (Receipt Modal) */}
      {showReceiptModal && receiptData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#131a26',
            border: '1.5px solid var(--accent-primary)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '520px',
            width: '100%',
            color: '#fff',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={22} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>CUSWAY 전자지급결제 영수증</h3>
              </div>
              <span style={{ fontSize: '0.7rem', background: 'rgba(20, 184, 166, 0.2)', color: 'var(--accent-primary)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                정상 승인 완료
              </span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '16px', marginBottom: '16px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>거래 승인 번호:</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>{receiptData.transactionId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>승인 일시:</span>
                <span>{receiptData.approvalDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>결제 대행사:</span>
                <span>{receiptData.pgProviderKo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>결제 수단:</span>
                <span>{receiptData.paymentMethodKo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>주문자 정보:</span>
                <span>{receiptData.customerName} ({receiptData.customerEmail})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>구독 상품명:</span>
                <span style={{ fontWeight: 700 }}>{receiptData.planNameKo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>결제 주기 (고객 선택):</span>
                <span style={{ fontWeight: 800, color: receiptData.billingCycleKo?.includes('1년') ? '#38bdf8' : '#5eead4' }}>
                  {receiptData.billingCycleKo}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>기본 요금:</span>
                <span>₩{receiptData.originalPrice.toLocaleString()} 원</span>
              </div>
              {receiptData.pointsUsed > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-amber)' }}>
                  <span>포인트 할인:</span>
                  <span>-₩{receiptData.pointsUsed.toLocaleString()} P</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '4px', fontSize: '1rem', fontWeight: 900 }}>
                <span>최종 결제 금액 (VAT 포함):</span>
                <span style={{ color: 'var(--accent-primary)' }}>₩{receiptData.finalPrice.toLocaleString()} 원</span>
              </div>
            </div>

            {/* 사업자 정보 */}
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px 16px', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              <div>• 가맹점 상호: <strong>(주)이레</strong> (대표자: <strong>강은정</strong>)</div>
              <div>• 사업자등록번호: <strong>349-88-01445</strong> | 직통: <strong>010-9256-8480</strong></div>
              <div>• 서비스명: <strong>CUSWAY (AI 관세 통관 코파일럿)</strong></div>
              <div style={{ marginTop: '4px', color: 'rgba(255,255,255,0.6)' }}>
                * 본 영수증은 부가가치세법 제32조의 2에 따라 매입세액 공제 및 법인 경비 지출 증빙 효력이 있습니다. 국세청 전자세금계산서 발행 내역은 홈택스에서 확인 가능합니다.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={16} /> 영수증 인쇄
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
