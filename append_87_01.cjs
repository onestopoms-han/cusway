const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8701",
  "titleKo": "87.01 - 트랙터(제8709호의 트랙터는 제외한다)(+)",
  "titleEn": "87.01 - Tractors (other than tractors of heading 87.09).",
  "contentKo": "이 호에는 다른 차량, 기기, 화물을 끌거나(견인) 밀기 위해 제작된 차륜식 또는 무한궤도식 트랙터를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 영농용, 임업용, 도로주행용, 토목건설용 트랙터 및 윈치 트랙터 (내연기관식, 전동기식 모두 포함).\n- 도로와 철도 궤도 양용 트랙터 (단, 궤도전용으로 설계된 것은 제8602호로 제외).\n- 차축이 하나인 트랙터(single axle tractor/보행용 경운기 등) : 차축 하나에 1~2개 바퀴를 가졌으며 핸들로 조종하는 소형 트랙터.\n- 세미트레일러 견인용 도로주행식 트랙터 (소호 제8701.21~29호) : 장거리 수송을 위해 세미트레일러와 연결하는 5륜 커플링(fifth wheel) 장치 탑재 트랙터 (일명 트랙터 헤드).\n- 무한궤도식 트랙터(크롤러 트랙터)(소호 제8701.30호).\n- 기타 엔진 출력별 트랙터 (소호 제8701.91~95호) : 터미널 트랙터, 포트 트랙터(항만/야드 등 단거리 입환용) 포함.\n\n[다른 기계가 결합된 트랙터의 분류]\n- 트랙터에 임시 장착되는 호환성 농기구(쟁기, 써레 등)나 공업용 툴은 트랙터와 분리하여 각각 해당 호에 분류한다. 작동 장치를 갖춘 트랙터 본체만 이 호에 분류한다.\n- 기계(불도저, 로더, 모터 그레이더 등)의 주행 차대와 작업 툴이 구조적으로 용접/일체화되어 결합된 특수 기계류는 주행부만 별도로 트랙터로 분류하지 않고 완성 기계로 제8429호 또는 제8430호 등에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 구난용 크레인이 내장된 특수자동차 (제8705호)\n(b) 공장, 공항, 역 플랫폼용 입환 트랙터 (제8709호)",
  "contentEn": "This heading covers wheeled or track-laying vehicles (tractors) constructed essentially to pull or push other vehicles, appliances or loads.\n\nIt includes :\n- Agricultural, forestry, road, and heavy civil engineering tractors (whether powered by internal combustion engines or electric motors).\n- Road-rail tractors (except those designed solely for rails).\n- Single-axle tractors (pedestrian-controlled tractors) used for agricultural or light industrial purposes.\n- Road tractors for semi-trailers (subheadings 8701.21 to 8701.29) designed for long-distance haulage and fitted with a fifth wheel coupling.\n- Track-laying tractors (subheading 8701.30).\n- Terminal tractors and port tractors used for short-distance shunting/maneuvering of trailers (subheadings 8701.91 to 8701.95).\n- Tractors fitted with winches for forestry, salvage, etc.\n\nExcludes shunting tractors of a kind used in railway stations (heading 87.09), and integrated industrial machinery where the tractor chassis forms an inseparable unit with loaders, bulldozers, or excavators (heading 84.29 or 84.30)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.01 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
