const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9200",
  "titleKo": "제92류 - 악기와 그 부분품과 부속품 (총설 및 주 규정)",
  "titleEn": "Chapter 92 - Musical instruments; parts and accessories of such articles (General Notes & Rules)",
  "contentKo": "제92류는 악기(제9201호~제9208호)와 이들의 전용 부분품 및 부속품(제9209호)을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 전기식/전자식 악기의 구분 (주 제1호 및 총설) :\n  - 전기식 사운드 픽업 및 증폭 장치가 부착되어 있으나, 전기 장치 없이 일반 악기처럼 연주가 가능한 것(피아노, 어쿠스틱 기타 등)은 각각 해당 악기 호(제9201호, 제9202호 등)에 분류한다.\n  - 전기/전자식 장치가 필수적이어서 전기 공급 없이는 연주할 수 없는 악기(신디사이저, 전자 피아노, 전자 오르간, 일렉트릭 기타 등)는 제9207호에 분류한다.\n2. 부속 악세사리의 악기 본체 분류 (주 제2호) :\n  - 현악기용 활(궁), 피크(채), 타악기용 북채(맬릿) 등이 해당 악기와 함께 적정 수량으로 제시되고 명백히 동반 사용되는 것인 경우 해당 악기(제9202호, 제9206호)로 일괄 분류한다.\n  - 단, 자동 연주용 종이 카드, 디스크, 롤(roll)은 악기와 함께 제시되더라도 악기 본체로 분류하지 않고 제9209호로 별도 분류한다.\n\n[제외 물품]\n- 비금속제 범용 부분품 (나사, 스프링 등 - 제15부 주 제2호) 및 플라스틱제 유사 제품 (제39류)\n- 악기에 사용하는 단독 마이크, 스피커, 헤드폰, 앰프 (제8518호) 또는 스트로보스코프 (제9031호)\n- 완구용 악기 (장난감 하모니카, 드럼, 아코디언 등 - 제9503호)\n- 악기 소제용 브러시 (제9603호) 및 악기용 스탠드(삼각대/일각대 등 - 제9620호)\n- 역사적 가치가 있는 악기 수집품 (제9705호) 및 제작 후 100년이 경과된 골동품 (제9706호)" ,
  "contentEn": "Chapter 92 covers musical instruments (headings 92.01 to 92.08) and their parts and accessories (heading 92.09).\n\n[Key Rules & Explanations]\n1. Electric/Electronic Instruments :\n  - Instruments with electrical pickups but capable of being played without electricity (e.g., standard acoustic pianos, guitars) fall under their respective headings (92.01, 92.02, etc.).\n  - Instruments that cannot be played without electronic devices (synthesizers, digital pianos, electric guitars) are classified in heading 92.07.\n2. Companion Accessories (Note 2) :\n  - Bows, plectrums, and drum sticks/mallets presented in normal quantities with their instruments are classified together with the instruments (heading 92.02 or 92.06).\n  - Perforated music cards, discs, and rolls presented with instruments are treated as separate items (heading 92.09).\n\n[Exclusions]\n- Screws/springs of general use (Section XV or Chapter 39).\n- Microphones, amplifiers, or headphones used with instruments but not built in (heading 85.18).\n- Toy instruments (Chapter 95).\n- Cleaning brushes (heading 96.03) and stands/tripods (heading 96.20).\n- Antiques or collectors' items (Chapter 97)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 92 rules/general to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
