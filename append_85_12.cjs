const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8512",
  "titleKo": "85.12 - 전기식 조명용이나 신호용 기구(제8539호의 물품은 제외한다)ㆍ윈드스크린와이퍼(windscreen wiper)ㆍ제상기(defroster)ㆍ제무기(demister)(자전거용이나 자동차용으로 한정한다)",
  "titleEn": "85.12 - Electrical lighting or signalling equipment (excluding articles of heading 85.39), windscreen wipers, defrosters and demisters, of a kind used for cycles or motor vehicles.",
  "contentKo": "이 호에는 자전거 및 자동차용으로 특별히 제작된 전기식 조명용/신호용 기구(전구 제외), 전기식 와이퍼, 제상기, 제무기를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 자전거용 발전기(dynamo) 및 건전지 홀더/램프.\n(2) 헤드램프(상하향향/조절식), 안개등, 스포트라이트, 경찰차 서치램프.\n(3) 측등(side), 미등(tail), 주차등, 번호판등.\n(4) 제동등(브레이크등), 방향지시등(깜빡이), 후진등.\n(5) 콤비네이션 램프 (여러 기능의 전등이 한 케이스에 든 것).\n(6) 실내등 : 천장등, 문틀등, 계기판등.\n(7) 발광 추월 신호기, 택시/경찰차용 조명표지(경광등, 라이트바), 주차감지 주의 표시 장치.\n(8) 자동차용 도난방지경보기(시각/청각 신호식).\n(9) 경음기(크랙션), 사이렌 등 전기식 음향신호 기구 및 후진 경보 버저(초음파식 후방 감지기 패키지 포함).\n(10) 속도 측정 레이더/레이저 디텍터(경보용 신호기기).\n(11) 윈드스크린 와이퍼 (전동 모터 구동식 와이퍼).\n(12) 제상기(defroster) 및 제무기(demister) : 창유리 부착용 가열 저항선 등.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 조명 및 신호용 유리 렌즈 (제7014호)\n(b) 차량용 공기조절기 (제8415호)\n(c) 마이크와 스피커를 통한 차량 내외 음향전달 증폭기 (제8518호)\n(d) 핸들 스티어링 칼럼에 부착되는 스위치 어셈블리/컨트롤 패널 (제8537호)\n(e) 실드빔 램프유닛을 포함한 전구류 (제8539호)\n(f) 배선 하네스 및 점화 케이블 세트 (제8544호)\n(g) 비전기식 온수순환형 차량 난방/제상 장치 (제7322호 또는 제8708호)",
  "contentEn": "This heading covers electrical lighting or signalling equipment (other than lamps of heading 85.39), windscreen wipers, defrosters and demisters, of a kind used for cycles or motor vehicles.\n\nIt includes :\n(1) Generators (dynamos) for cycles, battery holders and battery-operated cycle lamps.\n(2) Headlamps, fog lamps, spotlights and searchlights.\n(3) Side lamps, tail lamps, parking lamps and license plate lamps.\n(4) Braking lights, direction indicators and reversing lamps.\n(5) Combined lamp units in a single housing.\n(6) Interior lights (dome lights, dashboard lights, door lights).\n(7) Overtaking signals, taxi lightbars and rotating dome beacons.\n(8) Anti-theft alarms emitting visual or audible warnings.\n(9) Horns, sirens and backing buzzers (including ultrasonic rear parking sensor systems).\n(10) Radar/laser detector warning units.\n(11) Windscreen wipers (including dual wipers with electric motor).\n(12) Defrosters and demisters consisting of resistance wires mounted in a frame for windscreens.\n\nParts of these items are also classified here.\n\nThe heading excludes :\n(a) Glass lenses for lighting (heading 70.14).\n(b) Air conditioning units (heading 84.15).\n(c) Sound amplification systems for transmitting road noises (heading 85.18).\n(d) Steering column switch assemblies (heading 85.37).\n(e) Sealed beam lamp units and other bulbs (heading 85.39).\n(f) Insulated wiring harnesses and cables (heading 85.44).\n(g) Non-electric hot-water radiator heating/defrosting apparatus (heading 73.22 or 87.08)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.12 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
