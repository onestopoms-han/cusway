import { ClassificationRule } from '../../components/HsClassifier';

export const chapter39Rules: ClassificationRule[] = [
  {
    "keywordTrigger": ["박스테이프", "점착테이프", "테이프", "box tape", "adhesive tape", "opp테이프", "포장용테이프", "tape"],
    "recommendedHsCode": "3919.10-0000",
    "headingName": "제3919호 (플라스틱으로 만든 감압성ㆍ접착성ㆍ점착성의 판ㆍ시트ㆍ필름ㆍ테이프 등)",
    "subheadingName": "롤 모양인 것 (폭이 20센티미터 이하인 것)",
    "confidence": 95,
    "technicalTerms": "Self-adhesive plates, sheets, film, foil, tape, strip, of plastics, in rolls of a width not exceeding 20 cm",
    "appliedGris": ["통칙 제1호", "통칙 제6호"],
    "legalReasoning": "본 물품은 포장용 박스를 밀봉하기 위해 사용되는 플라스틱(주로 OPP 폴리프로필렌 필름) 재질의 단면 점착테이프입니다. 폭이 20센티미터 이하인 롤 형태로 수입되므로, 관세율표 일반통칙 제1호 및 제6호에 의거하여 플라스틱제 점착성 평면 모양 테이프가 분류되는 제3919.10-0000호에 분류됩니다.",
    "sectionNote": "제7부 플라스틱과 그 제품, 고무와 그 제품 (제39류)",
    "chapterNote": "제39류 주석 규정: 플라스틱의 범위 및 타 호(예: 방직용 섬유 테이프)와의 분류 구별",
    "exclusionNote": "⚠️ 제외규정 통제: 종이 재질의 점착테이프(제4811호 또는 제4823호), 방직용 섬유 직물에 접착제를 도포한 테이프(제5906호 또는 제5907호) 및 가황한 고무제 테이프(제4008호) 등은 재질별 분류 원칙에 따라 플라스틱류(39류)에서 완전 제외됩니다.",
    "headingExplanation": "제3919호 해설: 이 호에는 플라스틱 재질로 구성되고 표면에 점착성/접착성 물질이 균일하게 코팅된 평면 제품을 분류합니다. 포장용 테이프(OPP 등)는 롤의 폭 규격에 따라 20cm 이하는 3919.10호, 초과는 3919.90호에 나누어 분류됩니다.",
    "precedents": [
      {
        "id": "PREC-3919-01",
        "title": "OPP(아크릴계 점착제 코팅) 포장용 점착테이프의 품목분류",
        "code": "3919.10-0000",
        "issuingBody": "관세평가분류원",
        "date": "2024-11-05",
        "similarity": 98,
        "reasoningSnippet": "폴리프로필렌(PP) 필름 한쪽 면에 감압성 아크릴 수지 점착제를 도포한 후 롤 형태로 권취한 포장용 테이프(폭 5cm)는 플라스틱제 점착성 테이프에 해당하여 제3919.10-0000호에 분류함."
      }
    ],
    "competingHsCodes": [
      {
        "hsCode": "4811.41-0000",
        "headingName": "제4811호 (점착지를 베이스로 한 종이 테이프)",
        "appliedGri": "통칙 제1호",
        "reasoning": "크라프트지 등 종이 원단 배후면에 점착제를 코팅한 종이 포장용 테이프 수입 시 경합하는 세번입니다.",
        "exclusionReason": "본 물품은 종이가 아닌 합성수지(플라스틱) OPP 필름을 기재로 하므로 제4811호 분류에서 배제됩니다."
      },
      {
        "hsCode": "5906.10-0000",
        "headingName": "제5906호 (고무를 칠한 방직용 섬유의 접착테이프)",
        "appliedGri": "통칙 제1호",
        "reasoning": "면직물이나 폴리에스테르 직물 표면에 고무나 아크릴 접착제를 도포하여 만든 섬유 베이스 면테이프입니다.",
        "exclusionReason": "본 물품은 직물이 아닌 순수 압출 성형된 플라스틱 필름제이므로 방직용 섬유제(59류)에서 완전 배제됩니다."
      }
    ]
  }
];
