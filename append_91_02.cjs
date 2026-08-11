const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9102",
  "titleKo": "91.02 - 손목시계ㆍ회중시계와 그 밖의 휴대용 시계(스톱워치를 포함하되 제9101호의 것은 제외한다)",
  "titleEn": "91.02 - Wrist-watches, pocket-watches and other watches, including stop-watches, other than those of heading 91.01.",
  "contentKo": "이 호에는 케이스가 비귀금속(철, 황동, 플라스틱, 티타늄 등)으로 되어 있거나 비귀금속에 귀금속을 박아 넣은 것(inlaid)으로 된 손목시계, 회중시계 및 기타 휴대용 시계(스톱워치 포함)를 분류한다. 무브먼트의 두께는 분류에 영향을 주지 않는다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기구동식 손목시계(제9102.11~19호) :\n  - 기계식 표시부만을 갖춘 것(바늘식 아날로그 표시)(제9102.11호).\n  - 광전자식 표시부만을 갖춘 것(디지털 LCD, LED 등 화상 표시)(제9102.12호).\n  - 기타 표시방식(아날로그/디지털 하이브리드)(제9102.19호).\n- 그 밖의 손목시계(기계식 구동)(제9102.21~29호) :\n  - 자동권(자동태엽감기)식(제9102.21호).\n  - 기타 기계식(수동태엽식)(제9102.29호).\n- 기타 휴대용 시계(회중시계, 브로치/반지시계 등)(제9102.91~99호) : 전기구동식(제9102.91호), 기타 기계식(제9102.99호).\n\n[주요 품목 종류]\n- 크로노그래프(chronograph) 시계 : 시간 측정용 바늘 외에 1초 미만 단위의 짧은 순간 경과 시간을 측정하기 위한 별도 지침이 달린 시계.\n- 스톱워치(stop-watch) : 통상적인 시각(시, 분, 초) 표시 대신 오직 짧은 경과 시간만을 측정/지시하기 위한 초침과 적산침만 있는 것(전자식 스톱워치 중 보조적인 시각 기능이 있는 것도 포함).\n- 팬시/기능성 시계 : 잠수용 방수 시계(음향측심기 결합형), 시각장애인용 점자(Braille)시계, 자동권 시계.\n- 시계와 함께 제시되는 시계줄(wrist-strap)은 부착 여부를 불문하고 본 호에 포함하여 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 신체 휴대용이 아닌 차량용, 항공기용, 선박용 계기반 시계 (제9104호)\n(b) 휴대용 시계의 무브먼트를 갖추었으나 탁상용이나 벽걸이용으로 설계된 시계 (제9103호)\n(c) 만보계/보수계(pedometer) (제9029호)" ,
  "contentEn": "This heading covers wrist-watches, pocket-watches, and other pocket-type timepieces (including stop-watches) whose case is made of base metal, plastics, or base metal inlaid with precious metal.\n\nIt includes :\n- Electric-powered wrist-watches (subheadings 9102.11 to 9102.19) with mechanical (hands) or opto-electronic (LCD/LED) displays.\n- Mechanical wrist-watches (subheadings 9102.21 to 9102.29) including automatic winding or manual winding.\n- Other watches (subheadings 9102.91 to 9102.99) including pocket-watches, ring watches, and fob watches.\n- Chronographs and stop-watches.\n- Watch straps/bands presented together with their watches.\n\nExcludes instrument panel clocks (heading 91.04), clocks with watch movements (heading 91.03), and pedometers (heading 90.29)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.02 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
