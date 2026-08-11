const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8533",
  "titleKo": "85.33 - 전기저항기[가감저항기(rheostat)와 전위차계(potentiometer)를 포함하며, 전열용 저항체는 제외한다]",
  "titleEn": "85.33 - Electrical resistors (including rheostats and potentiometers), other than heating resistors.",
  "contentKo": "이 호에는 회로에 전기저항을 부여하는 고정식, 가변식 저항기 및 가감저항기, 전위차계를 분류한다. 단, 전열용 저항체는 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 고정식 저항기 (Resistors)\n- 탄소 피막형 저항기 (콤퍼지션형, 필름형 등).\n- 금속 봉/필름/와이어 저항기, 금속산화물 필름 저항기, 세라믹 유전체 기반의 인쇄저항기.\n- 유침식 저항기.\n- 탄소저항램프 : 조명용 전구와 비슷하지만 저항기로 작동하는 탄소 필라멘트 장치 (조명용 전구 제8539호 제외).\n- 버레터(barretter) : 수소/헬륨 튜브 내에 든 철 필라멘트식 정전류 소자.\n- 표준 저항기 및 정밀 저항상자 (실험실/측정용).\n- 비선형 저항기 : 서미스터(온도 의존성 저항기, NTC/PTC), 바리스터(VDR, 전압 의존성 저항기, 단 바리스터 다이오드 제8541호 제외).\n- 스트레인 게이지(strain gauge) : 물체의 변형률을 저항 변화로 변환하는 센서용 저항 소자.\n(B) 가감저항기 (Rheostats)\n- 슬라이딩 브러시/커서 등으로 저항값을 변경할 수 있는 가변저항기 (슬라이드형 가감저항기, 로터리 가감저항기, 전동기 제어용 시동기/조광기 등 포함).\n(C) 전위차계 (Potentiometers)\n- 고정된 저항기 양단자 및 가동 접촉자 단자를 구비하여 전압 분배용으로 사용되는 가변저항기(포텐셔미터).\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품(코어, 가동 브러시 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전열용 저항체 (제8516호 또는 제8545호)\n(b) 광전도 셀 및 황화카드뮴(CdS) 등의 광의존 저항기(LDR) (제8541호)\n(c) 바리스터 다이오드 (제8541호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.33 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
