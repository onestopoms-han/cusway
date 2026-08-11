const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8455",
  "titleKo": "84.55 - 금속 압연기와 그 롤",
  "titleEn": "84.55 - Metal-rolling mills and rolls therefor.",
  "contentKo": "(I) 압연기(rolling mill)\n압연기는 주로 금속이 그 사이를 통과하는 일련의 롤러로 구성되어 금속을 가공하는 기계이다. 금속은 롤러에 의하여 주어진 압력에 의하여 압연이나 성형되는 동시에 금속의 조직을 바꾸어 그 품질을 개선한다.\n금속 이외의 재료를 압연하는 캘린더기(제8420호), 벤딩/접기/교정/플래트닝 기계(제8462호) 등은 제외한다.\n압연기에는 다음과 같은 작업용이 있다.\n(A) 두께를 줄이고 길이를 늘이기 위한 압연 (잉곳, 블룸, 빌릿, 슬래브 등)\n(B) 특정 단면의 형으로 만들기 위한 압연 (봉, 로드, 앵글, 형재, 레일 등)\n(C) 관(管)을 압연 제조하는 것\n(D) 차륜용 반제품이나 테의 반제품 압연\n열간(熱間)압연용과 냉간(冷間)압연용이 모두 포함된다.\n\n관 압연 및 차륜 압연기류 :\n(1) 빌릿 구멍 뚫기용 만네스만(Mannesmann)기 및 유사 기계\n(2) 구멍 뚫린 빌릿용 압연기\n(3) 관 완성가공 압연기\n(4) 대구경 주강관용 레이디얼(radial) 압연기\n(5) 차륜이나 원반 압연기\n\n(II) 롤(roll)과 그 밖의 부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 금속 압연기의 부분품도 이 호에 분류한다. 압연기용의 롤(rolls)은 주철, 주조 또는 단조한 단철로 만들어지며 표면이 경화 처리되고 정밀하게 가공되어 있다. 평탄하거나 홈이 파여 있다.",
  "contentEn": "This heading covers metal-rolling mills and rolls therefor.\n\nIt includes :\n(I) Metal-rolling mills of all types (hot-rolling mills, cold-rolling mills, tube-rolling mills, Mannesmann piercing mills, wheel-rolling mills).\n(II) Rolls for rolling mills (made of cast iron, cast steel or forged steel, either plain or grooved).\n(III) Other parts of metal-rolling mills.\n\nThe heading excludes :\n(a) Calendering machines for materials other than metal (heading 84.20).\n(b) Metal bending, folding, straightening or flattening machines (heading 84.62)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.55 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
