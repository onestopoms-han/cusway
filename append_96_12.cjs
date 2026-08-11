const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9612",
  "titleKo": "96.12 - 타자기용 리본이나 이와 유사한 리본(잉크가 침투되어 있거나 인쇄에 사용할 수 있는 상태인 것을 포함하며, 스풀에 감긴 것이거나 카트리지 모양인지에 상관없다)과 잉크 패드(잉크가 침투되어 있는지 또는 상자들이의 것인지에 상관없다)",
  "titleEn": "96.12 - Typewriter or similar ribbons, inked or otherwise prepared for giving impressions, whether or not on spools or in cartridges; ink-pads, whether or not inked, with or without boxes.",
  "contentKo": "이 호에는 타자기, 계산기, 영수증 인출기, 금전등록기, 전보수신기(텔레프린터), 자동계량저울 및 기압/온도자전기록계 등에 쓰이는 잉크 침투식 인쇄용 리본(카트리지식, 스풀식 불문)과 스탬프날인용 잉크 패드(스탬프주머니 잉크패드)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 인쇄 리본(제9612.10호) :\n  - 타자기, 계산기, 영수증 프린터용 잉크 침투식 직물 리본(스풀에 감겼거나 플라스틱 카트리지 내장형).\n  - 기압/온도 기록계 등 과학 계측 장비의 지침 기록용 전용 리본.\n  - 플라스틱 또는 종이 기재에 색소나 잉크를 얇게 도포하여 인쇄 압력 시 전사되도록 처리한 전사용 마일러(Mylar) 리본.\n- 잉크 패드(ink-pad)(제9612.20호) : 수동 스탬프 날인을 위해 잉크를 머금을 수 있도록 펠트나 흡수성 천을 플라스틱/목재/금속 케이스(박스)에 장착한 것(잉크가 이미 충전되어 있거나 미충전된 것 불문).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 리본보다 폭이 넓어(일반적으로 3cm 초과) 계산기/금전등록기 복사용 롤 카본지로 사용되는 복사지 롤 (제48류)\n(b) 잉크가 침투되거나 도포되지 않은 직물/플라스틱 리본 (재질별 분류, 예: 제39류 또는 제11부)\n(c) 잉크를 머금지 않은 빈 스풀(spool) 단독 제시품 (재질별 분류)\n(d) 잉크칠에 사용하는 수동 잉크 롤러 (재질별 분류)" ,
  "contentEn": "This heading covers inked or prepared ribbons for typewriters, calculators, cash registers, or data-recording instruments, and ink-pads for hand stamps.\n\nIt includes :\n- Ink ribbons (subheading 9612.10) whether on spools or in plastic cartridges, made of textile, plastics (Mylar), or paper coated with ink or carbonaceous material.\n- Ribbons with metal fittings for barographs or thermographs.\n- Ink-pads (subheading 9612.20) made of felt or fabric mounted on a base or box (whether or not already inked).\n\nExcludes carbon paper rolls wider than 3 cm (Chapter 48), uninked ribbons (classified by material), empty spools, and manual ink rollers."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.12 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
