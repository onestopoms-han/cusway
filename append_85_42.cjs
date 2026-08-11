const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8542",
  "titleKo": "85.42 - 전자집적회로",
  "titleEn": "85.42 - Electronic integrated circuits.",
  "contentKo": "이 호에는 주 제12호나목에 정의된 전자집적회로(IC)를 분류한다. 수동 소자와 능동 소자를 분리가 불가능하게 불가분의 상태로 고밀도 조합하여 단일 유닛으로 만든 소형화 장치를 의미한다.\n\n이 호에는 다음의 네 가지 카테고리를 포함한다.\n(I) 모노리식(monolithic) 집적회로\n- 단일 반도체 기판(예: 실리콘 다이) 표면에 다이오드, 트랜지스터, 저항, 콘덴서 등의 소자를 일체형으로 형성하여 제조한 회로.\n- 장착된 것(패키지 상태), 장착되지 않은 것(칩 다이 형태), 웨이퍼(절단되지 않은 디스크) 상태를 포함.\n(II) 하이브리드(hybrid) 집적회로\n- 절연 기판(예: 도자기 기판) 위에 박막/후막 기술로 형성된 수동 소자들과, 별도 실장된 능동 반도체 다이(또는 초소형 개별 반도체 칩)를 불가분하게 결합한 것.\n(III) 복합구조칩(multichip) 집적회로 (MCM, MCP 등)\n- 두 개 이상의 모노리식 집적회로를 나란히 또는 위아래로 적층하여 분리할 수 없게 내부 상호 배선(와이어본딩, 플립칩 등) 연결한 것 (그 외 개별 능동/수동 소자가 없어야 함).\n(IV) 복합부품 집적회로 (MCOs, Multi-component Integrated Circuits)\n- 하나 이상의 모노리식/하이브리드/복합구조칩 집적회로에 실리콘 기반 센서, 액추에이터, 오실레이터, 공진기(MEMS 등 소자) 또는 개별 수동 부품(인덕터, 콘덴서, 저항 등), 개별 반도체 소자를 단일 IC 패키지 내부에 물리적/전기적으로 불가분하게 결합한 소자.\n\n부분품\n부분품의 분류에 관한 일반 규정(제16부 총설 참조)에 의하여 이 호의 부분품(리드프레임, 캡슐화 몰드 하우징 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 수동 소자만으로 구성된 막회로(PCB 등) (제8534호)\n(b) 메모리 칩을 인쇄기판에 단순히 표면 실장하여 개별 소자들을 구성한 메모리 모듈(SIMM, DIMM 등) (제16부 주 제2호 또는 완제품의 호)\n(c) 마그네틱 드라이브 및 플래시 메모리 카드, 스마트카드(NFC 태그 등 포함) (제8523호)\n(d) 외부 대형 변압기나 자석 등 MCO 구성 요건에 벗어난 이종 부품이 결합된 집적 모듈 (제8504호, 제8505호 등)"
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.42 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
