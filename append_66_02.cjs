const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_66.json';

const newEntry = {
  "hsCode": "6602",
  "titleKo": "66.02 - 지팡이ㆍ시트스틱(seat-stick)ㆍ채찍ㆍ승마용 채찍과 이와 유사한 물품",
  "titleEn": "66.02 - Walking-sticks, seat-sticks, whips, riding-crops and the like.",
  "contentKo": "다음 예외규정에서 언급한 물품을 제외하고, 이 호에는 지팡이ㆍ케인(cane)ㆍ채찍(whip-lead를 포함한다)ㆍ이와 유사한 것을 분류하며 이들을 만든 구성 재료는 상관없다.\n\n(A) 지팡이․시트스틱(seat-stick)과 이와 유사한 것\n\n일반적인 지팡이에 추가해서 이 그룹에는 또한 시트스틱(seat-stick)(펼치면 좌석이 될 수 있는 것으로 손잡이를 가지고 있는 것)ㆍ장애인과 고령자를 위해 특별히 설계된 지팡이ㆍ소년단원용의 장대ㆍ목동용의 크루크(crook) 등을 포함한다.\n\n이 그룹에는 또한 굴곡지게 하거나 구부리거나 그 밖의 방법으로 가공한 미완성의 케인(cane)이나 목재지팡이도 포함하며 ; 그러나 지팡이의 제조에 적당한 케인(cane)이나 목재를 단순히 조잡한 손질이나 원형화 시킨 것은 제외한다(제1401호나 제44류). 이 호에는 또한 손잡이의 미완성 제품으로서 분명히 간주할 수 있는 블랭크(blank)도 제외한다(제6603호).\n\n지팡이 등의 손잡이와 대(shaft : stick)의 일부분은 여러 가지 재료로 만들 수 있으며, 귀금속이나 귀금속을 입힌 금속ㆍ귀석ㆍ반귀석(천연ㆍ합성ㆍ재생의 것)을 결합할 수도 있다. 이러한 물품은 또한 전부나 일부를 가죽이나 그 밖의 재료로 피복할 수도 있다.\n\n(B) 채찍ㆍ승마용 채찍과 이와 유사한 물품\n\n이 그룹에는 다음의 것을 포함한다.\n\n(1) 보통 채찍자루와 채찍끈이 결합하여 이루어진 여러 가지의 채찍\n\n(2) 보통 채찍끈 대신에 짧은 가죽고리를 가진 자루로 된 승마용의 채찍\n\n*\n* *\n\n이러한 물품들은 모두 늘어뜨린 끈이나 그 밖의 부속물(재료가 어떤 것인지에는 상관없다)을 부착한 경우가 있다.\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 자겸용 지팡이(measure walking-stick)ㆍ게이징 스틱(gauging stick)과 이와 유사한 것(제9017호)\n\n(b) 크럿치(crutch)와 크럿치 스틱(crutch stick)(제9021호)\n\n(c) 장총․장검․장진한[장약(裝藥)한] 호신용 지팡이와 이와 유사한 것(제93류)\n\n(d) 제95류의 물품[예: 골프채ㆍ하키스틱ㆍ스키스틱ㆍ알파인 아이스액스(ice-ax)]",
  "contentEn": "With the exceptions mentioned at the end of this Explanatory Note, this heading covers walking-sticks, canes, whips (including whip-leads) and the like, regardless of the materials of which they are made.\n\n(A) Walking-sticks, seat-sticks and the like.\nIn addition to ordinary walking-sticks, this group includes seat-sticks (which have handles which open out to form a seat), walking-sticks specially designed for the disabled and elderly, boy scouts' poles, shepherds' crooks, etc.\n\nThis group also includes unfinished canes or wooden sticks which have been bent, curved or otherwise worked; but it excludes canes or wood suitable for walking-sticks which have only been roughly trimmed or rounded (heading 14.01 or Chapter 44). It also excludes blanks clearly identifiable as unfinished handles (heading 66.03).\n\nThe handles and shafts (sticks) of these articles may be made of various materials, and may incorporate precious metal or rolled precious metal, precious or semi-precious stones (natural, synthetic or reconstructed). They may also be covered wholly or partly with leather or other materials.\n\n(B) Whips, riding-crops and the like.\nThis group includes :\n(1) Whips of all kinds, usually consisting of a stock and a lash.\n(2) Riding-crops, which usually consist of a stock with a short leather loop instead of a lash.\n\nAll these articles may be fitted with loops or other accessories of any material.\n\nThe heading excludes :\n(a) Measure walking-sticks, gauging sticks and the like (heading 90.17).\n(b) Crutches and crutch-sticks (heading 90.21).\n(c) Firearm-sticks, sword-sticks, loaded walking-sticks and the like (Chapter 93).\n(d) Goods of Chapter 95 (for example, golf clubs, hockey sticks, ski sticks, alpine ice-axes)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 66.02 to chapter_66.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
