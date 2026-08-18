import { ClassificationRule } from '../../components/HsClassifier';

export const chapter33Rules: ClassificationRule[] = [
  {
    keywordTrigger: ['물티슈', '물티슈류', 'wet wipe', 'cleansing tissue', 'wet wipes'],
    recommendedHsCode: '3307.90-9000',
    headingName: '제3307호 (면도용 제품류, 인체용 탈취제, 화장품 등)',
    subheadingName: '인체 청결용 화장 물티슈 (Wet Wipe)',
    confidence: 92,
    technicalTerms: 'Cosmetic wet wipes, Cleansing tissues impregnated with toilet preparations',
    appliedGris: ['통칙 제1호', '통칙 제6호'],
    legalReasoning: '본 물품은 부직포에 화장수 또는 인체 세정용 유제를 침투시킨 물티슈(인체 세정용)입니다. 관세율표 일반통칙 제1호 및 제6호에 따라, 인체 세정용/화장용 물티슈는 제3307호의 인체용 탈취제 및 조제화장품류(3307.90-9000)로 분류됩니다. 다만, 알코올 소독제나 세제를 함유한 살균 세척용 물티슈는 제3401호(3401.19-1000)에 분류되며, 단순 메이크업 클렌징용 티슈는 제3304호로 경합하므로 아래의 경합 세번을 비교 검토하십시오.',
    sectionNote: '제6부 화학공업이나 연관공업의 생산물 (제28류 내지 제38류)',
    chapterNote: '제33류 정유와 레지노이드, 조제화장품ㆍ화장용품ㆍ소도용품',
    exclusionNote: '⚠️ 청소 및 산업용 소독 물티슈(세제/소독제 침투)는 제3401호 또는 제3808호로 이송되며, 아무것도 함유하지 않은 건조 상태의 부직포 타월은 제5603호(부직포)로 분류되어 이 호에서 제외됩니다.',
    headingExplanation: '제3307호에는 다른 호에 분류되지 않은 조제화장품을 분류하며, 향수나 화장수를 침투시킨 부직포제 물티슈가 여기에 속합니다.',
    precedents: [
      {
        id: 'PREC-3307-01',
        title: '화장수 및 정제수를 침투시킨 영유아용 물티슈의 품목분류',
        code: '3307.90-9000',
        issuingBody: '관세평가분류원',
        date: '2024-05-18',
        similarity: 98,
        reasoningSnippet: '부직포 원단에 정제수, 글리세린 및 방부 효과를 주는 화장 물질을 침투시켜 피부 세정용으로 제작된 물티슈는 통칙 제1호 및 제6호에 의해 조제화장품류인 제3307.90-9000호에 분류됨.'
      }
    ],
    competingHsCodes: [
      {
        hsCode: '3401.19-1000',
        headingName: '제3401호 (비누, 세제 등을 침투시킨 종이ㆍ부직포)',
        appliedGri: '통칙 제1호',
        reasoning: '주방 식기나 바닥 청소용, 혹은 식탁 세척용으로 계면활성제나 세제를 침투시킨 물티슈의 경합 세번입니다.',
        exclusionReason: '인체 피부 세정 및 위생 목적의 화장품 스펙이므로 세제류(3401)에서 배제됩니다.'
      },
      {
        hsCode: '5603.12-0000',
        headingName: '제5603호 (부직포 - 액체를 침투시키지 않은 것)',
        appliedGri: '통칙 제1호',
        reasoning: '액체 성분이 함유되지 않은 단순 마른 부직포 상태의 티슈/원단입니다.',
        exclusionReason: '본 제품은 화장액 및 물기가 침투되어 있는 완제품이므로 제외됩니다.'
      }
    ]
  }
];
