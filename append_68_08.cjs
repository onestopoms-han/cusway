const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6808",
  "titleKo": "68.08 - 패널ㆍ보드ㆍ타일ㆍ블록과 이와 유사한 물품[식물성섬유ㆍ짚ㆍ목재의 대팻밥ㆍ칩ㆍ파티클(particle)ㆍ톱밥이나 그 밖의 웨이스트(waste)를 시멘트ㆍ플라스터(plaster)나 그 밖의 광물성 결합재로 응결시킨 것으로 한정한다]",
  "titleEn": "68.08 - Panels, boards, tiles, blocks and similar articles of vegetable fibre, of straw or of shavings, chips, particles, sawdust or other waste, of wood, agglomerated with cement, plaster or other mineral binders.",
  "contentKo": "이 호에는 식물성 재료[식물성 섬유ㆍ목재울ㆍ우드칩ㆍ대팻밥이나 그 밖의 목재 웨이스트(waste)ㆍ톱밥ㆍ짚ㆍ갈대ㆍ골풀ㆍ크린 베지탈(crin végétal)]을 시멘트(염화마그네슘 시멘트를 포함한다)ㆍ플라스터(plaster)ㆍ석탄ㆍ규소소다와 같은 광물성 결합제로 응결ㆍ주조하여 만든 건축용ㆍ단열용ㆍ방음용ㆍ흡음용의 패널ㆍ보드ㆍ타일ㆍ블록(block) 등을 분류한다. 또한 이들은 광물성의 충전물(규산질토ㆍ마그네사이트ㆍ모래ㆍ석면)을 함유하고 있거나 금속으로 보강되어 있는 경우도 있다.\n\n이 호의 보드ㆍ패널 등은 모두가 비교적 가벼우나 단단하다. 그리고 식물성 재료를 결합제로 사용하여 만든 물품은 식물성 재료 본래의 특성을 그대로 내포하고 있다.\n\n이러한 물품들은 광물성 결합제로 응결시켰기 때문에 유기결합제로 응결시킨 제4410호의 파티클보드(particle board)나 제4411호의 섬유판(fibreboard)와 혼동하여서는 안된다. 이 호에는 또한 응결시킨 코르크(cork)(제4504호)와 제6811호의 물품도 제외한다.",
  "contentEn": "This heading covers panels, boards, tiles, blocks, etc., for building, heat-insulating or sound-insulating purposes, obtained by agglomerating and moulding vegetable materials (vegetable fibres, wood wool, wood chips, shavings or other wood waste, sawdust, straw, reeds, rushes, crin végétal, etc.) with mineral binders such as cement (including magnesian cement), plaster, lime or sodium silicate. They may also contain mineral fillers (siliceous earths, magnesite, sand, asbestos) or be reinforced with metal.\n\nThese boards, panels, etc., are relatively light but rigid. The vegetable material preserves its natural characteristics.\n\nAs they are agglomerated with mineral binders, they must not be confused with particle board of heading 44.10 or fibreboard of heading 44.11, which are agglomerated with organic binders. The heading also excludes agglomerated cork (heading 45.04) and articles of heading 68.11."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.08 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
