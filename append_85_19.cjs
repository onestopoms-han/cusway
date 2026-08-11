const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8519",
  "titleKo": "85.19 - 음성 녹음기나 재생기",
  "titleEn": "85.19 - Sound recording or reproducing apparatus.",
  "contentKo": "이 호에는 음성을 녹음하는 기기, 음성을 재생하는 기기, 그리고 녹음과 재생 기능이 결합된 기기를 분류한다. 음성 신호는 보통 내부 기억장치나 매체(자기테이프, 광디스크, 반도체 매체 등)에 기록/재생된다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 코인/토큰 작동식 음성 재생기 (주크박스 등).\n(2) 턴테이블(레코드 플레이어) : 음반(레코드)을 회전시키고 픽업 카트리지를 통해 재생하는 기기.\n(3) 카세트 플레이어 (휴대용 카세트 포함, 소호 제8527.12호의 라디오 결합형 등 제외).\n(4) 디지털 오디오 플레이어 : MP3 플레이어, 플래시 메모리 기반 오디오 재생기 및 휴대용 오디오 장비.\n(5) 광디스크(CD, 미니디스크 등) 및 기타 미디어를 사용하는 음성 재생기/녹음기.\n(6) 전화응답기(telephone answering machine) : 전화기 세트와 일체형이 아닌 별도로 제시되는 전화응답 장치.\n(7) 받아쓰기용 녹음기(dictating machine) 및 회의 녹음용 음성 기록기.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전송 장치를 결합하여 통신 네트워크에서 자료 송수신이 가능한 기기 (제8517호)\n(b) 마이크로폰, 확성기, 가청주파 증폭기 (각각 제8518호)\n(c) 전화기 세트에 빌트인 일체형으로 되어 있는 전화응답기 (제8517호)\n(d) 라디오 수신기를 결합한 음성 녹음/재생 기기 (제8527호)\n(e) 비디오 카메라 레코더 및 디지털 카메라 (제8525호)\n(f) 텔레비전 수신 장치와 결합된 영상 기록/재생기 (제8528호)",
  "contentEn": "This heading covers apparatus for recording sound, reproducing sound, or combined sound recording and reproducing.\n\nIt includes :\n(1) Coin- or token-operated record-players (jukeboxes).\n(2) Turntables (record-decks) and record-players.\n(3) Cassette-players (excluding those with radio receivers of heading 85.27).\n(4) Digital audio players (e.g. MP3 players, flash-memory based audio devices).\n(5) Optical disc (CD, MiniDisc, etc.) recorders and players.\n(6) Telephone answering machines (presented separately, not forming an integral part of a telephone set).\n(7) Dictating machines and pocket memo-recorders.\n\nParts and accessories of these apparatus are classified under heading 85.22.\n\nThe heading excludes :\n(a) Answering machines integrated with telephone sets (heading 85.17).\n(b) Microphones, loudspeakers, and audio-frequency amplifiers (heading 85.18).\n(c) Radio-broadcast receivers combined with sound recording/reproducing apparatus (heading 85.27).\n(d) Video recording or reproducing apparatus (heading 85.21 or 85.28).\n(e) Electronic media (blank or recorded) for sound recording (heading 85.23)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.19 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
