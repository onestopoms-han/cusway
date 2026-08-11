const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8470",
  "titleKo": "84.70 - 계산기와 계산 기능을 갖춘 포켓사이즈형 전자수첩, 회계기ㆍ우편요금계기ㆍ표권발행기와 그 밖에 이와 유사한 기계(계산 기구를 갖춘 것으로 한정한다), 금전등록기",
  "titleEn": "84.70 - Calculating machines and pocket-size data recording, reproducing and displaying machines with calculating functions; accounting machines, postage-franking machines, ticket-issuing machines and similar machines, incorporating a calculating device; cash registers.",
  "contentKo": "이 호의 모든 기계는 적어도 몇 자리의 숫자로 된 두 개 이상의 수를 더할 수 있는 계산기구(단순 계수기 제외)를 갖추고 있다는 공통된 특성을 가진다.\n\n(A) 계산기와 계산 기능을 갖춘 포켓사이즈형 전자수첩\n단순 가감산 기계부터 사칙연산, 삼각함수 등을 행하는 전자계산기, 프로그램이 가능한 계산기, 계산 기능을 갖춘 포켓 사이즈형 전자 수첩을 포함한다.\n프로그램 가능 계산기는 자동자료처리기계(제8471호)와 달리 사람의 개입 없이 진행 중 논리적 판단에 의해 실행 프로그램을 변경할 수 없다.\n\n(B) 회계기(accounting machine)\n회계장부 기장 및 일련의 금액 합계 기능과 문자/숫자를 수직 및 수평 방향으로 인쇄하는 기능을 갖춘 기계이다.\n\n(C) 금전등록기(cash register)\n거래 기록, 합계, 품목 코드/수량/거래일시 기록 등을 행하는 기계이다. 바코드 판독기, 돈궤, 영수증 인쇄기, 신용카드 독취기 등과 결합할 수 있다. 전자지불용 단말기(POS 단말기)를 포함한다.\n\n(D) 계산기기를 갖춘 그 밖의 기계\n(1) 우편요금계기 : 인쇄된 우편요금 금액을 집계하는 합계기구를 갖춘 것\n(2) 표권 발행기 : 영화, 철도 표권 등을 발행하며 기록/합계하는 것\n(3) 경마장용 계산기(totalisator) : 표권을 발행하며 베팅 총액을 집계하는 것\n단순히 발행 표권 수만 세는 기계는 제외한다(제8472호, 제8476호).\n\n부분품과 부속품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품은 제8473호에 분류한다.\n\n이 호에서는 다음의 것을 제외한다.\n(a) 자동자료처리기계(제8471호)\n(b) 중량 합계 기능이 있는 저울(제8423호, 제9016호)\n(c) 계산척, 계산반, 휴대형 수동 가감산 기구(제9017호)\n(d) 적산회전계, 생산량계(제9029호)",
  "contentEn": "This heading covers calculating machines, pocket-size data machines with calculating functions, accounting machines, cash registers and other machines incorporating a calculating device.\n\nIt includes :\n(I) Calculating machines (electronic calculators, programmable calculators, pocket-size data organizers with calculating functions).\n(II) Accounting machines (bookkeeping machines with vertical and horizontal printing capability).\n(III) Cash registers (incorporating a calculating device, including electronic funds transfer terminals (EFTPOS)).\n(IV) Postage-franking, ticket-issuing and totalisator machines incorporating a calculating device.\n\nParts and accessories of these machines fall in heading 84.73.\n\nThe heading excludes :\n(a) Automatic data processing machines (heading 84.71).\n(b) Weighing machinery with totalising devices (heading 84.23 or 90.16).\n(c) Slide rules and calculating discs (heading 90.17).\n(d) Revolution or production counters (heading 90.29)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.70 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
