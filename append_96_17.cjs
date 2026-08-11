const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9617",
  "titleKo": "96.17 - 진공플라스크와 그 밖의 진공용기(완전한 것으로 한정한다)와 그 부분품(유리로 만든 내부용기는 제외한다)",
  "titleEn": "96.17 - Vacuum flasks and other vacuum vessels, complete with cases; parts thereof other than glass inners.",
  "contentKo": "이 호에는 액체나 식품의 보온/보냉을 위해 이중벽 진공 구조로 설계된 보온병(진공플라스크), 보온도시락통, 보온주전자, 진공카라페 등 완전한 진공 용기 완제품과 그 부분품(외측 케이스, 뚜껑, 컵 등 - 단, 유리제 내부 용기 제외)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 완전한 진공용기 완제품(1) :\n  - 내부 이중벽 유리 용기(진공 단열층 포함)가 금속/플라스틱 보호용 외측 케이스(가죽/종이 피복식 포함)에 완전 결합 조립된 보온병.\n  - 외부 보호 케이스 없이 이중벽 스테인리스강(Stainless steel) 자체로 진공 단열벽을 형성하는 텀블러형 보온병, 캠핑용 보온 머그, 보온도시락통.\n  - 뚜껑이 음용 컵으로 공용되도록 디자인된 보온병 세트.\n- 진공 용기용 부분품(2) : 보온병용 금속/플라스틱제 외측 보호 케이스(Outer case), 뚜껑(Lid), 음용 컵 및 마개(Stopper).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 케이스에 장착되지 않고 단독으로 분리되어 제시되는 이중벽 유리제 보온병 속 유리(유리 내부용기) (제7020호)\n(b) 진공 단열 구조가 아니고, 내부 단열재가 단순 스티로폼/부직포 등으로만 처리된 일반 플라스틱제 이중벽 아이스박스 및 보온 물통 (제3924호 또는 제3926호)" ,
  "contentEn": "This heading covers finished vacuum flasks, vacuum carafes, insulated food jars, and other vacuum vessels complete with cases, and their parts (outer cases, lids, cups, stoppers) other than glass inners.\n\nIt includes :\n- Complete vacuum vessels (1) consisting of a double-walled glass inner container encased in a protective outer jacket of metal, plastics, or other materials (sometimes fabric/leather covered).\n- Double-walled stainless steel vacuum flasks, tumblers, and mugs designed for temperature retention without an outer casing.\n- Parts of vacuum vessels (2) including metal/plastic outer cases, screw lids, drinking cups, and stoppers.\n\nExcludes separate double-walled glass inner reservoirs (glass inners) (heading 70.20), and non-vacuum insulated picnic coolers or water jugs containing simple foam/plastic insulation (heading 39.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.17 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
