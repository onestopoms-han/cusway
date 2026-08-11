const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9110",
  "titleKo": "91.10 - 완전한 시계의 무브먼트(movement)(미조립이나 부분적으로 조립된 것으로 한정한다)(무브먼트세트), 불완전한 시계의 무브먼트(movement)(조립된 것으로 한정한다), 러프(rough)한 시계의 무브먼트(movement)",
  "titleEn": "91.10 - Complete watch or clock movements, unassembled or partly assembled (movement sets); incomplete watch or clock movements, assembled; rough watch or clock movements.",
  "contentKo": "이 호에는 완제품 시계 케이스에 내장되기 전의 미완성, 미조립 또는 조립 도중의 시계 무브먼트를 분류한다. 분류 범위에는 무브먼트 세트(Chablon), 불완전 조립 무브먼트, 러프 무브먼트(Ebauches)가 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 휴대용 시계의 것(제9110.11~19호) :\n  - 완전한 무브먼트(미조립이나 부분적으로 조립한 것)(무브먼트 세트 chablon)(제9110.11호) : 시계 조립용 무브먼트 구성 부품 전체가 세트로 구성된 것(문자판과 바늘 유무 불문).\n  - 불완전한 무브먼트(조립된 것)(제9110.12호) : 탈진기(escapement)나 기어 브리지 등이 결여된 채 조립된 기계식 무브먼트, 또는 배터리/회로 구성요소 일부가 결여된 채 조립된 전자식 무브먼트.\n  - 러프 무브먼트(rough movement)(제9110.19호) : 판(plate), 브리지, 기어 트레인, 태엽통(barrel) 등 무브먼트의 뼈대를 이루는 미조립 기계 부품들(단, 탈진기, 밸런스 휠, 헤어스프링, 배터리, 문자판, 지침은 결여된 것).\n- 기타 대형 클록의 것(무브먼트 세트, 불완전 조립, 러프)(제9110.90호).\n\n[주요 정의]\n- chablon (무브먼트 세트) : 완전한 시계 무브먼트 1개를 완전히 조립할 수 있는 모든 구성 요소를 키트(Kit) 형태로 한 데 모아놓은 세트.\n- rough movement (러프 무브먼트, 에보슈 ebauches) : 기어 트레인과 지판/브리지 등 기본 구조의 기계 부품만 모인 것(핵심 조정계통인 탈진기/밸런스휠이 제외된 상태)." ,
  "contentEn": "This heading covers watch or clock movements that are complete but unassembled (movement sets or chablons), incomplete but assembled, or rough movements (ebauches).\n\nIt includes :\n- Watch movements (subheadings 9110.11 to 9110.19) :\n  - Complete movements, unassembled or partly assembled (movement sets or chablons) (9110.11).\n  - Incomplete movements, assembled (9110.12) lacking certain main components like the escapement or electronic circuit components.\n  - Rough movements (ebauches) (9110.19) consisting of plates, bridges, and trains, but without escapement, balance wheel, mainspring, or dial.\n- Clock movements of the above categories (subheading 9110.90)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.10 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
