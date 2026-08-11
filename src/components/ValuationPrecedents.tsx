import { useState } from 'react';
import { 
  Scale, 
  Search, 
  HelpCircle, 
  FileText, 
  AlertTriangle, 
  BookOpen, 
  Filter,
  CheckCircle,
  Building,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

import { VALUATION_PRECEDENT_DB, ValuationPrecedent } from '../data/rules/valuation_precedents';

import { useEffect } from 'react';

interface ValuationPrecedentsProps {
  currentUser: any;
}

export default function ValuationPrecedents({ currentUser }: ValuationPrecedentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allPrecedents, setAllPrecedents] = useState<ValuationPrecedent[]>(VALUATION_PRECEDENT_DB);
  const [matchedCases, setMatchedCases] = useState<ValuationPrecedent[]>(VALUATION_PRECEDENT_DB);
  const [selectedCase, setSelectedCase] = useState<ValuationPrecedent | null>(VALUATION_PRECEDENT_DB[0]);
  const [argumentDraft, setArgumentDraft] = useState('');
  const [draftGenerated, setDraftGenerated] = useState(false);

  useEffect(() => {
    const fetchPrecedents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/valuation/precedents');
        if (response.ok) {
          const data = await response.json();
          // API 응답 구조를 프론트 키값인 categoryKo 등으로 조정
          const mapped = data.map((item: any) => ({
            ...item,
            categoryKo: item.category_ko,
            keyIssue: item.key_issue,
            factualBackground: item.factual_background,
            holdingKo: item.holding_ko,
            customsArgument: item.customs_argument,
            importerArgument: item.importer_argument,
            reasoningSnippet: item.reasoning_snippet,
            implicationKo: item.implication_ko
          }));
          setAllPrecedents(mapped);
          setMatchedCases(mapped);
          if (mapped.length > 0) {
            setSelectedCase(mapped[0]);
          }
        }
      } catch (err) {
        console.warn('FastAPI 백엔드가 켜져 있지 않아 로컬 정적 판례 DB를 사용합니다.');
      }
    };
    fetchPrecedents();
  }, []);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = allPrecedents.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesText = 
        item.title.toLowerCase().includes(query) ||
        item.keyIssue.toLowerCase().includes(query) ||
        item.holdingKo.toLowerCase().includes(query) ||
        item.factualBackground.toLowerCase().includes(query) ||
        item.caseNumber.toLowerCase().includes(query);
      return matchesCategory && matchesText;
    });
    setMatchedCases(filtered);
    if (filtered.length > 0) {
      setSelectedCase(filtered[0]);
    } else {
      setSelectedCase(null);
    }
    setDraftGenerated(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = allPrecedents.filter(item => {
      const matchesCategory = category === 'all' || item.category === category;
      const query = searchQuery.toLowerCase();
      const matchesText = 
        item.title.toLowerCase().includes(query) ||
        item.keyIssue.toLowerCase().includes(query) ||
        item.holdingKo.toLowerCase().includes(query);
      return matchesCategory && matchesText;
    });
    setMatchedCases(filtered);
    if (filtered.length > 0) {
      setSelectedCase(filtered[0]);
    } else {
      setSelectedCase(null);
    }
    setDraftGenerated(false);
  };

  const generateArgumentDraft = () => {
    if (!selectedCase) return;
    
    const draft = `[과세가격 결정 자문/소명 의견서 초안]

사 건 명: 귀 사 수입 물품에 대한 관세평가 가산 여부 검토의 건
관련 쟁점: ${selectedCase.categoryKo} - ${selectedCase.keyIssue}

1. 검토 의견 요지
귀 사가 질의하신 물품 거래 구조 및 대가 지급 방식은 아래 제시하는 공식 판례(${selectedCase.caseNumber})의 판결 논리와 비교 분석한 결과, 관세법상 과세 가산요소에서 제외(비과세) 처리하는 소명이 타당할 것으로 사료됩니다.

2. 근거 판례 대조 및 사실 관계
가. 판결/결정 기관 및 사건번호: ${selectedCase.authority} ${selectedCase.caseNumber}
나. 사건 요지: ${selectedCase.title}
다. 핵심 판결 이유:
  "${selectedCase.holdingKo}"

3. 소명 논리 적용 방안
본 건 거래는 ${selectedCase.authority}의 판결 요지상 입증 기준에 따라 다음과 같이 대응합니다.
- 귀 사의 거래 구조는 ${selectedCase.caseNumber} 판결의 임포터 소명 성공 논리를 준용하여, ${selectedCase.implicationKo}의 방어 가이드라인을 충족하도록 계약서 문구 수정 및 국내 지출 증빙을 보강할 것을 권고합니다.

검토일자: ${new Date().toISOString().split('T')[0]}
작 성 처: CustomTax AI 관세평가 전문 분석 엔진`;

    setArgumentDraft(draft);
    setDraftGenerated(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Disclaimer Banner */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px dashed rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        color: '#fca5a5',
        fontSize: '0.8rem',
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertTriangle size={18} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
        <div>
          <strong>⚠️ 법적 고지 및 판례 참고 면책 조항 (Legal Disclaimer)</strong><br />
          본 CustomTax AI 관세평가 판례 매칭 엔진이 제공하는 결정례, 판결 요약 및 소명 가이드는 <strong>법적 공식 효력이 없는 실무 참고용 분석</strong>입니다. 각 수입물품별 계약 실질과 지출 명세에 따라 세관의 해석이 달라질 수 있으므로, 반드시 정식 과세처분 소명서 제출 시 전문 관세사와의 대면 법률 검토를 거치시기 바라며 본 처분 결과에 대한 법적 책임은 지지 않습니다.
        </div>
      </div>

      {/* Header Banner */}
      <div className="glass-panel" style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(217, 70, 239, 0.08) 100%)', 
        border: '1px solid rgba(6, 182, 212, 0.2)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Scale size={24} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>CustomTax AI 관세평가 판례·결정례 매칭 소명 엔진</h2>
              <span style={{ 
                background: 'rgba(6, 182, 212, 0.15)', 
                color: 'var(--accent-cyan)', 
                fontSize: '0.75rem', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontWeight: 600 
              }}>
                Valuation Precedents v1.0
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              본사-지사 간 이전가격(특수관계 가격영향), 로열티 권리사용료 가산 여부, 생산지원비 범위 등 핵심 과세가격 쟁점별 세관/조세심판원/대법원 판례를 즉각 매칭합니다.
            </p>
          </div>
          <button 
            onClick={() => window.print()}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 16px',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileText size={14} /> 판례 소명 리포트 출력/PDF 저장
          </button>
        </div>
      </div>

      {/* Main Grid: Left Search/List, Right Detail Case View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px' }}>
        
        {/* Left Side: Search Panel & matched case list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Search inputs */}
          <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="쟁점 키워드 또는 사건번호 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <button 
                onClick={handleSearch}
                style={{
                  background: 'var(--accent-cyan)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#000',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                검색
              </button>
            </div>

            {/* Category filter pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'all', label: '전체 쟁점' },
                { value: 'royalty', label: '로열티' },
                { value: 'transfer-pricing', label: '특수관계' },
                { value: 'assists', label: '생산지원비' }
              ].map(cat => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '0.75rem',
                    background: selectedCategory === cat.value ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.03)',
                    color: selectedCategory === cat.value ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matched Case List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '450px' }}>
            {matchedCases.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                검색 조건과 일치하는 관세평가 판례가 없습니다.
              </div>
            ) : (
              matchedCases.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedCase(item);
                    setDraftGenerated(false);
                  }}
                  style={{
                    background: selectedCase?.id === item.id ? 'rgba(6, 182, 212, 0.08)' : 'rgba(0,0,0,0.2)',
                    border: selectedCase?.id === item.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {item.categoryKo}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {item.caseNumber}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: '1.4' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.keyIssue}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '6px' }}>
                    <span>판정기관: <b>{item.authority}</b></span>
                    <span>일자: {item.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Detailed Precedent Viewer & 소명서 작성 보조 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {selectedCase ? (
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header Title in detail */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                  <Building size={16} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedCase.authority} • {selectedCase.caseNumber}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', lineHeight: 1.4 }}>
                  {selectedCase.title}
                </h3>
              </div>

              {/* Case details sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                    📌 핵심 쟁점 (Key Issue)
                  </span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.5, background: 'rgba(0,0,0,0.15)', padding: '10px', borderRadius: '6px' }}>
                    {selectedCase.keyIssue}
                  </p>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                    📋 사실 관계 (Factual Background)
                  </span>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {selectedCase.factualBackground}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#f87171', fontWeight: 700, marginBottom: '4px' }}>
                      세관 측 과세 주장
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      "{selectedCase.customsArgument}"
                    </p>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.72rem', color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                      수입자(임포터) 측 소명 주장
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      "{selectedCase.importerArgument}"
                    </p>
                  </div>
                </div>

                <div style={{ borderLeft: '3px solid var(--accent-amber)', paddingLeft: '12px', background: 'rgba(245,158,11,0.03)', padding: '12px', borderRadius: '0 6px 6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-amber)', fontWeight: 700, marginBottom: '6px' }}>
                    ⚖️ 판결 결정 요지
                  </span>
                  <p style={{ color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.5 }}>
                    {selectedCase.holdingKo}
                  </p>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-cyan)', fontWeight: 700, marginBottom: '4px' }}>
                    💡 실무 소명 가이드 및 대비 방안
                  </span>
                  <p style={{ color: 'var(--text-main)', lineHeight: 1.5, background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    {selectedCase.implicationKo}
                  </p>
                </div>
              </div>

              {/* Argument Generator section */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    선택된 판례를 활용하여 세관 소명 의견서 초안을 빌드합니다.
                  </span>
                  <button
                    onClick={generateArgumentDraft}
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-amber) 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#000',
                      padding: '8px 16px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    소명 의견서 초안 작성 <ArrowRight size={14} />
                  </button>
                </div>

                {draftGenerated && (
                  <textarea
                    readOnly
                    value={argumentDraft}
                    style={{
                      width: '100%',
                      height: '220px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'monospace',
                      fontSize: '0.78rem',
                      padding: '12px',
                      resize: 'none',
                      lineHeight: 1.4
                    }}
                  />
                )}
              </div>

            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
              왼쪽 목록에서 쟁점 관세평가 판례를 선택하여 상세 판결과 실무 소명 방안을 확인해 주세요.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
