const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8528",
  "titleKo": "85.28 - 텔레비전 수신기기를 갖추지 않은 모니터와 프로젝터, 텔레비전 수신용 기기(라디오 방송용 수신기기ㆍ음성이나 영상의 기록용 기기나 재생용 기기를 결합한 것인지에 상관없다)",
  "titleEn": "85.28 - Monitors and projectors, not incorporating television reception apparatus; reception apparatus for television, whether or not incorporating radio-broadcast receivers or sound or video recording or reproducing apparatus.",
  "contentKo": "이 호에는 비디오 튜너 유무 및 디스플레이 방식(CRT, LCD, OLED, 플라즈마, DMD 등)에 관계없이 모니터, 프로젝터 및 텔레비전 수신용 기기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 자동자료처리기계(ADP)용 모니터 (직접 연결용)\n- 컴퓨터 본체(CPU)로부터 그래픽 신호를 받아 텍스트/그래픽을 표시하는 모니터.\n- 컴퓨터 전용 단자(VGA, DVI, HDMI, DisplayPort 등) 탑재, 픽셀 피치가 0.3mm 미만으로 미세하고 눈부심/깜박임 방지 등 인체공학적 설계가 적용된 것.\n- 텔레비전 튜너가 없고, 화면 크기가 일반적으로 30인치(76cm) 이하인 것.\n(B) 그 밖의 모니터 (컴퓨터용 제외)\n- 복합 비디오(CVBS), S-Video, RGB 개별 입력단자 등을 탑재하여 비디오카메라나 CCTV 시스템 등에 직접 연결해 영상을 표시하는 감시용/방송사용 모니터. 컴퓨터 전용 커넥터가 없으며 튜너가 없는 것.\n(C) 프로젝터(Projector)\n- 모니터나 TV 스크린에 표시되는 영상을 외부 스크린이나 벽면에 투사하는 기기(CRT, LCD, DLP, LCoS 등 기술 기반).\n(D) 텔레비전 수신용 기기\n- 디스플레이 스크린이 없는 수신 장치 : 위성방송 수신기, 케이블/지상파용 셋톱박스, IPTV용 셋톱박스(인터넷 모뎀이 내장된 것 포함).\n- 디스플레이 스크린이 있는 가정용/공업용 TV 세트 : 라디오 수신기, 카세트/DVD/블루레이 플레이어/레코더 또는 위성 수신기 결합형 포함.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8529호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) TV 튜너가 없는 단순 고주파 비디오 튜너 단독 모듈 (제8529호)\n(b) 비디오 레코더 및 재생기 (제8521호)\n(c) 영화용 영사기 (제9007호) 및 제9008호의 투영기\n(d) TV 수신 장치 및 방송 시스템이 영구히 탑재된 특수용도 차량 (보통 제8705호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.28 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
