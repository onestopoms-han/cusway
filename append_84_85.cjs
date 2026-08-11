const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry8485 = {
  "hsCode": "8485",
  "titleKo": "84.85 - 적층제조기계",
  "titleEn": "84.85 - Machines for additive manufacturing.",
  "contentKo": "이 호에는 디지털 모델(digital model)을 바탕으로 물리적 대상물을 형성하는 적층 제조(additive manufacturing)(3D 프린팅)용 기계를 분류한다. 디자인 파일(design file)을 기초로 재료를 연속적으로 부가/적층하고 경화/응고시켜 대상을 창출한다.\n레이저, 저항기, 전자 빔, 자외선 등의 에너지 원을 사용하며 금속, 플라스틱, 고무, 플라스터, 시멘트, 세라믹, 유리, 나무, 종이 등의 재료를 사용하여 3차원 목적물(의료 장치, 인공장기, 예술품, 건축물, 의류 등)을 생산한다.\n\n이 호에는 다음의 적층제조기계를 분류한다.\n(1) 접착재 분사 방식 기계(binder jetting machine) : 분말(금속, 플라스틱, 유리 등)과 액체 접착재를 사용하여 층별로 접착하여 성형하는 기계.\n(2) 광경화조형기(stereolithography machine, SLA) : 자외선 레이저 등으로 액체 광 폴리머 수지 등을 조사하여 경화/적층하는 기계.\n(3) 재료 분사 방식 기계(material jetting machine) : 플라스틱 재료 등을 노즐에서 분사하고 자외선 등으로 경화시키는 기계.\n(4) 재료 압출방식 기계(material extrusion machine, FDM) : 필라멘트를 가열 유동화하여 노즐로 압출 적층하는 기계.\n(5) 분말 베드 융해방식 기계(powder bed fusion machine, SLS/SLM) : 레이저나 전자 빔으로 분말 재료를 층별로 녹여 융합시키는 기계.\n(6) 판재적층 방식 기계 : 시트(주로 플라스틱)를 적층하고 디지털 모델에 따라 융합하여 3차원 대상을 만드는 기계 (단순 시트 합판기는 제외).\n(7) 직접식 에너지 적층 기계(directed energy deposition machine, DED) : 분사되는 재료(금속 분말/와이어 등)에 레이저나 전자 빔을 조사하여 용융 적층하는 기계.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품(전자 부품이나 기계적 메커니즘을 갖추고 특정 3D 프린터용으로 설계된 재료 카트리지 포함)도 이 호에 분류한다.",
  "contentEn": "This heading covers machines for additive manufacturing (commonly referred to as 3D printers) which form physical objects based on digital models by successively depositing and solidifying material.\n\nIt includes :\n(I) Binder jetting machines.\n(II) Stereolithography (SLA) machines.\n(III) Material jetting machines.\n(IV) Material extrusion machines (FDM).\n(V) Powder bed fusion machines (SLS, SLM).\n(VI) Sheet lamination machines for 3D objects.\n(VII) Directed energy deposition (DED) machines.\n\nParts of these machines are also covered (including print cartridges containing material, designed specifically for a particular 3D printer, provided they incorporate electronic components or mechanical mechanisms)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry8485);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.85 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
