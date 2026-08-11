const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6506",
  "titleKo": "65.06 - 그 밖의 모자(안을 댄 것인지 또는 장식한 것인지에 상관없다)",
  "titleEn": "65.06 - Other headgear, whether or not lined or trimmed.",
  "contentKo": "이 호에는 이 류의 앞 호나 제63류ㆍ제68류ㆍ제95류에서 분류하지 않은 모든 모자류를 분류한다. 특히 안전모(예: 스포츠 활동용ㆍ군용ㆍ소방부용 헬멧ㆍ오토바이 기수용ㆍ광부용ㆍ건축인부용 헬멧)로서 보호용 패드를 붙였는지에 상관없으며, 어떤 헬멧의 경우에는 마이크로폰이나 이어폰을 붙이는 경우도 있다.\n\n이 호에는 또한 다음의 것을 분류한다.\n\n(1) 고무나 플라스틱으로 만든 모자류[예: 수영모자ㆍ후드(hood)]\n\n(2) 가죽이나 콤퍼지션레더(composition leather)로 만든 모자류\n\n(3) 모피나 인조 모피로 만든 모자류\n\n(4) 새의 깃털이나 조화(造花)로 만든 모자류\n\n(5) 금속으로 만든 모자류",
  "contentEn": "This heading covers all headgear not classified in the preceding headings of this Chapter or in Chapter 63, 68 or 95. It covers, in particular, safety headgear (e.g., helmets for sports, military or fire brigade use, motorcycle riders, miners, construction workers), whether or not fitted with protective padding, and sometimes fitted with microphones or earphones.\n\nThe heading also covers :\n\n(1) Headgear of rubber or plastics (e.g., bathing caps, hoods);\n\n(2) Headgear of leather or composition leather;\n\n(3) Headgear of furskin or artificial fur;\n\n(4) Headgear of feathers or artificial flowers;\n\n(5) Headgear of metal."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.06 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
