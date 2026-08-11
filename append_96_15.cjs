const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9615",
  "titleKo": "96.15 - 빗ㆍ헤어슬라이드(hair-slide)와 이와 유사한 물품ㆍ머리핀ㆍ컬링핀(curling pin)ㆍ컬링그립(curling grip)ㆍ헤어컬러(hair curler)와 이와 유사한 물품(제8516호에 해당하는 물품은 제외한다)과 이들의 부분품",
  "titleEn": "96.15 - Combs, hair-slides and the like; hairpins, curling pins, curling grips, hair-curlers and the like, other than those of heading 85.16, and parts thereof.",
  "contentKo": "이 호에는 머리를 정돈하거나 신변을 장식하는 화장용 빗, 장식 빗(dress comb), 헤어핀, 머리 집게 및 헤어슬라이드, 비전열식 헤어컬러(구루프) 및 그 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 빗/헤어슬라이드 및 이와 유사한 물품(제9615.11~19호) :\n  - 경화고무 또는 플라스틱으로 만든 것(제9615.11호) : 플라스틱제 헤어 빗, 꼬리빗, 정발용 빗, 장식 빗 및 플라스틱 헤어핀/헤어클립/머리 집게.\n  - 기타(제9615.19호) : 금속, 목재, 상아, 자개, 귀갑(거북껍질), 뼈 재질의 빗 및 헤어슬라이드.\n- 기타 머리 장식 및 컬링용구(제9615.90호) :\n  - 일반 금속제 머리핀(u핀, 실핀, 바비핀).\n  - 헤어컬러(hair curler) 및 컬링핀/그립(구루프) : 플라스틱/금속제 원통형 헤어롤(직물이나 고무 피복 여부 불문, 전열 가열식 제외).\n  - 말/개 등 동물 손질용 빗.\n\n[주요 분류 기준]\n- 귀금속, 진주, 보석류 등이 장식 빗/헤어슬라이드 주성분으로 결합된 제품은 제외되어 제71류에 분류된다. 단, 귀금속이 단순 모노그램, 테두리, 이니셜 등 경미한 부분에만 부착된 것은 본 호에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 내부에 전기 가열 장치(히터)를 내장하거나 콘센트에 연결하여 쓰는 가열식 헤어컬러 및 전동 헤어브러시 (제8516호)\n(b) 방직용 섬유 직물 재질로 만든 단순 머리띠(헤드밴드 headband) 및 밴드 (제11부)\n(c) 단독 제시되는 헤어브러시 (제9603호)" ,
  "contentEn": "This heading covers toilet combs (including animal combs), dress combs, hair-slides, hairpins, non-electric hair-curlers (rollers), curling grips, and their parts.\n\nIt includes :\n- Combs and hair-slides of hard rubber or plastics (subheading 9615.11) or of other materials like wood, metal, ivory, or tortoise-shell (subheading 9615.19).\n- Hairpins (bobby pins, U-pins) and non-electric hair curlers (rollers, grips) (subheading 9615.90).\n\nExcludes electric hair curlers/rollers (heading 85.16), textile headbands (Section XI), and hair brushes (heading 96.03). Falls in Chapter 71 if precious metals or stones are present as major components (not minor constituents)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.15 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
