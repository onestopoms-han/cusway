const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9300",
  "titleKo": "제93류 - 무기ㆍ총포탄과 이들의 부분품과 부속품 (총설 및 주 규정)",
  "titleEn": "Chapter 93 - Arms and ammunition; parts and accessories thereof (General Notes & Rules)",
  "contentKo": "제93류는 지상용, 해상용, 공중용의 군사/경찰용 무기, 민간 개인 호신/수렵용 총기, 폭약 작동식 발사기 및 총포탄(탄약, 미사일 등)과 이들의 부분품 및 부속품을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 광학 조준 장치의 분류 (주 제1호 라목 및 총설) :\n  - 총기/화기에 이미 장착되어 있거나 장착용으로 전용 설계되어 해당 화기와 함께 동반 제시되는 망원조준기(telescopic sight) 및 광학 장치는 해당 화기(93류)로 함께 일괄 분류한다.\n  - 단독 제시되는 경우에는 화기 조준용이라도 제90류로 분류한다.\n2. 무선/레이더 기기 제외 (주 제2호) :\n  - 탄약이나 미사일용 부분품 중에서 무선 송수신 기기 또는 레이더 기기(예: 스마트 미사일 유도용 전파 장치 등)는 제9306호의 부분품에서 제외하고 제8526호로 분류한다.\n\n[제외 물품]\n- 제36류의 화약류 제품(뇌관, 신호용 조명탄, 화관 등)\n- 비금속제 범용 부분품 (나사, 스프링 등 - 제15부 주 제2호) 및 플라스틱제 유사 제품 (제39류)\n- 장갑차량 및 전투 차량 (제8710호), 군용 철도 차량 (제86류), 군용 항공기/드론 (제88류), 군함 (제8906호) (단, 차량에 장착되는 총기류를 분리하여 단독 제시 시에는 제93류로 분류)\n- 양궁용 활, 화살, 펜싱용 칼 및 완구용 총기류 (제95류)\n- 역사적 의미가 있는 수집품 (제9705호) 및 100년 초과 골동품 (제9706호)\n- 군용 방탄조끼, 쇠사슬갑옷 등 개인 방호복 (재질별 분류) 및 군모/철모 (제65류)" ,
  "contentEn": "Chapter 93 covers military, police, or civilian arms (weapons of all kinds), ammunition and missiles, and parts/accessories thereof.\n\n[Key Rules & Explanations]\n1. Optical Devices (Note 1(d)) :\n  - Telescopic sights and other optical devices suitable for arms are classified under this Chapter if mounted on or presented with the firearms they are designed for. If presented separately, they fall under Chapter 90.\n2. Exclusions of Telecommunications (Note 2) :\n  - Separately presented radio or radar apparatus for ammunition/missiles fall under heading 85.26, not as parts of ammunition in heading 93.06.\n\n[Exclusions]\n- Pyrotechnic products of Chapter 36 (detonators, signalling flares).\n- Parts of general use (screws/springs of Section XV or Chapter 39).\n- Armoured fighting vehicles (heading 87.10), military trains (Chapter 86), aircraft/drones (Chapter 88), or warships (heading 89.06).\n- Archery bows, arrows, fencing foils, and toy guns (Chapter 95).\n- Bullet-proof jackets/body armor (classified by material) and steel helmets (Chapter 65)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 93 rules/general to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
