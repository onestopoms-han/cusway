const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9307",
  "titleKo": "93.07 - 검류ㆍ창과 이와 유사한 무기, 이들의 부분품과 집",
  "titleEn": "93.07 - Swords, cutlasses, bayonets, lances and similar arms and parts thereof and scabbards and sheaths therefor.",
  "contentKo": "이 호에는 백병전, 호신 또는 의식 행사용으로 쓰이는 칼붙이 무기류(도검류, 창, 총검 등) 및 이들의 부분품과 칼집(sheath/scabbard)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 도검 및 창검류 : 검(swords, 지팡이 칼 sword-sticks 포함), 단검(cutlasses/daggers/stilettos), 총검(bayonets, 총구 장착용), 창(lances/spears), 도끼창(halberds), 군용 단도(dirks), 쿠크리칼(kukris, 코만도 단검).\n- 비고정식 도검 : 손이나 내부 스프링 기구로 칼날이 튀어나오거나 접히는 자동 나이프식 단검.\n- 장식/의식/연극용 무기 : 장교용 장식 예도, 의식용 창, 무대 소도구용 무딘 칼.\n- 이들의 전용 부분품 및 칼집 :\n  - 검날(blade, 단조만 완료된 거친 블랭크 포함), 칼자루/손잡이(hilt/guard), 방패구, 가드(guard).\n  - 도검, 창, 총검용 가죽/금속/나무제 칼집(scabbards, sheaths).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 도검 지지용 가죽 벨트 및 군장용 벨트 (제4203호 또는 제6217호)\n(b) 검에 다는 장식용 끈 (제4205호 또는 제6307호)\n(c) 일반 수렵용 칼, 캠핑용 대검, 칼붙이용 나이프 (제8211호) 및 그 칼집 (제4202호)\n(d) 순수 귀금속제 또는 귀금속을 도포한 금속제 칼집 (제7115호)\n(e) 스포츠 펜싱용 검(foil, 플뢰레/에페/사브르) (제9506호)" ,
  "contentEn": "This heading covers sidearms (swords, cutlasses, bayonets, lances, daggers, stilettos, halberds, commando knives) designed for combat, defense, or ceremonial use, and parts thereof and their sheaths/scabbards.\n\nIt includes :\n- Swords (including sword-sticks), bayonets, lances, spears, and daggers.\n- Blades (including blanks), hilts, guards, and scabbards/sheaths.\n- Ceremonial swords and theatrical property swords.\n\nExcludes leather belts/slings for swords (heading 42.03), hunting/camping knives (heading 82.11), precious metal sheaths (heading 71.15), and fencing foils (heading 95.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.07 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
