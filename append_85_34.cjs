const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8534",
  "titleKo": "85.34 - 인쇄회로",
  "titleEn": "85.34 - Printed circuits.",
  "contentKo": "이 호에는 절연기판 위에 도체소자(배선), 접촉소자, 그리고 인덕턴스, 저항기, 축전기 등 수동(passive) 소자만을 인쇄, 식각, 도포 등의 인쇄처리 방식으로 형성하여 만든 인쇄회로기판(PCB, blank PCB)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 단면, 양면 및 다층(multi-layer) 인쇄회로기판(PCB) : 기판의 한 면, 양 면 또는 여러 층을 상호 접속시킨 기판.\n- 박막회로(thin-film circuit) 및 후막회로(thick-film circuit) : 유리나 도자 기판 위에 진공증착, 스크린인쇄 가열 등의 방식으로 수동 소자 패턴을 형성하여 캡슐화한 회로.\n- 구멍이 뚫려 있거나 비인쇄식 접속용 터미널/핀이 장착된 기판(부품은 실장되지 않은 블랭크 상태).\n\n이 호에는 다음의 것을 제외한다.\n(a) 다이오드, 트랜지스터, IC 등 전기 신호를 발생, 정류, 변조, 증폭할 수 있는 능동(active) 소자가 실장된 회로 (실장된 보드 Assembly는 제16부 주 제2호 또는 제90류 주 제2호 등에 따라 부품이 속하는 완제품/모듈의 해당 호에 분류)\n(b) 저항기, 콘덴서, 다이오드 등 조립 부품(릴레이, 스위치 포함)이 실장된 인쇄회로기판 (제8537호, 제8538호, 또는 제8548호 등)\n(c) 인쇄 공정으로 얻어지는 개별 수동 부품 단독 제시품 (저항기는 제8533호, 콘덴서는 제8532호 등)\n(d) 집적회로(IC) (제8542호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.34 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
