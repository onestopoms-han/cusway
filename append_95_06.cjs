const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_95.json';

const newEntry = {
  "hsCode": "9506",
  "titleKo": "95.06 - 일반적으로 육체적 운동ㆍ체조ㆍ육상ㆍ그 밖의 운동에 사용하는 물품(탁구용품을 포함한다), 옥외게임용품(이 류에 따로 분류되지 않은 것으로 한정한다), 수영장용품과 패들링풀(paddling pool)용품",
  "titleEn": "95.06 - Articles and equipment for general physical exercise, gymnastics, athletics, other sports (including table-tennis) or outdoor games, not specified or included elsewhere in this Chapter; swimming pools and paddling pools.",
  "contentKo": "이 호에는 체조, 육상, 헬스, 설상/수상 스포츠, 골프, 라켓 스포츠(테니스, 배드민턴 등), 구기 종목(축구, 농구 등), 야외 게임 및 아웃도어 비전동 놀이기구, 수영장/패들링풀용품과 운동용 보호장구류를 분류한다. 단, 비전동식 탈것(봅슬레이 등)은 이 호에 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 설상 스키 및 관련 용품(제9506.11~19호) : 스키 판(11호), 스키 바인딩(파스닝)(12호), 스키폴, 스키 브레이크(19호).\n- 수상 스포츠 용품(제9506.21~29호) : 윈드서핑용 세일보드(21호), 수상스키, 서프보드, 잠수용 오리발(갈퀴), 스노클(호흡용 마스크/튜브).\n- 골프용품(제9506.31~39호) : 완제품 골프채(드라이버, 아이언 등 완제품)(31호), 골프공(32호), 골프 티(tee), 골프채 부분품(헤드, 샤프트)(39호).\n- 탁구용구(제9506.40호) : 탁구대(다리 유무 불문), 탁구 라켓(패들), 탁구공, 탁구 네트 세트.\n- 테니스/배드민턴 라켓(제9506.51~59호) : 론테니스 라켓(스트링 매여진 여부 불문)(51호), 배드민턴/스쿼시 라켓(59호).\n- 각종 운동용 공(골프/탁구 제외)(제9506.61~69호) : 테니스공(61호), 축구공/농구공/배구공/럭비공 등 공기주입식 공(및 가죽 커버/튜브)(62호), 크리켓공, 야구공, 수구용 공(69호).\n- 스케이트류(제9506.70호) : 아이스스케이트, 롤러스케이트(인라인스케이트 포함), 스케이트 날이 부착된 전용 부츠.\n- 헬스/체조/육상용품(제9506.91호) : 철봉, 평행봉, 평균대, 안마, 아령, 바벨, 메디신볼, 손잡이식 점프볼, 실내 로잉머신, 헬스용 실내 자전거, 완력기(chest expander), 줄넘기, 육상용 스타팅블록, 허들, 도약대, 투창, 원반, 포환, 권투용/레슬링용 링, 샌드백(펀칭백).\n- 기타 스포츠 및 야외 놀이용구(제9506.99호) :\n  - 어린이 놀이터용 미끄럼틀, 그네, 시소, 정글짐.\n  - 펜싱 용구 : 펜싱검(에페/플뢰레/사브르), 보호 마스크, 가슴 보호대.\n  - 하키 스틱, 야구 배트, 크리켓 배트, 아이스하키용 퍽(puck), 컬링 스톤.\n  - 양궁용 활, 화살, 표적판.\n  - 운동용 정강이/무릎 보호대, 크리켓 패드, 정강이받이, 패드가 내장된 아이스하키용 팬츠.\n  - 조립식 조립형 수영장(패들링 풀, 조립식 가정용 풀장).\n  - 부메랑, 스케이트보드, 라켓 프레스, 눈썰매/봅슬레이(비전동식), 클레이 사격용 원반 및 방출기.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 테니스/배드민턴 라켓용 줄(스트링) 단독 제시품 (제39류, 제4206호 또는 제11부)\n(b) 스포츠 백(골프백, 라켓 백 등) (제4202호)\n(c) 스포츠용 가죽 장갑 및 헬스용 반장갑 (제4203호)\n(d) 펜싱복, 골키퍼 유니폼 등 패드가 대어져 있어도 실용적인 의복류 (제61류 또는 제62류)\n(e) 전동식 모터가 장착된 스노모빌, 수상 제트스키, 봅슬레이 (제17부)\n(f) 카누, 카약, 스키프 등 수상 선박 (제89류) 및 스쿠버다이빙용 산소통/압축공기통 호흡기 (제9020호)\n(g) 스포츠/잠수용 고글, 보호 안경 (제9004호)\n(h) 자동식 볼링장 설비 및 당구용 큐 랙(가구) (제9504호 또는 제9403호)\n(ij) 유원지 및 테마파크용 파도풀, 워터 슬라이드 등 상업적 순환식 물놀이 테마 장치 (제9508호)" ,
  "contentEn": "This heading covers articles and equipment for general physical exercise, gymnastics, athletics, outdoor sports, swimming/paddling pools, and sports protective gear.\n\nIt includes :\n- Snow ski equipment (subheadings 9506.11 to 9506.19) including skis, bindings, and poles.\n- Water sports equipment (subheadings 9506.21 to 9506.29) including sailboards, surfboards, water skis, snorkels, and swim fins.\n- Golf equipment (subheadings 9506.31 to 9506.39) including clubs (completed), balls, and tees.\n- Table-tennis equipment (subheading 9506.40) including tables, paddles, balls, and nets.\n- Tennis or badminton rackets (subheadings 9506.51 to 9506.59) and balls (subheadings 9506.61 to 9506.69).\n- Ice/roller skates (subheading 9506.70) including inline skates and boots with skates attached.\n- Gymnastics/athletics gear (subheading 9506.91) including bars, vaults, dumbbells, rowing machines, and punching bags.\n- Others (subheading 9506.99) including playground swings/slides, archery bows/arrows, fencing foils/masks, shin guards, pad-integrated hockey pants, portable pools, and non-motorized bobsleighs.\n\nExcludes racket strings (Chapter 39/Section XI), golf/racket bags (heading 42.02), sports gloves (heading 42.03), sports apparel (Chapter 61/62), jet-skis (Chapter 89), diving oxygen tanks (heading 90.20), and commercial theme-park wave pools (heading 95.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 95.06 to chapter_95.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
