const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8711",
  "titleKo": "87.11 - 모터사이클[모페드(moped)를 포함한다]과 보조모터를 갖춘 자전거[사이드카(side-car)를 부착하였는지에 상관없다], 사이드카(side-car)",
  "titleEn": "87.11 - Motorcycles (including mopeds) and cycles fitted with an auxiliary motor, with or without side-cars; side-cars.",
  "contentKo": "이 호에는 주로 인원 수송용으로 설계된 모터 구동식의 이륜자동차(오토바이), 스쿠터, 모페드, 보조 모터 부착 자전거, 자이로 센서식 개인용 이동수단 및 사이드카(side-car) 자체를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 모터사이클 및 모터스쿠터 (내연기관 배기량별 소호 제8711.10~50호).\n- 모페드(moped) : 보조 모터와 페달 장치가 기계식으로 동시 결합된 경량 오토바이.\n- 전기 모터사이클 및 전기 스쿠터(추진용 전동기 구동식, 배터리 충전 플러그식)(제8711.60호).\n- 1인용 전기식 자이로 센서 직립 탑승형 이동 수단(예: 세그웨이 등 자기평형 이륜차) 및 전동 킥보드.\n- 모터사이클에 탈착 결합하여 인원/화물을 나르는 사이드카(사이드카 자체는 바퀴가 한 개 있고 모터사이클 측면에 결합하는 구조물임).\n- 배달용 삼륜 오토바이 및 삼륜차 (단, 제8703호 또는 제8704호의 자동차식 구동 장치-차동기어, 후진기어, 조향장치-가 없는 것에 한함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모터카(자동차) 형태의 조향시스템(액커만식 기어 등)과 튜브 섀시를 가진 사륜 ATV (제8703호)\n(b) 모터사이클 뒤편에 로프 등으로 연결하여 끌려가는 무동력 트레일러 (제8716호)" ,
  "contentEn": "This heading covers motorcycles, motor-scooters, mopeds, and cycles fitted with an auxiliary motor, with or without side-cars, and side-cars presented separately.\n\nIt includes :\n- Conventional motorcycles and motor-scooters (classified by cylinder capacity under subheadings 8711.10 to 8711.50).\n- Mopeds with built-in pedal assemblies and auxiliary engines.\n- Electric motorcycles, electric scooters, and electric self-balancing two-wheeled personal mobility devices (e.g. Segways) (subheading 8711.60).\n- Side-cars consisting of a single wheel and a attachment frame, presented separately.\n- Three-wheeled delivery cycles that do not possess conventional motor car characteristics (reverse gear, differential, or steering wheel).\n\nExcludes four-wheeled all-terrain vehicles (ATVs) with car-type steering systems (heading 87.03) and trailers designed for motorcycles (heading 87.16)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.11 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
