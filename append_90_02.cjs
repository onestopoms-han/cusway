const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9002",
  "titleKo": "90.02 - 각종 재료로 만든 렌즈ㆍ프리즘ㆍ반사경과 그 밖의 광학소자(장착된 것으로서 기기의 부분품으로 사용하거나 기기에 부착하여 사용하는 것으로 한정하며, 광학적으로 가공하지 않은 유리로 만든 것은 제외한다)",
  "titleEn": "90.02 - Lenses, prisms, mirrors and other optical elements, of any material, mounted, being parts of or fittings for instruments or apparatus, other than such elements of glass not optically worked.",
  "contentKo": "이 호에는 지지 프레임, 하우징, 슬리브 등 영구적인 장착구(mounting)가 부착된 장착 상태의 광학소자(렌즈, 프리즘, 반사경 등)로서 기기(사진기, 현미경, 망원경 등)에 부분품이나 부착물로 장착되는 물품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 대물렌즈(objective lens)(제9002.11~19호) :\n  - 카메라, 영사기, 사진 확대기/축소기용 대물렌즈(제9002.11호).\n  - 현미경, 망원경용 대물렌즈 및 기타 용도 대물렌즈(제9002.19호).\n- 장착된 필터(제9002.20호) : 사진기용 컬러 필터, 현미경/편광계용 편광 필터.\n- 기타 장착된 광학소자(제9002.90호) :\n  - 어디셔널 렌즈(additional lens, 광각/망원 필터 렌즈 등) 및 뷰파인더(viewfinder).\n  - 쌍안경, 현미경, 천체 망원경용 접안경(eyepiece) 및 반사 대물경.\n  - 물리/화학 분석기기용 장착 프리즘.\n  - 의학/광학 기기용 장착 반사경(거울).\n  - 등대 또는 수로부표용 드럼/패널 장착형 광학소자(렌즈 및 프리즘).\n  - 광학대(optical bench)용 스탠드 장착형 렌즈.\n  - 장착 테가 결합된 인쇄 제판용 스크린.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 수송 중 보호 목적으로 일시적 장착을 한 미장착 광학소자 (제9001호)\n(b) 시력교정용 렌즈에 영구 테를 붙여 완성한 안경 (제9004호)\n(c) 기기에 결합되는 부분이 아니며 독자적 휴대 기기로 완성된 수지식 확대경 (제9013호) 및 의료용 반사경(이마 반사경 등) (제9018호)\n(d) 굴뚝, 배관 검사용 장착 유리 거울 및 차량용 백미러(광학 가공 유무 무관) (제9013호)\n(e) 검안용 안경 테스트용 렌즈 세트와 케이스 (제9018호)" ,
  "contentEn": "This heading covers mounted optical elements (lenses, prisms, mirrors, filters, etc.) fitted with permanent mountings (brackets, frames, or tubes) designed to be integrated into optical instruments or apparatus.\n\nIt includes :\n- Objective lenses (subheadings 9002.11 to 9002.19) including those for cameras, projectors, enlargers, microscopes, and telescopes.\n- Mounted optical filters (subheading 9002.20) such as photographic colour filters or polarising filters.\n- Eyepieces and optical mirrors with mountings, mounted prisms for chemical analysis instruments, mounted screens, and optical panels for lighthouses (subheading 9002.90).\n\nExcludes optical elements with temporary protective mountings (heading 90.01), spectacles/goggles (heading 90.04), hand magnifying glasses (heading 90.13), vehicle rear-view mirrors (heading 90.13), and optician's trial cases of lenses (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.02 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
