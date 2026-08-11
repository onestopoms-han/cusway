const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9104",
  "titleKo": "91.04 - 차량용ㆍ항공기용ㆍ우주선용ㆍ선박용 계기반 클록(clock)과 이와 유사한 클록(clock)",
  "titleEn": "91.04 - Instrument panel clocks and clocks of a similar type, for vehicles, aircraft, spacecraft or vessels.",
  "contentKo": "이 호에는 차량(자동차, 오토바이 등), 항공기, 우주선, 선박의 대시보드(계기반), 조종핸들, 백미러 등에 고정 장착되도록 특별히 제작된 케이스와 무브먼트를 갖춘 시계를 분류한다. 무브먼트의 종류와 크기(두께 및 지름)에 관계없이 이 호에 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 차량용/항공기용/선박용 전용 계기반 부착식 쿼츠(전자식) 시계, 자동 태엽(자동권) 시계, 기계식 8일권 시계.\n- 시간 지시 외에 비행시간/주행시간 기록 장치 및 크로노그래프 지침을 결합한 차량용/항공기용 크로노그래프 시계.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단독으로 제시되는 시계용 무브먼트 (제9108호 ~ 제9110호)\n(b) 단독 제시되는 클록 케이스 (제9112호) 및 무브먼트용 부분품 (제9110호 또는 제9114호)" ,
  "contentEn": "This heading covers all clocks (regardless of the type or size of the movement) specially designed for mounting on the instrument panels, steering wheels, or mirrors of vehicles (cars, motorcycles), aircraft, spacecraft, or vessels.\n\nIt includes :\n- Electrically or quartz-operated dashboard clocks.\n- Mechanical 8-day instrument clocks.\n- Instrument panel chronograph clocks indicating driving or flight duration.\n\nExcludes separate movements (headings 91.08 to 91.10) and clock cases (heading 91.12)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.04 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
