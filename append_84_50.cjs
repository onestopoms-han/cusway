const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8450",
  "titleKo": "84.50 - 가정형이나 세탁소형 세탁기(세탁ㆍ건조 겸용기를 포함한다)(+)",
  "titleEn": "84.50 - Household or laundry-type washing machines, including machines which both wash and dry.",
  "contentKo": "이 호에는 가정형(household)이나 세탁소형(laundry-type) 세탁기를 포함한다(전기식인지와 중량이 어떠한지에는 상관없다). 이들은 보통 린넨과 완제품 옷을 세탁하기 위하여 가정, 상업용 세탁소, 병원 등에서 사용한다. 이들은 보통 액체가 세탁물을 통과하여 순환하도록 패들(paddle)이나 회전 실린더(cylinder)가 갖추어져 있으며, 때로는 액체에 고주파 진동을 주는 장치를 갖추고 있는 것도 있다.\n\n이 호는 또한 세탁 기능과 건조 기능 모두를 수행하는 기계도 포함한다.\n드라이클리닝기(dry-cleaning machinery)는 제8451호에 분류한다.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 기계부분품도 또한 이 호에 분류한다.\n\n[소호해설]\n소호 제8450.11호\n이 소호에는 프로그램을 한번 선정해 놓고 사용자의 개입없이 세탁․헹굼․회전탈수를 해주는 세탁기를 분류한다.",
  "contentEn": "This heading covers household or laundry-type washing machines (whether or not electric and regardless of weight), including machines which both wash and dry.\n\nIt includes :\n(1) Household washing machines.\n(2) Commercial laundry washing machines.\n(3) Washer-dryers (combined washing and drying machines).\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Dry-cleaning machines (heading 84.51).\n(b) Centrifugal dryers (spin dryers) presented separately (heading 84.21)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.50 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
