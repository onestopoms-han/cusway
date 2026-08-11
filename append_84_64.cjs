const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8464",
  "titleKo": "84.64 - 돌ㆍ도자기ㆍ콘크리트ㆍ석면시멘트나 이와 유사한 광물성 물질의 가공용 공작기계와 유리의 냉간(冷間) 가공용 공작기계(+)",
  "titleEn": "84.64 - Machine-tools for working stone, ceramics, concrete, asbestos-cement or like mineral materials or for cold working glass.",
  "contentKo": "일반적으로 가공기계는 동력으로 구동되나 수동식이나 페달식 이와 유사한 기계도 이 호에 분류한다.\n베이스플레이트, 장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수구/수지식 공구와 구별된다.\n\n(I) 돌ㆍ도자기ㆍ콘크리트ㆍ석면시멘트나 이와 유사한 광물성 물질의 가공용 공작기계\n천연석 가공기뿐만 아니라 도자기, 콘크리트, 인조석, 석면시멘트 등 경질 광물성 물질 가공기를 포함한다.\n(A) 톱기계나 절단기 (원형톱, 밴드소, 와이어 절단기 등)\n(B) 열단(splitting or cleaving) 기계\n(C) 그라인딩, 스무딩, 폴리싱, 그레인 가공기 등\n(D) 드릴링 및 밀링 머신\n(E) 선삭용, 조각용, 형절단용 기계\n(F) 그라인딩 휠의 절단 및 완성가공기\n(G) 도자제품 완성가공 기계 (드릴링, 밀링 등)\n단, 세라믹 페이스트나 소성 전 요업재료 성형기는 제8474호에 분류한다.\n\n(II) 유리의 냉간(冷間) 가공용 공작기계\n유리의 냉간 가공용 기계를 포함한다. 열간 가공기계(용융 상태 가공 등)는 제8475호에 분류한다.\n(1) 유리 절단기 (다이아몬드 커터 등)\n(2) 유리 모서리 깎기(facetting)용 기계\n(3) 트루잉 및 연마기 (가장자리 다듬질용)\n(4) 폴리싱머신 (펠트디스크기 포함)\n(5) 유리 조각기 (모래분사식 제외)\n(6) 안경 렌즈, 광학용 유리 연마 및 마모 가공기\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 가공기계의 부분품과 부속품(제82류의 공구를 제외한다)은 제8466호에 해당한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수공구 및 수동식 그라인딩 휠(제8205호)\n(b) 유리섬유 방적기 및 제직기(제8445호, 제8446호)\n(c) 물리공정 가공기 (제8456호)\n(d) 수지식 공구(제8467호)\n(e) 파쇄기, 분쇄기, 요업성형기 등(제8474호)\n(f) 반도체 보울/웨이퍼 절단, 연마 및 평판디스플레이 가공기(제8486호)\n\n[소호해설]\n소호 제8464.10호\n제8464호 해설 (I)의 (A)항에 해당하는 톱기계와 절단기를 분류한다.",
  "contentEn": "This heading covers machine-tools for working stone, ceramics, concrete, asbestos-cement or like mineral materials or for cold working glass.\n\nIt includes :\n(I) Machine-tools for working stone, ceramics, concrete, etc. (sawing/cutting machines, splitting/cleaving machines, grinding/polishing machines, drilling/milling/carving machines).\n(II) Machine-tools for cold working glass (glass cutters, facetting machines, edge-finishing machines, lens grinding/polishing machines).\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Hand tools and hand-operated grinding wheels (heading 82.05).\n(b) Glass-working machines for hot working glass (heading 84.75).\n(c) Machine-tools of heading 84.56.\n(d) Hand-held tools (heading 84.67).\n(e) Crushing, grinding or ceramic-molding machines (heading 84.74).\n(f) Semiconductor boule or wafer sawing, scribing, grinding or polishing machines (heading 84.86)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.64 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
