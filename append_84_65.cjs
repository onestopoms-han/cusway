const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8465",
  "titleKo": "84.65 - 목재ㆍ코르크ㆍ뼈ㆍ경질 고무ㆍ경질 플라스틱이나 이와 유사한 경질물의 가공용 공작기계(네일용ㆍ스테이플용ㆍ접착용과 그 밖의 조립용 기계를 포함한다)",
  "titleEn": "84.65 - Machine-tools (including machines for nailing, stapling, glueing or otherwise assembling) for working wood, cork, bone, hard rubber, hard plastics or similar hard materials.",
  "contentKo": "이 호에는 목재(나무로 만든 재료)ㆍ코르크ㆍ뼈ㆍ경질 고무ㆍ경질 플라스틱이나 이와 유사한 경질물을 성형하거나 표면 가공(절단ㆍ성형과 조립을 포함한다)하는 공작기계를 포함한다.\n가공이 개시될 당시에 경질 재료의 특성을 갖지 않는 연질 재료 가공기(제8477호) 및 가루/알갱이 가공 성형기(제8477호, 제8479호) 등은 제외한다.\n장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수공구와 구별된다.\n\n(A) 특정 산업용으로 특수화하지 않는 기계\n(1) 톱 기계 (틀톱, 원목 띠톱, 원형톱 등)\n(2) 플레이닝머신(planing machine)\n(3) 몰딩용 및 밀링용 기계 (장부 형성기, 모방기 등)\n(4) 머시닝센터 (ATC를 갖춘 CNC 다기능 복합 공작기계)\n(5) 연삭기ㆍ샌딩머신ㆍ광택기\n(6) 굽힘기 (bending machine)\n(7) 조립기계 (합판용 프레스, 못/스테이플 결합기 등)\n(8) 드릴링머신 (drilling machine)\n(9) 모티싱머신 (morticing machine) (끌, 모티스 체인 등 이용)\n(10) 스플리팅기ㆍ스탬핑머신ㆍ프레그멘팅머신ㆍ박피기와 슬라이싱기 (목재 치핑기 등)\n(11) 선반 (lathe) (모방 선반 포함)\n(12) 탈지기 및 bucking 머신\n(13) 목재용 박피기 (통나무 박피기 등)\n공구의 교환 없이 다목적 작업을 할 수 있는 복합기 및 다목적 기계도 포함한다.\n\n(B) 특정 공업용으로 특수화된 가공기계\n(1) 통제조기\n(2) 연필제조 공업용 기계\n(3) 철도 침목 보링/천공기\n(4) 목조 및 조각기\n(5) 목분(wood flour) 그라인딩 머신\n(6) 상자, 크레이트용 못질/조립 기계\n(7) 목제 단추 제조기\n(8) 나막신, 목제 구두창 제조기\n(9) 버드나무 가지, 케인 가공기\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계 부분품과 부속품(제82류의 공구는 제외한다)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 대나무파쇄기 및 통나무 분쇄기(제8439호)\n(b) 물리공정 가공기 (제8456호)\n(c) 수지식 공구(제8467호)\n(d) 반도체 패키지 리드 세척기(제8486호)",
  "contentEn": "This heading covers machine-tools (including machines for nailing, stapling, glueing or otherwise assembling) for working wood, cork, bone, hard rubber, hard plastics or similar hard materials.\n\nIt includes :\n(I) Non-specialized machine-tools (sawing machines, planing machines, Tenoning/milling/moulding machines, Machining centres, grinding/sanding/polishing machines, bending machines, assembling machines, drills, morticing machines, splitting/slicing/chipping machines, lathes).\n(II) Specialized machines for specific industries (cooperage/barrel-making, pencil manufacturing, wooden button-making, clog-making, box-nailing machines).\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Defibrators and wood-chipping machines for papermaking (heading 84.39).\n(b) Machine-tools of heading 84.56.\n(c) Tools for working in the hand (heading 84.67).\n(d) Sintering or molding machines for wood waste/fibres (heading 84.79).\n(e) Machinery for cutting soft plastics or unvulcanised rubber (heading 84.77)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.65 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
