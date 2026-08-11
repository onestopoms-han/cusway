const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_86.json';

const newEntry = {
  "hsCode": "8609",
  "titleKo": "86.09 - 컨테이너(액체운반용 컨테이너를 포함하며, 하나 이상의 운송수단으로 운반할 수 있도록 특별히 설계되고 구조를 갖춘 것으로 한정한다)",
  "titleEn": "8609.00 - Containers (including containers for the transport of fluids) specially designed and equipped for carriage by one or more modes of transport.",
  "contentKo": "이 호에는 도로, 철도, 해상, 항공 등 복합 수송 수단을 통해 화물을 중간에 재포장하지 않고 '문 앞까지(door-to-door)' 안전하게 이송할 수 있도록 특수 설계되고 튼튼한 금속/나무 구조로 반복 사용이 가능한 컨테이너(용적 1㎥ 이상)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 가구 이동용 컨테이너(리프트밴 lift van).\n- 부패성 화물 수송용 단열/냉장 컨테이너.\n- 액체 또는 가스 운반용 컨테이너 (실린더/원통 탱크형으로서 차량/선박에 탈착할 수 있는 지지 프레임 구조물이 결합된 것).\n- 석탄, 광석, 벌크 화물용 무개(open) 컨테이너 및 하부/측면 경첩 개폐형 하역 컨테이너.\n- 취약 물품(유리, 도자기 등) 수송용 특수 프레임 컨테이너 및 생동물 수송용 특수 컨테이너.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 복합 수송 전용 프레임 및 탈착 장치(훅, 링 등)가 결합되지 않은 일반 금속/나무 상자 및 패키지 용기 (재질에 따라 분류)\n(b) 철도 화차 적재용 도로-레일 겸용 세미트레일러 (제8716호)\n(c) 모듈러 하우스 및 모듈화된 조립식 빌딩 유닛 (제9406호)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 86.09 to chapter_86.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
