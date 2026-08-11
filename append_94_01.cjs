const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9401",
  "titleKo": "94.01 - 의자(침대로 겸용할 수 있는지에 상관없며 제9402호의 것은 제외한다)와 그 부분품(+)",
  "titleEn": "94.01 - Seats (other than those of heading 94.02), whether or not convertible into beds, and parts thereof.",
  "contentKo": "이 호에는 마루나 지면에 놓고 사용하는 모든 의자(좌석, 벤치, 소파, 걸상 등)와 비행기, 차량 등 운송수단에 고정하는 의자 및 이들의 전용 부분품을 분류한다. 침대로 겸용할 수 있는 쇼파/베드도 이 호에 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 항공기용 의자(제9401.10호) 및 차량용 의자(제9401.20호) (유아용 차량 안전 카시트 포함 - 제9401.80호 소호해설 참조).\n- 높이 조절식 회전의자(제9401.31~39호) : 액압/가스 실린더 또는 나사산으로 조절하는 회전식 의자(목재제 31호, 금속/기타 39호).\n- 침대 겸용 의자(제9401.41~49호) : 베드 소파 등 침대로 변형 가능한 의자(가든용/캠핑용 제외).\n- 등나무, 버드나무, 대나무 등 천연 식물성 재료로 만든 의자(제9401.52~59호).\n- 기타 목재 프레임 의자(제9401.61~69호) 및 기타 금속 프레임 의자(제9401.71~79호) :\n  - 61호, 71호 : 속, 스프링, 커버를 댄 의자(upholstered seats - 스펀지, 동물의 털 등을 대고 직물/가죽으로 마감한 것).\n  - 69호, 79호 : 커버를 대지 않은 생 목재/메탈 프레임 의자.\n- 기타 의자(제9401.80호) : 플라스틱제 의자, 석재/도자제 의자, 유아용 안전 카시트.\n- 의자의 부분품(제9401.91~99호) : 등받이, 안장판, 팔걸이, 고정식 가구 커버, 속용으로 조립된 나선형 스프링.\n\n[주요 분류 기준]\n- 의자 내부에 앰프, 스피커, 마사지 진동 모터, 조명 장치 등이 보조 기능으로 부착되어 있는 음악 감상용/게임용 의자 등도 이 호에 분류한다.\n- 단독 제시되는 소파용 쿠션 및 느슨한 매트리스는 이 호에서 제외하여 제9404호에 분류하나, 의자 프레임 본체와 결합된 상태로 제시되는 경우에는 9401호로 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 발을 올려놓는 단순 스툴 및 발판대, 수납함 겸용 벤치 (제9403호)\n(b) 의료용/치과용/이발사용 특수 조절 의자 (제9402호)\n(c) 자전거/오토바이용 안장 (제8714호)\n(d) 보행용 지팡이 겸용 접이식 의자(시트 스틱) (제6602호)\n(e) 일반 디딤대/사다리 (재질에 따라 4421호 또는 7326호)" ,
  "contentEn": "This heading covers seats of all kinds (including convertible sofas, vehicle and aircraft seats) designed for placing on the floor or ground, and their parts.\n\nIt includes :\n- Aircraft seats (subheading 9401.10) and vehicle seats (subheading 9401.20) including infant/toddler car safety seats (9401.80).\n- Swivel seats with variable height adjustment (subheadings 9401.31 to 9401.39).\n- Seats convertible into beds (subheadings 9401.41 to 9401.49).\n- Bamboo, rattan, or cane seats (subheadings 9401.52 to 9401.59).\n- Wooden framed seats (subheadings 9401.61 to 9401.69) and metal framed seats (subheadings 9401.71 to 9401.79), subdivided into upholstered (61, 71) and others (69, 79).\n- Other seats (subheading 9401.80) including plastics or stone seats.\n- Parts of seats (subheadings 9401.91 to 9401.99) including backs, seat bottoms, and pre-assembled spring units.\n\nExcludes medical/dentist chairs (heading 94.02), separate loose cushions (heading 94.04), toy seats (heading 95.03), and bicycle saddles (heading 87.14)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.01 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
