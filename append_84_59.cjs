const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8459",
  "titleKo": "84.59 - 금속 절삭가공용 공작기계[웨이타입(way-type) 유닛헤드머신(unit head machine)을 포함한다]로서 드릴링(drilling)ㆍ보링(boring)ㆍ밀링(milling)ㆍ나선가공ㆍ태핑(tapping)에 사용되는 것[제8458호의 선반(터닝센터를 포함한다)은 제외한다](+)",
  "titleEn": "84.59 - Machine-tools (including way-type unit head machines) for drilling, boring, milling, threading or tapping by removing metal, other than lathes (including turning centres) of heading 84.58.",
  "contentKo": "이 호에는 금속을 절삭가공하는 것으로 드릴링(drilling)ㆍ보링(boring)ㆍ밀링(milling)ㆍ나선가공(threading)ㆍ태핑(tapping)용의 공작기계를 포함한다 [제8458호의 선반(lathe)과 터닝센터(turning centre)는 제외한다].\n베이스플레이트, 장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수공구와 구별된다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 웨이타입(way-type) 유닛헤드머신(unit head machine)\n(2) 드릴링머신(drilling machine) : 방사형, 멀티 스핀들 드릴링머신 등을 포함한다.\n(3) 보링머신(boring machine) : 기존 구멍의 내면을 마무리가공하는 기계이다. 수직형/수평형 보링머신, 복합 스핀들 보러 등을 포함한다.\n(4) 밀링머신(milling machine) : 회전식 커터로 표면이나 윤곽을 가공하는 기계이다. 무릎형(knee-type) 밀링머신, 만능밀링 머신, 모방 밀링머신 등을 포함한다.\n(5) 태핑머신(tapping machine) 및 나선가공기계(threading machine) (볼트, 스크루 나사 가공용 등)\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계의 부분품과 부속품(제82류의 공구를 제외한다)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 레이저, 초음파, 방전 등 물리공정 가공기 및 워터제트 절단기(제8456호)\n(b) 머시닝센터, 트랜스퍼머신(제8457호)\n(c) 금속절삭용 선반과 터닝센터(제8458호)\n(d) 플레이닝(planing) 등 기타 절삭 공작기계(제8461호)\n(e) 수지가공용 공구(제8467호)\n(f) 재료 시험용 기기(제9024호)\n\n[소호해설]\n소호 제8459.21호 등\n수치제어식(CNC/NC)에 대해서는 제8458호 소호해설을 참조한다.\n소호 제8459.51호와 제8459.59호\n수직으로 움직이는 콘솔(console, knee)을 갖추어 횡방향 작동 작업테이블을 지지하는 밀링머신을 분류한다.",
  "contentEn": "This heading covers machine-tools (including way-type unit head machines) for drilling, boring, milling, threading or tapping by removing metal, other than lathes (including turning centres) of heading 84.58.\n\nIt includes :\n(I) Way-type unit head machines.\n(II) Drilling machines (radial drills, multi-spindle drills).\n(III) Boring machines (horizontal/vertical boring mills, jig borers).\n(IV) Milling machines (knee-type, universal, copy-milling, profile-milling).\n(V) Threading or tapping machines.\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Machine-tools of heading 84.56.\n(b) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(c) Lathes and turning centres (heading 84.58).\n(d) Planing, shaping, slotting or gear-cutting machine tools (heading 84.61).\n(e) Hand tools of heading 84.67.\n(f) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.59 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
