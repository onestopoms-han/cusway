const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6814",
  "titleKo": "68.14 - 운모(가공한 것으로 한정한다)와 운모의 제품(응결시키거나 재생한 운모를 포함하며 종이ㆍ판지나 그 밖의 재료로 된 지지물에 부착한 것인지에 상관없다)",
  "titleEn": "68.14 - Worked mica and articles of mica, including agglomerated or reconstituted mica, whether or not on a support of paper, paperboard or other materials.",
  "contentKo": "이 호에는 단순히 쪼갠(rifted) 것과 다듬은(trimmed) 것보다 더 이상의 가공을 한 천연운모(예: 특정 모양으로 절단한 것)ㆍ응결(접착) 운모ㆍ펄프 모양(재생) 운모로서 이루어진 물품과 이들 재료로 제조한 운모제품을 분류한다.\n\n채광상태인 운모의 괴(mica book)를 단순히 쪼개거나 다듬어서 만든 얇은 시트(sheet)와 스플리팅(splitting)은 제2525호에 분류한다.\n\n이 호에는 위의 시트와 스프리팅을 절단하여 만든 제품도 분류한다. 이것은 다이펀치로 만들기 때문에 모서리를 정확하게 절단한다.\n\n천연운모(natural mica)는 그대로 시트 모양이나 스플리팅 모양으로 사용하는 경우도 있다. 그러나 천연운모는 결정이 작고, 신축성이 적고 값이 비싸기 때문에 많은 용도로는 부적당하다. 따라서 이것 대신에 천연운모의 스플리팅을 셀락ㆍ천연수지ㆍ플라스틱ㆍ아스팔트 등을 사용하여 적층하거나 평행하게 접착하여 만든 응결(제조)운모[예: 마이커나이트(micanite)ㆍ마이커폴리움(micafolium)]를 사용하는 경우가 많다. 응결운모(agglomerated mica)는 시트(sheet)ㆍ플레이트(plate)ㆍ스트립(strip)의 모양으로 만들며 면적이 대단히 큰 경우도 있으며 ; 시트(sheet) 등은 일반적으로 한 면이나 (보통은) 양면에 방직용 섬유의 직물ㆍ유리섬유직물ㆍ종이ㆍ석면으로 보강되어 있다.\n\n운모의 얇은 시트(sheet)는 알갱이 모양ㆍ펄프 모양의 운모층을 열처리ㆍ화학적 처리ㆍ제지공업에서의 방법과 유사한 기계적인 방법에 의하여 결합제를 사용하지 않고 제조하는 경우도 있다(재생운모).\n\n이러한 얇은 시트(sheet)는 신축성 있는 결합재료를 사용하여 종이나 방직용 섬유 위에 접착시키거나 ; 여러 장의 얇은 시트(sheet)를 유기결합제에 의하여 적층하고 접착시켜서 일정한 두께의 플레이트(plate)나 스트립(strip)으로 만드는데 사용한다.\n\n이 호에는 일정한 길이의 시트ㆍ스트립이나 롤 모양의 것 ; 특정한 용도에 사용하기 위하여 직사각형(정사각형을 포함한다)ㆍ디스크(disc) 등의 특정 모양으로 절단한 것 ; 튜브ㆍ도관 등과 같은 성형물품을 분류한다. 이들 모든 제품은 전체를 착색하고, 페인트칠하고, 드릴가공ㆍ절삭 가공(milled)이나 그 밖의 가공을 한 경우도 있다.\n\n운모는 단열성이 높고 비교적 반투명성이 있기 때문에 특히 오븐ㆍ스토브(stove)ㆍ용광로 등의 창(window) 제조용이나 깨지지 않는 램프의 “글라스(glass)”와 보호용 안경 등의 “글라스(glass)”제조에 사용한다. 그러나 운모는 그것의 우수한 절연성으로 인해 전기공업에 주로 사용한다(전동기ㆍ발전기ㆍ변압기ㆍ축전기ㆍ저항기 등의 제조). 그러나 전기기구용의 운모로 만든 절연체나 그 밖의 운모로 만든 절연부분품은 장착하지 않는 것이라 할지라도 제8546호부터 제8548호까지에 분류하며 운모로 만든 비전도성 콘덴서(축전기)는 제8532호에 분류한다는 것을 유의하여야 한다.\n\n이 호에는 추가로 다음의 것을 제외한다.\n\n(a) 가루 모양의 운모와 웨이스트(waste)(제2525호)\n\n(b) 운모가루를 도포(塗布)시킨 종이나 판지(제4810호나 제4814호)ㆍ운모가루를 도포(塗布)한 직물(제5907호). 이러한 물품은 위에서 설명한 응결 운모나 재생운모와 혼동해서는 안 된다.\n\n(c) 팽창된 질석(蛭石)(제6806호)(관련 해설 참조)\n\n(d) 운모로 만든 보호용 안경과 이들의 접안렌즈(제9004호)\n\n(e) 크리스마스트리 장식 모양인 운모(제9505호)",
  "contentEn": "This heading covers worked natural mica (e.g., sheets cut to specific shapes), agglomerated (bonded) mica (e.g., micanite, micafolium), and reconstituted (pulp) mica, as well as articles made of these materials.\n\nNatural mica in books simply split or trimmed falls in heading 25.25, but sheets and splittings cut to shape by die-punching (having precisely cut edges) are classified here.\n\nAgglomerated (bonded) mica is made by laminating or bonding superimposed sheets of mica splittings with binders such as shellac, natural resins, plastics or asphalt. It is produced in sheets, plates or strips, which may be reinforced on one or both sides with textile fabric, glass fibre fabric, paper or asbestos.\n\nReconstituted (pulp) mica sheets are made by heat-treating and chemically treating granulated or pulp mica and forming it into sheets without binders by mechanical processes similar to papermaking. These sheets can be bonded onto paper or textile support, or laminated using organic binders into thicker plates or strips.\n\nThe heading includes sheets, strips or rolls in lengths; rectangular, disc or other shape-cut pieces; and tubes, conduits or other moulded articles.\n\nBecause of its heat-insulating and transparency properties, mica is used for windows in ovens, stoves or furnaces, and for \"glasses\" in non-breakable lamps or protective goggles. However, it is mainly used in the electrical industry for motors, generators, transformers, capacitors, resistors, etc. Note that electrical insulators and insulating parts of mica are classified in headings 85.46 to 85.48, and non-conductive capacitors in heading 85.32.\n\nThe heading excludes :\n(a) Mica powder and waste (heading 25.25).\n(b) Paper, paperboard or fabric coated with mica powder (heading 48.10, 48.14 or 59.07).\n(c) Exfoliated vermiculite (heading 68.06).\n(d) Goggles and lenses of mica (heading 90.04).\n(e) Christmas tree ornaments of mica (heading 95.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.14 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
