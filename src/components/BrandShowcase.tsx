import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Coins, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Building2, 
  QrCode, 
  Lock, 
  HelpCircle, 
  TrendingUp, 
  Users, 
  Award,
  ChevronRight,
  Eye,
  Settings,
  Flame,
  Check,
  XCircle
} from 'lucide-react';
import { getSavedOfficeBranding, OfficeBranding } from './OfficeBrandingModal';
import MarketingBrochureModal from './MarketingBrochureModal';
import CustomsReportModal from './CustomsReportModal';

interface BrandShowcaseProps {
  onNavigate: (view: 'hs-classifier' | 'clearance-wizard' | 'valuation' | 'cashback' | 'billing' | 'law-news') => void;
  onOpenBranding: () => void;
  onOpenKakaoConsult: () => void;
  currentUser?: any;
}

export default function BrandShowcase({ 
  onNavigate, 
  onOpenBranding, 
  onOpenKakaoConsult,
  currentUser 
}: BrandShowcaseProps) {
  const [activeTab, setActiveTab] = useState<'branding' | 'cashback' | 'pipeline' | 'valuation'>('branding');
  const [branding, setBranding] = useState<OfficeBranding>(() => getSavedOfficeBranding(currentUser));
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [showSampleReportModal, setShowSampleReportModal] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setBranding(getSavedOfficeBranding(currentUser));
    };
    window.addEventListener('office-branding-updated', handleUpdate);
    return () => window.removeEventListener('office-branding-updated', handleUpdate);
  }, [currentUser]);

  useEffect(() => {
    setBranding(getSavedOfficeBranding(currentUser));
  }, [currentUser]);
  
  // Interactive Cashback Simulator State
  const [simDocType, setSimDocType] = useState<'confidential' | 'public'>('confidential');
  const [simDecision, setSimDecision] = useState<'overturned' | 'upheld'>('overturned');
  
  // Interactive ROI Calculator State
  const [teamSize, setTeamSize] = useState<number>(5);

  // Calculate cashback simulation
  const calcBase = 10000;
  const calcConf = simDocType === 'confidential' ? 20000 : 5000;
  const calcDec = simDecision === 'overturned' ? 15000 : 5000;
  const calcScarcity = simDocType === 'confidential' ? 5000 : 0;
  const totalCashback = Math.min(50000, calcBase + calcConf + calcDec + calcScarcity);

  // Calculate ROI
  const savedHoursPerMonth = teamSize * 38; // 38 hours saved per person/month
  const savedCostPerMonth = teamSize * 1140000; // 1.14M KRW saved in labor cost per person
  const cuswayMonthlyCost = teamSize <= 1 ? 0 : teamSize <= 5 ? 44000 : teamSize <= 10 ? 71500 : 290000;
  const roiMultiplier = Math.round(savedCostPerMonth / (cuswayMonthlyCost || 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingBottom: '60px' }}>
      
      {/* 1. Hero Section: Powerful Value Proposition */}
      <section style={{
        position: 'relative',
        borderRadius: '24px',
        padding: '56px 40px',
        background: 'radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.18) 0%, rgba(15, 23, 42, 0.95) 60%), linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 1) 100%)',
        border: '1.5px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        overflow: 'hidden'
      }}>
        {/* Ambient glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-50px',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            width: 'fit-content'
          }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.02em' }}>
              대한민국 1위 관세 AI 코파일럿 | WCO 해설서 & 9,450건 판례 마스터 기반
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 900,
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            margin: 0
          }}>
            해설서 검색에 쓰던 <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>하루 3시간</span>,<br />
            <span style={{ 
              background: 'linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              3초 만에 끝내고
            </span> 진짜 관세 컨설팅에 집중하십시오.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            color: '#cbd5e1',
            lineHeight: 1.6,
            margin: 0
          }}>
            CUSWAY는 단순한 키워드 검색기가 아닙니다. 물품 규격 3줄 입력으로 <strong>통칙 1~6 적용 논리, WCO 해설서 본문, 관세청 결정례를 매핑한 법적 소명서(PDF)</strong>를 관세사무소 명의로 자동 발급합니다.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '10px' }}>
            <button
              onClick={() => onNavigate('hs-classifier')}
              style={{
                padding: '16px 28px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Zap size={18} fill="#000" />
              <span>3초 만에 내 품목 소명 리포트 뽑아보기 (무료)</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onOpenBranding}
              style={{
                padding: '16px 24px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Building2 size={18} color="var(--accent-cyan)" />
              <span>관세사무소 맞춤 로고/직인 설정</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              style={{
                padding: '16px 22px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 70, 239, 0.15) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                borderRadius: '12px',
                color: 'var(--accent-amber)',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <FileText size={18} color="var(--accent-amber)" />
              <span>📄 공식 브로슈어 인쇄/PDF</span>
            </button>
          </div>

          {/* Realtime Trust Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '20px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>9,450+ 건</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>관세청·WCO 판례 마스터 DB</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-amber)' }}>90% 절감</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>건당 소명서 작성 시간 (30분➔3초)</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#34d399' }}>무제한 동시접속</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>선착순 튕김 없는 팀 협업 환경</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#e879f9' }}>최대 50,000P</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>비공개 판례 캐시백 (구독료 0원화)</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive 4 Killer Feature Templates Showcase */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CORE VALUE PROPOSITION
          </span>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', margin: '8px 0 10px 0' }}>
            관세사와 기업을 압도하는 CUSWAY 4대 무기
          </h2>
          <p style={{ fontSize: '0.92rem', color: '#94a3b8', margin: 0 }}>
            탭을 클릭하여 CUSWAY가 실무 현장에서 어떻게 업무 속도를 10배 높이고 브랜딩을 강화하는지 확인하세요.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'branding', label: '🖨️ 관세사 맞춤 A4 의견서 & Co-Branding', badge: '화주 바이럴 1위' },
            { id: 'cashback', label: '💰 비공개 결정례 AI 가치 감정 & 캐시백', badge: '구독료 0원화' },
            { id: 'pipeline', label: '⚡ 4단계 원스톱 수입통관 파이프라인', badge: '요건/FTA 일괄' },
            { id: 'valuation', label: '⚖️ AI 관세평가 & 조세심판원 판례 허브', badge: '과세처분 방어' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                background: activeTab === t.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                border: activeTab === t.id ? '1.5px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                color: activeTab === t.id ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.label}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '6px',
                background: activeTab === t.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.1)',
                color: activeTab === t.id ? '#000' : '#cbd5e1',
                fontWeight: 800
              }}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content Display Cards */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1.5px solid #334155',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.4)'
        }}>

          {/* TAB 1: Co-Branding A4 Official Report Preview */}
          {activeTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    WHITE-LABEL & CO-BRANDING ENGINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                  화주에게 전송되는 의견서에<br />
                  <span style={{ color: 'var(--accent-cyan)' }}>자신들만의 관세사 상호와 직인</span>이 찍힙니다.
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  CUSWAY 설정에서 관세사무소 로고와 공인직인을 한 번만 등록해 두면, 모든 AI 품목분류·통관 사전심사 결과가 <strong>완벽한 A4 공문서 규격 PDF</strong>로 즉시 출력됩니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <span><strong>100% 관세사무소 명의:</strong> 상호명, 라이선스 번호, 붉은색 원형 직인 도장 적용</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <span><strong>공인 검증 마크:</strong> 최하단 `Powered by CUSWAY & 진위확인 QR`로 공신력 배가</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="#34d399" />
                    <span><strong>화주 역유입 바이럴:</strong> 의견서를 본 화주 기업 무역팀의 CUSWAY 신규 유입 창출</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={onOpenBranding}
                    style={{
                      padding: '12px 20px',
                      background: 'var(--accent-cyan)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Settings size={15} /> 사무소 브랜딩 설정 열기
                  </button>
                  <button
                    onClick={() => setShowSampleReportModal(true)}
                    style={{
                      padding: '12px 18px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid #0284c7',
                      borderRadius: '8px',
                      color: '#38bdf8',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Printer size={15} /> 실제 의견서 인쇄/발급 미리보기
                  </button>
                </div>
              </div>

              {/* Realistic Mini A4 Paper Mockup */}
              <div style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '24px 28px',
                borderRadius: '12px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '1px solid #cbd5e1',
                fontSize: '0.72rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative'
              }}>
                {/* Header with Custom Broker Logo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {branding.customLogoUrl ? (
                      <div style={{
                        background: '#ffffff',
                        padding: '2px 4px',
                        borderRadius: '3px',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={branding.customLogoUrl} 
                          alt={branding.firmName} 
                          style={{ maxHeight: '24px', maxWidth: '70px', objectFit: 'contain' }} 
                        />
                      </div>
                    ) : (
                      <span style={{ fontSize: '1.2rem' }}>
                        {branding.logoIcon === 'scales' ? '⚖️' : branding.logoIcon === 'building' ? '🏛️' : branding.logoIcon === 'globe' ? '🌐' : '🛡️'}
                      </span>
                    )}
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '0.85rem', color: '#0f172a' }}>{branding.firmName || '대한관세법인'}</div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>{branding.firmNameEn || 'CUSTOMS LAW FIRM'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.65rem', color: '#64748b' }}>
                    <div style={{ color: '#0284c7', fontWeight: 800 }}>공식 관세 검토의견서</div>
                    <div>문서번호: DOC-2026-9821</div>
                  </div>
                </div>

                {/* Recipient */}
                <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                  수신처: (주)한국통상 무역부 귀하 | 건명: 전기차 구동모터 코일 품목분류 사전심사 건
                </div>

                {/* Body Table Mockup */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', borderBottom: '1px solid #e2e8f0', background: '#f1f5f9', padding: '4px 8px', fontWeight: 800 }}>
                    <span>확정 HSK</span>
                    <span style={{ color: '#0284c7' }}>8501.52-9000 (적용 통칙 제1호, 제6호)</span>
                  </div>
                  <div style={{ padding: '6px 8px', fontSize: '0.65rem', color: '#334155', lineHeight: 1.4 }}>
                    관세율표 제16부 주 제3호 및 제8501호 해설 규정에 의거, 본 물품은 고출력 전기 구동 특성을 지닌 동기전동기로서 타 호의 분류가 명확히 배제되며 본 호로 결정함.
                  </div>
                </div>

                {/* Broker Signature & Red Seal */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px solid #0f172a', paddingTop: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{branding.firmName} 대표/담당 관세사</div>
                    <div style={{ fontWeight: 900, fontSize: '0.8rem' }}>{branding.brokerName || '홍길동 공인관세사'} ({branding.licenseNo})</div>
                  </div>
                  {/* Red Stamp */}
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: '2px solid #dc2626',
                    color: '#dc2626',
                    fontWeight: 900,
                    fontSize: '0.58rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-4deg)',
                    background: 'rgba(254, 242, 242, 0.5)'
                  }}>
                    {branding.sealText || `${branding.firmName}인`}
                  </div>
                </div>

                {/* Co-Branding Bar */}
                {branding.brandingMode === 'co-branding' && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '4px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.55rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={12} color="#0284c7" />
                      <span><strong>Powered & Verified by CUSWAY AI</strong> (9,450건 DB 검증 완료)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 800, color: '#0f172a' }}>
                      <QrCode size={10} color="#0284c7" />
                      <span>[진위확인 QR]</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 2: Confidential Cashback Appraisal Engine */}
          {activeTab === 'cashback' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={20} color="var(--accent-amber)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    CONFIDENTIAL PRECEDENT CASHBACK EXCHANGE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                  서랍 속 비공개 결정서 1건으로<br />
                  <span style={{ color: 'var(--accent-amber)' }}>Pro 구독료(월 4.4만)를 100% 무료화</span>하세요.
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  CUSWAY AI 가치 감정 엔진은 관세청 공개 포털(CLIP)에 없는 미공개 희귀 결정서와 승소 판결문을 최상위 가치로 감정하여 <strong>건당 최대 ₩50,000P</strong>를 즉시 캐시백해 드립니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>투명한 4단계 감정:</strong> 기본 지식금 + 미공개 프리미엄 + 승소 가산금 실시간 산출</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>완벽한 비식별 보안:</strong> 화주명, 사업자번호 등 민감정보 100% 마스킹 처리</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>구독료 자동 차감:</strong> 적립된 마일리지는 차월 결제 시 100% 현금 자동 차감</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('cashback')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d946ef 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Coins size={15} /> 비공개 결정서 감정 신청하기
                  </button>
                </div>
              </div>

              {/* Interactive Cashback Calculator Widget */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>⚡ 실시간 캐시백 모의 감정기</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                    실시간 산정
                  </span>
                </div>

                {/* Option 1: Confidentiality */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                    문서 공개 여부 (유니패스 미등재 희귀 문서)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => setSimDocType('confidential')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDocType === 'confidential' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0,0,0,0.3)',
                        border: simDocType === 'confidential' ? '1.5px solid var(--accent-amber)' : '1px solid #334155',
                        color: simDocType === 'confidential' ? 'var(--accent-amber)' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      🔒 비공개 미등재 (+₩20,000P)
                    </button>
                    <button
                      onClick={() => setSimDocType('public')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDocType === 'public' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(0,0,0,0.3)',
                        border: simDocType === 'public' ? '1.5px solid var(--accent-amber)' : '1px solid #334155',
                        color: simDocType === 'public' ? 'var(--accent-amber)' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      🌐 일반 공식 문서 (+₩5,000P)
                    </button>
                  </div>
                </div>

                {/* Option 2: Decision Outcome */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                    처분 결과 (세관 처분 취소/승소 파급력)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => setSimDecision('overturned')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDecision === 'overturned' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(0,0,0,0.3)',
                        border: simDecision === 'overturned' ? '1.5px solid #34d399' : '1px solid #334155',
                        color: simDecision === 'overturned' ? '#34d399' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      🏆 세관처분 취소/승소 (+₩15,000P)
                    </button>
                    <button
                      onClick={() => setSimDecision('upheld')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDecision === 'upheld' ? 'rgba(52, 211, 153, 0.25)' : 'rgba(0,0,0,0.3)',
                        border: simDecision === 'upheld' ? '1.5px solid #34d399' : '1px solid #334155',
                        color: simDecision === 'upheld' ? '#34d399' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      📄 일반 사전심사 (+₩5,000P)
                    </button>
                  </div>
                </div>

                {/* Calculated Output Result */}
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <span>CUSWAY 9,450건 DB 대조 독창성</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>{simDocType === 'confidential' ? '98.5% (최상급 독점)' : '82.0% (우수)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>예상 캐시백 적립금</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
                      ₩{totalCashback.toLocaleString()} P
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', marginTop: '6px', fontWeight: 700, textAlign: 'right' }}>
                    * Pro 플랜(월 4.4만 원) 100% 무료 이용 가능 수준
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4-Step Clearance Pipeline */}
          {activeTab === 'pipeline' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    4-STEP ONE-STOP CLEARANCE PIPELINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                  HS Code 확정부터 수입 요건, FTA까지<br />
                  <span style={{ color: 'var(--accent-cyan)' }}>하나의 파이프라인으로 일괄 통제</span>합니다.
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  분류 따로, 요건 따로, 협정세율 따로 조회하던 파편화된 업무를 끝냅니다. 입력 즉시 4단계를 관통하여 통관 보류 및 관세 추징 리스크를 원천 봉쇄합니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { step: '1단계', title: 'AI HS Code & 법적 소명', desc: '통칙 1~6, 부·류 주규정, 제외조항 검증' },
                    { step: '2단계', title: '세관장확인 수입 요건', desc: '식품위생법, 전파법, 전기용품안전인증 대상 자동 판별' },
                    { step: '3단계', title: 'FTA 협정세율 & 실익 분석', desc: '한-중, 한-베트남, RCEP 원산지증명 실익 최적화' },
                    { step: '4단계', title: '통관 행정서류 체크리스트', desc: '수입신고 전 필수 구비서류 자동 생성' }
                  ].map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.75rem' }}>
                        {s.step}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{s.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('clearance-wizard')}
                    style={{
                      padding: '12px 20px',
                      background: 'var(--accent-cyan)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#000',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Zap size={15} /> 4단계 통관 심사 실행하기
                  </button>
                </div>
              </div>

              {/* Visual Pipeline Flow Mockup */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1.5px solid #334155',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                  📊 실시간 수입통관 4단계 종합 판정표 예시
                </div>

                <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-cyan)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>1단계: 품목분류 확정</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>HSK 2009.89-1090 (배 주스 농축액)</div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>2단계: 세관장확인 수입요건</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>[필수] 수입식품안전관리 특별법 검사확인증 필요</div>
                </div>

                <div style={{ background: 'rgba(52, 211, 153, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #34d399' }}>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>3단계: 협정세율 실익 비교</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>기본 50.0% ➔ 한-아세안 FTA 0.0% (세액 ₩12,500,000 절감)</div>
                </div>

                <div style={{ background: 'rgba(147, 51, 234, 0.08)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #c084fc' }}>
                  <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700 }}>4단계: 구비 서류 가이드</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>식품검역증명서, Form AK 원산지증명서, 제조공정도</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Valuation Precedents */}
          {activeTab === 'valuation' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={20} color="#e879f9" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e879f9' }}>
                    CUSTOMS VALUATION & TAX TRIBUNAL PRECEDENTS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                  특수관계 이전가격, 로열티 가산 처분도<br />
                  <span style={{ color: '#e879f9' }}>조세심판원 승소 판례로 방어</span>합니다.
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  관세평가 쟁점(제1방법 배제, 권리사용료 가산, 생산지원비)에 대해 조세심판원과 대법원의 최신 인용(승소) 판결 논리를 즉시 소명서에 인용할 수 있습니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#f8fafc' }}>
                    <CheckCircle2 size={16} color="#e879f9" />
                    <span><strong>심판원/대법원 전수 DB:</strong> 과세가격 평가 쟁점별 법적 판단 요지 매칭</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#e879f9' }}>
                    <CheckCircle2 size={16} color="#e879f9" />
                    <span><strong>관세청 처분 취소 방어 논리:</strong> 세관 심사 시 즉시 제출 가능한 법리 제공</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('valuation')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #e879f9 0%, #3b82f6 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Scale size={15} /> 관세평가 판례 검색하기
                  </button>
                </div>
              </div>

              {/* Valuation Precedent Card Mockup */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1.5px solid rgba(232, 121, 249, 0.3)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(232, 121, 249, 0.2)', color: '#e879f9', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    조세심판원 조심2024관0042 (인용/승소)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700 }}>처분 취소 결정</span>
                </div>

                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                  다국적 소프트웨어 사용권 대가의 권리사용료 가산 처분 취소 청구
                </div>

                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', lineHeight: 1.5 }}>
                  <strong>핵심 판결 요지:</strong> 수입물품과 직접 관련된 권리사용료라 하더라도, 국내에서 수행되는 후속 가공 및 복제권 행사에 대한 대가는 관세법 시행령 제19조 제2항에 따라 비과세 처리함이 타당함.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Before vs After Shocking Comparison Matrix */}
      <section style={{
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid #334155',
        borderRadius: '20px',
        padding: '36px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
            WHY CUSWAY IS INCOMPARABLE
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '6px 0 0 0' }}>
            기존 방식 vs CUSWAY AI 코파일럿
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Traditional Bad Way */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1.5px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 800, fontSize: '1rem', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', paddingBottom: '10px' }}>
              <XCircle size={20} />
              <span>기존 방식 (유니패스 / 씨엘HS / 포털)</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>수십 장의 해설서와 통칙을 관세사가 일일이 수작업으로 찾아서 짜깁기 (건당 30분~1시간)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>선착순 1인 1계정 제약으로 다른 직원이 접속하면 로그인 튕김 발생</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>화주 제출용 소명서를 워드나 한글 파일로 매번 처음부터 다시 작성</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#ef4444' }}>✕</span>
                <span>품목분류 오류 시 수억 원대 추징금 및 화주 신뢰도 실추 리스크</span>
              </li>
            </ul>
          </div>

          {/* CUSWAY Superior Way */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1.5px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 8px 30px rgba(6, 182, 212, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 900, fontSize: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.3)', paddingBottom: '10px' }}>
              <CheckCircle2 size={20} />
              <span>CUSWAY AI 코파일럿 솔루션</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#ffffff' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900 }}>✓</span>
                <span><strong>3초 만에 완성:</strong> 통칙 1~6, 부·류 주규정, 관세청 결정례 매핑 소명서 자동 작성</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900 }}>✓</span>
                <span><strong>무제한 동시접속:</strong> 모바일/PC 제약 없이 팀 전원이 동시에 사용</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900 }}>✓</span>
                <span><strong>관세사 맞춤 Co-Branding:</strong> 자체 로고/직인이 찍힌 A4 PDF 원클릭 출력</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 900 }}>✓</span>
                <span><strong>비공개 판례 캐시백:</strong> 서랍 속 결정서 1건 공유로 Pro 구독료 100% 무료화</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. Interactive ROI Calculator by Office Size */}
      <section style={{
        background: 'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.9) 70%)',
        border: '1.5px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: '36px 32px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
            RETURN ON INVESTMENT
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: '6px 0 0 0' }}>
            우리 사무소의 CUSWAY 도입 ROI 계산기
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            직원 수에 따른 업무 시간 절감과 인건비 회수율을 실시간으로 확인하세요.
          </p>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 700 }}>관세사 및 실무 직원 수:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-amber)' }}>{teamSize} 명</span>
            </div>
            <input 
              type="range"
              min={1}
              max={50}
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--accent-amber)',
                cursor: 'pointer'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
              <span>1인 사무소</span>
              <span>5인 실무팀</span>
              <span>10인 지사</span>
              <span>50인+ 대형법인</span>
            </div>
          </div>

          {/* Results Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            background: 'rgba(0,0,0,0.4)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>월간 절감 시간</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {savedHoursPerMonth} 시간
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>자료조사 공수 90% 절감</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>월간 인건비 절감액</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
                ₩{(savedCostPerMonth / 10000).toLocaleString()} 만원
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>컨설팅 시간 확보</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>투자 대비 수익률 (ROI)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-amber)', marginTop: '4px' }}>
                {roiMultiplier > 1000 ? '999+' : roiMultiplier} 배
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>솔루션 구독료 대비</div>
            </div>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => onNavigate('billing')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, var(--accent-amber) 0%, #f97316 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#000',
                fontWeight: 900,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)'
              }}
            >
              <Award size={18} />
              <span>{teamSize <= 5 ? 'Pro 플랜 (월 44,000원) 시작하기' : 'Enterprise 법인 플랜 시작하기'}</span>
            </button>
            <button
              onClick={onOpenKakaoConsult}
              style={{
                padding: '14px 20px',
                background: '#fee500',
                border: 'none',
                borderRadius: '10px',
                color: '#000000',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              💬 카카오톡 도입 1:1 상담
            </button>
          </div>
        </div>
      </section>

      {/* 5. Final Bottom Call to Action */}
      <section style={{
        textAlign: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', margin: 0 }}>
          지금 바로 관세사의 진짜 무기를 장착하십시오.
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '600px', margin: 0 }}>
          회원가입 즉시 50회 무료 RAG 소명 분석과 관세사무소 맞춤 A4 리포트 발급 권한이 제공됩니다.
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('hs-classifier')}
            style={{
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#000',
              fontSize: '1.05rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 8px 30px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Sparkles size={20} fill="#000" />
            <span>무료로 CUSWAY 시작하기</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => setShowBrochureModal(true)}
            style={{
              padding: '16px 26px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={18} color="var(--accent-cyan)" />
            <span>공식 홍보 브로슈어 인쇄/저장</span>
          </button>
        </div>
      </section>

      {/* Marketing Brochure Printable Modal */}
      <MarketingBrochureModal 
        isOpen={showBrochureModal}
        onClose={() => setShowBrochureModal(false)}
        branding={branding}
      />

      {/* Interactive Sample Customs Report Modal */}
      {showSampleReportModal && (
        <CustomsReportModal
          isOpen={showSampleReportModal}
          onClose={() => setShowSampleReportModal(false)}
          currentUser={currentUser}
          onOpenBrandingSettings={onOpenBranding}
          reportData={{
            type: 'hs-opinion',
            title: `[품목분류 사전심사 소명의견서] 전기차 구동모터용 스테이터 코일 어셈블리`,
            targetItem: {
              productName: '전기차 구동모터용 스테이터 코일 (EV Stator Assembly)',
              hsCode: '8501.52-9000',
              material: '무산소동(OFC) 권선, 규소강판 적층 코어, 절연 에폭시 수지 몰딩',
              functionUse: '전기자동차 구동용 3상 교류 동기 전동기 핵심 고정자 부품',
              originCountry: '독일 (DE)'
            },
            rates: {
              baseRate: '8.0%',
              recommendedRate: '0.0%',
              ftaName: '한-EU FTA 특혜'
            },
            legalBasis: {
              generalRule: '관세율표 해석에 관한 통칙 제1호, 제6호 및 제16부 주 제3호',
              rationaleSummary: '본 물품은 전기 구동 기능을 수행하기 위한 고정자(Stator) 코일 완성 부품으로, 관세율표 제8501호(전동기와 발전기) 해설서의 분류 원칙에 의거 타 호의 일반 기계 부품이 배제되며 제8501.52-9000호로 분류됨.',
              wcoNoteSnippet: '제8501호 해설: 이 호에는 회전 전기 기계인 모든 전동기와 발전기를 포함하며, 전기차의 구동축에 결합되어 주행 동력을 발생시키는 교류 전동기 부품을 포함한다.'
            },
            precedents: [
              {
                caseNumber: '분류원-2024-0312',
                title: '친환경 전기차 구동용 트랙션 모터 코일 조립체',
                authority: '관세평가분류원',
                keyPoint: '출력 75kW 초과 375kW 이하의 3상 교류 동기전동기 해당 (HSK 8501.52-9000 결정)'
              }
            ],
            customMemo: '■ 관세사 검토의견:\n1. 본 품목은 한-EU FTA 원산지신고서 문안(인증수출자 번호 포함) 구비 시 0% 특혜관세 적용이 확실합니다.\n2. 세관 수입신고 시 절연재 및 모터 정격 출력 스펙 시트를 필수 첨부서류로 제출 바랍니다.'
          }}
        />
      )}

    </div>
  );
}
