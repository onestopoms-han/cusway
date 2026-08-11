const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8802",
  "titleKo": "88.02 - 그 밖의 항공기(예: 헬리콥터ㆍ비행기)(제8806호의 무인기를 제외한다), 우주선(인공위성을 포함한다)ㆍ서보비틀(suborbital) 발사체ㆍ우주선 발사체",
  "titleEn": "88.02 - Other aircraft (for example, helicopters, aeroplanes), except unmanned aircraft of heading 88.06; spacecraft (including satellites) and suborbital and spacecraft launch vehicles.",
  "contentKo": "이 호에는 동력 장치(엔진/모터)가 장착된 유인 항공기(헬리콥터, 비행기) 및 우주선, 위성, 궤도/우주선 발사체(로켓)를 분류한다. 단, 제8806호의 조종사가 탑승하지 않는 무인항공기(드론)는 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 헬리콥터 (자체 중량에 따라 제8802.11~12호) : 기계 구동되는 로터(rotor)를 탑재한 수직이착륙 항공기.\n(2) 비행기와 그 밖의 유인 동력 항공기 (자체 중량에 따라 제8802.20~40호) : 여객선, 화물선, 군용 전투기, 수상비행기, 수륙양용기, 자이로플레인, 도로 겸용 항공기.\n(3) 우주선 및 인공위성 (제8802.60호) : 대기권 외부 궤도를 공전하도록 설계된 기기(통신위성, 방송위성, 기상위성, 우주정거장 등).\n(4) 우주선 발사체 및 서보비틀(준궤도) 발사체 (제8802.60호) : 종단 속도가 7,000 m/s를 초과하여 우주로 위성을 운반하는 우주 로켓, 또는 7,000 m/s 이하의 속도로 과학/학술적 기기를 대기권 밖 포물선 궤도로 쏘아올리는 과학용 로켓.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전쟁용 군수물자를 목적지로 비행시켜 타격하는 탄도미사일(ballistic missile) 및 유도미사일 (제9306호)\n(b) 조종사 없이 비행하는 무인항공기 및 드론 (제8806호)\n(c) 비행 완구 및 완구용 드론 (제9503호)" ,
  "contentEn": "This heading covers motorised heavier-than-air aircraft (aeroplanes, helicopters, gyroplanes) designed for carrying passengers or cargo, excluding unmanned aircraft of heading 88.06. It also covers spacecraft, satellites, and spacecraft/suborbital launch vehicles.\n\nIt includes :\n- Helicopters (classified by unladen weight under subheadings 8802.11 and 8802.12).\n- Aeroplanes and other powered aircraft (classified by unladen weight under subheadings 8802.20 to 8802.40) including military jets, passenger planes, gyroplanes, and road-usable aircraft.\n- Spacecraft and satellites (subheading 8802.60) designed to operate outside the atmosphere (e.g. communication satellites, space stations).\n- Spacecraft launch vehicles and suborbital launch vehicles (subheading 8802.60) providing a terminal velocity to space payloads.\n\nExcludes military guided missiles and ballistic missiles of heading 93.06, unmanned aircraft of heading 88.06, and recreational model aircraft (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.02 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
