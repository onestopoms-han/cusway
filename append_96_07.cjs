const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9607",
  "titleKo": "96.07 - 슬라이드파스너(slide fastener)와 그 부분품",
  "titleEn": "96.07 - Slide fasteners and parts thereof.",
  "contentKo": "이 호에는 의류, 신발, 가방, 텐트 등 모든 용도의 지퍼(슬라이드파스너 slide fastener) 및 그 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 슬라이드파스너(지퍼)(제9607.11~19호) :\n  - 비금속(卑金屬)제 체인스쿠프를 가진 지퍼(제9607.11호) : 황동, 알루미늄 등 금속제 이빨(스쿠프)이 달린 지퍼.\n  - 기타(제9607.19호) : 플라스틱(나일론 등)제 코일 지퍼 및 에지 맞물림식 지퍼.\n- 슬라이드파스너의 부분품(제9607.20호) : 지퍼 이빨(체인 스쿠프 chain scoop 단독), 슬라이더(slider, 지퍼 대가리) 및 활주부(runner), 엔드피스(상하부 스토퍼 stop), 스쿠프(이빨)가 이미 장착된 긴 롤 형태의 지퍼 테이프 스트립.\n\n[주요 분류 기준]\n- 지퍼의 이빨(스쿠프)이 없는 단순한 방직용 섬유 테이프(끈)는 본 호에서 제외하며 제5806호의 세폭직물로 분류한다." ,
  "contentEn": "This heading covers slide fasteners (zippers) of all sizes and for all uses, and their parts.\n\nIt includes :\n- Slide fasteners (subheadings 9607.11 to 9607.19) with scoops of base metal (9607.11) or of other materials like nylon/plastics (9607.19).\n- Parts (subheading 9607.20) including chain scoops, sliders (runners), stop pieces (top/bottom stops), and narrow textile tape fitted with chain scoops.\n\nExcludes narrow textile tapes without scoops (heading 58.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.07 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
