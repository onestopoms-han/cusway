import re

file_path = r'src/components/HsClassifier.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Imports
old_imports = """import { 
  Scale, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Share2,
  Printer,
  Tag
} from 'lucide-react';
import ResultShareModal from './ResultShareModal';
import CustomsReportModal, { ReportData } from './CustomsReportModal';
import OfficeBrandingModal from './OfficeBrandingModal';
import OriginMarkingGuideWidget from './OriginMarkingGuideWidget';"""

new_imports = """import { 
  Scale, 
  BookOpen, 
  FileText, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  Share2,
  Printer,
  Tag,
  Copy,
  Check,
  ExternalLink,
  Star,
  History,
  Bookmark,
  DollarSign,
  Upload,
  Zap
} from 'lucide-react';
import ResultShareModal from './ResultShareModal';
import CustomsReportModal, { ReportData } from './CustomsReportModal';
import OfficeBrandingModal from './OfficeBrandingModal';
import OriginMarkingGuideWidget from './OriginMarkingGuideWidget';
import InvoiceParserModal, { ParsedInvoiceData } from './InvoiceParserModal';
import DutySavingsCalculator from './DutySavingsCalculator';

export interface SearchHistoryItem {
  id: string;
  productName: string;
  material: string;
  functionUse: string;
  hsCode?: string;
  date: string;
  isStarred?: boolean;
}"""

assert old_imports in content, "old_imports not found"
content = content.replace(old_imports, new_imports, 1)

# 2. Update Component States
old_states = """  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOfficeBrandingModal, setShowOfficeBrandingModal] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);"""

new_states = """  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOfficeBrandingModal, setShowOfficeBrandingModal] = useState(false);
  const [showInvoiceParserModal, setShowInvoiceParserModal] = useState(false);
  const [copiedHsCode, setCopiedHsCode] = useState(false);
  const [cifAmountState, setCifAmountState] = useState<number>(10000);
  const [currencyState, setCurrencyState] = useState<string>('USD');
  const [originCountryState, setOriginCountryState] = useState<string>('중국 (CN)');

  // 최근 조회 이력 및 단골 품목 (⭐)
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cusway_recent_searches');
      return saved ? JSON.parse(saved) : [
        { id: '1', productName: '콩나물 재배용 대두 (Yellow Soybeans)', material: '100% 천연 대두 종실', functionUse: '식용 콩나물 재배용', hsCode: '1201.90-3000', date: '09.06', isStarred: true },
        { id: '2', productName: '볶은 참깨가루 (Roasted Sesame Powder)', material: '100% 볶은 흰참깨 분말', functionUse: '식품 조미 및 가공용', hsCode: '2008.19-3000', date: '09.06', isStarred: true },
        { id: '3', productName: '영구자석 동기모터 (PMSM 3kW)', material: '알루미늄 하우징, 동 권선, 영구자석', functionUse: '산업용 로봇 관절 구동', hsCode: '8501.52-9000', date: '09.05', isStarred: false }
      ];
    } catch {
      return [];
    }
  });

  const saveToRecent = (prod: string, mat: string, func: string, code?: string) => {
    if (!prod.trim()) return;
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      productName: prod,
      material: mat,
      functionUse: func,
      hsCode: code || '검토 중',
      date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }),
      isStarred: false
    };
    setRecentSearches(prev => {
      const filtered = prev.filter(p => p.productName.toLowerCase() !== prod.toLowerCase());
      const updated = [newItem, ...filtered].slice(0, 8);
      try { localStorage.setItem('cusway_recent_searches', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const toggleStarItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, isStarred: !item.isStarred } : item);
      try { localStorage.setItem('cusway_recent_searches', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const handleApplyInvoiceData = (data: ParsedInvoiceData) => {
    setProductName(data.productName);
    setMaterial(data.material);
    setFunctionUse(data.functionUse);
    if (data.cifAmount) setCifAmountState(data.cifAmount);
    if (data.currency) setCurrencyState(data.currency);
    if (data.originCountry) setOriginCountryState(data.originCountry);
    
    setTimeout(() => {
      handleStartAnalysis(data.productName, data.material, data.functionUse);
    }, 150);
  };

  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; type: string } | null>(null);"""

assert old_states in content, "old_states not found"
content = content.replace(old_states, new_states, 1)

# 3. Update handleStartAnalysis
old_analysis = """  const handleStartAnalysis = async () => {
    setAnalyzing(true);
    setApprovedStatus(null);
    setMatchedRule(null);
    setIsBackendOffline(false);

    // Save key locally
    localStorage.setItem('openai_key', openaiKey);

    try {
      const response = await fetch('/api/hs/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productName,
          material: material,
          function_use: functionUse,
          api_key: openaiKey,
          email: currentUser?.email || null
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMatchedRule(data);
      } else {
        throw new Error("Backend API returned non-OK status");
      }
    } catch (err) {
      console.warn('API call failed, fallback to local dataset heuristic match.');
      setIsBackendOffline(true);
      const fallbackResult = runLocalHeuristicClassifier(productName, material, functionUse);
      setMatchedRule(fallbackResult);
    } finally {
      setAnalyzing(false);
    }
  };"""

new_analysis = """  const handleStartAnalysis = async (customProd?: string, customMat?: string, customFunc?: string) => {
    const targetProd = customProd !== undefined ? customProd : productName;
    const targetMat = customMat !== undefined ? customMat : material;
    const targetFunc = customFunc !== undefined ? customFunc : functionUse;

    if (!targetProd.trim()) {
      alert('상업적 제품명 또는 인보이스 품명을 입력해주세요.');
      return;
    }

    setAnalyzing(true);
    setApprovedStatus(null);
    setMatchedRule(null);
    setIsBackendOffline(false);

    // Save key locally
    localStorage.setItem('openai_key', openaiKey);

    try {
      const response = await fetch('/api/hs/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: targetProd,
          material: targetMat,
          function_use: targetFunc,
          api_key: openaiKey,
          email: currentUser?.email || null
        })
      });
      if (response.ok) {
        const data = await response.json();
        setMatchedRule(data);
        saveToRecent(targetProd, targetMat, targetFunc, data.recommendedHsCode);
      } else {
        throw new Error("Backend API returned non-OK status");
      }
    } catch (err) {
      console.warn('API call failed, fallback to local dataset heuristic match.');
      setIsBackendOffline(true);
      const fallbackResult = runLocalHeuristicClassifier(targetProd, targetMat, targetFunc);
      setMatchedRule(fallbackResult);
      saveToRecent(targetProd, targetMat, targetFunc, fallbackResult.recommendedHsCode);
    } finally {
      setAnalyzing(false);
    }
  };"""

assert old_analysis in content, "old_analysis not found"
content = content.replace(old_analysis, new_analysis, 1)

# 4. Update Left Panel Header with Invoice Extractor button
old_panel_header = """          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <FileText size={18} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>수입신고 대상 품목 정보</h3>
          </div>"""

new_panel_header = """          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>수입신고 대상 품목 정보</h3>
            </div>

            <button
              type="button"
              onClick={() => setShowInvoiceParserModal(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(20, 184, 166, 0.2) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.45)',
                borderRadius: '6px',
                padding: '5px 11px',
                color: 'var(--accent-cyan)',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(6, 182, 212, 0.15)'
              }}
            >
              <FileCheck size={13} /> 📄 인보이스/PDF 추출기
            </button>
          </div>"""

assert old_panel_header in content, "old_panel_header not found"
content = content.replace(old_panel_header, new_panel_header, 1)

# 5. Update Submit button in Left Panel and add Recent & Starred Searches Widget
old_submit_btn = """          <button 
            className="btn-primary" 
            onClick={handleStartAnalysis} 
            disabled={analyzing}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              marginTop: '6px', 
              padding: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#000'
            }}
          >
            {analyzing ? (
              <>해설서 RAG 매칭 및 분류 분석 중...</>
            ) : (
              <>
                <Sparkles size={16} /> 법적 분류 근거 자동 매칭
              </>
            )}
          </button>"""

new_submit_btn = """          <button 
            className="btn-primary" 
            onClick={() => handleStartAnalysis()} 
            disabled={analyzing}
            style={{ 
              width: '100%', 
              justifyContent: 'center', 
              marginTop: '6px', 
              padding: '12px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-cyan) 100%)',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#000'
            }}
          >
            {analyzing ? (
              <>해설서 RAG 매칭 및 분류 분석 중...</>
            ) : (
              <>
                <Sparkles size={16} /> 법적 분류 근거 자동 매칭
              </>
            )}
          </button>

          {/* Recent Searches & Starred Favorites Widget */}
          {recentSearches.length > 0 && (
            <div style={{
              marginTop: '4px',
              padding: '12px',
              background: 'rgba(15, 23, 42, 0.04)',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <History size={13} /> 🕒 최근 조회 & ⭐ 단골 품목
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  클릭 시 자동 입력
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {recentSearches.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setProductName(item.productName);
                      setMaterial(item.material);
                      setFunctionUse(item.functionUse);
                      handleStartAnalysis(item.productName, item.material, item.functionUse);
                    }}
                    style={{
                      background: item.isStarred ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.06)',
                      border: item.isStarred ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s'
                    }}
                  >
                    <span 
                      onClick={(e) => toggleStarItem(item.id, e)}
                      style={{ color: item.isStarred ? 'var(--accent-amber)' : 'var(--text-muted)', fontSize: '0.8rem' }}
                      title={item.isStarred ? '단골 품목 해제' : '단골 품목으로 저장'}
                    >
                      {item.isStarred ? '★' : '☆'}
                    </span>
                    <span style={{ fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                    </span>
                    {item.hsCode && item.hsCode !== '검토 중' && (
                      <span style={{ color: 'var(--accent-cyan)', fontSize: '0.68rem', fontWeight: 700 }}>
                        {item.hsCode}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}"""

assert old_submit_btn in content, "old_submit_btn not found"
content = content.replace(old_submit_btn, new_submit_btn, 1)

# 6. Update Recommendation Card with HSK copy button, UNIPASS/CLIP links
old_rec_code = """                    {matchedRule.recommendedHsCode === "0000.00-0000" ? (
                      <h3 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-red)' }}>
                        판정 보류 (분류 불가)
                      </h3>
                    ) : (
                      <h3 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, letterSpacing: '1px' }} className="text-gradient">
                        {matchedRule.recommendedHsCode}
                      </h3>
                    )}"""

new_rec_code = """                    {matchedRule.recommendedHsCode === "0000.00-0000" ? (
                      <h3 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, letterSpacing: '1px', color: 'var(--accent-red)' }}>
                        판정 보류 (분류 불가)
                      </h3>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: isMobile ? '1.6rem' : '2rem', fontWeight: 800, letterSpacing: '1px' }} className="text-gradient">
                          {matchedRule.recommendedHsCode}
                        </h3>

                        {/* 1-Click Copy Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (matchedRule?.recommendedHsCode) {
                              navigator.clipboard.writeText(matchedRule.recommendedHsCode);
                              setCopiedHsCode(true);
                              setTimeout(() => setCopiedHsCode(false), 2000);
                            }
                          }}
                          title="HSK 10단위 코드 클립보드 복사"
                          style={{
                            background: copiedHsCode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.08)',
                            border: copiedHsCode ? '1px solid #10b981' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: copiedHsCode ? '#10b981' : 'var(--text-main)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s'
                          }}
                        >
                          {copiedHsCode ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedHsCode ? '복사완료!' : 'HSK 복사'}</span>
                        </button>

                        {/* Direct Portal Links */}
                        <a
                          href="https://unipass.customs.go.kr/csp/index.do"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="관세청 유니패스(UNI-PASS) 품목분류 포털 직통 조회"
                          style={{
                            background: 'rgba(6, 182, 212, 0.1)',
                            border: '1px solid rgba(6, 182, 212, 0.3)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: 'var(--accent-cyan)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>🏛️ 유니패스 조회</span>
                          <ExternalLink size={11} />
                        </a>

                        <a
                          href="https://laws.customs.go.kr"
                          target="_blank"
                          rel="noopener noreferrer"
                          title="관세법령정보포털(CLIP) 법령 및 결정례 직통 조회"
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            color: '#60a5fa',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>⚖️ CLIP 법령·결정례</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    )}"""

assert old_rec_code in content, "old_rec_code not found"
content = content.replace(old_rec_code, new_rec_code, 1)

# 7. Add DutySavingsCalculator Widget under Hierarchy Tree
old_hierarchy_section = """              {/* Hierarchy Tree */}
              {matchedRule.recommendedHsCode !== "0000.00-0000" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15, 23, 42, 0.04)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4단위 (호의 용어)</span>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{matchedRule.headingName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6단위 (소호의 용어)</span>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{matchedRule.subheadingName}</p>
                  </div>
                </div>
              )}"""

new_hierarchy_section = """              {/* Hierarchy Tree */}
              {matchedRule.recommendedHsCode !== "0000.00-0000" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15, 23, 42, 0.04)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4단위 (호의 용어)</span>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{matchedRule.headingName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>6단위 (소호의 용어)</span>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{matchedRule.subheadingName}</p>
                  </div>
                </div>
              )}

              {/* Duty Savings & Estimated Tariff Calculator Widget */}
              {matchedRule.recommendedHsCode !== "0000.00-0000" && (
                <div style={{ marginTop: '16px' }}>
                  <DutySavingsCalculator
                    hsCode={matchedRule.recommendedHsCode}
                    productName={productName || matchedRule?.keywordTrigger?.[0] || '대상 물품'}
                    originCountry={originCountryState}
                    initialCifAmount={cifAmountState}
                    initialCurrency={currencyState}
                  />
                </div>
              )}"""

assert old_hierarchy_section in content, "old_hierarchy_section not found"
content = content.replace(old_hierarchy_section, new_hierarchy_section, 1)

# 8. Add InvoiceParserModal at bottom
old_bottom_modals = """      {/* Customs Office Branding Settings Modal */}
      <OfficeBrandingModal
        isOpen={showOfficeBrandingModal}
        onClose={() => setShowOfficeBrandingModal(false)}
        currentUser={currentUser}
      />
    </div>"""

new_bottom_modals = """      {/* Customs Office Branding Settings Modal */}
      <OfficeBrandingModal
        isOpen={showOfficeBrandingModal}
        onClose={() => setShowOfficeBrandingModal(false)}
        currentUser={currentUser}
      />

      {/* Commercial Invoice Image / PDF Smart Extractor Modal */}
      {showInvoiceParserModal && (
        <InvoiceParserModal
          isOpen={showInvoiceParserModal}
          onClose={() => setShowInvoiceParserModal(false)}
          onApplyData={handleApplyInvoiceData}
        />
      )}
    </div>"""

assert old_bottom_modals in content, "old_bottom_modals not found"
content = content.replace(old_bottom_modals, new_bottom_modals, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated src/components/HsClassifier.tsx with full UTF-8 integrity!")
