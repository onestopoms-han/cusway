const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9603",
  "titleKo": "96.03 - 비ㆍ브러시(기계ㆍ기구ㆍ차량 등의 부분품을 구성하는 브러시를 포함한다)ㆍ모터를 갖추지 않은 기계식 바닥청소기(수동식으로 한정한다)ㆍ모프(mop)ㆍ깃 먼지털이, 비나 브러시의 제조용으로 묶었거나 술(tuft)의 모양으로 정돈한 물품, 페인트용 패드ㆍ롤러, 스퀴지(squeegee)[롤러스퀴지(roller squeegee)는 제외한다]",
  "titleEn": "96.03 - Brooms, brushes (including brushes constituting parts of machines, appliances or vehicles), hand-operated mechanical floor sweepers, not motorised, mops and feather dusters; prepared knots and tufts for broom or brush making; paint pads and rollers; squeegees (other than roller squeegees).",
  "contentKo": "이 호에는 청소 및 도포용 비, 각종 브러시(기계/기구/차량용 부품형 브러시 포함), 수동식 기계 바닥청소기(모터 없는 것), 모프(대걸레), 먼지털이, 브러시 제조용 묶음 반제품(Prepared knots and tufts), 페인트용 패드와 롤러 및 바닥 물기 제거용 스퀴지를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 식물성 묶음 비와 브러시(제9603.10호) : 잔가지, 짚, 수수, 피아사바, 카멜리나 등을 단순히 끈으로 묶은 청소용 비(fly-whisk 파리채 포함).\n- 인체 화장용 브러시/칫솔(제9603.21~29호) :\n  - 칫솔 및 의치(덴탈플레이트) 브러시(제9603.21호).\n  - 헤어 브러시, 면도용 솔(shaving brush), 네일(손톱) 브러시, 눈썹/속눈썹(아이래시) 화장용 솔(기타 29호).\n- 화필용/필기용 붓(제9603.30호) : 회화용 붓(유화/수채화), 서예용 붓, 메이크업 화장용 세밀 붓.\n- 페인트용 브러시/패드/롤러(제9603.40호) : 일반 페인트칠/니스칠용 평면/원형 붓, 페인트 롤러(양모/합성 피복식), 페인트 패드(딱딱한 플라스틱 백에 직물 패드를 댄 것).\n- 기계/차량/기구 부품 브러시(제9603.50호) : 도로 청소차용 회전 브러시, 방직기계용 브러시, 연마/광택기용 회전 브러시, 가전제품(진공청소기, 바닥광택기) 전용 회전 솔.\n- 기타(제9603.90호) :\n  - 청소용 솔(의류용, 모자/구두용, 주방 식기용, 유리병/유리관 청소용 꼬임 와이어 솔, 굴뚝 연도 청소용 솔, 담배 파이프 클리너 솔, 말/개 등 동물 손질용 솔).\n  - 수동식 양탄자 카펫 청소기(모터가 없고 바퀴와 실린더형 브러시 회전 연동식 자루 청소기).\n  - 모프(mop, 대걸레 - 방직 섬유 끈/스펀지가 장착된 모프 헤드 포함), 깃털 먼지털이(feather duster).\n  - 브러시 제조용 묶음/술(tufts)(주 제3호 요건) : 동물 털이나 합성 필라멘트를 소분하지 않고 추가의 트리밍 가공만 거쳐 즉시 헤드에 결합할 수 있게 고정한 것.\n  - 바닥/유리 물기 제거용 수동 스퀴지(squeegee, 고무/펠트 날이 달린 것).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단독 제시되는 브러시용 목제/플라스틱제 손잡이 및 대 (각 재질별 호 분류)\n(b) 방직용 섬유제 단순 광택/연마 원반이나 패드 (제5911호) 및 기계식 탈모용 침포(card clothing) (제8448호)\n(c) 단독 제시되는 PC용 클리닝 디스켓 (제8473호)\n(d) 의료용(후두경/내시경용 등) 특수 의학 브러시 및 치과용 회전 드릴 브러시 (제9018호)\n(e) 사진 가공/인화용 롤러형 스퀴지 (제9010호)\n(f) 화장용 분첩(powder-puff) 및 메이크업 스펀지 패드 (제9616호)\n(g) 모프헤드/대걸레 지지대에 끼우지 않고 단독 제시되는 단순 청소용 방직 섬유 걸레/행주 (제11부)" ,
  "contentEn": "This heading covers brooms, brushes (including parts of machines/vehicles), hand-operated non-motorised floor sweepers, mops, feather dusters, prepared brush knots/tufts, paint rollers/pads, and manual squeegees.\n\nIt includes :\n- Vegetable brooms (subheading 9603.10) simply bound from twigs, straw, or sorghum.\n- Toilet/grooming brushes (subheadings 9603.21 to 9603.29) including toothbrushes (21), hair brushes, shaving brushes, and nail brushes (29).\n- Artists' brushes and writing brushes (subheading 9603.30).\n- Paint brushes, rollers, and pads (subheading 9603.40).\n- Brushes as parts of machines or vehicles (subheading 9603.50) including vacuum cleaner rotary brushes and street-sweeper rollers.\n- Others (subheading 9503.90) including bottle cleaners, manual carpet sweepers, mops (including dust/sponge mops), feather dusters, prepared tufts (Note 3), and rubber squeegees.\n\nExcludes separate handles/mounts (classified by material), textile polishing discs (heading 59.11), card clothing (heading 84.48), dental/medical surgical brushes (heading 90.18), photographic roller squeegees (heading 90.10), powder-puffs (heading 96.16), and loose cleaning rags (Section XI)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.03 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
