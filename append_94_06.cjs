const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9406",
  "titleKo": "94.06 - 조립식 건축물(+)",
  "titleEn": "94.06 - Prefabricated buildings.",
  "contentKo": "이 호에는 공장에서 주요 부재(벽체, 기둥, 지붕틀 등)를 사전 제작하여 현장에서 볼트나 핀 등으로 신속하게 조립할 수 있게 설계된 조립식 건축물(Prefabricated buildings)을 분류한다. 완전 조립된 이동식 하우스 및 내부가 사전 장착된 컨테이너 규격의 강철제 모듈화 빌딩 유닛을 포함한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 나무로 만든 것(제9406.10호) : 주요 골조, 외벽, 바닥, 기둥 등이 주로 목재로 구성된 조립식 가옥/목조 주택.\n- 모듈화된 빌딩 유닛(강철제의 것에 한함)(제9406.20호) : 표준 선적 컨테이너 크기 및 형태의 강철제 모듈 구조로서, 내부에 바닥, 천장, 단열재, 배선, 배관, 창문 등이 완전/대체적으로 조립 장착된 구조적 독립형(self-supporting) 유닛(영구 건물 조립용 모듈).\n- 기타(제9406.90호) : 철강제 샌드위치 판넬 주택, 알루미늄제 온실, 세라믹/콘크리트 조립식 초소 및 헛간, 미조립(플랫팩 flat pack) 상태의 강철제 조립식 가옥.\n\n[주요 분류 및 동반 분류 기준]\n- 조립식 건물과 동시에 제시되는 내장 붙박이 설비(전기배선, 콘센트, 스위치, 보일러, 방열기, 욕조, 샤워기, 싱크대, 벽장 가구 등)는 해당 건물과 함께 본 호로 일괄 분류한다.\n- 조립 및 고정용 보조 재료(못, 접착제, 전선, 파이프, 페인트, 벽지 등)가 건물과 동반하여 적정 수량으로 제시되는 경우 조립식 건물로 함께 일괄 분류한다.\n- 섀시(바퀴 축)가 장착되어 견인 차량으로 상시 이동 가능한 이른바 캐러밴/이동 주택(mobile home)은 제외하여 제87류(제8716호 등)에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단독으로 제시되는 조립식 건축물의 부분품(샌드위치 판넬 단독, 목제 대들보 단독, 섀시 등) (건물 구성 부품이라도 각 재질별 호에 분류)\n(b) 선적 컨테이너 규격이지만 내장 인테리어가 전혀 없고 단순 화물 운송용으로만 쓰이는 컨테이너 (제8609호)" ,
  "contentEn": "This heading covers prefabricated buildings (industrialised buildings) of any material, presented fully assembled, unassembled, or incomplete but having the essential character of a prefabricated building.\n\nIt includes :\n- Prefabricated buildings of wood (subheading 9406.10) where main structural elements, walls, or floors are primarily made of wood.\n- Modular building units of steel (subheading 9406.20) presented in standard shipping container sizes, self-supporting, and substantially pre-fitted internally with walls, plumbing, and wiring for assembling permanent modular buildings.\n- Other prefabricated buildings (subheading 9406.90) including steel sandwich-panel structures, aluminum greenhouses, and concrete prefab sheds.\n- Built-in appliances, sanitary fittings, and electrical fixtures presented together with the buildings.\n\nExcludes separate elements of prefabricated buildings presented individually (classified by material), mobile homes with permanent trailer chassis (Chapter 87), and empty shipping cargo containers (heading 86.09)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.06 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
