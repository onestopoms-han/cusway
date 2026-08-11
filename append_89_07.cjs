const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8907",
  "titleKo": "89.07 - 그 밖의 물에 뜨는 구조물[예: 부교ㆍ탱크ㆍ코퍼댐(coffer-dam)ㆍ부잔교(landing stage)ㆍ부표ㆍ수로부표]",
  "titleEn": "89.07 - Other floating structures (for example, rafts, tanks, coffer-dams, landing-stages, buoys and beacons).",
  "contentKo": "이 호에는 항해를 수행하는 선박으로서의 특성을 갖지 않으며, 주로 수면 위에 정지된 상태로 특정 목적에 사용되는 기타 수상 구조물(뗏목, 탱크, 부교, 부표 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 공기주입식 부교(뗏목 raft)(제8907.10호) : 조난 구명용 등 물에 닿으면 자동 팽창하는 구명 뗏목.\n- 기타 수상 구조물 (소호 제8907.90호) :\n  - 임시 가교/부교를 지지하기 위한 원통형 폰툰(pontoon).\n  - 활어(갑각류, 어류) 보관용 해상 가두리/플로팅 탱크 및 선박 유류/청수 공급용 플로팅 탱크.\n  - 해상 교량 기초 공사에 사용하는 상자형 코퍼댐(coffer-dam).\n  - 플로팅 부잔교(landing-stage).\n  - 계류용 부표, 등대 부표(표시용, 조명용, 경보용 부표 등).\n  - 항로 수로의 경계나 위험 지역 표시용 수로부표(beacon).\n  - 침몰선 인양용 리플로팅(refloating) 에어 백 및 기기.\n  - 해상 기뢰 제거(소해) 작업에 사용되는 부유식 패러베인(paravane).\n  - 도크(dock)의 게이트(독문) 차단 역할을 하도록 특수 설계된 부유식 해상 구조물.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 외부 크레인 윈치로 오르내리는 금속제 다이빙 벨 (제8479호)\n(b) 구명조끼, 구명링 및 구명벨트 (재질에 따라 분류)\n(c) 윈드서핑용 세일보드 (제9506호)" ,
  "contentEn": "This heading covers floating structures that do not have the character of vessels, and which are generally stationary when in use.\n\nIt includes :\n- Inflatable rafts (subheading 8907.10) including automatic self-inflating life-rafts for emergency use.\n- Other floating structures (subheading 8907.90) including hollow cylinders for supporting temporary bridges, floating tanks for holding live fish or supplying fuel/water, coffer-dams for bridge construction, floating landing stages, mooring/light/warning buoys, and beacons for channel marking.\n- Refloating appliances for raising sunken vessels, floating paravanes for mine-sweeping, and floating dock gates.\n\nExcludes diving bells of heading 8479, life-jackets and life-belts (classified by constituent material), and windsurfing sailboards (heading 95.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.07 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
