const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8713",
  "titleKo": "87.13 - 신체장애인용 차량(모터를 갖추었는지 또는 기계구동식인지에 상관없다)",
  "titleEn": "87.13 - Carriages for disabled persons, whether or not motorised or otherwise mechanically propelled.",
  "contentKo": "이 호에는 신체 장애인이나 거동이 불편한 사람들의 이동 수송을 위해 특별히 설계/제작된 수동 또는 전동식 휠체어(wheelchair) 및 이와 유사한 차량을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 기계 구동식이 아닌 수동 휠체어 (제8713.10호) : 보호자가 밀거나 탑승자가 림(rim)을 돌려 구동하는 휠체어.\n- 전동식 및 기계 구동식 휠체어 (제8713.90호) : 경량 배터리 구동 전동 모터 또는 손조작용 구동 레버/크랭크 체인 기구를 내장한 휠체어형 이동 기기(스쿠터 형태 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 일반 차량에 단순히 장애인용 핸들 기어/액셀 장치 등을 부착하여 개조한 승용차 (제8703호)\n(b) 장애인용 보조 페달 기구를 장착한 자전거 (제8712호)\n(c) 병원용 환자 이송식 이동 들것 침대 트롤리 (trolley-stretcher) (제9402호)" ,
  "contentEn": "This heading covers carriages, wheelchairs, or similar vehicles specially designed for the transport of disabled persons, whether or not mechanically propelled.\n\nIt includes :\n- Non-mechanically propelled carriages (subheading 8713.10) such as manual wheelchairs pushed by an attendant or self-propelled by the user turning the wheels.\n- Motorised or otherwise mechanically propelled carriages (subheading 8713.90) powered by light electric motors/accumulators or operated by hand-crank/lever systems.\n\nExcludes normal vehicles adapted for disabled persons (e.g. cars with hand controls (heading 87.03) or cycles with special pedal attachments (heading 87.12)), and hospital trolley-stretchers (heading 94.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.13 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
