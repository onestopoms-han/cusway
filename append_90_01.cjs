const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9001",
  "titleKo": "90.01 - 광섬유와 광섬유 다발, 제8544호의 것 외의 광섬유 케이블, 편광재료(polarizing material)로 만든 판, 각종 재료로 만든 렌즈(콘택트렌즈를 포함한다)ㆍ프리즘ㆍ반사경과 그 밖의 광학소자로서 장착되지 않은 것(광학적으로 가공하지 않은 유리로 만든 광학소자는 제외한다)",
  "titleEn": "90.01 - Optical fibres and optical fibre bundles; optical fibre cables other than those of heading 85.44; sheets and plates of polarising material; lenses (including contact lenses), prisms, mirrors and other optical elements, of any material, unmounted, other than such elements of glass not optically worked.",
  "contentKo": "이 호에는 장착(프레임이나 하우징에 결합)되지 않은 상태의 미장착 광학소자(광학 섬유, 편광판, 렌즈, 프리즘, 반사경 등)를 분류한다. 단, 광학적으로 가공(표면 연마 및 센터링 등)하지 않은 유리 제품은 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 광섬유, 광섬유 다발 및 광섬유 케이블(제9001.10호) : 굴절률이 다른 이중 유리/플라스틱 동심 구조의 광섬유 및 다발. 내시경 등에 사용되는 케이블(단, 개별 피복된 통신용 광케이블은 제8544호로 제외).\n- 편광재료로 만든 판/시트(polarising sheet/plate)(제9001.20호) : 편광 필터, 현미경 및 입체영화용 안경 렌즈용 시트.\n- 콘택트렌즈(contact lens)(제9001.30호).\n- 안경렌즈(시력교정용)(유리제 제9001.40호, 기타 플라스틱 등 제9001.50호) : 단초점, 이초점, 다초점 렌즈.\n- 기타 미장착 광학소자(제9001.90호) :\n  - 프리즘(prism) 및 렌즈 (합성/접합 렌즈 포함).\n  - 평면 테스트 판(proof plane, optical flat).\n  - 정밀 광학용 거울(반사경) : 현미경, 망원경, 영사기, 의료기기용 반사경.\n  - 사진기용 컬러 필터 및 두 매의 유리 사이에 필름을 끼운 간이 간섭 필터.\n  - 컬러 인쇄 제판용 하프톤(halftone) 스크린 원판.\n  - 회정격자(diffraction grating) : 유리에 조밀한 평행선을 새긴 격자 및 복제 필름 격자.\n  - 플라스틱, 메탈, 석영 단결정, 형석, 알칼리 금속 할로겐화물 결정을 연마한 기타 광학소자.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 광학적으로 전혀 연마 가공되지 않은 단순 유리 블랭크(blank) (제7015호) 및 몰딩된 단순 전조등 유리 (제7014호)\n(b) 일반 면도용 거울 및 화장용 거울(광학 가공되지 않은 것) (제7009호)\n(c) 비금속제 거울(제8306호) 및 귀금속제 거울(제71류)\n(d) 개별 피복된 통신용 광섬유 케이블 (제8544호)\n(e) 광케이블 접속 커넥터 (제8536호)" ,
  "contentEn": "This heading covers unmounted optical elements (including optical fibres, polarising sheets, lenses, prisms, and mirrors) of any material, provided that they are optically worked (polished and curved). Glass elements not optically worked are excluded.\n\nIt includes :\n- Optical fibres, bundles, and cables (subheading 9001.10) other than those of heading 85.44. These are used in endoscopes, medical instruments, or lighting.\n- Sheets and plates of polarising material (subheading 9001.20) used in microscopes or 3D glasses.\n- Contact lenses (subheading 9001.30) and ophthalmic lenses (glass: 9001.40, other materials: 9001.50).\n- Prisms, lenses, flat proof planes (optical flats), optical mirrors (for telescopes/microscopes), colour filters, diffraction gratings, interference filters, and halftone screens (subheading 9001.90).\n- Optical elements made of materials other than glass (e.g., quartz, fluorspar, plastic, or crystals).\n\nExcludes optical fiber cables with individually sheathed fibers (heading 85.44), connectors for optical fibers (heading 85.36), unworked glass blanks (heading 70.15) or molded lenses (heading 70.14), and non-optically worked mirrors (heading 70.09, 83.06 or Chapter 71)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.01 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
