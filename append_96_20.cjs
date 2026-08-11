const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9620",
  "titleKo": "96.20 - 일각대ㆍ양각대ㆍ삼각대와 이와 유사한 물품",
  "titleEn": "96.20 - Monopods, bipods, tripods and similar articles.",
  "contentKo": "이 호에는 카메라, 비디오 카메라, 스마트폰, 망원경 및 측정 정밀기기 등을 지지하여 돌발적인 흔들림을 감소시키는 목적으로 설계된 일각대(모노포드/유니포드), 양각대(바이포드), 삼각대(트라이포드) 및 4개 이상의 다리를 가진 유사한 스탠드 지지대와 셀카봉(셀피스틱)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 카메라/비디오카메라/망원경/수준기 측정기기용 접이식/휴대용 삼각대(트라이포드, 목재/알루미늄/카본 등 재질 불문, 퀵슈/신속 탈착 장치 및 볼헤드 유무 불문).\n- 모노포드(일각대, 유니포드) 및 바이포드(양각대).\n- 셀피포드(셀카봉, selfie stick) : 스마트폰이나 소형 디지털카메라를 끝 부분 조정용 홀더에 고정하여 손에 쥐고 촬영하는 기구(사진 촬영용 유선 플러그선이나 무선 블루투스 원격 조종 셔터 장치 장착 여부 불문).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 방송/노래방용 마이크로폰 전용 스탠드 (제8518호)\n(b) 드럼, 색소폰 등 악기 고정용 전용 스탠드 및 지지 프레임 (제9209호)\n(c) 군사 및 사격/수렵용 총기류(소총 등) 전용으로 설계 장착되는 총기 받침용 양각대/삼각대 (제9305호)\n(d) 단독 제시되는 카메라 스탠드용 헤드, 퀵슈 플레이트 (제9006호 또는 각 카메라 부분품으로 분류)" ,
  "contentEn": "This heading covers monopods (unipods), bipods, tripods, similar multi-legged supports, and selfie sticks (selfie pods) designed to support cameras, video cameras, smartphones, or precision/surveying instruments to prevent shaking.\n\nIt includes :\n- Tripods (folding/portable) made of wood, aluminum, or carbon fiber, with or without quick-release heads, for cameras or surveying equipment.\n- Monopods and bipods.\n- Selfie sticks (selfie pods) designed to hold a smartphone or digital camera to take self-portraits, whether or not incorporating wired or wireless (Bluetooth) shutter buttons.\n\nExcludes microphone stands (heading 85.18), musical instrument stands (heading 92.09), and tripods/bipods specially designed for firearms of Chapter 93 (heading 93.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.20 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
