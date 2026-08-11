const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8452",
  "titleKo": "84.52 - 재봉기(제8440호의 제본용 재봉기는 제외한다), 재봉기용으로 특수 제작된 가구ㆍ밑판ㆍ덮개, 재봉기용 바늘(+)",
  "titleEn": "84.52 - Sewing machines, other than book-binding machines of heading 84.40; furniture, bases and covers specially designed for sewing machines; sewing machine needles.",
  "contentKo": "(A) 재봉기(sewing machine)\n이 호에 해당하는 재봉기와 재봉기 두부(head)는 두 매 이상의 방직용 섬유재료나 가죽 등을 함께 봉합하는 기계이다. 보통 재봉 이외에 장식작업(예: 자수효과)이 가능한 재봉기도 포함한다.\n다만, 자수 전용기(제8447호), 제본용 재봉기(제8440호), 편직-재봉기(제8447호) 등은 제외한다.\n가정용 재봉기 외에 다음과 같은 전용 특수 재봉기를 포함한다.\n(1) 신발 및 가죽용 재봉기\n(2) 단추 구멍 재봉기\n(3) 단추 부착 재봉기\n(4) 밀짚모자용 재봉기\n(5) 모피용 재봉기\n(6) 포대 봉합 재봉기\n(7) 포장 틈새 봉합 재봉기\n(8) 모포, 양탄자 가장자리 감치기용 재봉기\n(9) 헴 스티칭(hem-stitching) 재봉기\n(10) 편직 의류 편 가장자리 봉합 재봉기\n\n(B) 재봉기용으로 특수 제작된 가구ㆍ밑판ㆍ덮개\n테이블, 캐비닛, 스탠드, 밑판, 덮개 등 분리 제시된 것을 포함한다.\n\n(C) 재봉기용 바늘\n재봉기형 바늘(끝부분 근처에 바늘귀가 있는 것)이라면 제8440호의 제본기용이나 제8447호의 자수기용 바늘도 포함한다.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 이 호의 기계의 부분품(스탠드, 북 등)도 포함한다. 보빈은 재료에 따라 분류한다.\n\n[소호해설]\n소호 제8452.10호\n가정용 재봉기와 재봉기 머리부분(박음질 기능이 있는 수동/발동식, 120W 이하 전동기 장착형, 또는 16kg 이하 모터 미장착 헤드)에 적용된다. 1500rpm 이하 구동 속도를 갖는 오버록기 등도 가정용 범위에 포함된다. 단추 구멍 전용기나 포대 봉합기 등은 이 소호에서 제외된다.",
  "contentEn": "This heading covers sewing machines (other than book-binding machines of heading 84.40), furniture, bases and covers specially designed for sewing machines, and sewing machine needles.\n\nIt includes :\n(I) Sewing machines (household sewing machines, industrial sewing machines, shoe-making sewing machines, button-holing/sewing machines, bag-closing sewing machines).\n(II) Specially designed furniture, bases and covers for sewing machines (stands, cabinets, tables, carrying cases).\n(III) Sewing machine needles (including those for book-binding or embroidery machines).\n\nParts of these machines are also covered (shuttles, stands).\n\nThe heading excludes :\n(a) Toy sewing machines (heading 95.03).\n(b) Bobbins (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.52 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
