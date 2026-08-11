const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8607",
  "titleKo": "86.07 - 철도용이나 궤도용 기관차나 차량의 부분품",
  "titleEn": "86.07 - Parts of railway or tramway locomotives or rolling-stock.",
  "contentKo": "이 호에는 제86.01호부터 제86.06호까지의 철도/궤도용 기관차 및 차량에 전용되거나 주로 사용되는 부분품(제17부 주규정에서 제외하지 않은 것)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 보기(bogie)대차 및 비셀보기(bissel-bogie) 대차 (구동식 및 비구동식 모두 포함)(제8607.11호, 제8607.12호).\n(2) 차축, 차륜(바퀴) 및 그 부분품(윤심 hub, 외륜/타이어 등) 및 축박스(axle-box, 저널 박스)와 그 하우징(제8607.19호).\n(3) 제동장치(브레이크 장치) 및 그 부분품 (공기식 브레이크, 진공 브레이크, 제동 쐐기 슈 shoe, 브레이크 실린더, 레버 등)(제8607.21호, 제8607.29호).\n(4) 연결기 및 완충기 : 드래프트 기어, 드로바, 연결용 훅, 스크루/체인식 및 자동 커플러, 차량간 연결통로(갱웨이)(제8607.30호).\n(5) 기타 부분품(제8607.91호, 제8607.99호) :\n- 언더프레임에 실리지 않은 대차 차체(body shell) 및 그 구성 부품(도어, 도어 프레임, 칸막이, 지주 stanchion, 런닝 보드, 수조 등).\n- 주조 프레임 및 프레임 부품(세로대 longeron, 가로대 cross-girder, 엑슬가이드 등).\n- 제동/가열 배관용 커플링 헤드(coupling head)가 부착된 파이프 어셈블리.\n- 대차(bogie) 현가용 유압식 쇼크업소버(shock-absorber).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전용 가공되지 않은 일반 형강(angle, shape), 강판(sheet/plate), 금속 튜브 및 배관재 (제15부)\n(b) 전동기, 발전기, 디젤 엔진 등 기계류 및 전기장치 자체 (제84류, 제85류)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.07 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
