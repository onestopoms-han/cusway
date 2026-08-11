const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9113",
  "titleKo": "91.13 - 휴대용 시곗줄ㆍ휴대용 시계밴드ㆍ휴대용 시계팔찌와 이들의 부분품",
  "titleEn": "91.13 - Watch straps, watch bands and watch bracelets, and parts thereof.",
  "contentKo": "이 호에는 손목시계를 손목에 고정하기 위한 모든 종류의 시곗줄, 시계밴드, 시계팔찌 및 이들의 구성 부분품을 분류한다. 시계 완제품과 별개로 단독 제시되는 것에 한해 이 호에 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 귀금속제 또는 귀금속을 입힌 금속제 시곗줄/밴드/팔찌(제9113.10호) : 금, 은, 백금으로 제작된 메탈 밴드 및 보석류 장식이 부착된 것.\n- 비금속(卑金屬)제 시곗줄/밴드/팔찌(금/은 도금 여부 불문)(제9113.20호) : 스테인리스강, 황동, 알루미늄 등으로 제작된 메탈 밴드 및 익스팬션(신축식) 밴드.\n- 기타 재질제 시곗줄/밴드/팔찌(제9113.90호) : 천연가죽, 재생가죽, 플라스틱(우레탄, 실리콘 등), 직물(나일론 등)로 제작된 시곗줄 및 밴드.\n- 시곗줄의 전용 부분품(재질 불문).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 손목시계 완제품과 함께 제시되는 시곗줄(장착 여부를 불문하고 시계 완제품과 함께 제9101호 또는 제9102호로 분류)\n(b) 넥 체인(목걸이형 체인), 펜던트 밴드, 회중시계용 체인 (해당 재질별로 71류 등 분류)\n(c) 단독 제시되는 귀금속제 버클 및 버클 걸쇠 (제7115호)\n(d) 단독 제시되는 비금속제 버클 및 버클 걸쇠 (제8308호)" ,
  "contentEn": "This heading covers all types of watch straps, watch bands, and watch bracelets (devices for securing watches to the wrist), and parts thereof, when presented separately.\n\nIt includes :\n- Watch straps, bands, or bracelets of precious metal or metal clad with precious metal (subheading 9113.10).\n- Watch straps, bands, or bracelets of base metal, whether or not gold- or silver-plated (subheading 9113.20).\n- Other watch straps, bands, or bracelets (leather, plastics, textiles) (subheading 9113.90).\n- Parts thereof of any material.\n\nExcludes straps presented together with their watches (heading 91.01 or 91.02), pocket watch chains (Chapter 71), and separate buckles of precious metal (heading 71.15) or base metal (heading 83.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.13 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
