const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9112",
  "titleKo": "91.12 - 클록(clock) 케이스, 이 류의 그 밖의 물품에 사용되는 이와 유사한 유형의 케이스와 이들의 부분품",
  "titleEn": "91.12 - Clock cases and cases of a similar type for other goods of this Chapter, and parts thereof.",
  "contentKo": "이 호에는 탁상시계, 벽시계, 자명종시계, 차량/항공기용 대시보드 시계, 선박용 크로노미터, 타임레코더, 타임레지스터, 타임스위치 등 휴대용 시계를 제외한 91류 대형 시계 및 시간 기록 기기용 케이스(외장 캐비닛/하우징)(유리 장착 여부 불문) 및 그 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 완제 클록 케이스(제9112.20호) : 금속(귀금속 포함), 목재, 플라스틱, 가죽, 대리석, 설화석고, 세라믹, 자개 등으로 제조된 클록 케이스.\n- 클록 케이스의 부분품(제9112.90호) : 유리를 끼우는 베즐(bezel), 프레임(뼈대), 케이스 지지대/스탠드, 받침대/각(脚).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 휴대용 손목시계 및 회중시계용 시계 케이스 (제9111호)\n(b) 단순 전자기기나 과학 계측기 형상을 하여 시계 전용으로 볼 수 없는 범용 하우징/케이스 (해당 기기 호에 분류)\n(c) 단독 제시되는 유리제 시계 보호 돔/커버 (제7020호)\n(d) 범용성 부분품(나사, 경첩, 고정용 핀, 금속 스프링 등) (제15부 또는 제39류)" ,
  "contentEn": "This heading covers cases (presented without movements, with or without glasses) for clocks (table, wall, alarm, or instrument panel clocks), marine chronometers, time-recorders, and time switches, and parts thereof.\n\nIt includes :\n- Clock cases (subheading 9112.20) of metal, wood, plastics, stone (marble, onyx), ceramics, or leather.\n- Parts of clock cases (subheading 9112.90) including bezels, frames, stands, and feet.\n\nExcludes watch cases (heading 91.11), separate glass protective covers (heading 70.20), and screws/springs of general use."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.12 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
