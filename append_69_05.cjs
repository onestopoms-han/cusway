const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6905",
  "titleKo": "69.05 - 기와ㆍ굴뚝통ㆍ굴뚝갓ㆍ굴뚝용 내장재ㆍ건축용 장식품과 그 밖의 도자제의 건설용품",
  "titleEn": "69.05 - Roofing tiles, chimney-pots, cowls, chimney liners, architectural ornaments and other ceramic constructional goods.",
  "contentKo": "이 호에는 보통 도자제의 것이지만 다소간 유리질화 되었으며 벽돌과 같이 건설용ㆍ건축용에 사용하는 비내화성제품(non-refractory goods)을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n\n(1) 기와[지붕용ㆍ윗부분 벽(topping wall) 피복용] : 이 물품은 일반적으로 돌기가 있거나 못을 박기 위한 구멍이 있으며 또한 연결하도록 성형한 경우도 있다. 이러한 점에서 제6907호의 타일과는 구별한다. 이것에는 평평하거나 반원통형의 것이 있으며 처마ㆍ지붕ㆍ마룻대ㆍ추녀마루ㆍ지붕의 골 등에 사용하는 특수 모양의 것도 있다.\n\n(2) 굴뚝통ㆍ굴뚝갓ㆍ굴뚝용 내장재ㆍ연도용 블록(flue-block) 등\n\n(3) 건축물ㆍ벽ㆍ문 등에 사용하는 건축용 장식품[예: 코니스(cornice)와 프리즈(frieze)] ; 지붕의 낙수구 ; 석루조ㆍ장미 모양의 장식ㆍ난간ㆍ돌출부를 버티기 위한 장치ㆍ주두, 박공벽ㆍ처마ㆍ지붕마룻대와 지붕용 장식품 등\n\n(4) 그 밖의 건설용 도자제품(예: 환기용 창살 ; 천장의 석고 플라스터(plaster)를 처리할 때 지지물로 사용하는 클레이라스(clay-lath)로서 금속 망목(mesh)의 교점에 소성한 점토로 만든 십자 모양ㆍ판을 부착하였고 주성분을 소성 점토로 만든 것)\n\n이러한 물품은 평면의 것ㆍ모래(砂)로 장식한 것ㆍ슬립을 피복한 것ㆍ덩어리 상태에서 착색된 것ㆍ다른 재료를 침투시킨 것ㆍ유약처리한 것ㆍ골지게한(ribbed) 것ㆍ홈과 도관이 있는 것ㆍ그 밖의 성형에 의하여 장식한 것인지에 상관없이 이 호에 분류한다.\n\n이 호에는 특히 빗물배수관과 같은 관(管)ㆍ홈통ㆍ이와 유사한 물품은 건설용으로 사용한다 할지라도 제외한다(제6906호).",
  "contentEn": "This heading covers non-refractory ceramic goods (other than those of Chapter 68 or heading 69.01 or 69.02) commonly used for roofing, chimneys, architectural decoration, or other constructional purposes.\n\nThe heading includes :\n(1) Roofing tiles (for roofs or topping walls). They generally have projections or nail holes, or are shaped to interlock, which distinguishes them from paving or wall tiles of heading 69.07.\n(2) Chimney-pots, cowls, chimney liners, flue-blocks, etc.\n(3) Architectural ornaments (e.g., cornices, friezes, gargoyles, rose ornaments, balustrades, capitals, finials, ridge ornaments).\n(4) Other constructional goods (e.g., ventilating grilles; clay-laths consisting of wire mesh with baked clay crossings used as a support for plaster).\n\nThese articles may be plain, sand-faced, slip-covered, coloured in the mass, impregnated, glazed, ribbed, grooved, or otherwise decorated.\n\nThe heading excludes pipes, gutters and similar runoff fittings, even if for constructional use (heading 69.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.05 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
