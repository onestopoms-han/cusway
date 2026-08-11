const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8475",
  "titleKo": "84.75 - 전기램프나 전자램프ㆍ튜브ㆍ밸브ㆍ섬광전구(외피를 유리로 만든 것으로 한정한다)의 조립기계와 유리나 유리제품의 제조용이나 열간(熱間)가공용 기계",
  "titleEn": "84.75 - Machines for assembling electric or electronic lamps, tubes or valves or flashbulbs, in glass envelopes; machines for manufacturing or hot working glass or glassware.",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n\n(Ⅰ) 전기램프나 전자램프ㆍ튜브ㆍ밸브ㆍ섬광전구(외피를 유리로 만든 것으로 한정한다)의 조립기계\n(A) 전구의 진공 봉지기(封止機)\n(B) 백열전구나 무선용 밸브를 자동 조립하는 회전식 기계\n(C) 컨베이어로 연결된 전기식 필라멘트 전구 조립용 기계라인\n단, 양극/지지대 절단/인발기(제8462호), 필라멘트용 미세선 권선기(제8463호), 전극 용접기(제8468호, 제8515호) 등 단순 구성품 제조용 기계는 제외한다.\n\n(Ⅱ) 유리나 유리제품의 제조용이나 열간(熱間)가공용 기계\n연화 또는 용융 상태로 가열된 유리를 캐스팅, 드로잉, 롤링, 스피닝, 블로잉, 몰딩 등으로 가공하는 기계이다. 냉간 가공 기계는 제외한다(제8464호).\n(A) 평면 유리판의 제조용 기계 : 연신(drawing out) 판유리 제조기, 플로트(float) 유리 제조기계.\n(B) 그 밖의 유리의 열간 가공용 기계\n(1) 병 제조기계\n(2) 유리 블록, 타일, 애자, 중공유리제품 등 성형 프레스 (범용 프레스 제8479호 제외)\n(3) 유리관 드로잉 및 쉐이핑 기계\n(4) 유리 비드(bead) 제조기\n(5) 유리섬유(연속 유리실, 단섬유, 유리워딩) 제조 기계\n(6) 전구/전자관 등의 유리제 부분품(스템 등) 제조 기계\n(7) 광섬유 및 광섬유 예비성형품 제조 기계\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품은 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수지식 글라스 블로우어(제8205호)\n(b) 강화유리 제조용 열처리 장비(제8419호)\n(c) 유리제조용 주형(mould)(제8480호)",
  "contentEn": "This heading covers machines for assembling electric or electronic lamps, tubes or valves or flashbulbs, in glass envelopes, and machines for manufacturing or hot working glass or glassware.\n\nIt includes :\n(I) Lamp or tube assembling machines (vacuum sealing machines, rotary assembly machines, lamp assembly lines).\n(II) Glass hot working and manufacturing machinery (flat/float glass drawing machines, bottle-making machinery, glass insulator presses, fiber-glass forming machines, optical fibre and preform manufacturing equipment).\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Hand-operated glass blowers (heading 82.05).\n(b) Toughening/tempering glass furnaces (heading 84.19).\n(c) Moulds for glass making (heading 84.80)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.75 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
