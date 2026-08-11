const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8531",
  "titleKo": "85.31 - 전기식 음향이나 시각 신호용 기기(예: 벨ㆍ사이렌ㆍ표시반ㆍ도난경보기ㆍ화재경보기). 다만, 제8512호나 제8530호의 것은 제외한다.",
  "titleEn": "85.31 - Electric sound or visual signalling apparatus (for example, bells, sirens, indicator panels, burglar or fire alarms), other than those of heading 85.12 or 85.30.",
  "contentKo": "이 호에는 차량용(제8512호) 및 교통관제용(제8530호)을 제외한 모든 종류의 전기식 음향/시각 신호기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 전기식 벨, 버저, 도어차임\n- 전자식 벨, 벨 돔이 없는 버저, 음악 톤을 내는 다중 도어차임 및 전동식 교회 종 (연주용 종 제외).\n(B) 전기식 음향 신호용 기기\n- 혼(경음기), 사이렌(reed 진동식, 회전 원반식, 전자음 발생기 등), 공습 경보 사이렌, 선박용 사이렌 등.\n(C) 기타 전기식 신호기기\n- 항공기, 선박, 열차용 점멸 신호등 (제8526호의 레이더/무선식 제외).\n(D) 표시반(Indicator panel) 및 관련 기기\n- 호텔, 사무실, 공장용 방 표시기(room indicator), 엘리베이터 층수/방향 표시기, 승객 대기표 번호 지시계.\n- 기차역/공항의 열차/항공기 발착 시간 및 플랫폼 조명 표시반, 전광 전광판, 경기장 스코어보드.\n- 선박 기관실용 레지스터 및 지시기(engine room telegraph).\n- LCD나 LED가 결합된 전용 표시반.\n(E) 도난경보기(burglar alarm)\n- 센서/검출부와 경보부(벨, 경광등 등)로 구성된 자동 경보기 (바닥 압력 센서식, 정전용량 변화식, 적외선 차단 센서식).\n(F) 화재경보기(fire alarm)\n- 열 감지식(가용성 합금, 바이메탈 팽창식, 저항 변화식) 또는 연기 감지식(광전 센서 감쇠식) 화재 감지 및 신호기 세트 (수동식 화재 발신기 포함).\n(G) 가스 및 증기 경보기 : 누설 가스 탐지기와 음향/시각 경보 장치가 패키지된 기기.\n(H) 화염경보기(flame alarm) : 광전식 화염 감지 센서와 경보 장치가 포함된 시스템.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단순 조명식 도로 표지판 및 발광 지표 플레이트 (제8310호, 제9405호 등)\n(b) 단순 표시등이 부착된 배전판, 스위치 (제8536호 또는 제8537호)\n(c) 방사성 동위원소를 사용하는 연기 감지 화재경보기 (제9022호)\n(d) 범용 LCD/OLED 모니터 및 TV 수신기 (제8528호)\n(e) 연동 경보 장치가 없는 단순 화염 검출 센서 단독 제시품 (제8536호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.31 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
