const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8704",
  "titleKo": "87.04 - 화물자동차(+)",
  "titleEn": "87.04 - Motor vehicles for the transport of goods.",
  "contentKo": "이 호에는 화물 수송용으로 설계된 모든 트럭, 밴, 덤프차, 기타 화물자동차(수륙양용차 포함)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 일반 화물자동차 : 평판 트럭, 윙바디, 탑차, 밴(van), 이삿짐 운반차, 경사식(덤프식) 로리.\n- 탱크로리(액체/가스 수송용 탱커, 펌프 부착 여부 무관).\n- 냉장/냉동/보온 탑차 및 특수 벌크 화물차(석탄, 모래, 벽돌 수송용).\n- 미방화 콘크리트 수송차 (레미콘 트럭, 단 믹싱 장치가 내장된 제8705호의 콘크리트믹서 차량 제외).\n- 폐기물 수집차(쓰레기 압착차 등).\n- 비고속도로용(off-highway) 덤프트럭 (소호 제8703.10호) : 터널, 광산, 토목 현장 전용의 강력 강판 적재함 및 특수 타이어 장착 차량 (현가장치 없음).\n- 셔틀카(shuttle car) : 광산 갱내 벌크 이송용 컨베이어 탑재 저상 차량.\n- 화물 수송용 경량 삼륜차 (자동차식 핸들/후진기어/차동기어를 갖춘 삼륜트럭).\n- 윈치/크레인이 내장되었으나 수송이 본래 목적인 자동 적재식 트럭.\n- 도로-궤도 양용 화물트럭 (철도 레일용 가이드 보기 휠이 장착되어 잭으로 들릴 수 있는 것).\n- 엔진과 운전대가 조립된 상태의 화물차용 섀시(chassis).\n\n[화물자동차 분류 기준 (제8703호와의 대비)]\n- 뒷좌석 구역에 안전벨트 및 고정 앵커 포인트가 없는 벤치형 좌석이 있으며, 화물 공간 확보를 위해 접히거나 분리 가능할 것.\n- 운전석/조수석 공간과 화물 적재 공간 사이에 영구적인 격벽이나 스틸 차단벽이 설치되어 있을 것.\n- 뒷공간 측면에 유리 창문이 없을 것 (밴형의 경우, 유리창 없는 철판 패널 패널 형태).\n- 화물 적재 공간 바닥 및 내장재가 승객용 마감(카펫 등) 처리가 안 되어 있을 것.\n- 픽업트럭(pick-up) : 독립된 캐빈(운전석)과 분리되어 뒤가 열린 적재 플랫폼(적재함)을 갖출 것.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 스트래들 캐리어 (컨테이너 운반용 갠트리식 대형 차) (제8426호)\n(b) 광산용 휠 로더 및 로더-트랜스포터 (제8429호)\n(c) 배달용 일반 삼륜 오토바이 및 모터사이클 (자동차식 기계 구조가 없는 것) (제8711호)\n(d) 콘크리트 믹서트럭 (레미콘 믹서 유닛 일체형) (제8705호)",
  "contentEn": "This heading covers all motor vehicles designed for the transport of goods, including trucks, vans, dumpers, and specialized cargo vehicles.\n\nIt includes :\n- General cargo trucks (flatbed, open-top, box trucks, moving vans).\n- Tankers (with or without pumps) and insulated/refrigerated trucks.\n- Dumpers (off-highway vehicles) designed for mines or quarry sites (subheading 8704.10) with heavy-duty bodies and no axle suspension.\n- Shuttle cars with built-in conveyor floors for mines.\n- Three-wheeled freight vehicles with motor car mechanical characteristics.\n- Self-loading vehicles (with winches or lifts) whose primary function is transport.\n- Road-rail goods trucks with retractable guide bogies.\n- Chassis with engine and cab for goods transport.\n\nGoods Vehicle Design Criteria (vs 87.03) :\n- Presence of a permanent barrier or panel between the cab and the rear cargo area.\n- Absence of side windows in the rear cargo compartment (for vans).\n- Bare sheet metal or non-passenger finish in the cargo area.\n- Separate open bed or cargo platform (for pick-ups).\n\nExcludes straddle carriers (heading 84.26), mine loader-transporters (heading 84.29), three-wheeled delivery motor-cycles (heading 87.11), and concrete mixer lorries (heading 87.05)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.04 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
