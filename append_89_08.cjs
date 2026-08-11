const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_89.json';

const newEntry = {
  "hsCode": "8908",
  "titleKo": "89.08 - 선박과 그 밖의 물에 뜨는 구조물(해체용으로 한정한다)",
  "titleEn": "89.08 - Vessels and other floating structures for breaking up.",
  "contentKo": "이 호에는 제8901호부터 제8907호까지의 선박 및 수상 구조물로서 해체(스크랩 처리)할 목적으로 제시되는 것을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 폐선용/해체용 선박 (폐선되거나 극심하게 손상된 선박).\n- 제시되기 전에 내부 기기, 엔진, 기계류 및 의장품 등이 이미 제거된 해체용 선박." ,
  "contentEn": "This heading covers vessels and other floating structures of headings 89.01 to 89.07 presented for breaking up.\n\nIt includes :\n- Damaged or obsolete vessels and floating structures imported or exported solely for dismantling (scrap).\n- Such vessels even if their equipment, machinery, or engines have been removed prior to presentation."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 89.08 to chapter_89.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
