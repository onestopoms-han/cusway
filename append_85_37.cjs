const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8537",
  "titleKo": "85.37 - 전기제어용이나 배전용 보드ㆍ패널ㆍ콘솔ㆍ책상ㆍ캐비닛과 그 밖의 기반(基盤)(제8535호나 제8536호의 기기를 두 가지 이상 장착한 것으로 한정하고 제90류의 기기와 수치제어기기와 결합한 것을 포함하며, 제8517호의 교환기기는 제외한다)",
  "titleEn": "85.37 - Boards, panels, consoles, desks, cabinets and other bases, equipped with two or more apparatus of heading 85.35 or 85.36, for electric control or the distribution of electricity, including those incorporating instruments or apparatus of Chapter 90, and numerical control apparatus, other than switching apparatus of heading 85.17.",
  "contentKo": "이 호에는 제8535호 또는 제8536호의 기기(스위치, 퓨즈, 계전기 등)를 두 개 이상 장착하여 전기를 배전하거나 제어하는 판, 보드, 패널, 캐비닛, 콘솔, 데스크 등을 분류한다. 계측기(제90류)나 프로그램 가능 기기, 수치제어기가 결합된 것도 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 배전반, 제어반, 분전반 및 퓨즈 상자 (가정용 소형 배전반부터 발전소, 제철소, 무선국용의 복잡한 중앙 제어반 및 콘솔데스크).\n(2) 공작기계용 수치제어반(NC/CNC 패널) : 자동자료처리(컴퓨터) 기능을 내장하여 모터 구동 축의 각도/위치를 제어하는 것.\n(3) 가정용 세탁기, 식기세척기 등의 기기 작동 제어를 위한 프로그램식 스위치 보드 및 타이밍 스위치 회로 보드.\n(4) 프로그램이 가능한 제어기(PLC, Programmable Logic Controller) : 논리 제어, 시퀀스 제어, 타이머, 카운터, 연산 연동 프로그램 명령을 디지털/아날로그 I/O 모듈을 통해 기계를 제어하는 디지털 전자 장치.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8538호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 유선/무선 통신용 전화 교환대 및 스위칭 장비 (제8517호)\n(b) 단순 개폐 스위치 단독 조립품 (예: 스위치 2개와 커넥터만 결합한 조립체) (제8535호 또는 제8536호)\n(c) TV, 에어컨 등 가전 제어용 단독 휴대식 무선/적외선 리모컨 (제8543호)\n(d) 계측 및 분석 기능이 주를 이루는 자동 제어기(온도조절기, 습도조절기, 자동 가스 제어기 등) (제9032호)\n(e) 시계 무브먼트나 동기 모터를 장착하여 시간 예약을 수행하는 타임스위치 (제9107호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.37 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
