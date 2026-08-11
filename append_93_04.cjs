const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_93.json';

const newEntry = {
  "hsCode": "9304",
  "titleKo": "93.04 - 그 밖의 무기(예: 스프링총ㆍ공기총ㆍ가스총ㆍ경찰봉)(제9307호의 것은 제외한다)",
  "titleEn": "93.04 - Other arms (for example, spring, air or gas guns and pistols, truncheons), excluding those of heading 93.07.",
  "contentKo": "이 호에는 화약/폭약 격발식 화기(9301~9303호) 및 칼붙이 무기(9307호)를 제외하고, 공기/가스/스프링 동력을 이용해 발사하거나 타격/호신용으로 사용되는 기타 무기를 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n- 기체/가스/스프링 발사식 권총 및 소총 :\n  - 공기총, 공기라이플, 공기권총 : 압축 공기 탱크를 내장하여 납탄/스틸탄을 발사하는 총기.\n  - 가스총, 가스피스톨 : CO2(이산화탄소) 등 압축 가스로 발사하는 유사 총기(동물 포획 및 백신/마취 주사 발사용 원격 발사식 주사총 포함).\n  - 스프링총 : 강력한 내부 코일 스프링의 반발력으로 격발하는 소총 및 권총.\n- 타격/타박 및 호신용 무기 :\n  - 경찰봉(truncheon), 호신봉(life-preserver), 금속/납을 채워 무게를 무겁게 한 지팡이 및 쇠막대.\n  - 너클더스터(knuckleduster) : 주먹에 끼워 타격력을 높이는 금속판 무기.\n  - 최루가스 분사기 : 최루 가스(CS/CN 가스 등) 성분을 함유한 압축 에어로졸 스프레이 캔.\n  - 사냥/해충방제용 투석기(지팡이 형상 등).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 완구용 고무줄 새총, 장난감 공기총 및 물총 (제9503호)\n(b) 군검, 세이버, 창, 총검 및 이와 유사한 칼/무기 (제9307호)" ,
  "contentEn": "This heading covers non-powder arms (utilizing air, gas, or spring power) and other defensive or offensive weapons, excluding military weapons (93.01), handguns (93.02), explosive-charge devices (93.03), and sidearms (93.07).\n\nIt includes :\n- Air, gas, or spring guns, rifles, and pistols (including remote dart-firing tranquilizer/vaccinating guns for animals).\n- Truncheons, life-preservers, weighted canes, and clubs.\n- Knuckledusters (metal knuckle protectors).\n- Tear gas aerosol sprays.\n- Catapults (other than toys).\n\nExcludes toy catapults/slingshots and toy air pistols (heading 95.03), and bayonets/swords (heading 93.07)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 93.04 to chapter_93.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
