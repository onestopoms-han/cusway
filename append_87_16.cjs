const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_87.json';

const newEntry = {
  "hsCode": "8716",
  "titleKo": "87.16 - 트레일러와 세미트레일러, 기계구동식이 아닌 그 밖의 차량, 이들의 부분품",
  "titleEn": "87.16 - Trailers and semi-trailers; other vehicles, not mechanically propelled; parts thereof.",
  "contentKo": "이 호에는 다른 차량(자동차, 트랙터, 자전거 등)에 의해 견인되도록 제작된 피견인 차량(트레일러, 세미트레일러)과 인력, 축력(동물), 또는 중력/발로 미는 힘에 의해 이동하는 무동력 차량 및 그 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n(A) 트레일러 및 세미트레일러\n- 캠핑/주거용 이동 주택 캐러밴 트레일러(제8716.10호).\n- 농업용 자동 적재/양하식 트레일러(제8716.20호) (단, 고정식 풀베기 수확 기계 일체형은 제8433호로 제외).\n- 액체/가스 수송용 탱커 트레일러 및 탱커 세미트레일러(제8716.31호).\n- 기타 화물수송용 트레일러 및 세미트레일러(제8716.39호) : 일반 경사식(덤프형) 트레일러, 냉장/냉동 트레일러, 이삿짐 트레일러, 생동물/가금류/차량 수송용 트레일러, 도로-레일 복합운송 트레일러, 중량물 운송용 저상(low-boy) 트레일러, 벌목용 트레일러.\n- 기타 승객 수송용 트레일러, 박물관/전시용 트레일러(제8716.40호).\n(B) 수동식 및 페달식 차량(제8716.80호)\n- 산업용 트롤리/카트, 손수레(wheelbarrow), 수하물용 핸드카트, 덤프용 수동 카트.\n- 인력거, 노점상인용 단열식/보온식 핸드카트(아이스크림 손수레 등).\n- 수동식 썰매 및 극지방용 발구름 추진식 킥슬레드(kicksled).\n(C) 우마차 등 동물이 끄는 차량(제8716.80호) : 예식용 마차, 승마용 이륜마차(sulky), 썰매(sleigh), 동물 견인식 화물 카트 및 덤프 카트.\n(D) 이들의 전용 부분품(제8716.90호) : 섀시 프레임(사이드/크로스 멤버), 차축(axle), 트레일러 차체 및 부속품, 연결 장치(coupler), 제동 브레이크 부품 등.\n\n[차량과 장착 기계의 분류 기준]\n- 탱크나 적재함 등 단순 용기가 차량 섀시와 영구 결합한 것은 이 호에 분류한다.\n- 반면 크레인, 믹서, 펌프, 압축기 등 기계적 작동 성능이 주가 되는 장치가 무동력 섀시에 얹어진 경우, 차량이 아닌 탑재 기계의 호로 분류한다 (예: 제8413호의 이동식 펌프, 제8426호의 이동식 크레인, 제8474호의 콘크리트믹서 등).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 모터사이클/자전거 사이드카 (제8711호)\n(b) 봅슬레이, 터보건 등 스포츠용 썰매 (제9506호)\n(c) 바퀴 달린 이동식 플라스틱/금속 쓰레기통 (제3924호, 제7323호 등)\n(d) 보행 보조기 롤레이터 (제9021호)" ,
  "contentEn": "This heading covers non-mechanically propelled vehicles designed to be towed by other vehicles, or to be pushed/pulled by hand, foot, or animal power, as well as their parts.\n\nIt includes :\n- Caravan trailers for housing or camping (subheading 8716.10).\n- Self-loading or self-discharging agricultural trailers (subheading 8716.20).\n- Tanker trailers and semi-trailers (subheading 8716.31).\n- Freight-transport trailers (subheading 8716.39) including refrigerated trailers, low-boys, timber-carrying bogies, and road-rail trailers.\n- Passenger transport trailers and exhibition caravans (subheading 8716.40).\n- Hand- or foot-propelled vehicles (subheading 8716.80) like industrial trolleys, wheelbarrows, handcarts, rickshaws, and kicksleds.\n- Animal-drawn vehicles (wagons, ceremonial coaches, sulkies, sleighs) (subheading 8716.80).\n- Parts of the foregoing vehicles (subheading 8716.90) including chassis-frames, axles, trailer bodies, coupling devices, and brake parts.\n\nExcludes side-cars (heading 87.11), sports bobsleighs/toboggans (heading 95.06), rollators (heading 90.21), and mobile machines on towed chassis (e.g. concrete mixers of heading 84.74, mobile pumps of heading 84.13, or cranes of heading 84.26)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 87.16 to chapter_87.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
