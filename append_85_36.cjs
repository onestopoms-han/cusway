const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8536",
  "titleKo": "85.36 - 전기회로의 개폐용ㆍ보호용ㆍ접속용 기기[예: 개폐기ㆍ계전기ㆍ퓨즈ㆍ서지(surge)억제기ㆍ플러그ㆍ소켓ㆍ램프홀더와 그 밖의 커넥터ㆍ접속함](전압이 1,000볼트 이하인 것으로 한정한다)와 광섬유용ㆍ광섬유다발용ㆍ케이블용 커넥터",
  "titleEn": "85.36 - Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, relays, fuses, surge suppressors, plugs, sockets, lamp-holders and other connectors, junction boxes), for a voltage not exceeding 1,000 V; connectors for optical fibres, optical fibre bundles or cables.",
  "contentKo": "이 호에는 전압이 1,000볼트 이하인 주택용 및 공업용 전기회로 개폐용, 보호용, 접속용 기기와 광섬유용/케이블용 커넥터를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(I) 전기회로 개폐용 기기\n(A) 개폐기(스위치) : 가정용 텀블러 스위치, 레버 스위치, 회전 스위치, 푸시 스위치 및 공업용 리미트 스위치, 캠 스위치, 마이크로 스위치, 근접(proximity) 스위치, 형광등용 스타터(열전기 스위치). 반도체 소자를 이용한 비접촉식 전자 스위치(SSR 등) 포함.\n(B) 전환스위치(change-over switch) : 회로 선택 및 전환용 멀티웨이 스위치, 저항기 결합형 전동기 시동기/제어기용 스위치.\n(C) 계전기(relay) : 과전류/차동/지연 계전기, 전자계전기, 정전/광전식 계전기. 접촉기(contactor) 포함.\n(II) 전기회로 보호용 기기\n- 퓨즈(fuse) : 가용선이 포함된 통형 퓨즈, 플러그형 퓨즈(단, 절연재 베이스 단독은 제8547호).\n- 과부하 차단기 및 서지 보호 장치(SPD, 단 단순 배리스터 저항기는 제8533호).\n(III) 전기회로 접속용 기기\n(A) 플러그와 소켓 : 이동형 코드 접속용 플러그/소켓, 가공 전차선용 슬라이딩 컬렉터(집전장치, 탄소 브러시 제외).\n(B) 램프홀더(소켓) : 전구용 및 튜브용 소켓.\n(C) 기타 커넥터, 터미널, 터미널 스트립, 도미노, 단자함, 크로커다일 클립(악어이빨 단자).\n(D) 접속함(junction box) : 내부 단자대가 탑재된 전선 접속 박스.\n(IV) 광섬유용, 광섬유다발용, 케이블용 커넥터\n- 광신호의 기계적 정렬 정합을 위한 광커넥터 모듈 (단, 광섬유 케이블이 부착된 완제품 하네스는 제8544호 또는 제9001호).\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8538호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전열용 저항체 (제8516호 또는 제8545호)\n(b) 광전도 셀 및 광의존 저항기(LDR) (제8541호)\n(c) 배전반, 제어반, 배전 플레이트 (제8537호)\n(d) 케이블이나 코드가 고정된 커넥터 완제품 (제8544호)\n(e) 전압조정용 바리스터 다이오드 (제8541호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.36 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
