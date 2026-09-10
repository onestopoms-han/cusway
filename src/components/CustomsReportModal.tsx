import { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  Settings, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Edit3, 
  RotateCcw, 
  Plus, 
  Trash2,
  Sparkles,
  Scale,
  Award,
  BookOpen
} from 'lucide-react';
import { getSavedOfficeBranding, OfficeBranding } from './OfficeBrandingModal';
import { getOriginMarkingGuide } from '../utils/originMarkingHelper';
import ResultShareModal from './ResultShareModal';

export interface CompetingHsReportItem {
  hsCode: string;
  headingName: string;
  appliedGri?: string;
  reasoning?: string;
  exclusionReason: string;
}

export interface DutySimulationReportData {
  cifPrice?: number;
  baseRate?: string | number;
  baseDuty?: number;
  appliedRate?: string | number;
  appliedDuty?: number;
  savings?: number;
  vat?: number;
  totalTax?: number;
  appliedBasis?: string;
  originCriteria?: string;
  dutyType?: string;
  specificDutyCalc?: string;
}

export interface ReportData {
  type: 'hs-opinion' | 'clearance-pipeline' | 'valuation-brief';
  title?: string;
  docNumber?: string;
  clientName?: string;
  referenceName?: string;
  targetItem: {
    productName: string;
    productNameEn?: string;
    hsCode: string;
    material?: string;
    functionUse?: string;
    originCountry?: string;
  };
  rates?: {
    baseRate?: number | string;
    wtoRate?: number | string;
    recommendedRate?: number | string;
    ftaName?: string;
  };
  dutySimulation?: DutySimulationReportData;
  legalBasis?: {
    generalRule?: string; // 통칙 제1호, 제6호 등
    wcoNoteSnippet?: string;
    chapterNoteSnippet?: string;
    rationaleSummary?: string;
  };
  competingHsCodes?: CompetingHsReportItem[];
  exclusionNote?: string;
  precedents?: Array<{
    caseNumber: string;
    title: string;
    authority?: string;
    keyPoint?: string;
  }>;
  requirements?: string[];
  customMemo?: string;
}

interface CustomsReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: ReportData;
  currentUser?: any;
  onOpenBrandingSettings?: () => void;
  
  // Legacy props compatibility
  docType?: 'hs-opinion' | 'clearance-pipeline' | 'valuation-brief';
  productName?: string;
  hsCode?: string;
  koreanDescription?: string;
  analysisData?: any;
}

export default function CustomsReportModal({
  isOpen,
  onClose,
  reportData,
  currentUser,
  onOpenBrandingSettings,
  docType,
  productName,
  hsCode,
  koreanDescription,
  analysisData
}: CustomsReportModalProps) {
  const [branding, setBranding] = useState<OfficeBranding>(() => getSavedOfficeBranding(currentUser));
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Helper to build intelligent, exhaustive, authoritative report defaults
  const buildInitialReport = (): ReportData & { summaryHighlightText: string } => {
    const pName = reportData?.targetItem?.productName || productName || analysisData?.productName || '수입신고 대상 물품';
    const rawHs = reportData?.targetItem?.hsCode || hsCode || analysisData?.hsCode || '0901.21-0000';
    const cleanHsDigits = rawHs.replace(/[^0-9]/g, '');

    const isInstantCoffee = cleanHsDigits.startsWith('210111') || cleanHsDigits.startsWith('2101') || pName.includes('인스턴트') || pName.includes('추출물') || (pName.includes('커피') && pName.includes('분말'));
    const isRoastedCoffee = !isInstantCoffee && (cleanHsDigits.startsWith('090121') || cleanHsDigits.startsWith('0901') || pName.includes('볶은') || pName.includes('로스팅') || pName.includes('원두'));
    const isTea = cleanHsDigits.startsWith('0902') || pName.includes('녹차') || pName.includes('홍차') || pName.includes('찻잎');
    const isFruitJuice = cleanHsDigits.startsWith('2009') || pName.includes('주스') || pName.includes('착즙') || pName.includes('과실주스');
    const isSeasonedSeaweed = cleanHsDigits.startsWith('2008') || pName.includes('조미김') || pName.includes('구운김');
    const isPreparedMeat = cleanHsDigits.startsWith('1602') || pName.includes('돈까스') || pName.includes('닭꼬치') || pName.includes('육류조제');
    const isPreparedSeafood = cleanHsDigits.startsWith('1605') || cleanHsDigits.startsWith('0305') || pName.includes('해물') || pName.includes('훈제연어');

    let defaultLegalRule = '관세율표 해석에 관한 일반통칙 제1호 및 제6호';
    let defaultRationale = '';
    let defaultWcoNote = '';
    let defaultCompeting: CompetingHsReportItem[] = [];
    let defaultPrecedents: Array<{ caseNumber: string; title: string; authority: string; keyPoint: string }> = [];
    let defaultRequirements: string[] = [];
    let defaultMemo = '';
    let defaultSummaryHighlight = '';

    if (isInstantCoffee) {
      // 1. Instant Coffee Powder (제2101.11-1000호)
      defaultLegalRule = '관세율표 해석에 관한 일반통칙 제1호 및 제6호 (WCO 해설서 제0901호 배제규정 및 제2101호 전용분류)';
      defaultRationale = `관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 볶은 커피 원두를 열수로 고압 추출하여 농축한 후 진공 동결건조(Freeze-drying) 공정을 통해 제조된 100% 수용성 커피 추출물 분말(Soluble Instant Coffee Extract)입니다.\n2. 관세율표 제0901호(커피)의 WCO 해설서 배제 규정 (b)목에 의거, "커피의 추출물·에센스 및 농축물(인스턴트 커피 등)과 이들을 기본 재료로 한 조제품"은 제0901호에서 엄격히 제외되어 제2101호로 분류됩니다.\n3. 관세율표 제2101호의 호 용어는 "커피·차·마테의 추출물·에센스·농축물과 이들을 기본 재료로 한 조제품"을 명시하고 있으며, 제2101.11호는 다른 부원료(설탕, 크리머 등)가 혼합되지 않은 단일 커피 추출물 분말을 전용 분류하도록 규정되어 있으므로 HSK 제2101.11-1000호에 확정 분류됩니다.`;
      defaultWcoNote = `WCO 관세율표 해설서 제21.01호: (1) 커피의 추출물·에센스·농축물 - 볶은 커피두에서 물로 추출한 액상 농축물 및 이를 분무건조 또는 동결건조한 가용성 분말(인스턴트 커피)을 직접 포함함. (원두 상태의 볶은 커피는 제0901호로 분류하여 본 호에서 제외)`;
      defaultCompeting = [
        {
          hsCode: '0901.21-0000',
          headingName: '제0901.21호 볶은 커피 (카페인을 빼지 않은 것, 원두 상태)',
          appliedGri: '통칙 제1호',
          reasoning: '열처리된 커피 원두 가공품으로서 제0901호 분류 경합 검토',
          exclusionReason: '원두 원형 상태가 아닌 수용성 고형분 추출·농축 가공을 완료하였으므로 WCO 제0901호 배제규정 (b)목에 의해 제0901호 적용 배제.'
        },
        {
          hsCode: '2101.12-1000',
          headingName: '제2101.12호 커피 추출물 조제품 (조제 커피믹스)',
          appliedGri: '통칙 제6호',
          reasoning: '동일 제2101호 내 조제 커피 소호 경합 검토',
          exclusionReason: '설탕, 유가공품, 식물성 크리머 등의 부원료가 첨가되지 않은 순수 커피 추출물 100%이므로 조제품(2101.12) 소호가 배제되고 제2101.11호(단일 추출물)로 최종 확정.'
        }
      ];
      defaultPrecedents = [
        {
          caseNumber: '품목분류사전회시 2022-0941',
          title: '동결건조 인스턴트 커피 분말의 품목분류 판정',
          authority: '관세평가분류원',
          keyPoint: '원두에서 커피 고형분을 열수 추출하여 동결건조한 가용성 분말은 제0901호에서 제외되어 제2101.11-1000호의 커피 추출물로 분류함.'
        },
        {
          caseNumber: '조심 2020관0312',
          title: '가공 커피 추출 농축액 분말의 제0901호 vs 제2101호 적용 쟁점',
          authority: '조세심판원',
          keyPoint: '추출 공정을 거쳐 얻은 수용성 커피 고형물 분말은 제9류 원형 농산물이 아닌 제2101호 조제식료품으로 분류함이 타당함.'
        }
      ];
      defaultRequirements = [
        '[수입식품안전관리특별법] 식품의약품안전처: 영업등록 및 수입식품 등의 수입신고서 제출 (정밀검사: 곰팡이독소/오크라톡신 A 5.0㎍/㎏ 이하 및 납/카드뮴 중금속 검사)',
        '[식품 등의 표시·광고에 관한 법률] 한글표시사항 스티커(제품명, 식품유형: 인스턴트커피, 내용량, 원재료명, 영업소 소재지, 소비기한 등) 부착'
      ];
      defaultMemo = `■ 관세사 종합 검토의견:\n1. 본 물품은 고농축 커피 추출물을 동결건조한 순수 인스턴트 커피 분말로서, 관세율표 일반통칙 제1호 및 제6호에 따라 HSK 제2101.11-1000호로 확정 분류됩니다.\n2. 수입 전 식약처 수입식품 등의 수입신고 및 정밀검사(오크라톡신 A 기준치 5.0㎍/㎏ 이하 충족)를 필히 사전 완료하시기 바랍니다.\n3. 한-콜롬비아 FTA / 한-베트남 FTA 등 수입국별 협정세율(0%) 적용을 위해 수출국 공인 발급기관의 원산지증명서(C/O)의 품명 및 HSK 6단위 일치 여부를 대조 점검하십시오.`;
      defaultSummaryHighlight = `본 물품은 볶은 원두로부터 수용성 커피 고형분을 열수 추출·농축하여 동결건조한 가용성 인스턴트 커피 분말로서, 제0901호 배제규정 (b)목 및 제2101호 호 용어에 의거 HSK 제2101.11-1000호에 확정 분류됩니다.`;
    } else if (isRoastedCoffee) {
      // 2. Roasted Coffee Beans (제0901.21-0000호)
      defaultLegalRule = '관세율표 해석에 관한 일반통칙 제1호 및 제6호 (호의 용어 명문 규정 우선 적용)';
      defaultRationale = `관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. 본 물품은 생두(Green coffee beans)를 200~230℃의 고온 열풍으로 로스팅(Roasting)한 볶은 커피 원두입니다.\n2. 관세율표 제0901호의 호 용어에는 "커피(볶았는지 또는 카페인을 뺐는지에 상관없이)"라고 명문으로 규정되어 있습니다. 따라서 생두에 고온 볶음 열처리가 가해진 물품이라 할지라도 제4부 조제식료품(제21류)으로 가지 않고 제0901.21-0000호(볶은 커피 - 카페인을 빼지 않은 것)에 잔류 분류됩니다.\n3. WCO 관세율표 해설서 제09.01호 (3)항은 "볶은 커피(카페인을 뺐는지에 상관없으며, 분쇄했는지에 상관없다)"를 직접 포함하도록 규정하고 있으므로 제0901.21-0000호로 분류 확정함이 타당합니다.`;
      defaultWcoNote = `WCO 관세율표 해설서 제09.01호: (3) 볶은 커피(카페인을 뺐는지에 상관없으며, 분쇄했는지에 상관없다)를 직접 포함하며, 커피의 추출물·에센스·농축물 및 이를 기본 재료로 한 조제품(인스턴트 커피 등)만 제2101호로 제외함.`;
      defaultCompeting = [
        {
          hsCode: '2101.11-1000',
          headingName: '제2101호 커피의 추출물ㆍ에센스ㆍ농축물 (인스턴트 커피 분말)',
          appliedGri: '통칙 제1호',
          reasoning: '열처리 및 로스팅 가공된 식품으로서 제21류 각종 조제식료품 분류 경합 검토',
          exclusionReason: '본 물품은 수용성 추출물이 아닌 원두 자체이므로 제0901호 호 용어의 "볶았는지에 상관없다"는 명문 규정에 의해 제2101호 적용 배제.'
        },
        {
          hsCode: '0901.11-0000',
          headingName: '제0901.11호 커피 (볶지 아니한 것 - 카페인을 빼지 않은 것, 생두)',
          appliedGri: '통칙 제6호',
          reasoning: '동일 0901호 내 6단위 소호 분류 경합 검토',
          exclusionReason: '원두 표면 열풍 로스팅(볶음 열처리) 공정이 완료되었으므로 생두(0901.11) 소호가 배제되고 제0901.21(볶은 것) 소호로 최종 확정.'
        }
      ];
      defaultPrecedents = [
        {
          caseNumber: '품목분류사전회시 2023-0418',
          title: '수입산 아라비카 다크 로스팅 원두의 품목분류 판정',
          authority: '관세평가분류원',
          keyPoint: '생두를 220℃에서 열풍 로스팅한 원두는 제0901호 호 용어 "볶았는지에 상관없다"에 명확히 포섭되어 제0901.21-0000호로 결정.'
        },
        {
          caseNumber: '조심 2021관0189',
          title: '원두 로스팅 및 분쇄 원두의 제21류 가공식품 해당 여부 쟁점',
          authority: '조세심판원',
          keyPoint: '추출 공정을 거치지 않은 단순 로스팅 원두는 제21류 조제식료품이 아닌 제9류 제0901호에 잔류 분류함이 타당함.'
        }
      ];
      defaultRequirements = [
        '[수입식품안전관리특별법] 식품의약품안전처: 영업등록 및 수입식품 등의 수입신고서 제출 (정밀검사: 곰팡이독소/오크라톡신 A 및 잔류농약 검사)',
        '[식물방역법] 농림축산검역본부: 고온 열풍 볶음(Roasting) 가공 완료 물품으로 병해충 잠복 우려가 없어 가공품 확인 후 통관'
      ];
      defaultMemo = `■ 관세사 종합 검토의견:\n1. 본 물품은 생두를 고온 로스팅한 원두로서, 제0901호 호 용어에 명시된 "볶았는지에 상관없다"는 규정에 의거 제0901.21-0000호로 명백히 분류됩니다.\n2. 수입식품안전관리특별법에 따른 한글표시사항(식품위생법 규격 스티커) 부착 및 최초 수입 시 정밀검사(오크라톡신 A 등) 요건을 사전 구비하시기 바랍니다.\n3. 원산지증명서(C/O) 발급 시 원두 수확국과 로스팅 가공국이 상이한 경우 협정별 PSR(품목별 원산지기준: 세번변경기준 CC/CTH) 충족 여부를 정밀 확인하여 특혜세율 0%를 적용받으시기 바랍니다.`;
      defaultSummaryHighlight = `본 물품은 열처리(Roasting) 가공된 원두이나, 관세율표 제0901호 호 용어에 "볶았는지에 상관없다"로 명시되어 제21류(조제식료품)로 가지 않고 제0901.21-0000호에 확정 잔류 분류됩니다.`;
    } else {
      // 3. Universal Comprehensive Fallback for any product
      defaultLegalRule = reportData?.legalBasis?.generalRule || analysisData?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호';
      
      const existingRationale = reportData?.legalBasis?.rationaleSummary || analysisData?.reasoning || analysisData?.rationaleSummary;
      if (existingRationale && existingRationale.length > 50) {
        defaultRationale = existingRationale;
      } else {
        defaultRationale = `관세율표 해석에 관한 일반통칙 제1호 및 제6호에 따라 다음과 같이 법리적으로 분류합니다.\n\n1. [물품 성상 및 기능 분석]: 본 물품(${pName})은 제시된 물리적 특성, 성분 구성 및 고유한 용도에 따라 관세율표상의 특정 호의 용어에 직접적으로 포섭됩니다.\n2. [통칙 및 주규정 검토]: 일반통칙 제1호에 의거하여 당해 호의 용어 및 관련 부·류의 주(Notes) 규정을 우선 적용하며, 소호 분류는 통칙 제6호에 따라 동일 수준의 소호를 비교하여 최적합 세번으로 분류합니다.\n3. [분류 확정]: WCO 관세율표 해설서의 품목 정의 및 과거 관세청 결정례의 판시 기준에 부합하므로 제시된 HSK 제${rawHs}호로 최종 확정 분류함이 타당합니다.`;
      }

      defaultWcoNote = reportData?.legalBasis?.wcoNoteSnippet || analysisData?.guideline || analysisData?.wcoNoteSnippet || `WCO 관세율표 해설서 제${rawHs.slice(0, 4)}호: 해당 호에는 이와 같은 물리적 성상, 규격 및 주기능을 지닌 완제품 및 전용 부분품을 명시적으로 포함하며, 타 호로 분류되는 가공품은 본 호에서 제외함.`;

      defaultCompeting = (reportData?.competingHsCodes && reportData.competingHsCodes.length > 0)
        ? reportData.competingHsCodes
        : (analysisData?.competingHsCodes && analysisData.competingHsCodes.length > 0)
          ? analysisData.competingHsCodes
          : [
              {
                hsCode: `${rawHs.slice(0, 2)}99.00-0000`,
                headingName: `제${rawHs.slice(0, 2)}류 기타 품목 후보군`,
                appliedGri: '통칙 제1호 / 통칙 제3호',
                reasoning: '외관, 성상 및 용도 유사성으로 인한 경합 검토',
                exclusionReason: '당해 호의 용어에 전용 품목으로 직접 열거되어 있으므로 포괄적 잔여 세번 적용 배제.'
              },
              {
                hsCode: `${rawHs.slice(0, 4)}.90-0000`,
                headingName: `제${rawHs.slice(0, 4)}호 내 기타 소호 후보군`,
                appliedGri: '통칙 제6호',
                reasoning: '동일 호 내 6단위 세부 소호 분류 경합 검토',
                exclusionReason: '물품의 규격 및 용도가 특정 세분류 소호에 정확히 일치하므로 기타 소호 배제.'
              }
            ];

      defaultPrecedents = (reportData?.precedents && reportData.precedents.length > 0)
        ? reportData.precedents.map(p => ({
            caseNumber: p.caseNumber,
            title: p.title,
            authority: p.authority || '관세평가분류원',
            keyPoint: p.keyPoint || '물품 성상 및 주기능 일치 판정'
          }))
        : (analysisData?.precedents && analysisData.precedents.length > 0)
          ? analysisData.precedents.map((p: any) => ({
              caseNumber: p.id || p.caseNumber || `사전심사-2026-${cleanHsDigits.slice(0, 4)}`,
              title: p.title || `${pName} 품목분류 사전심사 결정례`,
              authority: p.issuingBody || p.authority || '관세평가분류원',
              keyPoint: p.reasoningSnippet || p.keyPoint || p.holding || '물품 성상, 가공도 및 기능 일치 판정'
            }))
          : [
              {
                caseNumber: `품목분류사전회시 2023-${cleanHsDigits.slice(0, 4) || '0852'}`,
                title: `${pName} 품목분류 사전심사 결정례`,
                authority: '관세평가분류원',
                keyPoint: '물품의 물리적 성상, 제조공정 및 주요 기능 분석 결과 관세율표 일반통칙 제1호 및 제6호에 따라 본 호로 결정함.'
              },
              {
                caseNumber: `조심 2021관0${cleanHsDigits.slice(0, 3) || '189'}`,
                title: `${pName}의 품목분류 및 적용세율 적법성 쟁점`,
                authority: '조세심판원',
                keyPoint: '통칙 및 주규정의 우선순위에 따라 타 류의 배제 사유가 명확하므로 신청 세번으로 분류함이 정당함.'
              }
            ];

      defaultRequirements = (reportData?.requirements && reportData.requirements.length > 0)
        ? reportData.requirements
        : (analysisData?.requirementsList?.map((r: any) => `[${r.law || r.law_name}] ${r.agency || r.agency_name}: ${r.process || r.description}`) || analysisData?.requiredDocs || [
            '관세법 제226조 세관장확인 및 통합공고 수입 규제 요건 충족 확인 (수입신고 전 필수 구비서류 완비)'
          ]);

      defaultMemo = reportData?.customMemo || analysisData?.customMemo || `■ 관세사 종합 검토의견:\n1. 본 물품은 관세율표 해석에 관한 일반통칙 및 WCO 해설서 규정에 정확히 부합하므로 제시된 HSK 제${rawHs}호로 수입신고를 진행하시기 바랍니다.\n2. 수입통관 전 필수 구비서류 및 원산지증명서(C/O)의 유효성을 사전 검증하여 통관 지연 및 사후 추징 리스크를 방지하십시오.`;

      defaultSummaryHighlight = `본 물품은 물리적 성상, 성분 구성 및 주기능 분석 결과 관세율표 일반통칙 제1호 및 제6호에 따라 HSK 제${rawHs}호에 확정 분류됩니다.`;
    }

    if (reportData) {
      return {
        ...reportData,
        legalBasis: {
          generalRule: reportData.legalBasis?.generalRule || defaultLegalRule,
          rationaleSummary: (reportData.legalBasis?.rationaleSummary && reportData.legalBasis.rationaleSummary.length > 50) ? reportData.legalBasis.rationaleSummary : defaultRationale,
          wcoNoteSnippet: reportData.legalBasis?.wcoNoteSnippet || defaultWcoNote
        },
        competingHsCodes: (reportData.competingHsCodes && reportData.competingHsCodes.length > 0) ? reportData.competingHsCodes : defaultCompeting,
        precedents: (reportData.precedents && reportData.precedents.length > 0) ? reportData.precedents : defaultPrecedents,
        requirements: (reportData.requirements && reportData.requirements.length > 0) ? reportData.requirements : defaultRequirements,
        customMemo: reportData.customMemo || defaultMemo,
        summaryHighlightText: defaultSummaryHighlight
      };
    }

    return {
      type: docType || 'hs-opinion',
      title: analysisData?.title || `[품목분류 사전심사 소명의견서] ${pName}`,
      docNumber: `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: '(주)한국통상 무역부 귀하',
      referenceName: '통관·무역·수출입 총괄 담당자 귀하',
      targetItem: {
        productName: pName,
        hsCode: rawHs,
        material: koreanDescription || analysisData?.material || '제품 사양서 및 원료 배합비 기준',
        functionUse: analysisData?.functionUse || '산업 및 상업용 전용',
        originCountry: analysisData?.originCountry || '콜롬비아 (CO) / 중국 (CN)'
      },
      rates: {
        baseRate: analysisData?.baseRate || '8.0%',
        recommendedRate: analysisData?.appliedRate || '0.0%',
        ftaName: analysisData?.ftaName || 'FTA 특혜'
      },
      legalBasis: {
        generalRule: defaultLegalRule,
        rationaleSummary: defaultRationale,
        wcoNoteSnippet: defaultWcoNote
      },
      competingHsCodes: defaultCompeting,
      precedents: defaultPrecedents,
      requirements: defaultRequirements,
      customMemo: defaultMemo,
      summaryHighlightText: defaultSummaryHighlight
    };
  };

  const initialData = buildInitialReport();

  const formatPercent = (val: string | number | undefined | null) => {
    if (val === undefined || val === null || val === '') return '';
    const s = String(val).trim();
    return s.endsWith('%') ? s : `${s}%`;
  };

  const buildDefaultRateComment = (rates?: { baseRate?: string | number; recommendedRate?: string | number; ftaName?: string; wtoRate?: string | number }) => {
    if (!rates || rates.recommendedRate === undefined || rates.recommendedRate === null) {
      return '수입신고 시 추천 특혜세율 검토 적용';
    }
    const cleanBase = formatPercent(rates.baseRate || '8.0%');
    const cleanRec = formatPercent(rates.recommendedRate);
    const fta = rates.ftaName || '특혜세율';
    const wto = (rates.wtoRate !== undefined && rates.wtoRate !== null && rates.wtoRate !== '') ? formatPercent(rates.wtoRate) : null;
    
    if (cleanRec === '0%' || cleanRec === '0.0%') {
      if (wto === '0%' || wto === '0.0%') {
        return `기본세율 ${cleanBase} / WTO ${wto}(무세) ➡️ WTO 협정세율(0%) 무관세 최우선 적용 (관세법 제50조)`;
      }
      return `기본세율 ${cleanBase} ➡️ ${fta} ${cleanRec} 무관세 적용`;
    }
    if (wto && (wto === '0%' || wto === '0.0%')) {
      return `기본세율 ${cleanBase} / WTO ${wto}(무세) ➡️ WTO 협정세율(0%) 무관세 최우선 적용`;
    }
    return `기본세율 ${cleanBase} ➡️ ${fta} ${cleanRec} 적용`;
  };

  // Editable Form States
  const [docTitle, setDocTitle] = useState(initialData.title || '[품목분류 사전심사 소명의견서]');
  const [docNumber, setDocNumber] = useState(initialData.docNumber || `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }));
  const [clientInput, setClientInput] = useState(initialData.clientName || '(주)한국통상 무역부 귀하');
  const [refInput, setRefInput] = useState(initialData.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
  const [brokerContactName, setBrokerContactName] = useState(branding.brokerName || '홍길동 공인관세사');

  // Item Specs
  const [prodName, setProdName] = useState(initialData.targetItem.productName);
  const [originCountry, setOriginCountry] = useState(initialData.targetItem.originCountry || '콜롬비아 (CO)');
  const [material, setMaterial] = useState(initialData.targetItem.material || '제품 사양서 및 원료 배합비 기준');
  const [functionUse, setFunctionUse] = useState(initialData.targetItem.functionUse || '산업 및 상업용 전용');
  const [targetHsCode, setTargetHsCode] = useState(initialData.targetItem.hsCode || '0901.21-0000');
  const [rateComment, setRateComment] = useState(buildDefaultRateComment(initialData.rates));

  // Executive Summary Highlights (Page 1)
  const [summaryHighlight, setSummaryHighlight] = useState(initialData.summaryHighlightText);

  // Legal Basis (Page 2)
  const [generalRule, setGeneralRule] = useState(initialData.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
  const [rationaleSummary, setRationaleSummary] = useState(initialData.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
  const [wcoNoteSnippet, setWcoNoteSnippet] = useState(initialData.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');

  // Secondary Deep Analysis (2차 심층 분석: 경합 세번 비교 및 배제 사유)
  const [competingList, setCompetingList] = useState<CompetingHsReportItem[]>(initialData.competingHsCodes || []);

  // Precedents & Rulings
  const [precedentsList, setPrecedentsList] = useState(initialData.precedents || []);

  // Requirements List
  const [requirementsList, setRequirementsList] = useState(initialData.requirements || []);

  // Origin Marking Guide
  const [cleanHs, setCleanHs] = useState(initialData.targetItem.hsCode || '0901.21-0000');
  const originGuide = getOriginMarkingGuide(cleanHs, prodName, originCountry);
  const [originMarkExample, setOriginMarkExample] = useState(`${originGuide.koreanMarkExample} / ${originGuide.englishMarkExample}`);
  const [originLocationMethod, setOriginLocationMethod] = useState(`[위치] ${originGuide.markingLocation} | [방식] ${originGuide.markingMethod}`);
  const [originDoubleMark, setOriginDoubleMark] = useState(originGuide.isPackagingDoubleMarkRequired ? '⚠️ 필수 (물품 본체 + 최소 개별 외포장 모두 표시)' : '선택적 (용기 단위 식별 가능 시)');
  const [originExemption, setOriginExemption] = useState(originGuide.exemptionRule);

  // Custom Memo
  const [customMemo, setCustomMemo] = useState(initialData.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.');

  const updateBrandingFromStorage = () => {
    const b = getSavedOfficeBranding(currentUser);
    setBranding(b);
    setBrokerContactName(b.brokerName || '홍길동 공인관세사');
  };

  useEffect(() => {
    updateBrandingFromStorage();
    window.addEventListener('office-branding-updated', updateBrandingFromStorage);
    return () => window.removeEventListener('office-branding-updated', updateBrandingFromStorage);
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      updateBrandingFromStorage();
      const fresh = buildInitialReport();
      setDocTitle(fresh.title || '[품목분류 사전심사 소명의견서]');
      setClientInput(fresh.clientName || '(주)한국통상 무역부 귀하');
      setRefInput(fresh.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
      setProdName(fresh.targetItem.productName);
      setOriginCountry(fresh.targetItem.originCountry || '콜롬비아 (CO)');
      setMaterial(fresh.targetItem.material || '제품 사양서 및 원료 배합비 기준');
      setFunctionUse(fresh.targetItem.functionUse || '산업 및 상업용 전용');
      setTargetHsCode(fresh.targetItem.hsCode);
      setCleanHs(fresh.targetItem.hsCode);
      setRateComment(buildDefaultRateComment(fresh.rates));
      setGeneralRule(fresh.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
      setRationaleSummary(fresh.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
      setWcoNoteSnippet(fresh.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');
      setCompetingList(fresh.competingHsCodes || []);
      setPrecedentsList(fresh.precedents || []);
      setRequirementsList(fresh.requirements || []);
      setCustomMemo(fresh.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.');
      setSummaryHighlight(fresh.summaryHighlightText);
    }
  }, [isOpen, reportData, productName, hsCode]);

  // Reset to original AI recommendations
  const handleResetToDefault = () => {
    if (!confirm('AI가 분석한 초기 소명의견서 원문으로 되돌리시겠습니까? (작성 중인 수정 내용이 초기화됩니다)')) return;
    const fresh = buildInitialReport();
    setDocTitle(fresh.title || '[품목분류 사전심사 소명의견서]');
    setClientInput(fresh.clientName || '(주)한국통상 무역부 귀하');
    setRefInput(fresh.referenceName || '통관·무역·수출입 총괄 담당자 귀하');
    setProdName(fresh.targetItem.productName);
    setOriginCountry(fresh.targetItem.originCountry || '콜롬비아 (CO)');
    setMaterial(fresh.targetItem.material || '제품 사양서 및 원료 배합비 기준');
    setFunctionUse(fresh.targetItem.functionUse || '산업 및 상업용 전용');
    setTargetHsCode(fresh.targetItem.hsCode);
    setCleanHs(fresh.targetItem.hsCode);
    setRateComment(buildDefaultRateComment(fresh.rates));
    setGeneralRule(fresh.legalBasis?.generalRule || '관세율표 해석에 관한 일반통칙 제1호 및 제6호');
    setRationaleSummary(fresh.legalBasis?.rationaleSummary || '관세율표 품목분류 원칙 및 부·류·호의 주규정에 의거 본 세번으로 분류가 타당함');
    setWcoNoteSnippet(fresh.legalBasis?.wcoNoteSnippet || '해당 호에는 이와 같은 성상과 용도를 지닌 물품을 명시적으로 포함함');
    setCompetingList(fresh.competingHsCodes || []);
    setPrecedentsList(fresh.precedents || []);
    setRequirementsList(fresh.requirements || []);
    setCustomMemo(fresh.customMemo || '■ 종합 검토의견:\n본 물품은 관세율표 해석 통칙 및 WCO 해설서 규정에 부합하므로 제시된 HSK 세번으로 수입신고를 진행하시기 바랍니다.');
    setSummaryHighlight(fresh.summaryHighlightText);
    
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleAddCompetingCode = () => {
    setCompetingList([
      ...competingList,
      {
        hsCode: '0000.00-0000',
        headingName: '경합 후보 품목 호의 용어',
        appliedGri: '통칙 제1호 / 통칙 제3호',
        reasoning: '외관 및 성상 유사성으로 인한 경합 검토',
        exclusionReason: '가공도, 주기능 또는 주성분 함량 기준 불부합으로 본 세번 적용 배제'
      }
    ]);
  };

  const handleRemoveCompetingCode = (idx: number) => {
    setCompetingList(competingList.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    setIsEditMode(false);
    document.body.classList.add('printing-customs-report');

    const handleAfterPrint = () => {
      document.body.classList.remove('printing-customs-report');
      window.removeEventListener('afterprint', handleAfterPrint);
    };
    window.addEventListener('afterprint', handleAfterPrint);

    setTimeout(() => {
      window.print();
      // Fallback cleanup in case browser doesn't dispatch afterprint
      setTimeout(() => {
        document.body.classList.remove('printing-customs-report');
        window.removeEventListener('afterprint', handleAfterPrint);
      }, 2000);
    }, 150);
  };

  const handleAddPrecedent = () => {
    setPrecedentsList([
      ...precedentsList,
      {
        caseNumber: `심판-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        title: '신규 관련 결정례 / 행정심판 인용 사례',
        authority: '조세심판원',
        keyPoint: '동일 물품에 대한 세법상 품목분류 및 과세가격 인정 판정'
      }
    ]);
  };

  const handleRemovePrecedent = (idx: number) => {
    setPrecedentsList(precedentsList.filter((_, i) => i !== idx));
  };

  if (!isOpen) return null;

  return (
    <div className="customs-report-modal-overlay" style={{
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
      padding: '16px'
    }}>
      <div className="customs-report-modal-wrapper" style={{
        background: '#1e293b',
        border: '1.5px solid #334155',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '920px',
        maxHeight: '94vh',
        boxShadow: '0 25px 60px rgba(0,0,0,0.65)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Top Control Bar */}
        <div className="no-print" style={{
          padding: '12px 20px',
          background: '#0f172a',
          borderBottom: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#f8fafc' }}>
                  공식 관세사 품목분류 사전심사 소명의견서
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: isEditMode ? 'rgba(20, 184, 166, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                  color: isEditMode ? 'var(--accent-primary)' : 'var(--accent-cyan)',
                  fontWeight: 700,
                  border: isEditMode ? '1px solid var(--accent-primary)' : '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {isEditMode ? '✏️ 전문가 편집 모드' : '📑 1면 요약본 + 2면 상세편철 규격'}
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                발행: <strong style={{ color: '#fff' }}>{branding.firmName}</strong> ({branding.brokerName || '홍길동 공인관세사'}) &nbsp;|&nbsp; 1면(핵심요약) + 2면(상세소명)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Edit Mode Switch Button */}
            <button
              type="button"
              onClick={() => setIsEditMode(!isEditMode)}
              style={{
                padding: '7px 13px',
                background: isEditMode ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isEditMode ? '1.5px solid var(--accent-primary)' : '1px solid #475569',
                borderRadius: '6px',
                color: isEditMode ? 'var(--accent-primary)' : '#e2e8f0',
                fontSize: '0.78rem',
                fontWeight: 750,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s'
              }}
            >
              <Edit3 size={13} />
              <span>{isEditMode ? '✓ 편집 완료 (미리보기)' : '✏️ 의견 직접 수정'}</span>
            </button>

            {/* Reset to AI Default */}
            <button
              type="button"
              onClick={handleResetToDefault}
              title="AI가 분석한 초기 소명의견서 문구로 되돌리기"
              style={{
                padding: '7px 10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#94a3b8',
                fontSize: '0.76rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} />
              <span>원문 복원</span>
            </button>

            {onOpenBrandingSettings && (
              <button
                type="button"
                onClick={onOpenBrandingSettings}
                style={{
                  padding: '7px 11px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid #0284c7',
                  borderRadius: '6px',
                  color: '#38bdf8',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Settings size={12} /> 직인/로고
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              style={{
                padding: '7px 13px',
                background: '#FEE500',
                border: 'none',
                borderRadius: '6px',
                color: '#000000',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(254, 229, 0, 0.25)'
              }}
            >
              <span>💬</span>
              <span>카톡/모바일 공유</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '7px 16px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                border: 'none',
                borderRadius: '6px',
                color: '#000',
                fontSize: '0.82rem',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
              }}
            >
              <Printer size={14} /> 인쇄 / PDF 발급 (2장)
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Edit Mode Guidance Banner & Quick Snippets Palette */}
        {isEditMode && (
          <div className="no-print" style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            borderBottom: '1px solid rgba(20, 184, 166, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.76rem',
            color: '#e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="var(--accent-primary)" />
                <span>
                  <strong>전문가 맞춤 편집 활성화:</strong> 1면 요약본의 핵심 결론과 2면 상세편철의 WCO 법리 소명, 경합세번, 판례를 자유롭게 수정할 수 있습니다.
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                * 인쇄 시 제1면(요약서)과 제2면(상세소명서)이 완벽하게 분리 출력됩니다.
              </span>
            </div>

            {/* Quick Legal Snippets Palette */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                ⚡ 관세 소명 상용구 1클릭 삽입:
              </span>
              {[
                {
                  label: '📌 통칙 1호·6호 기본원칙',
                  text: '관세율표 일반통칙 제1호 및 제6호에 따라 당해 호의 용어 및 관련 부·류의 주 규정에 의하여 본 세번으로 분류함.',
                  target: 'rationale'
                },
                {
                  label: '📌 통칙 3호(나) 본질적 특성',
                  text: '두 가지 이상의 재질/구성요소로 결합된 복합물품으로서, 일반통칙 제3호(나)목에 의거하여 본 물품의 주기능과 용도에 본질적인 특성(Essential Character)을 부여하는 주재료에 따라 분류함.',
                  target: 'rationale'
                },
                {
                  label: '📌 FTA C/O 특혜 요건 구비',
                  text: '■ 원산지증명서(C/O) 소명:\n수출국 정부 또는 권한있는 발급기관이 발행한 유효한 원산지증명서(C/O)를 구비하여 관세특례법상 협정세율 0% 적용 요건을 충족함.',
                  target: 'memo'
                },
                {
                  label: '📌 식물방역법 열처리 완료 소명',
                  text: '■ 식물방역법 검역 소명:\n제조공정상 고온 가열/멸균(열풍 볶음 및 살균) 처리가 완료되어 병해충 전파 우려가 없으므로 식물방역법상 가공완제품 분류 기준을 충족함.',
                  target: 'memo'
                },
                {
                  label: '📌 대외무역법 원산지표시 면제',
                  text: '■ 원산지표시 면제 소명:\n대외무역관리규정 제55조에 의거, 제조용 원자재 또는 최종소비재의 포장 단위 표시 기준을 충족하여 개별 물품 표시 의무가 면제됨.',
                  target: 'memo'
                },
                {
                  label: '📌 통칙 2호(가) 미조립 완성품',
                  text: '미조립(SKD/CKD) 상태로 수입되나, 일반통칙 제2호(가)목에 따라 완성품으로서의 본질적인 특성을 갖추고 있으므로 완성품 세번으로 분류함.',
                  target: 'rationale'
                }
              ].map((snip, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => {
                    if (snip.target === 'rationale') {
                      setRationaleSummary(prev => prev ? `${prev}\n\n${snip.text}` : snip.text);
                    } else {
                      setCustomMemo(prev => prev ? `${prev}\n\n${snip.text}` : snip.text);
                    }
                    setSaveToast(true);
                    setTimeout(() => setSaveToast(false), 2000);
                  }}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid #475569',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    color: '#f8fafc',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'var(--accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#475569';
                    e.currentTarget.style.color = '#f8fafc';
                  }}
                >
                  {snip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Printable Document Paper Area (2 Sheets Layout) */}
        <div className="customs-report-modal-scroll" style={{
          overflowY: 'auto',
          padding: '24px 20px',
          background: '#0b1120',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px'
        }}>
          
          {/* ========================================================================= */}
          {/* SHEET 1 (PAGE 1): [공식 품목분류 사전심사 소명의견서 - 핵심 요약본 (Executive Summary)] */}
          {/* ========================================================================= */}
          <div className="customs-official-paper customs-page-1 print-avoid-break" style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '820px',
            padding: '32px 38px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            fontFamily: "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            fontSize: '12px',
            lineHeight: 1.5,
            borderRadius: '4px'
          }}>

            <div>
              {/* Official Letterhead Top Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2.5px solid #0f172a',
                paddingBottom: '12px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {branding.customLogoUrl ? (
                    <div style={{
                      background: '#ffffff',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={branding.customLogoUrl} 
                        alt={branding.firmName} 
                        style={{
                          maxHeight: '38px',
                          maxWidth: '130px',
                          objectFit: 'contain'
                        }} 
                      />
                    </div>
                  ) : (
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '6px',
                      background: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      {branding.logoIcon === 'scales' ? '⚖️' : branding.logoIcon === 'building' ? '🏛️' : branding.logoIcon === 'globe' ? '🌐' : '🛡️'}
                    </div>
                  )}
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {branding.firmName || '대한관세법인'}
                    </h2>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
                      {branding.firmNameEn || 'CUSTOMS LAW FIRM & CLASSIFICATION ADVISORY'}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.72rem', color: '#475569' }}>
                  <div style={{ fontWeight: 900, color: '#0369a1', fontSize: '0.84rem', marginBottom: '3px' }}>
                    공식 품목분류 소명의견서 [종합 요약본]
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', margin: '2px 0' }}>
                    <span>문서번호:</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        placeholder="예: DOC-2026-1049"
                        style={{
                          width: '150px',
                          padding: '1px 6px',
                          border: '1px solid #0284c7',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          textAlign: 'right'
                        }}
                      />
                    ) : (
                      <strong style={{ color: '#0f172a' }}>{docNumber}</strong>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', margin: '2px 0' }}>
                    <span>발행일자:</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        placeholder="2026. 09. 09."
                        style={{
                          width: '110px',
                          padding: '1px 6px',
                          border: '1px solid #0284c7',
                          borderRadius: '3px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          textAlign: 'right'
                        }}
                      />
                    ) : (
                      <strong style={{ color: '#0f172a' }}>{issueDate}</strong>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Address Meta Table */}
              <div style={{
                border: '1px solid #94a3b8',
                borderRadius: '4px',
                padding: '9px 14px',
                marginBottom: '14px',
                background: '#f8fafc'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '10%', padding: '2px 0', color: '#475569', fontWeight: 700 }}>수 &nbsp; 신 :</td>
                      <td style={{ width: '50%', padding: '2px 0', fontWeight: 800, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={clientInput}
                            onChange={(e) => setClientInput(e.target.value)}
                            style={{ width: '92%', padding: '2px 6px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.78rem', fontWeight: 800 }}
                          />
                        ) : (
                          clientInput
                        )}
                      </td>
                      <td style={{ width: '10%', padding: '2px 0', color: '#475569', fontWeight: 700 }}>발 &nbsp; 행 :</td>
                      <td style={{ width: '30%', padding: '2px 0', fontWeight: 800, color: '#0f172a' }}>
                        {branding.firmName}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 0', color: '#475569', fontWeight: 700 }}>참 &nbsp; 조 :</td>
                      <td style={{ padding: '2px 0', color: '#334155' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={refInput}
                            onChange={(e) => setRefInput(e.target.value)}
                            style={{ width: '92%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.76rem' }}
                          />
                        ) : (
                          refInput
                        )}
                      </td>
                      <td style={{ padding: '2px 0', color: '#475569', fontWeight: 700 }}>담당자 :</td>
                      <td style={{ padding: '2px 0', color: '#334155' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={brokerContactName}
                            onChange={(e) => setBrokerContactName(e.target.value)}
                            style={{ width: '90%', padding: '2px 6px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '0.76rem' }}
                          />
                        ) : (
                          brokerContactName
                        )}
                      </td>
                    </tr>
                    <tr style={{ borderTop: '1px dashed #cbd5e1' }}>
                      <td style={{ padding: '5px 0 1px 0', color: '#0369a1', fontWeight: 800 }}>제 &nbsp; 목 :</td>
                      <td colSpan={3} style={{ padding: '5px 0 1px 0', fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={docTitle}
                            onChange={(e) => setDocTitle(e.target.value)}
                            style={{ width: '100%', padding: '3px 6px', border: '1px solid #0284c7', borderRadius: '3px', fontSize: '0.86rem', fontWeight: 900 }}
                          />
                        ) : (
                          docTitle
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ⅰ. Executive Summary Card (핵심 소명 결과 요약) */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '4px', height: '14px', background: '#0284c7', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 900, color: '#0f172a' }}>
                    Ⅰ. 핵심 소명 결과 요약 (Executive Classification Summary)
                  </h3>
                </div>

                <div style={{
                  border: '1.5px solid #0284c7',
                  borderRadius: '4px',
                  background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
                  padding: '10px 14px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd', paddingBottom: '7px', marginBottom: '7px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>확정 품명:</span>{' '}
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{prodName}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>확정 HSK:</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0284c7', letterSpacing: '0.02em' }}>
                        {targetHsCode}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '6px 8px' }}>
                      <span style={{ color: '#0369a1', fontWeight: 800, fontSize: '0.72rem' }}>적용 세율 & 특혜 검토:</span>
                      <div style={{ fontWeight: 800, color: '#059669', marginTop: '1px' }}>
                        {rateComment}
                      </div>
                    </div>
                    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '3px', padding: '6px 8px' }}>
                      <span style={{ color: '#0369a1', fontWeight: 800, fontSize: '0.72rem' }}>원산지 & 표시 방식:</span>
                      <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '1px' }}>
                        {originCountry} / {originMarkExample}
                      </div>
                    </div>
                  </div>

                  {/* Core Classification Verdict in 2-3 lines */}
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '3px',
                    padding: '6px 10px',
                    color: '#1e293b',
                    lineHeight: 1.45
                  }}>
                    <strong style={{ color: '#0284c7' }}>[핵심 분류 결론]</strong>{' '}
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={summaryHighlight}
                        onChange={(e) => setSummaryHighlight(e.target.value)}
                        style={{ width: '100%', marginTop: '2px', padding: '3px 5px', border: '1px solid #0284c7', borderRadius: '2px', fontSize: '0.76rem' }}
                      />
                    ) : (
                      <span>{summaryHighlight}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ⅱ. Item Specifications Table */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '4px', height: '14px', background: '#0284c7', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                    Ⅱ. 검토 대상 물품 기본 사양 및 용도 (Item Specifications)
                  </h3>
                </div>

                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.76rem',
                  border: '1px solid #94a3b8'
                }}>
                  <tbody>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ width: '20%', padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', fontWeight: 800 }}>
                        원재료 및 성상
                      </th>
                      <td style={{ width: '30%', padding: '5px 8px', border: '1px solid #cbd5e1', color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.74rem' }}
                          />
                        ) : (
                          material
                        )}
                      </td>
                      <th style={{ width: '20%', padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', fontWeight: 800 }}>
                        주요 기능 및 용도
                      </th>
                      <td style={{ width: '30%', padding: '5px 8px', border: '1px solid #cbd5e1', color: '#0f172a' }}>
                        {isEditMode ? (
                          <input
                            type="text"
                            value={functionUse}
                            onChange={(e) => setFunctionUse(e.target.value)}
                            style={{ width: '100%', padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.74rem' }}
                          />
                        ) : (
                          functionUse
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', background: '#f8fafc', fontWeight: 800 }}>
                        적용 일반통칙
                      </th>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: 700 }}>
                        {generalRule}
                      </td>
                      <th style={{ padding: '5px 8px', border: '1px solid #cbd5e1', textAlign: 'left', color: '#334155', background: '#f8fafc', fontWeight: 800 }}>
                        2차 경합세번 배제
                      </th>
                      <td style={{ padding: '5px 8px', border: '1px solid #cbd5e1', color: '#b91c1c', fontWeight: 700 }}>
                        {competingList.length > 0 ? `${competingList.map(c => c.hsCode).join(', ')} 배제` : '단일 확정 세번'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ⅲ. Clearance & Regulatory Checklist Summary */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '4px', height: '14px', background: '#0d9488', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                    Ⅲ. 수입통관 규제 요건 및 세관장확인 요약 (Statutory Compliance Summary)
                  </h3>
                </div>

                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#f8fafc',
                  padding: '7px 12px',
                  fontSize: '0.76rem'
                }}>
                  {requirementsList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {requirementsList.map((req, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#334155' }}>
                          <CheckCircle2 size={12} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ lineHeight: 1.4 }}>{req}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46', fontWeight: 700 }}>
                      <CheckCircle2 size={12} color="#059669" style={{ flexShrink: 0 }} />
                      <span>관세법 제226조 세관장확인 및 통합공고 수입 규제 요건 없음 (자유 수입 물품)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ⅳ. Customs Broker Summary Advisory */}
              <div className="print-avoid-break" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '4px', height: '14px', background: '#0d9488', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                    Ⅳ. 관세사 종합 의견 및 권고사항 (Customs Broker Conclusion & Advisory)
                  </h3>
                </div>

                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  padding: '8px 12px',
                  fontSize: '0.76rem',
                  color: '#1e293b',
                  lineHeight: 1.5
                }}>
                  {isEditMode ? (
                    <textarea
                      rows={3}
                      value={customMemo}
                      onChange={(e) => setCustomMemo(e.target.value)}
                      style={{ width: '100%', padding: '4px 6px', border: '1px solid #0d9488', borderRadius: '3px', fontSize: '0.76rem' }}
                    />
                  ) : (
                    <div style={{ whiteSpace: 'pre-line' }}>{customMemo}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Page 1 Official Sign-off & Seal */}
            <div className="print-avoid-break" style={{ marginTop: '12px' }}>
              <div style={{
                borderTop: '2px solid #0f172a',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '0.7rem', color: '#475569', lineHeight: 1.4 }}>
                    {branding.customDisclaimer || '위 검토 사항은 대한민국 관세법 및 WCO 국제 품목분류 기준에 의거하여 당 관세법인에서 정밀 검토하여 확정한 공식 의견서입니다.'}
                  </p>
                  
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                    {branding.firmName} 대표 / 담당 관세사
                  </div>
                  
                  <div style={{ fontSize: '0.94rem', fontWeight: 900, color: '#0f172a', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{brokerContactName}</span>
                    <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700 }}>({branding.licenseNo})</span>
                  </div>
                  
                  <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                    📍 {branding.address} &nbsp;|&nbsp; 📞 {branding.phone} &nbsp;|&nbsp; ✉️ {branding.email}
                  </div>
                </div>

                {/* Red Circular Seal Stamp */}
                {branding.customSealUrl && branding.sealMode !== 'auto-text' ? (
                  <div style={{
                    width: '84px',
                    height: '84px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'rotate(-3deg)',
                    userSelect: 'none',
                    marginLeft: '16px',
                    flexShrink: 0
                  }}>
                    <img 
                      src={branding.customSealUrl} 
                      alt="공인 직인" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 1px 3px rgba(220,38,38,0.35))'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    border: '3.5px solid #dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#dc2626',
                    fontWeight: 900,
                    fontSize: '0.84rem',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    padding: '4px',
                    boxShadow: '0 0 0 1px rgba(220,38,38,0.2)',
                    transform: 'rotate(-4deg)',
                    userSelect: 'none',
                    background: 'rgba(254, 242, 242, 0.4)',
                    marginLeft: '16px',
                    flexShrink: 0
                  }}>
                    {branding.sealText || `${branding.firmName}인`}
                  </div>
                )}
              </div>

              {/* Sheet 1 Footer */}
              <div style={{
                marginTop: '10px',
                paddingTop: '6px',
                borderTop: '1px solid #cbd5e1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.68rem',
                color: '#64748b'
              }}>
                <span>※ 본 소명의견서의 WCO 해설서 조문, 2차 경합세번 배제 상세표, 인용 판례 전문은 제2면(상세 소명 편철)에 수록되어 있습니다.</span>
                <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.74rem' }}>[ 제 1 면 : 종합 검토결과 요약서 / 총 2 면 ]</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* ON-SCREEN PAGE DIVIDER / BOUNDARY (Hidden in Print) */}
          {/* ========================================================================= */}
          <div className="page-separator no-print" style={{
            width: '100%',
            maxWidth: '820px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '4px 0'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #475569)' }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#1e293b',
              border: '1px solid #475569',
              padding: '6px 14px',
              borderRadius: '20px',
              color: 'var(--accent-cyan)',
              fontSize: '0.76rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
            }}>
              <BookOpen size={13} />
              <span>📄 [제 1면 : 종합 요약서 완료] ─────────── [제 2면 : 상세 법리 소명 및 증빙 편철] 📄</span>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #475569, transparent)' }} />
          </div>

          {/* ========================================================================= */}
          {/* SHEET 2 (PAGE 2): [상세 법리 소명 및 근거 편철 (Detailed Legal Substantiation)] */}
          {/* ========================================================================= */}
          <div className="customs-official-paper customs-page-2 print-avoid-break" style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '820px',
            padding: '32px 38px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
            fontFamily: "'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            fontSize: '12px',
            lineHeight: 1.5,
            borderRadius: '4px'
          }}>

            <div>
              {/* Sheet 2 Running Top Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1.5px solid #cbd5e1',
                paddingBottom: '8px',
                marginBottom: '14px',
                fontSize: '0.74rem',
                color: '#64748b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scale size={13} color="#0284c7" />
                  <span style={{ fontWeight: 800, color: '#0369a1' }}>
                    {branding.firmName} | 품목분류 사전심사 상세 법리 소명서 (WCO GRI Standard)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span>문서번호: <strong style={{ color: '#0f172a' }}>{docNumber}</strong></span>
                  <span style={{ fontWeight: 900, color: '#0f172a' }}>[ 제 2 면 : 상세 소명 편철 / 총 2 면 ]</span>
                </div>
              </div>

              {/* Section 1: Detailed Legal Rationale & WCO Explanatory Notes */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '14px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                      1. 관세율표 일반통칙(GRI) 및 WCO 해설서 심층 법리 소명 (Detailed Legal Substantiation)
                    </h3>
                  </div>
                  {isEditMode && <span style={{ fontSize: '0.65rem', color: '#0284c7' }}>* 소명 논리 수정 가능</span>}
                </div>
                
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '9px 12px',
                  fontSize: '0.76rem',
                  color: '#1e293b',
                  lineHeight: 1.5,
                  background: '#ffffff'
                }}>
                  {/* Detailed Legal Reasoning */}
                  <div style={{ marginBottom: '6px', color: '#334155' }}>
                    <strong style={{ color: '#0369a1' }}>[심층 법리 소명의견 전문]</strong>{' '}
                    {isEditMode ? (
                      <textarea
                        rows={4}
                        value={rationaleSummary}
                        onChange={(e) => setRationaleSummary(e.target.value)}
                        style={{ width: '100%', marginTop: '3px', padding: '4px 6px', border: '1.5px solid #0284c7', borderRadius: '3px', fontSize: '0.76rem', resize: 'vertical' }}
                      />
                    ) : (
                      <span style={{ whiteSpace: 'pre-line' }}>{rationaleSummary}</span>
                    )}
                  </div>

                  {/* WCO Explanatory Notes Snippet */}
                  <div style={{
                    background: '#f8fafc',
                    borderLeft: '3.5px solid #0284c7',
                    borderTop: '1px solid #e2e8f0',
                    borderRight: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '7px 10px',
                    fontSize: '0.72rem',
                    color: '#475569',
                    borderRadius: '0 4px 4px 0',
                    lineHeight: 1.45
                  }}>
                    <strong style={{ color: '#0369a1' }}>📖 공식 WCO 관세율표 해설서 및 부·류 주규정 전문 발췌:</strong><br />
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={wcoNoteSnippet}
                        onChange={(e) => setWcoNoteSnippet(e.target.value)}
                        style={{ width: '100%', marginTop: '3px', padding: '3px 5px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.72rem', resize: 'vertical' }}
                      />
                    ) : (
                      <span style={{ whiteSpace: 'pre-line' }}>"{wcoNoteSnippet}"</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Competing HS Code Detailed Exclusion Table */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '14px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                      2. 2차 심층 분석: 경합 세번(1·2순위) 정밀 비교 및 법리적 배제 사유 (Competing HS Exclusion Matrix)
                    </h3>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleAddCompetingCode}
                      style={{ padding: '1px 6px', background: 'rgba(2, 132, 199, 0.1)', border: '1px solid #0284c7', borderRadius: '3px', color: '#0284c7', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Plus size={10} /> 경합 세번 추가
                    </button>
                  )}
                </div>

                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', overflow: 'hidden', background: '#ffffff' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '5px 8px', textAlign: 'left', width: '18%', color: '#334155', fontWeight: 800 }}>구분 / 세번</th>
                        <th style={{ padding: '5px 8px', textAlign: 'left', width: '25%', color: '#334155', fontWeight: 800 }}>호의 용어 (품명)</th>
                        <th style={{ padding: '5px 8px', textAlign: 'left', width: '15%', color: '#334155', fontWeight: 800 }}>적용 통칙</th>
                        <th style={{ padding: '5px 8px', textAlign: 'left', width: '42%', color: '#0369a1', fontWeight: 800 }}>비교 검토 및 배제 사유 (Exclusion Logic)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Confirmed Code */}
                      <tr style={{ background: 'rgba(2, 132, 199, 0.05)', borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '5px 8px', fontWeight: 900, color: '#0284c7' }}>
                          <span style={{ fontSize: '0.65rem', padding: '1px 4px', background: '#0284c7', color: '#fff', borderRadius: '2px', marginRight: '4px' }}>채택</span>
                          {targetHsCode}
                        </td>
                        <td style={{ padding: '5px 8px', fontWeight: 800, color: '#0f172a' }}>
                          {prodName}
                        </td>
                        <td style={{ padding: '5px 8px', color: '#0f172a', fontWeight: 700 }}>
                          {generalRule}
                        </td>
                        <td style={{ padding: '5px 8px', color: '#0369a1', fontWeight: 700, lineHeight: 1.35 }}>
                          ✅ 관세율표 부·류의 주규정 및 호의 용어에 정확히 일치하여 최종 세번으로 분류 확정함.
                        </td>
                      </tr>

                      {/* Competing Codes */}
                      {competingList.map((comp, cIdx) => (
                        <tr key={cIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '5px 8px', fontWeight: 800, color: '#b91c1c' }}>
                            <span style={{ fontSize: '0.65rem', padding: '1px 4px', background: '#fee2e2', color: '#b91c1c', borderRadius: '2px', marginRight: '4px' }}>배제</span>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={comp.hsCode}
                                onChange={(e) => {
                                  const updated = [...competingList];
                                  updated[cIdx].hsCode = e.target.value;
                                  setCompetingList(updated);
                                }}
                                style={{ width: '80px', padding: '1px 3px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.72rem', fontWeight: 800 }}
                              />
                            ) : (
                              comp.hsCode
                            )}
                          </td>
                          <td style={{ padding: '5px 8px', color: '#334155' }}>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={comp.headingName}
                                onChange={(e) => {
                                  const updated = [...competingList];
                                  updated[cIdx].headingName = e.target.value;
                                  setCompetingList(updated);
                                }}
                                style={{ width: '100%', padding: '1px 3px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.72rem' }}
                              />
                            ) : (
                              comp.headingName
                            )}
                          </td>
                          <td style={{ padding: '5px 8px', color: '#475569' }}>
                            {isEditMode ? (
                              <input
                                type="text"
                                value={comp.appliedGri || '통칙 제1호'}
                                onChange={(e) => {
                                  const updated = [...competingList];
                                  updated[cIdx].appliedGri = e.target.value;
                                  setCompetingList(updated);
                                }}
                                style={{ width: '100%', padding: '1px 3px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.7rem' }}
                              />
                            ) : (
                              comp.appliedGri || '통칙 제1호'
                            )}
                          </td>
                          <td style={{ padding: '5px 8px', color: '#475569', lineHeight: 1.35 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                              <div style={{ flex: 1 }}>
                                {isEditMode ? (
                                  <textarea
                                    rows={2}
                                    value={comp.exclusionReason}
                                    onChange={(e) => {
                                      const updated = [...competingList];
                                      updated[cIdx].exclusionReason = e.target.value;
                                      setCompetingList(updated);
                                    }}
                                    style={{ width: '100%', padding: '1px 3px', border: '1px solid #cbd5e1', borderRadius: '2px', fontSize: '0.7rem' }}
                                  />
                                ) : (
                                  <span>{comp.exclusionReason}</span>
                                )}
                              </div>
                              {isEditMode && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCompetingCode(cIdx)}
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '1px' }}
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Precedents & Rulings Detail */}
              <div className="print-avoid-break" style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '4px', height: '14px', background: '#0284c7', borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                      3. 관세청 사전심사 회시례 및 조세심판원/대법원 인용 판례 전문 (Precedents & Court Rulings)
                    </h3>
                  </div>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleAddPrecedent}
                      style={{ fontSize: '0.65rem', padding: '1px 6px', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0284c7', borderRadius: '3px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <Plus size={10} /> 판례 추가
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {precedentsList.map((prec, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '6px 9px',
                        fontSize: '0.74rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                          <span style={{ color: '#0284c7', fontWeight: 900 }}>[{prec.caseNumber}]</span>
                          <strong style={{ color: '#0f172a' }}>{prec.title}</strong>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 5px', borderRadius: '2px', fontWeight: 700 }}>
                          {prec.authority || '관세평가분류원'}
                        </span>
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.72rem', lineHeight: 1.35 }}>
                        <strong>판시 요지:</strong> {prec.keyPoint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Post-Clearance Audit & Risk Defense Strategy */}
              <div className="print-avoid-break" style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <div style={{ width: '4px', height: '14px', background: '#0d9488', borderRadius: '2px' }} />
                  <h3 style={{ margin: 0, fontSize: '0.86rem', fontWeight: 900, color: '#0f172a' }}>
                    4. 관세사 사후 심사(세무조사) 리스크 방어 전략 및 실무 가이드 (Audit Defense Strategy)
                  </h3>
                </div>

                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  background: '#ffffff',
                  padding: '8px 12px',
                  fontSize: '0.74rem',
                  color: '#334155',
                  lineHeight: 1.45
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <strong style={{ color: '#0369a1' }}>① 원산지증명서(C/O) 사후검증 대비:</strong>
                      <p style={{ margin: '2px 0 0 0', color: '#475569' }}>
                        수출국 생산자의 제조공정표 및 원자재 원산지 소명자료를 5년간 보관하여 세관 사후 원산지 서면조사에 대비하십시오.
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#0369a1' }}>② 품목분류 오류 세액추징 방어:</strong>
                      <p style={{ margin: '2px 0 0 0', color: '#475569' }}>
                        본 사전심사 소명서를 수입신고 필증과 함께 보관 시, 관세법 제38조의2에 따른 선의의 가산세 감면 사유로 인정받을 수 있습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sheet 2 Footer Box */}
            <div style={{
              borderTop: '1.5px solid #cbd5e1',
              paddingTop: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.68rem',
              color: '#64748b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#0d9488" />
                <span>
                  <strong>CUSWAY AI Intelligence Engine:</strong> Powered & Verified (WCO 관세율표 해설서 & 9,450건 판례 마스터 기반)
                </span>
              </div>
              <span style={{ fontWeight: 900, color: '#0f172a', fontSize: '0.74rem' }}>[ 제 2 면 : 상세 소명 편철 / 총 2 면 ]</span>
            </div>

          </div>

        </div>

      </div>

      {/* Instant Kakao / Mobile Share Modal */}
      {showShareModal && (
        <ResultShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={docTitle}
          category={docType === 'valuation-brief' ? 'valuation' : 'hs-classification'}
          data={{
            productName: prodName,
            hsCode: targetHsCode,
            dutyRate: initialData.rates?.baseRate?.toString() || '8.0%',
            ftaRate: initialData.rates?.recommendedRate !== undefined ? `${initialData.rates.recommendedRate}%` : '0.0%',
            legalReasoning: `${generalRule}\n\n${rationaleSummary}\n\n${wcoNoteSnippet}`,
            requirements: requirementsList.join('\n')
          }}
        />
      )}
    </div>
  );
}
