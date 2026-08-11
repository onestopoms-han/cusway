const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9302",
  "titleKo": "93.02 - 리볼버(revolver)와 피스톨(pistol)(제9303호ㆍ제9304호의 것은 제외한다)",
  "titleEn": "93.02 - Revolvers and pistols, other than those of heading 93.03 or 93.04.",
  "contentKo": "이 호에는 화약의 폭발에 의해 탄환을 발사하는 권총류 중에서 리볼버(revolver, 회전식 탄창 권총)와 피스톨(pistol, 자동/반자동 또는 단발식 권총)을 분류한다. 한 손으로 파지하여 발사할 수 있도록 휴대식으로 설계된 것에 한한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 리볼버(revolver) : 회전식 탄창(실린더)에 탄을 넣어 단일 총열을 통해 순차적으로 발사하는 권총.\n- 피스톨(pistol) : 1개 또는 2개 이상의 총열을 가졌거나 반자동 탄창 장전식(탄창 교환식)인 것.\n- 특수 형태의 총기 화기 : 연필형, 만년필형, 주머니칼(포켓나이프)형, 시가렛 케이스형의 위장용 권총(화약 폭발식 격발 메커니즘을 가진 진짜 화기인 것에 한함).\n- 소형 미니어처 권총.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 일단 방아쇠를 당기면 연속하여 연사되는 기관권총/기관단총 (제9301호)\n(b) 경기 시작용 스타팅 피스톨, 살처분/도살용 캡티브볼트 권총, 신호용 베리 권총(Very pistol), 격발 불가능한 장식용 흑색화약 구식 권총 (제9303호)\n(c) 화약을 사용하지 않는 공기권총, 가스권총, 스프링권총 (제9304호)" ,
  "contentEn": "This heading covers handguns designed to be held and fired with one hand, utilizing the explosion of a gunpowder charge to discharge projectiles, excluding those of heading 93.03 or 93.04.\n\nIt includes :\n- Revolvers (with a revolving cylinder feeding a single barrel).\n- Pistols (single- or multi-barrel, or semi-automatic magazines-fed handguns).\n- Miniature pistols.\n- Disguised handguns (e.g. pencil-guns, pocket-knife guns, or cigarette-case guns, provided they are actual firearms).\n\nExcludes continuous-fire sub-machine guns/machine pistols (heading 93.01), humane killers, flare/Very pistols, starting pistols (heading 93.03), and air/gas/spring pistols (heading 93.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.02 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
