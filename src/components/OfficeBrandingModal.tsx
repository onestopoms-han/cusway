import { useState, useEffect } from 'react';
import { Building2, Award, Stamp, Phone, Mail, MapPin, CheckCircle, Save, X, Eye, Sparkles, Shield, RefreshCw, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

export interface OfficeBranding {
  firmName: string;
  firmNameEn: string;
  brokerName: string;
  licenseNo: string;
  phone: string;
  email: string;
  address: string;
  logoIcon: 'scales' | 'building' | 'globe' | 'shield' | 'custom';
  customLogoUrl?: string;
  sealText: string;
  brandingMode: 'co-branding' | 'white-label';
  customDisclaimer?: string;
}

export const DEFAULT_OFFICE_BRANDING: OfficeBranding = {
  firmName: '대한관세법인',
  firmNameEn: 'DAEHAN CUSTOMS LAW FIRM',
  brokerName: '홍길동 공인관세사',
  licenseNo: '등록 제2026-10492호',
  phone: '02-540-1234',
  email: 'customs@daehan.kr',
  address: '서울특별시 강남구 테헤란로 152, 강남파이낸스센터 14층',
  logoIcon: 'scales',
  customLogoUrl: '',
  sealText: '대한관세법인인',
  brandingMode: 'co-branding',
  customDisclaimer: '본 검토서는 관세법, 관세율표 해석에 관한 통칙 및 WCO 해설서에 근거하여 작성된 전문 사전의견서입니다.'
};

export const getSavedOfficeBranding = (user?: any): OfficeBranding => {
  try {
    const saved = localStorage.getItem('cusway_office_branding');
    if (saved) {
      return { ...DEFAULT_OFFICE_BRANDING, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load office branding from storage', e);
  }
  if (user?.company_name && user.company_name !== 'CUSWAY' && user.company_name !== 'CUSWAY 관세팀') {
    return {
      ...DEFAULT_OFFICE_BRANDING,
      firmName: user.company_name,
      firmNameEn: `${user.company_name.toUpperCase()} CUSTOMS`,
      sealText: `${user.company_name}인`.slice(0, 8)
    };
  }
  return DEFAULT_OFFICE_BRANDING;
};

interface OfficeBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any;
  onSaved?: (branding: OfficeBranding) => void;
}

export default function OfficeBrandingModal({ isOpen, onClose, currentUser, onSaved }: OfficeBrandingModalProps) {
  const [branding, setBranding] = useState<OfficeBranding>(() => getSavedOfficeBranding(currentUser));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('이미지 파일(PNG, JPG, SVG, WebP)만 업로드할 수 있습니다.');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      setUploadError('로고 이미지 용량은 최대 2.5MB 이하로 업로드해 주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBranding(prev => ({
          ...prev,
          logoIcon: 'custom',
          customLogoUrl: result
        }));
      }
    };
    reader.onerror = () => {
      setUploadError('이미지 파일을 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setBranding(prev => ({
      ...prev,
      logoIcon: 'scales',
      customLogoUrl: ''
    }));
  };

  useEffect(() => {
    if (isOpen) {
      setBranding(getSavedOfficeBranding(currentUser));
      setSaveSuccess(false);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('cusway_office_branding', JSON.stringify(branding));
      window.dispatchEvent(new Event('office-branding-updated'));
      setSaveSuccess(true);
      if (onSaved) onSaved(branding);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('설정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleResetToDefault = () => {
    if (confirm('기본 설정값으로 복원하시겠습니까?')) {
      const resetData: OfficeBranding = {
        ...DEFAULT_OFFICE_BRANDING,
        firmName: currentUser?.company_name || '대한관세법인',
        firmNameEn: 'CUSTOMS LAW FIRM'
      };
      setBranding(resetData);
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
        maxWidth: '820px',
        maxHeight: '90vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900
            }}>
              <Building2 size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                관세사무소 맞춤 브랜딩 & 화이트라벨 설정
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                  화주 보고서 커스텀
                </span>
              </h3>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                화주에게 발행되는 모든 AI 품목분류·통관·평가 검토서에 귀 사무소의 공식 로고, 상호 및 붉은 직인이 날인됩니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
            
            {/* Left Column: Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    관세법인 / 사무소 상호 *
                  </label>
                  <input
                    type="text"
                    required
                    value={branding.firmName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setBranding(prev => ({
                        ...prev,
                        firmName: val,
                        sealText: prev.sealText === `${prev.firmName}인` ? `${val}인` : prev.sealText
                      }));
                    }}
                    placeholder="예: 대한관세법인"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    영문 상호 (Letterhead)
                  </label>
                  <input
                    type="text"
                    value={branding.firmNameEn}
                    onChange={(e) => setBranding(prev => ({ ...prev, firmNameEn: e.target.value }))}
                    placeholder="예: DAEHAN CUSTOMS LAW FIRM"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    대표 / 담당 관세사 성명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={branding.brokerName}
                    onChange={(e) => setBranding(prev => ({ ...prev, brokerName: e.target.value }))}
                    placeholder="예: 홍길동 공인관세사"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    관세사 등록번호 *
                  </label>
                  <input
                    type="text"
                    required
                    value={branding.licenseNo}
                    onChange={(e) => setBranding(prev => ({ ...prev, licenseNo: e.target.value }))}
                    placeholder="예: 등록 제2026-10492호"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    대표 전화번호
                  </label>
                  <input
                    type="text"
                    value={branding.phone}
                    onChange={(e) => setBranding(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="예: 02-540-1234"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                    대표 이메일
                  </label>
                  <input
                    type="email"
                    value={branding.email}
                    onChange={(e) => setBranding(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="customs@daehan.kr"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                  사무소 소재지 주소
                </label>
                <input
                  type="text"
                  value={branding.address}
                  onChange={(e) => setBranding(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="서울특별시 강남구 테헤란로 152, 14층"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Logo Emblem & Custom Image Upload Section */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: '#f8fafc', fontWeight: 800 }}>
                    🏛️ 사무소 공식 로고 & 엠블럼 설정
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>
                    {branding.customLogoUrl ? '✓ 맞춤 로고 등록됨' : '기본 엠블럼 사용 중'}
                  </span>
                </div>

                {/* 1. Direct Image File Upload Area */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    <strong>직접 회사 로고 파일 업로드 (PNG, JPG, SVG, WebP)</strong> <span style={{ color: '#94a3b8' }}>*투명 배경 PNG 권장, 최대 2.5MB</span>
                  </label>
                  
                  {branding.customLogoUrl ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#0f172a',
                      border: '1.5px solid #06b6d4',
                      borderRadius: '8px',
                      padding: '10px 14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #cbd5e1'
                        }}>
                          <img 
                            src={branding.customLogoUrl} 
                            alt="Custom Logo" 
                            style={{ maxHeight: '36px', maxWidth: '120px', objectFit: 'contain' }} 
                          />
                        </div>
                        <div>
                          <span style={{ fontSize: '0.78rem', color: '#f8fafc', fontWeight: 700, display: 'block' }}>
                            업로드된 맞춤 로고 이미지
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#10b981' }}>
                            ✓ A4 레포트 상단에 적용 중
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <label style={{
                          padding: '6px 10px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid #0284c7',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Upload size={13} /> 변경
                          <input 
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp" 
                            onChange={handleLogoFileUpload} 
                            style={{ display: 'none' }} 
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleRemoveCustomLogo}
                          style={{
                            padding: '6px 10px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            color: '#f87171',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={13} /> 삭제
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '16px',
                      background: '#0f172a',
                      border: '1.5px dashed #475569',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: 700, fontSize: '0.82rem' }}>
                        <Upload size={16} />
                        <span>회사/관세법인 로고 이미지 파일 찾기 (클릭)</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        PNG, JPG, SVG, WebP 파일 지원 (의견서 상단 레터헤드에 최적화)
                      </span>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp" 
                        onChange={handleLogoFileUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  )}

                  {uploadError && (
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.72rem', color: '#ef4444' }}>
                      ⚠️ {uploadError}
                    </p>
                  )}
                </div>

                {/* 2. Or Select Preset Symbol */}
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>
                    또는 기본 엠블럼 심볼 선택 (로고 파일이 없을 때)
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                      { key: 'scales', label: '저울 (관세평가)', icon: '⚖️' },
                      { key: 'building', label: '법인 (클래식)', icon: '🏛️' },
                      { key: 'globe', label: '통상 (글로벌)', icon: '🌐' },
                      { key: 'shield', label: '실드 (컴플라이언스)', icon: '🛡️' }
                    ].map(item => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setBranding(prev => ({ ...prev, logoIcon: item.key as any, customLogoUrl: '' }))}
                        style={{
                          padding: '6px',
                          background: (!branding.customLogoUrl && branding.logoIcon === item.key) ? 'rgba(6, 182, 212, 0.2)' : '#0f172a',
                          border: (!branding.customLogoUrl && branding.logoIcon === item.key) ? '1.5px solid #06b6d4' : '1px solid #334155',
                          borderRadius: '6px',
                          color: (!branding.customLogoUrl && branding.logoIcon === item.key) ? '#38bdf8' : '#cbd5e1',
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Red Seal Custom Stamp */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 700 }}>
                  관세사 공인 직인/인장 문구 (붉은 원형 직인 자동 생성)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={branding.sealText}
                    onChange={(e) => setBranding(prev => ({ ...prev, sealText: e.target.value }))}
                    placeholder="예: 대한관세법인인"
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setBranding(prev => ({ ...prev, sealText: `${prev.firmName}인` }))}
                    style={{
                      padding: '0 12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    상호 연동
                  </button>
                </div>
              </div>

              {/* Branding Mode Toggle */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 700 }}>
                  출력 리포트 브랜딩 모드
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div
                    onClick={() => setBranding(prev => ({ ...prev, brandingMode: 'co-branding' }))}
                    style={{
                      padding: '10px 12px',
                      background: branding.brandingMode === 'co-branding' ? 'rgba(16, 185, 129, 0.15)' : '#1e293b',
                      border: branding.brandingMode === 'co-branding' ? '1.5px solid #10b981' : '1px solid #334155',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: branding.brandingMode === 'co-branding' ? '#34d399' : '#fff' }}>
                        💎 인텔리전트 코-브랜딩 (추천)
                      </span>
                      {branding.brandingMode === 'co-branding' && <CheckCircle size={14} color="#34d399" />}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      귀 법인 로고·직인 메인 발행 + CUSWAY AI 9,450건 빅데이터 검증 마크 및 진위 QR 병기 (화주 신뢰 극대화)
                    </p>
                  </div>

                  <div
                    onClick={() => setBranding(prev => ({ ...prev, brandingMode: 'white-label' }))}
                    style={{
                      padding: '10px 12px',
                      background: branding.brandingMode === 'white-label' ? 'rgba(59, 130, 246, 0.15)' : '#1e293b',
                      border: branding.brandingMode === 'white-label' ? '1.5px solid #3b82f6' : '1px solid #334155',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: branding.brandingMode === 'white-label' ? '#60a5fa' : '#fff' }}>
                        🏢 단독 화이트라벨 모드
                      </span>
                      {branding.brandingMode === 'white-label' && <CheckCircle size={14} color="#60a5fa" />}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      CUSWAY 브랜드 표기를 최소화하고 100% 귀 관세법인 단독 명의로만 리포트 발행
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Letterhead & Seal Preview */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              color: '#0f172a',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: "'Noto Sans KR', sans-serif"
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {branding.customLogoUrl ? (
                      <div style={{
                        background: '#ffffff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img 
                          src={branding.customLogoUrl} 
                          alt="Logo" 
                          style={{ maxHeight: '30px', maxWidth: '100px', objectFit: 'contain' }} 
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                      }}>
                        {branding.logoIcon === 'scales' ? '⚖️' : branding.logoIcon === 'building' ? '🏛️' : branding.logoIcon === 'globe' ? '🌐' : '🛡️'}
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0f172a' }}>
                        {branding.firmName || '대한관세법인'}
                      </h4>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                        {branding.firmNameEn || 'DAEHAN CUSTOMS LAW FIRM'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 800, display: 'block' }}>
                      공식 검토의견서
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#94a3b8' }}>
                      문서번호: DOC-2026-HS-0941
                    </span>
                  </div>
                </div>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '14px'
                }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    수신: (주)한국통상 무역부 귀하
                  </span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    [품목분류 사전심사 검토의견서] 무선 통신 모듈
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: 1.5 }}>
                    관세율표 제8517.62-6090호 해당 (통칙 제1호 및 제6호, WCO 해설서 제8517호 해설 근거)
                  </div>
                </div>
              </div>

              {/* Bottom Stamp & Verification Row */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  borderTop: '1px dashed #cbd5e1',
                  paddingTop: '14px',
                  marginTop: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      작성일자: {new Date().toLocaleDateString('ko-KR')}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {branding.firmName} 대표/담당
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>{branding.brokerName || '홍길동 공인관세사'}</span>
                      <span style={{ fontSize: '0.68rem', color: '#0284c7', fontWeight: 600 }}>({branding.licenseNo})</span>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '4px' }}>
                      📞 {branding.phone || '02-540-1234'} | ✉️ {branding.email || 'customs@daehan.kr'}
                    </div>
                  </div>

                  {/* Red Official Seal Graphic */}
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '3px solid #dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                    fontWeight: 900,
                    fontSize: '0.72rem',
                    textAlign: 'center',
                    lineHeight: 1.15,
                    padding: '4px',
                    boxShadow: '0 0 0 1px rgba(220,38,38,0.2)',
                    transform: 'rotate(-4deg)',
                    userSelect: 'none',
                    background: 'rgba(254, 242, 242, 0.4)'
                  }}>
                    {branding.sealText || '대한관세법인인'}
                  </div>
                </div>

                {/* Co-Branding Verification Badge (Bottom) */}
                {branding.brandingMode === 'co-branding' && (
                  <div style={{
                    marginTop: '12px',
                    padding: '6px 10px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.62rem',
                    color: '#166534'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={11} color="#16a34a" />
                      <span><strong>AI 검증 엔진:</strong> CUSWAY Customs AI Master (9,450건 DB)</span>
                    </div>
                    <span style={{ fontWeight: 700, color: '#047857' }}>[진위확인 QR 완료]</span>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Footer Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #334155',
            paddingTop: '16px',
            marginTop: '4px'
          }}>
            <button
              type="button"
              onClick={handleResetToDefault}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={13} /> 기본값 초기화
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>

              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  background: saveSuccess ? '#10b981' : 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                  transition: 'all 0.2s ease'
                }}
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle size={16} /> 설정 저장 완료!
                  </>
                ) : (
                  <>
                    <Save size={16} /> 브랜딩 설정 저장하기
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
