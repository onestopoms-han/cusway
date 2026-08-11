const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8460",
  "titleKo": "84.60 - 디버링(deburring)ㆍ샤프닝(sharpening)ㆍ그라인딩(grinding)ㆍ호닝(honing)ㆍ래핑(lapping)ㆍ폴리싱(polishing)이나 그 밖의 완성가공용 공작기계로서 연마석ㆍ연마재ㆍ광택재로 금속이나 서멧(cermet)을 가공하는 것(제8461호의 기어절삭기ㆍ기어연삭기ㆍ기어완성가공기는 제외한다)(+)",
  "titleEn": "84.60 - Machine-tools for deburring, sharpening, grinding, honing, lapping, polishing or otherwise finishing metal or cermets by means of grinding stones, abrasives or polishing products, other than gear cutting, gear grinding or gear finishing machines of heading 84.61.",
  "contentKo": "이 호에는 금속이나 서멧(cermet)의 표면완성 가공기계(surface-finishing machine)를 포함한다. 다만, 제8461호의 기어 절삭/연삭/완성가공기는 제외한다.\n이러한 기계는 연마석, 연마제, 연마물품(디스크, 와이어 브러시, 패드 등)에 의하여 재료를 절삭가공한다.\n장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수지가공용 공구와 구별된다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 디버링(deburring)용 기계\n(2) 샤프닝 머신(sharpening machine) (공구연삭기, 커터연삭기, 카드 샤프닝 머신 등)\n(3) 그라인딩머신(grinding machine) (내면 연삭기, 무심 연삭기, 원통 연삭기, 평면 연삭기, 나선 연삭기 등)\n(4) 호닝머신(honing machine) 및 래핑머신(lapping machine)\n(5) 폴리싱머신(polishing machine)\n(6) 조각용 머신 (제8459호 및 제8461호 제외)\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계 부분품과 부속품(제82류의 공구는 제외한다)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수구 및 수동/페달식 그라인딩 휠(제8205호)\n(b) 모래 분사기(제8424호)\n(c) 물리공정 가공기 및 워터제트 절단기(제8456호)\n(d) 머시닝센터, 트랜스퍼머신(제8457호)\n(e) 수지식 공구(제8467호)\n(f) 금속 연마용 회전드럼(제8479호)\n(g) 재료 시험용 기기(제9024호)\n\n[소호해설]\n소호 제8460.12호 등\n수치제어식(CNC/NC)에 대해서는 제8458호 소호해설을 참조한다.",
  "contentEn": "This heading covers surface-finishing machine-tools for finishing metal or cermets by means of grinding stones, abrasives or polishing products, other than gear cutting, gear grinding or gear finishing machines of heading 84.61.\n\nIt includes :\n(I) Deburring machines.\n(II) Sharpening (tool or cutter grinding) machines (including card sharpening machines).\n(III) Grinding machines (internal grinding, centreless grinding, cylindrical grinding, surface grinding, thread grinding).\n(IV) Honing and lapping machines.\n(V) Polishing machines.\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Hand-operated grinding wheels and hand tools (heading 82.05).\n(b) Sand blasting machines (heading 84.24).\n(c) Machine-tools of heading 84.56.\n(d) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(e) Hand tools of heading 84.67.\n(f) Tumbling barrels for descaling or polishing (heading 84.79).\n(g) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.60 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
