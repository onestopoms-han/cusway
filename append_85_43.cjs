const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8543",
  "titleKo": "85.43 - 그 밖의 전기기기(이 류에 따로 분류되지 않은 것으로서 고유의 기능을 가진 것으로 한정한다)",
  "titleEn": "85.43 - Electrical machines and apparatus, having individual functions, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 제85류의 다른 호나 품목분류표 전체에서 달리 특별히 분류하지 않은, '고유의 기능(individual function)'을 가진 모든 전기기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 입자가속기(particle accelerator) : 하전입자(전자, 양자 등) 가속 장치 (반데그라프 가속기, 선형가속기, 사이클로트론 등. 단 엑스선 등 특정 방사선 촬영용 제9022호 제외).\n(2) 신호발생기(signal generator) : 임펄스 발생기, 패턴 발생기, 스윕 발생기(wobbulator) 등 지정 파형/진도의 전기신호 발생기.\n(3) 전기도금용, 전기분해용, 전기영동(electrophoresis)용 기기 (단, 제8486호 반도체 습식장비 및 제9027호 화학분석용 전기영동 기기 제외).\n(4) 전자담배 및 개인용 전기 기화장치 : 액체/겔/담배 플러그 등을 가열하여 연소 없이 기화 흡입을 유도하는 충전/카트리지 교환형 기기 본체.\n(5) 지뢰탐지기 및 금속탐지기 : 자속 변화를 이용한 금속 이물질 검출기 (매몰 배관 탐지기 포함).\n(6) 음향 믹서(mixing unit) 및 이퀄라이저 : 오디오 녹음/재생용 믹서 및 이퀄라이저 장비 (영화용 제9010호 제외).\n(7) 소음감쇠기(noise reduction unit) : 오디오 신호용 잡음 제거 장치.\n(8) 차량용/선박용 전열식 제상기(除霜機) 및 제무기(除霧機) (자동차용 제8512호 제외).\n(9) 기타 기기 :\n- 전기식 폭파기 (전기 뇌관 점화용 발파기).\n- 고주파/중간주파 증폭기 (안테나 부스터, 계측용 증폭기 등).\n- 손목시계, 그리팅 카드 등에 들어가는 전자 음악 모듈 (IC, 버저, 배터리가 결합된 멜로디 칩).\n- 일렉트릭 펜스 에너자이저 (전기 목책용 고전압 전원 공급기).\n- 리모컨 (적외선 원격 제어 조종기 단독 제시품).\n- 전자발광(EL) 시트, 플레이트, 패널 (황화아연 등 발광 물질이 절연체 및 도체층 사이에 샌드위치된 면광원).\n- 비행 기록 장치(FDR, 블랙박스) : 사고 대비 내화/내충격 설계된 디지털 비행 기록 전자 장치.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 일회용 전자담배 (충전/액체 공급이 불가능하며 내부 카트리지와 본체가 결합되어 폐기되는 것) (제2404호)\n(b) 전자담배용 교환용 액상 카트리지 및 니코틴 액상 (제2404호)\n(c) 이온주입기(ion implanter) 및 반도체/디스플레이용 PVD(물리기상증착) 설비 (제8486호)\n(d) 스마트카드 및 RFID/NFC 프록시미티 태그 카드 (제8523호)\n(e) 일반 흡연용 파이프 및 비전기식 파이프 (제9614호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.43 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
