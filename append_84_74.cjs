const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8474",
  "titleKo": "84.74 - 선별기ㆍ기계식 체ㆍ분리기ㆍ세척기ㆍ파쇄기ㆍ분쇄기ㆍ혼합기ㆍ반죽기(고체 모양ㆍ분말 모양ㆍ페이스트 모양인 토양ㆍ돌ㆍ광석이나 그 밖의 광물성 물질의 처리용으로 한정한다), 조괴기(造塊機)ㆍ형입기ㆍ성형기(成形機)(고체의 광물성 연료ㆍ세라믹페이스트ㆍ굳지 않은 시멘트ㆍ석고ㆍ가루 모양이나 페이스트 모양인 그 밖의 광물성 생산품의 처리용으로 한정한다), 주물용 사형(砂型)의 성형기(成形機)",
  "titleEn": "84.74 - Machinery for sorting, screening, separating, washing, crushing, grinding, mixing or kneading earth, stone, ores or other mineral substances, in solid (including powder or paste) form; machinery for agglomerating, shaping or moulding solid mineral fuels, ceramic paste, unhardened cements, plastering materials or other mineral products in powder or paste form; machines for forming foundry moulds of sand.",
  "contentKo": "이 호에는 다음의 것을 포함한다.\n(Ⅰ) 고체의 광물성 물질(토양, 점토, 광석, 광물성 연료, 시멘트, 콘크리트 등)의 선별, 체질, 분리, 세정, 파쇄, 분쇄, 혼합 또는 반죽 기계\n(Ⅱ) 가루나 페이스트 모양의 고체 광물성 물질의 조괴(agglomerating), 형입, 성형 기계(세라믹 페이스트, 시멘트, 석고 성형기 등)\n(Ⅲ) 주물용 사형(砂型) 성형기\n비광물성 물질(목재, 뼈 등)을 보조적으로 처리하는 기계도 포함하지만, 비광물성 재료 전용으로 설계된 것은 제외한다.\n\n(Ⅰ) 채취산업용 처리 기계\n(A) 선별기, 기계식 체, 분리기, 세정기 : 롤러선별기, 트롬멜(trommel) 등 회전/진동 드럼 스크린, 갈퀴형 선별기, 부유선별기, 자력/정전식 분리기 및 광전식/방사능 우라늄 선별장치 등 (원심식 선별기 제8421호 제외).\n(B) 파쇄기 및 분쇄기 : 수직 회전식 파쇄기, 조오크러셔(jaw crusher), 드럼식 파쇄기, 롤식 파쇄기, 충격식 분쇄기, 해머 파쇄기, 볼밀(ball mill)/로드밀, 스탬프밀(stamp mill) 등.\n(C) 혼합기 및 반죽기 : 콘크리트/모르타르 혼합기(차량용 제외), 아스팔트 플랜트/역청 혼합기, 광석 혼합기, 주물사 혼합기 등.\n\n(Ⅱ) 조괴기ㆍ형입기ㆍ성형기\n(A) 고형 광물 연료(연탄 등) 조괴 프레스\n(B) 점토/세라믹 성형기 : 벽돌 제조기, 타일 형입기, 토관 압출기, 도공용 녹로(물레) 등.\n(C) 연마재 응결기 (그라인딩 휠 제조용)\n(D) 콘크리트 조립 부품 성형기 (콘크리트 관 원심성형기 포함)\n(E) 석고/치장벽토 제품(완구, 조각상 등) 형입기\n(F) 석면시멘트 관/통 성형기\n(G) 흑연전극 형입기\n(H) 연필심 압출기\n(IJ) 칠판 백묵 형입기\n\n(Ⅲ) 주물용 사형 성형기\n주물사를 프레스하거나 코어로 성형하기 위한 기계 (공기압 압축식 포함, 모래 분사식 제8424호 및 건조 스토브 제8419호 제외).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품은 이 호에 분류한다. 분쇄기용 볼은 재질에 따라 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 분쇄장치를 갖춘 메커니컬 스토커(제8416호)\n(b) 캘린더기 및 롤러기(제8420호)\n(c) 필터 프레스(제8421호)\n(d) 광물성 물질 가공 공작기계(제8464호)\n(e) 콘크리트 바이브레이터(제8467호, 제8479호)\n(f) 유리 성형기(제8475호)\n(g) 플라스틱 성형기(제8477호)\n(h) 범용 프레스 및 콘크리트 스프레더(제8479호)\n(k) 주형틀 및 주형(mould)(제8480호)",
  "contentEn": "This heading covers machinery for sorting, screening, separating, washing, crushing, grinding, mixing or kneading earth, stone, ores or other mineral substances, in solid form; machinery for agglomerating, shaping or moulding solid mineral fuels, ceramic paste, unhardened cements, plastering materials, or other mineral products; and machines for forming foundry moulds of sand.\n\nIt includes :\n(I) Sorting, screening, separating or washing machines (trommels, vibratory screens, flotation separators, magnetic separators, radiometric uranium sorters).\n(II) Crushing or grinding machines (jaw crushers, roll crushers, ball mills, stamp mills).\n(III) Mixing or kneading machines (concrete mixers, bituminous mixers/asphalt plants, clay kneaders).\n(IV) Agglomerating, moulding or shaping machines (briquette presses, brick-making machines, tile-moulding machines, potters' wheels, concrete pipe centrifugal casting machines, plaster ornament moulders).\n(V) Sand-mould forming machines for foundries.\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Mechanical stokers with pulverising equipment (heading 84.16).\n(b) Calendering or rolling machines (heading 84.20).\n(c) Filter presses (heading 84.21).\n(d) Machine-tools for working stone or minerals (heading 84.64).\n(e) Concrete vibrators (heading 84.67 or 84.79).\n(f) Glass-moulding machines (heading 84.75).\n(g) Plastics-moulding machines (heading 84.77).\n(h) Multi-purpose presses and concrete spreaders (heading 84.79).\n(ij) Moulding boxes and moulds (heading 84.80)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.74 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
