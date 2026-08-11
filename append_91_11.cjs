const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9111",
  "titleKo": "91.11 - 휴대용 시계의 케이스와 그 부분품",
  "titleEn": "91.11 - Watch cases and parts thereof.",
  "contentKo": "이 호에는 제9101호 또는 제9102호에 분류되는 휴대용 시계(손목시계, 회중시계 등)의 외장용 케이스(무브먼트가 없는 빈 상태이며, 유리의 장착 여부는 불문) 및 그 구성 부분품들을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 귀금속제 또는 귀금속을 입힌 금속제 케이스(제9111.10호).\n- 비금속(철강, 니켈, 황동 등)제 케이스(금/은 도금 여부 불문)(제9111.20호).\n- 기타 재질(플라스틱, 세라믹, 가죽 등)제 케이스(제9111.80호).\n- 케이스의 부분품(제9111.90호) :\n  - 케이스의 보디(body, 본체) : 시계줄 고정용 러그(돌출부)나 고정용 스프링 바(봉) 결합부 포함.\n  - 베젤(bezel) : 시계 유리를 고정하고 지지하기 위해 홈이 파여진 테두리.\n  - 뒷덮개(bottom, 백 케이스) 및 내부 보호용 중간덮개(dome).\n  - 회중시계용 펜던트, 워치보우(고리), 부싱.\n\n[참고사항]\n- 시계 케이스 및 부분품의 구성 재료는 비금속뿐만 아니라 귀금속, 플라스틱, 아이보리, 마노, 자개 등이 모두 포함된다.\n- 뒷면(백 케이스)이 스테인리스강이고 전면 본체가 귀금속인 조립식 케이스는 비금속제 케이스로 취급하여 제9111.20호 또는 제9111.80호 계열에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 탁상시계 및 벽시계용 클록 케이스 (제9112호)\n(b) 단순 보호용 시계 커버 및 외장 파우치 (재질별 분류)\n(c) 범용성 부분품(나사, 스프링, 비금속제 핀 등) (제15부 또는 제39류)" ,
  "contentEn": "This heading covers watch cases (presented without movements, with or without glasses) for the watches of heading 91.01 or 91.02, and parts thereof.\n\nIt includes :\n- Watch cases of precious metal or metal clad with precious metal (subheading 9111.10).\n- Watch cases of base metal, whether or not gold- or silver-plated (subheading 9111.20).\n- Other watch cases (plastics, ceramics, etc.) (subheading 9111.80).\n- Parts of watch cases (subheading 9111.90) including bodies (lugs/bars), bezels, case backs, inner domes, pendants, and bows.\n\nExcludes clock cases (heading 91.12), protective pouches (classified by material), and screws/springs of general use."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.11 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
