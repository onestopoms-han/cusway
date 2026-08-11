const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8805",
  "titleKo": "88.05 - 항공기 발진장치, 갑판 착륙장치나 이와 유사한 장치, 지상비행 훈련장치, 이들의 부분품",
  "titleEn": "88.05 - Aircraft launching gear; deck-arrestor or similar gear; ground flying trainers; parts of the foregoing articles.",
  "contentKo": "이 호에는 지상/항공모함 등에서 항공기를 발진시키거나 안전 착륙을 보조하는 특수 기계 장치와 조종사 비행 훈련용 지상 시뮬레이터 및 이들의 부분품을 분류한다.\n\n이 호에는 다음의 세 가지 종류 물품을 포함한다.\n(A) 항공기 발진장치(catapult launcher)(제8805.10호) : 선박(항공모함) 등에서 압축공기, 증기, 화약 폭발력을 이용하여 항공기 이륙을 돕는 유도 발진 시설.\n(B) 갑판 착륙장치(deck-arrestor gear)(제8805.10호) : 착륙 거리를 단축시키기 위해 강선 케이블 및 유압 제동 시스템으로 구성된 착륙 어레스터 장치.\n(C) 지상비행 훈련장치(ground flying trainer)(제8805.21~29호) :\n- 비행 시뮬레이터(flight simulator) 및 모의공중전장치(air combat simulator)(제8805.21호) : 계기 및 가상 환경을 모사하여 훈련 기회를 제공하는 전자/기계식 모의 전투/비행 장치.\n- 링크식 훈련기(link trainer)(제8805.29호) : 회전식 스탠드 위에 장착된 비행기 조종석 모양의 모의 훈련기.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 글라이더 발사용 모터 구동식 윈치 기어 (제8425호)\n(b) 자체 동력 로켓의 단순 안내용 발사 가이드 타워/램프 (제8479호)\n(c) 안전 착륙망(net) 및 로프 (재질에 따라 분류)\n(d) 고가속도/산소결핍 시 우주 비행사 인체 반응 테스트용 원심분리기 챔버 (제9019호)\n(e) 일반 승무원 교육용 자이로스코프 모형 및 전시용 장치 (제9023호)\n(f) 자동차 섀시나 트레일러 차량 위에 탑재된 이동식 시뮬레이터 (제8705호 또는 제8716호)" ,
  "contentEn": "This heading covers aircraft catapult launch gear, aircraft deceleration arrestor gear used on carriers or airfields, and ground flying simulators for pilot training, along with their parts.\n\nIt includes :\n- Aircraft launching gear (catapults) using compressed air, steam, or pyrotechnics (subheading 8805.10).\n- Deck-arrestor or similar gear for catching landing aircraft (subheading 8805.10).\n- Ground flying trainers (subheadings 8805.21 and 8805.29) including electronic flight simulators, air combat simulators (subheading 8805.21), and mechanical link trainers.\n- Parts and accessories suitable for use solely or principally with the above items.\n\nExcludes glider launchers of heading 84.25, rocket launching ramps of heading 84.79, astronaut training centrifuges testing human physiological responses (heading 90.19), and simulator units mounted on truck or trailer chassis (heading 87.05 or 87.16)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.05 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
