const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8467",
  "titleKo": "84.67 - 수지식 공구(압축공기식, 유압식, 전동기를 갖추거나 비전기식 모터를 갖춘 것으로 한정한다)",
  "titleEn": "84.67 - Tools for working in the hand, pneumatic, hydraulic or with self-contained electric or non-electric motor.",
  "contentKo": "이 호에는 전동기, 압축공기 원동기(또는 피스톤), 내연기관이나 그 밖의 원동기를 갖춘 공구를 분류한다.\n이 호에는 사용 중 손으로 지지하도록 설계되거나 작업 진행 중 사용자가 손으로 올리고 움직이며 작업 중 손으로 조작, 제어할 수 있는 \"수지식 공구(tool for working in the hand)\"만을 분류한다. 삼각대나 잭레그 등 보조 지지구를 일시적으로 사용하는 것도 포함된다.\n무게, 크기가 너무 커서 손으로 사용할 수 없는 것, 베이스플레이트로 고착시키는 것, 바퀴가 달려 밀고 가는 기계 등은 제외한다.\n또한 플렉시블 축을 갖춘 분리형 원동기/공구 결합장치는 제외한다(원동기는 제8407호/제8501호, 툴홀더는 제8466호).\n\n이 호에는 다음의 것을 포함한다.\n(1) 드릴링머신ㆍ태핑머신ㆍ리이밍머신\n(2) 보링기계ㆍ착암기\n(3) 렌치ㆍ나사돌리개ㆍ너트 셋터\n(4) 설계용, 측정용, 도로 공사용 기기\n(5) 기계식 줄, 연삭기, 사포기, 연마기\n(6) 와이어브러시기\n(7) 원형톱, 체인톱 및 이와 유사한 것\n(8) 치핑 해머, 스케일 제거 해머, 리벳팅 해머 등\n(9) 압착형 리벳터, 리벳 제거기\n(10) 금속판 전단기 및 니블러\n(11) 샌드 래머, 주조용 바이브레이터\n(12) 토양 다지는 램머\n(13) 자동식 삽\n(14) 콘크리트 바이브레이터\n(15) 울타리 정리기\n(16) 스케일 제거기\n(17) 압축공기식 그리이스 피스톨\n(18) 잔디 다듬기용, 정원용 휴대식 절삭 기계\n(19) 휴대용 풀 베는 기계(portable brush-cutter)\n(20) 직물 절단기\n(21) 조각용 공구\n(22) 전기식 손가위\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 공구의 부분품(제8466호의 툴 홀더를 제외한다)도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 그라인딩 휠 및 연마용 물품(제6804호)\n(b) 제82류의 수공구\n(c) 공기압축기(제8414호)\n(d) 스프레이건 및 모래분사기(제8424호)\n(e) 잔디 깎는 기계(제8433호)\n(f) 가정용 전기기기(제8509호)\n(g) 전기면도기, 이발기(제8510호)\n(h) 의료용/치과용 수공구(제9018호)",
  "contentEn": "This heading covers tools for working in the hand, pneumatic, hydraulic or with self-contained electric or non-electric motor.\n\nIt includes :\n(I) Drills, tappers, reamers, borers, rock drills.\n(II) Wrenches, screwdrivers, nut setters.\n(III) Grinding, sanding, polishing and filing machines.\n(IV) Saws (circular saws, chain saws).\n(V) Hammers (chipping, riveting, concrete breakers).\n(VI) Shears and nibblers.\n(VII) Concrete vibrators, grass trimmers, brush-cutters, hedge trimmers.\n(VIII) Electric scissors, cloth cutters, engraving tools.\n\nParts of these tools (except tool holders of heading 84.66) are also covered.\n\nThe heading excludes :\n(a) Grinding/polishing wheels of stone or abrasive (heading 68.04).\n(b) Hand tools of Chapter 82.\n(c) Air compressors (heading 84.14).\n(d) Liquid or powder sprayers and sand-blasting machines (heading 84.24).\n(e) Lawn mowers (heading 84.33).\n(f) Electro-mechanical domestic appliances (heading 85.09).\n(g) Shavers and hair clippers (heading 85.10).\n(h) Medical or dental hand instruments (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.67 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
