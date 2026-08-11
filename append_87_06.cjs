const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8606", // Wait, the request is for 87.06. Let me put 8706.
  "hsCodeRaw": "8706",
  "hsCode": "8706",
  "titleKo": "87.06 - 엔진을 갖춘 섀시(제8701호부터 제8705호까지의 자동차용으로 한정한다)",
  "titleEn": "87.06 - Chassis fitted with engines, for the motor vehicles of headings 87.01 to 87.05.",
  "contentKo": "이 호에는 제8701호부터 제8705호까지의 자동차용 프레임에 엔진, 트랜스미션, 조향기어, 차축(바퀴 부착 여부 무관) 등 주행에 필수적인 구동 기계 장치들이 장착된 미완성 상태의 섀시(chassis)를 분류한다. 차체(cab, passenger body)가 얹어지지 않은 상태의 섀시를 의미한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 엔진을 갖춘 섀시 프레임.\n- 모노코크/단일 구조 차대 하부로서 구동 엔진이 내장 장착된 것.\n- 보닛(후드), 윈드스크린, 흙받이, 발판, 계기반 등이 부착된 엔진 내장형 섀시.\n- 타이어, 기화기, 배터리가 장착된 섀시.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 엔진과 함께 운전실(cab)까지 갖추어진 섀시 (완제품에 준하여 제8702호부터 제8704호까지에 분류)(이 류 총설 및 주 제3호 참조)\n(b) 엔진이 장착되지 않은 프레임 섀시 (차축 등이 장착되었더라도 제8708호의 부분품 분류)",
  "contentEn": "This heading covers the chassis-frames or combined chassis-body structures (monocoque) for the motor vehicles of headings 87.01 to 87.05, fitted with their engines, transmissions, steering gears, and axles (with or without wheels). In other words, it covers motor vehicles without bodies.\n\nIt includes :\n- Chassis-frames fitted with engines, which may also feature bonnets, windscreens, mudguards, running boards, or instrument panels.\n- Chassis with or without tyres, carburettors, batteries, etc.\n\nExcludes chassis fitted with both engine and cab, whether or not the cab is complete (headings 87.02 to 87.04), and chassis without engines (heading 87.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.06 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
