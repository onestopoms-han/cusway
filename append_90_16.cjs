const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9016",
  "titleKo": "90.16 - 감량(感量) 50밀리그램 이하인 저울(추가 있는지에 상관없다)",
  "titleEn": "90.16 - Balances of a sensitivity of 5 cg or better, with or without weights.",
  "contentKo": "이 호에는 최소 감량(민감도 sensitivity)이 50mg(5cg) 이하인 고정밀 저울(전자식 및 진공 저울 포함)과 이들의 거치식 추를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 정밀 분석용 저울(analytical balance) : 미량화학저울, 극미량저울, 비진동분석저울 등 정량 화학분석용 저울.\n- 시금(assay) 저울 : 귀금속의 시금 및 분석용 저울.\n- 귀석(보석)용 저울 : 다이아몬드 등 보석 캐럿(carat) 등급 결정용 저울.\n- 약제사용 저울, 섬유용(실 중량측정) 저울, 견본용 저울(종이, 직물 샘플 면적당 중량 측정용).\n- 정역학(비중) 저울(hydrostatic balance) : 고체 또는 액체의 비중 측정용 저울.\n- 토션 밸런스(비틀림 저울) 및 진공 마이크로밸런스(자기평형코일 전류 측정식).\n- 저울과 함께 제시된 추(weight) 세트.\n- 부분품과 부속품 : 저울용 중간 기둥(beam), 저울접시(pan), 유리/플라스틱 캐비닛 케이스, 눈금판, 진동 감쇄장치(damper), 마노(agate)제 나이프에지 받침날 및 베어링.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 감량이 50mg을 초과하는 일반 산업용/가정용 저울 (제8423호)\n(b) 저울과 분리하여 독립적으로 제시되는 저울추 (제8423호)\n(c) 삼각대 및 독립 스탠드 (제9620호)" ,
  "contentEn": "This heading covers balances of all types (including electronic and vacuum balances) of a sensitivity (minimum readable change) of 5 cg (50 mg) or better, presented with or without weights.\n\nIt includes :\n- Analytical balances (microchemical, microbalances, non-oscillating analytical balances) used for quantitative chemical analysis.\n- Assay balances for testing precious metals.\n- Precious stone balances for measuring carats.\n- Chemists' balances, yarn balances, samples balances (for paper/fabric sample weights), and hydrostatic (specific gravity) balances.\n- Torsion balances and vacuum microbalances.\n- Parts and accessories including beams, pans, glass/plastic cabinets, dials, dampers, and agate knife-edges.\n\nExcludes balances of a sensitivity poorer than 5 cg (heading 84.23), separately presented weights (heading 84.23), and tripods (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.16 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
