const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9504",
  "titleKo": "95.04 - 비디오게임 콘솔과 비디오게임기, 테이블게임용구나 실내게임용구(핀테이블용구ㆍ당구용구ㆍ카지노게임용 특수테이블ㆍ자동식 볼링용구를 포함한다), 코인ㆍ은행권ㆍ은행카드ㆍ토큰과 그 밖의 지급수단으로 작동되는 오락용 기계(+)",
  "titleEn": "95.04 - Video game consoles and machines, table or parlour games, including pintables, billiards, special tables for casino games and automatic bowling alley equipment; amusement machines operated by coins, banknotes, bank cards, tokens or by any other means of payment (+).",
  "contentKo": "이 호에는 가정용 비디오 게임기(콘솔), 모니터 일체형 게임기, 테이블 및 실내 보드게임용구(당구, 카지노 테이블, 체스, 다트, 바둑 등), 상업용 오락실 게임기(코인/토큰 등 지불식 작동 기계) 및 자동식 볼링장 설비를 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n- 당구용구 및 부속품(제9504.20호) : 당구대(다리 유무 불문), 당구공, 당구큐(cue), 큐 거치대, 당구초크, 슬라이드식 채점판(수동식).\n- 지불식 상업용 게임기(제9504.30호) : 코인, 지폐, 카드, 토큰으로 작동하는 아케이드 오락실 게임기(인형 뽑기 기계, 핀볼 pintable, 사격 연습 기계 등, 단 자동 볼링장용구는 제외).\n- 오락용 카드(제9504.40호) : 트럼프 카드(포커/브릿지용), 타로 카드, 화투, 보드게임용 카드.\n- 비디오게임 콘솔과 비디오게임기(제9504.50호) : 텔레비전/모니터 등 외부 스크린 연결식 비디오게임 콘솔(플레이스테이션, 엑스박스, 닌텐도 스위치 독 등) 및 자체 액정을 갖춘 휴대용 게임기(단, 9504.30호의 유료 상업용은 제외)와 전용 주변기기(게임 패드, 조이스틱, 레이싱 휠, 게임 전용 롬 카트리지).\n- 기타(제9504.90호) :\n  - 바둑, 체스, 서양장기(checker), 도미노, 마작, 핼머, 부루마블(ludo) 등 보드게임용 판 및 말.\n  - 카지노용 특수 테이블(룰렛 테이블, 모형 경마판) 및 카지노용 딜러 칩, 레이크(갈퀴).\n  - 자동식 볼링장 설비(볼링 핀 정렬기 핀세터 pinsetter, 기계식/전기식 핀 회수장치).\n  - 탁상용 미니 축구 게임기(테이블 사커).\n  - 슬롯 레이싱 트랙 세트(슬롯카 조립 트랙 세트).\n  - 다트판 및 다트(darts)핀.\n  - 주사위(dice), 주사위 컵(상자), 게임용 칩 계수기.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전용 비디오게임기용이 아닌 범용 PC 컴퓨터 주변기기(마우스, 키보드, 하드웨어 스토리지 등) (제16부)\n(b) 단순 게임 소프트웨어가 내장되어 기록된 일반 광학디스크, CD-ROM, SD카드 (제8523호)\n(c) 복권, 스크래치 인쇄 티켓, 경품 추첨권 (제4911호)\n(d) 보드게임 그림이 인쇄되어 있으나 서랍이나 스탠드가 없는 일반 가구식 가판대/테이블 (제9403호)\n(e) 게임용 음향 시스템 및 진동 모터가 결합된 게이밍 의자 (제9401호)\n(f) 어린이 교육용 퍼즐 및 지능 발달용 직소 퍼즐 (제9503호)" ,
  "contentEn": "This heading covers video game consoles and machines (including portables), table or parlour games (billiards, board games, chess, darts), special tables for casinos (roulette), automatic bowling alley equipment, and coin- or token-operated amusement arcade machines.\n\nIt includes :\n- Billiards and accessories (subheading 9504.20) including tables, cues, balls, and chalks.\n- Coin/token-operated amusement machines (subheading 9504.30) including claw machines and pinball tables.\n- Playing cards (subheading 9504.40) including poker, tarot, and board game cards.\n- Video game consoles and machines (subheading 9504.50) for external screen connection or self-contained screen types, and dedicated controllers (gamepads, steering wheels, game cartridges).\n- Others (subheading 9504.90) including board games (chess, dominoes, mah-jong), casino tables, automatic pinsetters for bowling, darts, and slot-racing car sets.\n\nExcludes general PC peripherals (mice, keyboards) (Section XVI), game software optical discs (heading 85.23), lottery tickets (heading 49.11), gaming chairs with speakers (heading 94.01), and puzzles (heading 95.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.04 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
