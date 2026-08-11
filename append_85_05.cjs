const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8505",
  "titleKo": "85.05 - 전자석, 영구자석과 자화(磁化)한 후 영구자석으로 사용되는 물품, 전자석이나 영구자석식 척(chuck)ㆍ클램프와 이와 유사한 가공물 홀더, 전자석 커플링(coupling)ㆍ클러치와 브레이크, 전자석 리프팅헤드(lifting head)",
  "titleEn": "85.05 - Electro-magnets; permanent magnets and articles intended to become permanent magnets after magnetisation; electro-magnetic or permanent magnet chucks, clamps and similar holding devices; electro-magnetic couplings, clutches and brakes; electro-magnetic lifting heads.",
  "contentKo": "이 호에는 자력을 이용한 전자석, 영구자석 및 자석 관련 각종 전기 제어식 장치들을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 전자석(electro-magnet) : 전류 통전 시 자성을 가지는 연철심과 코일로 구성된 모든 형태의 전자석.\n(2) 영구자석 및 자화(磁化) 예정 물품 : 강강, 합금 또는 플라스틱/합성고무로 결합된 바륨페라이트 등 영구적 자성을 가진 자석(완구용 미세자석 포함) 및 자화하여 자석이 되는 입방체/원판형 페라이트 등.\n(3) 자석식 척(chuck), 클램프 및 가공물 홀더 : 가공 중 가공물 고정을 위해 전자석/영구자석을 이용하는 장치 (공작기계 외 인쇄판 고정용 자석식 홀더 등 포함).\n(4) 전자석 클러치 및 커플링 : 전자 유도 또는 비동기 전동기 원리에 기초한 변속 커플링 등.\n(5) 전자석 브레이크 : 전자석의 인력으로 차륜이나 궤조를 제동하는 슈(shoe) 브레이크, 와전류(eddy current) 이용 유도식 브레이크 등 (단, 유압/공기식 브레이크를 제어만 하는 전자 장치는 제외).\n(6) 전자석 리프팅헤드(lifting head) : 크레인 등과 결합하여 철스크랩이나 난파선 내 금속 회수에 사용하는 리프팅용 전자석.\n\n부분품\n부분품의 분류에 관한 일반적 규정(제16부 총설 참조)에 의하여 이 호의 부분품을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 바인더를 결합한 분말/펠릿 상태의 자성 페라이트 (제3824호)\n(b) 기계, 완구, 게임용구 등과 일체로 제시되는 자석 부품 (해당 기계 등과 함께 분류)\n(c) 자용 기록매체(예: 자기 자물쇠용 비자화 카드) (제8523호)\n(d) 안과/외과 치료용 특수 설계 전자석 (제9018호)",
  "contentEn": "This heading covers electro-magnets, permanent magnets and articles intended to become permanent magnets, magnetic chucks and holding devices, electromagnetic couplings, clutches, brakes, and lifting heads.\n\nIt includes :\n(1) Electro-magnets : Coils with soft iron cores for attraction/repulsion applications.\n(2) Permanent magnets and blanks : Made of hard steel, alloys, or plastic-bonded barium ferrite (including toy magnets and non-magnetized tags/cubes).\n(3) Holding devices : Magnetic chucks, clamps, and work holders for machine tools or printing presses.\n(4) Clutches and couplings : Electromagnetic clutches and variable speed couplings.\n(5) Brakes : Electromagnetic shoe brakes and eddy-current brakes (excluding mechanical brakes simply controlled by solenoids).\n(6) Lifting heads : Circular electromagnets used with cranes for lifting scrap iron.\n\nParts of these items are also covered.\n\nThe heading excludes :\n(a) Unshaped magnetic ferrite powder with a binder (heading 38.24).\n(b) Magnets presented with machines, toys or games of which they form part.\n(c) Magnetic cards for locks (heading 85.23).\n(d) Electro-magnets for ophthalmic or surgical use (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.05 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
