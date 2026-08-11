const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9404",
  "titleKo": "94.04 - 매트리스 서포트(mattress support), 침구와 이와 유사한 물품[예: 매트리스ㆍ이불ㆍ우모이불ㆍ쿠션ㆍ푸프(pouff)ㆍ베개]으로서 스프링을 부착한 것이나 각종 재료를 채우거나 내부에 끼워 넣은 것이나 셀룰러 고무나 플라스틱으로 만든 것(피복하였는지에 상관없다)",
  "titleEn": "94.04 - Mattress supports; articles of bedding and similar furnishing (for example, mattresses, quilts, eiderdowns, cushions, pouffes and pillows) fitted with springs or stuffed or internally fitted with any material or of cellular rubber or plastics, whether or not covered.",
  "contentKo": "이 호에는 침대의 탄성 받침대인 매트리스 서포트(프레임/갈비살) 및 내부에 스프링, 솜, 동물 털, 깃털(우모), 플라스틱/스펀지 폼 등을 채워 마감한 매트리스, 침낭, 이불, 요, 쿠션, 베개 등의 침구류를 분류한다. 전열 장치가 결합되어 있어도 본 호에 포함된다.\n\n이 호에는 다음의 물품을 포함한다.\n- 매트리스 서포트(mattress support)(제9404.10호) : 강선망이 결합된 나무/금속제 침대 틀, 직물로 씌워지고 스프링이 내장된 베이스(box spring).\n- 매트리스(제9404.21~29호) :\n  - 셀룰러 고무나 플라스틱제(제9404.21호) : 라텍스 매트리스, 메모리폼 매트리스, 폴리우레탄 폼 매트리스(피복 여부 불문).\n  - 기타 재질제(제9404.29호) : 스프링 내장형 코일 매트리스, 양모/면/말털을 채워 넣은 어쿠스틱 매트리스.\n- 침낭(sleeping bag)(제9404.30호) : 퀼팅 처리되거나 내부에 다운(깃털) 또는 합성 솜을 넣은 캠핑/구난용 침낭.\n- 이불/침대보/솜털이불/깃털이불(제9404.40호) : 우모이불(duvet/eiderdown), 컴포터(comforter), 매트리스 프로텍터(침대 패드).\n- 기타 침구류(제9404.90호) : 쿠션(cushion), 베개(pillow), 볼스터(원통형 긴 베개), 푸프(pouff, 속을 채운 바닥 방석).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 물을 주입하여 사용하는 워터 매트리스 및 워터 베개 (제3926호 또는 제4016호)\n(b) 공기를 주입하여 사용하는 에어 매트리스/에어 베개 (제3926호, 제4016호 또는 제6306호)\n(c) 내부에 충전재 없이 방직용 섬유 직물만으로 제작된 일반 홑이불, 침대 시트, 베갯잇 및 누비지 않은 얇은 담요 (제6301호 또는 제6302호)\n(d) 가죽제 빈 쿠션 커버 (제4205호) 및 방직용 섬유제 단순 쿠션 커버 (제6304호)\n(e) 의자 프레임과 물리적으로 결합되어 분리되지 않고 함께 제시되는 의자 전용 등받이/좌석용 쿠션 (제9401호)" ,
  "contentEn": "This heading covers mattress supports (bed bases) and bedding items (mattresses, quilts, comforters, sleeping bags, pillows, and cushions) fitted with springs or stuffed with materials (cotton, wool, down, synthetics) or made of cellular rubber/plastics.\n\nIt includes :\n- Mattress supports (subheading 9404.10) including box springs and wooden/metal framed spring meshes.\n- Mattresses of cellular rubber or plastics (subheading 9404.21) and of other materials (subheading 9404.29) including inner-spring mattresses.\n- Sleeping bags (subheading 9404.30) for camping or military use.\n- Quilts, bedspreads, eiderdowns, and duvets (subheading 9404.40).\n- Other bedding items (subheading 9404.90) including pillows, cushions, and pouffes.\n- Electric blankets and heated mattresses.\n\nExcludes waterbeds (heading 39.26 or 40.16), air mattresses (heading 39.26, 40.16, or 63.06), flat sheets and thin unpadded blankets (heading 63.01 or 63.02), and loose seat cushions imported together with their chairs (heading 94.01)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.04 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
