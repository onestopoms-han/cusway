const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9019",
  "titleKo": "90.19 - 기계요법용 기기, 마사지용 기기, 심리학적 적성검사용 기기, 오존 흡입기ㆍ산소 흡입기ㆍ에어로졸 치료기ㆍ인공 호흡기나 그 밖의 치료용 호흡기기",
  "titleEn": "90.19 - Mechano-therapy appliances; massage apparatus; psychological aptitude-testing apparatus; ozone therapy, oxygen therapy, aerosol therapy, artificial respiration or other therapeutic respiration apparatus.",
  "contentKo": "이 호에는 기계식 정형 지체 운동기(기계요법), 진동/수온 마사지 장치, 인체/정신 반응 검사기(적성검사), 그리고 호흡기 질환 치료용 가스 흡입 및 기계식 인공호흡기(철의 폐 등)를 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 기계요법, 마사지, 적성검사용 기기(제9019.10호) :\n  - 기계요법용 기기(mechano-therapy) : 관절/근육의 장애 치료를 위해 스프링, 도르래, 레버 등을 장착한 수동/동력식 운동 치료 장치(손목 회전, 손가락 기능 회복, 무릎/허리 굴절 장치, 보행 보조 차륜 프레임, 심근 강화용 바퀴 없는 고정 사이클 등. 일반 헬스장용 체육 기구는 제외).\n  - 마사지용 기기(massage apparatus) : 복부/등/얼굴/손 진동 마사지기(전기 진동식 브러시/스펀지 헤드 포함), 수중 안마 욕조(스파 욕조 spa bath - 터빈/송풍기 일체형), 욕창 방지용 표면 마사지 펌프식 에어 매트리스.\n  - 심리학적 적성검사용 기기 : 비행사/운전사 등의 반사 속도, 손의 협조성 반응 검사기, 적성검사용 회전의자(속도 급변형).\n- 오존/산소/에어로졸 흡입기 및 인공호흡기(제9019.20호) :\n  - 오존 흡입기 : 호흡기 질환 치료용 오존(O3) 발생 및 흡입 기기.\n  - 산소 흡입기(oxygen therapy) : 산소 마스크, 산소 공급 텐트(산소실).\n  - 인공 호흡기 및 치료용 호흡기기 : 인공 호흡 장치, 철의 폐(iron lung, 음압 가슴 챔버 및 기밀관, 에어 송풍기 결합 설비).\n  - 에어로졸 치료기 : 호르몬/비타민/항생제 약액을 미립 연무 상태로 흡입시키는 분무기(nebulizer), 병원용 전동 압축 에어로졸 발생기, 치주염 치료용 압축가스식 잇몸 분무 핸드스프레이.\n- 부분품과 부속품(제9019.90호) : 산소 흡입용 캐노피 텐트 및 전용 파이프 피팅, 마사지기용 전용 부속 헤드 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 단순 가정용/헬스클럽용 노젓기 로잉 머신, 고정식 운동 일륜차 및 확장 확장기 (제9506호)\n(b) 고정식 계단, 사다리, 평행봉 등 기계 장치가 없는 정형 갱생용 시설물 (재질에 따라 분류)\n(c) 일반 오락 게임용 및 단순 반응 장난감 (제95류)\n(d) 고압 산소실(hyperbaric chamber, 감압실 포함) (제9018호)\n(e) 수술대, 검사대, 단순 마사지 베드 및 치과용 의자 (제9402호)\n(f) 일반 안면 마스크, 가스마스크(여과식) (제9020호)\n(g) 약액 분무용 분무식 치아 세정기 (제9018호)" ,
  "contentEn": "This heading covers mechano-therapy appliances, massage apparatus, psychological aptitude-testing apparatus, and therapeutic respiration equipment (ozone, oxygen, aerosol therapy, and artificial respiration, including \"iron lungs\").\n\nIt includes :\n- Mechano-therapy, massage, and aptitude-testing apparatus (subheading 9019.10) including wrist/finger/knee passive movement rehabilitation devices, vibrating or water-massage appliances (spa baths with pumps/blowers), pressure-alternating anti-bedsore mattresses, and reflex-testing devices for pilots.\n- Respiration therapy apparatus (subheading 9019.20) including ozone inhalers, oxygen tents and masks, artificial respiration machines (mechanical chest-compressors), \"iron lungs\" (pressure chambers with bellows), and nebulizers/aerosol generators for administrating medication.\n- Parts and accessories (subheading 9019.90) including oxygen tents.\n\nExcludes gymnasium or home physical exercise equipment (rowing machines, stationary cycles) (heading 95.06), non-mechanical bars or ladders (classified by constituent material), hyperbaric chambers (heading 90.18), medical/surgical tables and massage beds (heading 94.02), gas masks of heading 90.20, and dental water-sprayers (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.19 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
