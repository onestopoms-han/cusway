const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8804",
  "titleKo": "88.04 - 낙하산(조종 가능한 낙하산과 패러글라이더를 포함한다)과 로토슈트(rotochute), 이들의 부분품과 부속품",
  "titleEn": "88.04 - Parachutes (including directing parachutes and paragliders) and rotochutes; parts thereof and accessories thereto.",
  "contentKo": "이 호에는 인원, 화물, 장비(기상학 발신기 등) 강하용 및 항공기/우주선 감속용 낙하산, 패러글라이더, 로토슈트 및 이들의 부분품/부속품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 인명구조용/군사용 낙하산(파일럿 슈트, 주낙하산 캐노피, 슈라우드 라인, 멜빵 harness, 개장용 예삭 rip cord 등으로 구성).\n- 제트 항공기 착륙 시 제동용 감속 낙하산(테일슈트 tail chute).\n- 산기슭 등에서 상승 기류를 타고 활공하도록 설계된 레저용 패러글라이더(paraglider).\n- 회전날개 장치가 내장되어 기상 기기가 탑재된 로켓 하강 제어용으로 사용되는 로토슈트(rotochute).\n- 이들의 부분품 및 부속품 : 낙하산 포장용 캐니스터/용기(container), 신체 고정용 멜빵 벨트, 보조 스프링 프레임 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 완구용 미니어처 낙하산 (제9503호)" ,
  "contentEn": "This heading covers parachutes used for personnel or cargo descent, aircraft braking (tail chutes), paragliders, rotochutes, and their parts and accessories.\n\nIt includes :\n- Conventional personnel parachutes (comprising pilot chute, main canopy, shroud lines, risers, and harness).\n- Deceleration drag parachutes (tail chutes) for jet aircraft or spacecraft landing.\n- Paragliders consisting of a collapsible canopy, shroud cords, and a pilot's harness.\n- Rotochutes equipped with rotary blades used for controlling the descent of meteorological payloads.\n- Parts and accessories such as canopy containers, spring frames, and body harnesses."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.04 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
