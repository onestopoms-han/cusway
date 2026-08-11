const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9106",
  "titleKo": "91.06 - 시각을 기록하는 기기와 시계의 무브먼트(movement)나 동기(同期) 전동기를 갖춘 것으로서 시간을 측정ㆍ기록하거나 알리는 기기[예: 타임레지스터(time-register)ㆍ타임레코더(time-recorder)]",
  "titleEn": "91.06 - Time of day recording apparatus and apparatus for measuring, registering or otherwise indicating intervals of time, with clock or watch movement or with synchronous motor (for example, time-registers, time-recorders).",
  "contentKo": "이 호에는 시계용 무브먼트(watch/clock movement) 또는 감속 기어를 결합한 동기전동기(synchronous motor)로 작동되는 기기 중에서, 특정 동작/이벤트가 일어난 시각을 인쇄/기록하는 기기와 전기 회로 제어가 아닌 방식으로 시간 경과를 기록/측정/지시하는 특수 시간계측장비를 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n- 타임레지스터와 타임레코더(제9106.10호) : 공장 출퇴근 기록용 타임카드 스탬프(타임레지스터), 문서/편지 등에 접수 일시를 찍어주는 자동 스탬프(타임레코더).\n- 기타 기기(제9106.90호) :\n  - 휴대용 순찰시계(watchmen's tell-tale) : 순찰지에 비치된 전용 키로 회전 기록지에 타공/스탬프하여 순찰기록을 남기는 시계.\n  - 전서구(비둘기 경주)용 기록시계(pigeon-timer) : 경주 비둘기가 귀소한 시간을 내부 링과 종이테이프에 프린트/타공하여 증명하는 기록기.\n  - 주전원(mains) 주파수 제어용 표준 시계(master frequency control instrument).\n  - 스포츠용 경기 측정용 경기장 타이머, 테이블형 타이머 및 스포트 타임레코더(수정 발진식으로 1/100초 단위를 종이테이프에 프린트하는 것 포함).\n  - 단시간 계량 스톱클록(stop-clock), 통화 요금 계산용 전화 타이머.\n  - 간이 요리용 공정 타이머(process timer) : 0~60분 한계 설정 후 벨이 울리는 주방용 벨 타이머(단, 스위치 켜고 끄는 타임스위치는 제9107호).\n  - 당구장 경기시간 및 요금 계산용 빌리어드 미터(클록 무브먼트가 달린 것), 체스 경기용 체스 클록(chess-clock).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전동기나 무브먼트 없이 단순 콘덴서 충방전 방식으로 측정하는 전자식 타이머 (제9031호)\n(b) 시간을 일정 주기로 끊어서 소리를 내는 음악용 메트로놈 (제9209호)\n(c) 시계용 문자판이 내장된 기상/물리 기록용 기기(자기온도계, 지진계, 가스/수도 계량기, 만보계, 속도계 등) (해당 물리량 측정 호 - 제9015호, 제9025호, 제9028호, 제9029호)\n(d) 손목형/회중형 크로노그래프 시계 및 일반 스톱워치 (제9101호 또는 제9102호)" ,
  "contentEn": "This heading covers time of day recording apparatus and time interval registering or indicating instruments operated by a clock/watch movement or a synchronous motor, other than the control switches of heading 91.07.\n\nIt includes :\n- Time-registers and time-recorders (subheading 9106.10) such as employee card time-clocks and document time-stamping devices.\n- Other devices (subheading 9106.90) including watchmen’s tell-tales (clocks), pigeon-timers, master frequency controllers, sports photo-finish recorders, stop-clocks, telephone call timers, chess clocks, and kitchen process timers (bell-ringing type).\n\nExcludes pure electronic timers without clock movements or synchronous motors (heading 90.31), metronomes (heading 92.09), and hand stop-watches/chronographs (heading 91.01 or 91.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.06 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
