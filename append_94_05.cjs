const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_94.json';

const newEntry = {
  "hsCode": "9405",
  "titleKo": "94.05 - 조명기구[서치라이트(searchlight)ㆍ스포트라이트(spotlight)와 이들의 부분품을 포함하고, 따로 분류되지 않은 것으로 한정한다], 조명용 사인ㆍ조명용 네임플레이트(name-plate)와 이와 유사한 물품(광원이 고정되어 있는 것으로 한정한다), 이들의 부분품(따로 분류되지 않은 것으로 한정한다)",
  "titleEn": "94.05 - Luminaires and lighting fittings including searchlights and spotlights and parts thereof, not elsewhere specified or included; illuminated signs, illuminated name-plates and the like, having a permanently fixed light source, and parts thereof not elsewhere specified or included.",
  "contentKo": "이 호에는 다른 류에 지정되지 않은 모든 종류의 전기식/비전기식 조명기구(실내외등, 샹들리에, 가로등, 작업등, 서치라이트 등)와 전원이 고정(배선)된 조명용 광고 간판, 네임플레이트 및 이들의 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 샹들리에 및 천장용/벽부착용 조명(제9405.11~19호) : 가정/사무용 천장등, 다운라이트, 벽등(LED 전용 11호, 기타 19호).\n- 전기식 테이블/책상 조명스탠드(제9405.21~29호) : 제도용 스탠드, 침실 협탁등, 플로어 스탠드(LED 전용 21호, 기타 29호).\n- 크리스마스 트리용 조명 스트링(제9405.31~39호) : 파티/축제용 장식 꼬마전구 라인(LED 전용 31호, 기타 39호).\n- 기타 전기식 조명기구(제9405.41~49호) :\n  - 41호 : 광전(태양광 충전식) LED 가로등 및 정원등(LED 전용).\n  - 42호 : 일반 LED 조명기구(스포트라이트, 촬영용 램프, 암실등, 비행장용 표지등, 선박/보트용 랜턴, 서치라이트).\n  - 49호 : 비-LED 전기식 조명기구.\n- 비전기식 램프/조명(제9405.50호) : 촛대(candelabra), 오일/가스/아세틸렌 램프, 허리케인 랜턴, 광부용 카바이드 램프.\n- 조명용 사인/네임플레이트(제9405.61~69호) : 네온사인, 아크릴 조명 간판, 영구 고정식 라이트박스(LED 전용 61호, 기타 69호).\n- 조명용 부분품(제9405.91~99호) :\n  - 91호(유리제) / 92호(플라스틱제) / 99호(기타-금속 등) : 샹들리에용 크리스탈 볼/드롭, 램프 유리 글로브(구), 반사경(reflector), 확산기(diffuser), 프레임/서스펜션 지지대, 램프 전용 가드/갓(shade).\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 자전거 및 자동차/바이크용 전용 전기식 헤드라이트/지시등 및 경음기 (제8512호)\n(b) 필라멘트 전구, 방전관, 형광등 튜브, 단독 제시되는 발광다이오드(LED) 전구/모듈 (제8539호)\n(c) 단독 제시되는 조명 배선용 스위치, 스타터(기동기), 안정기(ballast), 플러그 (제85류)\n(d) 사진 촬영용 플래시/섬광기구 (제9006호) 및 의료용 검진 램프, 치과용 조명등 (제9018호)\n(e) 광원이 고정되어 있지 않은 단순 목재/금속제 문자판 및 간판 (제3926호, 제7326호 또는 제8310호)\n(f) 실에 꿴 유리 구슬 장식 램프 커튼 (제7018호)\n(g) 단순 양초 (제3406호) 및 수지 횃불 (제3606호)" ,
  "contentEn": "This heading covers luminaires and lighting fittings not specified elsewhere, illuminated signs, and their parts, of any material (except precious metals of Chapter 71).\n\nIt includes :\n- Chandeliers and ceiling/wall fittings (subheadings 9405.11 to 9405.19), subdivided by LED (11) and others (19).\n- Table, desk, bedside, or floor-standing lamps (subheadings 9405.21 to 9405.29) by LED (21) and others (29).\n- Christmas tree lighting strings (subheadings 9405.31 to 9405.39).\n- Other electrical luminaires (subheadings 9405.41 to 9405.49) including solar-powered LED (41), other LED (42), and non-LED (49) fixtures (searchlights, spotlights, studio lamps).\n- Non-electrical lamps (subheading 9405.50) including candelabras and oil/gas lamps.\n- Illuminated signs and name-plates (subheadings 9405.61 to 9405.69) with fixed light sources.\n- Parts of luminaires (subheadings 9405.91 to 9405.99) made of glass (91), plastics (92), or other materials (99) including globes, diffusers, shades, and chandelier crystals.\n\nExcludes vehicle lighting (heading 85.12), light bulbs and LED modules (heading 85.39), switches/ballasts (Chapter 85), photography flashes (heading 90.06), and medical examination lamps (heading 90.18)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 94.05 to chapter_94.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
