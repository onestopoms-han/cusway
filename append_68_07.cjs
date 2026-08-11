const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6807",
  "titleKo": "68.07 - 아스팔트 제품이나 이와 유사한 재료[예: 석유역청이나 콜타르 피치(coal tar pitch)]의 제품",
  "titleEn": "68.07 - Articles of asphalt or of similar material (for example, petroleum bitumen or coal tar pitch).",
  "contentKo": "이 호에는 천연의 아스팔트ㆍ역청물질ㆍ콜타르 피치(coal tar pitch)ㆍ석유역청ㆍ역청질의 혼합물 등의 물질(제2708호ㆍ제2713호ㆍ제2714호ㆍ제2715호 참조)로 만든 제품을 분류한다. 이러한 제품은 일반적으로 모래ㆍ슬래그(slag)ㆍ백묵ㆍ플라스터(plaster)ㆍ시멘트ㆍ활석ㆍ유황(sulphur)ㆍ석면섬유ㆍ목재섬유ㆍ톱밥ㆍ웨이스트 코르크(waste cork)ㆍ천연수지와 같은 충전물을 함유하고 있다.\n\n사용하기 전에 다시 용융(鎔融 : fused)하여 사용하는 블록(block) 모양의 아스팔트ㆍ역청물질ㆍ피치(pitch) 등은 그것이 정제나 탈수나 다른 재료와 혼합했는지에 상관없이 이 호에서 제외하며(제27류) ; 반면에 이 호에 분류하는 물품은 특수한 제품으로서 인정할 수 있는 것이어야 한다.\n\n이 호에는 다음의 것을 포함한다.\n\n(1) 압착ㆍ성형하여 제조하고 지붕용ㆍ외장용ㆍ타일용ㆍ포장용으로 사용하는 판ㆍ벽돌ㆍ타일ㆍ부석 등\n\n(2) 루핑보드(roofing board) : 아스팔트나 이와 유사한 재료의 층으로 기판(substrate)[예: 판지ㆍ유리섬유의 망(web)이나 직물이ㆍ인조섬유나 황마의 직물ㆍ알루미늄박으로 만든 것]을 완전히 둘러싸거나 해당 기판의 양면을 피복한 것\n\n(3) 건축용 보드(building board) : 방직용 섬유의 직물이나 종이의 하나 이상의 층을 아스팔트나 이와 유사한 재료로서 완전히 둘러쌓아서 만든 것\n\n(4) 주조ㆍ성형하여 만든 관(管)과 용기\n\n금속으로 피복ㆍ보강한 아스팔트로 만든 관(管)과 용기는 그 구성요소가 제품에 부여하는 본질적인 특성에 따라 금속제품이나 아스팔트 제품으로 분류한다.\n\n아스팔트나 역청물질 등으로 도포(塗布)한 금속으로 만든 관(管)과 용기[예: 주철이나 강(鋼)]는 금속제품으로 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n\n(a) 타르나 이와 유사한 물질로 단순히 도포(塗布)ㆍ침투ㆍ피복한 종이로서 포장지 등으로 사용하는 것(제4811호)\n\n(b) 도포(塗布)ㆍ침투ㆍ피복(예: 역청물질ㆍ아스팔트)한 방직용 섬유의 직물류(제56류나 제59류)\n\n(c) 아스팔트가 첨가되었으나, 주로 석면시멘트(asbestos-cement)로 만든 제품(제6811호)\n\n(d) 역청물질이나 아스팔트로 단순히 도포(塗布)ㆍ침투된 유리 섬유로 만든 직물이나 웹(web) 등(제7019호)",
  "contentEn": "This heading covers articles made of natural asphalt, bitumen, coal tar pitch, petroleum bitumen or bituminous mixtures (refer to headings 27.08, 27.13, 27.14 and 27.15). These articles usually contain fillers such as sand, slag, chalk, plaster, cement, talc, sulphur, asbestos fibres, wood fibres, sawdust, waste cork or natural resins.\n\nThe heading excludes asphalt, bituminous materials, pitch, etc., in blocks which must be remelted before use, whether or not refined, dehydrated or mixed with other materials (Chapter 27); the articles of this heading must be identifiable as specific articles.\n\nThe heading includes :\n(1) Plates, bricks, tiles, setts, etc., obtained by pressing or moulding, used for roofing, cladding, tiling or paving.\n(2) Roofing boards consisting of a substrate (e.g., of paperboard, glass fibre web or fabric, synthetic or jute fabric, aluminium foil) completely enveloped in or coated on both sides with a layer of asphalt or similar material.\n(3) Building boards made by completely enveloping one or more layers of textile fabric or paper in asphalt or similar material.\n(4) Tubes and containers obtained by casting or moulding.\nTubes and containers of metal coated or impregnated with asphalt or bituminous materials (e.g., cast iron or steel) are classified as metal articles.\n\nThe heading also excludes :\n(a) Paper simply coated, impregnated or covered with tar or similar materials, used as wrapping paper, etc. (heading 48.11).\n(b) Textile fabrics coated, impregnated or covered (e.g., with bituminous materials or asphalt) (Chapter 56 or 59).\n(c) Articles mainly of asbestos-cement, even if containing asphalt (heading 68.11).\n(d) Woven fabrics or webs of glass fibres, simply coated or impregnated with asphalt or bituminous materials (heading 70.19)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.07 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
