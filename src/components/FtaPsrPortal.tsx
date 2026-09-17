import { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight, 
  HelpCircle, 
  Info
} from 'lucide-react';

interface FtaPsrRule {
  agreementCode: string;
  agreementName: string;
  country: string;
  flag: string;
  psrCode: 'CC' | 'CTH' | 'CTSH' | 'RVC' | 'CTH or RVC' | 'CTSH or RVC' | 'SP' | 'WO';
  psrDescription: string;
  baseRate: number;
  ftaRate: number;
  coType: '자율발급' | '기관발급(세관/상의)' | '인증수출자 자율발급';
  isApprovedExporterRequired: boolean;
  deMinimis: string;
  verificationTip: string;
}

interface ItemPsrData {
  hsCode: string;
  itemName: string;
  categoryKo: string;
  defaultBaseRate: number;
  ftaRules: FtaPsrRule[];
  practicalTips: string[];
}

// 실무 대표 세번별 FTA 원산지결정기준(PSR) 마스터 프리셋 데이터
const PSR_MASTER_PRESETS: Record<string, ItemPsrData> = {
  '2009.89-1090': {
    hsCode: '2009.89-1090',
    itemName: '배 주스 (과즙 100% 농축/희석용 원료)',
    categoryKo: '제20류 채소·과실의 조제품',
    defaultBaseRate: 50.0,
    practicalTips: [
      '배 주스는 농산물 가공품 특성상 대부분의 FTA에서 엄격한 CC(2단위 류 변경) 또는 CTH(4단위 호 변경)가 적용됩니다.',
      '수입 농산물 원료(제0808호 생배)를 사용하여 국내에서 착즙·농축한 경우, 원재료(제08류)와 완제품(제20류) 간 CC가 충족되어 한국산 인정이 용이합니다.',
      '설탕이나 구연산 등 타 원재료가 첨가된 경우 협정별 미소기준(De Minimis) 8~10% 이내인지 점검해야 합니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CC',
        psrDescription: '다른 류에 해당하는 재료로부터 생산된 것 (2단위 세번변경)',
        baseRate: 50.0,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '비원산지 재료 가격의 10% 이하',
        verificationTip: '수출자/생산자가 작성한 원산지증명서(자율서식) 구비 시 0% 즉시 적용'
      },
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 체약상대국 역내부가가치 50% 이상',
        baseRate: 50.0,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '비원산지 재료 가격의 10% 이하',
        verificationTip: '건당 6,000유로 초과 수입 시 원산지인증수출자 번호가 인보이스에 반드시 기재되어야 함'
      },
      {
        agreementCode: 'kor_cn',
        agreementName: '한-중 FTA',
        country: '중국',
        flag: '🇨🇳',
        psrCode: 'CTH',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 (4단위 세번변경)',
        baseRate: 50.0,
        ftaRate: 15.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 8% 이하',
        verificationTip: '중국 해관총서(또는 CCPIT)가 정식 발행한 전자원산지증명서(EODES 연동) 필수'
      },
      {
        agreementCode: 'rcep',
        agreementName: 'RCEP (역내포괄적경제동반자협정)',
        country: 'RCEP 회원국',
        flag: '🌏',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치(RVC) 40% 이상',
        baseRate: 50.0,
        ftaRate: 12.5,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 10% 이하',
        verificationTip: '15개 회원국 간 누적기준(Cumulation) 활용 가능 여부 검토 권장'
      },
      {
        agreementCode: 'kor_asean',
        agreementName: '한-아세안 FTA',
        country: '베트남/인니 등',
        flag: '🇻🇳',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치(RVC) 40% 이상',
        baseRate: 50.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 10% 이하',
        verificationTip: 'Form AK 정식 기관 발급본 구비 필수'
      },
      {
        agreementCode: 'kor_vn',
        agreementName: '한-베트남 FTA',
        country: '베트남',
        flag: '🇻🇳',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 50.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 10% 이하',
        verificationTip: '한-아세안과 한-베트남 협정 중 유리한 세율 및 PSR 선택 적용 가능'
      }
    ]
  },

  '8517.62-6000': {
    hsCode: '8517.62-6000',
    itemName: '무선통신기기 (Wi-Fi/블루투스 송수신 라우터·게이트웨이)',
    categoryKo: '제85류 전기기기와 그 부분품',
    defaultBaseRate: 8.0,
    practicalTips: [
      'IT 전자제품은 WTO 정보기술협정(ITA)에 의해 기본적으로 무세(0%) 대상일 수 있으나, FTA 특혜를 통해 추가 혜택을 확보할 수 있습니다.',
      '반도체 IC, PCB 등 외산 부품을 수입하여 조립하더라도 표면실장기술(SMT) 등 주요 제조공정이 국내에서 이루어지면 CTSH 또는 RVC 충족이 용이합니다.',
      '완제품 소호(8517.62)와 부품(8517.70) 간 세번변경이 일어나므로 CTH/CTSH 기준 충족 판정이 매우 수월한 품목군입니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치(RVC) 35% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '비원산지 재료 가격의 10% 이하',
        verificationTip: 'CTSH 기준 또는 공제법(Build-down) 기준 중 입증하기 쉬운 기준 택일'
      },
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 사용된 비원산지 재료의 가격이 공장도공급가격의 50% 이하',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '비원산지 재료 가격의 10% 이하',
        verificationTip: '수출자 송품장에 인증수출자 원산지 신고문안 작성'
      },
      {
        agreementCode: 'kor_cn',
        agreementName: '한-중 FTA',
        country: '중국',
        flag: '🇨🇳',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 10% 이하',
        verificationTip: '기관발급 C/O 신청 시 6단위 세번변경 여부 검증'
      },
      {
        agreementCode: 'rcep',
        agreementName: 'RCEP',
        country: '일본/호주 등',
        flag: '🌏',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: 'FOB 가격의 10% 이하',
        verificationTip: '한-일 간 최초 발효 FTA로 일본산 IT 부품 조달 시 원산지 누적 활용 가능'
      }
    ]
  },

  '8471.30-0000': {
    hsCode: '8471.30-0000',
    itemName: '휴대용 자동자료처리기계 (노트북·태블릿 PC)',
    categoryKo: '제84류 원자로·보일러와 기계류',
    defaultBaseRate: 0.0,
    practicalTips: [
      '노트북 및 컴퓨터는 WTO ITA(정보기술협정)에 의해 기본관세가 0%이므로 수입 시 관세 절감 실익은 동일하지만, 수출 시 상대국 현지 관세(미체결국 5~10%) 절감에 필수적입니다.',
      '대부분의 FTA 협정에서 6단위 소호변경(CTSH) 또는 부가가치 40~45% 기준을 채택하고 있습니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 35% 이상',
        baseRate: 0.0,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '수출입 모두 무세이나 원산지 표시 규정에 유의'
      },
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTH or RVC',
        psrDescription: '비원산지 재료 가격이 공장도가격의 50% 이하',
        baseRate: 0.0,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '10%',
        verificationTip: '인증수출자 번호 표기 확인'
      },
      {
        agreementCode: 'rcep',
        agreementName: 'RCEP',
        country: 'RCEP 역내국',
        flag: '🌏',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 0.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '기관 C/O 발급 대행 진행'
      }
    ]
  },

  '8708.29-0000': {
    hsCode: '8708.29-0000',
    itemName: '자동차 차체용 부분품 및 부속품 (패널, 브래킷 등)',
    categoryKo: '제87류 철도용 외의 차량과 그 부분품',
    defaultBaseRate: 8.0,
    practicalTips: [
      '자동차 부품은 원산지 사후검증(Verification)이 가장 빈번한 대표적 고위험 품목군입니다.',
      '한-미 FTA의 경우 엄격한 순원가법(Net Cost Method) 50% 또는 공제법 60% 등 높은 부가가치 비율이 요구되므로 원산지 계산을 정밀 검토해야 합니다.',
      '원자재(철판·코일 등 제72류)를 가공하여 성형 프레스한 경우 CTH(4단위 변경) 요건 충족이 유리합니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 순원가법(NC) 50% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '미국 관세국경보호청(CBP)의 사후검증 질문서(Form 28) 대비 소명파일 사전 구축 요망'
      },
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTH or RVC',
        psrDescription: '비원산지 재료 가격이 공장도가격의 45% 이하',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '10%',
        verificationTip: '품목별 원산지인증수출자 자격 필수 (미인증 시 협정세율 배제)'
      },
      {
        agreementCode: 'kor_cn',
        agreementName: '한-중 FTA',
        country: '중국',
        flag: '🇨🇳',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '중국 세관 C/O 원본 제출 및 직접운송 확인'
      },
      {
        agreementCode: 'rcep',
        agreementName: 'RCEP',
        country: '일본/아세안 등',
        flag: '🌏',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '일본산 핵심 부품 포함 시 RCEP 역내산 누적 인정'
      }
    ]
  },

  '3304.99-1000': {
    hsCode: '3304.99-1000',
    itemName: '기초화장품용 제품류 (스킨, 로션, 수분크림, 세럼 등)',
    categoryKo: '제33류 정유와 레지노이드, 조제향료와 화장품',
    defaultBaseRate: 6.5,
    practicalTips: [
      '화장품은 화학 조제물 특성상 CTH(4단위 세번변경) 또는 화학반응공정(SP) 인정 여부가 쟁점이 됩니다.',
      '글리세린, 정제수, 오일 등 원재료(제29류, 제15류 등)를 배합하여 제3304호로 세번변경이 일어나는 경우가 많아 CTH 충족이 수월합니다.',
      '화장품법에 따른 표준통관예정보고(대한화장품협회) 필증과 원산지증명서(C/O)의 품명 규격이 100% 일치해야 합니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 35% 이상',
        baseRate: 6.5,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '자율발급 서식 작성 및 완제품 세번 3304 매핑 확인'
      },
      {
        agreementCode: 'kor_cn',
        agreementName: '한-중 FTA',
        country: '중국',
        flag: '🇨🇳',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 6.5,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '한국산 K-Beauty 수출 시 중국 세관 특혜관세(0%) 적용 핵심 품목'
      },
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 비원산지 재료 비율 50% 이하',
        baseRate: 6.5,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '10%',
        verificationTip: '프랑스, 이탈리아산 수입 시 6,000유로 초과 건 인증수출자 문구 필수'
      },
      {
        agreementCode: 'kor_asean',
        agreementName: '한-아세안 FTA',
        country: '베트남/태국 등',
        flag: '🇻🇳',
        psrCode: 'CTH or RVC',
        psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
        baseRate: 6.5,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '동남아 수출 시 Form AK 구비 필수'
      }
    ]
  },

  '0901.21-0000': {
    hsCode: '0901.21-0000',
    itemName: '볶은 커피 (카페인을 제거하지 아니한 것 - 원두)',
    categoryKo: '제09류 커피·차·마테와 향신료',
    defaultBaseRate: 8.0,
    practicalTips: [
      '원두는 생두(제0901.11호)를 로스팅(볶음)하여 완제품 제0901.21호로 가공되는 구조입니다.',
      '수입 생두를 수입국에서 단순히 로스팅만 한 경우, 4단위 호(Heading)는 0901로 동일하므로 CTH(4단위 세번변경)는 불충족되고 CTSH(6단위 소호변경) 또는 특정가공공정(SP) 기준 충족 여부를 확인해야 합니다.',
      '한-EU 및 한-미 FTA에서는 로스팅 공정 인정 여부에 따라 특혜세율 0% 적용 가능 여부가 극명히 갈립니다.'
    ],
    ftaRules: [
      {
        agreementCode: 'kor_eu',
        agreementName: '한-EU FTA',
        country: '유럽연합',
        flag: '🇪🇺',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 (0901.11 생두 ➡️ 0901.21 원두)',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '인증수출자 자율발급',
        isApprovedExporterRequired: true,
        deMinimis: '10%',
        verificationTip: '이탈리아/독일 로스팅 원두는 6단위 소호변경 인정으로 0% 적용'
      },
      {
        agreementCode: 'kor_us',
        agreementName: '한-미 FTA',
        country: '미국',
        flag: '🇺🇸',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 35% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '자율발급',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '미국 내 로스팅 시설에서 가공된 원두 증빙'
      },
      {
        agreementCode: 'kor_vn',
        agreementName: '한-베트남 FTA',
        country: '베트남',
        flag: '🇻🇳',
        psrCode: 'CTSH or RVC',
        psrDescription: '다른 소호에 해당하는 재료로부터 생산된 것 또는 부가가치 40% 이상',
        baseRate: 8.0,
        ftaRate: 0.0,
        coType: '기관발급(세관/상의)',
        isApprovedExporterRequired: false,
        deMinimis: '10%',
        verificationTip: '베트남산 로부스타 원두 특혜 적용'
      }
    ]
  }
};

interface FtaPsrPortalProps {
  initialHsCode?: string;
  onNavigateToWizard?: (hsCode: string) => void;
  onOpenGuide?: (sectionId?: string) => void;
  currentUser?: any;
}

export default function FtaPsrPortal({ initialHsCode, onNavigateToWizard, onOpenGuide, currentUser }: FtaPsrPortalProps) {
  const [searchCode, setSearchCode] = useState(initialHsCode || '2009.89-1090');
  const [selectedAgreement, setSelectedAgreement] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  // 세번 표준 포맷팅 (예: 2009891090 -> 2009.89-1090)
  const formatHs = (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    if (raw.length <= 4) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 4)}.${raw.slice(4)}`;
    return `${raw.slice(0, 4)}.${raw.slice(4, 6)}-${raw.slice(6, 10)}`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCode(e.target.value);
  };

  // 현재 세번에 해당하는 PSR 데이터 매칭
  const currentData = useMemo<ItemPsrData>(() => {
    const clean = searchCode.replace(/[^0-9]/g, '');
    
    // 1. 완벽 매칭
    for (const [key, val] of Object.entries(PSR_MASTER_PRESETS)) {
      if (key.replace(/[^0-9]/g, '') === clean) {
        return val;
      }
    }

    // 2. 6단위 앞부분 매칭
    for (const [key, val] of Object.entries(PSR_MASTER_PRESETS)) {
      if (clean.length >= 6 && key.replace(/[^0-9]/g, '').startsWith(clean.slice(0, 6))) {
        return {
          ...val,
          hsCode: formatHs(clean),
          itemName: `${val.itemName} (세번 확장 연동)`
        };
      }
    }

    // 3. 4단위 호 매칭
    for (const [key, val] of Object.entries(PSR_MASTER_PRESETS)) {
      if (clean.length >= 4 && key.replace(/[^0-9]/g, '').startsWith(clean.slice(0, 4))) {
        return {
          ...val,
          hsCode: formatHs(clean),
          itemName: `${val.itemName} (유사 호 품목군 기준)`
        };
      }
    }

    // 4. 기본 표준 프리셋 (기계/공산품 표준 통칙)
    return {
      hsCode: formatHs(clean) || '8517.62-6000',
      itemName: '조회 품목 (표준 공산품·일반가공품 PSR 산정)',
      categoryKo: '관세율표 표준 품목군',
      defaultBaseRate: 8.0,
      practicalTips: [
        '해당 세번은 대한민국 주요 FTA 표준 품목별 원산지결정기준(PSR)에 의거 CTH(4단위 세번변경) 또는 부가가치기준(RVC 40%)이 적용됩니다.',
        '원재료의 세번과 완제품 세번 간에 호(Heading) 변경이 일어나는지 확인하십시오.',
        '수출입 시 협정별 원산지증명서(C/O) 발급 형태(기관발급 vs 자율발급)를 필히 확인하시기 바랍니다.'
      ],
      ftaRules: [
        {
          agreementCode: 'kor_us',
          agreementName: '한-미 FTA',
          country: '미국',
          flag: '🇺🇸',
          psrCode: 'CTH or RVC',
          psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 35% 이상',
          baseRate: 8.0,
          ftaRate: 0.0,
          coType: '자율발급',
          isApprovedExporterRequired: false,
          deMinimis: '10%',
          verificationTip: '수출자/생산자 자율작성 원산지증명서 구비'
        },
        {
          agreementCode: 'kor_eu',
          agreementName: '한-EU FTA',
          country: '유럽연합',
          flag: '🇪🇺',
          psrCode: 'CTH or RVC',
          psrDescription: '비원산지 재료 가격이 공장도가격의 50% 이하 또는 4단위 세번변경',
          baseRate: 8.0,
          ftaRate: 0.0,
          coType: '인증수출자 자율발급',
          isApprovedExporterRequired: true,
          deMinimis: '10%',
          verificationTip: '6,000유로 초과 시 인증수출자 번호 필수'
        },
        {
          agreementCode: 'kor_cn',
          agreementName: '한-중 FTA',
          country: '중국',
          flag: '🇨🇳',
          psrCode: 'CTH or RVC',
          psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
          baseRate: 8.0,
          ftaRate: 0.0,
          coType: '기관발급(세관/상의)',
          isApprovedExporterRequired: false,
          deMinimis: '10%',
          verificationTip: '중국 세관/CCPIT 정식 C/O 전자 발급본'
        },
        {
          agreementCode: 'rcep',
          agreementName: 'RCEP',
          country: '15개 회원국',
          flag: '🌏',
          psrCode: 'CTH or RVC',
          psrDescription: '다른 호에 해당하는 재료로부터 생산된 것 또는 역내부가가치 40% 이상',
          baseRate: 8.0,
          ftaRate: 0.0,
          coType: '기관발급(세관/상의)',
          isApprovedExporterRequired: false,
          deMinimis: '10%',
          verificationTip: 'RCEP 역내 생산 원재료 누적 적용 가능'
        }
      ]
    };
  }, [searchCode]);

  // 필터링된 FTA 룰
  const filteredRules = useMemo(() => {
    if (selectedAgreement === 'all') return currentData.ftaRules;
    return currentData.ftaRules.filter(r => r.agreementCode === selectedAgreement);
  }, [currentData, selectedAgreement]);

  // 화주용 검토의견서 텍스트 복사
  const handleCopyMemo = () => {
    const lines = [
      `[CUSWAY] 품목별 FTA 원산지결정기준(PSR) 및 특혜세율 검토의견서`,
      `--------------------------------------------------`,
      `■ 대상 물품: ${currentData.itemName}`,
      `■ 분류 세번(HSK): ${currentData.hsCode} (${currentData.categoryKo})`,
      `■ 기본 관세율(A): ${currentData.defaultBaseRate}%`,
      ``,
      `■ 주요 체약국별 FTA 원산지결정기준(PSR) & 특혜세율:`,
      ...currentData.ftaRules.map(r => 
        `• [${r.agreementName}] ${r.flag} ${r.country}\n` +
        `  - 원산지결정기준(PSR): ${r.psrCode} (${r.psrDescription})\n` +
        `  - 적용 특혜세율: ${r.ftaRate}% (기본세율 대비 ${r.baseRate - r.ftaRate}%p 관세 절감)\n` +
        `  - C/O 발급 형태: ${r.coType} ${r.isApprovedExporterRequired ? '(인증수출자 필수)' : ''}\n` +
        `  - 실무 수칙: ${r.verificationTip}`
      ),
      ``,
      `■ 관세사 실무 검토 가이드:`,
      ...currentData.practicalTips.map(t => `• ${t}`),
      `--------------------------------------------------`,
      `* 본 자료는 관세청 2026년 공식 FTA 원산지 협정 규정에 의거 작성된 사전 검토의견서입니다.`
    ];

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 1. Header Banner */}
      <div style={{
        padding: '28px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 50%, #eff6ff 100%)',
        border: '2px solid #059669',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(5, 150, 105, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.8rem' }}>🌐</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 950, letterSpacing: '-0.02em', color: '#0f172a' }}>
                세번별 FTA 원산지결정기준(PSR) 인텔리전스
              </h2>
              <span style={{
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                color: '#ffffff',
                fontSize: '0.74rem',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 900,
                letterSpacing: '0.2px'
              }}>
                실무 특혜관세 & C/O 요건 가이드
              </span>
            </div>
            <p style={{ color: '#334155', fontSize: '0.96rem', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
              기업 영업기밀(BOM) 유출 걱정 없이, <strong style={{ color: '#065f46' }}>HS 세번만으로 21개 FTA 협정별 원산지결정기준(CC/CTH/CTSH/RVC)과 특혜세율 실익</strong>을 실시간으로 확인하세요.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCopyMemo}
              style={{
                padding: '11px 20px',
                background: copied ? '#dcfce7' : '#0284c7',
                border: copied ? '2px solid #16a34a' : '2px solid #0284c7',
                borderRadius: '10px',
                color: copied ? '#15803d' : '#ffffff',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? '검토의견서 복사 완료!' : '화주용 의견서 복사'}</span>
            </button>
            <button
              onClick={() => window.print()}
              style={{
                padding: '11px 18px',
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                borderRadius: '10px',
                color: '#0f172a',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
              }}
            >
              <Printer size={16} />
              <span>A4 인쇄</span>
            </button>
            {onOpenGuide && (
              <button
                onClick={() => onOpenGuide('fta-psr')}
                style={{
                  padding: '11px 16px',
                  background: '#eff6ff',
                  border: '2px solid #3b82f6',
                  borderRadius: '10px',
                  color: '#1d4ed8',
                  fontWeight: 900,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(59, 130, 246, 0.1)'
                }}
              >
                <HelpCircle size={16} color="#2563eb" />
                <span>기능 가이드</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Search & Preset Bar */}
      <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#0891b2' }} />
              <input 
                type="text"
                value={searchCode}
                onChange={handleSearchChange}
                placeholder="조회할 HS Code (예: 2009.89-1090, 8517.62, 8471.30, 8708.29 등)"
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 48px',
                  background: '#ffffff',
                  border: '2px solid #0891b2',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(8, 145, 178, 0.08)'
                }}
              />
            </div>
            
            {onNavigateToWizard && (
              <button
                onClick={() => onNavigateToWizard(currentData.hsCode)}
                style={{
                  padding: '14px 22px',
                  background: 'linear-gradient(135deg, #0f766e 0%, #0284c7 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(15, 118, 110, 0.25)'
                }}
              >
                <span>4단계 원스톱 심사 진행</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>

          {/* Preset Quick Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 800 }}>
              실무 대표 추천 품목:
            </span>
            {[
              { code: '2009.89-1090', label: '🍹 배 주스' },
              { code: '8517.62-6000', label: '📱 무선통신기기' },
              { code: '8471.30-0000', label: '💻 노트북' },
              { code: '8708.29-0000', label: '🚗 자동차 부품' },
              { code: '3304.99-1000', label: '💄 기초화장품' },
              { code: '0901.21-0000', label: '☕ 로스팅 원두' }
            ].map(p => {
              const isSelected = searchCode.replace(/[^0-9]/g, '') === p.code.replace(/[^0-9]/g, '');
              return (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setSearchCode(p.code)}
                  style={{
                    padding: '6px 12px',
                    background: isSelected ? '#ecfdf5' : '#f8fafc',
                    border: isSelected ? '2px solid #059669' : '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    color: isSelected ? '#065f46' : '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 900 : 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p.label} <span style={{ color: isSelected ? '#047857' : '#64748b' }}>({p.code.slice(0, 7)})</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Product Overview & Key Benefit Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '20px'
      }}>
        {/* Left: Item Summary */}
        <div style={{ padding: '24px', background: '#ffffff', borderRadius: '16px', border: '2px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.78rem', padding: '3px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontWeight: 900 }}>
              {currentData.categoryKo}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
              HSK 10단위: <strong style={{ color: '#0f172a' }}>{currentData.hsCode}</strong>
            </span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 950, color: '#0f172a', margin: '0 0 16px 0' }}>
            {currentData.itemName}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentData.practicalTips.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.55, background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontWeight: 600 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Tariff Advantage Spotlight */}
        <div style={{ 
          padding: '24px', 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '2px solid #10b981',
          boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.86rem', color: '#065f46', fontWeight: 800 }}>
            관세 실익 요약 (FTA 특혜 적용 시)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px' }}>
            <span style={{ fontSize: '2.6rem', fontWeight: 950, color: '#047857', letterSpacing: '-0.02em' }}>
              최대 0.0%
            </span>
            <span style={{ fontSize: '0.95rem', color: '#dc2626', textDecoration: 'line-through', fontWeight: 800 }}>
              기본 {currentData.defaultBaseRate}%
            </span>
          </div>
          <div style={{ fontSize: '0.92rem', color: '#0369a1', fontWeight: 800, marginTop: '8px' }}>
            ⚡ 건당 최대 {currentData.defaultBaseRate}%p 관세 즉시 절감 효과
          </div>
          <p style={{ fontSize: '0.82rem', color: '#065f46', marginTop: '10px', margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
            * 원산지결정기준(PSR)을 충족하고 적법한 원산지증명서(C/O)를 제출할 경우 수입 관세가 대폭 감면·면제됩니다.
          </p>
        </div>
      </div>

      {/* 4. Agreement Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #cbd5e1', paddingBottom: '12px', flexWrap: 'wrap' }}>
        {[
          { code: 'all', label: '전체 협정 비교 (21 FTAs)' },
          { code: 'kor_us', label: '🇺🇸 한-미 FTA' },
          { code: 'kor_eu', label: '🇪🇺 한-EU FTA' },
          { code: 'kor_cn', label: '🇨🇳 한-중 FTA' },
          { code: 'rcep', label: '🌏 RCEP' },
          { code: 'kor_asean', label: '🇻🇳 한-아세안' },
          { code: 'kor_vn', label: '🇻🇳 한-베트남' }
        ].map(tab => {
          const isSelected = selectedAgreement === tab.code;
          return (
            <button
              key={tab.code}
              type="button"
              onClick={() => setSelectedAgreement(tab.code)}
              style={{
                padding: '9px 16px',
                background: isSelected ? '#0d9488' : '#ffffff',
                border: isSelected ? '2px solid #0f766e' : '1.5px solid #cbd5e1',
                borderRadius: '8px',
                color: isSelected ? '#ffffff' : '#0f172a',
                fontWeight: 900,
                fontSize: '0.86rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 2px 8px rgba(13, 148, 136, 0.25)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 5. FTA PSR Detail Matrix Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {filteredRules.map((rule, idx) => {
          return (
            <div 
              key={idx}
              style={{
                padding: '22px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '2px solid #cbd5e1',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                {/* Card Header: Agreement & Rate */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{rule.flag}</span>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                        {rule.agreementName}
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 700 }}>
                        체약상대국: {rule.country}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 950, color: '#059669' }}>
                      {rule.ftaRate}%
                    </span>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', fontWeight: 700 }}>
                      (기본 {rule.baseRate}%)
                    </span>
                  </div>
                </div>

                {/* PSR Core Criteria Badge & Description */}
                <div style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      padding: '4px 10px',
                      background: '#e0f2fe',
                      border: '1.5px solid #0284c7',
                      borderRadius: '6px',
                      color: '#0369a1',
                      fontSize: '0.82rem',
                      fontWeight: 950
                    }}>
                      PSR: {rule.psrCode}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 800 }}>
                      원산지결정기준 요건
                    </span>
                  </div>
                  <p style={{ fontSize: '0.94rem', color: '#0f172a', fontWeight: 800, margin: 0, lineHeight: 1.55 }}>
                    {rule.psrDescription}
                  </p>
                </div>

                {/* C/O Requirements Details */}
                <div style={{ marginTop: '14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', padding: '12px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>C/O 발급 형태</span>
                    <span style={{ color: '#0f172a', fontWeight: 900 }}>{rule.coType}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#475569', fontWeight: 700 }}>미소기준(De Minimis)</span>
                    <span style={{ color: '#0f172a', fontWeight: 800 }}>{rule.deMinimis}</span>
                  </div>
                  {rule.isApprovedExporterRequired && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#b45309', fontWeight: 800, marginTop: '2px', background: '#fef3c7', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f59e0b' }}>
                      <AlertTriangle size={15} color="#d97706" />
                      <span>원산지인증수출자 자격 필수 (건당 6,000유로 초과)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Practical Verification Footer */}
              <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '12px', fontSize: '0.82rem', color: '#0f172a', display: 'flex', alignItems: 'flex-start', gap: '8px', background: '#f0f9ff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <Info size={16} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.45 }}><strong style={{ color: '#0369a1' }}>실무 Tip:</strong> {rule.verificationTip}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Legal Guide & Terminology Lexicon */}
      <div style={{ padding: '24px', borderRadius: '16px', background: '#ffffff', border: '2px solid #cbd5e1', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 950, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} color="#0891b2" />
          관세사 실무 원산지결정기준(PSR) 약어 핵심 용어집
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '0.84rem' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}>
            <strong style={{ color: '#0284c7', fontSize: '0.94rem' }}>CC (Change of Chapter)</strong>
            <p style={{ margin: '6px 0 0 0', lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>2단위 류 변경 기준. 비원산지 재료의 HS 2단위와 완제품의 HS 2단위가 완전히 상이해야 원산지 인정.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}>
            <strong style={{ color: '#0284c7', fontSize: '0.94rem' }}>CTH (Change of Tariff Heading)</strong>
            <p style={{ margin: '6px 0 0 0', lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>4단위 호 변경 기준. 공산품에서 가장 널리 쓰이며, 다른 4단위 원재료로 새로운 완제품을 제조했을 때 인정.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}>
            <strong style={{ color: '#0284c7', fontSize: '0.94rem' }}>CTSH (Change of Subheading)</strong>
            <p style={{ margin: '6px 0 0 0', lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>6단위 소호 변경 기준. 완제품과 원재료 간 6단위가 변경되면 충족되어 CTH보다 완화된 기준.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}>
            <strong style={{ color: '#0284c7', fontSize: '0.94rem' }}>RVC (Regional Value Content)</strong>
            <p style={{ margin: '6px 0 0 0', lineHeight: 1.5, color: '#334155', fontWeight: 600 }}>역내부가가치 기준. 완제품 가격 중 체약상대국 역내에서 발생한 부가가치가 일정 비율(예: 40% 이상)이어야 인정.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
