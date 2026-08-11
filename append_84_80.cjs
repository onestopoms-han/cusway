const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8480",
  "titleKo": "84.80 - 금속 주조용 주형틀, 주형 베이스, 주형 제조용 모형, 금속[잉곳(ingot)용은 제외한다]ㆍ금속탄화물ㆍ유리ㆍ광물성 물질ㆍ고무ㆍ플라스틱 성형용 주형",
  "titleEn": "84.80 - Moulding boxes for metal foundry; mould bases; moulding patterns; moulds for metal (other than ingot moulds), metal carbides, glass, mineral materials, rubber or plastics.",
  "contentKo": "이 호에는 금속 주조에 사용하는 주형틀, 주형베이스, 주형 제조용 모형을 포함한다. 또한 금속, 금속탄화물, 유리, 광물성 물질, 고무, 플라스틱 성형용 주형(경첩 유무 무관, 수동/프레스/성형기용 포함)을 분류한다.\n중요한 기능은 재료를 미리 정해진 형태로 유지하여 고정시키는 것이며, 단순 타격/압축에 의해서만 형상화하는 제8207호의 스탬핑 다이(stamping die)는 제외한다.\n\n이 호에는 다음의 것을 포함한다.\n(A) 금속 주조용 주형틀(moulding box) : 사형(砂型)을 유지하는 철제 또는 강철제 틀(frame).\n(B) 주형 베이스(moulding base) : 주형 밑바닥에 놓는 판.\n(C) 주형 제조용 모형(moulding pattern) : 사형 준비에 사용하는 모형, 코어(core), 심상자, 모형판 등 (주로 목재).\n(D) 금속[잉곳(ingot)용 제외]이나 금속탄화물 성형용 주형\n(1) 냉각 주형 (다이캐스트)\n(2) 압력 주조용 주형 (다이캐스팅 금형)\n(3) 금속가루 소결용 주형 (가열 소결용)\n(4) 원심주조기용 원통형 주형 (철관, 총신 주조용)\n(E) 유리 성형용 주형\n(1) 유리 블록, 벽돌, 타일 성형용 주형\n(2) 병 성형용 주형 (블랭크용, 완성가공용, 링용)\n(3) 중공 유리제품, 유리 애자 성형용 주형\n(4) 렌즈, 안경 블랭크 제조용 강철/주철 주형\n(F) 광물성 물질 성형용 주형\n(1) 점토/세라믹 벽돌, 관 성형용 주형 (의치용 포함)\n(2) 콘크리트, 시멘트, 석면시멘트 성형용 주형 (관, 조, 슬라브, 철도 침목 등)\n(3) 연마재 응결용 주형 (그라인딩 휠 제조용)\n(4) 석고, 스태프, 치장벽토 성형용 주형 (완구, 조각상 등)\n(G) 고무나 플라스틱 성형용 주형\n(1) 타이어 가황용 \"블래더(bladder)\" 주형\n(2) 고무 제품 가황 성형용 주형\n(3) 플라스틱 제품 제조용 주형 (사출, 압축, 중력 작동식)\n(4) 원료 태블릿 예비성형용 냉간 주형\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 액체 고무/플라스틱 침지용 형 (재질에 따라 분류)\n(b) 흑연/탄소제 주형 (제6815호)\n(c) 도자제 주형 (제6903호 또는 제6909호)\n(d) 유리제 주형 (제7020호)\n(e) 제철/제강용 잉곳(ingot) 주형 (제8454호)\n(f) 반도체 디바이스 제조용 주형 (제8486호)\n(g) 레코드 제조용 원반 및 금형 마스터 (제8523호)",
  "contentEn": "This heading covers moulding boxes for metal foundry, mould bases, moulding patterns and moulds for metal (other than ingot moulds), metal carbides, glass, mineral materials, rubber or plastics.\n\nIt includes :\n(I) Moulding boxes (flasks) and mould bases.\n(II) Moulding patterns (wooden or metal patterns, core boxes, moulding boards).\n(III) Moulds for metal or metal carbides (die-casting moulds, sintering moulds, centrifugal casting moulds).\n(IV) Moulds for glass (bottle moulds, lens moulds, glass block/tile moulds).\n(V) Moulds for mineral materials (brick moulds, concrete pipe moulds, plaster casting moulds).\n(VI) Moulds for rubber or plastics (tyre vulcanising moulds, plastics injection/compression moulds).\n\nThe heading excludes :\n(a) Stamping dies of heading 82.07.\n(b) Graphite or other carbon moulds (heading 68.15).\n(c) Ceramic moulds (heading 69.03 or 69.09) and glass moulds (heading 70.20).\n(d) Ingot moulds of heading 84.54.\n(e) Moulds for semiconductor devices (heading 84.86).\n(f) Gramophone record stampers (heading 85.23)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.80 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
