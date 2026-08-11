const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_67.json';

const newEntry = {
  "hsCode": "6702",
  "titleKo": "67.02 - 인조 꽃ㆍ잎ㆍ과실과 이들의 부분품, 인조 꽃ㆍ잎ㆍ과실로 만든 제품",
  "titleEn": "67.02 - Artificial flowers, foliage and fruit and parts thereof; articles made of artificial flowers, foliage or fruit.",
  "contentKo": "이 호에는 다음의 것을 분류한다.\n\n(1) 여러 가지 부분을 결합(상호간에 결속ㆍ접착ㆍ부착ㆍ그 밖의 이와 유사한 방법에 의한 것)하여 천연생산품과 닮은 인조의 꽃ㆍ잎ㆍ과실. 이 범주에는 조화(造花) 제조 방법에 의하여 만든 꽃ㆍ잎ㆍ과실의 모형틀(conventional representation)도 포함한다.\n\n(2) 인조의 꽃ㆍ잎ㆍ과실의 부분품(예: 암술ㆍ수술ㆍ씨방ㆍ꽃잎ㆍ꽃받침ㆍ나뭇잎과 잎줄기)\n\n(3) 인조의 꽃ㆍ잎ㆍ과실로 만든 제품[예: 화환ㆍ화륜ㆍ화관ㆍ플랜트(plant)]과 인조의 꽃ㆍ잎ㆍ과실을 결합하여 만든 트리밍(trimmings)ㆍ장식용의 그 밖의 제품\n\n이 호에는 핀이나 그 밖의 조그만 결속물로 부착한 인조의 꽃ㆍ잎ㆍ과실도 포함한다.\n\n이 호의 제품은 주로 장식용에 사용하며(예: 가옥이나 교회에서 사용한다), 모자나 의류 등의 장식물로 사용한다.\n\n아래에 열거한 예외조항에 해당되지 않는 이들 물품은 방직용 섬유 재료ㆍ펠트(felt)ㆍ종이ㆍ플라스틱ㆍ고무ㆍ가죽ㆍ금속의 박ㆍ새의 깃털ㆍ패각ㆍ동물성 원료의 그 밖의 재료(예: 히드로충류나 이끼벌레류의 유연한 유체로 만들어 특별히 조제와 염색한 해상 동물성의 인조의 잎) 등으로 만들 수도 있다. 이와 같이 앞 항의 특정 사항을 충족하는 한, 이러한 모든 물품은 완성도에 상관없이 이 호에 분류한다.\n\n이 호에는 다음의 것을 제외한다.\n\n(a) 제0603호나 제0604호의 천연의 꽃과 잎(예: 염색한 것ㆍ은을 입힌 것ㆍ금을 입힌 것)\n\n(b) 의복의 장식물로서 사용이 가능하다 할지라도 조화(造花)의 제조방법[즉, 여러 가지의 부분(꽃잎ㆍ수술ㆍ줄기 등)을 철사ㆍ방직용 섬유 재료ㆍ종이ㆍ고무 등으로 묶거나 글루로 접착시키거나 그 밖의 방법에 의하여 결합하는 방법]에 의하여 만들어지지 않은 레이스ㆍ자수ㆍ그 밖의 방직용 섬유의 직물로 만든 꽃 모양 장식(제11부)\n\n(c) 인조의 꽃이나 잎으로 만든 모자류(제65류)\n\n(d) 유리제품(제70류)\n\n(e) 도자기ㆍ석ㆍ금속ㆍ목재ㆍ그 밖의 목재로서 만든 인조의 꽃ㆍ잎ㆍ과실로서 성형ㆍ단조ㆍ조각ㆍ스탬핑ㆍ그 밖의 방법에 의하여 단일체로 만든 것ㆍ상호간의 결속ㆍ접착ㆍ부착이나 이와 유사한 방법 이외의 방법으로 결합된 부분품을 조립하여 만든 것\n\n(f) 조화(造花) 등의 줄기를 만들기 위하여 단순히 일정한 길이로 절단하고 방직용 섬유의 직물ㆍ종이 등을 입힌 철선(제15부)\n\n(g) 완구ㆍ카니발용품으로서 명백히 인정할 수 있는 물품(제95류)",
  "contentEn": "This heading covers :\n\n(1) Artificial flowers, foliage and fruit in designs resembling the natural products, obtained by assembling various parts (by binding, glueing, fitting into one another or similar methods). This category also includes conventional representations of flowers, foliage or fruit obtained by artificial flower-making processes.\n\n(2) Parts of artificial flowers, foliage or fruit (e.g., pistils, stamens, ovaries, petals, calyces, leaves and stems).\n\n(3) Articles made of artificial flowers, foliage or fruit (e.g., bouquets, wreaths, garlands, plants) and other decorative or trimming articles made by assembling artificial flowers, foliage or fruit.\n\nThis heading also includes artificial flowers, foliage or fruit fitted with pins or other small fastening devices.\n\nThese articles are used mainly for decoration (e.g., in houses or churches) or as trimmings for hats, apparel, etc.\n\nSubject to the exclusions listed below, these goods may be made of textile materials, felt, paper, plastics, rubber, leather, metal foil, feathers, shells or other materials of animal origin (e.g., artificial marine foliage made of the specially prepared and dyed flexible skeletons of hydroids or bryozoans). Provided they satisfy the conditions mentioned above, all these articles fall in this heading, regardless of their degree of finish.\n\nThe heading excludes :\n(a) Natural flowers and foliage of heading 06.03 or 06.04 (e.g., dyed, silvered or gilded).\n(b) Floral motifs of lace, embroidery or other textile fabric not obtained by artificial flower-making processes (Section XI).\n(c) Headgear of artificial flowers or foliage (Chapter 65).\n(d) Articles of glass (Chapter 70).\n(e) Artificial flowers, foliage or fruit of pottery, stone, metal, wood, etc., obtained in one piece by moulding, forging, carving, stamping or other process, or consisting of parts assembled otherwise than by binding, glueing, fitting into one another or similar methods.\n(f) Wire simply cut to length and covered with textile fabric, paper, etc., for making stems for artificial flowers, etc. (Section XV).\n(g) Goods clearly identifiable as toys or carnival articles (Chapter 95)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 67.02 to chapter_67.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
