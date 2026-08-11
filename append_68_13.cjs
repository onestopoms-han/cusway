const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_68.json';

const newEntry = {
  "hsCode": "6813",
  "titleKo": "68.13 - 마찰 재료와 그 제품[예: 시트(sheet)ㆍ롤ㆍ스트립(strip)ㆍ세그먼트ㆍ디스크(disc)ㆍ와셔(washer)ㆍ패드](장착되지 않은 것으로서 브레이크용ㆍ클러치용이나 이와 유사한 용도의 석면ㆍ그 밖의 광물성 재료ㆍ셀룰로오스를 기본 재료로 한 것으로 한정하며, 직물이나 그 밖의 재료와 결합한 것인지에 상관없다)",
  "titleEn": "68.13 - Friction material and articles thereof (for example, sheets, rolls, strips, segments, discs, washers, pads), not mounted, for brakes, for clutches or the like, with a basis of asbestos, of other mineral substances or of cellulose, whether or not combined with textile or other materials.",
  "contentKo": "석면으로 만든 마찰재료(asbestos friction material)는 석면섬유ㆍ플라스틱 등의 혼합물을 고압 상태에서 성형하여 제조하며 ; 또한 이것은 플라스틱ㆍ피치(pitch)ㆍ고무를 침투시킨 석면 직물이나 편조물 층을 압축함으로써 제조하기도 한다. 이것은 구리ㆍ아연ㆍ납선으로 보강되는 경우도 있으며, 때로는 석면 피복시킨 금속의 선이나 면실로서 제조하는 경우도 있다. 이 재료는 마찰계수가 크고 단열성과 내구성이 있기 때문에 여러 종류의 차량ㆍ기중기ㆍ준설기ㆍ그 밖의 기계의 라이닝브레이크슈즈ㆍ클러치용 디스크 등에 사용한다. 이 호에는 그 밖의 광물성 재료(예: 흑연ㆍ규산질토)나 셀룰로오스파이버(cellulose fibre)를 기본재료로 하여 만든 유사한 마찰재료도 포함한다.\n\n이 물품의 특수용도에 따라서 이 호에 분류하는 마찰재료는 시트(sheet)ㆍ롤(roll)ㆍ스트립(strip)ㆍ세그먼트(segment)ㆍ디스크(disc)ㆍ링(ring)ㆍ와셔(washer)ㆍ패드(pad)나 그 밖의 모양으로 절단한 것도 있다. 이것들은 또한 봉합하여 조합한 것도 있으며 드릴ㆍ그 밖의 가공을 한 것도 있다.\n\n이 호에서는 다음의 것을 제외한다.\n\n(a) 광물성 재료나 셀룰로오스파이버(cellulose fibre)를 함유하지 않는 마찰재료[예: 코르크(cork)의 것] ; 이들은 일반적으로 구성 재료에 따라 분류한다.\n\n(b) 장착한 브레이크라이닝(brake lining)[디스크브레이크(disc brake)용으로서 circular cavityㆍ천공(穿孔)한 tongueㆍ이와 유사한 부속품으로 갖춘 금속성판에 고정한 마찰재료를 포함한다] ; 이것들은 자동차나 기계용으로 설계한 자동차나 기계의 부분품으로 분류한다(예: 제8708호).",
  "contentEn": "This heading covers friction materials based on asbestos, other mineral substances (e.g., graphite, siliceous earths) or cellulose, used for brakes, clutches or the like. They are usually composed of a mixture of these substances and plastics, and molded under pressure. Alternatively, they may be made by compressing layers of asbestos fabric or braid impregnated with plastics, pitch or rubber. They may be reinforced with copper, zinc or lead wire.\n\nThese materials are classified here when not mounted. They may be in the form of sheets, rolls, strips, segments, discs, rings, washers, pads, etc. They may also be sewn, drilled or otherwise worked.\n\nThe heading excludes :\n(a) Friction materials not containing mineral substances or cellulose (e.g., of cork); these are classified according to their constituent material.\n(b) Mounted friction materials (e.g., brake linings fixed to a metal backing with rivets, adhesive, etc.); these are classified as parts of the vehicles or machinery for which they are designed (e.g., heading 87.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 68.13 to chapter_68.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
