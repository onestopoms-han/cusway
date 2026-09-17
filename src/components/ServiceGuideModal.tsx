import React, { useState } from 'react';
import { 
  X, Search, Scale, Sparkles, BookOpen, Coins, Building2, ShieldAlert, 
  HelpCircle, Printer, ArrowRight, CheckCircle2, FileText, Send, 
  Layers, Filter, Eye, Download, ShieldCheck, Zap, RefreshCw, MessageSquare, Globe
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
    subtitle: '90.0% 검증 정확도 기반 2단계 심층 분류 & 3단계 법리 CoT 소명서 생성',
    icon: Scale,
    color: '#0d9488',
    items: [
      {
        name: 'AI 품목분류 & 3단계 CoT 분석 실행',
        badgeText: '⚡ AI 품목분류 분석 실행',
        badgeStyle: 'primary',
        location: '입력창 하단 메인 버튼',
        description: '입력된 품목명, 용도, 재질, 가공방식을 [1단계: 성상 분리 ➔ 2단계: 4단위 호 선정 ➔ 3단계: 통칙 1~6 순차 적용]의 3단계 Chain-of-Thought로 분석하여 10단위 HSK 코드를 도출합니다.',
        actionDetail: 'WCO 해설서 DB(9,450건) 및 관세평가분류원 실존 판례와 교차 검증하여 10대 법령 모순을 자가 교정하고 4단락 법리 소명서를 출력합니다. (100종 실무 벤치마크 90.0% 정확도 달성)',
        tip: '복합 성분이나 가공 형태(예: 파쇄물, 코팅 여부, 출력 등)를 구체적으로 입력할수록 판정 신뢰도가 95% 이상으로 극대화됩니다.'
      },
      {
        name: '2단계 AI 스마트 질의 칩 (Smart Clarification Chips)',
        badgeText: '💡 스마트 칩 (예: ✨ 알코올 0.5% 미만)',
        badgeStyle: 'cyan',
        location: '1차 분류 후 품명 입력창 하단 대화형 칩 영역',
        description: '배합비율이나 용도 등 판정 필수 변수가 부족한 경우, AI가 핵심 쟁점 칩을 자동으로 제시합니다. 칩을 클릭하면 즉시 해당 조건이 반영되어 10단위 HSK가 재도출됩니다.',
        actionDetail: '클릭 시 1차 도출된 후보 세번 중 해당 스펙에 완벽히 일치하는 단일 세번으로 확정하고 4단락 법리 소명서를 실시간 갱신합니다.',
        tip: '실제 무역 실무에서 COA(시험성적서)나 제조공정도 핵심 스펙이 누락되었을 때 가장 빠르게 정확도를 90.0%로 끌어올리는 핵심 도구입니다.'
      },
      {
        name: '⚖️ 관세율표 일반통칙(GRI) 10대 모순 검증 리포트',
        badgeText: '⚖️ GRI 및 부·류 주석 검증 리포트',
        badgeStyle: 'green',
        location: '분류 결과 카드 내부',
        description: '제29류 단일화합물 요건, 제0403호 발효유 배제 조항, 제30류 의약품 경합 등 관세율표 10대 주규정 모순을 자동 감사한 정합 점수(Consistency Score)를 노출합니다.',
        actionDetail: '모순 감지 시 AI가 스스로 재추론(Self-Correction Retry)을 수행하여 법적 하자 없는 무결점 세번과 소명 논리를 보장합니다.'
      },
      {
        name: '공식 관세사 사전검토 소명의견서 (정식 2페이지 편철)',
        badgeText: '📄 2페이지 소명의견서 (1면 요약 + 2면 상세법리)',
        badgeStyle: 'green',
        location: '분류 결과 카드 우측 상단',
        description: '세관 사전심사 및 화주 의사결정용 공식 2페이지 편철 소명의견서(1면 핵심 요약서 + 2면 심층 법리/경합세번 배제 편철)를 발급합니다.',
        actionDetail: '제1면에는 HSK 확정 세번, 특혜세율, 핵심 분류결론, 통관 요건 및 관세사 공인 직인 날인이 원스톱 요약되며, 제2면에는 WCO 해설서 원문, 2차 경합세번 배제 상세표, 인용 판례 전문, 사후심사 방어 전략이 완벽히 수록됩니다.',
        tip: 'A4 2장으로 완벽히 분리 인쇄되며, 사무소 브랜딩 설정에서 로고와 직인을 등록해 두면 완벽한 귀사 명의의 공문서로 자동 조판됩니다.'
      },
      {
        name: '담당 전문 관세사 1:1 상담 및 정밀 의뢰',
        badgeText: '💬 전문 관세사 상담 LIVE',
        badgeStyle: 'yellow',
        location: '화면 우측 플로팅 버튼 & 법적 유의사항 배너',
        description: '복합 배합원료(COA), 화학구조식(CAS No.), 제조공정도 등 심층 증빙이 요구되는 10%의 난해 품목에 대해 전담 공인 관세사에게 1:1 정밀 검토 및 사전심사(관세법 제86조)를 의뢰합니다.',
        actionDetail: '클릭 시 전문 관세사와의 실시간 상담 채널로 연결되며, AI가 작성한 사전 소명서와 함께 사건이 접수됩니다.'
      },
      {
        name: '1-Click HSK 복사 & UNI-PASS / CLIP 연동',
        badgeText: '📋 HSK 복사 & 🏛️ 유니패스 조회',
        badgeStyle: 'dark',
        location: 'HS Code 결과 표시부 우측',
        description: '확정된 10단위 HSK 코드를 특수문자 없이 클립보드에 원클릭 복사하거나, 관세청 유니패스 및 관세법령정보포털(CLIP) 기분류 조회 페이지로 즉시 이동합니다.',
        actionDetail: '수입신고서 작성 시 오타 없이 세번을 입력할 수 있으며, 관세청 공식 포털에서 실시간 고시세율을 교차 확인할 수 있습니다.'
      },
      {
        name: '통관 심사 파이프라인으로 전송',
        badgeText: '통관 심사 파이프라인 ➡️',
        badgeStyle: 'cyan',
        location: '분류 결과 카드 하단 액션바',
        description: '판정된 HS Code와 품목 규격을 [통관 심사 파이프라인(ClearanceWizard)]으로 즉시 전달합니다.',
        actionDetail: '페이지를 이동하면서 HS 코드, 품명, 재질 정보를 인계하여 FTA 협정세율 계산, 통합공고 수입요건, 필수 서류 검토 단계로 자동 연결됩니다.',
        tip: '분류 후 번거롭게 세번을 복사·붙여넣기할 필요 없이 한 번의 클릭으로 4단계 통관 심사로 직행합니다.'
      },
      {
        name: 'FTA 원산지기준(PSR) 즉시 연계',
        badgeText: '🌐 FTA 원산지기준(PSR)',
        badgeStyle: 'green',
        location: '분류 결과 카드 하단 액션바',
        description: '도출된 HS Code를 클릭 한 번으로 [FTA 원산지기준(PSR) 인텔리전스]로 전달하여 협정별 세번변경기준(CC/CTH/CTSH)과 C/O 요건을 즉시 확인합니다.',
        actionDetail: '품목분류 확정 직후 세번 재입력 없이 한-미, 한-EU, 한-중, RCEP 등 21개 협정세율 및 원산지 판정 요건 검토 화면으로 직행합니다.'
      },
      {
        name: '유사 결정례 / WCO 해설서 조회',
        badgeText: '🔍 유사 결정례 & WCO 해설서',
        badgeStyle: 'dark',
        location: '분류 결과 하단 탭 메뉴',
        description: '관세청 품목분류원 사전심사 결정례 및 WCO 공식 품목분류 해설서 원문을 확인합니다.',
        actionDetail: '해당 4단위 호/6단위 소호에 해당하는 주규정(Notes) 및 과거 심판 결정례의 [물품설명], [분류이유]를 열람하여 세관 소명 논리를 강화할 수 있습니다.'
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
        name: '세번별 5대 FTA 원산지결정기준(PSR) 정밀 심사 바로가기',
        badgeText: '🌐 PSR 기준표 보기 ➡️',
        badgeStyle: 'green',
        location: '2단계 [세율/원산지 확정] 탭 하단 배너',
        description: '현재 수입 품목의 5대 주요 협정별 세번변경기준(CC·CTH·CTSH) 및 C/O 발급 요건 전용 페이지로 즉시 연결합니다.',
        actionDetail: '2단계에서 산출된 최저 FTA 특혜세율을 실제로 적용받기 위한 원산지 충족 조건과 사후검증 대응 팁을 정밀 심사합니다.'
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
    id: 'fta-psr',
    title: 'FTA 원산지기준(PSR) 인텔리전스 (FtaPsrPortal)',
    subtitle: '21개 협정별 세번변경기준(CC·CTH·CTSH) & 부가가치(RVC) 실시간 조회 및 C/O 요건 가이드',
    icon: Globe,
    color: '#059669',
    items: [
      {
        name: '세번별 21개 협정 FTA 원산지결정기준(PSR) 실시간 조회',
        badgeText: '🌐 세번별 FTA 원산지기준(PSR) 인텔리전스',
        badgeStyle: 'green',
        location: 'FTA 원산지기준(PSR) 상단 입력창',
        description: 'BOM(원자재명세서)이나 제조공정도 등 기업 비밀 유출 위험 없이, 10단위 또는 6단위 HS 세번만으로 한-미, 한-EU, 한-중, RCEP 등 21개 FTA 협정별 품목별 원산지결정기준(PSR)을 즉시 도출합니다.',
        actionDetail: '세번 입력 시 CC(2단위 류 변경), CTH(4단위 호 변경), CTSH(6단위 소호 변경), RVC(역내부가가치) 등 해당 세번의 공인 법리 기준을 카드 형태로 일괄 비교합니다.',
        tip: '수입 원재료와 완제품 간의 세번 변경 여부를 즉각 판단하여 C/O 발급 가능성을 신속하게 사전 검토할 수 있습니다.'
      },
      {
        name: '실무 대표 추천 품목 퀵 칩 (Quick Preset Chips)',
        badgeText: '🍹 배 주스 / 📱 무선통신기기 / 💻 노트북 등',
        badgeStyle: 'cyan',
        location: '검색창 하단 퀵 프리셋 영역',
        description: '실무에서 FTA 원산지 판정 문의가 가장 빈번한 대표 품목군(농산가공품, IT통신기기, 전자계측, 자동차부품, 기초화장품 등)의 세번을 원클릭으로 불러옵니다.',
        actionDetail: '클릭 시 해당 품목의 10단위 HSK, 5대 협정별 PSR 판정 요건, 기본세율(A) 대비 FTA 특혜세율(F) 실익이 즉시 갱신됩니다.'
      },
      {
        name: '협정별 특혜세율 & 관세 절감 실익 대조',
        badgeText: '⚡ 최대 0.0% (기본세율 대비 즉시 절감)',
        badgeStyle: 'green',
        location: '우측 관세 실익 요약 스포트라이트 카드',
        description: '기본 관세율(A)과 FTA 특혜세율(F)을 실시간 비교하여, 수입 시 절감 가능한 최대 관세율(%p)과 실익을 한눈에 제시합니다.',
        actionDetail: '원산지증명서(C/O) 구비 시 절감할 수 있는 세액을 직관적으로 확인하여 화주 상담 및 C/O 발급 비용 대비 경제적 실익을 산정합니다.'
      },
      {
        name: '협정별 C/O 발급 형태 & 인증수출자 요건 안내',
        badgeText: '📋 자율발급 / 기관발급 / 인증수출자 필수 안내',
        badgeStyle: 'amber',
        location: '각 협정별 상세 카드 내부',
        description: '협정별 상이한 원산지증명서(C/O) 발급 방식(자율발급, 세관/상의 기관발급, 원산지인증수출자 자율발급)을 정확히 안내합니다.',
        actionDetail: '한-EU FTA(건당 6,000유로 초과 시 인증수출자 번호 기재 필수), 한-아세안/RCEP(기관발급 C/O 원본 제출) 등 세관 통관 보류를 사전 차단하는 필수 행정 요건을 표시합니다.'
      },
      {
        name: '화주용 FTA 원산지 검토의견서 원클릭 복사',
        badgeText: '📋 화주용 의견서 복사',
        badgeStyle: 'cyan',
        location: '상단 우측 액션 버튼',
        description: '조회된 품목의 협정별 PSR 판정 요약, 특혜세율 절감폭, C/O 발급 권고사항을 정형화된 전문 의견서 텍스트로 클립보드에 복사합니다.',
        actionDetail: '화주 안내 메일, 카카오톡 상담 메시지, 수출입 품의서에 즉시 붙여넣어 3초 만에 전문 컨설팅 답변을 작성할 수 있습니다.'
      },
      {
        name: '4단계 원스톱 심사 진행 연동',
        badgeText: '4단계 원스톱 심사 진행 ➡️',
        badgeStyle: 'primary',
        location: '검색창 우측 액션 버튼',
        description: '현재 확인 중인 HS Code를 [통관 심사 파이프라인(ClearanceWizard)]으로 즉시 전달하여 통합공고 수입요건 및 통관 액션 플랜 단계로 이어집니다.'
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
        name: '실시간 최신 관세 소식 라이브 동기화',
        badgeText: '🔄 실시간 최신 소식 동기화 (Live Sync)',
        badgeStyle: 'cyan',
        location: '법령 뉴스 포털 우측 상단',
        description: '관세청 공식 고시/훈령/공고 및 관세 법령 뉴스를 실시간 원격 동기화하여 최신 공고(56건+)를 즉시 갱신합니다.',
        actionDetail: '동기화 버튼 클릭 시 2026 최신 관세청 행정 예고 및 무역협정 지침이 DB에 즉시 업데이트되어 최신 상태를 유지합니다.'
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
        actionDetail: '업로드 시 AI가 화주명, 사업자번호, 고유 상표 등 민감 정보를 자동으로 마스킹(비식별화) 처리하여 안전하게 등록됩니다.',
        tip: '기업 영업비밀(BOM, 제조원가, 제조공정도 등)은 일체 업로드 대상이 아니며, 관세청 사전심사 회시서/심판청구 결정문 공문서에 한해 안전하게 비식별화되어 평가됩니다.'
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
