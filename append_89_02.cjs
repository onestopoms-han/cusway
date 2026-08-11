const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8902",
  "titleKo": "89.02 - 어선과 어획물의 가공용이나 저장용 선박",
  "titleEn": "89.02 - Fishing vessels; factory ships and other vessels for processing or preserving fishery products.",
  "contentKo": "이 호에는 어업(조업)용으로 설계된 선박 및 어획물의 가공/저장/보존 전용의 공장선(factory ship)을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 어선(트롤선 trawler, 참치잡이선, 연승선 등).\n- 어획물 가공선(어획물을 급속 냉동, 가공, 통조림화하는 장비가 고정 장착된 선박).\n- 오프 시즌(비조급기) 동안 임시로 유람선으로 사용하는 어선.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 스포츠/레저 낚시용 보트 및 무동력 노 젓는 낚시 보트 (제8903호)" ,
  "contentEn": "This heading covers fishing vessels of all kinds designed for sea or inland navigation, and factory ships for processing and preserving fishery products.\n\nIt includes :\n- Commercial fishing vessels (trawlers, tuna clippers, long-liners).\n- Factory ships equipped with processing, preserving, and canning machinery for fishery products.\n- Fishing vessels used temporarily for excursion trips during off-seasons.\n\nExcludes sports fishing vessels and recreational rowing boats (heading 89.03)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.02 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
