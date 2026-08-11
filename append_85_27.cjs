const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8527",
  "titleKo": "85.27 - 라디오방송용 수신기기(음성 기록기기ㆍ재생기기, 시계가 동일한 하우징 내에 결합된 것인지에 상관없다)",
  "titleEn": "85.27 - Reception apparatus for radio-broadcasting, whether or not combined, in the same housing, with sound recording or reproducing apparatus or a clock.",
  "contentKo": "이 호에는 유선 연결 없이 공중 무선 전자파로 송신되는 신호를 수신하는 라디오방송용 수신기(음성 기록/재생 장치, 시계가 동일한 하우징 내에 결합된 것인지 불문)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 가정용 라디오 수신기 : 탁상형, 콘솔형, 가구/벽 장착형, 휴대형 라디오 (CD 플레이어, 카세트 데크 등 음성 기록/재생 장치 또는 디지털/아날로그 시계 결합형 포함).\n(2) 차량용(자동차용) 라디오 수신기기.\n(3) 중계기(제8525호)에 결합될 수 있도록 설계되었으며 별도 분리하여 제시되는 라디오 수신기 모듈.\n(4) 포켓 사이즈형 라디오카세트플레이어(소호주 제4호의 요건 충족품).\n(5) 라디오 수신 모듈이 결합된 소매용 스테레오 하이파이(Hi-Fi) 콤포넌트 시스템 세트 (각 모듈이 분리된 하우징 형태이나 라디오 수신기가 전체의 본질적 특성을 부여하는 것).\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8529호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 통신용 무선 수신기(페이저, 기지국 수신기, 네트워크 무선 랜 카드 등) (제8517호) 및 무선 원격 제어 수신기 (제8526호)\n(b) 라디오 송신기 (제8525호)\n(c) 텔레비전 수신기 및 관련 셋톱박스 (제8528호)\n(d) 라디오 수신기기가 영구히 탑재된 특수용도 차량 (보통 제8705호)",
  "contentEn": "This heading covers reception apparatus for radio-broadcasting, whether or not combined, in the same housing, with sound recording or reproducing apparatus or a clock.\n\nIt includes :\n(1) Domestic radio receivers of all kinds (table-top, console, portable) whether or not combined with record players, CD/cassette decks, or clocks.\n(2) Car radio receivers.\n(3) Radio-broadcast receivers presented separately for incorporation in relay apparatus of heading 85.25.\n(4) Pocket-size radio cassette players complying with Subheading Note 4 to this Chapter.\n(5) Stereo (Hi-Fi) systems put up in sets for retail sale containing a radio receiver as the essential component, even if modules are in separate housings.\n\nParts of these receivers are classified in heading 85.29.\n\nThe heading excludes :\n(a) Professional or communication wireless receivers (e.g. paging receivers, cellular network receivers, WLAN cards) (heading 85.17) and radio remote control receivers (heading 85.26).\n(b) Radio transmitters (heading 85.25).\n(c) Television receivers (heading 85.28).\n(d) Special purpose vehicles permanently equipped with radio-broadcasting receivers (generally heading 87.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.27 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
