const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9616",
  "titleKo": "96.16 - 향수용 분무기와 이와 유사한 화장용 분무기, 이들의 마운트(mount)와 두부(頭部), 화장용 분첩과 패드",
  "titleEn": "96.16 - Scent sprays and similar toilet sprays, and mounts and heads therefor; powder-puffs and pads for the application of cosmetics or toilet preparations.",
  "contentKo": "이 호에는 화장용 및 향수용 분무기(스프레이 완제품), 분무기 전용 마운트(고정 조립부품) 및 분무 헤드(두부), 그리고 화장품 도포용 분첩(파우더 퍼프)과 메이크업 패드를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 화장용 분무기 및 그 부속품(제9616.10호) :\n  - 향수용, 모발 케어(브릴리언틴 등)용 탁상식 또는 포켓용 스프레이 분무기 완제품(피스톤 펌프식 또는 그물망 피복 고무 압착 튜브식 마운트가 조립된 것).\n  - 화장용 분무기 마운트(mount) 및 분무기 헤드(head-piece, 안개 분사 장치가 조립된 머리 부분).\n- 화장용 분첩과 패드(제9616.20호) : 안면 분말가루용 파우더 퍼프, 볼연지용 패드, 베이비 파우더(탈쿰) 도포용 퍼프(솜털, 토끼털, 스킨, 모피, 벨벳/파일 직물, 스펀지폼 러버 재질 불문, 손잡이나 장식 테가 자개, 상아, 플라스틱, 귀금속인 경우 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 분무 마운트(펌프 헤드)가 없이 단독 제시되는 향수 유리 공병 및 플라스크 (각 재질별 분류, 예: 제7010호)\n(b) 마운트가 조립되지 않은 단순 분무용 고무 벌브/공기 펌프 주머니 (제4014호)\n(c) 일반 페인트, 농약 등 소독액 살포용 기계식 분무기 (제8424호)\n(d) 화장실 벽 등에 설치되는 자동 분무식 방향제 뿜는 기계 (제8476호)" ,
  "contentEn": "This heading covers scent/brilliantine/toilet sprays (table or pocket type) with their spray mounts and head-pieces, and powder-puffs/pads for applying cosmetics or toilet preparations.\n\nIt includes :\n- Scent sprays and mounts/heads therefor (subheading 9616.10) incorporating the spray-forming head and pneumatic rubber bulb or piston.\n- Powder-puffs and pads (subheading 9616.20) made of any material (down, animal hair, pile fabrics, foam rubber) for applying face powder, rouge, or talcum, with or without handles of ivory, tortoise-shell, plastic, or precious metal.\n\nExcludes separately presented spray bottles/flasks without mounts (classified by material), simple rubber bulbs (heading 40.14), mechanical dispersing appliances (heading 84.24), and coin-operated scent-spraying machines (heading 84.76)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.16 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
