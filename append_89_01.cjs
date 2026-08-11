const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8901",
  "titleKo": "89.01 - 순항선ㆍ유람선ㆍ페리보트(ferry-boat)ㆍ화물선ㆍ부선(barge)과 이와 유사한 선박(사람이나 화물 수송용으로 한정한다)",
  "titleEn": "89.01 - Cruise ships, excursion boats, ferry-boats, cargo ships, barges and similar vessels for the transport of persons or goods.",
  "contentKo": "이 호에는 사람(승객) 또는 화물 수송용으로 설계된 해상 및 내륙 수로용 모든 선박을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 여객선 및 페리보트 (제8901.10호) : 대형 크루즈선(순항선), 유람선, 열차 페리(train-ferry), 카페리, 하천 운반용 작은 페리 등.\n- 탱커(tanker)(제8901.20호) : 원유, 가스(메탄 등), 포도주, 화학제품 등 액체/기체 벌크 화물 수송선.\n- 냉동선(제8901.30호) : 육류, 어류, 신선 과일 수송용 냉동/냉장 전용 화물선.\n- 기타 화물선 및 화객선(제8901.90호) : 컨테이너선, 벌크선(곡물, 석탄 운반선), 로로선(Ro-Ro), 부선(barge), 거룻배, 하이드로 포일(수중익선), 수송용 호버크래프트(공기완충선).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 요트, 보트 및 기타 레저/체육용 보트 (제8903호)\n(b) 구명보트(무동력 노 젓는 보트 제외), 군인 수송함, 병원선 (제8906호)" ,
  "contentEn": "This heading covers all vessels for the transport of persons or goods, whether ocean-going or for inland navigation (on lakes, canals, rivers, etc.).\n\nIt includes :\n- Cruise ships, excursion boats, and ferry-boats (subheading 8901.10) including train-ferries, car-ferries, and passenger river-ferries.\n- Tankers (subheading 8901.20) for carrying liquids or gases (petroleum, wine, methane).\n- Refrigerated vessels (subheading 8901.30) for meat, fruit, etc.\n- Cargo ships and barges (subheading 8901.90) including dry cargo bulk carriers (coal, grain), container ships, roll-on-roll-off (Ro-Ro) vessels, barges, lighters, hydrofoils, and transport hovercraft.\n\nExcludes yachts and pleasure boats (heading 89.03), and warships, troopships, or hospital ships (heading 89.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.01 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
