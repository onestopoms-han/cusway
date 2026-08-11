const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8705",
  "titleKo": "87.05 - 특수용도차량(주로 사람이나 화물 수송용으로 설계된 것은 제외한다)[예: 구난차(breakdown lorry)ㆍ기중기차(crane lorry)ㆍ소방차ㆍ콘크리트믹서 운반차ㆍ도로청소차ㆍ살포차ㆍ이동공작차ㆍ이동방사선차](+)",
  "titleEn": "87.05 - Special purpose motor vehicles, other than those principally designed for the transport of persons or goods (for example, breakdown lorries, crane lorries, fire fighting vehicles, concrete-mixer lorries, road sweeper lorries, spraying lorries, mobile workshops, mobile radiological units).",
  "contentKo": "이 호에는 사람이나 화물의 수송 목적이 아닌, 특정한 작업/작동 기능을 수행하도록 특수 설계/개조되고 여러 가지 작업 장비(크레인, 시추기, 믹서, 펌프 등)를 탑재한 차량을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 기중기차(crane lorry)(제8705.10호) : 섀시 위에 회전 기중기(크레인)가 고정 탑재된 차량 (화물적재용 자동적재크레인 장착 트럭 제외).\n- 이동식 시추용 데릭차(제8705.20호) : 석유/지하수 시추용 데릭, 윈치가 탑재된 차량.\n- 소방차(제8705.30호) : 모터 펌프, 사다리, 물탱크, 거품소화액 탱크 등이 소방 전용으로 내장된 차량.\n- 콘크리트믹서 운반차(제8705.40호) : 콘크리트 믹싱 드럼(믹서)이 고정 장착되어 운송 중 혼합을 할 수 있는 차량 (레미콘 트럭).\n- 기타 특수용도차 (소호 제8705.90호) :\n  - 구난차(breakdown lorry) : 전복 차량 인양용 크레인/윈치를 갖춘 레커차.\n  - 도로청소차, 살수차, 정화조 분뇨 흡입 및 슬러지 크리너 청소차.\n  - 전동식 회전날개 및 터빈이 일체형으로 고정 내장된 자주식 제설차(snow-plough/snow-blower).\n  - 타르 살포차 및 농업용 액상 비료 살포차.\n  - 사다리차, 가로등 정비용 고소작업차, 방송 촬영용 돌리 플랫폼차.\n  - 이동식 비상 발전차, 이동식 써치라이트 조명차.\n  - 이동식 방사선 차량, 진료차(치과, 외과 수술실 등 의료 설비 탑재차).\n  - 방송 중계차, 이동 무선 송수신차, 레이더 관측차.\n  - 이동식 공작차(workshop) : 기계/용접기/발전기/공구 세트가 완비된 작업 밴.\n  - 이동은행, 이동도서관, 이동 전시장(쇼룸) 차량.\n  - 이동식 제빵차, 이동 밥차(야외 주방차).\n\n[작업기계 탑재 차량과 자주식 기계의 분류 기준]\n- 실제 자동차용 섀시(주행용 전용 엔진, 변속기어, 핸들, 운전석 포함) 위에 작업 기계를 조립/볼트 결합한 것은 이 호에 분류한다.\n- 반면 크레인/굴착기의 조종실 내부에 주행용 제어기 장치가 통합되어 있고 주 기계의 엔진 동력을 기동용으로도 혼용하여 주행하는 차륜식/무한궤도식 자주식 작업기계(예: 자주식 크레인, 휠 로더 등)는 이 호에서 제외하여 제8426호, 제8429호, 제8430호에 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 자주식 로드롤러 (제8429호)\n(b) 농업용 흙다짐 롤러 (제8432호)\n(c) 캠핑용 모터홈 (제8703호)\n(d) 범용 차량에 교환식으로 임시 장착되는 제설 삽 블레이드 등 (제8430호)" ,
  "contentEn": "This heading covers motor vehicles specially constructed or adapted, and equipped with various devices, to perform non-transport functions (where the transport of persons or goods is not the primary purpose).\n\nIt includes :\n- Crane lorries (subheading 8705.10) with a rotating crane permanently mounted on a motor vehicle chassis.\n- Mobile drilling derricks (subheading 8705.20) for oil, gas, or water well drilling.\n- Fire fighting vehicles (subheading 8705.30) with pumps, ladders, or foam equipment.\n- Concrete-mixer lorries (subheading 8705.40) fitted with a mixing drum (transit mixers).\n- Breakdown lorries (wrecker cars) with cranes or winches, road sweepers, and vacuum tank trucks.\n- Self-propelled snow-ploughs and snow-blowers with built-in blades/turbines.\n- Mobile workshops, mobile generator vehicles, searchlight lorries, and broadcasting/television vehicles.\n- Mobile clinics, radiological vans, mobile banks, libraries, and showrooms.\n\nDistinction between Special Purpose Vehicles (87.05) and Self-Propelled Machinery (Chapter 84) :\n- Vehicles built on a complete, conventional motor vehicle chassis (with road engine, cab, steering) fall here.\n- Machines where the propelling controls are located inside the crane/excavator cab and driven by the crane engine (e.g. mobile crane/excavator on wheels/tracks) fall under heading 84.26, 84.29 or 84.30."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.05 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
