const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8511",
  "titleKo": "85.11 - 불꽃점화식이나 압축점화식 내연기관의 점화용ㆍ시동용 전기기기(예: 점화용 자석발전기ㆍ자석발전기ㆍ점화코일ㆍ점화플러그ㆍ예열플러그ㆍ시동전동기), 내연기관에 부속되는 발전기(예: 직류발전기ㆍ교류발전기)와 개폐기",
  "titleEn": "85.11 - Electrical ignition or starting equipment of a kind used for spark-ignition or compression-ignition internal combustion engines (for example, ignition magnetos, magneto-dynamos, ignition coils, sparking plugs and glow plugs, starter motors); generators (for example, dynamos, alternators) and cut-outs of a kind used in conjunction with such engines.",
  "contentKo": "이 호에는 자동차, 항공기, 선박 및 고정식 내연기관의 점화용, 시동용 전기기기와 내연기관용 발전기 및 개폐기(컷아웃)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 점화플러그(sparking plug) : 고전압을 통해 실린더 내 가스를 스파크 점화시키는 플러그.\n(B) 점화용 자석발전기(ignition magneto) 및 직류 자석발전기(magneto-dynamo) : 점화용 고전압 발생 자성 발전기.\n(C) 마그네틱 플라이휠(magnetic flywheel) : 플라이휠 내 장착 점화 전류 발생장치.\n(D) 배전기(distributor) 및 단속기 : 각 실린더에 전류를 배전 및 개폐하는 단속 장치.\n(E) 점화코일(ignition coil) : 배터리 전압을 고압으로 유도하는 유도코일 (배전기 없는 이중 점화 방식 및 반도체 코일 모듈 포함).\n(F) 시동전동기(starter motor) : 내연기관 시동용 소형 직류 모터 (스타터 모터).\n(G) 발전기(직류용 dynamo, 교류용 alternator) : 축전지 충전 및 차량 전원 공급용 발전기.\n(H) 승압코일(booster coil) : 시동 시 점화 성능을 보완하기 위한 보조 유도코일.\n(IJ) 예열플러그(glow plug) : 디젤 엔진 시동 시 실린더 내부 공기를 저항 열로 가열하는 플러그.\n(K) 가열코일(heating coil) : 디젤 엔진 공기 흡입구용 예열 코일.\n(L) 직류발전용 개폐기(dynamo cut-out) : 엔진 정지/저속 시 배터리가 방전되는 것을 차단하는 컷아웃 (전압/전류 조정기와 일체형인 것 포함).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 지상 장비용 내연기관 시동장치 (변압기/정류기로 구성된 것) (제8504호)\n(b) 축전지 (제8507호)\n(c) 자전거 조명용 전용 직류 발전기 (제8512호)",
  "contentEn": "This heading covers electrical starting or ignition equipment and appliances for internal combustion engines, and generators and cut-outs used in conjunction with them.\n\nIt includes :\n(A) Sparking plugs.\n(B) Ignition magnetos, magneto-dynamos and magnetic flywheels.\n(C) Distributors and contact breakers.\n(D) Ignition coils (including double-spark coils and semiconductor-controlled ignition modules).\n(E) Starter motors (DC series wound motor with pinion engagement).\n(F) Generators (dynamos and alternators) driven by the engine to charge batteries and supply auxiliary equipment.\n(G) Booster coils for engine starting.\n(H) Glow plugs for pre-heating diesel cylinder chambers.\n(IJ) Heating coils for diesel air intakes.\n(K) Dynamo cut-outs (including those combined in a single housing with voltage/current regulators).\n\nParts of these items are also classified here.\n\nThe heading excludes :\n(a) Airfield or station engine starters consisting of a transformer and rectifier (heading 85.04).\n(b) Electric accumulators (heading 85.07).\n(c) Dynamos used on bicycles solely for lighting (heading 85.12)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.11 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
