const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8477",
  "titleKo": "84.77 - 고무나 플라스틱을 가공하거나 이들 재료로 제품을 제조하는 기계(이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "84.77 - Machinery for working rubber or plastics or for the manufacture of products from these materials, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 고무나 플라스틱을 가공하거나 이들 재료로 제품을 제조하는 기계를 분류하며, 이 류에 따로 분류하지 않은 것에 한정한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 고무나 플라스틱용 성형기 (타이어 성형기, 이너튜브 성형기 등, 단 제8480호 등의 주형은 제외)\n(2) 이너튜브(inner tube)의 밸브구멍 절단기\n(3) 특수한 고무실 절단기기\n(4) 고무나 플라스틱의 성형 프레스 (사출성형기, 취입성형기, 진공성형기 등)\n(5) 열가소성 가루 성형용 특수 프레스\n(6) 축음기판(레코드판) 제조용 프레스\n(7) 벌커나이즈드 파이버(vulcanised fibre) 제조용 기계\n(8) 압출기(extruder)\n\n부분품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 반도체 조립 과정에서 패키징/캡슐화(encapsulation)하는 몰딩 기계 (제8486호)",
  "contentEn": "This heading covers machinery for working rubber or plastics or for the manufacture of products from these materials, not specified or included elsewhere in this Chapter.\n\nIt includes :\n(I) Injection-moulding machines, extruders, blow-moulding machines, vacuum-moulding and other thermoforming machines.\n(II) Machinery for moulding/retreading pneumatic tyres or other inner tube moulding machines.\n(III) Presses for moulding rubber or plastics (including phonograph record presses).\n(IV) Vulcanised fibre manufacturing machinery.\n(V) Thread-cutting machines for rubber.\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Encapsulation machinery used in semiconductor assembly (heading 84.86)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.77 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
