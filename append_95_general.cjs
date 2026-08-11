const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9500",
  "titleKo": "제95류 - 완구․게임용구ㆍ운동용구와 이들의 부분품과 부속품 (총설 및 주 규정)",
  "titleEn": "Chapter 95 - Toys, games and sports requisites; parts and accessories thereof (General Notes & Rules)",
  "contentKo": "제95류는 어린이 및 성인 오락용 완구(제9503호), 비디오게임기 및 실내 게임용구(제9504호), 축제/카니발/마술용품(제9505호), 운동/육상/체조/수영/낚시용품(제9506호~제9507호), 유원지용 놀이기구 및 워터파크 설비(제9508호)와 이들의 전용 부분품/부속품을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 애완동물용 장난감 제외 (주 제5호) :\n  - 디자인, 외형, 재료 등으로 보아 전적으로 동물용(개, 고양이 등 애완동물용 장난감)으로 설계된 것은 본 류에서 제외하고 각각의 재질별 호(예: 고무제 장난감뼈 -> 4016호, 방직용 섬유제 쥐인형 -> 6307호 등)로 분류한다.\n2. 완구 세트의 규정 (주 제4호) :\n  - 분리하여 제시될 경우 각기 다른 호로 분류될 여러 개의 물품이 함께 소매용 세트로 포장되어 제시되고, 해당 포장 구성이 완구로서의 본질적인 특성을 이루는 경우 통칙 제3호나목에 따른 세트로 간주되지 않더라도 제9503호 완구 세트로 분류한다.\n3. 유원지 및 테마파크 설비의 정의 (주 제6호) :\n  - '놀이공원 탈것(amusement park rides)' : 수류를 포함한 궤도를 따라 사람을 태우고 이동시키는 롤러코스터, 바이킹 등 대형 놀이 장치.\n  - '워터파크 놀이기구(water park amusements)' : 워터 슬라이드 및 수로용 전용 설비.\n  - '유원지용 오락물(fairground amusements)' : 힘이나 기술을 겨루는 게임 부스(야구 배팅, 다트 던지기 등).\n\n[제외 물품]\n- 양초 (제3406호) 및 꽃불, 폭죽 등 화공품 (제3604호)\n- 낚싯줄용으로 단순 절단되었으나 낚싯줄로 완성 가공(낚싯바늘 결합 등)되지 않은 미완성 모노필라멘트/실/거트 (제39류, 제4206호 또는 제11부)\n- 골프백, 테니스 라켓 가방, 운동용 수납 백 (제4202호 또는 43류)\n- 방직용 섬유제 코스프레용 가장복(fancy dress), 운동용 전용 의류(보호 패드 유무 불문) (제61류 또는 제62류)\n- 운동용 특수 신발(단, 스케이트 날이나 롤러가 영구 결합된 스케이트 부츠는 본 류 제9506호 분류) 및 운동용 헬멧/헤드기어 (제65류)\n- 인형용 장착되지 않은 유리 안구 (제7018호)\n- 비금속제 범용 부분품 (나사, 고리 등 - 제15부 주 제2호) 및 플라스틱제 유사 제품 (제39류)\n- 전동기 (제8501호), 무선 원격조절기기 (제8526호), 적외선 조종장치 (제8543호)\n- 어린이용 페달식 이륜자전거 (제8712호)\n- 군사적/레저용 무인항공기(드론) (제8806호)\n- 카누, 카약 등 운동용 보트 (제89류)\n- 스키/수영용 고글 및 스포츠 안경 (제9004호)\n- 사냥용 의성 발음기(데코이 콜) 및 호각 (제9208호)\n- 조명용 크리스마스 트리 라이트 스트링 (제9405호)" ,
  "contentEn": "Chapter 95 covers toys of all kinds for children or adults (heading 95.03), video game consoles and parlour games (heading 95.04), festive articles (heading 95.05), outdoor sports/athletics equipment and fishing tackle (headings 95.06 to 95.07), and amusement park rides (heading 95.08).\n\n[Key Rules & Explanations]\n1. Pet Toys Excluded (Note 5) :\n  - Toys designed solely for animals (dogs, cats) are excluded from Chapter 95 and classified by their constituent materials.\n2. Toy Sets (Note 4) :\n  - Heading 95.03 applies to sets of two or more items put up for retail sale as toys, even if individual items would fall in other headings when presented separately.\n3. Amusement Rides Definitions (Note 6) :\n  - Classifies amusement park rides, water park amusements, and fairground side-show games (excluding standard parlour games of heading 95.04).\n\n[Exclusions]\n- Pyrotechnic articles and fireworks (heading 36.04).\n- Sports bags and rucksacks (heading 42.02).\n- Fancy dress, sports clothing, and goalkeeper jerseys (Chapter 61 or 62).\n- Sports footwear (except skating boots with skates attached) (Chapter 64) and protective headgear (Chapter 65).\n- Standard-use screws, springs, and general hardware (Section XV or Chapter 39).\n- Drones (heading 88.06) and sports canoes (Chapter 89).\n- Sports goggles (heading 90.04) and decoy calls (heading 92.08).\n- Festive lighting strings (heading 94.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 95 rules/general to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
