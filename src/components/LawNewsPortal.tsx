import React, { useState } from 'react'
import { BookOpen, ExternalLink, FileText, Bell, Star, Search, ShieldAlert, ArrowUpRight } from 'lucide-react'

interface LawNewsPortalProps {
  currentUser: any;
}

export default function LawNewsPortal({ currentUser }: LawNewsPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample static data for notices/news based on real customs regulations
  const notices = [
    {
      id: 1,
      tag: '고시 개정',
      title: '협정관세 사후적용 등에 관한 사무처리 고시 개정안 공포',
      date: '2026-08-11',
      agency: '관세청 자유무역협정집행과',
      summary: 'FTA 사후 적용 신청 시 원산지증빙서류 오류 정정 및 재신청 절차를 명확화하고, 가산세 면제 소명 절차 간소화.',
      link: 'https://unipass.customs.go.kr/clip/index.do'
    },
    {
      id: 2,
      tag: 'FTA 뉴스',
      title: '한-인도 CEPA 및 한-아세안 FTA 원산지 증명서 국문 간소화 지침 시행',
      date: '2026-08-05',
      agency: '관세청 원산지지원과',
      summary: '수출입 화주의 편의를 위해 아세안 국가 대상 원산지증명서(C/O)의 전자 교환 범위 확대 및 오류 검증 절차 단축.',
      link: 'https://unipass.customs.go.kr/clip/index.do'
    },
    {
      id: 3,
      tag: '세액 심사',
      title: '다국적기업 이전가격(Transfer Pricing) 관세평가 소명자료 사전 검토 활성화',
      date: '2026-07-28',
      agency: '관세평가분류원',
      summary: '특수관계자 간 수입 거래가격 심사 시 세법상 정상가격 보고서(TP Report) 및 APA 합의서의 관세평가 가산율 반영 기준 고시.',
      link: 'https://unipass.customs.go.kr/clip/index.do'
    },
    {
      id: 4,
      tag: '행정 예고',
      title: '수출용 원재료에 대한 관세 등 환급에 관한 특례법 시행령 일부개정예고',
      date: '2026-07-15',
      agency: '기획재정부 관세제도과',
      summary: '소기업 간이정액환급율표 적용 품목의 확대 및 원재료 수입 후 가공 수출 시의 국내 제조 가중치 산정 공식 보완.',
      link: 'https://unipass.customs.go.kr/clip/index.do'
    }
  ];

  const laws = [
    {
      title: '관세법 (Customs Act)',
      desc: '수입물품의 관세 부과·징수 및 수출입 통관을 적정하게 하며 관세 수입을 확보함으로써 국민경제 발전에 이바지하는 기본법.',
      points: ['제30조 (과세가격 결정의 원칙)', '제38조 (신고납부 및 사후 정밀세액검증)', '제234조 (수출입의 금지/풍속저해물품 등)'],
      url: 'https://www.law.go.kr/법령/관세법'
    },
    {
      title: '관세환급특례법 (Refund Special Act)',
      desc: '수출용원재료에 대한 관세, 임시특별관세, 특별소비세, 부가가치세 등의 환급을 신속하고 적정하게 처리하기 위한 특례법.',
      points: ['제10조 (환급금의 산출 및 정액환급률표)', '제14조 (환급신청 및 소멸시효 5년)', '제21조 (환급세액의 심사 및 자체 소명)'],
      url: 'https://www.law.go.kr/법령/수출용원재료에대한관세등환급에관한특례법'
    },
    {
      title: 'FTA 관세특례법 (FTA Special Act)',
      desc: '대한민국이 체결한 자유무역협정(FTA)의 이행을 위해 협정세율의 적용, 원산지증명 및 국가간 협력 조항을 규정하는 특례법.',
      points: ['제8조 (협정관세의 적용 신청)', '제9조 (협정관세의 사후적용 신청 및 경정)', '제16조 (원산지에 관한 조사 및 서류 보관)'],
      url: 'https://www.law.go.kr/법령/자유무역협정의이행을위한관세법의특례에관한법률'
    },
    {
      title: '대외무역법 (Foreign Trade Act)',
      desc: '국제수지의 균형과 통상의 확대를 도모하고 공정거래 질서를 확립하여 외국의 수입 요건 및 통합공고 승인 절차를 규정하는 법.',
      points: ['제11조 (수출입의 제한 및 승인)', '제12조 (통합공고 및 세관장확인 요건 고시)', '제20조 (원산지 표시의무 및 위반 제재)'],
      url: 'https://www.law.go.kr/법령/대외무역법'
    }
  ];

  const externalLinks = [
    { name: '관세청 UNIPASS', url: 'https://unipass.customs.go.kr/', desc: '수출입 통관 및 세관장확인 승인 신청' },
    { name: '관세법령정보포털 CLIP', url: 'https://unipass.customs.go.kr/clip/index.do', desc: '공식 관세율표, 해설서, 품목분류 사례 조회' },
    { name: 'WCO HS 품목분류센터', url: 'http://www.wcoomd.org/', desc: '세계관세기구 국제 품목분류 동향 및 가이드라인' },
    { name: '씨엘HS 편람', url: 'https://www.clhs.co.kr/', desc: '품목분류, 세율 편람 및 관세평가 결정례 조회' }
  ];

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '30px', color: '#fff' }}>
      
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        padding: '30px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: '200px', height: '200px', right: '-50px', top: '-50px', background: 'rgba(20, 184, 166, 0.12)', filter: 'blur(50px)', borderRadius: '50%', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>주요 법령 및 세정 소식 포털</h2>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '650px', lineHeight: 1.5 }}>
          경쟁사 데이터와 세관 유관 기관의 신뢰도 높은 최신 고시, 개정 세법 지침 및 실무 필수 4대 법령 정보를 한곳에서 신속하게 조회할 수 있습니다.
        </p>

        {/* Search bar inside header */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', maxWidth: '450px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="개정 고시 또는 뉴스 키워드 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* Two Column Layout for Laws & Notices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px' }}>
        
        {/* Left Column: 4 Major Laws */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>실무 필수 4대 관세법령</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {laws.map((law, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(30, 41, 59, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.25)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-cyan)', margin: 0 }}>{law.title}</h4>
                  <a 
                    href={law.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      padding: '4px 8px',
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    전문 보기 <ArrowUpRight size={12} />
                  </a>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
                  {law.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {law.points.map((pt, pIdx) => (
                    <span 
                      key={pIdx}
                      style={{
                        background: 'rgba(6, 182, 212, 0.08)',
                        color: 'var(--accent-cyan)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: '1px solid rgba(6, 182, 212, 0.15)'
                      }}
                    >
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Notices & External Shortcuts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Section: News & Notices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>최신 관세 고시 및 개정 뉴스</h3>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <div 
                    key={notice.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      paddingBottom: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        background: notice.tag.includes('고시') ? 'rgba(20, 184, 166, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                        color: notice.tag.includes('고시') ? 'var(--accent-primary)' : '#818cf8',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700
                      }}>
                        {notice.tag}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{notice.date}</span>
                    </div>

                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: 0, lineHeight: 1.35, color: '#fff' }}>
                      {notice.title}
                    </h4>
                    
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {notice.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>담당: {notice.agency}</span>
                      <a 
                        href={notice.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                      >
                        고시 세부조회 <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))
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
              <Star size={18} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>실무 추천 바로가기</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {externalLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(30, 41, 59, 0.45)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
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
                    e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.45)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{link.name}</span>
                    <ExternalLink size={12} color="var(--text-muted)" />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{link.desc}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
