const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8524",
  "titleKo": "85.24 - 평판디스플레이 모듈(터치감응식 스크린을 장착한 것인지에 상관없다)",
  "titleEn": "85.24 - Flat panel display modules, whether or not incorporating touch-sensitive screens.",
  "contentKo": "이 호에는 주 제7호에 정의된 평판디스플레이 모듈(Flat Panel Display Module, 터치스크린 장착 여부 불문)을 분류한다. LCD, OLED, LED 등의 기술을 이용한 디스플레이 스크린을 포함하며, 평평한 것뿐만 아니라 곡면형(curved), 유연성(flexible), 접이식(foldable), 신축성(stretchable), 롤러블(rollable) 형태도 포함된다.\n\n이 호의 평판디스플레이 모듈은 다음과 같이 분류된다.\n(1) 구동장치나 제어회로가 없는 것 (일반적으로 '셀 cells'이라고 부름) :\n- LCD 셀 : 유리/플라스틱 시트 사이에 액정을 넣은 것.\n- OLED 셀 : TFT 기판 위에 유기물질을 증착한 것.\n구동장치나 제어회로 같은 전기식 부분품이 없어야 한다(전기 접속자, 편광판 부착 여부 불문).\n(2) 구동장치나 제어회로를 갖춘 것 :\n- 셀에 드라이버 IC, PCB, 백라이트 유닛(LCD용), 타이밍 컨트롤러(T-CON) 또는 전원 공급 제어회로가 추가 결합된 모듈. 프레임이나 섀시와 결합된 것도 포함한다.\n(3) 터치 감응식 스크린을 장착한 것 :\n- 평판 디스플레이 모듈에 터치 패널이 물리적으로 접합되어 있거나 셀 안에 일체형(In-cell, On-cell 등)으로 내장된 것.\n\n이 호의 모듈은 가전(냉장고 등), 스마트폰, PC, 디지털카메라, 자동차 계기판/네비게이션 등 광범위한 기기에 탑재될 수 있으며, 완제품에 조립되지 않은 채 독립적으로 별도 제시될 때 이 호에 분류한다.\n\n부분품\n부분품의 분류에 관한 일반 규정에 따라(제16부 총설 참조), 이 호에 해당하는 모듈의 부분품은 제8529호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 채널 선택 튜너, 비디오 프로세서 등 영상신호 변환/처리 부품을 탑재하여 완제품 모니터/TV의 기능을 수행하는 모듈 (제8517호, 제8528호 또는 제8529호)\n(b) 평판 디스플레이 모듈이 탑재된 비주얼 신호 기기(LED 전광판, 행선지 표시판 등) (제8531호)\n(c) 계측/검사용 기기와 일체를 이루는 모듈 (제90류)\n(d) 전자 악기 (제92류)\n(e) 게임기, 장난감, 완구, 운동용구에 탑재된 모듈 완제품 (제95류)",
  "contentEn": "This heading covers flat panel display modules (whether or not incorporating touch-sensitive screens) as defined in Chapter Note 7.\n\nThey utilize Liquid Crystal Display (LCD), Organic Light Emitting Diode (OLED), Light Emitting Diode (LED), or other display technologies. The screens can be flat, curved, flexible, foldable, stretchable, or rollable.\n\nIt includes :\n(1) Modules without driver or control circuits (often called \"cells\") :\n- LCD cells (liquid crystal sandwiched between glass/plastic sheets, polarisers and contacts permitted).\n- OLED cells (organic material deposited on TFT substrate).\n(2) Modules incorporating driver or control circuits :\n- Cells combined with driver ICs, PCBs, timing controllers (T-CON), power circuits, backlights, and frames/chassis.\n(3) Modules incorporating touch-sensitive screens (adhered touch panels or built-in in-cell/on-cell systems).\n\nThese modules are used in cellphones, computers, cameras, household appliances, and vehicles. When presented separately without being incorporated into other apparatus, they are classified here.\n\nParts of these modules are classified in heading 85.29.\n\nThe heading excludes :\n(a) Modules incorporating video signal processing circuits (video decoders, tuners) which perform the function of a monitor or TV (heading 85.17, 85.28, or 85.29).\n(b) Signalling panels incorporating display modules (heading 85.31).\n(c) Measuring or checking instruments incorporating display modules (Chapter 90).\n(d) Musical instruments (Chapter 92).\n(e) Video game consoles, toys, and sports equipment (Chapter 95)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.24 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
