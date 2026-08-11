const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6909",
  "titleKo": "69.09 - 실험실용ㆍ화학용이나 그 밖의 공업용 도자제품, 농업용 도자제 통과 이와 유사한 용기, 물품의 수송용ㆍ포장용으로 사용하는 도자제의 항아리ㆍ단지와 이와 유사한 제품",
  "titleEn": "69.09 - Ceramic wares for laboratory, chemical or other technical uses; ceramic troughs, tubs and similar receptacles of a kind used in agriculture; ceramic carboys, jars and similar articles of a kind used for the conveyance or packing of goods.",
  "contentKo": "이 호에는 일반적으로 유리질화한 도자재료[석기(stoneware)ㆍ자기(porcelain or china)ㆍ동석(凍石 : steatite)도자 등]로 만든 여러 가지의 제품을 분류하며 유약처리를 했는지에 상관없다. 그러나 총설 제1절에 기재한 것과 같이 고온의 내화용으로 설계한 종류의 단열제품은 이 호에서 제외한다. 그러나 단열재료로 제조하였다 할지라도 고온 작업용의 목적으로 설계하지 않은 것은 이 호에 분류한다[예: 소결한 알루미나로 만든 실가이드(thread guide)ㆍ연마장치 등].\n\n이 호에는 특히 다음의 것을 포함한다.\n\n(1) 실험실용품(예: 연구용ㆍ공작용의 것) : 예를 들어, 도가니ㆍ도가니 뚜껑ㆍ증발접시ㆍ연소(燃燒)용 보트ㆍ큐펠(cupel) ; 막자사발과 막자 ; 산(酸)용의 스푼ㆍ주걱 ; 여과용이나 촉매용의 지지물 ; 여과용의 판ㆍ관(管)ㆍ캔들ㆍ콘ㆍ깔때기 등 ; 워터배스(water-bath) ; 비이커ㆍ눈금을 매긴 용기(주방용의 것은 제외한다) ; 실험실용 접시ㆍ수은그릇 ; 작은 관류(小管類)[예: 탄소ㆍ유황 등의 측정용 분석관을 포함한 연소(燃燒)용 관(管)]\n\n(2) 그 밖의 공업용 도자제품 : 예를 들면, 펌프ㆍ밸브 ; 레토르트(retort)ㆍ통ㆍ화학용 통ㆍ그 밖의 단일이나 이중벽이 있는 정전(靜電)식 용기(예: 전기도금용ㆍ산(酸)저장용 등의 것) ; 산(酸)용의 마개 ; 코일ㆍ분류용이나 증류용의 코일이나 컬럼ㆍ석유분류장치용의 래쉬히 링(Raschig ring) ; 그라인딩밀(grinding mill)용의 연마 장치와 볼(balls) 등 ; 섬유기계용의 실가이드(thread guide)ㆍ인조섬유 방사용의 다이스(dies) ; 공구용 플레이트(plate)ㆍ스틱ㆍ팁(tip)과 이와 유사한 것\n\n(3) 상거래상의 수송용ㆍ포장용에 사용하는 여러 종류의 용기 : 예를 들면, 산(酸)이나 그 밖의 화학품의 수송에 사용하는 대형용기ㆍ카보이(carboy) 등 ; 식료품(잼ㆍ조미료ㆍ육ㆍ주류 등)ㆍ의약품이나 화장품(포마드ㆍ고약ㆍ크림 등)ㆍ잉크 등에 사용하는 식탁용 술병ㆍ항아리ㆍ단지 등\n\n(4) 농업용의 통(troughㆍtub)과 이와 유사한 용기\n\n이 호에는 다음의 것을 제외한다.\n(a) 제6804호의 물품\n(b) 내화성 재료제의 레토르트(retort)ㆍ도가니ㆍ머플(muffle)ㆍ큐펠(cupel)ㆍ그 밖의 유사한 제품(제6903호)\n(c) 주방용이나 가정용 용기(예: 찻잔ㆍ빵그릇ㆍ비스킷 통)(제6911호나 제6912호)\n(d) 실험실용에 사용하는 것으로서 범용성이 있는 용기, 의약품ㆍ과자 등의 전시용 그릇(제6914호)\n(e) 서멧(cermet)의 제품(제8113호)\n(f) 제8533호부터 제8538호까지의 전기기기[스위치(switch)ㆍ접속상자ㆍ퓨즈 등]와 제8546호나 제8547호의 전기애자ㆍ전기절연용 연결구류 등\n\n◦\n◦ ◦\n[소호해설]\n소호 제6909.12호\n이 소호에는 고강도(high-performance)의 세라믹 제품을 분류한다. 이들 제품은 세라믹 매트릭스(matrix) 결정체로 조성되어 있다[예: 알루미나ㆍ탄화규소ㆍ지르코니아(zirconia)나 실리콘ㆍ보론(boron)ㆍ알루미늄의 질화물 또는 이들의 결합물로 조성] ; 복합세라믹 재료를 만들기 위해서 보강재료(예: 금속이나 흑연)의 휘스커(whisker)나 파이버(fibre)가 매트릭스(matrix)에 분산되기도 한다.\n이들 제품의 특징은 다공성(多孔性)이 대단히 낮고 알갱이 크기가 매우 작은 매트릭스(matrix) ; 또한 내(耐)마멸성ㆍ내부식성ㆍ내약화성ㆍ내열충격성 ; 내고온강도 ; 강도와 중량비가 강(鋼)의 그것과 비교할 만하고 강(鋼)보다 더 우수하다는 것이 특성이다.\n이들 제품은 정밀 치수공차를 요구하는 기계용도에서 강(鋼)이나 그 밖의 금속으로 만든 부분품 대신 흔히 사용한다(예: 엔진 터보차저 로터ㆍ롤링 접촉 베어링과 기계 공구).\n이 소호의 모스경도계(Mohs scale)는 그 경도계에 놓인 재료의 표면을 긁어낼 수 있는 능력에 의해 재료를 평가한다. 강도재료 평가는 1[활석(滑石)]에서 10(다이아몬드)까지 있으며 고강도 세라믹 재료의 대부분은 모스경도계 상층부 수치에 가까이 접근한다. 고강도 세라믹에 사용하는 탄화규소와 산화알루미늄은 모스경도계에서 9를 가리키거나 그 이상 해당한다.",
  "contentEn": "This heading covers non-refractory ceramic wares for laboratory, chemical or other technical uses (other than those of heading 69.01 or 69.02). These wares are usually made of porcelain, stoneware, or steatite.\n\nThe heading includes :\n(1) Laboratory wares (e.g., crucibles, evaporating dishes, combustion boats, cupels, mortars and pestles, spatulas, filter plates, tubes, cones and funnels).\n(2) Other technical wares (e.g., pumps, valves, retorts, chemical vats, Raschig rings, grinding balls, thread guides, dies for extruding man-made fibres, plates and tips for tools).\n(3) Receptacles for the conveyance or packing of goods (e.g., carboys, jars and pots for acids, foodstuffs, cosmetics, ink).\n(4) Troughs, tubs and similar receptacles used in agriculture.\n\nThe heading excludes :\n(a) Articles of heading 68.04.\n(b) Refractory crucibles, retorts, etc. of heading 69.03.\n(c) Tableware or household containers (heading 69.11 or 69.12).\n(d) Cermets of heading 81.13.\n(e) Insulators and other electrical fittings (headings 85.46 and 85.47).\n\nSubheading Explanatory Note.\nSubheading 6909.12\nThis subheading covers high-performance ceramic articles consisting of a crystalline ceramic matrix (e.g., alumina, silicon carbide, zirconia, or nitrides of silicon, boron or aluminium). They are characterized by high wear resistance, corrosion resistance, high-temperature strength, and low porosity. They are often used as mechanical components instead of steel."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.09 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
