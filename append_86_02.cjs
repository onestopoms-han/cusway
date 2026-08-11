const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8602",
  "titleKo": "86.02 - 그 밖의 철도용 기관차와 탄수차(炭水車)",
  "titleEn": "86.02 - Other rail locomotives; locomotive tenders.",
  "contentKo": "이 호에는 제86.01호(외부 전원/축전지식) 이외의 전력원/동력원을 사용하여 구동되는 모든 종류의 철도 기관차 및 탄수차(증기기관차에 연결되어 연료와 물을 운반하는 전용 차량)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 기관차\n- 디젤 전기기관차(diesel-electric locomotive) : 디젤 엔진으로 발전기를 돌려 생성된 전기로 모터를 구동하는 전기 전동식 기관차.\n- 디젤 유압식 기관차 및 디젤 기계식 기관차.\n- 증기기관차(터빈식, 탱크식, 무화력 증기 축압식 포함).\n- 가스터빈 기관차 등 기타 엔진 구동식 기관차.\n- 소형 분기 및 입환용(shunting) 기관차.\n(B) 탄수차(tender)\n- 증기기관차용 석탄/물/연료유 탱크 전용 결합 차량.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 도로와 철도 궤도 양용 주행 트랙터 (제8701호)",
  "contentEn": "This heading covers all types of rail locomotives powered by systems other than those of heading 86.01 (e.g. diesel engines, steam engines, gas turbines, compressed air), and locomotive tenders (vehicles coupled to steam locomotives carrying water and fuel).\n\nIt includes :\n- Diesel-electric, diesel-hydraulic, and diesel-mechanical locomotives.\n- Steam locomotives of all kinds (including fireless locomotives with a steam reservoir).\n- Shunting locomotives (tractors) designed to shunt wagons at stations.\n- Locomotive tenders consisting of a frame carrying a water cistern and a coal box or oil tank.\n\nExcludes tractors designed to travel on both road and rail (heading 87.01)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.02 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
