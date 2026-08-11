const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9011",
  "titleKo": "90.11 - 광학현미경(마이크로 사진용ㆍ마이크로 영화촬영용ㆍ마이크로 영사용을 포함한다)",
  "titleEn": "90.11 - Compound optical microscopes, including those for photomicrography, cinephotomicrography or microprojection.",
  "contentKo": "이 호에는 단순 돋보기(제9013호)와 달리 대물렌즈와 접안렌즈를 조합하여 이단계 확대를 수행하는 복합 광학현미경(compound optical microscope)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 입체현미경(stereoscopic microscope)(제9011.10호) : 3차원 입체 화상을 얻기 위해 독립된 2개의 광학 경로를 갖춘 현미경. 수술용(외과용) 현미경 포함.\n- 마이크로 사진용/영화촬영용/영사용 현미경(제9011.20호) : 관찰 대상을 전용 필름/디지털 촬영 장치와 결합하여 기록할 수 있거나, 슬라이드 이미지를 외부 스크린에 확대 투영하는 마이크로 영사 장치(선모충현미경 trichinoscope 포함).\n- 그 밖의 광학현미경(제9011.80호) :\n  - 연구실용 만능현미경, 편광현미경, 금속현미경, 위상차현미경, 간섭현미경.\n  - 공업 생산 공정용 및 측정용 현미경 : 비교현미경(표면 비교용), 공구현미경(나삿니/윤곽 검사), 경도 시험용 휴대식 소형 현미경, 센터링 현미경(공작기계 축 정렬용).\n- 부분품과 부속품(제9010.90호) : 현미경 스탠드(베이스, 팔), 경통(단안/쌍안/삼안경통), 회전식 대물렌즈 뭉치(코스피스 nosepiece), 재물대(가열/냉각식 재물대 포함), 묘화용(드로잉) 광학 부속장치.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 현미경과 분리하여 제시되는 전용 아날로그/영화 촬영 카메라 (제9006호 또는 제9007호)\n(b) 현미경과 분리하여 제시되는 디지털 카메라 (제8525호)\n(c) 안과 검사용 세극등 쌍안현미경 (제9018호)\n(d) 미장착 렌즈, 대물경, 접안경 (제9001호) 및 장착된 대물경/접안경 (제9002호)\n(e) 유리제 현미경 슬라이드 글라스 및 커버 글라스 (제7017호)\n(f) 시료 제작용 마이크로톰(microtome) (제9027호)\n(g) 윤곽 투영기(profile projector) 및 비현미경식 광학 비교측정기 (제9031호)\n(h) 교육 전시용 현미경 표본 슬라이드 (제9023호)" ,
  "contentEn": "This heading covers compound optical microscopes (which utilize a two-stage magnification system with objectives and eyepieces), including those adapted for photography, cinematography, or screen projection.\n\nIt includes :\n- Stereoscopic microscopes (subheading 9011.10) providing 3D images, including surgical microscopes.\n- Microscopes for photomicrography, cinephotomicrography, or microprojection (subheading 9011.20) including trichinoscopes.\n- Other microscopes (subheading 9011.80) such as metallurgical, polarising, phase-contrast, coordinate-reading, measuring, and toolmakers' microscopes.\n- Parts and accessories (subheading 9011.90) including stands, tubes, revolving nosepieces, specimen stages (including heating/cooling stages), and drawing attachments.\n\nExcludes separate cameras (heading 90.06/90.07/85.25), binocular microscopes for ophthalmic use (heading 90.18), glass slides (heading 70.17), microtomes (heading 90.27), profile projectors (heading 90.31), and prepared specimen slides (heading 90.23)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.11 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
