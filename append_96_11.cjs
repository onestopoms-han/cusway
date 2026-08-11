const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9611",
  "titleKo": "96.11 - 날짜 도장ㆍ봉합용 스탬프ㆍ넘버링스탬프(numbering stamp)와 이와 유사한 물품[레이블(label)에 날인하거나 양각하는 기구를 포함하며, 수동식으로 한정한다], 수동식 조판용 스틱과 조판용 스틱을 결합한 수동식 인쇄용 세트",
  "titleEn": "96.11 - Date, sealing or numbering stamps, and the like (including devices for printing or embossing labels), designed for operating in the hand; hand-operated composing sticks and hand printing sets incorporating such composing sticks.",
  "contentKo": "이 호에는 오직 독립적인 수동식(손으로 쥐고 찍거나 누르는 방식)으로만 설계된 날짜 도장, 봉합용 인장(sealing stamp), 회전식 넘버링 스탬프(일련번호 스탬프), 휴대용 라벨 스탬프, 수동 조판용 스틱 및 미니 수동 인쇄 세트를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 봉합용 인장(seal) : 밀랍(봉랍 sealing wax)에 눌러 봉인하기 위한 나무/금속 손잡이 결합식 인장(모양/디자인 불문).\n- 수동식 스탬프류 : 고무/금속 회전 밴드식 날짜 도장, 영수증/결재용 스탬프, 자동번호갱신식 넘버링 스탬프(numbering stamp), 롤러식 스탬프, 휴대용 포켓 스탬프(보호 케이스 및 미니 잉크패드가 내장된 것).\n- 수동식 라벨 날인 및 엠보싱(양각)기 : 지면이나 점착식 테이프 라벨에 수동으로 날짜나 글자를 찍거나 엠보싱 처리하는 휴대용 장치.\n- 조판용 스틱(composing stick) 및 세팅스틱 : 교환식 문자 활자를 끼워 고정할 수 있는 판(예: 우체국 일부인용 날짜 교환식 도장 플레이트).\n- 수동 인쇄 세트(printing set)(완구용 제외) : 수동 조판 스틱, 교환식 글자 고무 활자 케이스, 핀셋, 잉크패드가 하나의 세트로 상자에 포장되어 제시되는 세트.\n- 펀치 결합형 티켓 날인 스탬프 (버스/철도 티켓용 수동 스탬핑 펀치).\n\n[주요 분류 기준]\n- 탁상에 고정하거나 올려놓고 레버나 모터를 사용하여 스탠드 방식으로 압착 조작하는 일명 부조(embossing) 프레스기나 사무용 기계식 스탬프는 본 호에서 제외하며 제8472호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 금속판에 강제로 글자를 찍는 철제 불박(branding) 인두 및 공업용 마킹 표지용 펀치 (제8205호)\n(b) 납 밀봉용 봉인 플라이어 및 가축 귀 표식용 타공 플라이어 (제8203호)\n(c) 단독 제시되는 인쇄용 활자(금속 납 활자) 및 8442호 인쇄용 기계 기구용 활자판 (제8442호)\n(d) 시간 기록과 접수 번호가 내장된 대형 클록 무브먼트(시계 기구)식 접수 타임 스탬프 기기 (제9106호)" ,
  "contentEn": "This heading covers hand-operated devices for stamping (date, sealing, numbering), hand composing sticks, and hand printing sets. The articles must be designed solely for operating in the hand (without table stands).\n\nIt includes :\n- Sealing stamps (1) used with sealing wax.\n- Stamps (2) including band date stamps, text stamps, ticket stamps, automatic numbering stamps, roller stamps, and pocket stamps.\n- Composing sticks (3) for holding interchangeable type characters.\n- Hand-operated printing sets (4) containing a composing stick, interchangeable characters, tweezers, and ink pads (non-toy).\n- Hand-held ticket stamping punches (5).\n\nExcludes branding irons (heading 82.05), sealing pliers (heading 82.03), loose metal types (heading 84.42), embossing presses with table bases (heading 84.72), and clock-mechanism time stamps (heading 91.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.11 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
