const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8458",
  "titleKo": "84.58 - 금속 절삭가공용 선반(터닝센터를 포함한다)(+)",
  "titleEn": "84.58 - Lathes (including turning centres) for removing metal.",
  "contentKo": "이 호의 선반(lathe)과 터닝센터(turning centre)는 금속을 절삭이나 제거하는 방법으로 금속을 표면 가공하는데 사용하는 기계이다.\n이들은 보통 바닥, 작업대, 벽 등에 장착할 수 있도록 설계되어 베이스 플레이트, 장착 프레임, 스탠드 등이 갖추어져 있다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 선반(lathe) : 자동식을 포함하며 슬라이드 선반, 수직 선반, 캡스턴 선반, 터릿 선반, 프로덕션(또는 copying) 선반 등이 있다. 다만, 금속 변형 가공용 스피닝 선반은 제8463호에 분류한다.\n(2) 스핀들 터닝선반 또는 축선반\n(3) 터닝센터 (turning centre)\n\n부분품과 부속품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 선반 부분품과 부속품(제82류의 공구는 제외한다)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다 :\n(a) 레이저, 초음파, 방전, 플라즈마 등 특수 공정 가공기 및 워터제트 절단기(제8456호)\n(b) 머시닝센터, 싱글/멀티스테이션 트랜스퍼머신(제8457호)\n(c) 절단기계(cutting-off machine)(제8461호)\n(d) 수지식 공구(제8467호)\n(e) 시험용 기기(제9024호)\n\n[소호해설]\n소호 제8458.11호와 제8458.91호\n수치제어식 공작기계(CNC 또는 NC)는 사전에 프로그램된 지시에 따라 기계, 공구, 가공물의 이동 및 기능이 수행되는 기계이다. 제어유닛이 분리되어 있거나 기계에 내장된 형태 모두 포함한다. 제어유닛이 공작기계와 함께 제시되지 않은 경우라도 수치제어식의 특성을 갖는 한 이 소호에 분류한다.",
  "contentEn": "This heading covers lathes (including turning centres) designed for removing metal.\n\nIt includes :\n(1) Lathes of all types (slide lathes, vertical lathes, capstan lathes, turret lathes, copying lathes), whether or not automatic.\n(2) Spindle or axle turning machines.\n(3) Turning centres.\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Machine-tools of heading 84.56.\n(b) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(c) Spinning lathes (spinning metal) (heading 84.63).\n(d) Cutting-off machines (heading 84.61).\n(e) Hand tools of heading 84.67.\n(f) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.58 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
