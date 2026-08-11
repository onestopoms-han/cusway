const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9006",
  "titleKo": "90.06 - 사진기(영화용은 제외한다), 사진용 섬광기구와 제8539호의 방전램프 외의 섬광전구",
  "titleEn": "90.06 - Photographic (other than cinematographic) cameras; photographic flashlight apparatus and flashbulbs other than discharge lamps of heading 85.39.",
  "contentKo": "이 호에는 영화용을 제외한 아날로그/감광식 사진기(화학 필름/판을 노출시켜 잠상을 형성하는 카메라), 사진용 플래시/섬광 기구, 화학식 섬광 전구를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 특수용도 사진기(제9006.30호) : 수중촬영용, 공중측량용 사진기(항공측량 카메라), 의료용 내과 내시경 검사용 사진기, 지문 비교 및 법정 범죄 감정용 사진기.\n- 즉석인화 사진기(instant print camera)(제9006.40호) : 노출 후 약품 자동 인화 처리를 거치는 휴대용 및 자동 코인 작동식 즉석 촬영 부스 기기.\n- 기타 일반 필름 사진기 (롤필름 규격 및 기타에 따라 제9006.53~59호) : 35mm 롤필름 카메라(제9006.53호), 일회용 사진기(disposable camera), 파노라마 카메라, 반사식 카메라(SLR, TLR), 인쇄 제판용 대형 제판 카메라(스캐너식/레이저포토플로터 포함).\n- 사진용 섬광기구 및 섬광전구(제9006.61~69호) :\n  - 전자식 방전 램프를 사용하는 스트로브 플래시 기구 (제9006.61호).\n  - 화학 연소식 섬광전구(flashbulb), 플래시큐브(flashcube), 배터리식 접촉 플래시 (제9006.69호).\n- 부분품과 부속품(제9006.91~99호) : 카메라 바디, 주름상자(bellows), 셔터, 조리개, 셔터 릴리즈, 필름 매거진, 렌즈 후드, 법정 과학수사용 특수 지지대.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 디지털 카메라 및 디지털 비디오 카메라 (제8525호)\n(b) 디지털 카메라 백(digital camera back) (제8529호)\n(c) 전기식 섬광방전관 전구 (제8539호)\n(d) 인쇄용 사진 복사기 및 열복사 복사기 (제8443호)\n(e) 사진 확대기 및 축소기 (제9008호)\n(f) 카메라 거치용 일각대, 양각대, 삼각대 (제9620호)\n(g) 현미경 사진용 또는 천체 망원경용 전용 어댑터 카메라 (분리 제시 시 제9006호 분류, 결합되어 일체를 이룰 시 망원경/현미경의 호로 분류)" ,
  "contentEn": "This heading covers photographic (non-cinematographic) cameras utilizing chemical film/plates, and photographic flash equipment (including chemical flashbulbs and electronic flash units other than discharge lamps of heading 85.39).\n\nIt includes :\n- Special use cameras (subheading 9006.30) for underwater use, aerial surveying, medical internal examinations (endoscope cameras), and forensic comparison.\n- Instant print cameras (subheading 9006.40) including coin-operated cabinet types.\n- Other film cameras (subheadings 9006.53 and 9006.59) such as 35mm roll-film cameras, reflex cameras (SLR/TLR), disposable cameras, and laser photoplotters for making PCBs.\n- Flashlight apparatus and flashbulbs (subheadings 9006.61 and 9006.69) including electronic strobe flash units and chemical flashbulbs/cubes.\n- Parts and accessories (subheadings 9006.91 and 9006.99) including camera bodies, bellows, shutters, apertures, and film magazines.\n\nExcludes digital cameras (heading 85.25), digital camera backs (heading 85.29), flash discharge tubes (heading 85.39), photocopying/thermocopying machines (heading 84.43), photographic enlargers/reducers (heading 90.08), and tripod stands (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.06 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
