const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8439",
  "titleKo": "84.39 - 섬유소 펄프의 제조용 기계와 종이ㆍ판지의 제조용이나 완성가공용 기계",
  "titleEn": "84.39 - Machinery for making pulp of fibrous cellulosic material or for making or finishing paper or paperboard.",
  "contentKo": "이 호에는 여러 가지의 섬유소 원료[목재ㆍ짚ㆍ버개스(bagasse)ㆍ종이의 웨이스트 등]로부터 섬유소 펄프를 제조하는 기계가 포함되며, 제조된 펄프는 종이ㆍ판지나 그 밖의 목적(예: 비스코스레이온ㆍ특정의 건축용 보드나 폭발물 제조용)의 어떤 용도에 사용하는 지에는 상관없다. 또한 이미 제조된 펄프(예: 기계적이나 화학적 목재펄프)로부터나 원료[목재ㆍ짚ㆍ버개스(bagasse)ㆍ종이의 웨이스트 등]로부터 직접 종이나 판지를 제조하는 기계도 포함한다. 이 호에는 또한 종이나 판지를 여러 가지 용도에 적합하도록 완성 가공하는 기계도 포함되며, 제8443호의 인쇄기는 제외한다.\n\n(I) 섬유소 펄프의 제조용 기계\n(A) 펄프제조 등의 공정에 있어서의 원료의 전(前)처리용 기계\n(1) 웨이스트 종이나 판지를 펄프화하는 기계\n(2) 짚과 이와 유사한 재료용의 오프너(openers)와 집진기(dusters)\n(3) 제지공업용 죽(竹)파쇄기와 특수한 짚 절단기\n(4) 목재 칩 절단기와 목재 칩 분급용 진동식 선별기\n(5) 목재 파쇄기(log grinding machine)\n(6) “매서나이트(masonite)” 섬유분리기\n(B) 스트레이너(strainer) : 이 기계 중에서 희박한 펄프액은 파쇄되지 않은 것과 옹이ㆍ마디ㆍ오물 등을 남기고 스크린을 통하여 통과한다. 다만, 원심력에 의하여 작동되는 것은 제외한다(제8421호).\n(C) 흡습기(wet lapper : presse-pâte machine)\n(D) 정제기(refiner)\n(E) 파쇄기(crusher)와 파목기(grinder)\n\n(II) 종이ㆍ판지의 제조용 기계\n(A) 제지원료를 종이나 판지의 연속 시트(sheet)로 형성하는 기계[예: 포드리니어(Fourdrinier) 기계나 트윈 와이어기]\n(B) 배트기(vat machine)\n(C) 다층지ㆍ보드지나 판지 제조용 기계\n(D) 시험용지샘플 제조용의 견본 드로잉 기기\n\n(III) 종이ㆍ판지의 완성가공용 기계\n(A) 감기용(reeling) 기계\n(B) 표면피복용 기계\n(C) 종이나 판지에 기름이나 플라스틱을 침투시키는 기계와 역청가공이나 타르를 침투시킨 루핑지(roofing paper)의 제조기\n(D) 선 긋는 기계(ruling machine)\n(E) 크레핑기(crêping machine)\n(F) 종이에 가습하는 장치\n(G) 그레이닝(graining)용과 엠보싱(embossing)용의 기계\n(H) 주름잡는 기계(corrugating machine)\n\n이 호에는 다음의 것도 제외한다.\n(a) 넝마ㆍ짚 등에 사용하는 보일러 ; 화학목재펄프 조제용의 보일러(digester) ; 건조기(제8419호)\n(b) 워터제트식 박피기(제8424호)와 목재를 박피하는 기계(제8465호나 제8479호)\n(c) 인쇄기(제8443호)\n(d) 넝마 소모기ㆍ풀링(pulling)기와 반모기(제8445호)\n(e) 벌커나이즈드 파이버 제조용 기계(제8477호)\n(f) 종이ㆍ직물ㆍ목재 등에 연마 재료를 피복하는 기계(제8479호)\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 기계부분품도 이 호에 분류하며, 그 예를 들면 : 백폴(backfall) ; 비터(beater)용 받침대와 비터 바(beater bar) ; 카우치 롤(couch roll) ; 흡수상자(suction box) ; 배트기(vat machine)용 실린더(cylinder) ; 투명무늬 내는 롤(dandy roll)\n다만, 다음의 것은 이 호의 부분품으로서 인정하지 않는다.\n(a) 방직용 섬유재료로 만든 엔드리스 벨트와 펠트로 만든 롤러커버(제5911호)\n(b) 에지러너용 석(edge-runner stone)ㆍ연마석ㆍ현무암ㆍ용암이나 천연석으로 만든 베드플레이트(bedplate)와 백폴(backfall)(제6804호와 제6815호)\n(c) 청동선과 구리선으로 직조된 엔드리스 벨트(제7419호)\n(d) 기계용 나이프와 절단용 날(제8208호)\n(e) 캘린더 롤(제8420호)",
  "contentEn": "This heading covers machinery used for making pulp of fibrous cellulosic material, or for making or finishing paper or paperboard.\n\nIt includes :\n(I) Pulp making machinery (paper or paperboard pulpers, straw dusters, wood chip cutters, log grinding machines, refiners, wet lappers).\n(II) Paper or paperboard making machinery (Fourdrinier machines, twin wire formers, vat machines).\n(III) Finishing machinery (reeling machines, coating machines, ruling machines, crêping machines, corrugating machines).\n\nParts of these machines are also covered (dandy rolls, couch rolls, suction boxes).\n\nThe heading excludes :\n(a) Digesters and boilers (heading 84.19).\n(b) Bark strippers (heading 84.24, 84.65 or 84.79).\n(c) Printing machinery (heading 84.43).\n(d) Rag-pulling machines (heading 84.45).\n(e) Vulcanised fibre machines (heading 84.77).\n(f) Endless belts of textile material (heading 59.11) or of wire mesh (heading 74.19)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.39 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
