const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8548",
  "titleKo": "85.48 - 기기의 전기식 부분품(이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "85.48 - Electrical parts of machinery or apparatus, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 제85류의 다른 호나 품목분류표 전체의 다른 호에 규정되지 않고, 특정 기계나 기기에 전용/주로 사용되지 않는 일반 용도의 기기용 전기식 부분품(접속자, 절연부분, 권선 코일 등을 가진 것)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 특정 기기(예: 모터, 발전기 등)에 전용/주사용되는 부분품 (각 해당 기기의 부분품 호 또는 제8503호, 제8538호 등)\n(b) 제85류의 다른 호에 명시된 부분품 (예: 애자 제8546호, 절연물품 제8547호, 전선 제8544호 등)\n(c) 제16부 주 제1호의 제외 규정에 해당하는 물품 (비금속제 기계식 부품류 등)\n(d) 수명이 다해 폐기되는 폐일차전지, 폐일차전지팩, 폐축전지 (제8549호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.48 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
