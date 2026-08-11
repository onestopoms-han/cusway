const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8601",
  "titleKo": "86.01 - 철도용 기관차(외부 전원이나 축전지로 주행하는 것으로 한정한다)",
  "titleEn": "86.01 - Rail locomotives powered from an external source of electricity or by electric accumulators.",
  "contentKo": "이 호에는 외부 전원(제3궤조 레일이나 가공 전선 등) 또는 자체에 탑재된 축전지(배터리)로부터 에너지를 공급받아 작동하는 모든 종류의 전기식 철도 기관차를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 외부 전원식 전기기관차(제8601.10호)\n- 축전지식 전기기관차(제8601.20호)",
  "contentEn": "This heading covers all electric rail locomotives, whether powered from an external source of electricity (via a third rail or overhead line) or from electric accumulators (batteries) carried on the vehicle."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.01 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
