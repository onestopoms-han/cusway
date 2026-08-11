const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9029",
  "titleKo": "90.29 - 적산(積算)회전계ㆍ생산량계ㆍ택시미터ㆍ주행거리계ㆍ보수계와 이와 유사한 계기, 속도계와 회전속도계(제9014호나 제9015호의 것은 제외한다), 스트로보스코프(stroboscope)",
  "titleEn": "90.29 - Revolution counters, production counters, taximeters, mileometers, pedometers and the like; speed indicators and tachometers, other than those of heading 90.14 or 90.15; stroboscopes.",
  "contentKo": "이 호에는 회전수/생산량/거리/요금을 지시하는 기계식/전기식 적산 카운터(계기), 차량/기계 작동 속도를 측정하는 속도계/회전속도계(타코미터), 고속 회전체를 정지 상태로 보이게 해 속도를 측정하는 스트로보스코프 및 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 적산회전계, 생산량계, 택시미터, 주행거리계, 보수계 등(제9029.10호) :\n  - 적산회전계(revolution counter) : 축, 모터의 회전수를 카운트하는 눈금/드럼식 기계/전기식 계기.\n  - 생산량계(production counter) : 방직기 실 길이 측정용, 컨베이어 이송 수량, 인쇄 매수(인쇄기) 적산용 계기(광전관식 포함), 유선 전화 교환기용 통화 횟수 적산계.\n  - 작동시간 기록계(time/hour meter) : 기계/전동기 작동 누적 시간 카운터(시계 무브먼트 없는 것에 한함).\n  - 입장객 적산계(게이트 카운터), 휴대용 수동 버튼 카운터(hand-held counter), 기계식 당구 점수 기록계(billiards meter).\n  - 택시미터(taximeter) : 시간/거리 병산식 요금 지시장치.\n  - 주행거리계(mileometer) : 자동차/자전거용 휠 회전축 연동형 거리 적산계.\n  - 보수계(pedometer) : 신체 진자 진동을 이용한 대략의 걸음 수/보행거리 계측기.\n- 속도계, 회전속도계, 스트로보스코프(제9029.20호) :\n  - 속도계(speedometer) 및 회전속도계(tachometer) : 자동차/오토바이/기관차용 속도계, 모터/터빈용 RPM 회전속도계.\n    - 구동 원리 : 시계식, 원심식, 진동식(진동 리드형), 전자기 유동식(와전류 원반식), 전기식(광전관/임펄스형).\n  - 스트로보스코프(stroboscope) : 섬광(flash)을 회전체 주기에 동조 투사하여 정지상태로 보이게 해 속도를 계측하는 스트로보스코프식 회전속도계(stroboscopic tachometer) 및 의료용 성대 진동 시험용 스트로보스코프.\n- 부분품과 부속품(제9029.90호) : 속도계용 주행 케이블, 카운터용 복귀 기어, 눈금 다이얼 판, 스트로보스코프용 가스방전 벌브.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 항공기용 비행 속도계, 마하미터, 가속도계 및 자동 조종 장치 (제9014호)\n(b) 선박 항해용 선박 속도계(log) 및 초음파 소나 (제9014호)\n(c) 기상용 풍속계(anemometer) 및 라디오존데 (제9015호)\n(d) 가스, 액체, 전기 등의 공급 누적량 계량기(가스/수도/전기 계량기) (제9028호)\n(e) 지형도 작성용 곡선계(planimeter) 및 제도용 지도 거리 측정기(opisometer) (제9017호)\n(f) 시계 무브먼트(동축 기어)가 내장된 조업시간 기록계 및 당구장 전용 시간 요금계산기 (제9106호)\n(g) 당구 스코어용 단순 목재 슬라이딩 보드 (제9504호)\n(h) 적산 카운터가 장착된 섬유 시험용 권취 릴 (제9031호)" ,
  "contentEn": "This heading covers revolution counters, production counters, taximeters, mileometers, pedometers, and other integrating counters; speed indicators and tachometers (other than those of heading 90.14 or 90.15); and stroboscopes.\n\nIt includes :\n- Integrating counters (subheading 9029.10) including shaft revolution counters, manufacturing production counters (including photoelectric and electromagnetic telephone call counters), hour meters (without clock movements), gate entry counters, mechanical billiards meters (scoring rollers), hand-held tally counters, taximeters, mileometers (odometers), and pedometers.\n- Speed indicators, tachometers, and stroboscopes (subheading 9029.20) including automotive speedometers, RPM indicators (centrifugal, magnetic induction, bimetallic, or electrical), tachometric recorders, and stroboscopes (constant illumination or flash-type stroboscopic tachometers).\n- Parts and accessories (subheading 9029.90).\n\nExcludes aeronautical air-speed indicators, Mach-meters, and accelerometers (heading 90.14), marine logs (heading 90.14), anemometers (heading 90.15), gas/liquid/electricity supply meters (heading 90.28), planimeters/opisometers (heading 90.17), clockwork-driven time registers (heading 91.06), and slide-rule billiard scorers (heading 95.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.29 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
