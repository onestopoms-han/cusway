const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9700",
  "titleKo": "제97류 - 예술품․수집품․골동품 (총설 및 주 규정)",
  "titleEn": "Chapter 97 - Works of art, collectors' pieces and antiques (General Notes & Rules)",
  "contentKo": "제97류는 회화, 콜라주, 모자이크(제9701호), 오리지널 판화(제9702호), 오리지널 조각/조상(제9703호) 등 오리지널 순수 예술품과 사용된 우표류(제9704호), 학술적/역사적 수집품 및 표본(제9705호), 제작 후 100년을 초과한 골동품(제9706호)을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 관세율표 상 최우선 적용 분류 (주 제5호가목) :\n  - 주 제1호부터 제4호에 의하여 제외되는 경우를 제외하고는, 제97류(97.01~97.05) 요건에 충족하는 물품은 관세율표의 다른 류에 우선하여 이 류로 전량 분류한다(예: 100년 넘은 가구는 94류가 아닌 9706호 골동품에 분류).\n2. 예술품의 정의 및 범위 제한 (주 제2호, 제3호, 제4호) :\n  - 대량생산된 복제품, 주조품, 상업적 성격의 복제 미술품은 제9701호(회화/모자이크) 및 제9703호(조각)에서 배제하여 해당 용품의 제조 재질별 호에 분류한다.\n  - 오리지널 판화(제9702호) : 기계적/사진제판 공정을 배제하고, 예술가가 손으로 직접 흑백/원색 원판에 가공하여 찍어낸 판화로 한정한다.\n3. 액자(틀)의 분류 (주 제6호) :\n  - 회화, 판화 등의 액자(틀)가 해당 예술 작품과 함께 제시되고, 가격과 종류가 해당 작품에 걸맞은 적정 수준인 경우 예술 작품과 함께 일괄 분류한다. 가격이 지나치게 고가이거나 비정상적인 액자는 별도로 분리하여 재질별 호(예: 금제 액자 -> 71류)에 분류한다.\n4. 연령(100년 초과) 판단 기준 :\n  - 제9701호부터 제9705호까지에 해당하는 예술품, 우표, 수집품 등은 제작 후 100년을 초과한 것이라 할지라도 9706호 골동품이 아닌 각 해당하는 호(제9701호~제9705호)에 우선적으로 분류한다.\n\n[제외 물품]\n- 사용하지 않은 우표, 수입인지, 우편엽서 (제4907호)\n- 연극용 배경용으로 그림을 그린 배경막 캔버스 (제5907호, 단 100년 초과품은 제9706호 분류)\n- 가공하지 않거나 단순히 다듬은 천연/양식진주, 귀석, 반귀석 (제7101호부터 제7103호까지)" ,
  "contentEn": "Chapter 97 covers original works of art (paintings, collages, mosaics, engravings, sculptures), postage stamps, collectors' pieces of scientific/historical interest, and antiques over 100 years old.\n\n[Key Rules & Explanations]\n1. Priority of Classification (Note 5(a)) :\n  - Goods meeting the definitions of headings 97.01 to 97.05 are classified in Chapter 97, taking precedence over any other chapter in the Nomenclature (e.g. 100-year-old furniture under 97.06 rather than Chapter 94).\n2. Commercial Reproductions Excluded (Note 2 & 4) :\n  - Mass-produced reproductions, casts, or commercial copies are excluded from headings 97.01 and 97.03 (classified by material).\n3. Original Prints (Note 3) :\n  - Restricts heading 97.02 to prints made directly by hand from plates created by the artist, excluding mechanical/photolithographic prints.\n4. Classification of Frames (Note 6) :\n  - Frames presented with paintings or prints are classified together if their value and type are appropriate to the artwork. Unsuitable/extremely costly frames are classified separately.\n5. Age Criteria :\n  - Items of headings 97.01 to 97.05 remain in those headings even if they are more than 100 years old (heading 97.06 is a residual category for other antiques).\n\n[Exclusions]\n- Unused postage stamps, revenue stamps, or postal stationery (heading 49.07).\n- Painted theatrical backcloths (heading 59.07, unless qualifying under 97.06).\n- Pearls, precious, or semi-precious stones (headings 71.01 to 71.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 97 rules/general to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
