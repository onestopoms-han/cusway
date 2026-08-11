const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6809",
  "titleKo": "68.09 - 플라스터(plaster) 제품이나 플라스터(plaster)를 기본 재료로 조합한 제품",
  "titleEn": "68.09 - Articles of plaster or of compositions based on plaster.",
  "contentKo": "이 호에는 플라스터(plaster) 제품이나 플라스터 재료(착색한 것인지에 상관없다)로 만든 제품을 분류한다. 예: 스투코(stucco)[플라스터를 글루용액과 혼합하여 주조한 것으로서 표면이 간혹 대리석의 외관을 가지고 있는 것]ㆍ파이버러스 플라스터[토우(tow) 등의 조각으로 보강된 플라스터로서 일반적으로 젤라틴(gelatin)이나 글루(glue)의 용액이 혼합되는 것]ㆍ명반 플라스터(Keene's cement나 English cement로 호칭되기도 한다)ㆍ이와 유사한 조제품으로서 그 주성분이 플라스터인 것(방직용 섬유ㆍ목재 섬유ㆍ톱밥ㆍ모래ㆍ석회ㆍ슬래그(slag)ㆍ인산염 등을 함유하고 있는 경우도 있다)\n\n이러한 물품들에는 염색한 것ㆍ바니시(varnish) 칠한 것ㆍ왁스칠 한 것ㆍ래커칠 한 것ㆍ청동색으로 만든 것ㆍ금색이나 은색으로 만든 것(공정이 어떤 것인지에는 상관없다), 때로는 아스팔트로 도포(塗布)한 것일 수 있으며 ; 보강한 것도 포함한다. 이 호에는 공장건설에 사용하는 패널ㆍ보드ㆍ시트(sheet)ㆍ타일(때로 판지로 입힌 것도 포함한다)도 포함하며 ; 그리고 단조물ㆍ조상(彫像)ㆍ작은 조각상ㆍ로제트(rosette)ㆍ기둥(column)ㆍ접시ㆍ꽃병ㆍ장식물ㆍ공업용 주형 등의 주조제품도 포함한다.\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 플라스터를 도포(塗布)한 골절용의 붕대로서 소매용인 것(제3005호)과 플라스터로 만든 골절용 부목(제9021호)\n\n(b) 제6806호나 제6808호의 플라스터(plaster)로 응결한 패널 등\n\n(c) 제9023호의 해부학 모형ㆍ결정모형ㆍ기하학 모형ㆍ모형지도ㆍ주로 전시용으로 제작한 그 밖의 모형\n\n(d) 마네킹 인형(tailor's dummy) 등(제9618호)\n\n(e) 오리지널 조각과 조상(彫像)(제9703호)",
  "contentEn": "This heading covers articles made of plaster or compositions based on plaster (whether or not artificially coloured). These include stucco (plaster mixed with glue solution, often mimicking marble), fibrous plaster (plaster reinforced with hair, tow, etc., and mixed with gelatin or glue), alum plaster (Keene's cement, English cement) and similar preparations consisting essentially of plaster (which may contain textile fibres, wood fibres, sawdust, sand, lime, slag, phosphates, etc.).\n\nThese articles may be dyed, varnished, waxed, lacquered, bronzed, gilded, silvered, or coated with asphalt. They may also be reinforced. The heading includes building panels, boards, sheets, tiles (sometimes faced with paperboard); and cast or moulded articles such as mouldings, statues, statuettes, rosettes, columns, dishes, vases, ornaments, industrial moulds, etc.\n\nThe heading excludes :\n(a) Plaster-coated bandages for fractures, put up for retail sale (heading 30.05), and plaster splints (heading 90.21).\n(b) Panels, etc., of plaster agglomerated as in heading 68.06 or 68.08.\n(c) Anatomical, crystallographic or geometric models, relief maps and other models mainly for demonstration purposes (heading 90.23).\n(d) Mannequins, etc. (heading 96.18).\n(e) Original sculptures and statuary (heading 97.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.09 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
