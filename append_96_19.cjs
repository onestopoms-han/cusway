const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9619",
  "titleKo": "96.19 - 위생 타월(패드)ㆍ탐폰(tampon), 냅킨(기저귀)ㆍ냅킨라이너(napkin liner)와 이와 유사한 물품(어떤 재질이라도 가능하다)",
  "titleEn": "96.19 - Sanitary towels (pads) and tampons, napkins (diapers) and napkin liners and similar articles, of any material.",
  "contentKo": "이 호에는 재질(종이, 펄프, 직물, 플라스틱 등)에 상관없이 인체 분비액을 흡수하도록 설계된 여성 위생 패드(생리대), 탐폰, 아동용/성인실금용 기저귀(냅킨) 및 라이너와 이와 유사한 흡수성 위생용품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 여성 위생용품 : 일회용/다회용 생리대(위생 타월/패드), 탐폰(tampon), 팬티 라이너(panty liner).\n- 유아용 및 성인실금(요실금)용 기저귀 및 냅킨 라이너 (종이 기저귀, 천 기저귀 포함).\n- 흡수력이 있는 위생 수유 패드(Breast pad).\n- 다회용/재사용 가능한 전통적인 방직용 섬유제 위생 패드 및 천 기저귀.\n\n[구조적 특징]\n- 일반적으로 피부에 접촉하여 액을 흡수하는 부직포 등 내측층, 펄프나 고흡수성 수지(SAP) 등으로 구성된 흡수성 핵심 부분(core), 누수를 방지하는 플라스틱 필름 등 외측 백시트층의 다층 구조를 가짐.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 일회용 외과용 환자 드레이프(drape) 및 병원 침대/수술대/휠체어용 흡수 패드 (종이제는 제4818호, 부직포제는 제5603호)\n(b) 분비물 흡수 기능이 없고 단순히 가슴을 덮는 흡수성 없는 수유 패드 및 미용 패드 (재질별 분류)" ,
  "contentEn": "This heading covers sanitary towels (pads), tampons, diapers (napkins) for babies or adults, diaper liners, and similar sanitary absorbent articles, of any material (paper, pulp, wadding, plastics, or textiles).\n\nIt includes :\n- Sanitary towels (pads), tampons, and panty liners for feminine hygiene.\n- Napkins (diapers) and napkin liners for infants or incontinent adults (disposable or reusable cloth types).\n- Absorbent breast pads (nursing pads).\n\nExcludes disposable surgical drapes or hospital bed/operating table/wheelchair underpads (heading 48.18 or 56.03), and non-absorbent nursing pads (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.19 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
