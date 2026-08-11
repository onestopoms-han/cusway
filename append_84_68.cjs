const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8468",
  "titleKo": "84.68 - 납땜용ㆍ땜질용이나 용접용 기기(절단이 가능한지에 상관없으며 제8515호에 해당하는 것은 제외한다)와 표면 열처리용 기기(가스를 사용하는 것으로 한정한다)",
  "titleEn": "84.68 - Machinery and apparatus for soldering, brazing or welding, whether or not capable of cutting, other than those of heading 85.15; gas-operated surface tempering machines and appliances.",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n(A) 가스를 사용하거나 제8515호 이외의 방식을 사용하는 납땜용/용접용 기기(절단 가능 여부 무관). 단, 오로지 절단용으로만 제작된 기계는 각 해당 호에 분류한다.\n(B) 표면 열처리용 기기(가스를 사용하는 것에 한한다).\n\n(I) 가스작동식의 금속가공용 기기 등\n산소나 공기 속에서 가연성 가스(아세틸렌, 부탄, 프로판 등)를 연소시켜 고온의 불꽃을 발생시킴으로써 작동한다.\n(A) 수동식 가스용접기기 등 (취관 blowpipe) : 고압형과 저압형 취관이 있으며, 조절밸브와 가스 공급관이 부착되어 있다.\n(B) 기계식 용접 기기 : 고정식/조절식 취관과 가공물 안내용 테이블/조(jaw) 등으로 구성된다.\n(C) 표면 열처리용 기기 : 피처리물 형태에 맞춘 다중 노즐로 표면만 급속히 가열한 후 냉각액 분무 등으로 처리하는 기기이다.\n\n(II) 가스작동식의 열가소성 재료의 용접용 기기\n가열된 공기, 질소, 불활성 가스의 분사에 의하여 플라스틱 재료를 용접/밀봉하는 기기를 포함한다.\n\n(III) 가스작동식 이외의 용접용 기기\n(1) 가열된 휠이나 인두를 사용하여 용접하는 기계 (제8205호의 납땜인두 및 제8515호의 전기식 제외)\n(2) 마찰 용접기 (friction welding machine)\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기기 부분품과 지지물(볼, 롤러 등)과 같은 부속장치도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 블로우 램프 및 브레이징 램프(제8205호)\n(b) 용융 금속 분사기(제8424호)\n(c) 암석/콘크리트 절단용 산소 랜스(oxygen lance)(제8479호)\n(d) 가스-전기 겸용 용접기(제8515호)",
  "contentEn": "This heading covers gas-operated or non-electric machinery and apparatus for soldering, brazing or welding (whether or not capable of cutting), and gas-operated surface tempering machines and appliances.\n\nIt includes :\n(I) Gas-operated blowpipes and welding/cutting torches (hand-held or machine-guided).\n(II) Gas-operated surface tempering machines (flame hardening apparatus).\n(III) Gas-operated welding apparatus for thermoplastic materials (using heated air, nitrogen or inert gas).\n(IV) Non-electric, non-gas welding machines (friction welding machines, heated-iron/wheel plastic welders).\n\nParts and accessories of these machines are also covered.\n\nThe heading excludes :\n(a) Blow lamps and brazing lamps (heading 82.05).\n(b) Molten metal spraying guns (heading 84.24).\n(c) Oxygen lances for cutting rock or concrete (heading 84.79).\n(d) Electric (including electro-gas) welding, brazing or soldering machines (heading 85.15)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.68 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
