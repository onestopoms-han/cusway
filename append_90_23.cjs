const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9023",
  "titleKo": "90.23 - 전시용으로 설계된 기구와 모형(예: 교육용이나 전람회용)(다른 용도에 사용될 수 없는 것으로 한정한다)",
  "titleEn": "90.23 - Instruments, apparatus and models, designed for demonstrational purposes (for example, in education or exhibitions), unsuitable for other uses.",
  "contentKo": "이 호에는 학교, 전시장 등에서 오직 교육, 시연, 전시 목적으로만 사용되며 실무나 타 용도에 사용할 수 없는 장치, 해부 모형 및 축소 단면 모형 등을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 물리/화학/전기 실험 교육 시연용 기구 : 윔스허스트(Wimshurst) 정전기 실험 기계, 앳우드(Atwood) 중력 실험 장치, 마그데부르크 반구(대기압 증명용), 그라브산드(Gravesande) 열팽창 링, 뉴턴 원판(색광 혼합 설명용).\n- 인체 및 동물 해부학 모형(플라스틱/석고제 해부도형, 결정 구조 입체 모형 등).\n- CPR 인공호흡 훈련용 실물 크기 훈련용 마네킹(연습용 동체 dummy).\n- 기계/엔진 등의 기능 설명용 내부 절단 모형(기관차, 선박, 원동기, 펌프의 단면 작동 모형) 및 배선 교육용 전시 패널(라디오 수신기 배선 패널, 기계 윤활 계통 전시 패널).\n- 산업 공정 단계별 시제품/원료 견본을 수록한 교육용 쇼케이스 및 전시 패널.\n- 포술 실내 훈련용 모형.\n- 현미경 학습용 조제 슬라이드 표본.\n- 건축, 도시 계획, 유적지 복원 입체 모형(석고/나무/판지제).\n- 선박, 항공기, 기차, 기계류의 축소 모형(금속/나무제 전시용, 광고용).\n- 지형/지방/산악 입체 지도(relief map), 입체 도시계획도, 천구의/지구의(입체식).\n- 군사용 모의 전투 훈련 기기 : 탱크 운전 교육용 조종 시뮬레이터(동력 갠트리 지형 모형, 컴퓨터 조작반, 액압 제어반 결합체).\n- 부분품과 부속품.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단순 인쇄된 종이/플라스틱제 교육용 벽보, 배선도, 차트 (제49류)\n(b) 항공기 조종사 훈련용 비행 시뮬레이터(지상비행훈련장치) (제8805호)\n(c) 오락/완구/조립 장난감용 작동 모형 및 전기 완구 기관차/크레인 (제95류)\n(d) 상점 윈도우용 회전 쇼윈도 마네킹 인형 (제9618호)\n(e) 수집가용 수집품(동식물 박제, 광물 표본, 고고학적 유물) (제9705호)\n(f) 제작된 지 100년을 초과한 골동 입체 지도/지구의 (제9706호)" ,
  "contentEn": "This heading covers instruments, apparatus, and models designed solely for demonstrational or educational purposes (exhibitions, schools, or military training) and unsuitable for other practical uses.\n\nIt includes :\n- Physics/chemistry laboratory demonstration apparatus (Wimshurst machines, Atwood's machines, Magdeburg hemispheres, Gravesande's rings, Newton's discs).\n- Anatomical models of humans or animals, and molecular/crystallographic models.\n- Life-sized CPR training dummies.\n- Sectional or cut-away models of engines, ships, or locomotives, and instructional wiring boards (radio circuitry, lubricating systems).\n- Stencil samples and manufacturing step-by-step showcase displays for technical schools.\n- Prepared specimen slides for microscopic study.\n- Relief plans, architectural models (plaster, cardboard, or wood), and relief globes.\n- Military simulators for training tank drivers (comprising motion platforms, terrain models, cameras, and computers).\n- Parts and accessories.\n\nExcludes printed charts, diagrams, or plans (Chapter 49), flight simulators (heading 88.05), toy models or model trains (heading 95.03/Chapter 95), store display mannequins (heading 96.18), collector's items (heading 97.05), and antique relief globes over 100 years old (heading 97.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.23 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
