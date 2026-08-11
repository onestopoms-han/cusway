const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8487",
  "titleKo": "84.87 - 기계류의 부분품(접속자ㆍ절연체ㆍ코일ㆍ접촉자와 그 밖의 전기용품을 포함하지 않으며, 이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "84.87 - Machinery parts, not containing electrical connectors, insulators, coils, contacts or other electrical features, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 기계류의 모든 비전기식(non-electrical) 부분품을 분류하되, 이 류에 따로 분류되지 않은 것에 한정한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 비자동식 윤활유용 포트\n(2) 비자동식 그리스용 니플(nipple)\n(3) 수동식 휠, 레버, 손잡이\n(4) 안전덮개, 베이스플레이트(baseplate)\n(5) 오일 실 링(oil seal ring) : 고무링과 금속보강재를 접합하여 조립한 링 등으로, 기계의 연결 부위를 밀폐하여 누출 및 이물질 유입을 방지하는 간단한 구조의 링 (메커니컬 실 제8484호 제외).\n(6) 선박용 및 보트용 프로펠러(propeller)와 패들휠(paddle-wheel) 및 그 블레이드(blade).\n\n이 호에는 다음의 것도 제외한다.\n(a) 특정 기계용으로 특별히 설계되어 해당 기계 또는 해당 부분품 호에 전용/주요 사용 분류되는 부분품 (예: 제8479호, 제8543호, 제17부, 제90류 등).\n(b) 제8481호부터 제8484호까지의 부분품.\n(c) 플라스틱제 벨트(제39류), 고무제 벨트(제4010호), 가죽제 부분품(제4205호), 방직용 섬유제 벨트(제5910호) 및 기계용 섬유제품(제5911호).\n(d) 도자제(제69류) 및 유리제 부분품(제70류).\n(e) 귀석/반귀석제 기계 부분품(제71류).\n(f) 제15부 주 제2호의 범용성 부분품 (나사, 체인, 스프링 등).\n(g) 기계용 브러시 (제9603호).",
  "contentEn": "This heading covers all non-electrical machinery parts, not specified or included elsewhere in this Chapter.\n\nIt includes :\n(I) Ship or boat propellers and paddle-wheels, and blades thereof.\n(II) Non-automatic lubricators and grease nipples.\n(III) Hand wheels, levers and grips.\n(IV) Safety guards and baseplates.\n(V) Oil seal rings (radial lip seals consisting of rubber and metal reinforcement for static or dynamic shaft sealing).\n\nThe heading excludes :\n(a) Parts suitable for use solely or principally with a particular machine (classified under the same heading as the machine or its specific parts).\n(b) Taps, valves, etc. (heading 84.81), bearings (heading 84.82), transmission elements (heading 84.83) or composite gaskets/mechanical seals (heading 84.84).\n(c) Belts or belting of plastics (Chapter 39), vulcanised rubber (heading 40.10) or textiles (heading 59.10).\n(d) Parts of ceramics (Chapter 69) or glass (Chapter 70).\n(e) Parts of general use as defined in Note 2 to Section XV (screws, chains, springs, etc. of base metal).\n(f) Brushes for mounting on machines (heading 96.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.87 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
