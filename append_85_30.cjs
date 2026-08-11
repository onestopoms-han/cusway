const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8530",
  "titleKo": "85.30 - 철도ㆍ궤도ㆍ도로ㆍ내륙수로ㆍ주차장ㆍ항만ㆍ비행장에서 사용되는 전기식 신호기기ㆍ안전기기ㆍ교통관제기기(제8608호의 것은 제외한다)",
  "titleEn": "85.30 - Electrical signalling, safety or traffic control equipment for railways, tramways, roads, inland waterways, parking areas, port installations or airfields (other than those of heading 86.08).",
  "contentKo": "이 호에는 철도, 도로, 내륙수로, 주차장, 항만 및 비행장 등에서 교통의 관제, 신호, 안전 확보를 위하여 사용되는 모든 전기식 기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 철도 및 궤도용 기기 (지하철 및 공기완충식 자기부상열차용 포함)\n(1) 신호 및 안전기기 : 색등식/완목식 신호기, 자동 폐색(블록) 신호 장치, 열차 위치/접근 지시계 및 경보벨, 열차 자동정지장치(ATS, ATC용 선로변 접촉 센서/단자 등).\n(2) 궤도제어기기 : 전동 선로전환기(포인트 전환 작동 장치), 집중 제어 제어반(콘솔), 차량 조차장(마샬링 야드)용 화차 이동 제어용 볼 로봇(\"ball robot\") 및 저장 릴레이 장치.\n(B) 도로, 내륙수로, 주차장용 기기\n(1) 건널목 자동 신호기 : 철도 건널목용 점멸등, 경보벨, 차단막 작동용 전기식 구동기.\n(2) 교통신호등 : 교차로용 착색 교통 신호등(수동 제어식, 타이머 자동 제어식, 노면 루프코일 센서 및 광전지 차량 감지 연동식 교통신호기 세트).\n(C) 항만 및 공항용 전기식 교통 관제 장치 (항만 입출항 신호등, 비행장 활주로 진입 유도등 유닛 등).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전동기/유압/공압식 엑추에이터 등으로 구성된 기계식 신호기 및 기계식 건널목 차단기 (제8608호)\n(b) 고정식 발광 문자/표지판, 등기구류 (제8310호, 제9405호 등)\n(c) 자전거나 자동차용 전용 조명/신호 기구 (제8512호)\n(d) 철도 차량(기관차 내부) 탑재용 수신 유닛 및 제어 장비 (제86류 등)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.30 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
