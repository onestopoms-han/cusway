const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9007",
  "titleKo": "90.07 - 영화용 촬영기와 영사기(음성의 기록기기나 재생기기를 갖춘 것인지에 상관없다)",
  "titleEn": "90.07 - Cinematographic cameras and projectors, whether or not incorporating sound recording or reproducing apparatus.",
  "contentKo": "이 호에는 연속적인 영상프레임을 고속 촬영(노출)하는 영화용 촬영기(카메라) 및 화학적 영화 필름을 투영(스크린 표시)하는 영화용 영사기와 이들의 부속 사운드(음성) 트랙 기록/재생 헤드 결합 설비를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 영화용 촬영기(카메라)(제9007.10호) : 아날로그 영화용 촬영기, 수중/공중 촬영용 방수/특수 영화 촬영기, 동시 녹음식 영화 촬영기.\n- 영화용 영사기(프로젝터)(제9007.20호) : 광원, 콘덴서 렌즈, 영사 렌즈, 필름 간헐 이송 장치(몰타 십자 Maltese cross 장치 등)가 장착된 극장용/교육용 필름 영사기. 광전식 사운드헤드(sound-head) 또는 전하결합소자(CCD) 및 CD-ROM 연동 시간코드 판독기가 일체화된 유성 영사기.\n- 부분품과 부속품(제9007.91~92호) :\n  - 촬영기용 부분품(제9007.91호) : 촬영기 몸체, 볼/소켓 마운트 헤드, 잡음 방지용 방음 커버(blimp, 섬유제 제외).\n  - 영사기용 부분품(제9007.92호) : 영사기 스탠드용 케이스, 다층 필름회전 스풀기, 셔터 조절 부속품.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 방송국용 및 산업용 텔레비전 카메라, 비디오 카메라 레코더 (제8525호)\n(b) 비디오 영사기(LCD/DLP 프로젝터 등 디지털 비디오 프로젝터) (제8528호)\n(c) 사진기 이동용 트롤리 대차(dolly) (제8427호, 제8428호)\n(d) 사운드헤드(독립 제시되는 광전식 사운드 재생 부품) (제8522호)\n(e) 비디오 녹화기 및 재생기 (제8521호)\n(f) 마이크로폰 및 가청주파증폭기(일체식 제외) (제8518호)\n(g) 영화 편집 데스크, 스플라이서(필름 접착기), 애니메이티드 뷰어 (제9010호)\n(h) 삼각대, 일각대, 삼각 스탠드 (제9620호)\n(ij) 완구용 장난감 영사기 (제9503호)" ,
  "contentEn": "This heading covers cinematographic cameras (for exposing successive frames at high speed) and film projectors, whether or not fitted with optical or magnetic soundheads or time-code reading systems.\n\nIt includes :\n- Cinematographic cameras (subheading 9007.10) including sound-recording cameras, underwater/aerial movie cameras.\n- Cinematographic projectors (subheading 9007.20) equipped with an optical system (light source, condenser, lens), film intermittent movement mechanisms (Maltese cross), and integrated soundheads (photoelectric/magnetic/CCD read systems).\n- Parts and accessories (subheadings 9007.91 and 9007.92) including camera bodies, soundproof blimps (other than textiles), projector stands, and film spooling devices.\n\nExcludes television cameras and video camcorders (heading 85.25), digital video projectors (DLP/LCD) (heading 85.28), camera dollys (Chapter 84), separate soundheads (heading 85.22), film editing/splicing equipment (heading 90.10), tripod stands (heading 96.20), and toy projectors (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.07 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
