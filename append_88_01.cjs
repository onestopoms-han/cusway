const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_88.json';

const newEntry = {
  "hsCode": "8801",
  "titleKo": "88.01 - 기구ㆍ비행선, 글라이더ㆍ행글라이더와 그 밖의 무동력 항공기",
  "titleEn": "88.01 - Balloons and dirigibles; gliders, hang gliders and other non-powered aircraft.",
  "contentKo": "이 호에는 동력 장치(엔진)가 장착되지 않은 무동력 항공기 및 공기보다 가벼운 경항공기(기구, 비행선)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 기구 및 비행선 (자유 기구, 계류 기구, 비행선) :\n- 기상학/항공학용 발신용 기구(sounding balloon), 파일럿 기구(pilot balloon), 실링 기구(ceiling balloon)(구름 측정용).\n(2) 글라이더 및 행글라이더 :\n- 기류를 이용해 비행하는 무동력 글라이더(엔진 장착 설계형은 제8802호 분류).\n- 델타익(삼각형 구조) 또는 유사 구조의 1~2인승 행글라이더.\n(3) 기타 무동력 항공기 :\n- 기상 장비 탑재용의 학술/산업용 대형 연(kite).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 완구용 고무풍선, 장난감 연 및 무동력 비행 완구 (제9503호)\n(b) 전시회용 정밀 축소 비행 모터/글라이더 모형 (제9023호)\n(c) 목재/금속제 실내장식용 모형 비행기 (제4420호, 제8306호)\n(d) 엔진(모터)이 내장되었거나 보조 동력이 결합된 글라이더 (제8802호)" ,
  "contentEn": "This heading covers non-powered aircraft and aircraft lighter than air (balloons and dirigibles).\n\nIt includes :\n- Balloons (free or tethered) and dirigibles (mechanically driven) of all kinds, including meteorological sounding balloons, pilot balloons, and ceiling balloons.\n- Gliders (non-powered aircraft utilizing air currents) and hang gliders (e.g. delta-wing structures flown by a harnessed pilot).\n- Other non-powered aircraft, including non-toy kites used for carrying meteorological instruments.\n\nExcludes toy balloons and kites (heading 95.03), model aircraft for display (heading 90.23) or decoration (heading 44.20 or 83.06), and gliders fitted with auxiliary motors (heading 88.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 88.01 to chapter_88.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
