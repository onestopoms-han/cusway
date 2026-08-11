const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9606",
  "titleKo": "96.06 - 단추ㆍ프레스파스너(press-fastener)ㆍ스냅파스너(snap-fastener)ㆍ프레스스터드(press-stud)ㆍ단추의 몰드(mould)와 이들의 부분품, 단추 블랭크(blank)",
  "titleEn": "96.06 - Buttons, press-fasteners, snap-fasteners and press-studs, button moulds and other parts of these articles; button blanks.",
  "contentKo": "이 호에는 의류나 가정용 텍스타일(린넨) 제품의 잠금 및 장식용으로 쓰는 단추(일반 단추, 프레스 단추, 똑딱단추, 스냅단추)와 단추 뼈대인 몰드(mould), 단추의 부분품 및 단추 가공용 블랭크(blank)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 프레스파스너/스냅파스너/프레스스터드 및 그 부분품(제9606.10호) : 2개 이상의 스냅 기구 결합식 단추(똑딱단추, 리벳식 청바지 스냅, 가죽 장갑용 단추 등) 및 방직용 섬유 테이프에 줄지어 부착되어 제시되는 프레스 파스너.\n- 단추(피복되지 않은 플라스틱제)(제9606.21호).\n- 단추(피복되지 않은 비금속제)(제9606.22호).\n- 기타 단추(제9606.29호) : 방직용 섬유직물로 피복된 단추, 목재/자개/상아/뼈/도자기/유리/가죽제 단추.\n- 단추 몰드, 부분품 및 블랭크(제9606.30호) :\n  - 단추 몰드(button mould) : 단추 겉면을 종이나 직물, 가죽 등으로 씌우기 위해 내부 뼈대로 사용하는 목재/금속제 몰드.\n  - 단추 부분품 : 단추 고리(섕크 shank), 베이스(밑받침), 헤드(머리부).\n  - 단추 블랭크(button blank) : 단추를 만들기 위한 중간 단계의 형상물(성형 가공되어 깎거나 뚫고 연마하는 최종 가공을 남겨둔 것, 꼭 맞물리도록 찍어낸 프레스 금속 판 블랭크, 겉면 깎기나 구멍 뚫기 처리가 일부 진행된 자개/코로조/목제 디스크). 단, 단순 톱질하여 절단되고 가공 처리가 전혀 진행되지 않은 원판(디스크) 형태의 것은 재질에 따라 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 신변 장식 목적이 뚜렷한 금/은제 커프스 버튼(커프링크) 및 모조 보석 커프링크 (제7113호 또는 제7117호)\n(b) 천연/양식진주, 귀석, 반귀석, 귀금속이 단순 테두리나 이니셜 장식을 넘어서 주 구성 재료로 다량 혼용된 단추 (제71류)\n(c) 단추 고정용 지퍼(슬라이드파스너) (제9607호)" ,
  "contentEn": "This heading covers buttons, decorative buttons, press-fasteners, snap-fasteners, press-studs, button moulds, and button blanks of any material (except where precious metals/stones constitute more than minor constituents, which fall in Chapter 71).\n\nIt includes :\n- Press-fasteners, snap-fasteners, and press-studs (subheading 9606.10) operated by snap mechanisms (e.g. for gloves or jeans, including those mounted on narrow tape).\n- Buttons not covered with textile material: of plastics (subheading 9606.21) or of base metal (subheading 9606.22).\n- Other buttons (subheading 9606.29) including those covered with textile fabric, or made of wood, mother-of-pearl, ivory, or bone.\n- Button moulds, parts, and blanks (subheading 9606.30) including cores to be covered with textiles/leather, shanks, heads, and partially worked blanks (e.g. turned or drilled shells/corozo discs).\n\nExcludes cuff-links (heading 71.13 or 71.17), zipper fasteners (heading 96.07), and raw unworked shell/wood discs (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.06 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
