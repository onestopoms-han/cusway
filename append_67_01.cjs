const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_67.json';

const newEntry = {
  "hsCode": "6701",
  "titleKo": "67.01 - 새의 깃털이나 솜털이 붙은 가죽과 그 밖의 부분ㆍ깃털과 그 부분ㆍ솜털과 이들의 제품[제0505호의 물품과 가공한 깃대(scape)ㆍ깃촉(quill)은 제외한다]",
  "titleEn": "67.01 - Skins and other parts of birds with their feathers or down, feathers, parts of feathers, down and articles thereof (other than goods of heading 05.05 and worked quills and scapes).",
  "contentKo": "다른 호에 좀 더 특별히 열거하였거나 포함한 물품과 이 호의 제외규정에 열거한 물품을 제외하고 이 호에는 다음의 것을 분류한다.\n\n(A) 새의 깃털이나 솜털이 붙은 가죽과 그 밖의 부분ㆍ새의 깃털과 솜털ㆍ새의 깃털의 부분품으로서 제품으로 되어있지 않을지라도 청정ㆍ소독이나 보전을 하기 위한 단순한 처리 이외의 가공을 한 것(제0505호 해설 참조) ; 이 호의 물품은 예를 들면, 표백ㆍ염색ㆍ컬(curl)ㆍ웨이브 가공을 한 경우도 있다.\n\n(B) 새의 깃털이나 솜털이 붙은 가죽과 그 밖의 부분으로 만든 제품, 새의 깃털과 솜털ㆍ새의 깃털의 부분으로 만든 제품(새의 깃털이나 솜털 등을 가공하지 않았거나 단지 세척만 한 것인지에는 상관없다)ㆍ깃대(scape)ㆍ깃촉(quill)으로 만든 물품은 제외하며, 다음의 것을 포함한다.\n\n(1) 외겹 새의 깃털[예를 들면, 이것의 깃대(scape)는 여자모자의 마운트(mount)용으로 사용하도록 철사로 잡아 맺거나 묶어져 있다]과 단일의 것으로 혼합된 새의 깃털(서로 다른 깃대(scape)를 결합한 것)\n\n(2) 다발 모양으로 결합된 새의 깃털과 방직용 섬유의 직물이나 다른 기본재료에 글루로 접착하거나 고정하여 조합하여 만든 새의 깃털이나 솜털\n\n(3) 모자ㆍ새털목도리ㆍ깃(collar)ㆍ케이프(cape)ㆍ그 밖의 의류용 물품ㆍ의복의 악세사리용으로 새의 부분, 새의 깃털이나 솜털로 만든 장식품\n\n(4) 장식용의 새의 깃털로 만든 부채[프레임(frame)의 재료가 어떠한 것인지에는 상관없다]. 그러나 프레임(frame)을 귀금속으로 만든 부채는 제7113호에 분류한다.\n\n그러나 이 호에는 새의 깃털이나 솜털이 의류ㆍ의류부속품에 단순히 장식이나 충전물로서 사용하여 있는 경우에는 제외한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n\n(a) 새의 깃털이나 솜털로 만든 신발(제64류)\n\n(b) 새의 깃털이나 솜털로 만든 모자(제65류)\n\n(c) 제6702호의 물품\n\n(d) 새의 깃털이나 솜털을 단지 충전물로만 사용한 침구 등의 물품(제9404호)\n\n(e) 제95류의 물품[예: 셔틀콕(shuttlecock)ㆍ새의 깃털로 만든 다트(dart)나 낚시의 찌(angling float)]\n\n(f) 가공된 깃촉(quill)과 깃대(scape)[예: 이쑤시개(제9601호)]ㆍ새의 깃털로 만든 먼지떨이(제9603호)ㆍ솜털로 만든 화장품용의 분첩(powder-puff)과 패드(pad)(제9616호)\n\n(g) 수집품(제9705호)",
  "contentEn": "With the exceptions mentioned in the exclusions at the end of this Explanatory Note, this heading covers :\n\n(A) Skins and other parts of birds with their feathers or down, feathers and down, and parts of feathers, which, though not yet made up into finished articles, have undergone working other than simple treatment for cleaning, disinfection or preservation (see Explanatory Note to heading 05.05); the goods of this heading may be, for example, bleached, dyed, curled or waved.\n\n(B) Articles made of skins or other parts of birds with their feathers or down, of feathers or down, or of parts of feathers (whether or not the feathers, down, etc., are unworked or merely cleaned), other than articles made of quills or scapes. These include :\n(1) Single feathers, the scapes of which are wired or bound for use, e.g., as millinery mounts, and composite feathers (made of different feathers assembled together).\n(2) Feathers assembled in tufts, and feathers or down pasted or fixed on textile fabric or other bases.\n(3) Trimmings made of bird parts, feathers or down, for hats, boas, collars, capes or other articles of apparel or clothing accessories.\n(4) Fans made of ornamental feathers, with frames of any material (except precious metal which fall in heading 71.13).\n\nHowever, feathers or down used merely as trimming or padding on garments or clothing accessories are excluded from this heading.\n\nThe heading also excludes :\n(a) Footwear of feathers or down (Chapter 64).\n(b) Headgear of feathers or down (Chapter 65).\n(c) Goods of heading 67.02.\n(d) Bedding, etc., in which feathers or down constitute only filling or padding (heading 94.04).\n(e) Goods of Chapter 95 (e.g., shuttlecocks, feather darts or angling floats).\n(f) Worked quills and scapes (e.g., toothpicks (heading 96.01)), feather dusters (heading 96.03), powder-puffs and pads of down (heading 96.16).\n(g) Collectors' pieces (heading 97.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 67.01 to chapter_67.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
