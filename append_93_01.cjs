const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9301",
  "titleKo": "93.01 - 군용 무기[리볼버(revolver)ㆍ피스톨(pistol)과 제9307호의 무기는 제외한다]",
  "titleEn": "93.01 - Military weapons, other than revolvers, pistols and the arms of heading 93.07.",
  "contentKo": "이 호에는 군대, 경찰 또는 세관 등 정부 무장 기관이 군사 작전용으로 사용하도록 설계된 모든 종류의 군용 무기(weapon)를 분류한다. 단, 개인용 권총(리볼버/피스톨 - 제9302호)과 도검류(제9307호)는 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 포병 무기(제9301.10호) : 평사포, 곡사포, 박격포, 대공포, 대전차포 등 고정식 또는 차륜/궤도 거치식 대포류(철도차량 탑재식 장거리포 포함).\n- 발사장치(제9301.20호) : 로켓발사기(RPG 등), 유탄발사기, 화염발사기(군사 작전용), 어뢰발사관, 폭뢰사출장치.\n- 기타 군용 무기(제9301.90호) :\n  - 기관총, 기관단총, 소총(군용 라이플), 카빈총 등 연속 연발 사격용 개인 및 거치식 총기류.\n  - 전차, 군함, 항공기에 영구 장착되지 않고 분리하여 따로 제시되는 무장용 총포류.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 리볼버 및 피스톨 권총 (제9302호)\n(b) 도검, 창, 총검 등 백병전용 칼붙이 무기 (제9307호)\n(c) 잡초 제거/농업용 특수 화염총 및 분무 장치 (제8424호)\n(d) 전차, 장갑차 등 장갑 전투 차량 자체 (제8710호)" ,
  "contentEn": "This heading covers military weapons designed for combat, excluding revolvers and pistols (heading 93.02) and sidearms/swords (heading 93.07). It includes weapons presented separately from the vehicles, vessels, or aircraft on which they are mounted.\n\nIt includes :\n- Artillery weapons (subheading 9301.10) such as guns, howitzers, mortars, anti-aircraft guns, and anti-tank guns.\n- Launchers (subheading 9301.20) such as rocket launchers, grenade launchers, flame-throwers (military), and torpedo tubes.\n- Other military weapons (subheading 9301.90) including machine-guns, sub-machine guns, military rifles, and carbines.\n\nExcludes handguns (heading 93.02), swords/bayonets (heading 93.07), and agricultural flame-guns (heading 84.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.01 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
