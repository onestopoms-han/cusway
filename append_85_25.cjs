const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8525",
  "titleKo": "85.25 - 라디오 방송용이나 텔레비전용 송신기기(수신기기ㆍ음성 기록기기ㆍ재생기기를 갖춘 것인지에 상관없다)와 텔레비전 카메라ㆍ디지털 카메라ㆍ비디오카메라레코더",
  "titleEn": "85.25 - Transmission apparatus for radio-broadcasting or television, whether or not incorporating reception apparatus or sound recording or reproducing apparatus; television cameras, digital cameras and video camera recorders.",
  "contentKo": "이 호에는 라디오 방송용 및 텔레비전용 송신기기(수신기 또는 녹음/재생 장치 탑재 여부 불문)와 텔레비전 카메라, 디지털 카메라, 비디오 카메라 레코더(캠코더)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 라디오 방송용 또는 텔레비전용 송신기기\n(1) 라디오방송 및 텔레비전 송신기 (무선 또는 유선 송신 방식 포함).\n(2) 방송 중계용 송신기기 및 리피터(항공기 탑재 중계 장비 포함).\n(3) 텔레비전 중계용/스튜디오 송출용 송신기 (파라볼라 안테나 연계 방식 등).\n(4) 폐쇄회로(CCTV) 송신기기 및 공업용 텔레비전 송신기.\n(B) 텔레비전 카메라, 디지털 카메라, 비디오 카메라 레코더\n- 영상을 포착하여 전기 신호(아날로그 또는 디지털 데이터)로 변환하는 장비.\n(1) 텔레비전 카메라 : 영상을 카메라 외부에 유/무선으로 전송하며(웹캠 webcam 포함), 자체 녹화 기능은 없는 카메라.\n(2) 디지털 카메라 및 비디오카메라레코더(캠코더) : 정지영상 및 동영상을 기기 내부의 메모리/매체(자기테이프, SD 카드, 반도체 플래시 등)에 저장할 수 있는 카메라. 컴퓨터 연결을 위한 출력 포트(USB, HDMI 등) 및 아날로그/디지털 입력단자를 가질 수 있다. LCD 뷰파인더 모니터 탑재형을 포함한다.\n소호주 제1호 내지 제3호의 특수 카메라(고속 카메라, 내방사선 카메라, 야간투시 카메라)도 이 호에 분류된다.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품은 제8529호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 스마트폰 및 셀룰러 통신망용 무선전화기 (제8517호)\n(b) 중계기 내장용이 아닌 개별 제시되는 라디오 수신기 (제8527호) 및 TV 수신기 (제8528호)\n(c) 텔레비전 카메라가 결합되어 있는 특수용도 차량 (제8705호)\n(d) 통신 위성 (제8802호)\n(e) 카메라 구동용 무대 이동 메커니즘 '트래블링' (제8428호)\n(f) 카메라 원격 제어용 배전반/콘솔 (제8537호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.25 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
