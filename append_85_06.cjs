const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8506",
  "titleKo": "85.06 - 일차전지(+)",
  "titleEn": "85.06 - Primary cells and primary batteries.",
  "contentKo": "이 호에는 화학반응에 의하여 전기에너지를 발생하며 쉽게 재충전이 되지 않는 일차전지를 분류한다.\n\n일차전지는 알칼리/비알칼리 전해질 용기 내에 두 전극을 침지하여 구성된다. 양극(anode)은 주로 아연, 마그네슘, 리튬 등이며 음극(cathode/탈분극전극)은 이산화망간, 산화수은, 산화은 등이다. 리튬 일차전지는 비수성 전해질을 사용한다. 에어징크 전지는 산소를 음극 활물질로 사용한다.\n\n이 호에는 다음의 전지를 포함한다.\n(1) 습전지(wet cell) : 액체 전해질을 사용하여 방향에 민감함.\n(2) 건전지(dry cell) : 전해질이 페이스트나 겔 등으로 고정되어 흐름이 제한됨.\n(3) 불활성전지(inert cell) 및 리저브(reserve) 전지 : 사용 전에 전해질/물 등을 주입하거나 가열하여 활성화하는 전지.\n(4) 농축전지(concentration cell).\n실험실용 표준전지도 이 호에 분류한다. 전해질 없이 제시되는 습전지 등도 포함한다.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 용기(전통)를 포함한 일차전지의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 재충전식 축전지 (제8507호)\n(b) 전지용 터미널(접속단자) (제8536호)\n(c) 태양전지 (제8541호)\n(d) 탄소전극 (제8545호)\n(e) 수명이 끝난 일차전지 및 이들의 웨이스트/스크랩 (제8549호)\n(f) 열전대 (제8503, 8548, 9033호 등)\n\n소호해설 :\n- 소호 제8506.10, 8506.30, 8506.40호 : 음극(탈분극전극)의 구성 물질에 따라 분류 결정 (단, 음극이 이산화망간이라도 양극이 리튬인 것은 8506.50호 분류).\n- 소호 제8506.50호 : 양극(anode)의 구성 물질(리튬)에 따라 분류 결정.",
  "contentEn": "This heading covers primary cells and primary batteries (non-rechargeable).\n\nThey generate electrical energy by chemical reaction. The primary characteristic of primary cells is that they cannot be easily or effectively recharged.\n\nIt includes :\n(1) Wet cells : Electrolyte is liquid.\n(2) Dry cells : Electrolyte is immobilized in an absorbent paste or gel.\n(3) Inert or reserve cells/batteries : Inactive until water/electrolyte is added or heated.\n(4) Concentration cells.\nStandard cells for laboratory use are also covered. Wet cells presented without electrolyte remain classified here.\n\nParts, including containers, are classified here.\n\nThe heading excludes :\n(a) Rechargeable electric accumulators (heading 85.07).\n(b) Terminals (heading 85.36).\n(c) Solar cells (heading 85.41).\n(d) Carbon electrodes (heading 85.45).\n(e) Spent primary cells and scrap thereof (heading 85.49).\n(f) Thermocouples (headings 85.03, 85.48, 90.33, etc.).\n\nSubheading Note :\n- Subheadings 8506.10, 8506.30, 8506.40: Classified by composition of the cathode (depolarising electrode), except if anode is lithium (heading 8506.50).\n- Subheading 8506.50: Classified by composition of the anode (lithium)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.06 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
