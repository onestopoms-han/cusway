const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8484",
  "titleKo": "84.84 - 개스킷(gasket)과 이와 유사한 조인트(금속 외의 재료와 결합한 금속판으로 만든 것이나 금속을 두 개 이상 적층한 것으로 한정한다), 재질이 다른 것을 세트로 하거나 소포장한 개스킷(gasket)과 이와 유사한 조인트(작은 주머니와 봉투에 넣은 것이나 이와 유사한 포장을 한 것으로 한정한다), 메커니컬 실(mechanical seal)",
  "titleEn": "84.84 - Gaskets and similar joints of metal sheeting combined with other material or of two or more layers of metal; sets or assortments of gaskets and similar joints, dissimilar in composition, put up in pouches, envelopes or similar packings; mechanical seals.",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n\n(A) 복합 금속 개스킷 및 조인트\n(i) 석면, 펠트, 판지 등 비금속성 재료의 심(core)을 두 매의 금속판 사이에 끼운 것.\n(ii) 비금속성 재료를 절단하여 외연부와 구멍 주변부를 금속판으로 싼 것.\n(iii) 동종 또는 이종의 금속박을 적층하여 압축시킨 것.\n주로 전동기, 펌프, 관 접합에 사용한다. 금속 선/거즈로 보강된 석면 단독 제품은 제외한다(제6812호).\n\n(B) 세트 또는 소포장한 이종 재질 개스킷 세트\n서로 다른 재료(코르크, 가죽, 고무, 판지, 석면 등)로 된 개스킷이나 조인트를 소포장(봉투, 박스 등)한 것으로서, 반드시 2가지 이상의 이종 재질 개스킷이 포함되어야 한다. 동일 재질로만 구성된 세트는 재질에 따라 분류한다 (예: 판지 개스킷만 든 팩은 제4823호).\n\n(C) 메커니컬 실(mechanical seal)\n슬라이딩 링 실, 스프링 링 실 등 평면과 회전면 사이에서 기밀을 유지하는 기계적 조립품이다.\n(i) 고정부품(fixed part) 및 (ii) 가동부품(movable part - 회전소자, 스프링 등)으로 구성되는 복잡한 구조를 가진다. 펌프, 압축기, 믹서, 교반기, 터빈 등에 사용된다.\n\n이 호에는 다음의 것도 제외한다.\n(a) 단일 재질로 된 개스킷 및 조인트 (재질에 따라 분류)\n(b) 기계용 패킹 (예: 석면 끈 패킹 제6812호)\n(c) 오일 실 링(oil seal ring)(제8487호)",
  "contentEn": "This heading covers composite gaskets and joints of metal sheeting, assortments of dissimilar gaskets in packings, and mechanical seals.\n\nIt includes :\n(I) Gaskets of metal sheeting combined with other materials (asbestos, felt, paperboard) or of laminated metal layers.\n(II) Sets or assortments of gaskets of different materials (e.g., rubber, cork, leather, plastics) put up in envelopes, pouches or boxes.\n(III) Mechanical seals (sliding-ring seals, spring-ring seals) incorporating fixed and movable components for high-pressure sealing in pumps, compressors, mixers, and turbines.\n\nThe heading excludes :\n(a) Gaskets of a single material (classified by constituent material).\n(b) Asbestos cord packing (heading 68.12).\n(c) Oil seal rings of heading 84.87."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.84 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
