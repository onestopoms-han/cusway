import { useState } from 'react'
import { Scale, Settings, Bell, LogOut, User, Lock, Mail, ShieldAlert, Coins, CreditCard } from 'lucide-react'
import HsClassifier from './components/HsClassifier'
import CashBackManager from './components/CashBackManager'
import ValuationPrecedents from './components/ValuationPrecedents'
import AdminPortal from './components/AdminPortal'
import BillingPortal from './components/BillingPortal'

export default function App() {
  interface UserInfo {
    email: string;
    company_name: string;
    plan: string;
    status: string;
    accrued_points: number;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentView, setCurrentView] = useState<'hs-classifier' | 'valuation' | 'cashback' | 'admin' | 'billing'>('hs-classifier');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || '로그인에 실패했습니다.');
      }

      const userData = await response.json();
      setCurrentUser(userData);
      setIsLoggedIn(true);
    } catch (err: any) {
      // API 서버가 켜져 있지 않을 때의 예외 하방 대비용 로컬 데모 모드 작동
      if (email === 'admin@cusway.kr' && password === 'pjhcustoms2026!') {
        const fallbackUser = {
          email: 'admin@cusway.kr',
          company_name: 'CUSWAY 관세팀 (로컬 데모)',
          plan: 'Business',
          status: 'Active',
          accrued_points: 15000
        };
        setCurrentUser(fallbackUser);
        setIsLoggedIn(true);
        console.warn('FastAPI 백엔드가 구동되지 않아 로컬 목업 세션으로 시뮬레이션 작동합니다.');
      } else {
        setLoginError(err.message || '백엔드 서버와 통신할 수 없습니다.');
      }
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
        width: '100%'
      }}>
        {/* Decorative Glows */}
        <div style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', left: '-100px', background: 'rgba(20, 184, 166, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', bottom: '-150px', right: '-150px', background: 'rgba(6, 182, 212, 0.12)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
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
                
                {/* Gateway C arc (representing Customs boundary / gateway) */}
                <path d="M68 28C58 20 42 20 32 30C22 40 22 58 32 68C42 78 58 78 68 70" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" />
                
                {/* Forwarding Way track W (representing clear route) */}
                <path d="M38 46L48 68L56 50L64 68L78 36" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Arrow head guiding point */}
                <path d="M72 36H78V42" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ marginTop: '8px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>CUSWAY</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '2px' }}>
                HS Code & Valuation
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                관세사 계정 이메일
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

          {/* Social Logins Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
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
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4'
          }}>
            🔑 <b>테스트 계정 정보:</b><br />
            - 이메일: <code style={{ color: 'var(--accent-primary)' }}>admin@cusway.kr</code><br />
            - 비밀번호: <code style={{ color: 'var(--accent-primary)' }}>pjhcustoms2026!</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', width: '100%' }}>
      {/* Dynamic Glow Effect */}
      <div className="glow-effect" style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', left: '-100px', background: 'rgba(20, 184, 166, 0.15)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div className="glow-effect" style={{ position: 'absolute', width: '600px', height: '600px', bottom: '-200px', right: '-200px', background: 'rgba(245, 158, 11, 0.1)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Side Navigation Bar */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', padding: '0 10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)'
            }}>
              <svg width="26" height="26" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gateway C arc */}
                <path d="M68 28C58 20 42 20 32 30C22 40 22 58 32 68C42 78 58 78 68 70" stroke="var(--accent-cyan)" strokeWidth="8" strokeLinecap="round" />
                
                {/* Forwarding Way track W */}
                <path d="M38 46L48 68L56 50L64 68L78 36" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Arrow head */}
                <path d="M72 36H78V42" stroke="var(--accent-primary)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>CUSWAY</h1>
              <p style={{ fontSize: '0.65rem', color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '0.5px' }}>HS & VALUATION AI</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setCurrentView('hs-classifier')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'hs-classifier' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'hs-classifier' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'hs-classifier' ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Scale size={18} color={currentView === 'hs-classifier' ? 'var(--accent-primary)' : 'gray'} />
              <span>AI HS Code 분류 & 근거</span>
            </button>

            <button 
              onClick={() => setCurrentView('valuation')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'valuation' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'valuation' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'valuation' ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Scale size={18} color={currentView === 'valuation' ? 'var(--accent-cyan)' : 'gray'} />
              <span style={{ color: currentView === 'valuation' ? 'var(--accent-cyan)' : 'inherit' }}>
                AI 관세평가 판례 검색
              </span>
            </button>

            <button 
              onClick={() => setCurrentView('cashback')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'cashback' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'cashback' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'cashback' ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <Coins size={18} color={currentView === 'cashback' ? 'var(--accent-amber)' : 'gray'} />
              <span style={{ color: currentView === 'cashback' ? 'var(--accent-amber)' : 'inherit' }}>
                결정례 공유 & 캐시백
              </span>
            </button>

            <button 
              onClick={() => setCurrentView('billing')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'billing' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: currentView === 'billing' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'billing' ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <CreditCard size={18} color={currentView === 'billing' ? 'var(--accent-primary)' : 'gray'} style={{ flexShrink: 0 }} />
              <span style={{ color: currentView === 'billing' ? 'var(--accent-primary)' : 'inherit' }}>
                요금 결제 & 구독 관리
              </span>
            </button>

            <button 
              onClick={() => setCurrentView('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: currentView === 'admin' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                color: currentView === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'admin' ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'var(--transition-smooth)'
              }}
            >
              <ShieldAlert size={18} color={currentView === 'admin' ? 'var(--accent-red)' : 'gray'} />
              <span style={{ color: currentView === 'admin' ? 'var(--accent-red)' : 'inherit' }}>
                ⚙️ 어드민 고객관리
              </span>
            </button>
          </nav>
        </div>

        {/* User Status / Bottom Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
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
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', position: 'relative', zIndex: 5 }}>
        {currentView === 'hs-classifier' && (
          <HsClassifier />
        )}
        {currentView === 'valuation' && (
          <ValuationPrecedents currentUser={currentUser} />
        )}
        {currentView === 'cashback' && (
          <CashBackManager currentUser={currentUser} />
        )}
        {currentView === 'admin' && (
          <AdminPortal currentUser={currentUser} />
        )}
        {currentView === 'billing' && (
          <BillingPortal currentUser={currentUser} onSubscribeSuccess={(updatedUser: any) => setCurrentUser(updatedUser)} />
        )}
      </main>
    </div>
  )
}
