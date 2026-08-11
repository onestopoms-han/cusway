const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8545",
  "titleKo": "85.45 - 탄소전극ㆍ탄소브러시ㆍ램프용 탄소ㆍ전지용 탄소와 그 밖의 흑연이나 탄소제품(전기용으로 한정하며, 금속이 함유된 것인지에 상관없다)",
  "titleEn": "85.45 - Carbon electrodes, carbon brushes, lamp carbons, battery carbons and other articles of graphite or other carbon, with or without metal, of a kind used for electrical purposes.",
  "contentKo": "이 호에는 도전성 향상이나 전기적 접촉, 전기 아크 방출 등을 목적으로 하는 전기용 흑연/탄소 제품(금속 함유 여부 무관)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 탄소 전극 (Carbon Electrodes)\n- 전기로/노(爐)용 전극 : 주로 대형 실린더 또는 나사 홈이 파진 암나사 접속식 봉(rod).\n- 용접용 탄소 전극 (봉상).\n- 전해조용 탄소 전극 : 판, 봉, 원통 형태로 도금/정련 장비용 훅(hook)이나 링이 결합된 것.\n(B) 탄소 브러시 (Carbon Brushes)\n- 발전기, 전동기(모터)의 정류자나 전기기관차/크레인의 집전장치용 슬라이딩 접촉자 (정밀 가공된 블록 형태, 도선/스프링/터미널 부착형 포함).\n(C) 램프용 탄소 (Lamp Carbons)\n- 아크램프용 탄소 봉 및 전기저항 램프용 탄소 필라멘트.\n(D) 전지용 탄소 (Battery Carbons)\n- 1차전지/2차전지용 탄소 봉, 탄소 판, 탄소 관.\n(E) 기타 전기용 탄소/흑연 제품\n- 탄소 마이크로폰용 탄소 원판(디스크) 및 가루 상자를 제외한 부분품.\n- 노용 탄소 전극 접속용 니플(nipple).\n- 송신관/정류관용 탄소 양극(anode), 그리드(grid).\n- 공업용 전열 가열기용 탄소 저항 발열체(봉, 바 형태).\n- 자동전압조정기(AVR)용 탄소 원판 디스크 저항체 스택.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 분말 또는 입자상의 흑연 및 탄소 재료 단독 제시품 (제38류)\n(b) 고체 반도체식 탄소 피막 저항기 (제8533호)\n(c) 흑연이 외부에 도포된 순수 금속제 브러시 (제8535호 또는 제8536호)\n(d) 모터용 브러시 홀더 단독 제시품 (제8503호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.45 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
