const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9100",
  "titleKo": "제91류 - 시계와 그 부분품 (총설 및 주 규정)",
  "titleEn": "Chapter 91 - Clocks and watches and parts thereof (General Notes & Rules)",
  "contentKo": "제91류는 주로 시각을 측정하거나 시간에 관련된 효과를 내는 기기(휴대용 시계, 스톱워치, 벽시계, 자명종, 타임리코더, 타임스위치 등)와 그 부분품을 분류한다.\n\n[주요 정의 및 분류 기준]\n1. 휴대용 시계의 무브먼트(Movement) 기준 (주 제3호) :\n  - 조정장치(밸런스휠, 헤어스프링, 수정진동자 등)로 조정되고, 표시부 또는 표시부를 내장할 수 있는 기구를 갖춘 것으로서, 두께 12mm 이하 및 폭/길이/지름 50mm 이하로 한정한다.\n  - 두께 측정 시 나사, 너트 등 튀어나온 부분은 제외하고 문자판 지지면부터 가장 먼 평면까지의 거리를 기준으로 한다.\n2. 귀금속 케이스 휴대용 시계의 분류 (주 제2호) :\n  - 케이스 전부가 귀금속 또는 귀금속을 입힌 금속으로 된 것, 진주나 귀석/반귀석을 결합한 것은 제9101호에 분류한다. 비금속에 귀금속을 박은(clad) 케이스는 제9102호로 분류한다.\n\n[제외 물품]\n- 시계용 유리 및 추 (재질에 따라 분류)\n- 휴대용 시계의 귀금속제 체인 (제7113호 또는 제7117호)\n- 범용성 부분품 (제15부 주 제2호의 금속제 범용 부분품 또는 제39류의 플라스틱 제품)\n- 시계용 무브먼트가 내장되지 않은 단순 완구용/크리스마스트리 장식용 시계 (제95류)\n- 해시계, 모래시계, 물시계 (재질별 분류)\n- 탈진기(escapement)가 없는 구동장치 모터 (제8412호), 볼베어링 (제8482호)" ,
  "contentEn": "Chapter 91 covers instruments designed mainly for measuring time or effecting a relation to time (watches, clocks, timers, time switches) and their parts.\n\n[Key Definitions & Rules]\n1. Watch Movement Definition (Note 3) :\n  - Regulated by a balance-wheel, hairspring, quartz crystal, or other intervals-determining device, with a display or a mechanism for mechanical display.\n  - Dimensions must be: thickness <= 12 mm, and width/length/diameter <= 50 mm.\n2. Precious Metal Cases (Note 2) :\n  - Watches with cases wholly of precious metal or metal clad with precious metal (or incorporating natural/cultured pearls, precious/semi-precious stones) are classified under heading 91.01. Cases of base metal inlaid with precious metal fall in heading 91.02.\n\n[Exclusions]\n- Clock/watch glasses and weights (classified by material).\n- Watch chains (heading 71.13 or 71.17).\n- Parts of general use (screws, springs of base metal - Section XV or plastics - Chapter 39).\n- Toy clocks or Christmas tree decorations without clock movements (Chapter 95).\n- Sun dials, sand glasses, and water clocks (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 91 rules/general to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
