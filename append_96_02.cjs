const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9602",
  "titleKo": "96.02 - 가공한 식물성이나 광물성 조각용 재료와 그 제품, 성형품이나 조각품[왁스ㆍ스테아린(stearin)ㆍ천연수지ㆍ모델링페이스트(modelling paste)로 만든 것으로 한정한다], 따로 분류되지 않은 그 밖의 성형품이나 조각품, 가공한 비경화(非硬化) 젤라틴(제3503호의 젤라틴은 제외한다)과 비경화(非硬化) 젤라틴의 제품",
  "titleEn": "96.02 - Worked vegetable or mineral carving material and articles of these materials; moulded or carved articles of wax, of stearin, of natural gums or natural resins or of modelling pastes, and other moulded or carved articles, not elsewhere specified or included; worked, unhardened gelatin (excluding gelatin of heading 35.03) and articles of unhardened gelatin.",
  "contentKo": "이 호에는 가공한 식물성/광물성 조각용 재료 및 이들의 완제품과, 왁스, 스테아린, 천연수지(로진 등), 모델링 페이스트로 만든 조각/성형품, 가공한 비경화 젤라틴 및 그 제품(캡슐 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 가공한 식물성/광물성 조각재료 및 제품(Ⅰ) :\n  - 식물성 재료 : 상아야자(식물성 아이보리 Corozo), 돔팜(dom-palm)의 견과, 코코넛 껍질, 올리브 씨 등을 절삭/연마하여 만든 가공품 및 가루 성형품.\n  - 광물성 재료 : 천연/응결 호박(amber), 해포석(meerschaum), 흑옥(jet) 등을 깎거나 다듬어 만든 가공품.\n  - 완제품 : 장식용 피규어/소상, 보석함, 단추 블랭크가 아닌 단순 장식용 디스크/원판.\n- 특정 재료로 만든 성형품/조각품 및 비경화 젤라틴 제품(Ⅱ) :\n  - 왁스(밀랍 등)제 제품 : 양봉용 인조벌집, 조화/모조 과일(성형식), 왁스 흉상/두상/피규어(마네킹 제외), 왁스제 모조 과자/초콜릿(쇼윈도 전시용), 면 귀마개(왁스 도포식), 수술용 왁스 T-튜브.\n  - 파라핀 왁스제 제품 : 불산(플루오르화수소산) 수송/보관용 특수 가공 용기.\n  - 천연 수지(로진/코팔)제 제품 : 현악기 활 마찰용 가공 로진(rosin, 바이올린 송진), 호박 모조 코팔 조각품.\n  - 비경화 젤라틴 제품 : 당구 큐 끝에 붙이는 젤라틴 디스크, 의약품용 하드/소프트 공 캡슐(빈 캡슐), 가솔린/라이터 연료 충전용 캡슐, 정사각형/직사각형 이외의 특이한 형태로 절단 가공된 비경화 젤라틴 시트.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 미가공 상태의 호박/해포석 덩어리 및 단순 압착한 벌크 판/봉 (제2530호)\n(b) 봉인용 실링왁스(sealing wax) 및 병 밀봉용 왁스 (제3214호 또는 제3404호)\n(c) 일반 양초 (제3406호)\n(d) 조각용이 아닌 어린이 놀이용 점토(모델링 페이스트), 치과용 인상재 왁스판/봉 (제3407호)\n(e) 인쇄 가공되었거나 정사각형/직사각형으로 단순 절단된 일반 식용/공업용 젤라틴 시트 (제3503호)\n(f) 젤라틴 성분 복사용 카피 페이스트 (제3824호)\n(g) 토탄(peat) 압축 성형 화분 및 블록 (제6815호)\n(h) 교육용/전시용 모형 및 마네킹 (제9023호 또는 제9618호)" ,
  "contentEn": "This heading covers worked vegetable or mineral carving materials (corozo, amber, jet) and articles thereof; carved or moulded articles of wax, stearin, natural resins, or modelling pastes; and worked, unhardened gelatin articles (such as empty pharmaceutical capsules).\n\nIt includes :\n- Vegetable materials: corozo (vegetable ivory), dom-palm nuts, coconut shells, olive stones.\n- Mineral materials: worked natural/agglomerated amber, meerschaum, and jet.\n- Wax/stearin articles: artificial honeycombs, electroplating wax moulds, wax figurines (not tailors' dummies), and wax earplugs.\n- Natural gums/resins: rosin for violin bows (moulded rosin), and copal carving.\n- Unhardened gelatin: empty medicine capsules, and sheets cut to shapes other than rectangles or squares.\n\nExcludes rough blocks of amber/meerschaum (heading 25.30), sealing wax (heading 32.14), candles (heading 34.06), dental impression wax (heading 34.07), bulk food-grade gelatin sheets (heading 35.03), and tailors' dummies (heading 96.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.02 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
