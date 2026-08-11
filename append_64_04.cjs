const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_64.json';

const newEntry = {
  "hsCode": "6404",
  "titleKo": "64.04 - 신발류[바깥 바닥을 고무ㆍ플라스틱ㆍ가죽ㆍ콤퍼지션레더 (composition leather)로 만들고, 갑피(甲皮)를 방직용 섬유재료로 만든 것으로 한정한다]",
  "titleEn": "64.04 - Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of textile materials.",
  "contentKo": "이 호에서는 갑피(甲皮)[총설 (D) 참조]를 방직용 섬유재료로 만들고 바깥 바닥[총설 (C) 참조]은 제6403호의 신발류(제6403호 해설 참조)와 같은 재료로 만든 신발류를 분류한다.",
  "contentEn": "This heading covers footwear with uppers of textile materials (see General Explanatory Note, paragraph (D)) and outer soles (see General Explanatory Note, paragraph (C)) of the same materials as the footwear of heading 64.03 (see Explanatory Note to that heading)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 64.04 to chapter_64.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
