const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8603",
  "titleKo": "86.03 - 자주식(自走式) 철도용이나 궤도용 객차와 화차(제8604호의 것은 제외한다)",
  "titleEn": "86.03 - Self-propelled railway or tramway coaches, vans and trucks, other than those of heading 86.04.",
  "contentKo": "이 호에는 자체 동력 장치를 갖추고 직접 승객이나 화물을 실어 나르는 자주식(동력 분산식) 철도/궤도 객차, 밴(van), 화차 및 트럭을 분류한다. 기관차(제8601호, 제8602호)와 구별된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전동 객차 및 전차(tram) : 가공 가선이나 제3궤조를 통해 외부에서 전류를 급전받는 지하철, 도시철도용 모터 카 객차(제8603.10호).\n- 디젤 동력차 및 내연기관식 레일카 (디젤 액체식, 디젤 전기식 등).\n- 축전지(배터리) 구동식 자주식 객차/화차.\n- 자이로 드라이브식 궤도차(electro-gyro rail vehicle).\n- 랙 레일(rack-rail) 톱니바퀴식 산악 궤도 자주식 차량.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전철 바퀴(철도 레일 주행용 휠)로 교체하여 레일에서 주행할 수 있으나 본질적으로 도로 주행용 차량인 개조 카 (제8702호 또는 제8704호)\n(b) 철도 유지보수/점검용 자주식 차량 (제8604호)",
  "contentEn": "This heading covers self-propelled railway or tramway coaches, vans, and trucks designed to carry passengers or goods. Unlike locomotives, they combine a power unit and carrying space.\n\nIt includes :\n- Electrically-propelled coaches and trams powered from an external source (via pantograph, trolley, or third rail).\n- Motorised rail-cars driven by diesel or other internal combustion engines (with solid, pneumatic, or rack-rail tyres).\n- Accumulator-powered self-propelled rail vehicles.\n- Electro-gyro rail vehicles storing energy in a high-speed flywheel.\n\nExcludes road vehicles convertible to railcars simply by changing wheels and locking steering (heading 87.02 or 87.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.03 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
