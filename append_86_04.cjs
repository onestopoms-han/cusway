const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8604",
  "titleKo": "86.04 - 철도나 궤도의 유지용이나 보수용 차량[자주식(自走式)의 것인지에 상관없다][예: 공작차(workshop)ㆍ기중기차(crane)ㆍ밸러스트 템퍼(ballast tamper)ㆍ트랙라이너(trackliner)ㆍ검사차ㆍ궤도검사차]",
  "titleEn": "86.04 - Railway or tramway maintenance or service vehicles, whether or not self-propelled (for example, workshops, cranes, ballast tampers, trackliners, testing coaches and track inspection trolleys).",
  "contentKo": "이 호에는 철도 선로의 신설, 유지보수, 청소, 시설 안전 검사 등에 특화되어 제작된 철도차량(자주식 여부 무관)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 설비차량 : 발전기, 리프팅 잭, 용접기 등을 구비한 공작차(workshop).\n(2) 기중기차(crane vehicle) : 전복 차량 인양 및 레일 부설용 기중기가 장착된 차량.\n(3) 윈치 트럭(winch truck) 및 가설용 발판 차량(scaffold truck).\n(4) 청소 및 자갈 다짐용 차량 : 밸러스트 탬퍼(ballast tamper), 자갈 살포차 등.\n(5) 트랙라이너(trackliner) 및 궤도 부설용 기계가 내장된 자주식 차량.\n(6) 살수/살충 분사차(제초제 분포차).\n(7) 궤도 검사 및 측정차 : 레일 결함 감지, 중량 하중 측정, 궤도 불규칙 측정 센서 및 기기가 탑재된 시험용 차량(testing coach).\n(8) 보수 요원 및 기자재 수송용 자주식/비자주식 트롤리(레일 사이클 rail cycle 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 철도 차량 섀시 구조로 일체화되어 조립되지 않고, 단순히 바퀴가 달린 플랫폼 위에 얹어 놓아 독립적으로 이동하는 기계 및 측정기 (각 해당 호, 예: 제84류, 제90류)",
  "contentEn": "This heading covers vehicles specially designed for the construction, maintenance, and service of railway or tramway tracks or lines, whether or not self-propelled.\n\nIt includes :\n- Workshop vehicles fitted with tools, welding apparatus, jacks, hoists, generators, etc.\n- Crane vehicles for clearing wrecks, laying track, or loading/unloading cargo at stations.\n- Winch trucks, scaffold trucks, cement mixer trucks for track base installation, and herbicide spray cars.\n- Ballast tampers, trackliners, and other specialized track maintenance machinery.\n- Testing coaches and track inspection cars (e.g. for testing bridges, measuring track deflection, registering track irregularities).\n- Inspection trolleys (including motorized or hand-propelled rail cycles).\n\nExcludes machines or measuring instruments mounted on simple wheeled platforms rather than on a true railway chassis/trolley (headings such as 84.25, 84.26, 84.28, 84.30, etc.)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.04 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
