const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8443",
  "titleKo": "84.43 - 제8442호의 플레이트ㆍ실린더와 그 밖의 인쇄용 구성 부품을 사용하는 인쇄기, 그 밖의 인쇄기ㆍ복사기ㆍ팩시밀리(함께 조합되었는지에 상관없다), 이들의 부분품과 부속품(+)",
  "titleEn": "84.43 - Printing machinery used for printing by means of plates, cylinders and other printing components of heading 84.42; other printers, copying machines and facsimile machines, whether or not combined; parts and accessories thereof.",
  "contentKo": "이 호에는 (1) 제8442호의 플레이트, 실린더(cylinder)에 의해 인쇄하는데 사용하는 모든 기계와 (2) 그 밖의 인쇄기ㆍ복사기ㆍ팩시밀리(함께 조합되었는지에 상관없다)를 포함한다.\n\n이 호에는 방직용 섬유ㆍ벽지ㆍ포장지ㆍ고무ㆍ플라스틱판ㆍ리놀륨ㆍ가죽 등에 동일한 문양ㆍ문자나 색상을 반복하여 인쇄하는 기기를 포함한다.\n\n(I) 제8442호의 플레이트ㆍ실린더와 그 밖의 인쇄용 구성 부품을 사용하는 인쇄기(printing machinery)\n이러한 기기의 가장 대표적인 것은 윤전기(rotary press)이다.\n(1) 릴공급식 인쇄기(reel-fed press) : 수 개의 인쇄 유닛이 하나의 프레임에 결합되어 있는 것도 있다.\n(2) 시트 공급식 인쇄기(sheet-fed press) : 인쇄용 낱장들은 그리퍼(gripper)에 의해 인쇄 유닛들을 통과하여 이송한다.\n또한 이 그룹에는 이동 가능한 플레이트를 사용하는 인쇄기와 원압식 인쇄기를 포함한다.\n\n(II) 그 밖의 인쇄기(printer)ㆍ복사기(copying machine)ㆍ팩시밀리(facsimile machine)(함께 조합되었는지에 상관없다)\n(A) 인쇄기(printer) : 레이저ㆍ잉크젯ㆍ도트매트릭스나 열인쇄방식으로 문자나 이미지를 출력한다.\n(B) 복사기(copying machine) : 디지털 복사기, 사진식 복사기 등을 분류한다.\n(C) 팩시밀리 기기(facsimile machine) : 원문이나 그림을 네트워크로 송수신하고, 재생 출력을 하는 기기이다.\n(D) 인쇄기․복사기․팩시밀리의 조합품 (복합기)\n\n부분품과 부속품\n제16부 총설의 규정 및 분류 기준에 따른다. 자동용지 공급 장치, 분류기(sorter) 등 인쇄기와 연동되는 부속장치를 포함한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 실린더 블랭킷과 덮개 (재료에 따라 분류)\n(b) 용기 레이블 인쇄용 기계 및 포장기(제8422호)\n(c) 백에 물품을 충전하는 기계와 포장기(제8422호) 또는 종이 제조 기계(제8441호)\n(d) 얼룩 방지 분사기(제8424호)\n(e) 등사기와 주소인쇄기(제8472호)\n(f) 패턴 형성기(제8486호)\n(g) 마이크로필름 문서 수록용 사진기(제9006호)\n(h) 사진 인화용 프레임(제9010호)\n(ij) 제도용 기기(제9017호)",
  "contentEn": "This heading covers printing machinery used for printing by means of plates, cylinders and other printing components of heading 84.42; other printers, copying machines and facsimile machines, whether or not combined; parts and accessories thereof.\n\nIt includes :\n(I) Printing machinery using components of heading 84.42 (reel-fed rotary presses, sheet-fed rotary presses, platen presses, cylinder presses).\n(II) Other printers, copying machines and facsimile machines (laser printers, inkjet printers, electrostatic photocopiers, digital copiers, facsimiles, multi-functional machines).\n\nParts and accessories of these machines are also covered (sheet feeders, paper delivery machines, sorters, folders, binders, electro-photographic drums, etc.).\n\nThe heading excludes :\n(a) Cylinder blankets and covers (classified by material).\n(b) Packaging or labeling machines of heading 84.22.\n(c) Anti-smudge spraying systems (heading 84.24).\n(d) Stencil duplicating machines and addressographs (heading 84.72).\n(e) Pattern generating apparatus (heading 84.86).\n(f) Cameras for recording documents on microfilm (heading 90.06).\n(g) Drawing instruments (heading 90.17)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.43 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
