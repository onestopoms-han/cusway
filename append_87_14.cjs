const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8714",
  "titleKo": "87.14 - 부분품과 부속품(제8711호부터 제8713호까지의 차량의 것으로 한정한다)",
  "titleEn": "87.14 - Parts and accessories of vehicles of headings 87.11 to 87.13.",
  "contentKo": "이 호에는 제8711호부터 제8713호까지의 차량(모터사이클, 자전거, 신체장애인용 차량 등)에 전용되거나 주로 사용되는 부분품과 부속품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 모터사이클의 부분품 및 부속품(제8714.10호) : 기어박스, 클러치, 소음기(머플러), 연료탱크, 카울링, 엔진 커버 등.\n- 신체장애인용 차량의 부분품 및 부속품(제8714.20호) : 수동/전동 구동 레버, 등받이 조정대, 발판, 다리 지지대, 팔걸이 등.\n- 자전거 및 기타 차량의 부분품 및 부속품(제8714.91~99호) :\n  - 프레임, 프론트/리어 포크(서스펜션 포크 포함) 및 그 부분품(제8714.91호).\n  - 휠 림(rim) 및 스포크(spoke)(제8714.92호).\n  - 프리휠(freewheel), 스프로켓, 허브(hub)(단, 허브 브레이크 내장형은 제외)(제8714.93호).\n  - 브레이크 어셈블리(캘리퍼, 캔틸레버, 드럼, 디스크 브레이크, 코스터 브레이크 허브 포함) 및 브레이크 레버, 브레이크 슈 등(제8714.94호).\n  - 안장(saddle) 및 안장 포스트/커버(제8714.95호).\n  - 페달, 크랭크 기어 어셈블리(체인링, 크랭크 암, 보텀 브래킷 BB 축 등) 및 토클립(toe-clip)(제8714.96호).\n  - 스티어링 핸들바, 조향 칼럼 스템, 그립(grip)(제8714.99호).\n  - 체인 커버(가드), 흙받이(머드가드) 및 고정용 지지 지주.\n  - 수조 케이지(물병 거치대), 라이트 거치용 브래킷, 자전거용 짐받이(랙).\n  - 끝 단자가 완비된 자전거/모터사이클용 브레이크/변속기 이너 및 아우터 조종 케이블.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모터사이클 엔진 및 그 부분품 (제8407호, 제8409호)\n(b) 자전거용 전조등, 다이너모 발전기, 전기식 속도계 및 방향지시기 (제8512호)\n(c) 자전거용 벨, 혼 (제8306호)\n(d) 고무제 자전거/모터사이클용 타이어 및 튜브 (제4011호, 제4013호)\n(e) 일반 전동 모터사이클용 배터리 (제8507호)" ,
  "contentEn": "This heading covers parts and accessories suitable for use solely or principally with the vehicles of headings 87.11 to 87.13.\n\nIt includes :\n- Parts and accessories of motorcycles and mopeds (subheading 8714.10) such as gear boxes, clutches, fuel tanks, silencers, and windscreens.\n- Parts and accessories of carriages for disabled persons (subheading 8714.20) like driving levers, armrests, leg-supports, and backrests.\n- Frames, forks, and parts thereof (subheading 8714.91).\n- Wheel rims and spokes (subheading 8714.92).\n- Hubs, freewheels, and sprocket-wheels (subheading 8714.93).\n- Brakes (including coaster brakes and hub brakes) and parts thereof (subheading 8714.94).\n- Saddles (seats), saddle posts, and covers (subheading 8714.95).\n- Pedals, crankgears, and toe-clips (subheading 8714.96).\n- Handlebars, stems, grips, mudguards, luggage racks, and control cables with end fittings (subheading 8714.99).\n\nExcludes engines and parts (heading 84.07 or 84.09), lighting equipment and dynamos (heading 85.12), rubber tyres/tubes (heading 40.11 or 40.13), and bells (heading 83.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.14 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
