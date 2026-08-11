const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_67.json';

const newEntry = {
  "hsCode": "6703",
  "titleKo": "67.03 - 사람 머리카락(정돈ㆍ표백이나 그 밖의 가공을 한 것으로 한정한다), 가발이나 이와 유사한 것을 제조하기 위한 양모나 그 밖의 동물의 털이나 그 밖의 방직용 섬유재료",
  "titleEn": "67.03 - Human hair, dressed, thinned, bleached or otherwise worked; wool or other animal hair or other textile materials, prepared for use in making wigs or the like.",
  "contentKo": "이 호에는 단순히 세척ㆍ세정ㆍ길이에 따라 선별한 사람 머리카락[그러나 근단(root end)과 선단(tip end)을 각각 가지런하게 정돈하지 않은 것]과 사람 머리카락의 웨이스트(waste)(제0501호)를 제외하고 포스티쉬(postiche)[예: 위그(wig)ㆍ컬(curl)ㆍ스위치(switch)의 제조용]나 그 밖의 이와 유사한 용도에 사용하기 위하여 정돈이나 그 밖의 가공[예: 솎음ㆍ표백ㆍ염색ㆍ웨이브(wave)ㆍ컬(curl)]을 한 사람 머리카락을 분류한다.\n\n“정돈한 것(dressed)”은 모발의 분리한 필라멘트를 근단(root end)과 선단(tip end)이 가지런하도록 정돈한 모발을 포함한다.\n\n이 호에는 또한 양모나 그 밖의 동물의 털[예: 야크(yak)ㆍ앙고라ㆍ티베트 염소의 모]과 그 밖의 방직용 섬유재료(예: 인조섬유)로서 가발과 이와 유사한 것이나 인형모의 제작용으로 제조한 것을 포함한다. 앞에서 설명한 목적으로 제조한 물품에는 특히 다음의 것을 포함한다.\n\n(1) 슬리버(sliver)로 된 물품(보통 양모나 그 밖의 동물의 부드러운 털로 만든 것으로 평행한 두 줄의 섬유를 서로 꼬아서 만들었고 땋은 끈의 모양을 가진다) : 이러한 물품[“크레이프(crape)”라 알려져 있다]은 보통 길이가 길고 약 1kg이다.\n\n(2) 방직용 섬유의 슬리버(sliver)를 물결 모양(waved)[곱슬곱슬(curled)하게 한 것]으로 하여 조그마한 다발로 만든 것(길이 14m～15m, 무게 약 500g)\n\n(3) 전체적으로 염색한 인조섬유로 된 “위사(緯絲)”[함께 묶어 술(tuft) 형태가 되도록 두 개로 접고, 그 접은 끝을 약 2㎜의 폭으로 섬유실을 사용하여 기계로 엮어 만든 것] : 이러한 “위사(緯絲)”는 길이로 된 술(fringe) 모양을 가진다.\n\n양모나 그 밖의 동물의 털ㆍ그 밖의 방직용 섬유(뭉치로 접속된 모양인 것ㆍ토우(tow) 모양인 것ㆍ방적준비 처리한 것)는 제11부에 분류한다.",
  "contentEn": "This heading covers human hair which has been dressed or otherwise worked (e.g., thinned, bleached, dyed, waved or curled) for use in the manufacture of postiche (e.g., wigs, curls, switches) or for other similar purposes, but excludes human hair which has been simply washed, scoured or sorted by length (but not dressed so that the root ends and tip ends are aligned) and waste of human hair (heading 05.01).\n\n\"Dressed\" hair includes hair where the individual filaments have been arranged so that the root ends and tip ends are aligned.\n\nThe heading also covers wool or other animal hair (e.g., hair of the yak, Angora or Tibetan goat) and other textile materials (e.g., man-made fibres) prepared for use in making wigs and the like, or for doll's hair. Articles prepared for these purposes include, in particular :\n(1) Slivers of wool or other animal hair, consisting of two parallel lines of fibres twisted together to form a plaited band. These articles, known as \"crape\", are usually in long lengths and weigh about 1 kg.\n(2) Slivers of textile fibres, waved (curled), put up in small bundles (about 14 to 15 m in length, weighing about 500 g).\n(3) \"Weft\" of dyed man-made fibres, consisting of fibres folded in two to form a tuft, with the folded ends sewn by machine over a width of about 2 mm. These wefts have the appearance of a fringed strip.\n\nWool, other animal hair or other textile materials in the mass, as tow or prepared for spinning, are classified in Section XI."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 67.03 to chapter_67.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
