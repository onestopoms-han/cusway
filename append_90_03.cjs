const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9003",
  "titleKo": "90.03 - 안경ㆍ고글이나 이와 유사한 물품의 테와 장착구, 이들의 부분품",
  "titleEn": "90.03 - Frames and mountings for spectacles, goggles or the like, and parts thereof.",
  "contentKo": "이 호에는 시력교정용 안경, 선글라스, 고글 및 이와 유사한 물품에 사용하는 안경테(frame)와 렌즈 장착구(mounting) 및 이들의 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 안경/고글용 테와 장착구(제9003.11~19호) :\n  - 플라스틱 제 테 (제9003.11호).\n  - 비금속(卑金屬), 귀금속, 귀금속을 입힌 금속, 귀갑, 진주모패각, 가죽, 고무, 목재 등으로 만든 테 (제9003.19호).\n- 안경테의 부분품(제9003.90호) : 안경다리(사이드 피이스 side-piece), 안경다리용 금속 심(core), 경첩(hinge), 조인트, 렌즈 바퀴테(eye-rim), 코 받침 브리지(bridge), 코 패드(nose-piece), 코안경(pince-nez)용 스프링 기구, 손잡이가 긴 안경(lorgnette)의 손잡이.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 범용성 부분품에 해당하는 비금속제 소형 나사(screw), 연결 체인(안경 걸이 줄), 코일 스프링 (제15부 또는 제39류)\n(b) 검안용으로 특수 설계된 시험용 안경테 (제9018호)\n(c) 장난감 안경테 (제9503호)" ,
  "contentEn": "This heading covers frames and mountings for spectacles, goggles, sunglasses or similar articles of heading 90.04, and parts thereof.\n\nIt includes :\n- Frames and mountings made of plastics (subheading 9003.11) or other materials (subheading 9003.19) such as base metals, precious metals, tortoise-shell, mother-of-pearl, leather, or rubber.\n- Parts of frames (subheading 9003.90) including side-pieces (temples) and their metal cores, hinges, joints, eye-rims, bridges, nose-pieces, spring mechanisms for pince-nez, and handles for lorgnettes.\n\nExcludes screws, chains (without attachments), and springs of base metal (classified in their respective headings per Section XV Notes), and ophthalmic trial frames used by opticians (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.03 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
