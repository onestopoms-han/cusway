const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8508",
  "titleKo": "85.08 - 진공청소기",
  "titleEn": "85.08 - Vacuum cleaners.",
  "contentKo": "이 호에는 가정용, 산업용 등 휴대형 여부와 무관하게 모든 유형의 진공청소기(건식/습식 불문)를 분류한다.\n\n진공청소기는 터빈의 흡입력으로 먼지를 흡입하고 내부/외부의 먼지 봉투나 용기에 여과하여 모으는 기기이다.\n- 말/소 등의 털 손질용 진공청소기를 포함한다.\n- 청소기 본체와 함께 제시되는 부속장치(솔, 광택기, 해충박멸 스프레이)나 호환성 부분품(양탄자 장치, 회전식 솔, 다기능 흡입 헤드)은 함께 분류한다 (단, 분리 제시될 경우 해당 재질이나 기능에 따라 따로 분류).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 양탄자 세정액 분사/흡입식 양탄자 청소용 기기 (건/습식 콤비네이션 진공청소기가 아닌 것) (제8451호 또는 제8509호)\n(b) 의료용(내과, 외과, 치과, 수의과용) 진공기기 (제9018호)\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.",
  "contentEn": "This heading covers all types of vacuum cleaners (dry or wet), whether or not portable.\n\nVacuum cleaners perform two functions: suction of dust-laden air and filtration of the air flow. They collect dust and other materials in internal or external bags or containers.\n- It includes vacuum-cleaner type grooming appliances for horses or cattle.\n- Accessories (brushes, polishers) and interchangeable parts (carpet beaters, rotating brushes, multi-purpose suction heads) presented with the cleaners are classified here if of a kind and quantity suitable for the machine. Separately presented accessories are classified under their own headings.\n\nThe heading excludes :\n(a) Carpet cleaning appliances which spray washing solution and remove it by suction (excluding wet/dry combination vacuums) (heading 84.51 or 85.09).\n(b) Medical/surgical/dental/veterinary vacuum apparatus (heading 90.18).\n\nParts of these appliances are also classified here."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.08 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
