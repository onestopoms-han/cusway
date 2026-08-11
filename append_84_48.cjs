const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8448",
  "titleKo": "84.48 - 제8444호ㆍ제8445호ㆍ제8446호ㆍ제8447호의 기계의 보조기계[예: 도비(dobby)기ㆍ자카드기ㆍ자동정지기ㆍ셔틀교환기], 이 호나 제8444호ㆍ제8445호ㆍ제8446호ㆍ제8447호의 기계에 전용되거나 주로 사용되는 부분품과 부속품[예: 스핀들ㆍ스핀들 플라이어ㆍ침포ㆍ코움(comb)ㆍ방사니플ㆍ셔틀ㆍ종광(heald)ㆍ종광 프레임ㆍ메리야스용 바늘]",
  "titleEn": "84.48 - Auxiliary machinery for use with machines of heading 84.44, 84.45, 84.46 or 84.47 (for example, dobbies, Jacquards, automatic stop motions, shuttle changing mechanisms); parts and accessories suitable for use solely or principally with the machines of this heading or of heading 84.44, 84.45, 84.46 or 84.47 (for example, spindles and spindle flyers, card clothing, combs, extruding nipples, shuttles, healds and heald-frames, hosiery needles).",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n(I) 제8444호ㆍ제8445호ㆍ제8446호나 제8447호의 기계에 대하여 보조적 기능을 하는 모든 보조용 기기류\n(II) 이 호의 기계부분품과 또한 제8444호ㆍ제8445호ㆍ제8446호나 제8447호의 기계부분품\n(III) 제8444호ㆍ제8445호ㆍ제8446호나 제8447호나 이 호의 기계와 함께 사용하는 여러 가지 부속품\n\n(A) 보조기계류\n(1) 방적기계용 자동 제거/대체 장치\n(2) 경사용 빔스탠드나 크릴(creel)\n(3) 도비(dobby)기와 자카드기(Jacquard)\n(4) 자카드기용 카드 유지 기계\n(5) 카드철합기(card lacing machine)\n(6) 경사정지장치와 위사정지장치\n(7) 경사연결기\n(8) 레노(leno) 부착물\n(9) 스위블(swivel)식 셔틀 부착물\n(10) 경파일기(wrap pile motion)\n(11) 스플릿 셀비지 직기\n(12) 광전지 결함 발견 정지기기\n(13) 직기용 자동 스풀 교환기\n\n(B) 부분품과 부속품\n(1) 크릴(creel)\n(2) 스핀들과 스핀들 플라이어\n(3) 원심식 권취용 포트[토프햄(Topham)박스]\n(4) 코움(comb), 폴러(faller)\n(5) 침포(card clothing)\n(6) 링 트래블러(ring traveller)\n(7) 방사 노즐, 방사구 등 (세라믹/유리제 제외)\n(8) 드레드가이드(thread guide)\n(9) 경사빔(warp beam)\n(10) 직기용 바디(reeds)\n(11) 종광 프레임(heald frame)\n(12) 셔틀(shuttle)\n(13) 금속 종광(heald)\n(14) 링고(lingo)\n(15) 침판 및 바닥판\n(16) 자카드기용 훅\n(17) 편직기용 침 (비어디드침, 힌지드침, 크로셰침 등)\n(18) 슬라이드, 코움, 슬라이드바아\n(19) 편직기용 슬라이더\n(20) 드로잉 슬리브\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 인조섬유 압출용 펌프(제8413호)\n(b) 인조섬유 방사 필터(제8421호)\n(c) 재봉기용 바늘(제8452호)\n(d) 기록된 매체(제8523호)\n(e) 로빙/슬리버용 용기 (재료에 따라 분류)\n(f) 사침대(lease rod) (재료에 따라 분류)\n(g) 보빈, 실패, 스풀 등 (재료에 따라 분류)",
  "contentEn": "This heading covers auxiliary machinery for use with the machines of heading 84.44, 84.45, 84.46 or 84.47, and parts and accessories suitable for use solely or principally with the machines of those headings or of this heading.\n\nIt includes :\n(I) Auxiliary apparatus (dobbies, Jacquards, card lacing machines, warp/weft stop motions, warp tying machines, leno attachments, split selvedge machines).\n(II) Parts and accessories (spindles, flyers, Topham boxes, fallers, gills, card clothing, ring travellers, extruding spinnerets, reeds, healds, heald frames, shuttles, hosiery needles, slides, combs).\n\nThe heading excludes :\n(a) Extrusion pumps (heading 84.13) and spinning filters (heading 84.21).\n(b) Sewing machine needles (heading 84.52).\n(c) Recorded media (heading 85.23).\n(d) Bobbins, spools, cops, cones (classified by constituent material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.48 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
