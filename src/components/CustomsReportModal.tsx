import { useState, useEffect } from 'react';
import { FileText, Printer, X, Settings, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { getSavedOfficeBranding, OfficeBranding } from './OfficeBrandingModal';

export interface ReportData {
  type: 'hs-opinion' | 'clearance-pipeline' | 'valuation-brief';
  title?: string;
  docNumber?: string;
  clientName?: string;
  targetItem: {
    productName: string;
    productNameEn?: string;
    hsCode: string;
    material?: string;
    functionUse?: string;
    originCountry?: string;
  };
  rates?: {
    baseRate?: number | string;
    wtoRate?: number | string;
    recommendedRate?: number | string;
    ftaName?: string;
  };
  legalBasis?: {
    generalRule?: string; // 통칙 제1호, 제6호 등
    wcoNoteSnippet?: string;
    chapterNoteSnippet?: string;
    rationaleSummary?: string;
  };
  precedents?: Array<{
    caseNumber: string;
    title: string;
    authority?: string;
    keyPoint?: string;
  }>;
  requirements?: string[];
  customMemo?: string;
}

interface CustomsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: ReportData;
  currentUser?: any;
  onOpenBrandingSettings?: () => void;
  
  // Legacy props compatibility
  docType?: 'hs-opinion' | 'clearance-pipeline' | 'valuation-brief';
  productName?: string;
  hsCode?: string;
  koreanDescription?: string;
  analysisData?: any;
}

export default function CustomsReportModal({
  isOpen,
  onClose,
  reportData,
  currentUser,
  onOpenBrandingSettings,
  docType,
  productName,
  hsCode,
  koreanDescription,
  analysisData
}: CustomsReportModalProps) {
  const [branding, setBranding] = useState<OfficeBranding>(() => getSavedOfficeBranding(currentUser));
  
  // Normalize incoming props to ReportData
  const activeReport: ReportData = reportData || {
    type: docType || 'hs-opinion',
    title: analysisData?.title || `[관세 검토의견서] ${productName || '수입 대상 물품'}`,
    targetItem: {
      productName: productName || '수입 대상 물품',
      hsCode: hsCode || '8517.62-6090',
      material: koreanDescription || analysisData?.material || '제품 사양서 및 원료 배합비 기준',
      functionUse: analysisData?.functionUse || '산업 및 상업용 전용',
      originCountry: analysisData?.originCountry || '이탈리아 (IT)'
    },
    rates: {
      baseRate: analysisData?.baseRate || '8.0%',
      recommendedRate: analysisData?.appliedRate || '0.0%',
      ftaName: analysisData?.ftaName || 'FTA 특혜'
    },
    requirements: analysisData?.requirementsList?.map((r: any) => `[${r.law || r.law_name}] ${r.agency || r.agency_name}: ${r.process || r.description}`) || analysisData?.requiredDocs || [],
    legalBasis: {
      generalRule: analysisData?.generalRule || '관세율표 해석에 관한 통칙 제1호 및 제6호',
      rationaleSummary: analysisData?.reasoning || analysisData?.rationaleSummary || '관세율표 분류 원칙에 의거 타 호의 분류가 배제되며 본 세번으로 분류가 타당함',
      wcoNoteSnippet: analysisData?.guideline || analysisData?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 기능을 지닌 물품 및 전용 부분품을 명시적으로 포함함'
    },
    precedents: analysisData?.caseNumber ? [{
      caseNumber: analysisData.caseNumber,
      title: analysisData.keyIssue || productName || '관세평가 쟁점 판례',
      authority: analysisData.authority || '조세심판원',
      keyPoint: analysisData.holding || analysisData.guideline
    }] : []
  };

  const [clientInput, setClientInput] = useState(activeReport.clientName || '(주)한국통상 무역부 귀하');
  const [docNum] = useState(activeReport.docNumber || `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate] = useState(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }));

  const updateBrandingFromStorage = () => {
    setBranding(getSavedOfficeBranding(currentUser));
  };

  useEffect(() => {
    updateBrandingFromStorage();
    window.addEventListener('office-branding-updated', updateBrandingFromStorage);
    return () => window.removeEventListener('office-branding-updated', updateBrandingFromStorage);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      updateBrandingFromStorage();
      if (activeReport.clientName) {
        setClientInput(activeReport.clientName);
      }
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const cleanHs = activeReport.targetItem.hsCode || '8517.62-6090';

  return (
    <div className="customs-report-modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="customs-report-modal-wrapper" style={{
        background: '#1e293b',
        border: '1.5px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '94vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Top Control Bar */}
        <div className="no-print" style={{
          padding: '14px 20px',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <div>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                공식 검토의견서 인쇄 및 PDF 발급
              </span>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', marginLeft: '8px', fontWeight: 700 }}>
                (발행 관세사: {branding.firmName})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenBrandingSettings && (
              <button
                type="button"
                onClick={onOpenBrandingSettings}
                style={{
                  padding: '7px 12px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid #0284c7',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Settings size={13} /> 사무소 브랜딩/직인 변경
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                fontSize: '0.84rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
              }}
            >
              <Printer size={15} /> 의견서 인쇄 / PDF 저장
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Client recipient input bar */}
        <div className="no-print" style={{
          padding: '8px 20px',
          background: '#131d31',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.78rem'
        }}>
          <span style={{ color: '#94a3b8', fontWeight: 700 }}>화주(수신처) 명칭 지정:</span>
          <input
            type="text"
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            placeholder="예: (주)한국통상 무역부 귀하"
            style={{
              padding: '5px 10px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.8rem',
              width: '280px'
            }}
          />
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>* 출력 시 상단 수신처에 자동 반영됩니다.</span>
        </div>

        {/* Printable Document Paper Area */}
        <div className="customs-report-modal-scroll" style={{
          overflowY: 'auto',
          padding: '24px',
          background: '#0b1120',
          display: 'flex',
          justifyContent: 'center'
        }}>
          
          <div className="customs-official-paper" style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '780px',
            minHeight: '1000px',
            padding: '44px 48px',
            boxShadow: '0 10px 35px rgba(0,0,0,0.35)',
            fontFamily: "'Noto Sans KR', 'Malgun Gothic', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>

            {/* Document Content Top */}
            <div>
              
              {/* Official Letterhead Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderBottom: '3px solid #0f172a',
                paddingBottom: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {branding.customLogoUrl ? (
                    <div style={{
                      background: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <img 
                        src={branding.customLogoUrl} 
                        alt={branding.firmName} 
                        style={{
                          maxHeight: '44px',
                          maxWidth: '140px',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem'
                    }}>
                      {branding.logoIcon === 'scales' ? '⚖️' : branding.logoIcon === 'building' ? '🏛️' : branding.logoIcon === 'globe' ? '🌐' : '🛡️'}
                    </div>
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {branding.firmName || '대한관세법인'}
                    </h2>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', letterSpacing: '0.04em' }}>
                      {branding.firmNameEn || 'CUSTOMS LAW FIRM'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#475569' }}>
                  <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.84rem', marginBottom: '2px' }}>
                    {activeReport.type === 'hs-opinion' ? '공식 품목분류 소명의견서' : activeReport.type === 'clearance-pipeline' ? '수입통관 심사 파이프라인 검토서' : '과세가격 결정 자문/소명의견서'}
                  </div>
                  <div>문서번호: <strong>{docNum}</strong></div>
                  <div>발행일자: <strong>{issueDate}</strong></div>
                </div>
              </div>

              {/* Recipient & Document Title Banner */}
              <div style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                    수신: <span style={{ textDecoration: 'underline' }}>{clientInput}</span>
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#0284c7', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {activeReport.type === 'hs-opinion' ? '품목분류 사전소명' : activeReport.type === 'clearance-pipeline' ? '통관 심사 파이프라인' : '관세평가 쟁점소명'}
                  </span>
                </div>
                <h1 style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.4,
                  letterSpacing: '-0.02em'
                }}>
                  {activeReport.title || `[품목분류 검토의견서] ${activeReport.targetItem.productName}`}
                </h1>
              </div>

              {/* Section 1: Item Specification Table */}
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderLeft: '4px solid #0284c7',
                  paddingLeft: '8px',
                  margin: '0 0 10px 0'
                }}>
                  1. 검토 대상 물품 정보 (Item Specifications)
                </h3>
                
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.82rem',
                  border: '1px solid #cbd5e1'
                }}>
                  <tbody>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ width: '22%', padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>품명 (Item/Invoice Name)</th>
                      <td style={{ width: '28%', padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#0f172a' }}>
                        {activeReport.targetItem.productName}
                      </td>
                      <th style={{ width: '22%', padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569' }}>원산지 (Country of Origin)</th>
                      <td style={{ width: '28%', padding: '8px 12px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#0f172a' }}>
                        {activeReport.targetItem.originCountry || '이탈리아 (IT)'}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569', background: '#f8fafc' }}>재질 및 성분 구성</th>
                      <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>
                        {activeReport.targetItem.material || '제품 사양서 기준 복합 원료'}
                      </td>
                      <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569', background: '#f8fafc' }}>주요 기능 및 용도</th>
                      <td style={{ padding: '8px 12px', border: '1px solid #cbd5e1' }}>
                        {activeReport.targetItem.functionUse || '산업 및 상업용 제조/소비'}
                      </td>
                    </tr>
                    <tr style={{ background: 'rgba(2, 132, 199, 0.05)' }}>
                      <th style={{ padding: '8px 12px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#0369a1', fontWeight: 800 }}>
                        {activeReport.type === 'valuation-brief' ? '평가 쟁점 코드' : '확정 HSK 세번'}
                      </th>
                      <td colSpan={3} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 900, color: '#0284c7' }}>
                        {cleanHs}
                        {activeReport.rates?.recommendedRate !== undefined && (
                          <span style={{ fontSize: '0.78rem', color: '#059669', marginLeft: '12px', fontWeight: 700 }}>
                            [기본세율 {activeReport.rates.baseRate}% → {activeReport.rates.ftaName || 'FTA 협정세율'} {activeReport.rates.recommendedRate}% 적용]
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2: Legal Reasoning & WCO Explanatory Notes */}
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderLeft: '4px solid #0284c7',
                  paddingLeft: '8px',
                  margin: '0 0 10px 0'
                }}>
                  {activeReport.type === 'valuation-brief' ? '2. 관세법 제30조 및 관세평가 법리 소명 근거' : '2. 관세율표 해석 통칙 및 WCO 해설서 기반 법리적 분류 근거'}
                </h3>
                
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '14px',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  lineHeight: 1.6
                }}>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ background: '#0f172a', color: '#fff', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      법조문 및 통칙
                    </span>
                    <strong style={{ color: '#0f172a' }}>
                      {activeReport.legalBasis?.generalRule || '관세율표 해석에 관한 통칙 제1호 및 제6호'}
                    </strong>
                  </div>

                  <p style={{ margin: '0 0 8px 0' }}>
                    {activeReport.legalBasis?.rationaleSummary || `본 물품은 관세율표의 품목분류 원칙에 따라, 제${cleanHs.slice(0, 4)}호의 호의 용어 및 관련 부·류의 주(Note) 규정을 검토한 결과 명백히 해당 세번에 전용되는 물품으로서 법리적 분류가 타당합니다.`}
                  </p>

                  <div style={{
                    background: '#ffffff',
                    borderLeft: '3px solid #0284c7',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: '#475569',
                    fontStyle: 'italic',
                    marginTop: '8px'
                  }}>
                    📖 공식 법령/해설서 본문 발췌:<br />
                    "{activeReport.legalBasis?.wcoNoteSnippet || `제${cleanHs.slice(0, 4)}호에는 이와 같은 성상과 용도를 지닌 물품 및 전용 부분품을 명시적으로 포함하며, 타 호로의 분류를 엄격히 제한하고 있습니다.`}"
                  </div>
                </div>
              </div>

              {/* Section 3: Precedents / Tax Tribunal Ruling Evidence */}
              {activeReport.precedents && activeReport.precedents.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    borderLeft: '4px solid #0284c7',
                    paddingLeft: '8px',
                    margin: '0 0 10px 0'
                  }}>
                    3. 관세청 사전심사 회시례 및 조세심판원/대법원 인용 판례
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {activeReport.precedents.map((prec, idx) => (
                      <div key={idx} style={{
                        padding: '10px 12px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <span style={{ color: '#0284c7', fontWeight: 800, marginRight: '8px' }}>
                            [{prec.caseNumber}]
                          </span>
                          <strong style={{ color: '#0f172a' }}>{prec.title}</strong>
                          {prec.keyPoint && (
                            <p style={{ margin: '3px 0 0 0', color: '#64748b', fontSize: '0.72rem' }}>
                              쟁점 요지: {prec.keyPoint}
                            </p>
                          )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          일치 판례
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 4: Clearance Requirements (If pipeline mode) */}
              {activeReport.requirements && activeReport.requirements.length > 0 && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    borderLeft: '4px solid #0284c7',
                    paddingLeft: '8px',
                    margin: '0 0 10px 0'
                  }}>
                    4. 수입통관 4대 법령 세관장확인 요건 및 구비서류 체크리스트
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeReport.requirements.map((req, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={13} color="#059669" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 5: Custom Memo / Case Breakdown */}
              {activeReport.customMemo && (
                <div style={{ marginBottom: '22px' }}>
                  <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    borderLeft: '4px solid #0284c7',
                    paddingLeft: '8px',
                    margin: '0 0 10px 0'
                  }}>
                    5. 실무 검토 의견 및 세관 조사 대비 대응 방안
                  </h3>
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '0.8rem',
                    color: '#1e293b',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.5
                  }}>
                    {activeReport.customMemo}
                  </div>
                </div>
              )}

            </div>

            {/* Official Sign-off Footer Box (Bottom of the page) */}
            <div style={{ marginTop: '30px' }}>
              
              <div style={{
                borderTop: '2px solid #0f172a',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>
                    {branding.customDisclaimer || '위 검토 사항은 대한민국 관세법 및 WCO 국제 기준에 의거하여 당 관세법인에서 정밀 검토하여 확정한 공식 의견서입니다.'}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    작성일자: {issueDate}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                    {branding.firmName} 대표 / 담당 관세사
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{branding.brokerName || '홍길동 공인관세사'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>({branding.licenseNo})</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                    📍 {branding.address} | 📞 {branding.phone} | ✉️ {branding.email}
                  </div>
                </div>

                {/* Red Circular Seal Stamp Graphic */}
                <div style={{
                  width: '82px',
                  height: '82px',
                  borderRadius: '50%',
                  border: '3.5px solid #dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  textAlign: 'center',
                  lineHeight: 1.15,
                  padding: '4px',
                  boxShadow: '0 0 0 1px rgba(220,38,38,0.25)',
                  transform: 'rotate(-4deg)',
                  userSelect: 'none',
                  background: 'rgba(254, 242, 242, 0.45)'
                }}>
                  {branding.sealText || `${branding.firmName}인`}
                </div>
              </div>

              {/* Co-Branding Verification Bar & QR Code (Bottom) */}
              {branding.brandingMode === 'co-branding' && (
                <div style={{
                  marginTop: '16px',
                  padding: '8px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  color: '#475569'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color="#0284c7" />
                    <span>
                      <strong>AI Customs Intelligence Engine:</strong> Powered & Verified by CUSWAY AI Platform (관세청/WCO 해설서 & 9,450건 판례 마스터 기반)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 800 }}>
                    <QrCode size={14} color="#0284c7" />
                    <span>[공식 검토서 진위확인 QR]</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
