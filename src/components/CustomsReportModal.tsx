import { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  Settings, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Edit3, 
  RotateCcw, 
  Check, 
  Plus, 
  Trash2,
  Sparkles,
  Info,
  Share2
} from 'lucide-react';
import { getSavedOfficeBranding, OfficeBranding } from './OfficeBrandingModal';
import { getOriginMarkingGuide } from '../utils/originMarkingHelper';
import ResultShareModal from './ResultShareModal';

export interface ReportData {
  type: 'hs-opinion' | 'clearance-pipeline' | 'valuation-brief';
  title?: string;
  docNumber?: string;
  clientName?: string;
  referenceName?: string;
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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Initial Report Generator
  const buildInitialReport = (): ReportData => {
    if (reportData) return reportData;

    return {
      type: docType || 'hs-opinion',
      title: analysisData?.title || `[품목분류 사전심사 소명의견서] ${productName || '수입 대상 물품'}`,
      docNumber: `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: '(주)한국통상 무역부 귀하',
      referenceName: '통관·무역·수출입 총괄 담당자 귀하',
      targetItem: {
        productName: productName || '수입 대상 물품',
        hsCode: hsCode || '8517.62-6090',
        material: koreanDescription || analysisData?.material || '제품 사양서 및 원료 배합비 기준',
        functionUse: analysisData?.functionUse || '산업 및 상업용 전용',
        originCountry: analysisData?.originCountry || '수입신고 원산지 기준 (협정세율 검토)'
      },
      rates: {
        baseRate: analysisData?.baseRate || '8.0%',
        recommendedRate: analysisData?.appliedRate || '0.0%',
        ftaName: analysisData?.ftaName || 'FTA 특혜'
      },
      requirements: analysisData?.requirementsList?.map((r: any) => `[${r.law || r.law_name}] ${r.agency || r.agency_name}: ${r.process || r.description}`) || analysisData?.requiredDocs || [],
      legalBasis: {
        generalRule: analysisData?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호',
        rationaleSummary: analysisData?.reasoning || analysisData?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 명백히 본 세번으로 분류가 타당함',
        wcoNoteSnippet: analysisData?.guideline || analysisData?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 기능을 지닌 물품 및 전용 부분품을 명시적으로 포함함'
      },
      precedents: analysisData?.caseNumber ? [{
        caseNumber: analysisData.caseNumber,
        title: analysisData.keyIssue || productName || '관세평가/품목분류 쟁점 판례',
        authority: analysisData.authority || '관세평가분류원',
        keyPoint: analysisData.holding || analysisData.guideline || '물품 성상 및 주기능 일치 판정'
      }] : [],
      customMemo: '■ 관세사 종합의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.'
    };
  };

  const initialData = buildInitialReport();

  // Editable Form States
  const [docTitle, setDocTitle] = useState(initialData.title || '[품목분류 사전심사 소명의견서]');
  const [docNumber, setDocNumber] = useState(initialData.docNumber || `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [clientInput, setClientInput] = useState(initialData.clientName || '(주)한국통상 무역부 귀하');
  const [refInput, setRefInput] = useState(initialData.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
  const [brokerContactName, setBrokerContactName] = useState(branding.brokerName || '홍길동 공인관세사');

  // Item Specs
  const [prodName, setProdName] = useState(initialData.targetItem.productName);
  const [originCountry, setOriginCountry] = useState(initialData.targetItem.originCountry || '중국 (CN)');
  const [material, setMaterial] = useState(initialData.targetItem.material || '제품 사양서 및 원료 배합비 기준');
  const [functionUse, setFunctionUse] = useState(initialData.targetItem.functionUse || '산업 및 상업용 전용');
  const [targetHsCode, setTargetHsCode] = useState(initialData.targetItem.hsCode || '8517.62-6090');
  const [rateComment, setRateComment] = useState(
    initialData.rates?.recommendedRate !== undefined
      ? `기본세율 ${initialData.rates.baseRate || '8.0%'} ➡️ ${initialData.rates.ftaName || 'FTA 특혜'} ${initialData.rates.recommendedRate}% 적용`
      : '수입신고 시 추천 특혜세율 검토 적용'
  );

  // Legal Basis
  const [generalRule, setGeneralRule] = useState(initialData.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
  const [rationaleSummary, setRationaleSummary] = useState(initialData.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
  const [wcoNoteSnippet, setWcoNoteSnippet] = useState(initialData.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');

  // Precedents & Rulings
  const [precedentsList, setPrecedentsList] = useState(initialData.precedents || []);

  // Requirements List
  const [requirementsList, setRequirementsList] = useState(initialData.requirements || []);
  const [customRequirementNote, setCustomRequirementNote] = useState('');

  // Origin Marking Guide
  const [cleanHs, setCleanHs] = useState(initialData.targetItem.hsCode || '8517.62-6090');
  const originGuide = getOriginMarkingGuide(cleanHs, prodName, originCountry);
  const [originMarkExample, setOriginMarkExample] = useState(`${originGuide.koreanMarkExample} / ${originGuide.englishMarkExample}`);
  const [originLocationMethod, setOriginLocationMethod] = useState(`[위치] ${originGuide.markingLocation} | [방식] ${originGuide.markingMethod}`);
  const [originDoubleMark, setOriginDoubleMark] = useState(originGuide.isPackagingDoubleMarkRequired ? '⚠️ 필수 (물품 본체 + 최소 개별 외포장 모두 표시)' : '선택적 (용기 단위 식별 가능 시)');
  const [originExemption, setOriginExemption] = useState(originGuide.exemptionRule);

  // Custom Memo
  const [customMemo, setCustomMemo] = useState(
    initialData.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.'
  );

  const updateBrandingFromStorage = () => {
    const b = getSavedOfficeBranding(currentUser);
    setBranding(b);
    setBrokerContactName(b.brokerName || '홍길동 공인관세사');
  };

  useEffect(() => {
    updateBrandingFromStorage();
    window.addEventListener('office-branding-updated', updateBrandingFromStorage);
    return () => window.removeEventListener('office-branding-updated', updateBrandingFromStorage);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      updateBrandingFromStorage();
      const fresh = buildInitialReport();
      setDocTitle(fresh.title || '[품목분류 사전심사 소명의견서]');
      setClientInput(fresh.clientName || '(주)한국통상 무역부 귀하');
      setRefInput(fresh.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
      setProdName(fresh.targetItem.productName);
      setOriginCountry(fresh.targetItem.originCountry || '중국 (CN)');
      setMaterial(fresh.targetItem.material || '제품 사양서 및 원료 배합비 기준');
      setFunctionUse(fresh.targetItem.functionUse || '산업 및 상업용 전용');
      setTargetHsCode(fresh.targetItem.hsCode || '8517.62-6090');
      setCleanHs(fresh.targetItem.hsCode || '8517.62-6090');
      setGeneralRule(fresh.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
      setRationaleSummary(fresh.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
      setWcoNoteSnippet(fresh.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');
      setPrecedentsList(fresh.precedents || []);
      setRequirementsList(fresh.requirements || []);
      setCustomMemo(fresh.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.');
    }
  }, [isOpen, reportData, productName, hsCode]);

  // Reset to original AI recommendations
  const handleResetToDefault = () => {
    if (!confirm('AI가 분석한 초기 소명의견서 원문으로 되돌리시겠습니까? (작성 중인 수정 내용이 초기화됩니다)')) return;
    const fresh = buildInitialReport();
    setDocTitle(fresh.title || '[품목분류 사전심사 소명의견서]');
    setClientInput(fresh.clientName || '(주)한국통상 무역부 귀하');
    setRefInput(fresh.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
    setProdName(fresh.targetItem.productName);
    setOriginCountry(fresh.targetItem.originCountry || '중국 (CN)');
    setMaterial(fresh.targetItem.material || '제품 사양서 및 원료 배합비 기준');
    setFunctionUse(fresh.targetItem.functionUse || '산업 및 상업용 전용');
    setTargetHsCode(fresh.targetItem.hsCode || '8517.62-6090');
    setCleanHs(fresh.targetItem.hsCode || '8517.62-6090');
    setGeneralRule(fresh.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
    setRationaleSummary(fresh.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
    setWcoNoteSnippet(fresh.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');
    setPrecedentsList(fresh.precedents || []);
    setRequirementsList(fresh.requirements || []);
    setCustomMemo(fresh.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.');
    
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handlePrint = () => {
    // Switch to preview mode right before printing to ensure highest clarity
    setIsEditMode(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleAddPrecedent = () => {
    setPrecedentsList([
      ...precedentsList,
      {
        caseNumber: `심판-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: '신규 관련 결정례 / 행정심판 인용 사례',
        authority: '조세심판원',
        keyPoint: '동일 물품에 대한 세법상 품목분류 및 과세가격 인정 판정'
      }
    ]);
  };

  const handleRemovePrecedent = (idx: number) => {
    setPrecedentsList(precedentsList.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

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
        maxWidth: '920px',
        maxHeight: '94vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Top Control Bar */}
        <div className="no-print" style={{
          padding: '12px 20px',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                  공식 검토의견서 인쇄 및 맞춤형 발급
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: isEditMode ? 'rgba(20, 184, 166, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                  color: isEditMode ? 'var(--accent-primary)' : 'var(--accent-cyan)',
                  fontWeight: 700,
                  border: isEditMode ? '1px solid var(--accent-primary)' : '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {isEditMode ? '✏️ 전문가 편집 모드' : '👁️ 인쇄 미리보기'}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                발행 관세사: <strong style={{ color: '#fff' }}>{branding.firmName}</strong> ({branding.brokerName || '홍길동 공인관세사'})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Edit Mode Switch Button */}
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              style={{
                padding: '7px 13px',
                background: isEditMode ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isEditMode ? '1.5px solid var(--accent-primary)' : '1px solid #475569',
                borderRadius: '6px',
                color: isEditMode ? 'var(--accent-primary)' : '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 750,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
            >
              <Edit3 size={13} />
              <span>{isEditMode ? '✓ 편집 완료 (미리보기)' : '✏️ 의견 직접 수정'}</span>
            </button>

            {/* Reset to AI Default */}
            <button
              type="button"
              onClick={handleResetToDefault}
              title="AI가 분석한 초기 소명의견서 문구로 되돌리기"
              style={{
                padding: '7px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#94a3b8',
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} />
              <span>원문 복원</span>
            </button>

            {onOpenBrandingSettings && (
              <button
                type="button"
                onClick={onOpenBrandingSettings}
                style={{
                  padding: '7px 11px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid #0284c7',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Settings size={12} /> 직인/로고
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              style={{
                padding: '7px 13px',
                background: '#FEE500',
                border: 'none',
                borderRadius: '6px',
                color: '#000000',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(254, 229, 0, 0.25)'
              }}
            >
              <span>💬</span>
              <span>카톡/모바일 공유</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '7px 16px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                fontSize: '0.82rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
              }}
            >
              <Printer size={14} /> 인쇄 / PDF 발급
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
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Edit Mode Guidance Banner & Quick Snippets Palette */}
        {isEditMode && (
          <div className="no-print" style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.76rem',
            color: '#e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="var(--accent-primary)" />
                <span>
                  <strong>전문가 맞춤 편집 활성화:</strong> 본문의 물품 사양, 법리적 분류 논리, WCO 해설서 발췌문, 종합의견을 직접 클릭하여 자유롭게 수정할 수 있습니다.
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                * 인쇄 시 편집된 내용 그대로 고해상도 출력됩니다.
              </span>
            </div>

            {/* Quick Legal Snippets Palette */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                ⚡ 관세 소명 상용구 1클릭 삽입:
              </span>
              {[
                {
                  label: '📌 통칙 1호·6호 기본원칙',
                  text: '관세율표 일반통칙 제1호 및 제6호에 따라 당해 호의 용어 및 관련 부·류의 주 규정에 의하여 본 세번으로 분류함.',
                  target: 'rationale'
                },
                {
                  label: '📌 통칙 3호(나) 본질적 특성',
                  text: '두 가지 이상의 재질/구성요소로 결합된 복합물품으로서, 일반통칙 제3호(나)목에 의거하여 본 물품의 주기능과 용도에 본질적인 특성(Essential Character)을 부여하는 주재료에 따라 분류함.',
                  target: 'rationale'
                },
                {
                  label: '📌 FTA C/O 특혜 요건 구비',
                  text: '■ 원산지증명서(C/O) 소명:\n수출국 정부 또는 권한있는 발급기관이 발행한 유효한 원산지증명서(C/O)를 구비하여 관세특례법상 협정세율 0% 적용 요건을 충족함.',
                  target: 'memo'
                },
                {
                  label: '📌 식물방역법 열처리 완료 소명',
                  text: '■ 식물방역법 검역 소명:\n제조공정상 고온 가열/멸균(열풍 볶음 및 살균) 처리가 완료되어 병해충 전파 우려가 없으므로 식물방역법상 가공완제품 분류 기준을 충족함.',
                  target: 'memo'
                },
                {
                  label: '📌 대외무역법 원산지표시 면제',
                  text: '■ 원산지표시 면제 소명:\n대외무역관리규정 제55조에 의거, 제조용 원자재 또는 최종소비재의 포장 단위 표시 기준을 충족하여 개별 물품 표시 의무가 면제됨.',
                  target: 'memo'
                },
                {
                  label: '📌 통칙 2호(가) 미조립 완성품',
                  text: '미조립(SKD/CKD) 상태로 수입되나, 일반통칙 제2호(가)목에 따라 완성품으로서의 본질적인 특성을 갖추고 있으므로 완성품 세번으로 분류함.',
                  target: 'rationale'
                },
                {
                  label: '📌 [TRQ] aT 양허관세 추천서 구비 안내',
                  text: '■ 시장접근물량(TRQ) 추천세율 적용 안내:\n한국농수산식품유통공사(aT) 또는 주무부처로부터 시장접근물량(TRQ) 수입추천서를 발급받아 수입신고 시 제출하여 저율 양허관세를 적용받으시기 바랍니다.',
                  target: 'memo'
                }
              ].map((snip, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => {
                    if (snip.target === 'rationale') {
                      setRationaleSummary(prev => prev ? `${prev}\n\n${snip.text}` : snip.text);
                    } else {
                      setCustomMemo(prev => prev ? `${prev}\n\n${snip.text}` : snip.text);
                    }
                    setSaveToast(true);
                    setTimeout(() => setSaveToast(false), 2000);
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid #475569',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    color: '#f8fafc',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569';
                    e.currentTarget.style.color = '#f8fafc';
                  }}
                >
                  {snip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Printable Document Paper Area */}
        <div className="customs-report-modal-scroll" style={{
          overflowY: 'auto',
          padding: '24px',
          background: '#0b1120',
          display: 'flex',
          justifyContent: 'center'
        }}>
          
          <div className="customs-official-paper print-avoid-break" style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '820px',
            minHeight: '1080px',
            padding: '44px 50px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
            fontFamily: "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            fontSize: '13px',
            lineHeight: 1.6
          }}>

            {/* Document Content */}
            <div>
              
              {/* Official Letterhead Top Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2.5px solid #0f172a',
                paddingBottom: '14px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {branding.customLogoUrl ? (
                    <div style={{
                      background: '#ffffff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '6px',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      {branding.logoIcon === 'scales' ? '⚖️' : branding.logoIcon === 'building' ? '🏛️' : branding.logoIcon === 'globe' ? '🌐' : '🛡️'}
                    </div>
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {branding.firmName || '대한관세법인'}
                    </h2>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>
                      {branding.firmNameEn || 'CUSTOMS LAW FIRM & VALUATION ADVISORY'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.76rem', color: '#475569' }}>
                  <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.84rem', marginBottom: '2px' }}>
                    {initialData.type === 'hs-opinion' ? '공식 품목분류 소명의견서' : initialData.type === 'clearance-pipeline' ? '수입통관 심사 파이프라인 검토서' : '과세가격 결정 자문/소명의견서'}
                  </div>
                  <div>문서번호: <strong style={{ color: '#0f172a' }}>{docNumber}</strong></div>
                  <div>발행일자: <strong style={{ color: '#0f172a' }}>{issueDate}</strong></div>
                </div>
              </div>

              {/* Document Meta Address Grid */}
              <div style={{
                border: '1.5px solid #334155',
                borderRadius: '4px',
                padding: '14px 18px',
                marginBottom: '22px',
                background: '#f8fafc'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '12%', padding: '4px 0', color: '#475569', fontWeight: 700 }}>수 &nbsp; 신 :</td>
                      <td style={{ width: '48%', padding: '4px 0', fontWeight: 800, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={clientInput}
                            onChange={(e) => setClientInput(e.target.value)}
                            style={{ width: '90%', padding: '3px 6px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.82rem', fontWeight: 800 }}
                          />
                        ) : (
                          clientInput
                        )}
                      </td>
                      <td style={{ width: '12%', padding: '4px 0', color: '#475569', fontWeight: 700 }}>발 &nbsp; 행 :</td>
                      <td style={{ width: '28%', padding: '4px 0', fontWeight: 800, color: '#0f172a' }}>
                        {branding.firmName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 0', color: '#475569', fontWeight: 700 }}>참 &nbsp; 조 :</td>
                      <td style={{ padding: '4px 0', color: '#334155' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={refInput}
                            onChange={(e) => setRefInput(e.target.value)}
                            style={{ width: '90%', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.8rem' }}
                          />
                        ) : (
                          refInput
                        )}
                      </td>
                      <td style={{ padding: '4px 0', color: '#475569', fontWeight: 700 }}>담당자 :</td>
                      <td style={{ padding: '4px 0', color: '#334155' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={brokerContactName}
                            onChange={(e) => setBrokerContactName(e.target.value)}
                            style={{ width: '90%', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.8rem' }}
                          />
                        ) : (
                          brokerContactName
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px dashed #cbd5e1' }}>
                      <td style={{ padding: '8px 0 2px 0', color: '#0369a1', fontWeight: 800 }}>제 &nbsp; 목 :</td>
                      <td colSpan={3} style={{ padding: '8px 0 2px 0', fontSize: '0.94rem', fontWeight: 900, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={docTitle}
                            onChange={(e) => setDocTitle(e.target.value)}
                            style={{ width: '100%', padding: '4px 8px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.92rem', fontWeight: 900 }}
                          />
                        ) : (
                          docTitle
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 1: Target Item Specifications */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      1. 검토 대상 물품 정보 (Item Specifications)
                    </h3>
                  </div>
                  {isEditMode && <span style={{ fontSize: '0.68rem', color: '#0284c7' }}>* 항목별 직접 수정 가능</span>}
                </div>
                
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.82rem',
                  border: '1.5px solid #64748b'
                }}>
                  <tbody>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ width: '22%', padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', fontWeight: 800 }}>
                        품명 (Invoice Name)
                      </th>
                      <td style={{ width: '28%', padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            style={{ width: '100%', padding: '3px 6px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.82rem', fontWeight: 800 }}
                          />
                        ) : (
                          prodName
                        )}
                      </td>
                      <th style={{ width: '22%', padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', fontWeight: 800 }}>
                        원산지 (Origin)
                      </th>
                      <td style={{ width: '28%', padding: '8px 10px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={originCountry}
                            onChange={(e) => setOriginCountry(e.target.value)}
                            style={{ width: '100%', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.82rem' }}
                          />
                        ) : (
                          originCountry
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569', background: '#f8fafc', fontWeight: 700 }}>
                        성상 및 성분 구성
                      </th>
                      <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            style={{ width: '100%', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.8rem', resize: 'vertical' }}
                          />
                        ) : (
                          material
                        )}
                      </td>
                      <th style={{ padding: '8px 10px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#475569', background: '#f8fafc', fontWeight: 700 }}>
                        주요 기능 및 용도
                      </th>
                      <td style={{ padding: '8px 10px', border: '1px solid #cbd5e1', color: '#1e293b' }}>
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={functionUse}
                            onChange={(e) => setFunctionUse(e.target.value)}
                            style={{ width: '100%', padding: '3px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.8rem', resize: 'vertical' }}
                          />
                        ) : (
                          functionUse
                        )}
                      </td>
                    </tr>
                    <tr style={{ background: 'rgba(2, 132, 199, 0.04)' }}>
                      <th style={{ padding: '9px 10px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#0369a1', fontWeight: 900 }}>
                        {initialData.type === 'valuation-brief' ? '평가 쟁점 코드' : '확정 HSK 세번'}
                      </th>
                      <td colSpan={3} style={{ padding: '9px 10px', border: '1px solid #cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={targetHsCode}
                              onChange={(e) => {
                                setTargetHsCode(e.target.value);
                                setCleanHs(e.target.value);
                              }}
                              style={{ width: '160px', padding: '4px 8px', border: '1.5px solid #0284c7', borderRadius: '3px', fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}
                            />
                          ) : (
                            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.02em' }}>
                              {targetHsCode}
                            </span>
                          )}

                          {isEditMode ? (
                            <input
                              type="text"
                              value={rateComment}
                              onChange={(e) => setRateComment(e.target.value)}
                              placeholder="적용 세율 문구 입력..."
                              style={{ flex: 1, minWidth: '220px', padding: '4px 8px', border: '1px solid #a7f3d0', borderRadius: '3px', fontSize: '0.78rem', color: '#059669', background: '#ecfdf5', fontWeight: 700 }}
                            />
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              {rateComment}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 2: Legal Basis & WCO Explanatory Notes */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      {initialData.type === 'valuation-brief' ? '2. 관세법 제30조 및 관세평가 법리 소명 근거' : '2. 관세율표 해석 통칙 및 WCO 해설서 기반 법리적 분류 근거'}
                    </h3>
                  </div>
                  {isEditMode && <span style={{ fontSize: '0.68rem', color: '#0284c7' }}>* 소명 논리 및 WCO 인용구 수정 가능</span>}
                </div>
                
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '14px 16px',
                  fontSize: '0.82rem',
                  color: '#1e293b',
                  lineHeight: 1.65,
                  background: '#ffffff'
                }}>
                  {/* General GRI Rules */}
                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ border: '1px solid #0f172a', color: '#0f172a', fontSize: '0.72rem', padding: '2px 6px', borderRadius: '3px', fontWeight: 800 }}>
                      적용 통칙
                    </span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={generalRule}
                        onChange={(e) => setGeneralRule(e.target.value)}
                        style={{ flex: 1, padding: '3px 8px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.84rem', fontWeight: 800 }}
                      />
                    ) : (
                      <strong style={{ color: '#0f172a', fontSize: '0.86rem' }}>
                        {generalRule}
                      </strong>
                    )}
                  </div>

                  {/* Legal Reasoning Logic */}
                  <div style={{ marginBottom: '12px', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>[분류 논리]</strong>{' '}
                    {isEditMode ? (
                      <textarea
                        rows={4}
                        value={rationaleSummary}
                        onChange={(e) => setRationaleSummary(e.target.value)}
                        placeholder="관세사 고유의 법리적 소명의견을 상세히 작성하세요..."
                        style={{ width: '100%', marginTop: '4px', padding: '8px', border: '1.5px solid #0284c7', borderRadius: '4px', fontSize: '0.82rem', lineHeight: '1.5', resize: 'vertical' }}
                      />
                    ) : (
                      <span style={{ whiteSpace: 'pre-line' }}>{rationaleSummary}</span>
                    )}
                  </div>

                  {/* WCO Explanatory Notes Snippet */}
                  <div style={{
                    background: '#f8fafc',
                    borderLeft: '3.5px solid #0284c7',
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '10px 12px',
                    fontSize: '0.78rem',
                    color: '#475569',
                    borderRadius: '0 4px 4px 0'
                  }}>
                    <strong style={{ color: '#0369a1' }}>📖 공식 WCO 관세율표 해설서 및 주규정 발췌:</strong><br />
                    {isEditMode ? (
                      <textarea
                        rows={3}
                        value={wcoNoteSnippet}
                        onChange={(e) => setWcoNoteSnippet(e.target.value)}
                        placeholder="WCO 해설서 또는 부/류의 주석 발췌문..."
                        style={{ width: '100%', marginTop: '4px', padding: '6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.78rem', resize: 'vertical' }}
                      />
                    ) : (
                      <span style={{ whiteSpace: 'pre-line' }}>"{wcoNoteSnippet}"</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Precedents / Tax Tribunal Ruling Evidence */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      3. 관세청 사전심사 회시례 및 조세심판원/대법원 인용 판례
                    </h3>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleAddPrecedent}
                      style={{
                        padding: '2px 8px',
                        background: 'rgba(2, 132, 199, 0.1)',
                        border: '1px solid #0284c7',
                        borderRadius: '4px',
                        color: '#0284c7',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Plus size={11} /> 판례 추가
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {precedentsList.length === 0 ? (
                    <div style={{ padding: '10px 14px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.78rem', color: '#64748b' }}>
                      등록된 유사 결정례가 없습니다. (통칙 및 해설서 본문 원칙 적용)
                    </div>
                  ) : (
                    precedentsList.map((prec, idx) => (
                      <div key={idx} style={{
                        padding: '10px 12px',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '0.78rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                            {isEditMode ? (
                              <>
                                <input
                                  type="text"
                                  value={prec.caseNumber}
                                  onChange={(e) => {
                                    const updated = [...precedentsList];
                                    updated[idx].caseNumber = e.target.value;
                                    setPrecedentsList(updated);
                                  }}
                                  style={{ width: '120px', padding: '2px 6px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800, color: '#0284c7' }}
                                />
                                <input
                                  type="text"
                                  value={prec.title}
                                  onChange={(e) => {
                                    const updated = [...precedentsList];
                                    updated[idx].title = e.target.value;
                                    setPrecedentsList(updated);
                                  }}
                                  style={{ flex: 1, padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800 }}
                                />
                              </>
                            ) : (
                              <>
                                <span style={{ color: '#0284c7', fontWeight: 900, marginRight: '4px' }}>
                                  [{prec.caseNumber}]
                                </span>
                                <strong style={{ color: '#0f172a' }}>{prec.title}</strong>
                              </>
                            )}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '3px', fontWeight: 700 }}>
                              {prec.authority || '관세평가분류원'}
                            </span>
                            {isEditMode && (
                              <button
                                type="button"
                                onClick={() => handleRemovePrecedent(idx)}
                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={prec.keyPoint || ''}
                            onChange={(e) => {
                              const updated = [...precedentsList];
                              updated[idx].keyPoint = e.target.value;
                              setPrecedentsList(updated);
                            }}
                            placeholder="쟁점 요지 및 판시사항 입력..."
                            style={{ width: '100%', marginTop: '4px', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.74rem' }}
                          />
                        ) : (
                          prec.keyPoint && (
                            <div style={{ color: '#475569', fontSize: '0.74rem', lineHeight: 1.45, marginTop: '2px' }}>
                              <strong>쟁점 요지:</strong> {prec.keyPoint}
                            </div>
                          )
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 4: Clearance Requirements */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '4px', height: '16px', background: requirementsList.length > 0 ? '#0284c7' : '#059669', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    4. {requirementsList.length > 0 
                      ? '수입통관 세관장확인 요건 및 구비서류 체크리스트' 
                      : '수입통관 규제 요건 판정 결과 (세관장확인 대상 비해당 소명)'}
                  </h3>
                </div>

                {requirementsList.length > 0 ? (
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '12px 14px',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {requirementsList.map((req, i) => (
                      <div key={i} style={{ fontSize: '0.78rem', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <CheckCircle2 size={13} color="#059669" style={{ marginTop: '3px', flexShrink: 0 }} />
                        {isEditMode ? (
                          <input
                            type="text"
                            value={req}
                            onChange={(e) => {
                              const updated = [...requirementsList];
                              updated[i] = e.target.value;
                              setRequirementsList(updated);
                            }}
                            style={{ flex: 1, padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.76rem' }}
                          />
                        ) : (
                          <span>{req}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    border: '1.5px solid #a7f3d0',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    background: '#f0fdf4',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={14} color="#059669" style={{ flexShrink: 0 }} />
                      <span>관세법 제226조 세관장확인 및 대외무역법 통합공고 수입 규제 요건 없음 (일반 자유 수입 물품)</span>
                    </div>
                    <p style={{ fontSize: '0.76rem', color: '#334155', margin: '2px 0 0 20px', lineHeight: 1.5 }}>
                      본 물품(HSK <b>{targetHsCode}</b>)은 수입 시 소관 부처의 사전 승인·검역·형식인증 대상에 해당하지 않는 일반 자유 수입 품목으로 판정되었습니다. 상업송장(Invoice), 포장명세서(P/L) 구비 후 세관 수입신고 즉시 통관이 가능합니다.
                    </p>
                  </div>
                )}
              </div>

              {/* Section 5: Country of Origin Marking Regulations */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '4px', height: '16px', background: '#0d9488', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                    5. 대외무역법 제33조 원산지표시(Origin Marking) 규정 및 라벨링 규격 가이드
                  </h3>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                      <th style={{ padding: '7px 9px', textAlign: 'left', width: '22%', color: '#334155', fontWeight: 800 }}>구분 항목</th>
                      <th style={{ padding: '7px 9px', textAlign: 'left', width: '36%', color: '#0f172a', fontWeight: 800 }}>대외무역법 법령 규정</th>
                      <th style={{ padding: '7px 9px', textAlign: 'left', width: '42%', color: '#0d9488', fontWeight: 800 }}>본 품목 권장 실무 가이드</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 9px', fontWeight: 700, background: '#fafafa' }}>표시 문안 예시</td>
                      <td style={{ padding: '7px 9px', color: '#475569' }}>한글, 한자 또는 영문(Made in 국명)</td>
                      <td style={{ padding: '7px 9px', fontWeight: 800, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={originMarkExample}
                            onChange={(e) => setOriginMarkExample(e.target.value)}
                            style={{ width: '100%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.75rem', fontWeight: 800 }}
                          />
                        ) : (
                          originMarkExample
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 9px', fontWeight: 700, background: '#fafafa' }}>표시 위치 및 방식</td>
                      <td style={{ padding: '7px 9px', color: '#475569' }}>최종 구매자가 용이하게 식별할 수 있는 견고한 방식</td>
                      <td style={{ padding: '7px 9px', color: '#334155', lineHeight: 1.4 }}>
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={originLocationMethod}
                            onChange={(e) => setOriginLocationMethod(e.target.value)}
                            style={{ width: '100%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.74rem' }}
                          />
                        ) : (
                          originLocationMethod
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 9px', fontWeight: 700, background: '#fafafa' }}>이중 표시 의무</td>
                      <td style={{ padding: '7px 9px', color: '#475569' }}>개별 포장 유통 물품은 본체 및 외포장 각각 표시</td>
                      <td style={{ padding: '7px 9px', fontWeight: 800, color: '#b45309' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={originDoubleMark}
                            onChange={(e) => setOriginDoubleMark(e.target.value)}
                            style={{ width: '100%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.74rem', fontWeight: 800 }}
                          />
                        ) : (
                          originDoubleMark
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '7px 9px', fontWeight: 700, background: '#fafafa' }}>면제 요건 검토</td>
                      <td style={{ padding: '7px 9px', color: '#475569' }}>대외무역법 시행령 제56조 (제조용 원료/외화획득)</td>
                      <td style={{ padding: '7px 9px', color: '#475569', fontSize: '0.74rem', lineHeight: 1.4 }}>
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={originExemption}
                            onChange={(e) => setOriginExemption(e.target.value)}
                            style={{ width: '100%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.74rem' }}
                          />
                        ) : (
                          originExemption
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '7px 9px', fontWeight: 700, background: '#fafafa' }}>위반 시 처분</td>
                      <td style={{ padding: '7px 9px', color: '#dc2626' }} colSpan={2}>
                        수입검사 시 원산지 미표시/오표시 적발 시 <strong>통관 보류 및 보세구역 내 보수작업(라벨링) 명령</strong>, 최대 3억원 이하 과징금 부과
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section 6: Custom Memo / Conclusion */}
              <div className="print-avoid-break" style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '16px', background: '#0d9488', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      6. 종합 검토 의견 및 세무 리스크 사전 대응 방안
                    </h3>
                  </div>
                  {isEditMode && <span style={{ fontSize: '0.68rem', color: '#0d9488' }}>* 관세사 전용 종합의견 입력란</span>}
                </div>
                
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '12px 14px',
                  fontSize: '0.8rem',
                  color: '#1e293b',
                  lineHeight: 1.6
                }}>
                  {isEditMode ? (
                    <textarea
                      rows={4}
                      value={customMemo}
                      onChange={(e) => setCustomMemo(e.target.value)}
                      placeholder="관세사 고유의 검토의견, 실무 유의사항, 세액 리스크 대응 조언을 작성하세요..."
                      style={{ width: '100%', padding: '8px', border: '1.5px solid #0d9488', borderRadius: '4px', fontSize: '0.8rem', lineHeight: '1.5', resize: 'vertical' }}
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-line' }}>{customMemo}</div>
                  )}
                </div>
              </div>

            </div>

            {/* Official Sign-off Footer Box */}
            <div className="print-avoid-break" style={{ marginTop: '28px' }}>
              
              <div style={{
                borderTop: '2px solid #0f172a',
                paddingTop: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>
                    {branding.customDisclaimer || '위 검토 사항은 대한민국 관세법 및 WCO 국제 품목분류 기준에 의거하여 당 관세법인에서 정밀 검토하여 확정한 공식 의견서입니다.'}
                  </p>
                  
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    {branding.firmName} 대표 / 담당 관세사
                  </div>
                  
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{brokerContactName}</span>
                    <span style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 700 }}>({branding.licenseNo})</span>
                  </div>
                  
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                    📍 {branding.address} &nbsp;|&nbsp; 📞 {branding.phone} &nbsp;|&nbsp; ✉️ {branding.email}
                  </div>
                </div>

                {/* Red Circular Seal Stamp Graphic */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3.5px solid #dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  fontWeight: 900,
                  fontSize: '0.84rem',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  padding: '4px',
                  boxShadow: '0 0 0 1px rgba(220,38,38,0.2)',
                  transform: 'rotate(-4deg)',
                  userSelect: 'none',
                  background: 'rgba(254, 242, 242, 0.4)',
                  marginLeft: '20px',
                  flexShrink: 0
                }}>
                  {branding.sealText || `${branding.firmName}인`}
                </div>
              </div>

              {/* Verification Footer */}
              {branding.brandingMode === 'white-label' ? (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '8px',
                  borderTop: '1px dotted #cbd5e1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.62rem',
                  color: '#94a3b8'
                }}>
                  <span>※ System & AI Verification: CUSWAY Customs AI Platform (HS & Precedents Engine)</span>
                  <span>문서 진위 확인: cusway.kr/verify</span>
                </div>
              ) : (
                <div style={{
                  marginTop: '14px',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.68rem',
                  color: '#475569'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={15} color="#0d9488" />
                    <span>
                      <strong>AI Customs Intelligence Engine:</strong> Powered & Verified by CUSWAY AI Platform (관세청/WCO 해설서 & 9,450건 판례 마스터 기반)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 800 }}>
                    <QrCode size={13} color="#0d9488" />
                    <span>[공식 의견서 진위확인 QR]</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Instant Kakao / Mobile Share Modal */}
      {showShareModal && (
        <ResultShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={docTitle}
          category={docType === 'valuation-brief' ? 'valuation' : 'hs-classification'}
          data={{
            productName: prodName,
            hsCode: targetHsCode,
            dutyRate: initialData.rates?.baseRate?.toString() || '8.0%',
            ftaRate: initialData.rates?.recommendedRate !== undefined ? `${initialData.rates.recommendedRate}%` : '0.0%',
            legalReasoning: `${generalRule}\n\n${rationaleSummary}\n\n${wcoNoteSnippet}`,
            requirements: requirementsList.join('\n')
          }}
        />
      )}
    </div>
  );
}
