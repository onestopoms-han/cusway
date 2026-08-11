const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8442",
  "titleKo": "84.42 - 플레이트ㆍ실린더나 그 밖의 인쇄용 구성 부품의 조제용이나 제조용 기계류ㆍ장치ㆍ장비(제8456호부터 제8465호까지의 기계는 제외한다), 플레이트ㆍ실린더와 그 밖의 인쇄용 구성 부품, 인쇄용으로 조제가공[예: 평삭(平削)ㆍ그레인ㆍ연마]한 플레이트ㆍ실린더와 석판석",
  "titleEn": "84.42 - Machinery, apparatus and equipment (other than the machines of headings 84.56 to 84.65) for preparing or making plates, cylinders or other printing components; plates, cylinders and other printing components; plates, cylinders and lithographic stones, prepared for printing purposes (for example, planed, grained or polished).",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n(1) 인쇄기의 인쇄 부분품 (예: 인쇄용 조판, 글자, 판, 실린더, 조제된 석판석 등)\n(2) 인쇄용 부분품을 만들기 위한 기기와 부속품\n\n이 호에는 종이ㆍ직물ㆍ리놀륨ㆍ가죽 등의 인쇄공정에 사용하는 인쇄용 도안, 문자 등을 형성하는 판 및 그 제작기기를 분류한다.\n(I) 볼록판(凸版)인쇄\n(II) 평판인쇄\n(III) 오목판(凹版)인쇄\n\n(A) 플레이트ㆍ실린더나 그 밖의 인쇄용 구성 부품의 조제용이나 제조용 기계류ㆍ장치ㆍ장비 (제8456호부터 제8465호까지의 기계는 제외)\n(1) 문서 직접 복제 제판기\n(2) 판이나 실린더 식각용 기계\n(3) 오프셋 아연판 감광기\n다만, 제판용 사진기, 사진 확대기, 사진 밀착 프린터 등 사진용 기기는 제90류에 분류되므로 이 호에서 제외한다.\n\n(B) 플레이트ㆍ실린더와 그 밖의 인쇄용 구성 부품, 인쇄용으로 조제가공한 플레이트ㆍ실린더와 석판석\n(1) 볼록판이나 오목판\n(2) 석판석\n(3) 오프셋 인쇄판\n(4) 새기거나 식각된 실린더\n(5) 부조 스탬핑 및 인쇄용 판과 주형\n(6) 가공된 석판석\n(7) 조각용 금속판 및 시트\n(8) 연마 또는 도톨도톨하게 가공한 금속 실린더\n(9) 사무용 오프셋 인쇄기용 원판\n감광판(제3701호) 등은 제외한다.\n\n부분품\n부분품의 분류에 관한 일반적인 규정(제16부 총설 참조)에 따라 이 호에는 이 호의 기계의 부분품도 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 아연, 플라스틱, 판지로 만든 형판 (구성 재료에 따라 분류)\n(b) 복사지와 전사지(제4816호)\n(c) 실크스크린 인쇄기용 스크린(제5911호)\n(d) 금박용 낙인(제8440호)\n(e) 금속, 석재, 목재 가공 공작기계(제8456호~제8465호)\n(f) 타자기, 계산기 등의 활자 및 인자 부분품(제8473호)\n(g) 주형(제8480호)\n(h) 레이저포토플로터(제9006호)\n(ij) 측정/검사용 기구(제9017호 또는 제9031호)",
  "contentEn": "This heading covers machinery, apparatus and equipment (other than tools of headings 84.56 to 84.65) for preparing or making plates, cylinders or other printing components; plates, cylinders and lithographic stones, prepared for printing purposes.\n\nIt includes :\n(I) Lithographic stones, plates and cylinders prepared for engraving or impressing (planed, grained or polished).\n(II) Plates, cylinders and other printing components engraved or otherwise prepared for printing.\n(III) Machinery, apparatus and equipment for preparing or making printing components (e.g., photo-engraving acid-etching machines, zinc-plate horizontal whirlers, electronic plate-engravers).\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Photographic cameras, enlargers or contact printers (Chapter 90).\n(b) Stencils of zinc, plastic or cardboard (classified by material).\n(c) Sensitised plates (heading 37.01).\n(d) Silk screens for screen printing (heading 59.11).\n(e) Machine-tools for working metal, stone or wood (headings 84.56 to 84.65).\n(f) Molds (heading 84.80)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.42 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
