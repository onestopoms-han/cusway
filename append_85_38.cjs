const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8538",
  "titleKo": "85.38 - 부분품(제8535호ㆍ제8536호ㆍ제8537호의 기기에 전용되거나 주로 사용되는 것으로 한정한다)",
  "titleEn": "85.38 - Parts suitable for use solely or principally with the apparatus of heading 85.35, 85.36 or 85.37.",
  "contentKo": "이 호에는 제8535호, 제8536호, 제8537호의 기기(전기 개폐기, 퓨즈, 커넥터, 계전기, 배전반 등)에 전용되거나 주로 사용되는 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 기기(스위치, 퓨즈 등)가 장착되지 않은 빈 상태의 배전반용 보드, 패널, 캐비닛, 데스크 등 (제8537호의 기기 제조용 전용 구조물에 한정, 소호 제8538.10호).\n- 스위치, 퓨즈, 계전기, 배전반용 기타 구조 및 기계 부품(금속 접점, 가동 핀, 하우징, 빈 스위치 박스 쉘 등, 소호 제8538.90호).\n\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 완전히 절연성 재료로만 만들어진 고정/조립용 절연 피팅 부품 (제8547호)\n(b) 단순 절연 애자 (제8546호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.38 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
