const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8522",
  "titleKo": "85.22 - 제8519호나 제8521호의 기기에 전용되거나 주로 사용되는 부분품과 부속품",
  "titleEn": "85.22 - Parts and accessories suitable for use solely or principally with the apparatus of headings 85.19 or 85.21.",
  "contentKo": "이 호에는 음성 녹음/재생기(제8519호) 및 영상 기록/재생기(제8521호)에 전용되거나 주로 사용되는 부분품과 부속품을 분류한다.\n\n이 호에는 다음의 부분품과 부속품을 포함한다.\n(1) 픽업 카트리지(pick-up cartridge) : 레코드 음반의 침(stylus) 진동을 전기적 신호로 변환하는 장치.\n(2) 레이저 광학식 판독장치(laser optical reading system) (CD, DVD, 블루레이용 광학 픽업 등).\n(3) 자기형 사운드헤드 (녹음, 재생, 소거용 자기헤드).\n(4) 카세트형 어댑터 : 포터블 CD 플레이어 신호를 자기 테이프 데크를 통해 재생 가능하게 해주는 팩 어댑터.\n(5) 광전식(photoelectric) 사운드헤드.\n(6) 테이프를 감거나 푸는 기기(릴 받침대 및 릴 회전장치 등).\n(7) 턴테이블용 톤암(tone-arm) 및 테이블(데크).\n(8) 축음기 바늘(styli)용으로 가공된 사파이어 및 다이아몬드 (장착 유무 불문).\n(9) 레코드 커터(record cutter) : 레코드반에 음구를 깎아 녹음하는 커팅 헤드.\n(10) 오디오/비디오 녹음기 및 재생기용으로 특별히 설계된 가구.\n(11) 자기헤드 클리닝 카세트 (세정액 동봉 여부 불문).\n(12) 자기소거 헤드, 디가우저(자기소거기), 자기침 등.\n(13) 비디오 레코더용 헤드 드럼 및 실린더 어셈블리, 테이프 진공 가압 장치, 테이프 주행 텐션 장치 등.\n\n이 호에는 다음의 것을 제외한다.\n(a) 테이프가 감겨있지 않은 빈 스풀, 릴 및 오디오/비디오 빈 카세트 (재질에 따라 제39류 또는 제15부 등 분류)\n(b) 오디오/비디오 기기용으로 전용화되어 있지 않은 구동용 전동기 (제8501호)\n(c) 기록용 매체(공매체 및 수록매체) (제8523호)\n(d) 프레임 뷰어와 결합된 동기화 테이블용 사운드헤드 장치 (제9010호)",
  "contentEn": "This heading covers parts and accessories suitable for use solely or principally with the apparatus of headings 85.19 or 85.21.\n\nIt includes :\n(1) Pick-up cartridges for converting mechanical stylus vibrations into electrical signals.\n(2) Laser optical reading systems (optical pick-ups).\n(3) Magnetic sound-heads (for recording, play-back, or erasing).\n(4) Cassette-shaped adapters (to play portable CD signals on magnetic tape decks).\n(5) Photoelectric sound-heads.\n(6) Apparatus for winding or unwinding tape (reel brackets and tables).\n(7) Tone-arms and turntables (record-decks).\n(8) Worked sapphires and diamonds for styli (mounted or unmounted).\n(9) Record cutters (cutting heads for recording on discs).\n(10) Furniture specially designed for sound/video recording or reproducing apparatus.\n(11) Head-cleaning cassettes (whether or not presented with cleaning solution).\n(12) Degaussers, demagnetisers, and magnetic erasing heads.\n(13) Video head drums and cylinders, tape-loading mechanisms, and vacuum tension systems.\n\nThe heading excludes :\n(a) Spools, reels, or empty audio/video cassettes without tape (classified by material in Chapter 39 or Section XV).\n(b) General-purpose electric motors not combined with parts of these apparatus (heading 85.01).\n(c) Recording media (heading 85.23).\n(d) Sound-heads used on synchronisation tables with frame viewers (heading 90.10)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.22 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
