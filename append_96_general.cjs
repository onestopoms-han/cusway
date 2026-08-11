const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9600",
  "titleKo": "제96류 - 잡품 (총설 및 주 규정)",
  "titleEn": "Chapter 96 - Miscellaneous manufactured articles (General Notes & Rules)",
  "contentKo": "제96류는 조각/성형용 천연 및 광물성 가공 재료와 그 제품(제9601호~제9602호), 비/브러시/체(제9603호~제9604호), 단추/슬라이드파스너(지퍼)(제9605호~제9607호), 필기구/사무용품(볼펜, 연필 등 제9608호~제9612호), 흡연용품(라이터, 파이프 등 제9613호~제9614호), 화장/위생용품(빗, 화장용 분무기, 위생 타올/기저귀 등 제9615호~제9619호) 및 일각대/삼각대(제9620호) 등 다양한 가공 완제품 및 잡품을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 식물성/광물성 조각용 재료의 정의 (주 제2호) :\n  - 식물성 : 조각에 사용하는 견과(너트), 근경, 껍질 등(예: 상아야자 Corozo, 돔 doom 너트).\n  - 광물성 : 천연 호박(amber), 해포석(meerschaum), 흑옥(jet) 및 이들의 응결 가공 대용물.\n2. 비/브러시 제조용 묶음 규정 (주 제3호) :\n  - 동물의 털, 식물성 섬유 등이 소량 묶음 형태로 모여 정돈되어 있어, 나누지 않고 추가의 경미한 단순 트리밍/가공(바닥 평탄 절단 등)을 거쳐 바로 비나 브러시 형태로 완성될 수 있는 반제품을 말한다.\n3. 귀금속 등 고가 재료의 혼용 한계 (주 제4호) :\n  - 제9607호~제9614호, 제9616호~제9618호(지퍼, 볼펜, 라이터, 화장용 분무기 등)는 귀금속, 귀석, 반귀석이 전체 또는 일부에 다량 혼용되어 제작되어도 본 류에 분류된다.\n  - 단, 제9601호~제9606호, 제9615호(단추, 빗 등)는 이 고가 재료들이 단지 '경미한 부품(minor constituents)'(예: 모노그램, 테두리 장식 등)에만 제한적으로 사용된 것만 본 류에 분류하고, 주재료가 된 것은 71류로 분류한다.\n\n[제외 물품]\n- 화장용 아이라이너, 브로우 연필 (제33류)\n- 산(우산/양산)이나 지팡이용 손잡이/부분품 (제6603호)\n- 모조 신변장식용품(귀걸이, 목걸이 등) (제7117호)\n- 비금속제 범용 부분품 (나사, 경첩 등 - 제15부 주 제2호) 및 플라스틱제 유사 제품 (제39류)\n- 82류의 칼붙이(나이프 등)용으로 전용 설계된 조각용 손잡이/자루 단독 제시품 (제9601호 또는 제9602호 분류)\n- 안경테 (제9003호), 제도용 펜 (제9017호) 및 의료/치과용 특수 수술 브러시 (제9018호)\n- 시계 및 시계 케이스 (제91류), 악기용 조율/소제 브러시 및 부분품 (제92류), 무기류 부분품 (제93류)\n- 가구류(의자, 옷장 등 - 제94류) 및 완구/스포츠용 구슬/당구대/체스 (제95류)\n- 예술품, 수집품 및 제작 후 100년 초과 골동품 (제97류)" ,
  "contentEn": "Chapter 96 covers miscellaneous manufactured articles including worked carving materials (amber, ivory, shell), brooms, brushes, sieves, buttons, slide fasteners (zippers), writing instruments (ballpoint pens, pencils), lighters, smoking pipes, combs, scent sprays, sanitary pads/diapers, and monopods/tripods (heading 96.20).\n\n[Key Rules & Explanations]\n1. Vegetable/Mineral Carving Materials (Note 2) :\n  - Vegetable: nuts, seeds, shells used for carving (e.g. corozo or dom-palm).\n  - Mineral: natural amber, meerschaum, jet, and their agglomerations.\n2. Tufted/Bundled Materials (Note 3) :\n  - Animal hair or fibers pre-arranged in tufts or bundles ready for conversion into brooms or brushes without division.\n3. Precious Metal Limits (Note 4) :\n  - Items in headings 96.07 to 96.14, and 96.16 to 96.18 can incorporate precious metals or stones as major parts.\n  - However, items in headings 96.01 to 96.06, and 96.15 can only use precious metals/stones as minor decorative components.\n\n[Exclusions]\n- Cosmetic eye/brow pencils (Chapter 33).\n- Umbrella/walking-stick handles (heading 66.03).\n- Imitation jewelry (heading 71.17).\n- General-use screws and hardware (Section XV or Chapter 39).\n- Spectacle frames (heading 90.03), ruling pens (heading 90.17), and medical/dental surgical brushes (heading 90.18).\n- Antiques of Chapter 97."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 96 rules/general to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
