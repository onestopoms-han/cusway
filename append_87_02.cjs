const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8702",
  "titleKo": "87.02 - 10인 이상(운전자를 포함한다) 수송용 자동차",
  "titleEn": "87.02 - Motor vehicles for the transport of ten or more persons, including the driver.",
  "contentKo": "이 호에는 운전자를 포함하여 10인 이상을 수송하도록 설계된 버스, 코치, 트롤리버스, 자이로버스 등의 승용 목적 자동차를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 버스 및 관광 코치 (디젤식 제8702.10호, 하이브리드식 제8702.20/30호, 순수 전기식 제8702.40호, 기타 가솔린/가스터빈식 제8702.90호).\n- 하이브리드 전기 자동차(HEV 및 Plug-in HEV 포함) : 내연기관과 전동기를 혼용 구동방식으로 장착한 버스.\n- 전기 버스(EV) : 배터리(축전지) 팩 전원 및 모터 구동식 버스.\n- 트롤리버스(trolleybus) : 가공 가선으로부터 급전받아 구동되는 무궤도 전차 버스.\n- 자이로버스(gyrobus) : 고속 회전 플라이휠의 운동에너지를 전기로 변환 구동하는 버스.\n- 휠(바퀴)을 바꾸고 조타 장치를 고정하여 레일 주행용 레일카로 변환할 수 있도록 양용 설계된 버스 코치.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 승차 정원이 운전자 포함 9인 이하인 승용자동차 (제8703호)\n(b) 구급차, 특수 영구차 등 (제8703호)",
  "contentEn": "This heading covers all motor vehicles designed for the transport of ten or more persons (including the driver).\n\nIt includes :\n- Motor buses, coaches, trolleybuses, and gyrobuses.\n- Hybrid electric vehicles (HEV, PHEV) for the transport of 10 or more persons.\n- Pure electric buses powered by accumulators.\n- Trolleybuses receiving current from overhead wires.\n- Gyrobuses operating on the principle of storing kinetic energy in a flywheel.\n- Motor coaches convertible into rail-cars simply by changing wheels and locking steering."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.02 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
