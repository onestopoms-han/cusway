const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_66.json';

const newEntry = {
  "hsCode": "6601",
  "titleKo": "66.01 - 산류(傘類)[지팡이 겸용 우산ㆍ정원용 산류(傘類)와 이와 유사한 산류(傘類)를 포함한다]",
  "titleEn": "66.01 - Umbrellas and sun umbrellas (including walking-stick umbrellas, garden umbrellas and similar umbrellas).",
  "contentKo": "이 호에는 완구류나 축제용 물품으로 사용하도록 명백히 제작한 종류의 산류(傘類)(제95류)를 제외한 모든 종류의 산류(傘類)를 분류하며[예: “의식용”산류(傘類)ㆍ우산형 텐트ㆍ지팡이 겸용우산ㆍ시트 겸용우산ㆍ카페용ㆍ시장용ㆍ정원용ㆍ이와 유사한 산류(傘類)], 각각의 구성부품(부착한 부속품과 장식품을 포함한다)을 만드는 재료가 어떤 것인지에는 상관없다. 그러므로 커버는 어떠한 방직용 섬유의 직물ㆍ플라스틱ㆍ종이 등으로 만들 수 있으며 자수한 것ㆍ레이스로 장식한 것ㆍ술(fringe)ㆍ그 밖의 방법에 의하여 장식한 것도 있다.\n\n지팡이 겸용 우산(walking-stick umbrella)은 지팡이 모양을 나타내는 빳빳한 커버를 가지는 산류(傘類)이다.\n\n우산형 텐트(umbrella tent)는 땅에 고정시킬 수 있는 “커튼 서라운드(curtain surround)”를 가지고 있는 커다란 산(傘)으로 되어 있다[예: 이것은 말뚝(peg)을 가지고 벨텐트(bell tent) 모양으로 고정시키거나 모래주머니를 “서라운드(surround)” 내측에 걸어놓아 고정시킨다].\n\n산류(傘類)의 대(umbrella shaft : umbrella stick)는 보통 목재ㆍ케인(cane)ㆍ플라스틱ㆍ금속으로 만든다. 손잡이도 역시 대와 똑같은 재료로 만들며 전체나 일부분이 귀금속이나 귀금속을 입힌 금속ㆍ아이보리ㆍ뿔ㆍ뼈ㆍ호박ㆍ귀갑ㆍ자개 등으로 만들 수도 있으며, 그리고 귀석이나 반귀석(천연ㆍ합성ㆍ재생의 것) 등이 결합할 수 있다. 손잡이는 또한 가죽이나 그 밖의 재료로서 입혀지거나 술(tassel)이나 늘어뜨린 끈으로 장식하는 수도 있다.\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 산류(傘類)용 케이스나 이와 유사한 물품[산류(傘類)에 부착되지 않은 상태로 산류(傘類)와 함께 제시하는지에 상관없으며 이것은 각각 해당되는 호에 분류한다]\n\n(b) 산류(傘類)나 우산형 텐트의 특성을 갖지 않은 비치 텐트(beach tent)(제6306호)\n\n◦\n◦ ◦\n[소호해설]\n소호 제6601.10호\n휴대용이 아닌 부착용(예: 지면ㆍ탁자ㆍ스탠드에)으로 제작한 산류(傘類)는 “정원용 산류(傘類)나 이와 유사한 산류(傘類)(garden or similar umbrella)”로 간주한다. 그러므로 이 소호에는 야외 의자용ㆍ화가용ㆍ정원탁자용ㆍ검사자탁자용 등의 산류(傘類)와 우산형 텐트를 포함한다.",
  "contentEn": "This heading covers all types of umbrellas and sun umbrellas (for example, ceremonial umbrellas, umbrella tents, walking-stick umbrellas, seat-stick umbrellas, and cafe, market, garden and similar umbrellas), except those clearly designed as toys or carnival articles (Chapter 95). They are classified here regardless of the materials of which their constituent parts (including fittings and trimmings) are made. Thus, covers can be of any textile fabric, plastics, paper, etc., and may be embroidered, trimmed with lace, fringed or otherwise decorated.\n\nWalking-stick umbrellas have a rigid sheath which gives them the appearance of a walking-stick.\n\nUmbrella tents consist of a large umbrella equipped with a curtain surround which can be fixed to the ground (e.g., secured by pegs like a bell tent or by sand bags suspended inside the surround).\n\nUmbrella shafts (sticks) are usually of wood, cane, plastics or metal. Handles may be of the same materials as the shafts, or they may be made wholly or partly of precious metal or rolled precious metal, ivory, horn, bone, amber, tortoiseshell, mother-of-pearl, etc., and may incorporate precious or semi-precious stones (natural, synthetic or reconstructed). They may also be covered with leather or other materials, or decorated with tassels or loops.\n\nThe heading excludes :\n(a) Umbrella cases, whether or not presented with, but not fitted to, the umbrellas; these are classified in their own appropriate headings.\n(b) Beach tents not having the character of umbrellas or umbrella tents (heading 63.06).\n\nSubheading Explanatory Note.\nSubheading 6601.10\nUmbrellas designed to be fixed (e.g., in the ground, to a table or to a stand) rather than carried are regarded as \"garden or similar umbrellas\". This subheading therefore includes umbrellas for deck chairs, artists, garden tables, surveyors' tables, etc., and also umbrella tents."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 66.01 to chapter_66.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
