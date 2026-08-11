const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_97.json';

const newEntry = {
  "hsCode": "9705",
  "titleKo": "97.05 - 수집품과 표본[고고학ㆍ민족학ㆍ사학ㆍ동물학ㆍ식물학ㆍ광물학ㆍ해부학ㆍ고생물학ㆍ고전학(古錢學)에 관한 것으로 한정한다]",
  "titleEn": "97.05 - Collections and collectors’ pieces of archaeological, ethnographic, historical, zoological, botanical, mineralogical, anatomical, palaeontological or numismatic interest.",
  "contentKo": "이 호에는 학술적(동물학, 식물학, 광물학, 해부학, 고생물학), 사료적(고고학, 민족학, 사학), 화폐학적(고전학) 가치가 있어 수집 및 학술 연구용 표본으로서 흥미를 돋우는 물품과 그 수집품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 고고학/민족학/사학 표본(제9705.10호) :\n  - 고고학 : 동굴 벽화 조각, 고대 프레스코/석조 기둥 주두/문 상인방, 고대 목걸이/반지/장신구, 문자 기호가 새겨진 점토판/조가비/뼈, 파피루스/양피지 손글씨 원문.\n  - 민족학 : 부족 전통 종교 의식용 목조 조상/성물, 성골함, 붕대 미라, 미라화된 두상(shrinked head), 사람 뼈 악기, 고대 종교 경전(성경/토라/코란 필사본).\n  - 사학 : 역사적 인물이나 전쟁, 과학 발전과 연계된 물품(중세 기사의 갑옷/갑주/전용 무기, 왕실 기장, 연금술실 도가니/플라스크).\n- 학술 표본(동물/식물/광물/해부/고생물학)(제9705.21~29호) :\n  - 인체 표본 및 부분품(제9705.21호) : 해부/병리학 연구용 인체 골격, 두개골, 방부 보존된 장기 표본.\n  - 멸종 및 멸종위기종 표본(제9705.22호) : 박제된 박쥐, 맹수 등 CITES 규제 대상 멸종위기 동식물의 박제 또는 박제 부분품.\n  - 기타 학술 표본(제9705.29호) : 건조 식물 표본(석엽 표본), 곤충 채집 상자(나비 표본), 빈 조개껍데기, 지질학 광물 표본, 공룡 화석 및 식물 엽상 화석(고생물학).\n- 화폐학(고전학) 수집품(제9705.31~39호) :\n  - 100년 초과 고전 주화/지폐(제9705.31호).\n  - 100년 이하 기타 수집용 주화/지폐/메달(제9705.39호) : 현재 발행국 법정통화로 유효하지 않고 화폐 수집용 가치만 지닌 코인, 수집용 기념 메달(대량 양산 스크랩용 제외).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 발행국 내에서 현재 통용되어 실질적 법적 결제/지불 수단으로 유효한 지폐 및 코인 (제4907호 또는 제7118호)\n(b) 마찰 및 손상되어 단순히 융해용(재생용)으로 구부려 스크랩 처리된 폐금속 코인 (제7204호 또는 제7404호 등)\n(c) 상업적으로 생산되어 배포된 대량 양산형 기념품(배지, 메달 등)으로, 역사적/희소적 가치를 미획득한 것 (각 재질별 분류)" ,
  "contentEn": "This heading covers collections and collectors’ pieces of scientific, historical, or numismatic interest.\n\nIt includes :\n- Archaeological, ethnographic, or historical objects (subheading 9705.10) including ancient frescoes, stone capitals, cuneiform clay tablets, antique jewelry, tribal relics, holy reliquaries, medieval weapons, and historical manuscripts (bibles, Korans).\n- Human specimens (subheading 9705.21) including skeletons and anatomical parts.\n- Extinct or endangered species specimens (subheading 9705.22) CITES-listed stuffed animals.\n- Other scientific specimens (subheading 9705.29) including botanical herbaria, insect boxes, shells, mineral specimens, and dinosaur fossils.\n- Numismatic (coins and banknotes) collections over 100 years old (subheading 9705.31) and others (subheading 9705.39) which are no longer legal tender.\n\nExcludes current legal tender banknotes/coins (heading 49.07 or 71.18), coins bent for scrap melting, and mass-produced commemorative medals (classified by material)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 97.05 to chapter_97.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
