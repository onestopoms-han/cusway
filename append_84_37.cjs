const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8437",
  "titleKo": "84.37 - 종자ㆍ곡물ㆍ건조한 채두류(菜豆類)의 세정기ㆍ분류기ㆍ선별기, 제분업용 기계나 곡물ㆍ건조한 채두류(菜豆類)의 가공기계(농장형은 제외한다)",
  "titleEn": "84.37 - Machines for cleaning, sorting or grading seed, grain or dried leguminous vegetables; machinery used in the milling industry or for the working of cereals or dried leguminous vegetables, other than farm-type machinery.",
  "contentKo": "(I) 종자ㆍ곡물ㆍ건조한 채두류(菜豆類)의 세정기ㆍ분류기ㆍ선별기\n이 호에는 원예용ㆍ농업용이나 공업용인지에 상관없이 곡물ㆍ채두류(菜豆類)ㆍ종자 등을 키질ㆍ송풍ㆍ체질 등에 의하여 세정ㆍ선별ㆍ분류하는데 사용하는 종류의 기계를 분류한다.\n(1) 패닝밀(fanning mill) : 공급호퍼(feeding hopper)ㆍ송풍기와 체(진동형의 것이 많다)로 구성되어 있다.\n(2) 분급풍선기ㆍ회전풍선기와 종자나 곡물의 선별기 : 공기의 흐름에 의하여 청정하고 종자나 곡물의 무게ㆍ크기나 형태에 따라서 분급(grade)하는 보다 복잡한 기계이다. 어떤 종자 선별기에는 종자에 가루 살충제를 코팅하는 보조 장치가 결합된 것도 있다.\n(3) 벨트형의 체 : 사탕무 종자의 청정에 많이 사용하는 것으로서 공급호퍼의 하부를 엔드리스의 경사진 벨트가 회전하도록 만든 일련의 롤러로 구성되어 있다.\n(4) 재배용 종자의 선별용(selecting and grading)의 특수기계\n\n이 호에는 또한 제분에 앞서 곡물의 세정용·분류용이나 선별용으로 사용하는 제분 공업용의 기계를 포함한다. 이들 기계에는 앞에서 설명된 키질ㆍ체질과 선별용 기계와 같은 원리에 의한 것도 있으나, 그러나 어떤 것은 대량생산용으로 설계되고 또한 제분업용으로 전용화된 것도 있다. 그 예를 들면,\n(1) 곡물 청정용의 사이클론 분리기(cyclone separators)\n(2) 포켓을 갖추었거나 천공된 드럼의 회전에 의하여 세정이나 선별하는 기계\n(3) 진동식 체를 갖춘 흡인식 분리기(aspirator separator)\n(4) 자기(magnetic)나 전자기적(electro-magnetic) 형태의 분리기와 분류기\n(5) 세정기ㆍ돌의 제거기와 “원심탈수(whizzing)”기계 : 보조건조 컬럼(column)을 갖춘 것인지에 상관없다.\n(6) 곡물브러시기\n(7) 곡물가습기 : 가열장치나 계량장치를 결합했는지에 상관없다.\n이 호에는 세정ㆍ분류와 선별이 동시에 가능한 복합기와 전자기식 분리장치와 결합된 기계도 포함한다.\n\n(II) 제분업용 기계\n제분에 앞서 곡물의 세정용ㆍ선별용이나 분류용 기계(위의 (I)을 참조) 이외에 다음과 같은 제분공업에서 사용하는 기계를 포함한다.\n(A) 제분에 앞서 곡물의 혼합이나 조제용의 기계, 예를 들면,\n(1) 미리 설정된 양의 곡물을 혼합하는 기계\n(2) 고무실린더(cylinder)와 마주보고 회전하는 스파이크 드럼(spiked drum)으로 구성되어 연질(軟質)의 곡물을 제거시키는 곡물부스러기 제거기\n그러나 이 호에는 다음의 것을 포함하지 않는다.\n(a) 온도 변화에 의하여 조작되는 기계 설비(제8419호).\n(b) 원심식 건조기(제8421호)\n(c) 컨베이어와 엘리베이터(제8428호)\n(B) 분쇄기나 파쇄기 : 그 예를 들면, 다음과 같다.\n(1) 분쇄기\n(2) “파쇄용(breaking)” 롤이나 분쇄기 : 수조의 홈이 파인 롤러로 구성되며 이것은 곡물을 중분․세몰리나․고운 가루로 부순다.\n(3) 평활롤러를 갖춘 제분기 : 곡물의 거친 가루․세몰리나 등을 고운 가루로 변화시키도록 특별히 설계된 것이다.\n(4) 분쇄기나 충격그라인더 : 제분공정 위에서 분쇄기나 제분기의 롤러에 고착된 곡물을 고운 가루․거친 가루 등으로 분쇄하는데 사용한다.\n(5) 공급기 : 분쇄 롤러에 규칙적으로 일정한 흐름의 곡물을 공급하도록 설계된 것이다.\n이 호에는 농장용의 소형 분쇄기는 포함되지 않는다(제8436호).\n(C) 거친 가루나 중간 가루로부터 고운 가루를 분류․분리하는 기계\n이 그룹에는 제분공정에서 생긴 고운 가루․거친 가루․중간 가루 등을 분리하기 위한 기계를 포함한다.\n(1) 부순 알곡과 거친 가루로부터 고운 가루를 분리하는 기계식의 체(“bolter”)\n(2) 기계체나 “청정기(purifier)” : 중간 거친 가루 등을 선별하는 것이다.\n(3) 겨 세정기\n(4) 고운 가루․겨 등을 혼합하는 기계 ; 고운 가루에 비타민을 첨가하는 기계\n다만, 이 호에는 다음의 것을 포함하지 않는다.\n(a) 가루 건조기(제8419호)\n(b) 에어필터와 \"사이클론\"(제8421호)\n(c) 추출기록기와 검사기(제90류)\n\n(III) 곡물ㆍ건조한 채두류(菜豆類)의 가공기계\n(1) 곡물이나 건조한 채두류의 박피기\n(2) 탈곡기나 정미기\n(3) 건조한 완두․렌즈콩이나 콩을 쪼개는 기계\n(4) 롤러 처리하였거나 납작하게 누른 귀리 등의 조제기\n(5) 곡물, 건조한 채두류(菜豆類)의 특수 분쇄나 파쇄용 기계\n(6) 보리나 귀리에서 “까끄라기(beard)”이나 “포인트(point)”을 제거하도록 만든 “까끄라기 제거”기계와 “클립핑(clipping)”기계\n이 호에는 다음의 것이 포함되지 않는다.\n(a) 열 교환에 의하여 작용되는 기계장치(제8419호)\n(b) 제빵용ㆍ보존용이나 마카로니 제조용(제8438호)\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 물품의 부분품도 이 호에 분류한다. 그 예를 들면, 다음과 같다.\n제분업용의 체(sieve)와 체틀(sieves frame)[볼팅 클로스(bolting cloth)는 제외(제5911호)]; 실린더(cylinder)ㆍ롤러\n다만, 밀스톤(millstone)은 제외한다(제6804호).",
  "contentEn": "This heading covers machines for cleaning, sorting or grading seed, grain or dried leguminous vegetables, and machinery used in the milling industry or for the working of cereals or dried leguminous vegetables (excluding farm-type machinery of heading 84.36).\n\nIt includes :\n(I) Winnowing, cleaning, sorting or grading machines (fanning mills, rotary separators, belt sieves, selecting/grading machines, magnetic separators, grain brushes, humidifiers).\n(II) Milling machinery for preparing, grinding, breaking or separating cereals (grain blending systems, breaking rolls, reduction mills, impact grinders, plansifters, purifiers, bran cleaners, flour mixers).\n(III) Machinery for working cereals or dried leguminous vegetables (de-hullers, pearlers, splitters, oat-flaking machines, bearding and clipping machines).\n\nParts of these machines are also covered (sieve frames, cylinders, milling rolls).\n\nThe heading excludes :\n(a) Millstones (heading 68.04).\n(b) Drying columns and cooling columns (heading 84.19).\n(c) Centrifugal dryers and air filters (heading 84.21).\n(d) Conveyors and bucket elevators (heading 84.28).\n(e) Farm-type mills and feed grinders (heading 84.36).\n(f) Industrial food preparation machinery (heading 84.38)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.37 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
