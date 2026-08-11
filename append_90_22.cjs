const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9022",
  "titleKo": "90.22 - 엑스선이나 알파선ㆍ베타선ㆍ감마선ㆍ그 밖의 전리선을 사용하는 기기(내과용ㆍ외과용ㆍ치과용ㆍ수의과용인지에 상관없으며 방사선 사진용이나 방사선 치료용 기기ㆍ엑스선관과 그 밖의 엑스선 발생기ㆍ고압 발생기ㆍ조절반ㆍ스크린ㆍ검사용이나 치료용 테이블ㆍ의자와 이와 유사한 물품을 포함한다)(+)",
  "titleEn": "90.22 - Apparatus based on the use of X-rays or of alpha, beta, gamma or other ionising radiations, whether or not for medical, surgical, dental or veterinary uses, including radiography or radiotherapy apparatus, X-ray tubes and other X-ray generators, high tension generators, control panels and desks, screens, examination or treatment tables, chairs and the like.",
  "contentKo": "이 호에는 의료용, 공업용, 과학분석용 등에 사용하는 엑스선 및 방사성 물질(알파, 베타, 감마선) 응용 기기, 엑스선관(tube), 조절반, 증감 스크린 및 전용 진료 테이블/의자를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 엑스선을 사용하는 의료 및 공업용 기기(제9022.12~19호) :\n  - 컴퓨터 단층촬영기기(CT Scanner)(제9022.12호) : 다채널 X선 검출기와 컴퓨터 신호 처리 기술로 신체의 단층 횡단면 영상을 얻는 전신 단층 촬영기.\n  - 치과용 엑스선 기기(제9022.13호) : 치과 파노라마 X선 진단기, 구강 내 촬영용 단독 스탠드/벽걸이식 X선 기기.\n  - 기타 의료용(내과/외과/수의과)(제9022.14호) : 엑스선 투시용(fluoroscopic) 기기, 일반 엑스선 촬영용(radiographic) 기기, 종양 파괴 치료용 방사선 치료 기기(radiotherapy).\n  - 그 밖의 용도(공업/비의료)(제9022.19호) : 야금업 합금 기포 검사용, 타이어 내부 변형 검사용, 결정 구조 분석용 X선 회절 분석기(diffraction) 및 X선 분광 분석기, 위조지폐 감식용 투시 장치.\n- 알파/베타/감마선 등 방사성 전리선 사용 기기(제9022.21~29호) :\n  - 의료용(제9022.21호) : 코발트-60, 라듐 등 방사성 동위원소 감마선원 탑재 암 치료 장치(암치료용 코발트 봄 등).\n  - 그 밖의 용도(공업용)(제9022.29호) : 방사선 비파괴 검사 장비, 베타/감마선 두께 측정기(thickness gauge), 충전량 감시 센서, 방사성 물질을 이용한 화재경보기.\n- 엑스선관(X-ray tube)(제9022.30호) : 유리/금속제 고진공 튜브(음극과 대음극/양극 내장).\n- 기타 기기 및 부분품(제9022.90호) :\n  - 엑스선 발생기(베타트론 betatron 등) 및 고전압 발생기(변압기, 정류기 세트).\n  - 엑스선 조절반 및 제어 데스크, 형광 증감 스크린(fluoroscopic screen).\n  - 엑스선 기기 전용으로 설계된 검사용/치료용 테이블, 의자, 지지 암.\n  - 부분품 : 빔 방사 콜리메이터(localiser), 센터링용 백열등 장치, 납 유리 보호용 하우징 케이싱, 방호용 쉴드.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 치료용 밀봉 침, 라듐 바늘 및 방사성 동위원소 시약 자체 (제28류)\n(b) 미가공 사진용 감광성 필름 및 X선 필름 (제37류)\n(c) 방사선 단독 검출기(가이거 계수기, 신틸레이션 계수기)(진단용 엑스선 기기와 결합되지 않은 것) (제9030호)\n(d) 가시광선, 적외선 또는 자외선 치료기 (제9018호)\n(e) 전용 테이블/의자가 아닌 일반 의료용 가구 (제9402호)\n(f) 엑스선 기기용 외피 유리관(미가공 벌브) (제7011호) 및 독립형 정류관(케노트론) (제8540호)\n(g) 작업용 방사선 차폐 장갑(고무제) (제4015호) 및 납 유리 방호 안경 (제9004호)" ,
  "contentEn": "This heading covers apparatus based on the use of X-rays or alpha, beta, gamma, or other ionising radiations for medical, industrial, or scientific research purposes, including X-ray tubes, high tension generators, control panels, and specialized treatment tables/chairs.\n\nIt includes :\n- X-ray based apparatus (subheadings 9022.12 to 9022.19) including Computerised Tomography (CT) scanners (9022.12), dental X-rays (9022.13), radiography and radiotherapy apparatus (9022.14), and industrial X-ray diffraction/spectrometry equipment (9022.19).\n- Alpha, beta, or gamma radiation apparatus (subheadings 9022.21 to 9022.29) including cobalt therapy units (9022.21), industrial radiographical testing devices, beta/gamma thickness gauges, and smoke detectors incorporating radioactive sources (9022.29).\n- X-ray tubes (subheading 9022.30).\n- Other components and parts (subheading 9022.90) including betatrons, high tension generators, control panels, fluorescent/intensifying screens, specialized examination tables, collimators, and protective housings.\n\nExcludes radioactive chemical elements/isotopes (heading 28.44), sensitised unexposed films (Chapter 37), separate Geiger/scintillation counters (heading 90.30), UV/IR ray therapy units (heading 90.18), general hospital furniture (heading 94.02), and protective lead-rubber gloves (heading 40.15) or lead-glass goggles (heading 90.04)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.22 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
