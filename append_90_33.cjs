const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9033",
  "titleKo": "90.33 - 제90류의 기계ㆍ기기ㆍ장치ㆍ장비용 부분품과 부속품(이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "90.33 - Parts and accessories (not specified or included elsewhere in this Chapter) for machines, appliances, instruments or apparatus of Chapter 90.",
  "contentKo": "이 호에는 제90류(광학, 측정, 검사, 정밀, 의료용 기기) 기기용 부분품 및 부속품으로서, 다른 특정 호에 열거되지 않고 주 제1호 및 제2호에 의해 제외되지 않은 잔여(기타) 부분품과 부속품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 특정 90류 기기에 전용되거나 주로 사용되지 않고 여러 호의 기기에 광범위하게 쓰이거나, 다른 호로 특게되지 않은 정밀 기기용 브래킷, 하우징, 지지대, 기계식 기어 프레임, 눈금 지침 지시장치 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 광학적으로 연마되지 않은 유리 광학 소자 (제70류)\n(b) 고무 패킹/개스킷 (제4016호), 가스미터용 가죽 격막 (제4205호), 방직용 섬유제 여과포 (제5911호)\n(c) 비금속제 나사, 볼트, 스프링 등 범용성 부분품 (제15부) 또는 플라스틱제 범용성 부분품 (제39류)\n(d) 단독 제시되는 진공펌프 (제8414호), 콕/밸브 (제8481호), 전동기 (제8501호), 변압기 (제8504호), 영구자석 (제8505호), 축전지 (제8507호), 헤드폰 (제8518호), 커패시터 (제8532호), 고정/가변 저항기 (제8533호), 스위치/계전기 (제8536호), 반도체/IC (제8541호 또는 제8542호)\n(e) 광학용 렌즈/프리즘/필터 (제9001호 또는 제9002호)\n(f) 시계용 무브먼트(오르골용 포함) (제9108호 또는 제9109호)\n(g) 특정 기기에 전용/주용되는 부분품으로서 해당 기기와 함께 분류되는 것 (예: 제9018호의 의료기기용 부분품, 제9031호의 CMM용 프로브 등)" ,
  "contentEn": "This heading covers parts and accessories for machines, appliances, instruments or apparatus of Chapter 90, which are not specified or included elsewhere in the Chapter and not excluded by Note 1 or 2 to Chapter 90.\n\nIt acts as a residual heading for Chapter 90 parts and accessories.\n\nExcludes non-optically worked glass elements (Chapter 70), rubber gaskets (heading 40.16), leather diaphragms for gas meters (heading 42.05), textile filters (heading 59.11), parts of general use (screws, springs of base metal - Section XV, or plastics - Chapter 39), separate pumps (heading 84.14), taps/valves (heading 84.81), motors (heading 85.01), resistors (heading 85.33), optical elements (heading 90.01 or 90.02), and watch movements (heading 91.08 or 91.09)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.33 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
