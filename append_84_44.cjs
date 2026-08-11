const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8444",
  "titleKo": "84.44 - 인조섬유의 방사(紡絲)용ㆍ늘림(drawing)용ㆍ텍스처(texture)용ㆍ절단용 기계",
  "titleEn": "84.44 - Machines for extruding, drawing, texturing or cutting man-made textile materials.",
  "contentKo": "이 호에는 인조섬유의 제조용 기계를 분류하며 섬유의 절단용 기계를 포함한다.\n\n이들에는 다음의 것을 포함한다.\n(1) 인조섬유의 방사(紡絲)기\n(2) 연신기(drawing machine)\n(3) 합성섬유사의 텍스처링(texturing)용 기계\n(4) 스테이플파이버 절단기\n(5) “토우-투-톱(tow-to-top)”기계\n(6) 인열기(rupturing machine)\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품은 제8448호에 분류한다.\n\n이 호에는 다음의 것을 제외한다.\n(a) 인조방직용 섬유의 방사(紡絲)에 시공하기 위한 원료준비기계(제8419호나 제8477호)\n(b) 드로우(draw)박스와 길(gill)박스(제8445호)\n(c) 연속ㆍ불연속 유리섬유나 방적기(제8475호)",
  "contentEn": "This heading covers machines for extruding, drawing, texturing or cutting man-made textile materials.\n\nIt includes :\n(1) Spinning (extruding) machines for man-made fibres.\n(2) Drawing machines for stretching filaments.\n(3) Texturing machines (crimping yarn).\n(4) Staple fibre cutters.\n(5) \"Tow-to-top\" machines.\n(6) Rupturing machines.\n\nParts and accessories of these machines fall in heading 84.48.\n\nThe heading excludes :\n(a) Raw material preparation machinery (heading 84.19 or 84.77).\n(b) Draw boxes and gill boxes (heading 84.45).\n(c) Glass fibre spinning machines (heading 84.75)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.44 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
