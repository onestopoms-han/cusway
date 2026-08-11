const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8807",
  "titleKo": "88.07 - 제8801호ㆍ제8802호ㆍ제8806호 물품의 부분품",
  "titleEn": "88.07 - Parts of goods of heading 88.01, 88.02 or 88.06.",
  "contentKo": "이 호에는 제8801호(무동력 항공기/기구), 제8802호(유인 동력 항공기/우주선), 제8806호(무인기/드론)에 전용되거나 주로 사용되는 전용 부분품(제17부 주규정 제외 대상 제외)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 프로펠러, 로터(rotor)와 이들의 부분품(제8807.10호) : 블레이드(깃), 허브, 피치 조정 기구(pitch control mechanism).\n- 이착륙장치(랜딩 기어)와 그 부분품(제8807.20호) : 이착륙용 바퀴(타이어 장착 여부 무관), 브레이크 장치, 인입식 실린더 작동 기어, 이착륙용 스키, 수상비행기용 플로트(float).\n- 비행기, 헬리콥터, 무인기(드론)의 기타 부분품(제8807.30호) :\n  - 동체(fuselage), 기체(hull) 및 구성 섹션(칸막이, 바닥, 문, 레이돔 radome, 테일콘 tail cone, 계기반 프레임).\n  - 날개(wing) 및 구성 부품(날개보 spar, 리브 rib, 크로스 멤버).\n  - 조종익면(control surfaces) : 에일러론(aileron), 플랩(flap), 슬랫(slat), 스포일러(spoiler), 승강타(elevator), 방향타(rudder).\n  - 엔진 덮개(cowling), 엔진 나셀/격납실, 파일론(pylon).\n  - 조종간(control column), 방향타 바(rudder-bar) 및 관련 조종 레버.\n  - 기체 내장형 및 보조 연료 탱크.\n- 기타 우주선 및 기구/비행선용 부분품(제8807.90호) :\n  - 기구용 바구니(나셀 nacelle), 기낭(envelope) 및 가죽 패널.\n  - 인공위성/우주선 바디 쉘, 전력 공급용 태양광 패널 지지 프레임 구조물.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 제8407호/제8408호의 제트엔진, 터보프로프 및 내연기관 피스톤 엔진 (제8411호 또는 제8408호)\n(b) 고무제 타이어 및 튜브 (제4011호, 제4013호)\n(c) 조종석 유리창으로서 테두리 틀이 부착되지 않은 강화/합성 유리 (제7007호)\n(d) 발전기, 축전지, 비행 제어용 온보드 컴퓨터, 레이더, 트랜스폰더 (제85류 또는 제90류)" ,
  "contentEn": "This heading covers parts suitable for use solely or principally with the balloons, dirigibles, gliders, aeroplanes, helicopters, spacecraft, or unmanned aircraft (drones) of headings 88.01, 88.02, or 88.06, provided they are not excluded by Section XVII Notes.\n\nIt includes :\n- Propellers, rotors, and parts thereof (subheading 8807.10) including blades, hubs, and pitch control mechanisms.\n- Under carriages (landing gear) and parts thereof (subheading 8807.20) including wheels (with or without tyres), retracting mechanisms, landing skis, and floats for seaplanes.\n- Other parts of aeroplanes, helicopters, or unmanned aircraft (subheading 8807.30) including fuselages, hulls, wings, spars, ribs, ailerons, flaps, spoilers, rudders, engine cowlings, pylons, control columns, and built-in/auxiliary fuel tanks.\n- Parts of balloons, dirigibles, or spacecraft (subheading 8807.90) including nacelles (baskets), envelopes, and spacecraft structural shells.\n\nExcludes aircraft engines (heading 84.08 or 84.11), rubber tyres (heading 40.11), unframed safety glass (heading 70.07), and electronic navigation systems/radar (Chapter 85 or 90)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.07 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
