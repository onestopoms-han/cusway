const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9103",
  "titleKo": "91.03 - 휴대용 시계의 무브먼트(movement)를 갖춘 클록(clock)(제9104호의 것은 제외한다)",
  "titleEn": "91.03 - Clocks with watch movements, excluding clocks of heading 91.04.",
  "contentKo": "이 호에는 휴대용 시계의 무브먼트(주 제3호의 기준인 두께 12mm 이하 및 가로/세로/직경 50mm 이하인 무브먼트)를 갖추고 있으나, 착용하거나 휴대하지 않고 고정해 놓고 사용하는 시계(클록 clock)를 분류한다. 대표적으로 탁상시계, 자명종시계, 여행용 알람시계 등이 해당한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기구동식 클록(제9103.10호) : 쿼츠 수정진동자 등 배터리 구동식 휴대용 시계 무브먼트를 탑재한 탁상시계/자명종시계.\n- 기타 클록(제9103.90호) : 기계식 태엽(태엽 스프링) 휴대용 시계 무브먼트를 탑재한 기계식 탁상시계/자명종시계.\n\n[적용 예시]\n- 다리(각)나 스탠드가 결합된 탁상시계 및 자명종시계.\n- 가죽 케이스 등에 들어있는 접이식 여행용 시계.\n- 캘린더 장치가 결합되거나, 8일권 작동 태엽을 가진 시계.\n- 종 대신 음악이 나오는 뮤직 자명종시계.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 차량용, 항공기용, 선박용 등의 계기반 시계 및 이와 유사한 시계 (무브먼트 크기에 불문하고 제9104호로 분류)\n(b) 휴대용 시계 무브먼트 규격을 초과하는 무브먼트(두께 12mm 초과 또는 폭 50mm 초과) 또는 조정장치가 없는 동기전동기식 클록 (제9105호)\n(c) 단독 제시되는 무브먼트 (제9108호 또는 제9110호) 및 클록 케이스 (제9112호)" ,
  "contentEn": "This heading covers clocks (such as alarm clocks and table clocks) incorporating a watch movement (as defined in Note 3: thickness <= 12 mm and width/length/diameter <= 50 mm), except instrument panel clocks of heading 91.04.\n\nIt includes :\n- Electrically operated clocks (subheading 9103.10).\n- Other clocks (mechanical winding) (subheading 9103.90).\n- Alarm clocks, travel clocks in cases, and calendar clocks with watch movements.\n\nExcludes instrument panel clocks (heading 91.04), clocks with larger clock movements or synchronous motors (heading 91.05), and separate watch movements (heading 91.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.03 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
