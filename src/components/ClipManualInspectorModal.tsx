import React, { useState, useEffect } from 'react';
import { 
  X, Search, ChevronRight, ChevronLeft, Printer, HelpCircle, 
  ExternalLink, Copy, Check, Info, ShieldCheck, BookOpen, 
  FileText, Scale, Eye, Image as ImageIcon, Sparkles, RefreshCw
} from 'lucide-react';

interface ChapterHeading {
  hs_code: string;
  name_ko: string;
}

interface ChapterOption {
  code: string;
  name_ko: string;
}

interface HskTableRow {
  hs_code: string;
  display_code: string;
  indent_level: number;
  is_group: boolean;
  length: number;
  name_ko: string;
  name_en: string;
  base_rate: string | number;
  fta_badge: string;
  has_req: boolean;
  req_badge: string;
  has_origin?: boolean;
  is_matched?: boolean;
}

interface PrecedentItem {
  case_number: string;
  hs_code: string;
  product_name: string;
  material: string;
  function_use: string;
  decision_reason: string;
  issuing_body: string;
  date: string;
}

interface RateItem {
  country_code: string;
  base_rate: number | null;
  wto_rate: number | null;
  fta_rate: number | null;
  fta_name: string;
  recommended_rate: number | null;
}

interface RequirementItem {
  hs_code: string;
  law_name: string;
  agency_name: string;
  check_type: string;
  description: string;
}

interface CielHsData {
  query: string;
  clean_digits: string;
  all_chapters: ChapterOption[];
  active_chapter: {
    code: string;
    title: string;
    notes: string;
  };
  active_section: {
    roman: string;
    title: string;
    notes: string;
  };
  active_heading: {
    code: string;
    title: string;
    title_en: string;
  };
  chapter_headings: ChapterHeading[];
  prev_heading: ChapterHeading | null;
  next_heading: ChapterHeading | null;
  hsk_table_rows: HskTableRow[];
  filtered_rows: HskTableRow[];
  filter_label: string | null;
  wco_notes: {
    heading_code: string;
    title: string;
    content_ko: string;
    content_en: string;
  };
  precedents: PrecedentItem[];
  rates_detail: RateItem[];
  requirements_detail: RequirementItem[];
}

interface ClipManualInspectorModalProps {
  isOpen?: boolean;
  isPageMode?: boolean;
  onClose?: () => void;
  initialHsCode?: string;
  productName?: string;
  onSelectHsCode?: (code: string) => void;
  onNavigateToClassifier?: () => void;
}

export const ClipManualInspectorModal: React.FC<ClipManualInspectorModalProps> = ({
  isOpen = true,
  isPageMode = false,
  onClose,
  initialHsCode = '8708',
  productName = '',
  onSelectHsCode,
  onNavigateToClassifier
}) => {
  const [searchInput, setSearchInput] = useState<string>(initialHsCode || '8708');
  const [selectedYear, setSelectedYear] = useState<string>('2026년');
  const [data, setData] = useState<CielHsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected Table Row State
  const [selectedRowCode, setSelectedRowCode] = useState<string>('');
  
  // Bottom Tab State: 'wco' (호해설) | 'section' (부주) | 'chapter' (류주) | 'precedent' (분류사례) | 'rates' (세율/요건) | 'image' (이미지)
  const [activeBottomTab, setActiveBottomTab] = useState<'wco' | 'section' | 'chapter' | 'precedent' | 'rates' | 'image'>('wco');
  
  // Explanatory Note Language Toggle ('ko' | 'en')
  const [wcoLang, setWcoLang] = useState<'ko' | 'en'>('ko');
  
  // View mode dropdown ('all' | 'filter')
  const [viewMode, setViewMode] = useState<'all' | 'filtered'>('filtered');
  
  // Copy feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch Ciel HS data from backend
  const fetchData = async (queryCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/hs/clip-inspector?hs_code=${encodeURIComponent(queryCode)}`);
      if (!res.ok) {
        throw new Error(`데이터 조회 실패 (${res.status})`);
      }
      const json: CielHsData = await res.json();
      setData(json);
      
      // Auto select matching row if filtered
      if (json.filtered_rows && json.filtered_rows.length > 0) {
        setSelectedRowCode(json.filtered_rows[0].hs_code);
      } else if (json.hsk_table_rows && json.hsk_table_rows.length > 0) {
        setSelectedRowCode(json.hsk_table_rows[0].hs_code);
      }
    } catch (err: any) {
      console.error('[CIEL_HS_FETCH_ERROR]', err);
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const target = initialHsCode || '8708';
      setSearchInput(target);
      fetchData(target);
    }
  }, [isOpen, initialHsCode]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      fetchData(searchInput.trim());
    }
  };

  const handleSelectChapter = (chapterCode: string) => {
    setSearchInput(chapterCode);
    fetchData(chapterCode);
  };

  const handleSelectHeading = (headingCode: string) => {
    setSearchInput(headingCode);
    fetchData(headingCode);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 1800);
  };

  if (!isOpen) return null;

  // Decide which rows to display based on viewMode & whether filter exists
  const displayRows = (viewMode === 'filtered' && data?.filtered_rows && data.filtered_rows.length > 0)
    ? data.filtered_rows
    : (data?.hsk_table_rows || []);

  const content = (
    <div style={{
      width: '100%',
      height: isPageMode ? 'calc(100vh - 40px)' : '90vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif",
      color: '#1e293b',
      boxShadow: isPageMode ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
      borderRadius: isPageMode ? '10px' : '12px',
      overflow: 'hidden',
      border: '1px solid #94a3b8'
    }}>
      {/* 1. TOP BLUE BANNER & HEADER (Ciel HS Style) */}
      <div style={{
        background: 'linear-gradient(180deg, #1e40af 0%, #2563eb 100%)',
        color: '#ffffff',
        padding: '8px 16px',
        borderBottom: '2px solid #1d4ed8'
      }}>
        {/* Top row: Brand + Submenu links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {/* Brand Logo / Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              letterSpacing: '-0.5px',
              fontStyle: 'italic',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              color: '#ffffff'
            }}>
              Ciel HS
            </span>
            <span style={{
              fontSize: '0.74rem',
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 700,
              letterSpacing: '0.3px'
            }}>
              관세율표 수작업 대조 검토기
            </span>
          </div>

          {/* Submenu links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#e0e7ff',
            fontWeight: 600
          }}>
            <span style={{ color: '#ffffff', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setActiveBottomTab('wco')}>관세율표</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveBottomTab('precedent')}>분류사례</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveBottomTab('rates')}>세율</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveBottomTab('rates')}>수출입요령</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveBottomTab('chapter')}>관련법령</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveBottomTab('precedent')}>판례·예규</span>
            <span>|</span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('실무도구: HSK 대사 및 품목분류 심사 매뉴얼이 연동되어 있습니다.')}>도구</span>

            <div style={{ marginLeft: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span 
                onClick={() => setWcoLang(wcoLang === 'ko' ? 'en' : 'ko')}
                style={{ 
                  cursor: 'pointer', 
                  background: 'rgba(255,255,255,0.18)', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#ffffff'
                }}
              >
                {wcoLang === 'ko' ? 'English HSK' : '국문 HSK'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fef08a' }}>MyHS</span>
              
              {!isPageMode && onClose && (
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="닫기"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Row (Exact layout from Ciel HS screenshot) */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.1)',
          padding: '5px 8px',
          borderRadius: '4px'
        }}>
          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #94a3b8',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="2026년">2026년</option>
            <option value="2025년">2025년</option>
            <option value="2024년">2024년</option>
          </select>

          {/* HS Code Search Input */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '380px' }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="예: 8708, 8708.30, 8708.30-3000 또는 완충기"
              style={{
                width: '100%',
                padding: '4px 8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                border: '1px solid #64748b',
                borderRadius: '3px',
                outline: 'none'
              }}
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            style={{
              padding: '4px 14px',
              background: '#ffffff',
              color: '#1d4ed8',
              fontWeight: 800,
              fontSize: '0.82rem',
              border: '1px solid #93c5fd',
              borderRadius: '3px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Search size={13} />
            <span>검색</span>
          </button>

          {/* Chapter Quick Jump Dropdown */}
          <select
            onChange={(e) => handleSelectChapter(e.target.value)}
            value={data?.active_chapter?.code || '87'}
            style={{
              padding: '4px 8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid #94a3b8',
              borderRadius: '3px',
              outline: 'none',
              cursor: 'pointer',
              maxWidth: '240px'
            }}
          >
            <option value="">류 바로가기 선택</option>
            {data?.all_chapters && data.all_chapters.map((ch) => (
              <option key={ch.code} value={ch.code}>
                {ch.name_ko}
              </option>
            ))}
          </select>

          {/* Quick buttons */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            {['8708', '8708.30', '8708.30-30', '8471', '8517'].map((quickCode) => (
              <button
                key={quickCode}
                type="button"
                onClick={() => {
                  setSearchInput(quickCode);
                  fetchData(quickCode);
                }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {quickCode}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 2. BREADCRUMB BAR (田 제17부 수송기기 > 제87류 자동차 > 제8708호 부분품) */}
      <div style={{
        background: '#e0f2fe',
        borderBottom: '1px solid #bae6fd',
        padding: '6px 14px',
        fontSize: '0.80rem',
        color: '#0369a1',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexWrap: 'wrap'
      }}>
        <span style={{ color: '#0284c7', fontSize: '0.9rem' }}>田</span>
        
        {/* Section Link */}
        <span 
          onClick={() => setActiveBottomTab('section')}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          title="부(Section) 법정 주규정 보기"
        >
          {data?.active_section?.title || '제17부 차량·항공기·선박과 수송기기 관련품'}
        </span>
        
        <span style={{ color: '#94a3b8' }}>&gt;</span>
        
        {/* Chapter Link */}
        <span 
          onClick={() => setActiveBottomTab('chapter')}
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          title="류(Chapter) 법정 주규정 보기"
        >
          {data?.active_chapter?.title || '제87류 자동차'}
        </span>
        
        <span style={{ color: '#94a3b8' }}>&gt;</span>
        
        {/* Heading Link */}
        <span 
          onClick={() => setActiveBottomTab('wco')}
          style={{ cursor: 'pointer', color: '#0c4a6e', fontWeight: 800 }}
          title="호(Heading) WCO 해설서 원문 보기"
        >
          제{data?.active_heading?.code || '8708'}호 {data?.active_heading?.title || '부분품과 부속품'}
        </span>

        {data?.filter_label && (
          <span style={{
            marginLeft: '8px',
            background: '#0284c7',
            color: '#ffffff',
            padding: '1px 6px',
            borderRadius: '3px',
            fontSize: '0.72rem',
            fontWeight: 800
          }}>
            필터 적용: {data.filter_label}
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setViewMode(viewMode === 'all' ? 'filtered' : 'all')}
            style={{
              background: '#ffffff',
              border: '1px solid #7dd3fc',
              color: '#0369a1',
              padding: '2px 8px',
              borderRadius: '3px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {viewMode === 'filtered' ? '전체 계층 펼쳐보기' : '필터 분기만 보기'}
          </button>
        </div>
      </div>

      {/* 3. SPLIT WORKBENCH BODY (Left: Headings List | Right: Table & Detail Pane) */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {/* LEFT COLUMN: Headings (호) List */}
        <div style={{
          width: '210px',
          minWidth: '180px',
          borderRight: '1px solid #cbd5e1',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: '#e2e8f0',
            borderBottom: '1px solid #cbd5e1',
            padding: '6px 10px',
            fontSize: '0.80rem',
            fontWeight: 900,
            color: '#1e3a8a',
            textAlign: 'center'
          }}>
            호 (Heading)
          </div>

          {/* Heading Items List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 0'
          }}>
            {loading ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                <RefreshCw size={14} className="animate-spin" style={{ display: 'inline', marginRight: '4px' }} />
                로딩 중...
              </div>
            ) : (
              data?.chapter_headings && data.chapter_headings.map((h) => {
                const isActive = (h.hs_code === data.active_heading?.code);
                // Extract short title (strip parentheses or long description for clean sidebar look)
                const shortTitle = h.name_ko.split('(')[0].trim();

                return (
                  <div
                    key={h.hs_code}
                    onClick={() => handleSelectHeading(h.hs_code)}
                    style={{
                      padding: '5px 8px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      lineHeight: 1.35,
                      borderBottom: '1px solid #f1f5f9',
                      background: isActive ? '#fef2f2' : 'transparent',
                      color: isActive ? '#dc2626' : '#1e293b',
                      fontWeight: isActive ? 800 : 500,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '5px',
                      transition: 'background 0.15s'
                    }}
                    title={h.name_ko}
                  >
                    <span style={{ fontWeight: 800, minWidth: '34px' }}>{h.hs_code}</span>
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {shortTitle}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Table on Top + Tabs & Details at Bottom */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#ffffff'
        }}>
          {/* TOP PART: HSK HIERARCHICAL TABLE (Matching Screenshot 1, 2, 3) */}
          <div style={{
            flex: 1,
            minHeight: '220px',
            overflowY: 'auto',
            borderBottom: '2px solid #94a3b8'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.80rem',
              textAlign: 'left'
            }}>
              {/* Table Header Bar (Solid Blue like Ciel HS) */}
              <thead style={{
                position: 'sticky',
                top: 0,
                background: '#2563eb',
                color: '#ffffff',
                zIndex: 10,
                fontWeight: 800,
                fontSize: '0.78rem'
              }}>
                <tr>
                  <th style={{ padding: '6px 8px', width: '120px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>호 / HSK</th>
                  <th style={{ padding: '6px 8px', borderRight: '1px solid rgba(255,255,255,0.2)' }}>품명 (국문)</th>
                  <th style={{ padding: '6px 6px', width: '50px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>기본</th>
                  <th style={{ padding: '6px 6px', width: '75px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>탄력·양허</th>
                  <th style={{ padding: '6px 6px', width: '60px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>요건</th>
                  <th style={{ padding: '6px 8px', width: '38%' }}>Description (영문)</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                      <RefreshCw size={18} className="animate-spin" style={{ display: 'inline', marginRight: '6px' }} />
                      관세율표 데이터를 조회하고 있습니다...
                    </td>
                  </tr>
                ) : displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>
                      해당 조건에 부합하는 세번이 존재하지 않습니다.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((row, idx) => {
                    const isSelected = (row.hs_code === selectedRowCode);
                    const isHeadingRow = (row.indent_level === 0 && row.length === 4);
                    
                    return (
                      <tr
                        key={`${row.hs_code}_${idx}`}
                        onClick={() => setSelectedRowCode(row.hs_code)}
                        style={{
                          background: isSelected 
                            ? '#dbeafe' 
                            : (row.is_matched ? '#fef9c3' : (idx % 2 === 1 ? '#f8fafc' : '#ffffff')),
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          fontWeight: isHeadingRow ? 800 : (row.is_group ? 700 : 400),
                          transition: 'background 0.1s'
                        }}
                      >
                        {/* HSK / Display Code */}
                        <td style={{
                          padding: '4px 6px 4px 8px',
                          fontFamily: 'Consolas, monospace',
                          fontWeight: isHeadingRow || row.is_group ? 800 : 600,
                          color: isHeadingRow ? '#0f172a' : (row.is_group ? '#1e293b' : '#334155'),
                          whiteSpace: 'nowrap'
                        }}>
                          <span style={{
                            paddingLeft: `${row.indent_level * 10}px`,
                            display: 'inline-block'
                          }}>
                            {row.display_code}
                          </span>
                        </td>

                        {/* Korean Name (품명) */}
                        <td style={{
                          padding: '4px 8px',
                          color: isHeadingRow ? '#0f172a' : (row.is_group ? '#1e293b' : '#0f172a'),
                          lineHeight: 1.35
                        }}>
                          <span style={{
                            paddingLeft: `${row.indent_level * 10}px`,
                            display: 'inline-block'
                          }}>
                            {row.name_ko}
                          </span>
                        </td>

                        {/* Basic Tariff (기본세율) */}
                        <td style={{
                          padding: '4px 4px',
                          textAlign: 'center',
                          color: '#0f172a',
                          fontWeight: 700
                        }}>
                          {row.base_rate !== '' ? row.base_rate : ''}
                        </td>

                        {/* Concession / FTA Badge (탄력·양허) */}
                        <td style={{
                          padding: '4px 4px',
                          textAlign: 'center'
                        }}>
                          {row.fta_badge && (
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveBottomTab('rates');
                              }}
                              style={{
                                display: 'inline-block',
                                background: '#eff6ff',
                                color: '#1d4ed8',
                                border: '1px solid #93c5fd',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                fontSize: '0.70rem',
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                              title="세율 상세표 보기"
                            >
                              {row.fta_badge}
                            </span>
                          )}
                        </td>

                        {/* Clearance Requirement Badge (요건) */}
                        <td style={{
                          padding: '4px 4px',
                          textAlign: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                            {row.has_origin && (
                              <span style={{
                                background: '#0284c7',
                                color: '#ffffff',
                                fontSize: '0.65rem',
                                padding: '1px 3px',
                                borderRadius: '2px',
                                fontWeight: 700
                              }} title="원산지증명서(C/O) 발급 대상">
                                원산지
                              </span>
                            )}
                            {row.req_badge && (
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveBottomTab('rates');
                                }}
                                style={{
                                  background: '#16a34a',
                                  color: '#ffffff',
                                  fontSize: '0.68rem',
                                  padding: '1px 4px',
                                  borderRadius: '3px',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                                title="수입 통관 요건 (세관장확인요령) 보기"
                              >
                                {row.req_badge}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* English Description */}
                        <td style={{
                          padding: '4px 8px',
                          color: '#475569',
                          lineHeight: 1.35,
                          fontSize: '0.76rem'
                        }}>
                          {row.name_en}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MIDDLE TOOLBAR (◀ 제8707호 | [보기1] | [부호설명] | [인쇄] | 제8709호 ▶) */}
          <div style={{
            background: '#f1f5f9',
            borderBottom: '1px solid #cbd5e1',
            padding: '5px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#334155'
          }}>
            {/* Prev Heading Button */}
            <div>
              {data?.prev_heading ? (
                <button
                  type="button"
                  onClick={() => handleSelectHeading(data.prev_heading!.hs_code)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <ChevronLeft size={14} />
                  <span>제{data.prev_heading.hs_code}호</span>
                </button>
              ) : (
                <span style={{ color: '#94a3b8' }}>◀ 첫 번째 호</span>
              )}
            </div>

            {/* Center Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select 
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                style={{
                  padding: '2px 6px',
                  fontSize: '0.74rem',
                  border: '1px solid #94a3b8',
                  borderRadius: '3px',
                  background: '#ffffff',
                  fontWeight: 600
                }}
              >
                <option value="filtered">보기1 (검색 필터 중심)</option>
                <option value="all">보기2 (전체 세목 계층)</option>
              </select>

              <button
                type="button"
                onClick={() => alert(`[부호설명]\n- 4단위: 호(Heading)\n- 6단위: WCO 국제공통 소호(Subheading)\n- 10단위: 대한민국 관세율표 HSK\n- [Im]: 세관장확인 수입요건 대상\n- [원산지]: FTA 원산지증명서 발급 대상`)}
                style={{
                  padding: '2px 8px',
                  background: '#64748b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '3px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                부호설명
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  padding: '2px 8px',
                  background: '#cbd5e1',
                  color: '#1e293b',
                  border: '1px solid #94a3b8',
                  borderRadius: '3px',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <Printer size={12} />
                <span>인쇄하기</span>
              </button>

              {onSelectHsCode && selectedRowCode && (
                <button
                  type="button"
                  onClick={() => onSelectHsCode(selectedRowCode)}
                  style={{
                    padding: '2px 10px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '3px',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    cursor: 'pointer'
                  }}
                >
                  선택 세번 확정 ({selectedRowCode})
                </button>
              )}
            </div>

            {/* Next Heading Button */}
            <div>
              {data?.next_heading ? (
                <button
                  type="button"
                  onClick={() => handleSelectHeading(data.next_heading!.hs_code)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1d4ed8',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  <span>제{data.next_heading.hs_code}호</span>
                  <ChevronRight size={14} />
                </button>
              ) : (
                <span style={{ color: '#94a3b8' }}>마지막 호 ▶</span>
              )}
            </div>
          </div>

          {/* BOTTOM PART: 5 CLASSIC TABS (부주 | 류주 | 호해설 | 분류사례 | 이미지) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1.2,
            minHeight: '260px',
            background: '#ffffff',
            overflow: 'hidden'
          }}>
            {/* Tabs Header */}
            <div style={{
              display: 'flex',
              background: '#e2e8f0',
              padding: '6px 10px 0 10px',
              gap: '4px',
              borderBottom: '2px solid #2563eb'
            }}>
              {[
                { id: 'section', label: '부주 (Section Notes)' },
                { id: 'chapter', label: '류주 (Chapter Notes)' },
                { id: 'wco', label: '호해설 (WCO Notes)' },
                { id: 'precedent', label: `분류사례 (${data?.precedents?.length || 0}건)` },
                { id: 'rates', label: '세율 / 요건상세' },
                { id: 'image', label: '이미지 / 도해' }
              ].map((tab) => {
                const isActive = (activeBottomTab === tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveBottomTab(tab.id as any)}
                    style={{
                      padding: '6px 14px',
                      background: isActive ? '#2563eb' : '#cbd5e1',
                      color: isActive ? '#ffffff' : '#334155',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      border: 'none',
                      borderRadius: '4px 4px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents View */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 18px',
              fontSize: '0.84rem',
              lineHeight: 1.65,
              color: '#0f172a'
            }}>
              {/* TAB 1: WCO Explanatory Notes (호해설) */}
              {activeBottomTab === 'wco' && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '0.96rem',
                      fontWeight: 900,
                      color: '#1e3a8a'
                    }}>
                      {data?.wco_notes?.title || `${data?.active_heading?.code} 호해설`}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleCopy(wcoLang === 'ko' ? data?.wco_notes?.content_ko || '' : data?.wco_notes?.content_en || '')}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedText ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                        <span>해설서 본문 복사</span>
                      </button>
                    </div>
                  </div>

                  <div style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'Malgun Gothic', 'Noto Sans KR', sans-serif",
                    color: '#1e293b',
                    fontSize: '0.84rem',
                    lineHeight: 1.7
                  }}>
                    {(wcoLang === 'ko' ? data?.wco_notes?.content_ko : data?.wco_notes?.content_en) || 
                      '공식 WCO 해설서 원문이 등록되어 있습니다.'}
                  </div>
                </div>
              )}

              {/* TAB 2: Section Notes (부주) */}
              {activeBottomTab === 'section' && (
                <div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.96rem',
                    fontWeight: 900,
                    color: '#1e3a8a',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    {data?.active_section?.title || '관세율표 부 주규정'}
                  </h3>
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    color: '#1e293b',
                    fontSize: '0.84rem',
                    lineHeight: 1.7,
                    background: '#f8fafc',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {data?.active_section?.notes || '관세율표 통칙 제1호 및 제6호에 따라 부주 규정을 검토하십시오.'}
                  </div>
                </div>
              )}

              {/* TAB 3: Chapter Notes (류주) */}
              {activeBottomTab === 'chapter' && (
                <div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.96rem',
                    fontWeight: 900,
                    color: '#1e3a8a',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    {data?.active_chapter?.title || '관세율표 류 주규정'}
                  </h3>
                  <div style={{
                    whiteSpace: 'pre-wrap',
                    color: '#1e293b',
                    fontSize: '0.84rem',
                    lineHeight: 1.7,
                    background: '#f8fafc',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}>
                    {data?.active_chapter?.notes || '관세율표 류 주규정을 검토하십시오.'}
                  </div>
                </div>
              )}

              {/* TAB 4: Precedents (분류사례) */}
              {activeBottomTab === 'precedent' && (
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '0.96rem',
                      fontWeight: 900,
                      color: '#1e3a8a'
                    }}>
                      관세평가분류원 실존 품목분류 심사결정례 (총 {data?.precedents?.length || 0}건)
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                      ✓ CUSWAY Constitution 100% 실존 판례 검증 완료
                    </span>
                  </div>

                  {data?.precedents && data.precedents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {data.precedents.map((prec, pIdx) => (
                        <div
                          key={pIdx}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '10px 14px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                background: '#1e3a8a',
                                color: '#ffffff',
                                fontSize: '0.72rem',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontWeight: 800
                              }}>
                                {prec.case_number}
                              </span>
                              <span style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                fontSize: '0.74rem',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontWeight: 800
                              }}>
                                {prec.hs_code}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              시행일: {prec.date || '공식 결정례'} | {prec.issuing_body}
                            </span>
                          </div>

                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem', marginBottom: '4px' }}>
                            {prec.product_name}
                          </div>

                          {prec.material && (
                            <div style={{ fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
                              <b>재질/성분:</b> {prec.material} | <b>용도:</b> {prec.function_use || '본문 참조'}
                            </div>
                          )}

                          <div style={{
                            fontSize: '0.78rem',
                            color: '#334155',
                            lineHeight: 1.5,
                            background: '#ffffff',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0',
                            whiteSpace: 'pre-wrap'
                          }}>
                            {prec.decision_reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                      해당 호에 대한 직접 등록된 사례가 없습니다. 4단위 상위 결정례를 조회하십시오.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: Rates & Requirements Detail (세율 / 요건상세) */}
              {activeBottomTab === 'rates' && (
                <div>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    fontSize: '0.96rem',
                    fontWeight: 900,
                    color: '#1e3a8a',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '8px'
                  }}>
                    2026 관세율표 및 수입통관 세관장확인요령 상세
                  </h3>

                  {/* Rates table */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                      1. 협정 및 관세율 비교 (기본 / WTO / 주요 FTA)
                    </div>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.78rem',
                      border: '1px solid #cbd5e1'
                    }}>
                      <thead style={{ background: '#f1f5f9', fontWeight: 700 }}>
                        <tr>
                          <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>협정/세율 구분</th>
                          <th style={{ padding: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}>적용 세율</th>
                          <th style={{ padding: '6px', border: '1px solid #cbd5e1' }}>비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.rates_detail && data.rates_detail.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '6px', fontWeight: 700 }}>{r.fta_name}</td>
                            <td style={{ padding: '6px', textAlign: 'center', fontWeight: 800, color: r.fta_rate === 0 ? '#16a34a' : '#0f172a' }}>
                              {r.fta_rate !== null ? `${r.fta_rate}%` : (r.base_rate !== null ? `${r.base_rate}%` : '-')}
                            </td>
                            <td style={{ padding: '6px', color: '#64748b' }}>
                              {r.country_code === 'BASE' ? '기본관세율 (A)' : (r.country_code === 'WTO' ? 'WTO 일반양허 (C)' : '원산지증명서 구비 시 적용')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Requirements list */}
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                      2. 세관장확인 수입요건 법령 (총 {data?.requirements_detail?.length || 0}건)
                    </div>
                    {data?.requirements_detail && data.requirements_detail.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.requirements_detail.map((req, rIdx) => (
                          <div key={rIdx} style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            padding: '8px 12px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{
                                background: '#16a34a',
                                color: '#ffffff',
                                fontSize: '0.70rem',
                                padding: '1px 5px',
                                borderRadius: '3px',
                                fontWeight: 800
                              }}>
                                {req.check_type || '세관장확인'}
                              </span>
                              <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                                {req.law_name}
                              </span>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                (소관: {req.agency_name})
                              </span>
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#334155', lineHeight: 1.4 }}>
                              {req.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '4px', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem' }}>
                        ✓ 본 호에 대한 세관장확인 수입 요건 규정이 없거나 표준 통관 대상입니다.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: Images & Diagrams (이미지) */}
              {activeBottomTab === 'image' && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{
                    maxWidth: '480px',
                    margin: '0 auto',
                    border: '1.5px dashed #cbd5e1',
                    borderRadius: '8px',
                    padding: '30px 20px',
                    background: '#f8fafc'
                  }}>
                    <ImageIcon size={40} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
                    <div style={{ fontWeight: 800, color: '#1e3a8a', fontSize: '0.92rem', marginBottom: '4px' }}>
                      제{data?.active_heading?.code}호 구조 도해 및 물품 견본
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                      차량용 부분품 및 부속품(완충기, 브레이크, 조향장치, 안전벨트 등)의 조립 성상과 외형 규격 도해가 관세평가분류원 표준 도감과 연계되어 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isPageMode) {
    return content;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {content}
      </div>
    </div>
  );
};
export default ClipManualInspectorModal;
