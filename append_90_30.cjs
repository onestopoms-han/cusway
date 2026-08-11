const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9030",
  "titleKo": "90.30 - 오실로스코프(Oscilloscope)ㆍ스펙트럼 분석기와 그 밖의 전기적 양의 측정용이나 검사용 기기(제9028호의 것은 제외한다), 알파선ㆍ베타선ㆍ감마선ㆍ엑스선ㆍ우주선이나 그 밖의 전리선의 검사용이나 검출용 기기(+)",
  "titleEn": "90.30 - Oscilloscopes, spectrum analysers and other instruments and apparatus for measuring or checking electrical quantities, excluding meters of heading 90.28; instruments and apparatus for measuring or detecting alpha, beta, gamma, X-ray, cosmic or other ionising radiations.",
  "contentKo": "이 호에는 전압, 전류, 저항, 전력 등의 전기적 양(전자기학적 변수)의 측정 및 분석기기, 통신회선 전송 파라미터 계측기, 반도체 웨이퍼/IC 테스트 시스템, 그리고 알파선, 베타선, 감마선, 엑스선 등의 전리 방사선 검출/측정기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전리선의 검사용/검출용 기기(제9030.10호) : 가이거 계수기(Geiger counter), 전리조(ionisation chamber)식 검출기, 섬광계수기(scintillation counter, 광전자 배증관 및 고체 신틸레이터 결합식), 포켓용 개인 방사선 선량계(dosimeter), 우주선/중성자 검출 관(tube) 및 측정 장치.\n- 오실로스코프와 오실로그래프(제9030.20호) : 음극선관(CRT) 또는 디지털 메모리식 오실로스코프(oscilloscope) 및 오실로그래프.\n- 전압, 전류, 저항, 전력 측정기(반도체 전용 제외)(제9030.31~39호) :\n  - 멀티미터(멀티테스터)(기록장치 없는 것: 제9030.31호 / 기록장치 있는 것: 제9030.32호).\n  - 기타 전압계(voltmeter), 전류계(ammeter), 검류계(galvanometer), 저항계(ohmmeter), 전위차계(potentiometer), 전력계(wattmeter), 위상계, 주파수계, 자속계, 정밀 측정용 브리지(휘트스톤, 톰슨 브리지 등)(기록장치 없는 것: 제9030.33호 / 기록장치 있는 것: 제9030.39호).\n- 전기통신용 전용 측정기기(제9030.40호) : 누화계(cross-talk meter), 데시벨미터(decibel meter), 잡음전압계(psophometer), 반향계(echo meter), 게인(이득) 측정계, 만곡률계(distortion factor meter), 신호레벨 지시계.\n- 반도체 웨이퍼 및 소자(IC) 테스터(제9030.82호) : 웨이퍼 프로브 검사 장비, 반도체 칩 테스트 핸들러용 전기 검사 헤드, 로직 분석기(logical analyser).\n- 기타 전기적 양 측정기(제9030.84~89호) : 과도현상 기록기(transient recorder), 절연저항 테스터(메거 megger), 투자율계(permeameter), 동기검정기(synchroscope)(기록장치 있는 것: 제9030.84호 / 기록장치 없는 것: 제9030.89호).\n- 부분품과 부속품(제9030.90호) : 가이거 뮬러 계수관, 중성자 검출관, 밀포된 고체 신틸레이터 결정, IC 테스트 핀 보드 지그 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기의 누적 사용량을 표시하는 적산 전력량계 (제9028호)\n(b) 의학적 진단 목적으로 신틸레이션 계수 기술을 사용하여 인체 기관을 진단하는 감마 카메라 및 PET 스캐너 (제9018호)\n(c) 방사선원(코발트-60 등)을 기기 자체에 결합하여 재료 두께/내용량을 비파괴 방식으로 검사하는 두께계 등 방사선 응용 기기 (제9022호)\n(d) 물질 분석용 X선 분광 분석기 (제9027호)\n(e) 전위계, 오실로스코프 등에 부품으로 사용되나 단독으로 제시되는 음극선관(CRT) 및 정류관 (제8540호)\n(f) 측정 브리지용 헤드폰/이어폰 (제8518호)" ,
  "contentEn": "This heading covers oscilloscopes, spectrum analysers, and other electrical quantity measuring instruments, excluding supply meters of heading 90.28. It also covers apparatus for measuring or detecting alpha, beta, gamma, X-ray, cosmic, or other ionising radiations.\n\nIt includes :\n- Ionising radiation detectors (subheading 9030.10) including Geiger counters, ionisation chambers, scintillation counters, dosimeters, and neutron detector tubes.\n- Oscilloscopes and oscillographs (subheading 9030.20) including analog, digital storage, and soft-iron oscillographs.\n- Multimeters for measuring voltage, current, resistance, or power (without recorders: 9030.31 / with recorders: 9030.32).\n- Other voltmeters, ammeters, galvanometers, ohmmeters, wattmeters, frequency meters, and measuring bridges (Wheatstone, Thomson) (without recorders: 9030.33 / with recorders: 9030.39).\n- Telecommunication instruments (subheading 9030.40) including cross-talk meters, decibel meters, psophometers, echo meters, and distortion factor meters.\n- Semiconductor wafer or device (IC) testing equipment (subheading 9030.82) including wafer probers and logical analysers.\n- Other instruments (subheadings 9030.84 to 9030.89) including transient recorders, megohmmeters, permeameters, and synchronisers.\n- Parts and accessories (subheading 9030.90) including Geiger-Müller tubes and solid scintillators.\n\nExcludes electricity supply meters of heading 90.28, medical diagnostic gamma cameras/PET scanners (heading 90.18), radioisotope thickness gauges (heading 90.22), X-ray spectrometers (heading 90.27), separate CRTs (heading 85.40), and testing headphones (heading 85.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.30 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
