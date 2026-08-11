const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8539",
  "titleKo": "85.39 - 필라멘트램프나 방전램프[실드빔 램프유닛(sealed beam lamp unit)과 자외선램프나 적외선램프를 포함한다], 아크램프, 발광다이오드(엘이디) 광원",
  "titleEn": "85.39 - Electric filament or discharge lamps, including sealed beam lamp units and ultra-violet or infra-red lamps; arc-lamps; light-emitting diode (LED) light sources.",
  "contentKo": "이 호에는 광선을 발생시키기 위한 전기식 필라멘트 전구, 방전램프, 자외선/적외선 램프, 아크램프, 발광다이오드(LED) 모듈 및 LED 램프를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 실드빔 램프유닛(sealed beam lamp unit)\n- 주로 자동차 헤드라이트용으로 렌즈, 반사경 및 필라멘트가 일체형으로 완전히 밀봉된 전구 유닛.\n(B) 필라멘트 램프 (백열전구)\n- 필라멘트에 전류를 통하여 백열 상태로 빛을 내는 텅스텐 할로겐 램프, 일반 가전용/장식용 백열전구 등.\n(C) 방전램프(discharge lamp)\n- 전극 사이의 가스/증기 방전작용으로 발광하는 램프 (형광등, 네온사인용 네온관, 수은/나트륨 증기 램프, 메탈할라이드 램프, 크세논 램프 등).\n(D) 자외선 램프 및 적외선 램프\n- 자외선 램프 : 의료용, 살균용, 분석용, 블랙라이트 램프 등.\n- 적외선 램프 : 의료용 또는 공업용 가열원으로 특별히 설계된 필라멘트 백열전구(구리/은 반사막 도포형 포함).\n(E) 아크램프(arc-lamp)\n- 탄소나 텅스텐 전극 사이의 아크 방전 및 전극의 백열로 발광하는 램프.\n(F) 발광다이오드(LED) 모듈 및 램프\n- LED 모듈 : PCB에 장착된 하나 이상의 LED와 전력 제어 장치(SMPS 회로 등)로 구성된 모듈 (램프 베이스 소켓 캡은 없음).\n- LED 램프 : LED와 구동 회로 및 소켓 연결용 캡(베이스 - 나사식, 바이핀식 등)이 결합된 완제품 램프.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다. 필라멘트 전구용 받침(베이스), 방전관용 금속전극 등을 포함한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전구용 유리구 및 spotlight 반사경 유리 부분품 (제7011호)\n(b) 탄소 저항램프 (제8533호)\n(c) 형광등용 스타터 (글로우 스타터 스위치) (제8536호)\n(d) 개별 발광다이오드(LED) 소자 단독 제시품 (제8541호)\n(e) 전자발광(EL) 시트, 플레이트, 패널 (제8543호)\n(f) 아크램프용 탄소 전극 (제8545호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.39 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
