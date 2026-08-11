const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8549",
  "titleKo": "85.49 - 전기ㆍ전자 웨이스트(waste)와 스크랩(scrap)(+)",
  "titleEn": "85.49 - Electrical and electronic waste and scrap.",
  "contentKo": "이 호에는 수명이 다해 폐기되거나 파손되어 금속 회수, 재활용 또는 최종 처분용으로만 적합한 전기/전자 제품의 폐기물(e-waste) 및 스크랩, 그리고 폐배터리(폐일차전지 및 폐축전지)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 일차전지와 축전지의 웨이스트, 스크랩 및 수명이 끝난(spent) 배터리\n- 폐연산(납산) 축전지, 납/카드뮴/수은을 함유한 폐배터리, 기타 리튬이온 등 화학 유형별 폐배터리.\n- 배터리 제조 공정에서 발생한 불량 극판 릴(reel), 판(plate), 반조립 셀 등 공정 스크루 scrap.\n(2) 전기/전자 웨이스트(e-waste)\n- 수명이 끝난 가전제품, 사무용/정보기술/통신 장치, 폐 가정용품, 폐 전동공구.\n- 인쇄회로기판(PCB) 스크랩, 폐 전기/전자 부품 어셈블리.\n- 귀금속(금, 은, 백금 등) 회수를 목적으로 주로 사용되는 전자 부품 스크랩.\n- 수은 스위치, 음극선관(CRT) 파쇄 유리 등 유해 물질 함유 폐기물.\n\n이 호의 물품은 원래의 기능대로의 재사용, 수리, 리퍼비시(refurbish) 등을 목적으로 포장 유통되는 중고품은 제외한다. 통상 벌크(bulk) 상태로 중량(weight) 단위 거래되며, 보호용 개별 포장이 없는 것이 특징이다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 방사성 물질을 함유한 폐기물 (제2844호)\n(b) 선별되지 않은 일반 생활폐기물 (제3825호)\n(c) 수리나 정비, 재사용을 목적으로 수집 보관 중인 중고 전기/전자 제품 (각 완성품의 해당 호)\n\n[소호 해설]\n- 소호 제8549.11~19호 : 수명이 끝난 일차전지/축전지 및 배터리 스크랩.\n- 소호 제8549.21~29호 : 귀금속 회수용으로 적합한 전자 스크랩.\n- 소호 제8549.31~39호 : 기타 전기/전자 조립품 및 PCB 스크랩."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.49 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
