const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8509",
  "titleKo": "85.09 - 가정용 전기기계식 기기(전동기를 갖춘 것으로 한정하며, 제8508호의 진공청소기는 제외한다)",
  "titleEn": "85.09 - Electro-mechanical domestic appliances, with self-contained electric motor, other than vacuum cleaners of heading 85.08.",
  "contentKo": "이 호에는 전동기를 내장한 가정용 전기기기를 분류한다. 가정용 기기는 용량이나 설계 등 특징에 의해 공업용과 구분된다.\n\n이 호의 기기는 주 제4호에 따라 다음의 두 그룹으로 나뉜다.\n\n(A) 중량에 관계없이 분류되는 기기\n(1) 바닥광택기(floor polisher) (왁스 가열식 포함)\n(2) 식품용 그라인더(분쇄기)와 믹서 : 육류/어류/채소 분쇄기, 커피 그라인더, 밀크쉐이커, 아이스크림 믹서, 반죽기 등.\n(3) 과실주스나 채소주스 추출기\n\n(B) 중량이 20kg 이하인 조건으로 분류되는 기기\n(1) 마루 쓸기, 닦기, 씻어내기 및 오수 흡입기\n(2) 마루 광택제 살포기 (왁스 액화 장치 포함)\n(3) 주방용 싱크대 부착식 쓰레기 처리기(디스포저)\n(4) 채소 탈피기(peeler), 슬라이서, 칩 절단기\n(5) 육류, 빵, 소시지, 치즈 등의 세절기(slicer)\n(6) 칼 가는 기계 및 나이프 클리너\n(7) 전기칫솔\n(8) 공기 가습기 및 제습기\n\n다목적용 호환성 부분품이나 보조 장치가 본 기기와 함께 보통 사용하는 세트로 제시되는 경우 이 호에 일괄 분류한다.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 팬 및 환기/순환용 후드 (제8414호)\n(b) 냉장고 (제8418호)\n(c) 롤러기 및 다림질기 (제8420호 또는 제8451호)\n(d) 원심식 의류건조기 (제8421호), 세탁기 (제8450호)\n(e) 식기세척기 (제8422호)\n(f) 잔디 깎는 기계 (제8433호)\n(g) 식당용/상업용 주스 추출기 및 믹서 (제8435호 또는 제8438호)\n(h) 상업용 양탄자 세척기 (제8451호)\n(ij) 재봉기 (제8452호)\n(k) 모발제거기 (제8510호)\n(l) 가정용 전열기기(헤어드라이어, 다리미, 밥솥, 전기포트 등) (제8516호)\n(m) 마사지기 (제9019호)",
  "contentEn": "This heading covers electro-mechanical domestic appliances with a self-contained electric motor.\n\nAccording to Note 4 to Chapter 85, the appliances are divided into two groups :\n(A) Items classified here regardless of weight :\n(1) Floor polishers.\n(2) Food grinders and mixers (e.g. meat mincers, coffee mills, dough mixers, ice cream mixers).\n(3) Fruit or vegetable juice extractors.\n(B) Items classified here provided their weight does not exceed 20 kg :\n(1) Floor sweeping, washing or scrubbing machines.\n(2) Polish spraying machines.\n(3) Domestic garbage disposers (for kitchen sinks).\n(4) Vegetable peelers, chippers or cutters.\n(5) Slicers of all kinds.\n(6) Knife sharpeners and cleaners.\n(7) Electric toothbrushes.\n(8) Air humidifiers and dehumidifiers.\n\nParts of these appliances are also classified here.\n\nThe heading excludes :\n(a) Ventilating or recycling hoods and fans (heading 84.14).\n(b) Refrigerators (heading 84.18).\n(c) Ironing machines (heading 84.20 or 84.51).\n(d) Clothes dryers (heading 84.21) and washing machines (heading 84.50).\n(e) Dish washing machines (heading 84.22).\n(f) Lawn mowers (heading 84.33).\n(g) Commercial/industrial juice extractors and food grinders (heading 84.35 or 84.38).\n(h) Commercial carpet cleaning appliances (heading 84.51).\n(ij) Sewing machines (heading 84.52).\n(k) Hair-removing appliances (heading 85.10).\n(l) Electro-thermic appliances (e.g. hair dryers, irons, kettles) (heading 85.16).\n(m) Massage apparatus (heading 90.19)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.09 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
