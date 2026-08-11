const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8504",
  "titleKo": "85.04 - 변압기ㆍ정지형 변환기(예: 정류기)와 유도자",
  "titleEn": "85.04 - Electrical transformers, static converters (for example, rectifiers) and inductors.",
  "contentKo": "이 호에는 전자기 유도나 정지형 소자를 이용하여 전기에너지를 변환, 조정, 유도하는 기기를 분류한다.\n\n(I) 변압기 (Electrical transformer)\n가동 부분 없이 전자기 유도를 이용하여 교류의 전압, 임피던스 등을 다른 교류 전류로 변환하는 장치이다.\n- 전력용 변압기(배전 및 변전소용 대형 유입식/건식 변압기), 정합 변압기(matching transformer), 계기용 변압기(CT, PT), 방전등용 안정기 등을 포함한다.\n- 평형 불평형 변성기(Balun)를 포함한다.\n- 유도코일(induction coil)을 포함한다 (단, 내연기관용 점화 코일은 제8511호로 제외).\n- 용접용 헤드나 기구가 없는 단독 제시용 용접용 변압기를 포함한다 (용접 장비 세트는 제8515호).\n\n(II) 정지형 변환기 (Electrical static converter)\n도체와 부도체로 번갈아 작동하는 정지형 소자를 결합하여 전기에너지를 변환하는 기기이다.\n- 정류기(rectifier) : 교류 -> 직류 변환장치 (단결정/다결정 반도체 정류기, 수은아크 정류기, 열이온정류기 등).\n- 인버터(inverter) : 직류 -> 교류 변환장치.\n- 교류변환기 및 사이클변환기(cycle converter) : 교류 주파수나 전압 변환장치.\n- 직류변환기(DC-DC converter) : 직류 전압 레벨 변환장치.\n- 무정전 전원 공급장치(UPS) 및 안전용/안정용 전원공급기(SMPS)를 포함한다.\n- 고압발전기(용도별 전원장치 형태, 단 의료 방사선용은 제9022호).\n\n(III) 유도자 (Inductors / Choke coils)\n단권 코일 등으로 구성되어 교류회로에서 전류의 흐름을 제한하거나 저지하는 소자(초크코일, 인덕터)이다.\n- 인쇄처리 방법으로 제작된 칩 인덕터/인덕턴스를 포함한다.\n- 단, 음극선관용 편향코일(DY)은 제8540호로 제외한다.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다. 금속탱크형 수은 아크 정류기는 펌프 유무와 무관하게 이 호의 부분품으로 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 변압기 탭 조절용 스위치 (제8536호)\n(b) 유리구/금속 외 케이싱 정류관 및 사이라트론 (제8540호)\n(c) 개별 반도체 다이오드, 사이리스터, 트랜지스터 (제8541호)\n(d) 집적회로 (제8542호)\n(e) 자동전압조정기 (제9032호)",
  "contentEn": "This heading covers electrical transformers, static converters and inductors.\n\nIt includes :\n(I) Electrical transformers :\n- Power transformers, matching transformers, instrument transformers (current/voltage transformers), and ballasts for discharge lamps/tubes.\n- Baluns (balancing units) for reducing electromagnetic interference.\n- Induction coils (excluding ignition coils for internal combustion engines - heading 85.11).\n- Welding transformers presented without welding heads (otherwise heading 85.15).\n(II) Static converters :\n- Rectifiers (converting AC to DC, including semiconductor rectifiers, mercury arc rectifiers, thyratron/thermionic rectifiers).\n- Inverters (converting DC to AC).\n- AC converters and cycle converters (changing frequency or voltage).\n- DC-to-DC converters.\n- Uninterruptible Power Supplies (UPS) and regulated power supplies.\n- High-tension generators for electronic/microwave/ion-beam tubes (excluding medical X-ray generators - heading 90.22).\n(III) Inductors (chokes) :\n- Inductors and inductance coils, including chip inductors obtained by printing processes.\n\nParts of these appliances are classified here. Metal tank mercury arc rectifiers are always classified as parts of this heading.\n\nThe heading excludes :\n(a) Switched taps for transformers (heading 85.36).\n(b) Rectifying tubes and valves (except metal tank mercury arc types) (heading 85.40).\n(c) Semiconductor diodes, transistors, and thyristors (heading 85.41).\n(d) Electronic integrated circuits (heading 85.42).\n(e) Automatic voltage regulators (heading 90.32)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.04 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
