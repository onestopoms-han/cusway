const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9205",
  "titleKo": "92.05 - 관악기(예: 키보드 파이프 오르간ㆍ아코디언ㆍ클라리넷ㆍ트럼펫ㆍ백파이프)[페어그라운드 오르간(fairground organ)과 메커니컬 스트리트 오르간(mechanical street organ)은 제외한다]",
  "titleEn": "92.05 - Wind musical instruments (for example, keyboard pipe organs, accordions, clarinets, trumpets, bagpipes), other than fairground organs and mechanical street organs.",
  "contentKo": "이 호에는 공기(호흡 또는 바람통)를 불어넣어 기둥 모양의 공기를 진동시키거나 리드(reed)를 떨게 하여 소리를 내는 관악기를 분류한다. 단, 자동으로 구동되는 거리 오르간 등은 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 금관악기(brass-wind)(제9205.10호) : 놋쇠, 은 등 금속제로 된 테이퍼관형 관악기(밸브 또는 슬라이드식 구동). 트럼펫(trumpet), 코넷(cornet), 트롬본(trombone), 프랑스 혼(French horn), 튜바(tuba), 색스혼, 수자폰, 뷰글.\n- 기타 관악기(제9205.90호) :\n  - 파이프 오르간(pipe organ) : 건반과 금속/나무 파이프, 송풍 장치로 구성된 오르간(콘솔 및 장식 케이스가 본체와 함께 제시되면 포함).\n  - 하모늄(harmonium, 리드 오르간), 아코디언(accordion), 콘서티나(concertina), 반도네온(bandoneon).\n  - 구금(하모니카, mouth organ).\n  - 목관악기 : 플루트(flute), 리코더(recorder), 오보에(oboe), 클라리넷(clarinet), 바순(bassoon), 색소폰(saxophone), 사뤼소폰.\n  - 오카리나(ocarina), 슬라이딩 휘슬, 백파이프(bagpipe), Breton pipe, musette.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 놀이동산용 페어그라운드 오르간, 스트리트 오르간, 건반이 없고 자동으로 구동되는 자동 오르간 및 오케스트리온 (제9208호)\n(b) 순수 전자식 오르간 및 전자 아코디언 (제9207호)\n(c) 단독 제시되는 파이프 오르간용 콘솔 및 장식용 케이스 (제9209호)" ,
  "contentEn": "This heading covers wind musical instruments, where sound is produced by blowing or utilizing bellows, except for automated street organs of heading 92.08.\n\nIt includes :\n- Brass-wind instruments (subheading 9205.10) including trumpets, cornets, trombones, French horns, tubas, and sousaphones.\n- Other wind instruments (subheading 9205.90) including keyboard pipe organs, harmoniums (without pipes), accordions (concertinas, bandoneons), mouth organs (harmonicas), wood-wind instruments (flutes, recorders, oboes, clarinets, bassoons, saxophones), ocarinas, and bagpipes.\n\nExcludes electronic organs/accordions (heading 92.07), and automatic fairground/street organs without keyboards (heading 92.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.05 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
