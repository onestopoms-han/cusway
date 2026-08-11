const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_65.json';

const newEntry = {
  "hsCode": "6507",
  "titleKo": "65.07 - 헤드밴드ㆍ내장재ㆍ커버ㆍ모자의 파운데이션(foundation)ㆍ모자의 프레임(frame)ㆍ챙ㆍ턱끈",
  "titleEn": "65.07 - Head-bands, linings, covers, hat foundations, hat frames, peaks and chinstraps, for headgear.",
  "contentKo": "이 호에는 다음과 같은 모자용의 부착구만을 분류한다.\n\n(1) 헤드밴드(head-band) : 이것은 크라운의 내측 가장자리에 붙이는데 사용한다. 이러한 물품은 보통 가죽으로 만들며 콤퍼지션레더(composition leather)ㆍ유포제나 그 밖의 도포 된(塗布 : coated) 직물 등으로 된 경우도 있다. 이것은 길이로 절단하였거나 그 밖의 방법으로 모자에 결합할 수 있도록 된 것에만 한정하여 이 호에 분류한다. 이 물품에는 모자제조자의 이름 등을 새긴 경우가 많다.\n\n(2) 내장재와 내장재 부분품 : 이러한 물품은 일반적으로 방직용 섬유재료의 것이지만 때로는 플라스틱이나 가죽 등으로 제조하는 경우도 있다. 또한 이러한 물품에도 보통 모자제조자의 이름 등을 나타내는 인쇄한 표시를 새긴다.\n그러나 모자 등의 내측 크라운에 부착하는데 사용하는 레이블(label)은 이 호에서 제외한다는 것을 유의해야 한다.\n\n(3) 커버 : 이것은 보통 방직용 섬유의 직물이나 플라스틱으로 만든다.\n\n(4) 모자의 파운데이션(hat foundation) ; 이들 물품은 보강된 직물[예: 버크럼(buckram)]․판지․페이퍼 머쉐이(paper maché)․코르크(cork)․피드(pith)․금속 등으로 만든다.\n\n(5) 모자의 프레임(hat frame) : 예를 들면, 와이어 프레임(frame)(간혹 방직용 섬유나 그 밖의 재료로 꼬여 있는 경우가 있다)과 오페라 모자용의 스프링 프레임(frame)\n\n(6) 챙(peak)(예: 제모나 그 밖의 모자용의 것) : 주로 보안용 차양으로 만든 챙(peak)을 여러 가지 모자의 부분(크라운)에 결합하면 모자로서 분류하나, 그러지 않은 경우에는 구성 재료에 따라서 분류한다.\n\n(7) 턱끈(chinstrap) ; 이것은 가죽ㆍ방직용 섬유의 직물ㆍ플라스틱 등으로 만든 좁은 스트립ㆍ밴드(엮어 만든 스트립을 포함한다)이다. 이것은 보통 조정하는데 필요한 길이로 만들어져 있으며 장식물로도 사용한다. 턱끈(chinstrap)은 모자 내에 결합할 수 있도록 만든 경우에만 한정해서 이 호에 분류한다.",
  "contentEn": "This heading covers only the following fittings for headgear :\n\n(1) Head-bands. These are fitted to the inside edge of the crown. They are usually of leather, but may be of composition leather, oilcloth or other coated fabric. They are classified here only if they are in lengths or otherwise prepared for fitting to headgear. They are often marked with the hatter's name, etc.\n\n(2) Linings and parts of linings. These are usually of textile material, but are sometimes of plastics, leather, etc. They are also usually printed with the hatter's name, etc.\nLabels used for attaching inside the crown of headgear are, however, excluded.\n\n(3) Covers. These are usually of textile fabric or plastics.\n\n(4) Hat foundations. These are made of stiffened fabric (e.g., buckram), paperboard, papier-mâché, cork, pith, metal, etc.\n\n(5) Hat frames (e.g., wire frames, sometimes covered with textile or other material, and spring frames for opera hats).\n\n(6) Peaks (e.g., for uniform caps). Peaks designed mainly for protective wear (e.g., safety peaks) are classified in this heading if presented prepared for assembling to a crown, otherwise they are classified according to their constituent material.\n\n(7) Chinstraps. These are narrow strips, bands or braids of leather, textile fabric, plastics, etc., usually of the length required for fitting and adjusting to headgear, and sometimes worn also as ornaments. They are classified here only if they are prepared for fitting to headgear."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 65.07 to chapter_65.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
