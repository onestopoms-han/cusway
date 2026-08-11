const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9031",
  "titleKo": "90.31 - 그 밖의 측정용이나 검사용 기기(이 류에 따로 분류되지 않은 것으로 한정한다)와 윤곽 투영기(+)",
  "titleEn": "90.31 - Measuring or checking instruments, appliances and machines, not specified or included elsewhere in this Chapter; profile projectors.",
  "contentKo": "이 호에는 90류 타 호에 구체적으로 열거되지 않은 모든 비파괴/물리/광학/기계식 측정 및 검사 장비(웨이퍼 광학 검사기, 균형 시험기, 모터 테스트벤치, 좌표측정기, 표면 조도계, 비파괴 결함 탐상기, 윤곽투영기 등)와 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 균형시험기(balancing machine)(제9031.10호) : 회전자(rotor), 크랭크샤프트, 휠 등의 정적/동적/전자식 균형 상태 측정기(불균형 보정 천공기 일체형 포함).\n- 테스트벤치(test bench)(제9031.20호) : 엔진, 모터, 발전기, 펌프의 성능 시험용 거치대 프레임 및 계측 제어 설비.\n- 광학식 측정/검사기기(제9031.41~49호) :\n  - 반도체/포토마스크 검사용 광학식 기기(제9031.41호) : 반도체 웨이퍼 결함 및 집적회로(IC)의 미세 선폭/이물질 광학 검사기, 포토마스크/레티클 패턴 결함 광학 검사기.\n  - 기타 광학식 기기(제9031.49호) :\n    - 광학식 비교측정기(comparator) 및 측정 벤치(bench)(대형 부품, 기어 톱니 윤곽용).\n    - 광파간섭계(interferometer, 표면 평탄도 측정용), 광학식 표면 조도 검사기.\n    - 얼라인먼트 망원경(alignment telescope, 진직도 검사용), 광학식 자(rule).\n    - 광학식 각도측정기(goniometer), 각도 게이지, 안경 렌즈 도수측정기(focimeter).\n- 그 밖의 측정/검사 기기(제9031.80호) :\n  - 다차원 좌표측정기(CMMs : Co-ordinate Measuring Machines).\n  - 기하학적 치수 측정을 위한 다이얼 게이지, 하이트 게이지, 사인바(sine bar).\n  - 기포 수준기(spirit level, 빌딩공사용 수준기 포함), 정밀 블록 수준기, 경사계(clinometer), 다림줄(plumb-line).\n  - 구면계(spherometer, 렌즈 곡률 반경 측정용), 렌즈 심출기(opticians' centring machine).\n  - 면적계(planimeter, 지도/가죽 단면적 적산기), 하중 시험용 다이나모미터 및 로드셀(load cell).\n  - 표면 조도계(surface finish tester, 다이아몬드 스타일러스 접촉식 및 압전식).\n  - 기어 시험기(기어 치형 피치 간격 측정기), 초음파 두께 측정기(단면 밀착식).\n  - 비파괴 결함/크랙 탐상기(금속 바/튜브 내부 균열 초음파 탐상기, 와전류 결함 검사기).\n  - 정밀 기계식/전자식 시계 부품 시험기(헤어스프링 시험기, 시계 오차 측정기).\n  - 전기식 응력/변형 측정기(스트레인 게이지 브리지 회로 계측기, 압전 소자식 응력계).\n  - 섬유 물성 측정기 : 실 타래 권취 릴(grading reel), 실 꼬임수 측정 연수계(torsiometer), 연진동 기록계, 장력계(tensiometer).\n  - 윤곽투영기(profile projector) : 부품 단면 실루엣을 스크린에 확대 투영해 기하학 치수 및 치형을 검사하는 장비.\n- 부분품과 부속품(제9031.90호) : CMM용 터치 프로브 헤드, 면적계용 추적 암, 수준기 부속 마운트.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 공작기계에 일체로 결합되어 가공 툴/가공물을 단순히 정렬 분할하는 광학식 분할대(dividing head) (제8466호)\n(b) 돋보기, 망원경, 잠망경, 단독 렌즈 (제9001호, 제9002호, 제9005호 또는 제9013호)\n(c) 토지/수로/해양 측량용 경위의(theodolite), 알코올 수준기 (제9015호)\n(d) 손에 쥐고 사용하는 마이크로미터, 캘리퍼스 및 조정식 한계 게이지 (제9017호)\n(e) 기계적 물성(경도, 인장, 피로, 충격) 단독 파괴 시험기 (제9024호)\n(f) 순수 전기 파라미터(전류, 전압, 회로 저항) 및 통신 선로 감쇠 측정기 (제9030호)\n(g) 유량계, 압력계, 진공계, 액면계 (제9026호) 및 자동 온도/압력 제어조절기(서모스탯 등) (제9032호)\n(h) 단순 스트레인 게이지 저항기(센서 칩 단독 제시 시) (제8533호)" ,
  "contentEn": "This heading covers all measuring or checking instruments, appliances, and machines not specified or included elsewhere in Chapter 90 (both optical and non-optical), as well as profile projectors.\n\nIt includes :\n- Balancing machines (subheading 9031.10) for balancing mechanical rotors, shafts, flywheels, or wheels (static or dynamic types).\n- Test benches (subheading 9031.20) for checking engines, pumps, or motors.\n- Optical checking instruments (subheadings 9031.41 to 9031.49) including semiconductor wafer/IC optical inspection systems, photomask/reticle inspection tools (9031.41), optical comparators, interferometers (flatness checking), optical surface testers, alignment telescopes, and focimeters (9031.49).\n- Other measuring and checking instruments (subheading 9031.80) including Coordinate Measuring Machines (CMMs), dial indicators, sine bars, spirit levels (for builders/masons), clinometers, spherometers, planimeters, load cells, surface finish testers (stylus-type), ultrasonic flaw/crack detectors, strain-gauge measuring units, and yarn torsion counters.\n- Profile projectors which project magnified silhouettes of mechanical parts (screws, gears) on a screen for dimensional checks.\n- Parts and accessories (subheading 9031.90).\n\nExcludes optical dividing heads for machine tools (heading 84.66), land surveying levels/theodolites (heading 90.15), hand-held micrometers/callipers (heading 90.17), mechanical property testers (hardness, tensile) (heading 90.24), and electrical ohmmeters or logic analysers (heading 90.30)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.31 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
