const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8446",
  "titleKo": "84.46 - 직기(직조기)",
  "titleEn": "84.46 - Weaving machines (looms).",
  "contentKo": "이 호에는 방직용 섬유사[이탄(peat)섬유를 포함한다]나 그 밖의 실(예: 금속으로 만든 실이나 유리나 석면으로 만든 실)을 사용하여 제조방법에 의하여 직물을 생산하는 직기를 포함한다.\n\n이들 기계에 있어서는 경사(warp yarn)와 위사(weft yarn)를 직물로 만들기 위하여 직각으로 교합직조 시키는 것이다.\n\n가장 간단한 직조방법에 있어서는 경사빔으로부터 풀려 나오는 시트 상태의 경사군은 한 가닥 건너 두 그룹으로 나누어지며, 각 그룹은 하네스(harness)에 의하여 제어하며 ; 이러한 하네스는 두 그룹의 실의 사이에 쉐드(shed)로 알려진 개구(angle)를 형성하기 위하여 교호적으로 경사를 올리거나 내리거나 하는 것이며, 이를 통하여 위사를 통과시키고 바디에 의하여 바로 위사를 때리는 위타운동이 이루어진다.\n\n보다 복잡한 직기는 일층 복잡한 직조 방식을 행하는 것이다. 예를 들면, 어떤 직조기(loom)에는 다수의 경사의 그룹이나 단하나의 경사까지도 제어하기 위한 경사의 상승운동의 특수한 제어기구[도비기(dobby)ㆍ자카드기 등]가 갖추어져 있으며 ; 또한 어떤 특수한 직물을 만들기 위하여 특수한 장치[레노기구 경파일(테리기)용장치ㆍ능라(broch\u00e9)직용 스위블식 셔틀(shuttle)장치]를 사용하기도 한다.\n\n직조기는 보통 평평한 직물을 만드는 것이나 관(管)상의 직물을 제조하는 원형 직조기도 있다. 여러 가지의 서로 다른 형식의 직조기는 그 직조기의 형이나 생산되는 직물의 양태에 따라 그 명칭이 붙여진다.\n\n또한 이 호에는 다음의 것을 포함한다.\n(1) 수직기(hand loom)\n(2) 섬유직물의 직기와 동일한 형식의 것으로서 와이어클로스나 금속이 섞인 실로 특수직물을 짜는 직기.\n다만, 여러 공정에 의하여 무거운 와이어 그릴(grill)이나 망의 형태로 와이어를 교합 직조하도록 설계된 기계는 제외한다(제8463호).\n\n부분품과 부속품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 따라 이 호에 해당되는 직기의 부분품과 부속품은 제8448호에 분류한다.",
  "contentEn": "This heading covers weaving machines (looms) for producing textile fabrics from yarns of natural, man-made or other fibres (including metal, glass or asbestos yarns).\n\nIt includes :\n(1) Hand looms.\n(2) Shuttle looms (power-driven looms using a shuttle).\n(3) Shuttleless looms (using air jets, water jets, rapier or projectile mechanisms).\n(4) Circular looms for tubular fabrics.\n(5) Wire-weaving looms for metal mesh or wire cloth.\n\nParts and accessories of these machines fall in heading 84.48."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.46 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
