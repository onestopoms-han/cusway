const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8710",
  "titleKo": "87.10 - 전차와 그 밖의 장갑차량[자주식(自走式)으로 한정하며, 무기를 장비하였는지에 상관없다], 이들의 부분품",
  "titleEn": "87.10 - Tanks and other armoured fighting vehicles, motorised, whether or not fitted with weapons, and parts of such vehicles.",
  "contentKo": "이 호에는 군사/보안 목적의 자주식 전차 및 장갑 전투 차량(수륙양용차 포함, 무기 탑재 여부 무관)과 그 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전차(tank) : 무한궤도식 장갑차량으로 회전식 포탑 및 무기(대포, 기관총 등)를 갖춘 것.\n- 지뢰 지대 개척용 지뢰 플레일(flail) 또는 중량 롤러가 전면에 장착된 대지뢰 전차.\n- 수륙양용전차 및 수륙양용 장갑상륙차량.\n- 장갑차(armoured car) : 차륜식 또는 무한궤도식의 경량 신속 순찰/정찰/수송용 차량.\n- 장갑 구난 전차(전투차량 수리용 크레인 탑재형).\n- 장갑 수송/보급차(무한궤도식으로 유류, 탄약 수송에 사용되는 차량).\n- 원격 조종식 소형 탄약 보급 전차.\n- 병력 수송용 장갑차(APC).\n- 이들 차량의 전용 부분품 : 장갑 차체(body), 포탑(turret), 장갑 도어, 전차용 특수 무한궤도 및 구동륜, 가공된 장갑판, 피팅용 단자가 결합된 전용 케이블류.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 일반 차량에 간이 장갑판을 덧붙인 정도의 일반 승용차 및 화물차 (제8702호~제8705호)\n(b) 자주식 포병 무기(자주포, 로켓 발사 차량 등) (제9301호) (특징: 정지 상태에서만 발사 가능하며, 포신 선회각이 제한됨)" ,
  "contentEn": "This heading covers motorised tanks and other armoured fighting vehicles, whether or not fitted with weapons, and their parts.\n\nIt includes :\n- Tanks (tracked armoured vehicles equipped with rotating turrets and weapons).\n- Amphibious tanks and amphibious tracked landing vehicles.\n- Armoured cars (wheeled or tracked, lighter and faster than tanks, used for patrol/reconnaissance).\n- Armoured recovery vehicles fitted with cranes for repairing tanks.\n- Armoured supply vehicles (for transporting fuel or ammunition in combat areas).\n- Remote-controlled mini-tanks for supplying ammunition.\n- Armoured Personnel Carriers (APC).\n- Parts of such vehicles: armoured bodies, turrets, doors, special tracks, drive sprockets, and worked armour plates.\n\nExcludes conventional motor vehicles with light/temporary armouring (headings 87.02 to 87.05) and self-propelled artillery weapons (heading 93.01)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.10 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
