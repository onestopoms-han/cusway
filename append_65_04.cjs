const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6504",
  "titleKo": "65.04 - 모자[각종 재료로 만든 스트립(strip)을 엮거나 결합하여 만든 것으로 한정하며, 안을 댄 것인지 또는 장식한 것인지에 상관없다]",
  "titleEn": "65.04 - Hats and other headgear, plaited or made by assembling strips of any material, whether or not lined or trimmed.",
  "contentKo": "이 호에는 주로 제6502호의 모체(hat-shape)로 만든 모자류를 분류하며 모자를 성형한 후 이미 만든 차양을 붙였거나 안을 대거나 장식한 것이다.\n\n이러한 모체(hat-shape)는 보통 젤라틴ㆍ풀ㆍ고무풀 등을 칠하여 보강한 후에 주형(matrix) 위에 압축이나 다리미질을 하여 성형한다. 성형과정 중에 크라운 오프닝(crown opening)은 필요한 크기의 타원형으로 되며 동시에 차양은 더욱 뚜렷하게 만들어진다.\n\n성형 후 차양을 필요한 모양으로 만든다.\n\n성형한 모체(hat-shape)는 성형하지 않은 모체(제6502호)와 혼동해서는 안 된다. 뒤의 것은 간혹 장식하지 않은 그대로(해변이나 시골에서) 사용한다.\n\n모자류는 성형과 차양 형성 후 적당한 추가 가공(예: 안을 대거나 머리띠ㆍ모자띠ㆍ모자 턱끈ㆍ조화ㆍ과실이나 잎ㆍ핀(pin)ㆍ새의 깃털과 같은 장식품의 부착)을 할 수도 있다.\n\n위의 물품 이외에 이 호에는 다음의 것도 분류한다.\n\n(1) 제6502호의 모체(hat-shape)로 모자상이 만든 여러 가지 형태의 모자류로서 성형하지 않은 것과 차양이 없는 것\n\n(2) 여러 가지 재료의 스트립(strip)[제6502호의 모체(hat-shape)를 나선형으로 봉합한 것으로 직접 모자로 쓸 수 있는 것은 제외한다]를 결합하여 직접 만든 모자류\n\n(3) 제6502호의 모체(hat-shape)를 단순히 성형한 것이나 차양을 붙인 것과 성형하지 않고 차양이 없지만 안을 대거나 장식(리본ㆍ끈 등)한 모체",
  "contentEn": "This heading covers hats and other headgear made mainly from the hat-shapes of heading 65.02. These shapes are blocked, or have made brims, or are lined or trimmed.\n\nThe hat-shapes are usually stiffened (with gelatin, glue, size, etc.) and then blocked by pressing or ironing on a matrix. During this blocking process, the crown opening is formed to the required oval shape, and the brim is defined.\n\nThe brim is then finished to the required shape.\n\nBlocked hat-shapes must not be confused with unblocked shapes (heading 65.02), which are sometimes worn as they are (e.g., for beach or country wear) without further processing.\n\nAfter blocking and brim formation, the headgear may undergo further operations (e.g., lining, or fitting with headbands, hatbands, chinstraps, or trimmings such as artificial flowers, fruit, foliage, pins, feathers, etc.).\n\nIn addition, this heading includes :\n\n(1) Hats and other headgear of various shapes, neither blocked to shape nor with made brims, made by milliners from the hat-shapes of heading 65.02;\n\n(2) Hats and other headgear made directly by assembling strips of any material (other than those obtained simply by sewing strips in spirals, which remain in heading 65.02);\n\n(3) Hat-shapes of heading 65.02 which have been simply blocked or have made brims, or which, neither blocked to shape nor with made brims, are lined or trimmed (with ribbons, cords, etc.)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.04 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
