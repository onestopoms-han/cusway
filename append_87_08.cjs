const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8708",
  "titleKo": "87.08 - 부분품과 부속품(제8701호부터 제8705호까지의 차량용으로 한정한다)",
  "titleEn": "87.08 - Parts and accessories of the motor vehicles of headings 87.01 to 87.05.",
  "contentKo": "이 호에는 제8701호부터 제8705호까지의 자동차에 전용되거나 주로 사용되는 부분품과 부속품(제17부 주규정에서 제외하지 않은 것)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 범퍼(완충기) 및 그 부분품(제8708.10호).\n(2) 차체의 기타 부분품 및 부속품(제8708.21~29호) : 안전벨트, 전후방 및 측면 창문(윈도우 글라스), 도어, 보닛(후드), 발판, 펜더, 흙받이, 계기판(대시보드), 라디에이터 그릴(덮개), 수동식 히터 및 제상기, 플라스틱/금속제 내부 매트 등.\n(3) 제동장치(브레이크) 및 그 부분품(제8708.30호) : 브레이크 슈, 디스크, 드럼, 캘리퍼, 마스터 실린더, 서보 브레이크 등.\n(4) 기어박스(변속기) 및 그 부분품(제8708.40호) : 자동/수동 변속기, 토크컨버터, 변속기 케이싱, 기어 어셈블리.\n(5) 구동 차축(드라이브 액슬, 차동기어 내장형) 및 비구동 차축, 그 부분품(제8708.50호) : 액슬 하우징, 디퍼렌셜 기어, 스터브 액슬(stub-axle), 허브 등.\n(6) 로드 휠 및 그 부분품/부속품(제8708.70호) : 휠 림(rim), 디스크, 스포크, 휠 캡 등.\n(7) 현가장치(서스펜션 시스템) 및 그 부분품(제8708.80호) : 쇼크업소버(shock-absorber), 토션바, 컨트롤 암 등 (단, 스프링은 제외).\n(8) 기타 장비 및 부분품(제8708.91~99호) :\n  - 방열기(라디에이터) 및 그 부분품(제8708.91호).\n  - 소음기(머플러), 배기관(머플러 파이프) 및 그 부분품(제8708.92호).\n  - 클러치 및 그 부분품(제8708.93호).\n  - 운전대(스티어링 휠), 스티어링 칼럼, 조향 기어박스 및 그 부분품(제8708.94호).\n  - 안전 에어백 및 팽창 시스템(인플레이터)(제8708.95호) (단, 원격 센서 및 전자 제어 유닛 ECU는 제외).\n  - 미조립 섀시 프레임(엔진 없는 것), 변속 드라이브 샤프트, 유니버설 조인트, 페달류(액셀, 브레이크, 클러치), 엔드 피팅이 결합된 조종 케이블(액셀/브레이크 케이블) 등(제8708.99호).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 엔진 전용 부분품(제8409호) 및 크랭크축, 캠축, 플라이휠(제8483호)\n(b) 유압식/공기압식 실린더(제8412호)\n(c) 유리제 창문으로서 테두리 틀(윈도우 채널)이 없는 것 (제7007호)\n(d) 고무제 호스, 벨트 및 타이어 (제40류)\n(e) 전원 공급용 배터리(축전지) (제8507호)\n(f) 에어백 작동 제어용 전자 센서 및 제어반 (제8537호 또는 제9031호)",
  "contentEn": "This heading covers parts and accessories of the motor vehicles of headings 87.01 to 87.05, provided they are suitable for use solely or principally with those vehicles and are not excluded by Section XVII Notes.\n\nIt includes :\n- Bumpers and parts thereof (subheading 8708.10).\n- Body parts and accessories (subheadings 8708.21 to 8708.29) including safety belts, windows (with heating elements), doors, bonnets, wings, dashboards, radiators grills, and floor mats (other than textile or rubber).\n- Brake gear and parts (subheading 8708.30) like shoes, discs, drums, and cylinders.\n- Gear boxes and parts (subheading 8708.40) including torque converters and casings.\n- Drive axles with differentials, non-drive axles, and parts (subheading 8708.50).\n- Road wheels and parts (subheading 8708.70) like rims, discs, and hub-caps.\n- Suspension shock-absorbers and other suspension parts (excluding springs) (subheading 8708.80).\n- Radiators, silencers (mufflers), exhaust pipes, clutches, steering wheels, columns, steering boxes, and safety airbags with inflater systems (subheadings 8708.91 to 8708.95).\n- Chassis-frames without engines (subheading 8708.99).\n\nExcludes engine parts (heading 84.09), crankshafts/flywheels (heading 84.83), hydraulic cylinders (heading 84.12), and electronic control units/sensors (Chapter 85 or 90)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.08 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
