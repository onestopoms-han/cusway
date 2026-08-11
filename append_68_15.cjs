const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6815",
  "titleKo": "68.15 - 석제품이나 그 밖의 광물성 재료의 제품[탄소섬유ㆍ탄소섬유의 제품ㆍ이탄(泥炭)제품을 포함하며, 따로 분류되지 않은 것으로 한정한다]",
  "titleEn": "68.15 - Articles of stone or of other mineral substances (including carbon fibres, articles of carbon fibres and articles of peat), not elsewhere specified or included.",
  "contentKo": "이 호에는 이 류의 앞 호에 분류하지 않고 이 표의 다른 호에 포함하지 않는 석제품이나 그 밖의 광물성 재료의 제품을 분류하며 ; 그러므로 예를 들면, 제69류에 해당하는 도자제품은 제외한다.\n\n이 호에는 특히 다음의 것을 분류한다.\n\n(1) 천연흑연ㆍ인조흑연(nuclear grade를 포함한다)이나 그 밖의 탄소제의 비 전기용품. 예를 들면, 필터 ; 디스크(disc) ; 베어링 ; 관(管)ㆍ덮개 ; 가공한 벽돌ㆍ타일 ; 섬세한 도안이 있는 소형 물품(예: 수집용의 화폐ㆍ메달ㆍ납 제품 병정)의 제조에 사용하는 주형\n\n(2) 탄소섬유와 탄소섬유의 제품. 탄소섬유는 보통 필라멘트 모양에서 유기중합체를 탄화하여 제조한다(예: 이 제품은 보강재 등으로 사용한다).\n\n(3) 이탄(泥炭)제품[예: 시트(sheet)ㆍ실린더쉘(cylinder shell)ㆍ식물 재배용 화분]. 그러나 이탄(泥炭)섬유의 방직용 제품은 제외한다(제11부).\n\n(4) 백운석(dolomite)을 타르로 응결시켜 만든 벽돌로서 불에 굽지 않은 것\n\n(5) 화학적으로 결합시켜 불에 굽지 않은 벽돌과 그 밖의 모양의 제품(특히 마그네사이트나 크로뮴마그네사이트 제품). 이러한 물품은 이들을 노(爐) 안에 넣고 첫 번째 열을 가하는 동안 구워진다. 불에 구워서 만든 유사제품을 제시하는 경우에는 이 호에서 제외한다(제6902호나 제6903호).\n\n(6) 실리카나 알루미나로 만든 통으로서 불에 굽지 않은 것[예: 유리의 용융(鎔融 : fused)용으로 사용하는 것]\n\n(7) 귀금속 검사용의 시금석(touchstone) ; 이것은 천연석[예: 리다이트석(lydite), 이는 견고하고 내산성(耐酸性) 미립자의 검은 돌이다]으로 만든 것도 있다.\n\n(8) 용융(鎔融 : fused) 슬래그(slag)를 결합제(binder)를 사용하지 않고 성형하여 제조한 포장용 블록(block)과 슬래브(slab). 그러나 제6806호의 단열제품의 특성을 갖는 것은 제외한다.\n\n(9) 석영(quartz)이나 부싯돌(flint)을 잘게 분쇄하여 응결시켜 만든 여과관\n\n(10) 용융(鎔融 : fused) 현무암의 블록(block)ㆍ슬래브(slab)ㆍ시트(sheet)나 그 밖의 제품 ; 이들 제품은 내마모성이 강하므로 파이프의 라이닝(lining)용, 벨트컨베이어용, 코크스ㆍ석탄ㆍ광석ㆍ자갈ㆍ석 등의 자동활송장치용으로 사용한다.\n\n이 호에는 다음의 것도 제외한다.\n\n(a) 주로 잘라서 전기용 브러시로 사용하는 인조 흑연이나 “그 밖의 탄소(other carbon)”로 만든 블록(block)ㆍ플레이트(plate)나 이와 유사한 반제품(semi-manufacture)(제3801호)(관련 해설 참조)\n\n(b) 탄소질 재료(흑연ㆍ코크스 등)와 콜타르 피치(coal tar pitch)나 점토를 기본재료로 하여 도자제품과 같이 불에 구워 만든 내화제품(경우에 따라서 제6902호나 제6903호)\n\n(c) 전기용에 사용하는 탄소ㆍ브러시ㆍ탄소전극과 그 밖의 부분품이나 제품(제8545호)",
  "contentEn": "This heading covers articles of stone or of other mineral substances, not elsewhere specified or included. It excludes ceramic products of Chapter 69.\n\nIt includes, in particular :\n(1) Non-electrical articles of natural or artificial graphite (including nuclear grade) or other carbons (e.g., filters; discs; bearings; tubes; worked bricks and tiles; moulds for casting small articles).\n(2) Carbon fibres and articles of carbon fibres, usually obtained by carbonising organic polymers in filament form (used, e.g., as reinforcing materials).\n(3) Articles of peat (e.g., sheets, cylinder shells, flower pots for plants). Textile articles of peat fibre are, however, excluded (Section XI).\n(4) Unfired bricks of dolomite agglomerated with tar.\n(5) Chemically bonded unfired bricks and other articles (especially magnesite or chrome-magnesite products), which are fired during their first use in a furnace.\n(6) Unfired silica or alumina vats (used, e.g., for melting glass).\n(7) Touchstones of natural stone (e.g., lydite) used for testing precious metals.\n(8) Paving blocks and slabs obtained by casting molten slag without a binder.\n(9) Filter tubes obtained by agglomerating crushed quartz or flint.\n(10) Blocks, slabs, sheets and other articles of fused basalt, which are highly resistant to wear.\n\nThe heading excludes :\n(a) Blocks, plates and similar semi-manufactures of artificial graphite or other carbon, mainly used for cutting into electrical brushes (heading 38.01).\n(b) Refractory ceramic-like fired articles based on carbonaceous materials (heading 69.02 or 69.03).\n(c) Carbon electrodes, brushes and other electrical parts of carbon (heading 85.45)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.15 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
