const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8518",
  "titleKo": "85.18 - 마이크로폰과 그 스탠드, 확성기[인클로저(enclosure)에 장착된 것인지에 상관없다], 헤드폰과 이어폰(마이크로폰이 부착된 것인지에 상관없다), 마이크로폰과 한 개 이상의 확성기로 구성된 세트, 가청주파 증폭기, 음향 증폭세트",
  "titleEn": "85.18 - Microphones and stands therefor; loudspeakers, whether or not mounted in their enclosures; headphones and earphones, whether or not combined with a microphone, and sets consisting of a microphone and one or more loudspeakers; audio-frequency electric amplifiers; electric sound amplifier sets.",
  "contentKo": "이 호에는 마이크로폰, 확성기, 헤드폰, 이어폰, 가청주파 증폭기 및 음향 증폭세트를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 마이크로폰과 그 스탠드\n- 탄소형, 압전형(악기용 콘택트 픽업 포함), 가동코일/리본형(다이내믹), 정전용량형(콘덴서형), 열선형 마이크로폰.\n- 무선 마이크로폰 세트 (송신기형 마이크로폰 + 무선 수신기 패키지).\n- 마이크로폰용 스탠드, 현가 장치 (단독 제시품 포함).\n\n(B) 확성기(Loudspeaker)\n- 전기 신호를 공기 진동으로 변환 재생하는 스피커 (가동철편형, 가동코일형, 압전형(수정), 정전형(콘덴서형) 스피커).\n- 인클로저(통, 상자)에 장착된 단일형/복합형 스피커 (임피던스 정합용 변압기/증폭기 내장형 포함).\n- PC 등 자동자료처리 기계용 스피커.\n- 확성기를 수용하도록 특별히 설계된 전용 섀시, 인클로저(통) 단독 제시품.\n\n(C) 헤드폰, 이어폰, 마이크로폰/스피커 세트\n- 유선/무선 헤드폰 및 이어폰 (마이크 부착 핸즈프리 헤드셋 포함).\n- 전화교환원용 헤드셋, 항공용 넥/스롯(목) 마이크 장착 헤드셋.\n- 비의료용 태아검진 음향 청취 기기.\n\n(D) 가청주파 증폭기\n- 음성 주파수 대역의 전기 신호를 증폭하는 오디오 앰프(증폭기) (트랜지스터식, IC식, 진공관식 포함).\n- 사전증폭기(프리앰프), 전화선 중계용 증폭기, 계측용 가청주파 증폭기.\n\n(E) 음향 증폭세트 (PA 시스템)\n- 마이크 + 가청주파 증폭기 + 스피커가 결합된 확성 장치 시스템 (공공 행사장, 순찰차, 대형 트럭용 등).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품(진동판, 음성코일 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 마이크/헤드폰이 내장된 비행사용 헬멧/모자 (제6506호)\n(b) 고주파/중간주파 증폭기 및 오디오 믹서, 이퀄라이저 (제8543호)\n(c) 마이크로폰/수화기가 내장된 완전한 전화기 (제8517호)\n(d) 무선통신 위성 (제8802호)\n(e) 반도체 기반 트랜스듀서(MEMS 마이크 센서 단독 칩 등) (제8541호)\n(f) 보청기 (제9021호)\n(g) 의료진단용 전자진단기기 (제9018호)\n(h) 삼각대, 모노포드, 바이포드 (제9620호)",
  "contentEn": "This heading covers microphones, loudspeakers, headphones, earphones, audio-frequency electric amplifiers, and electric sound amplifier sets.\n\nIt includes :\n(I) Microphones and stands :\n- Carbon, piezo-electric, moving coil/ribbon (dynamic), electrostatic (condenser), and hot-wire microphones.\n- Wireless microphone sets (incorporating a transmitter microphone and a receiver).\n- Stands or mounting devices specially designed for holding microphones.\n(II) Loudspeakers :\n- Moving iron, moving coil, piezo-electric (crystal), and electrostatic (condenser) speakers.\n- Speakers mounted in enclosures (including those with built-in matching transformers or amplifiers).\n- Speakers designed for connection to automatic data processing machines.\n- Enclosures and cabinets specially designed for mounting loudspeakers.\n(III) Headphones and earphones :\n- Telephone/telegraph headphones, headsets for aviation, operator headsets with microphones.\n- Combined sets of a microphone and one or more loudspeakers.\n- Non-medical fetal listening apparatus.\n(IV) Audio-frequency electric amplifiers :\n- Audio amplifiers (valve, transistor, or IC based), including pre-amplifiers, telephone line repeaters, and measurement amplifiers.\n(V) Electric sound amplifier sets :\n- Portables or systems comprising a microphone, an amplifier, and a loudspeaker (e.g. public address systems, police car or truck alert systems).\n\nParts of these articles are also classified here.\n\nThe heading excludes :\n(a) Aviators' helmets with built-in headphones/microphones (heading 65.06).\n(b) Telephone sets (heading 85.17).\n(c) High- or intermediate-frequency amplifiers, audio mixers, and equalizers (heading 85.43).\n(d) Semiconductor-based transducers (e.g., MEMS microphone sensors) (heading 85.41).\n(e) Hearing aids (heading 90.21).\n(f) Medical electro-diagnostic apparatus (heading 90.18).\n(g) Monopods, bipods, tripods (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.18 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
