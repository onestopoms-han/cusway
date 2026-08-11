const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_64.json';

const newEntry = {
  "hsCode": "6403",
  "titleKo": "64.03 - 신발류[바깥 바닥을 고무ㆍ플라스틱ㆍ가죽ㆍ콤퍼지션레더(composition leather)로 만들고, 갑피(甲皮)를 가죽으로 만든 것으로 한정한다]",
  "titleEn": "64.03 - Footwear with outer soles of rubber, plastics, leather or composition leather and uppers of leather.",
  "contentKo": "이 호에는 갑피(甲皮)[총설 (D) 참조]를 가죽으로 만들고 바깥 바닥[총설 (C) 참조]은 다음의 것으로 만든 신발류를 분류한다.\n\n(1) 고무(제40류의 주 제1호에서 정의한 것)\n\n(2) 플라스틱\n\n(3) 고무나 플라스틱의 표면층이 육안으로 식별 가능한 직물이나 그 밖의 방직용 섬유제품(색채의 변화는 고려하지 않는다)[이 류의 주 제3호가목와 총설 (E) 참조]\n\n(4) 가죽(이 류의 주 제3호나목 참조)\n\n(5) 콤퍼지션레더(composition leather)[제41류의 주 제3호에 의하여 “콤퍼지션레더(composition leather)”는 가죽이나 가죽섬유를 기본 재료로 한 물질에 한정한다]",
  "contentEn": "This heading covers footwear with uppers of leather (see General Explanatory Note, paragraph (D)) and outer soles (see General Explanatory Note, paragraph (C)) of :\n\n(1) Rubber (as defined in Note 1 to Chapter 40);\n\n(2) Plastics;\n\n(3) Woven fabrics or other textile products with an external layer of rubber or plastics being visible to the naked eye, no account being taken of any resulting change of colour (see Note 3 (a) to this Chapter and General Explanatory Note, paragraph (E));\n\n(4) Leather (see Note 3 (b) to this Chapter);\n\n(5) Composition leather (within the meaning of Note 3 to Chapter 41; \"composition leather\" is restricted to materials based on leather or leather fibres)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 64.03 to chapter_64.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
