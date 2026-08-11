const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6810",
  "titleKo": "68.10 - 시멘트 제품ㆍ콘크리트 제품ㆍ인조석 제품(보강한 것인지에 상관없다)",
  "titleEn": "68.10 - Articles of cement, of concrete or of artificial stone, whether or not reinforced.",
  "contentKo": "이 호에는 시멘트[슬래그(slag)시멘트를 포함한다]ㆍ콘크리트ㆍ인조석을 주형법ㆍ압축법ㆍ원심법(예: 특정한 파이프)에 의하여 제조한 제품을 분류하며, 제6806호ㆍ제6808호(시멘트가 단순히 결합제로만 사용한 것)ㆍ제6811호(석면 시멘트 제품)의 물품은 제외한다.\n\n이 호에는 또한 건축ㆍ토목공사용 조립식 건축자재를 포함한다.\n\n인조석(artificial stone)은 천연석의 모조품으로 천연석(석회석ㆍ대리석ㆍ화강석ㆍ반암ㆍ사문암 등)의 조각ㆍ알갱이ㆍ가루를 석회ㆍ시멘트ㆍ그 밖의 결합제(예: 플라스틱)와 함께 응결시켜 제조된다. 인조석의 제품에는 “테라조(terrazzo)”, “그라니토(granito)” 등의 제품도 포함한다.\n\n이 호에는 또한 슬래그 시멘트(slag cement) 제품도 분류한다.\n\n이 호에는 특히 다음의 것을 포함한다. 블록(block)ㆍ벽돌ㆍ타일 ; 천장ㆍ벽용의 그물ㆍ욋가지(lath)(콘크리트가 많은 비율로 결합한 철사구조물로 구성된 것) ; 판석 ; 빔 ; 마루용의 중공 슬래브(slab)와 그 밖의 건설용품 ; 기둥(pillar)ㆍ주표(post)ㆍ경계석 ; 연석 ; 관(管) ; 계단의 발판 ; 난간 ; 목욕통ㆍ하수구ㆍ화장실변기ㆍ수통ㆍ배트(vat)ㆍ저수통 ; 우물반 ; 묘석 ; 스탠다드ㆍ포올 ; 철도용 받침목 ; 호버트레인용 궤도블록 ; 문ㆍ창의 틀 ; 멘틀피스ㆍ창받이ㆍ문의 발판 ; 프리즈(frieze)ㆍ코니스(cornice) ; 꽃병ㆍ화분ㆍ건축용이나 정원용의 장식품 ; 조상(彫像)ㆍ작은 조각상ㆍ동물상 ; 소형장식품.\n\n이 호에는 모래ㆍ석회ㆍ물을 혼합한 반죽 상태의 혼합물로 제조하는 벽돌ㆍ타일이나 그 밖의 모래석회제품도 분류하며 ; 이러한 물품은 가압성형 후에 수평식 고압솥에서 섭씨 약 140도되는 고압의 증기처리를 수시간 행하여 제조된다. 이러한 물품은 보통의 벽돌ㆍ타일 등과 동일한 목적으로 사용하며, 백색의 것, 인공착색한 것도 포함한다.\n\n여러 가지의 크기의 석영 덩어리를 앞에서 설명한 혼합물에 추가하여 인조석 모양의 제품이 만들어진다. 절연용으로 사용하는 경량(輕量)이고 다공질(多공질)인 모래석회제의 시트(sheet)도 가스가 방출되도록 혼합물에 금속 가루를 첨가함으로써 제조하며 ; 그러나 이러한 시트는 압축성형하는 것이 아니라 고압솥(autoclave)에 삽입하기 전에 주조한다.\n\n*\n* *\n\n이 호에 분류하는 물품은 부쉬(bushed)한 것ㆍ연마한 것ㆍ광택을 낸 것ㆍ바니시(varnish) 칠한 것ㆍ청동색으로 만든 것ㆍ에나멜칠한 것ㆍ모조 슬레이트 모양으로 만든 것ㆍ성형한 것ㆍ그 밖의 장식한 것ㆍ착색한 것(전체적으로)ㆍ금속 등으로 보강한 것(예: 보강ㆍ가압한 콘크리트)이나 다른 재료로 만든 부속품[예: 돌쩌귀(hinge) 등]을 부착한 것도 포함한다.\n\n이 호에는 다음의 것은 포함되지 않는다.\n(a) 콘크리트의 깨진 조각(제2530호)\n(b) 응결 슬레이트(agglomerated slate) 제품(제6803호)\n\n◦\n◦ ◦\n[소호해설]\n소호 제6810.91호\n이 호에는 건축ㆍ토목공사용 조립식 건축자재를 분류한다(예: 외장판ㆍ내벽ㆍ마루ㆍ천장용 섹션ㆍ기초자재ㆍ말뚝ㆍ터널부분ㆍ수문ㆍ댐용자재ㆍ갱도ㆍ돌림띠). 이 자재는 일반적으로 콘크리트로 만들어지며 보통 조립을 용이하게 하기 위한 기구를 갖추고 있다.",
  "contentEn": "This heading covers articles of cement (including slag cement), of concrete or of artificial stone, obtained by moulding, pressing or centrifuging. It excludes articles of heading 68.06, 68.08 or 68.11.\n\nThe heading also includes prefabricated structural components for building or civil engineering.\n\nArtificial stone is an imitation of natural stone obtained by agglomerating fragments, chippings or powder of natural stone (limestone, marble, granite, porphyry, serpentine, etc.) with lime, cement or other binders (e.g., plastics). It includes \"terrazzo\", \"granito\", etc.\n\nThe heading includes blocks, bricks, tiles; laths; paving flags; beams, hollow slabs and other structural components; pillars, posts, boundary stones, curbstones; tubes; steps; balustrades; baths, sinks, lavatory pans, troughs, vats, reservoirs; gravestones; standards and poles; railway sleepers; door and window frames; mantels, sills; friezes, cornices; vases, flower pots; statues, statuettes, ornaments.\n\nIt also covers sand-lime bricks, tiles and other articles obtained by autoclave curing under high-pressure steam.\n\nThe heading excludes :\n(a) Broken concrete (heading 25.30).\n(b) Articles of agglomerated slate (heading 68.03).\n\nSubheading Explanatory Note.\nSubheading 6810.91\nThis subheading covers prefabricated structural components for building or civil engineering (e.g., cladding panels, wall sections, floor or ceiling units, foundation components, piles, tunnel segments, lock or dam components, cable ducts)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.10 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
