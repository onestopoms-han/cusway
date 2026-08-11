const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9610",
  "titleKo": "96.10 - 석판과 보드(필기용이나 도화용 면을 갖춘 것으로 한정하며, 틀이 있는지에 상관없다)",
  "titleEn": "96.10 - Slates and boards, with writing or drawing surfaces, whether or not framed.",
  "contentKo": "이 호에는 초크(분필)나 석필을 사용하여 필기/소묘할 수 있도록 제작된 석판, 칠판(흑판), 화이트보드 및 이와 유사한 필기판/게시판을 분류한다(틀 frame 유무 불문).\n\n이 호에는 다음의 물품을 포함한다.\n- 학생용 개인 석판 및 휴대용 드로잉판.\n- 학교용 칠판(흑판), 벽걸이형/스탠드형 화이트보드, 식당/카페 메뉴 게시용 보드.\n- 슬레이트(천연/응결 슬레이트)로 제작되었거나, 목재, 판지, 방직용 섬유, 석면시멘트 등의 기재에 슬레이트 가루/플라스틱 시트/특수 페인트 등을 도포하여 필기용 표면을 만든 보드.\n- 표면에 영구 선(격자선, 음악 오선, 스케줄 표 등)이 인쇄되어 있거나 주사위/계산 장치가 결합된 교육용 보드.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 필기용 표면 가공(연마, 도포 등)을 거치지 않은 천연 슬레이트 원판 (제2514호 또는 제6803호)\n(b) 마커용 화이트보드 펜 및 분필/석필 (제9608호 또는 제9609호)" ,
  "contentEn": "This heading covers slates and boards designed with writing or drawing surfaces for use with chalk or slate pencils, whether or not framed.\n\nIt includes :\n- School slates and blackboards (including mobile boards on stands).\n- Notice boards or menu boards of restaurants.\n- Boards made of slate (natural or agglomerated) or of wood, paperboard, or fiber-cement coated with slate powder, plastics, or writing paint.\n- Boards with permanently ruled lines (grids, musical staves) or with attached counting devices.\n\nExcludes unworked natural slates (heading 25.14 or 68.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.10 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
