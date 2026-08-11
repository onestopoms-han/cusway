const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9105",
  "titleKo": "91.05 - 그 밖의 클록(clock)",
  "titleEn": "91.05 - Other clocks.",
  "contentKo": "이 호에는 휴대용 시계의 무브먼트(주 제3호 규격) 이외의 무브먼트(즉, 대형 클록 무브먼트 또는 조정장치 없는 동기전동기 무브먼트)를 내장하고, 기본적으로 시각을 표시하기 위해 제작된 모든 클록(벽시계, 자명종시계, 공중시계 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 자명종시계(제9105.11~19호) : 전기구동식(제9105.11호), 기타 기계식 자명종시계(제9105.19호). 단, watch movement를 갖춘 자명종은 제9103호로 제외.\n- 벽시계(제9105.21~29호) : 전기구동식(제9105.21호), 기타 기계식(진자식, 태엽식 벽시계)(제9105.29호).\n- 기타 시계(제9105.91~99호) : 전기구동식(제9105.91호), 기타 기계식(제9105.99호).\n\n[주요 적용 품목]\n- 공공 장소용 공중시계, 상점/가정용 시계, 뻐꾸기시계(cuckoo-clock), 꼭두각시시계, 동전 작동식 시계.\n- 기압/온도 변화로 태엽이 감기는 환경식 자동권시계, 천체/기상관측용 정밀시계.\n- 중앙 전기로 연결되는 모시계(master clock) 및 자석 전자식 보조시계(secondary clock) 시스템.\n- 선박용 크로노미터(marine chronometer) : 짐벌(gimbal)에 부착되고 상자에 고정된 형태의 초정밀 시계(단, 손목형 갑판시계는 제9101/9102호로 제외).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 갑판시계(deck watch) (제9101호 또는 제9102호)\n(b) 차량, 항공기, 우주선, 선박용 대시보드 계기반 부착식 클록 (제9104호)\n(c) 단독 제시되는 시계용 무브먼트 (제9109호 또는 제9110호) 및 케이스 (제9112호)" ,
  "contentEn": "This heading covers clocks other than those incorporating a watch movement of heading 91.03 or the instrument panel clocks of heading 91.04. It includes clocks with larger movements, clocks driven by synchronous motors, or clocks utilizing pendulums.\n\nIt includes :\n- Alarm clocks (subheadings 9105.11 to 9105.19) without watch movements.\n- Wall clocks (subheadings 9105.21 to 9105.29) including pendulum-driven or electronic wall clocks.\n- Other clocks (subheadings 9105.91 to 9105.99) including public clocks, cuckoo-clocks, coin-operated clocks, master-and-secondary clock systems, and marine chronometers mounted in boxes.\n\nExcludes deck watches (heading 91.01 or 91.02) and vehicle dashboard clocks (heading 91.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.05 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
