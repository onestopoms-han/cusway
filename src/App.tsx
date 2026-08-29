import { useState, useEffect } from 'react'
import { Scale, Settings, Bell, LogOut, User, Lock, Mail, ShieldAlert, Coins, CreditCard, Sparkles, RefreshCw, BookOpen } from 'lucide-react'
import HsClassifier from './components/HsClassifier'
import CashBackManager from './components/CashBackManager'
import ValuationPrecedents from './components/ValuationPrecedents'
import AdminPortal from './components/AdminPortal'
import BillingPortal from './components/BillingPortal'
import ClearanceWizard from './components/ClearanceWizard'
import LawNewsPortal from './components/LawNewsPortal'

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentView, setCurrentView] = useState<'hs-classifier' | 'clearance-wizard' | 'valuation' | 'cashback' | 'admin' | 'billing' | 'law-news'>('law-news');
  
  // Signup states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCompanyName, setSignupCompanyName] = useState('');
  const [signupUserType, setSignupUserType] = useState<string>('general_user');
  const [signupYears, setSignupYears] = useState<number>(0);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Upgrade weight states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeUserType, setUpgradeUserType] = useState<string>('broker');
  const [upgradeYears, setUpgradeYears] = useState<number>(1);

  // Settings modal states (for updating company name / password change)
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsCompanyName, setSettingsCompanyName] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');

  // States for transferring details to ClearanceWizard
  const [wizardHsCode, setWizardHsCode] = useState('2009.89-1090');
  const [wizardKeyword, setWizardKeyword] = useState('배 주스');
  const [wizardMaterial, setWizardMaterial] = useState('배 과즙 100%');
  const [wizardFunction, setWizardFunction] = useState('음료 제조용 원료');

  interface SocialConfig {
    kakao_client_id: string;
    google_client_id: string;
  }
  const [socialConfig, setSocialConfig] = useState<SocialConfig | null>(null);
  const [isSocialProcessing, setIsSocialProcessing] = useState(false);

  useEffect(() => {
    // 1. Fetch social config
    fetch('/api/auth/social/config')
      .then(res => res.json())
      .then(data => setSocialConfig(data))
      .catch(err => console.warn('Failed to load social config', err));

    // 2. Detect OAuth callback code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && (state === 'kakao' || state === 'google')) {
      setIsSocialProcessing(true);
      
      // Clean query parameters from URL without reloading
      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      const endpoint = state === 'kakao' ? '/api/auth/social/kakao' : '/api/auth/social/google';
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: window.location.origin + "/" })
      })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data);
          setIsLoggedIn(true);
          alert('소셜 로그인/가입이 완료되었습니다!');
        } else {
          const errData = await res.json();
          alert(`소셜 인증 실패: ${errData.detail || '알 수 없는 오류'}`);
        }
      })
      .catch(err => {
        console.error('Social auth error:', err);
        alert('소셜 로그인 통신 중 오류가 발생했습니다.');
      })
      .finally(() => {
        setIsSocialProcessing(false);
      });
    }
  }, []);

  const handleKakaoRedirect = () => {
    const clientId = socialConfig?.kakao_client_id || 'demo_kakao_client_id_12345';
    const redirectUri = window.location.origin + "/";
    if (clientId === 'demo_kakao_client_id_12345') {
      alert('데모 간편 로그인을 실행합니다 (데모 인증 코드 전달)');
      window.location.href = `${window.location.protocol}//${window.location.host}/?code=demo_kakao_code_12345&state=kakao`;
    } else {
      const authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=kakao`;
      window.location.href = authUrl;
    }
  };

  const handleGoogleRedirect = () => {
    const clientId = socialConfig?.google_client_id || 'demo_google_client_id_12345.apps.googleusercontent.com';
    const redirectUri = window.location.origin + "/";
    if (clientId.startsWith('demo_')) {
      alert('데모 간편 로그인을 실행합니다 (데모 인증 코드 전달)');
      window.location.href = `${window.location.protocol}//${window.location.host}/?code=demo_google_code_12345&state=google`;
    } else {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('email profile')}&state=google`;
      window.location.href = authUrl;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // 1. 브라우저 로컬 저장소 우선 확인 (서버리스 인스턴스 초기화 대비 세이프 가드)
    const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
    const matchedLocal = localUsers.find((u: any) => u.email === email && u.password === password);
    if (matchedLocal) {
      setCurrentUser(matchedLocal.profile);
      setIsLoggedIn(true);
      console.log('로컬 저장소 매칭 로그인 성공:', matchedLocal.profile);
      return;
    }

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
      console.error('API 로그인 실패:', err);
      setLoginError('서버 연결에 실패했거나 로그인 처리 중 오류가 발생했습니다.');
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
        const data = await response.json();
        
        // 가입 성공 회원 정보를 브라우저 로컬 저장소에 백업하여 유지
        const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
        localUsers.push({
          email: signupEmail,
          password: signupPassword,
          profile: data
        });
        localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));

        setSignupSuccess(true);
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
      console.warn('API 회원가입 통신 실패, 클라이언트 로컬 세션으로 가입 처리합니다:', err);
      // 서버 장애 시에도 화주/관세사 가입이 가능하도록 로컬 처리
      const y = Number(signupYears);
      let weight = 1.0;
      if (signupUserType === 'broker') {
        weight = Math.min(3.0, 1.5 + y * 0.1);
      } else if (signupUserType === 'practitioner') {
        weight = Math.min(2.0, 1.0 + y * 0.05);
      } else {
        weight = Math.min(1.0, 0.5 + y * 0.02);
      }

      const clientProfile = {
        email: signupEmail,
        company_name: signupCompanyName,
        plan: 'Basic',
        status: 'Active',
        accrued_points: 1000,
        user_type: signupUserType,
        years_of_experience: y,
        credibility_weight: weight,
        join_date: new Date().toISOString().split('T')[0]
      };

      const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
      localUsers.push({
        email: signupEmail,
        password: signupPassword,
        profile: clientProfile
      });
      localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));

      setEmail(signupEmail);
      setPassword(signupPassword);
      setIsSigningUp(false);
      setSignupEmail('');
      setSignupPassword('');
      setSignupCompanyName('');
      setSignupUserType('general_user');
      setSignupYears(0);
      alert('회원가입이 완료되었습니다! (브라우저 로컬 데이터 안전 가입 완료)');
    }
  };

  const triggerSocialSignup = async (sEmail: string, sPass: string, sCompany: string) => {
    setLoginError('');
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: sEmail,
          password: sPass,
          company_name: sCompany,
          user_type: 'general_user',
          years_of_experience: 0
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save user to localStorage
        const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
        localUsers.push({
          email: sEmail,
          password: sPass,
          profile: data
        });
        localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));

        setCurrentUser(data);
        setIsLoggedIn(true);
        alert(`${sCompany} 간편 가입 및 로그인이 완료되었습니다!`);
      } else {
        const errData = await response.json();
        alert(errData.detail || '간편 가입 처리에 실패했습니다.');
      }
    } catch (err) {
      console.warn('API 간편가입 실패, 로컬 브라우저 세션 모드로 가입 처리합니다:', err);
      const clientProfile = {
        email: sEmail,
        company_name: sCompany,
        plan: 'Basic',
        status: 'Active',
        accrued_points: 1000,
        user_type: 'general_user',
        years_of_experience: 0,
        credibility_weight: 0.5,
        join_date: new Date().toISOString().split('T')[0]
      };

      const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
      localUsers.push({
        email: sEmail,
        password: sPass,
        profile: clientProfile
      });
      localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));

      setCurrentUser(clientProfile);
      setIsLoggedIn(true);
      alert(`${sCompany} 로컬 간편 가입 및 로그인이 완료되었습니다!`);
    }
  };

  const triggerSocialLogin = async (sEmail: string, sPass: string) => {
    setLoginError('');
    // 1. Check local storage first
    const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
    const matchedLocal = localUsers.find((u: any) => u.email === sEmail && u.password === sPass);
    if (matchedLocal) {
      setCurrentUser(matchedLocal.profile);
      setIsLoggedIn(true);
      console.log('로컬 저장소 간편 로그인 성공:', matchedLocal.profile);
      alert('간편 로그인 성공!');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: sEmail, password: sPass })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        setIsLoggedIn(true);
        console.log('API 간편 로그인 성공:', data);
        alert('간편 로그인 성공!');
      } else {
        alert('간편 가입이 되어 있지 않은 계정입니다. 회원가입 탭에서 먼저 가입을 진행해 주세요.');
        setIsSigningUp(true); // Switch to signup tab
      }
    } catch (err) {
      console.warn('API 로그인 실패, 데모 모드로 로그인합니다:', err);
      const clientProfile = {
        email: sEmail,
        company_name: sEmail.includes('kakao') ? '카카오 연동 데모기업' : '구글 연동 데모기업',
        plan: 'Basic',
        status: 'Active',
        accrued_points: 1000,
        user_type: 'general_user',
        years_of_experience: 0,
        credibility_weight: 0.5,
        join_date: new Date().toISOString().split('T')[0]
      };
      setCurrentUser(clientProfile);
      setIsLoggedIn(true);
      alert('간편 데모 로그인 완료 (오프라인 모드)');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  const handleUpgradeWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const response = await fetch('/api/users/upgrade-weight', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: currentUser.email,
          user_type: upgradeUserType,
          years_of_experience: Number(upgradeYears)
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        
        // Update local storage backup
        const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
        const idx = localUsers.findIndex((u: any) => u.email === currentUser.email);
        if (idx !== -1) {
          localUsers[idx].profile = updatedUser;
          localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));
        }

        alert(`전문가 가중치 인증 완료! 등급: ${upgradeUserType === 'broker' ? '관세사' : '실무자'}, 가중치: ${updatedUser.credibility_weight}점으로 승격되었습니다.`);
        setShowUpgradeModal(false);
      } else {
        alert('가중치 업데이트에 실패했습니다.');
      }
    } catch (err) {
      console.warn('API 업데이트 실패, 로컬 브라우저 상태를 변경합니다:', err);
      // Fallback local updates for offline/serverless
      const y = Number(upgradeYears);
      let weight = 1.0;
      if (upgradeUserType === 'broker') {
        weight = Math.min(3.0, 1.5 + y * 0.1);
      } else if (upgradeUserType === 'practitioner') {
        weight = Math.min(2.0, 1.0 + y * 0.05);
      }
      
      const updatedUser = {
        ...currentUser,
        user_type: upgradeUserType,
        years_of_experience: y,
        credibility_weight: weight
      };
      setCurrentUser(updatedUser);

      const localUsers = JSON.parse(localStorage.getItem('cusway_local_users') || '[]');
      const idx = localUsers.findIndex((u: any) => u.email === currentUser.email);
      if (idx !== -1) {
        localUsers[idx].profile = updatedUser;
        localStorage.setItem('cusway_local_users', JSON.stringify(localUsers));
      }

      alert(`전문가 가중치 로컬 승인 완료! 등급: ${upgradeUserType === 'broker' ? '관세사' : '실무자'}, 가중치: ${weight}점`);
      setShowUpgradeModal(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSettingsError('');

    try {
      const response = await fetch('/api/users/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: currentUser.email,
          company_name: settingsCompanyName,
          password: settingsPassword || undefined
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        alert('회원 정보가 성공적으로 수정되었습니다.');
        setShowSettingsModal(false);
      } else {
        const errData = await response.json();
        setSettingsError(errData.detail || '정보 수정에 실패했습니다.');
      }
    } catch (err) {
      console.warn('API 업데이트 실패, 로컬 브라우저 상태를 변경합니다:', err);
      // Local fallback for offline/demo mode
      const updatedUser = {
        ...currentUser,
        company_name: settingsCompanyName
      };
      setCurrentUser(updatedUser);
      alert('회원 정보 로컬 수정 완료 (오프라인 모드)');
      setShowSettingsModal(false);
    }
  };

  if (isSocialProcessing) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        gap: '16px'
      }}>
        <RefreshCw className="animate-spin" size={48} color="var(--accent-primary)" />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>소셜 로그인 처리 중...</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>잠시만 기다려 주세요.</p>
      </div>
    );
  }

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

        <div style={{
          width: '100%',
          maxWidth: isMobile ? '440px' : '960px',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(30, 41, 59, 0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
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
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', lineHeight: 1.5 }}>
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
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', lineHeight: 1.4 }}>
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
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', lineHeight: 1.4 }}>
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
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', lineHeight: 1.4 }}>
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

            {/* Form Mode Toggle Tabs */}
            <div style={{ display: 'flex', borderBottom: '2px solid rgba(255,255,255,0.06)', marginBottom: '8px' }}>
              <button 
                type="button"
                onClick={() => { setIsSigningUp(false); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: !isSigningUp ? '2px solid var(--accent-primary)' : 'none',
                  color: !isSigningUp ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s'
                }}
              >
                로그인
              </button>
              <button 
                type="button"
                onClick={() => { setIsSigningUp(true); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  borderBottom: isSigningUp ? '2px solid var(--accent-primary)' : 'none',
                  color: isSigningUp ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s'
                }}
              >
                회원가입
              </button>
            </div>

            {/* Login / Signup Forms */}
            {!isSigningUp ? (
              <>
                {/* Login Form */}
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

                {/* Social Logins Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '12px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                  <span>또는 간편 로그인</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                </div>

                {/* Social Logins Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {/* Kakao Login */}
                  <button 
                    onClick={() => {
                      alert('카카오 간편 로그인 페이지로 이동합니다.');
                      handleKakaoRedirect();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#FEE500',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>💬</span> 카카오 계정으로 로그인
                  </button>

                  {/* Google Login */}
                  <button 
                    onClick={() => {
                      alert('Google 간편 로그인 페이지로 이동합니다.');
                      handleGoogleRedirect();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#374151',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Google 계정으로 로그인 (지메일)
                  </button>
                </div>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>아직 계정이 없으신가요? </span>
                  <button 
                    type="button" 
                    onClick={() => { setIsSigningUp(true); setLoginError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                  >
                    회원가입하기
                  </button>
                </div>
              </>
            ) : (
              /* Signup Form */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '10px 0' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5', marginBottom: '8px' }}>
                  이메일 입력과 비밀번호 설정 없는<br />
                  <b>1초 간편 연동 가입</b>으로 즉시 시작하세요.
                </p>

                {/* Social Signup Prompters */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    type="button"
                    onClick={() => {
                      alert('카카오 간편 회원가입 페이지로 이동합니다.');
                      handleKakaoRedirect();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#FEE500',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    💬 카카오 계정으로 1초 간편가입
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      alert('Google 간편 회원가입 페이지로 이동합니다.');
                      handleGoogleRedirect();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#3c4043',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    Google 계정으로 간편가입 (지메일)
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b7280', fontSize: '0.72rem', margin: '14px 0 6px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                  <span>또는 이메일 회원가입</span>
                  <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', marginBottom: '6px', fontWeight: 700 }}>
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
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#111827',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', marginBottom: '6px', fontWeight: 700 }}>
                      비밀번호 (8자리 이상)
                    </label>
                    <input 
                      type="password" 
                      required
                      minLength={8}
                      placeholder="비밀번호 설정"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#111827',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', marginBottom: '6px', fontWeight: 700 }}>
                      회사명 / 법인명 / 이름
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="예: 서울관세법인, 개인화주"
                      value={signupCompanyName}
                      onChange={(e) => setSignupCompanyName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: '#ffffff',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        color: '#111827',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', marginBottom: '6px', fontWeight: 700 }}>
                        회원 구분
                      </label>
                      <select 
                        value={signupUserType}
                        onChange={(e) => setSignupUserType(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#ffffff',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          color: '#111827',
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="general_user">일반 이용자</option>
                        <option value="practitioner">기업 실무자</option>
                        <option value="broker">관세사 / 전문가</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', marginBottom: '6px', fontWeight: 700 }}>
                        실무 경력 (년)
                      </label>
                      <input 
                        type="number" 
                        min="0"
                        max="60"
                        required
                        value={signupYears}
                        onChange={(e) => setSignupYears(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: '#ffffff',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          color: '#111827',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  {loginError && (
                    <div style={{
                      padding: '10px 14px',
                      background: '#fef2f2',
                      border: '1px solid #fca5a5',
                      borderRadius: '8px',
                      color: '#991b1b',
                      fontSize: '0.78rem'
                    }}>
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '12px',
                      background: '#000000',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 750,
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      marginTop: '8px'
                    }}
                  >
                    무료 회원가입 완료
                  </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>이미 계정이 있으신가요? </span>
                  <button 
                    type="button" 
                    onClick={() => { setIsSigningUp(false); setLoginError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                  >
                    로그인하기
                  </button>
                </div>
              </div>
            )}
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
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(13, 148, 136, 0.15)'
              }}>
                <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M68 28C58 20 42 20 32 30C22 40 22 58 32 68C42 78 58 78 68 70" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
                  <path d="M38 46L48 68L56 50L64 68L78 36" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M72 36H78V42" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-main)', margin: 0, lineHeight: 1 }}>CUSWAY</h1>
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
              onClick={() => setCurrentView('law-news')}
              className="app-sidebar-nav-btn"
              style={{
                background: currentView === 'law-news' ? 'rgba(20, 184, 166, 0.12)' : 'transparent',
                color: currentView === 'law-news' ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: currentView === 'law-news' ? 600 : 400,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              <BookOpen size={14} color={currentView === 'law-news' ? 'var(--accent-primary)' : 'gray'} />
              <span style={{ color: currentView === 'law-news' ? 'var(--accent-primary)' : 'inherit' }}>법령/뉴스</span>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    background: 'rgba(20, 184, 166, 0.12)',
                    color: 'var(--accent-primary)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    가중치 {currentUser?.credibility_weight || 1.0}점
                  </span>
                  {currentUser?.user_type === 'general_user' && (
                    <span 
                      onClick={() => setShowUpgradeModal(true)}
                      style={{
                        fontSize: '0.62rem',
                        background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                        color: '#000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: '0 0 5px rgba(6,182,212,0.3)'
                      }}
                    >
                      업그레이드 ⚡
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', color: 'var(--text-muted)' }}>
              <Settings 
                size={18} 
                onClick={() => {
                  setSettingsCompanyName(currentUser?.company_name || '');
                  setSettingsPassword('');
                  setSettingsError('');
                  setShowSettingsModal(true);
                }}
                style={{ cursor: 'pointer' }} 
              />
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
        {currentView === 'law-news' && (
          <LawNewsPortal currentUser={currentUser} />
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

      {/* Weight Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(6, 182, 212, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>⚡ 전문가 권한 및 가중치 업그레이드</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
                관세사 면허 또는 수출입 실무 경력을 인증하시면, 합의 판결 참여 시 귀하의 의견 반영 비율(가중치)이 상향 조정됩니다.
              </p>
            </div>

            <form onSubmit={handleUpgradeWeight} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  인증 등급 선택
                </label>
                <select
                  value={upgradeUserType}
                  onChange={(e) => setUpgradeUserType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1e293b',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="broker">전문 관세사 (기본 1.5점 ~ 최대 3.0점)</option>
                  <option value="practitioner">수출입 기업 실무자 (기본 1.0점 ~ 최대 2.0점)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  실무 경력 년수
                </label>
                <input 
                  type="number"
                  required
                  min="0"
                  max="60"
                  value={upgradeYears}
                  onChange={(e) => setUpgradeYears(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#000',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.2)'
                  }}
                >
                  인증 및 상향 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings / Password Change Modal */}
      {showSettingsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>⚙️ 회원정보 및 비밀번호 변경</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
                회사명(이름)을 수정하거나, 계정의 새로운 접속 비밀번호를 안전하게 설정할 수 있습니다.
              </p>
            </div>

            {settingsError && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>
                ⚠️ {settingsError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  가입 계정 이메일
                </label>
                <input 
                  type="text"
                  disabled
                  value={currentUser?.email || ''}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    cursor: 'not-allowed'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  회사명 / 성함
                </label>
                <input 
                  type="text"
                  required
                  value={settingsCompanyName}
                  onChange={(e) => setSettingsCompanyName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  새로운 비밀번호 (변경시에만 입력)
                </label>
                <input 
                  type="password"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
                  placeholder="새로운 비밀번호 입력 (4자 이상)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  수정 사항 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
