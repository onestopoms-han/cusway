const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9014",
  "titleKo": "90.14 - 방향탐지용 컴퍼스(compass)와 그 밖의 항행용 기기",
  "titleEn": "90.14 - Direction finding compasses; other navigational instruments and appliances.",
  "contentKo": "이 호에는 방향 탐지용 컴퍼스 및 선박(해양), 항공기, 우주선의 비행과 항행을 위한 전용 기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 방향탐지용 컴퍼스(compass)(제9014.10호) : 자기 컴퍼스(magnetic), 자이로 컴퍼스(gyroscopic), 자이로마그네틱 컴퍼스, 비너클(binnacle) 컴퍼스 및 수지식 컴퍼스.\n- 항공용 또는 우주항행용 기기(컴퍼스 제외)(제9014.20호) :\n  - 기압식/전기식 고도계(altimeter).\n  - 항공 속도계(air speed indicator) 및 승강 속도계(vertical speed indicator).\n  - 인공수평의(artificial horizon, 자이로 수평의) 및 선회경사계(turning and banking indicator).\n  - 마하미터(mach-meter) 및 가속도계(accelerometer).\n  - 항공기 자동조종장치(automatic pilot, 오토파일럿).\n- 그 밖의 항행용 기기(제9014.80호) :\n  - 육분의(sextant), 팔분의(octant), 방위나침의(bearing finder).\n  - 선박용 오토파일럿(gyro pilot) 및 항로기록장치(course recorder).\n  - 롤링 측정용 경사계(inclinometer).\n  - 선박 속도계(log) : 유속차압 피토관식 속도계 및 수전 프로펠러 회전식 속도계.\n  - 수심/해저 지형 측정용 측심납(sounding lead), 반향측심기(echo sounder), 초음파 소나(sonar, asdic - 잠수함/어군 탐지용).\n- 부분품과 부속품(제9014.90호) : 하우징, 부속 마운트, 소나용 부품 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 위성위치추적시스템(GPS) 수신기, 레이더 기기, 무선 항행용 송수신기 및 라디오 원격조종기기 (제8526호)\n(b) 자이로계 유닛으로서 단순 전기적 신호 측정만을 지시하는 기기 (제9030호)\n(c) 비행 기압계, 기상 온도계 (제9025호) 및 압력계/액면계 (제9026호)\n(d) 항해기록용 판토그래프(pantograph) 제도기 (제9017호)\n(e) 기체의 엔진 회전계(tachometer) (제9029호)\n(f) 선박용 크로노미터(정밀 시계) (제91류)" ,
  "contentEn": "This heading covers direction finding compasses and other navigational instruments and appliances for marine, aeronautical, or space navigation.\n\nIt includes :\n- Direction finding compasses (subheading 9014.10) including magnetic, gyroscopic, gyromagnetic, and binnacle compasses.\n- Aeronautical or space navigational instruments (subheading 9014.20) including altimeters, air speed indicators, vertical speed indicators, artificial horizons (gyro horizons), turning and banking indicators, mach-meters, accelerometers, and automatic pilots.\n- Other navigational instruments (subheading 9014.80) including marine sextants, octants, gyro pilots, course recorders, inclinometers, marine logs (Pitot tube or propeller type), sounding leads, echo sounders, and sonar (asdic) equipment.\n- Parts and accessories (subheading 9014.90).\n\nExcludes radar, GPS receivers, and radio navigational aids (heading 85.26), pantographs for drawing courses (heading 90.17), barometers and thermometers (heading 90.25), pressure gauges (heading 90.26), tachometers (heading 90.29), and marine chronometers (Chapter 91)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.14 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
