const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8473",
  "titleKo": "84.73 - 제8470호부터 제8472호까지에 해당하는 기계에 전용되거나 주로 사용되는 부분품과 부속품(커버ㆍ휴대용 케이스와 이와 유사한 물품은 제외한다)",
  "titleEn": "84.73 - Parts and accessories (other than covers, carrying cases and the like) suitable for use solely or principally with machines of headings 84.70 to 84.72.",
  "contentKo": "부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 제8470호부터 제8472호까지에 해당하는 기계에 전용되거나 주로 사용하는 부분품과 부속품을 분류한다.\n부속품은 기계를 특정 조작에 적합시키거나 작동 범위를 늘리기 위해 설계된 호환성의 부분품/장치이다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 용지공급장치 (연속식 등)\n(2) 자동 스페이스 조정 장치\n(3) 주소인쇄기용 리스트장치(listing device)\n(4) 도표용 기계용 부속인쇄장치\n(5) 타자기용 카피홀더(copy holder)\n(6) 주소인쇄기용 금속 주소판 (가공 여부 불문)\n(7) 타자기, 회계기용 결합 계산장치\n(8) 디스크 드라이브 세정용 디스켓\n(9) 전용/주요 사용 목적의 전자기억모듈 (SIMM, DIMM 등, MCO 제외)\n기계 전용 스탠드로서 보통 기계와 함께가 아니면 사용할 수 없는 것은 이 호에 분류한다.\n\n다만, 커버, 휴대용 케이스, 펠트패드 등은 제외한다. 일반 사무용 가구(테이블 등)도 제외한다(제9403호).\n\n또한 이 호에는 다음의 것도 제외한다.\n(a) 스풀(spool) 및 유사 감기용구 (재료에 따라 제3923호 또는 제15부 분류)\n(b) 마우스 패드 (재료에 따라 분류)\n(c) 등사판원지 (제4816호 또는 재료에 따라 분류)\n(d) 인쇄된 통계용 카드 (제4823호)\n(e) 자기디스크팩 및 자기식 기록 매체물 (제8523호)\n(f) 전자집적회로 (제8542호)\n(g) 회전계 및 타입 속도계 (제9029호)\n(h) 타자기 인쇄용 리본 (잉크 처리 여부 무관, 제9612호 등)\n(ij) 모노포드, 바이포드, 트라이포드 삼각대 (제9620호)",
  "contentEn": "This heading covers parts and accessories suitable for use solely or principally with the machines of headings 84.70 to 84.72 (excluding covers, carrying cases and the like).\n\nIt includes :\n(I) Paper-feed and continuous form-feeding attachments.\n(II) Listing devices for addressing machines.\n(III) Electronic memory modules (SIMMs, DIMMs) without a specific independent function.\n(IV) Auxiliary calculating devices designed to be fitted to typewriters or accounting machines.\n(V) Cleaning diskettes for disk drives.\n\nParts and accessories of headings 84.70, 84.71 or 84.72 are also covered.\n\nThe heading excludes :\n(a) Spools, cassettes and cartridges for ink ribbons (classified by material).\n(b) Mouse pads (classified by material).\n(c) Stencil sheets (heading 48.16 or by material).\n(d) Magnetic tapes, floppy discs and other media for recording (heading 85.23).\n(e) Integrated circuits (heading 85.42).\n(f) Office furniture (e.g., desks, tables) (heading 94.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.73 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
