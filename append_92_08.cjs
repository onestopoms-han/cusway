const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_92.json';

const newEntry = {
  "hsCode": "9208",
  "titleKo": "92.08 - 뮤지컬박스ㆍ페어그라운드 오르간(fairground organ)ㆍ메커니컬 스트리트 오르간(mechanical street organ)ㆍ기계식 자명조(singing bird)ㆍ뮤지컬소(musical saw)와 그 밖의 악기로서 이 류의 다른 호에 해당하지 않는 것, 각종 데코이 콜(decoy call), 휘슬ㆍ호각과 그 밖의 입으로 불어서 나는 소리로 신호하는 기구",
  "titleEn": "92.08 - Musical boxes, fairground organs, mechanical street organs, mechanical singing birds, musical saws and other musical instruments not falling within any other heading of this Chapter; decoy calls of all kinds; whistles, call horns and other mouth-blown sound signalling instruments.",
  "contentKo": "이 호에는 악기(9201~9207호) 중 타 호에 구체적으로 분류되지 않은 오르골(뮤지컬박스), 놀이동산용 페어그라운드 오르간, 기계식 가로수 오르간, 기계식 지저귀는 새(자명조), 입으로 소리 내는 신호용 휘슬, 동물 소리를 흉내 내는 사냥용 데코이 콜 등을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 뮤지컬박스(오르골)(제9208.10호) : 핀이 박힌 회전 실린더 또는 금속 디스크가 금속 빗(comb)의 살을 건드려 소리를 내는 스프링(태엽) 구동식 자동 연주 장치.\n- 기타(제9208.90호) :\n  - 페어그라운드 오르간(유원지용 대형 자동 오르간, 오케스트리언 등), 천공 롤이나 카드로 구동되는 자동 오르간.\n  - 가로/거리 오르간(street organ) : 핸들을 돌려 가시 실린더로 파이프 밸브를 구동시키는 기계식 오르간.\n  - 기계식 자명조(singing bird) : 새장 모양 안에 태엽식 풀무와 모형 새를 결합하여 새 우는 소리와 움직임을 재현한 장치.\n  - 뮤지컬소(musical saw) : 톱날을 활이나 고무 해머로 쳐서 진동음을 내는 특수 톱 악기.\n  - 신호용 휘슬(호각), 스포츠 심판용 호각, 경찰 휘슬, 기차 조작원용 호각.\n  - 데코이 콜(decoy call) : 사냥 시 조류나 동물을 유인하기 위해 입으로 불거나 손으로 가죽을 조작하여 동물의 울음소리를 흉내 내는 소형 도구.\n  - 완구용 입 사이렌 및 딸랑이.\n\n[주요 분류 기준]\n- 오르골 또는 전자 음악 모듈이 결합되어 있어도 본질적인 특성이 실용적이거나 일반 장식용인 물품(예: 오르골 내장 벽시계, 장난감, 쥬얼리 상자, 음악 카드 등)은 해당 기능별 호에 분류한다. (스프링 구동식 오르골 단독 및 오르골 기능 본질품만 이 호에 분류)\n- 동반 제시되는 자동 연주용 천공 롤, 카드 및 디스크는 악기와 함께 포장되어 있어도 제9209호로 별도 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 자전거용 벨, 일반 탁상 벨, 도어벨 등 일반 하드웨어 종 및 차임 (제8306호 또는 제8531호)\n(b) 고무 벌브로 누르는 차량용 크랙션(경적), 선박용 고정 사이렌 (제16부 또는 제17부)\n(c) 일반 차량용 전기식 경음기 및 신호기 (제8512호 또는 제8531호)" ,
  "contentEn": "This heading covers musical instruments not specified elsewhere in Chapter 92 (such as musical boxes, fairground organs, mechanical street organs, mechanical singing birds, and musical saws), as well as decoy calls, whistles, and mouth-blown sound signalling devices.\n\nIt includes :\n- Musical boxes (subheading 9208.10) incorporating pinned cylinders or metal discs striking steel combs.\n- Other (subheading 9208.90) including fairground organs (orchestrions), street organs (barrel organs), mechanical singing birds in cages, musical saws, mouth-blown whistles (police/referee whistles), and decoy calls for hunting.\n\nExcludes functional articles with built-in musical mechanisms (e.g. musical clocks, jewelry boxes, greeting cards) which are classified under their respective headings. Also excludes bicycle bells (heading 83.06) and car horns (heading 85.12)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 92.08 to chapter_92.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
