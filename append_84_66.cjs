const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8466",
  "titleKo": "84.66 - 제8456호부터 제8465호까지의 기계에 전용되거나 주로 사용되는 부분품과 부속품[가공물홀더ㆍ툴홀더(tool holder)ㆍ자동개폐식 다이헤드(diehead)ㆍ분할대와 그 밖의 기계용 특수 부착물을 포함한다]과 수지식 공구에 사용되는 각종 툴홀더(tool holder)",
  "titleEn": "84.66 - Parts and accessories suitable for use solely or principally with the machines of headings 84.56 to 84.65, including work or tool holders, self-opening dieheads, dividing heads and other special attachments for the machines; tool holders for any type of tool for working in the hand.",
  "contentKo": "제82류의 공구를 제외하고 부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 다음 물품을 분류한다.\n(A) 제8456호부터 제8465호까지의 기계의 부분품\n(B) 이들 기계의 부속품 (호환성 보조 장치, 정밀도 제고 장치 등)\n(C) 수지식 공구(제8205호 또는 제8467호용)에 사용되는 각종 툴홀더\n\n이 호에 분류하는 광범위한 부분품과 부속품에는 다음의 것을 포함한다 :\n(1) 툴홀더(tool holder) : 척(chuck), 콜렛(collet), 선반 툴 포스트, 자동개폐식 다이헤드, 그라인딩 휠 홀더, 호닝 보디, 보링 바, 터릿 등\n(2) 가공용 홀더(work holder) : 선반 센터, 선반 척, 클램핑 조오, 테이블, 바이스, 고정장치(steady rest) 등\n(3) 노칭용, 구면 절삭용 등의 보조 장치\n(4) 모방용 부속장치 (CNC/전자식 포함)\n(5) 표면완성 가공용 부속장치\n(6) 가공 공정 자동 조절용 기계식/압축공기식 부속장치\n(7) 특수 보조적 부속장치 (심출/레벨링 용구, 할출대(dividing head), 할출판, 광학식 할출대 등)\n단, 심출현미경(제9011호), 정열/레벨링 망원경, 프로파일 투영기(제9031호) 등 본질적인 광학 장치는 제외한다.\n\n이 호에는 다음의 것도 제외한다.\n(a) 그라인딩 휠 및 연마물품(제6804호)\n(b) 오일 여과기(제8421호)\n(c) 취급/권양용 보조 수평 잭(제8425호)\n(d) 기어박스 및 전동 장치(제8483호)\n(e) 제8486호 기계용 부분품 및 부속품(제8486호)\n(f) 전자식 척 및 수치제어패널(제85류)\n(g) 측정/검사용 기기(제9031호)\n(h) 회전계 및 생산량계(제9029호)\n(ij) 기계 부착용 브러시(제9603호)",
  "contentEn": "This heading covers parts and accessories suitable for use solely or principally with the machine-tools of headings 84.56 to 84.65, including work or tool holders, dividing heads and other special attachments, and tool holders for hand tools.\n\nIt includes :\n(I) Tool holders (chucks, collets, tool posts, self-opening dieheads, boring bars, turret heads, flexible shaft tool holders).\n(II) Work holders (lathe centres, clamping jaws, magnetic/non-magnetic chucks, steady rests, machine vices).\n(III) Special attachments (profile-copying attachments, spherical turning attachments, dividing heads, indexing plates).\n\nThe heading excludes :\n(a) Grinding wheels (heading 68.04).\n(b) Oil filters (heading 84.21).\n(c) Lifting jacks (heading 84.25).\n(d) Gearboxes and transmission elements (heading 84.83).\n(e) Parts and accessories specialized for machines of heading 84.86.\n(f) Electromagnetic chucks and NC/CNC control panels (Chapter 85).\n(g) Measuring or checking instruments (heading 90.31).\n(h) Brushes for mounting on machines (heading 96.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.66 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
