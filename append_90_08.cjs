const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9008",
  "titleKo": "90.08 - 투영기ㆍ사진 확대기와 사진 축소기(영화용은 제외한다)",
  "titleEn": "90.08 - Image projectors, other than cinematographic; photographic (other than cinematographic) enlargers and reducers.",
  "contentKo": "이 호에는 영화용을 제외하고 투명 또는 불투명한 정지 영상을 스크린이나 평면에 확대 투영하는 기기(슬라이드 투영기, 오버헤드 프로젝터 등), 그리고 아날로그 필름 확대/축소용 사진 확대기와 축소기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 투영기, 확대기와 축소기(제9008.50호) :\n  - 다이아스코프(diascope) : 투명 슬라이드/필름을 광원, 집광렌즈, 영사렌즈를 통해 확대 투영하는 기기. 오버헤드 프로젝터(OHP) 포함.\n  - 에피스코프(episcope) : 인쇄물, 사진 등 불투명한 물체의 표면 반사광을 스크린에 확대 투영하는 기기.\n  - 에피다이아스코프(epidiascope) : 다이아스코프와 에피스코프 겸용 투영기.\n  - 마이크로필름(microfilm), 마이크로피쉬(microfiche) 리더(판독기)(확대 스크린 일체형 및 복사 겸용 포함).\n  - 인쇄판/실린더 제판용 투영기, 방사선 사진(X-ray) 투영기, 분광 투영기.\n  - 사진 확대기(photographic enlarger) 및 축소기 (영화용 제외) : 아날로그 암실 작업용 확대기, 인쇄 제판용 확대/축소 장치.\n- 부분품과 부속품(제9008.90호) : 투영기/확대기 몸체, 프레임, 조절 지지대, 마스킹 프레임, 마이크로필름 자동 이송 장치.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 영화용 필름의 확대기 및 축소기 (제9010호)\n(b) 비디오 프로젝터, LCD/DLP 프로젝터 및 프리젠테이션용 프로젝션 패널/모니터 (제8528호)\n(c) 반도체 노광용 축소 투영기 (제8486호)\n(d) 마이크로필름용 사진식 복사기(스크린이 작고 복사 기능이 위주인 것) (제8443호)\n(e) 윤곽 투영기(profile projector) (제9031호)\n(f) 돋보기/확대경 및 단순 검사용 슬라이드 뷰어 (제9013호)\n(g) 측량용 사진 수정 왜곡 복원기 (제9015호)\n(h) 영상 투영 장치(모니터)가 부착된 복합 광학현미경 (제9011호)\n(ij) 완구용 환등기(magic lantern) (제9503호)" ,
  "contentEn": "This heading covers non-cinematographic image projectors designed for projecting still images (transparencies or opaque objects) onto a screen, and photographic (non-cine) enlargers and reducers.\n\nIt includes :\n- Still image projectors (subheading 9008.50) such as diascopes (slide projectors, overhead projectors OHP), episcopes (opaque projectors), and epidiascopes.\n- Microfilm or microfiche readers (with or without built-in copying capabilities).\n- Projection apparatus for making printing plates, X-ray photograph projectors, and spectrum projectors.\n- Photographic enlargers and reducers (subheading 9008.50) used in darkrooms or printing industries.\n- Parts and accessories (subheading 9008.90) including bodywork, frames, masking frames, and film feed mechanisms.\n\nExcludes cinematographic enlargers/reducers (heading 90.10), digital video projectors (DLP/LCD) (heading 85.28), semiconductor step-and-repeat projection aligners (heading 84.86), profile projectors (heading 90.31), simple slide viewers (heading 90.13), and toy magic lanterns (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.08 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
