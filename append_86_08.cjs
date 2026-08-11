const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8608",
  "titleKo": "86.08 - 철도나 궤도선로용 장치물, 철도ㆍ궤도ㆍ도로ㆍ내륙수로ㆍ주차장ㆍ항만ㆍ비행장에서 사용되는 기계식(전기기계식을 포함한다) 신호기기ㆍ안전기기ㆍ교통관제기기, 이들의 부분품",
  "titleEn": "86.08 - Railway or tramway track fixtures and fittings; mechanical (including electro-mechanical) signalling, safety or traffic control equipment for railways, tramways, roads, inland waterways, parking facilities, port installations or airfields; parts of the foregoing.",
  "contentKo": "이 호에는 철도/궤도 선로용 고정 장치물 및 철도, 도로, 항만, 비행장 등에서 사용되는 기계식 및 전기기계식 신호/안전/관제 설비(및 그 부분품)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 철도/궤도 선로용 고정 장치물\n- 조립된 선로(레일이 이미 침목이나 지지물에 고정된 것 - 커브, 교차점, 분기 궤도용 등).\n- 전차대(turntable) : 차량 방향 전환용 회전 플랫폼 (단, 평행 선로 이동용 천차기 traverser 및 왜건 티퍼/푸셔는 제8428호로 제외).\n- 플랫폼 완충장치(platform buffer) : 충격 흡수용 스프링/유압식 종단 막음 장치.\n- 로딩게이지(loading gauge) : 열차 높이/너비 한계 측정용 아치 구조물.\n(B) 기계식 및 전기기계식 신호/안전/관제 기기\n- 신호상자 레버 제어 장치 및 연동 장치 (신호기 및 전철기 연동용).\n- 완목신호기(semaphore), 신호용 디스크, 신호 포스트, 신호 갠트리.\n- 전철기 검정기(point detector) 및 궤도 자동 록킹 바.\n- 레일 브레이크(차량 감속용 공기/유압 제동 바 장치).\n- 탈선기(derailer) 및 비상 정지용 트랙 트립 바(train stop).\n- 자동 안개 신호기 및 평면교차 건널목 차단기 기계식 개폐 제어 장치 (차단기 게이트 자체는 재질에 따라 제7308호 등 분류).\n\n부분품\n- 회전 플랫폼 판, 신호 암/디스크, 제어 레버, 전철기 록 케이스 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 미조립 레일, 스위치 블레이드, 전철봉, 침목 (제4406호, 제6810호, 제7302호)\n(b) 전선 지지용 철탑 및 지지 문형 가설 철주 (제7308호 등)\n(c) 전기식 신호등, 경보벨, 전기식 신호/관제반 자체 (제8530호, 제8531호, 제8536호 등)\n(d) 범용성 금속 와이어, 체인, 볼트, 너트 (제15부)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.08 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
