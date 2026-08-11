const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9202",
  "titleKo": "92.02 - 그 밖의 현악기(예: 기타ㆍ바이올린ㆍ하프)",
  "titleEn": "92.02 - Other string musical instruments (for example, guitars, violins, harps).",
  "contentKo": "이 호에는 제9201호의 건반 악기를 제외한 어쿠스틱 현악기로서, 활을 사용하거나 튕기거나 쳐서 현을 진동시켜 소리를 내는 악기를 분류한다. 전기식 사운드 픽업 및 증폭기를 부착했더라도 사운드박스 울림통이 있어서 전기 없이 연주 가능하면 본 호에 분류된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 활을 사용하는 것(제9202.10호) : 활(bow)을 비벼서 소리를 내는 찰현악기. 바이올린(violin), 비올라(viola), 비올론첼로(첼로, violoncello), 콘트라베이스(더블베이스, double bass), 비올(viol).\n- 기타(제9202.90호) :\n  - 발현악기(퉁기는 현악기) : 기타(guitar)(어쿠스틱, 세미어쿠스틱 기타 포함), 하프(harp), 만도린(mandolin), 밴조(banjo), 우쿨렐레(ukulele), 치터(zither), 발랄라이카(balalaika), 류트(lute).\n  - 타현악기 및 기타 현악기 : 에올리언 하프(aeolian harp, 자연풍 구동식), 침발로(czimbalo, 솜 해머로 타격 연주).\n\n[활과 채 등의 동반 분류]\n- 이 호의 악기와 함께 제시되며 적정 수량 범위 내에서 악기와 함께 사용되는 활(궁), 피크(채) 등은 주 제2호 규정에 따라 악기 본체와 함께 본 호로 일괄 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 울림통(사운드박스)이 없거나 공명 공간이 없이 순수 전기/전자적으로 신호를 생성하여 증폭해야만 소리가 나는 일렉트릭 기타 및 전자식 하프 (제9207호)" ,
  "contentEn": "This heading covers acoustic stringed instruments other than keyboard stringed instruments of heading 92.01, played with a bow, plucked, or struck. Instruments fitted with electronic pickups or amplifiers remain here as long as they retain a sound-box and can be played conventionally.\n\nIt includes :\n- Stringed instruments played with a bow (subheading 9202.10) including violins, violas, cellos (violoncellos), and double basses.\n- Other stringed instruments (subheading 9202.90) including plucked instruments (guitars, harps, mandolins, banjos, ukuleles, zithers) and struck instruments (czimbalos).\n- Bows, sticks, and plectrums presented in normal numbers with the instruments.\n\nExcludes solid-body electric guitars without a conventional sound-box (heading 92.07)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.02 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
