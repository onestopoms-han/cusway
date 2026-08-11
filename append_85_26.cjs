const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8526",
  "titleKo": "85.16 - 전기식의 즉시식ㆍ저장식 물 가열기와 투입식 가열기, 난방기기와 토양가열기, 전기가열식 이용기기[예: 헤어드라이어ㆍ헤어컬러(hair curler)ㆍ컬링통히터(curling tong heater)], 손 건조기, 전기다리미, 그 밖의 가정용 전열기기, 전열용 저항체(제8545호의 것은 제외한다)", // Note: typo corrected below to 85.26
  "titleKo": "85.26 - 레이더기기ㆍ항행용 무선기기ㆍ무선 원격조절기기",
  "titleEn": "85.26 - Radar apparatus, radio navigational aid apparatus and radio remote control apparatus.",
  "contentKo": "이 호에는 레이더 장비, 무선 항행 원조 장비 및 무선 원격 제어 기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 항행용 무선기기 : 무선 표지(radio beacon), 라디오 부표, 방향 탐지 무선 나침반, 위성위치추적시스템(GPS) 및 갈릴레오/글로나스 등의 위성 항법 수신기.\n(2) 레이더 기기 : 선박/항공기용 항로 레이더, 항만 관제 레이더, 레이더 비콘(Racon), 전파 고도계, 풍수해/기상 추적 레이더, 군용 방공/경계 레이더, 사격 통제용 레이더, 레이더 트랜스폰더(응답기) 등. (단, 폭약 뇌관이 장착된 완제품 신관은 제9306호로 제외).\n(3) 공항의 계기착륙유도(ILS) 및 항공교통관제(ATC) 시스템.\n(4) 무선 원격조절기기 : 선박, 무인기(드론), 로켓, 미사일, 완구, 무선 조종 모형 배/비행기용 무선 원격 제어 송수신 기기.\n(5) 광산 폭파 및 각종 공업 기계 원격 무선 제어 기기.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8529호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 레이더나 무선 조종 기기가 영구히 탑재된 특수용도 차량(레이더 차 등) (보통 제8705호)"
};

// Fix the duplicated key in the object creation
newEntry.titleKo = "85.26 - 레이더기기ㆍ항행용 무선기기ㆍ무선 원격조절기기";

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.26 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
