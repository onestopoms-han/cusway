const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9702",
  "titleKo": "97.02 - 오리지널 동판화ㆍ목판화ㆍ석판화",
  "titleEn": "97.02 - Original engravings, prints and lithographs.",
  "contentKo": "이 호에는 기계적 인쇄 공정이나 사진제판법(포토그라비어 등)을 완전히 배제하고, 예술가가 손으로 직접 파거나 에칭한 단일/복수 원판(동판, 목판, 석판 등)으로부터 직접 찍어낸 흑백 또는 천연색 오리지널 판화를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 제작 후 100년 초과 골동판화(제9702.10호).\n- 100년 이하 기타 현대 오리지널 판화(제9702.90호).\n- 오리지널 석판화(Lithographs) : 석판가가 전용 전사지에 밑그림을 그린 후 이를 석판 돌 표면에 전사하여 고전적 방식으로 압착 인쇄한 전사 석판화를 포함한다.\n- 판화 기법 적용작 : 드라이포인트 凹판조각법, 선 판화법, 동판부식법(질산 에칭법), 메조틴트, 점각법 등을 적용해 원판에서 다이렉트로 찍어낸 오리지널 날염 본.\n\n[오리지널 판화 식별 및 동반 분류 기준]\n- 오리지널 판화의 틀(액자)은 판화와 함께 제시되고 가치가 적정 수준인 경우 본 호의 판화에 일괄 분류한다. 가격이 지나치게 높거나 비정상적 재질인 경우 별도로 분리해 재질별 분류를 수행한다 (주 제6호).\n- 기계 복제판화는 미세한 망점 스크린 흔적이 있고 원판 누름 흔적이 없어 오리지널 판화에서 제외된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 그림을 찍어내는 데 사용되는 구리, 아연, 목재, 석재 등 조각된 상태의 인쇄용 원판 단독 제시품 (제8442호)\n(b) 100년을 초과하였으나 사진 인화 기술로 생산된 오리지널 사진 본 (제9706호)" ,
  "contentEn": "This heading covers original engravings, prints, and lithographs, divided into over 100 years old (subheading 9702.10) and others (subheading 9702.90), produced directly from plates executed by hand by the artist, excluding mechanical or photomechanical processes.\n\nIt includes :\n- Original impressions produced from copper, zinc, wood, stone, or other plates engraved by hand.\n- Lithographs produced via transfer techniques (drawing on paper first and transferring to stone).\n- Various hand-printed techniques: line engraving, drypoint, etching, and stipple engraving.\n- Suitable frames presented together with the prints (Note 6).\n\nExcludes the actual engraved printing plates of copper or stone (heading 84.42), and prints produced by photomechanical methods (e.g. photogravures) (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.02 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
