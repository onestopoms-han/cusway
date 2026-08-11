const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9604",
  "titleKo": "96.04 - 수동식 체와 어레미",
  "titleEn": "96.04 - Hand sieves and hand riddles.",
  "contentKo": "이 호에는 입자 크기에 따라 고형물질(가루, 모래, 흙, 종자 등)을 분류하고 가려내는 수동 조작용 체(Hand sieve)와 어레미(Hand riddle)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 석탄재, 모래, 정원 흙, 식물 종자 가려내기용 수동식 체/어레미.\n- 제분 가공용 체 및 밀가루용 가정용 체(볼팅 클로스 bolting cloth 거즈 부착 체 포함).\n- 실험실 분석용 테스트 체(시멘트, 성형 모래, 화학비료, 목분 등 입도 측정용으로, 여러 층을 연결 장착 가능한 세트 체 포함).\n- 다이아몬드, 귀석, 반귀석 정밀 분류 선별용 스크린 수동 체.\n\n[망의 구성 재료]\n- 망(mesh) 재료 : 마모(말 갈기털), 인조필라멘트, 실크(견사), 거트(gut), 철사/강선/황동선 등의 금속선(wire).\n- 틀(frame) 재료 : 목재, 플라스틱 또는 금속(철강, 알루미늄 등).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 지면에 세우거나 경사지게 고정하여 자갈/모래/토양을 치는 고정식 대형 스크린 체 (제7326호)\n(b) 깔때기형 금속 여과기, 우유 여과용 밀크 체, 액체(페인트, 액상 약제) 여과용 체 및 바닥이 천공된 치즈 제조용 용기 (제73류 등 금속 재질별 분류)\n(c) 기계식 제분기, 농업용 선별기, 광석/석탄 크기 분류용 기계 장치(트롬멜 등)에 장착되도록 전용 설계된 기계용 스크린/체 (제8437호 또는 제8474호 등 기계 부품으로 분류)" ,
  "contentEn": "This heading covers hand-operated sieves and riddles used for sifting, grading, or separating solid substances by particle size.\n\nIt includes :\n- Hand sieves/riddles for sinders, sand, seeds, or garden soil.\n- Flour sieves for household use or commercial baking (using bolting cloth/gauze).\n- Laboratory testing sieves (often stackable in a series) to test the fineness of cement, fertilizers, or wood flour.\n- Precision sorting sieves for precious stones (e.g. diamonds).\n\nExcludes fixed gravel screens resting on the ground (heading 73.26), simple kitchen strainers/funnels with perforated sheet bottoms (Chapter 73), and sieves designed to be mounted on milling or sorting machinery (heading 84.37 or 84.74)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.04 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
