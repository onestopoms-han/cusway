const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/PJH/onestop-ai-custom-service/src/data/explanatory_notes/chapter_90.json';

const newEntry = {
  "hsCode": "9010",
  "titleKo": "90.10 - 사진(영화용을 포함한다) 현상실용 기기(이 류에 따로 분류되지 않은 것으로 한정한다), 네가토스코프(negatoscope), 영사용 스크린",
  "titleEn": "90.10 - Apparatus and equipment for photographic (including cinematographic) laboratories, not specified or included elsewhere in this Chapter; negatoscopes; projection screens.",
  "contentKo": "이 호에는 아날로그 사진 및 영화 필름의 현상실용 가공 장비, 의료용 X선 판독용 라이트 박스(네가토스코프), 극장/강당용 스크린 및 이들의 전용 부분품을 분류한다.\n\n이 호에는 다음의 물품을 포함한다.\n- 자동 현상/노출기(제9010.10호) : 롤 필름/감광지 자동 현상기 및 현상된 필름을 인화지에 고속 자동 노출시키는 인화 기계.\n- 기타 현상실용 기기 및 네가토스코프(제9010.50호) :\n  - 특수 필름 현상 탱크, 인화용 트레이(플라스틱/스테인리스/에나멜 철판 등 전용 제품).\n  - 수세식 수조(탱크), 감광지 건조기, 드라이 마운팅 프레스.\n  - 인화용 진공 프레임(밀착 인화용), 사진실용 특수 필름/인화지 절단기, 리터칭 홀딩 프레임.\n  - 영화 제작용 특수 설비 : 영화 필름 자동 현상기/절단기/광학인화기/왁싱기, 필름 스플라이서(접합기 splicer), 사운드트랙 편집용 동기 테이블 및 녹화/사운드 판독용 필름 편집기, 자막 합성기, 길이 측정 카운터가 장착된 편집 데스크.\n  - 네가토스코프(negatoscopes) : 병원 등에서 X선/방사선 사진을 필름 배면 투광을 통해 판독하는 라이트 박스.\n  - 복제용 아황산가스/암모니아 기화식 특수 복사 현상 장치.\n- 영사용 스크린(projection screen)(제9010.60호) : 극장, 강당, 학교용 휴대용/삼각대식/천장식 영사용 스크린(은막, 글라스 비드 코팅 스크린 등 포함. 영사용으로 가장자리 마감 또는 아일릿 구멍 가공된 것에 한정).\n- 부분품과 부속품(제9010.90호) : 현상기 프레임, 마스킹 프레임, 필름 피더, 편집 데스크용 스풀 권취기 등.\n\n이 호에는 또한 다음의 것을 제외한다.\n(a) 촬영 현장용 조명 장치, 플러드 라이트, 조명 반사판 (제9405호)\n(b) 판지/유리제 단순 망판(인쇄 제판 스크린) (제3705호, 제9001호 또는 제9002호)\n(c) 일반 종이 절단기 (제8441호)\n(d) 반도체 포토레지스트 코터/디벨로퍼 현상 설비 (제8486호)\n(e) 음향 증폭 오디오 앰프 및 스피커 (제8518호)\n(f) 마이크로필름 수록 촬영 카메라 (제9006호)\n(g) 의학 X선 기계에 직접 장착되는 형광/증강 스크린 (제9022호)\n(h) 수동용 숫자 낙인 스탬프 (제9611호)\n(ij) 삼각대 및 지지 마운트 (제9620호)" ,
  "contentEn": "This heading covers laboratory equipment for developing, processing, printing, or editing photographic or cinematographic films/prints, negatoscopes (radiograph viewers), and movie projection screens.\n\nIt includes :\n- Automatic processors and printers (subheading 9010.10) for automatically developing roll films or paper, and printing pictures onto sensitised paper.\n- Other laboratory equipment and negatoscopes (subheading 9010.50) including developing tanks/trays, film dryers, print glazers, vacuum printing frames, dry-mounting presses, and movie laboratory machines (film splicers, optical printers, synchronous sound-film editors, footage counters, and subtitling devices).\n- Negatoscopes (light boxes used to examine X-ray/radiographic films).\n- Projection screens (subheading 9010.60) including portable roll-up screens, tripod screens, or ceiling-hung screens.\n- Parts and accessories (subheading 9010.90).\n\nExcludes studio lighting and reflectors (heading 94.05), halftone screens (heading 90.01 or 90.02), paper cutters (heading 84.41), track-guided semiconductor developers (heading 84.86), separate amplifiers/speakers (heading 85.18), microfilm recording cameras (heading 90.06), X-ray intensifying screens (heading 90.22), and camera tripods (heading 96.20)."
};

try {
  let fileContent = '[]';
  if (fs.existsSync(filePath)) {
    fileContent = fs.readFileSync(filePath, 'utf8');
  }
  const data = JSON.parse(fileContent);
  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log("✅ Successfully appended 90.10 to chapter_90.json!");
} catch (e) {
  console.error("❌ Error appending to file:", e.message);
}
