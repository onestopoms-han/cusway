const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8605",
  "titleKo": "86.05 - 철도용이나 궤도용 객차[자주식(自走式)은 제외한다], 수하물차ㆍ우편차와 그 밖의 철도용이나 궤도용 특수용도차[자주식(自走式)과 제8604호의 것은 제외한다]",
  "titleEn": "86.05 - Railway or tramway passenger coaches, not self-propelled; luggage vans, post office coaches and other special purpose railway or tramway coaches, not self-propelled (other than those of heading 86.04).",
  "contentKo": "이 호에는 자주식(자체 구동 모터 장착형)이 아니며, 주로 여객열차 등에 연결되어 승객 수송 및 우편/수하물 수송, 혹은 특수 공공 목적에 사용되는 무동력(피견인식) 철도/궤도용 객차와 특수용도차를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 일반 여객용 객차(1등석, 2등석 등) 및 침대차(couchette), 식당차, 전망차, 카페차, 연회차.\n(2) 케이블카 객차 및 케이블 철도용 객차(funicular railway coach).\n(3) 전차(노면전차)용 무동력 트레일러 객차.\n(4) 광산의 갱내 요원 수송용 특수 객차.\n(5) 승무원/철도원의 취침/휴식/임시 거주용 객차.\n(6) 화객차(여객과 수하물을 동시에 싣는 차).\n(7) 우편물 정리를 위한 작업대 등을 갖춘 우편객차(post office coach).\n(8) 구급차, 병원차, X선 검진차 등 의료용 특수 객차.\n(9) 죄소 이송용 감방객차.\n(10) 무장을 갖춘 장갑객차(armoured coach).\n(11) 무선/통신 안테나 및 장비를 설치한 통신/무선차.\n(12) 장치, 모형 등을 비치한 직원 교육 및 전시회용 특수 객차.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모터가 내장된 자주식 전동차 및 디젤동력차 객차 (제8603호)\n(b) 선로 유지보수용 공작차, 기중기차, 측정시험차 등 (제8604호)",
  "contentEn": "This heading covers non-self-propelled passenger coaches, luggage vans, mail vans, and other special-purpose rail vehicles (excluding maintenance vehicles of heading 86.04).\n\nIt includes :\n- Passenger coaches of all kinds (including sleeping cars, dining cars, saloon cars, disco/dancing cars).\n- Funicular (cable) railway coaches and tramway trailer coaches.\n- Special underground mine passenger coaches.\n- Railway staff housing coaches.\n- Post office coaches and luggage vans.\n- Ambulance, hospital, or X-ray coaches.\n- Prison vans and armoured coaches.\n- Instruction or exhibition coaches fitted with machinery, scale models, etc.\n\nExcludes self-propelled passenger/mail coaches (heading 86.03) and track maintenance coaches (heading 86.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.05 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
