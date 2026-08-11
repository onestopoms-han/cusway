const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8529",
  "titleKo": "85.29 - 부분품(제8524호부터 제8528호까지에 열거된 물품에 전용되거나 주로 사용되는 것으로 한정한다)",
  "titleEn": "85.29 - Parts suitable for use solely or principally with the apparatus of headings 85.24 to 85.28.",
  "contentKo": "이 호에는 제8524호부터 제8528호까지의 기기(평판디스플레이 모듈, 송신기, 카메라, 레이더, 라디오/TV 수신기, 모니터, 프로젝터)에 전용되거나 주로 사용되는 부분품을 분류한다.\n\n이 호에는 다음의 부분품을 포함한다.\n(1) 모든 종류의 안테나(송수신기용) 및 안테나 반사기(reflector), 안테나 급전선(feeder).\n(2) 안테나 로테이터 (안테나 마스트에 장착된 전동기와 제어 박스로 구성된 회전 기구).\n(3) 제8525호 내지 제8528호 기기를 수용하도록 특별히 제작된 전용 케이스 및 캐비닛.\n(4) 안테나 필터 및 분리기(separator) (디플렉서, 듀플렉서 등).\n(5) 전용 프레임(섀시 chassis) 및 캐비닛 구조물.\n\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 금속제 안테나 마스트 및 철탑 (제7308호)\n(b) 고전압 트랜스 및 발생기 (제8504호)\n(c) 휴대폰용 탈착식 2차전지(배터리팩) (제8507호)\n(d) 제8517호와 제8525~8528호 기기에 공통적으로 사용되는 부분품 (제8517호)\n(e) 이어폰 및 헤드폰 (제8518호)\n(f) 음극선관(CRT) 및 관련 편향요크(DY) 등 편향코일 (제8540호)\n(g) 안테나 증폭기(부스터) 및 고주파 오실레이터 (제8543호)\n(h) 카메라용 광학 렌즈 및 광학 필터 (제9002호)\n(ij) 삼각대, 모노포드, 바이포드 (제9620호)",
  "contentEn": "This heading covers parts suitable for use solely or principally with the apparatus of headings 85.24 to 85.28 (flat panel display modules, transmission apparatus, cameras, radar, radio receivers, monitors, and projectors).\n\nIt includes :\n(1) Aerials (antennas) and aerial reflectors of all kinds (transmission/reception).\n(2) Aerial rotators (motors mounted on mast to rotate antenna and separate control box).\n(3) Cabinets and cases specially designed for apparatus of headings 85.25 to 85.28.\n(4) Aerial filters and separators.\n(5) Frames and chassis.\n\nParts are classified in accordance with the general provisions of Section XVI.\n\nThe heading excludes :\n(a) Antenna masts and towers of iron or steel (heading 73.08).\n(b) High-voltage generators (heading 85.04).\n(c) Accumulators for cellular phones (heading 85.07).\n(d) Parts suitable for use with both the apparatus of heading 85.17 and headings 85.25 to 85.28 (heading 85.17).\n(e) Headphones and earphones (heading 85.18).\n(f) Cathode-ray tubes and deflection coils (heading 85.40).\n(g) Antenna amplifiers and high-frequency oscillators (heading 85.43).\n(h) Camera lenses and optical filters (heading 90.02).\n(ij) Monopods, bipods, tripods and similar articles (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.29 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
