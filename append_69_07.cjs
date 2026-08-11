const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6907",
  "titleKo": "69.07 - 도자제의 판석과 포장(鋪裝)용ㆍ노(爐)용ㆍ벽용 타일, 도자제의 모자이크 큐브와 이와 유사한 것(뒷면을 보강한 것인지에 상관없다), 피니싱 세라믹",
  "titleEn": "69.07 - Ceramic flags and paving, hearth or wall tiles; ceramic mosaic cubes and the like, whether or not on a backing; finishing ceramics.",
  "contentKo": "이 호에는 포장(鋪裝)용이나 벽, 노(爐) 등에 일반적으로 사용하는 도자제의 판석과 타일[쿼리타일(quarry tile) 포함]을 포함한다.\n\n판석(flag)과 포장용 타일(paving tile)ㆍ노(爐)용 타일(hearth tile)과 벽용 타일(wall tile)은 건축용의 벽돌보다 표면적에 비하여 두께가 얇다. 벽돌은 건축물의 중요한 골격을 형성하여 건설공사상 중요한 역할을 하고 있으나 판석과 타일은 성형한 벽 등의 표면 위에 시멘트ㆍ접착제나 그 밖의 방법으로 부착하도록 특별하게 만든 것이다. 이 물품은 일반적으로 평면이며 연결하기 위한 구멍, 돌기(突起)나 그 밖의 모양이 필요 없으며 서로 중복됨 없이 나란히 놓도록 만들어졌다는 점에서 기와와 구별하며 ; 판석(flag)은 타일(tile)보다는 크고, 보통 직사각형으로 되어 있으며 ; 타일은 그 밖의 기하학적인 모양(육각형ㆍ팔각형 등)인 경우도 있다. 타일은 주로 벽ㆍ벽난로ㆍ노(爐)ㆍ마루와 보도의 외장용으로 사용한다. 판석은 특히 도로나 마루의 포장(鋪裝)용ㆍ노(爐)용 슬래브(slab)로서 사용하는 경우가 많다. 두 가지 모두 점토나 그 밖의 무기질 원재료를 보통 실온(室溫)에서 압출하거나 프레싱(pressing)하여 성형하지만, 다른 공정에 의해서 성형할 수도 있으며, 이렇게 성형한 후에는 건조하고 그 다음에는 요구하는 특성을 가지기에 충분한 온도에서 굽는다. 그러나 격심한 마모를 견디어야 할 형태의 것은 유리질화한 경우가 많다. 예를 들면, 석기제, 자기제나 소결된 동석제의 타일[예: 그라인딩밀(grinding mill)의 내장용 타일 등] 등이다.\n\n내마모성(耐磨耗性)과 유리질화율은 타일의 구조에 따라 다양하다. 이러한 구조적 특징은 수분의 흡수력에 의해 구분된다. 높은 수분흡수율은 다공성(多孔性) 구조에 해당한다. 낮은 수분흡수율은 촘촘한(유리질화한) 구조에 해당한다.\n\n수분 흡수의 수준은 ISO 규격 10545-3에 설명된 진공법(vacuum method)에 기초하여 결정한다. 수분흡수율을 계산하는 공식은 아래의 방정식에 따른다 :\nE = {(Mf-Mi) / Mi}× 100 (E: 수분흡수율, Mi: 건조 질량, Mf: 포화 질량)\n\n이 호의 물품의 분류는 그 구성 재료에 의해서가 아니라 그 모양과 크기에 의하여 결정된다 ; 그러므로 건축용과 포장(鋪裝)용 모두에 사용하기에 적합한 벽돌은 이 호에서 제외한다(제6904호).\n\n이 호의 물품에는 전체로 착색한 것ㆍ대리석 무늬를 넣은 것ㆍ골을 판 것(ribbed)ㆍ홈을 판 것(channelled, fluted)ㆍ유약처리한 것 등이 있을 수 있다.\n\n위의 조건에 따라서 이 호에는 다음의 것도 포함한다.\n(1) 피니싱 세라믹[예: 표면작업이나 포장작업 등을 마무리짓기 위한 보조 요소로서 사용하는 경계선 테두름(bordering)용ㆍ캐핑(capping)용ㆍ걸레받이(skirting)용ㆍ프리즈(frieze)용ㆍ모서리 작업(angle)용ㆍ구석작업용이나 그 밖의 깔기용 타일 조각]\n(2) 사용 전 쪼개서 사용하도록 설계된 복합타일\n(3) 테라코타 피복재 : 다양한 크기의 단위조립식 구조로서 건축산업에서 내외장식용으로 사용한다.\n(4) 모자이크 큐브와 이와 유사한 것 : 종이나 다른 것으로 뒷면을 댄 것인지에 상관없으며, 크기가 작다는 특징이 있다.\n\n이 호에는 다음의 물품을 제외한다.\n(a) 테이블매트 등에 적합한 타일(제6911호나 제6912호)\n(b) 제6913호의 장식품과 이와 유사한 물품\n(c) 특별히 스토브(stove)에 적합한 도자제 타일(제6914호)",
  "contentEn": "This heading covers ceramic flags and paving, hearth or wall tiles, including quarry tiles, mosaic cubes and the like, and finishing ceramics.\n\nFlags and tiles are thinner in relation to their surface area than building bricks. They are designed to be fixed (e.g., with cement or adhesives) onto the surface of walls, floors, paths, hearths, etc. They are generally flat, without projections or interlocking joints, which distinguishes them from roofing tiles.\n\nThe durability and degree of vitrification depend on the structure of the tiles, which is classified by water absorption (E) determined by the vacuum method (ISO 10545-3) :\nE = {(Mf-Mi) / Mi} x 100 (%)\n\nThe heading includes :\n(1) Finishing ceramics (e.g., bordering, capping, skirting, corner pieces and other accessories).\n(2) Double tiles designed to be split before use.\n(3) Terracotta cladding panels for interior or exterior architectural use.\n(4) Mosaic cubes and the like, whether or not on a paper or other backing, characterized by their small size.\n\nThe heading excludes :\n(a) Tiles specially adapted for table mats (heading 69.11 or 69.12).\n(b) Ornaments and similar articles of heading 69.13.\n(c) Ceramic tiles specially adapted for stoves (heading 69.14)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.07 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
