const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_67.json';

const newEntry = {
  "hsCode": "6704",
  "titleKo": "67.04 - 가발ㆍ가수염ㆍ눈썹ㆍ속눈썹ㆍ스위치와 이와 유사한 것(사람 머리카락ㆍ동물의 털ㆍ방직용 섬유재료로 만든 것으로 한정한다), 사람 머리카락으로 된 제품(따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "67.04 - Wigs, false beards, eyebrows and eyelashes, switches and the like, of human or animal hair or of textile materials; articles of human hair not elsewhere specified or included.",
  "contentKo": "이 호에는 다음의 것을 분류한다.\n\n(1) 사람 머리카락ㆍ동물의 털ㆍ방직용 섬유재료로 만든 여러 가지 포스티쉬(postiche)의 제품ㆍ이러한 물품에는 가발ㆍ턱수염ㆍ눈썹ㆍ속눈썹ㆍ스위치(switch)ㆍ컬(curl)ㆍ시뇽(chignon)ㆍ콧수염ㆍ이와 유사한 것을 포함한다. 이러한 물품은 보통 개인 화장용의 보조물 용도나 직업용(예: 연예용 가발)으로 만든 고도의 세공품이다.\n\n이 범주에는 다음의 것을 제외한다.\n(a) 인형용 가발(doll's wig)(제9503호)\n(b) 카니발용품(보통 재료나 끝손질이 열악하다)(제9505호)\n\n(2) 사람 머리카락 제품[특히 사람 머리카락으로 만든 경량(輕量)의 직조물로 다른 호에 열거하거나 포함하지 않은 것]\n\n이 범주에는 다음의 것을 제외한다.\n(a) 제5911호의 사람 머리카락으로 만든 여과포(hair filtering or straining cloth)\n(b) 헤어네트(hair-net)(제6505호)\n(c) 사람 머리카락으로 만든 수동식의 체(hair hand sieve)(제9604호)",
  "contentEn": "This heading covers :\n\n(1) Postiche of all kinds, of human or animal hair or of textile materials, including wigs, false beards, eyebrows and eyelashes, switches, curls, chignons, moustaches and the like. These are usually high-quality articles for personal use or for professional purposes (e.g., theatrical wigs).\nThis category excludes :\n(a) Wigs for dolls (heading 95.03).\n(b) Carnival articles (usually of inferior material and finish) (heading 95.05).\n\n(2) Articles of human hair not elsewhere specified or included (in particular, lightweight fabrics of human hair).\nThis category excludes :\n(a) Filtering or straining cloth of human hair (heading 59.11).\n(b) Hair-nets (heading 65.05).\n(c) Hand sieves of human hair (heading 96.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 67.04 to chapter_67.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
