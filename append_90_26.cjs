const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9026",
  "titleKo": "90.26 - 액체나 기체의 유량ㆍ액면ㆍ압력이나 그 밖의 변량(變량)의 측정용이나 검사용 기기(예: 유량계ㆍ액면계ㆍ압력계ㆍ열 측정계). 다만, 제9014호ㆍ제9015호ㆍ제9028호ㆍ제9032호의 것은 제외한다.",
  "titleEn": "90.26 - Instruments and apparatus for measuring or checking the flow, level, pressure or other variables of liquids or gases (for example, flowmeters, level gauges, manometers, heat meters), excluding instruments and apparatus of heading 90.14, 90.15, 90.28 or 90.32.",
  "contentKo": "이 호에는 파이프, 탱크, 개방 수로 등 밀폐되거나 개방된 공간 내 액체나 기체의 유량(flow), 액면(level), 압력(pressure), 소비 열량 등의 물리적 변량을 측정/검사하는 공업용 계측기 및 이들의 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 액체의 유량이나 액면 측정/검사기(제9026.10호) :\n  - 유량계(flowmeter) : 차압식 유량계(피토관, 벤투리관, 오리피스 플레이트 방식), 가변면적 유량계(로타미터 rotameter, 유리관 플로트식), 전자기식/초음파식/열식 유량계 (단, 일정 기간 흐른 유량의 총량을 적산하는 가정용 수도계량기 등은 제9028호로 제외).\n  - 액면계(level gauge) : 플로트식(부자식), 압축공기/정역학 차압식 액면계, 굴절률 차이 이용 이색광 보일러 액면계, 정전용량식/초음파식 전기 액면계, 가스미터(gasometer) 벨 높이 지시계.\n- 압력 측정/검사기(manometer, 압력계)(제9026.20호) :\n  - 액체주식 압력계(수은/물 U자관, 경사관식 압력계).\n  - 금속식 압력계(다이어프램, 캡슐, 부르동관 Bourdon tube 변형식 압력계).\n  - 피스톤 압력계 및 전기식 압력센서(저항/정전용량 변화식).\n  - 진공계(vacuum gauge) : 초진공 측정을 위한 열이온 전리 게이지(ionisation gauge)(단, 진공관 단독 제시는 제8540호로 제외).\n  - 차압계(differential pressure gauge) 및 최대최소 지시 압력계.\n- 그 밖의 변량 계측기 및 열측정계(제9026.80호) :\n  - 공업용 열계량기(heat meter) : 온수 보일러 등의 소비 열량을 계산하기 위해 급수량계, 입출구 온도계, 연산 적산 장치를 조합한 복합 기기.\n  - 아파트 방열기(radiator) 부착식 간이 액체 증발식 열량계.\n  - 갱도, 터널, 굴뚝, 배관 내 통기(풍속) 측정용 팬 날개식 풍속계(anemometer)(단, 기상관측용 풍속계는 제9015호로 제외).\n- 부분품과 부속품(제9026.90호) : 압력계용 부르동관, 플로트, 오리피스 판, 압력계 다이얼 및 전용 그래픽 자동 기록장치.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 압력 또는 유량 자동 제어 밸브 (제8481호)\n(b) 자동 온도/유량 조절용 자동 조절기(레귤레이터, 서보 기구식 조절기) (제9032호)\n(c) 가정용/송배전용 적산 적산 계량기(수도/가스/전기 계량기) (제9028호)\n(d) 기상 관측용 풍향계/풍속계 및 수리 계측용 피토관/유속계 (제9015호)\n(e) 기압계(대기압 측정용 barometer) 및 온도계, 건습구 습도계 (제9025호)\n(f) 물리화학 분석용 및 점도/밀도 측정용 계측기 (제9027호)" ,
  "contentEn": "This heading covers industrial instruments and apparatus for measuring or checking the flow, level, pressure, or heat consumption of liquids or gases (such as flowmeters, level indicators, manometers, vacuum gauges, and heat meters).\n\nIt includes :\n- Liquid flow or level meters (subheading 9026.10) including differential pressure flowmeters (Pitot/Venturi tubes), rotameters (variable area), magnetic/ultrasonic flowmeters, float/differential pressure level indicators, and electrical level gauges (capacitive/ultrasonic).\n- Pressure gauges (manometers) (subheading 9026.20) including liquid-type (U-tube), bimetallic, Bourdon tube, piston, electrical pressure sensors, vacuum gauges (including ionisation gauges), and differential manometers.\n- Other instruments (subheading 9025.80) including heat meters (integrating flowmeters and thermocouples to measure calorie consumption), radiator evaporation-type heat allocators, and duct anemometers.\n- Parts and accessories (subheading 9026.90).\n\nExcludes pressure-reducing valves (heading 84.81), automatic regulators (thermostats/manostats) (heading 90.32), supply meters (water/gas meters) (heading 90.28), meteorological wind meters (heading 90.15), barometers/thermometers (heading 90.25), and physical analysis instruments (heading 90.27)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.26 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
