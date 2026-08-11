const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_85.json';

const newEntry = {
  "hsCode": "8514",
  "titleKo": "85.14 - 공업용이나 실험실용 전기식 노(爐)와 오븐[전자유도식이나 유전손실(dielectric loss)식을 포함한다]과 그 밖의 공업용이나 실험실용의 전자유도식이나 유전손실(dielectric loss)식 가열기",
  "titleEn": "85.14 - Industrial or laboratory electric furnaces and ovens (including those functioning by induction or dielectric loss); other industrial or laboratory equipment for the heat treatment of materials by induction or dielectric loss.",
  "contentKo": "이 호에는 공업용 및 실험실용 전기식 노(爐), 오븐, 유도식/유전식 가열 장치를 분류한다. 가정용 전열기기는 제8516호로 제외한다.\n\n이 호에는 다음의 물품을 포함한다.\n(I) 공업용 및 실험실용 전기식 노와 오븐\n(A) 저항가열식 노와 오븐 : 발열저항체를 전원에 연결하여 방사 및 대류로 가열하는 방식 (열간 등압성형기 포함).\n(B) 피가열재(금속 봉, 과립 등) 자체를 저항체로 사용하는 가열로.\n(C) 액체저항로(액체염/염욕로, 용융금속로 등).\n(D) 금속 용해/정제용 전기분해로 (용융 전해조).\n(E) 저주파 유도로 및 고주파 유도로 (도가니 용해로, 무심 유도로 등).\n(F) 유전식 정전용량 노와 오븐 : 유전성 비도전체(플라스틱, 목재, 세라믹 등)를 고주파 전원 판 사이에 놓아 유전손실로 가열하는 기기 (공업용 마이크로웨이브 오븐 포함).\n(G) 아크식 노 : 전극 간 아크를 이용하여 고온 가열하는 아크 용해로 등.\n(H) 적외선 방사로 : 적외선 전구/방사판식 열처리로.\n빵/제과용 오븐, 치과용 오븐, 화장장용 노, 쓰레기 소각로, 유리의 소둔/뜨임용 로 등을 포함한다.\n\n(II) 그 밖의 전자유도식이나 유전손실식 가열기\n형태가 노나 오븐이 아닌 고주파/유도 가열 장치.\n(1) 유도코일식 가열 장치 : 중/고주파 유도를 통한 축, 기어 등 금속 부품의 표면경화, 용해, 소결, 소둔 기기.\n(2) 콘덴서판형 전극식 가열 장치 : 고주파 유전 가열을 이용한 목재 건조, 열가소성 수지의 예열 가열기.\n\n또한, 고온야금법에 의한 조사된 핵연료 분리용 특수 노 및 방사성 폐기물 고형화 처리용 전기로를 포함한다.\n\n부분품\n부분품의 분류에 관한 일반규정(제16부 총설 참조)에 의하여 이 호의 부분품(문, 전극홀더, 전기로용 쉘, 금속전극 등)을 분류한다.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 전기로용 내화 벽돌 및 요업 세라믹 제품 (제69류)\n(b) 반도체 웨이퍼 또는 평판디스플레이 제조용 가열로 (제8486호)\n(c) 전열용 저항체 (제8516호 또는 제8545호)\n(d) 흑연/탄소 전극 (제8545호)\n(e) 수집 응축기를 갖춘 아연/인 증류로 (제8419호)\n(f) 금속 납땜/땜질용 유도가열기 및 플라스틱 용접용 고주파 프레스 기계 (제8515호)",
  "contentEn": "This heading covers industrial or laboratory electric furnaces, ovens, and induction/dielectric heating equipment.\n\nIt includes :\n(I) Electric furnaces and ovens :\n- Resistance-heated furnaces (including hot isostatic presses).\n- Charge-resistance furnaces.\n- Liquid resistance (salt bath) furnaces.\n- Electrolytic furnaces for smelting or refining metals.\n- Low or high-frequency induction furnaces.\n- Dielectric capacitance furnaces (including industrial microwave ovens).\n- Arc furnaces.\n- Infra-red radiation ovens.\nThese include bakery ovens, dental ovens, crematorium furnaces, refuse incinerators, and glass annealing ovens.\n(II) Other induction or dielectric loss heating equipment :\n- Induction coil equipment for surface hardening, sintering, or preheating of metals.\n- Dielectric capacitive heating equipment (e.g. for wood drying or preheating plastic pellets).\n- Specialized furnaces for separating irradiated nuclear fuel or vitrifying radioactive waste.\n\nParts of these furnaces are also classified here.\n\nThe heading excludes :\n(a) Refractory bricks and ceramic shapes for lining furnaces (Chapter 69).\n(b) Furnaces and ovens for the manufacture of semiconductor wafers or flat panel displays (heading 84.86).\n(c) Heating resistors (heading 85.16 or 85.45).\n(d) Carbon or graphite electrodes (heading 85.45).\n(e) Furnaces combined with condensation systems for distillation of zinc or phosphorus (heading 84.19).\n(f) Dielectric or induction soldering/brazing equipment and high-frequency plastic welding machines (heading 85.15)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 85.14 to chapter_85.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
