const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8461",
  "titleKo": "84.61 - 플레이닝(planing)용ㆍ쉐이핑(shaping)용ㆍ슬로팅(slotting)용ㆍ브로칭(broaching)용ㆍ기어절삭용ㆍ기어연삭용ㆍ기어완성가공용ㆍ톱질용ㆍ절단용 공작기계와 금속이나 서멧(cermet)을 절삭하는 방식으로 가공하는 그 밖의 공작기계(따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "84.61 - Machine-tools for planing, shaping, slotting, broaching, gear cutting, gear grinding or gear finishing, sawing, cutting-off and other machine-tools working by removing metal or cermets, not elsewhere specified or included.",
  "contentKo": "이 호에는 금속이나 서멧(cermet)의 절삭가공용의 공작기계를 포함하며, 다른 호에 열거하거나 포함되는 것은 제외한다.\n베이스플레이트, 장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수공구와 구별된다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 플레이닝머신(planing machine) : 공구가 고정되고 가공물을 얹은 테이블이 왕복 운동하여 평면을 가공하는 기계이다.\n(2) 쉐이핑머신(shaping machine) : 가공물은 고정되고 공구가 왕복 선형 운동을 하여 평면을 가공하는 소형 기계이다.\n(3) 슬로팅머신(slotting machine) : 공구가 수직이나 경사 방향으로 왕복 운동하여 슬로트 등을 가공하는 기계이다. 홈파는 기계를 포함한다.\n(4) 브로칭머신(broaching machine) : 가공물을 통과하거나 지나가면서 브로치 툴을 밀거나 당겨 표면을 정밀 가공하는 기계이다.\n(5) 기어절삭기ㆍ기어연삭기ㆍ기어완성가공기 : 금속 절삭 방식으로 기어를 가공하는 기계이다. 호브 커터, 랙 커터 등을 사용한다.\n(6) 톱기계(sawing machine) : 왕복식/진동식 톱기계, 원형톱 기계, 밴드소(bandsaw) 톱기계 등이 있다.\n(7) 절단기계(cutting-off machine) : 연마디스크식 절단기, 마찰 톱기계(금속디스크식) 및 선반 방식 절단기 등이 있다.\n(8) 줄기계(filing machine) : 톱날 대신 줄(file)을 사용하는 기계이다.\n(9) 조각기계(engraving machine) (제8459호 및 제8460호 제외)\n\n부분품과 부속품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계의 부분품과 부속품(제82류의 공구는 제외)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수공구(제8205호)\n(b) 물리공정 가공기 및 워터제트 절단기(제8456호)\n(c) 머시닝센터, 트랜스퍼머신(제8457호)\n(d) 수지식 공구(제8467호)\n(e) 검사용 기기(제9024호)",
  "contentEn": "This heading covers machine-tools working by removing metal or cermets, which are not specified or included in other headings.\n\nIt includes :\n(I) Planing machines (workpiece reciprocates under a fixed tool).\n(II) Shaping machines (tool reciprocates over a fixed workpiece).\n(III) Slotting machines (vertical shaping machines, including slotting-punching machines).\n(IV) Broaching machines (horizontal or vertical, utilizing a broach tool).\n(V) Gear cutting, gear grinding or gear finishing machines (generating, hobbing or milling gears).\n(VI) Sawing machines (reciprocating hacksaws, circular saws, bandsaws).\n(VII) Cutting-off machines (using abrasive discs, friction wheels or lathe-type parting tools).\n(VIII) Filing machines.\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Hand tools (heading 82.05).\n(b) Machine-tools of heading 84.56.\n(c) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(d) Hand tools of heading 84.67.\n(f) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.61 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
