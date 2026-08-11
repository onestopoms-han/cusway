const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_64.json';

const newEntry = {
  "hsCode": "6405",
  "titleKo": "64.05 - 그 밖의 신발류",
  "titleEn": "64.05 - Other footwear.",
  "contentKo": "이 류의 주 제1호와 제4호에 따르는 것을 제외하고, 이 호에는 이 류의 이전 호에서 언급하지 않은 재료나 재료의 조합으로 만든 바깥바닥과 갑피(甲皮)를 가진 모든 신발류를 분류한다.\n\n이 호에는 특히 다음의 것을 포함한다.\n\n(1) 바깥바닥을 고무나 플라스틱으로 만들고 갑피(甲皮)를 고무ㆍ플라스틱ㆍ가죽ㆍ방직용 섬유재료 이외의 재료로 만든 신발류\n\n(2) 바깥바닥을 가죽이나 콤퍼지션레더(composition leather)로 만들고 갑피(甲皮)를 가죽이나 방직용 섬유재료 이외의 재료로 만든 신발\n\n(3) 바깥바닥을 목재ㆍ코르크(cork)ㆍ끈ㆍ로프ㆍ판지ㆍ모피ㆍ방직용 섬유재료ㆍ펠트(felt)ㆍ부직포ㆍ리놀륨(linoleum)ㆍ라피아(raffia)ㆍ짚ㆍ수세미 등으로 만든 신발류. 이러한 신발의 갑피(甲皮)는 어떤 재료라도 상관없다.\n\n이 호에는 제6401호부터 제6405호까지에 설명된 신발로 되어있지 않거나 신발의 본질적인 특성을 갖추지 않은 신발 부분품의 조립물[예: 안창(inner sole)에 부착하거나 부착하지 않은 갑피(甲皮)]를 제외한다(제6406호).",
  "contentEn": "Subject to Note 1 and 4 to this Chapter, this heading covers all footwear which has outer soles and uppers of a material or combination of materials not referred to in the preceding headings of this Chapter.\n\nThe heading includes, in particular :\n\n(1) Footwear with outer soles of rubber or plastics, and uppers of materials other than rubber, plastics, leather or textile materials;\n\n(2) Footwear with outer soles of leather or composition leather, and uppers of materials other than leather or textile materials;\n\n(3) Footwear with outer soles of wood, cork, twine or rope, paperboard, furskin, textile materials, felt, nonwovens, linoleum, raffia, straw, loofah, etc. The uppers of such footwear may be of any material.\n\nThe heading excludes assemblies of footwear parts (e.g., uppers, whether or not affixed to an inner sole) which have not been made up to, or do not have the essential character of, footwear described in headings 64.01 to 64.05 (heading 64.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 64.05 to chapter_64.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
