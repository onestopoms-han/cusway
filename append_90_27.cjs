const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9027",
  "titleKo": "90.27 - 물리나 화학 분석용 기기(예: 편광계ㆍ굴절계ㆍ분광계ㆍ가스나 매연 분석기), 점도ㆍ포로서티(porosity)ㆍ팽창ㆍ표면장력이나 이와 유사한 것의 측정용이나 검사용 기기, 열ㆍ소리ㆍ빛의 양의 측정용이나 검사용 기기(노출계를 포함한다), 마이크로톰(microtome)",
  "titleEn": "90.27 - Instruments and apparatus for physical or chemical analysis (for example, polarimeters, refractometers, spectrometers, gas or smoke analysis apparatus); instruments and apparatus for measuring or checking viscosity, porosity, expansion, surface tension or the like; instruments and apparatus for measuring or checking quantities of heat, sound or light (including exposure meters); microtomes.",
  "contentKo": "이 호에는 물리화학적 분석, 재료 물성(점도, 다공성, 열팽창, 표면장력 등) 측정, 열/소리/빛의 계측(노출계, 열량계 등) 및 시료 박편 절단기(마이크로톰)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 가스나 매연 분석기(제9027.10호) : 가발로/용광로 연도가스 분석기(탄산가스, 일산화탄소, 산소, 수소 함유량 측정), 오르자트(Orsat) 가스분석기, 가스 연소/폭발식 분석기, 휴대식 갱도용 메탄가스 검출기(fire damp detector), 틴달로미터(tyndallometer, 기체 중 먼지 밀도 측정기), 광전식 매연 검출기(경보 단독형 제외).\n- 크로마토그래프와 전기영동 장치(제9027.20호) : 가스/액체/이온/박층 크로마토그래프, 아미노산/단백질 분석용 전기영동 장치.\n- 자외선/가시광선/적외선 광학 분광계(제9027.30호) : 자외선, 가시광선, 적외선을 사용하는 분광계(spectrometer), 분광광도계(spectrophotometer), 분광사진기(spectrograph), 단색광기(monochromator).\n- 그 밖의 자외선/가시광선/적외선 광학 분석 기기(제9027.50호) : 편광계(polarimeter), 반영식 편광계, 당도계(saccharimeter), 굴절계(refractometer, 베이츠/아베 등), 광전식 비색계(colorimeter), 비탁계(nephelometer/turbidimeter), 형광계(fluorimeter), 표백계(blancometer), 조도계(luxmeter), 광전지 농도계(densitometer).\n- 그 밖의 이 호의 분석 및 물성 측정기(제9027.81~89호) :\n  - 질량분석기(mass spectrometer)(제9027.81호) : 동위원소 및 분자량 분석기.\n  - 기타 기기(제9027.89호) :\n    - 점도계(viscometer) : 모세관식(오스트발트, 잉글러), 고체낙하구식 점도계.\n    - 팽창계(dilatometer, 팽창률 측정), 포로시미터(porosimeter, 다공성 측정), 투자율계(permeameter, 통기성 측정).\n    - 계면/표면장력 측정기(토션 밸런스식 표면장력계), 삼투압계(osmometer).\n    - 석유류 시험기 : 인화점(flash point)/유동점(flow point)/점도 측정기, 함수량 시험기.\n    - pH미터 및 산화환원전위(rH)미터, 전도도계(conductivity meter).\n    - 자동 타이틀레이터(titrator, 전기식 적정장치), 자동 습식 화학분석기(COD, TOC 측정기).\n    - 유전상수(dielectric) 고체 수분측정기, 임상실험실용 체외진단(in vitro) 분석기.\n    - 열량계(calorimeter) : 분젠 빙열량계, 베르틀로 폭발 봄(bomb) 열량계, 공업용 가스 발열량계.\n- 마이크로톰 및 부분품(제9027.90호) : 회전식/활주식 마이크로톰, 점도계용 컵, 굴절계용 프리즘, pH미터용 전극.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전용 가스 분석 기능 없이 순수 전기 신호(전압, 전류)만을 측정하는 전압계, 오실로스코프 (제9030호)\n(b) 기상 관측용 기압계, 습도계 및 건습구 습도계 (제9025호)\n(c) 단독 제시되는 유리제 이스트/산/뇨/단백질 측정용 초포관(eudiometer, nitrometer 등) (제7017호)\n(d) 기계적 성질(경도, 인장, 피로 등) 시험기 (제9024호)\n(e) 실험실용 가열로, 도가니, 오븐, 원심분리기, 증류기, 증발기 (제16부 또는 제84류)\n(f) 화재경보용 단독 전기식 연기경보기 (제8531호)\n(g) 핵연료 동위원소 분리 장비(원심분리식 등) (제8401호)\n(h) 천문 관측용 분광태양경 (제9005호)" ,
  "contentEn": "This heading covers instruments and apparatus for physical or chemical analysis (polarimeters, refractometers, spectrometers, gas analyzers), property checking (viscometers, porosimeters, dilatometers, surface tension meters), quantities of heat, sound, or light checking (exposure meters, luxmeters, calorimeters), and microtomes.\n\nIt includes :\n- Gas or smoke analysis apparatus (subheading 9027.10) including Orsat gas analyzers, firedamp detectors, tyndallometers, and optical smoke detectors (excluding alarm-only units).\n- Chromatographs and electrophoresis instruments (subheading 9027.20) including gas/liquid/ion chromatographs and paper/gel electrophoresis equipment.\n- Spectrometers and spectrographs using optical radiations (UV, visible, IR) (subheading 9027.30).\n- Other optical instruments using UV, visible, or IR (subheading 9027.50) including polarimeters, saccharimeters, refractometers, colorimeters, turbidimeters, fluorimeters, photometers, luxmeters, and photographic exposure meters.\n- Other physical/chemical analysis and testing instruments (subheadings 9027.81 to 9027.89) including mass spectrometers (9027.81), viscometers, dilatometers, porosimeters, surface tension meters, pH meters, conductivity meters, ebullioscopes/cryoscopes, and calorimeters (9027.89).\n- Microtomes and parts/accessories (subheading 9027.90).\n\nExcludes laboratory ovens, centrifuges, stirrers, or autoclaves (Section XVI/Chapter 84), ordinary calibrated laboratory glassware (e.g. eudiometers, nitrometers) (heading 70.17), meteorological barometers or hygrometers (heading 90.25), smoke alarms of heading 85.31, and isotope separators (heading 84.01)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.27 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
