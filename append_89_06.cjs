const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8906",
  "titleKo": "89.06 - 그 밖의 선박(군함ㆍ노를 젓는 보트 외의 구명보트를 포함한다)",
  "titleEn": "89.06 - Other vessels, including warships and lifeboats other than rowing boats.",
  "contentKo": "이 호에는 제8901호부터 제8905호까지에 해당하지 않는 기타 모든 종류의 선박(군함, 구조용 구명선, 학술/기상관측선, 쇄빙선, 작업선 등)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 모든 종류의 군함(warship)(제8906.10호) :\n- 전투용 함정(구축함, 호위함, 잠수함 등 - 레이더, 소나, 미사일 발사장치, 장갑판을 내장한 것).\n- 상륙정(landing craft) 및 군용 병력/군수품 수송선, 해군 탄약 공급함.\n- 잠수함(submarine)(전투 및 군사용).\n(2) 기타 일반 선박 (소호 제8906.90호) :\n- 세관, 해양경찰 등 공공기관 순찰정.\n- 구명보트(lifeboat) : 모터가 탑재된 기계 구동식 구명정 (단, 무동력 노 젓는 보트는 제8903호로 제외).\n- 학술 연구 조사선, 시험선, 해양/기상 관측선.\n- 해저전선(광케이블 등) 부설선 및 항로 표지(부표) 부설 및 수송선.\n- 쇄빙선(ice-breaker, 빙하 브레이커 장착선).\n- 수로안내선(pilot-boat), 병원선(hospital ship), 준설토 처리를 위한 토운선(barge).\n- 드라콘(dracone) : 액체나 물품의 수상 운송을 위해 예인되는 유연한 튜브형 밀폐 고무/방직용 케이싱 용기.\n- 특정 선박으로서의 본질적인 특성을 갖추고 있지 않은 미완성/미조립 선체 및 바디 쉘(body shell)(제89류 주 제1호 참조).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 여객/화물용 일반 평저선(평판 바지선) (제8901호)\n(b) 크레인이나 준설기가 탑재된 플로팅 기중기선 폰툰 (제8905호)\n(c) 부교(float bridge), 래프트(뗏목), 교량 지지용 원통형 폰툰 수상 구조물 (제8907호)" ,
  "contentEn": "This heading covers all vessels not included in headings 89.01 to 89.05, including warships, lifeboats (other than rowing boats), and other specialized ships.\n\nIt includes :\n- Warships (subheading 8906.10) such as battleships, cruisers, destroyers, submarines, landing craft, and naval auxiliary vessels.\n- Other vessels (subheading 8906.90) including custom/police patrol boats, motorised lifeboats, scientific research vessels, weather ships, cable-laying ships, buoy-tenders, pilot-boats, ice-breakers, hospital ships, and hopper barges.\n- Dracones (flexible cigar-shaped liquid transport containers towed by vessels).\n- Hulls and incomplete/unassembled vessels that do not have the essential character of a specific kind of vessel (per Note 1 to Chapter 89).\n\nExcludes passenger/goods barges (heading 89.01), crane pontoons (heading 89.05), and floating rafts or bridge-supporting pontoons (heading 89.07)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.06 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
