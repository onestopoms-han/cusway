const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6910",
  "titleKo": "69.10 - 도자제의 설거지통ㆍ세면대ㆍ세면대용 받침ㆍ목욕통ㆍ비데ㆍ수세식 변기통ㆍ수세식 변기용 물통ㆍ소변기와 이와 유사한 위생용 물품",
  "titleEn": "69.10 - Ceramic sinks, wash basins, wash basin pedestals, baths, bidets, water closet pans, flushing cisterns, urinals and similar sanitary fixtures.",
  "contentKo": "이 호에는 가정 등의 장소에 영구적으로 고정되는 보통 관수용 설비(water system)이나 하수용의 설비(sewage system)에 연결되도록 설계한 부속물을 분류한다. 그러므로 이것은 유약처리나 장시간의 소성(燒成)에 의하여 물이 스며들지 않도록 만들어져야 한다[예: 석기제품ㆍ토기제품)ㆍ내화점토 위생제품ㆍ모조자기제품ㆍ유리질의 자기제품]. 이러한 부속물에 추가하여 이 호에는 변소용이나 세면소용의 물탱크도 포함한다.\n\n도자제의 수세식 변기용 물통은 이 호에 분류하며 기계장치를 갖춘 것인지에 상관없다.\n\n그러나 이 호에는 욕실용이나 위생용의 작은 부속품 즉, 비누용 접시ㆍ스펀지 바구니ㆍ칫솔걸이ㆍ수건걸이ㆍ화장지걸이 등은 벽에 부착하도록 설계된 종류의 것이라 하더라도 이 호에서 제외하며 이동식 위생용품, 즉, 요강ㆍ소변기ㆍ실내용변기 등도 이 호에서 제외하며 ; 이러한 물품은 제6911호나 제6912호에 분류한다.",
  "contentEn": "This heading covers fixtures designed to be permanently fixed, generally in houses, etc., and to be connected to water or sewage systems. They must be made impermeable to water by glazing or hard firing (e.g., stoneware, earthenware, sanitary fireclay, imitation porcelain or vitreous china). The heading also covers flushing cisterns for water closets, whether or not equipped with their mechanisms.\n\nThe heading excludes small bathroom or toilet fittings (such as soap dishes, sponge baskets, toothbrush holders, towel rails, toilet paper holders), even if designed for fixing to walls, and portable sanitary articles (such as chamber pots, bedpans); these fall in heading 69.11 or 69.12."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.10 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
