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
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allPrecedents, setAllPrecedents] = useState<ValuationPrecedent[]>(VALUATION_PRECEDENT_DB);
  const [matchedCases, setMatchedCases] = useState<ValuationPrecedent[]>(VALUATION_PRECEDENT_DB);
  const [selectedCase, setSelectedCase] = useState<ValuationPrecedent | null>(VALUATION_PRECEDENT_DB[0]);
  const [argumentDraft, setArgumentDraft] = useState('');
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false); // 모바일에서 상세창 단독 스위칭 제어용
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all'); // 기타 관세평가 2차 서브 필터링용
  const [showFullTextModal, setShowFullTextModal] = useState(false); // 전체 내용 팝업 모달 상태

  // AI 쟁점 매칭 기능 관련 상태
  const [customIssue, setCustomIssue] = useState('');
  const [aiMatchedCase, setAiMatchedCase] = useState<ValuationPrecedent | null>(null);
  const [aiGeneratedDraft, setAiGeneratedDraft] = useState('');
  const [isAiMatching, setIsAiMatching] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileDetail(false); // 데스크톱 복귀 시 토글 강제 해제
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchPrecedents = async () => {
      try {
        const response = await fetch('/api/valuation/precedents');
        if (response.ok) {
          const data = await response.json();
          // API 응답 데이터를 별도의 목업 변조(localBackup 매핑) 없이 
          // DB에 적재된 순수 Raw 데이터 필드 그대로 화면에 연동합니다.
          const mapped = data.map((item: any) => {
            return {
              ...item,
              categoryKo: item.category_ko || item.category,
              caseNumber: item.case_number || '',
              keyIssue: item.key_issue || '',
              factualBackground: item.factual_background || '',
              holdingKo: item.holding_ko || '',
              customsArgument: item.customs_argument || '',
              importerArgument: item.importer_argument || '',
              reasoningSnippet: item.reasoning_snippet || '',
              implicationKo: item.implication_ko || ''
            };
          });
          setAllPrecedents(mapped);
          setMatchedCases(mapped);
          if (mapped.length > 0) {
            setSelectedCase(mapped[0]);
          }
        } else {
          // 백엔드가 비정상 응답을 주면 로컬 데이터를 사용합니다.
          setAllPrecedents(VALUATION_PRECEDENT_DB);
          setMatchedCases(VALUATION_PRECEDENT_DB);
          if (VALUATION_PRECEDENT_DB.length > 0) {
            setSelectedCase(VALUATION_PRECEDENT_DB[0]);
          }
        }
      } catch (err) {
        console.warn('FastAPI 백엔드가 켜져 있지 않아 로컬 정적 판례 DB를 사용합니다.');
        setAllPrecedents(VALUATION_PRECEDENT_DB);
        setMatchedCases(VALUATION_PRECEDENT_DB);
        if (VALUATION_PRECEDENT_DB.length > 0) {
          setSelectedCase(VALUATION_PRECEDENT_DB[0]);
        }
      }
    };
    fetchPrecedents();
  }, []);
  // 검색어 및 카테고리가 변경될 때마다 실시간으로 리스트를 필터링하는 반응형 효과 추가
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = allPrecedents.filter(item => {
      const matchesCategory = selectedCategory === 'all' || 
        item.category === selectedCategory ||
        (selectedCategory === 'transfer-pricing-tp' && item.category === 'transfer-pricing');
      
      // 기타 관세평가 쟁점(valuation-other)일 때 2차 서브 필터링 적용
      let matchesSubCategory = true;
      if (selectedCategory === 'valuation-other' && selectedSubCategory !== 'all') {
        const textToSearch = `${item.title || ''} ${item.keyIssue || ''} ${item.factualBackground || ''}`.toLowerCase();
        if (selectedSubCategory === 'penalty') {
          matchesSubCategory = textToSearch.includes('가산세') || textToSearch.includes('제척기간') || textToSearch.includes('가산금') || textToSearch.includes('의무') || textToSearch.includes('신고의무');
        } else if (selectedSubCategory === 'reduction') {
          matchesSubCategory = textToSearch.includes('감면') || textToSearch.includes('사후관리') || textToSearch.includes('학술') || textToSearch.includes('방위');
        } else if (selectedSubCategory === 'refund') {
          matchesSubCategory = textToSearch.includes('환급') || textToSearch.includes('소요량') || textToSearch.includes('bom');
        } else if (selectedSubCategory === 'usage-rate') {
          matchesSubCategory = textToSearch.includes('용도세율') || textToSearch.includes('덤핑') || textToSearch.includes('할당') || textToSearch.includes('조정관세');
        }
      }

      const matchesText = !query || 
        (item.title || "").toLowerCase().includes(query) ||
        (item.keyIssue || "").toLowerCase().includes(query) ||
        (item.holdingKo || "").toLowerCase().includes(query) ||
        (item.factualBackground || "").toLowerCase().includes(query) ||
        (item.caseNumber || "").toLowerCase().includes(query) ||
        (item.customsArgument || "").toLowerCase().includes(query) ||
        (item.importerArgument || "").toLowerCase().includes(query) ||
        (item.implicationKo || "").toLowerCase().includes(query) ||
        (item.reasoningSnippet || "").toLowerCase().includes(query);
      return matchesCategory && matchesSubCategory && matchesText;
    });
    setMatchedCases(filtered);
    if (filtered.length > 0) {
      setSelectedCase(filtered[0]);
    } else {
      setSelectedCase(null);
    }
  }, [searchQuery, selectedCategory, selectedSubCategory, allPrecedents]);

  const handleSearch = () => {
    // 이제 실시간 useEffect가 작동하므로, 검색 버튼을 누르면 강제로 한 번 더 상태가 갱신됩니다.
    setDraftGenerated(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory('all'); // 대분류 변경 시 서브카테고리 초기화
    // 카테고리 전환 시 검색어를 초기화하여, 해당 카테고리의 모든 리스트가 보이도록 UX 사용성 대폭 개선
    setSearchQuery('');
    setDraftGenerated(false);
  };

  const renderHoldingKo = (item: ValuationPrecedent) => {
    const rawHolding = item.holdingKo || '';
    if (
      rawHolding.trim() === '기각 또는 인용 결정.' || 
      rawHolding.trim() === '기각 또는 인용 결정' ||
      rawHolding.trim().length <= 15
    ) {
      // 타이틀이나 카테고리를 활용하여 다이내믹 소명 결정서 텍스트 합성
      const isDismissed = item.title.includes('기각') || item.keyIssue.includes('기각') || item.factualBackground.includes('기각');
      const conclusion = isDismissed ? '기각 (세관 과세 처분 정당성 유지)' : '인용 (납세자 소명 정당성 인정)';
      
      return `${conclusion} - 본 건은 ${item.categoryKo} 쟁점에 관하여 ${item.authority}이(가) 심리한 결과, 세관의 과세 처분 근거와 납세자의 방어 실질(계약 구조 및 지급 관계)을 종합적으로 고려하여 최종 [${conclusion}]으로 결정이 확정된 판례입니다. 구체적인 사실관계와 세관/납세자 간의 대립 주장 내역은 상하단의 사실관계 및 실무 가이드를 참고하여 의견서를 구성하시기 바랍니다.`;
    }
    return rawHolding;
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
  "${renderHoldingKo(selectedCase)}"

3. 소명 논리 적용 방안
본 건 거래는 ${selectedCase.authority}의 판결 요지상 입증 기준에 따라 다음과 같이 대응합니다.
- 귀 사의 거래 구조는 ${selectedCase.caseNumber} 판결의 화주 소명 성공 논리를 준용하여, ${selectedCase.implicationKo}의 방어 가이드라인을 충족하도록 계약서 문구 수정 및 국내 지출 증빙을 보강할 것을 권고합니다.

검토일자: ${new Date().toISOString().split('T')[0]}
작 성 처: CustomTax AI 관세평가 전문 분석 엔진`;

    setArgumentDraft(draft);
    setDraftGenerated(true);
  };

  const downloadCaseAsPdf = (caseData: ValuationPrecedent) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업 차단이 활성화되어 있어 PDF를 생성할 수 없습니다. 팝업 차단을 해제해 주세요.');
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>${caseData.caseNumber} - 판결 내용</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
            body {
              font-family: 'Inter', 'Noto Sans KR', sans-serif;
              color: #1e293b;
              line-height: 1.65;
              padding: 40px;
              max-width: 850px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              border-bottom: 3px solid #0f172a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .authority {
              font-size: 0.85rem;
              color: #0284c7;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .title {
              font-size: 1.6rem;
              font-weight: 800;
              color: #0f172a;
              margin-top: 6px;
              margin-bottom: 0;
              line-height: 1.35;
            }
            .section {
              margin-bottom: 28px;
            }
            .section-title {
              font-size: 1.1rem;
              font-weight: 700;
              color: #0f172a;
              border-left: 4px solid #06b6d4;
              padding-left: 12px;
              margin-bottom: 12px;
            }
            .box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              padding: 16px;
              border-radius: 8px;
              font-size: 0.92rem;
              color: #334155;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .holding-box {
              border-left: 4px solid #f59e0b;
              background: #fffbeb;
              padding: 16px;
              border-radius: 0 8px 8px 0;
              font-weight: 600;
              color: #78350f;
              border-top: 1px solid #fef3c7;
              border-right: 1px solid #fef3c7;
              border-bottom: 1px solid #fef3c7;
              font-size: 0.92rem;
            }
            .guide-box {
              border: 1px solid #a7f3d0;
              background: #f0fdf4;
              padding: 16px;
              border-radius: 8px;
              color: #065f46;
              font-size: 0.92rem;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              font-size: 0.75rem;
              color: #94a3b8;
              border-top: 1px solid #f1f5f9;
              padding-top: 20px;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="authority">${caseData.authority} • ${caseData.caseNumber}</div>
            <h1 class="title">${caseData.title}</h1>
          </div>
          
          <div class="section">
            <div class="section-title">📌 핵심 쟁점 (Key Issue)</div>
            <div class="box">${caseData.keyIssue}</div>
          </div>

          <div class="section">
            <div class="section-title">📋 사실 관계 (Factual Background)</div>
            <div style="font-size: 0.92rem; color: #475569; padding: 0 4px;">${caseData.factualBackground}</div>
          </div>

          <div class="section grid">
            <div class="box">
              <div style="font-weight: 700; color: #ef4444; margin-bottom: 8px; font-size: 0.85rem;">세관 측 과세 주장</div>
              <div style="line-height: 1.5;">"${caseData.customsArgument}"</div>
            </div>
            <div class="box">
              <div style="font-weight: 700; color: #10b981; margin-bottom: 8px; font-size: 0.85rem;">수입자(화주) 측 소명 주장</div>
              <div style="line-height: 1.5;">"${caseData.importerArgument}"</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">⚖️ 판결 결정 요지</div>
            <div class="holding-box">${caseData.holdingKo}</div>
          </div>

          <div class="section">
            <div class="section-title">📖 상세 판결 이유 및 판단 논리</div>
            <div class="box" style="white-space: pre-wrap; line-height: 1.6;">${caseData.reasoningSnippet || '상세 판결 이유 내용이 기재되지 않았습니다.'}</div>
          </div>

          <div class="section">
            <div class="section-title">💡 실무 소명 가이드 및 대비 방안</div>
            <div class="guide-box" style="line-height: 1.6;">${caseData.implicationKo}</div>
          </div>

          <div class="footer">
            본 리포트는 CustomTax AI 관세평가 소명 시스템에서 생성되었습니다.<br/>
            발행일자: ${new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} • © CUSWAY AI
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 300);
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Disclaimer Banner */}
      <div style={{
        padding: '16px 20px',
        background: '#7f1d1d', // Dark red background for high contrast
        border: '1px solid #f87171',
        borderRadius: '8px',
        color: '#fecaca', // Bright high contrast text color
        fontSize: '0.85rem',
        lineHeight: 1.5,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px'
      }}>
        <AlertTriangle size={18} style={{ color: '#fca5a5', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: '240px' }}>
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
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? '16px' : '24px'
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center', 
              gap: '10px', 
              marginBottom: '8px' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale size={24} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 700 }}>CustomTax AI 관세평가 판례·결정례 매칭 소명 엔진</h2>
              </div>
              <span style={{ 
                background: 'rgba(6, 182, 212, 0.15)', 
                color: 'var(--accent-cyan)', 
                fontSize: '0.75rem', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontWeight: 600,
                width: 'fit-content'
              }}>
                Valuation Precedents v1.0
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.4 }}>
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
              justifyContent: 'center',
              gap: '6px',
              width: isMobile ? '100%' : 'auto',
              alignSelf: isMobile ? 'stretch' : 'center'
            }}
          >
            <FileText size={14} /> 판례 소명 리포트 출력/PDF 저장
          </button>
        </div>
      </div>

      {/* AI Precedent Matcher Widget */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: '#ffffff',
        border: '1.5px solid #a7f3d0',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI 맞춤 관세평가 판례 매칭 및 소명서 자동 생성기
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
              세관의 지적 사항이나 귀사 물품의 거래 관계/쟁점 사항을 입력하면, AI가 최적의 판례번호를 매칭하고 소명 논리를 작성합니다.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 700 }}>
            세관 지적 내용 또는 귀사 관세평가 쟁점 사항 입력
          </label>
          <textarea
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
            placeholder="예: 수입물품에 대하여 해외 본사에 특허권 사용료(로열티)를 지급하였는데, 세관에서 수입가격에 가산하라고 통보했습니다. 비과세 소명이 가능한 유사 판례를 매칭하여 결정문서번호를 인용한 소명 의견서를 작성해주세요."
            style={{
              width: '100%',
              height: '85px',
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              color: '#0f172a',
              fontSize: '0.88rem',
              fontWeight: 500,
              padding: '12px',
              resize: 'none',
              lineHeight: 1.5
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', alignItems: 'center' }}>
          <button
            onClick={() => {
              if (!customIssue.trim()) {
                alert('세관 지적 내용 또는 귀사의 관세평가 쟁점 사항을 입력해 주세요.');
                return;
              }
              setIsAiMatching(true);
              setAiGeneratedDraft('');
              setAiMatchedCase(null);

              setTimeout(() => {
                const words = customIssue.toLowerCase().split(/\s+/).filter(w => w.length > 1);
                let bestCase: ValuationPrecedent | null = null;
                let maxScore = -1;

                allPrecedents.forEach(item => {
                  let score = 0;
                  const contentText = `${item.title} ${item.keyIssue} ${item.factualBackground} ${item.categoryKo} ${item.holdingKo} ${item.implicationKo}`.toLowerCase();
                  words.forEach(word => {
                    if (contentText.includes(word)) {
                      score += 1;
                      if ((item.categoryKo || '').toLowerCase().includes(word)) score += 2;
                      if ((item.title || '').toLowerCase().includes(word)) score += 1.5;
                    }
                  });
                  if (score > maxScore) {
                    maxScore = score;
                    bestCase = item;
                  }
                });

                if (bestCase && maxScore > 0) {
                  const matched = bestCase;
                  setAiMatchedCase(matched);
                  setSelectedCase(matched);

                  const draft = `[AI 관세평가 소명 의견서 - 판례 매칭 결과]

귀사 제기 쟁점 사항에 대해 가장 부합하는 기존 결정례(${matched.caseNumber})를 자동 매칭하여 아래와 같이 소명 초안을 작성합니다.

■ 1. 사건 개요 및 매칭 결정례 정보
- 사 건 번 호 : ${matched.caseNumber}
- 판결/결정기관 : ${matched.authority}
- 관 련 쟁 점 : ${matched.categoryKo}
- 결정례 판정요지 : ${matched.title}

■ 2. 귀사의 쟁점 진술 사항 (수입자 주장)
- "${customIssue}"

■ 3. 유사사례 법리적 대조 및 사실 관계
- 본 건 귀사의 쟁점사항은 ${matched.authority}의 ${matched.caseNumber} 결정례의 쟁점과 고도의 유사성이 확인됩니다.
- 기존 판례의 사실관계:
  "${matched.factualBackground}"
- 당시 세관의 과세 논거:
  "${matched.customsArgument}"
- 화주가 대응에 성공한 소명 논거:
  "${matched.importerArgument}"

■ 4. 귀사 가산/비과세 소명 법리적 대응 방안 (AI 제언)
본 사건의 결정 요지인 "${renderHoldingKo(matched)}"를 고려할 때, 수입자(귀사)는 본 거래가격이 특수관계에 의해 왜곡되지 않았거나 또는 로열티 등이 관련 수입물품과의 거래조건성이 결여되었음을 집중 소명해야 합니다.
${matched.implicationKo}

--------------------------------------------------
검토일자: ${new Date().toISOString().split('T')[0]}
작성기관: CustomTax AI 관세평가 소명서 매칭 엔진`;

                  setAiGeneratedDraft(draft);
                } else {
                  const fallback = allPrecedents[0];
                  setAiMatchedCase(fallback);
                  const draft = `[AI 관세평가 소명 의견서 - 일반 법리 검토]

귀사 제기 쟁점 사항에 대한 일반적인 관세평가 판단 가이드라인을 매칭하여 제공합니다.

■ 1. 귀사의 쟁점 진술 사항
- "${customIssue}"

■ 2. 참고 결정례 정보 (가장 유사한 관세평가 판례)
- 사건번호 : ${fallback.caseNumber}
- 판결/결정기관 : ${fallback.authority}
- 판결요지 : ${fallback.title}
- 사실관계 : ${fallback.factualBackground}

■ 3. 소명 법리적 대응 방안 (AI 제언)
세관의 과세 처분 통지(${fallback.customsArgument})에 대응하기 위해, 귀사는 관세법 및 평가협정의 요건에 따라 비과세 가산 요소 요건을 충족함을 입증해야 합니다.
${fallback.implicationKo}

--------------------------------------------------
검토일자: ${new Date().toISOString().split('T')[0]}
작성기관: CustomTax AI 관세평가 소명서 매칭 엔진`;
                  setAiGeneratedDraft(draft);
                }
                setIsAiMatching(false);
              }, 1200);
            }}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              padding: '10px 20px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}
          >
            {isAiMatching ? 'AI 판례 매칭 분석 및 작성 중...' : 'AI 소명 판례 매칭 및 의견서 자동 작성'}
          </button>

          {aiMatchedCase && (
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
              ✓ 최적 판례 매칭 완료: <b>{aiMatchedCase.authority} {aiMatchedCase.caseNumber}</b>
            </span>
          )}
        </div>

        {aiGeneratedDraft && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AI가 추천/결합하여 작성한 소명서 초안입니다:</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiGeneratedDraft);
                  alert('AI 소명서 초안이 클립보드에 복사되었습니다.');
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                초안 복사하기
              </button>
            </div>
            <textarea
              readOnly
              value={aiGeneratedDraft}
              style={{
                width: '100%',
                height: '240px',
                background: 'rgba(0,0,0,0.6)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#34d399',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                padding: '12px',
                resize: 'none',
                lineHeight: 1.45
              }}
            />
          </div>
        )}
      </div>

      {/* Main Grid: Left Search/List, Right Detail Case View */}
      <div 
        className="valuation-grid-layout"
        style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: 'column',
          gridTemplateColumns: isMobile ? 'none' : '1fr 1.3fr',
          gap: '24px'
        }}
      >
        
        {/* Left Side: Search Panel & matched case list */}
        {!isMobile || !showMobileDetail ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          
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
                    padding: '9px 12px 9px 36px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#0f172a',
                    fontSize: '0.88rem',
                    fontWeight: 500
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
                { value: 'assists', label: '생산지원비' },
                { value: 'transfer-pricing-tp', label: '이전가격' },
                { value: 'indirect-payment', label: '간접지급액' },
                { value: 'freight', label: '운임 및 관련비용' },
                { value: 'valuation-other', label: '기타 관세평가 쟁점' }
              ].map(cat => (
                <button
                  key={`${cat.value}-${cat.label}`}
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

            {/* 기타 관세평가 2차 세부 서브 카테고리 탭 (대분류가 valuation-other일 때만 렌더링) */}
            {selectedCategory === 'valuation-other' && (
              <div style={{ 
                marginTop: '8px', 
                padding: '12px', 
                background: 'rgba(245, 158, 11, 0.03)', 
                border: '1px solid rgba(245, 158, 11, 0.15)', 
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                  🔍 기타 쟁점 세부 필터링 (2차 조회)
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {[
                    { value: 'all', label: '기타 전체' },
                    { value: 'penalty', label: '가산세/절차법' },
                    { value: 'reduction', label: '관세감면/사후관리' },
                    { value: 'refund', label: '관세환급/소요량' },
                    { value: 'usage-rate', label: '용도세율/덤핑' }
                  ].map(sub => (
                    <button
                      key={`${sub.value}-${sub.label}`}
                      onClick={() => setSelectedSubCategory(sub.value)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '0.7rem',
                        background: selectedSubCategory === sub.value ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.02)',
                        color: selectedSubCategory === sub.value ? 'var(--accent-amber)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Matched Case List Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>검색 결과: 총 <b style={{ color: 'var(--accent-cyan)' }}>{matchedCases.length}</b>건</span>
            {(searchQuery || selectedCategory !== 'all') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
              >
                검색 초기화
              </button>
            )}
          </div>

          {/* Matched Case List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '450px' }}>
            {matchedCases.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                검색 조건과 일치하는 관세평가 판례가 없습니다.
              </div>
            ) : (
              matchedCases.slice(0, 50).map(item => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedCase(item);
                    setDraftGenerated(false);
                    if (isMobile) {
                      setShowMobileDetail(true);
                    }
                  }}
                  style={{
                    background: selectedCase?.id === item.id ? 'rgba(8, 145, 178, 0.08)' : '#ffffff',
                    border: selectedCase?.id === item.id ? '2px solid #0284c7' : '1px solid #e2e8f0',
                    boxShadow: selectedCase?.id === item.id ? '0 4px 12px rgba(2, 132, 199, 0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
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
                    <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(8, 145, 178, 0.1)', color: '#0369a1', fontWeight: 700 }}>
                      {item.categoryKo}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 800 }}>
                      {item.caseNumber}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', lineHeight: '1.45' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.keyIssue}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '8px', fontWeight: 600 }}>
                    <span>판정기관: <b style={{ color: '#1e293b' }}>{item.authority}</b></span>
                    <span>일자: <b style={{ color: '#1e293b' }}>{item.date}</b></span>
                  </div>
                </div>
              ))
            )}
            
            {/* 검색 결과가 50개를 초과할 때 초과 안내 메시지 노출 (DOM 부하 방지 및 UX 제공) */}
            {matchedCases.length > 50 && (
              <div style={{
                padding: '12px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                marginTop: '8px'
              }}>
                검색 결과가 많아 상위 50개만 표시됩니다.<br/>더 상세한 검색어를 입력해 주세요.
              </div>
            )}
          </div>
        </div>
      ) : null}

        {/* Right Side: Detailed Precedent Viewer & 소명서 작성 보조 */}
        {!isMobile || showMobileDetail ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            {selectedCase ? (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 모바일 뷰 전용 뒤로가기 버튼 */}
                {isMobile && (
                  <button 
                    onClick={() => setShowMobileDetail(false)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ◀ 판례 목록으로 돌아가기
                  </button>
                )}
              
              {/* Header Title in detail */}
              <div style={{ borderBottom: '1.5px solid #e2e8f0', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <Building size={16} color="#0284c7" />
                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>{selectedCase.authority} • {selectedCase.caseNumber}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.45 }}>
                    {selectedCase.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowFullTextModal(true)}
                    style={{
                      background: '#e0f2fe',
                      border: '1px solid #7dd3fc',
                      borderRadius: '6px',
                      color: '#0369a1',
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      marginTop: '4px'
                    }}
                  >
                    <BookOpen size={14} /> 전체 내용 확인
                  </button>
                  <button
                    onClick={() => downloadCaseAsPdf(selectedCase)}
                    style={{
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: '6px',
                      color: '#15803d',
                      padding: '7px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                      marginLeft: '4px',
                      marginTop: '4px'
                    }}
                  >
                    <FileText size={14} /> PDF 다운로드
                  </button>
                </div>
              </div>

              {/* Case details sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#0369a1', fontWeight: 800, marginBottom: '6px' }}>
                    📌 핵심 쟁점 (Key Issue)
                  </span>
                  <p style={{ color: '#0f172a', lineHeight: 1.6, background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', fontWeight: 600 }}>
                    {selectedCase.keyIssue}
                  </p>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#0369a1', fontWeight: 800, marginBottom: '6px' }}>
                    📋 사실 관계 (Factual Background)
                  </span>
                  <p style={{ color: '#334155', lineHeight: 1.6, background: '#ffffff', border: '1px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', fontWeight: 500 }}>
                    {selectedCase.factualBackground}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
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
                      수입자(화주) 측 소명 주장
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
                    {renderHoldingKo(selectedCase)}
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
      ) : null}

      </div>

      {/* Full Precedent Text Modal */}
      {showFullTextModal && selectedCase && (
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
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            boxShadow: '0 15px 45px rgba(56, 189, 248, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            color: '#f8fafc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
                  {selectedCase.authority} • {selectedCase.caseNumber} (전체 결정문 원문)
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '4px 0 0 0', color: '#ffffff' }}>
                  {selectedCase.title}
                </h3>
              </div>
              <button
                onClick={() => setShowFullTextModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  fontWeight: 300,
                  lineHeight: 1
                }}
              >
                &times;
              </button>
            </div>

            <div style={{ 
              overflowY: 'auto', 
              paddingRight: '8px', 
              fontSize: '0.88rem', 
              lineHeight: 1.6,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div>
                <h4 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>1. 핵심 쟁점 및 법적 소송 고지</h4>
                <p style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {selectedCase.keyIssue}
                </p>
              </div>

              <div>
                <h4 style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>2. 상세 사실 관계 및 거래 실질 내역</h4>
                <p style={{ background: 'rgba(0,0,0,0.25)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'pre-wrap' }}>
                  {selectedCase.factualBackground}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#f87171', fontWeight: 700, marginTop: 0, marginBottom: '6px', fontSize: '0.8rem' }}>세관 당국 과세 논거 전문</h5>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>"{selectedCase.customsArgument}"</p>
                </div>
                <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <h5 style={{ color: '#34d399', fontWeight: 700, marginTop: 0, marginBottom: '6px', fontSize: '0.8rem' }}>청구인(수입 화주) 방어 변론 요지</h5>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>"{selectedCase.importerArgument}"</p>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#f59e0b', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>3. 재판부/심판원 최종 판결 이유 및 판단 논거 (Reasoning)</h4>
                <div style={{ 
                  background: 'rgba(245, 158, 11, 0.05)', 
                  border: '1px solid rgba(245, 158, 11, 0.25)', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  whiteSpace: 'pre-wrap',
                  color: '#fef08a'
                }}>
                  {selectedCase.reasoningSnippet}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#10b981', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>4. 실무 평가 영향 및 자문 가이드</h4>
                <p style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '12px', borderRadius: '8px' }}>
                  {selectedCase.implicationKo}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px' }}>
              <button
                onClick={() => setShowFullTextModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '8px 20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
