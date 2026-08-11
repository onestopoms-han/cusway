const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8513",
  "titleKo": "85.13 - 휴대용 전등(건전지ㆍ축전지ㆍ자석발전기와 같은 자체 전원기능을 갖춘 것으로 한정하며, 제8512호의 조명기구는 제외한다)",
  "titleEn": "85.13 - Portable electric lamps designed to function by their own source of energy (for example, dry batteries, accumulators, magnetos), other than lighting equipment of heading 85.12.",
  "contentKo": "이 호에는 건전지, 축전지, 자석발전기 등 자체 전원을 갖춘 휴대용 전기 전등(손이나 신변에 지니고 다니도록 제작된 전등)을 분류한다.\n\n이 호에는 다음의 전등을 포함한다.\n(1) 포켓전등 : 수동 레버로 발전기를 구동하여 점등하는 다이나모 램프 포함.\n(2) 휴대식 핸드램프 : 일시적 걸이 장치나 지상 거치용 다리가 결합된 것 포함.\n(3) 회중전등 및 손전등(flashlight) : 펜 모양 손전등 포함.\n(4) 모르스 신호용 전등.\n(5) 광부용 안전등 : 헬멧 부착용 램프와 벨트 부착용 축전지로 구성된 형태.\n(6) 의사, 시계공, 보석공 등이 사용하는 헤드밴드 장착식 범용 시험용 전등 (자체 주머니 배터리 등 자체 전원을 가진 것에 한정).\n(7) 피스톨, 립스틱 등 여러 완구/기호 양식의 회중전등 및 펜/드라이버/열쇠고리와 결합된 램프 (주요 기능이 조명인 복합물품에 한정).\n(8) 책 부착용 클립이 달린 독서용 미니 전등.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품(용기, 렌즈 유지 캡 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 자동차/자전거용 조명기구 (제8512호)\n(b) 고정용 조명기구 및 등기구 (제9405호)\n(c) 사진용 플래시/섬광기구 (제9006호)\n(d) 의료용 진단 전등 (안과/이비인후과 검사용 등) (제9018호)\n(e) 레이저 포인터 (제9013호)",
  "contentEn": "This heading covers portable electric lamps designed to function by their own source of energy (dry batteries, accumulators, or magnetos).\n\nIt includes :\n(1) Pocket lamps (including hand-operated \"dynamo lamps\").\n(2) Hand lamps and torches (flashlights).\n(3) Morse signalling lamps.\n(4) Miners' safety lamps (helmet-mounted lamps with belt-carried battery).\n(5) Headband-mounted examination lamps for doctors, watchmakers, or jewellers (provided they have their own power source, e.g., pocket batteries).\n(6) Fancy torches (shaped like pistols, lipsticks, or combined with pens/keyrings where the principal function remains lighting).\n(7) Clip-on reading lamps.\n\nParts of these lamps are also classified here.\n\nThe heading excludes :\n(a) Cycle or motor vehicle lighting equipment (heading 85.12).\n(b) Fixed lighting fittings (heading 94.05).\n(c) Photographic flash apparatus (heading 90.06).\n(d) Medical diagnostic lamps (heading 90.18).\n(e) Laser pointers containing laser diodes (heading 90.13)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.13 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
