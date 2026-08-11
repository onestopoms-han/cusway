const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8478",
  "titleKo": "84.78 - 담배의 조제기나 제조기(이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "84.78 - Machinery for preparing or making up tobacco, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 담배의 조제기나 제조기로서 이 류에 따로 분류하지 않은 것으로 한정한다.\n타작분리기(threshing separator) 속에서 잎을 조각내는 비팅 해머(beating hammer)와 금속 격자 장치를 이용하여, 공기의 흐름을 통해 더 가벼운 잎과 무거운 엽맥(줄기)을 분리한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 담배의 잎을 벗기거나(stripping) 절단하는 기계\n(2) 시가(cigar)나 궐련(cigarette) 제조기계 (보조포장장치를 갖춘 것인지에 상관없다)\n\n부분품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품도 이 호에 분류한다.",
  "contentEn": "This heading covers machinery for preparing or making up tobacco, not specified or included elsewhere in this Chapter.\n\nIt includes :\n(I) Tobacco leaf stripping or cutting machines.\n(II) Cigar or cigarette making machines (whether or not incorporating auxiliary packaging devices).\n(III) Threshing separators (using beating hammers, metallic grills and air flows to separate leaves from heavier stems).\n\nParts of these machines are also covered."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.78 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
