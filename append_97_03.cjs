const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9703",
  "titleKo": "97.03 - 오리지널 조각과 조상(彫像)(어떤 재료라도 가능하다)",
  "titleEn": "97.03 - Original sculptures and statuary, in any material.",
  "contentKo": "이 호에는 석재, 재생석, 목재, 금속(청동 등), 왁스, 상아, 점토(테라코타) 등 임의 재질을 깎거나 빚어서 만든 고대 및 현대의 오리지널 조각(sculpture) 및 조상(statuary)(반신상, 소상, 동물상 포함)과 점토제 최초 모델, 석고 모형을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 제작 후 100년 초과 골동조각(제9703.10호).\n- 100년 이하 기타 현대 오리지널 조각(제9703.90호).\n- 조작가에 의해 직접 제작된 원형 모델(마케트 maquette, 클레이폼 clay form) 및 이를 통해 처음 한정적으로 본을 떠서 만든 석고 모형(plaster model).\n- 오리지널 주조물 : 플라스터 모델로부터 직접 본떠서 주조해낸 한정된 소량의 청동상 또는 왁스 조각(일반적으로 복제 판본수가 12개 미만인 것에 한함). 주조품이라도 샌딩, 툴링 가공, 부식(녹청) 기법을 개별적으로 입히므로 각각 오리지널 예술품으로 인정한다.\n\n[오리지널 조각 판단 및 제외 기준]\n- 대량생산된 복제품(석고, 시멘트, 플라스틱 주조품 등), 상업적 디자인 공예품(상업 매장 장식품), 판에 박힌 기교로 양산된 종교용 소상 및 기념 장식품은 예술가가 도안했는지 불문하고 본 호에서 제외하여 재질별 호에 분류한다 (주 제4호).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 귀금속 또는 귀금속을 입힌 금속재료로 만든 신변장식용 브로치, 펜던트 등 (제7113호 또는 제7117호)\n(b) 목제 장식 조각품(예: 공예식 목조 상자) (제4420호)\n(c) 도자제 양산형 피규어, 인형 및 화병 (제6913호)\n(d) 비금속제 장식용 주조 불상, 종, 트로피 등 (제8306호)\n(e) 석제 양산 공예 조각품 (제6802호 또는 제6815호)" ,
  "contentEn": "This heading covers original sculptures and statuary (including busts, figurines, and groups) in any material (stone, metal, wood, wax, ivory, clay), divided into over 100 years old (subheading 9703.10) and others (subheading 9703.90).\n\nIt includes :\n- Sculptures carved directly by the artist from hard materials (marble, wood).\n- Clay models (maquettes, clay forms) and plaster models used as casting patterns.\n- Limited castings (typically fewer than 12 copies) of bronze, wax, or terracotta hand-finished, polished, or patinated by the artist.\n\nExcludes mass-produced replicas, commercial-character conventional crafts, and souvenirs (Note 4) (classified by material in headings 44.20, 68.02, 69.13, 83.06, etc.), and jewelry (heading 71.16 or 71.17)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.03 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
