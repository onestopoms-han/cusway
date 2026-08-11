const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6911",
  "titleKo": "69.11 - 자기제의 식탁용품ㆍ주방용품ㆍ그 밖의 가정용품ㆍ화장용품",
  "titleEn": "69.11 - Tableware, kitchenware, other household articles and toilet articles, of porcelain or china.",
  "contentKo": "제6912호 해설을 참조할 것.",
  "contentEn": "See Explanatory Note to heading 69.12."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.11 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
