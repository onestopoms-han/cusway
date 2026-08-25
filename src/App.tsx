import { useState, useEffect } from 'react'
import { Scale, Settings, Bell, LogOut, User, Lock, Mail, ShieldAlert, Coins, CreditCard, Sparkles } from 'lucide-react'
import HsClassifier from './components/HsClassifier'
import CashBackManager from './components/CashBackManager'
import ValuationPrecedents from './components/ValuationPrecedents'
import AdminPortal from './components/AdminPortal'
import BillingPortal from './components/BillingPortal'
import ClearanceWizard from './components/ClearanceWizard'

export default function App() {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  interface UserInfo {
    email: string;
    company_name: string;
    plan: string;
    status: string;
    accrued_points: number;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState('admin@cusway.kr');
  const [password, setPassword] = useState('pjhcustoms2026!');
  const [loginError, setLoginError] = useState('');
  const [currentView, setCurrentView] = useState<'hs-classifier' | 'clearance-wizard' | 'valuation' | 'cashback' | 'admin' | 'billing'>('hs-classifier');
  
  // Signup states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupUserType, setSignupUserType] = useState<string>('general_user');
  const [signupYears, setSignupYears] = useState<number>(0);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // States for transferring details to ClearanceWizard
  const [wizardHsCode, setWizardHsCode] = useState('2009.89-1090');
  const [wizardKeyword, setWizardKeyword] = useState('배 주스');
  const [wizardMaterial, setWizardMaterial] = useState('배 과즙 100%');
  const [wizardFunction, setWizardFunction] = useState('음료 제조용 원료');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsLoggedIn(true);
        console.log('API 로그인 성공:', data);
      } else {
        const errData = await response.json();
        setLoginError(errData.detail || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.warn('API 로그인 실패, 데모 모드로 가동합니다:', err);
      // 로컬 데모 모드 (오프라인/로컬 빌드 시에도 정상 진입하도록 세이프 가드)
      if (email === 'admin@cusway.kr' && password === 'pjhcustoms2026!') {
        const fallbackUser = {
          email: 'admin@cusway.kr',
          company_name: 'CUSWAY 관세팀 (데모 모드)',
          plan: 'Business',
          status: 'Active',
          accrued_points: 15000,
          user_type: 'broker',
          years_of_experience: 12,
          credibility_weight: 3.0
        };
        setCurrentUser(fallbackUser);
        setIsLoggedIn(true);
      } else {
        setLoginError('서버 연결 실패 및 매칭되는 데모 계정이 아닙니다.');
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSignupSuccess(false);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          company_name: signupCompanyName,
          user_type: signupUserType,
          years_of_experience: Number(signupYears)
        })
      });

      if (response.ok) {
        setSignupSuccess(true);
        // Automatically populate login inputs
        setEmail(signupEmail);
        setPassword(signupPassword);
        setIsSigningUp(false);
        setSignupEmail('');
        setSignupPassword('');
        setSignupCompanyName('');
        setSignupUserType('general_user');
        setSignupYears(0);
        alert('회원가입이 성공적으로 완료되었습니다! 가입하신 정보가 로그인 창에 자동 설정되었습니다.');
      } else {
        const errData = await response.json();
        setLoginError(errData.detail || '회원 가입에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setLoginError('서버와의 통신에 실패했습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        padding: isMobile ? '16px' : '40px'
      }}>
        {/* Decorative Glows */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', left: '-100px', background: 'rgba(20, 184, 166, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', bottom: '-150px', right: '-150px', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: isMobile ? '440px' : '960px',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Left: CUSWAY Value Proposition Board */}
          {!isMobile && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
              padding: '50px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '30px'
            }}>
              <div>
                <span style={{ 
                  background: 'rgba(20, 184, 166, 0.1)', 
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  letterSpacing: '1px'
                }}>
                  NEXT-GEN CUSTOMS COPILOT
                </span>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginTop: '16px', lineHeight: 1.3 }}>
                  관세 실무를 위한<br />차세대 인텔리전트 Copilot
                </h1>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>
                  단순 검색을 넘어, AI RAG 기술과 유기적인 4단계 심사 파이프라인으로 관세사의 정확성과 속도를 10배 늘려줍니다.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Advantage 1 */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sparkles size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>동시 무제한 로그인 지원</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      선착순 접속 대기나 PC 대수 제한 제약 없이, 사무실과 출장지 등 어디서나 전 직원이 동시 다중 접속이 가능합니다.
                    </p>
                  </div>
                </div>

                {/* Advantage 2 */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Scale size={20} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>4단계 원스톱 심사 가이드</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      품목분류 ➡️ 협정세율/원산지 ➡️ 통합공고 요건 ➡️ 소관부처 행정 서류 및 타임라인까지 누수 없는 하나의 흐름으로 분석합니다.
                    </p>
                  </div>
                </div>

                {/* Advantage 3 */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldAlert size={20} color="var(--accent-amber)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>AI RAG 분류 해설 및 결정례 추천</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      사후 세액 소명과 품목분류 입증을 위해 복잡한 관세율표 해설서에서 최적의 법적 조항을 AI가 실시간으로 매핑해 줍니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right: Login Form Column */}
          <div style={{ padding: isMobile ? '30px' : '50px', display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.25)'
              }}>
                <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Dial circle back */}
                  <circle cx="50" cy="50" r="44" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
                  
                  {/* Gateway C arc */}
                  <path d="M68 28C58 20 42 20 32 30C22 40 22 58 32 68C42 78 58 78 68 70" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" />
                  
                  {/* Forwarding Way track W */}
                  <path d="M38 46L48 68L56 50L64 68L78 36" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Arrow head guiding point */}
                  <path d="M72 36H78V42" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ marginTop: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>CUSWAY</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                  Customs Copilot System
                </p>
              </div>
            </div>

            {/* Form Mode Toggle Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '8px' }}>
              <button 
                onClick={() => { setIsSigningUp(false); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: !isSigningUp ? '2px solid var(--accent-primary)' : 'none',
                  color: !isSigningUp ? '#fff' : 'var(--text-muted)',
                  fontWeight: !isSigningUp ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                로그인
              </button>
              <button 
                onClick={() => { setIsSigningUp(true); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isSigningUp ? '2px solid var(--accent-primary)' : 'none',
                  color: isSigningUp ? '#fff' : 'var(--text-muted)',
                  fontWeight: isSigningUp ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                무료 회원가입
              </button>
            </div>

            {/* Login Form */}
            {!isSigningUp ? (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    계정 이메일
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="email" 
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    비밀번호
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 40px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                {loginError && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '6px',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ShieldAlert size={14} />
                    <span>{loginError}</span>
                  </div>
                )}

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
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.2)'
                  }}
                >
                  로그인
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                    이메일 주소
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                    비밀번호
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="8자리 이상 입력"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                    회사명 / 법인명
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="예: 서울관세법인, 개인화주"
                    value={signupCompanyName}
                    onChange={(e) => setSignupCompanyName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      회원 구분
                    </label>
                    <select
                      value={signupUserType}
                      onChange={(e) => setSignupUserType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: '#1e293b',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.82rem'
                      }}
                    >
                      <option value="general_user">일반인 / 일반 화주 (가중치 0.5~)</option>
                      <option value="practitioner">수출입 기업 실무자 (가중치 1.0~)</option>
                      <option value="broker">전문 관세사 (가중치 1.5~)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                      실무 경력 (년)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      max="60"
                      value={signupYears}
                      onChange={(e) => setSignupYears(Number(e.target.value))}
                      disabled={signupUserType === 'general_user'}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: signupUserType === 'general_user' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        color: signupUserType === 'general_user' ? 'rgba(255,255,255,0.2)' : '#fff',
                        fontSize: '0.82rem'
                      }}
                    />
                  </div>
                </div>

                {loginError && (
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '6px',
                    color: '#fca5a5',
                    fontSize: '0.75rem'
                  }}>
                    <span>{loginError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '10px',
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.15)',
                    marginTop: '4px'
                  }}
                >
                  가입 및 본인 가중치 자동 생성
                </button>
              </form>
            )}

            {/* Social Logins Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '4px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
              <span>또는 간편 로그인</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
            </div>

            {/* Social Logins Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Kakao Login */}
              <button 
                onClick={() => {
                  alert('카카오 간편 로그인 페이지로 이동합니다. (데모 자동 승인)');
                  setIsLoggedIn(true);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#FEE500',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000000',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(254, 229, 0, 0.15)'
                }}
              >
                <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>💬</span> 카카오 계정으로 로그인
              </button>

              {/* Naver Login */}
              <button 
                onClick={() => {
                  alert('네이버 간편 로그인 페이지로 이동합니다. (데모 자동 승인)');
                  setIsLoggedIn(true);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#03C75A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(3, 199, 90, 0.15)'
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 900 }}>N</span> 네이버 아이디로 로그인
              </button>
            </div>

            {/* Test Account Helper */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              lineHeight: '1.4'
            }}>
              🔑 <b>테스트 데모 계정:</b> <code style={{ color: 'var(--accent-primary)' }}>admin@cusway.kr</code> / <code style={{ color: 'var(--accent-primary)' }}>pjhcustoms2026!</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Dynamic Glow Effect */}
      <div className="glow-effect" style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', left: '-100px', background: 'rgba(20, 184, 166, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div className="glow-effect" style={{ position: 'absolute', width: '600px', height: '600px', bottom: '-200px', right: '-200px', background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Side / Top Navigation Bar */}
      <aside className="app-sidebar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
          {/* Logo & User profile row (condensed on mobile) */}
          <div className="app-sidebar-logo-container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)'
              }}>
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M68 28C58 20 42 20 32 30C22 40 22 58 32 68C42 78 58 78 68 70" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M38 46L48 68L56 50L64 68L78 36" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M72 36H78V42" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1 }}>CUSWAY</h1>
                <p style={{ fontSize: '0.55rem', color: 'var(--accent-primary)', fontWeight: 700, margin: 0 }}>AI SERVICE</p>
              </div>
            </div>

            {/* Quick Logout for Mobile Header */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {currentUser?.company_name.split(' ')[0]}
                </span>
                <LogOut size={16} onClick={handleLogout} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>
            )}
          </div>

          {/* Navigation Menu (Horizontal scrollable on mobile) */}
          <nav className="app-sidebar-nav">
            <button 
              onClick={() => setCurrentView('hs-classifier')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'hs-classifier' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'hs-classifier' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'hs-classifier' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Scale size={14} color={currentView === 'hs-classifier' ? 'var(--accent-primary)' : 'gray'} />
              <span>AI HS 분류</span>
            </button>

            <button 
              onClick={() => setCurrentView('clearance-wizard')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'clearance-wizard' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: currentView === 'clearance-wizard' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'clearance-wizard' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Sparkles size={14} color={currentView === 'clearance-wizard' ? 'var(--accent-cyan)' : 'gray'} />
              <span style={{ color: currentView === 'clearance-wizard' ? 'var(--accent-cyan)' : 'inherit' }}>통관 파이프라인</span>
            </button>

            <button 
              onClick={() => setCurrentView('valuation')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'valuation' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'valuation' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'valuation' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Scale size={14} color={currentView === 'valuation' ? 'var(--accent-cyan)' : 'gray'} />
              <span style={{ color: currentView === 'valuation' ? 'var(--accent-cyan)' : 'inherit' }}>
                AI 관세평가
              </span>
            </button>

            <button 
              onClick={() => setCurrentView('cashback')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'cashback' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'cashback' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'cashback' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Coins size={14} color={currentView === 'cashback' ? 'var(--accent-amber)' : 'gray'} />
              <span style={{ color: currentView === 'cashback' ? 'var(--accent-amber)' : 'inherit' }}>
                결정례 캐시백
              </span>
            </button>

            <button 
              onClick={() => setCurrentView('billing')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'billing' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'billing' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'billing' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <CreditCard size={14} color={currentView === 'billing' ? 'var(--accent-primary)' : 'gray'} />
              <span style={{ color: currentView === 'billing' ? 'var(--accent-primary)' : 'inherit' }}>
                요금 구독
              </span>
            </button>

            {currentUser?.email === 'admin@cusway.kr' && (
              <button 
                onClick={() => setCurrentView('admin')}
                className="app-sidebar-nav-btn"
                style={{
                  background: currentView === 'admin' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                  color: currentView === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: currentView === 'admin' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <ShieldAlert size={14} color={currentView === 'admin' ? 'var(--accent-red)' : 'gray'} />
                <span style={{ color: currentView === 'admin' ? 'var(--accent-red)' : 'inherit' }}>
                  어드민
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* User Status / Bottom Menu (Hidden on mobile navigation aside) */}
        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={16} />
              </div>
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser?.company_name || 'CUSWAY 관세팀'}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser?.email || 'admin@cusway.kr'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', color: 'var(--text-muted)' }}>
              <Settings size={18} style={{ cursor: 'pointer' }} />
              <Bell size={18} style={{ cursor: 'pointer' }} />
              <LogOut size={18} onClick={handleLogout} style={{ cursor: 'pointer' }} />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {currentView === 'hs-classifier' && (
          <HsClassifier 
            currentUser={currentUser} 
            onNavigateToWizard={(hs, kw, mat, fn) => {
              setWizardHsCode(hs);
              setWizardKeyword(kw);
              setWizardMaterial(mat);
              setWizardFunction(fn);
              setCurrentView('clearance-wizard');
            }}
          />
        )}
        {currentView === 'clearance-wizard' && (
          <ClearanceWizard 
            currentUser={currentUser} 
            initialHsCode={wizardHsCode}
            initialKeyword={wizardKeyword}
            initialMaterial={wizardMaterial}
            initialFunction={wizardFunction}
          />
        )}
        {currentView === 'valuation' && (
          <ValuationPrecedents currentUser={currentUser} />
        )}
        {currentView === 'cashback' && (
          <CashBackManager currentUser={currentUser} />
        )}
        {currentView === 'admin' && currentUser?.email === 'admin@cusway.kr' && (
          <AdminPortal currentUser={currentUser} />
        )}
        {currentView === 'billing' && (
          <BillingPortal currentUser={currentUser} onSubscribeSuccess={(updatedUser: any) => setCurrentUser(updatedUser)} />
        )}
      </main>
    </div>
  )
}
