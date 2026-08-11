const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8503",
  "titleKo": "85.03 - 부분품(제8501호나 제8502호의 기계에 전용되거나 주로 사용되는 것으로 한정한다)",
  "titleEn": "85.03 - Parts suitable for use solely or principally with the machines of heading 85.01 or 85.02.",
  "contentKo": "부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호는 제8501호나 제8502호에 해당하는 기계의 부분품을 분류한다.\n\n이 호에 분류하는 주요 부분품은 다음과 같다.\n(1) 쉘(shell)과 케이스(case), 고정자(stator), 회전자(rotor), 콜렉터링(collector ring), 콜렉터(collector/commutator), 브러시 홀더(brush-holder), 여자(勵磁)코일(excitation coil).\n(2) 정사각형이나 직사각형 이외의 모양으로 절단된 전자기용 전기시트(electrical sheet)와 철판(plate).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전동기/발전기용 탄소 브러시 및 탄소 전극 (제8545호)\n(b) 볼베어링, 롤러베어링 (제8482호)\n(c) 전동축, 크랭크샤프트 등 (제8483호)",
  "contentEn": "Subject to the general provisions regarding the classification of parts (see the General Explanatory Note to Section XVI), this heading covers parts suitable for use solely or principally with the machines of heading 85.01 or 85.02.\n\nIt includes :\n(1) Shells and cases, stators, rotors, collector rings, commutators, brush-holders, and excitation coils.\n(2) Electrical sheets and plates cut to shapes other than square or rectangular.\n\nThe heading excludes :\n(a) Carbon brushes (heading 85.45).\n(b) Ball or roller bearings (heading 84.82).\n(c) Transmission shafts (heading 84.83)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.03 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
