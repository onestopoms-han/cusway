const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8547",
  "titleKo": "85.47 - 전기기기용으로서 전부가 절연재료로 구성된 절연용 물품(나선가공 소켓과 같이 단순히 조립을 위하여 주조과정에서 소량의 금속이 주입된 것을 포함하며, 제8546호의 애자는 제외한다), 비금속(卑金屬)으로 만든 전기용 도관(導管)과 그 연결구류(절연재료로 속을 댄 것으로 한정한다)",
  "titleEn": "85.47 - Insulating fittings for electrical machines, appliances or equipment, being fittings wholly of insulating material apart from any minor components of metal (for example, threaded sockets) incorporated during moulding solely for purposes of assembly, other than insulators of heading 85.46; electrical conduit tubing and joints therefor, of base metal lined with insulating material.",
  "contentKo": "이 호에는 두 가지 카테고리의 전기 절연용 제품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 전기기기용 절연용 물품 (Insulating Fittings)\n- 스위치, 차단기, 전기기기 하우징용 바디, 베이스, 커버 등의 부속 절연 부품.\n- 퓨즈용 베이스 및 지지구, 램프소켓용 나사산 링, 저항기/코일 권선용 보빈 및 심(core), 점화플러그 절연 본체 쉘.\n- 터미널 단자가 장착되지 않은 접속용 절연 스트립, 도미노 블록(빈 단자대 기판).\n- 주조(몰딩) 성형 시 단순히 고정/조립용 스크루 핀이나 내부 메탈 소켓이 소량 주입된 플라스틱, 도자기, 수지 함침 페이퍼/판지, 운모 등의 절연성 본체 부품.\n(B) 비금속제 전기용 도관(Conduit Tubing) 및 연결구(Joints) (절연재료로 내부 라이닝/속을 댄 것에 한정)\n- 빌딩이나 공장 배선 시 전선 통과용으로 영구 부착하는 철강 등 비금속제 튜브로서, 내벽에 절연성 종이, 플라스틱, 고무, 또는 절연 바니시 등이 코팅되거나 라이닝 처리된 도관.\n- 내부 절연 라이닝이 처리된 비금속제 도관용 연결 피팅류 (엘보, T형 연결구, 크로스오버 등).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전선 지지/안내용 고전압/저전압 애자 (제8546호)\n(b) 단순 부식 방지용 바니시만을 칠한 금속 도관 (제15부)\n(c) 내부에 전기 접속용 단자/터미널이 장착된 연결함, T형 커넥터 (제8535호 또는 제8536호)\n(d) 축전기(배터리)용 격리판, 커버 및 전용 케이스 외함 (제8507호)\n(e) 비금속 보강이 없는 순수 고무, 플라스틱, 유리섬유 직조 절연 튜브 (재질에 따라 분류)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.47 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
