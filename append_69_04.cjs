const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6904",
  "titleKo": "69.04 - 도자제의 건축용 벽돌ㆍ바닥깔개용 블록ㆍ서포트타일(support tile)ㆍ필러타일(filler tile)과 이와 유사한 것",
  "titleEn": "69.04 - Ceramic building bricks, flooring blocks, support or filler tiles and the like.",
  "contentKo": "제2절 그 밖의 도자제품 (제6904호 - 제6914호) 총설\n\n이 절에는 제1절의 규조토나 이와 유사한 규산질의 흙의 제품과 내화제품 이외의 도자제품을 분류한다.\n\n이 표의 목적상 이러한 물품들은 종류(벽돌, 타일, 위생용품 등)에 따라 분류하며 제조에 사용한 도자재료의 성질은 분류에 영향을 미치지 않는다. 다만, 식탁용품ㆍ주방용품ㆍ그 밖의 가정용품과 화장용품은 제외하며, 자기제인 경우에는 제6911호에 분류하고, 그 밖의 종류의 도자제인 경우에는 제6912호에 분류한다.\n\n(Ⅰ) 자기(porcelain or china)\n자기(porcelain or china)는 경질 자기ㆍ연질 자기ㆍ무유(無釉 : biscuit) 자기(parian를 포함한다)ㆍ골회 자기(bone china)를 포함한다. 이러한 모든 도자기는 거의 완전히 유리화되었고, 단단하며, 실질적으로 불침투성(유약처리하지 않더라도)을 가지고 있다. 그들은 백색ㆍ인공 착색하였으며, 반투명성(상당한 두께의 경우에는 제외한다)과 공명성(共鳴性)이 있다.\n\n(Ⅱ) 그 밖의 도자제품\n자기나 도자기 이외의 것에 해당하는 도자제품으로 다음의 것을 포함한다.\n(A) 다공질(多孔質 : porous)의 밑바탕(body)으로 만든 도자제류는 자기와는 달리 불투명하고, 침수성이 있으며, 철에 의해 쉽게 흠이 나고 파쇄면은 혀(舌 : tongue)에 흡착되는 성질을 가지고 있다. 이러한 도자제류는 보통의 점토로 만든 자기(1)와 earthenware, majolica, delft-ware와 같은 백색/유색 도자제품(2)을 포함한다.\n(B) 석기(stoneware) : 이 물품은 조직이 치밀하고 철침에 의하여도 흠이 나지 않을 정도로 단단하지만 불투명하고 보통은 일부만이 유리화되었으므로 자기와는 다르다.\n(C) 특정의 “반자기(semi-porcelain)”나 “모조자기(imitation porcelain)” : 이 물품은 반자기나 모조자기로 불리워지는 특정의 것으로서 외관이 상업적 자기가 되도록 조제, 장식, 유약처리 된 것이다. 이 물질은 파쇄면의 조직이 거칠고 투박하며 비유리질화되었으므로 자기와 쉽게 구별할 수 있다. 이러한 모조자기 제품은 자기로 간주하지 않는다.\n\n---\n\n69.04 해설\n이 호에는 일반적으로 벽ㆍ가옥ㆍ공업용 굴뚝 등의 건설에 사용하는 여러 가지의 비내화 도자제(즉, 섭씨 1,500°C 이상의 고온을 견디지 못하는 벽돌) 벽돌을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 보통 직사각형의 단단한 벽돌(표면이 평평하거나 톱니 모양으로 되어 있다)\n(2) 공업용 연돌에 사용하는 곡면 벽돌(때로는 구멍을 낸 것도 있다)\n(3) 중공벽돌(hollow brick)ㆍ유공(有孔)벽돌(perforated brick) ; 특히 상(床)ㆍ천장 등에서 건설용의 철강제품과 조합하기 위하여 사용하는 긴 중공인 마루용 블록(block)ㆍ건설용 슬래브(slab)ㆍ지지용 타일ㆍ충전용 타일\n(4) 외장용 벽돌(facing brick)(예: 가옥이나 벽의 외장용ㆍ문이나 창 주위의 외장용에 사용하는 것ㆍ기둥머리ㆍ가장자리ㆍ띠 모양의 장식벽ㆍ그 밖의 건축용으로 사용하는 특수 벽돌도 포함한다)\n\n이 호에는 다음의 것을 제외한다.\n(a) 규조토(珪藻土 : kieselguhr) 등으로 만든 벽돌(제6901호)과 내화성 벽돌(제6902호)\n(b) 판석(flag)과 포장용ㆍ노용ㆍ벽용 타일(제6907호 해설 참조)",
  "contentEn": "SUB-CHAPTER II - OTHER CERAMIC PRODUCTS (headings 69.04 to 69.14)\nGENERAL\nThis sub-Chapter covers ceramic products other than those of sub-Chapter I.\n\nFor the purposes of the Nomenclature, these products are classified according to their category (bricks, tiles, sanitary ware, etc.) and not according to the nature of the ceramic material used, except for tableware, kitchenware and other household or toilet articles which are classified in heading 69.11 if of porcelain or china, and in heading 69.12 if of other ceramic materials.\n\n(I) Porcelain or china (including hard, soft, biscuit and bone china).\n(II) Other ceramic products, including :\n(A) Porous ceramic products (common pottery, earthenware, majolica, delft-ware, etc.).\n(B) Stoneware.\n(C) Semi-porcelain or imitation porcelain.\n\n---\n\n69.04 Explanatory Note\nThis heading covers non-refractory ceramic bricks (i.e. bricks which cannot withstand temperatures of 1,500 °C or above) commonly used for building walls, houses, industrial chimneys, etc.\n\nThe heading includes :\n(1) Ordinary solid bricks, usually rectangular.\n(2) Curved bricks for industrial chimneys.\n(3) Hollow bricks and perforated bricks; flooring blocks, support or filler tiles.\n(4) Facing bricks used for the exterior cladding of buildings.\n\nThe heading excludes :\n(a) Bricks of siliceous fossil meals (heading 69.01) and refractory bricks (heading 69.02).\n(b) Flags, paving, hearth or wall tiles (heading 69.07)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Sub-Chapter II General and 69.04 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
