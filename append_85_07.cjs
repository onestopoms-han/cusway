const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8507",
  "titleKo": "85.07 - 축전지(격리판을 포함하며, 직사각형이나 정사각형인지에 상관없다)",
  "titleEn": "85.07 - Electric accumulators, including separators therefor, whether or not rectangular (including square).",
  "contentKo": "이 호에는 충전과 방전을 반복할 수 있는 가역적인 이차전지(축전지)를 분류한다.\n\n주요 축전지 형태는 다음과 같다.\n(1) 연산축전지(鉛酸蓄電池, Lead-acid) : 전해액으로 황산을 사용하며 납판 또는 납격자 전극을 사용 (자동차용, 비상전원용 등).\n(2) 알칼리축전지 및 그 밖의 축전지 :\n- 니켈-카드뮴(Ni-Cd) 축전지\n- 니켈-수소(Ni-MH) 축전지\n- 리튬이온(Li-ion) 축전지 및 리튬폴리머 축전지\n- 기타 알칼리 축전지 (은-아연 등)\n\n전해액 없이 제시되는 축전지도 이 호에 포함한다. 또한, 하나 이상의 셀과 셀 간의 연결 회로를 가지며 보호용 하우징, 접속자, 서미스터(온도조절장치), 회로보호장치와 같은 부수적 구성요소를 포함하는 \"배터리 팩(battery pack)\"도 장치 전용 여부와 무관하게 이 호에 분류한다.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품(용기, 커버, 납판/격자, 격리판 등)을 분류한다. 격리판(separator)은 직사각형으로 절단된 평판 모양의 것을 포함한다 (단, 비경화 가황고무제나 방직용 섬유제는 제외).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 배터리용 터미널(접속단자) (제8536호)\n(b) 수명이 끝난 축전지 및 이들의 웨이스트/스크랩 (제8549호)",
  "contentEn": "This heading covers electric accumulators (secondary/rechargeable batteries), including separators therefor.\n\nIt includes :\n(I) Lead-acid accumulators.\n(II) Alkaline and other accumulators :\n- Nickel-cadmium (Ni-Cd).\n- Nickel-metal hydride (Ni-MH).\n- Lithium-ion (Li-ion) and lithium-polymer.\n- Silver-zinc, etc.\n\nAccumulators remain classified here even when presented without electrolyte. The heading also covers battery packs consisting of one or more cells and associated circuitry (connectors, thermistors, circuit protection devices, and housing) even if specialized for specific devices.\n\nParts, including containers, covers, plates, grids, and separators (except of unhardened vulcanised rubber or textiles) are classified here.\n\nThe heading excludes :\n(a) Terminals (heading 85.36).\n(b) Spent accumulators and waste/scrap thereof (heading 85.49)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.07 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
