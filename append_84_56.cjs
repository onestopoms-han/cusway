const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8456",
  "titleKo": "84.56 - 각종 재료의 가공 공작기계[레이저나 그 밖의 광선ㆍ광자빔ㆍ초음파ㆍ방전ㆍ전기화학ㆍ전자빔ㆍ이온빔ㆍ플라즈마아크(plasma arc) 방식으로 재료의 일부를 제거하여 가공하는 것으로 한정한다]와 워터제트 절단기",
  "titleEn": "84.56 - Machine-tools for working any material by removal of material, by laser or other light or photon beam, ultrasonic, electro-discharge, electro-chemical, electron beam, ionic-beam or plasma arc processes; water-jet cutting machines.",
  "contentKo": "이 호의 공작기계는 각종 재료의 성형이나 표면가공용 기계이다. 재료를 제거하여 가공해야 하며, 기존의 공작기계와 유사한 성격의 가공 공정이 레이저, 초음파, 방전, 전기화학, 전자빔, 이온빔, 플라즈마아크 및 워터제트 방식으로 이루어져야 한다.\n다만, 제8486호에 전용되는 반도체/디스플레이 제조용 기계(웨이퍼 절삭용 레이저기 등)는 제외한다.\n\n(A) 레이저나 그 밖의 광선ㆍ광자빔 방식 공작기계 (용융, 연소, 증발을 통한 ablation 가공)\n(B) 초음파 방식 공작기계 (초음파 진동 펀치와 연마제 서스펜션 가공)\n(C) 방전 방식 공작기계 (두 전극 사이의 방전을 이용한 가공)\n(D) 전기화학 방식 공작기계 (전기분해를 이용한 금속 제거 가공)\n(E) 전자빔 방식 공작기계 (음극에서 방사된 전자빔으로 가공)\n(F) 이온빔 방식 공작기계\n(G) 플라즈마아크 방식 공작기계\n(H) 워터제트 절단기 (수압 및 수압-연마제 혼합 제트 절단기)\n\n부분품과 부속품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 초음파 세척기(제8479호)\n(b) 납땜/용접용 기기(절단 겸용 포함)(제8515호)\n(c) 재료 시험용 기계(제9024호)",
  "contentEn": "This heading covers machine-tools for working any material by removal of material, using laser, light or photon beam, ultrasonic, electro-discharge, electro-chemical, electron beam, ionic-beam or plasma arc processes; it also covers water-jet cutting machines.\n\nIt includes :\n(I) Laser or other light/photon beam machines (laser engraving/cutting, ablation).\n(II) Ultrasonic machines (using abrasive slurry and vibrating tool).\n(III) Electro-discharge machines (EDM, wire-cut machines).\n(IV) Electro-chemical machines.\n(V) Electron beam, ionic-beam, and plasma arc cutting machines.\n(VI) Water-jet and water-abrasive jet cutting machines.\n\nParts and accessories of these machines fall in heading 84.66.\n\nThe heading excludes :\n(a) Machines for the manufacture of semiconductor devices, flat panel displays, etc. (heading 84.86).\n(b) Ultrasonic cleaning apparatus (heading 84.79).\n(c) Soldering, brazing or welding machines (heading 85.15).\n(d) Material testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.56 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
