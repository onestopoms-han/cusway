const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9305",
  "titleKo": "93.05 - 부분품과 부속품(제9301호부터 제9304호까지의 것으로 한정한다)",
  "titleEn": "93.05 - Parts and accessories of articles of headings 93.01 to 93.04.",
  "contentKo": "이 호에는 제9301호부터 제9304호까지에 분류되는 모든 무기(군용 무기, 리볼버/피스톨 권총, 기타 화기 및 비화약식 무기)의 전용 부분품과 부속품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 리볼버/피스톨 권총용 부분품/부속품(제9305.10호) : 프레임, 회전실린더, 슬라이드, 그립(그립 플레이트).\n- 제9303호 산탄총/라이플 소총용 부분품/부속품(제9305.20호) : 총신, 개머리판(목재/플라스틱), 방아쇠울, 해머, 텀블러, 시어, 갈퀴.\n- 기타 무기용 부분품/부속품(제9305.91~99호) :\n  - 군용 무기(9301호)용(제9305.91호) : 포신 라이너(이너 튜브), 대포/기관총용 포탑, 포가, 격발/반동 기구, 포미 블록, 기관총 삼각대 및 지지거치대.\n  - 기타 무기용(제9305.99호) :\n    - 총열(barrel), 약실(chamber), 노리쇠(bolt/breech), 탄창(magazine), 격발핀(firing pin), 가스 활대.\n    - 금속 가공품(주물, 압형, 단조 상태의 가공 완료 무기 부품).\n    - 소사격연습용 소경 튜브(모리스 튜브 morris tubes).\n    - 총기 소음기(silencer, 음향조절기), 소총 반동 흡수 패드.\n    - 소총 멜빵(sling), 밴드, 멜빵 고리 회전륜.\n    - 총열/총미용 가죽 보호 커버 및 케이스(전용 커버류).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 범용성 핀, 나사, 볼트, 너트, 코일스프링 (제15부 또는 제39류)\n(b) 총기 운송 보관용 하드 케이스 및 가죽 케이스 (제4202호)\n(c) 전투기/무기 조준 촬영용 건카메라 (제9007호)\n(d) 무기 장착용 또는 동반 제시되지 않는 단독 제시 조준경/망원조준기 (제9013호)\n(e) 단독 제시되는 총강 소제용 꼬챙이, 솔, 소제 도구 세트 (제8205호 또는 제9603호)" ,
  "contentEn": "This heading covers parts and accessories identifiable as intended solely or principally for the arms of headings 93.01 to 93.04.\n\nIt includes :\n- Parts of revolvers or pistols (subheading 9305.10) including frames, cylinders, and grips.\n- Parts of shotguns or rifles of heading 93.03 (subheading 9305.20) including barrels, stocks (wooden or plastics), triggers, and magazines.\n- Other parts (subheadings 9305.91 to 9305.99) :\n  - For military weapons of heading 93.01 (9305.91) including barrel liners, turrets, carriages, tripods, and breech mechanisms.\n  - Others (9305.99) including silencers (sound moderators), recoil pads, slings, protective leather covers, and morris tubes.\n\nExcludes screws/springs of general use (Section XV or Chapter 39), gun cases (heading 42.02), gun cameras (heading 90.07), separate telescopic sights (heading 90.13), and cleaning rods/brushes (heading 82.05 or 96.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.05 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
