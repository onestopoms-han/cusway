const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6801",
  "titleKo": "68.01 - 포석ㆍ연석ㆍ판석[천연 석재로 한정하며, 슬레이트(slate)는 제외한다]",
  "titleEn": "68.01 - Setts, curbstones and flagstones, of natural stone (except slate).",
  "contentKo": "이 호에는 슬레이트(slate) 이외의 천연석(예: 사암ㆍ화강암ㆍ반암)을 도로ㆍ보도ㆍ이와 유사한 곳의 포장이나 경계선용으로 일반적으로 사용하는 모양으로 가공한 것을 분류하며 ; 이러한 물품은 다른 용도에 사용가능성이 있다 할지라도 이 호에 분류한다. 자갈ㆍ조약돌과 이와 유사한 도로포장용으로 적합한 모양이 아닌 돌은 제2517호에 분류한다.\n\n이 호의 물품은 채석장의 돌을 수공ㆍ기계가공에 의하여 분할ㆍ절단ㆍ조형함으로써 제조한다. 포석(sett)과 판석(flagstone)은 일반적으로 그 면이 직사각형(정사각형을 포함한다)이나 판석은 길이와 넓이에 비하여 두께가 얇으며, 포석은 거칠은 입방체형이거나 끝을 자른 피라미드 모양으로 되어 있다. 연석(curbstone)은 곧은 것도 있고 구부러진 것도 있으며 ; 이들의 횡단면은 보통 직사각형(정사각형은 제외한다)으로 되어 있다.\n\n이 호에는 비록 단순한 분할ㆍ절단ㆍ거칠게 네모형으로 만든 것이라 할지라도 포석ㆍ연석ㆍ판석으로 인정될 수 있는 형태의 돌을 포함하고 ; 이 호에는 또한 드레스된 것ㆍ부쉬된(bushed) 것ㆍ샌드드레스된(sand dressed) 것ㆍ연마된 것ㆍ모서리가 둥글게 된 것ㆍ모서리를 깎은 것(chamfered)ㆍ장부(tenoned)와 장붓구멍을 만든 것(mortised)ㆍ특수 도로용(예: 도로배수용, 차고의 출구용 등에 적합하게 만든 연석)에 적합하도록 특별히 가공한 석도 포함한다.\n\n이 호에는 콘크리트나 인조석재의 연석(제6810호)과 도자제의 판석(제69류)을 제외한다.",
  "contentEn": "This heading covers natural stone other than slate (e.g., sandstone, granite and porphyry) worked into the shapes commonly used for paving or bordering roads, pavements or the like; such stones remain in this heading even if they are also suitable for other uses. Shingle, pebbles and similar unshaped road metalling fall in heading 25.17.\n\nThe products of this heading are obtained by splitting, rough hewing or shaping quarry-stone, by hand or machine. Setts and flagstones usually have rectangular (including square) faces, but whereas flagstones are thin in relation to their length and width, setts are roughly cubical or take the form of truncated pyramids. Curbstones may be straight or curved; they are normally of rectangular (other than square) cross-section.\n\nThe heading includes stone in shapes identifiable as setts, curbstones or flagstones, even if obtained simply by splitting, sawing or roughly squaring; it also covers those which have been dressed, bushed, sand dressed, ground, rounded at the edges, chamfered, tenoned and mortised or specially worked for particular road uses (curbstones shaped to allow for road drainage or garage exits).\n\nThe heading excludes curbstones, etc., of concrete or artificial stone (heading 68.10) and ceramic flagstones (Chapter 69)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.01 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
