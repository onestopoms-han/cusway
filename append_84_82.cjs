const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8482",
  "titleKo": "84.82 - 볼베어링(ball bearing)이나 롤러베어링(roller bearing)",
  "titleEn": "84.82 - Ball or roller bearings.",
  "contentKo": "이 호에는 볼, 롤러, 니들 롤러형의 모든 베어링(레이디얼 베어링 및 추력 쓰러스트 베어링 등)을 분류한다.\n보통 내부 링, 외부 링, 롤링 엘리먼트(볼/롤러), 이들의 일정한 간격을 유지시키는 케이지(cage)로 구성된다.\n\n이 호에는 다음의 것을 포함한다.\n(A) 볼베어링(ball bearing) : 단열 또는 복열 볼베어링 및 슬라이드 메커니즘을 구성하는 굴림제한형/굴림자유형 등 베어링 볼을 갖춘 슬라이드 레일 기구.\n(B) 롤러베어링(roller bearing) : 원통, 원추, 구형(배럴 모양) 등의 롤러를 갖춘 단열/복열 롤러베어링.\n(C) 니들 롤러베어링(needle roller bearing) : 직경 5mm 이하이며, 길이가 직경의 3배 이상인 니들 롤러를 갖춘 베어링 (소호 주 제4호 요건 충족하는 것).\n\n부분품\n이 호에는 다음의 부분품을 포함한다.\n(1) 연마된 강구(polished steel ball) : 최대/최소 직경과 공칭 직경의 차이가 1% 또는 0.05mm 중 작은 값 이하인 연마된 강구 (공차가 이보다 큰 강구는 제7326호 분류 - 주 제7호 참조).\n(2) 스틸 이외의 재질(구리, 청동, 플라스틱 등)로 만든 베어링 볼.\n(3) 니들 및 롤러 (원통, 원추, 구형 등).\n(4) 베어링의 링(ring), 케이지(cage), 고정슬리브(fixing sleeve) 등.\n\n이 호에는 다음의 것도 제외한다.\n(a) 베어링을 내장한 하우징 및 브래킷 (제8483호)\n(b) 자전거용 허브 (제8714호)",
  "contentEn": "This heading covers all ball, roller or needle roller bearings.\n\nIt includes :\n(I) Ball bearings (single or double row, sliding mechanisms incorporating bearing balls).\n(II) Roller bearings (cylindrical, tapered, spherical or barrel-shaped rollers).\n(III) Needle roller bearings (cylindrical rollers with diameter <= 5 mm and length >= 3 * diameter).\n\nParts of these bearings are also covered, including :\n(1) Polished steel balls (with tolerance <= 1% or 0.05 mm of nominal diameter; others fall in heading 73.26).\n(2) Bearing balls of other materials (copper, bronze, plastics).\n(3) Rollers and needle rollers.\n(4) Rings, cages and fixing sleeves.\n\nThe heading excludes :\n(a) Bearing housings and bearing brackets (heading 84.83).\n(b) Bicycle hubs (heading 87.14)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.82 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
