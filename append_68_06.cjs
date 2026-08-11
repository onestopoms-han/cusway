const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6806",
  "titleKo": "68.06 - 슬래그 울(slag wool)ㆍ암면(rock wool)과 이와 유사한 광물성 울, 박리한 질석(蛭石)ㆍ팽창점토ㆍ다포슬래그(slag)와 이와 유사하게 팽창하는 광물성 재료, 단열용ㆍ방음용ㆍ흡음용 광물성 재료의 혼합물과 그 제품(제6811호ㆍ제6812호나 제69류의 것은 제외한다)",
  "titleEn": "68.06 - Slag wool, rock wool and similar mineral wools; exfoliated vermiculite, expanded clays, foamed slag and similar expanded mineral materials; mixtures and articles of heat-insulating, sound-insulating or sound-absorbing mineral materials, other than those of heading 68.11 or 68.12 or of Chapter 69.",
  "contentKo": "슬래그 울(slag wool)과 암면(rock wool)(예: 화강암ㆍ현무암ㆍ석탄석ㆍ백운석의 것) : 이들 구성성분 한 종 이상을 용융(鎔融 : fused)하여 얻은 액체 상태의 물질을 보통 원심 분리시켜 유출시키거나 공기 분사시켜 섬유상으로 만든 것이다.\n\n이 호에는 또한 “세라믹 섬유”로 알려진 “규산알루미늄류”를 포함한다. 이들 물품은 여러 가지 비율로 알루미나와 실리카를 용융(鎔融)하여(때로는 산화지르콘ㆍ산화제2크로뮴ㆍ산화붕소와 같은 산화물을 소량 첨가하기도 한다) 이 용융(鎔融)물을 취입법(吹入法 : blowing)이나 압출법(壓出法 : extruding)으로 집속된 섬유의 덩어리가 되도록 한 것이다.\n\n이 호의 광물성 울은 제7019호의 글라스 울(glass wool)과 유사한 부드러운 털 모양이나 섬유 모양의 외관을 갖고 있다. 글라스 울과는 화학적 조성(제70류의 주 제4호 참조)이 다르고 일반적으로 글라스 울보다 섬유가 짧고 색이 희지 않은 점에서 다르다.\n\n팽창ㆍ박리한 질석(蛭石)(expanded or exfoliated vermiculite) : 질석(蛭石)(제2530호)을 고온 처리하여 팽창시켜 만들며, 때로는 원형의 35배까지 팽창되는 경우도 있다.\n\n이 호에는 또한 열처리에 의하여 얻는 유사한 진주암(perlite)ㆍ녹니석(綠泥石 : chlorite)ㆍ흑요석(obsidian) 등의 팽창된 모양의 것을 포함한다. 이러한 물품은 일반적으로 매우 가벼운 공 모양의 알갱상태로 되어 있다. 열처리하여 활성화된 진주암은 백색의 빛나는 미소립의 층상형으로 되어 있으며 이것은 제3802호에 분류한다.\n\n팽창점토(expanded clay) : 특별히 선별된 점토를 하소하거나 다른 물질(예: 아황산폐액)이 혼합된 점토를 하소(煆燒)함으로써 만들어진다. 다포 슬래그(foamed slag)는 용융(鎔融 : fused)된 슬래그(slag)에 소량의 물을 가해서 제조하는데, 고밀도인 알갱이 모양 슬래그와 혼동하여서는 안되는데 ; 고밀도의 알갱이 모양 슬래그는 물에 용융(鎔融)된 슬래그를 부어서 제조하며 이것은 제2618호에 분류한다.\n\n위의 모든 재료들은 불연성(不燃性)이고 우수한 단열용ㆍ방음용ㆍ흡음용 물품이다. 이 호에는 벌크 상태의 물품도 포함한다.\n\n*\n* *\n\n이 호에는 석면의 함유량에 관한 허용한도를 조건으로 하여(아래 참조), 벌크 모양의 단열용ㆍ방음용ㆍ흡음용의 광물성 혼합물을 분류하는데, 예를 들면, 주로 키절구어(kieselguhr)ㆍ규조토ㆍ탄산마그네슘 등으로 이루어진 혼합물이 있으며, 간혹 플라스터(plaster)ㆍ슬래그(slag)ㆍ가루 모양의 코르크(cork)ㆍ톱밥ㆍ대팻밥ㆍ방직용 섬유 등을 첨가하는 경우도 있다. 위에서 설명한 광물성의 울(mineral wool)은 혼합물의 일부를 형성하는 것도 있고, 이러한 혼합물은 덩어리 모양으로 천장ㆍ지붕ㆍ벽 등의 절연용 패킹(packing) 재료로서 사용한다.\n\n이 호에는 보통 앞에서 설명한 물품이나 혼합물로서 제조한 저밀도의 제품을 포함한다[예: 블록(block)ㆍ시트(sheet)ㆍ벽돌ㆍ타일ㆍ관ㆍ원통형 셀ㆍ끈(cord)ㆍ패드 등]. 이러한 제품은 전체적으로 인공 착색ㆍ방화 물질의 침투ㆍ종이로 표면을 입힌 것이나 금속으로 보강되어 있는 것도 있다.\n\n이 호에 분류하는 혼합물과 제품은 특히 그 사용을 용이하게 하기 위하여 아주 소량의 석면섬유(asbestos fibre)를 함유하고 있는 경우도 있다. 첨가된 석면의 비율은 일반적으로 전 중량의 5% 이하이다. 이 호에는 석면 시멘트의 제품(제6811호)과 석면을 기본 재료로 한 혼합물이나 석면과 탄산마그네슘의 혼합물과 이들의 제품(제6812호)은 제외한다.\n\n이 호에는 또한 규조토(珪藻土 : kieselguhr)나 그 밖의 규산질 흙으로 만든 물품으로서 블록(block) 모양이나 그 밖의 모양으로 절단된 것도 분류한다.\n\n경량(輕量) 콘크리트 제품[박리한 질석(蛭石)(exfoliated vermiculite)ㆍ팽창점토나 이와 유사한 것의 응결물로 만든 콘크리트를 포함한다]은 이 호에서 제외한다(제6810호).\n\n불에 구워 만든 제품은 제69류에 분류한다.",
  "contentEn": "This heading covers :\n(1) Slag wool and rock wool (e.g., from granite, basalt, limestone or dolomite), obtained by melting these mineral constituents and blowing or centrifuging the molten mass into fibres. It also includes aluminosilicates (\"ceramic fibres\") obtained by melting alumina and silica in varying proportions.\n(2) Exfoliated vermiculite, obtained by heat-treating vermiculite (heading 25.30). It also includes expanded perlite, chlorite, obsidian, etc.\n(3) Expanded clays, obtained by calcining specially selected clays or mixtures of clay and other substances.\n(4) Foamed slag, obtained by treating molten slag with small quantities of water.\n\nAll these materials are non-combustible and excellent heat-insulating, sound-insulating or sound-absorbing agents. The heading also covers mineral mixtures in bulk (such as mixtures of kieselguhr, magnesia, etc.) and articles thereof (blocks, sheets, bricks, tiles, pipes, cylinders, cords, pads, etc.).\n\nThe heading excludes :\n(a) Prefabricated products of asbestos-cement (heading 68.11) and mixtures based on asbestos or asbestos and magnesium carbonate, and articles thereof (heading 68.12).\n(b) Articles of light concrete (including concrete made with exfoliated vermiculite, expanded clay, etc.) (heading 68.10).\n(c) Ceramic products obtained by firing (Chapter 69)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.06 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
