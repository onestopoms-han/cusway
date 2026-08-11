const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9613",
  "titleKo": "96.13 - 담배 라이터와 그 밖의 램프(기계식이나 전기식인지에 상관없다)와 이들의 부분품(라이터 돌과 심지는 제외한다)",
  "titleEn": "96.13 - Cigarette lighters and other lighters, whether or not mechanical or electrical, and parts thereof other than flints and wicks.",
  "contentKo": "이 호에는 휴대용(포켓형), 탁상용, 차량용(시거잭 결합형 등) 및 가스레인지/가스오븐 점화용 라이터(기계식, 전기식, 화학식, 비기계 타격식 불문)와 그 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일회용 포켓 라이터(가스 충전 불가형)(제9613.10호) : 액화 가스가 주입되어 있으나 재충전 밸브가 없는 일회용 가스 라이터.\n- 충전식 포켓 라이터(가스 주입 가능형)(제9613.20호) : 연료 가스 주입 밸브가 하단에 있어 반복 충전 가능한 가스 라이터.\n- 기타 라이터(제9613.80호) : 탁상용 라이터, 벽걸이형 라이터, 차량용 시거라이터(시거잭 플러그 유닛), 가스 기기 점화용 전기 아크/피에조 스파크 점화 라이터(총 모양 가스점화기 등).\n- 부분품(제9613.90호) : 라이터용 외부 케이스/금속 커버, 부싯돌 마찰용 톱니 휠(휠 스틸), 연료 저장용 탱크(공캔 또는 액화 가스 충전된 일체형 탱크).\n\n[점화 방식 분류]\n- 기계식 : 부싯돌(페로세륨 합금)과 회전 휠의 마찰 스파크로 유기 연료에 불을 붙이는 구조.\n- 전기식 : 배터리나 외부 전원을 받아 필라멘트 가열(저항식) 또는 스파크/아크 방전으로 점화하는 구조.\n- 화학식 : 스펀지 백금 등의 촉매 작용을 통해 흘러나온 연료 가스가 공기 중 산소와 반응하여 열을 발생시켜 점화하는 구조.\n- 비기계식 : 금속 봉(성냥처럼 생긴 철봉 격철)을 본체 측면의 부싯돌 라인에 긁어 마찰 스파크로 불을 붙이는 구조(일명 영구 성냥).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 화약식 점화용 도화선 및 뇌관 (제3603호)\n(b) 라이터용 부싯돌(flints) 단독 제시품 (제3606호)\n(c) 라이터 재충전용으로 쓰이는 소형 캔/병 입 가스 연료 (용량 300ml 이하 용기 수납된 것에 한함) (제3606호)\n(d) 직물제 면심지 (제5908호) 및 유리섬유제 라이터 심지 (제7019호)\n(e) 디지털시계 또는 계산기가 내장되어 복합 기기 형태로 제시되는 라이터 (통칙에 따라 시계 또는 계산기의 주 기능에 따라 분류)" ,
  "contentEn": "This heading covers cigarette lighters, table lighters, car lighters, gas stove igniters (whether mechanical, electrical, chemical, or non-mechanical strike-type), and their parts.\n\nIt includes :\n- Pocket lighters, gas-fueled, non-refillable (subheading 9613.10) commonly known as disposable lighters.\n- Pocket lighters, gas-fueled, refillable (subheading 9613.20).\n- Other lighters (subheading 9613.80) including table lighters, car cigarette lighter plugs, and electric arc kitchen igniters.\n- Parts of lighters (subheading 9613.90) including outer casings, milled-edged wheels, and fuel reservoirs (empty or filled).\n\nExcludes flints (heading 36.06), wicks (heading 59.08 or 70.19), and small lighter gas refills in containers not exceeding 300 ml (heading 36.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.13 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
