const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6811",
  "titleKo": "68.11 - 석면시멘트 제품ㆍ셀룰로오스파이버시멘트 제품이나 이와 유사한 것",
  "titleEn": "68.11 - Articles of asbestos-cement, of cellulose fibre-cement or the like.",
  "contentKo": "이 호에는 주로 상호 친화성이 있는 섬유류[예: 석면ㆍ셀룰로오스(cellulose)ㆍ그 밖의 식물성섬유ㆍ합성중합체ㆍ유리섬유ㆍ금속섬유]와 시멘트나 그 밖의 수경성(水硬性) 접착제의 혼합물로 된 단단한 제품을 분류하며, 섬유류는 강화재로 사용한다. 이러한 물품에는 아스팔트ㆍ타르 등을 포함하는 것도 있다.\n\n이러한 제품은 일반적으로 섬유ㆍ시멘트ㆍ물로 된 혼합물의 얇은 층을 압축하여 제조하거나, 성형(가능한 한 가압 하에서)ㆍ압축이나 압출에 의하여 제조하다.\n\n이 호에는 앞에서 설명한 방법으로 만든 시트(sheet)(크기와 두께에는 상관없다)와 이러한 시트를 절단하여 만든 제품이나 고착하기 전에 압축ㆍ성형ㆍ구부려서 만든 제품을 포함한다[예: 지붕용ㆍ외장용ㆍ칸막이용 시트와 타일 ; 가구 제조용의 시트 ; 창턱 ; 신호판ㆍ문자ㆍ숫자 ; 울타리용의 막대 ; 물결 모양의 판 ; 저수통ㆍ수통ㆍ세면대ㆍ하수구 ; 관(管)용의 접합부 ; 패킹용의 와셔와 조인트(joint) ; 조각을 모조한 패널 ; 용마루 타일ㆍ낙수홈통ㆍ창틀 ; 화분 ; 환기용이나 그 밖의 관(管)ㆍ케이블 도관 ; 연돌의 갓 등].\n\n이들 모든 제품에는 전체적으로 착색된 것ㆍ바니시(varnish) 칠한 것ㆍ인쇄한 것ㆍ에나멜 칠한 것ㆍ장식한 것ㆍ천공(穿孔)한 것ㆍ깍은 것ㆍ평평하게 한 것ㆍ평활하게 한 것ㆍ연마한 것이나 그 밖의 가공을 한 것이 있으며 또한 금속 등으로 보강된 것도 있다.",
  "contentEn": "This heading covers hardened articles consisting essentially of a mixture of cement or other hydraulic binders and fibres (e.g., asbestos, cellulose, other vegetable fibres, synthetic polymers, glass or metal fibres), which act as reinforcing agents. Some of these articles may also contain asphalt, tar, etc.\n\nThese articles are generally manufactured by compressing thin layers of a mixture of fibres, cement and water, or by moulding (possibly under pressure), pressing or extruding.\n\nThe heading includes sheets of all sizes and thicknesses, and articles obtained by cutting these sheets or by pressing, moulding or bending them before they harden (e.g., roofing, facing or partition sheets and tiles; sheets for furniture; window sills; signboards, letters, numbers; fencing posts; corrugated plates; reservoirs, troughs, basins, sinks; pipe joints; packing washers and joints; imitation carved panels; ridge tiles, gutters, window frames; flower pots; ventilation or other pipes, cable conduits; cowl caps for chimneys, etc.).\n\nAll these articles may be coloured in the mass, varnished, printed, enamelled, ornamented, perforated, shaved, planed, smoothed, polished or otherwise worked, and they may be reinforced with metal."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.11 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
