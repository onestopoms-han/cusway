const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9209",
  "titleKo": "92.09 - 악기의 부분품(예: 뮤지컬박스용 메카니즘)과 부속품(예: 기계식 악기용 카드ㆍ디스크ㆍ롤), 박절기(metronom)ㆍ소리굽쇠, 각종 조율관(調律管)",
  "titleEn": "92.09 - Parts (for example, mechanisms for musical boxes) and accessories (for example, cards, discs and rolls for mechanical instruments) of musical instruments; metronomes, tuning forks and pitch pipes of all kinds.",
  "contentKo": "이 호에는 악기(9201~9208호)에 전용되는 각종 부분품과 부속품(악기 현, 오르골용 무브먼트, 피아노/현악기/관악기/타악기/전자악기의 부분품 및 자동연주 카드/롤 등)을 분류하며, 악기 연주 및 조율에 사용되는 메트로놈(박절기), 소리굽쇠, 피치파이프(조율관)도 함께 포함한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 메트로놈, 소리굽쇠, 조율관(제9209.30호 전 단계 또는 기타 부분) : 기계식/전기식 템포 지시기(메트로놈, 산업용 포함), U자형 U-금속봉(소리굽쇠, 의료용/청력검사용 포함), 입으로 부는 조율 파이프(조율관).\n- 악기용 현(제9209.30호) : 피아노, 하프, 바이올린용 장선(catgut, 양의 창자), 견(실크)선, 나일론선, 단일 금속선(스테인리스강, 알루미늄 등), 금속선을 감은 코일선(metal-wound strings)(단, 악기 현 규격이 아닌 미가공 코일/실은 제외).\n- 기타 악기의 부분품 및 부속품(제9209.91~99호) :\n  - 피아노의 부분품/부속품(제9209.91호) : 조립된 피아노 건반(keyboard), 댐퍼/해머가 결합된 키 액션(key-action), 피아노 목제 케이스, 향판(sound-board), 주철 프레임, 조율핀(wrest pin), 피아노 페달.\n  - 제9202호 어쿠스틱 현악기의 부분품/부속품(제9209.92호) : 기타/만도린의 바디(울림통), 줄감개/웜기어 장치, 바이올린/첼로의 목(neck), 지판(fingerboard), 브릿지(bridge), 줄걸이판(tailpiece), 조율용 펙(peg), 바이올린 활(bow) 및 활대의 말꼬리 털(horsehair), 피크(plectra), 약음기(mute), 턱받침.\n  - 제9207호 전기/전자악기의 부분품/부속품(제9209.94호) : 전자 오르간/신디사이저용 건반, 페달보드, 오르간용 톤 휠(tone wheel), 전자 악기용 특수 연산 회로판.\n  - 기타 악기의 부분품/부속품(제9209.99호) :\n    - 오르골(뮤지컬박스)용 메카니즘(무브먼트) : 핀이 박힌 실린더/디스크 및 스프링 모터, 빗 모양 금속판(comb) 조립체.\n    - 관악기(목관/금관)의 부분품 : 목재관 몸통, 마우스피스(오보에, 색소폰용 리드 포함), 밸브 피스톤, 패드(pad), 백파이프용 가죽 바람 자루.\n    - 타악기의 부분품 : 북채(drumsticks, 맬릿 mallet, 드럼 브러쉬), 타격 페달, 심벌용 홀더 브래킷, 원형으로 미리 재단된 드럼용 북가죽(skins).\n    - 자동 연주 장치용 카드, 디스크, 롤(roll) : 악기와 함께 제시되더라도 항상 본 호로 별도 분류함.\n    - 악기에 직접 부착하여 사용하는 악보 지지대 및 악기 전용 스탠드(단, 삼각대/일각대 등은 제외).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 악기 케이스용 범용 경첩, 손잡이, 금속 마운트 및 피아노 힌지 (제15부 또는 제39류)\n(b) 악기용 조율 공구 (스패너, 렌치 등) (제8205호)\n(c) 단독 제시되는 앰프, 스피커 (제8518호) 및 오르골 구동용 단독 태엽 모터 (제8412호)\n(d) 피아노 연주용 의자 (제9401호) 및 악기 부착용이 아닌 지상 거치식 악보 보면대 (제9403호)" ,
  "contentEn": "This heading covers parts and accessories for musical instruments (other than general hardware screws/hinges of Section XV), and tuning devices like metronomes, tuning forks, and pitch pipes.\n\nIt includes :\n- Metronomes (mechanical/electronic), tuning forks (including medical/hearing test forks), and pitch pipes.\n- Mechanisms for musical boxes (pin cylinders/combs).\n- Musical instrument strings (subheading 9209.30) made of catgut, silk, nylon monofilament, or metal-wound wire.\n- Parts for pianos (subheading 9209.91) including keyboards, key-actions, hammers, soundboards, and iron frames.\n- Parts for string instruments of heading 92.02 (subheading 9209.92) including mandolin/guitar bodies, pegs, fingerboards, bridges, tailpieces, bows, and horsehair for bows.\n- Parts for electronic instruments of heading 92.07 (subheading 9209.94) including tone wheels and electronic keyboards.\n- Other parts (subheading 9209.99) including mouthpieces/reeds for woodwinds/brasswinds, drumsticks/mallets, drum skins, and music rolls/discs.\n\nExcludes separate amplifiers/loudspeakers (heading 85.18), tuning tools (heading 82.05), piano stools (heading 94.01), and floor-standing music desks (heading 94.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.09 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
