const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9021",
  "titleKo": "90.21 - 정형외과용 기기(목발ㆍ외과용 벨트와 탈장대를 포함한다), 골절 치료용 부목과 그 밖의 골절 치료구, 인공 인체 부분, 보청기, 결함ㆍ장애를 보정하기 위하여 착용하거나 휴대하거나 인체에 삽입하는 그 밖의 기기",
  "titleEn": "90.21 - Orthopaedic appliances, including crutches, surgical belts and trusses; splints and other fracture appliances; artificial parts of the body; hearing aids and other appliances which are worn or carried, or implanted in the body, to compensate for a defect or disability.",
  "contentKo": "이 호에는 신체 장애, 변형, 골절, 기관 기능 상실을 예방/교정/대체하기 위해 체외에 착용/휴대하거나 인체 내에 삽입(임플란트)하는 정형외과용 기구, 인조 뼈/관절/치아/장기, 보청기 및 심장박동기(페이스메이커) 등을 분류한다.\n\n이 호에는 다음의 것을 포함한다.\n- 정형외과용 또는 골절 치료용 기기(제9021.10호) :\n  - 정형외과용 기기(orthopaedic) : 탈장대(truss), 의료용 벨트/코르셋(특수 패드/스프링이 보강된 것), 둔부질환기구, 턱뼈용 기구, 정형외과용 특수 신발 및 안창(양발 한 켤레가 아닌 정형교정 목적의 한쪽 단독 제시품), 척추만곡 교정기구, 목발(crutch), 지지용 보행보조기(walker-rollator, 바퀴 및 프레임과 핸드브레이크/시트 결합식).\n  - 골절 치료구(fracture appliance) : 뼈의 고정/부동화를 위한 아연/금속/목제 부목(splint), 석고 붕대 부목, 침대용 부목 지지대.\n  - 인체 삽입용 금속 플레이트/플레이트 나사/못(접합 나사 및 핀)(주 제1호바목).\n- 의치와 치과용품(제9021.21~29호) :\n  - 의치(denture)(제9021.21호) : 자기/플라스틱/금속제 탈착식 틀니, 전치열 및 부분치열 의치.\n  - 기타 치과용품(제9021.29호) : 자기/아크릴 수지제 고정용 인공 치아, 유정도치(pivot teeth), 치관(crown), 금속제 치관(크라운), 의치 지지용 소켓/링/피벗/아일릿.\n- 그 밖의 인공 인체 부분(의지, 의안 등)(제9021.31~39호) :\n  - 인공관절(artificial joint)(제9021.31호) : 인공 엉덩이(고관절)/무릎 관절.\n  - 기타 인조 부분품(제9021.39호) : 의안(glass/plastic 인공 눈), 내안렌즈(intra-ocular lens), 인공 의지(팔, 다리, 발, 코, 귀 등), 혈관 및 심장 판막 대체용 합성 직물 튜브.\n- 보청기(hearing aid)(제9021.40호) : 난청 보정용 초소형 마이크로폰/리시버/증폭기 일체형 휴대/착용식 보청기(귀걸이형, 귓속형, 골도형 등. 단, 부분품과 부속품은 제외).\n- 심장박동기(pacemaker)(제9021.50호) : 심근을 전기 펄스로 자극하여 박동을 조율하는 가슴 피부 이식용 페이스메이커(단, 부분품과 부속품은 제외).\n- 기타 결함 보정용 기기(제9021.90호) : 전자식 인공성대(speech-aid), 시각장애인용 초음파 장애물 감지 전자 보조기, 인슐린 자동 펌프 등 체내 삽입형 약물 투여 펌프.\n- 부분품과 부속품 : 보청기 쉘, 심장박동기 전극 도선, 정형외과 기구용 조인트 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 정맥류 치료용 압박 스타킹 (제6115호)\n(b) 단순 보호용 플라스틱 패드 (제3926호) 및 거즈 부착 셀룰러 고무 패드 (제4014호)\n(c) 기형 교정용 목적이 아닌 임산부용 단순 지지 벨트 (제6212호 또는 제6307호)\n(d) 대량생산된 기성품 신발 아치용 안창(깔창) (제64류)\n(e) 이식용 천연 뼈/피부(보존 처리된 것) (제3001호) 및 골 시멘트 (제3006호)\n(f) 난청 보정용이 아닌 일반 통신/방송용 헤드폰 및 무선 이어폰 (제8518호)\n(g) 단순 시각장애인용 나무/금속제 지팡이 (제6602호)\n(h) 치과용 충전재(시멘트 아말감) (제3006호) 및 치과용 왁스/인상재 (제3407호)" ,
  "contentEn": "This heading covers orthopaedic appliances, fracture appliances, artificial parts of the body, hearing aids, pacemakers, and other devices worn, carried, or implanted to compensate for a defect or disability.\n\nIt includes :\n- Orthopaedic or fracture appliances (subheading 9021.10) including surgical trusses, belts/corsets with reinforcing pads, leg braces, orthopaedic shoes/soles (individual, custom-made), splints, plaster bandage splints, and bone plates/screws/nails for surgical implantation (per Note 1 (f)).\n- Artificial teeth and dental fittings (subheadings 9021.21 to 9021.29) including dentures (9021.21), solid/hollow artificial teeth, crowns, pivots, sockets, and rings (9021.29).\n- Other artificial parts of the body (subheadings 9021.31 to 9021.39) including artificial joints (hips, knees: 9021.31), artificial eyes (plastic/glass), intra-ocular lenses, artificial limbs (arms, legs, feet), and synthetic vascular/heart valve grafts.\n- Hearing aids (subheading 9021.40) for overcoming deafness (excluding separate parts/accessories).\n- Pacemakers (subheading 9021.50) for stimulating cardiac muscles (excluding separate parts/accessories).\n- Other defect-compensating devices (subheading 9021.90) including electronic speech-aids (artificial larynxes), ultrasonic guidance aids for the blind, and implanted drug-delivery pumps (e.g. insulin pumps).\n- Parts and accessories.\n\nExcludes varicose vein stockings (heading 61.15), general maternity support belts (heading 62.12 or 63.07), mass-produced arch-support insoles (Chapter 64), bone reconstruction cement (heading 30.06), communication headphones (heading 85.18), ordinary blind canes (heading 66.02), and dental cements (heading 30.06)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.21 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
