const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6805",
  "titleKo": "68.05 - 천연ㆍ인조의 연마용 가루나 알갱이를 방직용 섬유재료ㆍ종이ㆍ판지나 그 밖의 재료에 부착한 물품(특정한 모양으로 절단ㆍ봉합한 것인지 또는 그 밖의 방법으로 만든 제품인지에 상관없다)",
  "titleEn": "68.05 - Natural or artificial abrasive powder or grain, on a base of textile material, of paper, of paperboard or of other materials, whether or not cut to shape or sewn or otherwise made up.",
  "contentKo": "이 호에는 분쇄된 천연ㆍ인조의 연마 재료를 글루(glue)나 플라스틱으로 방직용 섬유재료ㆍ종이ㆍ판지ㆍ벌커나이즈드 파이버(vulcanised fibre)ㆍ가죽이나 그 밖의 재료에 도포(塗布)시킨 롤 모양이나 특정 모양으로 자른 것[시트ㆍ띠ㆍ스트립(strip)ㆍ디스크(disc)ㆍ세그먼트 등], 실 모양이나 끈 모양의 것을 분류한다. 이 호에는 또한 연마 재료를 전체적으로 균일하게 살포되어 있으며 결합물질로 방직용 섬유에 부착시킨 부직포로 만든 비슷한 물품도 포함한다. 사용하는 연마 재료에는 금강사가루ㆍ강옥가루ㆍ탄화규소가루ㆍ석류석가루ㆍ부석가루ㆍ부싯돌가루ㆍ석영가루ㆍ모래가루ㆍ유리의 가루 등을 포함한다. 띠 모양ㆍ디스크(disc) 모양 등은 봉합하거나, 접착하거나 그 밖의 방법으로 만드는데 ; 이 호에는 예를 들면, 목재 등으로 만든 블록(block)이나 스트립 위에 연마지나 연마포를 고착시켜 만든 연마봉과 같은 공구도 포함한다. 그러나 이 호에는 경질(硬質) 재료의 지지물(예: 판지ㆍ목재ㆍ금속)의 위에 연마재료의 가루 모양이나 알갱이 모양이 아닌 조밀한 응결층을 부착하여 만든 그라인딩휠(grinding wheel)과 이와 유사한 수공구는 제외한다(제6804호).\n\n이 호에는 해당되는 물품은 주로 금속ㆍ목재ㆍ코르크ㆍ유리ㆍ가죽ㆍ고무[경화된 것인지에는 상관없다)ㆍ플라스틱 재료 등을 손이나 기계적으로 평활하게 하거나 크리닝하기 위하여 사용하며 ; 니스칠이나 래커칠을 한 표면의 평활용ㆍ연마용으로도 사용하며 카드 크로싱(card clothing)을 벼리게 하기 위하여 사용하기도 한다.",
  "contentEn": "This heading covers rolls, sheets, bands, strips, discs, segments, etc., of crushed natural or artificial abrasive powder or grain, glued or otherwise bonded with glue or plastics onto a backing of textile material, paper, paperboard, vulcanised fibre, leather or other materials. It also covers similar articles made of nonwovens in which the abrasive material is uniformly dispersed throughout the mass and bonded to the textile fibres by the binding substance.\n\nThe abrasives used include emery, corundum, silicon carbide, garnet, pumice, flint, quartz, sand, and glass powder. The bands, discs, etc., may be sewn, glued or otherwise made up. The heading includes, for example, polishing sticks (buff-sticks) made by gluing abrasive paper or cloth onto blocks or strips of wood, etc. However, the heading excludes grindstones, grinding wheels and similar hand tools consisting of a compact agglomerated layer of abrasive (not merely powder or grain) on a rigid support of paperboard, wood, metal, etc. (heading 68.04).\n\nThe goods of this heading are used mainly for smoothing or cleaning metals, wood, cork, glass, leather, rubber (hardened or not) or plastics, or for polishing varnished or lacquered surfaces, or for sharpening card clothing."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.05 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
