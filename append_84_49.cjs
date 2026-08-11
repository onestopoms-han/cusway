const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8449",
  "titleKo": "84.49 - 펠트나 부직포(성형인 것을 포함한다)의 제조ㆍ완성가공용 기계(펠트모자 제조용 기계를 포함한다)와 모자 제조용 형(型)",
  "titleEn": "84.49 - Machinery for the manufacture or finishing of felt or nonwovens in the piece or in shapes, including machinery for making felt hats; blocks for making hats.",
  "contentKo": "이 호에는 여러 가지의 펠트(felt)나 부직포(nonwoven)나 이들의 제품의 제조나 완성가공용 기계를 포함하며, 다만, 펠트화된 직물의 제조용 기계는 제외한다. 이 호에는 또한 모자제조용 형(型 : block)을 포함한다.\n\n펠트(felt)로 만들기 이전의 준비공정에 사용하는 기계(예: 모 선별용 송풍선별기ㆍ개모기ㆍ고해기와 카드기)는 방적용으로 섬유를 준비하는 사전 작업에서 사용하는 것과 동일하며 제8445호에 분류한다.\n\n(A) 펠트나 부직포(성형인 것을 포함한다)의 제조ㆍ완성가공용 기계\n(1) 펠트기(felter)\n(2) 비누칠기(soaping machine)\n(3) 축융기(fulling mill) (다만, 직물용 회전식 축융기는 제8451호에 분류)\n(4) 보강펠트 제조용 기계\n(5) 펠트의 완전가공기계\n(6) 부직포 제조용 기계\n\n(B) 펠트모자 제조용 기계\n(1) 펠트화 모체(hat-shape) 성형기\n(2) 펠팅프레스(felting press)\n(3) 롤러프레스(roller press)\n(4) 연신기(stretching machine)\n(5) 모자챙 성형기\n(6) 연마기(polishing machine)\n(7) 모소기(singeing machine)\n(8) 프루우핑기계(proofing machine)\n(9) 블록킹 기계(blocking machine)\n(10) 샌드프레스(sand press)\n(11) 회전패드 광택기\n\n(C) 모자제조용 형(型)\n나무나 금속(보통 알루미늄)으로 만든 형을 분류한다. 모자용 윤곽 측정기는 제외한다(제9031호).\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 이 호의 기계의 부분품도 포함한다.\n\n이 호에는 다음의 것을 제외한다.\n(a) 이불솜 압착용 캘린더기(제8420호)\n(b) 베레모, 터키모 등 제조용 편직기(제8447호)",
  "contentEn": "This heading covers machinery for the manufacture or finishing of felt or nonwovens, in the piece or in shapes, including machinery for making felt hats and blocks for making hats.\n\nIt includes :\n(I) Felt or nonwoven manufacturing machinery (felting machines, soaping machines, fulling mills, needle looms for needlefelt, nonwoven web forming machines).\n(II) Felt hat making machinery (hat-shape forming machines, felting presses, brim stretching machines, sand presses, blocking machines).\n(III) Hat blocks (wood or metal molds).\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Calenders for compacting textile fibres (heading 84.20).\n(b) Knitting machines for making berets or fezes (heading 84.47).\n(c) Rotary fulling mills for fabrics (heading 84.51).\n(d) Conformators for measuring heads (heading 90.31)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.49 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
