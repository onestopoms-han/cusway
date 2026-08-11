const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8476",
  "titleKo": "84.76 - 물품의 자동판매기(예: 우표ㆍ담배ㆍ식품ㆍ음료의 자동판매기)와 화폐교환기(+)",
  "titleEn": "84.76 - Automatic goods-vending machines (for example, postage stamp, cigarette, food or beverage machines), including money-changing machines.",
  "contentKo": "이 호에는 코인, 토큰, 자기카드 등을 넣으면 상품을 제시해 주는 기계를 분류한다. \"벤딩(vending)\"은 구매자와 기계 간의 금전적 교환을 의미하며, 물품대금 수령 장치가 없는 배포 기기는 제외한다(예: 요금수납 장치가 없는 자동 온냉음료 배포기는 제8419호).\n동전 삽입 후 여러 칸막이의 자물쇠가 열려 상품을 꺼내게 하는 기계를 포함한다. 단, 물품 보관 목적의 코인식 자물쇠 부착 찬장/용기는 제외한다(제15부, 제94류).\n판매 제품을 조제하는 장치(과즙 압착기, 믹서 등)나 가열/냉장장치를 갖춘 것도 주 기능이 자동판매인 한 이 호에 포함한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 우표, 승차권, 초콜릿, 담배, 음료(맥주, 커피, 과즙 등), 화장품, 양말, 신문 등의 자동판매기\n(2) 금속 스트립에 이름을 타발해 주는 네임플레이트 자동판매기\n(3) 화폐교환기 (money-changing machine)\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 상점 전면에 짜 맞춘 자동판매기도 이 호에 분류한다.\n\n이 호에는 다음과 같은 코인작동식 기기는 제외한다.\n(a) 코인작동식 자물쇠 (제8301호)\n(b) 주유소용 연료/윤활유 급유 펌프 (제8413호)\n(c) 코인작동식 저울 (제8423호)\n(d) 코인작동식 타자기 (제8472호)\n(e) 코인작동식 구두닦이기계 (제8479호)\n(f) 코인작동식 전기면도기 (제8510호)\n(g) 공중전화기 (제8517호)\n(h) 코인작동식 TV 수상기 (제8528호)\n(ij) 망원경, 사진기, 영사기 (제90류)\n(k) 가스/전기 적산계기 (제9028호)\n(l) 게임기 및 오락용 기기 (제9504호 등)\n\n[소호해설]\n소호 제8476.21호와 제8476.29호\n\"음료 자동판매기\"란 컵, 캔, 병, 팩 등에 든 완성 음료 또는 인스턴트 가루와 물을 믹싱하여 컵에 즉석 조제해 주는 음료(커피, 차, 과즙 등) 자동판매기를 말한다.",
  "contentEn": "This heading covers automatic goods-vending machines and money-changing machines.\n\nIt includes :\n(I) Vending machines for postage stamps, tickets, chocolate, sweets, ice cream, cigarettes, cosmetics, drinks (coffee, soda, beer, etc.), newspapers.\n(II) Name plate stamping machines.\n(III) Money-changing machines.\n\nParts of these machines and front-shop integrated vending units are also covered.\n\nThe heading excludes :\n(a) Coin-operated locks (heading 83.01).\n(b) Coin-operated gasoline/lubricating oil dispensing pumps (heading 84.13).\n(c) Weighing machines (heading 84.23).\n(d) Shoe-polishing machines (heading 84.79).\n(e) Public telephones (heading 85.17).\n(f) Coin-operated amusement games (heading 95.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.76 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
