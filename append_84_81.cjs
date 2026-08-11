const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8481",
  "titleKo": "84.81 - 파이프ㆍ보일러 동체ㆍ탱크ㆍ통이나 이와 유사한 물품에 사용하는 탭ㆍ코크ㆍ밸브와 이와 유사한 장치(감압밸브와 온도제어식 밸브를 포함한다)",
  "titleEn": "84.81 - Taps, cocks, valves and similar appliances for pipes, boiler shells, tanks, vats or the like, including pressure-reducing valves and thermostatically controlled valves.",
  "contentKo": "이 호에는 유체(액체, 점성체, 기체)나 고체(예: 모래)의 흐름(공급, 유출 등)을 조절하거나 압력/유속을 조정하기 위해 관, 탱크, 통 등에 사용하는 탭, 코크, 밸브와 유사한 장치를 분류한다.\n개폐구(게이트, 디스크, 볼, 플러그, 다이어프램 등)를 조작하여 흐름을 통제하며, 자동온도조절 소자(thermostatic element)나 압력 캡슐 등을 갖춘 자동 제어 밸브를 포함한다.\n\n이 호에는 특히 다음의 것을 포함한다.\n(1) 감압밸브(pressure-reducing valve) : 가스나 공기 등의 압력을 일정 수준으로 감압 조절 및 유지하는 밸브 (압력계와 결합된 경우 밸브의 본질적인 특성을 가졌다면 이 호 분류).\n(2) 유압이나 공기압 전송용 밸브 (액압/공기압 fluid power 전송 시스템용 밸브).\n(3) 논리턴(nonreturn) 밸브 (체크밸브, 볼 체크밸브 등).\n(4) 안전밸브 (safety/relief valve) (경고음 장치 유무 무관, 단 단순 파열원판은 재질별로 분류).\n(5) 분기밸브 (3방향 밸브, 크리스마스트리 밸브 등).\n(6) 액면계용 제어밸브, 취출밸브, 차단밸브.\n(7) 라디에이터 배수 탭, 이너튜브 밸브.\n(8) 플로우트(float)식 제어밸브, 증기트랩(steam trap).\n(9) 소화전(stand pipe), 소화용 코크 및 노즐 (분무 콕 장착식, 기계식 스프링클러 헤드 제8424호 제외).\n(10) 온도제어식 혼합용 탭/밸브 (온도감지 혼합밸브).\n(11) 선박용 밑바닥(선저) 코크 및 수중밸브.\n(12) 압력 스프레이캔 뚜껑 (살충제 등의 헤드 밸브).\n\n완전한 밸브를 형성하지 않는 기계 내부 유체흐름 조정용 특정 기계 부분품은 각 기계의 부분품으로 분류한다 (예: 내연기관 흡배기밸브 제8409호, 슬라이드밸브 제8412호, 가스압축기용 밸브 제8414호).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 비경화 가황고무제(제4016호), 도자제(제6903/6909호), 유리제(제7017/7020호)의 탭/밸브\n(b) 수채, 변소 등의 U자형 배수트랩 및 세수기물통 (재질에 따라 제3922호, 제6910호, 제7324호 등)\n(c) 증기기관용 원심조속기(제8412호)\n(d) 계량 장치가 결합된 주류/식음료 디스펜서용 탭 (제8479호)",
  "contentEn": "This heading covers taps, cocks, valves and similar appliances used to regulate the flow of fluids (liquids, gases, viscous materials) or solids (e.g., sand) through pipes, tanks or boiler shells.\n\nIt includes :\n(I) Pressure-reducing valves and regulators.\n(II) Valves for hydraulic or pneumatic fluid power transmission.\n(III) Non-return (check) valves.\n(IV) Safety or relief valves.\n(V) Mixing taps, thermostatically controlled valves, and steam traps.\n(VI) Inner-tube valves and spray-can valve caps.\n(VII) Fire hydrants and water-spraying nozzles with integrated taps.\n\nParts of these appliances are also covered.\n\nThe heading excludes :\n(a) Valves of unhardened vulcanised rubber (heading 40.16), ceramics (heading 69.03 or 69.09) or glass (heading 70.17 or 70.20).\n(b) Engine inlet/exhaust valves (heading 84.09), slide valves for steam engines (heading 84.12) and compressor valves (heading 84.14).\n(c) U-bends and traps for sanitary basins or toilets (classified by material).\n(d) Taps combined with measuring/dispensing devices for beverages (heading 84.79)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.81 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
