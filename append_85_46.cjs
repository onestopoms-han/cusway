const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8546",
  "titleKo": "85.46 - 애자(어떤 재료라도 가능하다)",
  "titleEn": "85.46 - Electrical insulators of any material.",
  "contentKo": "이 호에는 전선 등의 도체를 지지, 고정, 안내함과 동시에 대지나 지지 구조물(철탑, 전신주)로부터 전기적으로 절연시키기 위한 전기용 애자(insulator)를 분류한다. 재료의 종류(유리, 자기, 도자, 플라스틱 등)에 관계없이 모두 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 현수형 애자 (Suspension Insulators)\n- 송배전선로의 철탑 암이나 가공 가선에 매달아 도체 케이블을 지지하는 애자 (캡형, 후드형, 이중 페티코트형, 체인 현수식 애자, 현수용 풀리 등).\n(B) 고정형 애자 (Rigid Insulators)\n- 핀, 스크루, 볼트 등으로 전신주, 벽, 천장 등에 직접 고정하여 전선을 지지하는 애자 (핀 애자, 라인포스트 애자, 원통형/원추형 애자, 단추형 애자 등).\n(C) 인입선용 애자 (Leading-in Insulators/Bushings)\n- 벽이나 기기 내부(예: 변압기 외함)로 전선을 통과시킬 때 통과 부위와의 절연을 유지하는 인입관 형태의 애자 (원추형 슬리브, 부싱 쉘 등).\n\n애자 자체에는 설치를 위해 성형/조립 중에 부착된 금속제 지지용 브래킷, 클램프, 핀, 횡목 등이 부착되어 있을 수 있다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전선용 가요성/금속 피복 전기 절연 튜브 및 그 연결구류 (제8547호)\n(b) 피뢰기로 작동하도록 금속 방전 혼(horn)이나 스파크 갭 보호 장치가 통합된 복합 애자 (제8535호)\n(c) 전기기기 내부에 절연성 향상만을 위해 장착되는 판, 튜브 등의 단순 절연 부품 (접속 및 장착용 스크루 홈이 몰딩 시 소량 포함된 것 포함) (제8547호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.46 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
