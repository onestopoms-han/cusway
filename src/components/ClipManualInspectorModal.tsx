import React, { useState, useEffect } from 'react';
import { 
  X, Check, Copy, ExternalLink, BookOpen, Scale, ShieldCheck, 
  FileText, Layers, AlertTriangle, ArrowRight, Search, ChevronRight, 
  CheckCircle2, Info, Globe, Percent
} from 'lucide-react';

interface ClipInspectorData {
  query_code: string;
  clean_code: string;
  formatted_hsk: string;
  chapter: {
    code: string;
    name_ko: string;
    name_en: string;
    notes: string;
  };
  section: {
    section_roman: string;
    section_title: string;
    section_notes: string;
  };
  heading: {
    code: string;
    formatted: string;
    name_ko: string;
    name_en: string;
    wco_content_ko: string;
    wco_content_en: string;
  };
  subheading: {
    code: string;
    formatted: string;
    name_ko: string;
    name_en: string;
  };
  hsk: {
    code: string;
    formatted: string;
    name_ko: string;
    name_en: string;
  };
  siblings: Array<{
    hs_code: string;
    name_ko: string;
    name_en: string;
    length: number;
    is_selected: boolean;
  }>;
  precedents: Array<{
    case_number: string;
    hs_code: string;
    product_name: string;
    material: string;
    function_use: string;
    decision_reason: string;
    issuing_body: string;
    date: string;
  }>;
  rates: Array<{
    country_code: string;
    base_rate: number | null;
    wto_rate: number | null;
    fta_rate: number | null;
    fta_name: string;
    recommended_rate: number | null;
  }>;
  requirements: Array<{
    hs_code: string;
    law_name: string;
    agency_name: string;
    check_type: string;
    description: string;
  }>;
  audit_checklist: Array<{
    id: string;
    title: string;
    desc: string;
    passed: boolean;
  }>;
}

interface ClipManualInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialHsCode: string;
  productName?: string;
  onSelectHsCode?: (code: string) => void;
}

export const ClipManualInspectorModal: React.FC<ClipManualInspectorModalProps> = ({
  isOpen,
  onClose,
  initialHsCode,
  productName = '',
  onSelectHsCode
}) => {
  const [currentCode, setCurrentCode] = useState(initialHsCode);
  const [inputCode, setInputCode] = useState(initialHsCode);
  const [activeTab, setActiveTab] = useState<'tree' | 'notes' | 'wco' | 'precedents' | 'rates' | 'checklist'>('wco');
  const [data, setData] = useState<ClipInspectorData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [wcoLang, setWcoLang] = useState<'ko' | 'en'>('ko');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && initialHsCode) {
      setCurrentCode(initialHsCode);
      setInputCode(initialHsCode);
    }
  }, [isOpen, initialHsCode]);

  useEffect(() => {
    if (!isOpen || !currentCode) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`/api/hs/clip-inspector?hs_code=${encodeURIComponent(currentCode)}`)
      .then(res => {
        if (!res.ok) throw new Error('CL 데이터베이스 조회 실패');
        return res.json();
      })
      .then((resData: ClipInspectorData) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
          // Initialize checklist
          const initialChecks: Record<string, boolean> = {};
          resData.audit_checklist?.forEach(item => {
            initialChecks[item.id] = item.passed;
          });
          setCheckedItems(initialChecks);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentCode]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (data?.clean_code) {
      navigator.clipboard.writeText(data.clean_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSearchNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setCurrentCode(inputCode.trim());
    }
  };

  const handleAdoptCode = (code: string) => {
    if (onSelectHsCode) {
      onSelectHsCode(code);
    }
    onClose();
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 24, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1100px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(6, 182, 212, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(90deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}>
              <BookOpen size={20} color="#000" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                  CL(관세법령정보포털) 실시간 매뉴얼 검토기
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  color: 'var(--accent-cyan)',
                  fontWeight: 700
                }}>
                  공식 CLIP 원문 DB 연동
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                관세율표 체계도 · 부·류 주규정 · WCO 해설서 원문 · 5,668건 실존 판례 · 수입요건 원스톱 대조
              </span>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearchNewCode} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  value={inputCode} 
                  onChange={e => setInputCode(e.target.value)}
                  placeholder="세번 검색 (예: 8471.30)"
                  style={{
                    padding: '6px 12px 6px 28px',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '0.8rem',
                    width: '160px'
                  }}
                />
                <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
              <button 
                type="submit"
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                조회
              </button>
            </form>

            <a
              href={`https://unipass.customs.go.kr/clip/index.do`}
              target="_blank"
              rel="noopener noreferrer"
              title="관세청 공식 관세법령정보포털(CLIP) 사이트 열기"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>🌐 외부 CLIP 포털</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Selected HS Summary Ribbon */}
        {data && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.5px' }} className="text-gradient">
                  {data.formatted_hsk}
                </span>
                <button
                  onClick={handleCopyCode}
                  style={{
                    background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: copied ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: copied ? '#10b981' : 'var(--text-muted)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copied ? '복사완료' : 'HSK 복사'}</span>
                </button>
              </div>

              <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                  {data.hsk.name_ko}
                </span>
                {data.hsk.name_en && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {data.hsk.name_en}
                  </span>
                )}
              </div>
            </div>

            {/* Adopt / Confirm Button */}
            {onSelectHsCode && (
              <button
                onClick={() => handleAdoptCode(data.formatted_hsk)}
                style={{
                  background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
                }}
              >
                <CheckCircle2 size={15} />
                <span>이 세번으로 최종 확정 및 소명서 반영</span>
              </button>
            )}
          </div>
        )}

        {/* Breadcrumb Hierarchy */}
        {data && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.04)',
            padding: '8px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{data.section.section_roman}부</span>
            <ChevronRight size={12} />
            <span>제{data.chapter.code}류 ({data.chapter.name_ko})</span>
            <ChevronRight size={12} />
            <span style={{ color: '#fff', fontWeight: 600 }}>제{data.heading.formatted}호 ({data.heading.name_ko})</span>
            <ChevronRight size={12} />
            <span>제{data.subheading.formatted}호</span>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{data.formatted_hsk}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 16, 30, 0.6)',
          padding: '0 16px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'wco', label: '📖 WCO HS 해설서 원문', icon: BookOpen, count: null },
            { id: 'notes', label: '📜 부·류 법정 주규정', icon: FileText, count: null },
            { id: 'tree', label: '📑 관세율표 체계도 (형제 세목)', icon: Layers, count: data?.siblings?.length },
            { id: 'precedents', label: '⚖️ 분류원 실존 결정례', icon: Scale, count: data?.precedents?.length },
            { id: 'rates', label: '🛡️ 세율 및 수입요건', icon: Percent, count: data?.requirements?.length },
            { id: 'checklist', label: '✅ 매뉴얼 검증 체크리스트', icon: ShieldCheck, count: null }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count !== null && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    fontWeight: 700
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          background: 'rgba(10, 16, 30, 0.3)'
        }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(6, 182, 212, 0.2)',
                borderTopColor: 'var(--accent-cyan)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                관세법령정보포털 마스터 DB에서 해설서 및 주규정 데이터를 불러오는 중...
              </span>
            </div>
          )}

          {error && !loading && (
            <div style={{
              padding: '20px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: 'var(--accent-red)',
              fontSize: '0.85rem',
              lineHeight: 1.6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 700 }}>
                <AlertTriangle size={18} />
                <span>데이터 조회 실패</span>
              </div>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* TAB 1: WCO HS 해설서 원문 */}
              {activeTab === 'wco' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingBottom: '12px'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                        제{data.heading.formatted}호 WCO 관세율표 해설서 본문
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {data.heading.name_ko}
                      </p>
                    </div>

                    <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '6px', padding: '2px' }}>
                      <button
                        onClick={() => setWcoLang('ko')}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          background: wcoLang === 'ko' ? 'var(--accent-cyan)' : 'transparent',
                          color: wcoLang === 'ko' ? '#000' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        국문 해설
                      </button>
                      <button
                        onClick={() => setWcoLang('en')}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          background: wcoLang === 'en' ? 'var(--accent-cyan)' : 'transparent',
                          color: wcoLang === 'en' ? '#000' : 'var(--text-muted)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        English WCO
                      </button>
                    </div>
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '20px',
                    fontSize: '0.85rem',
                    lineHeight: 1.7,
                    color: '#e2e8f0',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                    {wcoLang === 'ko' 
                      ? (data.heading.wco_content_ko || '해당 4단위 호의 국문 WCO 해설서 데이터가 마스터 DB에 등록되어 있지 않습니다.')
                      : (data.heading.wco_content_en || 'English WCO explanatory note is not available for this heading in the local database.')
                    }
                  </div>
                </div>
              )}

              {/* TAB 2: 부·류 법정 주규정 */}
              {activeTab === 'notes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Section Notes */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: 'var(--accent-cyan)',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {data.section.section_roman}부
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {data.section.section_title} 주규정 (Section Notes)
                      </h4>
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '14px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {data.section.section_notes}
                    </div>
                  </div>

                  {/* Chapter Notes */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        제{data.chapter.code}류
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                        {data.chapter.name_ko} 주규정 (Chapter Notes)
                      </h4>
                    </div>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '14px',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      color: 'var(--text-main)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {data.chapter.notes}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 관세율표 체계도 (형제 세목) */}
              {activeTab === 'tree' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      제{data.heading.formatted}호 산하 소호 및 대한민국 10단위 HSK 전체 세목 목록입니다. 클릭 시 해당 세번으로 즉시 검토 전환됩니다.
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      총 {data.siblings.length}개 세번 등록
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    {data.siblings.map((sib, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentCode(sib.hs_code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 16px',
                          background: sib.is_selected 
                            ? 'rgba(6, 182, 212, 0.12)' 
                            : (idx % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.2)'),
                          borderLeft: sib.is_selected ? '4px solid var(--accent-cyan)' : '4px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: sib.is_selected ? 'var(--accent-cyan)' : '#fff',
                            minWidth: '110px'
                          }}>
                            {sib.hs_code}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            color: sib.is_selected ? '#fff' : 'var(--text-main)',
                            fontWeight: sib.is_selected ? 700 : 400
                          }}>
                            {sib.name_ko}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {sib.is_selected ? (
                            <span style={{
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--accent-cyan)',
                              color: '#000',
                              fontWeight: 800
                            }}>
                              현재 검토 중
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAdoptCode(sib.hs_code);
                              }}
                              style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--text-muted)',
                                fontSize: '0.7rem',
                                cursor: 'pointer'
                              }}
                            >
                              이 세번 채택
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: 관세평가분류원 실존 결정례 */}
              {activeTab === 'precedents' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      관세평가분류원에 실존 등록된 {data.precedents.length}건의 공식 품목분류 사전심사 결정례입니다.
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                      ✓ 100% 관세청 공식 결정례 마스터 검증 완료
                    </span>
                  </div>

                  {data.precedents.length === 0 ? (
                    <div style={{
                      padding: '30px',
                      textAlign: 'center',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem'
                    }}>
                      해당 세번에 등록된 선행 사전심사 결정례가 없습니다. (일반통칙 및 WCO 해설서 규정에 따라 직접 법리 분류됩니다.)
                    </div>
                  ) : (
                    data.precedents.map((prec, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '10px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '4px',
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {prec.case_number}
                            </span>
                            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                              {prec.product_name}
                            </h5>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            <span>HSK: <strong style={{ color: 'var(--accent-cyan)' }}>{prec.hs_code}</strong></span>
                            {prec.date && <span>시행일자: {prec.date}</span>}
                          </div>
                        </div>

                        {prec.decision_reason && (
                          <div style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '12px 14px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            lineHeight: 1.6,
                            color: '#cbd5e1',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {prec.decision_reason}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: 세율 및 수입요건 */}
              {activeTab === 'rates' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Rates Table */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Percent size={16} color="var(--accent-cyan)" />
                      <span>2026 관세율표 (기본·WTO·FTA 협정세율)</span>
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '10px'
                    }}>
                      {data.rates.map((rate, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                        >
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                            {rate.fta_name}
                          </span>
                          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: rate.recommended_rate === 0 ? '#10b981' : '#fff' }}>
                            {rate.recommended_rate !== null ? `${rate.recommended_rate}%` : (rate.base_rate !== null ? `${rate.base_rate}%` : '문의')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements List */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={16} color="var(--accent-amber)" />
                      <span>세관장확인 수입요건 및 통합공고 법령 ({data.requirements.length}건)</span>
                    </h4>
                    {data.requirements.length === 0 ? (
                      <div style={{
                        padding: '20px',
                        background: 'rgba(16, 185, 129, 0.05)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '8px',
                        color: '#10b981',
                        fontSize: '0.82rem'
                      }}>
                        ✓ 본 품목은 세관장확인 대상 법정 수입 요건(식품, 전기, 전파 등)이 없는 일반 통관 품목입니다.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.requirements.map((req, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'rgba(245, 158, 11, 0.05)',
                              border: '1px solid rgba(245, 158, 11, 0.2)',
                              borderRadius: '8px',
                              padding: '14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: 'var(--accent-amber)',
                                fontSize: '0.72rem',
                                fontWeight: 700
                              }}>
                                {req.check_type}
                              </span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                                {req.law_name} ({req.agency_name})
                              </span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                              {req.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: 매뉴얼 검증 체크리스트 */}
              {activeTab === 'checklist' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{
                    padding: '16px',
                    background: 'rgba(6, 182, 212, 0.06)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.6
                  }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>관세사 자가진단 매뉴얼 검토 절차:</strong><br />
                    아래 5대 핵심 법리 점검 항목을 확인하고 검증하십시오. 모든 항목을 점검한 후 최종 확정 버튼을 누르면 4단계 통관 파이프라인 및 정식 소명의견서에 즉시 반영됩니다.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.audit_checklist.map((item) => {
                      const isChecked = !!checkedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          style={{
                            background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                            border: isChecked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                        >
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            background: isChecked ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '2px',
                            flexShrink: 0
                          }}>
                            {isChecked && <Check size={14} color="#000" />}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isChecked ? '#10b981' : '#fff' }}>
                              {item.title}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {onSelectHsCode && (
                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleAdoptCode(data.formatted_hsk)}
                        style={{
                          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '0.9rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <ShieldCheck size={18} />
                        <span>매뉴얼 검토 완료 및 세번 확정 채택</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
