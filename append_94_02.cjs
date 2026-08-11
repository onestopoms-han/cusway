const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9402",
  "titleKo": "94.02 - 내과용ㆍ외과용ㆍ치과용ㆍ수의과용 가구류(예: 수술대ㆍ검사대ㆍ기계식 장비를 갖춘 병원용 침대ㆍ치과용 의자), 회전ㆍ뒤로 젖힘ㆍ상하 조절 기능을 갖춘 이발용 의자와 이와 유사한 의자, 이들의 부분품",
  "titleEn": "94.02 - Medical, surgical, dental or veterinary furniture (for example, operating tables, examination tables, hospital beds with mechanical fittings, dentists' chairs); barbers' chairs and similar chairs, with rotating as well as both reclining and elevating movements; parts thereof.",
  "contentKo": "이 호에는 내과, 외과, 치과, 수의과용으로 특수 설계된 의료용 가구류와 회전, 틸팅(뒤로 젖힘), 승강(상하 조절) 기능이 함께 결합된 이발소/미용실용 의자 및 이들의 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 치과용/이발용 의자 및 부분품(제9402.10호) :\n  - 치과용 의자 : 높낮이 조절(신축식) 및 경사/회전 기구를 갖춘 것(단, 치과용 기기가 부착되지 않은 본체 상태에 한함).\n  - 이발용 의자 및 유사 의자 : 회전, 뒤로 젖힘, 승강 기능을 동시에 결합한 전용 의자.\n  - 전용 부분품 : 헤드레스트(머리받침), 백레스트(등받침), 암레스트(팔걸이), 풋레스트(발판).\n- 기타 의료용 가구류(제9402.90호) :\n  - 일반/정형외과용 수술대(환자 위치 조절 기구 부착식), 동물 생체 해부대.\n  - 마사지용 진찰대, 산부인과/비뇨기과 진료용대/의자, 분만용 침대(birthing bed).\n  - 환자 이송용 기계식 침대(환자 이동 및 간호용 메카니즘 내장), 결핵 치료용 경첩식 매트리스 지지 침대, 골절 견인 치료용 침대(견인틀 고정식).\n  - 진료 구내 이동용 들것(stretcher) 및 트롤리(바퀴 달린 들것).\n  - 병원용 살균 가트, 의료기기/의약품/붕대 수납용 소형 롤링 테이블 및 롤링 약품함, 무균 의약품 캐비닛(바퀴 달린 것 포함).\n  - 수술대에 장착되어 환자의 어깨, 다리, 머리 등을 고정해 주는 고정 장치(부속 보조 용구).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 치과용 물 헹굼 타구(spittoon) 단독 또는 치과용 기기(드릴, 주수기 등)가 물리적으로 통합 장착된 치과용 의자 유닛 (제9018호)\n(b) 병원용이라도 기계 장치가 부착되지 않은 일반 침대, 식탁, 일반 수납용 가구 (제9403호)\n(c) 병원용 엑스선(X-ray) 전용 수술대 및 환자 거치대 (제9022호)\n(d) 의료진이 수술대 등에서 직접 장착하지 않고 단순히 침대 위에 가볍게 얹어 사용하는 골절용 스플린트/부목 (제9021호)\n(e) 일반 회전 의자 및 높이 조절식 사무용 의자 (제9401호)\n(f) 휠체어 등 장애우 운반용 차량 (제8713호)" ,
  "contentEn": "This heading covers specialized furniture designed for medical, surgical, dental, or veterinary use, as well as barbers' chairs with simultaneous rotating, reclining, and elevating movements, and parts thereof.\n\nIt includes :\n- Dentists' or barbers' chairs (subheading 9402.10) with telescopic height adjustment and tilt/swivel mechanisms, and their parts (headrests, footrests, armrests).\n- Other medical furniture (subheading 9402.90) including operating tables, veterinary autopsy tables, examination tables, confinement/birthing beds, mechanical hospital beds, stretchers, medical instrument trolleys, and aseptic dressing cabinets.\n- Patient stabilizer clamps (shoulder/leg braces) designed to be mounted on operating tables.\n\nExcludes dentists' chairs incorporating dental appliances of heading 90.18, hospital beds without mechanical fittings (heading 94.03), X-ray examination tables (heading 90.22), and wheelchairs (heading 87.13)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.02 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
