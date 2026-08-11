const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6912",
  "titleKo": "69.12 - 도자제의 식탁용품ㆍ주방용품ㆍ그 밖의 가정용품ㆍ화장용품(자기제의 것은 제외한다)",
  "titleEn": "69.12 - Ceramic tableware, kitchenware, other household articles and toilet articles, other than of porcelain or china.",
  "contentKo": "식탁용품ㆍ주방용품ㆍ그 밖의 가정용품과 화장용품으로서 자기제(porcelain or china)의 것은 제6911호에 분류하고 그 밖의 도자(ceramic)제품[즉, 석기ㆍ토기ㆍ모조자기인 경우 (제2절 해설 참조)] 은 제6912호에 분류한다.\n\n그러므로 이 호에는 다음의 것을 포함한다.\n\n(A) 식탁용품(tableware) : 커피 잔과 찻잔ㆍ접시ㆍ수프그릇ㆍ샐러드그릇ㆍ여러 가지의 큰 접시와 쟁반ㆍ커피그릇ㆍ찻그릇ㆍ설탕그릇ㆍ술잔ㆍ물 컵ㆍ소스 그릇ㆍ과일그릇ㆍ양념그릇ㆍ식염그릇ㆍ겨자그릇ㆍ에그 컵(egg-cup), 찻그릇용대ㆍ테이블 매트ㆍ칼 놓는대ㆍ숟가락ㆍ냅킨링\n\n(B) 주방용품(kitchenware) : 스튜우 팬(stew-pan)ㆍ여러 종류의 모양과 크기의 캐서로울(casserole)ㆍ굽거나 볶는데 사용하는 접시ㆍ물동이ㆍ페이스트리나 젤리 몰드(mould)ㆍ주방용 항아리ㆍ저장용 항아리ㆍ보관용의 항아리와 저장통(차 항아리ㆍ빵 상자 등)ㆍ깔때기ㆍ국자ㆍ눈금이 있는 주방용의 용량 측정기ㆍ국수방망이\n\n(C) 그 밖의 가정용품 : 재떨이ㆍ온수용의 그릇ㆍ성냥통의 대\n\n(D) 화장용품(toilet article)(가정용인지에 상관없다) : 화장세트(물통ㆍ바울 등)ㆍ위생용 페일(pail)ㆍ탕파(bed pan)ㆍ요강(urinal)ㆍ실내용 변기(chamber-pot)ㆍ타구(spittoon)ㆍ주수기 통(douche can)ㆍ눈 씻는 컵(eye bath) ; 비누용 접시ㆍ수건걸이ㆍ치솔걸이ㆍ화장지걸이ㆍ수건고리와 이와 유사한 욕실용품이나 주방용품(벽에 고정이나 부착하도록 설계한 것인지에 상관없다)\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 포장용이나 수송용에 사용하는 종류의 카보이(carboy)ㆍ항아리ㆍ병ㆍ단지와 이와 유사한 물품(제6909호)\n\n(b) 목욕통ㆍ비데ㆍ설거지통과 이와 유사한 위생용품(제6910호)\n\n(c) 제6913호의 작은 조각상과 그 밖의 장식품\n\n(d) 귀금속으로 만들거나 귀금속을 입힌 금속으로 만든 작은 장식이 많이 부착되어 있는 도자 제품(제71류)\n\n(e) 도자재료제의 용기와 금속으로 만든 작용부분을 구비하고 있는 커피 분쇄기나 향료 분쇄기(제8210호)\n\n(f) 제8516호의 전열장치(요리용ㆍ가열용 등)[가열용 플레이트(plate)ㆍ전열용 저항체 등의 전열체를 포함한다]\n\n(g) 제91류의 물품[클록(clock) 케이스를 포함한다]\n\n(h) 제9613호의 라이터와 향수용 분무기 등(제9616호)",
  "contentEn": "This heading covers tableware, kitchenware, other household articles and toilet articles, of ceramics other than porcelain or china (for example, of stoneware, earthenware, imitation porcelain). Tableware, kitchenware, etc. of porcelain or china fall in heading 69.11.\n\nThe heading includes :\n(A) Tableware : cups, saucers, plates, soup bowls, salad bowls, platters, trays, coffee-pots, teapots, sugar bowls, beer mugs, sauce-boats, fruit bowls, cruets, egg-cups, teapot stands, table mats, knife rests, spoons, napkin rings.\n(B) Kitchenware : stew-pans, casseroles, baking dishes, basins, pastry moulds, storage jars, bins (e.g., bread bins), funnels, ladles, graduated measures, rolling pins.\n(C) Other household articles : ashtrays, hot water bottles, matchbox stands.\n(D) Toilet articles (whether or not for domestic use) : toilet sets (jugs, basins, etc.), sanitary pails, bedpans, urinals, chamber-pots, spittoons, douche cans, eye baths; soap dishes, towel rails, toothbrush holders, toilet paper holders and similar bathroom or kitchen fixtures (whether or not designed for fixing to walls).\n\nThe heading excludes :\n(a) Carboys, jars, bottles and similar articles used for the conveyance or packing of goods (heading 69.09).\n(b) Baths, bidets, sinks and similar sanitary fixtures (heading 69.10).\n(c) Statuettes and other ornaments of heading 69.13.\n(d) Ceramic articles incorporating decorations of precious metal (Chapter 71).\n(e) Coffee or spice mills with ceramic hoppers and metal working parts (heading 82.10).\n(f) Electro-thermic apparatus (heading 85.16).\n(g) Clocks, clock cases and parts (Chapter 91).\n(h) Lighters (heading 96.13) and scent sprays (heading 96.16)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.12 (referring to 69.12) to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
