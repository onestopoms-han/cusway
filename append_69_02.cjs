const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6902",
  "titleKo": "69.02 - 내화벽돌ㆍ내화블록ㆍ내화타일과 이와 유사한 건설용 내화 도자제품(규조토나 이와 유사한 규산질의 흙으로 만든 제품은 제외한다)",
  "titleEn": "69.02 - Refractory bricks, blocks, tiles and similar refractory ceramic constructional goods, other than those of siliceous fossil meals or similar siliceous earths.",
  "contentKo": "이 호에는 일반적으로 야금공업ㆍ화학공업ㆍ도자공업ㆍ유리공업과 그 밖의 공업에 사용하는 노(爐 : oven)ㆍ용광로(kiln)나 그 밖의 장치의 건설에서 사용하는 내화제품을 분류한다(그러나 제6901호의 것은 제외한다).\n\n이 호에는 특히 다음의 것을 포함한다.\n\n(1) 여러 가지 모양의 벽돌(평행육면체ㆍ쐐기꼴ㆍ원통형ㆍ반원통형 등). 이것에는 쐐기돌이나 그 밖의 특별한 모양의 벽돌[예: 탕도벽돌(runner brick)로서 한 면은 옴폭하고, 다른 면은 직선인 것]로서 제16부에 해당되는 공장이나 기계의 건설용으로 특별히 제작한 것이 명백하게 인정할지라도 이 호에 분류한다.\n\n(2) 바닥용ㆍ벽용ㆍ노용 등의 내화블록과 내화타일\n\n이 호에는 내화재료로 제조한 관(管)(tubingㆍpiping)(반원통형의 홈통을 포함한다)ㆍ앵글(angle)ㆍ벤드(bend)ㆍ이와 유사한 관(管)연결구류는 제외한다(제6903호).\n\n◦\n◦ ◦\n[소호해설]\n소호 제6902.10호\n이 소호에서 측정하여야 할 것은 산화마그네슘(MgO)ㆍ산화칼슘(CaO)ㆍ산화크로뮴(Cr2O3)의 함유량이다. 함유량은 보통 존재하는 원소[즉, 마그네슘ㆍ칼슘ㆍ크로뮴(chromium) 등]의 함량을 측정하여 이 함유량에 상응하는 산화물의 농도를 계산함으로써 구할 수 있다. 예를 들면, 칼슘 40%는 산화칼슘 56%와 동등하고 마그네슘 24%는 산화마그네슘 40%와 동등하다. 그래서 칼슘 40%(산화칼슘 56%와 동등하다)를 함유한 규산칼슘을 기본재료로 한 제품은 이 소호에 분류한다.",
  "contentEn": "This heading covers refractory constructional goods (other than those of heading 69.01) commonly used in the building of ovens, kilns or other plant for the metallurgical, chemical, ceramic, glass and other industries.\n\nThe heading includes, in particular :\n(1) Bricks of all shapes (parallelepipeds, wedge-shaped, cylindrical, semi-cylindrical, etc.), including keystones or other specially shaped bricks (e.g., runner bricks with one concave and one straight face), even if they are clearly identifiable as having been specially designed for the construction of plant or machinery of Section XVI.\n(2) Refractory blocks and tiles for flooring, walls, ovens, etc.\n\nThe heading excludes tubing, piping (including semi-cylindrical gutters), angles, bends and similar pipe fittings of refractory materials (heading 69.03).\n\nSubheading Explanatory Note.\nSubheading 6902.10\nFor the purposes of this subheading, the magnesium, calcium or chromium content is to be determined. The content is expressed as the equivalent concentration of magnesium oxide (MgO), calcium oxide (CaO) or chromium oxide (Cr2O3) respectively."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.02 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
