const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8454",
  "titleKo": "84.54 - 전로ㆍ레이들(ladle)ㆍ잉곳(ingot)용 주형과 주조기(야금용이나 금속 주조용으로 한정한다)",
  "titleEn": "84.54 - Converters, ladles, ingot moulds and casting machines, of a kind used in metallurgy or in metal foundries.",
  "contentKo": "(A) 전로(轉爐 : converter)\n용융되었거나 고온으로 된 재료를 산소 기류에 의하여 유동시켜 금속을 전환, 정제하는 장치이다. LD전로, OBM전로, 회전식 원통형 전로 등을 포함한다.\n\n(B) 레이들(ladle)\n노(爐)로부터 용융 금속을 받아 전로나 주형에 주입하는 용기이다. 내화재료로 내장된 개구형 용기로 경사/주입 장치가 부착되어 있다. 수동식 레이들도 포함하지만, 귀금속/주석 세공인용 소형 레이들은 제외한다(제7325호 또는 제7326호).\n\n(C) 잉곳(ingot)용 주형\n용융 금속을 일시적으로 잉곳, 피그, 슬래브 등으로 주조하는 금속제 주형을 말한다.\n다만, 완성품 주조용 주형(제8480호) 및 탄소/흑연/도자재료 잉곳 주형(제6815호, 제6903호)은 제외한다.\n\n(D) 주조기(casting machine)(야금용이나 금속 주조용으로 한정)\n(1) 주형 연속 충전, 냉각 및 배출 기계\n(2) 압력주조기 (비철금속용 소형 주조기 등)\n다만, 금속가루 소결 압축 성형기(제8462호)는 제외한다.\n(3) 원심주조기 (관형 제품 주조용)\n(4) 연속주조기 (잉곳 주형, 냉각 분사 장치, 컨베이어 롤러, 절단 장치 등을 갖춘 연속식 기계)\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 이 호의 기계의 부분품도 포함한다.",
  "contentEn": "This heading covers converters, ladles, ingot moulds and casting machines, of a kind used in metallurgy or in metal foundries.\n\nIt includes :\n(I) Converters (e.g., Bessemer converters, LD/OBM oxygen converters, rotary converters).\n(II) Ladles (refractory-lined vessels for carrying molten metal).\n(III) Ingot moulds of metal (used to cast steel ingots, slabs, billets, etc.).\n(IV) Casting machines (pressure-casting, centrifugal-casting and continuous-casting machines).\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Moulds for casting other articles (heading 84.80).\n(b) Carbon, graphite or ceramic ingot moulds (heading 68.15 or 69.03).\n(c) Sintering metal powder presses (heading 84.62)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.54 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
