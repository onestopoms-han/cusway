const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8510",
  "titleKo": "85.10 - 면도기ㆍ이발기ㆍ모발제거기[전동기를 갖춘 것으로 한정한다]",
  "titleEn": "85.10 - Shavers, hair clippers and hair-removing appliances, with self-contained electric motor.",
  "contentKo": "이 호에는 전동기나 전동 바이브레이터를 내장한 전기면도기, 전기이발기(사람용, 수의용, 양모 및 마필용 포함), 모발제거기를 분류한다.\n\n- 면도기 : 구멍이 뚫린 망 모양 판 내측에서 회전/왕복하는 커터가 털을 깎는 장치.\n- 이발기 : 고정된 금속 빗 위를 왕복하는 커터가 머리털이나 동물 털을 깎는 장치.\n- 모발제거기 : 회전 롤러나 나선형 용수철 등을 이용해 털을 모근째 뽑아내는 기계식 제모기.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다. 헤드부(커터 헤드), 커터 날, 칼날, 빗날 등 전용 부분품을 포함한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 별도의 분리형 전동기와 플렉시블 샤프트로 구동하는 이발기 (이발용 헤드부는 제8214호, 전동기는 제8501호 분류).",
  "contentEn": "This heading covers shavers, hair clippers, and hair-removing appliances with a self-contained electric motor or vibrator.\n\nIt includes :\n- Shavers (dry shavers) with rotating or reciprocating cutters behind a perforated plate or foil.\n- Hair clippers (for humans or for shearing sheep, grooming horses, etc.) with moving cutter blades sliding over a fixed metal comb.\n- Hair-removing appliances which pluck hair out by the roots using rotating micro-rollers or coiled metal springs.\n\nParts of these appliances are also classified here, including cutter heads, blades, and combs.\n\nThe heading excludes :\n- Hair clippers driven by a separate motor and flexible shaft (the shearing head is in heading 82.14, the motor in heading 85.01)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.10 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
