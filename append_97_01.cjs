const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9701",
  "titleKo": "97.01 - 회화ㆍ데생ㆍ파스텔(손으로 직접 그린 것으로 한정하며, 제4906호의 도안과 손으로 그렸거나 장식한 가공품은 제외한다), 콜라주(collage)ㆍ모자이크와 이와 유사한 장식판",
  "titleEn": "97.01 - Paintings, drawings and pastels, executed entirely by hand, other than drawings of heading 49.06 and other than hand-painted or hand-decorated manufactured articles; collages, mosaics and similar decorative plaques.",
  "contentKo": "이 호에는 전적으로 예술가의 손으로 직접 그린 회화(유화, 수채화, 아크릴화, 파스텔화 등) 및 소묘(데생, 드로잉, 펜화), 그리고 여러 이종 재료 조각을 결합하여 가공한 콜라주 장식판과 천연석/유리 테세라를 늘어놓아 제작한 독창적인 모자이크 예술품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 제작 후 100년 초과 골동품 예술품(제9701.21~29호) : 100년 초과 회화/데생/파스텔(21호), 100년 초과 모자이크(22호), 100년 초과 콜라주 및 기타 장식판(29호).\n- 100년 이하 기타 현대 예술품(제9701.91~99호) : 현대 회화/데생/파스텔(91호), 현대 모자이크(92호), 현대 콜라주(99호).\n- 손으로 직접 그린 복사화(카피화) : 타인의 원작을 모사하였더라도 기계 공정 없이 순수하게 손으로 직접 그린 복사화는 본 호로 분류한다.\n- 콜라주(collage) : 동물, 식물, 지물, 직물 조각 등을 글루로 붙여 회학적/디자인적 구성을 나타내는 장식판.\n- 모자이크(mosaic) : 하드스톤, 테라코타, 세라믹, 대리석, 에나멜, 유리 또는 유색 목재의 작은 파편(테세라)을 배치하여 손으로 직접 제작한 독특하고 재생산 불가능한 장식 작품(주 제2호 요건 부합).\n\n[주요 분류 기준 및 액자 규정]\n- 회화, 판화 등의 액자(틀)가 작품과 함께 제시되고, 가격과 종류가 해당 작품에 비추어 통상적으로 수용 가능한 경우 작품에 일괄 분류한다. 그렇지 않은 비정상적 액자는 별도로 분리하여 각 재질별 호(예: 금테 액자 -> 71류)로 분류한다 (주 제6호).\n- 대량생산된 복제품, 틀에 찍어낸 주조 모자이크, 상업적 기념품 성격의 공예 모자이크 작품은 본 호에서 제외되어 재질별 호로 분류한다.\n- 기존 판화나 사진 프린팅 아웃라인(밑그림) 위에 부분적으로 손으로 리터칭이나 마무리 색칠만 가한 회화는 기계 공정이 개입되었으므로 본 호에서 제외한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 건축, 공학, 공업, 패션 모델, 신변장식용 벽지 제조용 등으로 손으로 그린 정밀 설계도 및 도안 원도 (제4906호)\n(b) 손으로 도장하거나 채색 장식한 완제 가구, 도자기 접시/화병, 직물제 스크린 (각 재질별/기능별 호 분류)\n(c) 극장이나 사진 촬영소용으로 그림을 그린 캔버스 배경막 (제5907호 또는 제9706호)" ,
  "contentEn": "This heading covers paintings, drawings, pastels executed entirely by hand, and original collages and hand-made mosaics, divided into over 100 years old (subheadings 9701.21 to 9701.29) and others (subheadings 9701.91 to 9701.99).\n\nIt includes :\n- Paintings, drawings, and pastels (subheadings 21 & 91) in oil, tempera, watercolor, acrylic, or charcoal.\n- Hand-painted replicas/copies of artworks, provided they are drawn entirely by hand without mechanical tracing or photomechanical bases.\n- Mosaics (subheadings 22 & 92) made of hand-placed stone, marble, enamel, or glass tesserae (complying with Note 2).\n- Collages and decorative plaques (subheadings 29 & 99) composed of fibers, papers, or organic pieces glued onto a back support.\n- Appropriate frames presented together with the artwork (Note 6).\n\nExcludes hand-drawn industrial/architectural plans (heading 49.06), hand-painted manufactured objects like ceramic vases or decorated tables (classified by material), and commercial mass-produced mosaics (Note 2)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.01 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
