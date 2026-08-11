const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_69.json';

const newEntry = {
  "hsCode": "6903",
  "titleKo": "69.03 - 그 밖의 내화성 도자제품[예: 레토르트(retort)ㆍ도가니ㆍ머플ㆍ노즐ㆍ플러그ㆍ서포트ㆍ큐펠(cupel)ㆍ관(管)ㆍ쉬드(sheath)ㆍ막대(rod)ㆍ슬라이드 게이트(slide gate)](규조토나 이와 유사한 규산질의 흙으로 만든 제품은 제외한다)",
  "titleEn": "69.03 - Other refractory ceramic goods (for example, retorts, crucibles, muffles, nozzles, plugs, supports, cupels, tubes, pipes, sheaths, rods and slide gates), other than those of siliceous fossil meals or similar siliceous earths.",
  "contentKo": "이 호에는 앞 호에 열거하지 않았거나 포함되지 않은 모든 내화제품을 분류한다.\n\n이러한 제품에는 다음의 것을 포함한다.\n\n(1) 제6902호의 내화제품과는 달리 대개 영구적인 고정물이 아닌 물품[예: 레토르트(retort)ㆍ반응통ㆍ도가니ㆍ큐펠(cupel)이나 이와 유사한 공업용이나 실험실용의 물품ㆍ머플(muffle)ㆍ노즐(nozzle)ㆍ플러그(plug)ㆍ버너분사관(burner jet)이나 이와 유사한 노용 부분품 ; 소성(燒成) 중 도자기의 지지물이나 격리재로 사용하는 토갑(土匣 : saggar)ㆍ스탠드ㆍ그 밖의 노용 물품 ; 쉬드(sheath)ㆍ막대(rod) ; 도가니용의 스탠드 ; 잉곳용 몰드 ; 슬라이드 게이트(slide gate)ㆍ롤러ㆍ블랭크(blank)ㆍ성형도구ㆍ항아리 ; 등]\n\n(2) 관(管)(tubingㆍpiping)(반원통형의 홈통을 포함한다)ㆍ앵글(angle)ㆍ밴드(band)․이와 유사한 관용 부속품(구조물에 영구적으로 부착하여 사용하도록 설계했는지 상관없다)\n\n그러나 이 호에는 세겔 콘(Seger cone)[도자(陶瓷)제의 소성시험용]는 포함하지 않는다(제3824호 해설 참조). 왜냐하면 이 물품은 성형ㆍ소성한 것이 아니기 때문이다.\n\n◦\n◦ ◦\n[소호해설]\n소호 제6903.10호\n이 소호에서 \"유리(遊離) 탄소\"는 흑연ㆍ비결정성 탄소(카본블랙)ㆍ유기 탄소(피치ㆍ타르나 수지)와 같은 탄소 화학종(種)에 적용된다.",
  "contentEn": "This heading covers all refractory goods not classifiable in heading 69.02 or other headings of the Nomenclature.\n\nThese articles include :\n(1) Articles which, unlike the refractory constructional goods of heading 69.02, are usually not permanent fixtures (e.g., retorts, reaction vessels, crucibles, cupels and similar industrial or laboratory ware; muffles, nozzles, plugs, burner jets and similar kiln parts; saggars, stands and other kiln furniture used to support ceramic ware during firing; sheaths and rods; stands for crucibles; ingot moulds; slide gates, rollers, blanks, forming tools, pots).\n(2) Tubing, piping (including runways in the form of half-cylinders) and angles, bends and similar pipe fittings, whether or not designed for permanent installation.\n\nThe heading excludes Seger cones (used to test temperatures in ceramic kilns), which are not fired after shaping (heading 38.24).\n\nSubheading Explanatory Note.\nSubheading 6903.10\nFor the purposes of this subheading, the term \"free carbon\" applies to carbon species such as graphite, amorphous carbon (carbon black), and organic carbon (pitch, tar or resin)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 69.03 to chapter_69.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
