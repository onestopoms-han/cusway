const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9618",
  "titleKo": "96.18 - 마네킹 인형과 그 밖의 모델형 인형, 자동인형과 그 밖의 쇼윈도 장식용인 움직이는 전시용품",
  "titleEn": "96.18 - Tailors' dummies and other lay figures; automata and other animated displays used for shop window dressing.",
  "contentKo": "이 호에는 의류 입체 재단용 마네킹, 쇼윈도 의류 진열용 바디/피규어, 화가/조각가용 목제 관절 인형, 의료 실습용 붕대 감기 마네킹, 그리고 쇼윈도 장식 및 광고 홍보 목적으로 움직이는 전기식/기계식 자동 작동 인형 및 장치(Automata)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 재단사용 마네킹(tailors' dummy, dressmakers' dummy)(1) : 의복 재봉/디자인 시 입체 치수 피팅을 위해 혼응지, 석고, 플라스틱으로 성형하고 외면에 천을 씌워 높낮이 조절 스탠드에 장착한 동체(바디) 모델.\n- 기타 모델형 인형 및 lay figure(2) : 쇼윈도 옷 전시용 마네킹 완제품 및 신체 일부분 모델(헤드-가발/모자용, 레그-스타킹용, 핸드-장갑용), 관절 접합식 미술용/조각용 크로키 목제 인형, 의대/간호대 실습용 붕대/부목 결속 모델.\n- 자동인형(automaton) 및 쇼윈도 움직이는 전시 기기(3) : 사람/동물 형상으로 전기 또는 태엽 모터 장치에 의해 쇼윈도 내에서 지속적으로 특수 동작(손 흔들기, 회전, 제품 시연 등)을 수행하여 시선을 끄는 자동 전시용 기계.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전단용 실루엣, 판지나 합판 등으로 만든 평면 마네킹 가간판 (재질별 분류)\n(b) 의료 교육용/생리학 강의용으로만 내부 구조를 복합 재현하여 특수 설계된 인체 해부 모형 (제9023호)\n(c) 어린이 놀이용 인형 및 완구용 마리오네트, 로봇 장난감 (제9503호)" ,
  "contentEn": "This heading covers tailors' or dressmakers' dummies, lay figures (including display mannequins and artists' models), and animated displays (automata) used for shop window advertising.\n\nIt includes :\n- Tailors' dummies (1) made of paperboard, plaster, or plastics, covered in fabric and mounted on adjustable stands.\n- Lay figures (Mannequins) (2) representing full human bodies or parts (heads, hands, legs) for displaying apparel, hats, gloves, or stockings, and jointed wooden models for artists, or medical bandaging practice dolls.\n- Automata and animated displays (3) operated electrically or mechanically to attract attention or demonstrate products in shop windows.\n\nExcludes flat silhouette/profile signage of wood or cardboard (classified by material), high-fidelity medical/anatomical training models of heading 90.23, and children's dolls or toy puppets (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.18 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
