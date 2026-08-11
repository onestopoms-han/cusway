const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9206",
  "titleKo": "92.06 - 타악기[예: 북ㆍ목금ㆍ심벌ㆍ캐스터네츠ㆍ마라카스(maracas)]",
  "titleEn": "92.06 - Percussion musical instruments (for example, drums, xylophones, cymbals, castanets, maracas).",
  "contentKo": "이 호에는 맨손이나 드럼스틱(북채), 혹은 서로 마주쳐서(타격) 소리를 내는 기계식/어쿠스틱 타악기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 막(가죽)을 사용하여 소리를 내는 가죽막 악기 :\n  - 팀파니(timpani, 케틀드럼 kettle-drum) : 구리제 반구형 통에 양피를 덮고 음조 조율이 가능하게 한 북.\n  - 일반 북(drums) : 소반주용 북, 저음 북, 큰 북(bass drum), 소고, 탬버린(tambourine, 방울 달린 것 포함), 톰톰(tom-tom).\n- 가죽막이 아닌 몸체 타격 악기 :\n  - 심벌(cymbals) : 금속 원판(서로 치거나 비벼 소리를 냄).\n  - 징(gong) : 무거운 해머/펠트 뭉치 봉으로 타격하는 중국식 징 등.\n  - 트라이앵글(triangle), 캐스터네츠(castanets, 목제/골제/아이보리제 등).\n  - 목금(실로폰 xylophone), 철금(메탈로폰 metallophone, 유리판을 사용한 유사 악기 포함).\n  - 첼레스타(celesta) : 외형은 피아노와 유사하며 건반으로 조작되는 해머가 특수 강판을 때려 소리를 내는 악기.\n  - 차임(chimes), 튜블러벨(tubular bells), 마라카스(maracas, 흔들어서 소리 내는 것), 클라베스(claves, 단단한 나무 막대 한 쌍), 플렉사톤(flexatone).\n  - 무도악단(재즈 밴드 등)에서 드럼 세트로 결합하여 페달 등으로 한 사람이 동시 연주하는 드럼 키트.\n  - 공회당 등에서 사용하는 연주용 카리용(carillon).\n\n[스틱과 채 등의 동반 분류]\n- 이 호의 타악기와 함께 제시되는 적정 수량의 드럼스틱(북채), 맬릿(말렛), 비터 등은 주 제2호 규정에 따라 악기 본체와 함께 본 호로 일괄 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전자 드럼, 전자 신디사이저 패드식 타악기 (제9207호)\n(b) 문이나 탁상에 쓰이는 차임, 자명종벨, 도어벨 등 일반 비금속제 경보기/방울 (제8306호 또는 제8531호)\n(c) 괘종시계 내부 타종용 차임 및 스프링 장치 (제9114호)" ,
  "contentEn": "This heading covers acoustic/mechanical percussion musical instruments sounded by striking, shaking, or plucking with hands, sticks, or mallets.\n\nIt includes :\n- Membranophones (skin-covered instruments) such as timpani (kettle-drums), bass drums, side drums, tambourines, tabors, and tom-toms.\n- Other percussion instruments including cymbals, gongs, triangles, castanets, xylophones, metallophones, celestas, tubular bells, maracas, claves, and flexatones.\n- Drum kits combined for single-player operation.\n- Drum sticks, mallets, and beaters presented in normal quantities with their instruments.\n\nExcludes electronic drum pads (heading 92.07), decorative doorbells/gongs (heading 83.06 or 85.31), and clock striking mechanisms (heading 91.14)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.06 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
