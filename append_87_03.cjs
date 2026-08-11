const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8703",
  "titleKo": "87.03 - 주로 사람을 수송할 수 있도록 설계된 승용자동차와 그 밖의 차량[제8702호의 것은 제외하며, 스테이션왜건(station wagon)과 경주용 자동차를 포함한다]",
  "titleEn": "87.03 - Motor cars and other motor vehicles principally designed for the transport of persons (other than those of heading 87.02), including station wagons and racing cars.",
  "contentKo": "이 호에는 주로 승객 수송용으로 설계된 승차 인원 9인 이하(운전자 포함)의 승용자동차와 그 밖의 차량(수륙양용차 포함)을 분류한다. 차량의 연료/구동 방식(가솔린, 디젤, 하이브리드, 플러그인 하이브리드, 순수전기식 등)에 관계없이 모두 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 레저/기타 전용 차량 (소호 제8703.10호)\n- 설상 주행용 차량(스노우모빌 등), 골프카 및 이와 유사한 차량.\n(2) 일반 승용 자동차 (소호 제8703.21~33호)\n- 일반 승용차(세단, 해치백, SUV, 스포츠카, 리무진, 택시, 경주용 자동차 등).\n- 스테이션왜건(station wagon) : 최대 9인승으로 구조변경 없이 인원과 화물을 동시에 실을 수 있는 차량.\n(3) 특수 용도 승용차\n- 구급차, 병원차, 영구차, 죄수 호송차.\n- 모터홈(캠퍼밴, 캠핑카 등) : 주방, 침실, 화장실 등의 주거 설비를 내장한 승용차.\n- 튜브섀시 형태의 사륜 ATV(일반 승용차식 조향기어 내장형).\n- 일반 자동차의 기계적 특성(후진기어, 차동기어)을 갖춘 경량 삼륜차.\n(4) 친환경 구동 방식 차량 (소호 제8703.40~80호)\n- 하이브리드 전기 자동차(HEV, PHEV 포함) : 내연기관과 전동기를 둘 다 추진용 모터로 장착한 차량 (단, 단순 스탑앤스타트 발전기 장착차는 제외).\n- 순수 전기 자동차(EV) : 배터리 팩 전원으로만 구동되는 전동기식 차량.\n\n[다목적 차량(SUV, 픽업 등)의 87.03호와 87.04호 분류 판단 기준]\n- 뒷좌석 구역에 안전벨트 및 고정 앵커 포인트가 있는 내구성 좌석이 존재할 것.\n- 뒷좌석 양측 측면에 유리가 있는 창문이 존재할 것.\n- 슬라이딩 도어나 리프트 도어 등 유리창이 포함된 승객용 승하차 도어가 존재할 것.\n- 운전석과 뒷공간 사이에 영구적인 격벽/차단벽이 없을 것.\n- 실내 마감(카펫, 에어컨 송풍구, 재떨이 등)이 화물차가 아닌 승객 편의 위주로 마감되어 있을 것.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 범퍼카 등 유원지용 오락 차량 (제9508호)\n(b) 10인 이상 수송용 버스/코치 (제8702호)\n(c) 주로 화물 수송용으로 설계된 화물차 및 픽업트럭 (제8704호)",
  "contentEn": "This heading covers motor vehicles of all types designed principally for the transport of persons, other than those of heading 87.02, regardless of the type of motor (spark-ignition, compression-ignition, hybrid, plug-in hybrid, or electric).\n\nIt includes :\n- Vehicles specially designed for travelling on snow (e.g., snowmobiles) and golf cars (subheading 8703.10).\n- Standard passenger motor cars (sedans, limousines, taxis, sports cars, and racing cars).\n- Station wagons (up to 9 persons including driver) designed for both passenger and luggage transport.\n- Special vehicles such as ambulances, hearses, prison vans, and motorhomes (campers fitted with living facilities like beds, kitchens, and toilets).\n- Three-wheeled vehicles with motorcycle engines having motor car characteristics (differential, reverse gear).\n- Hybrid Electric Vehicles (HEV) and Plug-in Hybrid Electric Vehicles (PHEV).\n- Pure Electric Vehicles (EV) powered by accumulator packs.\n\nCriteria for Passenger Vehicles (87.03 vs 87.04) :\n- Presence of permanent seats with safety belts or anchor points in the rear area.\n- Presence of windows along the sides of the rear passenger compartment.\n- No permanent panel or barrier between the driver area and the rear passenger/cargo area.\n- Presence of passenger compartment amenities (carpets, air vents, cup holders, etc.).\n\nExcludes dodge'em cars of fairground amusements (heading 95.08) and motor vehicles for transport of 10 or more persons (heading 87.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.03 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
