const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9400",
  "titleKo": "제94류 - 가구, 침구ㆍ매트리스ㆍ매트리스 서포트ㆍ쿠션, 다른 류로 분류되지 않은 조명기구, 조명용 사인과 이와 유사한 물품, 조립식 건축물 (총설 및 주 규정)",
  "titleEn": "Chapter 94 - Furniture; bedding, mattresses, mattress supports, cushions and similar stuffed furnishings; luminaires and lighting fittings, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like; prefabricated buildings (General Notes & Rules)",
  "contentKo": "제94류는 실내외용 가구(제9401호~제9403호), 침구/매트리스/쿠션류(제9404호), 타 호에 지정되지 않은 조명기구 및 조명용 사인(제9405호), 그리고 조립식 건축물(제9406호)을 분류한다.\n\n[주요 분류 기준 및 주 규정]\n1. 바닥 거치 요건 및 예외 (주 제2호) :\n  - 원칙적으로 가구는 마루나 지면에 놓고 사용하도록 만들어진 것에 한해 본 류에 분류된다.\n  - 예외적으로 벽에 매달거나 붙이거나 다른 물품 위에 쌓아두는 형태라도 다음 물품은 본 류에 포함한다.\n    가. 식기선반, 서가, 선반 가구(벽걸이 지지대 포함 단일 선반), 유닛(조립)식 가구.\n    나. 의자(seats) 및 침대.\n2. 가구 부분품의 제한 (주 제3호) :\n  - 단독 제시되는 유리판(거울 포함), 대리석/돌판 등(특정 모양 재단 여부 불문)은 다른 가구 부재와 조립된 상태가 아닌 한 가구의 부분품으로 취급하지 않는다(각 재질별 70류, 68류 등 분류).\n  - 단독 제시되는 제9404호의 매트리스/침구류는 가구의 부분품으로 분류하지 않고 제9404호로 단독 분류한다.\n3. 조립식 건축물 정의 (주 제4호) :\n  - 공장 완성품 또는 현장 조립용 유닛 세트로 동시에 제시되는 가옥, 숙소, 사무실, 학교, 창고 등을 말하며, 선적 컨테이너 크기의 사전 조립식 모듈화 빌딩 유닛(modular building units)을 포함한다.\n\n[제외 물품]\n- 공기/물 주입식 매트리스, 베개, 쿠션 (제39류, 제40류 또는 제63류)\n- 지상 거치용 전신거울 (제7009호)\n- 범용성 비금속 스프링, 경첩, 자물쇠, 나사 (제15부 또는 제39류)\n- 냉장/냉동고 일체형 가구 (제8418호) 및 재봉기 전용 테이블 (제8452호)\n- 전자기기/음향/영상 기기 전용으로 특수 설계된 수납 랙/가구 (제8518호 -> 제8518호, 제8519/21호 -> 제8522호, 제8525~28호 -> 제8529호)\n- 치과용 의자(치과 기기 부착형) 및 치과용 타구 (제9018호)\n- 시계 및 시계 케이스 (제91류)\n- 완구용 가구, 당구대 및 게임용 특수 가구 (제95류)\n- 지상 거치용이 아닌 휴대식 악보 보면대 (제9620호)" ,
  "contentEn": "Chapter 94 covers furniture (headings 94.01 to 94.03), bedding/mattresses (heading 94.04), luminaires/lighting fittings and illuminated signs (heading 94.05), and prefabricated buildings (heading 94.06).\n\n[Key Rules & Explanations]\n1. Floor-Standing Rule & Exceptions (Note 2) :\n  - Generally, furniture must be designed for placing on the floor or ground to fall under this Chapter.\n  - Wall-hung, stackable, or built-in cupboards, bookcases, shelving units, seats, and beds are exceptions and remain in Chapter 94.\n2. Exclusions for Unassembled Parts (Note 3) :\n  - Separate plates or slabs of glass (mirrors), marble, or stone are not treated as furniture parts unless combined with other structural components.\n  - Bedding items of heading 94.04 presented separately are never classified as parts of furniture.\n\n[Exclusions]\n- Pneumatic or water mattresses, pillows, or cushions (Chapter 39, 40, or 63).\n- Floor-standing mirrors (cheval-glasses) (heading 70.09).\n- General-use screws, springs, and hinges (Section XV or Chapter 39).\n- Special furniture designed for refrigerators (heading 84.18) or sewing machines (heading 84.52).\n- Special furniture designed for audio/video appliances (headings 85.18, 85.22, 85.29).\n- Dentists' chairs with appliances (heading 90.18).\n- Toy furniture and billiard tables (Chapter 95).\n- Floor-standing tripods/stands (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended Chapter 94 rules/general to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
