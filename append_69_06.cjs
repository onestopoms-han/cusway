const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6906",
  "titleKo": "69.06 - 도자제의 관(管)ㆍ도관(導管)ㆍ홈통과 관(管)의 연결구류",
  "titleEn": "69.06 - Ceramic pipes, conduits, guttering and pipe fittings.",
  "contentKo": "이 호에는 일반적으로 연결해서 액체의 배수용이나 배분용에 사용하도록 설계한 비내화성의 관(管 : piping) 등을 분류한다. 이들은 여러 가지의 모양이나 부분[직관ㆍ곡관ㆍ다지관ㆍ직경이 고정된 관(管)ㆍ직경이 변화되는 관(管) 등]일 수 있으며 유약처리한 경우도 있다.\n\n이 호에는 다음의 것을 포함한다.\n\n(1) 저온 소성처리만 하여 조잡하게 완성 가공한 다공질(多孔質) 도자제의 농업용ㆍ원예용의 배수관\n\n(2) 그 밖의 관(管), 도관(導管)과 홈통[예: 빗물의 배수관ㆍ하수구 관(管)ㆍ절연용으로 설계하지 않은 전선보호관ㆍ홈통이나 홈 모양의 반형관(半形管 : half tube)ㆍ벽용 배수관 등]\n이러한 관(管) 등은 유약처리하지 않은 보통 도자제인 경우도 있고 때에 따라서는 유약처리나 유리질화함으로써 불침투성을 가지는 경우도 있다[예: 화학용의 관(管)].\n\n(3) 연결용이나 분기용의 관(管)의 연결구류[고리(collar)ㆍ플랜지(flange)ㆍ엘보(elbow)ㆍT자형의 관(管 : T-piece)ㆍ클린 아웃 트랩(clean out trap)등]\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 관(管) 모양의 굴뚝용 부분품(예: 굴뚝통ㆍ굴뚝갓ㆍ굴뚝용 내장재ㆍ연도용 블록 등)(제6905호)\n\n(b) 실험실용으로 특별히 설계한 작은 관류(管類 : tubeㆍtubing)(예: 연소(燃燒)관)로서 일반적으로 도기제의 것(제6909호)\n\n(c) 전기절연용의 전선관(electric conduit tubing)과 조인트(joint)와 모든 전기용 관(管) 모양 연결구류(특히 제8546호와 제8547호)",
  "contentEn": "This heading covers non-refractory ceramic pipes, conduits, gutters and pipe fittings, designed to be connected together for liquid drainage or distribution. They may be of any shape (straight, curved, branched, constant or variable diameter, etc.) and may be glazed.\n\nThe heading includes :\n(1) Low-fired porous ceramic drain pipes for agricultural or horticultural use.\n(2) Other pipes, conduits and gutters (e.g., rainwater pipes, sewer pipes, non-insulating cable conduits, half-tube gutters, wall drains).\n(3) Pipe fittings for connecting or branching (collars, flanges, elbows, T-pieces, clean-out traps, etc.).\n\nThe heading excludes :\n(a) Tubular chimney components (heading 69.05).\n(b) Small tubes and tubing specially designed for laboratory use (heading 69.09).\n(c) Electrical conduit tubing and joints, and all fittings for electrical purposes (headings 85.46 and 85.47)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.06 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
