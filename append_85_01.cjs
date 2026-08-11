const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8501",
  "titleKo": "85.01 - 전동기와 발전기(발전세트는 제외한다)",
  "titleEn": "85.01 - Electric motors and generators (excluding generating sets).",
  "contentKo": "이 호에는 모든 형태의 전동기와 발전기(태양광 발전기 포함, 발전세트 제외)를 분류한다.\n\n(I) 전동기 (Electric motors)\n전기에너지를 기계적 동력으로 변환하는 기계로, 회전식 전동기와 선형 전동기를 포함한다.\n- 회전식 전동기 : 직류용/교류용, 저출력(계기, 시계, 재봉기 등)에서 대출력(압연기 등)까지 분류. 풀리, 기어, 기어박스, 플렉시블 샤프트 등을 장착한 모터 포함. 보트 추진용 아웃보드 모터 포함.\n- 선형 전동기 : 선운동 방식으로 동력을 전달하며 호버트레인 구동용, 컨베이어 운전용, 폴리솔레노이드식 액츄에이터, DC 선형전동기 및 스테퍼 모터(stepper motor) 등 포함.\n- 보조전동기(servomotor), 자기동기장치(self-synchronising unit), 전기밸브 작동기(valve actuator) 등 포함.\n\n(II) 발전기 (Electric generators)\n기계적 에너지, 태양에너지 등 다양한 에너지원으로부터 전력을 얻는 기계(원동기 없이 제시된 것).\n- 직류 발전기(dynamo) 및 교류 발전기(alternator) 포함.\n- 태양광 발전기 : 광전지 패널에 축전지, 다이오드, 전압조절기/변압장치 등 간단한 제어 소자를 결합하여 전동기/전해조 등에 직접 전력을 공급하는 독립식 발전 장치 포함.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8503호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모터를 결합한 컨베이어용 드럼/롤러 (제8431호)\n(b) 전자석식 진동기 (제8479호)\n(c) 원동기가 장치된 발전세트 (제8502호)\n(d) 고압발전기(변압기 등) (제8504호)\n(e) 내연기관용 시동전동기, 발전기/제네레이터 (제8511호)\n(f) 자전거/자동차 조명/신호용 발전기 (제8512호)\n(g) 단순 광전지 모듈/패널 (전류 제어 소자가 없는 것) (제8541호)\n(h) 신호발생기 (제8543호)\n(ij) X선 발생기 (제9022호), 전시용 발전기 (제9023호)",
  "contentEn": "This heading covers electric motors (including rotary and linear motors) and electric generators (excluding generating sets).\n\nIt includes :\n(I) Electric motors :\n- Rotary motors (AC or DC, including outboard motors and synchronous motors with gears, servomotors, self-synchronising units, electrical valve actuators).\n- Linear induction motors (used in hovertrains, conveyors, stepper motors, etc.).\n(II) Electric generators :\n- Alternators (AC) and dynamos (DC).\n- Photovoltaic (solar) generators, which consist of PV panels combined with batteries, voltage regulators, or diodes, supplying power directly to motors or electrolysers.\n\nParts of these machines are classified under heading 85.03.\n\nThe heading excludes :\n(a) Conveyor rollers incorporating motors (heading 84.31).\n(b) Electromagnetic vibrators (heading 84.79).\n(c) Generating sets (heading 85.02).\n(d) High-tension generators (heading 85.04).\n(e) Starter motors and generators for internal combustion engines (heading 85.11).\n(f) Lighting generators for bicycles or motor vehicles (heading 85.12).\n(g) Simple PV panels without control diodes or batteries (heading 85.41).\n(h) Signal generators (heading 85.43).\n(ij) X-ray generators (heading 90.22)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.01 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
