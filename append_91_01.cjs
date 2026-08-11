const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_91.json';

const newEntry = {
  "hsCode": "9101",
  "titleKo": "91.01 - 손목시계ㆍ회중시계와 그 밖의 휴대용 시계(스톱워치를 포함하며, 케이스를 귀금속으로 만든 것이나 귀금속을 입힌 금속으로 만든 것으로 한정한다)",
  "titleEn": "91.01 - Wrist-watches, pocket-watches and other watches, including stop-watches, with case of precious metal or of metal clad with precious metal.",
  "contentKo": "이 호에는 케이스 전부가 귀금속(금, 은, 백금 등) 또는 귀금속을 입힌 금속(metal clad with precious metal)으로 된 손목시계, 회중시계 및 기타 휴대용 시계(스톱워치 포함)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 전기구동식 손목시계(제9101.11~19호) : 건전지나 축전지로 구동되는 수정(쿼츠) 진동자 조정식 시계.\n  - 기계식 표시부만을 갖춘 것(바늘식 아날로그 표시)(제9101.11호).\n  - 기타 표시방식(디지털 LCD/LED, 또는 아날로그와 디지털 혼합 표시)(제9101.19호).\n- 그 밖의 손목시계(기계식 구동)(제9101.21~29호) :\n  - 자동엽(자동태엽감기)식(자동권식)(제9101.21호).\n  - 기타 태엽구동 수동식 손목시계(제9101.29호).\n- 기타 휴대용 시계(회중시계, 펜던트시계 등)(제9101.91~99호) : 전기구동식(제9101.91호), 기타 기계식(제9101.99호).\n\n[주요 분류 기준]\n- '귀금속을 입힌 금속'이란 땜접, 납접, 용접, 열간압연 등의 기계적 방법으로 비금속의 표면에 귀금속을 입힌 것을 의미한다 (제71류 주 제7호).\n- 케이스의 바디 부분이 귀금속이나 뒷면(백 케이스)이 스테인리스강 등 비금속으로 된 것은 귀금속을 박아 넣은 비금속 케이스로 취급하여 제9102호로 분류한다." ,
  "contentEn": "This heading covers wrist-watches, pocket-watches, and other pocket-type timepieces (including stop-watches) whose case is made entirely of precious metal or metal clad with precious metal.\n\nIt includes :\n- Electric-powered wrist-watches (subheadings 9101.11 to 9101.19) with opto-electronic or mechanical (hands) displays.\n- Mechanical wrist-watches (subheadings 9101.21 to 9101.29) including automatic winding or manual winding.\n- Other watches (subheadings 9101.91 to 9101.99) including pocket-watches and fob watches.\n\nExcludes watches where the case body is of precious metal but the back is of stainless steel (heading 91.02)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 91.01 to chapter_91.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
