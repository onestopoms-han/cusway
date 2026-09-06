/**
 * CUSWAY 원산지표시(Origin Marking) 법령 및 실무 가이드 유틸리티
 * 근거 법령: 대외무역법 제33조, 동법 시행령 제55조~제61조, 관세청 원산지표시제도 운영에 관한 고시
 */

export interface OriginMarkingGuide {
  hsCode: string;
  categoryName: string;
  countryCode: string;
  countryNameKo: string;
  countryNameEn: string;
  koreanMarkExample: string;
  englishMarkExample: string;
  alternativeMarkExample: string;
  markingLocation: string;
  markingMethod: string;
  durabilityLevel: 'high' | 'medium' | 'special';
  durabilityDesc: string;
  isPackagingDoubleMarkRequired: boolean;
  fontSizeRule: string;
  exemptionRule: string;
  customsRepairProcedure: string;
  legalBasis: string[];
  keyCheckpoints: string[];
}

// 주요 국가 코드 매핑
const COUNTRY_MAP: Record<string, { ko: string; en: string }> = {
  CN: { ko: '중국', en: 'China' },
  VN: { ko: '베트남', en: 'Vietnam' },
  US: { ko: '미국', en: 'USA' },
  JP: { ko: '일본', en: 'Japan' },
  DE: { ko: '독일', en: 'Germany' },
  EU: { ko: 'EU(유럽연합)', en: 'European Union' },
  TW: { ko: '대만', en: 'Taiwan' },
  TH: { ko: '태국', en: 'Thailand' },
  ID: { ko: '인도네시아', en: 'Indonesia' },
  IN: { ko: '인도', en: 'India' },
  IT: { ko: '이탈리아', en: 'Italy' },
  FR: { ko: '프랑스', en: 'France' },
  GB: { ko: '영국', en: 'United Kingdom' },
  MY: { ko: '말레이시아', en: 'Malaysia' },
  SG: { ko: '싱가포르', en: 'Singapore' },
  MX: { ko: '멕시코', en: 'Mexico' },
  CL: { ko: '칠레', en: 'Chile' },
  AU: { ko: '호주', en: 'Australia' },
  KR: { ko: '대한민국', en: 'Korea' }
};

export function getCountryNames(code: string): { ko: string; en: string } {
  const upper = (code || '').trim().toUpperCase();
  if (COUNTRY_MAP[upper]) return COUNTRY_MAP[upper];
  
  // 한국어 입력 시 역매핑
  for (const [_, val] of Object.entries(COUNTRY_MAP)) {
    if (val.ko === code || val.en.toLowerCase() === code.toLowerCase()) {
      return val;
    }
  }
  return { ko: code || '해당국', en: code || 'Origin Country' };
}

/**
 * HS Code 및 국가에 따른 원산지표시 규정 및 실무 가이드 생성
 */
export function getOriginMarkingGuide(
  hsCode: string = '', 
  productName: string = '', 
  originCountryCode: string = 'CN'
): OriginMarkingGuide {
  const cleanHs = hsCode.replace(/[^0-9]/g, '');
  const chapter = parseInt(cleanHs.slice(0, 2), 10) || 0;
  const { ko: countryKo, en: countryEn } = getCountryNames(originCountryCode);

  const baseLaw = [
    '대외무역법 제33조 (수출입 물품의 원산지표시)',
    '대외무역법 시행령 제55조 (원산지의 표시방법 등)',
    '관세청 원산지표시제도 운영에 관한 고시 (관세청 고시 제2024-호)'
  ];

  // 1. 섬유·의류·신발·가방류 (Chapter 50~65)
  if ((chapter >= 50 && chapter <= 65) || /의류|셔츠|바지|자켓|섬유|가방|신발|모자/i.test(productName)) {
    return {
      hsCode,
      categoryName: '섬유·의류·가방·신발류 (공산품)',
      countryCode: originCountryCode,
      countryNameKo: countryKo,
      countryNameEn: countryEn,
      koreanMarkExample: `원산지: ${countryKo}`,
      englishMarkExample: `Made in ${countryEn}`,
      alternativeMarkExample: `Country of Origin: ${countryEn}`,
      markingLocation: '의류 목덜미 안쪽 라벨 또는 옆구리 봉제 케어라벨, 신발 설포(혀) 안쪽 또는 깔창, 가방 내부 직조 라벨',
      markingMethod: '직조 라벨 봉제(박음질, Sewing Label) 또는 제품 본체 직접 인쇄 (쉽게 탈락되는 종이 스티커 원칙적 불가)',
      durabilityLevel: 'high',
      durabilityDesc: '세탁이나 착용 시에도 쉽게 떨어지지 않는 견고한 박음질 라벨 필수',
      isPackagingDoubleMarkRequired: true,
      fontSizeRule: '최종 구매자가 육안으로 쉽게 판독 가능한 크기 (권장: 8pt 이상, 국문/영문)',
      exemptionRule: '외화획득용 원부자재, 수입 후 완전 재가공되어 형태가 소멸되는 원단 등은 대외무역법 시행령 제56조에 따른 원산지표시 면제 확인 신청 가능',
      customsRepairProcedure: '통관 시 라벨 미부착 또는 스티커 부착 적발 시 보세구역 내에서 [원산지표시 보수작업(라벨 봉제 작업)] 승인 후 작업 완료해야 통관 수리됨',
      legalBasis: baseLaw,
      keyCheckpoints: [
        '단순 종이 스티커나 핀 태그(Hang Tag)만 부착 시 세관 통관 불허 및 보수작업 명령',
        '개별 비닐(OPP) 포장 및 외부 카톤 박스에도 국문/영문 원산지 병기 필수 (이중표시)',
        '세탁 표시 및 섬유 혼용률 라벨과 함께 일체형 봉제 가능'
      ]
    };
  }

  // 2. 전기·전자·기계·정밀기기 (Chapter 84, 85, 90)
  if (chapter === 84 || chapter === 85 || chapter === 90 || /전자|기계|모터|모듈|센서|케이블|컴퓨터|통신/i.test(productName)) {
    return {
      hsCode,
      categoryName: '전기·전자·기계·IT 정밀기기',
      countryCode: originCountryCode,
      countryNameKo: countryKo,
      countryNameEn: countryEn,
      koreanMarkExample: `제조국: ${countryKo} (원산지: ${countryKo})`,
      englishMarkExample: `Made in ${countryEn}`,
      alternativeMarkExample: `Manufactured in ${countryEn}`,
      markingLocation: '기기 본체 후면 또는 바닥면의 명판(Rating Plate / Spec Label) 및 개별 포장 박스 전면',
      markingMethod: '본체 각인(Engraving), 주조(Molding), 실크스크린 인쇄 또는 은박/PET 탈착 방지 영구 라벨',
      durabilityLevel: 'high',
      durabilityDesc: '기기 사용 수명 동안 지워지지 않는 영구 인쇄 또는 정격 명판 부착',
      isPackagingDoubleMarkRequired: true,
      fontSizeRule: '정격 전압, 모델명, KC 인증마크와 동일한 명판 내 6~8pt 이상 선명한 폰트',
      exemptionRule: '국내 제조공장에 투입되어 완제품 조립 부품으로 사용되는 원자재/부품은 세관 사전확인 시 원산지표시 면제 가능',
      customsRepairProcedure: '본체 미표시 적발 시 보세창고 내 실크인쇄 또는 탈착방지 특수 명판 부착 보수작업 진행 필요',
      legalBasis: baseLaw,
      keyCheckpoints: [
        'KC 인증마크, 정격 사양과 함께 본체 명판에 "Made in ..." 일체형 인쇄 권장',
        '극소형 부품(0.5cm 미만)으로 본체 표시가 불가능한 경우에 한하여 최소 포장 단위 표시 허용',
        '소매용 개별 패키지 박스 겉면에도 원산지 국가명 표기 필수'
      ]
    };
  }

  // 3. 농·축·수산물 및 가공식품 (Chapter 01~24)
  if ((chapter >= 1 && chapter <= 24) || /식품|농산물|수산물|차|커피|오일|과자|음료/i.test(productName)) {
    return {
      hsCode,
      categoryName: '농림축수산물 및 가공식품',
      countryCode: originCountryCode,
      countryNameKo: countryKo,
      countryNameEn: countryEn,
      koreanMarkExample: `원산지: ${countryKo}`,
      englishMarkExample: `Product of ${countryEn}`,
      alternativeMarkExample: `Country of Origin: ${countryEn}`,
      markingLocation: '개별 소비자 판매용 포장지 전면/후면 한글표시사항 및 수입 외포장 박스',
      markingMethod: '포장재 인쇄(Printing) 또는 식품위생법 규격 한글 스티커 라벨 부착',
      durabilityLevel: 'high',
      durabilityDesc: '유통 기한 동안 훼손되지 않는 포장 인쇄 또는 방수 코팅 한글 라벨',
      isPackagingDoubleMarkRequired: true,
      fontSizeRule: '식품등의 표시기준에 의거 10포인트 이상의 굵은 활자체 권장',
      exemptionRule: '식품제조가공업소의 제조용 원료로 직수입되는 벌크 물품은 최소 유통 단위 표시로 갈음 가능',
      customsRepairProcedure: '수입식품 검역 합격 후 보세구역 반출 전 한글표시사항(원산지 포함) 라벨 보수작업 완료 필수',
      legalBasis: [
        ...baseLaw,
        '농수산물의 원산지 표시 등에 관한 법률 제5조',
        '식품 등의 표시·광고에 관한 법률 제4조'
      ],
      keyCheckpoints: [
        '원재료명 및 함량 표기 시 배합 비율 상위 원재료의 원산지 국가명 병기 필수',
        '주표시면(전면) 또는 일괄표시면(후면)에 명확하고 선명하게 "원산지: 국명" 표시',
        '농축수산물 부정 유통(원산지 둔갑) 방지 특별 단속 대상 품목이므로 규격 준수 필수'
      ]
    };
  }

  // 4. 화학물질, 플라스틱 원자재, 금속소재 (Chapter 28~40, 72~83)
  if ((chapter >= 28 && chapter <= 40) || (chapter >= 72 && chapter <= 83) || /화학|수지|플라스틱|고무|철강|알루미늄|동관/i.test(productName)) {
    return {
      hsCode,
      categoryName: '화학·플라스틱 원자재 및 금속 기초소재',
      countryCode: originCountryCode,
      countryNameKo: countryKo,
      countryNameEn: countryEn,
      koreanMarkExample: `원산지: ${countryKo}`,
      englishMarkExample: `Made in ${countryEn}`,
      alternativeMarkExample: `Country of Origin: ${countryEn}`,
      markingLocation: '드럼통, 포대(Bag), 캔, IBC 탱크 외면 및 파렛트 단위 식별 라벨',
      markingMethod: '용기 외면 스텐실 인쇄, 열전사 인쇄 또는 견고한 방수 스티커 라벨',
      durabilityLevel: 'medium',
      durabilityDesc: '운송 및 보관 중 식별이 유지되는 내화학성 스티커 또는 인쇄',
      isPackagingDoubleMarkRequired: false,
      fontSizeRule: '용기 크기에 비례하여 5미터 거리에서도 육안 식별 가능한 크기',
      exemptionRule: '수입 후 국내 공장에서 화학 반응이나 용융, 가공을 거쳐 형태가 완전히 변형되는 원료는 [원산지표시 면제 승인(대외무역법 시행령 제56조)] 대상',
      customsRepairProcedure: '포대/용기 미표시 시 보세창고 내 스텐실 타각 또는 라벨 부착 보수작업 실시',
      legalBasis: baseLaw,
      keyCheckpoints: [
        '제조공정 투입 원료인 경우 수입신고 시 "원산지표시 면제신청서"를 세관에 제출하여 사전 면제 승인 획득 권장',
        '완제품 형태로 소매 유통되는 화학/플라스틱 제품은 일반 공산품 표시 기준 적용'
      ]
    };
  }

  // 5. 일반 공산품, 가구, 완구, 생활잡화 (Chapter 41~49, 66~71, 91~97)
  return {
    hsCode,
    categoryName: '일반 공산품·생활잡화·가구·완구류',
    countryCode: originCountryCode,
    countryNameKo: countryKo,
    countryNameEn: countryEn,
    koreanMarkExample: `원산지: ${countryKo}`,
    englishMarkExample: `Made in ${countryEn}`,
    alternativeMarkExample: `Country of Origin: ${countryEn}`,
    markingLocation: '제품 본체(바닥, 후면, 측면) 및 최종 소비자 소매용 개별 포장 박스',
    markingMethod: '제품 본체 인쇄, 각인, 몰딩, 압인 또는 탈착 방지 특수 라벨 부착',
    durabilityLevel: 'high',
    durabilityDesc: '구매 및 일상 사용 중 쉽게 지워지거나 떨어지지 않는 견고한 방식',
    isPackagingDoubleMarkRequired: true,
    fontSizeRule: '최종 구매자가 용이하게 식별할 수 있는 8pt 이상 활자',
    exemptionRule: '견본품, 연구개발용품, 수입 후 재가공 원자재는 세관 승인 시 면제 가능',
    customsRepairProcedure: '본체 미표시 적발 시 보세구역 내 라벨링 보수작업 승인 신청 및 완료 확인 후 통관 수리',
    legalBasis: baseLaw,
    keyCheckpoints: [
      '본체 및 최소 포장 단위 이중 표시(Double Marking) 원칙 준수',
      '단순 테이프 부착이나 쉽게 뜯어지는 일반 종이 스티커는 불인정',
      '한글, 한자 또는 영문(Made in ...)으로 명확하게 표기'
    ]
  };
}
