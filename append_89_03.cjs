const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8903",
  "titleKo": "89.03 - 요트, 유람용이나 운동용 그 밖의 선박, 노를 젓는 보트와 카누(+)",
  "titleEn": "89.03 - Yachts and other vessels for pleasure or sports; rowing boats and canoes.",
  "contentKo": "이 호에는 유람, 스포츠, 레저, 체육 목적의 모든 요트, 모터보트, 보트 및 인력 구동의 노 젓는 보트(rowing boat)와 카누, 카약을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(1) 공기주입식(인플레이터블) 보트 (견고한 선체 RIB 보트 포함)(제8903.11~19호) :\n- 모터 장착형 또는 장착 설계형(모터 제외 자중 100kg 이하) (제8903.11호).\n- 무동력 레저/캠핑용 고무보트(자중 100kg 이하) (제8903.12호).\n- 기타 대형 공기주입식 보트 (제8903.19호).\n(2) 범선(세일링 요트 등, 공기주입식 제외, 보조모터 유무 무관) (제8903.21~23호) : 길이 7.5m 이하, 7.5m 초과~24m 이하, 24m 초과로 세분화.\n(3) 모터보트(인보드 모터 포함, 공기주입식 및 아웃보드 모터 제외) (제8903.31~33호) : 길이 7.5m 이하, 7.5m 초과~24m 이하, 24m 초과로 세분화.\n(4) 기타 (아웃보드 모터보트, 노젓는 보트, 카약, 카누, 스컬, 페달로 pedalo, 스포츠 낚시배, 딩기 등) (제8903.93~99호).\n- 노(oar)를 저어 나아가는 인명 구조용 구명보트(lifeboat) 포함.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 수상 스포츠용 윈드서핑용 세일보드(sailboard) 및 서프보드 (제9506호)\n(b) 모터가 장착되거나 기계 장치가 결합된 인명구조용 고속 구명정 (제8906호)" ,
  "contentEn": "This heading covers all vessels for pleasure or sports, and all rowing boats and canoes.\n\nIt includes :\n- Inflatable boats (including rigid hull inflatable boats RIB) (subheadings 8903.11 to 8903.19).\n- Sailboats (other than inflatable, with or without auxiliary motors) (subheadings 8903.21 to 8903.23).\n- Motorboats (other than inflatable, excluding outboard motorboats) (subheadings 8903.31 to 8903.33).\n- Other vessels (subheadings 8903.93 and 8903.99) including outboard motorboats, jet-skis, dinghies, kayaks, canoes, sculls, skiffs, pedalos, sports fishing vessels, and rowing lifeboats.\n\nExcludes windsurfing sailboards (heading 95.06) and motorised lifeboats (heading 89.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.03 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
