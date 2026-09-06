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
  XCircle,
  Calculator,
  Clock,
  Info,
  ChevronDown,
  ChevronUp
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
  const [showBasisDetail, setShowBasisDetail] = useState<boolean>(true);

  // Calculate cashback simulation
  const calcBase = 10000;
  const calcConf = simDocType === 'confidential' ? 20000 : 5000;
  const calcDec = simDecision === 'overturned' ? 15000 : 5000;
  const calcScarcity = simDocType === 'confidential' ? 5000 : 0;
  const totalCashback = Math.min(50000, calcBase + calcConf + calcDec + calcScarcity);

  // Realistic Customs Office ROI Calculation Model (대한민국 관세 실무 벤치마크)
  // 1. 1인당 월간 리서치 절감 시간: 8시간 (영업일 기준 일 24분 단축, 주 2시간)
  const savedHoursPerMonth = teamSize * 8;
  // 2. 관세 실무 인력 표준 시급: 30,000원 (연봉 4,500만~6,500만원 기준)
  const savedLaborCostPerMonth = savedHoursPerMonth * 30000;
  // 3. 신속 A4 소명 리포트/의견서 발급에 따른 자문 수익 기회 창출
  const consultingValuePerMonth = teamSize === 1 ? 60000 : teamSize <= 5 ? 200000 : teamSize <= 15 ? 400000 : 800000;
  // 4. 월간 총 창출 가치
  const totalValuePerMonth = savedLaborCostPerMonth + consultingValuePerMonth;
  // 5. CUSWAY 월 구독료 (1~5인 실무팀 Pro 44,000원, 6~15인 지사 180,000원, 16인 이상 대형법인 290,000원)
  const cuswayMonthlyCost = teamSize <= 5 ? 44000 : teamSize <= 15 ? 180000 : 290000;
  // 6. 투자 대비 실질 회수율 (ROI 배수)
  const roiMultiplier = Number((totalValuePerMonth / cuswayMonthlyCost).toFixed(1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}>
      
      {/* 1. Hero Section: Powerful Value Proposition */}
      <section style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '48px 36px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 50%, #f8fafc 100%)',
        border: '1px solid rgba(13, 148, 136, 0.25)',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden'
      }}>
        {/* Ambient glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-40px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(13, 148, 136, 0.1)',
            border: '1px solid rgba(13, 148, 136, 0.25)',
            width: 'fit-content'
          }}>
            <Sparkles size={15} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)', letterSpacing: '0.02em' }}>
              대한민국 1위 관세 AI 코파일럿 | WCO 해설서 & 9,450건 판례 마스터 기반
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            lineHeight: 1.35,
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            margin: 0
          }}>
            해설서 검색에 쓰던 <span style={{ color: '#94a3b8', textDecoration: 'line-through' }}>하루 3시간</span>,<br />
            <span style={{ 
              background: 'linear-gradient(90deg, #0d9488 0%, #0891b2 50%, #b45309 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              3초 만에 끝내고
            </span> 진짜 관세 컨설팅에 집중하세요.
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            margin: 0
          }}>
            CUSWAY는 단순한 키워드 검색기가 아닙니다. 물품 규격 3줄 입력으로 <strong>통칙 1~6 적용 논리, WCO 해설서 본문, 관세청 결정례를 매핑한 법적 소명서(PDF)</strong>를 관세사무소 명의로 자동 발급합니다.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => onNavigate('hs-classifier')}
              style={{
                padding: '14px 26px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <Zap size={17} fill="#ffffff" />
              <span>3초 만에 내 품목 소명 리포트 뽑아보기 (무료)</span>
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onOpenBranding}
              style={{
                padding: '14px 22px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: 'var(--text-main)',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.color = 'var(--accent-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              <Building2 size={17} color="var(--accent-primary)" />
              <span>관세사무소 맞춤 로고/직인 설정</span>
            </button>

            <button
              onClick={() => setShowBrochureModal(true)}
              style={{
                padding: '14px 20px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '10px',
                color: 'var(--accent-amber)',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <FileText size={17} color="var(--accent-amber)" />
              <span>📄 공식 브로슈어 인쇄/PDF</span>
            </button>
          </div>

          {/* Realtime Trust Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginTop: '16px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-primary)' }}>9,450+ 건</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>관세청·WCO 판례 마스터 DB</div>
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-amber)' }}>90% 절감</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>건당 소명서 작성 시간 (30분➔3초)</div>
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669' }}>무제한 동시접속</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>선착순 튕김 없는 팀 협업 환경</div>
            </div>
            <div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-cyan)' }}>최대 50,000P</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>비공개 판례 캐시백 (구독료 0원화)</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Interactive 4 Killer Feature Templates Showcase */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CORE VALUE PROPOSITION
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 8px 0' }}>
            관세사와 기업을 압도하는 CUSWAY 4대 무기
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
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
                padding: '10px 18px',
                borderRadius: '10px',
                background: activeTab === t.id ? 'rgba(13, 148, 136, 0.1)' : '#ffffff',
                border: activeTab === t.id ? '1.5px solid var(--accent-primary)' : '1px solid #e2e8f0',
                color: activeTab === t.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === t.id ? 800 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === t.id ? '0 2px 8px rgba(13, 148, 136, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.label}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '2px 6px',
                borderRadius: '6px',
                background: activeTab === t.id ? 'var(--accent-primary)' : '#f1f5f9',
                color: activeTab === t.id ? '#ffffff' : '#64748b',
                fontWeight: 800
              }}>
                {t.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content Display Cards */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)'
        }}>

          {/* TAB 1: Co-Branding A4 Official Report Preview */}
          {activeTab === 'branding' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    WHITE-LABEL & CO-BRANDING ENGINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  화주에게 전송되는 의견서에<br />
                  <span style={{ color: 'var(--accent-primary)' }}>자신들만의 관세사 상호와 직인</span>이 찍힙니다.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  CUSWAY 설정에서 관세사무소 로고와 공인직인을 한 번만 등록해 두면, 모든 AI 품목분류·통관 사전심사 결과가 <strong>완벽한 A4 공문서 규격 PDF</strong>로 즉시 출력됩니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span><strong>100% 관세사무소 명의:</strong> 상호명, 라이선스 번호, 붉은색 원형 직인 도장 적용</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span><strong>공인 검증 마크:</strong> 최하단 `Powered by CUSWAY & 진위확인 QR`로 공신력 배가</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="#059669" />
                    <span><strong>화주 역유입 바이럴:</strong> 의견서를 본 화주 기업 무역팀의 CUSWAY 신규 유입 창출</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={onOpenBranding}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                    }}
                  >
                    <Settings size={15} /> 사무소 브랜딩 설정 열기
                  </button>
                  <button
                    onClick={() => setShowSampleReportModal(true)}
                    style={{
                      padding: '12px 18px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      color: 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Printer size={15} color="var(--accent-primary)" /> 실제 의견서 인쇄/발급 미리보기
                  </button>
                </div>
              </div>

              {/* Realistic Mini A4 Paper Mockup */}
              <div style={{
                background: '#ffffff',
                color: '#0f172a',
                padding: '24px 28px',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
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
                <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a' }}>
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
                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color: '#0f172a' }}>{branding.brokerName || '홍길동 공인관세사'} ({branding.licenseNo})</div>
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
                    background: 'rgba(254, 242, 242, 0.6)'
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Coins size={18} color="var(--accent-amber)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    CONFIDENTIAL PRECEDENT CASHBACK EXCHANGE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  서랍 속 비공개 결정서 1건으로<br />
                  <span style={{ color: 'var(--accent-amber)' }}>Pro 구독료(월 4.4만)를 100% 무료화</span>하세요.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  CUSWAY AI 가치 감정 엔진은 관세청 공개 포털(CLIP)에 없는 미공개 희귀 결정서와 승소 판결문을 최상위 가치로 감정하여 <strong>건당 최대 ₩50,000P</strong>를 즉시 캐시백해 드립니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>투명한 4단계 감정:</strong> 기본 지식금 + 미공개 프리미엄 + 승소 가산금 실시간 산출</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>완벽한 비식별 보안:</strong> 화주명, 사업자번호 등 민감정보 100% 마스킹 처리</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-amber)" />
                    <span><strong>구독료 자동 차감:</strong> 적립된 마일리지는 차월 결제 시 100% 현금 자동 차감</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('cashback')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d97706 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(180, 83, 9, 0.25)'
                    }}
                  >
                    <Coins size={15} /> 비공개 결정서 감정 신청하기
                  </button>
                </div>
              </div>

              {/* Interactive Cashback Calculator Widget */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.3) 0%, #ffffff 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>⚡ 실시간 캐시백 모의 감정기</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                    실시간 산정
                  </span>
                </div>

                {/* Option 1: Confidentiality */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    문서 공개 여부 (포털 미등재 비공개 문서)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => setSimDocType('confidential')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDocType === 'confidential' ? 'rgba(245, 158, 11, 0.15)' : '#ffffff',
                        border: simDocType === 'confidential' ? '1.5px solid var(--accent-amber)' : '1px solid #cbd5e1',
                        color: simDocType === 'confidential' ? 'var(--accent-amber)' : 'var(--text-muted)',
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
                        background: simDocType === 'public' ? 'rgba(245, 158, 11, 0.15)' : '#ffffff',
                        border: simDocType === 'public' ? '1.5px solid var(--accent-amber)' : '1px solid #cbd5e1',
                        color: simDocType === 'public' ? 'var(--accent-amber)' : 'var(--text-muted)',
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
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                    처분 결과 (세관 처분 취소/승소 파급력)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => setSimDecision('overturned')}
                      style={{
                        padding: '8px',
                        borderRadius: '6px',
                        background: simDecision === 'overturned' ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
                        border: simDecision === 'overturned' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                        color: simDecision === 'overturned' ? '#059669' : 'var(--text-muted)',
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
                        background: simDecision === 'upheld' ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
                        border: simDecision === 'upheld' ? '1.5px solid #059669' : '1px solid #cbd5e1',
                        color: simDecision === 'upheld' ? '#059669' : 'var(--text-muted)',
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
                <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>CUSWAY 9,450건 DB 대조 독창성</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>{simDocType === 'confidential' ? '98.5% (최상급 독점)' : '82.0% (우수)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>예상 캐시백 적립금</span>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
                      ₩{totalCashback.toLocaleString()} P
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '6px', fontWeight: 700, textAlign: 'right' }}>
                    * Pro 플랜(월 4.4만 원) 100% 무료 이용 가능 수준
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 4-Step Clearance Pipeline */}
          {activeTab === 'pipeline' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    4-STEP ONE-STOP CLEARANCE PIPELINE
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  HS Code 확정부터 수입 요건, FTA까지<br />
                  <span style={{ color: 'var(--accent-primary)' }}>하나의 파이프라인으로 일괄 통제</span>합니다.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
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
                      <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.75rem' }}>
                        {s.step}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>{s.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('clearance-wizard')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
                    }}
                  >
                    <Zap size={15} /> 4단계 통관 심사 실행하기
                  </button>
                </div>
              </div>

              {/* Visual Pipeline Flow Mockup */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  📊 실시간 수입통관 4단계 종합 판정표 예시
                </div>

                <div style={{ background: 'rgba(13, 148, 136, 0.06)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>1단계: 품목분류 확정</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>HSK 2009.89-1090 (배 주스 농축액)</div>
                </div>

                <div style={{ background: 'rgba(245, 158, 11, 0.06)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>2단계: 세관장확인 수입요건</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>[필수] 수입식품안전관리 특별법 검사확인증 필요</div>
                </div>

                <div style={{ background: 'rgba(5, 150, 105, 0.06)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #059669' }}>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>3단계: 협정세율 실익 비교</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>기본 50.0% ➔ 한-아세안 FTA 0.0% (세액 ₩12,500,000 절감)</div>
                </div>

                <div style={{ background: 'rgba(147, 51, 234, 0.06)', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #9333ea' }}>
                  <div style={{ fontSize: '0.72rem', color: '#9333ea', fontWeight: 700 }}>4단계: 구비 서류 가이드</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>식품검역증명서, Form AK 원산지증명서, 제조공정도</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Valuation Precedents */}
          {activeTab === 'valuation' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.1fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scale size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    CUSTOMS VALUATION & TAX TRIBUNAL PRECEDENTS
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  특수관계 이전가격, 로열티 가산 처분도<br />
                  <span style={{ color: 'var(--accent-cyan)' }}>조세심판원 승소 판례로 방어</span>합니다.
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  관세평가 쟁점(제1방법 배제, 권리사용료 가산, 생산지원비)에 대해 조세심판원과 대법원의 최신 인용(승소) 판결 논리를 즉시 소명서에 인용할 수 있습니다.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>심판원/대법원 전수 DB:</strong> 과세가격 평가 쟁점별 법적 판단 요지 매칭</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                    <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    <span><strong>관세청 처분 취소 방어 논리:</strong> 세관 심사 시 즉시 제출 가능한 법리 제공</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button
                    onClick={() => onNavigate('valuation')}
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0284c7 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(8, 145, 178, 0.25)'
                    }}
                  >
                    <Scale size={15} /> 관세평가 판례 검색하기
                  </button>
                </div>
              </div>

              {/* Valuation Precedent Card Mockup */}
              <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                    조세심판원 조심2024관0042 (인용/승소)
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>처분 취소 결정</span>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  다국적 소프트웨어 사용권 대가의 권리사용료 가산 처분 취소 청구
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', lineHeight: 1.5 }}>
                  <strong>핵심 판결 요지:</strong> 수입물품과 직접 관련된 권리사용료라 하더라도, 국내에서 수행되는 후속 가공 및 복제권 행사에 대한 대가는 관세법 시행령 제19조 제2항에 따라 비과세 처리함이 타당함.
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. Before vs After Shocking Comparison Matrix */}
      <section style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            WHY CUSWAY IS INCOMPARABLE
          </span>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-main)', margin: '6px 0 0 0' }}>
            기존 방식 vs CUSWAY AI 코파일럿
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Traditional Bad Way */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.04)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc2626', fontWeight: 800, fontSize: '0.95rem', borderBottom: '1px solid rgba(239, 68, 68, 0.15)', paddingBottom: '8px' }}>
              <XCircle size={18} />
              <span>기존 업무 방식</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>✕</span>
                <span>수십 장의 해설서와 통칙을 관세사가 일일이 수작업으로 찾아서 짜깁기 (건당 30분~1시간)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>✕</span>
                <span>선착순 1인 1계정 제약으로 다른 직원이 접속하면 로그인 튕김 발생</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>✕</span>
                <span>화주 제출용 소명서를 워드나 한글 파일로 매번 처음부터 다시 작성</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>✕</span>
                <span>품목분류 오류 시 수억 원대 추징금 및 화주 신뢰도 실추 리스크</span>
              </li>
            </ul>
          </div>

          {/* CUSWAY Superior Way */}
          <div style={{
            background: 'rgba(13, 148, 136, 0.04)',
            border: '1.5px solid rgba(13, 148, 136, 0.3)',
            borderRadius: '12px',
            padding: '22px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 4px 14px rgba(13, 148, 136, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-primary)', fontWeight: 900, fontSize: '0.95rem', borderBottom: '1px solid rgba(13, 148, 136, 0.2)', paddingBottom: '8px' }}>
              <CheckCircle2 size={18} />
              <span>CUSWAY AI 코파일럿 솔루션</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-main)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>✓</span>
                <span><strong>3초 만에 완성:</strong> 통칙 1~6, 부·류 주규정, 관세청 결정례 매핑 소명서 자동 작성</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>✓</span>
                <span><strong>무제한 동시접속:</strong> 모바일/PC 제약 없이 팀 전원이 동시에 사용</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>✓</span>
                <span><strong>관세사 맞춤 Co-Branding:</strong> 자체 로고/직인이 찍힌 A4 PDF 원클릭 출력</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 900 }}>✓</span>
                <span><strong>비공개 판례 캐시백:</strong> 서랍 속 결정서 1건 공유로 Pro 구독료 100% 무료화</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. Interactive ROI Calculator by Office Size */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.3) 0%, #ffffff 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '6px'
          }}>
            <Calculator size={14} color="var(--accent-amber)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-amber)', letterSpacing: '0.04em' }}>
              RETURN ON INVESTMENT | 실무 벤치마크 기반
            </span>
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
            우리 사무소의 CUSWAY 도입 ROI 계산기
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            과장 없는 관세사무소 실무 데이터(월 리서치 공수 및 표준 시급)를 기준으로 산출된 현실적인 회수율입니다.
          </p>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Preset Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: '1인 단독 사무소', size: 1 },
              { label: '3인 실무팀', size: 3 },
              { label: '5인 전문팀 (추천)', size: 5 },
              { label: '10인 지사', size: 10 },
              { label: '30인 대형 법인', size: 30 }
            ].map(preset => (
              <button
                key={preset.size}
                type="button"
                onClick={() => setTeamSize(preset.size)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: teamSize === preset.size ? '1.5px solid var(--accent-amber)' : '1px solid #cbd5e1',
                  background: teamSize === preset.size ? 'rgba(245, 158, 11, 0.12)' : '#ffffff',
                  color: teamSize === preset.size ? 'var(--accent-amber)' : 'var(--text-muted)',
                  transition: 'all 0.2s ease'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div style={{
            background: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} color="var(--accent-primary)" /> 관세사 및 통관 실무 직원 수:
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-amber)' }}>{teamSize} 명</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '6px' }}>
              <span>1명</span>
              <span>10명</span>
              <span>25명</span>
              <span>50명</span>
            </div>
          </div>

          {/* Results Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            background: '#ffffff',
            padding: '20px 16px',
            borderRadius: '14px',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Clock size={13} color="var(--accent-primary)" /> 월간 절감 시간
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-primary)', marginTop: '4px' }}>
                {savedHoursPerMonth} 시간
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>1인당 월 8시간 (일 24분 단축)</div>
            </div>

            <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Coins size={13} color="#059669" /> 월간 순수 창출 가치
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                ₩{(totalValuePerMonth / 10000).toLocaleString()} 만원
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>인건비 {(savedLaborCostPerMonth / 10000).toLocaleString()}만 + 자문 {(consultingValuePerMonth / 10000).toLocaleString()}만</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <TrendingUp size={13} color="var(--accent-amber)" /> 실질 투자 회수율 (ROI)
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-amber)', marginTop: '4px' }}>
                {roiMultiplier} 배
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>구독료 ₩{(cuswayMonthlyCost / 10000).toLocaleString()}만원 대비</div>
            </div>
          </div>

          {/* Transparent Calculation Grounds Card */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <button
              type="button"
              onClick={() => setShowBasisDetail(!showBasisDetail)}
              style={{
                width: '100%',
                padding: '12px 18px',
                background: '#f8fafc',
                border: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={15} color="var(--accent-primary)" />
                <span>📊 현실적인 ROI 산출 기준 및 데이터 근거</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <span>{showBasisDetail ? '간략히 접기' : '근거 펼쳐보기'}</span>
                {showBasisDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {showBasisDetail && (
              <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '0.78rem', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    1. 리서치 공수 절감 (1인당 월 8시간)
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    심층 품목분류·WCO 해설서 주규정·결정례 검색(월평균 10~15건)을 기존 수기 검색(건당 40분)에서 CUSWAY AI 코파일럿(건당 10분)으로 단축 (영업일 기준 일 24분 절감).
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #059669' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    2. 표준 시급 환산액 (시간당 30,000원)
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    관세사 및 통관 전문 실무인력 평균 급여(연봉 4,500만~6,500만 원, 주 40시간) 기준 시간당 표준 임금 환산액을 적용하여 객관적인 인건비 절감액을 산출했습니다.
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent-amber)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    3. A4 소명 리포트 & 자문 가치 창출
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    사무소 직인/로고가 포함된 표준 검토의견서를 즉시 발급하여 화주 소명 납기를 단축하고 유료 자문 수수료 기회 및 거래처 신뢰도를 증대합니다 (월 6만~80만원 상당).
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #9333ea' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                    4. 합리적인 CUSWAY 요금제 기준
                  </div>
                  <div style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>
                    1~5인 실무팀 Pro 플랜(월 44,000원), 6~15인 지사 플랜(월 180,000원), 16인 이상 법인 플랜(월 290,000원)을 기준으로 실질 회수 배수를 도출했습니다.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('billing')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d97706 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(180, 83, 9, 0.25)'
              }}
            >
              <Award size={18} />
              <span>{teamSize <= 5 ? 'Pro 실무팀 플랜 (월 44,000원) 시작하기' : 'Enterprise 법인 플랜 도입하기'}</span>
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
        padding: '36px 24px',
        background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(8, 145, 178, 0.08) 100%)',
        border: '1px solid rgba(13, 148, 136, 0.25)',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
          지금 바로 관세사의 진짜 무기를 장착하십시오.
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '600px', margin: 0 }}>
          회원가입 즉시 50회 무료 RAG 소명 분석과 관세사무소 맞춤 A4 리포트 발급 권한이 제공됩니다.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => onNavigate('hs-classifier')}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(13, 148, 136, 0.3)'
            }}
          >
            <Sparkles size={18} fill="#ffffff" />
            <span>무료로 CUSWAY 시작하기</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => setShowBrochureModal(true)}
            style={{
              padding: '14px 24px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              color: 'var(--text-main)',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FileText size={17} color="var(--accent-primary)" />
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
