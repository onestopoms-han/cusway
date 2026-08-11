const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8540",
  "titleKo": "85.40 - 열전자관ㆍ냉음극관ㆍ광전관[예: 진공관ㆍ증기나 가스를 봉입한 관ㆍ수은아크정류관ㆍ음극선관ㆍ텔레비전용 촬상관(camera tube)]",
  "titleEn": "85.40 - Thermionic, cold cathode or photo-cathode valves and tubes (for example, vacuum or vapour or gas filled valves and tubes, mercury arc rectifying valves and tubes, cathode-ray tubes, television camera tubes).",
  "contentKo": "이 호에는 진공이나 가스 봉입 하에서 전자의 거동을 이용하는 열전자관, 냉음극관, 광전관을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 정류관 및 밸브 : 교류를 직류로 변환하는 정류용 진공관/가스입관 (수은아크 정류관, 제어 그리드가 결합된 사이러트론, 이그나이트론 등 포함).\n(2) 음극선관 (CRT, 브라운관)\n- TV 수상관 및 영상 모니터용 브라운관 (천연색, 단색).\n- 데이터/그래픽 디스플레이 직시관 (인광물질 도트 간격 0.4mm 미만 컬러 또는 단색 모니터용 튜브).\n- 레이더, 오실로스코프용 음극선관.\n(3) 텔레비전용 촬상관(camera tube) 및 관련 광전음극관\n- 광학상을 전기적 신호로 변환하는 촬상용 전자빔관 (오시콘, 비디콘 등).\n- 야간 감시용 적외선 영상변환관(image converter) 및 영상증강관(image intensifier).\n(4) 마이크로웨이브관 : 초고주파 발진용 특수관 (자전관 magnetron, 속도변조관 klystron, 진행파관 TWT, 카시노트론, lighthouse tube 판극관 등).\n(5) 광전관(photocathode tube) : 빛의 여기 작용으로 음극에서 전자를 방출하는 광전관, 광전지 튜브 및 광전자배증관(photomultiplier).\n(6) 기타 전자관 : 수신/증폭/검파용 삼극관, 사극관, 오극관 등 소형/대형 전자관.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품(음극, 그리드, 양극, CRT 네크에 부착되는 편향코일 Deflection Yoke, 반내파 금속 케이싱 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전구/전자관용 빈 유리구 및 콘(cone) 유리 부분품 (제7011호)\n(b) 대형 철제 수은 정류기 (제8504호)\n(c) 엑스선관 (제9022호)\n(d) 고체 반도체 센서(CCD, CMOS 이미지 센서 칩) 및 수소 방전 튜브식 서지 보호용 방전관 (각각 제8541호, 제8536호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.40 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
