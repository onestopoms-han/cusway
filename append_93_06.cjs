const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9306",
  "titleKo": "93.06 - 폭탄ㆍ유탄ㆍ어뢰ㆍ지뢰ㆍ미사일과 이와 유사한 군수품과 이들의 부분품, 탄약ㆍ그 밖의 총포탄ㆍ탄두와 이들의 부분품[산탄알과 탄약 안에 충전되는 와드(wad)를 포함한다]",
  "titleEn": "93.06 - Bombs, grenades, torpedoes, mines, missiles and similar munitions of war and parts thereof; cartridges and other ammunition and projectiles and parts thereof, including shot and cartridge wads.",
  "contentKo": "이 호에는 군사 작전용 폭탄, 어뢰, 지뢰, 미사일, 수류탄과 같은 각종 군수품 및 화기용 실탄, 공포탄, 납탄, 공기총 탄환 등 모든 형태의 총포탄(탄약)과 이들의 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 산탄총용 탄약과 그 부분품, 공기총 탄환(제9306.21~29호) :\n  - 스포츠/수렵용 산탄총 탄약(실탄/공포탄)(제9306.21호).\n  - 공기총/가스총/스프링총용 납탄(pellet), 구형 강철탄, 기타 탄환 및 산탄총 탄약용 부분품(와드 wad, 황동제 베이스 등)(제9306.29호).\n- 그 밖의 탄약과 그 부분품(제9306.30호) : 권총, 소총, 기관총용 모든 종류의 실탄 및 공포탄(리벳 공구용 및 시동기 엔진용 공포탄 포함) 및 탄피(cartridge case), 기프(기폭)제.\n- 기타 군수품 및 부분품(제9306.90호) :\n  - 포탄(유산탄, 철갑탄, 조명탄, 소이탄, 연막탄), 박격포탄.\n  - 탄도 미사일(최종속도 7,000m/s 이하 탄두 탑재식).\n  - 자기추진식 유도탄, 로켓탄, 어뢰(torpedo), 기뢰/지뢰(mines), 수류탄, 총류탄, 항공기 투하용 폭탄.\n  - 포경포(작살총)용 작살(harpoon, 폭약 헤드 유무 불문).\n  - 군수품의 부분품 : 어뢰/미사일 동체, 부력실, 유탄용 격침/안전핀, 폭탄용 꼬리날개(핀), 어뢰 구동용 특수 프로펠러 및 자이로스코프(단독 제시품), 신관(fuse, 시한신관/근접신관 등, 기계식 장치 포함).\n  - 탄약의 조제 부속품 : 내부 베이스, 판지 내부 덮개, 펠트/코르크제 와드(wad).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 화약 단독, 폭약 분말 (제3601호, 제3602호) 및 안전도화선, 도폭선, 뇌관, 마찰점화기 (제3603호)\n(b) 농업용 레인로켓(인공강우용), 신호용 조명탄 (제3604호)\n(c) 미사일/어뢰 추진용 단독 엔진(가스터빈, 제트엔진 등) (제8411호 또는 제8412호)\n(d) 미사일/어뢰 유도용 무선 조종 및 레이더 수신기/기기 (제8526호 - 주 제2호)\n(e) 신관용 신호 제어용 시계 무브먼트 및 부품 (제9108~9110호, 제9114호)\n(f) 소방용 소화탄 및 소화기 충전제 (제3813호)" ,
  "contentEn": "This heading covers ammunition of all descriptions (bombs, grenades, torpedoes, mines, missiles, cartridges, and shells) and parts thereof, including shot and cartridge wads.\n\nIt includes :\n- Shotgun ammunition and parts thereof, and air gun pellets (subheadings 9306.21 to 9306.29) including shotgun cartridges (9306.21) and pellets/wads (9306.29).\n- Other cartridges and parts thereof (subheading 9306.30) for rifles, pistols, or machine-guns (including blanks for industrial tools).\n- Other munitions and parts (subheading 9306.90) including artillery shells, ballistic missiles, self-propelled guided missiles, torpedoes, mines, grenades, harpoons, bomb fins, and fuzes.\n\nExcludes gunpowder/detonating caps (Chapter 36), rocket motors (heading 84.11/84.12), radio/radar guidance apparatus (heading 85.26), and clockwork fuzes (Chapter 91)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.06 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
