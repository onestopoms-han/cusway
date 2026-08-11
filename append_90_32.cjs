const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9032",
  "titleKo": "90.32 - 자동조절용이나 자동제어용 기기",
  "titleEn": "90.32 - Automatic regulating or controlling instruments and apparatus.",
  "contentKo": "이 호에는 물리적 변량(온도, 압력, 액면, 유량 등) 또는 전기적 변량(전압, 전류, 주파수 등)의 실제 측정값을 지속적/주기적으로 검출하여 미리 설정된 목표값(희망치)과 비교한 후, 이를 유지하도록 자동 조절 명령을 내리는 전기식, 액압식, 공기식 자동 제어 기기(서모스탯, 매노스탯 등) 및 이들의 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 온도 자동조절용 기기(서모스탯 thermostat)(제9032.10호) :\n  - 온도 변화에 반응하는 검출 요소(바이메탈 스트립, 액체 팽창 벨로우즈, 열전쌍, 서미스터 등), 온도 설정 장치 및 스위치/밸브 전달 기구가 결합된 주택/보일러/냉장고용 서모스탯.\n  - 전기식 가열 기구(오븐, 그릴 등)의 전력 통제용 서모스탯 스위치(동력 듀티 컨트롤러).\n- 매노스탯(manostat, 압력 자동제어기)(제9032.20호) : 밀폐 용기, 가스 홀더 내의 가스/액체 압력을 지정 수준으로 자동 유지시키기 위해 조작 신호를 주는 압력 스위치식 조절기(감압 밸브 자체는 제외).\n- 그 밖의 액압식이나 공기식 자동 조절기기(제9032.81호) : 피드백 신호를 받아 오일 실린더 또는 에어 피스톤을 작동시키기 위해 유압/공기압 밸브의 개폐 신호를 연속 제어하는 기계식/액압식 서보 조절기.\n- 그 밖의 전자식 및 전기식 자동 조절기기(제9032.89호) :\n  - 자동 액면 조절기(level regulator) : 플로트(부자) 또는 전극 전도도를 이용해 급배수 펌프/밸브를 제어하는 액면 조절 장치.\n  - 자동 습도 조절기(humidistat) : 온실, 공장, 보관 창고 내 습도를 자동 조절하기 위해 가습기/팬 작동용 스위치 접점을 개폐하는 장치.\n  - 전압 및 전류 자동 조절기(automatic voltage regulator, AVR) : 발전기 또는 변전용 인버터 출력 전압을 항시 일정하게 유지하는 자동 전압 조절 장치(단, 내연기관용은 제8511호로 제외).\n  - 자동 주파수 조절기, 모터 회전속도(RPM)/토크(torque)/인장력(tension) 자동 조절기.\n  - 노(furnace) 전극 높이 자동 조절기.\n- 부분품과 부속품(제9032.90호) : 온도조절기용 바이메탈 감응 소자, 매노스탯용 압력 다이어프램/벨로우즈, 조절 장치 하우징.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전동 밸브 또는 전자기 솔레노이드 밸브 단독 제시품 (제8481호)\n(b) 자동 온도 조절기가 내장된 항온 수조(incubator), 가열 장치 자체 (각 해당 호)\n(c) 내연기관용 전압 조정기(컷아웃 스위치가 하우징에 일체화된 것) (제8511호)\n(d) 산업용 프로그래머블 로직 컨트롤러(PLC) (제8537호)\n(e) 측정 신호 전달용 단독 접점, 계전기(릴레이) 및 마그네틱 스위치 (제8536호)\n(f) 기압계(대기압 측정용) (제9025호)" ,
  "contentEn": "This heading covers automatic regulating or controlling instruments and apparatus (such as thermostats, manostats, level regulators, humidistats, and automatic voltage regulators) designed to bring and maintain variables (temperature, pressure, flow, level, or voltage) to a preset value.\n\nIt includes :\n- Thermostats (subheading 9032.10) using bimetallic strips, bellows, or electrical resistors, and duty controllers for electric heating appliances.\n- Manostats (subheading 9032.20) for automatically controlling the pressure of gases or liquids.\n- Hydraulic or pneumatic regulators (subheading 9032.81) for driving control actuators.\n- Other automatic regulators (subheading 9032.89) including level regulators (float/electrode type), humidistats (humidity controllers), automatic voltage regulators (AVR, except for combustion engines), frequency regulators, and tension controllers.\n- Parts and accessories (subheading 9032.90).\n\nExcludes motor-operated or solenoid valves (heading 84.81), voltage regulators for internal combustion engines (heading 85.11), programmable logic controllers (PLCs) (heading 85.37), and electric relays/switches (heading 85.36)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.32 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
