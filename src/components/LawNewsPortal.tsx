import React, { useState } from 'react'
import { BookOpen, ExternalLink, FileText, Bell, Star, Search, ShieldAlert, ArrowUpRight } from 'lucide-react'

interface LawNewsPortalProps {
  currentUser: any;
}

export default function LawNewsPortal({ currentUser }: LawNewsPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // CLHS Exchange Rates Integration
  const exchangeRates = [
    { code: 'USD', rate: '1,382.44', change: '+0.15%' },
    { code: 'EUR', rate: '1,612.63', change: '-0.08%' },
    { code: 'CNY', rate: '205.55', change: '+0.02%' },
    { code: 'GBP', rate: '1,883.48', change: '+0.12%' }
  ];

  // CLHS Chapter shortcuts
  const hsChapters = [
    { id: '01', name: '산 동물' }, { id: '02', name: '육류' }, { id: '03', name: '어패류' }, 
    { id: '08', name: '과실류' }, { id: '09', name: '커피·차' }, { id: '21', name: '조제식품' }, 
    { id: '33', name: '화장품' }, { id: '39', name: '플라스틱' }, { id: '61', name: '편물의류' }, 
    { id: '62', name: '직물의류' }, { id: '72', name: '철강' }, { id: '84', name: '기계류' }, 
    { id: '85', name: '전기기기' }, { id: '87', name: '자동차' }, { id: '90', name: '정밀의료' },
    { id: '95', name: '완구운동구' }
  ];

  // CLHS News Headlines
  const notices = [
    {
      id: 1,
      tag: '압수 소식',
      title: '백꾸, 뽑기방 유행에 인천세관 압수 짝퉁 80%는 키링, 인형',
      date: '2026-08-28',
      agency: '인천세관 휴대품심사과',
      summary: '가방 꾸미기 유행으로 짝퉁 캐릭터 인형 및 키링 등의 무단 지식재산권 침해 물품 수입 급증 및 세관 압수 조치.',
      link: 'https://n.news.naver.com/mnews/article/001/0016273395?sid=102'
    },
    {
      id: 2,
      tag: '무역 동향',
      title: '중국 때렸더니 베트남이 1위 관세전쟁이 뒤집은 미국 무역흑자국',
      date: '2026-08-26',
      agency: '기획재정부 대외경제국',
      summary: '미국의 고율 관세 부과 여파로 중국의 대미 수출 우회 기지로 급부상한 베트남의 대미 무역 흑자 규모 사상 최대 기록.',
      link: 'https://n.news.naver.com/mnews/article/016/0002688937?sid=104'
    },
    {
      id: 3,
      tag: '안전성 검사',
      title: '중국산 배추 포름알데히드 검사 최근 수입 8건 모두 불검출',
      date: '2026-08-25',
      agency: '식품의약품안전처 수입검사과',
      summary: '소비자 안전 확보를 위해 긴급 전수 조사한 중국산 배추에 대해 잔류 화학 성분 불검출 판정 및 통관 절차 재개.',
      link: 'https://n.news.naver.com/mnews/article/001/0016270688?sid=101'
    },
    {
      id: 4,
      tag: '의약 직구',
      title: '위고비, 마운자로 불법 직구 기승 작년 연간치 3.5배 적발',
      date: '2026-08-24',
      agency: '관세청 특송통관국',
      summary: '해외 직구를 악용한 오남용 우려 전문의약품의 개인 무단 밀수 통관 시도 단속 강화 및 적합성 위반 건수 급증.',
      link: 'https://n.news.naver.com/mnews/article/001/0016265892?sid=101'
    }
  ];

  // CLHS laws mapping
  const laws = [
    {
      title: '관세법 (Customs Act)',
      desc: '수입물품의 관세 부과·징수 및 수출입 통관을 적정하게 하여 관세 수입을 확보하고 국민경제에 이바지하는 법.',
      points: ['제30조 (과세가격 결정원칙)', '제38조 (정밀세액검증 5년)', '관세평가운영에관한고시'],
      url: 'https://www.law.go.kr/법령/관세법'
    },
    {
      title: '자유무역협정(FTA) 관세법 특례법',
      desc: '대한민국이 체결한 자유무역협정(FTA)의 이행을 위한 협정관세 적용 및 원산지 증명/검증 조항을 규정하는 법.',
      points: ['제8조 (협정관세 적용신청)', '제9조 (사후적용 및 경정청구)', 'FTA협정관세율표'],
      url: 'https://www.law.go.kr/법령/자유무역협정의이행을위한관세법의특례에관한법률'
    },
    {
      title: '수출용원재료 관세환급특례법 (환특법)',
      desc: '수출용원재료 수입 시 납부한 관세등을 가공 수출한 후 신속하게 환급하여 수출 촉진에 기여하는 특례법.',
      points: ['제10조 (정액환급률표 적용)', '제14조 (환급신청 기한 5년)', '수수료 및 정산 절차'],
      url: 'https://www.law.go.kr/법령/수출용원재료에대한관세등환급에관한특례법'
    },
    {
      title: '대외무역법 (Foreign Trade Act)',
      desc: '공정 무역 질서를 확립하고 수입 요건확인 고시(세관장확인, 통합공고) 및 원산지 표시의무 규정하는 기본법.',
      points: ['제12조 (통합공고 승인)', '원산지표시제도운영고시', '대외무역관리규정'],
      url: 'https://www.law.go.kr/법령/대외무역법'
    }
  ];

  const externalLinks = [
    { name: '관세청 UNIPASS', url: 'https://unipass.customs.go.kr/', desc: '수출입 통관 및 세관장확인 승인 신청' },
    { name: '관세법령정보포털 CLIP', url: 'https://unipass.customs.go.kr/clip/index.do', desc: '공식 관세율표, 해설서, 품목분류 사례 조회' },
    { name: '국가법령정보센터', url: 'https://www.law.go.kr/', desc: '대한민국 모든 법령, 판례, 고시 통합 검색 및 조회' },
    { name: '관세청 통합 고시 포털', url: 'https://unipass.customs.go.kr/clip/index.do', desc: '관세평가운영고시 및 수입통관고시 실시간 조회' }
  ];

  const filteredNotices = notices.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: '#f8fafc' }}>
      
      {/* Top Section: Header & Exchange Rates widget */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BookOpen size={24} color="#06b6d4" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>주요 법령 및 관세 행정 정보 포털</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.4 }}>
            CLHS의 대표적 통관 요건, 실시간 환율 동향 및 4대 수출입 법령/고시 개정을 원스탑 고대비 다크모드 뷰로 통합 조회합니다.
          </p>

          {/* Search bar inside header */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', maxWidth: '400px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#cbd5e1' }} />
            <input 
              type="text" 
              placeholder="개정 고시 또는 뉴스 키워드 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '0.8rem'
              }}
            />
          </div>
        </div>

        {/* Real-time Exchange Rates Widget */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700 }}>💵 관세청 고시 기준 환율 (CLHS 동기화)</span>
            <span style={{ fontSize: '0.7rem', color: '#cbd5e1' }}>금주 기준율</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {exchangeRates.map((rate, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>{rate.code}</span>
                <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 800 }}>{rate.rate}</span>
                <span style={{ fontSize: '0.62rem', color: rate.change.startsWith('+') ? '#ef4444' : '#3b82f6' }}>{rate.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chapter Navigation Jumper */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '16px 20px'
      }}>
        <span style={{ display: 'block', fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700, marginBottom: '8px' }}>
          📂 관세율표 제1류 ~ 제97류 품목 분류 바로가기 (관세법령포털 CLIP 연동)
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {hsChapters.map((ch) => (
            <a 
              key={ch.id}
              href="https://unipass.customs.go.kr/clip/index.do"
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                fontSize: '0.72rem',
                color: '#cbd5e1',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '4px 8px',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.2s',
                fontWeight: 600
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#06b6d4';
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#cbd5e1';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {ch.id}류 {ch.name}
            </a>
          ))}
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
            {laws.map((law, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(6, 182, 212, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', margin: 0 }}>{law.title}</h4>
                  <a 
                    href={law.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      textDecoration: 'none',
                      padding: '4px 8px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    전문 보기 <ArrowUpRight size={12} />
                  </a>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                  {law.desc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {law.points.map((pt, pIdx) => (
                    <span 
                      key={pIdx}
                      style={{
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#06b6d4',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid rgba(6, 182, 212, 0.3)'
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
              <Bell size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>최신 관세 고시 및 개정 뉴스</h3>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      paddingBottom: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        background: notice.tag.includes('고시') ? 'rgba(20, 184, 166, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: notice.tag.includes('고시') ? '#2dd4bf' : '#a5b4fc',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {notice.tag}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{notice.date}</span>
                    </div>

                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, lineHeight: 1.35, color: '#ffffff' }}>
                      {notice.title}
                    </h4>
                    
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.45 }}>
                      {notice.summary}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>담당: {notice.agency}</span>
                      <a 
                        href={notice.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.75rem', color: '#06b6d4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
                      >
                        상세보기 <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.8rem' }}>
                  검색어에 매칭되는 최근 고시 뉴스가 없습니다.
                </div>
              )}
            </div>
          </div>

          {/* Section: External Utility Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>실무 추천 바로가기</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {externalLinks.map((link, idx) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.85)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.background = 'rgba(15, 23, 42, 0.65)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{link.name}</span>
                    <ExternalLink size={12} color="#94a3b8" />
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.35 }}>{link.desc}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
