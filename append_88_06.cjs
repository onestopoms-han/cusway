const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8806",
  "titleKo": "88.06 - 무인기",
  "titleEn": "88.06 - Unmanned aircraft.",
  "contentKo": "이 호에는 기내에 조종사 없이 비행하도록 설계된 무인항공기(UAV, 드론)를 분류한다. 무인기는 지상 등 다른 장소에서 원격으로 제어되거나, 조종사 개입 없이 미리 짜인 비행 프로그램(자율비행)에 따라 비행할 수 있다.\n\n이 호에는 다음의 물품을 포함한다.\n- 승객 수송용으로 설계된 자율주행 드론 (플라잉 카, UAM 도심항공교통 수단)(제8806.10호).\n- 원격조종 비행만 가능한 드론 (최대이륙중량에 따라 제8806.21~29호) : 이륙 중량 250g 이하, 250g 초과~7kg 이하, 7kg 초과~25kg 이하, 25kg 초과~150kg 이하 등으로 세분화.\n- 자율비행 및 기타 구동 방식 무인기 (최대이륙중량에 따라 제8806.91~99호).\n- 농업용 농약 분사 드론, 항공 촬영용 드론(디지털 카메라 영구 장착형), 조난 구조용 드론, 소방 감시용 드론, 군사용 공격 및 정찰 드론.\n- 인공위성위치정보시스템(GNSS) 수신기 및 장애물 회피/목적물 인식을 위한 스마트 센서 시스템을 내장한 드론.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전적으로 완구/오락용으로 설계되어 위성항법장치(GPS) 및 야간 비행이 불가능하고 적재 능력이 없는 완구용 드론 및 장난감 비행 모형 (제9503호)" ,
  "contentEn": "This heading covers unmanned aircraft (drones, UAVs) designed to fly without a pilot on board (other than balloons/kites of heading 88.01).\n\nIt includes :\n- Unmanned aircraft designed for the transport of passengers (subheading 8806.10).\n- Remote-control-only unmanned aircraft (classified by maximum take-off weight under subheadings 8806.21 to 8806.29).\n- Other autonomous or programmed unmanned aircraft (classified by maximum take-off weight under subheadings 8806.91 to 8806.99).\n- Agricultural spraying drones, aerial photography drones with integrated cameras, rescue/surveillance drones, and military UAVs.\n- UAVs fitted with GNSS (GPS/GLONASS/BEIDOU) receivers and obstacle avoidance sensors.\n\nExcludes flying toys and recreational models designed solely for amusement (having low weight, no autonomous navigation, no payload capacity, and no smart electronics) (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.06 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
