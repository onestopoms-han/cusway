const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9013",
  "titleKo": "90.13 - 레이저기기[레이저 다이오드(laser diode)는 제외한다], 그 밖의 광학기기(이 류에 따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "90.13 - Lasers, other than laser diodes; other optical appliances and instruments, not specified or included elsewhere in this Chapter.",
  "contentKo": "이 호에는 레이저 다이오드를 제외한 단독형 레이저기기(레이저 헤드, 레이저 포인터 등) 및 90류 내 다른 호에 속하지 않는 기타 독립형 광학 기기(망원조준경, 잠망경, 확대경 등)와 이들의 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 무기용 조준기 및 잠망경 등(제9013.10호) :\n  - 무기(화기)용 망원 조준경 및 굴절/반사식 조준기 (단, 무기에 이미 부착되어 제시되는 것은 제93류 무기와 함께 분류).\n  - 잠수함, 전차용 확대식 잠망경 및 참호용 비확대식 잠망경.\n  - 수준기, 세오돌라이트 등 90류 또는 16부 기계에 부분품으로 장착되도록 고안된 망원경(주 제4호).\n- 레이저기기(제9013.20호) : 레이저 발진 매체, 펌핑 전원, 공진용 반사경(레이저 헤드) 및 냉각/제어 시스템이 결합된 가스/액체/고체 레이저기기 및 레이저 시스템(단독 제시 시에 한함. 교육/연구/포인터용).\n- 그 밖의 기기(액정디바이스 및 기타 광학 기기)(제9013.80호) :\n  - 액정디바이스(LCD)(다른 호에 구체적으로 열거되지 않은 것).\n  - 수지식 돋보기(확대경)(조명장치 부착형 포함) 및 섬유 직물 검사용 검사경(thread counter).\n  - 문 관측용 \"도어 아이(door-eye)\" 및 광학식 스루도어 뷰어.\n  - 산업용 파이버스코프(fibrescope)(의료용 제외).\n  - 입체경(stereoscope) 및 만화경(kaleidoscope)(완구용 제외).\n  - 광학적으로 연마 가공된 거울 중 기기 부착형이 아닌 단독 검사용 거울(배수관/굴뚝 검사용 거울 등).\n  - 광학식 라이트 빔 신호기(모스부호 등 장거리 신호 전송용).\n  - 슬라이드 뷰어(단일 확대렌즈를 갖춘 간이식 검사용).\n- 부분품과 부속품(제9013.90호) : 레이저관(laser tube), 하우징, 거치 구조물 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 반도체식 레이저 다이오드 (제8541호)\n(b) 레이저 가공용 금속 절단 공작기계 (제8456호) 및 레이저 용접기 (제8515호)\n(c) 레이저식 측량용 얼라인먼트 수준기 (제9015호)\n(d) 의료 수술용 레이저 치료기기 (제9018호)\n(e) 광학 가공되지 않은 유리 거울(백미러 포함) (제7009호) 및 비금속제 단순 거울 (제8306호)\n(f) 광학식 측정/검사용 기기(윤곽 투영기 등) (제9031호 - 주 제5호에 의함)\n(g) 현미경(제9011호) 및 완구용 만화경 (제95류)" ,
  "contentEn": "This heading covers lasers (other than laser diodes) and miscellaneous optical appliances and instruments not specified elsewhere in Chapter 90.\n\nIt includes :\n- Weapon sights and periscopes (subheading 9013.10) including telescopic sights for firearms, submarine/tank periscopes, and telescopes designed as parts for other measuring instruments (per Chapter Note 4).\n- Lasers (subheading 9013.20) including gas, liquid, or solid-state laser heads and systems (e.g. laser pointers) presented separately.\n- Other devices (subheading 9013.80) including Liquid Crystal Devices (LCDs) not constituting articles of other headings, hand magnifying glasses, thread counters, door-eyes, industrial fibrescopes, stereoscopes (non-toy), optical signaling lamps, and simple slide viewers.\n- Parts and accessories (subheading 9013.90) such as laser tubes.\n\nExcludes laser diodes (heading 85.41), laser machine tools for cutting/welding (heading 84.56 or 85.15), laser levels for surveying (heading 90.15), medical lasers (heading 90.18), non-optically worked mirrors (heading 70.09 or 83.06), profile projectors (heading 90.31 per Note 5), and toy kaleidoscopes (Chapter 95)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.13 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
