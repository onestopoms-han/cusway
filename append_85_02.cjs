const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8502",
  "titleKo": "85.02 - 발전세트와 회전변환기",
  "titleEn": "85.02 - Electric generating sets and rotary converters.",
  "contentKo": "이 호에는 발전세트와 회전변환기를 분류한다.\n\n(I) 발전세트 (Electric generating set)\n발전기와 전동기 외의 원동기(수력/증기 터빈, 풍력엔진, 내연기관 등)가 일체로 결합된 장치이다.\n- 하나의 유닛 또는 공통 베이스(base)에 장착되었거나 장착되도록 설계된 것이어야 하며, 함께 제시된 경우에 한정하여 이 호에 분류한다 (수송 편의상 분할 포장된 경우 포함).\n- 용접헤드/용접기기 없이 별도로 제시되는 용접기기용 발전세트를 포함한다 (용접기기 등과 함께 제시될 시에는 제8515호로 제외).\n\n(II) 회전변환기 (Electric rotary converter)\n주로 공통 베이스 위에 고정된 전동기와 발전기의 결합체 또는 공통 권선을 공유하는 일체형 기계이다.\n- 전류의 성질 변환(교류 <-> 직류) 또는 전압, 주파수, 교류위상수(단상 <-> 삼상) 등의 변환에 사용한다.\n- 직류의 전압치를 변환시키는 회전변압기를 포함한다.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8503호에 분류한다.",
  "contentEn": "This heading covers electric generating sets and rotary converters.\n\nIt includes :\n(I) Generating sets :\n- Combinations of an electric generator and any prime mover other than an electric motor (e.g., hydraulic/steam turbines, wind engines, internal combustion engines).\n- They must be mounted or designed to be mounted together on a common base or as a single unit, and presented together.\n- This includes generating sets for welding equipment presented without their welding heads or appliances (otherwise heading 85.15).\n(II) Rotary converters :\n- Combinations of an electric motor and generator mounted on a common base, or sharing a common winding, used to convert the nature of current (AC to DC or vice versa) or change properties such as voltage, frequency or phase (single-phase to multi-phase).\n\nParts of these machines are classified under heading 85.03."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.02 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
