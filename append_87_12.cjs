const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8712",
  "titleKo": "87.12 - 모터를 갖추지 않은 이륜 자전거와 그 밖의 자전거(배달용 삼륜 자전거를 포함한다)",
  "titleEn": "87.12 - Bicycles and other cycles (including delivery tricycles), not motorised.",
  "contentKo": "이 호에는 모터를 부착하지 않은 모든 종류의 페달 구동식 자전거(이륜자전거, 삼륜자전거, 사륜자전거, 일륜자전거)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 무동력 이륜자전거 (성인용 및 어린이용 모두 포함).\n- 배달용 삼륜자전거 : 물품 적재용 상자(단열 상자 포함) 또는 바구니가 차대에 결합된 삼륜식 자전거.\n- 2인승 자전거(tandem).\n- 외바퀴 자전거(일륜차) 및 묘기/서커스 곡예용 특수 자전거.\n- 신체장애인용 특수 제작 자전거.\n- 평형 유지를 위해 뒷바퀴 양옆에 탈착식 보조 바퀴를 단 어린이용 이륜자전거.\n- 경주용 로드 바이크 및 산악 자전거(MTB).\n- 여러 개의 좌석과 페달을 갖춘 사륜 자전거(가족 자전거 등).\n- 체인, 스프라켓 및 전용 페달로 추진되며 조절식 운전대와 브레이크를 갖춘 자전거형 스쿠터.\n- 사이드카가 부착된 자전거 (사이드카 단독 제시는 제8711호 분류).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기 자전거 및 보조 모터 부착 자전거 (제8711호)\n(b) 볼 베어링 바퀴와 핸들이 부착되었으나 체인 구동 장치가 없는 일반 어린이용 세발자전거 및 장난감 자동차류 (제9503호)\n(c) 유원지용 특수 자전거 (제9508호)" ,
  "contentEn": "This heading covers non-motorised cycles, which are pedal-operated vehicles with one or more wheels.\n\nIt includes :\n- Standard bicycles (including children's bicycles).\n- Delivery tricycles with insulated or open transport boxes.\n- Tandems (two-seater bicycles).\n- Unicycles and specialized acrobatic/stunt bicycles.\n- Cycles specially adapted for disabled persons.\n- Bicycles fitted with auxiliary stabilising wheels at the rear hub.\n- Racing bicycles.\n- Lightweight four-wheeled cycles with multiple seats and pedals.\n- Pedal-propelled scooter-type cycles.\n\nExcludes cycles fitted with auxiliary motors (heading 87.11), toy tricycles/bicycles other than children's two-wheelers (heading 95.03), and cycles specialized for amusement parks (heading 95.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.12 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
