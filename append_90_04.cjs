const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9004",
  "titleKo": "90.04 - 시력교정용ㆍ보호용이나 그 밖의 용도의 안경ㆍ고글과 이와 유사한 물품",
  "titleEn": "90.04 - Spectacles, goggles and the like, corrective, protective or other.",
  "contentKo": "이 호에는 눈(eye)을 덮도록 설계된 것으로, 렌즈나 유리 등을 프레임(테)이나 자루에 부착하여 만든 시력교정용, 눈 보호용, 또는 입체영화 관람 등 특수 기능성 안경과 고글을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 선글라스(sunglasses)(제9004.10호) : 자외선 및 강한 햇빛 차단용 안경.\n- 기타 안경 및 고글(제9004.90호) :\n  - 시력교정용 안경, 코안경(pince-nez), 외알 안경(monocle), 손잡이 달린 안경(lorgnette).\n  - 보호용 고글 : 겨울철 스포츠/등산용 안경, 용접공/주조공/전기기술자/도로공사/석재 절단공용 보호 고글.\n  - 수중 안경 및 물안경(수중용 고글).\n  - 시력교정안경 위에 덧붙이는 클립온 안경(선글라스 클립 등).\n  - 3D/입체영화 관람용 편광 안경(판지/종이 테 제품 포함).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 콘택트렌즈 (제9001호)\n(b) 안경용 프레임 및 부분품 (제9003호)\n(c) 얼굴 전체 또는 얼굴의 상당 부분을 덮는 안면 보호구(용접용 마스크/페이스 실드, 수중 다이빙용 페이스 마스크 등) (제3926호, 제9018호 등)\n(d) 쌍안경식 장치가 결합된 오페라 글라스 및 레이싱 글라스 (제9005호)\n(e) 완구용 장난감 안경 (제9503호)\n(f) 가장무도회용 카니발 안경 (제9505호)" ,
  "contentEn": "This heading covers spectacles, goggles, and similar articles designed to cover only the eyes for corrective, protective, or other purposes.\n\nIt includes :\n- Sunglasses (subheading 9004.10).\n- Corrective spectacles, pince-nez, lorgnettes, and monocles (subheading 9004.90).\n- Protective goggles for sports (skiing, mountaineering), aviation, motoring, or industrial occupations (welding, foundry work, stone-cutting).\n- Underwater goggles.\n- Clip-on glasses (e.g. sun filters for corrective glasses).\n- 3D/stereoscopic viewing glasses (including cardboard frames with plastic polarising lenses).\n\nExcludes contact lenses (heading 90.01), spectacle frames and parts thereof (heading 90.03), face-shields or diving masks covering most of the face (heading 39.26, 90.18 or 95.06), opera glasses with magnification (heading 90.05), and toy spectacles (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.04 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
