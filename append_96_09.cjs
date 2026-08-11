const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9609",
  "titleKo": "96.09 - 연필(제9608호의 펜슬은 제외한다)ㆍ크레용ㆍ연필심ㆍ파스텔ㆍ도화용 목탄ㆍ필기용이나 도화용 초크와 재단사용 초크",
  "titleEn": "96.09 - Pencils (other than pencils of heading 96.08), crayons, pencil leads, pastels, drawing charcoals, writing or drawing chalks and tailors’ chalks.",
  "contentKo": "이 호에는 나무/플라스틱 피복식 연필, 각종 색연필/크레용, 파스텔, 연필심(흑연심, 색연필심 포함), 드로잉용 목탄(숯), 필기용 칠판분필 및 재단사들이 옷감 마킹에 사용하는 재단사용 초크를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 연필 및 크레용(집 속에 심을 넣은 것)(제9609.10호) : 목재/플라스틱/지층 피복식 흑연 연필(뒤쪽에 지우개/캡 결합형 포함), 나무 피복 색연필, 단단한 수지 케이스에 삽입된 크레용.\n- 연필심(흑색 또는 착색된 것)(제9609.20호) : 흑연과 점토의 혼합 연필심(샤프심 포함), 왁스/안료 혼합 색연필심, 아닐린 성분 등의 복사/필사용 안 지워지는 심.\n- 기타(제9609.90호) :\n  - 석필(slate pencil) : 천연/응결 슬레이트제 드로잉 봉.\n  - 분필 및 필기용 초크 : 황산칼슘(석고) 또는 탄산칼슘을 주성분으로 한 백색/채색 분필.\n  - 도화용 목탄(drawing charcoal) : 화살나무 등을 태워 만든 드로잉용 번트 차콜.\n  - 크레용 및 파스텔(피복이 없는 것) : 왁스, 쉘락, 점토, 안료를 배합하여 피복 없이 그대로 쓰는 크레파스 및 미술용 파스텔.\n  - 재단사용 초크(tailors' chalk) : 규산마그네슘인 동석(steatite) 성분의 섬유 마킹용 초크 및 석판인쇄용 크레용(litho-crayon), 유리/도자기 마킹용 세라믹 크레용.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 광업용의 단순 벌크 초크 원석 (제2509호)\n(b) 편두통 완화제 등을 배합한 의약용 스틱 (제3004호)\n(c) 눈썹용 아이브로우 펜슬 및 지혈용/화장용 스틱 연필 (제3304호 또는 제3307호)\n(d) 당구 큐 팁용 초크 (제9504호)\n(e) 밀어내기 기계장치가 결합된 샤프펜슬 및 홀더용 외각 (제9608호)" ,
  "contentEn": "This heading covers wood- or plastic-cased pencils, crayons, pastels, pencil/mechanical pencil leads, drawing charcoals, school/blackboard chalks, and tailors' chalks.\n\nIt includes :\n- Pencils and crayons cased in wood, plastics, or paper (subheading 9609.10) including common black pencils (even with erasers attached) and colored pencils.\n- Pencil leads (subheading 9609.20) including graphite leads for mechanical pencils and colored pencil leads.\n- Others (subheading 9609.90) including slate pencils, blackboard chalks (calcium sulfate/carbonate based), drawing charcoals (burnt spindle-wood), raw crayons/pastels, tailors' chalks (steatite), and lithographic crayons.\n\nExcludes crude chalk (heading 25.09), medicated pencils (heading 30.04), cosmetic eyebrow pencils (heading 33.04), billiard chalk (heading 95.04), and mechanical propelling pencils (heading 96.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.09 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
