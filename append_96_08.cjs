const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_96.json';

const newEntry = {
  "hsCode": "9608",
  "titleKo": "96.08 - 볼펜, 팁(tip)이 펠트로 된 것과 그 밖의 포러스팁(porous-tip)으로 된 펜과 마커, 만년필ㆍ철필(鐵筆)형 만년필(stylograph pen)과 그 밖의 펜, 복사용 철필(鐵筆), 프로펠링펜슬(propelling pencil)이나 슬라이딩펜슬(sliding pencil), 펜홀더ㆍ펜슬홀더와 이와 유사한 홀더, 이들의 부분품[캡과 클립(clip)을 포함하며 제9609호의 것은 제외한다]",
  "titleEn": "96.08 - Ball point pens; felt-tipped and other porous-tipped pens and markers; fountain pens, stylograph pens and other pens; duplicating stylos; propelling or sliding pencils; pen-holders, pencil-holders and similar holders; parts (including caps and clips) of the foregoing articles, other than those of heading 96.09.",
  "contentKo": "이 호에는 볼펜, 사인펜/마커(펠트 및 포러스 팁), 만년필, 제도/철필형 펜, 샤프펜슬(프로펠링/슬라이딩 펜슬), 홀더류 및 이들의 전용 부분품(펜촉, 볼펜 심, 클립 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 볼펜(제9608.10호) : 잉크 도포용 회전식 볼이 선단에 장착된 잉크관 내장 펜.\n- 펠트/포러스 팁 펜과 마커(제9608.20호) : 펠트 펜, 보드마카, 형광펜, 사인펜.\n- 만년필 및 철필형 만년필(stylograph pen)(제9608.30호) : 카트리지식 또는 피스톤 흡입식 만년필, 제도용 잉크 침관식 철필 펜.\n- 샤프펜슬(프로펠링/슬라이딩 펜슬)(제9608.40호) : 심 밀어내기 메카니즘이 내장된 금속/플라스틱 샤프 및 홀더 펜슬.\n- 세트 제품(제9608.50호) : 위 소호들의 제품이 2개 이상 혼합 구성된 필기구 세트.\n- 볼펜용 심(refill)(제9608.60호) : 볼포인트 팁과 잉크 저장기가 결합된 완제품 볼펜 리필 심.\n- 부분품 및 펜촉(제9608.91~99호) :\n  - 펜촉(nib) 및 닙포인트(nib point)(제9608.91호) : 스틸/백금/텅스텐 합금제 만년필 촉, 촉 선단 부착용 합금 볼포인트.\n  - 기타 부분품(제9608.99호) : 펜/연필용 축(배럴 barrel), 캡(뚜껑), 포켓 클립(clip), 샤프용 내장 추진 기구(메카니즘), 잉크 튜브/고무 주머니, 펠트제 잉크 저장통 및 마킹용 펠트 심.\n  - 펜홀더 및 펜슬홀더, 크레용 홀더, 드로잉 목탄 홀더.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 만년필 전용 교체용 액체 잉크 카트리지 (제3215호)\n(b) 볼펜 팁 제조용 단독 정밀 금속 볼 (제7326호 또는 제8482호)\n(c) 단독 제시되는 도면 설계용 제도 펜 (제9017호)\n(d) 샤프펜슬용 고체 흑연 연필심 (제9609호)" ,
  "contentEn": "This heading covers ballpoint pens, felt/porous-tipped markers, fountain pens, stylograph pens, duplicating stylos, propelling/sliding pencils (mechanical pencils), holders, and their parts (refills, nibs, caps, clips).\n\nIt includes :\n- Ball point pens (subheading 9608.10).\n- Felt-tipped and porous-tipped pens/markers (subheading 9608.20) including highlighters and board markers.\n- Fountain pens and stylograph pens (subheading 9608.30).\n- Propelling or sliding pencils (subheading 9608.40) including mechanical pencils.\n- Pen/pencil sets containing two or more types (subheading 9608.50).\n- Ballpoint refills (subheading 9608.60) containing both the ball tip and ink reservoir.\n- Nibs and nib points (subheading 9608.91) made of steel or precious metal alloys.\n- Other parts (subheading 9608.99) including barrels, caps, clips, refills, and mechanisms.\n\nExcludes replacement liquid ink cartridges (heading 32.15), precision steel balls (heading 73.26 or 84.82), mathematical drawing pens (heading 90.17), and pencil leads (heading 96.09)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 96.08 to chapter_96.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
