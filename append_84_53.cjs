const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8453",
  "titleKo": "84.53 - 원피나 가죽의 유피(柔皮)준비기ㆍ유피(柔皮)기ㆍ가공기계, 원피ㆍ가죽으로 만든 신발이나 그 밖의 물품의 제조용ㆍ수선용 기계(재봉기는 제외한다)",
  "titleEn": "84.53 - Machinery for preparing, tanning or working hides, skins or leather or for making or repairing footwear or other articles of hides, skins or leather, other than sewing machines.",
  "contentKo": "이 호에는 원피(hide, skin)나 가죽의 유피(柔皮)준비기ㆍ유피기(양피화하는 것을 포함한다)와 여기에 잇달은 완전가공작업에 사용하는 기계를 포함한다. 또한 원피ㆍ가죽의 제품을 제조하거나 수선하는 기계(예: 가죽 신발ㆍ장갑이나 여행용구의 제조용의 것)도 포함한다. 그러나 제8452호에 해당되는 재봉기는 이 호에서 제외한다.\n\n(I) 원피나 가죽의 유피준비기ㆍ유피기ㆍ가공기계\n(1) 탈모기(de-hairing machine)\n(2) 탈육기(fleshing machine)\n(3) 해머밀(faller stock) 및 비터 밀\n(4) 가죽 신장용 기계 및 스크레이핑기\n(5) 해머링기(hammering machine)\n(6) 가죽 다지기용 해머기\n(7) 세이빙(shaving)기와 스플리팅(splitting)기\n(8) 에머리기(emery machine)\n(9) 브러싱기\n(10) 가죽광택기\n(11) 그레이닝기\n모피 가공 기계류 및 털 절단, 정돈, 코밍 기계도 포함한다.\n\n(II) 원피ㆍ가죽으로 만든 신발이나 그 밖의 물품의 제조용ㆍ수선용 기계\n(A) 스카이빙기(skiving machine)와 박피기(paring machine)\n(B) 가죽 절단기 (밴드나이프기, 클리킹 프레스 등)\n(C) 천공기(perforating machine)\n(D) 장화나 구두 제조기계 :\n(1) 채널 커팅기(channel cutting machine)\n(2) 풀링오버기(\"pulling-over machine\")와 라스팅기(lasting machine)\n(3) 갑피의 가장자리와 안창의 바닥을 두들기는 기계\n(4) 구두창 접착기계\n(5) 구두창에 뒷굽을 고정하는 기계\n(6) 구두창과 뒷굽의 가장자리를 정돈/완성가공하는 기계\n(7) 러프닝(roughening) 기계\n(8) 제화 수선용 광택 및 완성가공기\n(9) 장화나 구두의 신장기\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호에는 이 호의 기계의 부분품과 이들 기계에 사용하는 다이스(dies)와 그 밖의 호환성 공구도 분류한다.\n\n이 호에는 다음의 것은 포함되지 않는다.\n(a) 건조기(제8419호)\n(b) 평활화용 캘린더기(제8420호)\n(c) 원심분리기(제8421호)\n(d) 분무기(제8424호)\n(e) 도살장용 돼지 탈모기(제8438호)\n(f) 범용 프레스(제8479호)\n(g) 원피의 측정기기(제9031호)\n(h) 제화용 골(last)(제4417호 등)\n(i) 목재가공기계(제8465호)\n(j) 구두 닦는 기계 및 아일릿팅기(제8479호)",
  "contentEn": "This heading covers machinery for preparing, tanning or working hides, skins or leather, or for making or repairing footwear or other articles of hides, skins or leather (excluding sewing machines of heading 84.52).\n\nIt includes :\n(I) Hides, skins or leather preparing, tanning or working machinery (de-hairing, fleshing, shaving, splitting, softening, calendering-polishing, brushing, shearing or curling fur).\n(II) Machinery for making or repairing footwear or other leather goods (skiving, paring, die-cutting, perforating, lasting, sole-sticking, heel-attaching, edge-trimming, polishing, shoe stretching).\n\nParts and interchangeable tools (dies) suitable for these machines are also covered.\n\nThe heading excludes :\n(a) Dryers (heading 84.19).\n(b) Calendering machines for leather (heading 84.20).\n(c) Centrifugal dryers (heading 84.21).\n(d) Shoe lasts (classified by constituent material, usually heading 44.17).\n(e) Wood-working machinery for wooden footwear parts (heading 84.65).\n(f) Automatic shoe polishing machines (heading 84.79).\n(g) Area measuring instruments for hides (heading 90.31)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.53 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
