const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8606",
  "titleKo": "86.06 - 철도용이나 궤도용 화차[자주식(自走式)은 제외한다]",
  "titleEn": "86.06 - Railway or tramway goods vans, wagons and trucks, not self-propelled.",
  "contentKo": "이 호에는 철도 선로를 주행하여 화물을 수송하는 자주식이 아닌 무동력(피견인식) 화물용 화차, 왜건, 트럭을 분류한다. 광산, 공장, 창고 부지 내 궤도용 소형 화차 및 트럭을 포함한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 탱크차(tank wagon) 및 가스/액체 수송용 통형 화차(reservoir wagon)(제8606.10호).\n(2) 자기양하식 화차(self-discharging wagon) : 호퍼카(hopper wagon), 경사식 왜건(tipping wagon) 등 화물을 스스로 하역할 수 있는 구조의 화차(제8606.30호).\n(3) 유개화차(boxcar, goods van) : 지붕과 측벽이 있어 밀폐할 수 있는 화차(제8606.91호).\n(4) 무개화차(open wagon) : 지붕이 없고 고정 측벽 높이가 60cm를 초과하는 화차(제8606.92호).\n(5) 기타 화차(평면 트럭, 저상식 트럭 underslung flat truck 등)(제8606.99호) :\n- 보온, 냉장, 냉동 화차.\n- 목재, 원목 수송용 화차.\n- 활어, 가금류 수송용 특수 화차 및 마필(말) 수송차.\n- 이단적(double-deck) 자동차 수송용 화차.\n- 광산용 화차(트롤리 덤프카 등).\n- 강관, 레일, 빔(girder) 등 장척물 수송용 화차.\n- 방사성 핵물질 수송용 특수 설계 차.\n- 도로 주행용 차량이나 궤도용 화차를 싣고 이동하는 피기백(piggyback)용 플랫폼 화차.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 철도 화차에 적재되어 수송되는 도로-레일 겸용 세미트레일러 자체 (제8716호)",
  "contentEn": "This heading covers non-self-propelled vehicles for the transport of goods by rail, including small wagons and trucks for use in mines, factories, and warehouses.\n\nIt includes :\n- Tank wagons and reservoir wagons (heading 8606.10).\n- Self-discharging wagons (hopper cars, tipping wagons) (heading 8606.30).\n- Closed and covered vans (boxcars) (heading 8606.91).\n- Open wagons with fixed sides exceeding 60 cm (heading 8606.92).\n- Flat trucks, underslung flat trucks for heavy loads, timber-carrying wagons, and double-deck automobile carriers (heading 8606.99).\n- Special insulated/refrigerated wagons.\n- Wagons for transporting live animals, fish, or poultry.\n- Mine tubs and wagons for carrying rails/girders.\n- Highly radioactive material transport containers on specialized rail trucks.\n\nExcludes road-rail semi-trailers carried on flat wagons (heading 87.16)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.06 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
