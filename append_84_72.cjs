const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8472",
  "titleKo": "84.72 - 그 밖의 사무용 기계[예: 헥토그래프(hectograph)ㆍ스텐실(stencil) 등사기ㆍ주소인쇄기ㆍ현금 자동지불기ㆍ주화분류기ㆍ주화계수기나 주화포장기ㆍ연필깎이ㆍ천공기ㆍ지철기(stapling machine)]",
  "titleEn": "84.72 - Other office machines (for example, hectograph or stencil duplicating machines, addressing machines, automatic banknote dispensers, coin-sorting machines, coin-counting or wrapping machines, pencil-sharpening machines, perforating or stapling machines).",
  "contentKo": "이 호에는 앞의 두 개 호나 품목분류표의 다른 호에 보다 구체적으로 규정되지 않은 모든 사무용 기계를 포함한다.\n테이블, 데스크 등의 위에 고정하거나 놓기 위한 베이스(base)를 갖는 것으로 한정하며, 이러한 베이스가 없는 수공구류는 제외한다(제82류).\n\n이 호에는 특히 다음과 같은 것을 포함한다.\n(1) 헥토그래프식 등사기 및 스텐실 등사기\n(2) 주소인쇄기 및 주소판/스텐실 선별기\n(3) 표권발행기 (계산 기구 내장형 제8470호 및 코인작동식 제8476호 제외)\n(4) 주화분류기, 주화계수기, 지폐계수기 (포장 기능 포함 가능)\n(5) 현금 자동지불기 (CD기, 온라인/오프라인 무관)\n(6) 현금자동입출금기 (ATM)\n(7) 연필깎이 (수동식 포함, 비기계식 제8214호 및 완구용 제95류 제외)\n(8) 사무용 천공기 (서류철용 구멍뚫기 등, 우표용 퍼포레이션기 제8441호 제외)\n(9) 자동타자기용 종이 테이프 천공기\n(10) 천공 테이프 작동식 타이핑 장치\n(11) 지철기(스테이플러) 및 제침기(스테이플 뽑기)\n(12) 편지 접는 기계 및 봉투 삽입기\n(13) 편지개봉기, 편지봉함기, 실링기\n(14) 우표소인기\n(15) 편지분류기 (우체국의 기능단위기계 포함)\n(16) 포장지/접착지 공급기\n(17) 접착지/우표 물 축임기\n(18) 문서파쇄기 (paper shredder)\n(19) 수표작성기 (cheque-writing machine)\n(20) 수표서명기 (cheque-signing machine)\n(21) 금전등록기 연결용 자동잔돈지급기\n(22) 사무실용 독립형 문서 분류/대조 기계\n(23) 타자기 (제8443호의 프린터 제외) : 자동식 타자기, 절연 튜브용 타자기, 회계용 타자기 등을 포함한다.\n(24) 워드프로세싱 머신 : 논리적 결정에 의해 프로그램을 수정할 수 없다는 점에서 제8471호의 자동자료처리기계와 구별된다.\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품과 부속품은 제8473호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 제8443호 프린터용 분류기\n(b) 계산기 및 회계기(제8470호)\n(c) 자동자료처리기계(제8471호)\n(d) 텔레프린터(제8517호)\n(e) 녹음기 및 음성재생기(제8519호)\n(f) 위조지폐 감별용 엑스선기기(제9022호)\n(g) 시간기록기(제9106호)\n(h) 장난감 타자기(제9503호)\n(ij) 수동식 날짜도장 및 봉함스탬프(제9611호)",
  "contentEn": "This heading covers all office machines not covered by the preceding two headings or more specifically by any other heading of the Nomenclature.\n\nIt includes :\n(I) Duplicating machines (hectograph, stencil duplicators).\n(II) Addressing machines and stencil cutters.\n(III) Ticket-issuing machines (without calculating devices).\n(IV) Coin-sorting, coin-counting, banknote counting or paying-out machines.\n(V) Automatic banknote dispensers and Automated Teller Machines (ATMs).\n(VI) Office punchers, staplers, de-staplers, pencil-sharpening machines, paper shredders.\n(VII) Mail-handling machines (letter folders, envelope inserters, letter openers, mail sorters, stamp cancelling machines).\n(VIII) Cheque-writers, cheque-signers, and automatic change dispensers.\n(IX) Typewriters (excluding printers of heading 84.43) and word-processing machines.\n\nParts and accessories of these machines fall in heading 84.73.\n\nThe heading excludes :\n(a) Sorters which are parts of printers/copiers of heading 84.43.\n(b) Calculating and accounting machines (heading 84.70).\n(c) Automatic data processing machines (heading 84.71).\n(d) Teleprinters (heading 85.17).\n(e) Dictating machines and voice recorders (heading 85.19).\n(f) X-ray banknote verification systems (heading 90.22).\n(g) Time recorders (heading 91.06).\n(h) Toy typewriters (heading 95.03).\n(ij) Hand-operated stamps (heading 96.11)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.72 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
