const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8535",
  "titleKo": "85.35 - 전기회로의 개폐용ㆍ보호용ㆍ접속용 전기기기(예: 스위치ㆍ퓨즈ㆍ피뢰기ㆍ전압제한기ㆍ서지억제기ㆍ플러그와 그 밖의 접속기ㆍ접속함)(사용전압이 1,000볼트를 초과하는 것으로 한정한다)",
  "titleEn": "85.35 - Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, fuses, lightning arresters, voltage limiters, surge suppressors, plugs and other connectors, junction boxes), for a voltage exceeding 1,000 V.",
  "contentKo": "이 호에는 전압이 1,000볼트를 초과하는 고압 배전/송전 계통용 전기회로의 개폐용, 보호용, 접속용 기기를 분류한다. 기본적 작동 원리와 기구 설명은 제8536호(1,000볼트 이하용)의 해설을 준용한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 퓨즈(fuse) 및 자동 회로차단기(automatic circuit breaker) : 과전류/과전압 차단 장치 (가스차단기, 유입차단기, 진공차단기 등).\n(B) 회로단속용 개폐기(make-and-break switch) : 원격 조절용 보조전동기나 레버를 장착하고 아크 방지 장치를 갖춘 고압 개폐용 전력 스위치.\n(C) 격리용 개폐기(isolating switch) : 회로 분리용 단로기(DS, 무부하 개폐용).\n(D) 피뢰기(lightning arrester) : 송배전 설비를 낙뢰 충격 전압으로부터 보호하기 위한 어스 접지 패널/뿔 모양 스파크 갭 보호 장치 (산화금속피뢰기 등, 단 방사능 원리식 제9022호 제외).\n(E) 전압제한기(voltage limiter) : 도체 간 또는 대지 간 전위차가 설정치 이상 상승하는 것을 제한하는 방전관식 등 보호 장치 (자동전압조정기 제9032호 제외).\n(F) 서지 억제기 및 스파이크 억제기(surge suppressor) : 인덕터/커패시터 회로 소자 결합형 고주파 서지 흡수기.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 기기의 부분품은 제8538호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 상기 기기들과 배전반/제어반 패널 등이 결합된 조립품 (제8537호)\n(b) 단순 절연 부품 및 애자 (제8546호 또는 제8547호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.35 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
