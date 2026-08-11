const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9107",
  "titleKo": "91.07 - 타임스위치[시계의 무브먼트(movement)나 동기(同期) 전동기를 갖춘 것으로 한정한다]",
  "titleEn": "91.07 - Time switches with clock or watch movement or with synchronous motor.",
  "contentKo": "이 호에는 시계용 무브먼트(클록/워치 무브먼트) 또는 감속 기어를 결합한 동기전동기(synchronous motor)를 탑재하고 있으며, 일반 시계의 외형을 갖추지 않은 상태에서 미리 설정된 시각(하루 또는 일주일 프로그램)에 자동으로 전기 회로를 개폐(On/Off)하도록 설계된 타임스위치(시간 제어 스위치)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 가로등, 쇼윈도 광고판, 공공장소 조명, 계단실 전등 제어용 자동 타임스위치.\n- 심야전력/보일러 온수기 가열 회로, 산업용 냉동 펌프 제어용 스위치.\n- 동전 투입식 전기장치(세탁기, TV, 당구장 조명 등)의 동전 작동식 전력 공급 제어 타임스위치.\n- 온도, 압력, 액면 센서에 신호를 받아 보조적으로 작동을 제어하는 제어회로 연동형 타임스위치.\n\n[주요 구성 요소]\n- 시계 무브먼트 또는 동기전동기, 핀/레버/트립 장치가 달린 시간 설정 다이얼(또는 전자식 메모리 장치), 스위칭 계전기 및 단자대가 포함된 케이스.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단독으로 제시되는 무브먼트 (제9108호 ~ 제9110호)\n(b) 단독 제시되는 케이스 (제9112호) 및 무브먼트 부분품 (제9110호 또는 제9114호)\n(c) 시계 무브먼트 없이 단순 기계적 기어 지연으로 작동하는 공압식/바이메탈식 지연 스위치 및 계전기 (제8536호)" ,
  "contentEn": "This heading covers time switches equipped with a clock or watch movement or a synchronous motor, designed to make or break electrical circuits at preset times.\n\nIt includes :\n- Time switches for lighting circuits (public lighting, shop windows, staircase lighting).\n- Time switches for heating/cooling appliances, pumps, and multiple-rate electricity meters.\n- Coin-operated time switches for TV receivers, washing machines, or billiard tables.\n\nExcludes separate movements (headings 91.08 to 91.10), cases (heading 91.12), and relay-type delay switches without clock movements (heading 85.36)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.07 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
