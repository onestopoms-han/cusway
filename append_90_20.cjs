const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9020",
  "titleKo": "90.20 - 그 밖의 호흡용 기기와 가스마스크(기계적인 부분품과 교환용 필터를 모두 갖추지 않은 보호용 마스크는 제외한다)",
  "titleEn": "90.20 - Other breathing appliances and gas masks, excluding protective masks having neither mechanical parts nor replaceable filters.",
  "contentKo": "이 호에는 비행사, 잠수부, 소방관 등이 사용하는 기계적 호흡용 기기와 오염/유독 가스 환경에서 흡입 밸브 및 교체식 정화 필터를 장착한 가스마스크(방독면)를 분류한다. 단, 기계 부품 및 교체 필터가 없는 단순 섬유제 마스크는 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 호흡용 기기(breathing appliances) :\n  - 자급식 호흡기(산소/압축공기 실린더 장착형).\n  - 외부 공기 압축기 연결식 호흡 송기 기구 및 호스.\n  - 잠수 모자(helmet)(잠수복 부착용).\n  - 호흡 장치가 내장된 방사선/오염 예방 방호복.\n- 가스마스크(gas masks)(방독면) :\n  - 안면 창, 출구/흡입 밸브, 여과 캐니스터(필터) 및 연결 주름관(flexible tube)이 결합된 가스마스크.\n  - 입과 코만을 덮으며 활성탄/흡수재 필터 카트리지를 교체할 수 있는 간이 방독 마스크.\n- 부분품과 부속품 : 가스마스크용 정화통(필터 통), 마우스피스, 헤드 스트랩 끈 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 기계 부품이나 교환용 필터가 없는 단순 다층 방직용 섬유제 마스크(황사/방한/수술용 마스크) (제6307호)\n(b) 단순 금속 망으로 된 먼지 차단용 페이스 가드 (제15부)\n(c) 마취기용 마취 마스크 (제9018호)\n(d) 고압 산소 공급 장치가 없는 레저 수영/스쿠버용 스노클(snorkel) 튜브 (제9506호)" ,
  "contentEn": "This heading covers mechanical breathing appliances (for airmen, divers, mountaineers, or firefighters) and gas masks equipped with mechanical parts (valves) or replaceable canisters/filters.\n\nIt includes :\n- Breathing appliances including self-contained units (with oxygen/air cylinders) or compressor-fed hose masks.\n- Divers' helmets and anti-pollution protective suits incorporating breathing apparatus.\n- Gas masks containing filter canisters, inlet/outlet valves, and flexible tubes, as well as half-masks with replaceable cartridges.\n- Parts and accessories.\n\nExcludes simple disposable non-woven or textile protective masks (surgical masks, dust masks) (heading 63.07), simple wire-gauze dust masks (Section XV), anaesthetic masks (heading 90.18), and swim snorkels (heading 95.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.20 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
