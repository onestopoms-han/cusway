const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8457",
  "titleKo": "84.57 - 금속 가공용 머시닝센터(machining centre)ㆍ유닛 컨스트럭션 머신(unit construction machine)(싱글스테이션)ㆍ멀티스테이션(multi-station)의 트랜스퍼머신(transfer machine)",
  "titleEn": "84.57 - Machining centres, unit construction machines (single station) and multi-station transfer machines, for working metal.",
  "contentKo": "이 호는 다음 중 어느 방법으로 단일가공물에 여러 가지 형태의 기계가공작업을 행할 수 있는 금속가공용 공작기계(선반과 터닝센터 제외)에만 적용한다 (이 류의 주 제4호 참조).\n\n(A) 머시닝센터(machining centre)\n머시닝 프로그램에 따라 매거진 등으로부터 공구를 자동적으로 교환하여 여러 가지 기계가공작업을 수행하는 단일체의 다기능 기계이다.\n공구 자동 교환 기능이 없는 복합기(드릴/보어/밀 등) 및 다축 밀링머신 등은 제8459호부터 제8461호까지에 분류한다.\n\n(B) 유닛 컨스트럭션 머신(unit construction machine)[싱글스테이션]\n가공물을 고정시켜 놓고 2개 이상의 유닛 헤드(unit head)가 가공물에 작동하여 2가지 이상의 가공 작업을 수행하는 기계이다. 유닛 헤드란 공구를 장착하고 회전, 전진, 후퇴 작동을 하는 헤드를 말한다.\n\n(C) 멀티스테이션(multi-station)의 트랜스퍼머신(transfer machine)\n여러 가지 기계가공작업을 수행하며, 가공물이 여러 개의 유닛 헤드 사이로 자동 이송되는 기계이다. 회전형 트랜스퍼머신과 선형 트랜스퍼머신으로 구분된다.\n컨베이어로 기계들을 단순 연결한 트랜스퍼 라인(transfer line)이나 수치제어식 복합 설비인 유연생산체계(FMS)는 이 호에서 제외된다.\n\n부분품과 부속품\n부분품 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 공작기계의 부분품과 부속품(제82류의 공구는 제외)은 제8466호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 레이저, 초음파, 방전 등 특수 물리공정 가공기 및 워터제트 절단기(제8456호)\n(b) 금속절삭용 선반 및 터닝센터(제8458호)\n(c) 웨이타입(way-type) 유닛 헤드 머신(제8459호)\n(d) 땜질용/용접용 기기(제8468호, 제8515호)",
  "contentEn": "This heading applies only to machine-tools for working metal (other than lathes and turning centres) which can carry out different types of machining operations.\n\nIt includes :\n(I) Machining centres (machining under a program with automatic tool changer (ATC) from a magazine).\n(II) Unit construction machines (single station) (performing operations by moving several unit heads automatically against a fixed workpiece).\n(III) Multi-station transfer machines (automatically transferring the workpiece to different unit heads in sequence, e.g., rotary or linear transfer machines).\n\nParts and accessories of these machines (excluding tools of Chapter 82) fall in heading 84.66.\n\nThe heading excludes :\n(a) Machine-tools of heading 84.56.\n(b) Lathes and turning centres (heading 84.58).\n(c) Way-type unit head machines (heading 84.59).\n(d) Soldering or welding machines (heading 84.68 or 85.15).\n(e) Flexible manufacturing systems (FMS) consisting of distinct machines controlled by a computer."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.57 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
