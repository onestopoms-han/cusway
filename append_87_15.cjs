const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8715",
  "titleKo": "87.15 - 유모차와 그 부분품",
  "titleEn": "87.15 - Baby carriages and parts thereof.",
  "contentKo": "이 호에는 영유아를 태우고 손으로 밀어 이동하는 유모차(baby carriage, stroller) 및 그 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 유모차 본체 :\n- 접이식(folding) 및 조립식 스트롤러(stroller).\n- 영유아용 퍼램뷸레이터(perambulator), 푸쉬체어(push-chair).\n(2) 부분품 (제17부 주규정에서 제외되지 않는 유모차 전용 부품) :\n- 섀시에 장착되는 유모차용 차체(탈착식 요람 cradle 겸용 차체 포함).\n- 유모차용 프레임(섀시) 및 그 분할 프레임 부품.\n- 유모차 바퀴(타이어 장착 여부 무관) 및 관련 부속 휠 부품.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 완구용 인형 유모차 (제9503호)" ,
  "contentEn": "This heading covers baby carriages, push-chairs, perambulators, strollers, and parts thereof.\n\nIt includes :\n- Baby carriages and strollers of all kinds (including folding types).\n- Parts suitable for use solely or principally with baby carriages (provided they are not excluded by Section XVII Notes) such as chassis/frames, detachable bodies (usable as cradles), and wheels (with or without tyres).\n\nExcludes toy doll carriages (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.15 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
