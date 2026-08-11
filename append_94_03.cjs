const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9403",
  "titleKo": "94.03 - 그 밖의 가구와 그 부분품",
  "titleEn": "94.03 - Other furniture and parts thereof.",
  "contentKo": "이 호에는 제9401호(의자) 및 제9402호(의료/이발용 가구)에 속하지 않는 모든 종류의 가구(가정용, 사무실용, 학교용, 주방용, 점포용, 실험실용 등) 및 그 부분품을 분류한다. 원칙적으로 지상 거치용 가구에 한하며, 선반 가구/유닛 가구 등 주 제2호 예외 요건을 충족하는 것은 벽걸이/적층용도 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 금속제 사무실 가구(제9403.10호) 및 기타 금속 가구(제9403.20호) : 강철 캐비닛, 파일링 로커, 메탈 테이블, 공구 보관함.\n- 목제 사무실 가구(제9403.30호) : 목제 사무용 데스크, 회의용 탁자, 사무용 캐비닛.\n- 주방용 목제 가구(제9403.40호) : 주방용 찬장(dresser), 식기장, 싱크대용 목제 하부장(단독 제시품).\n- 침실용 목제 가구(제9403.50호) : 침대 프레임(장롱식/폴딩식/캠프 침대 포함), 옷장(wardrobe), 침대옆 테이블(협탁), 화장대.\n- 기타 목제 가구(제9403.60호) : 거실용 목제 사이드보드, 서가, 텔레비전 거치용 장식장, 피아노 의자용 스툴, 발판 스툴(foot-stool), 악보용 보면대.\n- 플라스틱제 가구(제9403.70호) : 사출 성형 플라스틱제 테이블, 선반, 캐비닛.\n- 기타 재질 가구(대나무 82호, 등나무 83호, 기타 89호) : 등/대나무제 바구니식 가구, 석재/도자제 테이블, 유리제 진열장.\n- 가구의 부분품(제9403.91~99호) : 가구용 목제 측판, 도어(door), 서랍, 가구 조립용 구조 금속 프레임.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 방도 기능 및 강화 벽을 가진 강철 금고 (제8303호)\n(b) 냉장고, 냉동고, 쇼케이스 냉장고 유닛 (제8418호) 및 재봉틀 전용 테이블/수납 가구 (제8452호)\n(c) 오디오, 비디오, 텔레비전 수신 기기 전용으로 설계 장착되는 캐비닛/랙 (제8518호, 제8522호, 제8529호)\n(d) 팬토그래프(축소제도기)가 기계식으로 영구 부착된 제도용 테이블 (제9017호)\n(e) 지상 거치용 대형 전신거울 및 피팅룸용 회전거울 (제7009호)\n(f) 침구 매트리스 및 매트리스 서포트(갈비살/프레임) (제9404호)\n(g) 조명 스탠드 램프 (제9405호) 및 당구대, 게임 전용 테이블 (제9504호)\n(h) 건물 벽에 짜넣어 영구 부착하도록 설계된 문틀, 창문, 미닫이 목제 판넬 (제4418호)\n(ij) 여행용 트렁크, 다목적 공구 보관 플라스틱 상자 (제4202호 또는 제3926호)" ,
  "contentEn": "This heading covers all furniture not specified or included in headings 94.01 and 94.02, and parts thereof, designed for placing on the floor or ground (with exceptions in Note 2).\n\nIt includes :\n- Metal office furniture (subheading 9403.10) and other metal furniture (subheading 9403.20) such as filing cabinets and workbenches.\n- Wooden office furniture (subheading 9403.30), kitchen furniture (subheading 9403.40), bedroom furniture (subheading 9403.50) including bed frames, and other wooden furniture (subheading 9403.60) such as sideboards and bookcases.\n- Plastics furniture (subheading 9403.70).\n- Bamboo (subheading 9403.82), rattan (subheading 9403.83), or other material (subheading 9403.89) furniture.\n- Parts of furniture (subheadings 9403.91 to 9403.99) including sideboards, drawer partitions, and drawer rails.\n\nExcludes burglar-proof safes (heading 83.03), refrigerator cabinets (heading 84.18), sewing machine furniture (heading 84.52), TV/Audio dedicated cabinets (headings 85.18, 85.22, 85.29), drafting tables with pantographs (heading 90.17), mattress supports (heading 94.04), and billiard tables (heading 95.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.03 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
