const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9012",
  "titleKo": "90.12 - 광학현미경 외의 현미경과 회절기기(diffraction apparatus)",
  "titleEn": "90.12 - Microscopes other than optical microscopes; diffraction apparatus.",
  "contentKo": "이 호에는 광선의 굴절 대신 전자나 양자의 빔(beam)을 이용하는 비광학식 고배율 현미경(전자/양자 현미경) 및 물질 결정 구조를 분석하는 전자 회절기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 비광학식 현미경과 회절기기(제9012.10호) :\n  - 전자현미경(electron microscope) : 전자총, 정전/전자기 렌즈(코일/대전판), 진공 펌프, 형광 스크린/카메라 기록 장치, 제어반으로 구성된 투과형(TEM) 및 주사형(SEM) 전자현미경.\n  - 양자현미경(proton microscope) : 전자의 40분의 1 파장을 갖는 양자(수소 가스 발생원) 빔을 사용하여 분해능을 더 높인 현미경.\n  - 전자 회절기기(electron diffraction apparatus) : 물질 결정에 전자 빔을 투사하여 발생하는 회절상(diffraction pattern, 고리 직경/강도)을 분석하여 원자 배열을 규명하는 분석 기기(회절용 챔버가 결합된 전자현미경 포함).\n- 부분품과 부속품(제9012.90호) : 현미경 몸체 프레임, 시료 챔버(chamber), 시료 재물대(specimen stage).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 기기에 장착되는 독립형 진공 펌프 (제8414호)\n(b) 전원 공급용 배터리, 정류기 및 변압기 (제8504호, 제8507호 등)\n(c) 전압계, 전류계 등 별도로 제시되는 전기식 측정 계측기기 (제9030호)\n(d) 물질 분석용 X선 회절 장치 (제9022호)" ,
  "contentEn": "This heading covers non-optical microscopes (using electron or proton beams instead of light) and electron diffraction apparatus.\n\nIt includes :\n- Microscopes other than optical microscopes and diffraction apparatus (subheading 9012.10) including Transmission Electron Microscopes (TEM), Scanning Electron Microscopes (SEM), Proton Microscopes, and Electron Diffraction Apparatus (used to study crystal lattices, corrosion, or catalysts).\n- Parts and accessories (subheading 9012.90) including microscope frames, chambers, and specimen stages.\n\nExcludes separate vacuum pumps (heading 84.14), power supplies, rectifiers, or accumulators (heading 85.04 or 85.07), separate electrical measuring instruments like voltmeters/ammeters (heading 90.30), and X-ray diffraction apparatus (heading 90.22)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.12 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
