const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_84.json';

const newEntry = {
  "hsCode": "8441",
  "titleKo": "84.41 - 그 밖의 제지용 펄프ㆍ종이ㆍ판지의 가공기계(각종 절단기를 포함한다)",
  "titleEn": "84.41 - Other machinery for making up paper pulp, paper or paperboard, including cutting machines of all kinds.",
  "contentKo": "이 호에는 제지용 펄프ㆍ종이ㆍ판지의 절단용(모든 절단기 제본기계는 별도로 하고)으로 사용하는 모든 기계가 포함되며 제조한 후에 필요한 폭이나 거래에 적합한 크기의 시트(sheet)로 절단하는 기계로부터 각종의 종이제품제조용의 기계까지 포함한다.\n\n이 호에는 다음의 것을 포함한다.\n(1) 시트(sheet)로 절단하기 위한 종이의 트리밍(trimming)기와 절단기\n(2) 다이커팅(die-cutting)기\n(3) 판지상자ㆍ종이상자ㆍ서류표지 등에 사용하는 판지를 절단하거나 윤곽성형하거나 홈을 파는 기계\n(4) 종이백 제조용 기계\n(5) 봉투 제조용 기계\n(6) 판지상자와 종이상자를 접어 만드는 기계\n(7) 상자와 이와 유사한 물품의 스테이플링기\n(8) 카톤(carton)과 박스 제조용의 그 밖의 기계\n(9) 종이관(紙管 : paper tube)ㆍ실패ㆍ슬리브ㆍ절연용관ㆍ카트리지케이스 등의 제조용 감기용(winding) 기계\n(10) 왁스처리한 종이로 만든 컵ㆍ용기 등의 성형기(成形機)\n(11) 제지용 펄프ㆍ종이ㆍ판지 제품의 몰딩(moulding)용 기계\n(12) 와인더[슬리터 와인더(slitter-winder)]\n(13) 쌓아 올리는(집적)기계\n(14) 천공기\n(15) 접는 기계(제8440호의 페이지 접는 기계를 제외한다)\n(16) 궐련지(cigarette paper)를 절단하고, 접고, 삽입하고 포장하는 복합기계\n\n부분품\n부분품의 분류에 관한 일반적인 규정(제16부 총설 참조)에 의하여 이 호의 기계의 부분품도 이 호에 분류한다.\n\n이 호에는 또한 다음의 것도 제외한다.\n(a) 판지제품 건조용의 스토브(stove)(제8419호)\n(b) 판지 용기 제작 및 충전 겸용 포장기계(제8422호)\n(c) 종이 스트립을 꼬아진 실로 만드는 기계(제8445호)\n(d) 종이백 제조용 재봉기(제8452호)\n(e) 사무실용 펀칭기 및 서류파쇄기(제8472호)\n(f) 아일렛머신 및 종이컵 왁스 코팅기(제8479호)",
  "contentEn": "This heading covers all machines used for cutting paper or paperboard (other than those specialized for book-binding), and machines for making up paper pulp, paper or paperboard into various articles.\n\nIt includes :\n(1) Trimming and cutting machines (guillotines, shears, book-trimming machines).\n(2) Die-cutting machines (labels, lace paper, index cards, window envelopes).\n(3) Cutting, scoring or grooving machines for cardboard boxes.\n(4) Paper bag making machines.\n(5) Envelope making machines (cutting, folding, lining).\n(6) Cardboard folder-gluers.\n(7) Cardboard box stapling machines.\n(8) Cardboard container making machines.\n(9) Paper tube winding machines (spools, cartridge cases).\n(10) Waxed paper cup moulding/forming machines.\n(11) Pulp or paperboard moulding machines (egg trays, paper plates).\n(12) Slitter-winders.\n(13) Sheet stacking machines.\n(14) Perforating machines (postage stamps, toilet paper).\n(15) Folding machines (excluding book-page folders).\n(16) Cigarette paper cutting and packaging composite machines.\n\nParts of these machines are also covered.\n\nThe heading excludes :\n(a) Drying ovens for cardboard goods (heading 84.19).\n(b) Packaging machines which make and fill containers (heading 84.22).\n(c) Paper twisting machines (heading 84.45).\n(d) Sewing machines for paper bags (heading 84.52).\n(e) Office document shredders and punchers (heading 84.72).\n(f) Wax-dipping or coating machinery (heading 84.79)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 84.41 to chapter_84.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
