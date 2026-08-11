const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9025",
  "titleKo": "90.25 - 액체비중계와 이와 유사한 부력식 측정기ㆍ온도계ㆍ고온계ㆍ기압계ㆍ습도계와 건습구 습도계(이들을 결합한 것을 포함하며, 기록장치가 있는지에 상관없다)",
  "titleEn": "90.25 - Hydrometers and similar floating instruments, thermometers, pyrometers, barometers, hygrometers and psychrometers, recording or not, and any combination of these instruments.",
  "contentKo": "이 호에는 액체의 비중을 부력으로 측정하는 비중계, 온도를 측정하는 온도계/고온계/온도기록계, 대기압을 측정하는 기압계, 공기의 습도를 측정하는 습도계 및 건습구 습도계(이들의 일체형 복합 기기 포함)와 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 온도계와 고온계(다른 기기와 결합되지 않은 것)(제9025.11~19호) :\n  - 액체 충전식 직시형 온도계(제9025.11호) : 수은/알코올 유리 온도계(가정용, 욕조용, 보일러용, 최고최저 온도계, 체온계 등).\n  - 기타 온도계 및 고온계(제9025.19호) :\n    - 바이메탈 온도계(금속 팽창률 차이 이용, 자동차 라디에이터용 등).\n    - 압력식(부르동관식) 온도계(액체/가스 팽창 압력식).\n    - 액정 온도계(온도에 따라 색상 변화).\n    - 전기식 온도계/고온계 : 백금 저항 온도계(RTD), 서미스터(semiconductor), 열전대(thermocouple) 온도계/고온계(백금-로듐 등).\n    - 복사/광학식 고온계(radiation/optical pyrometer) : 필라멘트 소실형 고온계, 광학식 프리즘 온도계, 고온측정용 망원경(석영 편광식).\n    - 온도를 연속적으로 원판/드럼에 기록하는 온도기록계(thermograph).\n- 그 밖의 기기(비중계, 기압계, 습도계 등)(제9025.80호) :\n  - 부력식 비중계(hydrometer) : 알코올계, 검당계(주조/제당용), 검염계, 산농도계(배터리 전해액 비중 측정용), 뇨비중계(보메, 브릭스 등).\n  - 기압계(barometer) : 대기압 측정용 수은기압계(포틴 청우계 등), 아네로이드(aneroid) 청우계, 기압고도계(barometric altimeter, 단순 고도 표시는 제외), 자동기록기압계(barograph).\n  - 습도계 및 건습구 습도계 : 모발/플라스틱 습도계, 화학적 흡수 습도계, 노점(dewpoint) 습도계, 전기식/콘덴서식 습도계, 기계식 건습계(psychrometer), 온습도 기록계(thermo-hygrograph).\n- 부분품과 부속품(제9025.90호) : 온도계용 케이스, 다이얼 지침, 비중계용 눈금 유리 튜브 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 온도 제어 장치가 포함된 서모스탯(thermostat) 자동온도조절기 (제9032호)\n(b) 고체(점토 등)의 수축을 이용해 요(窯) 온도를 측정하는 세라믹 파이로스코프(pyroscope) (제9017호 또는 제9031호)\n(c) 액체/가스의 전용 압력계, 진공계(기압계가 아닌 것) 및 공업용 유속계 (제9026호)\n(d) 기상용 라디오존데(radio-sonde) (제9015호)\n(e) 비중병(pyknometer) 및 의료 검사용 유리 제품 (제7017호)\n(f) 저항/열전쌍의 기전력을 단순히 측정 표시하는 전압계, 저항측정기 (제9030호)\n(g) 비중 비전기식 저울 (제9016호)\n(h) 습도 반응에 따라 색상이 변화하는 함침 종이 (제3822호)" ,
  "contentEn": "This heading covers hydrometers, thermometers, pyrometers, barometers, hygrometers, and psychrometers, recording or not, and any combination of these (e.g., thermo-hygrometers).\n\nIt includes :\n- Liquid-filled, direct-reading thermometers (subheading 9025.11) including household, clinical, chemical, boiler, and maximum-minimum glass thermometers.\n- Other thermometers and pyrometers (subheading 9025.19) including bimetallic, vapor/gas pressure-type, liquid crystal, electrical resistance thermometers (RTD), thermistors, thermocouples, optical/disappearing filament pyrometers, and thermographs.\n- Other instruments (subheading 9025.80) including hydrometers (alcoholometers, saccharometers, acidimeters), barometers (mercury, aneroid, sympiesometers, barographs), hygrometers (hair, dewpoint, chemical, electrical), and psychrometers.\n- Parts and accessories (subheading 9025.90).\n\nExcludes automatic temperature regulators (thermostats) (heading 90.32), pyrometric cones (heading 90.17 or 90.31), industrial pressure gauges (heading 90.26), meteorological radio-sondes (heading 90.15), specific gravity bottles (heading 70.17), and electrical voltmeters/ammeters (heading 90.30)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.25 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
