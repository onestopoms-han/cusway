const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8707",
  "titleKo": "87.07 - 차체(운전실을 포함하며, 제8701호부터 제8705호까지의 자동차용으로 한정한다)",
  "titleEn": "87.07 - Bodies (including cabs), for the motor vehicles of headings 87.01 to 87.05.",
  "contentKo": "이 호에는 제8701호부터 제8705호까지의 자동차용 차체(Body) 및 화물차/트랙터용 운전실(Cab)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 승용차용 차체(소호 제8707.10호).\n- 화물차, 트랙터, 버스 및 특수용도 차량용 차체 및 운전실(소호 제8707.90호).\n- 프레임식 섀시에 얹어지는 조립용 차체 및 모노코크 구조의 뼈대/바디 쉘(body shell).\n- 미완성 차체(문, 윈드스크린이 없거나 내장재 및 도장이 덜 끝난 바디 쉘 포함).\n- 계기반, 트렁크, 시트, 쿠션, 하물 선반, 내부 매트 및 조명/전기기기가 부착되어 완비된 차체.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 엔진 및 구동계 기계장치(트랜스미션, 차축 등)가 함께 결합 장착되어 있는 차체 (제8706호의 엔진을 갖춘 섀시 또는 완제품으로 분류)\n(b) 차체의 개별적인 범용 구성품 및 부분품(예: 문, 윈도우 글라스, 범퍼, 몰딩 등) (제8708호)" ,
  "contentEn": "This heading covers bodies (including cabs) for the motor vehicles of headings 87.01 to 87.05.\n\nIt includes :\n- Passenger car bodies (subheading 8707.10).\n- Bodies and cabs for trucks, tractors, buses, and special purpose vehicles (subheading 8707.90).\n- Bodies designed to be mounted on a chassis, as well as body shells for monocoque (unibody) vehicles.\n- Incomplete bodies (e.g. without doors, windscreens, upholstery, or paint).\n- Cabs for trucks and tractors.\n\nExcludes chassis fitted with engines (heading 87.06 or finished vehicle headings) and individual parts of bodies (heading 87.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.07 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
