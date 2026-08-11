const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8904",
  "titleKo": "89.04 - 예인선과 푸셔크라프트(pusher craft)",
  "titleEn": "89.04 - Tugs and pusher craft.",
  "contentKo": "이 호에는 승객이나 화물 수송 목적으로 설계되지 않고, 다른 선박(바지선, 거룻배 등)을 끌거나(예인) 밀어(푸싱) 이동시키기 위해 강력한 엔진과 견고한 차대를 갖춘 예인선 및 푸셔크라프트를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 예인선(tug) : 다른 선박을 예인하기 위해 강화된 선체, 강력한 주기관, 예인용 로프/케이블/와이어를 지지하기 위한 전용 갑판 장치(예인 훅, 비트)를 구비한 선박. 해난 구조용 구난 예인선(salvage tug) 포함.\n- 푸셔크라프트(pusher craft) : 바지선을 밀고 가기 위해 선수부가 평평하게 제작된 완충기(snub bow) 및 전방 시야 확보를 위한 승강식/신축식 조타실을 갖춘 선박.\n- 푸셔-터그(pusher-tug) : 선수에는 밀기용 완충장치(snub bow)를 갖추고 선미에는 끌기용 경사 선체 및 예인 장치를 함께 갖추어 밀고 끄는 두 가지 기능이 모두 가능한 겸용 선박.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 소방 설비(모터 펌프, 거품 노즐 등)가 주 기구인 소방정 (제8905호)" ,
  "contentEn": "This heading covers tugs (designed for towing other vessels) and pusher craft (designed for pushing barges and lighters), neither of which are designed for the carriage of passengers or goods.\n\nIt includes :\n- Tugs (including ocean-going, harbor, and salvage tugs) characterized by robust hulls, disproportionately powerful engines, and towing decks with towing hooks/bitts.\n- Pusher craft characterized by snub bows for pushing and elevating steering cabs.\n- Pusher-tugs designed to perform both towing and pushing operations.\n\nExcludes fire-floats (heading 89.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.04 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
