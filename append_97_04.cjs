const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9704",
  "titleKo": "97.04 - 우표ㆍ수입인지ㆍ우편요금 별납증서ㆍ초일(初日)봉투ㆍ우편엽서류와 이와 유사한 것(이미 사용한 것이나 제4907호의 것은 제외한 사용하지 않은 것을 포함한다)",
  "titleEn": "97.04 - Postage or revenue stamps, stamp-postmarks, first-day covers, postal stationery (stamped paper), and the like, used or unused, other than those of heading 49.07.",
  "contentKo": "이 호에는 이미 소인이 찍혀 사용된 우표류와 사용되지 않은 우표류 중 현 유효 발행국에서 액면가로 통용되지 않아 수집용 가치만 지닌 것, 초일(초일)봉투, 맥시멈 카드 및 스탬프 소인이 인쇄된 우편엽서류 등을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 우표(A) : 편지나 우편물 부착용 우표, 요금부족 우표(postage due).\n- 수입인지(B) : 영수증용 인지, consular(영사관) 인지, 등기 인지, 법원 인지 등 법적 수입 세액 증명 스탬프.\n- 우편요금 별납증서(C) : 일부인 소인이 직접 날인되어 우편요금 납부를 증명하는 엽서/편지(우표 미부착식 포함).\n- 초일 봉투(first-day cover) 및 맥시멈 카드(D) : 신규 우표 발행일에 특수 날짜 소인(일부인)을 찍은 기념 봉투 및 우표 디자인과 엽서 그림이 동일하게 매칭 인쇄되어 발행일에 소인된 엽서(Maximum card).\n- 우편엽서류(E) : 우표 인영이 봉투 자체에 사전 인쇄된 규격 엽서, 봉함엽서, 뉴스 대역 띠지 등.\n- 우표 수집용 앨범 : 우표 수집품이 수납된 상태의 앨범으로, 앨범 자체가 수집품 대비 적정 가격 범위인 경우 본 호의 우표류와 함께 일괄 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 발행국(또는 예정국)에서 현재 유효하게 통용 중이며 법적 결제 수단으로 사용 가능한 미사용 상태의 새 우표, 수입인지 및 엽서류 (제4907호)\n(b) 우표를 붙이지 않은 채 그림/일러스트만 있는 단순 기념 엽서 및 봉투 (제4817호 또는 제49류)\n(c) 백화점 상품권, 기업 저축 우표 스탬프, 소매점 마일리지 쿠폰 스탬프 (제4911호)" ,
  "contentEn": "This heading covers postage or revenue stamps, stamp-postmarks, first-day covers, and stamped postal stationery, whether used or unused, other than those of heading 49.07.\n\nIt includes :\n- Postage stamps (A) including standard and postage due stamps.\n- Revenue stamps (B) including consular, registration, or tax stamps.\n- Stamp-postmarks (C) indicating postage paid without actual stamps affixed.\n- First-day covers (FDCs) (D) bearing stamps postmarked on their first day of issue, and maximum cards.\n- Stamped postal stationery (E) such as stamped envelopes and postcards.\n- Stamp collection albums containing stamps, provided the album value is normal in relation to the collection.\n\nExcludes unused postage stamps and stationery currently valid for transaction or postal use in the country of destination (heading 49.07), unstamped first-day covers/postcards (heading 48.17 or Chapter 49), and commercial trading/savings stamps (heading 49.11)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.04 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
