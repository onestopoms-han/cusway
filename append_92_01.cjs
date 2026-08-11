const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9201",
  "titleKo": "92.01 - 피아노(자동피아노를 포함한다)ㆍ하프시코드(harpsichord)와 그 밖의 건반이 있는 현악기(+)",
  "titleEn": "92.01 - Pianos, including automatic pianos; harpsichords and other keyboard stringed instruments.",
  "contentKo": "이 호에는 건반(keyboard)을 갖춘 어쿠스틱 현악기로서 건반의 조작에 의해 해머가 현을 때리거나 튕겨서 소리를 내는 피아노, 자동피아노, 하프시코드, 클라비코드 등을 분류한다. 전기적 픽업이나 증폭장치가 부착되어도 일반 연주가 가능하면 본 호에 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 업라이트 피아노(upright piano)(제9201.10호) : 향판 위에 현이 수직으로 또는 대각선으로 교차되어 설치된 형태의 세워진 피아노(자동피아노 포함).\n- 그랜드 피아노(grand piano)(제9201.20호) : 수평 상태로 현이 배치되어 향판을 덮고 있는 콘서트/베이비 그랜드형 피아노(자동피아노 포함).\n- 기타(제9201.90호) :\n  - 천공된 종이/판지 롤에 의해 기계식, 압축공기식, 전기식으로 구동 및 작동하는 자동피아노(건반 유무 불문).\n  - 하프시코드(harpsichord), 클라비코드(clavichord), 스피넷(spinet) 등 역사적 건반 현악기.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기 공급 없이는 소리를 낼 수 없는 순수 전자 피아노 및 디지털 피아노, 피아노 모양의 신디사이저 (제9207호)\n(b) 자동 피아노 연주용으로 별도 제시되는 천공된 종이/판지 롤(roll) 및 디스크 (제9209호)" ,
  "contentEn": "This heading covers acoustic keyboard stringed instruments where strings are struck or plucked (pianos, harpsichords, spinets, clavichords), including automatic pianos. The inclusion of electric pickups or amplifiers does not affect classification as long as the instrument can be played conventionally without them.\n\nIt includes :\n- Upright pianos (subheading 9201.10) including automatic upright pianos.\n- Grand pianos (subheading 9201.20) including concert or baby grand types.\n- Other (subheading 9201.90) including automatic pianos (mechanical/pneumatic roll-operated) and harpsichords.\n\nExcludes digital/electronic pianos which cannot be played without electronic devices (heading 92.07), and separate perforated music rolls (heading 92.09)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.01 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
