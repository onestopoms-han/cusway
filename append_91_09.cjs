const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9109",
  "titleKo": "91.09 - 클록 무브먼트(clock movement)(완전한 것으로서 조립된 것으로 한정한다)",
  "titleEn": "91.09 - Clock movements, complete and assembled.",
  "contentKo": "이 호에는 케이스가 없이 완전히 조립되어 바로 작동할 수 있는 상태의 클록 무브먼트(clock movement)(대형 시계용 무브먼트)를 분류한다. 이 호에 분류되는 무브먼트는 휴대용 시계 무브먼트 규격(두께 12mm 이하 및 가로/세로/직경 50mm 이하)을 초과하는 대형 무브먼트이거나, 조정장치가 없는 동기전동기식 무브먼트 등이어야 한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기구동식 클록 무브먼트(제9109.10호) : 배터리/쿼츠 구동식 대형 클록 무브먼트, AC 주전원 동기전동기식 무브먼트, 모시계 제어 보조시계용 무브먼트.\n- 기타 클록 무브먼트(기계식 태엽/추)(제9109.90호) : 진자(추)로 제어되는 무브먼트, 태엽 작동식 대형 기계식 클록 무브먼트.\n\n[주요 사항]\n- 동기전동기 또는 보조시계용 무브먼트가 이 호에 분류되려면 전동기/전자석 외에 기어 휠 전달장치와 시침/분침 구동용 피니언이 완전히 결합된 조립품이어야 한다. 감속 기어만 부착되고 기어 휠 지시장치가 없는 전동기 단독 제시는 이 호에서 제외되어 85류로 분류된다.\n- 91류 완제품 시계뿐만 아니라 타 류 기기(기록 장치, 폭발 장치, 정밀 계측 기기 등)의 지시 타이머용으로 사용되는 대형 클록 무브먼트도 본 호에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 주 제3호 규격을 충족하는 휴대용 시계의 완제 조립 무브먼트 (제9108호)\n(b) 조립되지 않은 상태의 미완성 클록 무브먼트 (제9110호)\n(c) 탈진기가 결합되지 않고 단순히 오르골(뮤직 박스) 등을 돌려주는 태엽/추 모터 (제8412호)" ,
  "contentEn": "This heading covers clock movements (larger than the watch movements of heading 91.08, or synchronous motor movements without regulating systems) that are complete and assembled, presented without cases.\n\nIt includes :\n- Electrically operated clock movements (subheading 9109.10) including mains synchronous or battery-powered quartz clock movements.\n- Other clock movements (mechanical winding/weights) (subheading 9109.90) including pendulum-driven movements.\n\nNote: Synchronous or secondary movements must contain the gear train and motion work to fall here. Separate synchronous motors with reduction gears alone are excluded."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.09 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
