const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8516",
  "titleKo": "85.16 - 전기식의 즉시식ㆍ저장식 물 가열기와 투입식 가열기, 난방기기와 토양가열기, 전기가열식 이용기기[예: 헤어드라이어ㆍ헤어컬러(hair curler)ㆍ컬링통히터(curling tong heater)], 손 건조기, 전기다리미, 그 밖의 가정용 전열기기, 전열용 저항체(제8545호의 것은 제외한다)",
  "titleEn": "85.16 - Electric instantaneous or storage water heaters and immersion heaters; electric space heating apparatus and soil heating apparatus; electro-thermic hair-dressing apparatus (for example, hair dryers, hair curlers, curling tong heaters) and hand dryers; electric smoothing irons; other electro-thermic appliances of a kind used for domestic purposes; electric heating resistors, other than those of heading 85.45.",
  "contentKo": "이 호에는 물 가열기, 난방용/토양가열용 기기, 미용/손 건조기, 다리미, 기타 가정용 전열기기 및 전열용 저항체를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 전기식 온수기 및 투입식 가열기\n(1) 가이저(즉시식 온수기) 및 저장식 물 가열기(단열 탱크식).\n(2) 이중식 가열기(연료+전기 혼합 온수기).\n(3) 전극형 온수보일러.\n(4) 투입식 가열기(immersion heater) : 액체, 가스 가열용 저항 히터(가정용 및 단독 제시 물 가열용).\n(B) 난방기기와 토양가열기\n(1) 축열식 전기가열기, 전기식 난방기(선풍기형, 방사형 히터).\n(2) 오일 라디에이터, 대류식 가열기, 천장/벽용 가열 패널(적외선 패널 포함).\n(3) 차량용, 항공기용 가열기 (와이퍼 제상기 제8512호 제외).\n(4) 토양 가열 장치 및 로드 히팅(설해방지용 도로 매설 히터).\n(5) 자동차 엔진 예열기(엔진히터).\n(C) 전기가열식 미용기기 및 손 건조기\n(1) 헤어드라이어(후드형, 권총형 손잡이식), 헤어컬러, 전기식 퍼머넌트 웨이브 장치.\n(2) 컬링통히터, 손 건조기.\n(D) 전기다리미 : 가정용/산업용 다리미, 스팀다리미 및 무선다리미 세트.\n(E) 그 밖의 가정용 전열기기\n(1) 마이크로웨이브 오븐(가정용).\n(2) 가정용 오븐, 전기쿠커, 전기그릴, 로스터, 조리판(인덕션, 하이라이트 등).\n(3) 전기식 커피/티 메이커, 빵/토스터 오븐.\n(4) 전기식 탕관, 끓임 냄비, 와플 굽는 틀, 요구르트 제조기, 얼굴 사우나기, 향수/살충제 분무용 가열기 등.\n(F) 전열용 저항체 : 전류 통전 시 열을 내는 특수 합금선, 탄화규소 봉/판 등 (탄소 저항체 제8545호 제외). 인쇄저항체 포함.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품(다리미 베이스 플레이트, 조리용 플레이트 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기가열식 모포, 베드패드, 전기 의류/신발 (각 해당 호)\n(b) 롤러 다림질기 (제8420호 또는 제8451호)\n(c) 공업용/상업용 대형 식음료 가열기, 튀김기 등 (제8419호)\n(d) 식당용 공업용 마이크로웨이브 오븐 (제8514호)\n(e) 전자담배 및 개인용 전기 기화장치 (제8543호)\n(f) 전열체를 갖춘 가구 (제94류)\n(g) 전기식 제상기/제무기 (차량용) (제8512호)",
  "contentEn": "This heading covers electric water heaters, space heating and soil heating apparatus, electro-thermic hair-dressing and hand-drying apparatus, electric smoothing irons, other domestic electro-thermic appliances, and electric heating resistors (except of carbon).\n\nIt includes :\n(I) Water heaters and immersion heaters :\n- Instantaneous (geyser) or storage water heaters.\n- Dual-system (fuel/electric) heaters.\n- Electrode hot water boilers.\n- Immersion heaters for liquids or gases (including portable cups/bath heaters).\n(II) Space heating and soil heating apparatus :\n- Storage heating apparatus.\n- Electric fires (fan heaters, radiant fires).\n- Electric oil radiators and convection heaters.\n- Heating panels (wall/ceiling mounted, including infra-red).\n- Road heating (snow-melting) systems and soil heaters.\n- Engine pre-heaters.\n(III) Hair-dressing and hand-drying apparatus :\n- Hair dryers (hood-type, hand-held), hair curlers, permanent waving apparatus, curling tong heaters.\n- Hand dryers.\n(IV) Electric smoothing irons (including steam and cordless irons).\n(V) Other domestic electro-thermic appliances :\n- Microwave ovens (domestic).\n- Ovens, cookers, hobs (including induction/halogen hobs), grillers, and roasters.\n- Coffee/tea makers, toasters, kettles, waffle irons, yogurt makers, facial saunas, towel rails.\n(VI) Electric heating resistors (wire, bar, or plate resistors, including printed resistors).\n\nParts of these appliances are also classified here.\n\nThe heading excludes :\n(a) Electrically warmed blankets, bed pads, or clothing (Section XI or specific headings).\n(b) Commercial/industrial microwave ovens (heading 85.14) or commercial catering equipment (heading 84.19).\n(c) Roller ironers (heading 84.20 or 84.51).\n(d) Electric windscreen defrosters/demisters (heading 85.12).\n(e) Electronic cigarettes and personal vaporizers (heading 85.43).\n(f) Furniture incorporating heating elements (Chapter 94)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.16 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
