const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8447",
  "titleKo": "84.47 - 편직기, 스티치본딩기(stitch-bonding machine), 짐프사(gimped yarn)ㆍ튈(tulle)ㆍ레이스ㆍ자수천ㆍ트리밍(trimming)ㆍ브레이드(braid)나 망의 제조용 기계ㆍ터프팅(tufting) 기계",
  "titleEn": "84.47 - Knitting machines, stitch-bonding machines and machines for making gimped yarn, tulle, lace, embroidery, trimmings, braid or net and machines for tufting.",
  "contentKo": "이 호에는 편직(knitting)ㆍ스티치 본딩(stitch-bonding)ㆍ짐핑(gimping)ㆍ브레이딩(braiding)ㆍ넷팅(netting)ㆍ터프팅(tufting) 등의 방법으로 직물류나 트리밍(trimmings)을 제조하는 모든 기계와 여러 가지의 바탕천에 자수를 하는 기계를 포함한다.\n\n(A) 편직기(knitting machine)\n(1) 환편기(circular machine) : 똑바른 관(管) 모양의 편물이나 침열의 매편목의 크기를 변경시킴으로써 여러 가지 형태로 만든 것(스타킹ㆍ양말 등)을 제조한다.\n(2) 평편기(flat machine) : 균일한 폭의 평평한 생지를 만들거나 혹은 침열상에서 편목이 증감함에 따라 평형이지만 균일한 폭이 아닌 특정형으로 만들어지는 생지를 제조한다.\n또한 이 호에는 소형의 가정용 편직기도 포함한다. 편직물 접합용 킹기는 제8452호에 분류한다.\n\n(B) 스티치본딩기(stitch-bonding machine)\n(1) 체인 스티칭에 의하여 “경사(warp)”와 “위사(weft)”를 붙이기 위한 바늘 메카니즘을 갖춘 기계\n(2) 일반적인 직조기에서 이미 생산한 직물 뒷면에 실 고리를 만들어 넣는 기계\n(3) 편직-봉합기계(knitting sewing machine) : 다른 기계로 이미 만든 엉성한 섬유로 된 직물의 봉합고리를 꿰메는 기계\n\n(C) 결절망ㆍ튈ㆍ레이스ㆍ브레이드ㆍ트리밍ㆍ짐프사ㆍ자수천ㆍ터프팅 등의 제조용 기계\n(1) 망(net)이나 망지(netting)의 제조기계\n(2) 평편직 튈(tulle)의 제조기계\n(3) 무늬편직 튈․레이스 등의 제조기계\n(4) 보비너 튈, 보비너 커튼과 보비너의 기계적 레이스 제조용 기계\n(5) 자수기(embroidery machine) : 팬토그래프 북을 갖춘 자수기 등 다수의 침에 의하여 무늬를 수놓는 것이다.\n(6) 짐핑기(gimping machine) : 굵은 심(금속선, 고무사 등) 둘레를 실로 나선상으로 감는 기계\n(7) 여러 가지 트리밍(trimmings)을 제조하는 기계(조유제조기 등)\n(8) 방직용 섬유의 실로 단추, 술의 심 등을 피복하는 기계\n(9) 터프팅(tufting) 기계 : 직물 뒷면에 방적사로 된 고리나 술을 만들어 넣는 기계\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품과 부속품은 제8448호에 분류한다.",
  "contentEn": "This heading covers all machinery for producing knitwear or trimmings by knitting, stitch-bonding, gimping, braiding, netting or tufting, and embroidery machines.\n\nIt includes :\n(I) Knitting machines (circular knitting machines, flat knitting machines, Raschel machines, household knitting machines).\n(II) Stitch-bonding machines.\n(III) Net, tulle, lace or embroidery making machines (including multi-needle embroidery machines, bobbinet lace machines).\n(IV) Gimping and braiding machines.\n(V) Tufting machines (for carpets, bathrobes, etc.).\n\nParts and accessories of these machines fall in heading 84.48.\n\nThe heading excludes :\n(a) Linking machines for joining knitted parts (heading 84.52).\n(b) Boundary/edge sewing machines and domestic sewing machines (heading 84.52)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.47 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
