const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6502",
  "titleKo": "65.02 - 모체(hat-shape)[각종 재료로 만든 스트립(strip)을 엮거나 결합하여 만든 것으로서 미성형인 것, 차양을 붙이지 않은 것, 안을 대지 않거나 장식하지 않은 것으로 한정한다]",
  "titleEn": "65.02 - Hat-shapes, plaited or made by assembling strips of any material, neither blocked to shape, nor with made brims, nor lined, nor trimmed.",
  "contentKo": "이 호에는 미성형의 모체ㆍ차양을 붙이지 않은 모체ㆍ안을 대지 않은 모체ㆍ장식하지 않은 모체(hat-shape)로서 다음과 같이 만든 것을 분류한다.\n\n(1) 섬유나 여러 가지 재료[특히 짚ㆍ갈대ㆍ종려섬유ㆍ라피아(raffia)ㆍ사이잘(sisal)ㆍ종이 스트립ㆍ플라스틱 스트립ㆍ나무의 스트립]의 스트립을 엮은 것. 이 재료는 섬유나 스트립의 일조를 모자의 윗부분 중심으로부터 방사 모양으로 배열하면서 이들과 결합되게 다른 섬유나 스트립을 나선 모양으로 감아서 “엮은 것(plaiting)”을 포함하며 여러 가지 방법으로 엮을 수가 있다. 중심으로부터 거리가 멀어짐에 따라 엮는데 사용하는 섬유나 스트립을 더 추가해 나간다. 또는\n\n(2) 이 류의 주 제2호를 제외하고, 여러 가지의 재료의 스트립(strip)[예: 엮은 것이나 펠트(felt), 그 밖의 방직용 섬유의 직물ㆍ모노필라멘트나 플라스틱의 엮은 스트립이나 그 밖의 스트립](보통 폭이 5㎝ 이하)를 결합한 것, 이것은 보통 모자의 윗부분에서부터 시작하여 이 스트립을 나선형으로 봉합하거나(나선 모양의 스트립이 각각 그 앞의 것과 중복되게 하는 방법으로), 엮은 것을 나선형으로 배열하면서 그 톱니 모양의 단을 서로 맞붙여 실로 결합하여 만들어지는 것이다.\n\n이 호의 모체(hat-shape)는 스트립(strip)을 엮거나 결합하는 방법으로 제조되기 때문에 제6501호의 물품과는 달리 종종 윗부분과 차양 사이에 한계선이 생기며 간혹 이 두 부분의 사이가 거의 직각이 되는 경우가 있다. 이러한 모체(hat-shape)는 간혹 그대로 사용하며(예: 해변이나 시골용) 이 물품은 성형되지도 않고 차양을 붙이지도 않은 것이므로 안을 대지 않은 것이나 장식하지 않은 것이면 이 호에 분류한다.\n\n이 물품은 일반적으로 성형한 것과 구별하는데, 뒤의 경우는 보통 성형의 결과 윗부분이 타원형으로 된다(제6504호의 해설 참조).\n\n이 호의 분류는 염색ㆍ표백ㆍ재단ㆍ조물의 돌출된 끝을 고정시키는 가공뿐만 아니라 표백ㆍ염색 등의 가공을 거친 후 단순히 제품의 원형을 복원하기 위한 약간의 가공(예: round opening)한 것으로는 영향을 받지 않는다.\n\n그러나 이 호의 미성형의 모체(hat-shape)에 안을 대거나 장식을 하게 되면 제6504호에 분류한다는 점을 유의하여야 할 것이다.",
  "contentEn": "This heading covers unblocked, brimless, unlined and untrimmed hat-shapes (hat bodies) obtained by :\n\n(1) Plaiting fibres or strips of various materials (in particular, straw, reeds, raffia, sisal, paper strips, plastic strips, or wood strips). Plaiting can be carried out in various ways; it includes the process in which a set of fibres or strips is arranged radially from the center of the crown and is bound by another fibre or strip wound in a spiral.\n\n(2) Subject to Note 2 to this Chapter, assembling strips (usually not exceeding 5 cm in width) of various materials (e.g., plaits, felt, other textile fabrics, or monofilaments or strips of plastics). These are usually assembled by sewing the strips in a spiral starting from the center of the crown.\n\nUnlike the articles of heading 65.01, the hat-shapes of this heading, being made by plaiting or by assembling strips, often show a line of demarcation between the crown and the brim. These hat-shapes are sometimes used as they are (e.g., for beach or country wear), and provided they are neither blocked to shape, nor have made brims, nor are lined or trimmed, they fall in this heading.\n\nThey are generally distinguished from blocked hat-shapes by the fact that the latter have an oval crown produced by blocking (see Explanatory Note to heading 65.04).\n\nClassification in this heading is not affected by operations such as bleaching, dyeing, cutting, or securing the projecting ends of the plaiting, or slight shaping (e.g., round opening) to restore the shape after bleaching or dyeing.\n\nThe heading excludes hat-shapes which have been blocked, or have made brims, or are lined or trimmed (heading 65.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.02 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
