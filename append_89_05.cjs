const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8905",
  "titleKo": "89.05 - 조명선ㆍ소방선ㆍ준설선ㆍ기중기선과 주로 항해 외의 특수기능을 가지는 그 밖의 특수선박, 부선거(艀船渠), 물에 뜨거나 잠길 수 있는 시추대나 작업대",
  "titleEn": "89.05 - Light-vessels, fire-floats, dredgers, floating cranes, and other vessels the navigability of which is subsidiary to their main function; floating docks; floating or submersible drilling or production platforms.",
  "contentKo": "이 호에는 항해(운송) 자체 보다는 정지 상태에서 특수한 작업 기능을 수행하는 것이 주 목적인 특수선박, 선박 수리용 부선거(플로팅 도크), 그리고 수중에 띄우거나 가라앉힐 수 있는 해상 시추/작업 플랫폼을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 준설선(dredger)(제8905.10호) : 수저(바닥) 토사를 파내는 그랩식, 흡인식 준설선.\n- 시추대 또는 작업대(제8905.20호) : 해저 원유/가스 탐사 및 채굴용 시추 플랫폼(물에 뜨거나 잠길 수 있는 것 - 자력승강식 self-elevating, 잠수식 submersible, 반잠수식 semi-submersible platforms 포함).\n- 기타 특수선박 (소호 제8905.90호) :\n  - 등대선(조명선 light-vessel), 소방선(fire-float, 대형 소화 펌프 및 방수포 장착선).\n  - 기중기선(floating crane), 침몰선 인양용 구조선, 항공기 수색 구조용 고정계류 부선.\n  - 곡물 엘리베이터 등 양하용 기계가 탑재된 플랫 폰툰(pontoon) 및 하우스보트(주거용 보트), 세탁선, 제분선.\n  - 부선거(floating dock) : U자형 단면 구조로 밸러스트 탱크 펌프실을 갖추어 선박 입거/수리를 돕는 부유식 도크(자주식 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 해저 지반에 직접 콘크리트/철강 파일(지둥)을 박아 영구적으로 고정 배치한 해상 시추대 및 생산 플랫폼 (제8430호)\n(b) 해저 케이블 부설선, 해양/기상 관측선 (제8906호)\n(c) 어획물 가공 가동선 (제8902호)" ,
  "contentEn": "This heading covers vessels designed to perform special non-navigational work (where navigability is secondary to their function), floating docks, and floating/submersible drilling or production platforms.\n\nIt includes :\n- Dredgers (subheading 8905.10) including grab and suction dredgers.\n- Floating or submersible drilling or production platforms (subheading 8905.20) such as self-elevating, submersible, and semi-submersible platforms.\n- Light-vessels, fire-floats, floating cranes, salvage vessels, and pontoons equipped with lifting or handling machinery (subheading 8905.90).\n- House-boats, laundry boats, and floating mills.\n- Floating docks (dry dock substitutes) which can be flooded to admit ships for repair/transport.\n\nExcludes fixed offshore platforms which are neither floating nor submersible (heading 84.30), cable-laying ships and research vessels (heading 89.06), and factory ships (heading 89.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.05 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
