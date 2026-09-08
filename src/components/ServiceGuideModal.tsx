import React, { useState } from 'react';
import { 
  X, Search, Scale, Sparkles, BookOpen, Coins, Building2, ShieldAlert, 
  HelpCircle, Printer, ArrowRight, CheckCircle2, FileText, Send, 
  Layers, Filter, Eye, Download, ShieldCheck, Zap, RefreshCw, MessageSquare
} from 'lucide-react';

interface GuideItem {
  name: string;
  badgeText: string;
  badgeStyle: 'primary' | 'cyan' | 'green' | 'amber' | 'purple' | 'red' | 'dark' | 'yellow';
  icon?: string;
  location: string;
  description: string;
  actionDetail: string;
  tip?: string;
}

interface GuideSection {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  items: GuideItem[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'hs-classifier',
    title: 'AI HS 품목분류 (HsClassifier)',
    subtitle: '품목명과 규격 기반 10단위 HSK 코드 자동 판정 및 관세사 검토의견서 생성',
    icon: Scale,
    color: '#0d9488',
    items: [
      {
        name: 'AI 품목분류 분석 실행',
        badgeText: '⚡ AI 품목분류 분석 실행',
        badgeStyle: 'primary',
        location: '입력창 하단 메인 버튼',
        description: '입력된 품목명, 용도, 재질, 가공방식 데이터를 분석하여 최적의 10단위 HSK 코드와 신뢰도(Confidence Score)를 산출합니다.',
        actionDetail: '클릭 시 관세율표 통칙 제1호~6호, WCO 해설서 DB(9,450건), 관세청 결정례를 실시간 교차 검증하여 상위 추천 세번과 세부 분류 사유를 화면에 출력합니다.',
        tip: '원재료 함량비(%)나 파쇄/가공 형태(예: 1.25mm 체 통과율 등)를 구체적으로 입력할수록 판정 신뢰도가 95% 이상으로 극대화됩니다.'
      },
      {
        name: '관세사 사전검토 의견서 (A4)',
        badgeText: '📄 관세사 사전검토 의견서 (A4)',
        badgeStyle: 'green',
        location: '분류 결과 카드 우측 상단',
        description: '세관 제출 및 화주 보고용 공식 A4 사전의견서(Letterhead 및 붉은 직인 날인)를 모달로 호출합니다.',
        actionDetail: '관세사무소 상호, 담당 관세사 등록번호, 법적 분류 근거 조항(주규정/통칙), WCO 해설서 본문이 포함된 표준 규격 A4 문서를 팝업하며, 즉시 인쇄(Print) 또는 PDF 파일 저장이 가능합니다.',
        tip: '사무소 브랜딩 설정에서 회사 로고와 직인 이미지를 등록해 두면 완벽한 귀사 명의의 공문서로 자동 조판됩니다.'
      },
      {
        name: '통관 파이프라인으로 전송',
        badgeText: '통관 심사 파이프라인 ➡️',
        badgeStyle: 'cyan',
        location: '분류 결과 카드 하단 액션바',
        description: '판정된 HS Code와 품목 규격을 [통관 심사 파이프라인(ClearanceWizard)]으로 즉시 전달합니다.',
        actionDetail: '페이지를 이동하면서 HS 코드, 품명, 재질 정보를 인계하여 FTA 협정세율 계산, 통합공고 수입요건, 필수 서류 검토 단계로 자동 연결됩니다.',
        tip: '분류 후 번거롭게 세번을 복사·붙여넣기할 필요 없이 한 번의 클릭으로 4단계 통관 심사로 직행합니다.'
      },
      {
        name: '유사 결정례 / WCO 해설서 조회',
        badgeText: '🔍 유사 결정례 & WCO 해설서',
        badgeStyle: 'dark',
        location: '분류 결과 하단 탭 메뉴',
        description: '관세청 품목분류원 사전심사 결정례 및 WCO 공식 품목분류 해설서 원문을 확인합니다.',
        actionDetail: '해당 4단위 호/6단위 소호에 해당하는 주규정(Notes) 및 과거 심판 결정례의 [물품설명], [분류이유]를 열람하여 세관 소명 논리를 강화할 수 있습니다.'
      },
      {
        name: 'FTA 특혜세율 및 관세율 비교',
        badgeText: '📊 관세율 실시간 비교',
        badgeStyle: 'amber',
        location: '세번 정보 카드 우측',
        description: '기본세율(A), WTO 양허세율(C), 주요 FTA(한-미, 한-중, 한-EU, RCEP 등) 협정세율을 한눈에 비교합니다.',
        actionDetail: '수출입 상대국에 따라 최저 실효세율을 빠르게 파악할 수 있도록 표 형태로 제공합니다.'
      },
      {
        name: '샘플 데이터 빠른 입력',
        badgeText: '🏷️ 볶은 참깨 파쇄물 / 무선 통신 모듈',
        badgeStyle: 'dark',
        location: '입력 폼 상단 태그 뱃지',
        description: '대표적인 난해 품목(식품 가공품, 전자 부품 등)의 규격 예시를 1초 만에 입력창에 자동 채웁니다.',
        actionDetail: '실제 테스트 및 실무 벤치마킹을 신속하게 진행해볼 수 있습니다.'
      }
    ]
  },
  {
    id: 'clearance-wizard',
    title: '통관 심사 파이프라인 (ClearanceWizard)',
    subtitle: '세번 ➡️ FTA 세율 ➡️ 수입요건 ➡️ 구비서류/타임라인의 4단계 원스톱 심사',
    icon: Sparkles,
    color: '#0284c7',
    items: [
      {
        name: '4단계 심사 탭 (Step 1~4)',
        badgeText: 'Step 1 세번 ➜ Step 2 FTA ➜ Step 3 요건 ➜ Step 4 서류',
        badgeStyle: 'cyan',
        location: '통관 마법사 상단 프로그레스 바',
        description: '수입 통관 진행 시 거쳐야 하는 4단계 법적 심사 절차를 순차적으로 이동하며 점검합니다.',
        actionDetail: '각 탭을 클릭하여 [1단계: 품목 규격] ➡️ [2단계: FTA 협정세율 및 원산지기준] ➡️ [3단계: 세관장확인/소관부처 수입요건] ➡️ [4단계: 필수 행정서류 및 통관 타임라인]을 검토합니다.'
      },
      {
        name: '수입통관 요건 정밀 분석',
        badgeText: '🛡️ 세관장확인 & 통합공고 요건 진단',
        badgeStyle: 'red',
        location: '3단계 [수입요건] 탭 내부',
        description: '식약처 수입식품안전관리특별법, 식물방역법, 전파법, 전기용품및생활용품안전관리법 등 개별 법령 대상 여부를 판별합니다.',
        actionDetail: '해당 HS Code에 부과된 수입 전 의무 검사, 한글표시사항 부착, 형식승인 필요 여부를 체크리스트 형태로 제공합니다.'
      },
      {
        name: '인보이스(송장) 텍스트 자동 파서',
        badgeText: '📋 상업송장(Invoice) 텍스트 자동 분석',
        badgeStyle: 'primary',
        location: '1단계 품목 규격 입력 영역 우측',
        description: '해외 공급사로부터 수신한 인보이스 텍스트를 붙여넣으면 품명, 수량, 단가, 규격을 자동으로 파싱합니다.',
        actionDetail: '비정형 인보이스 텍스트에서 주요 품목 데이터를 추출하여 폼에 자동 입력해 줍니다.'
      },
      {
        name: '통관 심사 종합 리포트 출력',
        badgeText: '📥 통관 사전심사 보고서 다운로드',
        badgeStyle: 'green',
        location: '4단계 [구비서류] 탭 하단',
        description: '4단계 심사 결과(세율, 요건, 구비서류, 예상 관세액)가 총집약된 A4 종합 보고서를 생성합니다.',
        actionDetail: '화주나 통관 실무팀에 공유할 수 있는 완성형 통관 가이드 문서를 PDF/인쇄 형식으로 출력합니다.'
      }
    ]
  },
  {
    id: 'law-news',
    title: '실시간 관세 법령 & 뉴스 (LawNewsPortal)',
    subtitle: '관세법, 시행령, 훈령, 최신 고시 개정안 및 AI 3줄 요약',
    icon: BookOpen,
    color: '#3b82f6',
    items: [
      {
        name: '실시간 법령 및 조문 검색',
        badgeText: '🔍 법령명 / 조문 / 고시 키워드 검색',
        badgeStyle: 'primary',
        location: '법령 포털 상단 검색창',
        description: '관세법, 관세평가 운영에 관한 고시, 품목분류 사무처리에 관한 고시 등 전체 관세 법령 조문을 실시간 검색합니다.',
        actionDetail: '원하는 법령 키워드를 입력하면 관련 조문 본문과 관련 부칙/별표를 즉시 필터링하여 노출합니다.'
      },
      {
        name: 'AI 핵심 3줄 브리핑',
        badgeText: '🤖 AI 핵심 3줄 요약',
        badgeStyle: 'purple',
        location: '각 법령 카드 및 뉴스 본문 상단',
        description: '난해하고 긴 법조문이나 개정 고시를 관세 실무자 관점에서 핵심 3개 문장으로 압축 요약합니다.',
        actionDetail: 'AI가 조문의 핵심 적용 대상, 변경된 절차, 유의 사항을 10초 만에 파악할 수 있도록 브리핑합니다.'
      },
      {
        name: '신·구 조문 대비표',
        badgeText: '⚖️ 개정 전후 비교표',
        badgeStyle: 'amber',
        location: '개정 법령 상세 뷰 내부',
        description: '법령/고시 개정에 따른 종전 규정과 개정 규정의 차이점을 좌우 대비표로 비교합니다.',
        actionDetail: '삭제된 문구와 신설된 요건을 붉은색/초록색 하이라이트로 직관적으로 확인할 수 있습니다.'
      },
      {
        name: '분야별 태그 필터',
        badgeText: '#품목분류 #FTA원산지 #관세평가 #행정처분',
        badgeStyle: 'dark',
        location: '검색창 하단 태그 목록',
        description: '관심 분야별로 최신 세관 행정 지침과 법령 뉴스를 한 번의 클릭으로 모아봅니다.'
      }
    ]
  },
  {
    id: 'valuation',
    title: 'AI 관세평가 & 과세가격 쟁점 (ValuationPrecedents)',
    subtitle: '과세가격 6방법 평가, 가산/공제요소 진단 및 조세심판원 결정례 분석',
    icon: Scale,
    color: '#8b5cf6',
    items: [
      {
        name: '과세가격 평가방법 진단',
        badgeText: '📊 제1방법 ~ 제6방법 평가 진단',
        badgeStyle: 'purple',
        location: '관세평가 분석 시작 버튼',
        description: '수입물품 거래 상황에 따라 관세법 제30조(제1방법) 적용 배제 사유가 있는지 진단하고 대체 평가방법(제2~6방법)을 추천합니다.',
        actionDetail: '특수관계자 간 거래 영향 여부, 처분 또는 사용의 제한 유무, 금액으로 계산할 수 없는 조건 또는 사태 존재 여부를 판별합니다.'
      },
      {
        name: '가산 / 공제 요소 시뮬레이션',
        badgeText: '➕ 가산요소(로열티/운임) & ➖ 공제요소',
        badgeStyle: 'amber',
        location: '과세가격 계산기 탭',
        description: '권리사용료(로열티), 생산지원비, 수수료, 사후귀속이익 등 법정 가산요소 해당 여부를 검토합니다.',
        actionDetail: '인보이스 금액 외에 세관에 추가로 신고해야 하는 과세가격 누락 항목을 사전에 예방합니다.'
      },
      {
        name: '조세심판원 / 대법원 판례 검색',
        badgeText: '🏛️ 유사 불복 결정례 매칭',
        badgeStyle: 'dark',
        location: '평가 결과 하단 판례 탭',
        description: '과세 처분에 대한 조세심판원 결정례, 관세평가분류원 사전심사 사례, 대법원 판결문 DB를 검색합니다.',
        actionDetail: '세관 기업심사(관세조사) 시 소명 논거로 활용할 수 있는 가장 유리한 판례 요지를 매핑해 줍니다.'
      }
    ]
  },
  {
    id: 'cashback',
    title: '비공개 결정례 지식 캐시백 (CashBackManager)',
    subtitle: '기업 비공개 결정례 지식 공유 ➡️ 포인트 적립 및 집단지성 합의 판결',
    icon: Coins,
    color: '#d97706',
    items: [
      {
        name: '결정례 비식별화 업로드',
        badgeText: '📤 비공개 결정례 업로드 (+3,000P~5,000P)',
        badgeStyle: 'amber',
        location: '캐시백 매니저 상단 메인 버튼',
        description: '보유 중인 품목분류 사전심사서나 관세평가 질의회신 문서를 업로드하여 지식 크레딧을 획득합니다.',
        actionDetail: '업로드 시 AI가 화주명, 사업자번호, 고유 상표 등 민감 정보를 자동으로 마스킹(비식별화) 처리하여 안전하게 등록됩니다.'
      },
      {
        name: '집단지성 합의 판결 투표',
        badgeText: '🗳️ 전문가 합의 판결 참여 (+500P)',
        badgeStyle: 'primary',
        location: '합의 판결 대기 품목 목록',
        description: '분류가 애매하거나 신기술이 적용된 신규 품목에 대해 전문 관세사 및 실무자가 의견을 제시하고 투표합니다.',
        actionDetail: '투표자의 전문 자격 및 경력(가중치 1.0~3.0점)이 반영되어 최종 집단지성 표준 분류안이 확정됩니다.'
      },
      {
        name: '포인트 캐시백 현금 환급 신청',
        badgeText: '💰 현금 환급 (Cashback) 신청',
        badgeStyle: 'green',
        location: '내 포인트 지갑 영역',
        description: '활동을 통해 적립된 포인트를 등록된 은행 계좌로 현금 환급받거나 유료 서비스 이용권으로 전환합니다.',
        actionDetail: '환급 신청 시 영업일 기준 1~2일 내에 정산 승인 및 입금 처리가 진행됩니다.'
      }
    ]
  },
  {
    id: 'branding',
    title: '관세사무소 직인 & 화이트라벨 (OfficeBrandingModal)',
    subtitle: '관세법인 로고, 붉은 공인 직인 업로드 및 단독 화이트라벨 설정',
    icon: Building2,
    color: '#16a34a',
    items: [
      {
        name: '회사 / 관세법인 로고 업로드',
        badgeText: '🏛️ 공식 로고 파일 업로드 (PNG, JPG)',
        badgeStyle: 'primary',
        location: '브랜딩 설정 모달 > 로고 섹션',
        description: '화주에게 발행되는 모든 A4 레포트 상단 레터헤드에 귀 법인의 공식 로고를 배치합니다.',
        actionDetail: '투명 배경 PNG 파일을 권장하며, 로고 파일이 없는 경우 기본 엠블럼(저울, 법인, 통상 등)을 선택할 수도 있습니다.'
      },
      {
        name: '🔴 공인 직인 / 인감 이미지 업로드 (신규)',
        badgeText: '🔴 공인 직인 이미지 업로드 / 🔤 텍스트 도장',
        badgeStyle: 'red',
        location: '브랜딩 설정 모달 > 공인 직인 섹션',
        description: '스캔된 실제 붉은 직인/인감 이미지를 업로드하여 보고서 최종 서명란에 실물 도장처럼 선명하게 날인합니다.',
        actionDetail: '[실제 직인 이미지 업로드] 모드와 [텍스트 자동 도장] 모드 중 원하는 방식을 선택할 수 있으며, 실시간 Live Preview로 즉시 확인할 수 있습니다.',
        tip: '도장 스캔본의 배경이 투명한 PNG 이미지로 등록하면 백색 용지에 가장 자연스럽고 품격 있게 날인됩니다.'
      },
      {
        name: '코-브랜딩 vs 단독 화이트라벨 모드',
        badgeText: '💎 코-브랜딩 (추천) / 🏢 단독 화이트라벨',
        badgeStyle: 'cyan',
        location: '브랜딩 설정 모달 > 브랜딩 모드',
        description: '보고서 하단에 CUSWAY AI 9,450건 빅데이터 검증 마크를 함께 표시할지(코-브랜딩), 귀 법인 명의만 100% 노출할지(Enterprise 화이트라벨) 결정합니다.'
      }
    ]
  },
  {
    id: 'common-nav',
    title: '메인 네비게이션 & 공통 편의 기능 (Header & Sidebar)',
    subtitle: '카카오 1:1 상담, 전문가 가중치 인증 및 계정 관리',
    icon: HelpCircle,
    color: '#0891b2',
    items: [
      {
        name: '카카오톡 1:1 실시간 관세 상담',
        badgeText: '💬 카카오 관세상담 LIVE',
        badgeStyle: 'yellow',
        location: '화면 우측 하단 플로팅 버튼 & 사이드바',
        description: '전담 공인관세사와 실시간 1:1 카카오톡 채널로 연결되어 전문적인 통관 상담 및 사건 의뢰를 진행합니다.',
        actionDetail: '클릭 시 공식 카카오 채널 채팅창이 새 창으로 열려 신속하게 실시간 답변을 받을 수 있습니다.'
      },
      {
        name: '전문가 권한 & 가중치 업그레이드',
        badgeText: '⚡ 전문가 업그레이드 (가중치 1.0~3.0점)',
        badgeStyle: 'cyan',
        location: '사이드바 프로필 영역 > 업그레이드 버튼',
        description: '관세사 면허 또는 수출입 실무 경력을 등록하여 지식 합의 판결 시 투표 반영 비중(가중치)을 상향합니다.'
      },
      {
        name: '관세사무소 직인/브랜딩 설정',
        badgeText: '🏛️ 사무소 직인',
        badgeStyle: 'green',
        location: '사이드바 하단 액션 버튼',
        description: '언제든지 상호, 관세사명, 대표 전화번호, 로고 및 직인 이미지를 수정할 수 있는 설정 모달을 엽니다.'
      },
      {
        name: '솔루션 쇼케이스 메인 이동',
        badgeText: '✨ 솔루션 쇼케이스',
        badgeStyle: 'primary',
        location: '좌측 상단 CUSWAY 로고 및 네비게이션 1번 탭',
        description: 'CUSWAY가 제공하는 전체 기능 요약과 실시간 A4 리포트 조판 샘플, 플랜 혜택을 확인하는 메인 화면으로 이동합니다.'
      }
    ]
  }
];

interface ServiceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSectionId?: string;
}

export default function ServiceGuideModal({ isOpen, onClose, defaultSectionId = 'hs-classifier' }: ServiceGuideModalProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(defaultSectionId);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentSection = GUIDE_SECTIONS.find(s => s.id === selectedSectionId) || GUIDE_SECTIONS[0];

  // Search filter across all sections or current section
  const filteredSections = searchQuery.trim() === '' 
    ? [currentSection]
    : GUIDE_SECTIONS.map(section => ({
        ...section,
        items: section.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.badgeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.actionDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.tip && item.tip.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      })).filter(section => section.items.length > 0);

  const renderBadge = (item: GuideItem) => {
    let bg = 'rgba(255, 255, 255, 0.08)';
    let color = '#f8fafc';
    let border = '1px solid #334155';

    if (item.badgeStyle === 'primary') {
      bg = '#0f766e';
      color = '#ffffff';
      border = '1.5px solid #14b8a6';
    } else if (item.badgeStyle === 'cyan') {
      bg = '#0369a1';
      color = '#ffffff';
      border = '1.5px solid #38bdf8';
    } else if (item.badgeStyle === 'green') {
      bg = '#15803d';
      color = '#ffffff';
      border = '1.5px solid #4ade80';
    } else if (item.badgeStyle === 'amber') {
      bg = '#b45309';
      color = '#ffffff';
      border = '1.5px solid #fbbf24';
    } else if (item.badgeStyle === 'purple') {
      bg = '#6d28d9';
      color = '#ffffff';
      border = '1.5px solid #c084fc';
    } else if (item.badgeStyle === 'red') {
      bg = '#b91c1c';
      color = '#ffffff';
      border = '1.5px solid #f87171';
    } else if (item.badgeStyle === 'yellow') {
      bg = '#facc15';
      color = '#000000';
      border = '1.5px solid #eab308';
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: bg,
        color: color,
        border: border,
        padding: '5px 12px',
        borderRadius: '6px',
        fontSize: '0.78rem',
        fontWeight: 850,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
      }}>
        {item.badgeText}
      </span>
    );
  };

  return (
    <div style={{
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
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1.5px solid #334155',
        borderRadius: '18px',
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '92vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
            }}>
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                CUSWAY 서비스 매뉴얼 & 각 페이지별 버튼 용도 가이드
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', fontWeight: 700 }}>
                  실무 활용 가이드북
                </span>
              </h2>
              <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                화면 내 모든 버튼의 명칭, 실행 결과 및 관세 실무 꿀팁을 한눈에 찾아보실 수 있습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="닫기"
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Search Bar & Fast Filter */}
        <div style={{
          padding: '14px 24px',
          background: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexShrink: 0
        }}>
          <div style={{
            position: 'relative',
            flex: 1
          }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금한 버튼명, 기능 또는 키워드를 검색하세요 (예: 의견서, 직인, 파이프라인, WCO, 수입요건, 캐시백...)"
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                background: '#0f172a',
                border: '1.5px solid #334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '0.84rem',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                지우기
              </button>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            총 <b>{GUIDE_SECTIONS.reduce((acc, s) => acc + s.items.length, 0)}개</b>의 버튼 & 기능 수록
          </div>
        </div>

        {/* Content Body: Sidebar Tabs + Right Items List */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', overflow: 'hidden', flex: 1 }}>
          
          {/* Left Category Tabs */}
          <div style={{
            background: '#0b1120',
            borderRight: '1px solid #334155',
            padding: '16px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, padding: '0 8px 6px 8px', letterSpacing: '0.05em' }}>
              페이지별 메뉴 선택
            </div>
            {GUIDE_SECTIONS.map(section => {
              const Icon = section.icon;
              const isSelected = !searchQuery && selectedSectionId === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSectionId(section.id);
                    setSearchQuery('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                    border: isSelected ? `1.5px solid ${section.color}` : '1px solid transparent',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: isSelected ? section.color : '#1e293b',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {section.title.split(' ')[0]} {section.title.split(' ')[1]}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: isSelected ? '#38bdf8' : '#64748b', marginTop: '1px' }}>
                      버튼 {section.items.length}개
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Items View */}
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            background: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {filteredSections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <Search size={36} color="#64748b" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: '6px' }}>검색 결과가 없습니다</h4>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>다른 키워드로 검색하시거나 좌측 메뉴 탭을 선택해 보세요.</p>
              </div>
            ) : (
              filteredSections.map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Section Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      paddingBottom: '10px',
                      borderBottom: `2px solid ${section.color}`
                    }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: section.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc' }}>
                          {section.title}
                        </h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
                          {section.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {section.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '10px',
                            padding: '16px 18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {/* Card Top: Button Badge + Location */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {renderBadge(item)}
                              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f8fafc' }}>
                                {item.name}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '0.7rem',
                              color: '#94a3b8',
                              background: '#0f172a',
                              border: '1px solid #334155',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}>
                              📍 위치: {item.location}
                            </span>
                          </div>

                          {/* Card Body: Description & Action */}
                          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                            <p style={{ margin: '0 0 6px 0', fontWeight: 600 }}>
                              {item.description}
                            </p>
                            <div style={{
                              background: '#0f172a',
                              border: '1px solid #334155',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                              lineHeight: 1.45
                            }}>
                              <strong style={{ color: '#38bdf8' }}>▶ 클릭 시 작동: </strong> {item.actionDetail}
                            </div>
                          </div>

                          {/* Tip Box if any */}
                          {item.tip && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '6px',
                              background: 'rgba(245, 158, 11, 0.1)',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '0.72rem',
                              color: '#fde68a'
                            }}>
                              <Zap size={13} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span><b>실무 TIP:</b> {item.tip}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: '#1e293b',
          borderTop: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#94a3b8' }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>CUSWAY Copilot의 모든 기능은 관세법 및 WCO 국제표준에 맞게 설계되었습니다.</span>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              background: '#0d9488',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            확인 및 가이드 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
