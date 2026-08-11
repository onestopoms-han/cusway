const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8463",
  "titleKo": "84.63 - 그 밖의 금속이나 서멧(cermet)의 가공용 공작기계(재료를 절삭하지 않는 방식으로 한정한다)",
  "titleEn": "84.63 - Other machine-tools for working metal or cermets, without removing material.",
  "contentKo": "제8462호의 공작기계를 제외하고 이 호에는 재료를 절삭가공하지 않고 금속이나 서멧(cermet)을 가공하는 기계를 분류한다.\n베이스플레이트, 장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수공구와 구별된다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 인발기(drawing machine)[드로우벤치(draw bench)] : 봉, 관, 형재, 선 등을 인발하는 기계이다.\n(2) 나사 전조기(thread rolling machine) : 절삭하지 않고 롤링과 프레싱으로 나사를 세우는 기계이다.\n(3) 선(線) 가공기 : 스프링, 유자선, 체인, 핀, 쇠못, 스테이플, 훅 등 선제품 제조기 및 금속망 제조기이다.\n다만, 로프제조기 및 연선기는 제외한다(제8479호).\n(4) 필라멘트용 미세 금속선 나선형 권선기\n(5) 리베팅 머신 (제8462호의 프레스 제외)\n(6) 스웨이징머신(swaging machine) : 회전다이스로 관이나 봉의 직경을 축소시키는 기계이다.\n(7) 스피닝선반(spinning lathe) : 금속을 소성 변형하여 대칭형 용기 등을 가공하는 선반이다.\n(8) 플렉시블 관(flexible tube) 제조기 (나선형 금속스트립 이용)\n(9) 전자(電磁)식 펄스 금속성형기 [자기성형기]\n\n부분품과 부속품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계 부분품과 부속품(제82류의 공구를 제외)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수공구(제8205호)\n(b) 베일용 밴딩머신 및 캔 봉함기(제8422호)\n(c) 머시닝센터, 트랜스퍼머신(제8457호)\n(d) 수지식 공구(제8467호)\n(e) 시험용 기기(제9024호)",
  "contentEn": "This heading covers machine-tools for working metal or cermets, without removing material, other than those of heading 84.62.\n\nIt includes :\n(I) Draw-benches for drawing bars, tubes, profiles or wire.\n(II) Thread rolling machines (forming threads by rolling/pressing).\n(III) Wire-working machines (making springs, barbed wire, chains, nails).\n(IV) Swaging machines (reducing diameter by rotary dies).\n(V) Spinning lathes (forming articles by deforming metal blank).\n(VI) Flexible tube manufacturing machines.\n(VII) Electromagnetic pulse metal-forming machines (magneto-forming).\n(VIII) Riveting machines (other than presses of heading 84.62).\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Hand tools (heading 82.05).\n(b) Baling banders and container sealing machines (heading 84.22).\n(c) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(d) Hand-held tools (heading 84.67).\n(e) Rope or cable-making machines (heading 84.79).\n(f) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.63 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
