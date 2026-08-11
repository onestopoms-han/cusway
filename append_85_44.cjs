const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8544",
  "titleKo": "85.44 - 절연(에나멜 도포나 산화피막 처리를 한 것을 포함한다) 전선ㆍ케이블(동축케이블을 포함한다)과 그 밖의 전기절연도체(이것은 접속자가 부착된 것인지에 상관없다), 광섬유 케이블(섬유를 개별 피복하여 만든 것으로 한정하며, 전기도체나 접속자가 부착된 것인지에 상관없다)",
  "titleEn": "85.44 - Insulated (including enamelled or anodised) wire, cable (including co-axial cable) and other insulated electric conductors, whether or not fitted with connectors; optical fibre cables, made up of individually sheathed fibres, whether or not assembled with electric conductors or fitted with connectors.",
  "contentKo": "이 호에는 전기기기나 배전 설비에 전기도체로 사용되는 절연 전선, 케이블 및 광섬유 케이블(개별 피복된 광섬유 다발 케이블)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 에나멜선 및 에나멜/래커 도포 동선 (주로 코일, 권선용).\n(2) 절연 전선 및 다芯 케이블 : 고무, 플라스틱, 운모, 유리섬유 등으로 절연 피복하고 필요에 따라 금속 외장(납, 알루미늄 시스)이나 강철 밴드 보강(장갑 케이블) 처리를 한 송배전용/가공/지하/해저 케이블.\n(3) 동축 케이블(co-axial cable) : 동축 도체 구조를 가진 통신/RF용 케이블.\n(4) 와이어링 하네스(wiring harness) : 자동차, 항공기, 선박 등에 사용되는 전선 다발 세트(점화용 세트 등 포함).\n(5) 커넥터가 부착된 절연 전선 및 케이블 : 일정 길이로 절단되고 터미널, 플러그, 잭 등이 부착된 전선 어셈블리 (전원코드, USB 케이블, 랜 케이블, 커넥터 부착 하네스 등).\n(6) 광섬유 케이블(Optical Fibre Cable) : 광섬유를 개별로 보호 시스 피복하여 다발로 묶은 케이블 (전기도체가 병렬로 혼합되어 있거나 커넥터가 장착된 것도 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전도성 카본 브러시 및 탄소 전극 (제8545호)\n(b) 전열용 저항선을 절연 재료로 감싸거나 가열 목적으로 직조된 시트나 전선 (제8516호)\n(c) 케이블이 없는 광섬유 단독 또는 케이블 상태가 아닌 광섬유 다발 (제9001호)\n(d) 케이블이 부착되지 않은 단순 커넥터 및 단자대 (제8535호 또는 제8536호)\n(e) 전선용 전기 절연 애자 (제8546호) 및 절연 재료제 튜브 (제8547호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.44 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
