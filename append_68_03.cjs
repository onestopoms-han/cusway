const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6803",
  "titleKo": "68.03 - 가공한 슬레이트(slate)와 슬레이트(slate) 제품, 응결 슬레이트(slate)의 제품",
  "titleEn": "68.03 - Worked slate and articles of slate or of agglomerated slate.",
  "contentKo": "천연 슬레이트(natural slate)가 덩어리 모양인 것이나 분할ㆍ거칠게 절단하거나 네모지게 절단하거나 톱질에 의하여 네모지게 절단하여 블록(block) 모양ㆍ슬래브(slab) 모양ㆍ시트(sheet) 모양으로 된 것은 제2514호에 분류하고, 이 호에는 더 이상의 고도가공을 한 유사물품을 분류한다[예: 직사각형(정사각형을 포함한다) 이외의 모양으로 톱질한 것ㆍ절단한 것ㆍ연마한 것ㆍ광택을 낸 것ㆍ모서리를 깎아 사면으로 된 것ㆍ천공(穿孔)한 것ㆍ바니시(varnish) 칠한 것ㆍ에나멜 칠한 것ㆍ성형한 것ㆍ그 밖의 장식 등의 가공을 한 것].\n\n이 호에는 특히 광택가공이나 그 밖의 가공을 한 벽용 타일ㆍ판석ㆍ슬래브(slab)(포장용ㆍ건축용ㆍ화학설비용 등에 사용하는 것 등) ; 수통(trough)ㆍ저수통(reservoir)ㆍ세면대(basin)ㆍ하수구(sink) ; 낙수홈통석(guttering stone) ; 벽난로의 장식용석과 같은 물품도 포함한다.\n\n이 호에는 또한 특수한 모양(다각형ㆍ원 모양 등)뿐만 아니라 직사각형(정사각형을 포함한다) 모양의 지붕용, 벽단장용, 방습용으로 명백히 인정될 수 있는 슬레이트(slate)도 포함한다.\n\n이 호에는 또한 응결 슬레이트(agglomerated slate)의 제품도 포함한다.\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 인공적으로 착색하지 않은 슬레이트의 알갱이ㆍ조각ㆍ가루(제2514호)\n\n(b) 모자이크 큐브와 이와 유사한 물품, 인공적으로 착색한 슬레이트의 알갱이ㆍ조각ㆍ가루(제6802호)\n\n(c) 석필(slate pencil)(제9609호)ㆍ필기용 슬레이트ㆍ도화용 슬레이트(사용하도록 준비된 것)과 보드(틀의 유무에 상관없다)(제9610호)",
  "contentEn": "Whereas natural slate in blocks, sheets or slabs simply split, roughly hewn or squared by sawing (with square or rectangular faces) falls in heading 25.14, this heading covers more highly worked slates and articles of slate (for example, sawn or cut otherwise than rectangular (including square), ground, polished, chamfered, drilled, varnished, enamelled, moulded or otherwise decorated).\n\nThe heading includes wall tiles, paving flags and slabs (e.g., for roofing, construction or chemical plant); troughs, reservoirs, basins, sinks; guttering stones; and mantelpieces.\n\nIt also covers slates clearly identifiable for roofing, wall facing or damp-proof courses, whether rectangular (including square) or of special shapes (polygonal, circular, etc.).\n\nArticles of agglomerated slate are also classified here.\n\nThe heading excludes :\n(a) Slate granules, chippings and powder, not artificially coloured (heading 25.14).\n(b) Mosaic cubes and the like, and artificially coloured granules, chippings and powder of slate (heading 68.02).\n(c) Slate pencils (heading 96.09), and drawing or writing slates (heading 96.10)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.03 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
