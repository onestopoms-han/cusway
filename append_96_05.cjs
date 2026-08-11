const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9605",
  "titleKo": "96.05 - 개인용 여행세트(화장용ㆍ바느질용ㆍ신발이나 의류 청소용으로 한정한다)",
  "titleEn": "96.05 - Travel sets for personal toilet, sewing or shoe or clothes cleaning.",
  "contentKo": "이 호에는 케이스나 백(가죽, 직물, 플라스틱 등) 안에 서로 다른 호에 속하는 여러 도구/물품들이 결합되어 휴대용으로 구성된 화장용(toilet), 바느질용(sewing), 신발 및 의류 청소용 개인 여행용 세트(키트)를 분류한다.\n\n이 호에는 다음의 세트를 포함한다.\n(1) 개인 화장용 세트(toilet sets) : 브러시, 빗, 가위, 족집게, 손톱 다듬는 줄, 면도기, 거울, 매니큐어 도구 등이 휴대용 케이스에 들어있는 세트.\n(2) 바느질용 세트(sewing kits) : 소형 가위, 줄자, 실끼우개, 바늘, 바느질 실, 안전핀, 골무, 예비 단추, 스냅단추(프레스스터드) 등이 수납된 봉제/수선 키트.\n(3) 신발 청소용 세트(shoe-cleaning kits) : 구두 브러시, 구두약(약통/튜브), 융이나 극세사 클리너 천 등이 가죽/직물/플라스틱 케이스에 담겨 함께 제시되는 세트.\n\n[제외 및 분류 유의사항]\n- 화장용 세트와 바느질 세트는 통칙 제3호나목에 따른 세트로 간주되지 않거나 각기 다른 호에 속하는 이종 물품들의 결합이라도 개인용 여행 목적의 케이스에 일체 포장된 경우 본 호로 일괄 분류한다.\n- 단순 매니큐어 세트(가위나 큐티클 줄 등으로만 구성된 세트)는 본 호에서 제외하여 제8214호에 분류한다.\n- 항공사에서 승객에게 배포하는 소위 어메니티 백(Amenity bag) 세트(화장품, 칫솔, 빗 외에 안대, 귀마개, 파자마, 슬리퍼, 티셔츠 등이 혼합 포장된 백)는 본 호의 개인용 여행세트 범위를 초과하므로 세트 분류를 배제하고 가방 안의 개별 구성품별로 각각 해당 호(예: 안대 -> 6307호, 티셔츠 -> 6109호)에 분할 분류한다." ,
  "contentEn": "This heading covers personal travel sets for toilet, sewing, shoe cleaning, or clothes cleaning, presented in cases (leather, fabric, plastics) containing items from different headings.\n\nIt includes :\n- Toilet sets (1) containing brushes, combs, scissors, tweezers, nail files, mirrors, and razor holders in a case.\n- Sewing kits (2) containing scissors, tape measures, needles, sewing threads, safety pins, thimbles, and buttons.\n- Shoe-cleaning kits (3) containing brushes, shoe polish tins/tubes, and cleaning cloths.\n\nExcludes pure manicure sets (heading 82.14) and airline passenger amenity bags containing pajamas, slippers, and cosmetics (which must be classified separately under their respective headings)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.05 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
