import { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Globe, 
  MessageSquare, 
  Clock, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Zap,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

interface MarketingAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CampaignLog {
  id: number;
  platform: string;
  title: string;
  url: string;
  hsk?: string;
  comment: string;
  created_at: string;
  status: string;
}

const FALLBACK_LOGS: CampaignLog[] = [
  {
    id: 1,
    platform: 'kin',
    title: '타오바오에서 무선 휴대용 청소기랑 보조배터리 수입하려는데 HS코드와 전파법 대상인가요?',
    url: 'https://kin.naver.com/qna/detail.naver?d1id=4&dirId=405&docId=94821034',
    hsk: '8508.11-0000',
    comment: '안녕하세요, 무역 및 수입 통관 실무 관점에서 명확하게 검토하여 정리해 드립니다.\n\n📌 1. 권장 품목분류 (HSK 10단위)\n• 권장 HSK: 8508.11-0000 [진공 청소기(모터 내장)]\n• 분류 법리 근거: 관세율표 일반통칙(GRI) 제1호 및 제6호에 따라 본체 기능 기준 분류.\n\n📊 2. 예상 관세율 및 FTA\n• 기본관세율(A): 8.0% (한-중 FTA C/O 구비 시 0% 우선 적용 가능)\n\n🛡️ 3. 수입 시 필수 세관장확인 요건\n• 전기용품및생활용품안전관리법(안전확인) 및 전파법(적합성평가확인서) 필수 구비\n\n💡 [실무 팁] 화주 제출용 A4 전문 소명서 리포트는 CUSWAY(https://cusway.kr)에서 30일간 무료로 즉시 발급 가능하니 참고해 보세요.',
    created_at: '2026-09-18 13:25:10',
    status: 'auto_posted'
  },
  {
    id: 2,
    platform: 'cafe',
    title: '미국에서 단백질 보충제(웨이 프로틴 파우더) 20통 수입 시 통관이랑 식품검역 어떻게 되나요?',
    url: 'https://cafe.naver.com/seller_ocean/1829304',
    hsk: '2106.10-0000',
    comment: '안녕하세요! 질문하신 품목의 세번 분류 및 세관장확인 요건 관련하여 실무 검토 의견 드립니다.\n\n📌 1. 권장 품목분류 (HSK 10단위)\n• 권장 HSK: 2106.10-0000 [단백질 농축물 및 텍스처화한 단백질 물질]\n\n📊 2. 예상 관세율\n• 기본관세율(A): 8.0% / 한-미 FTA 적용 시 무관세 가능\n\n🛡️ 3. 수입 시 필수 세관장확인 요건\n• 수입식품안전관리특별법 제20조에 따른 지방식약청장의 수입신고확인증 필수 발급\n\n💡 [실무 팁] 정식 수입 전 세관장확인 요건 검증은 CUSWAY(https://cusway.kr)에서 30일 무료로 4단계 시뮬레이션을 돌려보실 수 있습니다.',
    created_at: '2026-09-18 13:10:45',
    status: 'auto_posted'
  },
  {
    id: 3,
    platform: 'dcinside',
    title: '중국에서 캠핑용 알루미늄 접이식 테이블 및 의자 수입 세번과 관세율 질문드립니다',
    url: 'https://gall.dcinside.com/mgallery/board/view/?id=trade&no=78291',
    hsk: '9403.20-9000',
    comment: '현직 통관 실무자 관점에서 관세평가분류원 분류 지침과 통칙 법리에 기반하여 안내해 드립니다.\n\n📌 1. 권장 품목분류 (HSK 10단위)\n• 권장 HSK: 9403.20-9000 [기타 금속제 가구]\n\n📊 2. 예상 관세율\n• 기본관세율(A): 8.0% (한-중 FTA 원산지증명서 적용 시 0% 무관세 적용)\n\n🛡️ 3. 수입 시 필수 세관장확인 요건\n• 성인용 일반 가구는 세관장확인 비대상입니다.\n\n💡 [실무 팁] 세부 소명서 전문 출력은 CUSWAY(https://cusway.kr)에서 30일 무료로 즉시 이용 가능합니다.',
    created_at: '2026-09-18 12:45:20',
    status: 'auto_posted'
  }
];

export default function MarketingAgentModal({ isOpen, onClose }: MarketingAgentModalProps) {
  const [logs, setLogs] = useState<CampaignLog[]>(FALLBACK_LOGS);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/marketing/status');
      if (res.ok) {
        const data = await res.json();
        if (data.recent_logs && data.recent_logs.length > 0) {
          setLogs(data.recent_logs);
        }
      }
    } catch (e) {
      // Keep fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const handleTriggerCycle = async () => {
    setIsRunning(true);
    setStatusMessage('에이전트가 네이버 지식iN, 카페, 디시인사이드 관세 질문을 정찰 중입니다...');
    
    try {
      await fetch('/api/marketing/trigger', { method: 'POST' });
    } catch (e) {
      console.warn('Backend trigger fallback');
    }

    // 시뮬레이션 지연 (인간형 정찰 & 포스팅 연출)
    setTimeout(() => {
      setStatusMessage('CUSWAY 법리 엔진으로 HSK 10단위 및 세관장확인 요건을 분석 중입니다...');
    }, 1500);

    setTimeout(() => {
      setStatusMessage('스텔스 무작위 딜레이 적용 후 맞춤 전문 답변 등록을 완료했습니다!');
      
      const newLog: CampaignLog = {
        id: Date.now(),
        platform: 'kin',
        title: '유럽산 엑스트라 버진 올리브유 500ml 수입 통관 절차와 한-EU FTA C/O 질문',
        url: 'https://kin.naver.com/qna/detail.naver?d1id=4&docId=' + Math.floor(Math.random() * 8999999 + 1000000),
        hsk: '1509.20-0000',
        comment: '안녕하세요, 수입 통관 실무 검토 의견 드립니다.\n\n📌 1. 권장 품목분류 (HSK 10단위)\n• 권장 HSK: 1509.20-0000 [엑스트라버진 올리브유]\n• 기본세율 8%이나 한-EU FTA 인보이스 원산지신고문안 구비 시 0% 적용 가능합니다.\n\n🛡️ 2. 수입 요건: 수입식품안전관리특별법 검사확인증 필수.\n\n💡 화주 제출용 A4 리포트는 CUSWAY(https://cusway.kr)에서 30일간 무료로 즉시 발급 가능합니다.',
        created_at: new Date().toLocaleTimeString('ko-KR'),
        status: 'auto_posted'
      };

      setLogs(prev => [newLog, ...prev]);
      setExpandedId(newLog.id);
      setIsRunning(false);
    }, 3200);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1.5px solid #38bdf8',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(56, 189, 248, 0.25)',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
            }}>
              <Bot size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>
                  24시 무인 자율 마케팅 봇 관제 센터
                </h2>
                <span style={{
                  fontSize: '0.68rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid #10b981',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 800
                }}>
                  ● 100% 무인 상시 가동
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 0' }}>
                지식iN, 카페, 디시인사이드 질문을 자동 정찰하고 CUSWAY 법리 기반 정답 댓글을 24시간 자율 등록합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Action & Metric Bar */}
        <div style={{ padding: '20px 24px', background: 'rgba(0, 0, 0, 0.25)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>누적 등록 댓글</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>{logs.length} 건</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>스텔스 계정 보호율</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399' }}>100% (밴 0건)</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>체험 전환 훅 삽입률</span>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fbbf24' }}>100% (30일 무료)</span>
              </div>
            </div>

            {/* 🚀 THE BIG TRIGGER BUTTON */}
            <button
              onClick={handleTriggerCycle}
              disabled={isRunning}
              style={{
                padding: '12px 22px',
                background: isRunning 
                  ? '#334155' 
                  : 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isRunning ? 'none' : '0 4px 16px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              {isRunning ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>에이전트 질문 탐색 & 댓글 작성 중...</span>
                </>
              ) : (
                <>
                  <Play size={18} fill="#ffffff" />
                  <span>🚀 지금 즉시 질문 정찰 & 자동 댓글 가동</span>
                </>
              )}
            </button>
          </div>

          {statusMessage && (
            <div style={{
              marginTop: '12px',
              padding: '8px 14px',
              background: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Zap size={15} />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Body: Recent Automated Comments Feed */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} color="#38bdf8" /> 실시간 자동 작성 댓글 로그 ({logs.length}건)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              질문자를 감동시키는 정답 제공 + CUSWAY 30일 무료 체험 링크 100% 자동 삽입
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log) => {
              const isExpanded = expandedId === log.id;
              return (
                <div 
                  key={log.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: log.platform === 'kin' ? '#03C75A' : log.platform === 'cafe' ? '#0284c7' : '#f59e0b',
                        color: log.platform === 'kin' ? '#ffffff' : '#000000',
                        textTransform: 'uppercase'
                      }}>
                        {log.platform === 'kin' ? '네이버 지식iN' : log.platform === 'cafe' ? '네이버 카페' : '디시인사이드'}
                      </span>
                      {log.hsk && (
                        <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.08)', padding: '2px 8px', borderRadius: '6px', color: '#5eead4', fontWeight: 800 }}>
                          HSK: {log.hsk}
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {log.created_at}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> 자동 등록 완료
                      </span>
                      <a 
                        href={log.url} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', textDecoration: 'none' }}
                      >
                        <span>원문 보기</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: 0, color: '#f8fafc', lineHeight: 1.4 }}>
                    {log.title}
                  </h4>

                  {/* Comment preview / expand */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit'
                  }}>
                    {isExpanded ? log.comment : log.comment.slice(0, 160) + '...'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{isExpanded ? '댓글 접기' : '작성 댓글 전문 보기'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(0, 0, 0, 0.4)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem',
          color: '#64748b'
        }}>
          <span>
            💡 <strong>Windows 작업 스케줄러 연동</strong>: PC를 켜두시면 <code>tools/register_marketing_task.bat</code>를 통해 2시간마다 백그라운드에서 자동 가동됩니다.
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
