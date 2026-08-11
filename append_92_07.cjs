const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9207",
  "titleKo": "92.07 - 전기적으로 음이 발생하거나 증폭되는 악기(예: 오르간ㆍ기타ㆍ아코디언)",
  "titleEn": "92.07 - Musical instruments, the sound of which is produced, or must be amplified, electrically (for example, organs, guitars, accordions).",
  "contentKo": "이 호에는 물리적인 공명 공간(울림통)이 아예 없거나 미약하여 전기식 또는 전자식 장치(발진회로, 음원 모듈, 증폭 회로 등)의 지원 없이는 연주 및 청취가 불가능한 일체의 전기/전자 악기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 건반악기(아코디언 제외)(제9207.10호) : 전자 오르간(electronic organ), 전자 피아노/디지털 피아노(digital piano), 신디사이저(synthesizer), 전자 키보드.\n- 기타 악기(제9207.90호) : 일렉트릭 기타(electric guitar, solid-body), 전자 아코디언, 전자 카리용(carillon), 전자 바이올린/첼로, 전자 드럼(drum pads 및 모듈 포함).\n\n[발생 원리 및 시스템 분류]\n- 전자(電磁)식 음향발생기 : 동기전동기와 톱니형 음륜(tone wheel)을 돌려 자석 주위의 전자기적 유도 전류 변화를 유도하는 방식(하몬드 오르간 등).\n- 정전(靜電)식 음향발생기 : 금속선(stretched wire) 또는 진동 리드를 해머로 쳐서 극판과의 정전용량(capacitor) 변화를 유도하는 방식.\n- 발진회로식(전자관/반도체) 음향발생기 : 발진기(oscillator), 가스방전관, 집적회로(IC) 칩을 통해 음원을 전자 합성하는 방식(신디사이저 등).\n- 광전식 음향발생기 : 투과 광선의 광전 변환을 이용한 방식.\n\n[주요 분류 기준]\n- 악기와 함께 결합되거나 동일 캐비닛(몸체) 내에 장착된 앰프(증폭기) 및 스피커는 악기와 함께 이 호에 분류한다. 단, 독립되어 별개로 제시되는 앰프와 확성기는 악기와 함께 사용될지라도 85류(제8518호)에 분류된다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 천공 종이 롤로 연주되는 기계식/압축공기식 자동 피아노 (제9201호)\n(b) 매 정시마다 전자식 차임벨이 울리는 기능을 갖춘 문자판식 시계 (제91류)\n(c) 단독 제시되는 전자식 악기용 음원 모듈 (제8543호)" ,
  "contentEn": "This heading covers musical instruments in which sound is produced, or must be amplified, electrically or electronically (e.g. they cannot be played to be heard normally without the electric/electronic elements).\n\nIt includes :\n- Keyboard instruments (subheading 9207.10) including electronic organs, digital pianos, synthesizers, and electronic keyboards.\n- Other instruments (subheading 9207.90) including solid-body electric guitars, electronic accordions, electronic carillons, and electronic drum pads.\n- Tone generation systems: electromagnetic (tone wheels), electrostatic, oscillator (ICs/tubes), and photoelectric.\n\nNote: Amplifiers and loudspeakers presented housed in the same cabinet as the instrument are classified here. If presented separately, they are excluded (heading 85.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.07 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
