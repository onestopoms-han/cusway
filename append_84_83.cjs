const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8483",
  "titleKo": "84.83 - 전동축[캠샤프트(cam shaft)와 크랭크샤프트(crank shaft)를 포함한다], 크랭크(crank), 베어링하우징(bearing housing)과 플레인 샤프트베어링(plain shaft bearing), 기어(gear)와 기어링(gearing), 볼이나 롤러 스크루(roller screw), 기어박스(gear box), 그 밖의 변속기[토크컨버터(torque converter)를 포함한다], 플라이휠(flywheel)과 풀리(pulley)[풀리블록(pulley block)을 포함한다], 클러치(clutch)와 샤프트커플링(shaft coupling)[유니버설조인트(universal joint)를 포함한다]",
  "titleEn": "84.83 - Transmission shafts (including cam shafts and crank shafts) and cranks; bearing housings and plain shaft bearings; gears and gearing; ball or roller screws; gear boxes and other speed changers, including torque converters; flywheels and pulleys, including pulley blocks; clutches and shaft couplings (including universal joints).",
  "contentKo": "이 호에는 외부 원동력이나 동일 기계 내부의 여러 부분으로 동력을 전달하는 기계식 전동장치 및 그 구성품을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n(A) 전동축 및 크랭크\n(1) 원동기 구동 주축, 구동축 및 중간축(counter shaft).\n(2) 연결축(articulated shaft) 및 플렉시블 샤프트(flexible shaft) (수공구, 적산회전계 전달용 등).\n(3) 크랭크(crank)와 크랭크샤프트(crank shaft) (왕복운동을 회전운동으로 변환).\n(4) 캠샤프트(cam shaft) 및 편심축.\n\n(B) 베어링하우징 및 플레인 샤프트베어링\n(1) 베어링하우징 (볼, 롤러, 니들 베어링 내장용 프레임/블록, 베어링 장착 제시품 포함, 단 베어링 단독은 제8482호).\n(2) 플레인 샤프트베어링(plain shaft bearing) : 하우징 없이 제시되는 감마성 금속/플라스틱 링 또는 슬리브 베어링.\n\n(C) 기어와 기어링 (마찰기어 및 체인스프로켓 포함)\n스퍼기어, 베벨기어, 웜기어, 랙과 피니언 등 모든 톱니바퀴 조립품. 회전 구동력을 전달하는 마찰기어 디스크/실린더 포함.\n\n(D) 볼 스크루 및 롤러 스크루 (회전운동을 선운동으로 변환하는 나선형 축과 너트).\n\n(E) 기어박스와 변속기 (토크컨버터 포함)\n(1) 수동/자동 기어박스.\n(2) 마찰 원판식/원추식 변속 무단변속기.\n(3) 유압식 토크 컨버터 및 유체연결구 (유체커플링).\n\n(F) 플라이휠(flywheel) : 관성에 의해 회전 속도를 일정하게 유지하는 무거운 휠.\n\n(G) 풀리 및 풀리블록 (벨트/로프 회전 전동용 풀리, 아이들러 휠, 프리풀리 포함, 단 호이스트 세트는 제8425호).\n\n(H) 클러치(clutch) : 마찰 클러치, 도그 클러치, 원심 클러치, 공압/액체 클러치 등 (전자기식 제8505호 제외).\n\n(IJ) 샤프트커플링 및 유니버설조인트 (카르단 조인트, 플랜지 커플링, 올드햄 커플링 등).\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계 부분품도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 전동장치로서 차량이나 항공기 전용/원칙적 사용 목적으로 설계된 것(제17부, 예: 자동차용 구동 프로펠러축, 기어박스, 디퍼렌셜 기어는 제8708호 분류). 단, 엔진(기관) 내부 부분품(크랭크샤프트, 캠샤프트 등)은 차량용이라도 이 호에 해당한다.\n(b) 탄소/흑연 베어링 (제6815호)\n(c) 시계용 부분품 (제9114호)",
  "contentEn": "This heading covers transmission shafts and cranks, bearing housings and plain shaft bearings, gears and gearing, ball or roller screws, gear boxes and speed changers, flywheels and pulleys, clutches and shaft couplings.\n\nIt includes :\n(I) Transmission shafts, counter shafts, flexible shafts, crank shafts, cam shafts.\n(II) Bearing housings (with or without ball/roller bearings) and plain shaft bearings (bushings).\n(III) Gears and gearing (bevel, worm, spur, rack and pinion, friction gears, chain sprockets).\n(IV) Ball or roller screws.\n(V) Gear boxes, speed changers, fluid couplings and hydraulic torque converters.\n(VI) Flywheels and pulleys (including idler pulleys, pulley blocks).\n(VII) Clutches (friction, centrifugal, hydraulic clutches) and shaft couplings (Cardan joints, universal joints, flexible couplings).\n\nParts of these items are also covered.\n\nThe heading excludes :\n(a) Transmission components (e.g., gearboxes, drive shafts, differentials) specialized for vehicles or aircraft (Section XVII, heading 87.08 etc.). However, internal engine parts (crankshafts, camshafts) remain in this heading.\n(b) Carbon or graphite plain bearings (heading 68.15).\n(c) Clock parts (heading 91.14)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.83 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
