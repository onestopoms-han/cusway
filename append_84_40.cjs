const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8440",
  "titleKo": "84.40 - 제본기계(제본용 재봉기를 포함한다)",
  "titleEn": "84.40 - Book-binding machinery, including book-sewing machines.",
  "contentKo": "이 호에는 책(소책자․팜플릿․정기간행물․장부와 이와 유사한 것을 포함한다)을 만드는 기계를 포함한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 제본용의 접는 기계(leaf-folding machine) : 전지 크기의 종이를 적합한 페이지의 크기가 되도록 접는 기계이다.\n(2) 스테이플링기(stapling machine)와 철선으로 꿰매는 기계(wire-stitching machine)\n(3) 집적기(gathering machine)와 꿰매는 기계(stitching machine)\n(4) 롤링기(rolling machine)나 해머링기(hammering machine) : 재봉하기 전의 책을 압축한다.\n(5) 그레쿼(grecquer) 기계 : 철하는 실을 통하게 하기 위하여 책 뒷면에 홈을 낸다.\n(6) 제본재봉기(book-sewing machine)\n(7) 책표지를 붙이기 전에 배면을 평탄하게 하거나 둥글게 하는 기계\n(8) 페이지나 지도장에 보강 세폭 종이나 직물을 붙이는 기계\n(9) 팜플릿 등에 종이 표지를 아교로 붙이는 기계\n(10) 책표지 제조기계\n(11) 완성 가공된 책표지를 평탄하게 하는 기계\n(12) 교착과 프레싱에 의하여 책표지에 가철한 책을 고착시키는 기계\n(13) 책 가장자리를 도금이나 착색하는 기계\n(14) 책표지에 금칠한 문자나 금칠한 모양을 인쇄하는 기계\n(15) 페이지 번호 인자기\n(16) 금속이나 플라스틱 나선 조합형 제본기\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 기계의 부분품도 이 호에 분류한다.\n\n이 호에는 다음의 것을 제외한다.\n(a) 제본용 나무 테이블(제4421호)\n(b) 절단기용 칼(제8208호)\n(c) 종이나 판지 절단기, 홈파는 기계 및 상자 제조용 스테이플링기(제8441호)\n(d) 인쇄기와 결합된 접지기 및 제판용 보조기기(제8443호)\n(e) 직물 절단기(제8451호)\n(f) 재봉기용의 바늘(제8452호)\n(g) 가죽가공기계(제8453호)\n(h) 사무실용 스테이플러(제8472호)",
  "contentEn": "This heading covers book-binding machinery, including book-sewing machines, used for binding books, booklets, brochures, leaflets, periodicals, registers, etc.\n\nIt includes :\n(1) Leaf-folding machines.\n(2) Stapling machines and wire-stitching machines.\n(3) Gathering and stitching machines.\n(4) Rolling or hammering machines.\n(5) Back-grooving (grecquing) machines.\n(6) Book-sewing machines.\n(7) Back-flattening or back-rounding machines.\n(8) Stripping machines.\n(9) Paper-covering machines.\n(10) Casing-in machines and case-making machines.\n(11) Case-smoothing machines.\n(12) Nipper or pressing machines.\n(13) Book edge gilding or colouring machines.\n(14) Gilding or lettering presses.\n(15) Page numbering machines.\n(16) Spiral binding machines.\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Manual binding tables of wood (heading 44.21).\n(b) Knives for book-trimming machines (heading 82.08).\n(c) Cardboard or paper cutting, grooving or trimming machines (heading 84.41).\n(d) Folding machines associated with printing presses (heading 84.43).\n(e) Textile-cutting machines (heading 84.51).\n(f) Sewing machine needles (heading 84.52).\n(g) Leather-working machines (heading 84.53).\n(h) Office type staplers (heading 84.72)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.40 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
