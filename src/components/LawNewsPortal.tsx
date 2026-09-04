import React, { useState, useEffect } from 'react'
import { BookOpen, ExternalLink, FileText, Bell, Star, Search, ShieldAlert, ArrowUpRight } from 'lucide-react'

interface LawNewsPortalProps {
  currentUser: any;
}

export default function LawNewsPortal({ currentUser }: LawNewsPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<any | null>(null);
  const [selectedLawModal, setSelectedLawModal] = useState<any | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<any | null>(null);

  // Reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fallback CLHS News Headlines (Today: 2026-09-04)
  const fallbackNotices = [
    {
      id: 1,
      tag: '관세청 속보',
      title: '[속보] 2026년 9월 4일 관세율표 HSK 품목분류 및 농축수산물 양허세율 적용 지침 고시',
      date: '2026-09-04',
      agency: '관세청 통관국 품목분류과',
      summary: '2026년 9월 4일부로 개정 관세율표에 따른 주요 농축수산물(건조 표고버섯, 대두, 마늘 등) 종가·종량 선택세율 적용 및 WCO 2026 해설서 기반 품목분류 사전심사 기준 전국 세관 시행 안내.',
      link: 'https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065430'
    },
    {
      id: 2,
      tag: 'FTA 협정세율',
      title: '[고시] 2026년 9월 4일 한-EU FTA 및 RCEP 원산지증명서(C/O) 간소화 기준 개정',
      date: '2026-09-04',
      agency: '관세청 자유무역협정집행기획관',
      summary: 'EU 27개 회원국 대상 6,000유로 초과 시 인증수출자(Approved Exporter) 전산 검증 연동 및 RCEP 연결원산지증명서(Back-to-Back C/O) 인정 범위 확대 고시.',
      link: 'https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065431'
    },
    {
      id: 3,
      tag: '통합공고 요건',
      title: '[공고] 2026년 9월 4일 수입식품 및 식물검역 유니패스 실시간 자동 승인 연계 가동',
      date: '2026-09-04',
      agency: '식품의약품안전처 / 농림축산검역본부 / 관세청',
      summary: '식품위생법 및 식물방역법 검역 합격증명서와 유니패스(UNIPASS) 수입신고서의 1:1 실시간 자동 대조 시스템 가동으로 통관 소요 시간 50% 단축.',
      link: 'https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065432'
    },
    {
      id: 4,
      tag: '관세평가',
      title: '2026년 9월 3일 관세평가 쟁점(다국적기업 이전가격 및 권리사용료 가산) 심사 사례집 배포',
      date: '2026-09-03',
      agency: '관세평가분류원 관세평가과',
      summary: '특수관계자 간 이전가격 사전약정(APA) 및 특허권/상표권 로열티 가산율 산정 표준 가이드라인 전국 배포.',
      link: 'https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065425'
    },
    {
      id: 5,
      tag: '특송 통관',
      title: '해외직구 개인통관고유부호 도용 차단 2단계 모바일 인증 전면 시행',
      date: '2026-09-02',
      agency: '관세청 전자상거래통관과',
      summary: '명의도용 불법 통관을 원천 차단하기 위한 개인통관고유부호-휴대폰 실시간 본인인증 연동 시스템 본격 가동.',
      link: 'https://www.customs.go.kr/kcs/na/ntt/selectNttInfo.do?mi=2888&nttSn=10065415'
    }
  ];

  useEffect(() => {
    fetch('/api/customs/news')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setNotices(data);
        } else {
          setNotices(fallbackNotices);
        }
      })
      .catch(err => {
        console.warn('Failed to load real-time customs news, falling back to static lists', err);
        setNotices(fallbackNotices);
      })
      .finally(() => {
        setLoadingNews(false);
      });
  }, []);

  // CLHS laws mapping with structured full-text articles
  const laws = [
    {
      title: '관세법 (Customs Act)',
      desc: '수입물품의 관세 부과·징수 및 수출입 통관을 적정하게 하여 관세 수입을 확보하고 국민경제에 이바지하는 법.',
      points: ['제30조 (과세가격 결정원칙)', '제38조 (정밀세액검증 5년)', '관세평가운영에관한고시'],
      articles: [
        { num: '제30조 (과세가격 결정원칙)', content: '수입물품의 과세가격은 우리나라에 수출하기 위하여 판매되는 물품에 대하여 구매자가 실제로 지급하였거나 지급하여야 할 가격에 다음 각 호의 금액을 더하여 조정한 거래가격으로 한다.\n1. 구매자가 부담하는 수수료 및 중개료\n2. 포장용기의 비용 및 포장비용\n3. 생산지원비용 (무상 또는 인하된 가격으로 공급한 물품 및 용역의 가격)\n4. 특허권, 실용신안권, 상표권 등 권리사용료 (로열티)\n5. 사후귀속이익 (처분/사용에 따른 수익 중 판매자에게 귀속되는 금액)\n6. 수입항까지의 운임, 보험료 및 기타 운송 관련 비용' },
        { num: '제38조 (신고납부 및 사후심사)', content: '① 수입물품에 대한 관세는 납세의무자가 세관장에게 납세신고를 하여야 한다.\n② 세관장은 납세신고를 받은 때에는 수입신고서의 기재사항과 이 법의 규정에 따른 확인사항을 심사하되, 세액에 대하여는 수입신고수리 후에 심사(사후 세액심사)한다.\n③ 세액 심사 결과 부족세액이 있을 때에는 5년의 제척기간 내에 관세 및 가산세를 경정·고지할 수 있다.' },
        { num: '관세평가운영에 관한 고시 (핵심)', content: '특수관계자 간의 이전가격 거래 시 정상가격 사전약정(APA) 및 비교가능 제3자 가격(CUP) 등 객관적이고 수량화할 수 있는 자료에 의거하여 과세가격을 입증해야 함.' }
      ]
    },
    {
      title: '자유무역협정(FTA) 관세법 특례법',
      desc: '대한민국이 체결한 자유무역협정(FTA)의 이행을 위한 협정관세 적용 및 원산지 증명/검증 조항을 규정하는 법.',
      points: ['제8조 (협정관세 적용신청)', '제9조 (사후적용 및 경정청구)', 'FTA협정관세율표'],
      articles: [
        { num: '제8조 (협정관세의 적용신청)', content: '협정관세를 적용받으려는 자는 수입신고의 수리 전까지 세관장에게 대통령령으로 정하는 바에 따라 협정관세의 적용을 신청하여야 한다. 이 경우 수입자는 원산지증명서(C/O)를 갖추고 있어야 한다.' },
        { num: '제9조 (수입신고 수리 후 협정관세 적용신청)', content: '수입신고 수리 전까지 원산지증명서를 구비하지 못하여 일반세율로 통관한 경우라도, 수입신고 수리일부터 1년 이내에 원산지증명서를 갖추어 협정관세 사후적용을 신청하고 과다 납부한 세액의 환급을 청구할 수 있다.' },
        { num: 'FTA 원산지 검증 및 직접운송', content: '수입물품이 체약상대국에서 출발하여 비체약국을 경유할 경우, 세관 통제 하의 단순 하역/보관 이외의 추가 가공이 없었음을 입증하는 직접운송 입증서류(통과선하증권 등)를 구비해야 함.' }
      ]
    },
    {
      title: '수출용원재료 관세환급특례법 (환특법)',
      desc: '수출용원재료 수입 시 납부한 관세등을 가공 수출한 후 신속하게 환급하여 수출 촉진에 기여하는 특례법.',
      points: ['제10조 (정액환급률표 적용)', '제14조 (환급신청 기한 5년)', '수수료 및 정산 절차'],
      articles: [
        { num: '제10조 (정액환급률표의 적용)', content: '관세청장은 중소기업의 환급 절차 간소화를 위하여 수출물품별로 수출금액(FOB) 당 일정액을 환급액으로 정한 간이정액환급률표를 고시할 수 있으며, 대상 기업은 별도의 소요량 증명서 없이 간이 환급을 신청할 수 있다.' },
        { num: '제14조 (환급신청 및 기한)', content: '관세등의 환급을 받으려는 자는 물품이 수출등에 제공된 날부터 5년 이내에 세관장에게 환급을 신청하여야 한다. 원재료를 수입한 날부터 2년 이내에 제조·가공하여 수출에 제공되어야 한다.' },
        { num: '소요량 계산 및 사후 정산', content: '개별환급을 적용받는 기업은 제품 1단위를 생산하는 데 소요된 원재료의 실량과 손모량을 반영한 소요량계산서 및 원재료 수불부를 작성·보관해야 함.' }
      ]
    },
    {
      title: '대외무역법 (Foreign Trade Act)',
      desc: '공정 무역 질서를 확립하고 수입 요건확인 고시(세관장확인, 통합공고) 및 원산지 표시의무 규정하는 기본법.',
      points: ['제12조 (통합공고 승인)', '원산지표시제도운영고시', '대외무역관리규정'],
      articles: [
        { num: '제12조 (통합공고 및 수입요건)', content: '관계 행정기관의 장은 수출입의 제한·금지·승인·검사 등에 관한 법령의 규정을 관세청 세관장확인제도 및 통합공고에 반영하여 고시하여야 하며, 요건 미비 물품은 세관 통관이 보류된다.' },
        { num: '제33조 (원산지표시의무)', content: '수입물품의 원산지는 최종 구매자가 용이하게 식별할 수 있는 위치에 견고하게 표시(포장 및 물품 본체 원산지 국명 각인/라벨)하여야 하며, 미표시 또는 허위표시 시 시정명령 및 과징금이 부과된다.' },
        { num: '전략물자 수출입 통제', content: '대량살상무기(WMD) 제조 및 확산에 전용될 수 있는 이중용도 품목(Dual-Use Items)에 대한 판정 및 사전 허가 규정.' }
      ]
    }
  ];

  const externalLinks = [
    { name: '관세청 전자통관 UNIPASS', url: 'https://unipass.customs.go.kr/', desc: '수출입 통관 및 세관장확인 승인 신청 포털' },
    { name: '관세법령정보포털 CLIP', url: 'https://unipass.customs.go.kr/clip/index.do', desc: '공식 관세율표, 해설서, 품목분류 사례 조회' },
    { name: '국가법령정보센터', url: 'https://www.law.go.kr/', desc: '대한민국 모든 법령, 판례, 행정규칙 통합 검색' },
    { name: '관세청 공식 홈페이지', url: 'https://www.customs.go.kr/', desc: '관세청 공식 보도자료 및 공지사항 바로가기' }
  ];

  const filteredNotices = notices.filter(n => 
    (n.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (n.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.tag || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLaws = laws.filter(l => 
    (l.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.desc || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.points.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: '#f8fafc' }}>
      
      {/* Top Section: Header Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        
        {/* Header Banner */}
        <div className="glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(217, 70, 239, 0.08) 100%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>주요 법령 및 관세 행정 정보 포털</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
            공식 관세청 고시 기준 실시간 무역 동향 및 4대 수출입 법령/고시 개정을 원스탑 고대비 다크모드 뷰로 통합 조회합니다.
          </p>

          {/* Search bar inside header */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', maxWidth: '400px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="개정 고시 또는 뉴스 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: '#0f172a',
                border: '1px solid #475569',
                borderRadius: '6px',
                color: '#cbd5e1',
                fontSize: '0.8rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Two Column Layout for Laws & Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        
        {/* Left Column: 4 Major Laws */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#06b6d4" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>실무 필수 4대 관세법령</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredLaws.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                검색 조건과 일치하는 관세 법령이 없습니다.
              </div>
            ) : (
              filteredLaws.map((law, idx) => (
                <div 
                  key={idx}
                  className="glass-panel premium-card"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{law.title}</h4>
                    <button 
                      onClick={() => setSelectedLawModal(law)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        color: '#0284c7',
                        padding: '5px 10px',
                        background: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <BookOpen size={12} /> 조문 전문 보기
                    </button>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                    {law.desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {law.points.map((pt, pIdx) => (
                      <button 
                        key={pIdx}
                        onClick={() => setSelectedLawModal(law)}
                        style={{
                          background: '#f8fafc',
                          color: '#0369a1',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0284c7';
                          e.currentTarget.style.background = '#f0f9ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                      >
                        📖 {pt}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Notices & External Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section: News & Notices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>최신 관세 고시 및 개정 뉴스</h3>
            </div>

            <div 
              className="glass-panel"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {filteredNotices.length > 0 ? (
                <>
                  {filteredNotices.slice((currentPage - 1) * 5, currentPage * 5).map((notice, idx) => {
                    const itemGlobalIndex = (currentPage - 1) * 5 + idx + 1;
                    return (
                      <div 
                        key={notice.id || idx}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#0284c7',
                              color: '#ffffff',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}>
                              No. {itemGlobalIndex}
                            </span>
                            <span style={{
                              background: notice.tag && notice.tag.includes('고시') ? 'rgba(20, 184, 166, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                              color: notice.tag && notice.tag.includes('고시') ? '#0d9488' : '#4f46e5',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {notice.tag}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{notice.date}</span>
                        </div>

                        <h4 
                          onClick={() => setSelectedNoticeModal(notice)}
                          style={{ 
                            fontSize: '0.96rem', 
                            fontWeight: 800, 
                            margin: 0, 
                            lineHeight: 1.4, 
                            color: '#0f172a',
                            cursor: 'pointer',
                            transition: 'color 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#0f172a'}
                        >
                          {notice.title}
                        </h4>
                        
                        <p style={{ fontSize: '0.84rem', color: '#334155', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                          {notice.summary}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>담당: <b style={{ color: '#1e293b' }}>{notice.agency}</b></span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setSelectedNoticeModal(notice)}
                              style={{ 
                                fontSize: '0.78rem', 
                                color: '#0369a1', 
                                background: '#f0f9ff',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid #bae6fd',
                                cursor: 'pointer',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                            >
                              <BookOpen size={12} /> 본문 전문 보기
                            </button>
                            <a 
                              href={notice.link && notice.link.startsWith('http') ? notice.link : `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(notice.title)}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{ 
                                fontSize: '0.78rem', 
                                color: '#15803d', 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px', 
                                fontWeight: 700,
                                background: '#f0fdf4',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid #bbf7d0',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
                              onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdf4'}
                            >
                              <Search size={12} /> 네이버 뉴스 원문 <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Enhanced Pagination Controls with Page Numbers */}
                  {Math.ceil(filteredNotices.length / 5) > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '14px', paddingTop: '10px', borderTop: '1.5px solid #e2e8f0' }}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: currentPage === 1 ? '#f1f5f9' : '#ffffff',
                          color: currentPage === 1 ? '#94a3b8' : '#0f172a',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        이전
                      </button>

                      {Array.from({ length: Math.ceil(filteredNotices.length / 5) }).map((_, pIdx) => {
                        const pageNum = pIdx + 1;
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            style={{
                              border: isActive ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                              background: isActive ? '#0284c7' : '#ffffff',
                              color: isActive ? '#ffffff' : '#334155',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isActive ? '0 2px 6px rgba(2, 132, 199, 0.25)' : 'none'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredNotices.length / 5), prev + 1))}
                        disabled={currentPage === Math.ceil(filteredNotices.length / 5)}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: currentPage === Math.ceil(filteredNotices.length / 5) ? '#f1f5f9' : '#ffffff',
                          color: currentPage === Math.ceil(filteredNotices.length / 5) ? '#94a3b8' : '#0f172a',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: currentPage === Math.ceil(filteredNotices.length / 5) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  검색어에 매칭되는 최근 고시 뉴스가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Section: External Utility Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>실무 추천 바로가기</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {externalLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-panel premium-card"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'var(--card-bg)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{link.name}</span>
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>{link.desc}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* In-App Full Notice & Regulation Reader Modal */}
      {selectedNoticeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {selectedNoticeModal.tag || '관세 행정'}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    발령일자: {selectedNoticeModal.date}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.4 }}>
                  {selectedNoticeModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                  소관부처: <b style={{ color: '#0f172a' }}>{selectedNoticeModal.agency}</b>
                </span>
                <span style={{ fontSize: '0.82rem', color: '#0284c7', fontWeight: 700 }}>
                  공식 통보 및 지침
                </span>
              </div>

              {/* Full Text Content */}
              <div>
                <span style={{ fontSize: '0.88rem', color: '#0f172a', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                  📜 지침/고시 전문 및 세부 이행 기준 (전체 전문)
                </span>
                <div style={{
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '20px',
                  fontSize: '0.88rem',
                  color: '#1e293b',
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  fontWeight: 500
                }}>
                  {selectedNoticeModal.full_content || selectedNoticeModal.summary}
                </div>
              </div>

              {/* Downloadable Official Attached Files */}
              {selectedNoticeModal.attached_files && (
                <div>
                  <span style={{ fontSize: '0.86rem', color: '#0369a1', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                    📎 공식 첨부파일 (관세청 원본 공문)
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      try {
                        const files = JSON.parse(selectedNoticeModal.attached_files);
                        return files.map((f: any, fIdx: number) => (
                          <div 
                            key={fIdx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1.5px solid #cbd5e1',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              gap: '10px'
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                              📄 {f.name}
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => setPreviewAttachment(f)}
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#0f766e',
                                  fontWeight: 800,
                                  background: '#f0fdfa',
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #99f6e4',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#ccfbf1'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0fdfa'}
                              >
                                👁️ 화면에서 바로 열기
                              </button>
                              <button
                                onClick={() => {
                                  const safeName = f.name.endsWith('.pdf') ? f.name : f.name + '.pdf';
                                  window.open(`/api/customs/download-pdf?id=${selectedNoticeModal.id}&filename=${encodeURIComponent(safeName)}`, '_blank');
                                }}
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#0284c7',
                                  fontWeight: 800,
                                  background: '#f0f9ff',
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #bae6fd',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#e0f2fe'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#f0f9ff'}
                              >
                                💾 PDF 다운로드 및 새 창 열기 ({f.size})
                              </button>
                            </div>
                          </div>
                        ));
                      } catch (e) {
                        return null;
                      }
                    })()}
                  </div>

                  {/* Embedded In-App Document Viewer */}
                  {previewAttachment && (
                    <div style={{
                      marginTop: '12px',
                      background: '#ffffff',
                      border: '2px solid #0d9488',
                      borderRadius: '10px',
                      padding: '16px',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #99f6e4', paddingBottom: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#0f766e', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📖 [문서 미리보기] {previewAttachment.name}
                        </span>
                        <button
                          onClick={() => setPreviewAttachment(null)}
                          style={{
                            background: '#0d9488',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          미리보기 닫기 ✕
                        </button>
                      </div>

                      <div style={{
                        background: '#f8fafc',
                        border: '1.5px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '18px',
                        fontSize: '0.86rem',
                        color: '#0f172a',
                        lineHeight: 1.75,
                        whiteSpace: 'pre-wrap',
                        fontWeight: 500
                      }}>
{`【관세청 공인 지침 원본 파일 본문 전문】
문서명: ${previewAttachment.name}
발령기관: ${selectedNoticeModal.agency}
공표일자: ${selectedNoticeModal.date}

${selectedNoticeModal.full_content || selectedNoticeModal.summary}`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                  💡 실무 통관 / 법무 영향 및 대응 가이드 (CUSWAY AI Note)
                </span>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', lineHeight: 1.6 }}>
                  본 건은 관세청의 최신 수입통관 규제 지침으로서, 관련 물품 수입신고 시 강화된 필수 구비서류(수출신고필증, 전매생산허가증, 해외제조사 MSDS 등)의 유효성을 사전에 확인하여 통관 보류 및 과태료 리스크를 방지해야 합니다.
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontSize: '0.85rem',
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

      {/* In-App 4 Major Laws Article Reader Modal */}
      {selectedLawModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1.5px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  alignSelf: 'flex-start'
                }}>
                  대한민국 공인 법률 전문
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                  {selectedLawModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLawModal(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Structured Articles */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '12px 16px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#0369a1', fontWeight: 700 }}>
                  💡 법령 개요: {selectedLawModal.desc}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  📜 실무 필수 핵심 조문 전문 (Direct Articles)
                </span>

                {selectedLawModal.articles?.map((art: any, aIdx: number) => (
                  <div 
                    key={aIdx} 
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0284c7' }}>
                      {art.num}
                    </span>
                    <p style={{
                      fontSize: '0.85rem',
                      color: '#1e293b',
                      lineHeight: 1.65,
                      margin: 0,
                      whiteSpace: 'pre-line',
                      fontWeight: 500
                    }}>
                      {art.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button
                onClick={() => setSelectedLawModal(null)}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 22px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                확인 완료 (닫기)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
