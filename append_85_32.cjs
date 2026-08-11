const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8532",
  "titleKo": "85.32 - 축전기[고정식ㆍ가변식ㆍ조정식(프리세트)으로 한정한다](+)",
  "titleEn": "85.32 - Electrical capacitors, fixed, variable or adjustable (pre-set).",
  "contentKo": "이 호에는 전기 콘덴서(축전기) 고정식, 가변식, 조정식(프리세트식)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 고정식 축전기 (Fixed Capacitors)\n(1) 건식 축전기 : 극판과 유전체(종이, 운모, 플라스틱 등)를 적층/압연하여 상자 등에 밀폐한 것.\n(2) 유침/가스침지 축전기 : 유전체(플라스틱 필름 등)에 기름이나 가스를 침지시킨 것.\n(3) 유입(油入) 축전기 : 용기 내에 오일을 채워 밀폐한 전력용 등 대형 콘덴서(압력계, 안전밸브 등 장착형 포함).\n(4) 전해 축전기 : 알루미늄이나 탄탈륨 극판 표면에 산화 피막(유전체)을 입히고 전해액/전해페이스트를 전극 도포한 콘덴서 (알루미늄 전해, 탄탈륨 콘덴서 등).\n(B) 가변식 축전기 (Variable Capacitors)\n- 손잡이 축을 돌려 고정 극판(고정자)과 가동 극판(회전자)의 겹침 면적을 변경함으로써 정전용량을 연속적으로 가변하는 콘덴서 (주로 공기 유전체식 바리콘 등).\n(C) 프리세트 또는 조정식 축전기 (Adjustable or Pre-set Capacitors)\n- 트리머(trimmer) 콘덴서를 포함하며, 나사 조정 등으로 극판 간격이나 상대 위치를 미세 조정하여 필요한 정전용량 값을 셋팅하는 소형 콘덴서.\n\n여러 개 축전기를 직렬/병렬 연결하여 섀시나 케이스 내에 그룹화한 대형 역률 개선용 전력용 콘덴서 뱅크(Capacitor Bank)도 이 호에 분류한다.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품(하우징 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전력 계통 역률 조절용 동기전동기(\"동기조상기\" 또는 \"동기축전기\" synchronous condenser) (제8501호)\n\n[소호 해설]\n- 소호 제8532.23호 : 원판(디스크)이나 관형의 단층 세라믹 콘덴서.\n- 소호 제8532.24호 : 적층 세라믹 콘덴서(MLCC) 등 칩 형태의 다층 세라믹 콘덴서.",
  "contentEn": "This heading covers electrical capacitors (condensers) which are fixed, variable, or adjustable (pre-set).\n\nIt includes :\n(I) Fixed capacitors :\n- Dry capacitors (stacked/rolled metal sheets with paper, plastic, or mica dielectric).\n- Oil-immersed or gas-filled capacitors.\n- Oil-filled power capacitors (often fitted with pressure gauges and safety valves).\n- Electrolytic capacitors (using aluminium or tantalum with oxide dielectric film, including solid/paste dry electrolytes).\n(II) Variable capacitors :\n- Using overlapping plates (rotor/stator) to vary capacitance (e.g. tuning capacitors with air dielectric).\n- Adjustable or pre-set capacitors (trimmer capacitors) for fine-tuning circuits.\n- Assembly of capacitors connected in series or parallel inside a box/housing (e.g. power factor correction capacitor banks).\n\nParts of capacitors are also classified here.\n\nThe heading excludes :\n- Synchronous motors (condensers) used for power factor correction (heading 85.01).\n\nSubheading Notes :\n- Subheading 8532.23 : Single-layer ceramic dielectric fixed capacitors (disc or tubular).\n- Subheading 8532.24 : Multilayer ceramic dielectric fixed capacitors (MLCC chips with leads)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.32 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
