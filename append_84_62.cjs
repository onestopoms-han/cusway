const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8462",
  "titleKo": "84.62 - 단조(鍛造)용ㆍ해머링(hammering)용ㆍ형(型)단조용(압연기는 제외한다) 금속가공 공작기계(프레스를 포함한다), 굽힘용ㆍ접음용ㆍ교정용ㆍ펼침용ㆍ전단용ㆍ펀칭용ㆍ낫칭(notching)용ㆍ니블링(nibbling)용[드로우벤치(draw-benches)를 제외한다] 금속가공 공작기계[프레스ㆍ슬리팅(slitting) 설비ㆍ일정한 길이로 절단하는 설비(cut-to-length line)를 포함한다]와 그 외의 가공방법에 의한 금속이나 금속탄화물 가공용 프레스",
  "titleEn": "84.62 - Machine-tools (including presses) for working metal by forging, hammering or die forging (excluding rolling mills); machine-tools (including presses, slitting lines and cut-to-length lines) for working metal by bending, folding, straightening, flattening, shearing, punching, notching or nibbling (excluding drawbenches); presses for working metal or metal carbides, not specified above.",
  "contentKo": "이 호에는 금속이나 금속 탄화물의 모양을 변화시켜 가공하는 것으로 이 호 본문에 기재된 특정 공작기계를 포함한다.\n장착용 프레임, 스탠드 등이 갖추어져 있어 제8205호 및 제8467호의 수공구와 구별된다.\n\n이 호에는 다음의 것을 포함한다.\n1. 단조용ㆍ형(型)단조용 열간 성형기(프레스를 포함한다)와 열간 해머\n(a) 밀폐식 형 단조기 (closed die forging machine)\n(b) 개방식 형 단조기 (open die forging machine)\n(c) 해머, 낙하 단조 장치와 드롭해머\n(d) 금속 가공 프레스 (범용 프레스 제8479호 제외)\n\n2. 평판 제품용 굽힘기ㆍ접음기ㆍ교정기ㆍ펼침기(프레스 브레이크를 포함한다)\n(a) 프로파일 성형기 (profile forming machine)\n(b) 수치제어식 프레스 브레이크\n(c) 수치제어식 패널 굽힘기\n(d) 수치제어식 롤 성형기\n(e) 접음기 (folding machine)\n(f) 교정기 및 펼침기\n\n3. 평판제품용 슬리팅 설비ㆍ일정 길이 절단용 설비ㆍ그 밖의 전단기\n(a) 슬리팅(slitting) 설비 (코일 풀기용, 편평기, 슬리터, 코일 감기용 기계 포함)\n(b) 일정한 길이로 절단하는 설비(cut-to-length line)\n(c) 전단기 (shearing machine) (기요틴 전단기, 회전식 전단기 등)\n\n4. 평판제품용 펀칭기ㆍ낫칭기(notching machine)ㆍ니블링기(nibbling machine)\n(a) 펀칭기 및 니블링기\n(b) 낫칭기\n\n5. 관ㆍ파이프ㆍ중공(中空) 형강ㆍ봉(bar) 가공용 기계(프레스 제외)\n굽힘기, 접음기, 끝 마무리기, 교정기 등을 포함한다.\n\n6. 냉간 금속가공용 프레스\n(a) 액압식(유압식) 프레스\n(b) 기계식 프레스\n(c) 서보프레스 (servo-press)\n(d) 압출 프레스 (extruding press)\n(e) 금속 스크랩 압축 베일러 프레스\n\n부분품과 부속품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계 부분품과 부속품(제82류의 공구는 제외)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 수공구(제8205호)\n(b) 압연기(제8455호)\n(c) 머시닝센터, 트랜스퍼머신(제8457호)\n(d) 수지식 공구(제8467호)\n(e) 주소판 스탬핑기(제8472호)\n(f) 선철 파괴기 및 스크랩 파괴용 스탬핑 밀(제8479호)\n(g) 반도체 리드 가공용 공작기계(제8486호)\n(h) 시험용 기기(제9024호)",
  "contentEn": "This heading covers machine-tools (including presses) for working metal by forging, hammering or die forging, or by bending, folding, straightening, flattening, shearing, punching, notching or nibbling. It also covers presses for working metal or metal carbides.\n\nIt includes :\n(I) Forging machines (closed die forging, open die forging machines, drop hammers, forging presses).\n(II) Bending, folding, straightening or flattening machines (profile forming machines, NC press brakes, NC panel benders, NC roll forming machines, levelers).\n(III) Slitting lines, cut-to-length lines and shearing machines (guillotine shears, rotary shears).\n(IV) Punching, notching and nibbling machines.\n(V) Tube, pipe, hollow section and bar working machines.\n(VI) Cold metal working presses (hydraulic presses, mechanical presses, servo-presses, extrusion presses).\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Hand tools (heading 82.05).\n(b) Rolling mills (heading 84.55).\n(c) Machining centres, unit construction machines and transfer machines (heading 84.57).\n(d) Hand-held tools (heading 84.67).\n(e) General purpose presses (heading 84.79).\n(f) Semiconductor lead bending or straightening machines (heading 84.86).\n(g) Testing machines (heading 90.24)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.62 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
