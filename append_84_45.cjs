const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8445",
  "titleKo": "84.45 - 방적준비기계, 방적기ㆍ합사기(合絲機)ㆍ연사기(撚絲機)와 그 밖의 방직사 제조기계, 권사기(捲絲機)[위권기(緯捲機)를 포함한다]와 제8446호나 제8447호의 기계에 사용되는 방직사를 제조하는 기계와 준비기계",
  "titleEn": "84.45 - Machines for preparing textile fibres; spinning, doubling, twisting or winding (including weft-winding) machines and other machinery for producing textile yarns; textile reeling or warping machines and machines for preparing textile yarns for use on the machines of heading 84.46 or 84.47.",
  "contentKo": "뒤에 언급되는 제외물품을 제외하고 이 호에는 섬유공업의 다음 공정에 사용하는 기계를 분류한다.\n(I) 방직용 섬유의 조제나 준비공정\n(II) 방적ㆍ연사(撚絲)ㆍ합사(合絲)ㆍ합연사(合撚絲) 등의 작업에 의하여 실로 가공하는 공정\n(III) 권취공정과 제8446호나 제8447호의 기계에 사용하는 방직사를 준비하는 공정\n\n(A) 방적준비기계\n(1) 풍력선별기\n(2) 조면기\n(3) 아마, 대마 등의 타개기(scutching machine)\n(4) 넝마, 폐섬유 인열기(가넷팅 기계)\n(5) 개장기(bale breaker)\n(6) 자동공급기(automatic feeder)\n(7) 고해기(beater)와 연전기(spreader)\n(8) 양모 세척기\n(9) 원모염색기\n(10) 양모, 라미 등의 침투기\n(11) 양모의 탄화기\n(12) 카드기(carding machine)\n(13) 드로우(draw)박스ㆍ길(gill)박스\n(14) 코밍기(combing machine)\n(15) 아마, 황마 등의 연전기\n(16) 역세척기(backwashing machine)\n(17) 연신기(drawing machine)와 조방기(roving machine)\n(18) 코일러(coiler)\n\n(B) 견의 합연(合撚) 전의 준비기\n(1) 누에고치 외피물 및 잔실 제거기\n(2) 누에고치 견사 풀이용 용기\n(3) 생사 마디 제거기\n\n(C) 방적기, 연사기 및 합사기\n(1) 방적기 (spinning frame)\n(2) \"토우-투-얀\"(tow-to-yarn) 기계\n(3) 연사기(twisting machine) 및 합사기(doubling machine)\n(4) 마모(horse hair) 결합기\n\n(D) 권사기(winding or reeling machine)\n보빈, 스풀, 콘 등에 실을 감는 권사기, 위사 권취기(weft winder) 등을 포함한다.\n\n(E) 제8446호나 제8447호의 기계에 사용하는 방직사를 제조하는 기계와 준비기계\n(1) 정경기(warper)\n(2) 정경호부기(warp sizing machine)\n(3) 바디에 실을 꿰는 기계\n(4) 경사연결기\n(5) 빔(beam) 감기 기계\n\n부분품과 부속품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에 해당되는 기계의 부분품과 부속품은 제8448호에 분류한다.\n\n이 호에는 다음의 것을 제외한다.\n(a) 누에고치 열처리용 기계(제8419호)\n(b) 건조기(제8419호 또는 제8451호)\n(c) 원심탈수기(제8421호)\n(d) 인조섬유 방사기 등(제8444호)\n(e) 펠트 및 부직포 제조용 기계(제8449호)\n(f) 연마용, 광내기용, 가스처리용 기계(제8451호)\n(g) 동물 털 절단 기계(제8453호)\n(h) 카드 연마기 및 코움기 빗날 가는 기계(제8460호)\n(ij) 침포 식침 기계(제8463호)\n(k) 카드 실린더 침포 장착 기계(제8479호)",
  "contentEn": "This heading covers machines used in the textile industry for preparing fibres for spinning or for use as wadding or felt; spinning, doubling, twisting or winding machines for producing textile yarns; and warping or reeling machines for preparing yarns for weaving or knitting.\n\nIt includes :\n(I) Preparatory machines (balers, openers, pickers, wool washers, carbonisers, carding machines, combing machines, draw frames, roving frames).\n(II) Silk reeling and preparing machines.\n(III) Spinning frames (ring spinning, mule spinning), tow-to-yarn machines, doublers and twisters.\n(IV) Winding and reeling machines (bobbin winders, weft winders).\n(V) Warping and sizing (slashing) machines, heald drawing-in machines, warp tying machines.\n\nParts and accessories of these machines fall in heading 84.48.\n\nThe heading excludes :\n(a) Cocoon autoclaves and dryers (heading 84.19).\n(b) Centrifugal extractors (heading 84.21).\n(c) Man-made fibre extruding, drawing or texturing machines (heading 84.44).\n(d) Felt or nonwoven manufacturing machinery (heading 84.49).\n(e) Yarn singeing, gassing or polishing machines (heading 84.51).\n(f) Card-grinding machine tools (heading 84.60).\n(g) Card-clothing mounting machines (heading 84.79)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.45 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
