const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8521",
  "titleKo": "85.21 - 영상 기록용이나 재생용 기기(비디오튜너를 결합한 것인지에 상관없다)",
  "titleEn": "85.21 - Video recording or reproducing apparatus, whether or not incorporating a video tuner.",
  "contentKo": "이 호에는 비디오 튜너 내장 여부와 무관하게 영상과 음성을 기록하거나 재생(또는 기록/재생 결합)하는 기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 영상 기록 기기 및 기록/재생 결합 기기\n- 텔레비전 카메라나 수신기로부터 영상/음성 신호(아날로그 또는 디지털)를 전달받아 매체(자기 테이프, 디스크 등)에 기록하는 기기.\n- PC로부터 전송된 디지털 비디오 데이터를 하드디스크(HDD)나 SSD 등 자기/반도체 디스크에 기록하는 디지털 비디오 레코더(DVR, PVR 등).\n- 튜너를 결합하여 TV 방송 송신 신호 중 특정 채널을 선택해 기록할 수 있는 비디오 레코더.\n(B) 영상 재생 기기 (비디오 플레이어)\n- 기계적, 자기적, 광학적으로 사전 녹화된 매체로부터 영상/음성을 읽어 TV 수신기 등에 재생하는 기기.\n- 레이저 광학식 디스크 재생기(DVD 플레이어, 블루레이 플레이어 등), 정전용량식/압력센서식 디스크 플레이어.\n- 감광성 필름의 기록 데이터를 영상 신호로 변환 재생하는 기기.\n\n부분품과 부속품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 기기의 부분품과 부속품은 제8522호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 영상/음성 기록용 매체 (제8523호)\n(b) 텔레비전 카메라 및 비디오 카메라 레코더(캠코더) (제8525호)\n(c) 텔레비전 수신기(라디오 수신기 및 비디오 기록/재생 장치 결합형 포함), 비디오 모니터 및 프로젝터 (제8528호)",
  "contentEn": "This heading covers video recording or reproducing apparatus, whether or not incorporating a video tuner.\n\nIt includes :\n(I) Recording and combined recording/reproducing apparatus :\n- Devices that record television signals (analogue or digital) from cameras or receivers onto media (magnetic tapes, discs).\n- Digital Video Recorders (DVRs, PVRs) which record digital video data from data processing machines onto hard discs or solid-state media.\n- Video recorders incorporating a tuner to select and record specific broadcast channels.\n(II) Reproducing apparatus (video players) :\n- DVD players, Blu-ray players, and other optical or magnetic disc players designed to read pre-recorded media for display on TV receivers.\n- Devices reading photosensitive film tracks and converting them to video signals.\n\nParts and accessories of these apparatus are classified in heading 85.22.\n\nThe heading excludes :\n(a) Video recording media (heading 85.23).\n(b) Television cameras, transmission apparatus and camcorders (heading 85.25).\n(c) Television receivers (including combined TV/VCRs), video monitors, and video projectors (heading 85.28)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.21 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
