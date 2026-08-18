import { ClassificationRule } from '../../components/HsClassifier';

export const chapter96Rules: ClassificationRule[] = [
  {
    "keywordTrigger": ["잉크스탬프", "잉크스템프", "스탬프", "스템프", "인장", "날짜도장", "stamp", "ink stamp"],
    "recommendedHsCode": "9611.00-0000",
    "headingName": "제9611호 (수동식 날짜인장ㆍ봉인인장ㆍ넘버링 스탬프와 이와 유사한 물품)",
    "subheadingName": "수동식 날짜인장ㆍ넘버링 스탬프 및 이와 유사한 물품",
    "confidence": 95,
    "technicalTerms": "Hand stamps, date, sealing or numbering stamps, designed for operating in the hand",
    "appliedGris": ["통칙 제1호", "통칙 제6호"],
    "legalReasoning": "본 물품은 수작업으로 문서나 용지에 날짜, 숫자, 또는 특정 문양 등을 날인하기 위해 설계된 수동식 잉크스탬프(인장)입니다. 관세율표 일반통칙 제1호 및 제6호에 의거하여, 손으로 조작하는 수동식 날짜인장, 봉인인장, 넘버링스탬프 및 이와 유사한 물품이 분류되는 제9611.00-0000호에 정확히 분류됩니다.",
    "sectionNote": "제20부 잡품 (제96류)",
    "chapterNote": "제96류 잡품 주석 규정: 완구 및 기타 잡품과의 분류 한계 설정",
    "exclusionNote": "⚠️ 제외규정 통제: 전동식 또는 기계식 작동 장치가 내장된 스탬프 기기나 인쇄기는 제8472호 등 사무용 기계류로 분류되며 이 호에서 제외됩니다. 또한 잉크를 공급하는 스탬프패드는 제9612호에 분류됩니다.",
    "headingExplanation": "제9611호 해설: 이 호에는 날짜인장, 봉인인장, 넘버링스탬프, 날인용 프린팅세트 등이 포함됩니다. 스탬프와 결합하여 사용하는 잉크패드는 제9612호에 해당합니다.",
    "precedents": [
      {
        "id": "PREC-9611-01",
        "title": "수동식 잉크 내장 만년 스탬프의 품목분류",
        "code": "9611.00-0000",
        "issuingBody": "관세평가분류원",
        "date": "2024-09-12",
        "similarity": 98,
        "reasoningSnippet": "몸체 내부에 잉크 패드가 내장되어 연속 날인이 가능한 수동식 만년도장/스탬프는 손으로 쥐고 사용하는 수동식 인장류로 보아 제9611.00-0000호에 분류함."
      }
    ],
    "competingHsCodes": [
      {
        "hsCode": "9612.20-0000",
        "headingName": "제9612호 (잉크패드 - 스탬프패드)",
        "appliedGri": "통칙 제1호",
        "reasoning": "스탬프 도장 날인을 위해 잉크를 머금고 있는 스탬프패드 단독 수입 시 검토되는 세번입니다.",
        "exclusionReason": "본 제품은 인장 고무 및 날인 기구가 일체화된 스탬프 도장 완제품이므로 스탬프패드 전용 세번에서 배제됩니다."
      },
      {
        "hsCode": "8472.90-9000",
        "headingName": "제8472호 (기타 사무용 기계 - 전동/자동 스탬핑 기기)",
        "appliedGri": "통칙 제1호",
        "reasoning": "전원 플러그를 연결하거나 자동 기계 장치에 부착되어 문서에 자동으로 스탬프를 찍어주는 기계적 사무용 기기입니다.",
        "exclusionReason": "본 제품은 순수 수동 핸드 헬드 작동 방식의 인장이므로 배제됩니다."
      }
    ]
  }
];
